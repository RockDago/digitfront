import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaBars, FaChevronDown } from "react-icons/fa";
import UserService from "../../../services/user.service";

export default function Navbar({
  collapsed,
  user,
  onLogoutClick,
  onMobileMenuClick,
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const profileRef = useRef(null);

  // ✅ Génération dynamique du lien profil selon le rôle
  const getProfileLink = () => {
    const rolePathMap = {
      Admin: "/dashboard/admin/profile",
      admin: "/dashboard/admin/profile",
      Requerant: "/dashboard/requerant/profile",
      Etablissement: "/dashboard/etablissement/profile",
      SAE: "/dashboard/sae/profile",
      SICP: "/dashboard/sicp/profile",
      CNH: "/dashboard/cnh/profile",
      Expert: "/dashboard/expert/profile",
      Universite: "/dashboard/universite/profile",
    };
    return rolePathMap[user?.role] || "/dashboard/profile";
  };

  // --- GESTION IMAGE PROFIL ---
  useEffect(() => {
    const loadProfileImage = () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      // ✅ CORRECTION ICI : Récupérer le token pour vérifier l'auth
      const token = localStorage.getItem("token");

      if (storedUser.profileImage) {
        setProfileImage(storedUser.profileImage);
      } else if (storedUser.id && token) {
        // ✅ On vérifie token avant d'appeler
        const fetchProfileImage = async () => {
          try {
            const profileData = await UserService.getMyProfile();
            if (profileData.logo) {
              const imageURL = UserService.buildProfileImageUrl(
                profileData.logo,
              );
              setProfileImage(imageURL);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...storedUser, profileImage: imageURL }),
              );
            }
          } catch (error) {
            // Ignorer l'erreur si c'est juste le token qui manque (cas logout)
            if (error.message !== "Token d'authentification manquant") {
              console.error("Erreur chargement image profil:", error);
            }
          }
        };
        fetchProfileImage();
      }
    };

    loadProfileImage();

    const handleProfileUpdate = (e) => {
      if (e.detail?.profileImage) setProfileImage(e.detail.profileImage);
    };

    window.addEventListener("profileImageUpdated", handleProfileUpdate);
    return () =>
      window.removeEventListener("profileImageUpdated", handleProfileUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfileMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ LOGIQUE DE CONFIRMATION
  const handleLogoutRequest = () => {
    setShowProfileMenu(false);
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    if (onLogoutClick) onLogoutClick();
  };

  return (
    <>
      <header
        className="fixed top-0 right-0 h-16 md:h-20 bg-white shadow-sm z-30 flex items-center justify-between px-4 md:px-8 border-b border-gray-200 transition-all duration-300"
        style={{
          left:
            window.innerWidth >= 1024 ? (collapsed ? "5rem" : "18rem") : "0",
        }}
      >
        <div className={`absolute inset-0 pointer-events-none lg:hidden`} />

        {/* Burger Mobile */}
        <div className="flex items-center">
          <button
            onClick={onMobileMenuClick}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <FaBars className="text-xl" />
          </button>
        </div>

        {/* Droite : Profil */}
        <div className="flex items-center space-x-3 md:space-x-6">
          {/* Profil */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 md:space-x-3 p-1.5 pr-2 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profil"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="font-bold text-xs">
                    {user?.prenom?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-sm font-semibold text-gray-700">
                  {user?.prenom}
                </div>
                <div className="text-[10px] text-gray-500">{user?.role}</div>
              </div>
              <FaChevronDown className="text-gray-400 text-xs hidden md:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-2">
                <div className="px-4 py-3 border-b border-gray-100 mb-1">
                  <p className="font-semibold text-sm text-gray-800">
                    {user?.prenom} {user?.nom}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>

                {/* ✅ LIEN DYNAMIQUE VERS LE PROFIL */}
                <Link
                  to={getProfileLink()}
                  className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <FaUser /> <span>Mon Profil</span>
                </Link>

                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleLogoutRequest}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt /> <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ✅ MODAL DE DÉCONNEXION */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-[fadeIn_0.2s_ease-out]"
            role="dialog"
            aria-modal="true"
          >
            <div className="p-6 text-center">
              {/* Icône */}
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-6 ring-4 ring-red-50/50">
                <FaSignOutAlt className="text-red-500 text-2xl" />
              </div>

              {/* Textes */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Déconnexion
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Voulez-vous vraiment quitter ? <br />
                Vous devrez vous reconnecter pour accéder au tableau de bord.
              </p>

              {/* Boutons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-gray-900 focus:ring-4 focus:ring-gray-100 transition-all duration-200"
                >
                  Annuler
                </button>

                <button
                  onClick={handleConfirmLogout}
                  className="flex-1 px-5 py-2.5 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-xl hover:bg-red-700 focus:ring-4 focus:ring-red-100 shadow-lg shadow-red-500/30 transition-all duration-200"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
