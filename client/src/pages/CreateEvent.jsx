import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaUser,
  FaBullseye,
  FaUsers,
  FaChartLine
} from "react-icons/fa";

import { MdEmail, MdDescription } from "react-icons/md";

import api from "../services/api";

const CITIES = [
  "Campina Grande",
  "Joao Pessoa",
  "Patos",
  "Sousa",
  "Cajazeiras",
  "Guarabira",
  "Santa Rita",
  "Bayeux",
  "Cabedelo",
  "Queimadas",
  "Esperanca",
  "Lagoa Seca",
];

const emptyImages = ["", "", "", ""];

function CreateEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    organizer: "",
    startDate: "",
    endDate: "",
    goal: "",
    goalType: "",
    goalTotal: "",
    goalCurrent: "",
    goalUnit: "",
    volunteers: "",
    volunteerProfile: "",
    email: "",
    phone: "",
    whatsapp: "",
    images: emptyImages,
  });

  useEffect(() => {
    if (isEdit) {
      async function loadEvent() {
        try {
          const res = await api.get(`/events/${id}`);
          const data = res.data;

          setForm({
            title: data.title || "",
            description: data.description || "",
            category: data.category || "",
            location: data.location || "",
            organizer: data.organizer || "",
            startDate: data.startDate?.slice(0, 10) || "",
            endDate: data.endDate?.slice(0, 10) || "",
            goal: data.goal || "",
            goalType: data.goalType || "",
            goalTotal: data.goalTotal || "",
            goalCurrent: data.goalCurrent || "",
            goalUnit: data.goalUnit || "",
            volunteers: data.volunteers || "",
            volunteerProfile: data.volunteerProfile || "",
            email: data.email || "",
            phone: data.phone || "",
            whatsapp: data.whatsapp || "",
            images: [...(data.images || []), ...emptyImages].slice(0, 4),
          });
        } catch (error) {
          console.error("Erro ao carregar evento", error);
        }
      }

      loadEvent();
    }
  }, [id, isEdit]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageChange(index, value) {
    const images = [...form.images];
    images[index] = value;
    setForm({ ...form, images });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Você precisa estar logado");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const images = form.images
        .map((image) => image.trim())
        .filter(Boolean);

      if (images.length < 4) {
        alert("Adicione pelo menos 4 fotos do evento");
        return;
      }

      const payload = {
        ...form,
        images,
        image: images[0],
        goalTotal: Number(form.goalTotal) || 0,
        goalCurrent: Number(form.goalCurrent) || 0,
        volunteers: Number(form.volunteers) || 0,
      };

      if (isEdit) {
        await api.put(`/events/${id}`, payload, config);
      } else {
        await api.post("/events", payload, config);
      }

      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Erro ao salvar evento";

      console.error("Erro ao salvar evento:", error.response?.data || error);
      alert(message);
    }
  }

  const iconPrimary = "text-pink-600";
  const iconSecondary = "text-blue-500";

  return (
    <>
      <Header />
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <FaArrowLeft className="cursor-pointer" onClick={() => navigate("/")} />

          <div>
            <h1 className="text-2xl font-bold">
              {isEdit ? "Editar Evento" : "Cadastrar Novo Evento"}
            </h1>
            <p className="text-gray-500 text-sm">
              Preencha os dados para criar um evento comunitário
            </p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* INFORMAÇÕES BÁSICAS */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold">Informações Básicas</h2>
            <p className="text-sm text-gray-500 mb-4">
              Dados principais do evento (campos obrigatórios *)
            </p>

            <div className="space-y-4">

              <div>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <FaTag className={iconPrimary} /> Nome do Evento *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <FaTag className={iconPrimary} /> Categoria *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
                >
                  <option value="">Selecione</option>
                  <option>Doação</option>
                  <option>Ajuda Humanitária</option>
                  <option>Evento Regional</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm">
                    <FaCalendarAlt className={iconPrimary} /> Data de Início *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm">
                    <FaCalendarAlt className={iconPrimary} /> Data de Término
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm">
                  <FaMapMarkerAlt className={iconPrimary} /> Local *
                </label>
                <select
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
                >
                  <option value="">Selecione uma cidade</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm">
                  <FaUser className={iconPrimary} /> Organizador
                </label>
                <input
                  name="organizer"
                  value={form.organizer}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
                />
              </div>

            </div>
          </div>

          {/* DESCRIÇÃO */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="flex items-center gap-2 font-semibold mb-3">
              <MdDescription className={iconPrimary} /> Descrição *
            </h2>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 bg-gray-100 rounded-lg"
            />
          </div>

          {/* OBJETIVO */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold flex items-center gap-2">
              <FaBullseye className="text-pink-600" /> Objetivo e Meta
            </h2>

            <textarea
              name="goal"
              value={form.goal}
              onChange={handleChange}
              className="w-full mt-3 p-3 bg-gray-100 rounded-lg"
            />

            <select
              name="goalType"
              value={form.goalType}
              onChange={handleChange}
              className="w-full mt-3 p-3 bg-gray-100 rounded-lg"
            >
              <option value="">Tipo de meta</option>
              <option>Arrecadação</option>
              <option>Pessoas</option>
              <option>Itens</option>
            </select>

            <div className="grid md:grid-cols-3 gap-4 mt-3">
              <input name="goalTotal" value={form.goalTotal} onChange={handleChange} placeholder="Meta total" className="p-3 bg-gray-100 rounded-lg"/>
              <input name="goalCurrent" value={form.goalCurrent} onChange={handleChange} placeholder="Progresso atual" className="p-3 bg-gray-100 rounded-lg"/>
              <input name="goalUnit" value={form.goalUnit} onChange={handleChange} placeholder="Unidade" className="p-3 bg-gray-100 rounded-lg"/>
            </div>
          </div>

          {/* VOLUNTÁRIOS */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold flex items-center gap-2">
              <FaUsers className="text-green-600" /> Voluntários
            </h2>

            <input name="volunteers" value={form.volunteers} onChange={handleChange} className="w-full mt-3 p-3 bg-gray-100 rounded-lg"/>

            <textarea name="volunteerProfile" value={form.volunteerProfile} onChange={handleChange} className="w-full mt-3 p-3 bg-gray-100 rounded-lg"/>
          </div>

          {/* FOTOS */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold">Fotos do Evento *</h2>
            <p className="text-sm text-gray-500 mb-4">
              Adicione 4 links de fotos para aparecerem nos detalhes do evento.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {form.images.map((image, index) => (
                <div key={index}>
                  <label className="text-sm font-medium">
                    Foto {index + 1} *
                  </label>
                  <input
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://exemplo.com/foto.jpg"
                    className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CONTATO */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold">Contato</h2>

            <input name="email" value={form.email} onChange={handleChange} className="w-full mt-3 p-3 bg-gray-100 rounded-lg"/>
            <input name="phone" value={form.phone} onChange={handleChange} className="w-full mt-3 p-3 bg-gray-100 rounded-lg"/>
            <input name="whatsapp" value={form.whatsapp} onChange={handleChange} className="w-full mt-3 p-3 bg-gray-100 rounded-lg"/>
          </div>

          {/* BOTÕES */}
          <div className="flex gap-4">
            <button className="flex-1 bg-pink-600 text-white py-3 rounded-lg">
              {isEdit ? "Salvar Alterações" : "Cadastrar Evento"}
            </button>

            <button type="button" onClick={() => navigate("/")} className="flex-1 bg-gray-200 py-3 rounded-lg">
              Cancelar
            </button>
          </div>

          {/* DICAS */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-sm">
            <h3 className="font-semibold mb-2">💡 Dicas para um bom evento</h3>
            <ul className="list-disc ml-5 text-gray-600 space-y-1">
              <li>Seja claro e específico</li>
              <li>Informe horários</li>
              <li>Forneça contatos</li>
              <li>Defina metas realistas</li>
              <li>Descreva os voluntários</li>
            </ul>
          </div>

        </form>
      </section>
    </>
  );
}

export default CreateEvent;
