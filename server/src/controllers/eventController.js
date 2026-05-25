const Event = require("../models/Event");
const Participation = require("../models/Participation");
const User = require("../models/User");
const { ALLOWED_CITIES } = require("../constants/cities");
const { createAuditLog } = require("../utils/audit");

// Verifica se usuario comum ainda pode criar seu unico evento ativo.
async function canCreateEvent(user) {
  if (user.role === "admin" || user.role === "organization" || user.role === "organizer") {
    return true;
  }

  const activeEvent = await Event.findOne({
    creator: user._id,
    status: "active",
  });

  return !activeEvent;
}

// Atualiza elegibilidade para virar organizacao quando um evento chega a 5 filiadas.
async function updateOrganizationEligibility(event) {
  const confirmedCount = await Participation.countDocuments({
    event: event._id,
    status: "confirmed",
  });

  if (confirmedCount < 5) {
    return;
  }

  await User.findOneAndUpdate(
    {
      _id: event.creator,
      role: "user",
      organizationStatus: { $in: ["none", "rejected"] },
    },
    { organizationStatus: "eligible" }
  );
}

// Cria evento respeitando admin/organizacao ilimitado e usuario comum com 1 evento ativo.
exports.createEvent = async (req, res) => {
  try {
    if (!req.body.title || !req.body.description || !req.body.category || !req.body.location) {
      return res.status(400).json({ message: "Preencha titulo, descricao, categoria e local" });
    }

    if (!ALLOWED_CITIES.includes(req.body.location)) {
      return res.status(400).json({ message: "Selecione uma cidade valida" });
    }

    if (!req.body.startDate && !req.body.date) {
      return res.status(400).json({ message: "Informe a data de inicio do evento" });
    }

    const images = Array.isArray(req.body.images)
      ? req.body.images.filter((image) => String(image || "").trim())
      : [];

    if (images.length < 4) {
      return res.status(400).json({ message: "Adicione pelo menos 4 fotos do evento" });
    }

    const allowed = await canCreateEvent(req.user);

    if (!allowed) {
      return res.status(403).json({
        message: "Usuarios comuns podem criar apenas 1 evento ativo por vez",
      });
    }

    const event = await Event.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      location: req.body.location,
      date: req.body.date || req.body.startDate,
      startDate: req.body.startDate || req.body.date,
      endDate: req.body.endDate || null,
      organizer: req.body.organizer || req.user.organizationName || req.user.name,
      goal: req.body.goal || "",
      goalType: req.body.goalType || "",
      goalTotal: Number(req.body.goalTotal) || 0,
      goalCurrent: Number(req.body.goalCurrent) || 0,
      goalUnit: req.body.goalUnit || "",
      volunteers: Number(req.body.volunteers) || 0,
      volunteerProfile: req.body.volunteerProfile || "",
      email: req.body.email || "",
      phone: req.body.phone || "",
      whatsapp: req.body.whatsapp || "",
      images,
      image: req.body.image || images[0] || "",
      creator: req.user._id,
    });

    await createAuditLog({
      action: "EVENT_CREATED",
      actor: req.user._id,
      targetModel: "Event",
      targetId: event._id,
      req,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar evento", error: error.message });
  }
};

// Lista eventos ativos com criador e total de participantes.
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "active" })
      .populate("creator", "name email role organizationName")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar eventos", error: error.message });
  }
};

// Busca detalhes do evento, incluindo participantes e voluntarios.
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("creator", "name email role organizationName")
      .populate("participants", "name email");

    if (!event) {
      return res.status(404).json({ message: "Evento nao encontrado" });
    }

    const participations = await Participation.find({
      event: event._id,
      status: "confirmed",
    }).populate("user", "name email role");

    const eventResponse = event.toObject();
    eventResponse.participations = participations;

    res.json(eventResponse);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar evento", error: error.message });
  }
};

// Lista eventos criados pelo usuario autenticado.
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ creator: req.user._id }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar seus eventos", error: error.message });
  }
};

// Lista eventos em que o usuario autenticado esta participando ou voluntariando.
exports.getMyParticipatingEvents = async (req, res) => {
  try {
    const participations = await Participation.find({
      user: req.user._id,
      status: "confirmed",
    })
      .populate({
        path: "event",
        populate: { path: "creator", select: "name email role organizationName" },
      })
      .sort({ createdAt: -1 });

    const events = participations
      .map((participation) => {
        if (!participation.event) {
          return null;
        }

        const event = participation.event.toObject();
        event.myParticipation = {
          kind: participation.kind,
          status: participation.status,
          createdAt: participation.createdAt,
        };

        return event;
      })
      .filter(Boolean);

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar eventos participando", error: error.message });
  }
};

// Atualiza campos editaveis de um evento do proprio criador ou admin.
exports.updateEvent = async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "description",
      "category",
      "location",
      "date",
      "startDate",
      "endDate",
      "organizer",
      "goal",
      "goalType",
      "goalTotal",
      "goalCurrent",
      "goalUnit",
      "volunteers",
      "volunteerProfile",
      "email",
      "phone",
      "whatsapp",
      "images",
      "image",
      "status",
    ];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.location && !ALLOWED_CITIES.includes(updates.location)) {
      return res.status(400).json({ message: "Selecione uma cidade valida" });
    }

    if (updates.images !== undefined) {
      updates.images = Array.isArray(updates.images)
        ? updates.images.filter((image) => String(image || "").trim())
        : [];

      if (updates.images.length < 4) {
        return res.status(400).json({ message: "Adicione pelo menos 4 fotos do evento" });
      }

      updates.image = updates.image || updates.images[0] || "";
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    await createAuditLog({
      action: "EVENT_UPDATED",
      actor: req.user._id,
      targetModel: "Event",
      targetId: event._id,
      metadata: updates,
      req,
    });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar evento", error: error.message });
  }
};

// Remove evento e suas participacoes vinculadas.
exports.deleteEvent = async (req, res) => {
  try {
    await Participation.deleteMany({ event: req.event._id });
    await req.event.deleteOne();

    await createAuditLog({
      action: "EVENT_DELETED",
      actor: req.user._id,
      targetModel: "Event",
      targetId: req.event._id,
      req,
    });

    res.json({ message: "Evento removido" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover evento", error: error.message });
  }
};

// Registra participacao ou voluntariado em um evento.
exports.participateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || event.status !== "active") {
      return res.status(404).json({ message: "Evento nao encontrado ou inativo" });
    }

    if (event.creator.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Criador nao precisa participar do proprio evento" });
    }

    const kind = req.body.kind === "volunteer" ? "volunteer" : "participant";
    const participation = await Participation.create({
      event: event._id,
      user: req.user._id,
      kind,
    });

    if (!event.participants.some((id) => id.toString() === req.user._id.toString())) {
      event.participants.push(req.user._id);
      await event.save();
    }

    await User.findByIdAndUpdate(event.creator, {
      $addToSet: { affiliates: { user: req.user._id } },
    });
    await updateOrganizationEligibility(event);

    await createAuditLog({
      action: "EVENT_PARTICIPATION_CREATED",
      actor: req.user._id,
      targetModel: "Event",
      targetId: event._id,
      metadata: { kind },
      req,
    });

    res.status(201).json({
      message: "Participacao confirmada",
      participation,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Voce ja esta participando deste evento" });
    }

    res.status(500).json({ message: "Erro ao participar do evento", error: error.message });
  }
};

// Lista voluntarios de um evento para admin, organizacao ou criador.
exports.getEventVolunteers = async (req, res) => {
  try {
    const volunteers = await Participation.find({
      event: req.event._id,
      kind: "volunteer",
      status: "confirmed",
    }).populate("user", "name email role");

    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar voluntarios", error: error.message });
  }
};
