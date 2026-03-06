// C:\Users\hp\Desktop\Digitalisation\frontend\src\pages\Dashboard\View\Requérant\MesDemandesView.jsx

import React, { useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Edit3,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileText,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Building,
  BookOpen,
  CheckCircle,
  XCircle,
  Hourglass,
  Download,
  FileIcon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../../../context/ThemeContext";
import { getUserDemandes } from "../../../../services/equivalence.services";

// ── Configuration ─────────────────────────────────────────────────────────────
const PER_PAGE_OPTIONS = [10, 20, 30, 40, 50, 100];

// Mapper les statuts du backend vers ceux affichés dans l'UI
const mapStatutToDisplay = (statut) => {
  const mapping = {
    brouillon: "Brouillon",
    soumise: "En cours",
    en_cours: "En cours",
    complet: "Complété",
    rejete: "Rejetée",
    accorde: "Acceptée",
    ajourne: "Ajournée",
    ajourné: "Ajournée",
    ajournee: "Ajournée",
  };
  return mapping[statut] || statut;
};

// Configuration des statuts pour les badges
const STATUT_CONFIG = {
  Brouillon: {
    label: "Brouillon",
    icon: Clock,
    color: "#64748b",
    bg: "rgba(100,116,139,0.10)",
    border: "rgba(100,116,139,0.25)",
    textColor: "#475569",
  },
  "En cours": {
    label: "En cours",
    icon: Hourglass,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.10)",
    border: "rgba(59,130,246,0.25)",
    textColor: "#2563eb",
  },
  Complété: {
    label: "Complété",
    icon: CheckCircle,
    color: "#22c55e",
    bg: "rgba(34,197,94,0.10)",
    border: "rgba(34,197,94,0.25)",
    textColor: "#16a34a",
  },
  Rejetée: {
    label: "Rejetée",
    icon: XCircle,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.10)",
    border: "rgba(239,68,68,0.25)",
    textColor: "#dc2626",
  },
  Acceptée: {
    label: "Acceptée",
    icon: CheckCircle,
    color: "#22c55e",
    bg: "rgba(34,197,94,0.10)",
    border: "rgba(34,197,94,0.25)",
    textColor: "#16a34a",
  },
  Ajournée: {
    label: "Ajournée",
    icon: Hourglass,
    color: "#f97316",
    bg: "rgba(249,115,22,0.10)",
    border: "rgba(249,115,22,0.25)",
    textColor: "#c2410c",
  },
};

// Configuration des types de diplôme

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return "Non définie";
  const date = new Date(dateString);
  return date
    .toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(".", "");
};

const formatDateTime = (dateString) => {
  if (!dateString) return "Non définie";
  const date = new Date(dateString);
  return date
    .toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(".", "");
};

const safeStr = (v) => (v == null ? "" : String(v));

// ── Badges ───────────────────────────────────────────────────────────────────
const TONES = {
  gray: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
  blue: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300",
  green: "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300",
  red: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300",
  orange:
    "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300",
  purple:
    "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300",
  pink: "bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300",
};

const Pill = ({ children, tone = "gray" }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${TONES[tone]}`}
  >
    {children}
  </span>
);

const TypeDiplomeBadge = ({ type }) => {
  let tone = "gray";
  if (type === "Licence") tone = "blue";
  else if (type === "Master") tone = "purple";
  else if (type === "Doctorat") tone = "pink";

  return <Pill tone={tone}>{type}</Pill>;
};

// ── Modal de détail avec pièces jointes ──────────────────────────────────────
const ModalShell = ({ title, icon: Icon, onClose, children, footer }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    />
    <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Icon size={16} />
            </div>
          )}
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-5 max-h-[70vh] overflow-y-auto text-gray-900 dark:text-gray-100">
        {children}
      </div>
      {footer && (
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70 flex justify-end gap-2">
          {footer}
        </div>
      )}
    </div>
  </div>
);

const DetailField = ({ icon: Icon, label, value }) => (
  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
    <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
      <Icon size={12} /> {label}
    </div>
    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">
      {value || "-"}
    </div>
  </div>
);

// Fonction pour télécharger un fichier
const downloadFile = (filePath, fileName) => {
  // Construire l'URL complète du fichier
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const fileUrl = `${baseURL}/uploads/${filePath}`;

  // Créer un lien temporaire
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = fileName || filePath.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const DocumentItem = ({ documentType, filePath }) => {
  if (!filePath) return null;

  const fileName = filePath.split("/").pop();
  const displayName = fileName.split("--").pop() || fileName;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
      <div className="flex items-center gap-3">
        <FileIcon size={16} className="text-blue-500" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {displayName}
        </span>
      </div>
      <button
        onClick={() => downloadFile(filePath, displayName)}
        className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        title="Télécharger"
      >
        <Download size={16} />
      </button>
    </div>
  );
};

const DetailModal = ({ demande, onClose, onEdit }) => {
  if (!demande) return null;

  const displayStatut = mapStatutToDisplay(demande.statut);
  const config = STATUT_CONFIG[displayStatut] || STATUT_CONFIG["En cours"];
  const StatutIcon = config.icon;

  // Extraire la première formation pour l'affichage
  const firstFormation =
    demande.recapitulatif_formation &&
    demande.recapitulatif_formation.length > 0
      ? demande.recapitulatif_formation[0]
      : null;

  // Liste des documents avec leurs libellés
  const documentLabels = {
    demande_equivalence: "Demande d'équivalence",
    piece_identite: "Pièce d'identité",
    diplomes_certifies: "Diplômes certifiés",
    traduction_diplomes: "Traduction des diplômes",
    justificatifs_duree_etudes: "Justificatifs de durée d'études",
    traduction_justificatifs: "Traduction des justificatifs",
    memoire_these: "Mémoire/Thèse",
    arrete_habilitation: "Arrêté d'habilitation",
    attestation_master: "Attestation Master",
  };

  return (
    <ModalShell
      title={`Détail de la demande EQ-${demande.id.toString().padStart(4, "0")}`}
      icon={FileText}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold"
          >
            Fermer
          </button>
          <button
            type="button"
            onClick={() => onEdit(demande)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold shadow-md hover:brightness-110 flex items-center gap-1"
          >
            <Edit3 size={12} />
            Modifier
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {/* En-tête avec statut */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: config.bg }}
            >
              <StatutIcon size={18} style={{ color: config.color }} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Statut actuel
              </p>
              <p
                className="text-sm font-bold"
                style={{ color: config.textColor }}
              >
                {config.label}
              </p>
            </div>
          </div>
          <TypeDiplomeBadge type={demande.type_diplome} />
        </div>

        {/* Informations personnelles */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
            <User size={12} /> Requérant
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <DetailField
              icon={User}
              label="Nom complet"
              value={`${safeStr(demande.nom)} ${safeStr(demande.prenoms)}`}
            />
            <DetailField icon={Mail} label="Email" value={demande.email} />
            <DetailField
              icon={Phone}
              label="Téléphone"
              value={demande.telephone}
            />
            <DetailField
              icon={MapPin}
              label="Adresse"
              value={demande.code_postal}
            />
          </div>
        </div>

        {/* Détails académiques */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
            <GraduationCap size={12} /> Formation
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <DetailField
              icon={BookOpen}
              label="Diplôme visé"
              value={firstFormation?.diplome || demande.type_diplome}
            />
            <DetailField
              icon={Building}
              label="Établissement"
              value={firstFormation?.etablissement || "Non spécifié"}
            />
            <DetailField
              icon={Calendar}
              label="Année"
              value={firstFormation?.annee_obtention || "Non spécifiée"}
            />
            <DetailField
              icon={BookOpen}
              label="Mention"
              value={firstFormation?.mention || "Non spécifiée"}
            />
          </div>
        </div>

        {/* Raison et dates */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
            <FileText size={12} /> Informations supplémentaires
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <DetailField
              icon={Clock}
              label="Motif"
              value={
                demande.motif
                  ? {
                      inscription: "Inscription formation",
                      ecole_doctorale: "Inscription école Doctorale",
                      recherche_emploi: "Recherche d'emploi",
                      concours: "Participation à un concours",
                      autres: "Autres",
                    }[demande.motif] || demande.motif
                  : "Non spécifié"
              }
            />
            <DetailField
              icon={Calendar}
              label="Date de dépôt"
              value={formatDate(demande.submitted_at || demande.created_at)}
            />
            <DetailField
              icon={Clock}
              label="Dernière mise à jour"
              value={formatDateTime(demande.updated_at)}
            />
          </div>
        </div>

        {/* Pièces jointes */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
            <FileText size={12} /> Pièces jointes
          </h4>
          <div className="space-y-2">
            {Object.entries(documentLabels).map(([key, label]) => {
              const filePath = demande.documents?.[key];
              if (!filePath) return null;

              return (
                <div key={key} className="flex flex-col">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {label}
                  </p>
                  <DocumentItem documentType={key} filePath={filePath} />
                </div>
              );
            })}
            {(!demande.documents ||
              Object.keys(demande.documents).length === 0) && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                Aucun document joint
              </p>
            )}
          </div>
        </div>

        {/* Commentaire admin */}
        {demande.commentaire_admin && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
            <p className="text-xs font-bold uppercase text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
              <AlertCircle size={12} /> Message de l'administration
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {demande.commentaire_admin}
            </p>
          </div>
        )}
      </div>
    </ModalShell>
  );
};

// ── Composant principal ──────────────────────────────────────────────────────
export default function MesDemandesView() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // États
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statutFilter, setStatutFilter] = useState("Tous");
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [detailDemande, setDetailDemande] = useState(null);

  // Couleurs dynamiques selon le thème
  const isDark = theme === "dark";
  const borderC = isDark ? "#334155" : "#e2e8f0";
  const headerBg = isDark ? "#0f172a" : "#f8fafc";
  const headerC = isDark ? "#64748b" : "#94a3b8";
  const textC = isDark ? "#e2e8f0" : "#334155";
  const subC = isDark ? "#475569" : "#94a3b8";
  const bgCard = isDark ? "#1e293b" : "#ffffff";
  const rowHover = isDark ? "rgba(59,130,246,0.06)" : "#f8faff";

  // Charger les demandes
  const loadDemandes = async () => {
    setLoading(true);
    try {
      // Inclure les demandes archivées pour les afficher dans la liste
      const response = await getUserDemandes({}, true);
      if (response.success && response.data) {
        setDemandes(response.data);
      } else {
        setDemandes([]);
        toast.error("Erreur lors du chargement des demandes");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des demandes:", error);
      toast.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemandes();
  }, []);

  // Filtrage
  const filteredDemandes = useMemo(() => {
    let list = [...demandes];

    if (statutFilter !== "Tous") {
      if (statutFilter === "En cours") {
        list = list.filter(
          (d) => d.statut === "soumise" || d.statut === "en_cours",
        );
      } else if (statutFilter === "Complété") {
        list = list.filter(
          (d) => d.statut === "complet" || d.statut === "accorde",
        );
      } else if (statutFilter === "Rejetée") {
        list = list.filter((d) => d.statut === "rejete");
      } else if (statutFilter === "Brouillon") {
        list = list.filter((d) => d.statut === "brouillon");
      }
    }

    if (typeFilter !== "Tous") {
      list = list.filter((d) => d.type_diplome === typeFilter);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (d) =>
          `${safeStr(d.nom)} ${safeStr(d.prenoms)}`.toLowerCase().includes(q) ||
          `EQ-${d.id.toString().padStart(4, "0")}`.toLowerCase().includes(q) ||
          safeStr(d.type_diplome).toLowerCase().includes(q),
      );
    }

    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [demandes, statutFilter, typeFilter, searchTerm]);

  const totalPages = Math.ceil(filteredDemandes.length / perPage);
  const paginatedDemandes = useMemo(
    () =>
      filteredDemandes.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage,
      ),
    [filteredDemandes, currentPage, perPage],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [statutFilter, typeFilter, searchTerm, perPage]);

  const startItem =
    filteredDemandes.length === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, filteredDemandes.length);

  // Pagination numbers
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    )
      pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }, [totalPages, currentPage]);

  const hasFilter =
    searchTerm || statutFilter !== "Tous" || typeFilter !== "Tous";

  const resetFilters = () => {
    setSearchTerm("");
    setStatutFilter("Tous");
    setTypeFilter("Tous");
    setCurrentPage(1);
  };

  const handleEdit = (demande) => {
    navigate("/dashboard/requerant/creer-demande", {
      state: { demande: demande },
    });
  };

  const STATUTS_FILTRES = [
    "Tous",
    "En cours",
    "Complété",
    "Rejetée",
    "Brouillon",
  ];
  const TYPES_FILTRES = ["Tous", "Licence", "Master", "Doctorat"];

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              borderBottom: "2px solid #3b82f6",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span style={{ fontSize: 13, color: subC }}>
            Chargement de vos demandes...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 p-4 sm:p-6 lg:p-8">
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

      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-xl font-black tracking-tight"
              style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}
            >
              Mes demandes d'équivalence
            </h1>
            <p className="text-xs mt-0.5" style={{ color: subC }}>
              {filteredDemandes.length} demande
              {filteredDemandes.length > 1 ? "s" : ""} trouvée
              {filteredDemandes.length > 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/requerant/creer-demande")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 12,
              border: `1px solid ${borderC}`,
              background: bgCard,
              color: textC,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <FileText size={16} /> Nouvelle demande
          </button>
        </div>

        {/* ── Tableau principal ── */}
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
              background: isDark ? "#0f172a" : "#f8fafc",
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "flex-end",
            }}
          >
            {/* Recherche */}
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <Search
                style={{
                  position: "absolute",
                  left: 11,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  fontSize: 14,
                  size: 14,
                }}
              />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou référence..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: "100%",
                  paddingLeft: 36,
                  paddingRight: searchTerm ? 30 : 12,
                  paddingTop: 8,
                  paddingBottom: 8,
                  borderRadius: 10,
                  border: `1px solid ${borderC}`,
                  background: isDark ? "#1e293b" : "#ffffff",
                  color: textC,
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
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
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filtre Statut */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <label
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: subC,
                  letterSpacing: "0.06em",
                }}
              >
                Statut
              </label>
              <select
                value={statutFilter}
                onChange={(e) => {
                  setStatutFilter(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: `1px solid ${borderC}`,
                  background: isDark ? "#1e293b" : "#ffffff",
                  color: textC,
                  fontSize: 13,
                  outline: "none",
                  minWidth: 140,
                  cursor: "pointer",
                }}
              >
                {STATUTS_FILTRES.map((statut) => (
                  <option key={statut} value={statut}>
                    {statut}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre Type de diplôme */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <label
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: subC,
                  letterSpacing: "0.06em",
                }}
              >
                Type de diplôme
              </label>
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
                  background: isDark ? "#1e293b" : "#ffffff",
                  color: textC,
                  fontSize: 13,
                  outline: "none",
                  minWidth: 140,
                  cursor: "pointer",
                }}
              >
                {TYPES_FILTRES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset filters */}
            {hasFilter && (
              <button
                onClick={resetFilters}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: `1px solid ${borderC}`,
                  background: isDark ? "#1e293b" : "#ffffff",
                  color: textC,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                <X size={10} /> Réinitialiser
              </button>
            )}
          </div>

          {/* Sélecteur lignes par page */}
          <div
            style={{
              padding: "10px 20px",
              borderBottom: `1px solid ${borderC}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 12, color: subC }}>Afficher</span>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                padding: "3px 8px",
                borderRadius: 7,
                border: `1px solid ${borderC}`,
                background: isDark ? "#0f172a" : "#f8fafc",
                color: textC,
                fontSize: 12,
                outline: "none",
                cursor: "pointer",
              }}
            >
              {PER_PAGE_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <span style={{ fontSize: 12, color: subC }}>entrées</span>
          </div>

          {/* Tableau */}
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 900,
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
                    "Référence",
                    "Nom complet",
                    "Type de diplôme",
                    "Date de dépôt",
                    "Statut",
                    "Dernière mise à jour",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: i === 1 ? "left" : "center",
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        color: headerC,
                        whiteSpace: "nowrap",
                        borderRight: i < 6 ? `1px solid ${borderC}` : "none",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedDemandes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
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
                        <FileText size={22} />
                        <span style={{ fontSize: 13 }}>
                          Aucune demande trouvée.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedDemandes.map((demande) => {
                    const displayStatut = mapStatutToDisplay(demande.statut);
                    const config =
                      STATUT_CONFIG[displayStatut] || STATUT_CONFIG["En cours"];
                    const StatutIcon = config.icon;

                    return (
                      <tr
                        key={demande.id}
                        style={{
                          borderBottom: `1px solid ${borderC}`,
                          transition: "background 0.12s",
                          cursor: "default",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = rowHover)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td
                          style={{
                            padding: "12px 16px",
                            borderRight: `1px solid ${borderC}`,
                            textAlign: "center",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "monospace",
                              fontSize: 12,
                              color: textC,
                            }}
                          >
                            EQ-{demande.id.toString().padStart(4, "0")}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            borderRight: `1px solid ${borderC}`,
                            textAlign: "left",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: textC,
                            }}
                          >
                            {safeStr(demande.nom)} {safeStr(demande.prenoms)}
                          </div>
                          <div
                            style={{ fontSize: 11, color: subC, marginTop: 2 }}
                          >
                            {safeStr(demande.email)}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            borderRight: `1px solid ${borderC}`,
                            textAlign: "center",
                          }}
                        >
                          <TypeDiplomeBadge type={demande.type_diplome} />
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            borderRight: `1px solid ${borderC}`,
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6,
                            }}
                          >
                            <Calendar size={11} style={{ color: subC }} />
                            <span style={{ fontSize: 12, color: textC }}>
                              {formatDate(
                                demande.submitted_at || demande.created_at,
                              )}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            borderRight: `1px solid ${borderC}`,
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "4px 10px",
                              borderRadius: 20,
                              background: config.bg,
                            }}
                          >
                            <StatutIcon
                              size={11}
                              style={{ color: config.color }}
                            />
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: config.textColor,
                              }}
                            >
                              {config.label}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            borderRight: `1px solid ${borderC}`,
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6,
                            }}
                          >
                            <Clock size={11} style={{ color: subC }} />
                            <span style={{ fontSize: 11, color: subC }}>
                              {formatDateTime(
                                demande.updated_at || demande.created_at,
                              )}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{ padding: "12px 16px", textAlign: "center" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 4,
                            }}
                          >
                            <button
                              onClick={() => setDetailDemande(demande)}
                              title="Voir les détails"
                              style={{
                                padding: 6,
                                borderRadius: 6,
                                border: "none",
                                background: "transparent",
                                color: "#64748b",
                                cursor: "pointer",
                                transition: "all 0.15s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#3b82f610";
                                e.currentTarget.style.color = "#3b82f6";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  "transparent";
                                e.currentTarget.style.color = "#64748b";
                              }}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(demande)}
                              title="Modifier la demande"
                              style={{
                                padding: 6,
                                borderRadius: 6,
                                border: "none",
                                background: "transparent",
                                color: "#64748b",
                                cursor: "pointer",
                                transition: "all 0.15s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#6366f110";
                                e.currentTarget.style.color = "#6366f1";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  "transparent";
                                e.currentTarget.style.color = "#64748b";
                              }}
                            >
                              <Edit3 size={16} />
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
          {filteredDemandes.length > 0 && (
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
                {filteredDemandes.length > 0
                  ? `Affichage de ${startItem} à ${endItem} sur ${filteredDemandes.length} demandes`
                  : "Aucune demande"}
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
                  <ChevronLeft size={16} />
                </button>

                {pageNumbers.map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`e-${i}`}
                      style={{ fontSize: 13, color: subC, padding: "0 4px" }}
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: `1px solid ${currentPage === p ? "#3b82f6" : borderC}`,
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
                  ),
                )}

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
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de détail */}
      {detailDemande && (
        <DetailModal
          demande={detailDemande}
          onClose={() => setDetailDemande(null)}
          onEdit={handleEdit}
        />
      )}

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
}
