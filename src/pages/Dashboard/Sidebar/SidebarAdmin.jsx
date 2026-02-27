import React, { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaBars,
  FaTachometerAlt,
  FaUsers,
  FaCog,
  FaChevronRight,
  FaTimes,
  FaServer,
  FaEnvelope,
  FaMoon,
  FaSun,
  FaGraduationCap,
  FaCertificate,
  FaFileAlt,
  FaUniversity,
  FaSitemap,
  FaHistory,
  FaClipboardCheck,
  FaLandmark,
  FaUserTie,
  FaBullhorn
} from "react-icons/fa";
import { ThemeContext } from "../../../context/ThemeContext";

export default function SidebarAdmin({
  collapsed,
  setCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) {
  // États d'ouverture des accordéons
  const [saeOpen, setSaeOpen] = useState(false);
  const [universiteOpen, setUniversiteOpen] = useState(false);
  const [sicpOpen, setSicpOpen] = useState(false);
  const [gestionHabilitationOpen, setGestionHabilitationOpen] = useState(false);
  const [cnhOpen, setCnhOpen] = useState(false);
  const [expertOpen, setExpertOpen] = useState(false);

  const [utilisateursOpen, setUtilisateursOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { theme, toggleTheme } = useContext(ThemeContext);

  // === 1. VUE D'ENSEMBLE ===
  const overviewItems = [
    { to: "/dashboard/admin", label: "Tableau de bord", icon: FaTachometerAlt },
    {
      to: "/dashboard/admin/messages-contact",
      label: "Messages Contact",
      icon: FaEnvelope,
    },
   {
    to: "/dashboard/admin/diffusion",
    label: "Diffusion de messages",
    icon: FaBullhorn, // ou FaPaperPlane, ou FaBroadcastTower
  },
  ];

  // === 2. MODULES MÉTIERS ===

  // CNH (Mis à jour)
  const cnhItems = [
    { label: "Tableau de bord", path: "/dashboard/admin/cnh" },
    {
      label: "Listes des demandes d'habilitations",
      path: "/dashboard/admin/cnh/demandes-habilitations",
    },
    {
      label: "Archives des demandes achevées",
      path: "/dashboard/admin/cnh/archives",
    },
  ];

  // Expert (Mis à jour)
  const expertItems = [
    { label: "Tableau de bord", path: "/dashboard/admin/expert" },
    {
      label: "Gestion des dossiers",
      path: "/dashboard/admin/expert/gestion-dossiers",
    },
    {
      label: "Transmission au CNH",
      path: "/dashboard/admin/expert/transmission",
    },
  ];

  // SAE
  const saeItems = [
    {
      subItems: [
        { label: "Tableau de bord SAE", path: "/dashboard/admin/sae" },
      ],
    },
    {
      title: "Accréditation",
      icon: FaCertificate,
      subItems: [
        {
          label: "Liste accréditation",
          path: "/dashboard/admin/sae/accreditation",
        },
        {
          label: "Liste des archives",
          path: "/dashboard/admin/sae/archive-accreditation",
        },
      ],
    },
    {
      title: "Équivalence",
      icon: FaFileAlt,
      subItems: [
        {
          label: "Liste équivalence",
          path: "/dashboard/admin/sae/equivalence",
        },
        {
          label: "Liste des archives",
          path: "/dashboard/admin/sae/archive-equivalence",
        },
      ],
    },
  ];

  // SICP
  const sicpItems = [
    { label: "Tableau de bord", path: "/dashboard/admin/sicp" },
    {
      label: "Planification descente",
      path: "/dashboard/admin/sicp/planification",
    },
    {
      label: "Géolocalisation des universités",
      path: "/dashboard/admin/sicp/geolocalisation",
    },
    {
      label: "Inspection et contrôle de performance des IES",
      path: "/dashboard/admin/sicp/inspection-performance",
    },
    {
      label: "Suivi de qualité et d'inspection des IES",
      path: "/dashboard/admin/sicp/suivi-qualite",
    },
    {
      label: "Classement & Performance",
      path: "/dashboard/admin/sicp/classement",
    },
  ];

  // Gestionnaire Habilitation
  const gestionHabilitationItems = [
    { label: "Tableau de bord", path: "/dashboard/admin/gestion-habilitation" },
    {
      label: "Demandes d'habilitation",
      path: "/dashboard/admin/gestion-habilitation/demandes",
    },
    {
      label: "Demandes de renouvellement",
      path: "/dashboard/admin/gestion-habilitation/renouvellements",
    },
    {
      label: "Universités habilitées",
      path: "/dashboard/admin/gestion-habilitation/universites",
    },
    {
      label: "Dossier assigner à un expert",
      path: "/dashboard/admin/gestion-habilitation/dossiers-expert",
    },
  ];

  // Université
  const universiteItems = [
    { label: "Tableau de bord", path: "/dashboard/admin/universite" },
    {
      label: "Classement & Performance",
      path: "/dashboard/admin/universite/classement",
    },
  ];

  // === 3. ADMINISTRATION ===

  // Gestion Utilisateurs
  const utilisateursItems = [
    {
      label: "Gérer Utilisateurs",
      path: "/dashboard/admin/gerer-utilisateurs",
    },
    {
      label: "Rôles & Permissions",
      path: "/dashboard/admin/habilitation/roles",
    },
  ];

  // Paramètres
  const settingsItems = [
    { label: "Contact", path: "/dashboard/admin/parametre3" },
    { label: "Actualités", path: "/dashboard/admin/parametre-actualite" },
    { label: "FAQ", path: "/dashboard/admin/parametre-faq" },
    { label: "À propos", path: "/dashboard/admin/parametre-apropos" },
  ];

  // === 4. SYSTÈME ===
  const systemItems = [
    {
      to: "/dashboard/admin/etat-systeme",
      label: "État du système",
      icon: FaServer,
    },
    {
      to: "/dashboard/admin/log-systeme",
      label: "Logs du système",
      icon: FaHistory,
    },
  ];

  // Fonctions de navigation
  const goTo = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isLinkActive = (path) => location.pathname === path;

  // Classes de style communes
  const baseItemClass =
    "group flex items-center justify-between px-4 py-3 mx-3 mb-1 rounded-xl transition-all duration-200 cursor-pointer text-sm font-medium";
  const activeClass =
    "bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-300";
  const inactiveClass =
    "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white";
  const subItemClass =
    "flex items-center px-4 py-2 my-1 mx-3 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-700 transition-colors cursor-pointer pl-11";

  // Composant de rendu pour les Accordéons
  const renderAccordion = (
    title,
    icon,
    isOpen,
    setIsOpen,
    items,
    hasSubGroups = false,
  ) => {
    const Icon = icon;
    let isChildActive = false;

    if (hasSubGroups) {
      isChildActive = items.some(
        (section) =>
          Array.isArray(section.subItems) &&
          section.subItems.some((item) => location.pathname === item.path),
      );
    } else {
      isChildActive =
        Array.isArray(items) &&
        items.some((item) => location.pathname === item.path);
    }

    const effectiveIsOpen = isOpen || (isChildActive && !collapsed);

    return (
      <div className="mb-1">
        <div
          onClick={() => {
            if (collapsed) setCollapsed(false);
            setIsOpen(!isOpen);
          }}
          className={`${baseItemClass} ${isChildActive ? activeClass : inactiveClass}`}
          title={collapsed ? title : ""}
        >
          <div className="flex items-center gap-3">
            <Icon
              className={`text-lg flex-shrink-0 ${
                isChildActive
                  ? "text-blue-600 dark:text-blue-300"
                  : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
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

        <div
          className={`overflow-hidden transition-all duration-300 ${
            effectiveIsOpen && !collapsed
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          {hasSubGroups
            ? items.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  {!collapsed && section.title && (
                    <div className="px-8 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </div>
                  )}
                  {section.subItems.map((subItem, subIdx) => (
                    <div
                      key={subIdx}
                      onClick={() => goTo(subItem.path)}
                      className={`${subItemClass} ${
                        location.pathname === subItem.path
                          ? "text-blue-600 dark:text-blue-300 font-semibold bg-blue-50 dark:bg-gray-700/70"
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
              ))
            : items.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => goTo(item.path)}
                  className={`${subItemClass} ${
                    location.pathname === item.path
                      ? "text-blue-600 dark:text-blue-300 font-semibold bg-blue-50 dark:bg-gray-700/70"
                      : ""
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mr-3 ${
                      location.pathname === item.path
                        ? "bg-blue-600 dark:bg-blue-400"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                  {item.label}
                </div>
              ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full
          bg-white dark:bg-gray-900
          z-50 border-r border-gray-100 dark:border-gray-800
          shadow-xl lg:shadow-none
          transition-all duration-300 ease-in-out flex flex-col
          ${collapsed ? "w-20" : "w-72"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header Logo & Actions */}
        <div className="h-20 flex items-center justify-center px-6 border-b border-gray-50 dark:border-gray-800 mb-4 relative">
          {!collapsed && (
            <Link
              to="/"
              className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2"
            >
              <span className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400 font-henno">
                HAE
              </span>
            </Link>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg text-gray-400 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden lg:block ${
              !collapsed ? "absolute right-4" : "mx-auto"
            }`}
          >
            <FaBars />
          </button>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 text-gray-400 dark:text-gray-300 hover:text-red-500 absolute right-4"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 overflow-y-auto pb-6 custom-scrollbar">
          {/* === 1. VUE D'ENSEMBLE === */}
          <div className="mb-6">
            {!collapsed && (
              <div className="px-6 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Vue d'ensemble
              </div>
            )}
            {overviewItems.map((item) => (
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
          </div>

          {/* === 2. MODULES MÉTIERS === */}
          <div className="mb-6">
            {!collapsed && (
              <div className="px-6 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Modules
              </div>
            )}
            {renderAccordion(
              "CNH",
              FaLandmark,
              cnhOpen,
              setCnhOpen,
              cnhItems,
              false,
            )}
            {renderAccordion(
              "SAE",
              FaGraduationCap,
              saeOpen,
              setSaeOpen,
              saeItems,
              true,
            )}
            {renderAccordion(
              "SICP",
              FaSitemap,
              sicpOpen,
              setSicpOpen,
              sicpItems,
              false,
            )}
            {renderAccordion(
              "Expert",
              FaUserTie,
              expertOpen,
              setExpertOpen,
              expertItems,
              false,
            )}
            {renderAccordion(
              "Gestionnaire habilitation",
              FaClipboardCheck,
              gestionHabilitationOpen,
              setGestionHabilitationOpen,
              gestionHabilitationItems,
              false,
            )}
            {renderAccordion(
              "Université",
              FaUniversity,
              universiteOpen,
              setUniversiteOpen,
              universiteItems,
              false,
            )}
          </div>

          {/* === 3. ADMINISTRATION === */}
          <div className="mb-6">
            {!collapsed && (
              <div className="px-6 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Administration
              </div>
            )}
            {renderAccordion(
              "Gestion Utilisateurs",
              FaUsers,
              utilisateursOpen,
              setUtilisateursOpen,
              utilisateursItems,
              false,
            )}
            {renderAccordion(
              "Paramètres",
              FaCog,
              settingsOpen,
              setSettingsOpen,
              settingsItems,
              false,
            )}
          </div>

          {/* === 4. SYSTÈME === */}
          <div className="mb-6">
            {!collapsed && (
              <div className="px-6 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Système
              </div>
            )}
            {systemItems.map((item) => (
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
          </div>
        </nav>

        {/* Bouton thème */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-3 py-3">
          <button
            onClick={toggleTheme}
            className="
              w-full flex items-center justify-between px-3 py-2 
              rounded-xl text-sm font-medium
              bg-gray-50 dark:bg-gray-800 
              text-gray-700 dark:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-700 
              transition-colors
            "
          >
            <div className="flex items-center gap-2">
              {theme === "dark" ? (
                <FaMoon className="text-lg text-yellow-400" />
              ) : (
                <FaSun className="text-lg text-yellow-400" />
              )}
              {!collapsed && (
                <span>{theme === "dark" ? "Mode sombre" : "Mode clair"}</span>
              )}
            </div>
          </button>
        </div>
      </aside>

      {/* Styles scrollbar moderne */}
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.4) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.4);
          border-radius: 10px;
          transition: background 0.2s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.7);
        }
        .dark .custom-scrollbar {
          scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.8);
        }
        @media (max-width: 1023px) {
          .custom-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .custom-scrollbar::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
