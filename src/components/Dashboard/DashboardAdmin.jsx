import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthService } from "../../services";

import NavbarAdmin from "./Navbar/Navbar";
import SidebarAdmin from "../../components/Dashboard/Sidebar/SidebarAdmin";

export default function DashboardAdmin() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  const [user] = useState(AuthService.getCurrentUser());
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const performLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  const handleMarkAsRead = (id) =>
    setNotifications((p) =>
      p.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  const handleDeleteNotif = (id) =>
    setNotifications((p) => p.filter((n) => n.id !== id));
  const handleMarkAllAsRead = () =>
    setNotifications((p) => p.map((n) => ({ ...n, read: true })));

  if (!user) return null;

  return (
    // ✅ MODIFICATION ICI : bg-white au lieu de bg-gray-50
    <div className="min-h-screen bg-white">
      {/* 1. SIDEBAR */}
      <SidebarAdmin
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
          <NavbarAdmin
            collapsed={collapsed}
            user={user}
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllAsRead}
            onMarkAsRead={handleMarkAsRead}
            onDeleteNotif={handleDeleteNotif}
            onLogoutClick={performLogout}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />
        </div>

        {/* CONTENT */}
        {/* ✅ MODIFICATION ICI : bg-white au lieu de bg-gray-50 */}
        <main className="flex-1 px-8 pt-6 pb-8 bg-white overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
