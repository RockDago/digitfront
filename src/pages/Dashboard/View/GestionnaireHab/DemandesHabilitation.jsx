import React, { useContext, useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  FaSearch,
  FaUserCheck,
  FaEye,
  FaArrowLeft,
  FaTimes,
  FaFileExport,
  FaFileExcel,
  FaFilePdf,
  FaCheckCircle,
} from "react-icons/fa";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiChevronDown } from "react-icons/hi2";
import { ThemeContext } from "../../../../context/ThemeContext";

// ─── COMPOSANT MENU EXPORT ──────────────────────────────────────────────────
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
    // TODO: brancher l’export réel (Excel/PDF)
    setIsOpen(false);
  };

  return (
    <div className="relative h-full" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center h-full gap-2 px-4 py-2.5 text-sm font-normal rounded-xl transition border cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800"
        style={{ background: isDark ? "#1e293b" : "#ffffff", borderColor: borderC, color: textC }}
      >
        <FaFileExport size={14} />
        <span className="hidden sm:inline">Exporter</span>
        <HiChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
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

// ─── COMPOSANT MODALE (RENDU VIA PORTAL DANS document.body) ──────────────────
function AssignModal({ isOpen, onClose, onConfirm, dossier, experts, selectedExpert, setSelectedExpert, isDark }) {
  if (!isOpen || !dossier) return null;

  const borderC = isDark ? "#334155" : "#e2e8f0";

  return ReactDOM.createPortal(
    // Overlay plein écran — injecté dans document.body, jamais clippé par un parent
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Carte de la modale */}
      <div
        style={{
          background: isDark ? "#1e293b" : "#ffffff",
          border: `1px solid ${borderC}`,
          borderRadius: "1rem",
          padding: "1.5rem",
          width: "100%",
          maxWidth: "440px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
          position: "relative",
        }}
      >
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            color: isDark ? "#64748b" : "#94a3b8",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          <FaTimes size={14} />
        </button>

        {/* Titre */}
        <h2
          style={{
            margin: "0 0 6px",
            fontSize: "1rem",
            fontWeight: 700,
            color: isDark ? "#f1f5f9" : "#0f172a",
          }}
        >
          Assigner un expert
        </h2>
        <p style={{ margin: "0 0 20px", fontSize: "0.8rem", color: isDark ? "#64748b" : "#94a3b8" }}>
          Dossier <strong style={{ color: "#3b82f6" }}>#{dossier.id}</strong> — {dossier.institut}
        </p>

        {/* Select Expert */}
        <label
          style={{
            display: "block",
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: isDark ? "#cbd5e1" : "#334155",
            marginBottom: "8px",
          }}
        >
          Choisir l'expert
        </label>

        <select
          value={selectedExpert}
          onChange={(e) => setSelectedExpert(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "10px",
            border: `1px solid ${borderC}`,
            background: isDark ? "#0f172a" : "#f8fafc",
            color: isDark ? "#e2e8f0" : "#334155",
            fontSize: "0.85rem",
            outline: "none",
            cursor: "pointer",
            marginBottom: "24px",
          }}
        >
          <option value="" disabled>
            -- Sélectionnez un expert --
          </option>
          {experts.map((expert, i) => (
            <option key={i} value={expert}>
              {expert}
            </option>
          ))}
        </select>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "0.85rem",
              fontWeight: 600,
              background: "transparent",
              color: isDark ? "#94a3b8" : "#64748b",
              border: `1px solid ${borderC}`,
              cursor: "pointer",
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={!selectedExpert}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "0.85rem",
              fontWeight: 600,
              background: selectedExpert ? "#3b82f6" : "#93c5fd",
              color: "#ffffff",
              border: "none",
              cursor: selectedExpert ? "pointer" : "not-allowed",
              boxShadow: selectedExpert ? "0 4px 14px rgba(59,130,246,0.35)" : "none",
              transition: "all 0.2s",
            }}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>,
    document.body // ← Injecté directement dans le body, hors de tout parent React
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function DemandesHabilitation() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
  const [viewDossier, setViewDossier] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dossierToAssign, setDossierToAssign] = useState(null);
  const [selectedExpert, setSelectedExpert] = useState("");

  // Toast (en haut à droite)
  const [toastMessage, setToastMessage] = useState(null);

  const experts = [
    "Pr. Rakotoarisoa Jean",
    "Dr. Randrianasolo Marie",
    "Pr. Andriamampionona Hery",
    "Dr. Razafindrakoto Luc",
  ];

  const demandes = [
    { id: 12, institut: "Université d'Antananarivo", secteur: "Public", grade: "Licence", statut: "En cours", date: "2026-02-25" },
    { id: 11, institut: "ISPM", secteur: "Privé", grade: "Master", statut: "En cours", date: "2026-02-24" },
    { id: 10, institut: "Université de Toamasina", secteur: "Public", grade: "Doctorat", statut: "En cours", date: "2026-02-23" },
    { id: 9, institut: "U-Magis", secteur: "Privé", grade: "Licence", statut: "Ajournée", date: "2026-02-22" },
    { id: 8, institut: "Université de Tuléar", secteur: "Public", grade: "Master", statut: "En cours", date: "2026-02-21" },
    { id: 7, institut: "ESPA", secteur: "Privé", grade: "Doctorat", statut: "En cours", date: "2026-02-20" },
    { id: 6, institut: "Université de Fianarantsoa", secteur: "Public", grade: "Licence", statut: "En cours", date: "2026-02-19" },
    { id: 5, institut: "ESTI", secteur: "Privé", grade: "Master", statut: "Ajournée", date: "2026-02-18" },
    { id: 4, institut: "Université de Mahajanga", secteur: "Public", grade: "Doctorat", statut: "En cours", date: "2026-02-17" },
    { id: 3, institut: "ESstic", secteur: "Privé", grade: "Licence", statut: "En cours", date: "2026-02-16" },
    { id: 2, institut: "Université d'Antananarivo", secteur: "Public", grade: "Master", statut: "En cours", date: "2026-02-15" },
    { id: 1, institut: "Université de Fianarantsoa", secteur: "Public", grade: "Doctorat", statut: "En cours", date: "2026-02-14" },
  ];

  const borderC = isDark ? "#334155" : "#e2e8f0";
  const headerBg = isDark ? "#0f172a" : "#f8fafc";
  const headerC = isDark ? "#64748b" : "#94a3b8";
  const textC = isDark ? "#e2e8f0" : "#334155";
  const subC = isDark ? "#475569" : "#94a3b8";
  const rowHover = isDark ? "rgba(59,130,246,0.06)" : "#f8faff";

  const statutBadge = (statut) => {
    const map = {
      Ajournée: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800",
      "En cours": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
      Validée: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800",
      Rejetée: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800",
    };
    return map[statut] || "bg-gray-100 text-gray-600 border border-gray-200";
  };

  const COLS = [
    { k: "id", l: "ID" },
    { k: "institut", l: "Institut" },
    { k: "secteur", l: "Secteur" },
    { k: "grade", l: "Grade" },
    { k: "statut", l: "Statut" },
    { k: "date", l: "Date" },
  ];

  const handleSort = (key) => {
    setSortConfig((p) => ({ key, direction: p.key === key && p.direction === "asc" ? "desc" : "asc" }));
    setPage(1);
  };

  const filteredData = demandes.filter((d) => {
    const fDate = new Date(d.date).toLocaleDateString("fr-FR");
    const str = `${d.id} ${d.institut} ${d.secteur} ${d.grade} ${d.statut} ${fDate}`.toLowerCase();
    const matchSearch = str.includes(search.toLowerCase());

    let matchDate = true;
    if (dateDebut && dateFin) matchDate = d.date >= dateDebut && d.date <= dateFin;
    else if (dateDebut) matchDate = d.date >= dateDebut;
    else if (dateFin) matchDate = d.date <= dateFin;

    return matchSearch && matchDate;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const dir = sortConfig.direction === "asc" ? 1 : -1;
    if (sortConfig.key === "id") return (a.id - b.id) * dir;
    if (sortConfig.key === "date") return (new Date(a.date) - new Date(b.date)) * dir;
    return a[sortConfig.key]?.toString().localeCompare(b[sortConfig.key]?.toString()) * dir;
  });

  const totalPages = Math.max(1, Math.ceil(sortedData.length / perPage));
  const pagedData = sortedData.slice((page - 1) * perPage, page * perPage);

  const handleOpenAssignModal = (dossier) => {
    setDossierToAssign(dossier);
    setSelectedExpert("");
    setIsModalOpen(true);
  };

  const handleConfirmAssign = () => {
    setToastMessage(`Dossier #${dossierToAssign.id} assigné à ${selectedExpert}`);
    setIsModalOpen(false);

    setTimeout(() => setToastMessage(null), 3500);
    setTimeout(() => {
      setDossierToAssign(null);
      setSelectedExpert("");
    }, 300);
  };

  // ── VUE 2 : DÉTAIL DOSSIER ─────────────────────────────────────────────────
  if (viewDossier) {
    return (
      <div className="space-y-6 font-sans">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewDossier(null)}
            className="p-2.5 rounded-xl border bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
            style={{ borderColor: borderC }}
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
              Dossier #{viewDossier.id} — {viewDossier.institut}
            </h1>
            <p className="text-xs mt-1" style={{ color: subC }}>
              Détails et documents attachés
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl" style={{ background: isDark ? "#1e293b" : "#ffffff", border: `1px solid ${borderC}` }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: subC }}>
                Informations générales
              </h3>
              <ul className="space-y-3">
                {[
                  ["Institut", viewDossier.institut],
                  ["Secteur", viewDossier.secteur],
                  ["Grade visé", viewDossier.grade],
                  ["Date de dépôt", new Date(viewDossier.date).toLocaleDateString("fr-FR")],
                ].map(([label, val]) => (
                  <li key={label} className="flex justify-between">
                    <span className="text-sm" style={{ color: subC }}>
                      {label} :
                    </span>
                    <span className="text-sm font-semibold" style={{ color: textC }}>
                      {val}
                    </span>
                  </li>
                ))}
                <li className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: subC }}>
                    Statut :
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statutBadge(viewDossier.statut)}`}>
                    {viewDossier.statut}
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6" style={{ borderColor: borderC }}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: subC }}>
                Documents attachés
              </h3>
              <div className="flex flex-col gap-2">
                {["Maquette_Pédagogique.pdf", "CV_Enseignants.zip"].map((doc) => (
                  <div
                    key={doc}
                    className="p-3 rounded-lg flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                    style={{ border: `1px dashed ${borderC}` }}
                  >
                    <span className="text-sm" style={{ color: textC }}>
                      {doc}
                    </span>
                    <button className="text-sm font-medium" style={{ color: "#3b82f6" }}>
                      Ouvrir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-[10000] flex items-center gap-3 bg-emerald-500 text-white px-5 py-3.5 rounded-xl shadow-2xl">
            <FaCheckCircle size={20} />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // ── VUE 1 : TABLEAU PRINCIPAL ─────────────────────────────────────────────
  return (
    <div className="space-y-6 font-sans relative">
      <div>
        <h1 className="text-xl font-black tracking-tight" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
          Liste des demandes d'habilitation
        </h1>
        <p className="text-xs mt-1" style={{ color: subC }}>
          Consultez, filtrez et traitez les demandes reçues
        </p>
      </div>

      {/* FILTRES + EXPORT (dropdown au-dessus du tableau) */}
      <div className="flex flex-col xl:flex-row gap-3 xl:items-center relative z-20">
        {/* Recherche (un peu plus courte) */}
        <div className="relative w-full xl:max-w-[300px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            style={{ background: isDark ? "#1e293b" : "#ffffff", border: `1px solid ${borderC}`, color: textC }}
          />
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 flex-1">
          {[["Du", dateDebut, setDateDebut], ["Au", dateFin, setDateFin]].map(([label, val, setter]) => (
            <div
              key={label}
              className="flex items-center h-full gap-2 rounded-xl px-3 py-1.5 shrink-0"
              style={{ background: isDark ? "#1e293b" : "#ffffff", border: `1px solid ${borderC}` }}
            >
              <span className="text-xs font-medium whitespace-nowrap" style={{ color: subC }}>
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

        {/* Export à droite */}
        <div className="flex justify-end w-full xl:w-auto xl:ml-auto shrink-0">
          <ExportMenu isDark={isDark} />
        </div>
      </div>

      {/* TABLEAU */}
      <div
        className="flex flex-col rounded-2xl overflow-hidden relative z-10"
        style={{
          background: isDark ? "#1e293b" : "#ffffff",
          border: `1px solid ${borderC}`,
          boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        <div className="px-5 py-4 flex items-center border-b" style={{ borderColor: borderC }}>
          <div className="flex items-center gap-2 text-xs" style={{ color: subC }}>
            Afficher
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="p-1 rounded-md border text-xs focus:outline-none"
              style={{ borderColor: borderC, color: textC, background: isDark ? "#0f172a" : "#f8fafc" }}
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

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[860px]">
            <thead>
              <tr style={{ background: headerBg, borderBottom: `2px solid ${borderC}` }}>
                {COLS.map(({ k, l }) => (
                  <th
                    key={k}
                    onClick={() => handleSort(k)}
                    className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer select-none"
                    style={{ color: headerC }}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {l}
                      {sortConfig.key === k && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          {sortConfig.direction === "asc" ? <path d="M12 5v14M8 9l4-4 4 4" /> : <path d="M12 19V5M8 15l4 4 4-4" />}
                        </svg>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: headerC }}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {pagedData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center" style={{ color: subC }}>
                    <div className="flex flex-col items-center gap-2 opacity-50">
                      <FaSearch size={20} />
                      <span className="text-sm">Aucune demande trouvée.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                pagedData.map((d) => (
                  <tr
                    key={d.id}
                    className="transition-colors duration-150 cursor-default"
                    style={{ borderBottom: `1px solid ${borderC}` }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = rowHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-4 py-4 text-center">
                      <div
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold"
                        style={{ background: isDark ? "#0f172a" : "#f1f5f9", color: isDark ? "#94a3b8" : "#64748b" }}
                      >
                        {d.id}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm font-semibold text-center" style={{ color: textC }}>
                      {d.institut}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          d.secteur === "Public"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                        }`}
                      >
                        {d.secteur}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: isDark ? "#0f172a" : "#f8fafc",
                          color: isDark ? "#94a3b8" : "#64748b",
                          border: `1px solid ${borderC}`,
                        }}
                      >
                        {d.grade}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold ${statutBadge(d.statut)}`}>
                        {d.statut}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-center" style={{ color: subC }}>
                      {new Date(d.date).toLocaleDateString("fr-FR")}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewDossier(d)}
                          className="p-2 rounded-lg transition"
                          style={{ color: "#3b82f6" }}
                          title="Visualiser"
                          onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? "rgba(59,130,246,0.15)" : "#eff6ff")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <FaEye size={17} />
                        </button>

                        <button
                          onClick={() => handleOpenAssignModal(d)}
                          className="p-2 rounded-lg transition"
                          style={{ color: "#10b981" }}
                          title="Assigner"
                          onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? "rgba(16,185,129,0.15)" : "#ecfdf5")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <FaUserCheck size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: `1px solid ${borderC}` }}>
          <span className="text-xs" style={{ color: subC }}>
            {sortedData.length > 0
              ? `Affichage de ${(page - 1) * perPage + 1} à ${Math.min(page * perPage, sortedData.length)} sur ${sortedData.length} dossiers`
              : "Aucun dossier"}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30"
              style={{ border: `1px solid ${borderC}`, background: isDark ? "#1e293b" : "#ffffff", color: isDark ? "#94a3b8" : "#64748b" }}
            >
              <HiOutlineChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-8 h-8 rounded-lg text-xs font-semibold transition"
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
              className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30"
              style={{ border: `1px solid ${borderC}`, background: isDark ? "#1e293b" : "#ffffff", color: isDark ? "#94a3b8" : "#64748b" }}
            >
              <HiOutlineChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODALE — PORTAL */}
      <AssignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAssign}
        dossier={dossierToAssign}
        experts={experts}
        selectedExpert={selectedExpert}
        setSelectedExpert={setSelectedExpert}
        isDark={isDark}
      />

      {/* TOAST — en haut à droite */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[10000] flex items-center gap-3 bg-emerald-500 text-white px-5 py-3.5 rounded-xl shadow-2xl">
          <FaCheckCircle size={20} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
