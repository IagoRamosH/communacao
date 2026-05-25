import { useEffect, useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import api from "../services/api";

function Expirados() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpiredEvents() {
      try {
        const response = await api.get("/events");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expired = Array.isArray(response.data)
          ? response.data.filter((event) => {
              const rawDate = event.endDate || event.startDate || event.date;
              if (!rawDate) return false;

              const eventDate = new Date(rawDate);
              eventDate.setHours(0, 0, 0, 0);

              return eventDate < today;
            })
          : [];

        setEvents(expired);
      } catch (error) {
        console.error("Erro ao buscar eventos expirados", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchExpiredEvents();
  }, []);

  return (
    <>
      <Header />
      <Navbar />

      <section className="px-8 py-10 text-sm">
        <h1 className="text-xl font-semibold mb-6">Eventos Expirados</h1>

        {loading && <p className="text-gray-500">Carregando eventos expirados...</p>}

        {!loading && events.length === 0 && (
          <p className="text-gray-500">Nenhum evento expirado encontrado.</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              _id={event._id}
              title={event.title}
              date={event.endDate || event.startDate || event.date}
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

export default Expirados;
