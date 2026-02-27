// C:\Users\hp\Desktop\Digitalisation\frontend\src\pages\Dashboard\View\Admin\DiffusionMessages.jsx
import React, { useState } from "react";
import {
  FaPaperPlane,
  FaUsers,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaBell,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTools,
  FaEnvelope,
  FaTimes,
  FaCheck,
  FaSearch,
  FaHistory,
  FaEye,
} from "react-icons/fa";

const USER_GROUPS = [
  {
    id: "CNH",
    label: "Service CNH",
    color: "bg-indigo-500",
    light:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    count: 5,
  },
  {
    id: "SAE",
    label: "Service SAE",
    color: "bg-sky-500",
    light: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
    count: 3,
  },
  {
    id: "SICP",
    label: "Service SICP",
    color: "bg-cyan-500",
    light: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    count: 4,
  },
  {
    id: "Expert",
    label: "Expert Evaluateur",
    color: "bg-violet-500",
    light:
      "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
    count: 12,
  },
  {
    id: "GestionnaireHabilitation",
    label: "Gestionnaire Habilitation",
    color: "bg-teal-500",
    light: "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    count: 2,
  },
  {
    id: "Universite",
    label: "Universite",
    color: "bg-amber-500",
    light:
      "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    count: 28,
  },
  {
    id: "Requerant",
    label: "Requerant",
    color: "bg-rose-500",
    light: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    count: 134,
  },
  {
    id: "Etablissement",
    label: "Etablissement",
    color: "bg-orange-500",
    light:
      "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    count: 47,
  },
];

const NOTIF_TYPES = [
  {
    id: "message",
    label: "Message admin",
    icon: FaEnvelope,
    color: "bg-indigo-500",
  },
  {
    id: "info",
    label: "Information",
    icon: FaInfoCircle,
    color: "bg-gray-500",
  },
  {
    id: "alerte",
    label: "Alerte systeme",
    icon: FaExclamationTriangle,
    color: "bg-red-500",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: FaTools,
    color: "bg-orange-500",
  },
];

const INIT_HISTORY = [
  {
    id: 1,
    title: "Mise a jour criteres 2025",
    type: "message",
    targets: ["CNH", "SAE", "SICP"],
    date: "25/02/2025 09h14",
    read: 10,
    total: 12,
    message:
      "Informations importantes concernant la mise a jour des criteres d evaluation 2025.",
    content:
      "Chers utilisateurs,\n\nNous vous informons que les criteres d evaluation ont ete mis a jour.\n\nChangements principaux :\n- Nouveaux indicateurs de qualite pedagogique\n- Grille d evaluation revisee\n- Delais de traitement reduits a 30 jours ouvrables\n\nL equipe d administration",
  },
  {
    id: 2,
    title: "Maintenance 02/03",
    type: "maintenance",
    targets: ["all"],
    date: "24/02/2025 17h30",
    read: 235,
    total: 235,
    message: "Le systeme sera indisponible le 02/03/2025 de 00h00 a 04h00.",
    content:
      "Avis de maintenance systeme :\n\nLa plateforme sera en maintenance le :\n\n- Date : Dimanche 02 mars 2025\n- Plage horaire : 00h00 - 04h00\n- Impact : Indisponibilite totale\n\nL equipe technique",
  },
  {
    id: 3,
    title: "Delai dossier expirant",
    type: "alerte",
    targets: ["Requerant"],
    date: "23/02/2025 08h00",
    read: 98,
    total: 134,
    message:
      "Le delai de reponse pour plusieurs dossiers expire dans 48 heures.",
    content:
      "ALERTE DELAI :\n\nPlusieurs dossiers arrivent a echeance dans les prochaines 48 heures.\n\nMerci d agir rapidement en vous connectant a votre espace.",
  },
  {
    id: 4,
    title: "Nouveaux criteres habilitation",
    type: "info",
    targets: ["Expert", "GestionnaireHabilitation"],
    date: "20/02/2025 14h22",
    read: 11,
    total: 14,
    message: "Les criteres d habilitation de programme ont ete mis a jour.",
    content:
      "Information importante :\n\nLes nouveaux criteres d habilitation de programme sont disponibles.\n\nPoints cles :\n- Mise a jour de la grille d evaluation\n- Nouveaux seuils d encadrement pedagogique\n- Documentation complementaire requise",
  },
];

export default function DiffusionMessages() {
  const [targetMode, setTargetMode] = useState("groups");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [notifType, setNotifType] = useState("message");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [content, setContent] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [historyList, setHistoryList] = useState(INIT_HISTORY);
  const [selectedH, setSelectedH] = useState(null);
  const [showHModal, setShowHModal] = useState(false);
  const [editingH, setEditingH] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editMsg, setEditMsg] = useState("");
  const [editContent, setEditContent] = useState("");

  const filteredGroups = USER_GROUPS.filter((g) =>
    g.label.toLowerCase().includes(groupSearch.toLowerCase()),
  );

  const toggleGroup = (id) =>
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const totalRecipients =
    targetMode === "all"
      ? USER_GROUPS.reduce((s, g) => s + g.count, 0)
      : USER_GROUPS.filter((g) => selectedGroups.includes(g.id)).reduce(
          (s, g) => s + g.count,
          0,
        );

  const canSend =
    title.trim() &&
    message.trim() &&
    (targetMode === "all" || selectedGroups.length > 0);

  const selType = NOTIF_TYPES.find((t) => t.id === notifType);
  const TIcon = selType ? selType.icon : FaEnvelope;

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    const newEntry = {
      id: Date.now(),
      title,
      type: notifType,
      targets: targetMode === "all" ? ["all"] : [...selectedGroups],
      date: new Date()
        .toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(",", ""),
      read: 0,
      total: totalRecipients,
      message,
      content,
    };
    setHistoryList((prev) => [newEntry, ...prev]);
    setTimeout(() => {
      setSent(false);
      setTitle("");
      setMessage("");
      setContent("");
      setSelectedGroups([]);
      setTargetMode("groups");
      setNotifType("message");
    }, 2500);
  };

  const openH = (h) => {
    setSelectedH(h);
    setEditingH(false);
    setShowHModal(true);
  };
  const closeH = () => {
    setShowHModal(false);
    setEditingH(false);
    setSelectedH(null);
  };

  const saveEdit = () => {
    const updated = {
      ...selectedH,
      title: editTitle,
      message: editMsg,
      content: editContent,
    };
    setHistoryList((prev) =>
      prev.map((h) => (h.id === selectedH.id ? updated : h)),
    );
    setSelectedH(updated);
    setEditingH(false);
  };

  const deleteH = (id) => {
    setHistoryList((prev) => prev.filter((h) => h.id !== id));
    closeH();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 p-4 md:p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <FaPaperPlane className="text-white text-base" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
            Diffusion de messages
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Envoyez des notifications ciblees aux utilisateurs de la plateforme
          </p>
        </div>
      </div>

      <div className="w-full max-w-7xl space-y-5">
        {/* Destinataires */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <FaUsers className="text-blue-500" />
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
              Destinataires
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
              {[
                { v: "all", label: "Tous les utilisateurs", icon: FaUsers },
                { v: "groups", label: "Groupes cibles", icon: FaUser },
              ].map(({ v, label, icon: Icon }) => (
                <button
                  key={v}
                  onClick={() => {
                    setTargetMode(v);
                    setSelectedGroups([]);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${targetMode === v ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
                >
                  <Icon className="text-xs" />
                  {label}
                </button>
              ))}
            </div>

            {targetMode === "groups" && (
              <div className="space-y-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type="text"
                    placeholder="Rechercher un groupe..."
                    value={groupSearch}
                    onChange={(e) => setGroupSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {filteredGroups.map((group) => {
                    const sel = selectedGroups.includes(group.id);
                    return (
                      <button
                        key={group.id}
                        onClick={() => toggleGroup(group.id)}
                        className={`flex flex-col items-start gap-1 px-3 py-2.5 rounded-xl border-2 text-left transition-all duration-150 ${sel ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${group.color}`}
                          />
                          {sel && (
                            <FaCheck className="text-blue-500 text-[10px]" />
                          )}
                        </div>
                        <span
                          className={`text-xs font-semibold leading-snug ${sel ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-200"}`}
                        >
                          {group.label}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                          {group.count} utilisateur{group.count > 1 ? "s" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedGroups.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedGroups.map((id) => {
                      const g = USER_GROUPS.find((x) => x.id === id);
                      return (
                        <span
                          key={id}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${g ? g.light : ""}`}
                        >
                          {g ? g.label : id}
                          <button
                            onClick={() => toggleGroup(id)}
                            className="hover:opacity-70"
                          >
                            <FaTimes className="text-[9px]" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {(targetMode === "all" || selectedGroups.length > 0) && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <FaUsers className="text-blue-500 text-sm flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Ce message sera envoye a{" "}
                  <span className="font-bold">
                    {totalRecipients} utilisateur
                    {totalRecipients > 1 ? "s" : ""}
                  </span>
                  {targetMode === "groups" &&
                    ` (${selectedGroups.length} groupe${selectedGroups.length > 1 ? "s" : ""})`}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Type */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <FaBell className="text-blue-500" />
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
              Type de notification
            </h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {NOTIF_TYPES.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => setNotifType(id)}
                  className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl border-2 transition-all duration-150 ${notifType === id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"}`}
                >
                  <div
                    className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="text-white text-sm" />
                  </div>
                  <span
                    className={`text-xs font-semibold text-center leading-tight ${notifType === id ? "text-blue-700 dark:text-blue-300" : "text-gray-600 dark:text-gray-300"}`}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Contenu */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <FaEnvelope className="text-blue-500" />
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
              Contenu du message
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Mise a jour des criteres 2025"
                maxLength={120}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
              />
              <div className="text-right text-[10px] text-gray-400 mt-1">
                {title.length}/120
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Message resume <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Resume visible dans la liste des notifications..."
                rows={2}
                maxLength={220}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition resize-none"
              />
              <div className="text-right text-[10px] text-gray-400 mt-1">
                {message.length}/220
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Details{" "}
                <span className="text-gray-400 font-normal normal-case">
                  (optionnel)
                </span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Contenu complet affiche a l ouverture de la notification..."
                rows={5}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition resize-none"
              />
            </div>
          </div>
        </section>

        {/* Boutons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(true)}
            disabled={!title || !message}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <FaEye className="text-sm" />
            Previsualiser
          </button>
          <button
            onClick={handleSend}
            disabled={!canSend || sending || sent}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg ${sent ? "bg-green-500 text-white shadow-green-500/30" : canSend ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:brightness-110 active:scale-[0.98]" : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed shadow-none"}`}
          >
            {sent ? (
              <>
                <FaCheckCircle />
                <span>Message envoye !</span>
              </>
            ) : sending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Envoi en cours...</span>
              </>
            ) : (
              <>
                <FaPaperPlane />
                <span>Envoyer le message</span>
              </>
            )}
          </button>
        </div>

        {/* Messages envoyes */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <FaHistory className="text-blue-500 text-sm" />
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
              Messages envoyes
            </h2>
            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
              {historyList.length} message{historyList.length > 1 ? "s" : ""}
            </span>
          </div>
          {historyList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-600">
              <FaHistory className="text-3xl mb-2 opacity-30" />
              <p className="text-sm">Aucun message envoye</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {historyList.map((h) => {
                const t = NOTIF_TYPES.find((x) => x.id === h.type);
                const HIcon = t ? t.icon : FaEnvelope;
                const pct = Math.round((h.read / h.total) * 100);
                return (
                  <div
                    key={h.id}
                    onClick={() => openH(h)}
                    className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 ${t ? t.color : "bg-gray-500"} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <HIcon className="text-white text-xs" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {h.title}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {h.date}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-gray-400">
                            {h.read}/{h.total} lus
                          </span>
                        </div>
                      </div>
                      <FaEye className="text-gray-300 group-hover:text-blue-400 text-xs flex-shrink-0 mt-2 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Modal previsualisation */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 ${selType ? selType.color : "bg-gray-500"} rounded-lg flex items-center justify-center`}
                >
                  <TIcon className="text-white text-xs" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-50 text-sm">
                  Previsualisation
                </h3>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">
                  Apercu dans la liste
                </p>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <svg
                        className="w-7 h-7 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 ${selType ? selType.color : "bg-gray-500"} rounded-full flex items-center justify-center ring-2 ring-white dark:ring-blue-900`}
                    >
                      <TIcon className="text-white text-[8px]" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {message}
                    </p>
                    <p className="text-[10px] font-semibold text-blue-500 mt-0.5">
                      A l instant
                    </p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                <FaInfoCircle className="text-amber-500 flex-shrink-0 text-sm" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Sera envoye a{" "}
                  <strong>
                    {totalRecipients} utilisateur
                    {totalRecipients > 1 ? "s" : ""}
                  </strong>
                  {targetMode === "groups" &&
                    selectedGroups.length > 0 &&
                    ` - ${selectedGroups
                      .map((id) => {
                        const g = USER_GROUPS.find((g) => g.id === id);
                        return g ? g.label : id;
                      })
                      .join(", ")}`}
                </p>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    handleSend();
                  }}
                  disabled={!canSend}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:brightness-110 transition-all"
                >
                  <FaPaperPlane className="text-xs" />
                  Confirmer l envoi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal detail message envoye */}
      {showHModal && selectedH && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={closeH}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const t = NOTIF_TYPES.find((x) => x.id === selectedH.type);
              const HIcon = t ? t.icon : FaEnvelope;
              const pct = Math.round((selectedH.read / selectedH.total) * 100);
              const targetLabels = selectedH.targets.includes("all")
                ? "Tous les utilisateurs"
                : selectedH.targets
                    .map((id) => {
                      const g = USER_GROUPS.find((g) => g.id === id);
                      return g ? g.label : id;
                    })
                    .join(", ");
              return (
                <>
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 ${t ? t.color : "bg-gray-500"} rounded-lg flex items-center justify-center`}
                      >
                        <HIcon className="text-white text-sm" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-50 text-sm">
                          {editingH
                            ? "Modifier le message"
                            : "Detail du message envoye"}
                        </h3>
                        <p className="text-[10px] text-gray-400">
                          {t ? t.label : ""} - {selectedH.date}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={closeH}
                      className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>

                  <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Taux de lecture
                          </span>
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                            {selectedH.read}/{selectedH.total} utilisateurs
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-green-500">
                          {pct}%
                        </p>
                        <p className="text-[10px] text-gray-400">lus</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">
                        Destinataires
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        {targetLabels}
                      </p>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-gray-800" />

                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">
                        Titre
                      </p>
                      {editingH ? (
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                        />
                      ) : (
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {selectedH.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">
                        Message resume
                      </p>
                      {editingH ? (
                        <textarea
                          value={editMsg}
                          onChange={(e) => setEditMsg(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none"
                        />
                      ) : (
                        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                          {selectedH.message}
                        </p>
                      )}
                    </div>

                    {(selectedH.content || editingH) && (
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">
                          Details
                        </p>
                        {editingH ? (
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none"
                          />
                        ) : (
                          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden">
                            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                Contenu complet
                              </p>
                            </div>
                            <div className="px-4 py-3">
                              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                {selectedH.content}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {editingH && (
                      <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                        <FaExclamationTriangle className="text-amber-500 flex-shrink-0 text-sm mt-0.5" />
                        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                          La modification mettra a jour la notification pour
                          tous les destinataires qui ne l ont pas encore lue.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                    {editingH ? (
                      <>
                        <button
                          onClick={() => setEditingH(false)}
                          className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={saveEdit}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:brightness-110 transition-all"
                        >
                          <FaCheck className="text-xs" />
                          Enregistrer
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => deleteH(selectedH.id)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <FaTimesCircle className="text-xs" />
                          Annuler l envoi
                        </button>
                        <button
                          onClick={() => {
                            setEditTitle(selectedH.title);
                            setEditMsg(selectedH.message);
                            setEditContent(selectedH.content || "");
                            setEditingH(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <FaEnvelope className="text-xs" />
                          Modifier le message
                        </button>
                      </>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
