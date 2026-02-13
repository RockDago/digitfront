import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthService } from "../../services";

import Navbar from "../../components/Dashboard/Navbar/Navbar";
import SidebarSae from "../../components/Dashboard/Sidebar/SidebarSae";

export default function DashboardSae() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // Redirection automatique vers tableau-de-bord
  useEffect(() => {
    if (location.pathname === "/dashboard/sae" || location.pathname === "/dashboard/sae/") {
      navigate("/dashboard/sae/tableau-de-bord", { replace: true });
    }
  }, [location.pathname, navigate]);

  const performLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white">
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
            user={AuthService.getCurrentUser()}
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