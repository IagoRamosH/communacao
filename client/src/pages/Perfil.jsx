import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function Perfil() {
  const { user, login } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    organizationName: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        organizationName: user.organizationName || "",
        password: "",
      });
    }
  }, [user]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const payload = {
        name: form.name,
        email: form.email,
        organizationName: form.organizationName,
      };

      if (form.password) {
        payload.password = form.password;
      }

      const response = await api.put("/users/me", payload);
      const token = localStorage.getItem("token");

      login(
        {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          organizationName: response.data.organizationName,
          organizationStatus: response.data.organizationStatus,
        },
        token
      );

      setForm((current) => ({ ...current, password: "" }));
      setMessage("Perfil atualizado com sucesso.");
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao atualizar perfil");
    }
  }

  return (
    <>
      <Header />
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-10 text-sm">
        <h1 className="text-xl font-semibold mb-6">Perfil</h1>

        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <label className="font-medium">Nome</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium">Nome da organizacao</label>
            <input
              name="organizationName"
              value={form.organizationName}
              onChange={handleChange}
              className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium">Nova senha</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 p-3 bg-gray-100 rounded-lg"
              placeholder="Deixe vazio para manter a senha atual"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-gray-600">
            <p>Perfil: {user?.role || "user"}</p>
            <p>Status organizacao: {user?.organizationStatus || "none"}</p>
          </div>

          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}

          <button className="w-full bg-pink-600 text-white py-3 rounded-lg">
            Salvar perfil
          </button>
        </form>
      </section>
    </>
  );
}

export default Perfil;
