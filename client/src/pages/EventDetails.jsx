import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";

function getId(value) {
  if (!value) return "";
  return value._id || value.id || value;
}

function userIsInEvent(event, user) {
  if (!event || !user) return false;

  const inParticipants = event.participants?.some(
    (participant) => getId(participant) === user.id
  );

  const inParticipations = event.participations?.some(
    (participation) => getId(participation.user) === user.id
  );

  return Boolean(inParticipants || inParticipations);
}

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isParticipating, setIsParticipating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const creatorId = getId(event?.creator);
  const isCreator = Boolean(user && creatorId && user.id === creatorId);
  const canEdit = Boolean(user && event && (user.role === "admin" || isCreator));

  async function loadEvent() {
    const response = await api.get(`/events/${id}`);
    const data = response.data;

    setEvent(data);
    setIsParticipating(userIsInEvent(data, user));
  }

  useEffect(() => {
    async function fetchEvent() {
      try {
        await loadEvent();
      } catch (error) {
        console.error("Erro ao buscar evento", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id, user]);

  async function handleDelete() {
    const confirmDelete = window.confirm("Deseja deletar este evento?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/events/${id}`);
      alert("Evento deletado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Erro ao deletar evento");
    }
  }

  async function handleParticipate() {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isCreator) {
      alert("Voce criou este evento.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post(`/events/${id}/participate`);
      await loadEvent();
      alert("Voce esta participando do evento!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Erro ao participar");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="p-8">Carregando...</p>;
  if (!event) return <p className="p-8">Evento nao encontrado</p>;

  const percent = event.goalTotal
    ? Math.min((event.goalCurrent / event.goalTotal) * 100, 100)
    : 0;

  const buttonDisabled = isParticipating || submitting || isCreator;
  const buttonText = isCreator
    ? "Voce criou este evento"
    : isParticipating
      ? "Voce ja esta participando"
      : submitting
        ? "Confirmando..."
        : "Participar do Evento";

  return (
    <>
      <Header />
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-8 text-sm">
        <div className="flex items-center gap-3 mb-6">
          <FaArrowLeft className="cursor-pointer" onClick={() => navigate("/")} />

          <h1 className="text-2xl font-bold text-pink-600">{event.title}</h1>

          <span className="ml-auto bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs">
            {event.category || "Categoria"}
          </span>
        </div>

        {canEdit && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => navigate(`/editar-evento/${id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Editar Evento
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Deletar Evento
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-pink-600" />
                Informacoes do Evento
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Data de Inicio</p>
                  <p>{event.startDate || event.date || "Nao informado"}</p>
                </div>

                <div>
                  <p className="text-gray-500">Data de Termino</p>
                  <p>{event.endDate || "Nao informado"}</p>
                </div>
              </div>

              <hr className="my-4" />

              <p className="text-gray-500 flex items-center gap-2">
                <FaMapMarkerAlt className="text-pink-600" />
                Local
              </p>
              <p>{event.location || "Nao informado"}</p>

              <hr className="my-4" />

              <p className="text-gray-500 flex items-center gap-2">
                <FaUser className="text-pink-600" />
                Organizador
              </p>
              <p>{event.organizer || event.creator?.name || "Nao informado"}</p>

              <hr className="my-4" />

              <p className="text-gray-500">Descricao</p>
              <p>{event.description || "Sem descricao disponivel"}</p>
            </div>

            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold mb-4 text-pink-600">Objetivo e Meta</h2>

              <p className="mb-4 text-gray-700">
                {event.goal || "Nenhum objetivo definido"}
              </p>

              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div
                  className="bg-black h-3 rounded-full"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex justify-between text-xs mt-2 text-gray-500">
                <span>
                  {event.goalCurrent || 0} / {event.goalTotal || 0}
                </span>
                <span>{Math.round(percent)}%</span>
              </div>
            </div>

            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold mb-4 text-orange-500">
                Fotos do Evento
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {(event.images?.length ? event.images : [
                  "https://via.placeholder.com/300",
                  "https://via.placeholder.com/300",
                  "https://via.placeholder.com/300",
                  "https://via.placeholder.com/300",
                ]).map((img, index) => (
                  <img
                    key={`${img}-${index}`}
                    src={img}
                    alt="evento"
                    className="h-44 w-full object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold mb-4 text-pink-600">Contato</h2>

              <div className="space-y-3">
                <input value={event.email || ""} disabled className="w-full p-2 bg-gray-100 rounded-lg" placeholder="Email" />
                <input value={event.phone || ""} disabled className="w-full p-2 bg-gray-100 rounded-lg" placeholder="Telefone" />
                <input value={event.whatsapp || ""} disabled className="w-full p-2 bg-gray-100 rounded-lg" placeholder="WhatsApp" />
              </div>
            </div>

            <button
              onClick={handleParticipate}
              disabled={buttonDisabled}
              className={`w-full mt-4 py-3 rounded-lg text-white ${
                buttonDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-pink-600 hover:bg-pink-700"
              }`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default EventDetails;
