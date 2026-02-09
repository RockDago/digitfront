import React, { useState, useEffect } from "react";
import {
  Inbox,
  Archive,
  ArchiveRestore, // ✅ NOUVELLE ICÔNE AJOUTÉE
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

// Import des services
import {
  getContactMessages,
  markMessageAsRead,
  archiveContactMessage,
  unarchiveContactMessage, // ✅ AJOUTER CETTE FONCTION DANS VOS SERVICES SI PAS DÉJÀ FAIT
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
        prev.map((m) => (m.id === msg.id ? { ...m, status: "read" } : m)),
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

    // Choix de la fonction API selon l'action
    let apiCall;
    if (action === "delete") apiCall = deleteContactMessage;
    else if (action === "archive") apiCall = archiveContactMessage;
    else if (action === "unarchive") apiCall = unarchiveContactMessage; // ✅ Cas désarchiver

    const result = await apiCall(id);

    if (result.success) {
      // Message de succès personnalisé
      let msgSuccess = "";
      if (action === "delete") msgSuccess = "Message supprimé";
      else if (action === "archive") msgSuccess = "Message archivé";
      else msgSuccess = "Message désarchivé (remis en boîte de réception)";

      toast.success(msgSuccess);
      loadData();

      // Gestion de la sélection après action
      if (action === "delete" && selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      // Si on archive ou désarchive, on met à jour l'état local pour voir le bouton changer immédiatement
      else if (selectedMessage?.id === id) {
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
      return d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
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

  // --- STYLES ---
  const ACTIVE_COLOR = "bg-blue-600";
  const ACTIVE_TEXT = "text-blue-600";
  const ACTIVE_BORDER = "border-blue-600";

  const listClasses = `w-full md:w-[350px] lg:w-[400px] flex-col border-r border-slate-200 bg-white h-full ${selectedMessage ? "hidden md:flex" : "flex"}`;
  const detailClasses = `flex-1 bg-white flex-col h-full ${selectedMessage ? "flex fixed inset-0 z-50 md:static md:z-auto" : "hidden md:flex"}`;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 overflow-hidden font-sans text-slate-700 relative">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />

      {/* === COLONNE GAUCHE : LISTE === */}
      <div className={listClasses}>
        <div className="p-4 border-b border-slate-100 bg-white shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Inbox size={22} className={ACTIVE_TEXT} />
              <span>Messagerie</span>
            </h2>
            <button
              onClick={loadData}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
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
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-2
                  ${
                    filter === tab.id
                      ? `${ACTIVE_COLOR} text-white border-transparent shadow-sm`
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${filter === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Rechercher un message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="py-20 flex justify-center">
              <div
                className={`w-8 h-8 border-2 border-slate-200 border-t-current rounded-full animate-spin ${ACTIVE_TEXT}`}
              ></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 p-6 text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Inbox size={32} className="opacity-40" />
              </div>
              <p className="text-sm font-medium">Aucun message trouvé</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`group p-4 cursor-pointer hover:bg-slate-50 transition-all relative border-l-[3px]
                    ${selectedMessage?.id === msg.id ? `bg-blue-50/60 ${ACTIVE_BORDER}` : "border-transparent"}
                    ${msg.status === "unread" ? "bg-white" : "bg-slate-50/30"}`}
                >
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span
                      className={`text-sm truncate pr-2 ${msg.status === "unread" ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}
                    >
                      {msg.name}
                    </span>
                    <span
                      className={`text-[11px] whitespace-nowrap ${msg.status === "unread" ? `font-semibold ${ACTIVE_TEXT}` : "text-slate-400"}`}
                    >
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                  <div
                    className={`text-xs mb-1.5 truncate ${msg.status === "unread" ? "font-semibold text-slate-800" : "text-slate-600"}`}
                  >
                    {msg.subject}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {msg.message_preview || "..."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* === COLONNE DROITE : LECTURE === */}
      <div className={detailClasses}>
        {selectedMessage ? (
          <>
            {/* Toolbar */}
            <div className="h-16 border-b border-slate-100 flex items-center justify-between px-4 md:px-8 bg-white shrink-0 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="flex gap-2">
                  {/* BOUTON ARCHIVER / DÉSARCHIVER INTELLIGENT */}
                  {selectedMessage.status === "archived" ? (
                    <button
                      onClick={() =>
                        handleAction("unarchive", selectedMessage.id)
                      }
                      className="p-2 text-slate-500 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors flex items-center gap-2"
                      title="Désarchiver (remettre en boîte de réception)"
                    >
                      <ArchiveRestore size={18} />
                      <span className="text-sm font-medium hidden lg:inline">
                        Désarchiver
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleAction("archive", selectedMessage.id)
                      }
                      className="p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 rounded-lg transition-colors flex items-center gap-2"
                      title="Archiver"
                    >
                      <Archive size={18} />
                      <span className="text-sm font-medium hidden lg:inline">
                        Archiver
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => handleAction("delete", selectedMessage.id)}
                    className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors flex items-center gap-2"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                    <span className="text-sm font-medium hidden lg:inline">
                      Supprimer
                    </span>
                  </button>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                {selectedMessage.status === "read" ? (
                  <>
                    <CheckCircle size={14} className="text-green-500" /> Lu
                  </>
                ) : selectedMessage.status === "archived" ? (
                  <>
                    <Archive size={14} /> Archivé
                  </>
                ) : (
                  <>
                    <Clock size={14} className="text-blue-500" /> Nouveau
                  </>
                )}
              </div>
            </div>

            {/* Contenu du Message */}
            <div className="flex-1 overflow-y-auto bg-white p-5 md:p-10 scroll-smooth">
              <div className="max-w-4xl mx-auto animate-fade-in">
                {/* En-tête */}
                <div className="mb-8 pb-6 border-b border-slate-100">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight">
                    {selectedMessage.subject}
                  </h1>

                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full ${ACTIVE_COLOR} flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0`}
                      >
                        {selectedMessage.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                          {selectedMessage.name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                          <User size={14} />
                          <a
                            href={`mailto:${selectedMessage.email}`}
                            className="hover:text-blue-600 hover:underline transition-colors"
                          >
                            {selectedMessage.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-2 text-sm text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg self-start">
                      <Calendar size={14} />
                      {formatFullDate(selectedMessage.created_at)}
                    </div>
                  </div>
                </div>

                {/* Corps du texte */}
                <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed whitespace-pre-wrap text-base">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* État Vide */
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50 p-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
              <Mail size={40} className="text-slate-300 opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              Aucun message sélectionné
            </h3>
            <p className="text-slate-400 max-w-xs text-center">
              Cliquez sur un message dans la liste de gauche pour en afficher le
              contenu détaillé ici.
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
