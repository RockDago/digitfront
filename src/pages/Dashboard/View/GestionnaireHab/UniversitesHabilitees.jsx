import React, { useContext, useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { FaSearch, FaEye, FaTimes, FaFileExport, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiChevronDown } from "react-icons/hi2";
import { ThemeContext } from "../../../../context/ThemeContext";

// ─── COMPOSANT MODALE DE VISUALISATION (RENDU VIA PORTAL) ──────────────────
function ViewModal({ isOpen, onClose, habilitation, isDark }) {
  if (!isOpen || !habilitation) return null;

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
          borderRadius: "1rem", width: "100%", maxWidth: "650px",
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)", position: "relative",
        }}
      >
        <div className="sticky top-0 px-6 py-4 border-b flex justify-between items-center" style={{ background: bgC, borderColor: borderC, zIndex: 10 }}>
          <h2 className="text-lg font-bold" style={{ color: textC }}>
            Détails du dossier d'habilitation
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800"
            style={{ color: subC }}
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: "#3b82f6" }}>
              Informations de l'institution
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 p-4 rounded-xl" style={{ background: bgInner, border: `1px solid ${borderC}` }}>
              <div>
                <p className="text-[11px] mb-1" style={{ color: subC }}>Institution ou Établissement *</p>
                <p className="text-sm font-semibold" style={{ color: textC }}>{habilitation.institution}</p>
              </div>
              <div>
                <p className="text-[11px] mb-1" style={{ color: subC }}>Type d'institution *</p>
                <p className="text-sm font-semibold" style={{ color: textC }}>{habilitation.typeInstitution}</p>
              </div>
              <div>
                <p className="text-[11px] mb-1" style={{ color: subC }}>Région *</p>
                <p className="text-sm font-semibold" style={{ color: textC }}>{habilitation.region}</p>
              </div>
              <div>
                <p className="text-[11px] mb-1" style={{ color: subC }}>Adresse exacte *</p>
                <p className="text-sm font-semibold" style={{ color: textC }}>{habilitation.adresseExacte}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: "#3b82f6" }}>
              Informations académiques
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 p-4 rounded-xl" style={{ background: bgInner, border: `1px solid ${borderC}` }}>
              <div>
                <p className="text-[11px] mb-1" style={{ color: subC }}>Domaine *</p>
                <p className="text-sm font-semibold" style={{ color: textC }}>{habilitation.domaine}</p>
              </div>
              <div>
                <p className="text-[11px] mb-1" style={{ color: subC }}>Mention *</p>
                <p className="text-sm font-semibold" style={{ color: textC }}>{habilitation.mention}</p>
              </div>
              <div>
                <p className="text-[11px] mb-1" style={{ color: subC }}>Grade *</p>
                <p className="text-sm font-semibold" style={{ color: textC }}>{habilitation.grade}</p>
              </div>
              <div>
                <p className="text-[11px] mb-1" style={{ color: subC }}>Spécification *</p>
                <p className="text-sm font-semibold" style={{ color: textC }}>{habilitation.specification}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: "#3b82f6" }}>
              Informations de l'arrêté d'habilitation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 p-4 rounded-xl" style={{ background: bgInner, border: `1px solid ${borderC}` }}>
              <div className="sm:col-span-2">
                <p className="text-[11px] mb-1" style={{ color: subC }}>Arrêté d'habilitation *</p>
                <p className="text-sm font-semibold" style={{ color: textC }}>{habilitation.arreteHabilitation}</p>
              </div>
              <div>
                <p className="text-[11px] mb-1" style={{ color: subC }}>Date de l'arrêté *</p>
                <p className="text-sm font-semibold" style={{ color: textC }}>{habilitation.dateArrete}</p>
              </div>
              <div>
                <p className="text-[11px] mb-1" style={{ color: subC }}>Date d'expiration *</p>
                <p className="text-sm font-semibold" style={{ color: textC }}>{habilitation.dateExpirationArrete}</p>
              </div>
            </div>
            
            <div className="mt-3 text-xs italic text-center" style={{ color: subC }}>
              La date d'expiration est calculée automatiquement (validité de 5 ans à partir de la date de l'arrêté)
            </div>
          </div>
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
    alert(`Export ${format} en cours...`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-normal rounded-xl transition border cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800"
        style={{ background: isDark ? "#1e293b" : "#ffffff", borderColor: borderC, color: textC }}
      >
        <FaFileExport size={14} />
        <span>Exporter</span>
        <HiChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg z-50 overflow-hidden"
          style={{ background: bgC, border: `1px solid ${borderC}` }}
        >
          <button
            onClick={() => handleExport("Excel")}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-normal transition hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer"
            style={{ color: textC }}
          >
            <FaFileExcel className="text-green-600" size={16} />
            <span>Excel</span>
          </button>
          <button
            onClick={() => handleExport("PDF")}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-normal transition hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
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

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function UniversitesHabilitees() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUniv, setSelectedUniv] = useState(null);

  const habilitations = [
    { id: 1, institution: "ENI", typeInstitution: "Publique", region: "Ambatosoa", adresseExacte: "Tanambao", domaine: "Informatique", mention: "Informatique", grade: "Licence", specification: "PROFESSIONNEL", arreteHabilitation: "Arrêté n°12345/2026_MESupRES", dateArrete: "25/02/2026", dateExpirationArrete: "25/02/2031", statut: "Habilité" },
    { id: 2, institution: "Université de Fianarantsoa", typeInstitution: "Publique", region: "Haute Matsiatra", adresseExacte: "Andrainjato", domaine: "Sciences", mention: "Mathématiques", grade: "Master", specification: "RECHERCHE", arreteHabilitation: "Arrêté n°2023/142", dateArrete: "10/05/2023", dateExpirationArrete: "10/05/2028", statut: "Habilité" },
    { id: 3, institution: "ISPM", typeInstitution: "Privée", region: "Analamanga", adresseExacte: "Antsobolo", domaine: "Génie Civil", mention: "Bâtiment", grade: "Licence", specification: "PROFESSIONNEL", arreteHabilitation: "Arrêté n°2021/089", dateArrete: "12/03/2021", dateExpirationArrete: "12/03/2026", statut: "Habilité" },
    { id: 4, institution: "Université de Mahajanga", typeInstitution: "Publique", region: "Boeny", adresseExacte: "Ambondrona", domaine: "Médecine", mention: "Médecine Générale", grade: "Doctorat", specification: "PROFESSIONNEL", arreteHabilitation: "Arrêté n°2019/045", dateArrete: "05/01/2019", dateExpirationArrete: "05/01/2024", statut: "Expiré" },
    { id: 5, institution: "ESPA", typeInstitution: "Publique", region: "Analamanga", adresseExacte: "Vontovorona", domaine: "Ingénierie", mention: "Télécommunications", grade: "Master", specification: "PROFESSIONNEL", arreteHabilitation: "Arrêté n°2022/100", dateArrete: "15/08/2022", dateExpirationArrete: "15/08/2027", statut: "Habilité" },
    { id: 6, institution: "U-Magis", typeInstitution: "Privée", region: "Analamanga", adresseExacte: "Behoririka", domaine: "Gestion", mention: "Management", grade: "Licence", specification: "INDIFFERENCIE", arreteHabilitation: "Arrêté n°2024/012", dateArrete: "20/01/2024", dateExpirationArrete: "20/01/2029", statut: "Habilité" },
    { id: 7, institution: "Université de Toamasina", typeInstitution: "Publique", region: "Atsinanana", adresseExacte: "Barikadimy", domaine: "Droit", mention: "Droit Privé", grade: "Licence", specification: "PROFESSIONNEL", arreteHabilitation: "Arrêté n°2020/300", dateArrete: "11/11/2020", dateExpirationArrete: "11/11/2025", statut: "Habilité" },
    { id: 8, institution: "Université de Tuléar", typeInstitution: "Publique", region: "Atsimo Andrefana", adresseExacte: "Maninday", domaine: "Lettres", mention: "Études Françaises", grade: "Licence", specification: "INDIFFERENCIE", arreteHabilitation: "Arrêté n°2021/050", dateArrete: "08/04/2021", dateExpirationArrete: "08/04/2026", statut: "Habilité" },
    { id: 9, institution: "ESTI", typeInstitution: "Privée", region: "Analamanga", adresseExacte: "Antanimena", domaine: "Informatique", mention: "Réseaux", grade: "Licence", specification: "PROFESSIONNEL", arreteHabilitation: "Arrêté n°2018/200", dateArrete: "14/06/2018", dateExpirationArrete: "14/06/2023", statut: "Expiré" },
    { id: 10, institution: "ESstic", typeInstitution: "Privée", region: "Haute Matsiatra", adresseExacte: "Fianarantsoa Centre", domaine: "Communication", mention: "Journalisme", grade: "Licence", specification: "PROFESSIONNEL", arreteHabilitation: "Arrêté n°2025/002", dateArrete: "02/02/2025", dateExpirationArrete: "02/02/2030", statut: "Habilité" },
  ];

  const borderC   = isDark ? "#334155" : "#e2e8f0";
  const headerBg  = isDark ? "#0f172a" : "#f8fafc";
  const headerC   = isDark ? "#64748b" : "#94a3b8";
  const textC     = isDark ? "#e2e8f0" : "#334155";
  const subC      = isDark ? "#475569" : "#94a3b8";
  const rowHover  = isDark ? "rgba(59,130,246,0.06)" : "#f8faff";

  const statutBadge = (statut) => {
    return statut === "Habilité"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800";
  };

  const typeBadge = (type) => {
    return type === "Publique" 
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400";
  };

  const COLS = [
    { k: "id", l: "ID" },
    { k: "institution", l: "Institution" },
    { k: "typeInstitution", l: "Type" },
    { k: "grade", l: "Grade" },
    { k: "dateArrete", l: "Date d'obtention" },
    { k: "dateExpirationArrete", l: "Date d'expiration" },
    { k: "statut", l: "Statut" },
  ];

  const handleSort = (key) => {
    setSortConfig(p => ({ key, direction: p.key === key && p.direction === 'asc' ? 'desc' : 'asc' }));
    setPage(1);
  };

  const filteredData = habilitations.filter((h) => {
    const str = `${h.id} ${h.institution} ${h.typeInstitution} ${h.region} ${h.domaine} ${h.mention} ${h.grade} ${h.statut} ${h.dateArrete} ${h.dateExpirationArrete}`.toLowerCase();
    return str.includes(search.toLowerCase());
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const dir = sortConfig.direction === 'asc' ? 1 : -1;
    if (sortConfig.key === 'id') return (a.id - b.id) * dir;
    if (sortConfig.key === 'dateArrete' || sortConfig.key === 'dateExpirationArrete') {
      const dA = new Date(a[sortConfig.key].split('/').reverse().join('-'));
      const dB = new Date(b[sortConfig.key].split('/').reverse().join('-'));
      return (dA - dB) * dir;
    }
    return a[sortConfig.key]?.toString().localeCompare(b[sortConfig.key]?.toString()) * dir;
  });

  const totalPages = Math.max(1, Math.ceil(sortedData.length / perPage));
  const pagedData  = sortedData.slice((page - 1) * perPage, page * perPage);

  const handleOpenModal = (h) => {
    setSelectedUniv(h);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 font-sans">
      
      <div>
        <h1 className="text-xl font-black tracking-tight" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
          Liste des universités habilitées
        </h1>
        <p className="text-xs mt-1 font-normal" style={{ color: subC }}>
          Liste officielle et détaillée des habilitations actives et échues
        </p>
      </div>

      {/* Structure calquée sur le code de référence pour la barre d'outils */}
      <div className="flex flex-col xl:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher par ID, Institut, Grade, Date..."
            className="w-full pl-9 pr-4 py-2.5 text-sm font-normal rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            style={{ background: isDark ? "#1e293b" : "#ffffff", border: `1px solid ${borderC}`, color: textC }}
          />
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu isDark={isDark} />
        </div>
      </div>

      <div className="flex flex-col rounded-2xl overflow-hidden"
        style={{ background: isDark ? "#1e293b" : "#ffffff", border: `1px solid ${borderC}`, boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)" }}>

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
            habilitations
          </div>
        </div>

        {/* Largeur minimale alignée avec le code de référence */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[950px]">
            <thead>
              <tr style={{ background: headerBg, borderBottom: `2px solid ${borderC}` }}>
                {COLS.map(({ k, l }) => (
                  <th key={k} onClick={() => handleSort(k)}
                    className="px-4 py-3.5 text-center text-xs font-normal uppercase tracking-wider whitespace-nowrap cursor-pointer select-none"
                    style={{ color: headerC }}>
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
                      <span className="text-sm font-normal">Aucune habilitation trouvée.</span>
                    </div>
                  </td>
                </tr>
              ) : pagedData.map((h) => (
                <tr key={h.id} className="transition-colors duration-150 cursor-default"
                  style={{ borderBottom: `1px solid ${borderC}` }}
                  onMouseEnter={e => e.currentTarget.style.background = rowHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                  {/* Padding px-4 py-4 comme le composant de référence */}
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold"
                      style={{ background: isDark ? "#0f172a" : "#f1f5f9", color: isDark ? "#94a3b8" : "#64748b" }}>
                      {h.id}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center text-sm font-normal" style={{ color: textC }}>
                    {h.institution}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${typeBadge(h.typeInstitution)}`}>
                      {h.typeInstitution}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: isDark ? "#0f172a" : "#f8fafc", color: isDark ? "#94a3b8" : "#64748b", border: `1px solid ${borderC}` }}>
                      {h.grade}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center text-sm font-normal" style={{ color: textC }}>
                    {h.dateArrete}
                  </td>

                  <td className="px-4 py-4 text-center text-sm font-normal" style={{ color: subC }}>
                    {h.dateExpirationArrete}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold ${statutBadge(h.statut)}`}>
                      {h.statut}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <button onClick={() => handleOpenModal(h)}
                      className="p-2 rounded-lg transition mx-auto flex cursor-pointer"
                      style={{ color: "#3b82f6" }}
                      title="Visualiser"
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(59,130,246,0.15)" : "#eff6ff"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <FaEye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: `1px solid ${borderC}` }}>
          <span className="text-xs font-normal" style={{ color: subC }}>
            {sortedData.length > 0
              ? `Affichage de ${(page - 1) * perPage + 1} à ${Math.min(page * perPage, sortedData.length)} sur ${sortedData.length} habilitations`
              : "Aucune habilitation"}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800"
              style={{ border: `1px solid ${borderC}`, background: isDark ? "#1e293b" : "#ffffff", color: isDark ? "#94a3b8" : "#64748b" }}>
              <HiOutlineChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className="w-8 h-8 rounded-lg text-xs font-normal transition cursor-pointer hover:opacity-80"
                style={{
                  background: p === page ? "#3b82f6" : (isDark ? "#1e293b" : "#ffffff"),
                  color: p === page ? "#fff" : (isDark ? "#94a3b8" : "#64748b"),
                  border: `1px solid ${p === page ? "#3b82f6" : borderC}`,
                }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800"
              style={{ border: `1px solid ${borderC}`, background: isDark ? "#1e293b" : "#ffffff", color: isDark ? "#94a3b8" : "#64748b" }}>
              <HiOutlineChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <ViewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        habilitation={selectedUniv} 
        isDark={isDark} 
      />

    </div>
  );
}
