import React, { useState, useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthService } from "../../services";

import Navbar from "./Navbar/Navbar";
import SidebarEtab from "./Sidebar/SidebarEtab";

export default function DashboardEtab() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigate = useNavigate();
  const user = useMemo(() => AuthService.getCurrentUser() || {}, []);

  // Vérification d'authentification
  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Fonction pour la déconnexion (comme DashboardAdmin)
  const performLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* 1. SIDEBAR */}
      <SidebarEtab
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* 2. WRAPPER PRINCIPAL */}
      <div
        className={`
          flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-72"}
          ml-0
        `}
      >
        {/* NAVBAR */}
        <div className="h-20">
          <Navbar
            collapsed={isSidebarCollapsed}
            user={user}
            onLogoutClick={performLogout}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />
        </div>

        {/* CONTENT */}
        <main className="flex-1 px-8 pt-6 pb-8 bg-white overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
