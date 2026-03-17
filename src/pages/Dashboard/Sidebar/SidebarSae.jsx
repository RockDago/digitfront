import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaClipboardList,
  FaExchangeAlt,
  FaChevronRight,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { ThemeContext } from "../../../context/ThemeContext";

export default function SidebarSae({
  collapsed,
  setCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  user,
}) {
  const canRead = user?.can_read !== false;
  // --- États accordéons conservés ---
  const [accreditationOpen, setAccreditationOpen] = useState(false);
  const [equivalenceOpen, setEquivalenceOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  // --- MENU CONFIG ---
  const mainNavItems = [
    {
      to: "/dashboard/sae/tableau-de-bord",
      label: "Tableau de bord",
      icon: FaTachometerAlt, // Changé ici
    },
  ];

  const accreditationItems = [
    { label: "Liste accréditation", path: "/dashboard/sae/accreditation" },
    {
      label: "Liste des archives",
      path: "/dashboard/sae/archive-accreditation",
    },
  ];

  const equivalenceItems = [
    { label: "Liste équivalence", path: "/dashboard/sae/equivalence" },
    {
      label: "Liste des archives",
      path: "/dashboard/sae/archive-equivalence",
    },
  ];

  const goTo = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isLinkActive = (path) => location.pathname === path;

  // --- STYLES (Adaptés pour le mode sombre) ---
  const baseItemClass =
    "group flex items-center justify-between px-4 py-3 mx-3 mb-1 rounded-xl transition-all duration-200 cursor-pointer text-sm font-medium";
  const activeClass =
    "bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-300";
  const inactiveClass =
    "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white";

  const subItemClass =
    "flex items-center px-4 py-2 my-1 mx-3 rounded-lg text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 dark:text-gray-400 dark:hover:text-blue-300 dark:hover:bg-gray-800/50 transition-colors cursor-pointer pl-11";

  // --- HELPER ACCORDION (Mis à jour pour le dark mode) ---
  const renderAccordion = (title, icon, isOpen, setIsOpen, items) => {
    const Icon = icon;
    const isChildActive = items.some((item) =>
      location.pathname.includes(item.path),
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
                  ? "text-blue-600 dark:text-blue-300"
                  : "text-gray-400 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200"
              }`}
            />
            {!collapsed && <span>{title}</span>}
          </div>
          {!collapsed && (
            <FaChevronRight
              className={`text-xs text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
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
                  ? "text-blue-600 dark:text-blue-300 font-semibold bg-blue-50 dark:bg-gray-800"
                  : ""
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full mr-3 ${
                  location.pathname === subItem.path
                    ? "bg-blue-600 dark:bg-blue-400"
                    : "bg-gray-300 dark:bg-gray-600"
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
          fixed top-0 left-0 h-full bg-white dark:bg-gray-900 z-50 border-r border-gray-100 dark:border-gray-800 shadow-xl lg:shadow-none
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
        <div className="h-20 flex items-center justify-center px-6 border-b border-gray-50 dark:border-gray-800 mb-4 relative">
          {!collapsed && (
            <div
              className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
              onClick={() => goTo("/dashboard/sae/tableau-de-bord")}
            >
              <span className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400 font-henno">
                HAE
              </span>
            </div>
          )}

          {/* TOGGLE BUTTON (Desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg text-gray-400 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden lg:block ${
              !collapsed ? "absolute right-4" : "mx-auto"
            }`}
            title={collapsed ? "Développer" : "Réduire"}
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

        {/* NAVIGATION LIST */}
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
            <div className="mb-2">
              {/* Tableau de bord */}
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
                          ? "text-blue-600 dark:text-blue-300"
                          : "text-gray-400 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200"
                      }`}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                </div>
              ))}

              {/* Accordéon Accréditation */}
              {renderAccordion(
                "Accréditation",
                FaClipboardList,
                accreditationOpen,
                setAccreditationOpen,
                accreditationItems,
              )}

              {/* Accordéon Équivalence */}
              {renderAccordion(
                "Équivalence",
                FaExchangeAlt,
                equivalenceOpen,
                setEquivalenceOpen,
                equivalenceItems,
              )}
            </div>
          )}
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
