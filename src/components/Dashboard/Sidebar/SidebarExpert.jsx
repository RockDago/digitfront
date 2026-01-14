
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaSearch,
  FaFileSignature,
  FaClipboardCheck,
  FaComments,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

export default function SidebarExpert({
  collapsed,
  setCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) {
  // États accordéons
  const [evaluationsOpen, setEvaluationsOpen] = useState(false);
  const [avisOpen, setAvisOpen] = useState(false);
  const [missionsOpen, setMissionsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // --- MENU CONFIG ---
  const mainNavItems = [
    { 
      to: "/dashboard/expert/tableau-de-bord", 
      label: "Tableau de bord", 
      icon: FaHome 
    },
  ];

  const evaluationsItems = [
    { label: "Évaluations en attente", path: "/dashboard/expert/evaluations-attente" },
    { label: "Évaluations en cours", path: "/dashboard/expert/evaluations-cours" },
    { label: "Historique d'évaluations", path: "/dashboard/expert/historique-evaluations" },
  ];

  const avisItems = [
    { label: "Rédiger un avis", path: "/dashboard/expert/rediger-avis" },
    { label: "Mes avis soumis", path: "/dashboard/expert/avis-soumis" },
    { label: "Avis en révision", path: "/dashboard/expert/avis-revision" },
  ];

  const missionsItems = [
    { label: "Missions assignées", path: "/dashboard/expert/missions-assignees" },
    { label: "Calendrier des missions", path: "/dashboard/expert/calendrier-missions" },
    { label: "Rapports de mission", path: "/dashboard/expert/rapports-mission" },
  ];

  const goTo = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isLinkActive = (path) => location.pathname === path;

  // --- STYLES ---
  const baseItemClass =
    "group flex items-center justify-between px-4 py-3 mx-3 mb-1 rounded-xl transition-all duration-200 cursor-pointer text-sm font-medium";
  const activeClass = "bg-blue-50 text-blue-600";
  const inactiveClass = "text-gray-500 hover:bg-gray-50 hover:text-gray-900";

  const subItemClass =
    "flex items-center px-4 py-2 my-1 mx-3 rounded-lg text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 transition-colors cursor-pointer pl-11";

  // --- HELPER ACCORDION ---
  const renderAccordion = (title, icon, isOpen, setIsOpen, items) => {
    const Icon = icon;
    const isChildActive = items.some((item) =>
      location.pathname.includes(item.path)
    );
    const effectiveIsOpen = isOpen || (isChildActive && !collapsed);

    return (
      <div className="mb-1">
        <div
          onClick={() => {
            if (collapsed) setCollapsed(false);
            setIsOpen(!isOpen);
          }}
          className={`${baseItemClass} ${
            isChildActive ? activeClass : inactiveClass
          }`}
          title={collapsed ? title : ""}
        >
          <div className="flex items-center gap-3">
            <Icon
              className={`text-lg flex-shrink-0 ${
                isChildActive
                  ? "text-blue-600"
                  : "text-gray-400 group-hover:text-gray-600"
              }`}
            />
            {!collapsed && <span>{title}</span>}
          </div>
          {!collapsed && (
            <FaChevronRight
              className={`text-xs text-gray-400 transition-transform duration-200 ${
                effectiveIsOpen ? "rotate-90" : ""
              }`}
            />
          )}
        </div>

        {/* Sous-menu avec animation Height */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            effectiveIsOpen && !collapsed
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          {items.map((subItem, idx) => (
            <div
              key={idx}
              onClick={() => goTo(subItem.path)}
              className={`${subItemClass} ${
                location.pathname === subItem.path
                  ? "text-blue-600 font-semibold bg-blue-50"
                  : ""
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full mr-3 ${
                  location.pathname === subItem.path
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              />
              {subItem.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

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
          fixed top-0 left-0 h-full bg-white z-50 border-r border-gray-100 shadow-xl lg:shadow-none
          transition-all duration-300 ease-in-out flex flex-col
          ${collapsed ? "w-20" : "w-72"}
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* HEADER SIDEBAR: Logo + Toggle */}
        <div className="h-20 flex items-center justify-center px-6 border-b border-gray-50 mb-4 relative">
          {/* LOGO DAAQ */}
          {!collapsed && (
            <Link
              to="/"
              className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2"
            >
              <span className="text-2xl font-black tracking-tight text-blue-600 font-sans">
                DAAQ
              </span>
            </Link>
          )}

          {/* TOGGLE BUTTON (Desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-gray-100 transition-colors hidden lg:block ${
              !collapsed ? "absolute right-4" : ""
            }`}
          >
            <FaBars />
          </button>

          {/* CLOSE BUTTON (Mobile only) */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-red-500 absolute right-4"
          >
            <FaTimes />
          </button>
        </div>

        {/* NAVIGATION LIST */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar pb-6">
          {/* Section: MAIN */}
          <div className="mb-6">
            {!collapsed && (
              <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Navigation Principale
              </div>
            )}
            {mainNavItems.map((item) => (
              <div
                key={item.to}
                onClick={() => goTo(item.to)}
                className={`${baseItemClass} ${
                  isLinkActive(item.to) ? activeClass : inactiveClass
                }`}
                title={collapsed ? item.label : ""}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`text-lg flex-shrink-0 ${
                      isLinkActive(item.to)
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </div>
              </div>
            ))}

            {/* Recherche de dossiers */}
            <div
              onClick={() => goTo("/dashboard/expert/recherche-dossiers")}
              className={`${baseItemClass} ${
                isLinkActive("/dashboard/expert/recherche-dossiers") ? activeClass : inactiveClass
              }`}
              title={collapsed ? "Recherche" : ""}
            >
              <div className="flex items-center gap-3">
                <FaSearch
                  className={`text-lg flex-shrink-0 ${
                    isLinkActive("/dashboard/expert/recherche-dossiers")
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                {!collapsed && <span>Recherche de dossiers</span>}
              </div>
            </div>
          </div>

          {/* Section: ÉVALUATIONS */}
          <div className="mb-6">
            {!collapsed && (
              <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Évaluations
              </div>
            )}

            {renderAccordion(
              "Évaluations",
              FaClipboardCheck,
              evaluationsOpen,
              setEvaluationsOpen,
              evaluationsItems
            )}
          </div>

          {/* Section: AVIS TECHNIQUES */}
          <div className="mb-6">
            {!collapsed && (
              <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Avis Techniques
              </div>
            )}

            {renderAccordion(
              "Avis techniques",
              FaFileSignature,
              avisOpen,
              setAvisOpen,
              avisItems
            )}
          </div>

          {/* Section: MISSIONS */}
          <div className="mb-6">
            {!collapsed && (
              <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Missions
              </div>
            )}

            {renderAccordion(
              "Missions",
              FaComments,
              missionsOpen,
              setMissionsOpen,
              missionsItems
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}