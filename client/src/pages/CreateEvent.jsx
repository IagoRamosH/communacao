import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    startDate: "",
    endDate: "",
    location: "",
    organizer: "",
    description: "",
    email: "",
    phone: "",
    whatsapp: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post("/events", {
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location,
        date: form.startDate,
      });

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar evento");
    }
  }

  return (
    <>
      <Header />
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-8">

        {/* Título */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Cadastrar Novo Evento
          </h1>
          <p className="text-gray-500 text-sm">
            Preencha os dados para criar um evento comunitário
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* INFORMAÇÕES BÁSICAS */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="font-semibold mb-4">
              Informações Básicas
            </h2>

            <div className="space-y-4">

              <input
                name="title"
                placeholder="Nome do Evento"
                className="w-full p-3 border rounded-lg"
                onChange={handleChange}
                required
              />

              <select
                name="category"
                className="w-full p-3 border rounded-lg"
                onChange={handleChange}
                required
              >
                <option value="">Categoria</option>
                <option>Doação</option>
                <option>Ajuda Humanitária</option>
                <option>Evento Regional</option>
              </select>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="date"
                  name="startDate"
                  className="p-3 border rounded-lg"
                  onChange={handleChange}
                  required
                />

                <input
                  type="date"
                  name="endDate"
                  className="p-3 border rounded-lg"
                  onChange={handleChange}
                />
              </div>

              <input
                name="location"
                placeholder="Local"
                className="w-full p-3 border rounded-lg"
                onChange={handleChange}
                required
              />

            </div>
          </div>

          {/* DESCRIÇÃO */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="font-semibold mb-4">
              Descrição
            </h2>

            <textarea
              name="description"
              rows="4"
              placeholder="Descreva o evento"
              className="w-full p-3 border rounded-lg"
              onChange={handleChange}
              required
            />
          </div>

          {/* CONTATO */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="font-semibold mb-4">
              Informações de Contato
            </h2>

            <div className="space-y-4">

              <input
                name="email"
                placeholder="E-mail"
                className="w-full p-3 border rounded-lg"
                onChange={handleChange}
              />

              <input
                name="phone"
                placeholder="Telefone"
                className="w-full p-3 border rounded-lg"
                onChange={handleChange}
              />

              <input
                name="whatsapp"
                placeholder="WhatsApp"
                className="w-full p-3 border rounded-lg"
                onChange={handleChange}
              />

            </div>
          </div>

          {/* BOTÕES */}
          <div className="flex gap-4">

            <button
              type="submit"
              className="bg-pink-600 text-white px-6 py-3 rounded-lg w-full"
            >
              Cadastrar Evento
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-200 px-6 py-3 rounded-lg w-full"
            >
              Cancelar
            </button>

          </div>

        </form>

      </section>
    </>
  );
}

export default CreateEvent;