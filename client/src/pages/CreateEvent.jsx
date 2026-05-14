import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaUser,
  FaBullseye,
  FaUsers
} from "react-icons/fa";

import {
  MdEmail,
  MdDescription
} from "react-icons/md";

import { FaChartLine } from "react-icons/fa";

import api from "../services/api";

function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
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
          <FaArrowLeft
            className="cursor-pointer"
            onClick={() => navigate("/")}
          />

          <div>
            <h1 className="text-2xl font-bold">
              Cadastrar Novo Evento
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
                  placeholder="Ex: Campanha de Arrecadação de Alimentos"
                  className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <FaTag className={iconPrimary} /> Categoria *
                </label>
                <select
                  name="category"
                  className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione a categoria</option>
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
                    className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm">
                    <FaCalendarAlt className={iconPrimary} /> Data de Término
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm">
                  <FaMapMarkerAlt className={iconPrimary} /> Local *
                </label>
                <input
                  name="location"
                  placeholder="Ex: Centro Comunitário"
                  className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm">
                  <FaUser className={iconPrimary} /> Organizador
                </label>
                <input
                  name="organizer"
                  placeholder="Nome da instituição ou pessoa"
                  className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
                  onChange={handleChange}
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
              rows="4"
              placeholder="Descreva o evento, objetivos, horários, etc."
              className="w-full p-3 bg-gray-100 rounded-lg"
              onChange={handleChange}
            />
          </div>

          {/* OBJETIVO E META */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold">Objetivo e Meta do Evento</h2>
            <p className="text-sm text-gray-500 mb-4">
              Defina metas e propósito do evento
            </p>

            <div className="space-y-4">

              <div>
                <label className="flex items-center gap-2 text-sm">
                  <FaBullseye className={iconPrimary} /> Objetivo *
                </label>
                <textarea
                  name="goal"
                  placeholder="Objetivo principal do evento..."
                  className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm">
                  <FaChartLine className={iconSecondary} /> Tipo de Meta
                </label>
                <select
                  name="goalType"
                  className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  <option>Arrecadação</option>
                  <option>Pessoas</option>
                  <option>Itens</option>
                </select>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <input
                  name="goalTotal"
                  placeholder="Meta total"
                  className="p-3 bg-gray-100 rounded-lg"
                  onChange={handleChange}
                />
                <input
                  name="goalCurrent"
                  placeholder="Progresso atual"
                  className="p-3 bg-gray-100 rounded-lg"
                  onChange={handleChange}
                />
                <input
                  name="goalUnit"
                  placeholder="Unidade (kg, pessoas...)"
                  className="p-3 bg-gray-100 rounded-lg"
                  onChange={handleChange}
                />
              </div>

            </div>
          </div>

          {/* VOLUNTÁRIOS */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold">Voluntários</h2>
            <p className="text-sm text-gray-500 mb-4">
              Defina quantas pessoas são necessárias
            </p>

            <div className="space-y-4">

              <div>
                <label className="flex items-center gap-2 text-sm">
                  <FaUsers className={iconPrimary} /> Número de voluntários
                </label>
                <input
                  name="volunteers"
                  placeholder="Ex: 10"
                  className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
                  onChange={handleChange}
                />
              </div>

              <textarea
                name="volunteerProfile"
                placeholder="Descreva o perfil desejado dos voluntários, habilidades necessárias, disponibilidade, etc.."
                className="w-full p-3 bg-gray-100 rounded-lg"
                onChange={handleChange}
              />

            </div>
          </div>

          {/* CONTATO */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold">Contato</h2>

            <div className="space-y-4 mt-4">
              <div>
                <label className="flex items-center gap-2 text-sm">
                  <MdEmail className={iconSecondary} /> Email
                </label>
                <input
                  name="email"
                  placeholder="contato@email.com"
                  className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
                  onChange={handleChange}
                />
              </div>

              <input
                name="phone"
                placeholder="Telefone"
                className="w-full p-3 bg-gray-100 rounded-lg"
                onChange={handleChange}
              />

              <input
                name="whatsapp"
                placeholder="WhatsApp"
                className="w-full p-3 bg-gray-100 rounded-lg"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* BOTÕES */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-pink-600 text-white py-3 rounded-lg"
            >
              Cadastrar Evento
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 bg-gray-200 py-3 rounded-lg"
            >
              Cancelar
            </button>
          </div>

          {/* DICAS */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-sm">
            <h3 className="font-semibold mb-2">
              Dicas para um bom evento
            </h3>
            <ul className="list-disc ml-5 text-gray-600">
              <li>Seja claro e específico sobre o objetivo do evento</li>
              <li>Informe horários de início e término na descrição</li>
              <li>Forneça múltiplas formas de contato para facilitar a comunicação</li>
              <li>Defina metas realistas e acompanhe o progresso</li>
              <li>Descreva bem o perfil dos voluntários para atrair as pessoas certas</li>
              <li>Mencione se há estacionamento ou transporte público próximo</li>
            </ul>
          </div>

        </form>
      </section>
    </>
  );
}

export default CreateEvent;