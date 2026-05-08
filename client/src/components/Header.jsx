import logo from "../assets/comunacao.png";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Header() {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r to-pink-600 from-blue-600 text-white px-8 py-4 flex justify-between items-center">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="logo"
          className="w-10 h-10"
        />

        <div>
          <h1 className="text-xl font-bold">
            ComunAção
          </h1>

          <p className="text-sm opacity-90">
            Plataforma que conecta pessoas a eventos sociais
          </p>
        </div>
      </div>

      {/* Área usuário */}
      {user ? (
        <div className="flex items-center gap-4">

          <span className="text-sm font-medium">
            Olá, {user.name}
          </span>

          <button
            onClick={logout}
            className="bg-white text-pink-600 px-4 py-2 rounded-lg font-medium hover:opacity-90"
          >
            Sair
          </button>

        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-pink-600 px-4 py-2 rounded-lg font-medium hover:opacity-90"
        >
          Entrar / Cadastrar
        </button>
      )}

    </header>
  );
}

export default Header;