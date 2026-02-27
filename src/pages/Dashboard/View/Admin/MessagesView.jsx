import React, { useState, useEffect, useContext } from "react";
import {
  Inbox,
  Archive,
  ArchiveRestore,
  Trash2,
  Search,
  RefreshCw,
  ChevronLeft,
  Mail,
  CheckCircle,
  Clock,
  User,
  Calendar,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ThemeContext } from "../../../../context/ThemeContext";

// Import des services
import {
  getContactMessages,
  markMessageAsRead,
  archiveContactMessage,
  unarchiveContactMessage,
  deleteContactMessage,
  getMessageStatistics,
} from "../../../../services/contactMessage.services";

export default function MessagesView() {
  const [messages, setMessages] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
    archived: 0,
  });

  const { theme } = useContext(ThemeContext);

  // --- CHARGEMENT ---
  useEffect(() => {
    loadData();
  }, [filter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadData = () => {
    fetchMessages();
    fetchStatistics();
  };

  const fetchMessages = async () => {
    setLoadingList(true);
    try {
      const filters = {
        status: filter === "all" ? null : filter,
        search: searchTerm || null,
      };
      const result = await getContactMessages(filters);

      if (result.success && Array.isArray(result.data)) {
        setMessages(result.data);
      } else {
        toast.error(result.error || "Erreur lors du chargement");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setLoadingList(false);
    }
  };

  const fetchStatistics = async () => {
    const result = await getMessageStatistics();
    if (result.success) setStats(result.data);
  };

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);

    // Marquer comme lu automatiquement
    if (msg.status === "unread") {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: "read" } : m))
      );
      await markMessageAsRead(msg.id);
      fetchStatistics();
    }
  };

  const handleAction = async (action, id) => {
    if (
      action === "delete" &&
      !window.confirm("Supprimer définitivement ce message ?")
    )
      return;

    let apiCall;
    if (action === "delete") apiCall = deleteContactMessage;
    else if (action === "archive") apiCall = archiveContactMessage;
    else if (action === "unarchive") apiCall = unarchiveContactMessage;

    const result = await apiCall(id);

    if (result.success) {
      let msgSuccess = "";
      if (action === "delete") msgSuccess = "Message supprimé";
      else if (action === "archive") msgSuccess = "Message archivé";
      else msgSuccess = "Message désarchivé (remis en boîte de réception)";

      toast.success(msgSuccess);
      loadData();

      if (action === "delete" && selectedMessage?.id === id) {
        setSelectedMessage(null);
      } else if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => ({
          ...prev,
          status: action === "archive" ? "archived" : "read",
        }));
      }
    } else {
      toast.error("Une erreur est survenue");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  const formatFullDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`
        flex h-[calc(100vh-64px)] 
        bg-white dark:bg-gray-900 
        overflow-hidden font-sans 
        text-gray-900 dark:text-gray-100 
        transition-colors duration-300
        relative
      `}
    >
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === "dark" ? "dark" : "light"}
      />

      {/* === COLONNE GAUCHE : LISTE === */}
      <div
        className={`
          w-full md:w-[350px] lg:w-[400px] flex-col 
          border-r border-gray-200 dark:border-gray-700 
          bg-white dark:bg-gray-800 h-full 
          ${selectedMessage ? "hidden md:flex" : "flex"}
        `}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Inbox size={22} className="text-blue-600 dark:text-blue-400" />
              <span>Messagerie</span>
            </h2>
            <button
              onClick={loadData}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
              title="Actualiser"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-3">
            {[
              { id: "all", label: "Tous", count: stats.total },
              { id: "unread", label: "Non lus", count: stats.unread },
              { id: "archived", label: "Archivés", count: stats.archived },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-2
                  ${
                    filter === tab.id
                      ? "bg-blue-600 text-white border-transparent shadow-sm"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }
                `}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`
                      px-1.5 py-0.5 rounded-full text-[10px]
                      ${filter === tab.id ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}
                    `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Rechercher un message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full bg-white dark:bg-gray-800 
                border border-gray-200 dark:border-gray-700 
                rounded-lg py-2.5 pl-10 pr-4 text-sm 
                text-gray-900 dark:text-gray-100 
                placeholder-gray-400 dark:placeholder-gray-500 
                focus:ring-2 focus:ring-blue-500/30 outline-none transition-all
              "
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400 p-6 text-center">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                <Inbox size={32} className="opacity-40" />
              </div>
              <p className="text-sm font-medium">Aucun message trouvé</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`
                    group p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-all relative border-l-[3px]
                    ${selectedMessage?.id === msg.id ? "bg-blue-50 dark:bg-blue-950/30 border-blue-600" : "border-transparent"}
                    ${msg.status === "unread" ? "bg-white dark:bg-gray-800" : "bg-gray-50/30 dark:bg-gray-900/20"}
                  `}
                >
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span
                      className={`
                        text-sm truncate pr-2 
                        ${msg.status === "unread" ? "font-bold text-gray-900 dark:text-gray-100" : "font-medium text-gray-700 dark:text-gray-200"}
                      `}
                    >
                      {msg.name}
                    </span>
                    <span
                      className={`
                        text-[11px] whitespace-nowrap 
                        ${msg.status === "unread" ? "font-semibold text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}
                      `}
                    >
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                  <div
                    className={`
                      text-xs mb-1.5 truncate 
                      ${msg.status === "unread" ? "font-semibold text-gray-800 dark:text-gray-100" : "text-gray-600 dark:text-gray-300"}
                    `}
                  >
                    {msg.subject}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {msg.message_preview || "..."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* === COLONNE DROITE : LECTURE === */}
      <div
        className={`
          flex-1 bg-white dark:bg-gray-800 flex-col h-full 
          ${selectedMessage ? "flex fixed inset-0 z-50 md:static md:z-auto" : "hidden md:flex"}
        `}
      >
        {selectedMessage ? (
          <>
            {/* Toolbar */}
            <div className="
              h-16 border-b border-gray-200 dark:border-gray-700 
              flex items-center justify-between px-4 md:px-8 
              bg-white dark:bg-gray-800 shrink-0 sticky top-0 z-10
            ">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="flex gap-2">
                  {selectedMessage.status === "archived" ? (
                    <button
                      onClick={() => handleAction("unarchive", selectedMessage.id)}
                      className="
                        p-2 text-gray-500 dark:text-gray-400 
                        hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 
                        rounded-lg transition-colors flex items-center gap-2
                      "
                      title="Désarchiver (remettre en boîte de réception)"
                    >
                      <ArchiveRestore size={18} />
                      <span className="text-sm font-medium hidden lg:inline">Désarchiver</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction("archive", selectedMessage.id)}
                      className="
                        p-2 text-gray-500 dark:text-gray-400 
                        hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 
                        rounded-lg transition-colors flex items-center gap-2
                      "
                      title="Archiver"
                    >
                      <Archive size={18} />
                      <span className="text-sm font-medium hidden lg:inline">Archiver</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleAction("delete", selectedMessage.id)}
                    className="
                      p-2 text-gray-500 dark:text-gray-400 
                      hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 
                      rounded-lg transition-colors flex items-center gap-2
                    "
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                    <span className="text-sm font-medium hidden lg:inline">Supprimer</span>
                  </button>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                {selectedMessage.status === "read" ? (
                  <>
                    <CheckCircle size={14} className="text-green-500 dark:text-green-400" /> Lu
                  </>
                ) : selectedMessage.status === "archived" ? (
                  <>
                    <Archive size={14} /> Archivé
                  </>
                ) : (
                  <>
                    <Clock size={14} className="text-blue-500 dark:text-blue-400" /> Nouveau
                  </>
                )}
              </div>
            </div>

            {/* Contenu du Message */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 p-5 md:p-10 scroll-smooth">
              <div className="max-w-4xl mx-auto animate-fade-in">
                {/* En-tête */}
                <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                    {selectedMessage.subject}
                  </h1>

                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          w-12 h-12 rounded-full bg-blue-600 
                          flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0
                        "
                      >
                        {selectedMessage.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100 text-base flex items-center gap-2">
                          {selectedMessage.name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          <User size={14} />
                          <a
                            href={`mailto:${selectedMessage.email}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                          >
                            {selectedMessage.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="
                      text-right flex items-center gap-2 text-sm 
                      text-gray-500 dark:text-gray-400 
                      bg-gray-100 dark:bg-gray-700/30 
                      px-3 py-1.5 rounded-lg self-start
                    ">
                      <Calendar size={14} />
                      {formatFullDate(selectedMessage.created_at)}
                    </div>
                  </div>
                </div>

                {/* Corps du texte */}
                <div className="prose prose-slate dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-base">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* État Vide */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-6">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <Mail size={40} className="text-gray-400 dark:text-gray-500 opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Aucun message sélectionné
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs text-center">
              Cliquez sur un message dans la liste de gauche pour en afficher le contenu détaillé ici.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}