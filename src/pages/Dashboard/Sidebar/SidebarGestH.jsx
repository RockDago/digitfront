import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaInbox,
  FaSync,
  FaUniversity,
  FaUserCheck,
  FaMoon,
  FaSun,
  FaTachometerAlt,
} from "react-icons/fa";
import { ThemeContext } from "../../../context/ThemeContext";

export default function SidebarGestH({
  collapsed,
  setCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  user,
}) {
  const canRead = user?.can_read !== false;
  const location = useLocation();
  const navigate = useNavigate();

  const { theme, toggleTheme } = useContext(ThemeContext);

  const collapsedValue = !!collapsed;

  const handleToggleSidebar = () => setCollapsed && setCollapsed((prev) => !prev);

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
      section: null,
      items: [
        {
          to: "/dashboard/gestionnaire-habilitation",
          icon: FaTachometerAlt,
          label: "Tableau de bord",
        },
      ],
    },
    {
      section: null,
      items: [
        {
          to: "/dashboard/gestionnaire-habilitation/demandes-habilitation",
          icon: FaInbox,
          label: "Demandes d'habilitation",
        },
        {
          to: "/dashboard/gestionnaire-habilitation/demandes-renouvellement",
          icon: FaSync,
          label: "Demandes de renouvellement",
        },
      ],
    },
    {
      section: null,
      items: [
        {
          to: "/dashboard/gestionnaire-habilitation/universites-habilitees",
          icon: FaUniversity,
          label: "Universités habilitées",
        },
      ],
    },
    {
      section: null,
      items: [
        {
          to: "/dashboard/gestionnaire-habilitation/assigner-expert",
          icon: FaUserCheck,
          label: "Dossier assigner à un expert",
        },
      ],
    },
  ];

  const isLinkActive = (path) => {
    const currentPath = location.pathname;

    if (path === "/dashboard/gestionnaire-habilitation") {
      return (
        currentPath === path ||
        currentPath === "/dashboard/gestionnaire-habilitation/"
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
          fixed top-0 left-0 h-full bg-white dark:bg-gray-900 z-50
          border-r border-gray-100 dark:border-gray-800 shadow-xl lg:shadow-none
          transition-all duration-300 ease-in-out flex flex-col
          ${collapsedValue ? "w-20" : "w-72"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* HEADER LOGO + BOUTONS */}
        <div className="h-20 flex items-center justify-center px-6 border-b border-gray-50 dark:border-gray-800 mb-4 relative">
          {!collapsedValue && (
            <div
              className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
              onClick={() => goTo("/dashboard/gestionnaire-habilitation")}
            >
              <span className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400 font-henno">
                HAE
              </span>
            </div>
          )}

          {/* TOGGLE BUTTON (Desktop only) */}
          <button
            onClick={handleToggleSidebar}
            className={`p-2 rounded-lg text-gray-400 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden lg:block ${
              !collapsedValue ? "absolute right-4" : "mx-auto"
            }`}
            title={collapsedValue ? "Développer" : "Réduire"}
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
              <div key={sectionIndex} className="mb-1">
                {/* Pas de titre de section affiché (tous null) */}
                {section.items.map((item) => {
                  const active = isLinkActive(item.to);
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.to}
                      onClick={() => goTo(item.to)}
                      className={`${baseItemClass} ${
                        active ? activeClass : inactiveClass
                      }`}
                      title={collapsedValue ? item.label : ""}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`text-lg flex-shrink-0 ${
                            active
                              ? "text-blue-600 dark:text-blue-300"
                              : "text-gray-400 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200"
                          }`}
                        />
                        {!collapsedValue && <span>{item.label}</span>}
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
              {!collapsedValue && (
                <span>{theme === "dark" ? "Mode sombre" : "Mode clair"}</span>
              )}
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
