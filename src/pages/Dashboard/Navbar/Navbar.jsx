import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaChevronDown,
  FaBell,
  FaCheck,
  FaClipboardList,
  FaCheckCircle,
  FaCommentDots,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimes,
  FaEllipsisH,
  FaEnvelope,
  FaFileAlt,
  FaTools,
} from "react-icons/fa";
import UserService from "../../../services/user.service";
import NotificationService from "../../../services/notification.service";

const ROLE_LABELS = {
  Admin: "Administrateur",
  admin: "Administrateur",
  Requerant: "Requérant",
  Etablissement: "Établissement",
  SAE: "Service SAE",
  SICP: "Service SICP",
  CNH: "Service CNH",
  Expert: "Expert Évaluateur",
  Universite: "Université",
};

const formatRole = (role) => {
  if (!role) return "";
  if (ROLE_LABELS[role]) return ROLE_LABELS[role];
  return role
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const NOTIF_ICONS = {
  dossier: { icon: FaClipboardList, bg: "bg-blue-500", label: "Dossier reçu" },
  retour: { icon: FaFileAlt, bg: "bg-purple-500", label: "Retour dossier" },
  approuve: { icon: FaCheckCircle, bg: "bg-green-500", label: "Approuvé" },
  commentaire: {
    icon: FaCommentDots,
    bg: "bg-teal-500",
    label: "Note / Commentaire",
  },
  message: { icon: FaEnvelope, bg: "bg-indigo-500", label: "Message admin" },
  maintenance: { icon: FaTools, bg: "bg-orange-500", label: "Maintenance" },
  alerte: {
    icon: FaExclamationTriangle,
    bg: "bg-red-500",
    label: "Alerte système",
  },
  info: { icon: FaInfoCircle, bg: "bg-gray-500", label: "Information" },
};

export default function Navbar({
  collapsed,
  user,
  onLogoutClick,
  onMobileMenuClick,
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const [showDotsMenu, setShowDotsMenu] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let interval;
    const fetchNotifs = async () => {
      try {
        const notifs = await NotificationService.getMyNotifications();
        // Filter out cancelled notifications (if backend sends them) and sort
        const validNotifs = notifs.filter(n => n.status !== "cancelled");
        const formatted = validNotifs.map(n => {
            const dateObj = new Date(n.created_at);
            const time = dateObj.toLocaleString("fr-FR", { timeZone: "Indian/Antananarivo", day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '');
            return {
                ...n,
                time
            };
        });
        setNotifications(formatted);
      } catch(e) { 
        console.error("Error fetching notifications:", e); 
      }
    };

    if (user?.id) {
       fetchNotifs();
       interval = setInterval(fetchNotifs, 60000); // refresh every minute

       // Setup WebSocket connection
       const protocol = window.location.protocol === "https:" ? "wss" : "ws";
       const wsUrl = `${protocol}://${window.location.hostname}:8000/api/notifications/ws/${user.id}`;
       const ws = new WebSocket(wsUrl);

       ws.onmessage = (event) => {
         try {
           const msg = JSON.parse(event.data);
           if (msg.event === "new_notification") {
             const n = msg.data;
             const time = new Date(n.created_at).toLocaleString("fr-FR", { timeZone: "Indian/Antananarivo", day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '');
             setNotifications(prev => [{...n, time}, ...prev]);
           } else if (msg.event === "update_notification") {
             setNotifications(prev => prev.map(n => {
               if (n.id === msg.data.id) {
                 return { ...n, ...msg.data, time: n.time }; // preserve original time if not supplied
               }
               return n;
             }));
           } else if (msg.event === "cancel_notification") {
             setNotifications(prev => prev.filter(n => n.id !== msg.data.id));
           }
         } catch(e) {
           console.error("WebSocket message parsing error:", e);
         }
       };

       return () => {
         clearInterval(interval);
         ws.close();
       };
    }
  }, [user?.id]);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const modalRef = useRef(null);
  const notifListRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifs =
    activeTab === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const VISIBLE_COUNT = 4;
  const visibleNotifs = expanded
    ? filteredNotifs
    : filteredNotifs.slice(0, VISIBLE_COUNT);
  const hasMore = filteredNotifs.length > VISIBLE_COUNT;
  const newNotifs = visibleNotifs.filter((n) => !n.read);
  const earlierNotifs = visibleNotifs.filter((n) => n.read);

  const markAllAsRead = async () => {
    try {
        await NotificationService.markAllAsRead();
        setNotifications((p) => p.map((n) => ({ ...n, read: true })));
    } catch(e) { console.error(e); }
  };
  const markAsRead = async (id) => {
    try {
        await NotificationService.markAsRead(id);
        setNotifications((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch(e) { console.error(e); }
  };

  const openNotifModal = (notif) => {
    setSelectedNotification(notif);
    setShowNotificationModal(true);
    setShowNotifications(false);
    if (!notif.read) markAsRead(notif.id);
  };
  const closeNotifModal = () => {
    setShowNotificationModal(false);
    setSelectedNotification(null);
  };

  const handleExpandAndScroll = () => {
    setExpanded(true);
    setTimeout(() => {
      notifListRef.current?.scrollTo({
        top: notifListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  const getProfileLink = () => {
    const m = {
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
    return m[user?.role] || "/dashboard/profile";
  };

  // ─── FIX: Fonction isolée pour charger l'image depuis l'API ───────────────
  const fetchAndCacheProfileImage = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const profileData = await UserService.getMyProfile();
      if (profileData?.logo) {
        const imageURL = UserService.buildProfileImageUrl(profileData.logo);
        setProfileImage(imageURL);
        // Mettre à jour le cache localStorage
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({ ...storedUser, profileImage: imageURL }),
        );
      }
    } catch (error) {
      if (error.message !== "Token d'authentification manquant") {
        console.error("Erreur chargement image profil:", error);
      }
    }
  };

  // ─── FIX: Au montage, toujours appeler l'API pour avoir l'image à jour ────
  useEffect(() => {
    // 1. Afficher immédiatement l'image du cache si elle existe (évite le flash)
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser.profileImage) {
      setProfileImage(storedUser.profileImage);
    }

    // 2. Toujours re-fetcher depuis l'API pour avoir la vraie image actuelle
    //    (résout le bug : après login, l'image n'était pas affichée)
    fetchAndCacheProfileImage();

    // 3. Écouter l'événement custom (changement de photo depuis la page profil)
    const handleProfileImageUpdated = (e) => {
      if (e.detail?.profileImage) {
        setProfileImage(e.detail.profileImage);
      }
    };
    window.addEventListener("profileImageUpdated", handleProfileImageUpdated);

    // 4. Écouter les changements de localStorage (login dans un autre onglet, etc.)
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        try {
          const updatedUser = JSON.parse(e.newValue || "{}");
          if (updatedUser.profileImage) {
            setProfileImage(updatedUser.profileImage);
          }
        } catch (_) {}
      }
      // Re-fetch si le token vient d'être posé (connexion)
      if (e.key === "token" && e.newValue) {
        fetchAndCacheProfileImage();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "profileImageUpdated",
        handleProfileImageUpdated,
      );
      window.removeEventListener("storage", handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── FIX: Re-fetch quand le prop `user` change (ex: après navigation post-login)
  useEffect(() => {
    if (user?.id) {
      fetchAndCacheProfileImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfileMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
        setExpanded(false);
        setShowDotsMenu(false);
      }
      if (
        showNotificationModal &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      )
        closeNotifModal();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotificationModal]);

  useEffect(() => {
    document.body.style.overflow = showNotificationModal ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showNotificationModal]);

  useEffect(() => {
    if (!showNotifications) setExpanded(false);
  }, [showNotifications]);

  // Notification row
  const NotifRow = ({ notif }) => {
    const cfg = NOTIF_ICONS[notif.type] || NOTIF_ICONS.info;
    const IconCmp = cfg.icon;
    return (
      <div
        onClick={() => openNotifModal(notif)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] mx-2 ${
          !notif.read ? "bg-blue-50 dark:bg-[#1c2f45]" : ""
        }`}
      >
        {/* Avatar + type badge */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-[#3a3b3c] dark:to-[#4e4f50] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400 dark:text-gray-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-6 h-6 ${cfg.bg} rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#242526]`}
          >
            <IconCmp className="text-white text-[10px]" />
          </div>
        </div>
        {/* Text */}
        <div className="flex-1 min-w-0 pr-3">
          <p
            className={`text-sm leading-snug ${!notif.read ? "text-gray-900 dark:text-[#e4e6eb]" : "text-gray-600 dark:text-[#b0b3b8]"}`}
          >
            <span className={!notif.read ? "font-semibold" : "font-normal"}>
              {notif.title}
            </span>
            <span className="font-normal"> — {notif.message}</span>
          </p>
          <p
            className={`text-xs mt-0.5 font-semibold ${!notif.read ? "text-blue-500" : "text-gray-400 dark:text-[#b0b3b8]"}`}
          >
            {notif.time}
          </p>
        </div>
        {/* Unread dot */}
        {!notif.read && (
          <div className="flex-shrink-0 w-3 h-3 rounded-full bg-blue-500" />
        )}
      </div>
    );
  };

  return (
    <>
      <header
        className="fixed top-0 right-0 h-16 md:h-20 bg-white dark:bg-gray-900 shadow-sm z-30 flex items-center justify-between px-4 md:px-8 border-b border-gray-200 dark:border-gray-800 transition-all duration-300 text-gray-900 dark:text-gray-100"
        style={{
          left:
            window.innerWidth >= 1024 ? (collapsed ? "5rem" : "18rem") : "0",
        }}
      >
        <div className="absolute inset-0 pointer-events-none lg:hidden" />
        <div className="flex items-center">
          <button
            onClick={onMobileMenuClick}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg lg:hidden"
          >
            <FaBars className="text-xl" />
          </button>
        </div>
        <div className="flex-1" />

        <div className="flex items-center space-x-3 md:space-x-6">
          {/* ================== NOTIFICATIONS ================== */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <FaBell className="text-lg md:text-xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className="fixed right-0 bg-white dark:bg-[#242526] shadow-2xl border-l border-gray-200 dark:border-[#3a3b3c] z-50 flex flex-col notif-panel"
                style={{
                  top: "80px",
                  bottom: "16px",
                  width: expanded ? "460px" : "380px",
                  maxWidth: "100vw",
                  boxShadow: "-4px 0 32px rgba(0,0,0,0.18)",
                  transition: "width 0.25s cubic-bezier(0.16,1,0.3,1)",
                  borderRadius: "0 0 0 12px",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-[#e4e6eb]">
                    Notifications
                  </h3>
                  <div className="relative">
                    <button
                      onClick={() => setShowDotsMenu((v) => !v)}
                      className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#3a3b3c] flex items-center justify-center text-gray-600 dark:text-[#e4e6eb] hover:bg-gray-200 dark:hover:bg-[#4e4f50] transition-colors"
                    >
                      <FaEllipsisH className="text-sm" />
                    </button>
                    {showDotsMenu && (
                      <div className="absolute right-0 top-11 w-56 bg-white dark:bg-[#242526] rounded-xl shadow-xl border border-gray-100 dark:border-[#3a3b3c] z-10 py-1 overflow-hidden">
                        <button
                          onClick={() => {
                            markAllAsRead();
                            setShowDotsMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-[#e4e6eb] hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors"
                        >
                          <FaCheck className="text-blue-500 text-xs" />
                          Tout marquer comme lu
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 px-4 pb-3 flex-shrink-0">
                  {["all", "unread"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                        activeTab === tab
                          ? "bg-blue-100 dark:bg-[#263951] text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-[#b0b3b8] hover:bg-gray-100 dark:hover:bg-[#3a3b3c]"
                      }`}
                    >
                      {tab === "all" ? "Tout" : "Non lues"}
                    </button>
                  ))}
                </div>

                {/* List */}
                <div ref={notifListRef} className="flex-1 overflow-y-auto pb-2">
                  {filteredNotifs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-[#b0b3b8]">
                      <FaBell className="text-4xl mb-3 opacity-30" />
                      <p className="text-sm font-medium">Aucune notification</p>
                    </div>
                  ) : (
                    <>
                      {newNotifs.length > 0 && (
                        <>
                          <div className="px-4 py-2">
                            <span className="text-sm font-bold text-gray-900 dark:text-[#e4e6eb]">
                              Nouvelles
                            </span>
                          </div>
                          {newNotifs.map((n) => (
                            <NotifRow key={n.id} notif={n} />
                          ))}
                        </>
                      )}
                      {earlierNotifs.length > 0 && (
                        <>
                          <div className="px-4 py-2 mt-1">
                            <span className="text-sm font-bold text-gray-900 dark:text-[#e4e6eb]">
                              Précédentes
                            </span>
                          </div>
                          {earlierNotifs.map((n) => (
                            <NotifRow key={n.id} notif={n} />
                          ))}
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Footer */}
                {hasMore && (
                  <div className="border-t border-gray-100 dark:border-[#3a3b3c] flex-shrink-0">
                    {!expanded ? (
                      <button
                        onClick={handleExpandAndScroll}
                        className="w-full text-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-[#3a3b3c] py-3 transition-colors"
                      >
                        Voir toutes les notifications
                      </button>
                    ) : (
                      <button
                        onClick={() => setExpanded(false)}
                        className="w-full text-center text-sm font-semibold text-gray-500 dark:text-[#b0b3b8] hover:bg-gray-50 dark:hover:bg-[#3a3b3c] py-3 transition-colors"
                      >
                        Réduire
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ================== PROFIL ================== */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 md:space-x-3 p-1.5 pr-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profil"
                    className="w-full h-full object-cover"
                    onError={() => setProfileImage(null)}
                  />
                ) : (
                  <span className="font-bold text-xs">
                    {user?.prenom?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-100">
                  {user?.prenom} {user?.nom}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400">
                  {formatRole(user?.role)}
                </div>
              </div>
              <FaChevronDown
                className={`text-gray-400 dark:text-gray-300 text-xs hidden md:block transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`}
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden py-2">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 mb-1">
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                    {user?.prenom} {user?.nom}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                  <p className="text-[10px] text-blue-500 dark:text-blue-400 font-semibold mt-0.5">
                    {formatRole(user?.role)}
                  </p>
                </div>
                <Link
                  to={getProfileLink()}
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <FaUser className="text-sm" />
                  <span>Mon Profil</span>
                </Link>
                <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <FaSignOutAlt className="text-sm" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================== MODAL NOTIFICATION ================== */}
      {showNotificationModal && selectedNotification && (
        <div
          className="fixed inset-0 z-[300] notif-modal-overlay flex items-center justify-center bg-gray-900/40 backdrop-blur-sm"
          onClick={closeNotifModal}
        >
          <div
            ref={modalRef}
            className="relative bg-white dark:bg-[#242526] shadow-2xl flex flex-col notif-modal-inner"
            style={{
              width: "540px",
              maxWidth: "calc(100vw - 32px)",
              maxHeight: "calc(100vh - 112px)",
              borderRadius: "16px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
            }}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#3a3b3c] flex-shrink-0">
              <h2 className="text-base font-bold text-gray-900 dark:text-[#e4e6eb]">
                Notification
              </h2>
              <button
                onClick={closeNotifModal}
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#3a3b3c] flex items-center justify-center text-gray-600 dark:text-[#e4e6eb] hover:bg-gray-200 dark:hover:bg-[#4e4f50] transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex items-center gap-3 px-5 pt-5 pb-4">
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-[#3a3b3c] dark:to-[#4e4f50] flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400 dark:text-gray-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-6 h-6 ${NOTIF_ICONS[selectedNotification.type]?.bg || "bg-gray-500"} rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#242526]`}
                  >
                    {React.createElement(
                      NOTIF_ICONS[selectedNotification.type]?.icon ||
                        NOTIF_ICONS.info.icon,
                      { className: "text-white text-[10px]" },
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-[#e4e6eb] leading-snug mb-1">
                    {selectedNotification.title}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full text-white ${NOTIF_ICONS[selectedNotification.type]?.bg || "bg-gray-500"}`}
                    >
                      {NOTIF_ICONS[selectedNotification.type]?.label ||
                        "Information"}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-[#b0b3b8]">
                      {selectedNotification.time}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        selectedNotification.read
                          ? "bg-gray-100 dark:bg-[#3a3b3c] text-gray-500 dark:text-[#b0b3b8]"
                          : "bg-blue-100 dark:bg-[#263951] text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {selectedNotification.read ? "Lu" : "Non lu"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 dark:bg-[#3a3b3c] mx-5" />

              <div className="px-5 pt-4 pb-3">
                <p className="text-sm text-gray-800 dark:text-[#e4e6eb] leading-relaxed">
                  {selectedNotification.message}
                </p>
              </div>

              {selectedNotification.content && (
                <div className="px-5 pb-6">
                  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-[#3a3b3c] bg-gray-50 dark:bg-[#18191a]">
                    <div className="px-4 py-2.5 border-b border-gray-200 dark:border-[#3a3b3c] bg-gray-100 dark:bg-[#1e1e1e]">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-[#b0b3b8]">
                        Détails
                      </p>
                    </div>
                    <div className="px-4 py-4">
                      <p className="text-sm text-gray-700 dark:text-[#b0b3b8] whitespace-pre-line leading-relaxed">
                        {selectedNotification.content}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================== MODAL DÉCONNEXION ================== */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/30 mb-6 ring-4 ring-red-50/50 dark:ring-red-900/40">
                <FaSignOutAlt className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Déconnexion
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed mb-6">
                Voulez-vous vraiment quitter ?<br />
                Vous devrez vous reconnecter pour accéder au tableau de bord.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setShowLogoutModal(false);
                    if (onLogoutClick) onLogoutClick();
                  }}
                  className="flex-1 px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .notif-modal-overlay {
          animation: fadeIn 0.18s ease-out;
        }
        .notif-modal-inner {
          animation: slideInRight 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .notif-panel {
          animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
