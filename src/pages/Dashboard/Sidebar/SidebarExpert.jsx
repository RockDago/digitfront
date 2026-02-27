import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaRegFileAlt,
  FaClipboardCheck,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { ThemeContext } from "../../../context/ThemeContext";

export default function SidebarExpert({
  collapsed,
  setCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  // --- STYLES ---
  const baseItemClass =
    "group flex items-center justify-between px-4 py-3 mx-3 mb-1 rounded-xl transition-all duration-200 cursor-pointer text-sm font-medium";
  const activeClass =
    "bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-300";
  const inactiveClass =
    "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white";

  const goTo = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  // --- MENU CONFIG ---
  const navItems = [
    {
      to: "/dashboard/expert/tableau-de-bord",
      icon: FaTachometerAlt,
      label: "Tableau de bord",
    },
    {
      to: "/dashboard/expert/gestion-dossiers",
      icon: FaRegFileAlt,
      label: "Gestion des dossiers",
    },
    {
      to: "/dashboard/expert/transmission-cnh",
      icon: FaClipboardCheck,
      label: "Transmission au CNH",
    },
  ];

  const isLinkActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <>
      {/* Overlay Mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-gray-900 z-50
          border-r border-gray-100 dark:border-gray-800
          shadow-xl lg:shadow-none transition-all duration-300 ease-in-out flex flex-col
          ${collapsed ? "w-20" : "w-72"}
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* HEADER: Logo + Toggle */}
        <div className="h-20 flex items-center justify-center px-6 border-b border-gray-50 dark:border-gray-800 mb-4 relative">
          {!collapsed && (
            <div
              className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
              onClick={() => goTo("/dashboard/expert/tableau-de-bord")}
            >
              <span className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400 font-henno">
                HAE
              </span>
            </div>
          )}

          {/* TOGGLE (Desktop) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg text-gray-400 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden lg:block ${
              !collapsed ? "absolute right-4" : "mx-auto"
            }`}
            title={collapsed ? "Développer" : "Réduire"}
          >
            <FaBars />
          </button>

          {/* CLOSE (Mobile) */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-red-500 absolute right-4"
            title="Fermer le menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar pb-6">
          <div className="mb-2">
            {navItems.map((item) => {
              const active = isLinkActive(item.to);
              return (
                <div
                  key={item.to}
                  onClick={() => goTo(item.to)}
                  className={`${baseItemClass} ${
                    active ? activeClass : inactiveClass
                  }`}
                  title={collapsed ? item.label : ""}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`text-lg flex-shrink-0 ${
                        active
                          ? "text-blue-600 dark:text-blue-300"
                          : "text-gray-400 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200"
                      }`}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* BOUTON MODE SOMBRE/CLAIR */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-3 py-3 mt-auto">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-2 rounded-xl text-sm font-medium
                       bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === "dark" ? (
              <FaMoon className="text-lg text-yellow-400 flex-shrink-0" />
            ) : (
              <FaSun className="text-lg text-yellow-400 flex-shrink-0" />
            )}
            {!collapsed && (
              <span>{theme === "dark" ? "Mode sombre" : "Mode clair"}</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
