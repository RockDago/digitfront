import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthService } from "../../services";
import { API_URL } from "../../config/axios";

import Navbar from "./Navbar/Navbar";
import SidebarReq from "./Sidebar/SidebarReq";

export default function DashboardReq() {
  const [notifications, setNotifications] = useState([]);
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

  // --- 3. GESTION DES NOTIFICATIONS ---
  const fetchNotifications = useCallback(async () => {
    if (!user.id) return;
    try {
      const res = await fetch(
        `${API_URL}/notification-demande/profil/${user.id}`
      );
      if (!res.ok) throw new Error("Erreur fetch notifications");
      const data = await res.json();
      const mapped = data.map((n) => ({
        id: n.id,
        message: n.message,
        time: new Date(n.created_at).toLocaleString("fr-FR"),
        read: false,
        demande_id: n.demande_id,
      }));
      setNotifications(mapped);
    } catch (err) {
      console.error("Erreur fetch notifications:", err);
    }
  }, [user.id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = (id) =>
    setNotifications((p) =>
      p.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const handleDeleteNotif = async (id) => {
    try {
      const res = await fetch(`${API_URL}/notification-demande/${id}`, {
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

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white"> {/* Changé en fond blanc */}
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
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllAsRead}
            onMarkAsRead={handleMarkAsRead}
            onDeleteNotif={handleDeleteNotif}
            onLogoutClick={performLogout}
            onMobileMenuClick={() => setIsMobileOpen(true)}
          />
        </div>

        {/* CONTENT */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-4 pb-8 bg-white overflow-x-hidden"> {/* Fond blanc ici aussi */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}