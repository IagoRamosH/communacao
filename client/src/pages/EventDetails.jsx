import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

import Header from "../components/Header";
import Navbar from "../components/Navbar";

function EventDetails() {
  const { id } = useParams();

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

  if (loading) {
    return <p className="p-8">Carregando...</p>;
  }

  if (!event) {
    return <p className="p-8">Evento não encontrado</p>;
  }

  return (
    <>
      <Header />
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-8 text-sm">

        {/* IMAGEM */}
        <div className="relative h-[320px] rounded-2xl overflow-hidden mb-8">
          <img
            src={event.image || "https://via.placeholder.com/800"}
            alt="evento"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40 flex items-end p-6">
            <div>
              <span className="bg-pink-500 text-white text-xs px-3 py-1 rounded-full">
                {event.category}
              </span>

              <h1 className="text-2xl font-semibold text-white mt-3">
                {event.title}
              </h1>
            </div>
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* ESQUERDA */}
          <div className="md:col-span-2">

            <h2 className="font-semibold mb-3">
              Sobre o evento
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {event.description}
            </p>

          </div>

          {/* DIREITA */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm">

            <h3 className="font-semibold mb-4">
              Informações
            </h3>

            <div className="space-y-3 text-gray-600 text-sm">

              <p>📍 {event.location}</p>
              <p>📅 {event.date}</p>
              <p>👤 {event.creator?.name}</p>

            </div>

            <button className="w-full mt-6 bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700">
              Participar Evento
            </button>

          </div>

        </div>

      </section>
    </>
  );
}

export default EventDetails;