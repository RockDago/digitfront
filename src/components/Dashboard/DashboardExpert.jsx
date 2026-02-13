import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthService } from "../../services";

import Navbar from "../../components/Dashboard/Navbar/Navbar";
import SidebarExpert from "../../components/Dashboard/Sidebar/SidebarExpert";

export default function DashboardExpert() {
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

  const user = AuthService.getCurrentUser();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarExpert
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div
        className={`
          flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ${collapsed ? "lg:ml-20" : "lg:ml-72"}
          ml-0
        `}
      >
        <div className="h-20">
          <Navbar
            collapsed={collapsed}
            user={user}
            onLogoutClick={performLogout}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />
        </div>

        <main className="flex-1 px-8 pt-6 pb-8 bg-gray-50 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
