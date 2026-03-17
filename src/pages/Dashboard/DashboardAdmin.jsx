import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthService } from "../../services";

import NavbarAdmin from "./Navbar/Navbar";
import SidebarAdmin from "../../pages/Dashboard/Sidebar/SidebarAdmin";

export default function DashboardAdmin() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

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
      <SidebarAdmin
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        user={user}
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
          <NavbarAdmin
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