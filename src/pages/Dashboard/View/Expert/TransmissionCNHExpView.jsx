// C:\Users\hp\Desktop\Digitalisation\frontend\src\pages\Dashboard\View\Expert\TransmissionCNHExpView.jsx

import React, { useState, useContext, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { ThemeContext } from "../../../../context/ThemeContext";
import {
  FaClipboardCheck, FaSearch,
  FaFileExport, FaFileExcel, FaFilePdf,
  FaCheckCircle, FaTimes, FaUniversity,
  FaUserTie, FaUserCheck
} from "react-icons/fa";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiChevronDown,
} from "react-icons/hi2";

// ─── DONNÉES MOCK ─────────────────────────────────────────────────────────────
// Simuler l'expert connecté (dans la réalité, viendrait du contexte d'authentification)
const CURRENT_EXPERT = "Pr. Rakotoarisoa Jean";

const DOSSIERS_PRETS = [
  { 
    id: "DOS-004", 
    institut: "Université d'Antananarivo",
    secteur: "Public",
    date: "2026-02-19", 
    grade: "Master",
    expert: "Pr. Rakotoarisoa Jean",
    cnh: "Pr. Rajaonarivelo"
  },
  { 
    id: "DOS-008", 
    institut: "ISPM",
    secteur: "Privé",
    date: "2026-02-15", 
    grade: "Licence",
    expert: "Dr. Randrianasolo Marie",
    cnh: "Dr. Raharison"
  },
  { 
    id: "DOS-010", 
    institut: "U-Magis",
    secteur: "Privé",
    date: "2026-02-13", 
    grade: "Doctorat",
    expert: "Pr. Andriamampionona Hery",
    cnh: "Pr. Rakotondraibe"
  },
  { 
    id: "DOS-011", 
    institut: "Université de Toamasina",
    secteur: "Public",
    date: "2026-02-12", 
    grade: "Licence",
    expert: "Pr. Rakotoarisoa Jean",
    cnh: "Dr. Ramanantsoa"
  },
  { 
    id: "DOS-012", 
    institut: "Université de Tuléar",
    secteur: "Public",
    date: "2026-02-10", 
    grade: "Master",
    expert: "Pr. Rakotoarisoa Jean",
    cnh: "Pr. Rajaonarivelo"
  },
  { 
    id: "DOS-015", 
    institut: "ESPA",
    secteur: "Public",
    date: "2026-02-08", 
    grade: "Doctorat",
    expert: "Dr. Nirina",
    cnh: "Dr. Raharison"
  },
  { 
    id: "DOS-018", 
    institut: "ESTI",
    secteur: "Privé",
    date: "2026-02-05", 
    grade: "Licence",
    expert: "Pr. Rakotoarisoa Jean",
    cnh: "Pr. Rakotondraibe"
  },
];

// ─── MODALE D'ASSIGNATION CNH ────────────────────────────────────────────────
function AssignCNHModal({ isOpen, onClose, onConfirm, dossier, cnhMembers, isDark }) {
  const [selectedCNH, setSelectedCNH] = useState("");

  useEffect(() => {
    if (isOpen && dossier) {
      setSelectedCNH(dossier.cnh || "");
    }
  }, [isOpen, dossier]);

  if (!isOpen || !dossier) return null;

  const borderC = isDark ? "#334155" : "#e2e8f0";
  const textC = isDark ? "#f1f5f9" : "#0f172a";
  const subC = isDark ? "#94a3b8" : "#64748b";

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)", padding: "1rem",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: isDark ? "#1e293b" : "#ffffff",
          border: `1px solid ${borderC}`,
          borderRadius: "1rem", padding: "1.5rem",
          width: "100%", maxWidth: "440px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)", position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "transparent", border: "none", cursor: "pointer",
            color: isDark ? "#64748b" : "#94a3b8",
          }}
        >
          <FaTimes size={14} />
        </button>

        <h2 style={{ margin: "0 0 6px", fontSize: "1rem", fontWeight: 700, color: textC }}>
          Réassigner au CNH
        </h2>
        <p style={{ margin: "0 0 20px", fontSize: "0.8rem", color: subC }}>
          Dossier <strong style={{ color: "#3b82f6" }}>{dossier.id}</strong> — {dossier.institut}
        </p>

        <label style={{
          display: "block", fontSize: "0.7rem", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.05em",
          color: isDark ? "#cbd5e1" : "#334155", marginBottom: "8px"
        }}>
          Sélectionner un membre CNH
        </label>
        
        <select
          value={selectedCNH}
          onChange={(e) => setSelectedCNH(e.target.value)}
          style={{
            width: "100%", padding: "10px 14px", borderRadius: "10px",
            border: `1px solid ${borderC}`,
            background: isDark ? "#0f172a" : "#f8fafc",
            color: isDark ? "#e2e8f0" : "#334155",
            fontSize: "0.85rem", outline: "none", cursor: "pointer",
            marginBottom: "24px",
          }}
        >
          <option value="">-- Non assigné --</option>
          {cnhMembers.map((member, i) => (
            <option key={i} value={member}>{member}</option>
          ))}
        </select>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px", borderRadius: "10px", fontSize: "0.85rem",
              fontWeight: 600, background: "transparent",
              color: isDark ? "#94a3b8" : "#64748b",
              border: `1px solid ${borderC}`, cursor: "pointer",
            }}
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(selectedCNH)}
            style={{
              padding: "8px 16px", borderRadius: "10px", fontSize: "0.85rem",
              fontWeight: 600, background: "#3b82f6", color: "#ffffff",
              border: "none", cursor: "pointer",
              boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
            }}
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── MENU EXPORT ──────────────────────────────────────────────────────────────
function ExportMenu({ isDark }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const borderC = isDark ? "#334155" : "#e2e8f0";
  const bgC = isDark ? "#1e293b" : "#ffffff";
  const textC = isDark ? "#e2e8f0" : "#334155";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = (format) => {
    console.log(`Export ${format} généré`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center h-full gap-2 px-4 py-2.5 text-sm font-normal rounded-xl transition border cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800"
        style={{
          background: isDark ? "#1e293b" : "#ffffff",
          borderColor: borderC,
          color: textC,
        }}
      >
        <FaFileExport size={14} />
        <span className="hidden sm:inline">Exporter</span>
        <HiChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 rounded-xl shadow-xl z-[100] overflow-hidden border"
          style={{ background: bgC, borderColor: borderC }}
        >
          <button
            onClick={() => handleExport("Excel")}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal transition hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer"
            style={{ color: textC }}
          >
            <FaFileExcel className="text-green-600" size={16} />
            <span>Excel</span>
          </button>
          <button
            onClick={() => handleExport("PDF")}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal transition hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
            style={{ color: textC }}
          >
            <FaFilePdf className="text-red-600" size={16} />
            <span>PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function TransmissionCNHExpView() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  
  const [successMsg, setSuccessMsg] = useState("");
  
  // États pour les modales d'assignation
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [dossierToAssign, setDossierToAssign] = useState(null);
  
  // États pour les filtres
  const [search, setSearch] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  // Données des dossiers avec état pour mise à jour
  const [dossiers, setDossiers] = useState(DOSSIERS_PRETS);

  const cnhMembers = [
    "Pr. Rajaonarivelo",
    "Pr. Rakotondraibe",
    "Dr. Raharison",
    "Dr. Ramanantsoa"
  ];

  const borderC = isDark ? "#334155" : "#e2e8f0";
  const headerBg = isDark ? "#0f172a" : "#f8fafc";
  const headerC = isDark ? "#64748b" : "#94a3b8";
  const textC = isDark ? "#e2e8f0" : "#334155";
  const subC = isDark ? "#475569" : "#94a3b8";
  const rowHover = isDark ? "rgba(59,130,246,0.06)" : "#f8faff";

  // Filtrer uniquement les dossiers traités par l'expert connecté
  const dossiersExpert = dossiers.filter(d => d.expert === CURRENT_EXPERT);

  // Filtrage et tri
  const handleSort = (key) => {
    setSortConfig((p) => ({
      key,
      direction: p.key === key && p.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const filteredData = dossiersExpert.filter((d) => {
    const fDate = new Date(d.date).toLocaleDateString("fr-FR");
    const str = `${d.id} ${d.institut} ${d.grade} ${d.expert} ${d.cnh} ${d.secteur}`.toLowerCase();
    const matchSearch = str.includes(search.toLowerCase());

    let matchDate = true;
    if (dateDebut && dateFin) matchDate = d.date >= dateDebut && d.date <= dateFin;
    else if (dateDebut) matchDate = d.date >= dateDebut;
    else if (dateFin) matchDate = d.date <= dateFin;

    return matchSearch && matchDate;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const dir = sortConfig.direction === "asc" ? 1 : -1;
    if (sortConfig.key === "date")
      return (new Date(a.date) - new Date(b.date)) * dir;
    if (sortConfig.key === "id")
      return a.id.localeCompare(b.id) * dir;
    return (
      a[sortConfig.key]?.toString().localeCompare(b[sortConfig.key]?.toString()) *
      dir
    );
  });

  const totalPages = Math.max(1, Math.ceil(sortedData.length / perPage));
  const dossiersFiltres = sortedData.slice((page - 1) * perPage, page * perPage);

  const COLS = [
    { k: "id", l: "ID" },
    { k: "institut", l: "Institut" },
    { k: "secteur", l: "Secteur" },
    { k: "grade", l: "Grade" },
    { k: "date", l: "Date" },
    { k: "expert", l: "Expert" },
    { k: "cnh", l: "CNH" },
  ];

  // Gestion de la réassignation CNH
  const handleOpenAssignModal = (dossier) => {
    setDossierToAssign(dossier);
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssign = (newCNH) => {
    // Mettre à jour le dossier avec le nouveau CNH
    setDossiers(prev => prev.map(d => {
      if (d.id === dossierToAssign.id) {
        return { ...d, cnh: newCNH };
      }
      return d;
    }));

    setSuccessMsg(`Dossier ${dossierToAssign.id} réassigné à ${newCNH || 'aucun membre CNH'}`);
    setIsAssignModalOpen(false);
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  return (
    <div className="space-y-6 font-sans bg-white dark:bg-gray-950 p-6 md:p-8 transition-colors duration-300">

      {/* ── Header ── */}
      <div>
        <h1 className="text-xl font-black tracking-tight" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
          Liste des dossiers transmis au CNH
        </h1>
        <p className="text-xs mt-1 font-normal" style={{ color: subC }}>
          Dossiers traités par {CURRENT_EXPERT}
        </p>
      </div>

      {/* ── Success Toast ── */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-[10000] flex items-center gap-3 bg-emerald-500 text-white px-5 py-3.5 rounded-xl shadow-2xl">
          <FaCheckCircle size={20} />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}

      {/* ── FILTRES + EXPORT ── */}
      <div className="flex flex-col xl:flex-row gap-3 xl:items-center relative z-20">
        {/* Recherche */}
        <div className="relative w-full xl:max-w-[300px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un dossier..."
            className="w-full pl-9 pr-4 py-2.5 text-sm font-normal rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            style={{
              background: isDark ? "#1e293b" : "#ffffff",
              border: `1px solid ${borderC}`,
              color: textC,
            }}
          />
        </div>

        {/* Filtres de dates */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 flex-1">
          {[
            ["Du", dateDebut, setDateDebut],
            ["Au", dateFin, setDateFin],
          ].map(([label, val, setter]) => (
            <div
              key={label}
              className="flex items-center h-full gap-2 rounded-xl px-3 py-1.5 shrink-0"
              style={{
                background: isDark ? "#1e293b" : "#ffffff",
                border: `1px solid ${borderC}`,
              }}
            >
              <span
                className="text-xs font-normal whitespace-nowrap"
                style={{ color: subC }}
              >
                {label}
              </span>
              <input
                type="date"
                value={val}
                onChange={(e) => {
                  setter(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-sm focus:outline-none cursor-pointer"
                style={{ color: textC }}
              />
            </div>
          ))}
        </div>

        {/* Export */}
        <div className="flex justify-end w-full xl:w-auto xl:ml-auto shrink-0">
          <ExportMenu isDark={isDark} />
        </div>
      </div>

      {/* ── TABLEAU DES DOSSIERS ── */}
      <div
        className="flex flex-col rounded-2xl overflow-hidden relative z-10"
        style={{
          background: isDark ? "#1e293b" : "#ffffff",
          border: `1px solid ${borderC}`,
          boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        {/* Top bar - simplifié */}
        <div
          className="px-5 py-4 flex items-center justify-end border-b"
          style={{ borderColor: borderC }}
        >
          <div className="flex items-center gap-2 text-xs font-normal" style={{ color: subC }}>
            Afficher
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="p-1 rounded-md border text-xs font-normal focus:outline-none cursor-pointer"
              style={{
                borderColor: borderC,
                color: textC,
                background: isDark ? "#0f172a" : "#f8fafc",
              }}
            >
              {[5, 10, 20, 50].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            dossiers
          </div>
        </div>

        {dossiersFiltres.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[900px]">
                <thead>
                  <tr
                    style={{
                      background: headerBg,
                      borderBottom: `2px solid ${borderC}`,
                    }}
                  >
                    {COLS.map(({ k, l }) => (
                      <th
                        key={k}
                        onClick={() => handleSort(k)}
                        className="px-4 py-3.5 text-center text-xs font-normal uppercase tracking-wider whitespace-nowrap cursor-pointer select-none"
                        style={{ color: headerC }}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {l}
                          {sortConfig.key === k && (
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              {sortConfig.direction === "asc" ? (
                                <path d="M12 5v14M8 9l4-4 4 4" />
                              ) : (
                                <path d="M12 19V5M8 15l4 4 4-4" />
                              )}
                            </svg>
                          )}
                        </div>
                      </th>
                    ))}
                    <th
                      className="px-4 py-3.5 text-center text-xs font-normal uppercase tracking-wider whitespace-nowrap"
                      style={{ color: headerC }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dossiersFiltres.map((d) => (
                    <tr
                      key={d.id}
                      className="transition-colors duration-150"
                      style={{ borderBottom: `1px solid ${borderC}` }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = rowHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {/* ID */}
                      <td className="px-4 py-4 text-center">
                        <div
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-normal"
                          style={{
                            background: isDark ? "#0f172a" : "#f1f5f9",
                            color: isDark ? "#94a3b8" : "#64748b",
                          }}
                        >
                          {d.id.replace('DOS-', '')}
                        </div>
                      </td>

                      {/* Institut */}
                      <td className="px-4 py-4 text-sm font-normal text-center" style={{ color: textC }}>
                        {d.institut}
                      </td>

                      {/* Secteur (Public/Privé) */}
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          d.secteur === "Public"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                        }`}>
                          {d.secteur}
                        </span>
                      </td>

                      {/* Grade */}
                      <td className="px-4 py-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-normal" style={{ background: isDark ? "#0f172a" : "#f8fafc", color: isDark ? "#94a3b8" : "#64748b", border: `1px solid ${borderC}` }}>
                          {d.grade}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 text-sm font-normal text-center" style={{ color: subC }}>
                        {new Date(d.date).toLocaleDateString("fr-FR")}
                      </td>

                      {/* Expert */}
                      <td className="px-4 py-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-normal bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                          {d.expert}
                        </span>
                      </td>

                      {/* CNH */}
                      <td className="px-4 py-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-normal bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                          {d.cnh}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleOpenAssignModal(d)}
                          className="p-2 rounded-lg transition cursor-pointer text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                          title="Réassigner au CNH"
                        >
                          <FaUserCheck size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              className="px-5 py-4 flex items-center justify-between flex-wrap gap-3"
              style={{ borderTop: `1px solid ${borderC}` }}
            >
              <span className="text-xs font-normal" style={{ color: subC }}>
                {sortedData.length > 0
                  ? `Affichage de ${(page - 1) * perPage + 1} à ${Math.min(
                      page * perPage,
                      sortedData.length
                    )} sur ${sortedData.length} dossiers`
                  : "Aucun dossier"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800"
                  style={{
                    border: `1px solid ${borderC}`,
                    background: isDark ? "#1e293b" : "#ffffff",
                    color: isDark ? "#94a3b8" : "#64748b",
                  }}
                >
                  <HiOutlineChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded-lg text-xs font-normal transition cursor-pointer hover:opacity-80"
                    style={{
                      background: p === page ? "#3b82f6" : isDark ? "#1e293b" : "#ffffff",
                      color: p === page ? "#fff" : isDark ? "#94a3b8" : "#64748b",
                      border: `1px solid ${p === page ? "#3b82f6" : borderC}`,
                    }}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800"
                  style={{
                    border: `1px solid ${borderC}`,
                    background: isDark ? "#1e293b" : "#ffffff",
                    color: isDark ? "#94a3b8" : "#64748b",
                  }}
                >
                  <HiOutlineChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="px-6 py-16 text-center">
            <FaClipboardCheck className="mx-auto text-4xl text-gray-200 dark:text-gray-700 mb-3" />
            <p className="text-gray-400 dark:text-gray-500 text-sm">Aucun dossier trouvé</p>
          </div>
        )}
      </div>

      {/* ── Modale de réassignation CNH ── */}
      <AssignCNHModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onConfirm={handleConfirmAssign}
        dossier={dossierToAssign}
        cnhMembers={cnhMembers}
        isDark={isDark}
      />
    </div>
  );
}