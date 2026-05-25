import { useEffect, useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Denuncias() {
  const [events, setEvents] = useState([]);
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    event: "",
    type: "event",
    title: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    const [eventsRes, reportsRes] = await Promise.all([
      api.get("/events"),
      api.get("/reports/my-reports"),
    ]);

    setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
    setReports(Array.isArray(reportsRes.data) ? reportsRes.data : []);
  }

  useEffect(() => {
    loadData().catch((error) => {
      console.error("Erro ao carregar denuncias", error);
      setError(error.response?.data?.message || "Erro ao carregar denuncias");
    });
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      await api.post("/reports", {
        ...form,
        event: form.event || null,
      });

      setForm({ event: "", type: "event", title: "", description: "" });
      setMessage("Denuncia enviada para analise.");
      await loadData();
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao enviar denuncia");
    }
  }

  return (
    <>
      <Header />
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-10 text-sm">
        <h1 className="text-xl font-semibold mb-6">Denuncias</h1>

        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 shadow-sm space-y-4 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Tipo</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
              >
                <option value="event">Evento</option>
                <option value="user">Usuario</option>
                <option value="content">Conteudo</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div>
              <label className="font-medium">Evento relacionado</label>
              <select
                name="event"
                value={form.event}
                onChange={handleChange}
                className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
              >
                <option value="">Sem evento especifico</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-medium">Titulo</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium">Descricao</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
            />
          </div>

          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}

          <button className="w-full bg-pink-600 text-white py-3 rounded-lg">
            Enviar denuncia
          </button>
        </form>

        <h2 className="font-semibold mb-4">Minhas denuncias</h2>

        {reports.length === 0 ? (
          <p className="text-gray-500">Voce ainda nao enviou denuncias.</p>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report._id} className="bg-white border rounded-xl p-4 shadow-sm">
                <div className="flex justify-between gap-4">
                  <h3 className="font-semibold">{report.title}</h3>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {report.status}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{report.description}</p>
                {report.event && (
                  <p className="text-gray-500 mt-2">Evento: {report.event.title}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Denuncias;
