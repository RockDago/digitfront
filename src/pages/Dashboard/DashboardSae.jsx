import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthService } from "../../services";

import Navbar from "../../pages/Dashboard/Navbar/Navbar";
import SidebarSae from "../../pages/Dashboard/Sidebar/SidebarSae";

export default function DashboardSae() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialisation de l'utilisateur dans un state comme les autres dashboards
  const [user] = useState(AuthService.getCurrentUser());

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // Redirection automatique vers tableau-de-bord
  useEffect(() => {
    if (
      location.pathname === "/dashboard/sae" ||
      location.pathname === "/dashboard/sae/"
    ) {
      navigate("/dashboard/sae/tableau-de-bord", { replace: true });
    }
  }, [location.pathname, navigate]);

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
      {/* 1. SIDEBAR SAE */}
      <SidebarSae
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        user={user}
      />

      {/* 2. WRAPPER PRINCIPAL */}
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
          {/* Conteneur limité en largeur (max-w-7xl) */}
          <div className="mx-auto w-full max-w-7xl">
            {user?.can_read !== true ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
                  <span className="text-4xl text-red-500">🚫</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Accès refusé</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Désolé, vous n'avez pas les permissions nécessaires pour consulter cette section. 
                  Veuillez contacter l'administrateur si vous pensez qu'il s'agit d'une erreur.
                </p>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
