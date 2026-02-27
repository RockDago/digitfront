import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthService } from "../../services";

import Navbar from "../../pages/Dashboard/Navbar/Navbar";
import SidebarExpert from "../../pages/Dashboard/Sidebar/SidebarExpert";

export default function DashboardExpert() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  // Initialisation de l'utilisateur dans un state (comme pour les autres)
  const [user] = useState(AuthService.getCurrentUser());

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const performLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div
      className={`
        min-h-screen
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        transition-colors duration-300
      `}
    >
      {/* SIDEBAR */}
      <SidebarExpert
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* CONTENU PRINCIPAL (décalé par la sidebar) */}
      <div
        className={`
          flex flex-col min-h-screen
          transition-all duration-300 ease-in-out
          ${collapsed ? "lg:ml-20" : "lg:ml-72"}
          ml-0
        `}
      >
        {/* NAVBAR */}
        <div className="h-20">
          <Navbar
            collapsed={collapsed}
            user={user}
            onLogoutClick={performLogout}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />
        </div>

        {/* ZONE DE CONTENU */}
        <main
          className={`
            flex-1
            px-6 sm:px-8
            pt-6 pb-10 md:pb-12
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-gray-100
            transition-colors duration-300
          `}
        >
          {/* Conteneur max-w-7xl centré pour limiter la largeur sur très grands écrans */}
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
