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
        const response = await api.get("/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Erro ao buscar eventos", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return <p className="p-8">Carregando eventos...</p>;
  }

  return (
    <>
      <Header />
      <Navbar />
      <Hero />
      <SearchBar />

      <section className="px-8 py-10">
        <h3 className="text-2xl font-bold mb-6">
          Eventos em destaque
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} {...event} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;