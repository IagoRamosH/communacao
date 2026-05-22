import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import api from "../services/api";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        // ✅ CORREÇÃO AQUI (rota com /api)
        const response = await api.get("/events");

        // segurança caso não venha array
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          setEvents([]);
        }

      } catch (error) {
        console.error("Erro ao buscar eventos", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <Navbar />
        <p className="p-8 text-center">Carregando eventos...</p>
      </>
    );
  }

  return (
    <>
      <Header />
      <Navbar />
      <Hero />
      <SearchBar />

      <section className="px-8 py-10">

        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Eventos em destaque
        </h3>

        {/* 🔥 SE NÃO TIVER EVENTOS */}
        {events.length === 0 ? (
          <p className="text-gray-500 text-center">
            Nenhum evento encontrado.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
            <EventCard
              key={event._id}
              _id={event._id} // ✅ CORRETO
              title={event.title}
              date={event.startDate || event.date}
              location={event.location}
              org={event.organizer}
              description={event.description}
              category={event.category}
            />
            ))}
          </div>
        )}

      </section>

      <Footer />
    </>
  );
}

export default Home;