import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthService } from "../../services";

import Navbar from "../../components/Dashboard/Navbar/Navbar"; // Vérifiez ce chemin
import SidebarSae from "../../components/Dashboard/Sidebar/SidebarSae"; // Chemin corrigé

export default function DashboardSae() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const performLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  // Fonctions de notifications vides (simulées)
  const handleMarkAsRead = () => {};
  const handleDeleteNotif = () => {};
  const handleMarkAllAsRead = () => {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. SIDEBAR SAE */}
      <SidebarSae
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* 2. WRAPPER PRINCIPAL */}
      <div
        className={`
          flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ${collapsed ? "lg:ml-20" : "lg:ml-72"}
          ml-0
        `}
      >
        {/* NAVBAR */}
        <div className="h-20">
          <Navbar
            collapsed={collapsed}
            user={AuthService.getCurrentUser()} // Récupération directe
            notifications={[]} // Tableau vide
            onMarkAllAsRead={handleMarkAllAsRead}
            onMarkAsRead={handleMarkAsRead}
            onDeleteNotif={handleDeleteNotif}
            onLogoutClick={performLogout}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />
        </div>

        {/* CONTENT */}
        <main className="flex-1 px-8 pt-6 pb-8 bg-gray-50 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
