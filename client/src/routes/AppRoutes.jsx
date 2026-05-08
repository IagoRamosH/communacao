import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MeusEventos from "../pages/MeusEventos";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoute";

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
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;