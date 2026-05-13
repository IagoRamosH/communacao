import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SearchBar() {
const navigate = useNavigate();

  return (
    <div className="px-8 -mt-8">
      <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-4 flex-nowrap overflow-x-auto">

        {/* Busca */}
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg flex-1 min-w-[250px]">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar eventos..."
            className="bg-transparent outline-none px-2 w-full text-sm"
          />
        </div>

        {/* Filtro */}
        <select className="bg-gray-100 px-3 py-2 rounded-lg text-sm min-w-[180px]">
          <option>Todas as categorias</option>
          <option>Doação</option>
          <option>Ajuda Humanitária</option>
          <option>Evento Regional</option>
        </select>

        {/* Botão */}
        <button
          onClick={() => navigate("/cadastrar-evento")}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg"
        >
          Cadastrar Evento
        </button>

      </div>
    </div>
  );
}

export default SearchBar;