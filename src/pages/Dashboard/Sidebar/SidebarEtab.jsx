import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaClipboardList,
  FaRegFileAlt,
  FaTimes,
  FaFileContract,
  FaSync,
  FaChartBar,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { ThemeContext } from "../../../context/ThemeContext";

export default function SidebarEtab({
  collapsed,
  setCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  user,
}) {
  const canRead = user?.can_read !== false;
  const isSidebarCollapsed = collapsed;
  const toggleSidebar = () => setCollapsed(!collapsed);
  
  const location = useLocation();
  const navigate = useNavigate();

  const { theme, toggleTheme } = useContext(ThemeContext);

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
    const currentPath = location.pathname;

    if (path === "/dashboard/etablissement") {
      return (
        currentPath === path || currentPath === "/dashboard/etablissement/"
      );
    }

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
          fixed top-0 left-0 h-full bg-white dark:bg-gray-900 z-50 border-r border-gray-100 dark:border-gray-800 shadow-xl lg:shadow-none
          transition-all duration-300 ease-in-out flex flex-col
          ${isSidebarCollapsed ? "w-20" : "w-72"}
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* HEADER LOGO + BOUTONS */}
        <div className="h-20 flex items-center justify-center px-6 border-b border-gray-50 dark:border-gray-800 mb-4 relative">
          {!isSidebarCollapsed && (
            <div
              className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
              onClick={() => goTo("/dashboard/etablissement")}
            >
              <span className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400 font-henno">
                HAE
              </span>
            </div>
          )}

          {/* TOGGLE BUTTON (Desktop only) */}
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg text-gray-400 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden lg:block ${
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

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar pb-6">
          {!canRead ? (
            <div className="flex flex-col items-center justify-center h-full px-6 py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                <FaTimes className="text-red-500" />
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Accès non autorisé
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Vous n'avez pas la permission de consulter ce contenu.
              </p>
            </div>
          ) : (
            navItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-6">
                {!isSidebarCollapsed && section.section && (
                  <div className="px-6 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
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
                              ? "text-blue-600 dark:text-blue-300"
                              : "text-gray-400 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200"
                          }`}
                        />
                        {!isSidebarCollapsed && <span>{item.label}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </nav>

        {/* BOUTON MODE SOMBRE/CLAIR EN BAS */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-3 py-3">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium
                       bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              {theme === "dark" ? (
                <FaMoon className="text-lg text-yellow-400" />
              ) : (
                <FaSun className="text-lg text-yellow-400" />
              )}
              {!isSidebarCollapsed && (
                <span>{theme === "dark" ? "Mode sombre" : "Mode clair"}</span>
              )}
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
