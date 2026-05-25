import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MeusEventos from "../pages/MeusEventos";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoute";
import EventDetails from "../pages/EventDetails";
import CreateEvent from "../pages/CreateEvent";
import Perfil from "../pages/Perfil";
import Expirados from "../pages/Expirados";
import Denuncias from "../pages/Denuncias";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/meus-eventos"
          element={
            <PrivateRoute>
              <MeusEventos />
            </PrivateRoute>
          }
        />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route
          path="/editar-evento/:id"
          element={
            <PrivateRoute>
              <CreateEvent />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastrar-evento"
          element={
            <PrivateRoute>
              <CreateEvent />
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />
        <Route path="/expirados" element={<Expirados />} />
        <Route
          path="/denuncias"
          element={
            <PrivateRoute>
              <Denuncias />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
