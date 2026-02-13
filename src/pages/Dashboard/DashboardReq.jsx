import React, { useState, useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthService } from "../../services";

import Navbar from "./Navbar/Navbar";
import SidebarReq from "./Sidebar/SidebarReq";

export default function DashboardReq() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigate = useNavigate();
  const user = useMemo(() => AuthService.getCurrentUser() || {}, []);

  // --- 1. SÉCURITÉ : Redirection si non connecté ---
  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // --- 2. FONCTION DE DÉCONNEXION ---
  const performLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      {" "}
      {/* Changé en fond blanc */}
      {/* 1. SIDEBAR */}
      <SidebarReq
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
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
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-4 pb-8 bg-white overflow-x-hidden">
          {" "}
          {/* Fond blanc ici aussi */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
