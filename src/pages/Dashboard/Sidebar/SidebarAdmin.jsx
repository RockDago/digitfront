import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaUsers,
  FaCog,
  FaChevronRight,
  FaTimes,
  FaServer,
  FaEnvelope, // ✅ AJOUT de l'icône pour les messages
} from "react-icons/fa";

export default function SidebarAdmin({
  collapsed,
  setCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const adminNavItems = [
    { to: "/dashboard/admin", label: "Tableau de bord", icon: FaHome },
    {
      to: "/dashboard/admin/gerer-utilisateurs",
      label: "Gérer Utilisateurs",
      icon: FaUsers,
    },
    // ✅ AJOUT : Messages de contact
    {
      to: "/dashboard/admin/messages-contact",
      label: "Messages Contact",
      icon: FaEnvelope,
    },
  ];

  const settingsItems = [
    { label: "Accueil", path: "/dashboard/admin/gerer-parametres" },
    { label: "Service", path: "/dashboard/admin/parametre2" },
    { label: "Contact", path: "/dashboard/admin/parametre3" },
    { label: "Actualités", path: "/dashboard/admin/parametre-actualite" },
    { label: "FAQ", path: "/dashboard/admin/parametre-faq" },
  ];

  const goTo = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };
  const isLinkActive = (path) => location.pathname === path;

  const baseItemClass =
    "group flex items-center justify-between px-4 py-3 mx-3 mb-1 rounded-xl transition-all duration-200 cursor-pointer text-sm font-medium";
  const activeClass = "bg-blue-50 text-blue-600";
  const inactiveClass = "text-gray-500 hover:bg-gray-50 hover:text-gray-900";

  const subItemClass =
    "flex items-center px-4 py-2 my-1 mx-3 rounded-lg text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 transition-colors cursor-pointer pl-11";

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
        <div className="h-20 flex items-center justify-center px-6 border-b border-gray-50 mb-4 relative">
          {!collapsed && (
            <Link
              to="/"
              className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2"
            >
              <span className="text-2xl font-black tracking-tight text-blue-600 font-cassannet">
                DAAQ
              </span>
            </Link>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-gray-100 transition-colors hidden lg:block ${
              !collapsed ? "absolute right-4" : ""
            }`}
          >
            <FaBars />
          </button>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-red-500 absolute right-4"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar pb-6">
          <div className="mb-6">
            {!collapsed && (
              <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Vue d'ensemble
              </div>
            )}
            {adminNavItems.map((item) => (
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
          </div>

          <div className="mb-6">
            {!collapsed && (
              <div className="px-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Gestion
              </div>
            )}

            {renderAccordion(
              "Paramètres",
              FaCog,
              settingsOpen,
              setSettingsOpen,
              settingsItems,
            )}

            <div
              onClick={() => goTo("/dashboard/admin/etat-systeme")}
              className={`${baseItemClass} ${
                isLinkActive("/dashboard/admin/etat-systeme")
                  ? activeClass
                  : inactiveClass
              }`}
              title={collapsed ? "État du système" : ""}
            >
              <div className="flex items-center gap-3">
                <FaServer
                  className={`text-lg flex-shrink-0 ${
                    isLinkActive("/dashboard/admin/etat-systeme")
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                {!collapsed && <span>État du système</span>}
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
