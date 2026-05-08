import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register", form);

      login(response.data.user, response.data.token);

      // redirecionar
      navigate("/");

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Erro ao cadastrar"
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600">

      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Criar conta
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>

          <div>
            <label className="text-sm">Nome</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm">Senha</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          <button className="w-full bg-pink-600 text-white py-2 rounded-lg">
            Cadastrar
          </button>

        </form>

        <p className="text-sm text-center mt-4">
          Já tem conta?{" "}
          <Link to="/login" className="text-pink-600">
            Entrar
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;