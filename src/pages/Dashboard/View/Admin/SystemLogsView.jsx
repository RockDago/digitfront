import React, { useState, useMemo, useContext, useRef } from "react";
import {
  FaHistory, FaSearch, FaTimes, FaDownload, FaFilePdf, FaFileExcel,
  FaChevronLeft, FaChevronRight, FaSyncAlt,
  FaInfoCircle, FaExclamationTriangle, FaBug,
  FaPlus, FaEye, FaEdit, FaTrashAlt, FaCheckCircle, FaTimesCircle,
} from "react-icons/fa";
import { ThemeContext } from "../../../../context/ThemeContext";

// ─── Données ──────────────────────────────────────────────────────────────────
const ALL_LOGS = [
  { id:1,  level:"Info",    action:null,        timestamp:"2024-10-17 00:00:39", message:"Erreur cURL 28 : Délai d'attente dépassé après 20001 ms, 0 octet reçu",             source:"Client HTTP"    },
  { id:2,  level:"Warning", action:null,        timestamp:"2024-10-16 06:40:41", message:"Le bail WebSub expire le 2024-10-14T04:19:02+00:00 et doit être renouvelé",          source:"WebSub"         },
  { id:3,  level:"Error",   action:null,        timestamp:"2024-10-16 04:40:05", message:"Erreur cURL 22 : L'URL demandée a retourné l'erreur 403",                            source:"Client HTTP"    },
  { id:4,  level:"Error",   action:null,        timestamp:"2024-10-15 12:30:22", message:"Le serveur de base de données a rencontré une erreur critique",                      source:"Base de données"},
  { id:5,  level:"Warning", action:null,        timestamp:"2024-10-15 09:20:15", message:"Limite de l'API dépassée, veuillez réessayer ultérieurement",                        source:"Passerelle API" },
  { id:6,  level:"Info",    action:null,        timestamp:"2024-10-15 07:10:58", message:"Session utilisateur expirée, veuillez vous reconnecter",                             source:"Authentification"},
  { id:7,  level:"Error",   action:null,        timestamp:"2024-10-15 05:50:29", message:"Jeton d'authentification invalide fourni",                                           source:"Authentification"},
  { id:8,  level:"Error",   action:null,        timestamp:"2024-10-15 02:20:11", message:"Le serveur de base de données a rencontré une erreur critique",                      source:"Base de données"},
  { id:9,  level:"Info",    action:null,        timestamp:"2024-10-14 20:15:10", message:"Sauvegarde du système terminée avec succès",                                         source:"Sauvegarde"     },
  { id:10, level:"Warning", action:null,        timestamp:"2024-10-14 15:30:00", message:"Utilisation du disque dépassée 85 % sur la partition /var/www",                     source:"Système"        },
  { id:11, level:"Error",   action:null,        timestamp:"2024-10-14 18:05:55", message:"Échec de connexion au serveur SMTP sur le port 465",                                 source:"Messagerie"     },
  { id:12, level:"Warning", action:null,        timestamp:"2024-10-13 17:20:05", message:"Le certificat SSL expire dans 14 jours",                                             source:"Sécurité"       },
  { id:13, level:"Info",    action:null,        timestamp:"2024-10-13 10:10:10", message:"L'administrateur admin@example.com s'est connecté avec succès",                      source:"Authentification"},
  { id:14, level:"Warning", action:null,        timestamp:"2024-10-12 06:30:00", message:"Le temps de réponse a dépassé le seuil de 3000 ms",                                 source:"Passerelle API" },
  { id:15, level:"Info",    action:null,        timestamp:"2024-10-11 20:00:00", message:"Cache vidé et reconstruit pour tous les utilisateurs",                               source:"Cache"          },
  { id:16, level:"Info",    action:"Créer",     timestamp:"2024-10-17 08:15:00", message:"Nouvel utilisateur créé : marie.dupont@example.com (rôle : Éditeur)",                source:"Utilisateurs"   },
  { id:17, level:"Info",    action:"Créer",     timestamp:"2024-10-16 11:30:22", message:"Nouvelle université ajoutée : Université d'Antananarivo (ID #42)",                   source:"Universités"    },
  { id:18, level:"Info",    action:"Créer",     timestamp:"2024-10-15 14:05:10", message:"Nouvelle descente planifiée créée pour la région Analamanga (ID #87)",               source:"Descentes"      },
  { id:19, level:"Info",    action:"Créer",     timestamp:"2024-10-14 09:00:00", message:"Nouveau rôle créé : Inspecteur régional avec 12 permissions",                        source:"Rôles"          },
  { id:20, level:"Warning", action:"Créer",     timestamp:"2024-10-13 16:45:00", message:"Tentative de création d'un doublon détectée : université déjà existante",            source:"Universités"    },
  { id:21, level:"Info",    action:"Lire",      timestamp:"2024-10-17 09:00:00", message:"Export de la liste des universités demandé par admin@example.com",                   source:"Universités"    },
  { id:22, level:"Info",    action:"Lire",      timestamp:"2024-10-16 13:20:00", message:"Consultation du rapport de descente ID #87 par jean.paul@example.com",               source:"Descentes"      },
  { id:23, level:"Info",    action:"Lire",      timestamp:"2024-10-15 10:10:00", message:"Liste des utilisateurs consultée par admin@example.com (234 entrées)",               source:"Utilisateurs"   },
  { id:24, level:"Warning", action:"Lire",      timestamp:"2024-10-14 07:55:00", message:"Accès refusé à la consultation du dossier confidentiel par user@example.com",        source:"Sécurité"       },
  { id:25, level:"Info",    action:"Modifier",  timestamp:"2024-10-17 10:30:00", message:"Profil utilisateur mis à jour : jean.paul@example.com (email modifié)",              source:"Utilisateurs"   },
  { id:26, level:"Info",    action:"Modifier",  timestamp:"2024-10-16 15:00:00", message:"Statut de la descente ID #87 mis à jour : En cours → Terminée",                      source:"Descentes"      },
  { id:27, level:"Info",    action:"Modifier",  timestamp:"2024-10-15 11:45:00", message:"Paramètres système mis à jour : timeout API passé de 30s à 60s",                     source:"Système"        },
  { id:28, level:"Warning", action:"Modifier",  timestamp:"2024-10-14 14:20:00", message:"Modification des permissions du rôle Inspecteur par un compte non autorisé",         source:"Rôles"          },
  { id:29, level:"Error",   action:"Modifier",  timestamp:"2024-10-13 08:30:00", message:"Échec de la mise à jour de l'université ID #42 : contrainte de clé étrangère",       source:"Universités"    },
  { id:30, level:"Warning", action:"Supprimer", timestamp:"2024-10-17 12:00:00", message:"Utilisateur supprimé : ancien.utilisateur@example.com par admin@example.com",        source:"Utilisateurs"   },
  { id:31, level:"Warning", action:"Supprimer", timestamp:"2024-10-16 17:30:00", message:"Descente ID #65 supprimée (annulée) par l'inspecteur chef",                          source:"Descentes"      },
  { id:32, level:"Error",   action:"Supprimer", timestamp:"2024-10-15 06:10:00", message:"Tentative de suppression de l'université ID #1 échouée : enregistrements liés",     source:"Universités"    },
  { id:33, level:"Warning", action:"Supprimer", timestamp:"2024-10-14 19:00:00", message:"Rôle Éditeur supprimé — 3 utilisateurs réaffectés au rôle Lecteur",                  source:"Rôles"          },
  { id:34, level:"Error",   action:"Supprimer", timestamp:"2024-10-13 21:15:00", message:"Suppression en masse refusée : opération non autorisée sur la table universites",   source:"Base de données"},
];

// ─── Config ───────────────────────────────────────────────────────────────────
const LEVEL_CFG = {
  Info:    { color:"text-blue-600",   dark:"dark:text-blue-400",   statBg:"bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",     icon:<FaInfoCircle />,          label:"Information"   },
  Warning: { color:"text-orange-500", dark:"dark:text-orange-400", statBg:"bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800", icon:<FaExclamationTriangle />, label:"Avertissement" },
  Error:   { color:"text-red-500",    dark:"dark:text-red-400",    statBg:"bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",          icon:<FaBug />,                 label:"Erreur"        },
};
const ACTION_CFG = {
  Créer:     { bg:"bg-green-100 dark:bg-green-900/30",  text:"text-green-700 dark:text-green-400",  icon:<FaPlus     className="text-[10px]" />, label:"Créer"     },
  Lire:      { bg:"bg-blue-100 dark:bg-blue-900/30",    text:"text-blue-700 dark:text-blue-400",    icon:<FaEye      className="text-[10px]" />, label:"Lire"      },
  Modifier:  { bg:"bg-amber-100 dark:bg-amber-900/30",  text:"text-amber-700 dark:text-amber-400",  icon:<FaEdit     className="text-[10px]" />, label:"Modifier"  },
  Supprimer: { bg:"bg-red-100 dark:bg-red-900/30",      text:"text-red-700 dark:text-red-400",      icon:<FaTrashAlt className="text-[10px]" />, label:"Supprimer" },
};
const ROWS = 10;

const formatDate = (ts) => {
  const [d, t] = ts.split(" ");
  const [y, m, dd] = d.split("-");
  return `${dd}-${m}-${y} ${t}`;
};

// ─── Badges ───────────────────────────────────────────────────────────────────
const LevelBadge = ({ level }) => {
  const c = LEVEL_CFG[level];
  return <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${c.color} ${c.dark}`}><span className="text-xs">◆</span>{level}</span>;
};
const ActionBadge = ({ action }) => {
  if (!action) return <span className="text-gray-300 dark:text-gray-600 text-xs">—</span>;
  const c = ACTION_CFG[action];
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>{c.icon}{c.label}</span>;
};

// ─── Filtre select réutilisable ───────────────────────────────────────────────
const FilterSelect = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs text-gray-400 dark:text-gray-500 font-medium">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  </div>
);

// ─── Toast notification ───────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { bg: "bg-green-50 dark:bg-green-900/30", border: "border-green-500", icon: <FaCheckCircle className="text-green-500" />, text: "text-green-800 dark:text-green-300" },
    error:   { bg: "bg-red-50 dark:bg-red-900/30",     border: "border-red-500",   icon: <FaTimesCircle className="text-red-500" />,     text: "text-red-800 dark:text-red-300" },
  };
  const c = config[type];

  return (
    <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 ${c.bg} ${c.border} shadow-lg animate-slide-in-right`}>
      <span className="text-xl">{c.icon}</span>
      <p className={`text-sm font-medium ${c.text}`}>{message}</p>
      <button onClick={onClose} className={`ml-2 ${c.text} hover:opacity-70`}><FaTimes /></button>
    </div>
  );
};

// ─── Modal de confirmation ────────────────────────────────────────────────────
const ConfirmModal = ({ title, message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full mx-4 animate-scale-in">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onCancel}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition">
          Annuler
        </button>
        <button onClick={onConfirm}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
          Confirmer
        </button>
      </div>
    </div>
  </div>
);

// ─── Export helpers ───────────────────────────────────────────────────────────
const exportToCSV = (rows) => {
  try {
    const header = ["ID", "Niveau", "Action CRUD", "Horodatage", "Source", "Message"];
    const lines  = rows.map((l) => [l.id, l.level, l.action || "Système", formatDate(l.timestamp), l.source, `"${l.message.replace(/"/g, '""')}"`]);
    const csv    = [header, ...lines].map((r) => r.join(";")).join("\n");
    const blob   = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement("a");
    a.href = url;
    a.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (err) {
    console.error("Erreur export CSV:", err);
    return { success: false, error: err.message };
  }
};

const exportToPDF = (rows) => {
  try {
    const tableRows = rows.map((l) => `
      <tr>
        <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;font-size:11px">${l.id}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;color:${l.level==="Error"?"#ef4444":l.level==="Warning"?"#f97316":"#3b82f6"};font-weight:600;font-size:11px">${l.level}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;font-size:11px">${l.action || "—"}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;font-family:monospace;font-size:11px">${formatDate(l.timestamp)}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;font-size:11px"><span style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:10px">${l.source}</span></td>
        <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;max-width:320px;font-size:11px">${l.message}</td>
      </tr>`).join("");

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Logs système - ${new Date().toLocaleDateString("fr-FR")}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:Arial,sans-serif; padding:20px; }
    h1 { color:#1e40af; font-size:20px; margin-bottom:6px; }
    p { color:#6b7280; font-size:12px; margin-bottom:18px; }
    table { width:100%; border-collapse:collapse; }
    th { background:#eff6ff; color:#2563eb; font-size:11px; text-transform:uppercase; padding:10px 10px; text-align:left; border-bottom:2px solid #bfdbfe; font-weight:600; }
    tr:nth-child(even) td { background:#f9fafb; }
    @page { margin: 1.5cm; }
  </style>
</head>
<body>
  <h1>📋 Logs du système</h1>
  <p>${rows.length} entrée(s) · Exporté le ${new Date().toLocaleString("fr-FR")}</p>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Niveau</th>
        <th>Action</th>
        <th>Horodatage</th>
        <th>Source</th>
        <th>Message</th>
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframe.src = url;

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        }, 100);
      }, 250);
    };

    return { success: true };
  } catch (err) {
    console.error("Erreur export PDF:", err);
    return { success: false, error: err.message };
  }
};

// ─── Composant principal ──────────────────────────────────────────────────────
export default function SystemLogsView() {
  const { theme } = useContext(ThemeContext);
  const [search,       setSearch]       = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [dateFrom,     setDateFrom]     = useState("");
  const [dateTo,       setDateTo]       = useState("");
  const [currentPage,  setCurrentPage]  = useState(1);
  const [exportOpen,   setExportOpen]   = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast,        setToast]        = useState(null);
  const exportRef = useRef(null);

  const allSources = useMemo(() => ["All", ...Array.from(new Set(ALL_LOGS.map((l) => l.source)))], []);

  const filtered = useMemo(() => ALL_LOGS.filter((log) => {
    const q = search.toLowerCase();
    const matchSearch = !q || [log.message, log.source, log.level, log.action || ""].some((v) => v.toLowerCase().includes(q));
    const matchAction = actionFilter === "All" ? true : actionFilter === "Système" ? log.action === null : log.action === actionFilter;
    const matchSource = sourceFilter === "All" || log.source === sourceFilter;
    const logDate     = new Date(log.timestamp);
    return matchSearch && matchAction && matchSource
      && (!dateFrom || logDate >= new Date(dateFrom))
      && (!dateTo   || logDate <= new Date(dateTo + "T23:59:59"));
  }), [search, actionFilter, sourceFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const paginated  = filtered.slice((currentPage - 1) * ROWS, currentPage * ROWS);
  const hasFilter  = search || actionFilter !== "All" || sourceFilter !== "All" || dateFrom || dateTo;

  const resetFilters = () => { setSearch(""); setActionFilter("All"); setSourceFilter("All"); setDateFrom(""); setDateTo(""); setCurrentPage(1); };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }, [totalPages, currentPage]);

  const stats     = useMemo(() => Object.fromEntries(["Info","Warning","Error"].map((l) => [l, ALL_LOGS.filter((x) => x.level === l).length])), []);
  const crudStats = useMemo(() => Object.fromEntries(Object.keys(ACTION_CFG).map((a) => [a, ALL_LOGS.filter((x) => x.action === a).length])), []);

  const handleBlur = () => setTimeout(() => setExportOpen(false), 150);

  const handleExport = (type) => {
    setExportOpen(false);
    setConfirmModal({
      title: type === "csv" ? "Exporter en Excel" : "Exporter en PDF",
      message: `Voulez-vous exporter ${filtered.length} log(s) au format ${type === "csv" ? "Excel (.csv)" : "PDF"} ?`,
      onConfirm: () => {
        setConfirmModal(null);
        const result = type === "csv" ? exportToCSV(filtered) : exportToPDF(filtered);
        if (result.success) {
          setToast({ type: "success", message: `Export ${type.toUpperCase()} réussi ! (${filtered.length} entrées)` });
        } else {
          setToast({ type: "error", message: `Erreur lors de l'export : ${result.error}` });
        }
      },
      onCancel: () => setConfirmModal(null),
    });
  };

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Modal confirmation */}
      {confirmModal && <ConfirmModal {...confirmModal} />}

      {/* ── En-tête ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaHistory className="text-2xl text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white leading-tight">Logs du système</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{ALL_LOGS.length} entrées au total</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium transition">
          <FaSyncAlt className="text-xs" /> Actualiser
        </button>
      </div>

      {/* ── Stats niveaux ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {["Info","Warning","Error"].map((level) => {
          const c = LEVEL_CFG[level];
          return (
            <div key={level} className={`flex items-center gap-4 p-4 rounded-xl border cursor-default transition hover:shadow-md ${c.statBg}`}>
              <span className={`text-2xl ${c.color} ${c.dark}`}>{c.icon}</span>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{c.label}</p>
                <p className={`text-2xl font-extrabold ${c.color} ${c.dark}`}>{stats[level]}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Stats CRUD ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {Object.entries(ACTION_CFG).map(([action, cfg]) => (
          <div key={action}
            onClick={() => { setActionFilter(action === actionFilter ? "All" : action); setCurrentPage(1); }}
            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition hover:shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${actionFilter === action ? "ring-2 ring-offset-1 ring-blue-400" : ""}`}>
            <span className={`text-xl ${cfg.text}`}>{React.cloneElement(cfg.icon, { className: "text-xl" })}</span>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">{cfg.label}</p>
              <p className={`text-2xl font-extrabold ${cfg.text}`}>{crudStats[action]}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Carte principale ── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">

        {/* Barre du haut */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">Historique des événements</h2>

          {/* Bouton Export avec dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setExportOpen((o) => !o)}
              onBlur={handleBlur}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium transition">
              <FaDownload className="text-xs" /> Exporter <span className="text-xs opacity-60">▾</span>
            </button>
            {exportOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
                <button
                  onMouseDown={() => handleExport("csv")}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition font-medium">
                  <FaFileExcel className="text-base" /> Excel (.csv)
                </button>
                <div className="border-t border-gray-100 dark:border-gray-700" />
                <button
                  onMouseDown={() => handleExport("pdf")}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-medium">
                  <FaFilePdf className="text-base" /> PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filtres */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-3 items-end bg-gray-50/60 dark:bg-gray-800/60">

          {/* Recherche */}
          <div className="relative flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-400 dark:text-gray-500 font-medium mb-1">Recherche</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input type="text" placeholder="Rechercher dans les logs..." value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><FaTimes className="text-xs" /></button>
              )}
            </div>
          </div>

          <FilterSelect label="Action CRUD" value={actionFilter} onChange={(v) => { setActionFilter(v); setCurrentPage(1); }}
            options={[["All","Toutes les actions"],["Système","Système (sans CRUD)"],["Créer","Créer"],["Lire","Lire"],["Modifier","Modifier"],["Supprimer","Supprimer"]]} />

          <FilterSelect label="Source" value={sourceFilter} onChange={(v) => { setSourceFilter(v); setCurrentPage(1); }}
            options={allSources.map((s) => [s, s === "All" ? "Toutes les sources" : s])} />

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 dark:text-gray-500 font-medium">Du</label>
            <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 dark:text-gray-500 font-medium">Au</label>
            <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>

          {hasFilter && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-transparent select-none">_</label>
              <button onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-sm transition">
                <FaTimes className="text-xs" /> Réinitialiser
              </button>
            </div>
          )}
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/80">
                {["Niveau","Action CRUD","Horodatage","Source","Message"].map((h) => (
                  <th key={h} className="text-left py-3 px-5 text-sm font-semibold text-blue-500 dark:text-blue-400 whitespace-nowrap border-r last:border-r-0 border-gray-200 dark:border-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginated.length > 0 ? paginated.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/40 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 px-5 whitespace-nowrap border-r border-gray-100 dark:border-gray-700"><LevelBadge level={log.level} /></td>
                  <td className="py-3 px-5 whitespace-nowrap border-r border-gray-100 dark:border-gray-700"><ActionBadge action={log.action} /></td>
                  <td className="py-3 px-5 text-sm font-mono text-blue-400 dark:text-blue-500 whitespace-nowrap border-r border-gray-100 dark:border-gray-700">{formatDate(log.timestamp)}</td>
                  <td className="py-3 px-5 whitespace-nowrap border-r border-gray-100 dark:border-gray-700">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-medium">{log.source}</span>
                  </td>
                  <td className="py-3 px-5 text-sm text-gray-700 dark:text-gray-300 max-w-xl">{log.message}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">
                  <FaSearch className="mx-auto mb-2 text-2xl opacity-30" />
                  Aucun log trouvé pour ces critères.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-400 dark:text-gray-500">{filtered.length} résultat(s) · Page {currentPage} sur {totalPages}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
              <FaChevronLeft className="text-xs" />
            </button>
            {pageNumbers.map((p, i) =>
              p === "..." ? (
                <span key={`e-${i}`} className="px-1 text-gray-400 dark:text-gray-500 text-sm select-none">…</span>
              ) : (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${currentPage === p ? "bg-blue-600 text-white shadow-sm" : "border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                  {p}
                </button>
              )
            )}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>

      </div>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}
