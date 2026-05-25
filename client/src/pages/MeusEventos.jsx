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
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMyEvents() {
      try {
        setError("");

        const [createdRes, participatingRes] = await Promise.all([
          api.get("/events/my-events"),
          api.get("/events/my-participations"),
        ]);

        setCreatedEvents(Array.isArray(createdRes.data) ? createdRes.data : []);
        setParticipatingEvents(
          Array.isArray(participatingRes.data) ? participatingRes.data : []
        );
      } catch (error) {
        console.error("Erro ao buscar meus eventos", error.response?.data || error);
        setError(error.response?.data?.message || "Erro ao buscar seus eventos");
      } finally {
        setLoading(false);
      }
    }

    fetchMyEvents();
  }, []);

  const eventos = activeTab === "participando" ? participatingEvents : createdEvents;

  return (
    <>
      <Header />
      <Navbar />

      <section className="px-8 py-10 text-sm">
        <h1 className="text-lg font-semibold mb-4">Meus Eventos</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("participando")}
            className={`px-4 py-2 rounded-full transition ${
              activeTab === "participando"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Participando ({participatingEvents.length})
          </button>

          <button
            onClick={() => setActiveTab("criados")}
            className={`px-4 py-2 rounded-full transition ${
              activeTab === "criados"
                ? "bg-green-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Criados ({createdEvents.length})
          </button>
        </div>

        {loading && <p className="text-gray-500">Carregando seus eventos...</p>}

        {!loading && error && <p className="text-red-500">{error}</p>}

        {!loading && !error && eventos.length === 0 && (
          <p className="text-gray-500">Nenhum evento encontrado nesta aba.</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((event) => (
            <EventCard
              key={event._id}
              _id={event._id}
              title={event.title}
              date={event.startDate || event.date}
              location={event.location}
              org={event.organizer || event.creator?.name}
              description={event.description}
              category={event.category}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default MeusEventos;
