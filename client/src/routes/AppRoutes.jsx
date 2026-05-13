import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MeusEventos from "../pages/MeusEventos";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoute";
import EventDetails from "../pages/EventDetails";
import CreateEvent from "../pages/CreateEvent";

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
        <Route path="/evento/:id" element={<EventDetails />} />
        <Route path="/cadastrar-evento" element={<CreateEvent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;