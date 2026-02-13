import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaClipboardList,
  FaRegFileAlt,
  FaTimes,
  FaFileContract,
  FaSync,
  FaChartBar,
} from "react-icons/fa";

export default function SidebarEtab({
  isSidebarCollapsed,
  toggleSidebar,
  isMobileOpen,
  setIsMobileOpen,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const baseItemClass =
    "group flex items-center justify-between px-4 py-3 mx-3 mb-1 rounded-xl transition-all duration-200 cursor-pointer text-sm font-medium";
  const activeClass = "bg-blue-50 text-blue-600";
  const inactiveClass = "text-gray-500 hover:bg-gray-50 hover:text-gray-900";

  const goTo = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const navItems = [
    {
      section: "Accueil",
      items: [
        {
          to: "/dashboard/etablissement",
          icon: FaClipboardList,
          label: "Tableau de bord",
        },
      ],
    },
    {
      section: "Habilitation",
      items: [
        // {
        //   to: "/dashboard/institut/habilitation/demandes",
        //   icon: FaUserCheck,
        //   label: "Demandes d'habilitation",
        // },
        {
          to: "/dashboard/etablissement/habilitation/creer-demande",
          icon: FaFileContract,
          label: "Créer demande",
        },
        {
          to: "/dashboard/etablissement/habilitation/renouvellement",
          icon: FaSync,
          label: "Renouvellement",
        },
        {
          to: "/dashboard/etablissement/habilitation/mes-informations",
          icon: FaClipboardList,
          label: "Mes informations",
        },
      ],
    },
    {
      section: "Accréditation",
      items: [
        // {
        //   to: "/dashboard/institut/accreditation/demandes",
        //   icon: FaUniversity,
        //   label: "Demandes d'accréditation",
        // },
        {
          to: "/dashboard/etablissement/accreditation/auto-evaluation",
          icon: FaChartBar,
          label: "Auto-évaluation",
        },
        {
          to: "/dashboard/etablissement/accreditation/creer-demande",
          icon: FaRegFileAlt,
          label: "Créer demande",
        },
      ],
    },
  ];

  const isLinkActive = (path) => {
    // Correction du bug : vérifier l'égalité exacte ou si le path actuel commence par le path du lien
    const currentPath = location.pathname;
    if (path === "/dashboard/etablissement") {
      return (
        currentPath === path || currentPath === "/dashboard/etablissement/"
      );
    }
    // Make 'Créer demande' stay active when user is on any specific habilitation form
    if (path === "/dashboard/etablissement/habilitation/creer-demande") {
      return (
        currentPath === path ||
        currentPath.startsWith(path + "/") ||
        currentPath.startsWith(
          "/dashboard/etablissement/habilitation/formulaire/",
        )
      );
    }

    return currentPath === path || currentPath.startsWith(path + "/");
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
          ${isSidebarCollapsed ? "w-20" : "w-72"}
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="h-20 flex items-center justify-center px-6 border-b border-gray-50 mb-4 relative">
          {!isSidebarCollapsed && (
            <div
              className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
              onClick={() => goTo("/dashboard/etablissement")}
            >
              <span className="text-2xl font-black tracking-tight text-blue-600 font-cassannet">
                DAAQ
              </span>
            </div>
          )}

          {/* TOGGLE BUTTON (Desktop only) */}
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-gray-100 transition-colors hidden lg:block ${
              !isSidebarCollapsed ? "absolute right-4" : "mx-auto"
            }`}
            title={isSidebarCollapsed ? "Développer" : "Réduire"}
          >
            <FaBars />
          </button>

          {/* CLOSE BUTTON (Mobile only) */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-red-500 absolute right-4"
            title="Fermer le menu"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar pb-6">
          {navItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {!isSidebarCollapsed && section.section && (
                <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.section}
                </div>
              )}

              {section.items.map((item) => {
                const active = isLinkActive(item.to);
                return (
                  <div
                    key={item.to}
                    onClick={() => goTo(item.to)}
                    className={`${baseItemClass} ${
                      active ? activeClass : inactiveClass
                    }`}
                    title={isSidebarCollapsed ? item.label : ""}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`text-lg flex-shrink-0 ${
                          active
                            ? "text-blue-600"
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />
                      {!isSidebarCollapsed && <span>{item.label}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
