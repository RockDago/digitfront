import React, { useContext, useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { FaSearch, FaEye, FaTimes, FaFileExport, FaFileExcel, FaFilePdf, FaUserCheck, FaCheckCircle, FaUniversity, FaUserTie } from "react-icons/fa";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiChevronDown } from "react-icons/hi2";
import { ThemeContext } from "../../../../context/ThemeContext";

// ─── COMPOSANT MODALE DE VISUALISATION ─────────────────────────────────────
function ViewModal({ isOpen, onClose, dossier, isDark }) {
  if (!isOpen || !dossier) return null;

  const borderC = isDark ? "#334155" : "#e2e8f0";
  const textC = isDark ? "#f1f5f9" : "#0f172a";
  const subC = isDark ? "#94a3b8" : "#64748b";
  const bgC = isDark ? "#1e293b" : "#ffffff";
  const bgInner = isDark ? "#0f172a" : "#f8fafc";

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
        className="animate-fade-in"
        style={{
          background: bgC, border: `1px solid ${borderC}`,
          borderRadius: "1rem", width: "100%", maxWidth: "600px",
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)", position: "relative",
        }}
      >
        <div className="sticky top-0 px-6 py-4 border-b flex justify-between items-center" style={{ background: bgC, borderColor: borderC, zIndex: 10 }}>
          <h2 className="text-lg font-bold" style={{ color: textC }}>
            Détails de l'assignation
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg transition hover:bg-gray-100 dark:hover:bg-slate-800" style={{ color: subC }}>
            <FaTimes size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 p-4 rounded-xl" style={{ background: bgInner, border: `1px solid ${borderC}` }}>
            <div>
              <p className="text-[11px] mb-1" style={{ color: subC }}>ID Dossier</p>
              <p className="text-sm font-semibold" style={{ color: "#3b82f6" }}>#{dossier.id}</p>
            </div>
            <div>
              <p className="text-[11px] mb-1" style={{ color: subC }}>Date de soumission</p>
              <p className="text-sm font-semibold" style={{ color: textC }}>{new Date(dossier.date).toLocaleDateString('fr-FR')}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[11px] mb-1" style={{ color: subC }}>Université / Établissement</p>
              <p className="text-sm font-semibold" style={{ color: textC }}>{dossier.universite}</p>
            </div>
            <div>
              <p className="text-[11px] mb-1" style={{ color: subC }}>Grade</p>
              <p className="text-sm font-semibold" style={{ color: textC }}>{dossier.grade}</p>
            </div>
            <div>
              <p className="text-[11px] mb-1" style={{ color: subC }}>Statut actuel</p>
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                dossier.statut === "Habilité" ? "bg-green-100 text-green-700" :
                dossier.statut === "Rejeté" ? "bg-red-100 text-red-700" :
                dossier.statut === "Ajourné" ? "bg-orange-100 text-orange-700" :
                dossier.statut === "En attente" ? "bg-yellow-100 text-yellow-700" :
                "bg-blue-100 text-blue-700"
              }`}>
                {dossier.statut}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Expert */}
            <div className="p-4 rounded-xl flex items-center gap-3" style={{ background: bgInner, border: `1px solid ${borderC}` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                <FaUserTie size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: subC }}>Expert Scientifique</p>
                <p className="text-sm font-bold" style={{ color: textC }}>{dossier.expert || "Non assigné"}</p>
              </div>
            </div>

            {/* CNH */}
            <div className="p-4 rounded-xl flex items-center gap-3" style={{ background: bgInner, border: `1px solid ${borderC}` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                <FaUniversity size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: subC }}>Rapporteur CNH</p>
                <p className="text-sm font-bold" style={{ color: textC }}>{dossier.cnh || "Non assigné"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── COMPOSANT MODALE D'ASSIGNATION ────────────────────────────────────────
function AssignModal({ isOpen, onClose, onConfirm, dossier, experts, cnhMembers, isDark }) {
  const [assignType, setAssignType] = useState("expert"); // 'expert' ou 'cnh'
  const [selectedPerson, setSelectedPerson] = useState("");

  useEffect(() => {
    if (isOpen && dossier) {
      setAssignType("expert");
      setSelectedPerson(dossier.expert || "");
    }
  }, [isOpen, dossier]);

  useEffect(() => {
    if (!isOpen || !dossier) return;
    if (assignType === "expert") setSelectedPerson(dossier.expert || "");
    else setSelectedPerson(dossier.cnh || "");
  }, [assignType, dossier, isOpen]);

  if (!isOpen || !dossier) return null;

  const borderC = isDark ? "#334155" : "#e2e8f0";
  const listToDisplay = assignType === "expert" ? experts : cnhMembers;

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
        className="animate-fade-in"
        style={{
          background: isDark ? "#1e293b" : "#ffffff", border: `1px solid ${borderC}`,
          borderRadius: "1rem", padding: "1.5rem", width: "100%", maxWidth: "440px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)", position: "relative",
        }}
      >
        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "transparent", border: "none", cursor: "pointer", color: isDark ? "#64748b" : "#94a3b8" }}>
          <FaTimes size={14} />
        </button>

        <h2 style={{ margin: "0 0 6px", fontSize: "1rem", fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a" }}>
          Gestion des assignations
        </h2>
        <p style={{ margin: "0 0 20px", fontSize: "0.8rem", color: isDark ? "#64748b" : "#94a3b8" }}>
          Dossier <strong style={{ color: "#3b82f6" }}>#{dossier.id}</strong> — {dossier.universite}
        </p>

        {/* TABS pour choisir Expert ou CNH */}
        <div className="flex p-1 mb-5 rounded-lg border" style={{ borderColor: borderC, background: isDark ? "#0f172a" : "#f1f5f9" }}>
          <button
            onClick={() => setAssignType("expert")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${assignType === "expert" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-gray-700"}`}
          >
            Expert Scientifique
          </button>
          <button
            onClick={() => setAssignType("cnh")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${assignType === "cnh" ? "bg-white dark:bg-slate-700 shadow-sm text-purple-600 dark:text-purple-400" : "text-gray-500 hover:text-gray-700"}`}
          >
            Membre CNH
          </button>
        </div>

        <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: isDark ? "#cbd5e1" : "#334155", marginBottom: "8px" }}>
          Sélectionner {assignType === "expert" ? "l'expert" : "le membre CNH"}
        </label>
        
        <select
          value={selectedPerson}
          onChange={(e) => setSelectedPerson(e.target.value)}
          style={{
            width: "100%", padding: "10px 14px", borderRadius: "10px", border: `1px solid ${borderC}`,
            background: isDark ? "#0f172a" : "#f8fafc", color: isDark ? "#e2e8f0" : "#334155",
            fontSize: "0.85rem", outline: "none", cursor: "pointer", marginBottom: "24px",
          }}
        >
          <option value="">-- Non assigné --</option>
          {listToDisplay.map((p, i) => (
            <option key={i} value={p}>{p}</option>
          ))}
        </select>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 600, background: "transparent", color: isDark ? "#94a3b8" : "#64748b", border: `1px solid ${borderC}`, cursor: "pointer" }}>
            Annuler
          </button>
          <button
            onClick={() => onConfirm(assignType, selectedPerson)}
            style={{
              padding: "8px 16px", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 600,
              background: "#3b82f6", color: "#ffffff", border: "none", cursor: "pointer",
              boxShadow: "0 4px 14px rgba(59,130,246,0.35)", transition: "all 0.2s",
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
    console.log(`Export ${format} généré`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center h-full gap-2 px-4 py-2.5 text-sm font-normal rounded-xl transition border cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800"
        style={{ background: isDark ? "#1e293b" : "#ffffff", borderColor: borderC, color: textC }}
      >
        <FaFileExport size={14} />
        <span className="hidden sm:inline">Exporter</span>
        <HiChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl shadow-xl z-[100] overflow-hidden border" style={{ background: bgC, borderColor: borderC }}>
          <button onClick={() => handleExport("Excel")} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal transition hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer" style={{ color: textC }}>
            <FaFileExcel className="text-green-600" size={16} />
            <span>Excel</span>
          </button>
          <button onClick={() => handleExport("PDF")} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-normal transition hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer" style={{ color: textC }}>
            <FaFilePdf className="text-red-600" size={16} />
            <span>PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function AssignerExpert() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  // --- ÉTATS ---
  const [search, setSearch] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState(null);
  
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [dossierToAssign, setDossierToAssign] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const experts = ["Dr. Rakoto", "Dr. Rabe", "Dr. Rasoa", "Dr. Andry", "Dr. Nirina", "Pr. Jean"];
  const cnhMembers = ["Pr. Rajaonarivelo", "Pr. Rakotondraibe", "Dr. Raharison", "Dr. Ramanantsoa"];

  // --- DONNÉES FACTICES COMPLETES AVEC STATUTS ASSIGNATIONS MULTIPLES ---
  const [demandes, setDemandes] = useState([
    { id: 12, universite: "Université d'Antananarivo", grade: "Licence", type: "Nouvelle demande", date: "2026-02-20", expert: "Dr. Rakoto", cnh: "Pr. Rajaonarivelo", statut: "En cours" },
    { id: 11, universite: "Université de Fianarantsoa", grade: "Master", type: "Renouvellement", date: "2026-02-19", expert: "Dr. Rabe", cnh: "", statut: "En attente" },
    { id: 10, universite: "Université de Tuléar", grade: "Doctorat", type: "Nouvelle demande", date: "2026-02-16", expert: "Dr. Andry", cnh: "Dr. Raharison", statut: "Habilité" },
    { id: 9, universite: "ISPM", grade: "Licence", type: "Renouvellement", date: "2026-02-15", expert: "Dr. Nirina", cnh: "Dr. Ramanantsoa", statut: "Rejeté" },
    { id: 8, universite: "Université de Toamasina", grade: "Master", type: "Nouvelle demande", date: "2026-02-10", expert: "Dr. Rasoa", cnh: "Pr. Rakotondraibe", statut: "En cours" },
    { id: 7, universite: "U-Magis", grade: "Licence", type: "Nouvelle demande", date: "2026-02-08", expert: "Pr. Jean", cnh: "", statut: "Ajourné" },
    { id: 6, universite: "Université de Mahajanga", grade: "Doctorat", type: "Renouvellement", date: "2026-02-05", expert: "Dr. Nirina", cnh: "Dr. Raharison", statut: "Habilité" },
    { id: 5, universite: "ESPA", grade: "Master", type: "Nouvelle demande", date: "2026-02-01", expert: "", cnh: "", statut: "En attente" },
    { id: 4, universite: "ESTI", grade: "Licence", type: "Renouvellement", date: "2026-01-28", expert: "Dr. Rabe", cnh: "Pr. Rajaonarivelo", statut: "Ajourné" },
    { id: 3, universite: "Université d'Antsiranana", grade: "Master", type: "Nouvelle demande", date: "2026-01-25", expert: "Dr. Rasoa", cnh: "Dr. Ramanantsoa", statut: "En cours" },
    { id: 2, universite: "ESstic", grade: "Licence", type: "Renouvellement", date: "2026-01-20", expert: "", cnh: "", statut: "En attente" },
    { id: 1, universite: "ISCAM", grade: "Master", type: "Nouvelle demande", date: "2026-01-15", expert: "Pr. Jean", cnh: "Pr. Rakotondraibe", statut: "Habilité" },
  ]);

  // --- STYLES ---
  const borderC   = isDark ? "#334155" : "#e2e8f0";
  const headerBg  = isDark ? "#0f172a" : "#f8fafc";
  const headerC   = isDark ? "#64748b" : "#94a3b8";
  const textC     = isDark ? "#e2e8f0" : "#334155";
  const subC      = isDark ? "#475569" : "#94a3b8";
  const rowHover  = isDark ? "rgba(59,130,246,0.06)" : "#f8faff";

  const statutBadge = (statut) => {
    switch(statut) {
      case "Habilité": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800";
      case "Rejeté": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800";
      case "En cours": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
      case "Ajourné": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800";
      case "En attente": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700";
    }
  };

  const COLS = [
    { k: "id", l: "ID" },
    { k: "universite", l: "Université" },
    { k: "grade", l: "Grade" },
    { k: "statut", l: "Statut" },
    { k: "date", l: "Date" },
    { k: "expert", l: "Expert" },
    { k: "cnh", l: "CNH" },
  ];

  // --- LOGIQUE DE TRI ET FILTRES ---
  const handleSort = (key) => {
    setSortConfig(p => ({ key, direction: p.key === key && p.direction === 'asc' ? 'desc' : 'asc' }));
    setPage(1);
  };

  const filteredData = demandes.filter((d) => {
    const fDate = new Date(d.date).toLocaleDateString('fr-FR');
    const str = `${d.id} ${d.universite} ${d.grade} ${d.statut} ${d.expert} ${d.cnh} ${fDate}`.toLowerCase();
    const matchSearch = str.includes(search.toLowerCase());
    let matchDate = true;
    if (dateDebut && dateFin) matchDate = d.date >= dateDebut && d.date <= dateFin;
    else if (dateDebut) matchDate = d.date >= dateDebut;
    else if (dateFin) matchDate = d.date <= dateFin;
    return matchSearch && matchDate;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const dir = sortConfig.direction === 'asc' ? 1 : -1;
    if (sortConfig.key === 'id') return (a.id - b.id) * dir;
    if (sortConfig.key === 'date') return (new Date(a.date) - new Date(b.date)) * dir;
    const valA = a[sortConfig.key] || "";
    const valB = b[sortConfig.key] || "";
    return valA.toString().localeCompare(valB.toString()) * dir;
  });

  const totalPages = Math.max(1, Math.ceil(sortedData.length / perPage));
  const pagedData  = sortedData.slice((page - 1) * perPage, page * perPage);

  // --- ACTIONS ---
  const handleOpenAssign = (dossier) => {
    setDossierToAssign(dossier);
    setIsAssignOpen(true);
  };

  const handleConfirmAssign = (type, personName) => {
    setDemandes(prev => prev.map(d => {
      if (d.id === dossierToAssign.id) {
        return { ...d, [type]: personName }; // met à jour soit 'expert' soit 'cnh'
      }
      return d;
    }));

    setToastMessage(`Dossier #${dossierToAssign.id} : ${type === 'expert' ? 'Expert' : 'CNH'} mis à jour.`);
    setIsAssignOpen(false);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 font-sans relative">
      
      <div>
        <h1 className="text-xl font-black tracking-tight" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
          Liste des dossiers assignées (Expert & CNH)
        </h1>
        <p className="text-xs mt-1 font-normal" style={{ color: subC }}>
          Assignez un Expert et CNH pour chaque dossier
        </p>
      </div>

      {/* FILTRES */}
      <div className="flex flex-col xl:flex-row gap-3 xl:items-center relative z-20">
        <div className="relative w-full xl:max-w-[300px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher (ID, Expert, CNH...)"
            className="w-full pl-9 pr-4 py-2.5 text-sm font-normal rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            style={{ background: isDark ? "#1e293b" : "#ffffff", border: `1px solid ${borderC}`, color: textC }}
          />
        </div>
        
        {/* Dates */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0">
          {[["Du", dateDebut, setDateDebut], ["Au", dateFin, setDateFin]].map(([label, val, setter]) => (
            <div key={label} className="flex items-center h-full gap-2 rounded-xl px-3 py-1.5 shrink-0" style={{ background: isDark ? "#1e293b" : "#ffffff", border: `1px solid ${borderC}` }}>
              <span className="text-xs font-normal whitespace-nowrap" style={{ color: subC }}>{label}</span>
              <input type="date" value={val} onChange={(e) => { setter(e.target.value); setPage(1); }} className="bg-transparent text-sm focus:outline-none cursor-pointer" style={{ color: textC }} />
            </div>
          ))}
        </div>

        <div className="flex justify-end w-full xl:w-auto xl:ml-auto shrink-0">
          <ExportMenu isDark={isDark} />
        </div>
      </div>

      {/* TABLEAU */}
      <div className="flex flex-col rounded-2xl overflow-hidden relative z-10" style={{ background: isDark ? "#1e293b" : "#ffffff", border: `1px solid ${borderC}`, boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)" }}>
        
        <div className="px-5 py-4 flex items-center border-b" style={{ borderColor: borderC }}>
          <div className="flex items-center gap-2 text-xs font-normal" style={{ color: subC }}>
            Afficher
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="p-1 rounded-md border text-xs font-normal focus:outline-none cursor-pointer"
              style={{ borderColor: borderC, color: textC, background: isDark ? "#0f172a" : "#f8fafc" }}>
              {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            dossiers
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[950px]">
            <thead>
              <tr style={{ background: headerBg, borderBottom: `2px solid ${borderC}` }}>
                {COLS.map(({ k, l }) => (
                  <th key={k} onClick={() => handleSort(k)} className="px-4 py-3.5 text-center text-xs font-normal uppercase tracking-wider whitespace-nowrap cursor-pointer select-none" style={{ color: headerC }}>
                    <div className="flex items-center justify-center gap-1">
                      {l}
                      {sortConfig.key === k && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          {sortConfig.direction === 'asc' ? <path d="M12 5v14M8 9l4-4 4 4" /> : <path d="M12 19V5M8 15l4 4 4-4" />}
                        </svg>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3.5 text-center text-xs font-normal uppercase tracking-wider whitespace-nowrap" style={{ color: headerC }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-10 text-center" style={{ color: subC }}>
                    <div className="flex flex-col items-center gap-2 opacity-50">
                      <FaSearch size={20} />
                      <span className="text-sm font-normal">Aucun dossier trouvé.</span>
                    </div>
                  </td>
                </tr>
              ) : pagedData.map((d) => (
                <tr key={d.id} className="transition-colors duration-150 cursor-default" style={{ borderBottom: `1px solid ${borderC}` }} onMouseEnter={e => e.currentTarget.style.background = rowHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-normal" style={{ background: isDark ? "#0f172a" : "#f1f5f9", color: isDark ? "#94a3b8" : "#64748b" }}>
                      {d.id}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-normal" style={{ color: textC }}>
                    {d.universite}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-normal" style={{ background: isDark ? "#0f172a" : "#f8fafc", color: isDark ? "#94a3b8" : "#64748b", border: `1px solid ${borderC}` }}>
                      {d.grade}
                    </span>
                  </td>
                  
                  {/* Statut dossier */}
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-normal ${statutBadge(d.statut)}`}>
                      {d.statut}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center text-sm font-normal" style={{ color: textC }}>
                    {new Date(d.date).toLocaleDateString('fr-FR')}
                  </td>
                  
                  {/* Expert */}
                  <td className="px-4 py-4 text-center">
                    {d.expert ? (
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-normal bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        {d.expert}
                      </span>
                    ) : <span className="text-[10px] text-gray-400 italic">--</span>}
                  </td>

                  {/* CNH */}
                  <td className="px-4 py-4 text-center">
                    {d.cnh ? (
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-normal bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                        {d.cnh}
                      </span>
                    ) : <span className="text-[10px] text-gray-400 italic">--</span>}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => { setSelectedDossier(d); setIsViewOpen(true); }} className="p-2 rounded-lg transition cursor-pointer text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Visualiser">
                        <FaEye size={16} />
                      </button>
                      <button onClick={() => handleOpenAssign(d)} className="p-2 rounded-lg transition cursor-pointer text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" title="Gérer les assignations">
                        <FaUserCheck size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: `1px solid ${borderC}` }}>
          <span className="text-xs font-normal" style={{ color: subC }}>
            {sortedData.length > 0
              ? `Affichage de ${(page - 1) * perPage + 1} à ${Math.min(page * perPage, sortedData.length)} sur ${sortedData.length} dossiers`
              : "Aucun dossier"}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800" style={{ border: `1px solid ${borderC}`, background: isDark ? "#1e293b" : "#ffffff", color: isDark ? "#94a3b8" : "#64748b" }}>
              <HiOutlineChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className="w-8 h-8 rounded-lg text-xs font-normal transition cursor-pointer hover:opacity-80" style={{ background: p === page ? "#3b82f6" : (isDark ? "#1e293b" : "#ffffff"), color: p === page ? "#fff" : (isDark ? "#94a3b8" : "#64748b"), border: `1px solid ${p === page ? "#3b82f6" : borderC}` }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800" style={{ border: `1px solid ${borderC}`, background: isDark ? "#1e293b" : "#ffffff", color: isDark ? "#94a3b8" : "#64748b" }}>
              <HiOutlineChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <ViewModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} dossier={selectedDossier} isDark={isDark} />
      <AssignModal isOpen={isAssignOpen} onClose={() => setIsAssignOpen(false)} onConfirm={handleConfirmAssign} dossier={dossierToAssign} experts={experts} cnhMembers={cnhMembers} isDark={isDark} />

      {/* TOAST EN HAUT À DROITE */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[10000] flex items-center gap-3 bg-emerald-500 text-white px-5 py-3.5 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100">
          <FaCheckCircle size={20} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
