import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaUsers,
} from "react-icons/fa";

import { MdEmail } from "react-icons/md";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Erro ao buscar evento", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  if (loading) return <p className="p-8">Carregando...</p>;
  if (!event) return <p className="p-8">Evento não encontrado</p>;

  const percent = event.goalTotal
    ? (event.goalCurrent / event.goalTotal) * 100
    : 0;

  return (
    <>
      <Header />
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-8 text-sm">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <FaArrowLeft
            className="cursor-pointer"
            onClick={() => navigate("/")}
          />

          <h1 className="text-2xl font-bold text-pink-600">
            {event.title}
          </h1>

          <span className="ml-auto bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs">
            {event.category || "Categoria"}
          </span>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ESQUERDA */}
          <div className="lg:col-span-2 space-y-6">

            {/* INFORMAÇÕES */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-pink-600" />
                Informações do Evento
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Data de Início</p>
                  <p>{event.startDate || event.date || "Não informado"}</p>
                </div>

                <div>
                  <p className="text-gray-500">Data de Término</p>
                  <p>{event.endDate || "Não informado"}</p>
                </div>
              </div>

              <hr className="my-4" />

              <p className="text-gray-500 flex items-center gap-2">
                <FaMapMarkerAlt className="text-pink-600" />
                Local
              </p>
              <p>{event.location || "Não informado"}</p>

              <hr className="my-4" />

              <p className="text-gray-500 flex items-center gap-2">
                <FaUser className="text-pink-600" />
                Organizador
              </p>
              <p>{event.organizer || "Não informado"}</p>

              <hr className="my-4" />

              <p className="text-gray-500">Descrição</p>
              <p>{event.description || "Sem descrição disponível"}</p>
            </div>

            {/* OBJETIVO */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold mb-4 text-pink-600">
                Objetivo e Meta
              </h2>

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

            {/* FOTOS */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold mb-4 text-orange-500">
                Fotos do Evento
              </h2>

              <div className="grid grid-cols-3 gap-4">
                {(event.images?.length ? event.images : [
                  "https://via.placeholder.com/300",
                  "https://via.placeholder.com/300",
                  "https://via.placeholder.com/300",
                ]).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="evento"
                    className="h-40 w-full object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* COMENTÁRIOS */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold mb-4">
                Comentários dos Participantes
              </h2>

              <div className="space-y-4 mb-6">
                {(event.comments || []).map((c, i) => (
                  <div key={i} className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <strong>{c.name}</strong>
                      <span>{c.date}</span>
                    </div>
                    <p>{c.text}</p>
                  </div>
                ))}
              </div>

              <input
                placeholder="Seu nome"
                className="w-full mb-2 p-3 bg-gray-100 rounded-lg"
              />

              <textarea
                placeholder="Compartilhe suas experiências..."
                className="w-full mb-2 p-3 bg-gray-100 rounded-lg"
              />

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
                Publicar Comentário
              </button>
            </div>

          </div>

          {/* DIREITA */}
          <div className="space-y-6">

            {/* CONTATO */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold mb-4 text-pink-600">
                Contato
              </h2>

              <div className="space-y-3">

                <div>
                  <label className="text-gray-500 text-xs">E-mail</label>
                  <input
                    value={event.email || ""}
                    disabled
                    className="w-full p-2 bg-gray-100 rounded-lg"
                    placeholder="contato@exemplo.com"
                  />
                </div>

                <div>
                  <label className="text-gray-500 text-xs">Telefone</label>
                  <input
                    value={event.phone || ""}
                    disabled
                    className="w-full p-2 bg-gray-100 rounded-lg"
                    placeholder="(00) 0000-0000"
                  />
                </div>

                <div>
                  <label className="text-gray-500 text-xs">WhatsApp</label>
                  <input
                    value={event.whatsapp || ""}
                    disabled
                    className="w-full p-2 bg-gray-100 rounded-lg"
                    placeholder="(00) 00000-0000"
                  />
                </div>

              </div>
            </div>

            {/* VOLUNTÁRIOS */}
            <div className="bg-green-50 border rounded-xl p-6">

              <h2 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <FaUsers /> Voluntários
              </h2>

              <p className="text-green-600 font-medium mb-3">
                {event.volunteers ?? 0} vaga(s) disponível(is)
              </p>

              <p className="text-sm mb-4 text-gray-600">
                {event.volunteerProfile || "Nenhuma descrição informada."}
              </p>

              <div className="space-y-3">

                <input
                  placeholder="Seu nome"
                  className="w-full p-3 bg-white rounded-lg border"
                />

                <input
                  placeholder="E-mail"
                  className="w-full p-3 bg-white rounded-lg border"
                />

                <input
                  placeholder="Telefone"
                  className="w-full p-3 bg-white rounded-lg border"
                />

              </div>

              <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg">
                Candidatar-se
              </button>

            </div>

          </div>

        </div>

      </section>
    </>
  );
}

export default EventDetails;