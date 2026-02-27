// C:\Users\hp\Desktop\Digitalisation\frontend\src\pages\Dashboard\View\Cnh\ListesDemandesHabilitationsCnhView.jsx

import React, { useState, useContext, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { ThemeContext } from "../../../../context/ThemeContext";
import {
  FaSearch,
  FaEye,
  FaTimes as FaTimesCircle,
  FaCheckCircle,
  FaFileExport,
  FaFileExcel,
  FaFilePdf,
  FaUserCheck,
  FaExchangeAlt,
  FaArrowLeft,
  FaClipboardList,
  FaArchive,
} from "react-icons/fa";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiChevronDown,
} from "react-icons/hi2";

// ─── DONNÉES MOCK ─────────────────────────────────────────────────────────────
const DEMANDES_MOCK = [
  {
    id: 31,
    institut: "Université d'Antananarivo",
    secteur: "Public",
    type: "Habilitation",
    niveau: "Master",
    statut: "En cours",
    date: "2026-02-22",
    expert: "Pr. Rakotoarisoa Jean",
    resultat: "En attente d'expertise",
  },
  {
    id: 30,
    institut: "ESPA",
    secteur: "Public",
    type: "Habilitation",
    niveau: "Licence",
    statut: "En cours",
    date: "2026-02-21",
    expert: "Dr. Randrianasolo Marie",
    resultat: "En cours d'évaluation",
  },
  {
    id: 29,
    institut: "INSCAE",
    secteur: "Public",
    type: "Renouvellement",
    niveau: "Master",
    statut: "Habilité",
    date: "2026-02-20",
    expert: "Pr. Andriamampionona Hery",
    resultat: "Favorable",
  },
  {
    id: 28,
    institut: "Université de Fianarantsoa",
    secteur: "Public",
    type: "Habilitation",
    niveau: "Doctorat",
    statut: "En cours",
    date: "2026-02-19",
    expert: "Dr. Razafindrakoto Luc",
    resultat: "En attente d'expertise",
  },
  {
    id: 27,
    institut: "ISPM",
    secteur: "Privé",
    type: "Renouvellement",
    niveau: "Master",
    statut: "Ajourné",
    date: "2026-02-18",
    expert: "Pr. Rakotomalala Solofo",
    resultat: "Réserves",
  },
  {
    id: 26,
    institut: "ESMIA",
    secteur: "Privé",
    type: "Habilitation",
    niveau: "Licence",
    statut: "Habilité",
    date: "2026-02-17",
    expert: "Dr. Randriamampionona Hery",
    resultat: "Favorable",
  },
  {
    id: 25,
    institut: "Université de Toamasina",
    secteur: "Public",
    type: "Renouvellement",
    niveau: "Master",
    statut: "En cours",
    date: "2026-02-16",
    expert: "Pr. Raharimanana Jean",
    resultat: "En cours d'évaluation",
  },
  {
    id: 24,
    institut: "CNTEMAD",
    secteur: "Public",
    type: "Habilitation",
    niveau: "Licence",
    statut: "Ajourné",
    date: "2026-02-15",
    expert: "Dr. Rasoamampionona Lala",
    resultat: "Demande de compléments",
  },
  {
    id: 23,
    institut: "Université de Tuléar",
    secteur: "Public",
    type: "Renouvellement",
    niveau: "Master",
    statut: "En cours",
    date: "2026-02-14",
    expert: "Pr. Randriambololona Hery",
    resultat: "En cours d'évaluation",
  },
  {
    id: 22,
    institut: "Université de Mahajanga",
    secteur: "Public",
    type: "Habilitation",
    niveau: "Licence",
    statut: "Habilité",
    date: "2026-02-13",
    expert: "Dr. Randrianarison Lanto",
    resultat: "Favorable",
  },
  {
    id: 21,
    institut: "IST-T",
    secteur: "Privé",
    type: "Renouvellement",
    niveau: "Master",
    statut: "Habilité",
    date: "2026-02-12",
    expert: "Pr. Rakotoarisoa Jean",
    resultat: "Favorable",
  },
  {
    id: 20,
    institut: "Université de Diégo-Suarez",
    secteur: "Public",
    type: "Habilitation",
    niveau: "Licence",
    statut: "Ajourné",
    date: "2026-02-11",
    expert: "Dr. Randrianasolo Marie",
    resultat: "Réserves",
  },
];

const STATUT_OPTIONS = ["En cours", "Habilité", "Ajourné"];
const MEMBRES_CNH = [
  "Dr. Raharimanana Jean",
  "Pr. Randriambololona Hery",
  "Dr. Rasoamampionona Lala",
  "Pr. Rakotomalala Solofo",
];

// ─── CONFIG STATUT ────────────────────────────────────────────────────────────
const getStatutCfg = (statut, isDark) => {
  switch (statut) {
    case "Habilité":   return isDark ? { lb:"rgba(22,163,74,0.15)",  lt:"#86efac", lbr:"rgba(22,163,74,0.35)" } : { lb:"#f0fdf4", lt:"#166534", lbr:"#bbf7d0" };
    case "En cours":   return isDark ? { lb:"rgba(37,99,235,0.15)",  lt:"#93c5fd", lbr:"rgba(37,99,235,0.35)" } : { lb:"#eff6ff", lt:"#1d4ed8", lbr:"#bfdbfe" };
    case "Ajourné":    return isDark ? { lb:"rgba(249,115,22,0.15)", lt:"#fdba74", lbr:"rgba(249,115,22,0.35)" } : { lb:"#fff7ed", lt:"#c2410c", lbr:"#fed7aa" };
    default:           return isDark ? { lb:"rgba(37,99,235,0.15)",  lt:"#93c5fd", lbr:"rgba(37,99,235,0.35)" } : { lb:"#eff6ff", lt:"#1d4ed8", lbr:"#bfdbfe" };
  }
};

// ─── CONFIG RÉSULTAT ─────────────────────────────────────────────────────────
const getResultatCfg = (resultat, isDark) => {
  if (resultat.includes("Favorable")) {
    return isDark ? { lb:"rgba(22,163,74,0.15)", lt:"#86efac" } : { lb:"#f0fdf4", lt:"#166534" };
  }
  if (resultat.includes("Réserves") || resultat.includes("compléments")) {
    return isDark ? { lb:"rgba(249,115,22,0.15)", lt:"#fdba74" } : { lb:"#fff7ed", lt:"#c2410c" };
  }
  if (resultat.includes("en cours") || resultat.includes("attente")) {
    return isDark ? { lb:"rgba(37,99,235,0.15)", lt:"#93c5fd" } : { lb:"#eff6ff", lt:"#1d4ed8" };
  }
  return isDark ? { lb:"#1e293b", lt:"#94a3b8" } : { lb:"#f8fafc", lt:"#64748b" };
};

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
    // TODO: exporter réellement (Excel/PDF)
    setIsOpen(false);
  };

  return (
    <div className="relative h-full" ref={menuRef}>
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

// ─── MODALE CHANGEMENT DE STATUT AVEC NOTE UNIQUEMENT POUR AJOURNÉ ────────────
function ChangeStatutModal({
  isOpen,
  onClose,
  demande,
  currentStatut,
  onConfirm,
  isDark,
}) {
  const [selected, setSelected] = useState(currentStatut || "");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const borderC = isDark ? "#334155" : "#e2e8f0";
  const isAjourne = selected === "Ajourné";

  useEffect(() => {
    if (isOpen) {
      setSelected(currentStatut || "");
      setNote("");
      setError("");
    }
  }, [isOpen, currentStatut]);

  const handleConfirm = () => {
    // Validation : si Ajourné, la note est obligatoire
    if (selected === "Ajourné" && !note.trim()) {
      setError("Une note est obligatoire pour le statut Ajourné");
      return;
    }
    onConfirm(selected, note);
  };

  if (!isOpen || !demande) return null;

  return ReactDOM.createPortal(
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
          <FaTimesCircle size={14} />
        </button>

        <h2
          style={{
            margin: "0 0 6px",
            fontSize: "1rem",
            fontWeight: 600,
            color: isDark ? "#f1f5f9" : "#0f172a",
          }}
        >
          Changer le statut
        </h2>
        <p
          style={{
            margin: "0 0 16px",
            fontSize: "0.8rem",
            color: isDark ? "#64748b" : "#94a3b8",
          }}
        >
          Demande <strong style={{ color: "#3b82f6" }}>#{demande.id}</strong> —{" "}
          {demande.institut}
        </p>

        <div style={{ marginBottom: "18px" }}>
          <p
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              fontWeight: 600,
              color: isDark ? "#cbd5e1" : "#334155",
              marginBottom: "8px",
            }}
          >
            Sélectionner un statut
          </p>
          <div className="space-y-2">
            {STATUT_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSelected(s);
                  setError("");
                }}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-sm cursor-pointer transition"
                style={{
                  background:
                    selected === s
                      ? isDark
                        ? "rgba(59,130,246,0.18)"
                        : "rgba(59,130,246,0.06)"
                      : isDark
                        ? "#0f172a"
                        : "#f8fafc",
                  border:
                    selected === s
                      ? "1px solid rgba(59,130,246,0.7)"
                      : `1px solid ${borderC}`,
                  color: isDark ? "#e2e8f0" : "#334155",
                }}
              >
                <span>{s}</span>
                {selected === s && (
                  <FaCheckCircle
                    size={18}
                    style={{ color: "#22c55e" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Champ de note - UNIQUEMENT pour Ajourné */}
        {isAjourne && (
          <div style={{ marginBottom: "18px" }}>
            <div className="flex items-center justify-between mb-2">
              <p
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  fontWeight: 600,
                  color: isDark ? "#cbd5e1" : "#334155",
                }}
              >
                Note / Commentaire
                <span style={{ color: "#ef4444", marginLeft: "4px" }}>*</span>
              </p>
              <span style={{ fontSize: "0.7rem", color: "#ef4444" }}>
                Obligatoire
              </span>
            </div>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (error) setError("");
              }}
              placeholder="Veuillez expliquer la raison de l'ajournement..."
              rows={3}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: error ? "1px solid #ef4444" : `1px solid ${borderC}`,
                background: isDark ? "#0f172a" : "#f8fafc",
                color: isDark ? "#e2e8f0" : "#334155",
                fontSize: "0.85rem",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
            {error && (
              <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "4px" }}>
                {error}
              </p>
            )}
          </div>
        )}

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
            onClick={handleConfirm}
            disabled={!selected}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "0.85rem",
              fontWeight: 600,
              background: selected ? "#3b82f6" : "#93c5fd",
              color: "#ffffff",
              border: "none",
              cursor: selected ? "pointer" : "not-allowed",
              boxShadow: selected
                ? "0 4px 14px rgba(59,130,246,0.35)"
                : "none",
              transition: "all 0.2s",
            }}
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── MODALE ASSIGNATION MEMBRE CNH AVEC NOTE ──────────────────────────────────
function AssignMembreModal({
  isOpen,
  onClose,
  onConfirm,
  demande,
  membres,
  selectedMembre,
  setSelectedMembre,
  isDark,
}) {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  
  if (!isOpen || !demande) return null;

  const borderC = isDark ? "#334155" : "#e2e8f0";

  const handleConfirm = () => {
    if (!selectedMembre) {
      setError("Veuillez sélectionner un membre");
      return;
    }
    onConfirm(selectedMembre, note);
  };

  return ReactDOM.createPortal(
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
          <FaTimesCircle size={14} />
        </button>

        <h2
          style={{
            margin: "0 0 6px",
            fontSize: "1rem",
            fontWeight: 600,
            color: isDark ? "#f1f5f9" : "#0f172a",
          }}
        >
          Assigner un membre CNH
        </h2>
        <p
          style={{
            margin: "0 0 20px",
            fontSize: "0.8rem",
            color: isDark ? "#64748b" : "#94a3b8",
          }}
        >
          Demande <strong style={{ color: "#3b82f6" }}>#{demande.id}</strong> —{" "}
          {demande.institut}
        </p>

        <label
          style={{
            display: "block",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontWeight: 600,
            color: isDark ? "#cbd5e1" : "#334155",
            marginBottom: "8px",
          }}
        >
          Choisir le membre <span style={{ color: "#ef4444" }}>*</span>
        </label>

        <select
          value={selectedMembre}
          onChange={(e) => {
            setSelectedMembre(e.target.value);
            if (error) setError("");
          }}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "10px",
            border: error && !selectedMembre ? "1px solid #ef4444" : `1px solid ${borderC}`,
            background: isDark ? "#0f172a" : "#f8fafc",
            color: isDark ? "#e2e8f0" : "#334155",
            fontSize: "0.85rem",
            outline: "none",
            cursor: "pointer",
            marginBottom: "16px",
          }}
        >
          <option value="" disabled>
            -- Sélectionnez un membre --
          </option>
          {membres.map((membre, i) => (
            <option key={i} value={membre}>
              {membre}
            </option>
          ))}
        </select>

        {/* Champ de note pour l'assignation */}
        <div style={{ marginBottom: "18px" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 600,
              color: isDark ? "#cbd5e1" : "#334155",
              marginBottom: "8px",
            }}
          >
            Note / Commentaire
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Instructions ou remarques pour le membre CNH (optionnel)"
            rows={3}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "10px",
              border: `1px solid ${borderC}`,
              background: isDark ? "#0f172a" : "#f8fafc",
              color: isDark ? "#e2e8f0" : "#334155",
              fontSize: "0.85rem",
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
        </div>

        {error && (
          <p style={{ fontSize: "0.75rem", color: "#ef4444", marginBottom: "16px" }}>
            {error}
          </p>
        )}

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
            onClick={handleConfirm}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "0.85rem",
              fontWeight: 600,
              background: "#3b82f6",
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
              transition: "all 0.2s",
            }}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── PAGE RÉSULTAT EXPERTISE AVEC ÉVALUATION ─────────────────────────────────
function ResultatExpertisePage({ demande, onBack, isDark }) {
  const borderC = isDark ? "#334155" : "#e2e8f0";
  const subC = isDark ? "#475569" : "#94a3b8";
  const textC = isDark ? "#e2e8f0" : "#334155";
  const headerBg = isDark ? "#0f172a" : "#f8fafc";

  // Données d'évaluation
  const evaluationData = [
    { plage: "81 à 100%", niveau: "A+", nombre: 0, signification: "Preuves complètes, conforme et probante" },
    { plage: "51 à 80%", niveau: "A", nombre: 0, signification: "Preuves partielles, mais conforme" },
    { plage: "1 à 50%", niveau: "B", nombre: 0, signification: "Preuves faibles ou lacunaires" },
    { plage: "0%", niveau: "C", nombre: 6, signification: "Critères non conformes ou absence de preuves" },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl border bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
          style={{ borderColor: borderC }}
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}
          >
            Résultat d'expertise
          </h1>
          <p className="text-xs mt-1" style={{ color: subC }}>
            Demande #{demande.id} — {demande.institut}
          </p>
        </div>
      </div>

      <div
        className="p-6 rounded-2xl space-y-6"
        style={{
          background: isDark ? "#1e293b" : "#ffffff",
          border: `1px solid ${borderC}`,
        }}
      >
        {/* EVALUATION */}
        <div>
          <h2
            className="text-base font-bold mb-4 pb-2 border-b"
            style={{ color: isDark ? "#f1f5f9" : "#0f172a", borderColor: borderC }}
          >
            ÉVALUATION
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: headerBg, borderBottom: `2px solid ${borderC}` }}>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: subC }}>Plage %</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: subC }}>Niveaux</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: subC }}>Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: subC }}>Signification</th>
                </tr>
              </thead>
              <tbody>
                {evaluationData.map((row, index) => (
                  <tr key={index} style={{ borderBottom: index < evaluationData.length - 1 ? `1px solid ${borderC}` : 'none' }}>
                    <td className="px-4 py-3 text-sm" style={{ color: textC }}>{row.plage}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: textC }}>{row.niveau}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: textC }}>{row.nombre}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: textC }}>{row.signification}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SYNTHÈSE */}
        <div className="mt-6">
          <h2
            className="text-base font-bold mb-4 pb-2 border-b"
            style={{ color: isDark ? "#f1f5f9" : "#0f172a", borderColor: borderC }}
          >
            SYNTHÈSE
          </h2>

          {/* A. Conformité préalable : recevabilité */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: textC }}>
              A. Conformité préalable : recevabilité
            </h3>
            <p className="text-xs mb-2" style={{ color: subC }}>Cocher chaque case si le critère est respecté :</p>
            
            <div className="space-y-2">
              {[
                "Validation MESUPRES (lettre de recevabilité)",
                "Cahier de charges institutionnel conforme",
                "Dispositif de suivi pédagogique",
                "Opportunité de la formation justifiée",
                "Partenariats entrepris (au moins 1 convention active)",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm" style={{ color: textC }}>{item}</span>
                  <span className="text-xs ml-auto" style={{ color: subC }}>0</span>
                </div>
              ))}
            </div>
          </div>

          {/* B. Synthèse des points (Sections 1 à 6) */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: textC }}>
              B. Synthèse des points (Sections 1 à 6)
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ background: headerBg, borderBottom: `2px solid ${borderC}` }}>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: subC }}>Section</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: subC }}>Points obtenus</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "1-Ressources humaines et qualifications",
                    "2– Infrastructures et ressources",
                    "3– Pertinence de l’offre de formation et maquette pédagogique",
                    "4- Évaluation des apprentissages",
                    "5- Performance académique et insertion professionnelle",
                    "6– Gouvernance et Assurance qualité",
                  ].map((section, index) => (
                    <tr key={index} style={{ borderBottom: index < 5 ? `1px solid ${borderC}` : 'none' }}>
                      <td className="px-4 py-3 text-sm" style={{ color: textC }}>{section}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: textC }}>0</td>
                    </tr>
                  ))}
                  <tr style={{ background: headerBg }}>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: textC }}>TOTAL (sur 100)</td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: textC }}>0</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: textC }}>TOTAL %</td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: textC }}>0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Décision sur l'habilitation */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: textC }}>
              Décision sur l'habilitation
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="decision"
                  className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm" style={{ color: textC }}>Habilitation accordée (score ≥ 75 %)</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="decision"
                  className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm" style={{ color: textC }}>Habilitation ajournée (score &lt; 75 %)</span>
              </div>
            </div>
          </div>

          {/* DECISION FINALE */}
          <div className="mt-6 pt-4 border-t" style={{ borderColor: borderC }}>
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-semibold" style={{ color: textC }}>
                DECISION FINALE :
              </h3>
              <span
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: isDark ? "rgba(234,179,8,0.15)" : "#fef9c3",
                  color: isDark ? "#fde047" : "#854d0e",
                  border: `1px solid ${isDark ? "rgba(234,179,8,0.35)" : "#fde047"}`,
                }}
              >
                DECISION EN ATTENTE
              </span>
            </div>
          </div>

          {/* Bouton de validation */}
          <div className="mt-6 flex justify-end">
            <button
              className="px-6 py-2.5 rounded-xl text-sm font-medium transition hover:opacity-90"
              style={{
                background: "#3b82f6",
                color: "#ffffff",
                boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
              }}
            >
              Valider l'évaluation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function ListesDemandesHabilitationsCnhView() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [demandes, setDemandes] = useState(DEMANDES_MOCK);
  const [search, setSearch] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
  const [viewDemande, setViewDemande] = useState(null);
  const [viewResultat, setViewResultat] = useState(null);

  // Modale changement statut
  const [isStatutModalOpen, setIsStatutModalOpen] = useState(false);
  const [demandeForStatut, setDemandeForStatut] = useState(null);

  // Modale assignation membre CNH
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [demandeToAssign, setDemandeToAssign] = useState(null);
  const [selectedMembre, setSelectedMembre] = useState("");

  const [toastMessage, setToastMessage] = useState(null);

  const borderC = isDark ? "#334155" : "#e2e8f0";
  const headerBg = isDark ? "#0f172a" : "#f8fafc";
  const headerC = isDark ? "#64748b" : "#94a3b8";
  const textC = isDark ? "#e2e8f0" : "#334155";
  const subC = isDark ? "#475569" : "#94a3b8";
  const rowHover = isDark ? "rgba(59,130,246,0.06)" : "#f8faff";

  const COLS = [
    { k: "id", l: "ID" },
    { k: "institut", l: "Institut" },
    { k: "secteur", l: "Secteur" },
    { k: "type", l: "Type" },
    { k: "niveau", l: "Niveau" },
    { k: "statut", l: "Statut" },
    { k: "expert", l: "Expert traitant" },
    { k: "date", l: "Date" },
  ];

  const handleSort = (key) => {
    setSortConfig((p) => ({
      key,
      direction: p.key === key && p.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const filteredData = demandes.filter((d) => {
    const str = `${d.id} ${d.institut} ${d.secteur} ${d.type} ${d.niveau} ${d.statut} ${d.expert}`.toLowerCase();
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
    return (
      a[sortConfig.key]?.toString().localeCompare(b[sortConfig.key]?.toString()) * dir
    );
  });

  const totalPages = Math.max(1, Math.ceil(sortedData.length / perPage));
  const pagedData = sortedData.slice((page - 1) * perPage, page * perPage);

  const openStatutModal = (demande) => {
    setDemandeForStatut(demande);
    setIsStatutModalOpen(true);
  };

  const confirmChangeStatut = (newStatut, note) => {
    if (!demandeForStatut || !newStatut) {
      setIsStatutModalOpen(false);
      return;
    }
    
    setDemandes((prev) =>
      prev.map((d) =>
        d.id === demandeForStatut.id ? { ...d, statut: newStatut } : d
      )
    );
    
    setIsStatutModalOpen(false);
    
    let message = `Statut de la demande #${demandeForStatut.id} mis à jour en "${newStatut}"`;
    if (note) {
      message += ` avec note: "${note}"`;
    }
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openAssignModal = (demande) => {
    setDemandeToAssign(demande);
    setSelectedMembre("");
    setIsAssignModalOpen(true);
  };

  const confirmAssign = (selectedMembre, note) => {
    setDemandes((prev) =>
      prev.map((d) =>
        d.id === demandeToAssign.id ? { ...d, expert: selectedMembre } : d
      )
    );
    
    let message = `Demande #${demandeToAssign.id} assignée à ${selectedMembre}`;
    if (note) {
      message += ` avec note: "${note}"`;
    }
    setToastMessage(message);
    
    setIsAssignModalOpen(false);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleArchive = (demande) => {
    setToastMessage(`Demande #${demande.id} archivée avec succès`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const canArchive = (statut) => {
    return statut === "Habilité" || statut === "Ajourné";
  };

  // Si on est dans la page de résultat d'expertise
  if (viewResultat) {
    return (
      <ResultatExpertisePage
        demande={viewResultat}
        onBack={() => setViewResultat(null)}
        isDark={isDark}
      />
    );
  }

  // Si on est dans la vue détail
  if (viewDemande) {
    return (
      <div className="space-y-6 font-sans">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewDemande(null)}
            className="p-2.5 rounded-xl border bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
            style={{ borderColor: borderC }}
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}
            >
              Demande #{viewDemande.id} — {viewDemande.institut}
            </h1>
            <p className="text-xs mt-1" style={{ color: subC }}>
              Détails et documents attachés
            </p>
          </div>
        </div>

        <div
          className="p-6 rounded-2xl"
          style={{
            background: isDark ? "#1e293b" : "#ffffff",
            border: `1px solid ${borderC}`,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: subC }}
              >
                Informations générales
              </h3>
              <ul className="space-y-3">
                {[
                  ["ID", `#${viewDemande.id}`],
                  ["Institut", viewDemande.institut],
                  ["Secteur", viewDemande.secteur],
                  ["Type", viewDemande.type],
                  ["Niveau visé", viewDemande.niveau],
                  ["Date", new Date(viewDemande.date).toLocaleDateString("fr-FR")],
                  ["Expert traitant", viewDemande.expert],
                ].map(([label, val]) => (
                  <li key={label} className="flex justify-between">
                    <span className="text-sm" style={{ color: subC }}>
                      {label} :
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: textC }}
                    >
                      {val}
                    </span>
                  </li>
                ))}
                <li className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: subC }}>
                    Statut :
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-normal border`}
                    style={{
                      background: getStatutCfg(viewDemande.statut, isDark).lb,
                      color: getStatutCfg(viewDemande.statut, isDark).lt,
                      borderColor: getStatutCfg(viewDemande.statut, isDark).lbr,
                    }}
                  >
                    {viewDemande.statut}
                  </span>
                </li>
              </ul>
            </div>

            <div
              className="border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6"
              style={{ borderColor: borderC }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: subC }}
              >
                Documents attachés
              </h3>
              <div className="flex flex-col gap-2">
                {["Dossier_Habilitation.pdf", "Annexes.zip", "Attestation.pdf"].map(
                  (doc) => (
                    <div
                      key={doc}
                      className="p-3 rounded-lg flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                      style={{ border: `1px dashed ${borderC}` }}
                    >
                      <span className="text-sm" style={{ color: textC }}>
                        {doc}
                      </span>
                      <button
                        className="text-sm"
                        style={{ color: "#3b82f6" }}
                      >
                        Ouvrir
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {toastMessage && (
          <div className="fixed top-6 right-6 z-[10000] flex items-center gap-3 bg-emerald-500 text-white px-5 py-3.5 rounded-xl shadow-2xl">
            <FaCheckCircle size={20} />
            <span className="text-sm">{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // ─── VUE LISTE ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 font-sans relative">
      <div>
        <h1
          className="text-xl font-bold tracking-tight"
          style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}
        >
          Listes des demandes d'habilitations
        </h1>
        <p className="text-xs mt-1" style={{ color: subC }}>
          {filteredData.length} demande{filteredData.length > 1 ? "s" : ""} trouvée
          {filteredData.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* FILTRES + EXPORT */}
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
            placeholder="Rechercher..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                className="text-xs whitespace-nowrap"
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

      {/* TABLEAU */}
      <div
        className="flex flex-col rounded-2xl overflow-hidden relative z-10"
        style={{
          background: isDark ? "#1e293b" : "#ffffff",
          border: `1px solid ${borderC}`,
          boxShadow: isDark
            ? "0 1px 6px rgba(0,0,0,0.4)"
            : "0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        {/* Top bar */}
        <div
          className="px-5 py-4 flex items-center border-b"
          style={{ borderColor: borderC }}
        >
          <div className="flex items-center gap-2 text-xs" style={{ color: subC }}>
            Afficher
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="p-1 rounded-md border text-xs focus:outline-none"
              style={{
                borderColor: borderC,
                color: textC,
                background: isDark ? "#0f172a" : "#f8fafc",
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            demandes
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[1100px]">
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
                    className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer select-none"
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
                  className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                  style={{ color: headerC }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {pagedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLS.length + 1}
                    className="px-4 py-10 text-center"
                    style={{ color: subC }}
                  >
                    <div className="flex flex-col items-center gap-2 opacity-50">
                      <FaSearch size={20} />
                      <span className="text-sm">Aucune demande trouvée.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                pagedData.map((d) => {
                  const cfg = getStatutCfg(d.statut, isDark);
                  return (
                    <tr
                      key={d.id}
                      className="transition-colors duration-150 cursor-default"
                      style={{ borderBottom: `1px solid ${borderC}` }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = rowHover)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {/* ID */}
                      <td className="px-4 py-4 text-center">
                        <div
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs"
                          style={{
                            background: isDark ? "#0f172a" : "#f1f5f9",
                            color: isDark ? "#94a3b8" : "#64748b",
                          }}
                        >
                          {d.id}
                        </div>
                      </td>

                      {/* Institut */}
                      <td
                        className="px-4 py-4 text-sm text-center"
                        style={{ color: textC }}
                      >
                        {d.institut}
                      </td>

                      {/* Secteur */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[11px] ${
                            d.secteur === "Public"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          }`}
                        >
                          {d.secteur}
                        </span>
                      </td>

                      {/* Type - simplifié sans fond */}
                      <td
                        className="px-4 py-4 text-sm text-center"
                        style={{ color: textC }}
                      >
                        {d.type}
                      </td>

                      {/* Niveau */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className="inline-block px-2.5 py-1 rounded-full text-xs"
                          style={{
                            background: isDark ? "#0f172a" : "#f8fafc",
                            color: isDark ? "#94a3b8" : "#64748b",
                            border: `1px solid ${borderC}`,
                          }}
                        >
                          {d.niveau}
                        </span>
                      </td>

                      {/* Statut - sans point */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] border"
                          style={{
                            background: cfg.lb,
                            color: cfg.lt,
                            borderColor: cfg.lbr,
                          }}
                        >
                          {d.statut}
                        </span>
                      </td>

                      {/* Expert traitant */}
                      <td
                        className="px-4 py-4 text-sm text-center"
                        style={{ color: textC }}
                      >
                        {d.expert}
                      </td>

                      {/* Date */}
                      <td
                        className="px-4 py-4 text-sm text-center"
                        style={{ color: subC }}
                      >
                        {new Date(d.date).toLocaleDateString("fr-FR")}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Voir détails */}
                          <button
                            onClick={() => setViewDemande(d)}
                            className="p-2 rounded-lg transition"
                            style={{ color: "#3b82f6" }}
                            title="Voir les détails"
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = isDark
                                ? "rgba(59,130,246,0.15)"
                                : "#eff6ff")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            <FaEye size={17} />
                          </button>

                          {/* Voir résultat expertise */}
                          <button
                            onClick={() => setViewResultat(d)}
                            className="p-2 rounded-lg transition"
                            style={{ color: "#8b5cf6" }}
                            title="Voir le résultat de l'expertise"
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = isDark
                                ? "rgba(139,92,246,0.15)"
                                : "#f5f3ff")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            <FaClipboardList size={16} />
                          </button>

                          {/* Assigner un membre CNH */}
                          <button
                            onClick={() => openAssignModal(d)}
                            className="p-2 rounded-lg transition"
                            style={{ color: "#10b981" }}
                            title="Assigner à un membre CNH"
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = isDark
                                ? "rgba(16,185,129,0.15)"
                                : "#ecfdf5")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            <FaUserCheck size={17} />
                          </button>

                          {/* Changer statut */}
                          <button
                            onClick={() => openStatutModal(d)}
                            className="p-2 rounded-lg transition"
                            style={{ color: "#eab308" }}
                            title="Changer le statut"
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = isDark
                                ? "rgba(234,179,8,0.18)"
                                : "#fef9c3")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            <FaExchangeAlt size={16} />
                          </button>

                          {/* Archiver - seulement pour Habilité ou Ajourné */}
                          <button
                            onClick={() => handleArchive(d)}
                            disabled={!canArchive(d.statut)}
                            className="p-2 rounded-lg transition"
                            style={{ 
                              color: canArchive(d.statut) ? "#6b7280" : "#d1d5db",
                              cursor: canArchive(d.statut) ? "pointer" : "not-allowed",
                              opacity: canArchive(d.statut) ? 1 : 0.5
                            }}
                            title={canArchive(d.statut) ? "Archiver" : "Seuls les dossiers Habilités ou Ajournés peuvent être archivés"}
                            onMouseEnter={(e) => {
                              if (canArchive(d.statut)) {
                                e.currentTarget.style.background = isDark
                                  ? "rgba(107,114,128,0.15)"
                                  : "#f3f4f6";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <FaArchive size={16} />
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
        <div
          className="px-5 py-4 flex items-center justify-between flex-wrap gap-3"
          style={{ borderTop: `1px solid ${borderC}` }}
        >
          <span className="text-xs" style={{ color: subC }}>
            {sortedData.length > 0
              ? `Affichage de ${(page - 1) * perPage + 1} à ${Math.min(
                  page * perPage,
                  sortedData.length
                )} sur ${sortedData.length} demandes`
              : "Aucune demande"}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30"
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
                className="w-8 h-8 rounded-lg text-xs transition"
                style={{
                  background:
                    p === page ? "#3b82f6" : isDark ? "#1e293b" : "#ffffff",
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
      </div>

      {/* Modales */}
      <ChangeStatutModal
        isOpen={isStatutModalOpen}
        onClose={() => setIsStatutModalOpen(false)}
        demande={demandeForStatut}
        currentStatut={demandeForStatut?.statut}
        onConfirm={confirmChangeStatut}
        isDark={isDark}
      />

      <AssignMembreModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onConfirm={confirmAssign}
        demande={demandeToAssign}
        membres={MEMBRES_CNH}
        selectedMembre={selectedMembre}
        setSelectedMembre={setSelectedMembre}
        isDark={isDark}
      />

      {/* Toast global */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[10000] flex items-center gap-3 bg-emerald-500 text-white px-5 py-3.5 rounded-xl shadow-2xl">
          <FaCheckCircle size={20} />
          <span className="text-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}