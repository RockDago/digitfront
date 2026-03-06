import React, { useState, useRef, useEffect, useContext } from "react";
import {
  FaEye,
  FaEdit,
  FaUserCircle,
  FaSearch,
  FaArrowLeft,
  FaCalendarAlt,
  FaTag,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUniversity,
  FaGraduationCap,
  FaInfoCircle,
  FaFileUpload,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaFilePdf,
  FaFileExcel,
  FaArchive,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  HiChevronDown,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { ThemeContext } from "../../../../context/ThemeContext";
import {
  getAllDemandesAdmin,
  updateDemandeStatutAdmin,
  archiveDemande,
  downloadDocument,
} from "../../../../services/equivalence.services";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ─── Utilitaires ──────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const canArchive = (statut) =>
  ["accorde", "rejete", "complet", "ajourne"].includes(statut);

const mapStatutToDisplay = (statut) => {
  const mapping = {
    brouillon: "Brouillon",
    soumise: "Reçu",
    en_cours: "En cours",
    complet: "Octroyé",
    ajourne: "Ajourné",
    rejete: "Rejeté",
    accorde: "Accordé",
  };
  return mapping[statut] || statut;
};

const getSubStatusStyle = (statut, isDark) => {
  const MAP = {
    brouillon: {
      color: "#64748b",
      bg: isDark ? "rgba(100,116,139,0.15)" : "rgba(100,116,139,0.1)",
      border: isDark ? "rgba(100,116,139,0.4)" : "rgba(100,116,139,0.3)",
      label: "Brouillon",
    },
    soumise: {
      color: "#0891b2",
      bg: isDark ? "rgba(8,145,178,0.15)" : "rgba(8,145,178,0.1)",
      border: isDark ? "rgba(8,145,178,0.4)" : "rgba(8,145,178,0.3)",
      label: "Reçu",
    },
    en_cours: {
      color: "#2563eb",
      bg: isDark ? "rgba(37,99,235,0.15)" : "#eff6ff",
      border: isDark ? "rgba(37,99,235,0.4)" : "#bfdbfe",
      label: "En cours",
    },
    complet: {
      color: "#7c3aed",
      bg: isDark ? "rgba(124,58,237,0.15)" : "rgba(124,58,237,0.1)",
      border: isDark ? "rgba(124,58,237,0.4)" : "rgba(124,58,237,0.3)",
      label: "Octroyé",
    },
    ajourne: {
      color: "#d97706",
      bg: isDark ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.1)",
      border: isDark ? "rgba(245,158,11,0.4)" : "rgba(217,119,6,0.3)",
      label: "Ajourné",
    },
    rejete: {
      color: "#dc2626",
      bg: isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)",
      border: isDark ? "rgba(239,68,68,0.4)" : "rgba(220,38,38,0.3)",
      label: "Rejeté",
    },
    accorde: {
      color: "#16a34a",
      bg: isDark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.1)",
      border: isDark ? "rgba(34,197,94,0.4)" : "rgba(22,163,74,0.3)",
      label: "Accordé",
    },
  };
  return (
    MAP[statut] || {
      color: "#64748b",
      bg: isDark ? "rgba(100,116,139,0.15)" : "rgba(100,116,139,0.1)",
      border: isDark ? "rgba(100,116,139,0.4)" : "rgba(100,116,139,0.3)",
      label: statut,
    }
  );
};

const subStatusOptions = [
  {
    id: "complet",
    label: "Octroyé",
    description: "Le dossier est octroyé et prêt pour la décision finale.",
    irreversible: true,
  },
  {
    id: "ajourne",
    label: "Ajourné",
    description:
      "Le dossier nécessite des informations ou documents complémentaires.",
    irreversible: true,
  },
  {
    id: "rejete",
    label: "Rejeté",
    description: "Le dossier est définitivement rejeté après examen.",
    irreversible: true,
  },
];

// ─── Sous-composants ──────────────────────────────────────────────────────────
const Section = ({
  title,
  icon,
  expanded,
  onToggle,
  isDark,
  bgCard,
  borderC,
  textC,
  children,
}) => {
  const bgDeep = isDark ? "#0f172a" : "#f8fafc";
  const subC = isDark ? "#475569" : "#94a3b8";
  return (
    <div
      style={{
        background: bgCard,
        border: `1px solid ${borderC}`,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: isDark
          ? "0 1px 6px rgba(0,0,0,0.4)"
          : "0 1px 6px rgba(0,0,0,0.06)",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "13px 18px",
          background: bgDeep,
          border: "none",
          cursor: "pointer",
          borderBottom: expanded ? `1px solid ${borderC}` : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#3b82f6", fontSize: 14 }}>{icon}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: textC }}>
            {title}
          </span>
        </div>
        {expanded ? (
          <FaChevronUp style={{ color: subC, fontSize: 12 }} />
        ) : (
          <FaChevronDown style={{ color: subC, fontSize: 12 }} />
        )}
      </button>
      {expanded && <div style={{ padding: "14px 18px" }}>{children}</div>}
    </div>
  );
};

const ActionBtn = ({
  title,
  color,
  isDark,
  borderC,
  onClick,
  disabled,
  children,
}) => (
  <button
    title={title}
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    style={{
      width: 30,
      height: 30,
      borderRadius: 8,
      border: `1px solid ${borderC}`,
      background: isDark ? "#1e293b" : "#f8fafc",
      color: disabled ? (isDark ? "#334155" : "#cbd5e1") : color,
      cursor: disabled ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.15s",
      opacity: disabled ? 0.45 : 1,
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        e.currentTarget.style.background = color;
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.borderColor = color;
      }
    }}
    onMouseLeave={(e) => {
      if (!disabled) {
        e.currentTarget.style.background = isDark ? "#1e293b" : "#f8fafc";
        e.currentTarget.style.color = color;
        e.currentTarget.style.borderColor = borderC;
      }
    }}
  >
    {children}
  </button>
);

// ✅ useState déclaré AVANT le return conditionnel (règle des hooks)
const DocumentItem = ({
  filePath,
  documentType,
  isDark,
  borderC,
  textC,
  subC,
}) => {
  const [downloading, setDownloading] = useState(false);

  if (!filePath) return null;

  const displayName = filePath.includes("/")
    ? filePath.split("/").pop()
    : filePath;

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const { blob, filename } = await downloadDocument(filePath);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || displayName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Téléchargement de "${filename || displayName}" démarré`);
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error(`Fichier introuvable sur le serveur : "${displayName}"`);
      } else {
        toast.error(
          `Impossible de télécharger "${displayName}". Vérifiez votre connexion.`,
        );
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 10px",
        background: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc",
        borderRadius: 8,
        border: `1px solid ${borderC}`,
        marginBottom: 6,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flex: 1,
          minWidth: 0,
        }}
      >
        <FaFilePdf style={{ color: "#dc2626", fontSize: 13, flexShrink: 0 }} />
        <span
          style={{
            fontSize: 12,
            color: textC,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={displayName}
        >
          {displayName}
        </span>
      </div>
      <button
        onClick={handleDownload}
        disabled={downloading}
        title={
          downloading ? "Téléchargement en cours..." : "Télécharger ce document"
        }
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          border: `1px solid ${borderC}`,
          background: downloading
            ? isDark
              ? "#334155"
              : "#e2e8f0"
            : "transparent",
          color: downloading ? "#94a3b8" : "#3b82f6",
          cursor: downloading ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginLeft: 8,
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          if (!downloading) {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.color = "#fff";
          }
        }}
        onMouseLeave={(e) => {
          if (!downloading) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#3b82f6";
          }
        }}
      >
        {downloading ? (
          <FaSpinner
            size={10}
            style={{ animation: "spin 0.8s linear infinite" }}
          />
        ) : (
          <FaDownload size={11} />
        )}
      </button>
    </div>
  );
};

const ExportMenu = ({ isDark, onExport }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const bg = isDark ? "#1e293b" : "#ffffff";
  const bd = isDark ? "#334155" : "#e2e8f0";
  const txt = isDark ? "#e2e8f0" : "#334155";
  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          borderRadius: 12,
          border: `1px solid ${bd}`,
          background: bg,
          color: txt,
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        <FaDownload size={12} /> Exporter{" "}
        <HiChevronDown
          size={15}
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "none",
          }}
        />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            width: 170,
            background: bg,
            border: `1px solid ${bd}`,
            borderRadius: 12,
            boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
            overflow: "hidden",
            zIndex: 100,
          }}
        >
          <button
            onClick={() => {
              onExport("csv");
              setOpen(false);
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 16px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: txt,
              fontSize: 13,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = isDark
                ? "rgba(34,197,94,0.1)"
                : "#f0fdf4")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <FaFileExcel style={{ color: "#16a34a" }} size={14} /> Excel (.csv)
          </button>
          <div style={{ borderTop: `1px solid ${bd}` }} />
          <button
            onClick={() => {
              onExport("pdf");
              setOpen(false);
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 16px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: txt,
              fontSize: 13,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = isDark
                ? "rgba(239,68,68,0.1)"
                : "#fff1f2")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <FaFilePdf style={{ color: "#dc2626" }} size={14} /> PDF
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Modal changement de statut ───────────────────────────────────────────────
const ActionModal = ({
  selectedDossier,
  isDark,
  bgCard,
  bgDeep,
  borderC,
  textC,
  subC,
  inputBg,
  onClose,
  onConfirm,
}) => {
  const [newSubStatus, setNewSubStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const selectedOpt = subStatusOptions.find((o) => o.id === newSubStatus);
  const needsNote = newSubStatus === "rejete" || newSubStatus === "ajourne";
  const canConfirm =
    !!newSubStatus && (!needsNote || statusNote.trim().length > 0);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: bgCard,
          border: `1px solid ${borderC}`,
          borderRadius: 20,
          width: "100%",
          maxWidth: 500,
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 22px 14px",
            borderBottom: `1px solid ${borderC}`,
            background: bgDeep,
          }}
        >
          <div>
            <p
              style={{ fontSize: 15, fontWeight: 800, color: textC, margin: 0 }}
            >
              Traiter le dossier
            </p>
            <p style={{ fontSize: 11, color: subC, margin: "3px 0 0" }}>
              EQ-{String(selectedDossier.id).padStart(4, "0")} —{" "}
              {selectedDossier.nom} {selectedDossier.prenoms}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: `1px solid ${borderC}`,
              background: bgCard,
              color: subC,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaTimes size={13} />
          </button>
        </div>

        <div
          style={{
            padding: "16px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* Statut actuel */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 10,
              background: bgDeep,
              border: `1px solid ${borderC}`,
            }}
          >
            <span style={{ fontSize: 11, color: subC, fontWeight: 600 }}>
              Statut actuel :
            </span>
            {(() => {
              const s = getSubStatusStyle(selectedDossier.statut, isDark);
              return (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: s.color,
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    padding: "2px 10px",
                    borderRadius: 999,
                  }}
                >
                  {s.label}
                </span>
              );
            })()}
          </div>

          {/* Options */}
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                color: subC,
                margin: "0 0 8px",
              }}
            >
              Nouvelle décision <span style={{ color: "#ef4444" }}>*</span>
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {subStatusOptions.map((opt) => {
                const s = getSubStatusStyle(opt.id, isDark);
                const sel = newSubStatus === opt.id;
                return (
                  <label
                    key={opt.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "11px 14px",
                      borderRadius: 12,
                      border: `1px solid ${sel ? s.color : borderC}`,
                      background: sel ? s.bg : "transparent",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <input
                      type="radio"
                      name="subStatus"
                      value={opt.id}
                      checked={sel}
                      onChange={(e) => setNewSubStatus(e.target.value)}
                      style={{
                        marginTop: 3,
                        accentColor: s.color,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: sel ? s.color : textC,
                          }}
                        >
                          {opt.label}
                        </span>
                        {opt.irreversible && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#d97706",
                              background: isDark
                                ? "rgba(245,158,11,0.15)"
                                : "rgba(245,158,11,0.1)",
                              border: "1px solid rgba(217,119,6,0.3)",
                              padding: "1px 7px",
                              borderRadius: 999,
                            }}
                          >
                            <FaExclamationTriangle size={8} /> Irréversible
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: 11,
                          color: subC,
                          margin: "3px 0 0",
                          lineHeight: 1.4,
                        }}
                      >
                        {opt.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Avertissement irréversible */}
          {selectedOpt?.irreversible && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 10,
                background: isDark ? "rgba(245,158,11,0.1)" : "#fffbeb",
                border: "1px solid rgba(217,119,6,0.35)",
              }}
            >
              <FaExclamationTriangle
                style={{
                  color: "#d97706",
                  fontSize: 13,
                  marginTop: 1,
                  flexShrink: 0,
                }}
              />
              <p
                style={{
                  fontSize: 12,
                  color: isDark ? "#fbbf24" : "#92400e",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                <strong>Attention :</strong> Le statut{" "}
                <strong>"{selectedOpt.label}"</strong> est irréversible. Une
                fois confirmé, il ne sera plus possible de modifier ce dossier.
              </p>
            </div>
          )}

          {/* Motif obligatoire */}
          {needsNote && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: subC,
                  marginBottom: 6,
                }}
              >
                {newSubStatus === "rejete"
                  ? "Motif de rejet"
                  : "Motif d'ajournement"}{" "}
                <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={3}
                placeholder={
                  newSubStatus === "rejete"
                    ? "Expliquez la raison du rejet..."
                    : "Indiquez les documents ou informations manquants..."
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: `1px solid ${statusNote.trim() ? borderC : "#ef4444"}`,
                  background: inputBg,
                  color: textC,
                  fontSize: 13,
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  lineHeight: 1.5,
                }}
              />
              {!statusNote.trim() && (
                <p
                  style={{ fontSize: 11, color: "#ef4444", margin: "4px 0 0" }}
                >
                  Ce champ est obligatoire.
                </p>
              )}
            </div>
          )}

          {/* Note optionnelle */}
          {(newSubStatus === "en_cours" || newSubStatus === "complet") && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: subC,
                  marginBottom: 6,
                }}
              >
                Note (optionnel)
              </label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={2}
                placeholder="Ajouter une note ou commentaire interne..."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: `1px solid ${borderC}`,
                  background: inputBg,
                  color: textC,
                  fontSize: 13,
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 22px",
            borderTop: `1px solid ${borderC}`,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            background: bgDeep,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              border: `1px solid ${borderC}`,
              background: bgCard,
              color: textC,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(newSubStatus, statusNote)}
            disabled={!canConfirm}
            style={{
              padding: "8px 22px",
              borderRadius: 10,
              border: "none",
              background: !canConfirm
                ? "#94a3b8"
                : selectedOpt?.irreversible
                  ? "#d97706"
                  : "#3b82f6",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: !canConfirm ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}
          >
            {selectedOpt?.irreversible
              ? "Confirmer définitivement"
              : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modal Archive ─────────────────────────────────────────────────────────────
const ArchiveModal = ({
  selectedDossier,
  isDark,
  bgCard,
  bgDeep,
  borderC,
  textC,
  subC,
  onClose,
  onConfirm,
}) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 9998,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.55)",
      backdropFilter: "blur(6px)",
      padding: 16,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: bgCard,
        border: `1px solid ${borderC}`,
        borderRadius: 20,
        width: "100%",
        maxWidth: 400,
        boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 22px 14px",
          borderBottom: `1px solid ${borderC}`,
          background: bgDeep,
        }}
      >
        <p style={{ fontSize: 15, fontWeight: 800, color: textC, margin: 0 }}>
          Archiver le dossier
        </p>
        <button
          onClick={onClose}
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: `1px solid ${borderC}`,
            background: bgCard,
            color: subC,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaTimes size={13} />
        </button>
      </div>
      <div style={{ padding: "20px 22px" }}>
        <p
          style={{
            fontSize: 14,
            color: subC,
            marginBottom: 14,
            lineHeight: 1.6,
          }}
        >
          Voulez-vous vraiment archiver ce dossier ? Cette action est{" "}
          <strong>irréversible</strong>.
        </p>
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: bgDeep,
            border: `1px solid ${borderC}`,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {[
            ["Référence", `EQ-${String(selectedDossier.id).padStart(4, "0")}`],
            ["Demandeur", `${selectedDossier.nom} ${selectedDossier.prenoms}`],
            ["Statut", getSubStatusStyle(selectedDossier.statut, isDark).label],
          ].map(([l, v]) => (
            <div
              key={l}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span style={{ fontSize: 11, color: subC }}>{l}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: textC }}>
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          padding: "14px 22px",
          borderTop: `1px solid ${borderC}`,
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
          background: bgDeep,
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: "8px 20px",
            borderRadius: 10,
            border: `1px solid ${borderC}`,
            background: bgCard,
            color: textC,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          style={{
            padding: "8px 20px",
            borderRadius: 10,
            border: "none",
            background: "#ef4444",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Archiver
        </button>
      </div>
    </div>
  </div>
);

// ─── Composant principal ──────────────────────────────────────────────────────
const EquivalenceView = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const borderC = isDark ? "#334155" : "#e2e8f0";
  const headerBg = isDark ? "#0f172a" : "#f8fafc";
  const headerC = isDark ? "#64748b" : "#94a3b8";
  const textC = isDark ? "#e2e8f0" : "#334155";
  const subC = isDark ? "#475569" : "#94a3b8";
  const bgCard = isDark ? "#1e293b" : "#ffffff";
  const bgPage = isDark ? "#0f172a" : "#ffffff";
  const rowHover = isDark ? "rgba(59,130,246,0.06)" : "#f8faff";
  const bgDeep = isDark ? "#0f172a" : "#f8fafc";
  const inputBg = isDark ? "#1e293b" : "#ffffff";

  const [equivalences, setEquivalences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("list");
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("submitted_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    personalInfo: true,
    formations: true,
    documents: true,
  });
  const itemsPerPage = 10;

  const loadDemandes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.statut = statusFilter;
      if (typeFilter) params.typediplome = typeFilter;
      if (searchQuery) params.search = searchQuery;
      const response = await getAllDemandesAdmin(params, false);
      if (response.success) {
        setEquivalences(response.data);
      } else {
        toast.error("Impossible de charger les dossiers. Réessayez.");
      }
    } catch (error) {
      if (error.response?.status === 403)
        toast.error(
          "Accès refusé — vous n'avez pas les droits administrateur.",
        );
      else if (error.response?.status === 401)
        toast.error("Session expirée — veuillez vous reconnecter.");
      else
        toast.error("Erreur de connexion au serveur. Vérifiez votre réseau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemandes();
  }, [statusFilter, typeFilter, searchQuery]);

  const filteredEquivalences = equivalences
    .filter((eq) => {
      const date = new Date(eq.submitted_at || eq.created_at);
      if (startDateFilter && date < new Date(startDateFilter)) return false;
      if (endDateFilter && date > new Date(endDateFilter)) return false;
      return true;
    })
    .sort((a, b) => {
      let vA, vB;
      if (sortBy === "submitted_at") {
        vA = new Date(a.submitted_at || a.created_at);
        vB = new Date(b.submitted_at || b.created_at);
      } else if (sortBy === "nom") {
        vA = `${a.nom} ${a.prenoms}`.toLowerCase();
        vB = `${b.nom} ${b.prenoms}`.toLowerCase();
      } else if (sortBy === "id") {
        vA = a.id;
        vB = b.id;
      } else {
        vA = a[sortBy];
        vB = b[sortBy];
      }
      if (vA < vB) return sortDirection === "asc" ? -1 : 1;
      if (vA > vB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredEquivalences.length / itemsPerPage);
  const paginated = filteredEquivalences.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSortClick = (col) => {
    if (sortBy === col) setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortDirection("asc");
    }
  };

  const handleOpenAction = (eq) => {
    setSelectedDossier(eq);
    setShowActionModal(true);
  };
  const handleOpenArchive = (eq) => {
    setSelectedDossier(eq);
    setShowArchiveModal(true);
  };

  const handleConfirmAction = async (newSubStatus, statusNote) => {
    try {
      const response = await updateDemandeStatutAdmin(
        selectedDossier.id,
        newSubStatus,
        statusNote || null,
      );
      if (response.success) {
        const opt = subStatusOptions.find((o) => o.id === newSubStatus);
        toast.success(
          `Dossier EQ-${String(selectedDossier.id).padStart(4, "0")} — statut mis à jour : "${opt?.label || newSubStatus}"`,
          { autoClose: 5000 },
        );
        setShowActionModal(false);
        await loadDemandes();
        if (selectedDetail?.id === selectedDossier.id) {
          setSelectedDetail((prev) => ({
            ...prev,
            statut: newSubStatus,
            commentaire_admin: statusNote,
          }));
        }
      } else {
        toast.error("La mise à jour a échoué. Réessayez.");
      }
    } catch (error) {
      const detail = error.response?.data?.detail;
      if (detail?.includes("Transition"))
        toast.error(`Changement de statut invalide : ${detail}`);
      else if (error.response?.status === 403)
        toast.error("Vous n'avez pas les droits pour cette action.");
      else
        toast.error(
          `Erreur : ${detail || "Impossible de mettre à jour le statut."}`,
        );
    }
  };

  const handleConfirmArchive = async () => {
    try {
      const response = await archiveDemande(selectedDossier.id);
      if (response.success) {
        toast.success(
          `Dossier EQ-${String(selectedDossier.id).padStart(4, "0")} archivé avec succès.`,
        );
        setShowArchiveModal(false);
        await loadDemandes();
        if (currentView === "detail") {
          setCurrentView("list");
          setSelectedDetail(null);
        }
      } else {
        toast.error("L'archivage a échoué. Réessayez.");
      }
    } catch (error) {
      const detail = error.response?.data?.detail;
      toast.error(
        `Archivage impossible : ${detail || "Une erreur est survenue."}`,
      );
    }
  };

  const handleExport = (type) => {
    try {
      const dataToExport = filteredEquivalences;
      if (type === "csv") {
        const headers = [
          "ID",
          "Nom",
          "Prénom",
          "Email",
          "Téléphone",
          "Type diplôme",
          "Statut",
          "Date soumission",
        ];
        const rows = dataToExport.map((eq) => [
          eq.id,
          eq.nom,
          eq.prenoms,
          eq.email,
          eq.telephone,
          eq.type_diplome,
          mapStatutToDisplay(eq.statut),
          formatDate(eq.submitted_at || eq.created_at),
        ]);
        const csv = [headers, ...rows]
          .map((r) =>
            r.map((v) => `"${String(v || "").replace(/"/g, '""')}"`).join(","),
          )
          .join("\n");
        const blob = new Blob(["\uFEFF" + csv], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `equivalences_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(
          `Export Excel réussi — ${dataToExport.length} dossier(s)`,
        );
      } else {
        const rows = dataToExport
          .map((eq) => {
            const s = getSubStatusStyle(eq.statut, false);
            return `<tr><td>${eq.id}</td><td>${eq.nom} ${eq.prenoms}</td><td>${eq.type_diplome || ""}</td><td>${formatDate(eq.submitted_at || eq.created_at)}</td><td style="color:${s.color};font-weight:600">${s.label}</td></tr>`;
          })
          .join("");
        const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Équivalences</title><style>body{font-family:Arial,sans-serif;padding:20px;color:#334155}table{width:100%;border-collapse:collapse;font-size:12px}th{background:#f8fafc;border:1px solid #e2e8f0;padding:8px 12px;text-align:left;font-weight:700;color:#64748b}td{border:1px solid #e2e8f0;padding:8px 12px}tr:nth-child(even){background:#f8fafc}</style></head><body><h1>Demandes d'équivalence</h1><p style="font-size:11px;color:#94a3b8">Export du ${new Date().toLocaleDateString("fr-FR")} — ${dataToExport.length} dossier(s)</p><table><thead><tr><th>ID</th><th>Nom complet</th><th>Type diplôme</th><th>Date</th><th>Statut</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        iframe.src = url;
        iframe.onload = () =>
          setTimeout(() => {
            iframe.contentWindow.print();
            setTimeout(() => {
              document.body.removeChild(iframe);
              URL.revokeObjectURL(url);
            }, 100);
          }, 250);
        toast.success(`Export PDF lancé — ${dataToExport.length} dossier(s)`);
      }
    } catch (e) {
      toast.error("Erreur lors de l'export : " + e.message);
    }
  };

  const toggleSection = (s) =>
    setExpandedSections((p) => ({ ...p, [s]: !p[s] }));

  // ─── PAGE DÉTAIL ────────────────────────────────────────────────────────────
  if (currentView === "detail" && selectedDetail) {
    const sstyle = getSubStatusStyle(selectedDetail.statut, isDark);
    const archivable = canArchive(selectedDetail.statut);
    const formations =
      selectedDetail.recapitulatif_formation ||
      selectedDetail.recapitulatifFormation ||
      [];
    const documents = selectedDetail.documents || {};

    return (
      <div
        style={{
          minHeight: "100vh",
          background: bgPage,
          padding: "16px 20px",
          fontFamily: "sans-serif",
        }}
      >
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme={isDark ? "dark" : "light"}
          style={{ zIndex: 99999 }}
        />

        {showActionModal && selectedDossier && (
          <ActionModal
            selectedDossier={selectedDossier}
            isDark={isDark}
            bgCard={bgCard}
            bgDeep={bgDeep}
            borderC={borderC}
            textC={textC}
            subC={subC}
            inputBg={inputBg}
            onClose={() => setShowActionModal(false)}
            onConfirm={handleConfirmAction}
          />
        )}
        {showArchiveModal && selectedDossier && (
          <ArchiveModal
            selectedDossier={selectedDossier}
            isDark={isDark}
            bgCard={bgCard}
            bgDeep={bgDeep}
            borderC={borderC}
            textC={textC}
            subC={subC}
            onClose={() => setShowArchiveModal(false)}
            onConfirm={handleConfirmArchive}
          />
        )}

        {/* Header */}
        <div
          style={{
            background: bgCard,
            border: `1px solid ${borderC}`,
            borderRadius: 16,
            padding: "14px 20px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            boxShadow: isDark
              ? "0 1px 6px rgba(0,0,0,0.4)"
              : "0 1px 6px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => {
                setCurrentView("list");
                setSelectedDetail(null);
              }}
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                border: `1px solid ${borderC}`,
                background: bgCard,
                color: textC,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaArrowLeft size={13} />
            </button>
            <div>
              <h1
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: textC,
                  margin: 0,
                }}
              >
                Détail du dossier
              </h1>
              <p style={{ fontSize: 12, color: subC, margin: 0 }}>
                Référence EQ-{String(selectedDetail.id).padStart(4, "0")}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                color: sstyle.color,
                background: sstyle.bg,
                border: `1px solid ${sstyle.border}`,
              }}
            >
              {sstyle.label}
            </span>
            <button
              onClick={() => handleOpenAction(selectedDetail)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 10,
                border: "none",
                background: "#3b82f6",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <FaEdit size={11} /> Traiter
            </button>
            <button
              onClick={
                archivable ? () => handleOpenArchive(selectedDetail) : undefined
              }
              disabled={!archivable}
              title={
                archivable
                  ? "Archiver ce dossier"
                  : "Seuls les dossiers Accordé, Rejeté, Octroyé ou Ajourné peuvent être archivés"
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 10,
                border: `1px solid ${borderC}`,
                background: archivable ? bgCard : bgDeep,
                color: archivable ? textC : subC,
                fontSize: 12,
                cursor: archivable ? "pointer" : "not-allowed",
                opacity: archivable ? 1 : 0.5,
              }}
            >
              <FaArchive size={11} /> Archiver
            </button>
          </div>
        </div>

        {/* Corps 2 colonnes */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}
        >
          {/* Colonne gauche */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Section
              title="Informations personnelles"
              icon={<FaUserCircle />}
              expanded={expandedSections.personalInfo}
              onToggle={() => toggleSection("personalInfo")}
              isDark={isDark}
              bgCard={bgCard}
              borderC={borderC}
              textC={textC}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {[
                  {
                    icon: <FaUserCircle />,
                    label: "Nom complet",
                    val: `${selectedDetail.nom || ""} ${selectedDetail.prenoms || ""}`,
                  },
                  {
                    icon: <FaEnvelope />,
                    label: "Email",
                    val: selectedDetail.email,
                  },
                  {
                    icon: <FaPhone />,
                    label: "Téléphone",
                    val: selectedDetail.telephone,
                  },
                  {
                    icon: <FaMapMarkerAlt />,
                    label: "Code postal",
                    val:
                      selectedDetail.code_postal || selectedDetail.codePostal,
                  },
                  {
                    icon: <FaCalendarAlt />,
                    label: "Date soumission",
                    val: formatDate(
                      selectedDetail.submitted_at ||
                        selectedDetail.submittedAt ||
                        selectedDetail.created_at,
                    ),
                  },
                  {
                    icon: <FaTag />,
                    label: "Type diplôme",
                    val:
                      selectedDetail.type_diplome || selectedDetail.typeDiplome,
                  },
                  {
                    icon: <FaTag />,
                    label: "Motif",
                    val: selectedDetail.motif,
                  },
                ].map(({ icon, label, val }, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{ color: "#3b82f6", marginTop: 2, flexShrink: 0 }}
                    >
                      {icon}
                    </span>
                    <div>
                      <p
                        style={{
                          fontSize: 10,
                          color: subC,
                          margin: 0,
                          textTransform: "uppercase",
                          fontWeight: 700,
                        }}
                      >
                        {label}
                      </p>
                      <p style={{ fontSize: 13, color: textC, margin: 0 }}>
                        {val || "-"}
                      </p>
                    </div>
                  </div>
                ))}
                <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
                  <span
                    style={{ color: "#3b82f6", marginTop: 2, flexShrink: 0 }}
                  >
                    <FaUniversity />
                  </span>
                  <div>
                    <p
                      style={{
                        fontSize: 10,
                        color: subC,
                        margin: 0,
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      Destinataire
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: textC,
                        margin: 0,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {selectedDetail.destinataire || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            <Section
              title="Formations"
              icon={<FaGraduationCap />}
              expanded={expandedSections.formations}
              onToggle={() => toggleSection("formations")}
              isDark={isDark}
              bgCard={bgCard}
              borderC={borderC}
              textC={textC}
            >
              {formations.length > 0 ? (
                formations.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: bgDeep,
                      border: `1px solid ${borderC}`,
                      marginBottom: 8,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        color: subC,
                        margin: "0 0 4px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      Formation {i + 1}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: textC,
                        margin: 0,
                        fontWeight: 600,
                      }}
                    >
                      {f.diplome || "-"}
                    </p>
                    <p style={{ fontSize: 12, color: subC, margin: 0 }}>
                      {f.etablissement || "-"} —{" "}
                      {f.annee_obtention || f.anneeObtention || "-"}
                    </p>
                    {f.mention && (
                      <p
                        style={{ fontSize: 11, color: subC, margin: "2px 0 0" }}
                      >
                        Mention : {f.mention}
                      </p>
                    )}
                    {(f.parcours_option_specialite ||
                      f.parcoursOptionSpecialite) && (
                      <p
                        style={{ fontSize: 11, color: subC, margin: "2px 0 0" }}
                      >
                        Spécialité :{" "}
                        {f.parcours_option_specialite ||
                          f.parcoursOptionSpecialite}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 12, color: subC, fontStyle: "italic" }}>
                  Aucune formation enregistrée.
                </p>
              )}
            </Section>
          </div>

          {/* Colonne droite */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Notes admin */}
            <div
              style={{
                background: bgCard,
                border: `1px solid ${borderC}`,
                borderRadius: 16,
                padding: "14px 16px",
                boxShadow: isDark
                  ? "0 1px 6px rgba(0,0,0,0.4)"
                  : "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <FaInfoCircle style={{ color: "#3b82f6", fontSize: 14 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: textC }}>
                  Notes admin
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: subC,
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {selectedDetail.commentaire_admin ||
                  selectedDetail.commentaireAdmin ||
                  "Aucune note."}
              </p>
            </div>

            {/* Documents */}
            <div
              style={{
                background: bgCard,
                border: `1px solid ${borderC}`,
                borderRadius: 16,
                padding: "14px 16px",
                boxShadow: isDark
                  ? "0 1px 6px rgba(0,0,0,0.4)"
                  : "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <FaFileUpload style={{ color: "#3b82f6", fontSize: 14 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: textC }}>
                  Documents
                </span>
                <span style={{ fontSize: 11, color: subC, marginLeft: "auto" }}>
                  {Object.keys(documents).length} fichier(s)
                </span>
              </div>
              {Object.keys(documents).length > 0 ? (
                Object.entries(documents).map(([key, path]) => (
                  <div key={key} style={{ marginBottom: 10 }}>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: subC,
                        margin: "0 0 4px",
                        textTransform: "capitalize",
                      }}
                    >
                      {key.replace(/_/g, " ")}
                    </p>
                    <DocumentItem
                      filePath={path}
                      documentType={key}
                      isDark={isDark}
                      borderC={borderC}
                      textC={textC}
                      subC={subC}
                    />
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 12, color: subC, fontStyle: "italic" }}>
                  Aucun document.
                </p>
              )}
            </div>

            {/* Métadonnées */}
            <div
              style={{
                background: bgCard,
                border: `1px solid ${borderC}`,
                borderRadius: 16,
                padding: "14px 16px",
                boxShadow: isDark
                  ? "0 1px 6px rgba(0,0,0,0.4)"
                  : "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <FaInfoCircle style={{ color: "#6d28d9", fontSize: 14 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: textC }}>
                  Métadonnées
                </span>
              </div>
              {[
                ["ID interne", selectedDetail.id],
                [
                  "Créé le",
                  formatDateTime(
                    selectedDetail.created_at || selectedDetail.createdAt,
                  ),
                ],
                [
                  "Soumis le",
                  formatDateTime(
                    selectedDetail.submitted_at || selectedDetail.submittedAt,
                  ),
                ],
                [
                  "Mis à jour",
                  formatDateTime(
                    selectedDetail.updated_at || selectedDetail.updatedAt,
                  ),
                ],
                ["Statut", sstyle.label],
              ].map(([label, val], i, arr) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 0",
                    borderBottom:
                      i < arr.length - 1 ? `1px solid ${borderC}` : "none",
                  }}
                >
                  <span style={{ fontSize: 12, color: subC }}>{label}</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: i === arr.length - 1 ? sstyle.color : textC,
                    }}
                  >
                    {val || "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── PAGE LISTE ─────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: bgPage,
        padding: "16px 20px",
        fontFamily: "sans-serif",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme={isDark ? "dark" : "light"}
        style={{ zIndex: 99999 }}
      />

      {showActionModal && selectedDossier && (
        <ActionModal
          selectedDossier={selectedDossier}
          isDark={isDark}
          bgCard={bgCard}
          bgDeep={bgDeep}
          borderC={borderC}
          textC={textC}
          subC={subC}
          inputBg={inputBg}
          onClose={() => setShowActionModal(false)}
          onConfirm={handleConfirmAction}
        />
      )}
      {showArchiveModal && selectedDossier && (
        <ArchiveModal
          selectedDossier={selectedDossier}
          isDark={isDark}
          bgCard={bgCard}
          bgDeep={bgDeep}
          borderC={borderC}
          textC={textC}
          subC={subC}
          onClose={() => setShowArchiveModal(false)}
          onConfirm={handleConfirmArchive}
        />
      )}

      {/* En-tête page */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: textC, margin: 0 }}>
          Gestion des demandes d'équivalence
        </h1>
        <p style={{ fontSize: 12, color: subC, margin: "4px 0 0" }}>
          Liste des dossiers traités par le SAE
        </p>
      </div>

      {/* Tableau principal */}
      <div
        style={{
          background: bgCard,
          border: `1px solid ${borderC}`,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: isDark
            ? "0 1px 6px rgba(0,0,0,0.4)"
            : "0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        {/* Barre de filtres */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: `1px solid ${borderC}`,
            background: bgDeep,
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
            <FaSearch
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                fontSize: 12,
              }}
            />
            <input
              type="text"
              placeholder="Rechercher nom, prénom, email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: "100%",
                paddingLeft: 32,
                paddingRight: searchQuery ? 30 : 12,
                paddingTop: 8,
                paddingBottom: 8,
                borderRadius: 10,
                border: `1px solid ${searchQuery ? "#3b82f6" : borderC}`,
                background: inputBg,
                color: textC,
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                <FaTimes size={10} />
              </button>
            )}
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: `1px solid ${borderC}`,
              background: inputBg,
              color: statusFilter ? textC : subC,
              fontSize: 13,
              outline: "none",
              minWidth: 160,
              cursor: "pointer",
            }}
          >
            <option value="">Tous les statuts</option>
            {[
              ["brouillon", "Brouillon"],
              ["soumise", "Reçu"],
              ["en_cours", "En cours"],
              ["complet", "Octroyé"],
              ["ajourne", "Ajourné"],
              ["rejete", "Rejeté"],
              ["accorde", "Accordé"],
            ].map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: `1px solid ${borderC}`,
              background: inputBg,
              color: typeFilter ? textC : subC,
              fontSize: 13,
              outline: "none",
              minWidth: 160,
              cursor: "pointer",
            }}
          >
            <option value="">Tous les types</option>
            <option value="Licence">Licence</option>
            <option value="Master">Master</option>
            <option value="Doctorat">Doctorat</option>
          </select>
          {[
            ["Du", startDateFilter, setStartDateFilter],
            ["Au", endDateFilter, setEndDateFilter],
          ].map(([lbl, val, setter]) => (
            <div
              key={lbl}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                borderRadius: 10,
                background: inputBg,
                border: `1px solid ${borderC}`,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: subC }}>
                {lbl}
              </span>
              <input
                type="date"
                value={val}
                onChange={(e) => {
                  setter(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: textC,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              />
            </div>
          ))}
          {(searchQuery ||
            statusFilter ||
            typeFilter ||
            startDateFilter ||
            endDateFilter) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("");
                setTypeFilter("");
                setStartDateFilter("");
                setEndDateFilter("");
                setCurrentPage(1);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                borderRadius: 10,
                border: `1px solid ${borderC}`,
                background: inputBg,
                color: textC,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <FaTimes size={10} /> Réinitialiser
            </button>
          )}
          <div style={{ marginLeft: "auto" }}>
            <ExportMenu isDark={isDark} onExport={handleExport} />
          </div>
        </div>

        <div
          style={{ padding: "8px 20px", borderBottom: `1px solid ${borderC}` }}
        >
          <span style={{ fontSize: 12, color: subC }}>
            {loading
              ? "Chargement..."
              : `${filteredEquivalences.length} dossier(s) au total`}
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 1000,
            }}
          >
            <thead>
              <tr
                style={{
                  background: headerBg,
                  borderBottom: `2px solid ${borderC}`,
                }}
              >
                {[
                  { key: "id", label: "ID" },
                  { key: "nom", label: "DEMANDEUR" },
                  { key: null, label: "TYPE" },
                  { key: "submitted_at", label: "DATE" },
                  { key: null, label: "STATUT" },
                  { key: null, label: "ACTIONS" },
                ].map(({ key, label }, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      color: headerC,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {key ? (
                      <button
                        onClick={() => handleSortClick(key)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: headerC,
                          fontWeight: 700,
                          fontSize: 11,
                          padding: 0,
                        }}
                      >
                        {label}
                        <svg
                          width={10}
                          height={10}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          {sortBy === key && sortDirection === "asc" ? (
                            <path d="M12 5v14M8 9l4-4 4 4" />
                          ) : sortBy === key ? (
                            <path d="M12 19V5M8 15l4 4 4-4" />
                          ) : (
                            <>
                              <path d="M8 9l4-4 4 4" />
                              <path d="M8 15l4 4 4-4" />
                            </>
                          )}
                        </svg>
                      </button>
                    ) : (
                      label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "60px 20px",
                      textAlign: "center",
                      color: subC,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <FaSpinner
                        style={{
                          animation: "spin 0.8s linear infinite",
                          fontSize: 22,
                        }}
                      />
                      <span style={{ fontSize: 13 }}>
                        Chargement des données...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "60px 20px",
                      textAlign: "center",
                      color: subC,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        opacity: 0.5,
                      }}
                    >
                      <FaSearch size={22} />
                      <span style={{ fontSize: 13 }}>
                        Aucun dossier trouvé.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((eq) => {
                  const ss = getSubStatusStyle(eq.statut, isDark);
                  const archivable = canArchive(eq.statut);
                  return (
                    <tr
                      key={eq.id}
                      style={{
                        borderBottom: `1px solid ${borderC}`,
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = rowHover)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: isDark ? "#0f172a" : "#f1f5f9",
                            color: isDark ? "#94a3b8" : "#64748b",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {eq.id}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: textC,
                          }}
                        >
                          {eq.nom} {eq.prenoms}
                        </div>
                        <div style={{ fontSize: 11, color: subC }}>
                          {eq.email}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 10px",
                            borderRadius: 6,
                            background: isDark ? "#0f172a" : "#f1f5f9",
                            color: isDark ? "#94a3b8" : "#64748b",
                            fontSize: 11,
                            fontWeight: 500,
                            border: `1px solid ${borderC}`,
                          }}
                        >
                          {eq.type_diplome || eq.typeDiplome}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "center",
                          fontSize: 13,
                          color: subC,
                        }}
                      >
                        {formatDate(
                          eq.submitted_at || eq.submittedAt || eq.created_at,
                        )}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "3px 12px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 600,
                            color: ss.color,
                            background: ss.bg,
                            border: `1px solid ${ss.border}`,
                          }}
                        >
                          {ss.label}
                        </span>
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                          }}
                        >
                          <ActionBtn
                            title="Voir le détail"
                            color="#3b82f6"
                            isDark={isDark}
                            borderC={borderC}
                            onClick={() => {
                              setSelectedDetail(eq);
                              setCurrentView("detail");
                            }}
                          >
                            <FaEye size={14} />
                          </ActionBtn>
                          <ActionBtn
                            title="Traiter / changer le statut"
                            color="#16a34a"
                            isDark={isDark}
                            borderC={borderC}
                            onClick={() => handleOpenAction(eq)}
                          >
                            <FaEdit size={13} />
                          </ActionBtn>
                          <ActionBtn
                            title={
                              archivable
                                ? "Archiver ce dossier"
                                : "Archivage impossible — statut doit être Accordé, Rejeté, Octroyé ou Ajourné"
                            }
                            color="#6b7280"
                            isDark={isDark}
                            borderC={borderC}
                            disabled={!archivable}
                            onClick={() => handleOpenArchive(eq)}
                          >
                            <FaArchive size={13} />
                          </ActionBtn>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              padding: "14px 20px",
              borderTop: `1px solid ${borderC}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 12, color: subC }}>
              {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(
                currentPage * itemsPerPage,
                filteredEquivalences.length,
              )}{" "}
              sur {filteredEquivalences.length} dossiers
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: `1px solid ${borderC}`,
                  background: bgCard,
                  color: isDark ? "#94a3b8" : "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  opacity: currentPage === 1 ? 0.3 : 1,
                }}
              >
                <HiOutlineChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1,
                )
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span style={{ fontSize: 13, color: subC }}>…</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(p)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border:
                          currentPage === p
                            ? "1px solid #3b82f6"
                            : `1px solid ${borderC}`,
                        background: currentPage === p ? "#3b82f6" : bgCard,
                        color:
                          currentPage === p
                            ? "#fff"
                            : isDark
                              ? "#94a3b8"
                              : "#64748b",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: `1px solid ${borderC}`,
                  background: bgCard,
                  color: isDark ? "#94a3b8" : "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                  opacity: currentPage === totalPages ? 0.3 : 1,
                }}
              >
                <HiOutlineChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default EquivalenceView;
