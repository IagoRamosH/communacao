import { useState, useEffect } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import api from "../services/api";

function MeusEventos() {
  const [activeTab, setActiveTab] = useState("participando");

  const [createdEvents, setCreatedEvents] = useState([]);
  const [participatingEvents, setParticipatingEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyEvents() {
      try {
        const token = localStorage.getItem("token");

        // 🔹 EVENTOS CRIADOS PELO USUÁRIO
        const createdRes = await api.get("/events/my-events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(createdRes.data)) {
          setCreatedEvents(createdRes.data);
        } else {
          setCreatedEvents([]);
        }

        // 🔹 PARTICIPANDO (ainda não implementado no backend)
        setParticipatingEvents([]);

      } catch (error) {
        console.error("Erro ao buscar meus eventos", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMyEvents();
  }, []);

  // 🔁 Alterna entre abas
  const eventos =
    activeTab === "participando"
      ? participatingEvents
      : createdEvents;

  return (
    <>
      <Header />
      <Navbar />

      <section className="px-8 py-10 text-sm">

        {/* Título */}
        <h1 className="text-lg font-semibold mb-4">
          Meus Eventos
        </h1>

        {/* Abas */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("participando")}
            className={`px-4 py-2 rounded-full transition ${
              activeTab === "participando"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Participando
          </button>

          <button
            onClick={() => setActiveTab("criados")}
            className={`px-4 py-2 rounded-full transition ${
              activeTab === "criados"
                ? "bg-green-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Criados
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-gray-500">
            Carregando seus eventos...
          </p>
        )}

        {/* SEM EVENTOS */}
        {!loading && eventos.length === 0 && (
          <p className="text-gray-500">
            Nenhum evento encontrado.
          </p>
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((event) => (
            <EventCard
              key={event._id}
              id={event._id} // 🔥 essencial para abrir detalhes
              title={event.title}
              date={event.startDate || event.date}
              location={event.location}
              image={event.image}
            />
          ))}
        </div>

      </section>
    </>
  );
}

export default MeusEventos;