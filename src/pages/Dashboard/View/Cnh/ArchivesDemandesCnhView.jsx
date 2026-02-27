// C:\Users\hp\Desktop\Digitalisation\frontend\src\pages\Dashboard\View\Cnh\ArchivesDemandesCnhView.jsx

import React, { useState, useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import {
  FaSearch,
  FaEye,
  FaFolderOpen,
  FaFileExport,
  FaFileExcel,
  FaFilePdf,
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
  FaGraduationCap,
  FaFileAlt,
  FaExclamationTriangle,
  FaUndoAlt,
} from "react-icons/fa";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiChevronDown,
} from "react-icons/hi2";

// ─── DONNÉES MOCK ARCHIVES ───────────────────────────────────────────────────
const ARCHIVES_MOCK = [
  {
    id: 1,
    ref: "HAB-2026-020",
    institut: "Université d'Antananarivo",
    secteur: "Public",
    type: "Habilitation",
    niveau: "Master",
    statut: "Habilité",
    dateCloture: "2026-02-12",
    expert: "Pr. Rakotoarisoa Jean",
    decision: "Validée",
    note: "Conforme",
    documents: ["Rapport_final.pdf", "Attestation_Habilitation.pdf"],
    // Informations détaillées pour le modal
    details: {
      institution: {
        nom: "Université d'Antananarivo",
        type: "Université publique",
        region: "Analamanga",
        adresse: "BP 566, Avenue de l'Indépendance, Antananarivo 101"
      },
      academique: {
        domaine: "Sciences et Technologies",
        mention: "Informatique Appliquée",
        grade: "Master",
        specification: "PROFESSIONNEL"
      },
      arrete: {
        reference: "Arrêté n°12345/2025-MESupRES",
        date: "2025-12-15"
      }
    }
  },
  {
    id: 2,
    ref: "HAB-2026-019",
    institut: "ESPA",
    secteur: "Public",
    type: "Renouvellement",
    niveau: "Licence",
    statut: "Ajourné",
    dateCloture: "2026-02-11",
    expert: "Dr. Randrianasolo Marie",
    decision: "Rejetée",
    note: "Pièces manquantes - Dossier incomplet, documents administratifs non fournis",
    commentaireAjournement: "Le dossier ne contient pas les attestations de conformité des locaux et les CV des enseignants permanents sont manquants. Veuillez fournir les pièces suivantes :\n- Attestation de conformité des locaux\n- CV détaillés des 5 enseignants permanents\n- Programme détaillé des enseignements",
    documents: ["Rapport_expertise.pdf", "Courrier_rejet.pdf"],
    details: {
      institution: {
        nom: "ESPA",
        type: "École supérieure publique",
        region: "Analamanga",
        adresse: "BP 123, Antananarivo 101"
      },
      academique: {
        domaine: "Sciences Agronomiques",
        mention: "Agriculture Durable",
        grade: "Licence",
        specification: "PROFESSIONNEL"
      }
      // Pas d'arrêté pour les demandes ajournées
    }
  },
  {
    id: 3,
    ref: "HAB-2026-018",
    institut: "INSCAE",
    secteur: "Public",
    type: "Habilitation",
    niveau: "Master",
    statut: "Habilité",
    dateCloture: "2026-02-09",
    expert: "Pr. Andriamampionona Hery",
    decision: "Validée",
    note: "OK",
    documents: ["Rapport_final.pdf", "Annexes.zip"],
    details: {
      institution: {
        nom: "INSCAE",
        type: "Institut public",
        region: "Analamanga",
        adresse: "BP 234, Antananarivo 101"
      },
      academique: {
        domaine: "Gestion et Management",
        mention: "Management des Organisations",
        grade: "Master",
        specification: "PROFESSIONNEL"
      },
      arrete: {
        reference: "Arrêté n°4567/2025-MESupRES",
        date: "2025-10-10"
      }
    }
  },
  {
    id: 4,
    ref: "HAB-2026-017",
    institut: "Université de Fianarantsoa",
    secteur: "Public",
    type: "Habilitation",
    niveau: "Doctorat",
    statut: "Ajourné",
    dateCloture: "2026-02-07",
    expert: "Dr. Razafindrakoto Luc",
    decision: "Rejetée",
    note: "Non conforme - Programme académique insuffisant",
    commentaireAjournement: "Le programme de formation ne répond pas aux critères d'excellence requis pour un doctorat. Les unités de recherche associées ne sont pas suffisamment développées. Points à corriger :\n- Renforcer l'équipe encadrante\n- Préciser les conventions avec les laboratoires de recherche\n- Détailler le programme des séminaires doctoraux",
    documents: ["Rapport_expertise.pdf", "Notification.pdf"],
    details: {
      institution: {
        nom: "Université de Fianarantsoa",
        type: "Université publique",
        region: "Haute Matsiatra",
        adresse: "BP 126, Fianarantsoa 301"
      },
      academique: {
        domaine: "Lettres et Sciences Humaines",
        mention: "Anthropologie",
        grade: "Doctorat",
        specification: "RECHERCHE"
      }
      // Pas d'arrêté pour les demandes ajournées
    }
  },
  {
    id: 5,
    ref: "HAB-2026-016",
    institut: "ISPM",
    secteur: "Privé",
    type: "Renouvellement",
    niveau: "Master",
    statut: "Habilité",
    dateCloture: "2026-02-05",
    expert: "Pr. Rakotomalala Solofo",
    decision: "Validée",
    note: "OK",
    documents: ["Rapport_final.pdf", "Attestation.pdf"],
    details: {
      institution: {
        nom: "ISPM",
        type: "Institut privé",
        region: "Analamanga",
        adresse: "Lot II J 151, Antananarivo 101"
      },
      academique: {
        domaine: "Médecine",
        mention: "Médecine Générale",
        grade: "Master",
        specification: "PROFESSIONNEL"
      },
      arrete: {
        reference: "Arrêté n°8910/2025-MESupRES",
        date: "2025-08-12"
      }
    }
  },
  {
    id: 6,
    ref: "HAB-2026-015",
    institut: "ESMIA",
    secteur: "Privé",
    type: "Habilitation",
    niveau: "Licence",
    statut: "Habilité",
    dateCloture: "2026-02-03",
    expert: "Dr. Randriamampionona Hery",
    decision: "Validée",
    note: "Conforme",
    documents: ["Rapport_final.pdf", "Annexes.zip"],
    details: {
      institution: {
        nom: "ESMIA",
        type: "École privée",
        region: "Analamanga",
        adresse: "Lot III G 78, Antananarivo 101"
      },
      academique: {
        domaine: "Informatique",
        mention: "Développement d'Applications",
        grade: "Licence",
        specification: "PROFESSIONNEL"
      },
      arrete: {
        reference: "Arrêté n°3456/2025-MESupRES",
        date: "2025-07-18"
      }
    }
  },
  {
    id: 7,
    ref: "HAB-2026-014",
    institut: "Université de Toamasina",
    secteur: "Public",
    type: "Renouvellement",
    niveau: "Master",
    statut: "Ajourné",
    dateCloture: "2026-02-01",
    expert: "Pr. Raharimanana Jean",
    decision: "Rejetée",
    note: "Dossier incomplet",
    commentaireAjournement: "Le dossier de renouvellement ne contient pas les justificatifs requis. Éléments manquants :\n- Rapport d'activités des 3 dernières années\n- Liste des publications des enseignants-chercheurs\n- Attestation de mise à jour des équipements pédagogiques",
    documents: ["Rapport_expertise.pdf"],
    details: {
      institution: {
        nom: "Université de Toamasina",
        type: "Université publique",
        region: "Atsinanana",
        adresse: "BP 235, Toamasina 501"
      },
      academique: {
        domaine: "Sciences de la Mer",
        mention: "Océanographie",
        grade: "Master",
        specification: "RECHERCHE"
      }
      // Pas d'arrêté pour les demandes ajournées
    }
  },
  {
    id: 8,
    ref: "HAB-2026-013",
    institut: "CNTEMAD",
    secteur: "Public",
    type: "Habilitation",
    niveau: "Licence",
    statut: "Habilité",
    dateCloture: "2026-01-28",
    expert: "Dr. Rasoamampionona Lala",
    decision: "Validée",
    note: "OK",
    documents: ["Rapport_final.pdf"],
    details: {
      institution: {
        nom: "CNTEMAD",
        type: "Centre national public",
        region: "Analamanga",
        adresse: "BP 789, Antananarivo 101"
      },
      academique: {
        domaine: "Sciences de l'Éducation",
        mention: "Enseignement à Distance",
        grade: "Licence",
        specification: "PROFESSIONNEL"
      },
      arrete: {
        reference: "Arrêté n°9012/2025-MESupRES",
        date: "2025-05-30"
      }
    }
  },
];

// ─── CONFIG STATUT ────────────────────────────────────────────────────────────
const getStatutCfg = (statut, isDark) => {
  switch (statut) {
    case "Habilité":
      return isDark
        ? { lb: "rgba(22,163,74,0.15)", lt: "#86efac", lbr: "rgba(22,163,74,0.35)" }
        : { lb: "#f0fdf4", lt: "#166534", lbr: "#bbf7d0" };
    case "Ajourné":
      return isDark
        ? { lb: "rgba(249,115,22,0.15)", lt: "#fdba74", lbr: "rgba(249,115,22,0.35)" }
        : { lb: "#fff7ed", lt: "#c2410c", lbr: "#fed7aa" };
    default:
      return isDark
        ? { lb: "rgba(37,99,235,0.15)", lt: "#93c5fd", lbr: "rgba(37,99,235,0.35)" }
        : { lb: "#eff6ff", lt: "#1d4ed8", lbr: "#bfdbfe" };
  }
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

// ─── MODALE DETAIL ARCHIVE ────────────────────────────────────────────────────
function DetailArchiveModal({ isOpen, onClose, archive, isDark, onReverse }) {
  if (!isOpen || !archive) return null;

  const borderC = isDark ? "#334155" : "#e2e8f0";
  const subC = isDark ? "#475569" : "#94a3b8";
  const textC = isDark ? "#e2e8f0" : "#334155";
  const inputBg = isDark ? "#0f172a" : "#f8fafc";
  const cfg = getStatutCfg(archive.statut, isDark);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
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
          maxWidth: "700px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
          position: "relative",
          margin: "1rem",
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
            zIndex: 10,
          }}
        >
          <FaTimesCircle size={16} />
        </button>

        {/* En-tête avec statut */}
        <div className="flex items-center justify-between mb-6 pr-8">
          <div>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: isDark ? "#f1f5f9" : "#0f172a",
              }}
            >
              Archive #{archive.id} — {archive.ref}
            </h2>
            <p style={{ fontSize: "0.8rem", color: subC, marginTop: "2px" }}>
              {archive.institut}
            </p>
          </div>
          <span
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-normal border"
            style={{
              background: cfg.lb,
              color: cfg.lt,
              borderColor: cfg.lbr,
            }}
          >
            {archive.statut}
          </span>
        </div>

        {/* Commentaire d'ajournement (affiché uniquement si statut = Ajourné) */}
        {archive.statut === "Ajourné" && archive.commentaireAjournement && (
          <div
            className="mb-6 p-4 rounded-xl"
            style={{
              background: isDark ? "rgba(249,115,22,0.1)" : "#fff7ed",
              border: `1px solid ${isDark ? "rgba(249,115,22,0.3)" : "#fed7aa"}`,
            }}
          >
            <div className="flex items-start gap-3">
              <FaExclamationTriangle style={{ color: "#f97316", marginTop: "2px" }} size={18} />
              <div>
                <p
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: isDark ? "#fdba74" : "#c2410c",
                    marginBottom: "6px",
                  }}
                >
                  Motif d'ajournement
                </p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: isDark ? "#e2e8f0" : "#334155",
                    whiteSpace: "pre-line",
                    lineHeight: "1.5",
                  }}
                >
                  {archive.commentaireAjournement}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Informations de l'institution */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FaBuilding style={{ color: "#3b82f6" }} size={16} />
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: isDark ? "#f1f5f9" : "#0f172a",
              }}
            >
              Informations de l'institution
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: subC,
                  marginBottom: "4px",
                }}
              >
                Institution ou Établissement <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div
                style={{
                  background: inputBg,
                  border: `1px solid ${borderC}`,
                  borderRadius: "0.75rem",
                  padding: "0.625rem 0.875rem",
                  fontSize: "0.875rem",
                  color: textC,
                }}
              >
                {archive.details?.institution?.nom || archive.institut}
              </div>
              <p style={{ fontSize: "0.7rem", color: subC, marginTop: "2px" }}>
                Ex: Université d'Antananarivo
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: subC,
                    marginBottom: "4px",
                  }}
                >
                  Type d'institution <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div
                  style={{
                    background: inputBg,
                    border: `1px solid ${borderC}`,
                    borderRadius: "0.75rem",
                    padding: "0.625rem 0.875rem",
                    fontSize: "0.875rem",
                    color: textC,
                  }}
                >
                  {archive.details?.institution?.type || archive.secteur}
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: subC,
                    marginBottom: "4px",
                  }}
                >
                  Région <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div
                  style={{
                    background: inputBg,
                    border: `1px solid ${borderC}`,
                    borderRadius: "0.75rem",
                    padding: "0.625rem 0.875rem",
                    fontSize: "0.875rem",
                    color: textC,
                  }}
                >
                  {archive.details?.institution?.region || "Non spécifiée"}
                </div>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: subC,
                  marginBottom: "4px",
                }}
              >
                Adresse exacte <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div
                style={{
                  background: inputBg,
                  border: `1px solid ${borderC}`,
                  borderRadius: "0.75rem",
                  padding: "0.625rem 0.875rem",
                  fontSize: "0.875rem",
                  color: textC,
                }}
              >
                {archive.details?.institution?.adresse || "Non spécifiée"}
              </div>
              <p style={{ fontSize: "0.7rem", color: subC, marginTop: "2px" }}>
                Ex: BP 566, Avenue de l'Indépendance, Antananarivo 101
              </p>
            </div>
          </div>
        </div>

        {/* Informations académiques */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FaGraduationCap style={{ color: "#10b981" }} size={16} />
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: isDark ? "#f1f5f9" : "#0f172a",
              }}
            >
              Informations académiques
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: subC,
                    marginBottom: "4px",
                  }}
                >
                  Domaine <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div
                  style={{
                    background: inputBg,
                    border: `1px solid ${borderC}`,
                    borderRadius: "0.75rem",
                    padding: "0.625rem 0.875rem",
                    fontSize: "0.875rem",
                    color: textC,
                  }}
                >
                  {archive.details?.academique?.domaine || "Non spécifié"}
                </div>
                <p style={{ fontSize: "0.7rem", color: subC, marginTop: "2px" }}>
                  Ex: Sciences et Technologies
                </p>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: subC,
                    marginBottom: "4px",
                  }}
                >
                  Mention <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div
                  style={{
                    background: inputBg,
                    border: `1px solid ${borderC}`,
                    borderRadius: "0.75rem",
                    padding: "0.625rem 0.875rem",
                    fontSize: "0.875rem",
                    color: textC,
                  }}
                >
                  {archive.details?.academique?.mention || "Non spécifiée"}
                </div>
                <p style={{ fontSize: "0.7rem", color: subC, marginTop: "2px" }}>
                  Ex: Informatique Appliquée
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: subC,
                    marginBottom: "4px",
                  }}
                >
                  Grade <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div
                  style={{
                    background: inputBg,
                    border: `1px solid ${borderC}`,
                    borderRadius: "0.75rem",
                    padding: "0.625rem 0.875rem",
                    fontSize: "0.875rem",
                    color: textC,
                  }}
                >
                  {archive.details?.academique?.grade || archive.niveau}
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: subC,
                    marginBottom: "4px",
                  }}
                >
                  Spécification <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div
                  style={{
                    background: inputBg,
                    border: `1px solid ${borderC}`,
                    borderRadius: "0.75rem",
                    padding: "0.625rem 0.875rem",
                    fontSize: "0.875rem",
                    color: textC,
                  }}
                >
                  {archive.details?.academique?.specification || "Non spécifiée"}
                </div>
                <p style={{ fontSize: "0.7rem", color: subC, marginTop: "2px" }}>
                  PROFESSIONNEL ou RECHERCHE
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informations de l'arrêté d'habilitation - affiché uniquement si le statut n'est pas "Ajourné" */}
        {archive.statut !== "Ajourné" && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FaFileAlt style={{ color: "#8b5cf6" }} size={16} />
              <h3
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: isDark ? "#f1f5f9" : "#0f172a",
                }}
              >
                Informations de l'arrêté d'habilitation
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: subC,
                    marginBottom: "4px",
                  }}
                >
                  Arrêté d'habilitation <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div
                  style={{
                    background: inputBg,
                    border: `1px solid ${borderC}`,
                    borderRadius: "0.75rem",
                    padding: "0.625rem 0.875rem",
                    fontSize: "0.875rem",
                    color: textC,
                  }}
                >
                  {archive.details?.arrete?.reference || "Non spécifié"}
                </div>
                <p style={{ fontSize: "0.7rem", color: subC, marginTop: "2px" }}>
                  Ex: Arrêté n°12345/2025-MESupRES
                </p>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: subC,
                    marginBottom: "4px",
                  }}
                >
                  Date de l'arrêté <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div
                  style={{
                    background: inputBg,
                    border: `1px solid ${borderC}`,
                    borderRadius: "0.75rem",
                    padding: "0.625rem 0.875rem",
                    fontSize: "0.875rem",
                    color: textC,
                  }}
                >
                  {archive.details?.arrete?.date 
                    ? new Date(archive.details.arrete.date).toLocaleDateString("fr-FR")
                    : "Non spécifiée"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bouton de réarchivage */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              background: "transparent",
              color: isDark ? "#94a3b8" : "#64748b",
              border: `1px solid ${borderC}`,
              cursor: "pointer",
            }}
          >
            Fermer
          </button>
          <button
            onClick={() => {
              onReverse(archive);
              onClose();
            }}
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              background: "#3b82f6",
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FaUndoAlt size={14} />
            Réarchiver le dossier
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function ArchivesDemandesCnhView() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [archives, setArchives] = useState(ARCHIVES_MOCK);
  const [search, setSearch] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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
    { k: "expert", l: "Expert" },
    { k: "dateCloture", l: "Date" },
  ];

  const handleSort = (key) => {
    setSortConfig((p) => ({
      key,
      direction: p.key === key && p.direction === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const filteredData = archives.filter((a) => {
    const str = `${a.id} ${a.ref} ${a.institut} ${a.secteur} ${a.type} ${a.niveau} ${a.statut} ${a.expert} ${a.decision} ${a.note}`.toLowerCase();
    const matchSearch = str.includes(search.toLowerCase());

    let matchDate = true;
    if (dateDebut && dateFin) matchDate = a.dateCloture >= dateDebut && a.dateCloture <= dateFin;
    else if (dateDebut) matchDate = a.dateCloture >= dateDebut;
    else if (dateFin) matchDate = a.dateCloture <= dateFin;

    return matchSearch && matchDate;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const dir = sortConfig.direction === "asc" ? 1 : -1;
    if (sortConfig.key === "id") return (a.id - b.id) * dir;
    if (sortConfig.key === "dateCloture") return (new Date(a.dateCloture) - new Date(b.dateCloture)) * dir;
    return (
      a[sortConfig.key]?.toString().localeCompare(b[sortConfig.key]?.toString()) * dir
    );
  });

  const totalPages = Math.max(1, Math.ceil(sortedData.length / perPage));
  const pagedData = sortedData.slice((page - 1) * perPage, page * perPage);

  const openDetailModal = (archive) => {
    setSelectedArchive(archive);
    setIsDetailModalOpen(true);
  };

  const handleReverseArchive = (archive) => {
    // Simuler la réactivation de l'archive (à connecter avec l'API)
    setToastMessage(`Dossier #${archive.id} réactivé avec succès`);
    setTimeout(() => setToastMessage(null), 3000);
    
    // Ici vous pouvez ajouter la logique pour déplacer l'archive vers les demandes actives
    // setArchives(archives.filter(a => a.id !== archive.id));
  };

  return (
    <div className="space-y-6 font-sans relative">
      <div>
        <h1
          className="text-xl font-black tracking-tight"
          style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}
        >
          Listes des archives de l'habilitation
        </h1>
        <p className="text-xs mt-1" style={{ color: subC }}>
          {filteredData.length} archive{filteredData.length > 1 ? "s" : ""} trouvée
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
                className="text-xs font-medium whitespace-nowrap"
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
              {[10, 20, 30, 50, 100].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            archives
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
                      <FaFolderOpen size={20} />
                      <span className="text-sm">Aucune archive trouvée.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                pagedData.map((a) => {
                  const cfg = getStatutCfg(a.statut, isDark);
                  return (
                    <tr
                      key={a.id}
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
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold"
                          style={{
                            background: isDark ? "#0f172a" : "#f1f5f9",
                            color: isDark ? "#94a3b8" : "#64748b",
                          }}
                        >
                          {a.id}
                        </div>
                      </td>

                      {/* Institut - Texte normal (supprimé font-semibold) */}
                      <td
                        className="px-4 py-4 text-sm text-center"
                        style={{ color: textC }}
                      >
                        {a.institut}
                      </td>

                      {/* Secteur */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            a.secteur === "Public"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                          }`}
                        >
                          {a.secteur}
                        </span>
                      </td>

                      {/* Type - Texte simple sans fond */}
                      <td
                        className="px-4 py-4 text-sm text-center"
                        style={{ color: textC }}
                      >
                        {a.type}
                      </td>

                      {/* Niveau */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: isDark ? "#0f172a" : "#f8fafc",
                            color: isDark ? "#94a3b8" : "#64748b",
                            border: `1px solid ${borderC}`,
                          }}
                        >
                          {a.niveau}
                        </span>
                      </td>

                      {/* Statut - Sans le point */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className="inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[11px] font-normal border"
                          style={{
                            background: cfg.lb,
                            color: cfg.lt,
                            borderColor: cfg.lbr,
                          }}
                        >
                          {a.statut}
                        </span>
                      </td>

                      {/* Expert - Texte normal (supprimé font-medium) */}
                      <td
                        className="px-4 py-4 text-sm text-center"
                        style={{ color: textC }}
                      >
                        {a.expert}
                      </td>

                      {/* Date - Texte normal */}
                      <td
                        className="px-4 py-4 text-sm text-center"
                        style={{ color: subC }}
                      >
                        {new Date(a.dateCloture).toLocaleDateString("fr-FR")}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => openDetailModal(a)}
                          className="p-2 rounded-lg transition"
                          style={{ color: "#3b82f6" }}
                          title="Voir les détails de l'archive"
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
                )} sur ${sortedData.length} archives`
              : "Aucune archive"}
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
                className="w-8 h-8 rounded-lg text-xs font-semibold transition"
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

      {/* Modale de détail */}
      <DetailArchiveModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        archive={selectedArchive}
        isDark={isDark}
        onReverse={handleReverseArchive}
      />

      {/* Toast global */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[10000] flex items-center gap-3 bg-emerald-500 text-white px-5 py-3.5 rounded-xl shadow-2xl">
          <FaCheckCircle size={20} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}