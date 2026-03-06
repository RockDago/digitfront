import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaSort,
  FaUniversity,
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
  FaArrowLeft,
  FaFileAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaAward,
  FaStar,
  FaChartLine,
  FaUpload,
  FaChevronDown,
  FaChevronUp,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaRedo,
  FaArchive,
  FaClock,
  FaExclamationTriangle,
  FaSync,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import accreditationServices, {
  TYPE_ETABLISSEMENT,
  getStatutLibelle,
} from "../../../../services/accreditation.services";

// ============================================================
// Normalisation statut enum Python
// ============================================================
const normalizeStatut = (statut) => {
  if (!statut) return "";
  if (typeof statut === "string" && statut.includes(".")) return statut.split(".").pop();
  return statut;
};

// ============================================================
// Normalisation d'une demande archivée reçue du backend
// ============================================================
const normalizeArchivedDemande = (d) => ({
  id: d.id,
  dossierNumber: d.numero_demande || `#${d.id}`,
  institution:
    d.type_etablissement === TYPE_ETABLISSEMENT.PRIVEE
      ? d.institution || d.etablissement || "Non spécifié"
      : d.etablissement || d.institution || "Non spécifié",
  mention: d.mention || "Non spécifié",
  program: [d.mention, d.parcours].filter(Boolean).join(" - ") || "Non spécifié",
  submittedDate: d.created_at?.split("T")[0] || "",
  archivedDate: d.archived_at?.split("T")[0] || d.updated_at?.split("T")[0] || "",
  archivedBy: d.archived_by ? `Utilisateur #${d.archived_by}` : "Administrateur",
  archiveReason: d.archive_reason || d.notes || "Archivage système",
  responsable: d.responsable || "",
  type_etablissement: d.type_etablissement || "",
  etablissement: d.etablissement || "",
  institution_privee: d.institution || "",
  domaine: d.domaine || "",
  grade: d.grade || "",
  parcours: d.parcours || "",
  notes: d.notes || "",
  status: normalizeStatut(d.statut),
  score_total: d.score_total || 0,
  score_pourcentage: d.score_pourcentage || 0,
  niveau_conformite: normalizeStatut(d.niveau_conformite) || "",
  niveau: mapNiveauConformite(normalizeStatut(d.niveau_conformite), d.score_total || 0),
  est_eligible: d.est_eligible || false,
  auto_evaluation_id: d.auto_evaluation_id || null,
  criteres: Array.isArray(d.criteres) ? d.criteres : [],
  score_formation: d.score_formation ?? 0,
  score_gouvernance: d.score_gouvernance ?? 0,
  score_recherche: d.score_recherche ?? 0,
  fichiers: Array.isArray(d.fichiers) ? d.fichiers : [],
  historique: Array.isArray(d.historique) ? d.historique : [],
  isArchived: d.is_archived || true,
});

/**
 * Convertit le niveau_conformite backend vers la clé du levelConfig frontend.
 * Backend : insuffisant | faible | en_developpement | satisfaisant | excellent
 * Frontend : non-conforme | faible | acceptable | satisfaisant | excellent
 */
const mapNiveauConformite = (niveau, score) => {
  const map = {
    insuffisant:      "non-conforme",
    faible:           "faible",
    en_developpement: "acceptable",
    satisfaisant:     "satisfaisant",
    excellent:        "excellent",
  };
  if (map[niveau]) return map[niveau];
  // Fallback depuis le score si niveau absent
  return getLevelFromScore(score);
};

// ============================================================
// Builders pour le détail auto-évaluation
// ============================================================
const buildCriteresDict = (criteresArray) => {
  if (!Array.isArray(criteresArray)) return {};
  return criteresArray.reduce((acc, c) => {
    const key = c.critere_id || c.id;
    if (key) {
      acc[key] = {
        note: c.note ?? 0,
        appreciation: c.appreciation || "",
        preuves: c.preuves || "",
        fichiers: Array.isArray(c.fichiers) ? c.fichiers : [],
      };
      const num = parseInt(key.replace(/\D/g, ""));
      if (!isNaN(num)) {
        const paddedKey = `critere_${String(num).padStart(2, "0")}`;
        if (paddedKey !== key) acc[paddedKey] = acc[key];
      }
    }
    return acc;
  }, {});
};

// ============================================================
// Configuration des niveaux
// ============================================================
const levelConfig = {
  "non-conforme": {
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-800",
    bar: "bg-red-500",
    icon: FaExclamationTriangle,
    label: "Non conforme",
    range: "< 92",
    appreciation: "Absence d'une politique ou d'un dispositif crédible",
    min: 0,
    max: 91,
  },
  faible: {
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-800",
    bar: "bg-orange-500",
    icon: FaClock,
    label: "Faible",
    range: "92 – 183",
    appreciation: "Plusieurs insuffisances majeures",
    min: 92,
    max: 183,
  },
  acceptable: {
    color: "bg-yellow-50 border-yellow-200",
    badge: "bg-yellow-100 text-yellow-800",
    bar: "bg-yellow-500",
    icon: FaCheckCircle,
    label: "Acceptable",
    range: "184 – 256",
    appreciation: "Conformité partielle, dispositifs à consolider",
    min: 184,
    max: 256,
  },
  satisfaisant: {
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-800",
    bar: "bg-blue-500",
    icon: FaCheckCircle,
    label: "Satisfaisant",
    range: "257 – 311",
    appreciation: "Conformité générale avec quelques points à améliorer",
    min: 257,
    max: 311,
  },
  excellent: {
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-800",
    bar: "bg-green-500",
    icon: FaStar,
    label: "Excellent",
    range: "312 – 368",
    appreciation: "Très haute qualité, bonnes pratiques institutionnalisées",
    min: 312,
    max: 368,
  },
};

// Statuts pour le filtre de décision (raison d'archivage)
const archiveReasonOptions = ["accredite", "ajourne", "rejetee"];
const archiveReasonLabels = {
  accredite: "Accréditée",
  ajourne:   "Ajournée",
  rejetee:   "Rejetée",
};

// ============================================================
// Utilitaires
// ============================================================
const getLevelFromScore = (score, maxScore = 368) => {
  const pct = (score / maxScore) * 100;
  if (pct < 25) return "non-conforme";
  if (pct < 50) return "faible";
  if (pct < 70) return "acceptable";
  if (pct < 85) return "satisfaisant";
  return "excellent";
};

const getLevelInfo = (level) => levelConfig[level] || levelConfig["acceptable"];

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try { return new Date(dateStr).toLocaleDateString("fr-FR"); }
  catch { return dateStr; }
};

const formatFileSize = (bytes) => {
  if (!bytes) return "Taille inconnue";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes("pdf"))   return <FaFilePdf  className="w-4 h-4 text-red-500" />;
  if (t.includes("image") || t.includes("jpg") || t.includes("jpeg") || t.includes("png"))
    return <FaFileImage className="w-4 h-4 text-blue-500" />;
  if (t.includes("word") || t.includes("doc"))
    return <FaFileWord  className="w-4 h-4 text-blue-700" />;
  return <FaFileAlt className="w-4 h-4 text-gray-500" />;
};

const handleDownloadFile = async (fichierId, nomOriginal) => {
  const toastId = toast.info("Téléchargement en cours...", { autoClose: false, closeOnClick: false });
  try {
    const blob = await accreditationServices.downloadFichier(fichierId);
    if (!blob || blob.size === 0) throw new Error("Fichier vide ou intercepté");
    const typedBlob = new Blob([blob], { type: blob.type || "application/octet-stream" });
    const url = window.URL.createObjectURL(typedBlob);
    const a   = document.createElement("a");
    a.style.display = "none";
    a.href     = url;
    a.download = nomOriginal || `fichier_${fichierId}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { window.URL.revokeObjectURL(url); document.body.removeChild(a); }, 1000);
    toast.update(toastId, { render: `"${nomOriginal || "Fichier"}" téléchargé`, type: "success", autoClose: 3000, closeOnClick: true });
  } catch (error) {
    console.error("Erreur téléchargement", error);
    toast.update(toastId, { render: "Erreur lors du téléchargement", type: "error", autoClose: 4000, closeOnClick: true });
  }
};

// ============================================================
// ScoreGlobalChart
// ============================================================
const ScoreGlobalChart = ({ score, maxScore = 368 }) => {
  const thresholds    = [0, 92, 184, 257, 312, 368];
  const cursorPosition = Math.min(100, (score / maxScore) * 100);
  const getBarWidth   = (min, max) => ((max - min) / maxScore) * 100;

  return (
    <div className="w-full">
      <div className="relative mt-8 mb-14">
        <div className="h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner flex">
          {[["bg-red-500", 0, 92], ["bg-orange-500", 92, 184], ["bg-yellow-500", 184, 257],
            ["bg-blue-500", 257, 312], ["bg-green-500", 312, 368]].map(([cls, mn, mx]) => (
            <div key={cls} className={`h-full ${cls}`} style={{ width: `${getBarWidth(mn, mx)}%` }} />
          ))}
        </div>
        <div className="relative w-full mt-2">
          {thresholds.map((t, i) => (
            <div key={i} className="absolute flex flex-col items-center"
              style={{ left: `${(t / maxScore) * 100}%`, transform: "translateX(-50%)" }}>
              <div className="w-0.5 h-3 bg-gray-400" />
              <span className="text-[10px] font-bold mt-1 px-1 py-0.5 bg-white rounded border border-gray-300">{t}</span>
            </div>
          ))}
        </div>
        <div className="absolute top-0 flex flex-col items-center transition-all duration-500"
          style={{ left: `${cursorPosition}%`, transform: "translateX(-50%)" }}>
          <div className="relative">
            <div className="w-5 h-5 bg-white border-4 border-gray-800 rounded-full shadow-lg" />
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
              {score} pts
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-1 mt-6">
        {[["bg-red-500", "text-red-700", "Non conforme", "0-91 pts"],
          ["bg-orange-500", "text-orange-700", "Faible", "92-183 pts"],
          ["bg-yellow-500", "text-yellow-700", "Acceptable", "184-256 pts"],
          ["bg-blue-500", "text-blue-700", "Satisfaisant", "257-311 pts"],
          ["bg-green-500", "text-green-700", "Excellent", "312-368 pts"]].map(([bar, txt, label, range]) => (
          <div key={label} className="text-center">
            <div className={`w-full h-1 ${bar} mb-1`} />
            <span className={`text-[10px] font-medium ${txt}`}>{label}</span>
            <span className="text-[8px] text-gray-500 block">{range}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// Sections d'évaluation (92 critères)
// ============================================================
const sectionsEvaluation = [
  {
    title: "LA POLITIQUE DE FORMATION",
    subsections: [
      {
        id: "section_1_1",
        title: "1.1. LE PILOTAGE DE L'OFFRE DE FORMATION",
        criteres: [
          { id: "critere_01", numero: 1, label: "Rôle du partenariat avec les milieux économiques et les autorités dans l'élaboration de l'offre" },
          { id: "critere_02", numero: 2, label: "Place des connaissances et des compétences préprofessionnelles dans les programmes de formation" },
          { id: "critere_03", numero: 3, label: "Part des charges d'enseignement confiées aux professionnels" },
          { id: "critere_04", numero: 4, label: "Cadrage des offres de formation par les axes stratégiques" },
          { id: "critere_05", numero: 5, label: "Adéquation des axes de recherche et des offres de formation" },
        ],
      },
      {
        id: "section_1_2",
        title: "1.2. LA MISE EN ŒUVRE DE LA FORMATION",
        criteres: Array.from({ length: 22 }, (_, i) => ({
          id: `critere_${String(6 + i).padStart(2, "0")}`, numero: 6 + i,
          label: `Critère ${6 + i} - Mise en œuvre de la formation`,
        })),
      },
      {
        id: "section_1_3",
        title: "1.3. LA DEMARCHE QUALITE PEDAGOGIQUE",
        criteres: Array.from({ length: 10 }, (_, i) => ({
          id: `critere_${String(28 + i).padStart(2, "0")}`, numero: 28 + i,
          label: `Critère ${28 + i} - Démarche qualité pédagogique`,
        })),
      },
    ],
  },
  {
    title: "LA POLITIQUE DE GOUVERNANCE",
    subsections: [
      { id: "section_2_1",  title: "2.1. ORGANISATION ET MANAGEMENT",                criteres: Array.from({ length: 6 }, (_, i) => ({ id: `critere_${String(38 + i).padStart(2, "0")}`, numero: 38 + i, label: `Critère ${38 + i} - Organisation et management` })) },
      { id: "section_2_2",  title: "2.2. SYSTÈME D'INFORMATION ET DE COMMUNICATION", criteres: Array.from({ length: 5 }, (_, i) => ({ id: `critere_${String(44 + i).padStart(2, "0")}`, numero: 44 + i, label: `Critère ${44 + i} - Système d'information` })) },
      { id: "section_2_3",  title: "2.3. GESTION DES RESSOURCES DOCUMENTAIRES",      criteres: Array.from({ length: 3 }, (_, i) => ({ id: `critere_${String(49 + i).padStart(2, "0")}`, numero: 49 + i, label: `Critère ${49 + i} - Gestion documentaire` })) },
      { id: "section_2_4",  title: "2.4. GESTION DES RESSOURCES HUMAINES",           criteres: Array.from({ length: 8 }, (_, i) => ({ id: `critere_${String(52 + i).padStart(2, "0")}`, numero: 52 + i, label: `Critère ${52 + i} - Gestion des RH` })) },
      { id: "section_2_5",  title: "2.5. GESTION DES RESSOURCES FINANCIÈRES",        criteres: Array.from({ length: 7 }, (_, i) => ({ id: `critere_${String(60 + i).padStart(2, "0")}`, numero: 60 + i, label: `Critère ${60 + i} - Gestion financière` })) },
      { id: "section_2_6",  title: "2.6. POLITIQUE IMMOBILIÈRE ET LOGISTIQUE",       criteres: Array.from({ length: 4 }, (_, i) => ({ id: `critere_${String(67 + i).padStart(2, "0")}`, numero: 67 + i, label: `Critère ${67 + i} - Logistique` })) },
      { id: "section_2_7",  title: "2.7. MANAGEMENT DE LA QUALITÉ",                  criteres: Array.from({ length: 3 }, (_, i) => ({ id: `critere_${String(71 + i).padStart(2, "0")}`, numero: 71 + i, label: `Critère ${71 + i} - Management qualité` })) },
      { id: "section_2_8",  title: "2.8. HYGIÈNE, SÉCURITÉ ET ENVIRONNEMENT",        criteres: Array.from({ length: 4 }, (_, i) => ({ id: `critere_${String(74 + i).padStart(2, "0")}`, numero: 74 + i, label: `Critère ${74 + i} - Hygiène et sécurité` })) },
      { id: "section_2_9",  title: "2.9. GESTION DE LA VIE ÉTUDIANTE",               criteres: Array.from({ length: 8 }, (_, i) => ({ id: `critere_${String(78 + i).padStart(2, "0")}`, numero: 78 + i, label: `Critère ${78 + i} - Vie étudiante` })) },
      { id: "section_2_10", title: "2.10. LA GESTION DES PARTENARIATS",              criteres: Array.from({ length: 3 }, (_, i) => ({ id: `critere_${String(86 + i).padStart(2, "0")}`, numero: 86 + i, label: `Critère ${86 + i} - Partenariats` })) },
    ],
  },
  {
    title: "LA POLITIQUE DE RECHERCHE",
    subsections: [
      { id: "section_3_1", title: "3.1. LA STRATÉGIE DE RECHERCHE DE L'INSTITUTION", criteres: Array.from({ length: 2 }, (_, i) => ({ id: `critere_${String(89 + i).padStart(2, "0")}`, numero: 89 + i, label: `Critère ${89 + i} - Stratégie de recherche` })) },
      { id: "section_3_2", title: "3.2. L'ENSEIGNEMENT ET LA RECHERCHE",             criteres: Array.from({ length: 2 }, (_, i) => ({ id: `critere_${String(91 + i).padStart(2, "0")}`, numero: 91 + i, label: `Critère ${91 + i} - Enseignement et recherche` })) },
    ],
  },
];

const appreciationOptions = [
  { value: "aucune_preuve",                label: "Aucune preuve" },
  { value: "partiellement_pris_en_compte", label: "Partiellement pris en compte" },
  { value: "applique_irregulierement",     label: "Appliqué irrégulièrement" },
  { value: "bien_respecte",                label: "Bien respecté" },
  { value: "pleinement_atteint",           label: "Pleinement atteint" },
];

// ============================================================
// CriteresSection
// ============================================================
const CriteresSection = ({ title, subsections, criteresData }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const toggleSection = (id) => setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">{title}</h3>
      {subsections.map((sub) => {
        const isExpanded = expandedSections[sub.id] !== false;
        const filled = sub.criteres.filter((c) => criteresData[c.id]?.appreciation).length;
        return (
          <div key={sub.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => toggleSection(sub.id)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold text-gray-800 text-sm text-left">{sub.title}</h4>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                  ${filled > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {filled}/{sub.criteres.length} valués
                </span>
                {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
              </div>
            </button>
            {isExpanded && (
              <div className="p-4 space-y-4">
                {sub.criteres.map((critere) => {
                  const data         = criteresData[critere.id] || { note: 0, appreciation: "", fichiers: [] };
                  const appreciation = appreciationOptions.find((o) => o.value === data.appreciation);
                  const hasData      = !!data.appreciation;
                  return (
                    <div key={critere.id}
                      className={`border rounded-lg p-4 ${hasData ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100"}`}>
                      <div className="flex items-start gap-3 mb-3">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium flex-shrink-0">
                          {critere.numero}
                        </span>
                        <span className="text-sm font-medium text-gray-900 flex-1">{critere.label}</span>
                        {hasData && <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400 mt-1" title="valué" />}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Appréciation</p>
                          <div className={`px-3 py-2 rounded-lg text-sm
                            ${hasData ? "bg-blue-50 text-blue-800 font-medium" : "bg-gray-100 text-gray-400 italic"}`}>
                            {appreciation?.label || "Non valué"}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Note</p>
                          <div className="flex items-center gap-2">
                            <div className={`px-3 py-2 rounded-lg text-sm font-bold
                              ${hasData ? "bg-blue-50 text-blue-800" : "bg-gray-100 text-gray-400"}`}>
                              {data.note ?? 0}/4
                            </div>
                            {hasData && (
                              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all"
                                  style={{ width: `${((data.note ?? 0) / 4) * 100}%` }} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {data.preuves && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Preuves textuelles</p>
                          <div className="px-3 py-2 bg-yellow-50 rounded-lg text-xs text-gray-700 border border-yellow-100">
                            {data.preuves}
                          </div>
                        </div>
                      )}
                      {Array.isArray(data.fichiers) && data.fichiers.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <FaUpload size={10} /> Pièces justificatives ({data.fichiers.length})
                          </p>
                          <div className="space-y-2">
                            {data.fichiers.map((file) => (
                              <div key={file.id}
                                className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-2 min-w-0">
                                  {getFileIcon(file.type_mime || file.type)}
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium truncate">
                                      {file.nom_original || file.name || `Fichier ${file.id}`}
                                    </p>
                                    <p className="text-[10px] text-gray-500">
                                      {formatFileSize(file.taille || file.size)} • {formatDate(file.uploaded_at || file.date)}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDownloadFile(file.id, file.nom_original || file.name)}
                                  className="flex-shrink-0 p-1.5 text-blue-600 hover:bg-blue-200 rounded transition-colors">
                                  <FaDownload size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
const ArchiveAccreditationView = () => {
  const [archivedAccreditations, setArchivedAccreditations] = useState([]);
  const [loading, setLoading]                               = useState(true);
  const [error, setError]                                   = useState(null);
  const [searchQuery, setSearchQuery]                       = useState("");
  const [startDateFilter, setStartDateFilter]               = useState("");
  const [endDateFilter, setEndDateFilter]                   = useState("");
  const [archiveReasonFilter, setArchiveReasonFilter]       = useState("");
  const [currentPage, setCurrentPage]                       = useState(1);
  const [pageSize, setPageSize]                             = useState(10);
  const [sortBy, setSortBy]                                 = useState("archivedDate");
  const [sortDirection, setSortDirection]                   = useState("desc");

  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedDossier, setSelectedDossier]   = useState(null);
  const [restoring, setRestoring]               = useState(false);

  const [viewMode, setViewMode]         = useState("list");
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [loadingDetail, setLoadingDetail]   = useState(false);

  const toastConfig = {
    position: "top-right", autoClose: 3000, hideProgressBar: false,
    closeOnClick: true, pauseOnHover: true, draggable: true, theme: "light",
  };

  useEffect(() => { loadArchivedDemandes(); }, []);

  // ============================================================
  // Chargement des archives depuis le backend
  // ============================================================
  const loadArchivedDemandes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await accreditationServices.getArchivedDemandes();
      const normalized = data.map(normalizeArchivedDemande);
      setArchivedAccreditations(normalized);
      console.log(`📦 [ArchiveView] ${normalized.length} dossier(s) archivé(s)`);
      if (normalized.length === 0) {
        toast.info("Aucun dossier archivé trouvé.", { ...toastConfig, autoClose: 4000 });
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "Impossible de charger les archives.";
      setError(msg);
      toast.error(msg, toastConfig);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // Chargement du détail (avec critères auto-évaluation)
  // ============================================================
  const loadDemandeDetail = async (demandeId) => {
    setLoadingDetail(true);
    try {
      const response = await accreditationServices.getDemande(demandeId);

      let criteresDict = {};
      let autoEvalData = null;

      if (Array.isArray(response.criteres) && response.criteres.length > 0) {
        criteresDict = buildCriteresDict(response.criteres);
        autoEvalData = response.auto_evaluation || null;
      } else if (response.auto_evaluation?.criteres?.length > 0) {
        criteresDict = buildCriteresDict(response.auto_evaluation.criteres);
        autoEvalData = response.auto_evaluation;
      } else if (response.auto_evaluation_id) {
        try {
          autoEvalData = await accreditationServices.getAutoEvaluation(response.auto_evaluation_id);
          criteresDict = buildCriteresDict(autoEvalData?.criteres || []);
        } catch (evalErr) {
          console.warn("⚠️ Auto-évaluation non accessible:", evalErr);
        }
      }

      const score       = response.score_total || autoEvalData?.total_notes || 0;
      const pourcentage = response.score_pourcentage || autoEvalData?.score_pourcentage || 0;
      const niveauRaw   = normalizeStatut(response.niveau_conformite) || normalizeStatut(autoEvalData?.niveau_conformite) || "";
      const niveauKey   = mapNiveauConformite(niveauRaw, score);

      const formattedDetail = {
        ...normalizeArchivedDemande(response),
        autoEvaluation: {
          score, maxScore: 368, pourcentage,
          niveau: niveauKey,
          criteres: criteresDict,
          politiques: [
            { name: "FORMATION",   score: response.score_formation   ?? autoEvalData?.score_politique_formation   ?? 0, max: 148 },
            { name: "GOUVERNANCE", score: response.score_gouvernance  ?? autoEvalData?.score_politique_gouvernance ?? 0, max: 204 },
            { name: "RECHERCHE",   score: response.score_recherche    ?? autoEvalData?.score_politique_recherche   ?? 0, max: 16  },
          ],
        },
        history: response.historique || [],
        fichiers: Array.isArray(response.fichiers) ? response.fichiers : [],
      };

      setSelectedDetail(formattedDetail);
    } catch (err) {
      console.error("[ArchiveView] Erreur détail:", err);
      toast.error("Impossible de charger les détails du dossier", toastConfig);
    } finally {
      setLoadingDetail(false);
    }
  };

  // ============================================================
  // Filtres et tri
  // ============================================================
  const filteredArchives = archivedAccreditations.filter((acc) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || [
      acc.dossierNumber, acc.institution, acc.mention, acc.program,
      acc.archiveReason, acc.status,
    ].some((v) => v?.toLowerCase().includes(q));

    const d = acc.archivedDate ? new Date(acc.archivedDate) : null;
    const matchesDate =
      (!startDateFilter || (d && d >= new Date(startDateFilter))) &&
      (!endDateFilter   || (d && d <= new Date(endDateFilter)));

    // Filtre par statut (raison d'archivage = statut final)
    const matchesReason = !archiveReasonFilter || acc.status === archiveReasonFilter;

    return matchesSearch && matchesDate && matchesReason;
  });

  const sortedArchives = [...filteredArchives].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "id")               cmp = a.id - b.id;
    else if (sortBy === "archivedDate") cmp = new Date(a.archivedDate || 0) - new Date(b.archivedDate || 0);
    else if (sortBy === "dossier")      cmp = a.dossierNumber.localeCompare(b.dossierNumber);
    else if (sortBy === "institution")  cmp = a.institution.localeCompare(b.institution);
    return sortDirection === "asc" ? cmp : -cmp;
  });

  const totalPages  = Math.ceil(sortedArchives.length / pageSize);
  const startIndex  = (currentPage - 1) * pageSize;
  const paginatedArchives = sortedArchives.slice(startIndex, startIndex + pageSize);

  const resetAllFilters = () => {
    setSearchQuery(""); setStartDateFilter(""); setEndDateFilter("");
    setArchiveReasonFilter(""); setCurrentPage(1);
    toast.info("Filtres réinitialisés", toastConfig);
  };

  const handleSortClick = (key) => {
    setSortBy(key);
    setSortDirection((prev) => (sortBy === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
    setCurrentPage(1);
  };

  const SortIcon = ({ isSorted, isAsc }) =>
    !isSorted
      ? <FaSort className="w-3 h-3 text-gray-400" />
      : <FaSort className={`w-3 h-3 transition-transform ${isAsc ? "rotate-180" : ""}`} />;

  // ============================================================
  // Navigation
  // ============================================================
  const openDetailView = async (dossier) => {
    setViewMode("detail");
    await loadDemandeDetail(dossier.id);
  };

  const backToList = () => { setViewMode("list"); setSelectedDetail(null); };

  // ============================================================
  // Restauration
  // ============================================================
  const openRestoreModal = (dossier) => {
    setSelectedDossier(dossier);
    setShowRestoreModal(true);
  };

  const closeModals = () => {
    setShowRestoreModal(false);
    setSelectedDossier(null);
  };

  const confirmRestore = async () => {
    if (!selectedDossier) return;
    setRestoring(true);
    try {
      await accreditationServices.restaurerDemande(selectedDossier.id);
      setArchivedAccreditations((prev) => prev.filter((a) => a.id !== selectedDossier.id));
      if (selectedDetail?.id === selectedDossier.id) { setViewMode("list"); setSelectedDetail(null); }
      toast.success(`Dossier ${selectedDossier.dossierNumber} restauré avec succès.`, toastConfig);
      closeModals();
    } catch (err) {
      toast.error(err.message || "Erreur lors de la restauration", toastConfig);
    } finally {
      setRestoring(false);
    }
  };

  // ============================================================
  // VUE DÉTAIL
  // ============================================================
  if (viewMode === "detail") {
    if (loadingDetail || !selectedDetail) {
      return (
        <div className="min-h-screen bg-white p-4 md:p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Chargement des détails...</p>
          </div>
        </div>
      );
    }

    const ae         = selectedDetail.autoEvaluation || { score: 0, maxScore: 368, niveau: "acceptable", criteres: {}, politiques: [] };
    const niveauInfo = getLevelInfo(ae.niveau);
    const NiveauIcon = niveauInfo.icon;
    const criteresCount = Object.keys(ae.criteres || {}).length;

    const politiqueColors = [
      { bar: "bg-orange-500", badge: "bg-orange-100 text-orange-700", label: "FORMATION" },
      { bar: "bg-yellow-500", badge: "bg-yellow-100 text-yellow-700", label: "GOUVERNANCE" },
      { bar: "bg-green-500",  badge: "bg-green-100 text-green-700",  label: "RECHERCHE" },
    ];

    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <ToastContainer {...toastConfig} />

        {/* Header */}
        <div className="mb-6">
          <button onClick={backToList} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 text-sm font-medium">
            <FaArrowLeft size={14} /> Retour aux archives
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Détails du dossier archivé</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="font-mono bg-white border border-gray-200 px-3 py-1 rounded text-sm shadow-sm">
                  {selectedDetail.dossierNumber}
                </span>
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <FaArchive size={10} /> Archivé
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${niveauInfo.badge}`}>
                  {niveauInfo.label}
                </span>
                {selectedDetail.status && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {getStatutLibelle(selectedDetail.status)}
                  </span>
                )}
              </div>
            </div>
            <button onClick={() => openRestoreModal(selectedDetail)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm shadow-sm">
              <FaRedo size={14} /> Restaurer
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Informations d'archivage */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-amber-600 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <h3 className="text-sm font-semibold text-amber-800 mb-2">Informations d'archivage</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-amber-700">Date d'archivage :</span>
                    <span className="ml-1 font-medium text-amber-900">{formatDate(selectedDetail.archivedDate)}</span>
                  </div>
                  <div>
                    <span className="text-amber-700">Archivé par :</span>
                    <span className="ml-1 font-medium text-amber-900">{selectedDetail.archivedBy}</span>
                  </div>
                  <div>
                    <span className="text-amber-700">Raison :</span>
                    <span className="ml-1 font-medium text-amber-900">
                      {archiveReasonLabels[selectedDetail.status] || selectedDetail.archiveReason || "Archivage système"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes de décision */}
          {selectedDetail.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">Notes de décision</p>
                  <p className="text-sm text-blue-700">{selectedDetail.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Informations remplies */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
              <FaUniversity className="text-blue-600" /> Informations du dossier
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {[
                ["Numéro de demande", selectedDetail.dossierNumber, "font-mono text-blue-600"],
                ["Responsable", selectedDetail.responsable],
                ["Type d'établissement", selectedDetail.type_etablissement],
                ["Institution / Établissement",
                  selectedDetail.type_etablissement === TYPE_ETABLISSEMENT.PRIVEE
                    ? selectedDetail.institution_privee : selectedDetail.etablissement],
                ["Domaine", selectedDetail.domaine],
                ["Mention", selectedDetail.mention],
                ["Grade", selectedDetail.grade],
                ["Parcours", selectedDetail.parcours],
                ["Date de soumission", formatDate(selectedDetail.submittedDate)],
                ["Score total", `${ae.score} / 368 pts`],
              ].map(([label, value, extra]) => (
                <div key={label} className="flex items-start pb-3 border-b border-gray-50">
                  <span className="text-sm font-medium text-gray-500 w-44 flex-shrink-0">{label}</span>
                  <span className={`text-sm text-gray-900 ${extra || ""}`}>{value || "—"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-évaluation */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaAward className="text-blue-600" /> Résultat de l'Auto-évaluation
            </h2>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl"><FaAward className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Score global</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">{ae.score}</span>
                    <span className="text-base text-gray-400">/ {ae.maxScore}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{criteresCount} critère(s) évalué(s)</p>
                </div>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${niveauInfo.badge}`}>
                <NiveauIcon size={16} /> {niveauInfo.label}
              </div>
            </div>

            <ScoreGlobalChart score={ae.score} maxScore={ae.maxScore} />

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">Appréciation globale</p>
                  <p className="text-sm text-blue-700 italic">"{niveauInfo.appreciation}"</p>
                </div>
              </div>
            </div>

            {/* Politiques */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaChartLine className="text-blue-600" /> Évaluation par politique
              </h3>
              <div className="space-y-4">
                {ae.politiques?.map((pol, idx) => {
                  const cfg = politiqueColors[idx] || politiqueColors[0];
                  const pct = Math.min(100, ((pol.score || 0) / pol.max) * 100);
                  return (
                    <div key={pol.name} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-800 text-sm">POLITIQUE DE {pol.name}</h4>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${cfg.badge}`}>{pol.score} pts</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mb-2">
                        <div className={`h-full ${cfg.bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Score {pol.score}/{pol.max}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.badge}`}>{pct.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-blue-800">TOTAL GÉNÉRAL</span>
                    <span className="text-xl font-bold text-blue-700">{ae.score} / {ae.maxScore} pts</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${Math.min(100, (ae.score / ae.maxScore) * 100)}%` }} />
                  </div>
                  <div className="flex justify-end mt-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${niveauInfo.badge}`}>
                      Niveau {niveauInfo.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Critères */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <FaFileAlt className="text-blue-600" /> Détail des critères d'évaluation
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {criteresCount} critères valués sur 92
              {criteresCount === 0 && " — Aucun critère enregistré pour cette demande"}
            </p>
            <div className="space-y-6">
              {sectionsEvaluation.map((section, idx) => (
                <CriteresSection key={idx} title={section.title} subsections={section.subsections} criteresData={ae.criteres || {}} />
              ))}
            </div>
          </div>

          {/* Fichiers joints */}
          {selectedDetail.fichiers?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaUpload className="text-blue-600" />
                Documents joints
                <span className="text-sm font-normal text-gray-500">({selectedDetail.fichiers.length} fichiers)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedDetail.fichiers.map((file) => (
                  <div key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                    <div className="flex items-center gap-3 min-w-0">
                      {getFileIcon(file.type_mime || file.type)}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {file.nom_original || file.name || `Fichier ${file.id}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.taille || file.size)} • {formatDate(file.uploaded_at || file.date)}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => handleDownloadFile(file.id, file.nom_original || file.name)}
                      className="flex-shrink-0 flex items-center gap-1 p-2 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors ml-2">
                      <FaDownload size={14} />
                      <span className="text-xs hidden group-hover:inline">Télécharger</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historique */}
          {selectedDetail.history?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaClock className="text-blue-600" /> Historique du dossier
              </h2>
              <div className="space-y-3">
                {selectedDetail.history.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{entry.action || entry.statut}</p>
                      <p className="text-xs text-gray-500">{formatDate(entry.date)}{entry.user ? ` • ${entry.user}` : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal restauration — vue détail */}
        {showRestoreModal && selectedDossier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Restaurer le dossier</h3>
              <p className="text-sm mb-2">
                Voulez-vous restaurer le dossier <span className="font-semibold">{selectedDossier.dossierNumber}</span> ?
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Cette action retirera le dossier des archives et le rendra visible dans la liste principale.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={14} />
                  <p className="text-xs text-blue-700">L'historique complet du dossier sera conservé après la restauration.</p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={closeModals} className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">Annuler</button>
                <button onClick={confirmRestore} disabled={restoring}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm disabled:opacity-50">
                  {restoring ? <FaSync className="animate-spin" size={14} /> : <FaRedo size={14} />}
                  {restoring ? "Restauration..." : "Restaurer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // VUE LISTE
  // ============================================================
  return (
    <div className="min-h-screen bg-white p-2 md:p-4 lg:p-6">
      <ToastContainer {...toastConfig} />

      <header className="mb-4 md:mb-6">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-1">
          Archives des demandes d'accréditation
        </h1>
        <p className="text-gray-500 text-xs md:text-sm">
          Consultation et gestion des dossiers d'accréditation archivés
        </p>
      </header>

      {/* Filtres */}
      <div className="mb-4 md:mb-6 bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">Recherche globale</label>
          <div className="relative">
            <input type="text"
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Numéro, institution, programme, décision..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date archivage (début)</label>
            <input type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              value={startDateFilter}
              onChange={(e) => { setStartDateFilter(e.target.value); setCurrentPage(1); }} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date archivage (fin)</label>
            <input type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              value={endDateFilter}
              onChange={(e) => { setEndDateFilter(e.target.value); setCurrentPage(1); }} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Décision</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              value={archiveReasonFilter}
              onChange={(e) => { setArchiveReasonFilter(e.target.value); setCurrentPage(1); }}>
              <option value="">Toutes les décisions</option>
              {archiveReasonOptions.map((r) => (
                <option key={r} value={r}>{archiveReasonLabels[r]}</option>
              ))}
            </select>
          </div>
        </div>
        {(searchQuery || startDateFilter || endDateFilter || archiveReasonFilter) && (
          <div className="mt-3 flex justify-end">
            <button onClick={resetAllFilters}
              className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1">
              <FaSync size={10} /> Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white">
          <h3 className="font-bold text-gray-800 text-sm md:text-base">
            Dossiers archivés
            {loading
              ? <span className="ml-2 text-gray-400 text-xs font-normal">Chargement...</span>
              : <span className="ml-2 text-gray-400 text-xs font-normal">({filteredArchives.length})</span>}
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Lignes</span>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="border border-gray-300 rounded px-2 py-1 bg-gray-50 text-xs">
              {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-500 text-sm">Chargement des archives...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <FaExclamationTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button onClick={loadArchivedDemandes}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2 mx-auto">
              <FaSync size={12} /> Ressayer
            </button>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-100 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide">
                    <button onClick={() => handleSortClick("id")} className="flex items-center gap-1 hover:text-blue-600">
                      ID <SortIcon isSorted={sortBy === "id"} isAsc={sortDirection === "asc"} />
                    </button>
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide">
                    <button onClick={() => handleSortClick("dossier")} className="flex items-center gap-1 hover:text-blue-600">
                      N° Dossier <SortIcon isSorted={sortBy === "dossier"} isAsc={sortDirection === "asc"} />
                    </button>
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide">
                    <button onClick={() => handleSortClick("institution")} className="flex items-center gap-1 hover:text-blue-600">
                      Institution <SortIcon isSorted={sortBy === "institution"} isAsc={sortDirection === "asc"} />
                    </button>
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Programme</th>
                  <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Niveau</th>
                  <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide">
                    <button onClick={() => handleSortClick("archivedDate")} className="flex items-center gap-1 hover:text-blue-600">
                      Date archivage <SortIcon isSorted={sortBy === "archivedDate"} isAsc={sortDirection === "asc"} />
                    </button>
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide">Décision</th>
                  <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedArchives.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                      <FaArchive className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                      <p className="text-sm">Aucun dossier archivé trouvé</p>
                      {(searchQuery || archiveReasonFilter) && (
                        <button onClick={resetAllFilters} className="mt-2 text-blue-500 hover:underline text-xs">
                          Effacer les filtres
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  paginatedArchives.map((acc) => {
                    const niveauInfo = getLevelInfo(acc.niveau);
                    return (
                      <tr key={acc.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">{acc.id}</span>
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className="font-mono text-xs text-blue-700">{acc.dossierNumber}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <FaUniversity className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                            <span className="text-xs truncate max-w-[140px]" title={acc.institution}>
                              {acc.institution}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 hidden md:table-cell">
                          <span className="text-xs text-gray-600 truncate max-w-[120px] block" title={acc.mention}>
                            {acc.mention}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 hidden md:table-cell whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${niveauInfo.badge}`}>
                            {niveauInfo.label}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-500">
                          {formatDate(acc.archivedDate)}
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          {acc.status ? (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border
                              ${acc.status === "accredite" ? "bg-green-100 text-green-800 border-green-200" :
                                acc.status === "ajourne"   ? "bg-orange-100 text-orange-800 border-orange-200" :
                                acc.status === "rejetee"   ? "bg-red-100 text-red-800 border-red-200" :
                                "bg-gray-100 text-gray-700 border-gray-200"}`}>
                              {archiveReasonLabels[acc.status] || getStatutLibelle(acc.status)}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button onClick={() => openDetailView(acc)} title="Voir le dossier"
                              className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                              <FaEye size={13} />
                            </button>
                            <button onClick={() => openRestoreModal(acc)} title="Restaurer le dossier"
                              className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors">
                              <FaRedo size={13} />
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
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white">
            <span className="text-xs text-gray-500">
              {startIndex + 1}–{Math.min(startIndex + pageSize, sortedArchives.length)} sur {sortedArchives.length}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                <FaAngleLeft size={12} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
                return (
                  <button key={page} onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded text-xs font-medium transition-colors
                      ${currentPage === page ? "bg-blue-600 text-white" : "border border-gray-200 hover:bg-gray-50"}`}>
                    {page}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                <FaAngleRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal restauration — vue liste */}
      {showRestoreModal && selectedDossier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Restaurer le dossier</h3>
            <p className="text-sm mb-2">
              Voulez-vous restaurer le dossier <span className="font-semibold">{selectedDossier.dossierNumber}</span> ?
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Cette action retirera le dossier des archives et le rendra visible dans la liste principale.
            </p>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
              <div className="flex items-start gap-2">
                <FaInfoCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={14} />
                <p className="text-xs text-blue-700">L'historique complet du dossier sera conservé après la restauration.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={closeModals} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                Annuler
              </button>
              <button onClick={confirmRestore} disabled={restoring}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm disabled:opacity-50">
                {restoring ? <FaSync className="animate-spin" size={14} /> : <FaRedo size={14} />}
                {restoring ? "Restauration..." : "Restaurer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveAccreditationView;