import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Home/Navbar";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";

import VerifyEmail from "./components/Login/VerifyEmail";
import ForgotPassword from "./components/Login/ForgotPassword";

import ArreteAccreditation from "./components/Home/ArreteAccreditation";
import DecretAccreditation from "./components/Home/DecretAccreditation";
import AllActu from "./components/Home/AllActu";

// Pour la simulation frontend seulement
const Dashboard = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Dashboard (Simulation)
      </h1>
      <p className="text-gray-600 mb-6">
        Cette page est une simulation frontend.
      </p>
      <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
        Retour à l'accueil
      </a>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Route Accueil avec Navbar */}
        <Route
          path="/"
          element={
            <Navbar>
              <Home />
            </Navbar>
          }
        />

        {/* AJOUT ICI : Route Actualités avec Navbar */}
        <Route
          path="/actualites"
          element={
            <Navbar>
              <AllActu />
            </Navbar>
          }
        />

        {/* Routes Authentification */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Routes Documents Légaux (Sans Navbar pour impression, ou ajoutez <Navbar> si besoin) */}
        <Route path="/arrete-accreditation" element={<ArreteAccreditation />} />
        <Route path="/decret-accreditation" element={<DecretAccreditation />} />
      </Routes>
    </Router>
  );
}

export default App;
