// C:\Users\hp\Desktop\Digitalisation\frontend\src\pages\Dashboard\View\Admin\SystemLogsView.jsx

import React, { useState, useMemo, useContext, useRef, useEffect, useCallback } from "react";
import {
  FaHistory, FaSearch, FaTimes, FaDownload, FaFilePdf, FaFileExcel,
  FaSyncAlt, FaInfoCircle, FaExclamationTriangle, FaBug,
  FaPlus, FaEye, FaEdit, FaTrashAlt, FaCheckCircle, FaTimesCircle,
  FaUser, FaRobot, FaSignInAlt, FaSignOutAlt, FaShieldAlt, FaLock, FaKey,
  FaRegClock, FaTag, FaDatabase, FaAlignLeft,
} from "react-icons/fa";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiChevronDown } from "react-icons/hi2";
import { ThemeContext } from "../../../../context/ThemeContext";
import systemLogService from "../../../../services/systemlog.services";
import UserService from "../../../../services/user.service";

// ─── Configuration ────────────────────────────────────────────────────────────
const PER_PAGE_OPTIONS = [10, 20, 30, 40, 50, 100, 150, 200];

const ROLE_LABELS = {
  Admin: "Administrateur", admin: "Administrateur",
  Requerant: "Requérant", Etablissement: "Établissement",
  SAE: "Service SAE", SICP: "Service SICP", CNH: "Service CNH",
  Expert: "Expert Évaluateur", Universite: "Université",
};

const formatRole = (role) => {
  if (!role) return "";
  if (ROLE_LABELS[role]) return ROLE_LABELS[role];
  return role.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim().replace(/\b\w/g, (c) => c.toUpperCase());
};

const ACTION_CFG = {
  Créer:          { bg: "bg-green-100 dark:bg-green-900/30",   text: "text-green-700 dark:text-green-400",   icon: <FaPlus className="text-[10px]" />,       label: "Créer",         group: "crud"     },
  Lire:           { bg: "bg-blue-100 dark:bg-blue-900/30",     text: "text-blue-700 dark:text-blue-400",     icon: <FaEye className="text-[10px]" />,        label: "Lire",          group: "crud"     },
  Modifier:       { bg: "bg-amber-100 dark:bg-amber-900/30",   text: "text-amber-700 dark:text-amber-400",   icon: <FaEdit className="text-[10px]" />,       label: "Modifier",      group: "crud"     },
  Supprimer:      { bg: "bg-red-100 dark:bg-red-900/30",       text: "text-red-700 dark:text-red-400",       icon: <FaTrashAlt className="text-[10px]" />,   label: "Supprimer",     group: "crud"     },
  Connexion:      { bg: "bg-teal-100 dark:bg-teal-900/30",     text: "text-teal-700 dark:text-teal-400",     icon: <FaSignInAlt className="text-[10px]" />,  label: "Connexion",     group: "auth"     },
  Déconnexion:    { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-400", icon: <FaSignOutAlt className="text-[10px]" />, label: "Déconnexion",   group: "auth"     },
  "Mot de passe": { bg: "bg-cyan-100 dark:bg-cyan-900/30",     text: "text-cyan-700 dark:text-cyan-400",     icon: <FaKey className="text-[10px]" />,        label: "Mot de passe",  group: "auth"     },
  "Accès refusé": { bg: "bg-rose-100 dark:bg-rose-900/30",     text: "text-rose-700 dark:text-rose-400",     icon: <FaLock className="text-[10px]" />,       label: "Accès refusé",  group: "security" },
  Tentative:      { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", icon: <FaShieldAlt className="text-[10px]" />,  label: "Tentative",     group: "security" },
  Système:        { bg: "bg-gray-200 dark:bg-gray-700",        text: "text-gray-700 dark:text-gray-300",     icon: <FaHistory className="text-[10px]" />,    label: "Système",       group: "system"   },
};

const STAT_CARDS = [
  { key: "Créer",         Icon: FaPlus,        color: "#22c55e" },
  { key: "Lire",          Icon: FaEye,         color: "#3b82f6" },
  { key: "Modifier",      Icon: FaEdit,        color: "#f59e0b" },
  { key: "Supprimer",     Icon: FaTrashAlt,    color: "#ef4444" },
  { key: "Connexion",     Icon: FaSignInAlt,   color: "#14b8a6" },
  { key: "Déconnexion",   Icon: FaSignOutAlt,  color: "#6366f1" },
  { key: "Mot de passe",  Icon: FaKey,         color: "#06b6d4" },
  { key: "Accès refusé",  Icon: FaLock,        color: "#f43f5e" },
  { key: "Tentative",     Icon: FaShieldAlt,   color: "#f97316" },
];

const LEVEL_CARDS = [
  { key: "Info",    Icon: FaInfoCircle,         color: "#3b82f6", label: "Info"          },
  { key: "Warning", Icon: FaExclamationTriangle, color: "#f97316", label: "Avertissement" },
  { key: "Error",   Icon: FaBug,                color: "#ef4444", label: "Erreur"        },
];

const GROUP_LABELS = {
  crud: "CRUD", auth: "Authentification", security: "Sécurité", system: "Système",
};

// ─── Format date 24h ──────────────────────────────────────────────────────────
// Forcer le parsing via new Date() pour normaliser TOUT format entrant
// (y compris les formats AM/PM renvoyés par certains back-ends).
const formatDate = (ts) => {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return String(ts);
    const pad = (n) => String(n).padStart(2, "0");
    return (
      pad(d.getDate()) + "-" + pad(d.getMonth() + 1) + "-" + d.getFullYear() +
      " " +
      pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds())
    );
  } catch { return String(ts); }
};

// ─── Recherche plein-texte sur toutes les colonnes ────────────────────────────
const logMatchesSearch = (log, query, userInfoMap) => {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  const userInfo = userInfoMap[log.user_id];
  const userName = userInfo
    ? [userInfo.prenom, userInfo.nom, userInfo.role ? formatRole(userInfo.role) : ""].join(" ")
    : String(log.user_id || "");

  return [
    log.level   || "",
    log.action  || "",
    formatDate(log.timestamp_formatted || log.timestamp),
    userName,
    log.source  || "",
    log.message || "",
  ].some((f) => f.toLowerCase().includes(q));
};

// ─── Cache utilisateurs ───────────────────────────────────────────────────────
const userCache = {};

function useUserInfo(userId, embedded) {
  const [info, setInfo] = useState(embedded ? { ...embedded } : null);
  useEffect(() => {
    if (embedded) { setInfo({ ...embedded }); return; }
    if (!userId || userId === 0) { setInfo(null); return; }
    if (userCache[userId]) { setInfo(userCache[userId]); return; }
    try {
      const s = JSON.parse(localStorage.getItem("user") || "{}");
      if (s.id === userId) {
        const i = { prenom: s.prenom, nom: s.nom, role: s.role };
        userCache[userId] = i; setInfo(i); return;
      }
    } catch { /**/ }
    (async () => {
      try {
        const d = await UserService.getUserById(userId);
        const i = { prenom: d.prenom || "", nom: d.nom || "", role: d.role || null };
        userCache[userId] = i; setInfo(i);
      } catch {
        const f = { prenom: "", nom: "", role: null };
        userCache[userId] = f; setInfo(f);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  return info;
}

// ─── Badges ───────────────────────────────────────────────────────────────────
const LevelBadge = ({ level }) => {
  const MAP = {
    Info:    { color: "#3b82f6", bg: "rgba(59,130,246,0.10)",  border: "rgba(59,130,246,0.3)"  },
    Warning: { color: "#f97316", bg: "rgba(249,115,22,0.10)",  border: "rgba(249,115,22,0.3)"  },
    Error:   { color: "#ef4444", bg: "rgba(239,68,68,0.10)",   border: "rgba(239,68,68,0.3)"   },
  };
  const c = MAP[level] || MAP.Info;
  return (
    <span style={{ color: c.color, background: c.bg, border: "1px solid " + c.border, borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 700, display: "inline-block", whiteSpace: "nowrap" }}>
      {level}
    </span>
  );
};

const ActionBadge = ({ action }) => {
  const key = action || "Système";
  const c = ACTION_CFG[key];
  return c ? (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${c.bg} ${c.text}`}>
      {c.icon} {c.label}
    </span>
  ) : <span className="text-gray-400 text-xs">—</span>;
};

const UserBadge = ({ log, isDark }) => {
  const userId   = log?.user_id;
  const embedded = (log?.user_prenom || log?.user_nom || log?.user_role)
    ? { prenom: log.user_prenom || "", nom: log.user_nom || "", role: log.user_role || null }
    : null;
  const userInfo = useUserInfo(userId, embedded);
  const borderC  = isDark ? "#334155" : "#e2e8f0";

  if (!userId || userId === 0) return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 6, background: isDark ? "#1e293b" : "#f1f5f9", color: isDark ? "#64748b" : "#94a3b8", fontSize: 11, fontWeight: 600, border: "1px solid " + borderC, whiteSpace: "nowrap" }}>
      <FaRobot style={{ fontSize: 9 }} /> Système
    </span>
  );
  if (!userInfo) return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 6, background: "rgba(59,130,246,0.08)", color: "#60a5fa", fontSize: 11, fontWeight: 600, border: "1px solid rgba(59,130,246,0.2)" }}>
      <FaUser style={{ fontSize: 9 }} /> …
    </span>
  );
  const fullName  = [userInfo.prenom, userInfo.nom].filter(Boolean).join(" ");
  const roleLabel = userInfo.role ? formatRole(userInfo.role) : null;
  return (
    <span title={[fullName, roleLabel].filter(Boolean).join(" — ")} style={{ display: "inline-flex", flexDirection: "column", gap: 0, padding: "3px 8px", borderRadius: 6, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", minWidth: 100, maxWidth: 160 }}>
      {fullName && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: isDark ? "#93c5fd" : "#1d4ed8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><FaUser style={{ fontSize: 9, flexShrink: 0 }} /> {fullName}</span>}
      {roleLabel && <span style={{ fontSize: 10, color: isDark ? "#60a5fa" : "#3b82f6", paddingLeft: fullName ? 13 : 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{roleLabel}</span>}
      {!fullName && !roleLabel && <span style={{ fontSize: 11, color: "#60a5fa" }}>#{userId}</span>}
    </span>
  );
};

// ─── Bloc méta réutilisable dans la modal ─────────────────────────────────────
const MetaBlock = ({ icon, label, children, isDark, fullWidth }) => {
  const borderC = isDark ? "#334155" : "#e2e8f0";
  const bgDeep  = isDark ? "#0f172a" : "#f8fafc";
  const subC    = isDark ? "#94a3b8" : "#64748b";
  return (
    <div style={{ gridColumn: fullWidth ? "1 / -1" : undefined, padding: "10px 12px", borderRadius: 10, border: "1px solid " + borderC, background: bgDeep, display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, color: subC }}>
        {icon}
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
      </div>
      <div>{children}</div>
    </div>
  );
};

// ─── Modal détail message ─────────────────────────────────────────────────────
const MessageDetailModal = ({ log, isDark, onClose }) => {
  const bgCard  = isDark ? "#1e293b" : "#ffffff";
  const bgDeep  = isDark ? "#0f172a" : "#f8fafc";
  const borderC = isDark ? "#334155" : "#e2e8f0";
  const textC   = isDark ? "#e2e8f0" : "#1e293b";
  const subC    = isDark ? "#94a3b8" : "#64748b";
  const monoC   = isDark ? "#7dd3fc" : "#0369a1";

  const levelMap = {
    Info:    { color: "#3b82f6", bg: "rgba(59,130,246,0.10)", border: "rgba(59,130,246,0.3)" },
    Warning: { color: "#f97316", bg: "rgba(249,115,22,0.10)", border: "rgba(249,115,22,0.3)" },
    Error:   { color: "#ef4444", bg: "rgba(239,68,68,0.10)",  border: "rgba(239,68,68,0.3)"  },
  };
  const lvl = levelMap[log.level] || levelMap.Info;

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const LevelIcon = () => {
    if (log.level === "Warning") return <FaExclamationTriangle style={{ color: lvl.color, fontSize: 14 }} />;
    if (log.level === "Error")   return <FaBug                 style={{ color: lvl.color, fontSize: 14 }} />;
    return                              <FaInfoCircle          style={{ color: lvl.color, fontSize: 15 }} />;
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", padding: 16, animation: "fadeInOverlay 0.18s ease-out" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: bgCard, border: "1px solid " + borderC, borderRadius: 20, width: "100%", maxWidth: 640, maxHeight: "85vh", display: "flex", flexDirection: "column", boxShadow: "0 32px 80px rgba(0,0,0,0.35)", animation: "slideUpModal 0.22s cubic-bezier(0.16,1,0.3,1)", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px 14px", borderBottom: "1px solid " + borderC, background: isDark ? "#0f172a" : "#f8fafc", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: lvl.bg, border: "1px solid " + lvl.border, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LevelIcon />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: textC, lineHeight: 1.2 }}>Détail du log</p>
              <p style={{ fontSize: 11, color: subC, marginTop: 2 }}>ID #{log.id}</p>
            </div>
          </div>
          <button onClick={onClose}
            style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid " + borderC, background: isDark ? "#1e293b" : "#ffffff", color: subC, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? "#334155" : "#f1f5f9"; e.currentTarget.style.color = textC; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? "#1e293b" : "#ffffff"; e.currentTarget.style.color = subC; }}
          >
            <FaTimes size={13} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Grille 2×2 métadonnées */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <MetaBlock icon={<FaBug size={11} />}      label="Niveau"      isDark={isDark}><LevelBadge level={log.level} /></MetaBlock>
            <MetaBlock icon={<FaTag size={11} />}      label="Action"      isDark={isDark}><ActionBadge action={log.action} /></MetaBlock>
            <MetaBlock icon={<FaRegClock size={11} />} label="Horodatage"  isDark={isDark}>
              <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: monoC }}>
                {formatDate(log.timestamp_formatted || log.timestamp)}
              </span>
            </MetaBlock>
            <MetaBlock icon={<FaDatabase size={11} />} label="Source"      isDark={isDark}>
              <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, background: isDark ? "#0f172a" : "#e2e8f0", color: isDark ? "#94a3b8" : "#475569", fontSize: 11, fontWeight: 600, border: "1px solid " + borderC }}>
                {log.source || "—"}
              </span>
            </MetaBlock>
          </div>

          {/* Utilisateur pleine largeur */}
          <MetaBlock icon={<FaUser size={11} />} label="Utilisateur" isDark={isDark} fullWidth>
            <UserBadge log={log} isDark={isDark} />
          </MetaBlock>

          {/* Message complet */}
          <div style={{ borderRadius: 12, border: "1px solid " + borderC, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: isDark ? "#0f172a" : "#f1f5f9", borderBottom: "1px solid " + borderC }}>
              <FaAlignLeft size={11} style={{ color: subC }} />
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: subC }}>Message complet</span>
            </div>
            <div style={{ padding: "14px 16px", background: bgDeep, fontSize: 13, lineHeight: 1.75, color: textC, whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 300, overflowY: "auto", fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace" }}>
              {log.message || <span style={{ color: subC, fontStyle: "italic" }}>Aucun message</span>}
            </div>
          </div>

          {/* Données supplémentaires si présentes */}
          {(log.extra_data || log.data) && (
            <div style={{ borderRadius: 12, border: "1px solid " + borderC, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: isDark ? "#0f172a" : "#f1f5f9", borderBottom: "1px solid " + borderC }}>
                <FaDatabase size={11} style={{ color: subC }} />
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: subC }}>Données supplémentaires</span>
              </div>
              <div style={{ padding: "14px 16px", background: bgDeep, fontSize: 12, lineHeight: 1.6, color: monoC, whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 200, overflowY: "auto", fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace" }}>
                {(() => {
                  try {
                    const raw = log.extra_data || log.data;
                    return typeof raw === "string"
                      ? JSON.stringify(JSON.parse(raw), null, 2)
                      : JSON.stringify(raw, null, 2);
                  } catch { return String(log.extra_data || log.data); }
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid " + borderC, display: "flex", justifyContent: "flex-end", background: isDark ? "#0f172a" : "#f8fafc", flexShrink: 0 }}>
          <button onClick={onClose}
            style={{ padding: "8px 22px", borderRadius: 10, border: "1px solid " + borderC, background: isDark ? "#1e293b" : "#ffffff", color: textC, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? "#334155" : "#f1f5f9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? "#1e293b" : "#ffffff"; }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modal confirmation ───────────────────────────────────────────────────────
const ConfirmModal = ({ title, message, onConfirm, onCancel, isDark }) => {
  const bg = isDark ? "#1e293b" : "#ffffff";
  const bd = isDark ? "#334155" : "#e2e8f0";
  const tc = isDark ? "#e2e8f0" : "#334155";
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
      <div style={{ background: bg, border: "1px solid " + bd, borderRadius: 16, padding: 24, maxWidth: 420, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: tc, marginBottom: 12 }}>{title}</h3>
        <p  style={{ fontSize: 14, color: isDark ? "#94a3b8" : "#64748b", marginBottom: 24 }}>{message}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button onClick={onCancel}  style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid " + bd, background: "transparent", color: tc, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Annuler</button>
          <button onClick={onConfirm} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Confirmer</button>
        </div>
      </div>
    </div>
  );
};

// ─── Export Menu ──────────────────────────────────────────────────────────────
function ExportMenu({ isDark, onExport }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const bg = isDark ? "#1e293b" : "#ffffff";
  const bd = isDark ? "#334155" : "#e2e8f0";
  const txt = isDark ? "#e2e8f0" : "#334155";
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 12, border: "1px solid " + bd, background: bg, color: txt, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
        <FaDownload size={12} /> Exporter
        <HiChevronDown size={15} style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 160, background: bg, border: "1px solid " + bd, borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.18)", overflow: "hidden", zIndex: 100 }}>
          <button onClick={() => { onExport("csv"); setOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", background: "transparent", border: "none", cursor: "pointer", color: txt, fontSize: 13 }} onMouseEnter={(e) => e.currentTarget.style.background = isDark ? "rgba(34,197,94,0.1)" : "#f0fdf4"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <FaFileExcel style={{ color: "#16a34a" }} size={14} /> Excel (.csv)
          </button>
          <div style={{ borderTop: "1px solid " + bd }} />
          <button onClick={() => { onExport("pdf"); setOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", background: "transparent", border: "none", cursor: "pointer", color: txt, fontSize: 13 }} onMouseEnter={(e) => e.currentTarget.style.background = isDark ? "rgba(239,68,68,0.1)" : "#fff1f2"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <FaFilePdf style={{ color: "#dc2626" }} size={14} /> PDF
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl" style={{ background: type === "error" ? "#ef4444" : "#22c55e", color: "#fff" }}>
      {type === "error" ? <FaTimesCircle size={18} /> : <FaCheckCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100"><FaTimes size={12} /></button>
    </div>
  );
};

// ─── Composant principal ──────────────────────────────────────────────────────
export default function SystemLogsView() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const borderC  = isDark ? "#334155" : "#e2e8f0";
  const headerBg = isDark ? "#0f172a" : "#f8fafc";
  const headerC  = isDark ? "#64748b" : "#94a3b8";
  const textC    = isDark ? "#e2e8f0" : "#334155";
  const subC     = isDark ? "#475569" : "#94a3b8";
  const bgCard   = isDark ? "#1e293b" : "#ffffff";
  const rowHover = isDark ? "rgba(59,130,246,0.06)" : "#f8faff";

  const [search,       setSearch]       = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [dateFrom,     setDateFrom]     = useState("");
  const [dateTo,       setDateTo]       = useState("");
  const [page,         setPage]         = useState(1);
  const [perPage,      setPerPage]      = useState(10);
  const [toast,        setToast]        = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [logs,         setLogs]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [totalLogs,    setTotalLogs]    = useState(0);
  const [totalPages,   setTotalPages]   = useState(1);
  const [allSources,   setAllSources]   = useState([]);
  const [actionStats,  setActionStats]  = useState({});
  const [levelStats,   setLevelStats]   = useState({ Info: 0, Warning: 0, Error: 0 });
  const [detailLog,    setDetailLog]    = useState(null);  // modal détail
  const [userInfoMap,  setUserInfoMap]  = useState({});    // cache pour recherche

  const showToast = useCallback((type, message) => {
    let msg = message;
    if (msg && typeof msg === "object") { try { msg = JSON.stringify(msg); } catch { msg = String(msg); } }
    setToast({ type, message: msg });
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const r = await systemLogService.getLogs({
        page, per_page: perPage,
        action:    actionFilter || null,
        source:    sourceFilter || null,
        date_from: dateFrom     || null,
        date_to:   dateTo       || null,
        search:    search       || null,
      });
      setLogs(r.logs || []);
      setTotalLogs(r.total || 0);
      setTotalPages(r.total_pages || 1);
    } catch (e) {
      showToast("error", e.message || "Erreur chargement logs");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, actionFilter, sourceFilter, dateFrom, dateTo, search, showToast]);

  const fetchStatistics = useCallback(async () => {
    try {
      const s = await systemLogService.getStatistics();
      setLevelStats(s.by_level   || { Info: 0, Warning: 0, Error: 0 });
      setActionStats(s.by_action || {});
    } catch { /**/ }
  }, []);

  const fetchSources = useCallback(async () => {
    try {
      const sources = (await systemLogService.getSources()) || [];
      setAllSources(sources.filter((s) =>
        !s.includes("Module") && !s.includes("Contact") &&
        !s.includes("Actualités") && !s.includes("FAQ") && !s.includes("À propos")
      ));
    } catch { /**/ }
  }, []);

  useEffect(() => { fetchStatistics(); fetchSources(); }, [fetchStatistics, fetchSources]);
  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // Met à jour le cache userInfoMap dès que les logs changent
  useEffect(() => {
    const map = {};
    logs.forEach((log) => {
      const uid = log.user_id;
      if (!uid) return;
      if (log.user_prenom || log.user_nom || log.user_role) {
        map[uid] = { prenom: log.user_prenom || "", nom: log.user_nom || "", role: log.user_role || null };
      } else if (userCache[uid]) {
        map[uid] = userCache[uid];
      }
    });
    setUserInfoMap(map);
  }, [logs]);

  // Filtrage plein-texte côté client (double filet : couvre les champs non indexés)
  const filteredLogs = useMemo(() => {
    if (!search) return logs;
    return logs.filter((log) => logMatchesSearch(log, search, userInfoMap));
  }, [logs, search, userInfoMap]);

  const handleRefresh = () => {
    fetchLogs(); fetchStatistics(); fetchSources();
    showToast("success", "Données actualisées avec succès");
  };

  const handleExport = (type) => {
    setConfirmModal({
      title: type === "csv" ? "Exporter en Excel" : "Exporter en PDF",
      message: `Voulez-vous exporter ${logs.length} log(s) au format ${type === "csv" ? "Excel (.csv)" : "PDF"} ?`,
      onConfirm: () => {
        setConfirmModal(null);
        try {
          if (type === "csv") {
            const blob = systemLogService.exportToCSV(logs);
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement("a");
            a.href = url; a.download = "logs_" + new Date().toISOString().split("T")[0] + ".csv"; a.click();
            URL.revokeObjectURL(url);
          } else {
            const html   = systemLogService.generatePDFHtml(logs);
            const blob   = new Blob([html], { type: "text/html" });
            const url    = URL.createObjectURL(blob);
            const iframe = document.createElement("iframe");
            iframe.style.display = "none"; document.body.appendChild(iframe);
            iframe.src = url;
            iframe.onload = () => setTimeout(() => {
              iframe.contentWindow.print();
              setTimeout(() => { document.body.removeChild(iframe); URL.revokeObjectURL(url); }, 100);
            }, 250);
          }
          showToast("success", `Export ${type.toUpperCase()} réussi ! (${logs.length} entrées)`);
        } catch (e) { showToast("error", "Erreur export : " + e.message); }
      },
      onCancel: () => setConfirmModal(null),
    });
  };

  const resetFilters = () => { setSearch(""); setActionFilter(""); setSourceFilter(""); setDateFrom(""); setDateTo(""); setPage(1); };
  const hasFilter = search || actionFilter || sourceFilter || dateFrom || dateTo;
  const handlePerPageChange = (v) => { setPerPage(Number(v)); setPage(1); };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }, [totalPages, page]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 font-sans relative">
      {toast        && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmModal && <ConfirmModal {...confirmModal} isDark={isDark} />}
      {detailLog    && <MessageDetailModal log={detailLog} isDark={isDark} onClose={() => setDetailLog(null)} />}

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Logs du système</h1>
          <p className="text-xs mt-0.5" style={{ color: subC }}>{totalLogs} entrées au total</p>
        </div>
        <button onClick={handleRefresh} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 12, border: "1px solid " + borderC, background: bgCard, color: textC, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
          <FaSyncAlt className={loading ? "animate-spin" : ""} size={12} />
          {loading ? "Chargement..." : "Actualiser"}
        </button>
      </div>

      {/* Cards niveaux */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {LEVEL_CARDS.map(({ key, Icon, color, label }) => (
          <div key={key} style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#ffffff", border: "1px solid " + (isDark ? "#404855" : "#e5e7eb"), borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon style={{ color, fontSize: 16 }} />
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: isDark ? "#9ca3af" : "#6b7280", marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 22, fontWeight: 900, color, lineHeight: 1, letterSpacing: "-0.5px" }}>{levelStats[key] ?? 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cards actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {STAT_CARDS.map(({ key, Icon, color }) => (
          <div key={key} onClick={() => { setActionFilter(actionFilter === key ? "" : key); setPage(1); }}
            style={{ background: actionFilter === key ? (isDark ? `${color}18` : `${color}0f`) : (isDark ? "rgba(255,255,255,0.03)" : "#ffffff"), border: actionFilter === key ? `2px solid ${color}` : "1px solid " + (isDark ? "#404855" : "#e5e7eb"), borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "all 0.18s ease", transform: actionFilter === key ? "scale(1.02)" : "scale(1)", boxShadow: actionFilter === key ? `0 0 0 3px ${color}20` : (isDark ? "none" : "0 1px 3px rgba(0,0,0,0.04)") }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon style={{ color, fontSize: 13 }} />
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: actionFilter === key ? color : (isDark ? "#9ca3af" : "#6b7280"), marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {ACTION_CFG[key]?.label || key}
              </p>
              <p style={{ fontSize: 22, fontWeight: 900, color, lineHeight: 1, letterSpacing: "-0.5px" }}>{actionStats[key] ?? 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div style={{ background: bgCard, border: "1px solid " + borderC, borderRadius: 16, overflow: "hidden", boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)" }}>

        {/* Filtres */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid " + borderC, background: isDark ? "#0f172a" : "#f8fafc", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end" }}>

          {/* Recherche plein-texte */}
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <FaSearch style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 12 }} />
            <input
              type="text"
              placeholder="Rechercher dans toutes les colonnes…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ width: "100%", paddingLeft: 32, paddingRight: search ? 30 : 12, paddingTop: 8, paddingBottom: 8, borderRadius: 10, border: "1px solid " + (search ? "#3b82f6" : borderC), background: isDark ? "#1e293b" : "#ffffff", color: textC, fontSize: 13, outline: "none", boxSizing: "border-box", boxShadow: search ? "0 0 0 2px rgba(59,130,246,0.15)" : "none", transition: "border-color 0.15s, box-shadow 0.15s" }}
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <FaTimes size={10} />
              </button>
            )}
          </div>

          {/* Action */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: subC, letterSpacing: "0.06em" }}>Action</label>
            <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1); }} style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid " + borderC, background: isDark ? "#1e293b" : "#ffffff", color: textC, fontSize: 13, outline: "none", minWidth: 165, cursor: "pointer" }}>
              <option value="">Toutes les actions</option>
              {Object.entries(GROUP_LABELS).map(([g, gl]) => (
                <optgroup key={g} label={"-- " + gl}>
                  {Object.entries(ACTION_CFG).filter(([, v]) => v.group === g).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Source */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: subC, letterSpacing: "0.06em" }}>Source</label>
            <select value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }} style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid " + borderC, background: isDark ? "#1e293b" : "#ffffff", color: textC, fontSize: 13, outline: "none", minWidth: 150, cursor: "pointer" }}>
              <option value="">Toutes les sources</option>
              {allSources.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Dates */}
          {[["Du", dateFrom, setDateFrom], ["Au", dateTo, setDateTo]].map(([lbl, val, setter]) => (
            <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 10, background: isDark ? "#1e293b" : "#ffffff", border: "1px solid " + borderC }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: subC }}>{lbl}</span>
              <input type="date" value={val} onChange={(e) => { setter(e.target.value); setPage(1); }} style={{ background: "transparent", border: "none", outline: "none", color: textC, fontSize: 13, cursor: "pointer" }} />
            </div>
          ))}

          {hasFilter && (
            <button onClick={resetFilters} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 10, border: "1px solid " + borderC, background: isDark ? "#1e293b" : "#ffffff", color: textC, fontSize: 13, cursor: "pointer" }}>
              <FaTimes size={10} /> Réinitialiser
            </button>
          )}
          <div style={{ marginLeft: "auto" }}><ExportMenu isDark={isDark} onExport={handleExport} /></div>
        </div>

        {/* Per-page + compteur résultats */}
        <div style={{ padding: "10px 20px", borderBottom: "1px solid " + borderC, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: subC }}>Afficher</span>
          <select value={perPage} onChange={(e) => handlePerPageChange(e.target.value)} style={{ padding: "3px 8px", borderRadius: 7, border: "1px solid " + borderC, background: isDark ? "#0f172a" : "#f8fafc", color: textC, fontSize: 12, outline: "none", cursor: "pointer" }}>
            {PER_PAGE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          <span style={{ fontSize: 12, color: subC }}>entrées</span>
          {search && filteredLogs.length !== logs.length && (
            <span style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600, marginLeft: 8, background: "rgba(59,130,246,0.08)", padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(59,130,246,0.2)" }}>
              {filteredLogs.length} résultat{filteredLogs.length > 1 ? "s" : ""} sur {logs.length}
            </span>
          )}
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 920 }}>
            <thead>
              <tr style={{ background: headerBg, borderBottom: "2px solid " + borderC }}>
                {["Niveau", "Action", "Horodatage", "Utilisateur", "Source", "Message", ""].map((h, i) => (
                  <th key={i} style={{ padding: "12px 16px", textAlign: i === 6 ? "center" : "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: headerC, whiteSpace: "nowrap", borderRight: i < 6 ? "1px solid " + borderC : "none", width: i === 6 ? 52 : undefined }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "60px 20px", textAlign: "center", color: subC }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid transparent", borderBottom: "2px solid #3b82f6", animation: "spin 0.8s linear infinite" }} />
                      <span style={{ fontSize: 13 }}>Chargement des logs...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "60px 20px", textAlign: "center", color: subC }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.5 }}>
                      <FaSearch size={22} />
                      <span style={{ fontSize: 13 }}>Aucun log trouvé.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id}
                    style={{ borderBottom: "1px solid " + borderC, transition: "background 0.12s", cursor: "default" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = rowHover}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "11px 16px", borderRight: "1px solid " + borderC, whiteSpace: "nowrap" }}>
                      <LevelBadge level={log.level} />
                    </td>
                    <td style={{ padding: "11px 16px", borderRight: "1px solid " + borderC, whiteSpace: "nowrap" }}>
                      <ActionBadge action={log.action} />
                    </td>
                    {/* Horodatage 24h */}
                    <td style={{ padding: "11px 16px", borderRight: "1px solid " + borderC, whiteSpace: "nowrap", fontFamily: "monospace", fontSize: 12, color: "#3b82f6" }}>
                      {formatDate(log.timestamp_formatted || log.timestamp)}
                    </td>
                    <td style={{ padding: "11px 16px", borderRight: "1px solid " + borderC }}>
                      <UserBadge log={log} isDark={isDark} />
                    </td>
                    <td style={{ padding: "11px 16px", borderRight: "1px solid " + borderC, whiteSpace: "nowrap" }}>
                      <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, background: isDark ? "#0f172a" : "#f1f5f9", color: isDark ? "#94a3b8" : "#64748b", fontSize: 11, fontWeight: 600, border: "1px solid " + borderC }}>
                        {log.source}
                      </span>
                    </td>
                    {/* Message tronqué */}
                    <td style={{ padding: "11px 16px", fontSize: 13, color: textC, maxWidth: 320, borderRight: "1px solid " + borderC }}>
                      <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={log.message}>
                        {log.message}
                      </span>
                    </td>
                    {/* Bouton œil */}
                    <td style={{ padding: "8px 10px", textAlign: "center", width: 52 }}>
                      <button
                        onClick={() => setDetailLog(log)}
                        title="Voir le détail du message"
                        style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid " + borderC, background: isDark ? "#1e293b" : "#f8fafc", color: isDark ? "#60a5fa" : "#3b82f6", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#3b82f6"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(59,130,246,0.35)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? "#1e293b" : "#f8fafc"; e.currentTarget.style.color = isDark ? "#60a5fa" : "#3b82f6"; e.currentTarget.style.borderColor = borderC; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        <FaEye size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredLogs.length > 0 && (
          <div style={{ padding: "14px 20px", borderTop: "1px solid " + borderC, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 12, color: subC }}>
              {totalLogs > 0 ? `Affichage de ${(page - 1) * perPage + 1} à ${Math.min(page * perPage, totalLogs)} sur ${totalLogs} entrées` : "Aucune entrée"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid " + borderC, background: bgCard, color: isDark ? "#94a3b8" : "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.3 : 1 }}>
                <HiOutlineChevronLeft size={16} />
              </button>
              {pageNumbers.map((p, i) =>
                p === "..." ? (
                  <span key={"e-" + i} style={{ fontSize: 13, color: subC, padding: "0 4px" }}>…</span>
                ) : (
                  <button key={p} onClick={() => setPage(p)} style={{ width: 32, height: 32, borderRadius: 8, border: page === p ? "1px solid #3b82f6" : "1px solid " + borderC, background: page === p ? "#3b82f6" : bgCard, color: page === p ? "#fff" : (isDark ? "#94a3b8" : "#64748b"), fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    {p}
                  </button>
                )
              )}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid " + borderC, background: bgCard, color: isDark ? "#94a3b8" : "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.3 : 1 }}>
                <HiOutlineChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin          { to { transform: rotate(360deg); } }
        @keyframes pulse         { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpModal  {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .animate-spin  { animation: spin  0.8s linear     infinite; }
        .animate-pulse { animation: pulse 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}