import React, { useState, useRef, useEffect } from "react";
import {
  FaCalendarAlt, FaPlus, FaTimes, FaFlask,
  FaTrashAlt, FaChevronLeft, FaChevronRight,
  FaSort, FaSortUp, FaSortDown, FaMapMarkerAlt,
  FaUsers, FaClock, FaCheckCircle, FaBan, FaSpinner,
  FaEdit, FaChevronDown,
} from "react-icons/fa";

const ITEMS_PER_PAGE = 5;

const PROVINCES = {
  "Antananarivo": ["Analamanga", "Bongolava", "Itasy", "Vakinankaratra"],
  "Fianarantsoa": ["Amoron'i Mania", "Haute Matsiatra", "Ihorombe", "Vatovavy", "Fitovinany"],
  "Toamasina": ["Alaotra-Mangoro", "Atsinanana", "Analanjirofo"],
  "Mahajanga": ["Betsiboka", "Boeny", "Melaky", "Sofia"],
  "Toliara": ["Androy", "Anosy", "Atsimo-Andrefana", "Menabe"],
  "Antsiranana": ["Diana", "Sava"],
};

const STATUS_CONFIG = {
  "En cours": {
    label: "En cours",
    icon: <FaSpinner className="animate-spin" size={10} />,
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  "Terminée": {
    label: "Terminée",
    icon: <FaCheckCircle size={10} />,
    cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    dot: "bg-green-500",
  },
  "Annulée": {
    label: "Annulée",
    icon: <FaBan size={10} />,
    cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    dot: "bg-red-500",
  },
};

const ALL_LIEUX = [
  "Université d'Antananarivo", "Université de Fianarantsoa",
  "Université de Toamasina", "Université de Mahajanga",
  "Université de Toliara", "Université d'Antsiranana",
  "INSCAE", "ESPA", "ENS Antananarivo", "ISPM", "IFCS", "IST",
];

const EMPTY_FORM = {
  experts: [],
  lieux: [],
  province: "",
  region: "",
  dateDebut: "",
  dateFin: "",
};

const initialData = [
  {
    id: 1,
    experts: ["Marie Ranaivo", "Hanta Rasolofo", "Jean Rakoto"],
    lieux: ["Université d'Antananarivo", "ESPA"],
    province: "Antananarivo", region: "Analamanga",
    dateDebut: "2026-02-10", dateFin: "2026-02-14", statut: "Terminée",
  },
  {
    id: 2,
    experts: ["Paul Andriamaro", "Hanta Rasolofo"],
    lieux: ["Université de Fianarantsoa"],
    province: "Fianarantsoa", region: "Haute Matsiatra",
    dateDebut: "2026-02-20", dateFin: "2026-02-25", statut: "En cours",
  },
  {
    id: 3,
    experts: ["Lala Rakotondrabe", "Hery Andrianirina", "Nirina Rakoto", "Mialy Rasoa"],
    lieux: ["Université de Toamasina", "IST"],
    province: "Toamasina", region: "Atsinanana",
    dateDebut: "2026-03-01", dateFin: "2026-03-05", statut: "Annulée",
  },
];

function getDuree(debut, fin) {
  if (!debut || !fin) return "—";
  const d1 = new Date(debut), d2 = new Date(fin);
  if (isNaN(d1) || isNaN(d2) || d2 < d1) return "—";
  const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
  return `${diff}j`;
}

function formatDate(d) {
  if (!d) return "—";
  const [y, m, j] = d.split("-");
  return `${j}-${m}-${y}`;
}

// ── TagInput ──────────────────────────────────────────────
function TagInput({ label, required, values, inputVal, setInputVal, onAdd, onRemove, error, placeholder, listId, suggestions, tagColor }) {
  const colors = {
    blue: {
      tag: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      icon: "text-blue-400 hover:text-red-500",
    },
    purple: {
      tag: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
      icon: "text-purple-400 hover:text-red-500",
    },
  };
  const c = colors[tagColor] || colors.blue;

  return (
    <div className="flex flex-col h-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 shrink-0">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-2 shrink-0">
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); onAdd(inputVal); } }}
          placeholder={placeholder}
          list={listId}
          className={`flex-1 px-3 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${error ? "border-red-400" : "border-gray-300 dark:border-gray-600"}`}
        />
        {listId && suggestions && (
          <datalist id={listId}>
            {suggestions.filter(s => !values.includes(s)).map(s => <option key={s} value={s} />)}
          </datalist>
        )}
        <button type="button" onClick={() => onAdd(inputVal)}
          className="px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-1 shrink-0">
          <FaPlus size={11} />
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1 shrink-0">{error}</p>}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
          {values.map(v => (
            <span key={v} className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${c.tag}`}>
              {v}
              <button type="button" onClick={() => onRemove(v)} className={`ml-1 transition ${c.icon}`}>
                <FaTimes size={9} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── StatusDropdown ────────────────────────────────────────
function StatusDropdown({ mission, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const sc = STATUS_CONFIG[mission.statut] || STATUS_CONFIG["En cours"];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button onClick={() => setOpen(o => !o)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full cursor-pointer transition-all hover:opacity-80 ${sc.cls}`}>
        {sc.icon} {sc.label}
        <FaChevronDown size={8} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden min-w-[145px]">
          {Object.entries(STATUS_CONFIG).map(([key, val]) => (
            <button key={key} onClick={() => { onStatusChange(mission.id, key); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${mission.statut === key ? "bg-gray-50 dark:bg-gray-700/60" : ""}`}>
              <span className={`w-2 h-2 rounded-full shrink-0 ${val.dot}`} />
              <span className="text-gray-800 dark:text-gray-200">{val.label}</span>
              {mission.statut === key && <FaCheckCircle size={10} className="ml-auto text-blue-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────
const Modal = ({ title, icon, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]">
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-2xl shrink-0">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <button onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
          <FaTimes size={14} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ── MissionForm ───────────────────────────────────────────
const MissionForm = ({
  form, errors, regions,
  expertInput, setExpertInput,
  lieuInput, setLieuInput,
  handleChange, addExpert, removeExpert, addLieu, removeLieu,
  onSubmit, submitLabel, closeModal,
}) => (
  <form onSubmit={onSubmit} className="px-6 pb-6 pt-5 space-y-5 overflow-y-auto flex-1">

    {/* Équipe */}
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <FaUsers size={12} /> Équipe de mission
      </p>
      <TagInput
        label="Experts / Personnes"
        required
        values={form.experts}
        inputVal={expertInput}
        setInputVal={setExpertInput}
        onAdd={addExpert}
        onRemove={removeExpert}
        error={errors.experts}
        placeholder="Taper un nom et appuyer sur Entrée..."
        tagColor="purple"
      />
    </div>

    {/* Localisation */}
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
        <FaMapMarkerAlt size={12} /> Localisation
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Province <span className="text-red-500">*</span></label>
          <select value={form.province} onChange={e => handleChange("province", e.target.value)}
            className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.province ? "border-red-400" : "border-gray-300 dark:border-gray-600"}`}>
            <option value="">Sélectionner province</option>
            {Object.keys(PROVINCES).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {errors.province && <p className="text-xs text-red-500 mt-1">{errors.province}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Région <span className="text-red-500">*</span></label>
          <select value={form.region} onChange={e => handleChange("region", e.target.value)}
            className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.region ? "border-red-400" : "border-gray-300 dark:border-gray-600"}`}>
            <option value="">{form.province ? "Sélectionner région" : "Choisir d'abord une province"}</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.region && <p className="text-xs text-red-500 mt-1">{errors.region}</p>}
        </div>
      </div>
      <TagInput
        label="Lieux / Établissements à visiter"
        required
        values={form.lieux}
        inputVal={lieuInput}
        setInputVal={setLieuInput}
        onAdd={addLieu}
        onRemove={removeLieu}
        error={errors.lieux}
        placeholder="Taper ou choisir un établissement..."
        listId="lieux-suggestions"
        suggestions={ALL_LIEUX}
        tagColor="blue"
      />
    </div>

    {/* Calendrier */}
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        <FaCalendarAlt size={12} /> Calendrier
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date de début <span className="text-red-500">*</span></label>
          <input type="date" value={form.dateDebut} onChange={e => handleChange("dateDebut", e.target.value)}
            className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.dateDebut ? "border-red-400" : "border-gray-300 dark:border-gray-600"}`} />
          {errors.dateDebut && <p className="text-xs text-red-500 mt-1">{errors.dateDebut}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date de fin prévue <span className="text-red-500">*</span></label>
          <input type="date" value={form.dateFin} onChange={e => handleChange("dateFin", e.target.value)}
            className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.dateFin ? "border-red-400" : "border-gray-300 dark:border-gray-600"}`} />
          {errors.dateFin && <p className="text-xs text-red-500 mt-1">{errors.dateFin}</p>}
        </div>
      </div>
      {form.dateDebut && form.dateFin && form.dateFin >= form.dateDebut && (
        <div className="mt-3 inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-lg px-4 py-2">
          <FaClock className="text-teal-500" size={13} />
          <span className="text-sm text-teal-700 dark:text-teal-300 font-medium">
            Durée prévue : <strong>{getDuree(form.dateDebut, form.dateFin).replace("j", " jour(s)")}</strong>
          </span>
        </div>
      )}
    </div>

    {/* Footer */}
    <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
      <button type="button" onClick={closeModal}
        className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
        Annuler
      </button>
      <button type="submit"
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/30 transition-colors">
        <FaPlus size={11} /> {submitLabel}
      </button>
    </div>
  </form>
);

// ── Composant principal ───────────────────────────────────
export default function PlanificationDescente() {
  const [missions, setMissions] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [expertInput, setExpertInput] = useState("");
  const [lieuInput, setLieuInput] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const regions = form.province ? PROVINCES[form.province] : [];

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value, ...(field === "province" ? { region: "" } : {}) }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const addExpert = (val) => {
    const v = val.trim();
    if (!v || form.experts.includes(v)) return;
    setForm(prev => ({ ...prev, experts: [...prev.experts, v] }));
    setExpertInput("");
    setErrors(prev => ({ ...prev, experts: "" }));
  };
  const removeExpert = (e) => setForm(prev => ({ ...prev, experts: prev.experts.filter(x => x !== e) }));

  const addLieu = (val) => {
    const v = val.trim();
    if (!v || form.lieux.includes(v)) return;
    setForm(prev => ({ ...prev, lieux: [...prev.lieux, v] }));
    setLieuInput("");
    setErrors(prev => ({ ...prev, lieux: "" }));
  };
  const removeLieu = (l) => setForm(prev => ({ ...prev, lieux: prev.lieux.filter(x => x !== l) }));

  const validate = () => {
    const e = {};
    if (form.experts.length === 0) e.experts = "Ajoutez au moins une personne";
    if (form.lieux.length === 0) e.lieux = "Ajoutez au moins un lieu";
    if (!form.province) e.province = "Champ obligatoire";
    if (!form.region) e.region = "Champ obligatoire";
    if (!form.dateDebut) e.dateDebut = "Champ obligatoire";
    if (!form.dateFin) e.dateFin = "Champ obligatoire";
    if (form.dateDebut && form.dateFin && form.dateFin < form.dateDebut) e.dateFin = "Date de fin invalide";
    return e;
  };

  const closeModal = () => {
    setShowModal(false); setEditTarget(null);
    setForm(EMPTY_FORM); setExpertInput(""); setLieuInput(""); setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const newId = missions.length > 0 ? Math.max(...missions.map(m => m.id)) + 1 : 1;
    setMissions([{ id: newId, ...form, statut: "En cours" }, ...missions]);
    closeModal(); setPage(1);
  };

  const openEdit = (mission) => {
    setEditTarget(mission);
    setForm({
      experts: [...mission.experts],
      lieux: [...mission.lieux],
      province: mission.province,
      region: mission.region,
      dateDebut: mission.dateDebut,
      dateFin: mission.dateFin,
    });
    setExpertInput(""); setLieuInput(""); setErrors({});
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setMissions(missions.map(m => m.id === editTarget.id ? { ...m, ...form } : m));
    closeModal();
  };

  const handleStatusChange = (id, newStatut) => {
    setMissions(missions.map(m => m.id === id ? { ...m, statut: newStatut } : m));
  };

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <FaSort className="inline ml-1 text-gray-400 text-xs" />;
    return sortDir === "asc"
      ? <FaSortUp className="inline ml-1 text-blue-500 text-xs" />
      : <FaSortDown className="inline ml-1 text-blue-500 text-xs" />;
  };

  const sorted = [...missions].sort((a, b) => {
    let av = a[sortField], bv = b[sortField];
    if (sortField === "nbPersonnes") { av = a.experts.length; bv = b.experts.length; }
    if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
    return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const thCls = "px-3 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap";

  return (
    // ← Bordure et shadow supprimées
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl transition-colors duration-300">

      {/* En-tête — icône supprimée */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Planification descente</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Gérez les missions de descente sur terrain et leur suivi.</p>
        </div>
        <button onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setExpertInput(""); setLieuInput(""); setErrors({}); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/30 transition-colors">
          <FaPlus size={12} /> Nouvelle mission
        </button>
      </div>

      {/* Tableau */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <th className={`${thCls} text-center w-[6%]`} onClick={() => handleSort("id")}>ID <SortIcon field="id" /></th>
              <th className={`${thCls} text-left w-[24%]`}>Personnes / Experts</th>
              <th className={`${thCls} text-left w-[22%]`} onClick={() => handleSort("province")}>Localisation <SortIcon field="province" /></th>
              <th className={`${thCls} text-center w-[8%]`} onClick={() => handleSort("nbPersonnes")}>
                <span className="flex items-center justify-center gap-1"><FaUsers size={11} />Éq. <SortIcon field="nbPersonnes" /></span>
              </th>
              <th className={`${thCls} text-center w-[10%]`} onClick={() => handleSort("dateDebut")}>Début <SortIcon field="dateDebut" /></th>
              <th className={`${thCls} text-center w-[10%]`} onClick={() => handleSort("dateFin")}>Fin <SortIcon field="dateFin" /></th>
              <th className={`${thCls} text-center w-[7%]`}>
                <span className="flex items-center justify-center gap-1"><FaClock size={11} />Durée</span>
              </th>
              <th className={`${thCls} text-center w-[13%]`} onClick={() => handleSort("statut")}>Statut <SortIcon field="statut" /></th>
              <th className={`${thCls} text-center w-[9%]`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-gray-400 dark:text-gray-500 text-sm italic">
                  Aucune mission planifiée.
                </td>
              </tr>
            ) : (
              paginated.map((m, idx) => {
                const teamSize = m.experts.length;
                return (
                  <tr key={m.id}
                    className={`border-b border-gray-100 dark:border-gray-700 transition-colors ${
                      idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50/60 dark:bg-gray-900/40"
                    } hover:bg-blue-50/40 dark:hover:bg-blue-900/10`}>

                    <td className="px-2 py-3 text-center text-gray-500 dark:text-gray-400 font-mono font-semibold text-xs">
                      {(page - 1) * ITEMS_PER_PAGE + idx + 1}
                    </td>

                    <td className="px-2 py-3">
                      <div className="flex flex-wrap gap-1">
                        {m.experts.map(exp => (
                          <span key={exp} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded-md whitespace-nowrap">
                            <FaFlask size={8} />{exp}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-2 py-3">
                      <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{m.province}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{m.region}</div>
                      <div className="text-xs text-orange-500 dark:text-orange-400 truncate" title={m.lieux.join(", ")}>
                        <FaMapMarkerAlt className="inline mr-0.5" size={9} />
                        {m.lieux.length > 1 ? `${m.lieux[0]} +${m.lieux.length - 1}` : m.lieux[0]}
                      </div>
                    </td>

                    <td className="px-2 py-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full">
                        {teamSize}
                      </span>
                    </td>

                    <td className="px-2 py-3 text-center text-gray-700 dark:text-gray-300 text-xs whitespace-nowrap">
                      {formatDate(m.dateDebut)}
                    </td>
                    <td className="px-2 py-3 text-center text-gray-700 dark:text-gray-300 text-xs whitespace-nowrap">
                      {formatDate(m.dateFin)}
                    </td>

                    <td className="px-2 py-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-semibold rounded-full">
                        <FaClock size={9} />{getDuree(m.dateDebut, m.dateFin)}
                      </span>
                    </td>

                    <td className="px-2 py-3 text-center">
                      <StatusDropdown mission={m} onStatusChange={handleStatusChange} />
                    </td>

                    <td className="px-2 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(m)}
                          className="p-1.5 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors" title="Modifier">
                          <FaEdit size={13} />
                        </button>
                        <button onClick={() => setDeleteTarget(m.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Supprimer">
                          <FaTrashAlt size={12} />
                        </button>
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
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {missions.length} mission{missions.length > 1 ? "s" : ""} au total
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition">
              <FaChevronLeft size={11} />
            </button>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-14 text-center">
              {page} / {totalPages}
            </span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition">
              <FaChevronRight size={11} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL AJOUT */}
      {showModal && (
        <Modal
          title="Nouvelle mission de descente"
          icon={<FaCalendarAlt className="text-blue-600 dark:text-blue-400" />}
          onClose={closeModal}>
          <MissionForm
            form={form} errors={errors} regions={regions}
            expertInput={expertInput} setExpertInput={setExpertInput}
            lieuInput={lieuInput} setLieuInput={setLieuInput}
            handleChange={handleChange} addExpert={addExpert} removeExpert={removeExpert}
            addLieu={addLieu} removeLieu={removeLieu}
            onSubmit={handleSubmit} submitLabel="Enregistrer la mission" closeModal={closeModal}
          />
        </Modal>
      )}

      {/* MODAL MODIFICATION */}
      {editTarget && (
        <Modal
          title="Modifier la mission"
          icon={<FaEdit className="text-amber-500" />}
          onClose={closeModal}>
          <MissionForm
            form={form} errors={errors} regions={regions}
            expertInput={expertInput} setExpertInput={setExpertInput}
            lieuInput={lieuInput} setLieuInput={setLieuInput}
            handleChange={handleChange} addExpert={addExpert} removeExpert={removeExpert}
            addLieu={addLieu} removeLieu={removeLieu}
            onSubmit={handleEditSubmit} submitLabel="Enregistrer les modifications" closeModal={closeModal}
          />
        </Modal>
      )}

      {/* MODAL SUPPRESSION */}
      {deleteTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="flex items-center justify-center w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4">
              <FaTrashAlt className="text-red-500" size={22} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Confirmer la suppression</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Êtes-vous sûr de vouloir supprimer cette mission ? Cette action est irréversible.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
                Annuler
              </button>
              <button onClick={() => { setMissions(missions.filter(m => m.id !== deleteTarget)); setDeleteTarget(null); }}
                className="px-5 py-2.5 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md shadow-red-500/30 transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
