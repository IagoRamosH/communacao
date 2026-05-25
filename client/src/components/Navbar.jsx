import { FaHome, FaCalendarAlt, FaUser, FaClock, FaFlag } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    `flex flex-col items-center transition ${
      isActive ? "text-pink-600 font-semibold" : "hover:text-pink-600"
    }`;

  return (
    <nav className="bg-gray-100 shadow-sm px-8 py-3 flex justify-center gap-10 text-sm">
      <NavLink to="/" className={linkClass}>
        <FaHome />
        Home
      </NavLink>

      <NavLink to="/meus-eventos" className={linkClass}>
        <FaCalendarAlt />
        Meus Eventos
      </NavLink>

      <NavLink to="/perfil" className={linkClass}>
        <FaUser />
        Perfil
      </NavLink>

      <NavLink to="/expirados" className={linkClass}>
        <FaClock />
        Expirados
      </NavLink>

      <NavLink to="/denuncias" className={linkClass}>
        <FaFlag />
        Denuncias
      </NavLink>
    </nav>
  );
}

export default Navbar;
