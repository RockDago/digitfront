import React, { useState, useRef, useEffect, useContext } from "react";
import {
  FaArchive,
  FaRedo,
  FaEye,
  FaSearch,
  FaTimes,
  FaArrowLeft,
  FaUserCircle,
  FaGraduationCap,
  FaCalendarAlt,
  FaInfoCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUniversity,
  FaTag,
  FaFileAlt,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaFilePdf,
  FaFileExcel,
  FaSpinner,
} from "react-icons/fa";
import { HiChevronDown, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { ThemeContext } from "../../../../context/ThemeContext";
import { getArchivesDemandes, restoreDemande, downloadDocument } from "../../../../services/equivalence.services";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

const mapStatutToDisplay = (statut) => {
  const mapping = {
    brouillon: "Brouillon",
    soumise: "En cours",
    en_cours: "En cours",
    complet: "Complété",
    rejete: "Rejeté",
    accorde: "Accepté",
  };
  return mapping[statut] || statut;
};

const getSubStatusStyle = (statut, isDark) => {
  const displayStatut = mapStatutToDisplay(statut);
  const MAP = {
    "En cours": {
      color: "#2563eb",
      bg: isDark ? "rgba(37,99,235,0.15)" : "#eff6ff",
      border: isDark ? "rgba(37,99,235,0.4)" : "#bfdbfe",
      label: "En cours",
    },
    Accepté: {
      color: "#16a34a",
      bg: isDark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.1)",
      border: isDark ? "rgba(34,197,94,0.4)" : "rgba(22,163,74,0.3)",
      label: "Accepté",
    },
    Ajourné: {
      color: "#d97706",
      bg: isDark ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.1)",
      border: isDark ? "rgba(245,158,11,0.4)" : "rgba(217,119,6,0.3)",
      label: "Ajourné",
    },
    Rejeté: {
      color: "#dc2626",
      bg: isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)",
      border: isDark ? "rgba(239,68,68,0.4)" : "rgba(220,38,38,0.3)",
      label: "Rejeté",
    },
    Brouillon: {
      color: "#64748b",
      bg: isDark ? "rgba(100,116,139,0.15)" : "rgba(100,116,139,0.1)",
      border: isDark ? "rgba(100,116,139,0.4)" : "rgba(100,116,139,0.3)",
      label: "Brouillon",
    },
    Complété: {
      color: "#6b7280",
      bg: isDark ? "rgba(107,114,128,0.15)" : "rgba(107,114,128,0.1)",
      border: isDark ? "rgba(107,114,128,0.4)" : "rgba(107,114,128,0.3)",
      label: "Complété",
    },
  };
  return MAP[displayStatut] || {
    color: "#64748b",
    bg: isDark ? "rgba(100,116,139,0.15)" : "rgba(100,116,139,0.1)",
    border: isDark ? "rgba(100,116,139,0.4)" : "rgba(100,116,139,0.3)",
    label: statut,
  };
};

const subStatusOptions = [
  { id: "accepte", label: "Accepté", color: "#16a34a" },
  { id: "ajourne", label: "Ajourné", color: "#d97706" },
  { id: "rejete", label: "Rejeté", color: "#dc2626" },
  { id: "complet", label: "Complété", color: "#6b7280" },
];

// ─── Sous-composants ───────────────────────────────────────────────────────────
const Section = ({ title, icon, expanded, onToggle, isDark, bgCard, borderC, textC, children }) => {
  const bgDeep = isDark ? "#0f172a" : "#f8fafc";
  const subC = isDark ? "#475569" : "#94a3b8";
  return (
    <div
      style={{
        background: bgCard,
        border: "1px solid " + borderC,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)",
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
          borderBottom: expanded ? "1px solid " + borderC : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#3b82f6", fontSize: 14 }}>{icon}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: textC }}>{title}</span>
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

const ActionBtn = ({ title, color, isDark, borderC, onClick, children }) => (
  <button
    title={title}
    onClick={onClick}
    style={{
      width: 30,
      height: 30,
      borderRadius: 8,
      border: "1px solid " + borderC,
      background: isDark ? "#1e293b" : "#f8fafc",
      color,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.15s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = color;
      e.currentTarget.style.color = "#fff";
      e.currentTarget.style.borderColor = color;
      e.currentTarget.style.boxShadow = `0 2px 8px ${color}55`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = isDark ? "#1e293b" : "#f8fafc";
      e.currentTarget.style.color = color;
      e.currentTarget.style.borderColor = borderC;
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    {children}
  </button>
);

const DocumentItem = ({ filePath, fileName }) => {
  const handleDownload = async () => {
    try {
      const blob = await downloadDocument(filePath);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || filePath.split("/").pop();
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error("Erreur lors du téléchargement du document");
    }
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
        {fileName || filePath.split("/").pop()}
      </span>
      <button
        onClick={handleDownload}
        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        title="Télécharger"
      >
        <FaDownload size={14} />
      </button>
    </div>
  );
};

// ─── ExportMenu ────────────────────────────────────────────────────────────────
function ExportMenu({ isDark, borderC, onExport }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const bg = isDark ? "#1e293b" : "#ffffff";
  const txt = isDark ? "#e2e8f0" : "#334155";

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          borderRadius: 12,
          border: "1px solid " + borderC,
          background: bg,
          color: txt,
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        <FaDownload size={12} /> Exporter
        <HiChevronDown
          size={15}
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
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
            border: "1px solid " + borderC,
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
            onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? "rgba(34,197,94,0.1)" : "#f0fdf4")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <FaFileExcel style={{ color: "#16a34a" }} size={14} /> Excel (.csv)
          </button>
          <div style={{ borderTop: "1px solid " + borderC }} />
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
            onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? "rgba(239,68,68,0.1)" : "#fff1f2")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <FaFilePdf style={{ color: "#dc2626" }} size={14} /> PDF
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────
const ArchiveEquivalenceView = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const borderC = isDark ? "#334155" : "#e2e8f0";
  const headerBg = isDark ? "#0f172a" : "#f8fafc";
  const headerC = isDark ? "#64748b" : "#94a3b8";
  const textC = isDark ? "#e2e8f0" : "#334155";
  const subC = isDark ? "#475569" : "#94a3b8";
  const bgCard = isDark ? "#1e293b" : "#ffffff";
  const bgPage = isDark ? "#0f172a" : "#ffffff";
  const bgDeep = isDark ? "#0f172a" : "#f8fafc";
  const inputBg = isDark ? "#1e293b" : "#ffffff";
  const rowHover = isDark ? "rgba(59,130,246,0.06)" : "#f8faff";

  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("list");
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("archived_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    personalInfo: true,
    formations: true,
    documents: true,
    metadata: true,
  });

  const itemsPerPage = 10;

  // Charger les archives
  const loadArchives = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.statut = statusFilter;
      if (typeFilter) params.type_diplome = typeFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await getArchivesDemandes(params);
      if (response.success) {
        setArchives(response.data || []);
      } else {
        toast.error("Erreur lors du chargement des archives");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchives();
  }, [statusFilter, typeFilter, searchQuery]);

  // Filtrage et tri
  const filtered = archives
    .filter((eq) => {
      if (startDateFilter && new Date(eq.archived_at) < new Date(startDateFilter)) return false;
      if (endDateFilter && new Date(eq.archived_at) > new Date(endDateFilter)) return false;
      return true;
    })
    .sort((a, b) => {
      let vA, vB;
      if (sortBy === "archived_at") {
        vA = new Date(a.archived_at || a.created_at);
        vB = new Date(b.archived_at || b.created_at);
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

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSortClick = (col) => {
    if (sortBy === col) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDirection("asc");
    }
  };

  // Restauration
  const handleOpenRestore = (eq) => {
    setSelectedDossier(eq);
    setShowRestoreModal(true);
  };

  const handleConfirmRestore = async () => {
    try {
      const response = await restoreDemande(selectedDossier.id);
      if (response.success) {
        toast.success(`Dossier ${selectedDossier.id} restauré avec succès`);
        await loadArchives();
        if (currentView === "detail") setCurrentView("list");
        setShowRestoreModal(false);
      } else {
        toast.error("Erreur lors de la restauration");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(error.response?.data?.detail || "Erreur lors de la restauration");
    }
  };

  // Export
  const handleExport = (type) => {
    try {
      const dataToExport = filtered;

      if (type === "csv") {
        const headers = ["ID", "Nom", "Prénom", "Email", "Téléphone", "Type diplôme", "Statut", "Date archivage"];
        const rows = dataToExport.map((eq) => [
          eq.id,
          eq.nom,
          eq.prenoms,
          eq.email,
          eq.telephone,
          eq.type_diplome,
          mapStatutToDisplay(eq.statut),
          formatDate(eq.archived_at || eq.created_at),
        ]);
        const csv = [headers, ...rows]
          .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";"))
          .join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `archives_equivalences_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Export Excel réussi (${dataToExport.length} entrées)`);
      } else {
        const rows = dataToExport
          .map((eq) => {
            const s = getSubStatusStyle(eq.statut, false);
            return `<tr>
              <td>${eq.id}</td>
              <td>${eq.nom} ${eq.prenoms}</td>
              <td>${eq.type_diplome}</td>
              <td>${formatDate(eq.archived_at || eq.created_at)}</td>
              <td style="color:${s.color};font-weight:600">${s.label}</td>
            </tr>`;
          })
          .join("");
        const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Archives équivalences</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; color: #334155; }
    h1 { font-size: 16px; margin-bottom: 16px; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; font-weight: 700; color: #64748b; text-transform: uppercase; }
    td { border: 1px solid #e2e8f0; padding: 8px 12px; }
    tr:nth-child(even) { background: #f8fafc; }
    @media print { body { padding: 10px; } }
  </style>
</head>
<body>
  <h1>Archives des demandes d'équivalence de diplômes</h1>
  <p style="font-size:11px;color:#94a3b8;margin-bottom:12px">
    Exporté le ${new Date().toLocaleDateString("fr-FR")} — ${dataToExport.length} dossier(s)
  </p>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nom complet</th>
        <th>Type diplôme</th>
        <th>Date archivage</th>
        <th>Statut</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>`;
        const blob = new Blob([html], { type: "text/html" });
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
        toast.success(`Export PDF lancé (${dataToExport.length} entrées)`);
      }
    } catch (e) {
      toast.error("Erreur export : " + e.message);
    }
  };

  const toggleSection = (s) => {
    setExpandedSections((p) => ({ ...p, [s]: !p[s] }));
  };

  // PAGE DÉTAIL
  if (currentView === "detail" && selectedDetail) {
    const ss = getSubStatusStyle(selectedDetail.statut, isDark);
    const formations = selectedDetail.recapitulatif_formation || [];

    return (
      <div style={{ minHeight: "100vh", background: bgPage, padding: "16px 20px", fontFamily: "sans-serif" }}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDark ? "dark" : "light"}
        />

        {showRestoreModal && selectedDossier && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(6px)",
              padding: 16,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: bgCard,
                border: "1px solid " + borderC,
                borderRadius: 20,
                width: "100%",
                maxWidth: 420,
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
                  borderBottom: "1px solid " + borderC,
                  background: bgDeep,
                }}
              >
                <p style={{ fontSize: 15, fontWeight: 800, color: textC, margin: 0 }}>Restaurer le dossier</p>
                <button
                  onClick={() => setShowRestoreModal(false)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    border: "1px solid " + borderC,
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
                <p style={{ fontSize: 14, color: subC, marginBottom: 16, lineHeight: 1.6 }}>
                  Voulez-vous vraiment restaurer ce dossier depuis les archives ?
                </p>
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: bgDeep,
                    border: "1px solid " + borderC,
                    marginBottom: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: subC }}>ID</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: textC }}>{selectedDossier.id}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: subC }}>Demandeur</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: textC }}>
                      {selectedDossier.nom} {selectedDossier.prenoms}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: subC }}>Statut</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: ss.color,
                        background: ss.bg,
                        padding: "2px 10px",
                        borderRadius: 999,
                        border: "1px solid " + ss.border,
                      }}
                    >
                      {ss.label}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: subC }}>Date archivage</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: textC }}>
                      {formatDate(selectedDossier.archived_at)}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: isDark ? "rgba(59,130,246,0.1)" : "#eff6ff",
                    border: "1px solid " + (isDark ? "rgba(59,130,246,0.3)" : "#bfdbfe"),
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <FaInfoCircle style={{ color: "#3b82f6", flexShrink: 0, marginTop: 1 }} size={13} />
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      fontSize: 12,
                      color: isDark ? "#93c5fd" : "#1d4ed8",
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    <li>• Le dossier sera retiré des archives</li>
                    <li>• Il sera visible dans la liste de traitement</li>
                    <li>• L'historique complet sera conservé</li>
                  </ul>
                </div>
              </div>
              <div
                style={{
                  padding: "14px 22px",
                  borderTop: "1px solid " + borderC,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  background: bgDeep,
                }}
              >
                <button
                  onClick={() => setShowRestoreModal(false)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 10,
                    border: "1px solid " + borderC,
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
                  onClick={handleConfirmRestore}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 10,
                    border: "none",
                    background: "#16a34a",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Restaurer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header détail */}
        <div
          style={{
            background: bgCard,
            border: "1px solid " + borderC,
            borderRadius: 16,
            padding: "14px 20px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setCurrentView("list")}
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                border: "1px solid " + borderC,
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
              <h1 style={{ fontSize: 16, fontWeight: 800, color: textC, margin: 0 }}>Dossier archivé</h1>
              <p style={{ fontSize: 12, color: subC, margin: 0 }}>
                ID : {selectedDetail.id} | Référence : EQ-{selectedDetail.id.toString().padStart(4, "0")}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                color: ss.color,
                background: ss.bg,
                border: "1px solid " + ss.border,
              }}
            >
              {ss.label}
            </span>
            <span
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                color: isDark ? "#94a3b8" : "#64748b",
                background: isDark ? "rgba(100,116,139,0.15)" : "#f1f5f9",
                border: "1px solid " + borderC,
              }}
            >
              <FaArchive style={{ display: "inline", marginRight: 5, fontSize: 10 }} />
              Archivé
            </span>
            <button
              onClick={() => handleOpenRestore(selectedDetail)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 10,
                border: "none",
                background: "#16a34a",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <FaRedo size={11} /> Restaurer
            </button>
          </div>
        </div>

        {/* Bannière archivage */}
        <div
          style={{
            background: isDark ? "rgba(245,158,11,0.12)" : "#fffbeb",
            border: "1px solid " + (isDark ? "rgba(245,158,11,0.3)" : "#fde68a"),
            borderRadius: 12,
            padding: "12px 18px",
            marginBottom: 16,
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <FaInfoCircle style={{ color: "#d97706", flexShrink: 0, marginTop: 2 }} size={15} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: isDark ? "#fbbf24" : "#92400e", margin: "0 0 6px" }}>
              Informations d'archivage
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px 24px",
                fontSize: 12,
                color: isDark ? "#fde68a" : "#78350f",
              }}
            >
              <span>
                Date d'archivage : <strong>{formatDateTime(selectedDetail.archived_at)}</strong>
              </span>
              <span>
                Archivé par : <strong>{selectedDetail.archived_by || "Administrateur"}</strong>
              </span>
              {selectedDetail.archive_reason && (
                <span>
                  Raison : <strong>{selectedDetail.archive_reason}</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Corps 2 colonnes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Infos personnelles */}
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { icon: <FaUserCircle />, label: "Nom complet", val: `${selectedDetail.nom} ${selectedDetail.prenoms}` },
                  { icon: <FaEnvelope />, label: "Email", val: selectedDetail.email },
                  { icon: <FaPhone />, label: "Téléphone", val: selectedDetail.telephone },
                  { icon: <FaMapMarkerAlt />, label: "Adresse", val: selectedDetail.code_postal },
                  { icon: <FaCalendarAlt />, label: "Date de soumission", val: formatDate(selectedDetail.submitted_at || selectedDetail.created_at) },
                  { icon: <FaTag />, label: "Motif", val: selectedDetail.motif },
                ].map(({ icon, label, val }, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: "#3b82f6", marginTop: 2, flexShrink: 0, fontSize: 13 }}>{icon}</span>
                    <div>
                      <p
                        style={{
                          fontSize: 10,
                          color: subC,
                          margin: 0,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          fontWeight: 700,
                        }}
                      >
                        {label}
                      </p>
                      <p style={{ fontSize: 13, color: textC, margin: 0 }}>{val || "-"}</p>
                    </div>
                  </div>
                ))}
                <div style={{ gridColumn: "1/-1", display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: "#3b82f6", marginTop: 2, flexShrink: 0, fontSize: 13 }}>
                    <FaUniversity />
                  </span>
                  <div>
                    <p
                      style={{
                        fontSize: 10,
                        color: subC,
                        margin: 0,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontWeight: 700,
                      }}
                    >
                      Destinataire
                    </p>
                    <p style={{ fontSize: 13, color: textC, margin: 0 }}>{selectedDetail.destinataire}</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Formations */}
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
              {formations.map((f, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: bgDeep,
                    border: "1px solid " + borderC,
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
                  <p style={{ fontSize: 13, color: textC, margin: 0, fontWeight: 600 }}>{f.diplome || "-"}</p>
                  <p style={{ fontSize: 12, color: subC, margin: 0 }}>
                    {f.etablissement || "-"} — {f.annee_obtention || "-"}
                  </p>
                  {f.mention && <p style={{ fontSize: 11, color: subC, margin: "2px 0 0" }}>Mention: {f.mention}</p>}
                  {f.parcours_option_specialite && (
                    <p style={{ fontSize: 11, color: subC, margin: "2px 0 0" }}>Spécialité: {f.parcours_option_specialite}</p>
                  )}
                </div>
              ))}
            </Section>
          </div>

          {/* Colonne droite */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                background: bgCard,
                border: "1px solid " + borderC,
                borderRadius: 16,
                padding: "14px 16px",
                boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <FaInfoCircle style={{ color: "#3b82f6", fontSize: 14 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: textC }}>Notes</span>
              </div>
              <p style={{ fontSize: 13, color: subC, margin: 0, lineHeight: 1.6 }}>
                {selectedDetail.commentaire_admin || "Aucune note."}
              </p>
            </div>

            <div
              style={{
                background: bgCard,
                border: "1px solid " + borderC,
                borderRadius: 16,
                padding: "14px 16px",
                boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                <FaFileAlt style={{ color: "#3b82f6", fontSize: 14 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: textC }}>Documents</span>
              </div>
              {selectedDetail.documents && Object.keys(selectedDetail.documents).length > 0 ? (
                Object.entries(selectedDetail.documents).map(([key, path]) => (
                  <div key={key} style={{ marginBottom: 8 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: subC, margin: "0 0 4px" }}>
                      {key.replace(/_/g, " ")}
                    </p>
                    <DocumentItem filePath={path} fileName={path.split("/").pop()} />
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 12, color: subC, fontStyle: "italic" }}>Aucun document</p>
              )}
            </div>

            <div
              style={{
                background: bgCard,
                border: "1px solid " + borderC,
                borderRadius: 16,
                padding: "14px 16px",
                boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                <FaInfoCircle style={{ color: "#6d28d9", fontSize: 14 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: textC }}>Métadonnées</span>
              </div>
              {[
                ["ID interne", selectedDetail.id],
                ["Date création", formatDateTime(selectedDetail.created_at)],
                ["Date soumission", formatDateTime(selectedDetail.submitted_at)],
                ["Date archivage", formatDateTime(selectedDetail.archived_at)],
                ["Archivé par", selectedDetail.archived_by || "Administrateur"],
                ["Statut", ss.label],
              ].map(([label, val], i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 0",
                    borderBottom: i < 5 ? "1px solid " + borderC : "none",
                  }}
                >
                  <span style={{ fontSize: 12, color: subC }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: textC }}>{val || "-"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PAGE LISTE
  return (
    <div style={{ minHeight: "100vh", background: bgPage, padding: "16px 20px", fontFamily: "sans-serif" }}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? "dark" : "light"}
      />

      {showRestoreModal && selectedDossier && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(6px)",
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: bgCard,
              border: "1px solid " + borderC,
              borderRadius: 20,
              width: "100%",
              maxWidth: 420,
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
                borderBottom: "1px solid " + borderC,
                background: bgDeep,
              }}
            >
              <p style={{ fontSize: 15, fontWeight: 800, color: textC, margin: 0 }}>Restaurer le dossier</p>
              <button
                onClick={() => setShowRestoreModal(false)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  border: "1px solid " + borderC,
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
              <p style={{ fontSize: 14, color: subC, marginBottom: 16, lineHeight: 1.6 }}>
                Voulez-vous vraiment restaurer ce dossier depuis les archives ?
              </p>
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  background: bgDeep,
                  border: "1px solid " + borderC,
                  marginBottom: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: subC }}>ID</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: textC }}>{selectedDossier.id}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: subC }}>Demandeur</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: textC }}>
                    {selectedDossier.nom} {selectedDossier.prenoms}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: subC }}>Statut</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: getSubStatusStyle(selectedDossier.statut, isDark).color,
                      background: getSubStatusStyle(selectedDossier.statut, isDark).bg,
                      padding: "2px 10px",
                      borderRadius: 999,
                      border: "1px solid " + getSubStatusStyle(selectedDossier.statut, isDark).border,
                    }}
                  >
                    {getSubStatusStyle(selectedDossier.statut, isDark).label}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: subC }}>Date archivage</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: textC }}>
                    {formatDate(selectedDossier.archived_at)}
                  </span>
                </div>
              </div>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: isDark ? "rgba(59,130,246,0.1)" : "#eff6ff",
                  border: "1px solid " + (isDark ? "rgba(59,130,246,0.3)" : "#bfdbfe"),
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <FaInfoCircle style={{ color: "#3b82f6", flexShrink: 0, marginTop: 1 }} size={13} />
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    fontSize: 12,
                    color: isDark ? "#93c5fd" : "#1d4ed8",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  <li>• Le dossier sera retiré des archives</li>
                  <li>• Il sera visible dans la liste de traitement</li>
                  <li>• L'historique complet sera conservé</li>
                </ul>
              </div>
            </div>
            <div
              style={{
                padding: "14px 22px",
                borderTop: "1px solid " + borderC,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                background: bgDeep,
              }}
            >
              <button
                onClick={() => setShowRestoreModal(false)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 10,
                  border: "1px solid " + borderC,
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
                onClick={handleConfirmRestore}
                style={{
                  padding: "8px 20px",
                  borderRadius: 10,
                  border: "none",
                  background: "#16a34a",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Restaurer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* En-tête */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: textC, margin: 0, letterSpacing: "-0.5px" }}>
          Archives des demandes d'équivalence
        </h1>
        <p style={{ fontSize: 12, color: subC, margin: "4px 0 0" }}>
          Consultation des dossiers traités et archivés — restauration possible
        </p>
      </div>

      {/* Tableau */}
      <div
        style={{
          background: bgCard,
          border: "1px solid " + borderC,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        {/* Barre de filtres */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid " + borderC,
            background: bgDeep,
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center",
          }}
        >
          {/* Recherche */}
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
              placeholder="Rechercher (nom, prénom, email...)"
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
                border: "1px solid " + (searchQuery ? "#3b82f6" : borderC),
                background: inputBg,
                color: textC,
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
                boxShadow: searchQuery ? "0 0 0 2px rgba(59,130,246,0.15)" : "none",
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

          {/* Filtre statut */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid " + borderC,
              background: inputBg,
              color: statusFilter ? textC : subC,
              fontSize: 13,
              outline: "none",
              minWidth: 160,
              cursor: "pointer",
            }}
          >
            <option value="">Tous les statuts</option>
            {subStatusOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Filtre type diplôme */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid " + borderC,
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

          {/* Dates */}
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
                border: "1px solid " + borderC,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: subC }}>{lbl}</span>
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

          {(searchQuery || statusFilter || typeFilter || startDateFilter || endDateFilter) && (
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
                border: "1px solid " + borderC,
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
            <ExportMenu isDark={isDark} borderC={borderC} onExport={handleExport} />
          </div>
        </div>

        {/* Compteur */}
        <div style={{ padding: "8px 20px", borderBottom: "1px solid " + borderC }}>
          <span style={{ fontSize: 12, color: subC }}>
            {loading ? "Chargement..." : `${filtered.length} dossier(s) archivé(s)`}
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: headerBg, borderBottom: "2px solid " + borderC }}>
                {[
                  { key: "id", label: "ID" },
                  { key: "nom", label: "DEMANDEUR" },
                  { key: null, label: "TYPE" },
                  { key: null, label: "DATE SOUMISSION" },
                  { key: null, label: "STATUT" },
                  { key: "archived_at", label: "DATE ARCHIVAGE" },
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
                          justifyContent: "center",
                          gap: 5,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: headerC,
                          fontWeight: 700,
                          fontSize: 11,
                          letterSpacing: "0.07em",
                          padding: 0,
                        }}
                      >
                        {label}
                        {sortBy === key && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            {sortDirection === "asc" ? (
                              <path d="M12 5v14M8 9l4-4 4 4" />
                            ) : (
                              <path d="M12 19V5M8 15l4 4 4-4" />
                            )}
                          </svg>
                        )}
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
                  <td colSpan={7} style={{ padding: "60px 20px", textAlign: "center", color: subC }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <FaSpinner className="animate-spin" size={22} />
                      <span style={{ fontSize: 13 }}>Chargement des archives...</span>
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "60px 20px", textAlign: "center", color: subC }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.5 }}>
                      <FaArchive size={22} />
                      <span style={{ fontSize: 13 }}>Aucun dossier archivé trouvé.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((eq) => {
                  const ss = getSubStatusStyle(eq.statut, isDark);
                  return (
                    <tr
                      key={eq.id}
                      style={{
                        borderBottom: "1px solid " + borderC,
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = rowHover)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* ID */}
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

                      {/* Demandeur */}
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: textC }}>
                          {eq.nom} {eq.prenoms}
                        </div>
                        <div style={{ fontSize: 11, color: subC }}>{eq.email}</div>
                      </td>

                      {/* Type diplôme */}
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
                            border: "1px solid " + borderC,
                          }}
                        >
                          {eq.type_diplome}
                        </span>
                      </td>

                      {/* Date soumission */}
                      <td style={{ padding: "12px 16px", textAlign: "center", fontSize: 13, color: subC }}>
                        {formatDate(eq.submitted_at || eq.created_at)}
                      </td>

                      {/* Statut */}
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
                            border: "1px solid " + ss.border,
                          }}
                        >
                          {ss.label}
                        </span>
                      </td>

                      {/* Date archivage */}
                      <td style={{ padding: "12px 16px", textAlign: "center", fontSize: 13, color: subC }}>
                        {formatDate(eq.archived_at || eq.created_at)}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <ActionBtn
                            title="Voir le dossier"
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
                            title="Restaurer le dossier"
                            color="#16a34a"
                            isDark={isDark}
                            borderC={borderC}
                            onClick={() => handleOpenRestore(eq)}
                          >
                            <FaRedo size={13} />
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
              borderTop: "1px solid " + borderC,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 12, color: subC }}>
              Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
              {Math.min(currentPage * itemsPerPage, filtered.length)} sur {filtered.length} dossiers
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid " + borderC,
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
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span style={{ fontSize: 13, color: subC, padding: "0 2px" }}>…</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(p)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: currentPage === p ? "1px solid #3b82f6" : "1px solid " + borderC,
                        background: currentPage === p ? "#3b82f6" : bgCard,
                        color: currentPage === p ? "#fff" : isDark ? "#94a3b8" : "#64748b",
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid " + borderC,
                  background: bgCard,
                  color: isDark ? "#94a3b8" : "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  opacity: currentPage === totalPages ? 0.3 : 1,
                }}
              >
                <HiOutlineChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ArchiveEquivalenceView;