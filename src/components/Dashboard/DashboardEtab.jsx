import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthService } from "../../services";
import { API_URL } from "../../config/axios";
import Navbar from "./Navbar/Navbar";
import SidebarEtab from "./Sidebar/SidebarEtab";

export default function DashboardEtab() {
  const [notifications, setNotifications] = useState([]);
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

  // Fetch notifications depuis FastAPI
  const fetchNotifications = useCallback(async () => {
    if (!user.id) return;
    try {
      const res = await fetch(
        `${API_URL}/notifications-accreditation?profil_id=${user.id}`,
      );
      if (!res.ok) throw new Error("Erreur fetch notifications");
      const data = await res.json();
      const mapped = data.map((n) => ({
        id: n.id,
        message: n.message,
        time: new Date(n.created_at).toLocaleString("fr-FR"),
        read: false,
      }));
      setNotifications(mapped);
    } catch (err) {
      console.error("Erreur fetch notifications:", err);
    }
  }, [user.id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ✅ Fonction pour la déconnexion (comme DashboardAdmin)
  const performLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  const handleMarkAsRead = (id) =>
    setNotifications((p) =>
      p.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const handleDeleteNotif = async (id) => {
    try {
      const res = await fetch(`${API_URL}/notifications-accreditation/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur suppression notification");
      setNotifications((p) => p.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = () =>
    setNotifications((p) => p.map((n) => ({ ...n, read: true })));

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
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllAsRead}
            onMarkAsRead={handleMarkAsRead}
            onDeleteNotif={handleDeleteNotif}
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
