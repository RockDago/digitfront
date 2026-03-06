import React, { useState, useEffect, useContext } from "react";
import {
  Award, TrendingUp, CheckCircle, AlertCircle, FileText, Send,
  AlertTriangle, Zap, CheckCircle2, Star, Upload, X, Info,
  ArrowLeft, Edit, Save, Eye, Download, Trash2,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";

import { ThemeContext } from "../../../../../context/ThemeContext";
import accreditationServices from "../../../../../services/accreditation.services";

const {
  createDemande, submitDemande, uploadDemandeFichiers,
  getMyAutoEvaluations, getAutoEvaluation, getDemande, getMyDemandes,
  formatDemandeData, formatDemandeResponse, updateDemande,
  downloadFichier, deleteDemandeFichier,
  STATUT_DEMANDE, TYPE_ETABLISSEMENT, GRADE,
  validateDemandeData, canSubmitDemande, getStatutLibelle, getStatutColor,
} = accreditationServices;

// ── Couleur dynamique par ratio score/max ─────────────────────────────────────
const getPolicyColorConfig = (score, max) => {
  const ratio = max > 0 ? score / max : 0;
  if (ratio >= 0.90) return { bar: "bg-green-500",  badgeText: "text-green-700",  badgeBg: "bg-green-50",  border: "border-green-200",  dot: "bg-green-500"  };
  if (ratio >= 0.75) return { bar: "bg-blue-500",   badgeText: "text-blue-700",   badgeBg: "bg-blue-50",   border: "border-blue-200",   dot: "bg-blue-500"   };
  if (ratio >= 0.50) return { bar: "bg-yellow-500", badgeText: "text-yellow-700", badgeBg: "bg-yellow-50", border: "border-yellow-200", dot: "bg-yellow-500" };
  if (ratio >= 0.25) return { bar: "bg-orange-500", badgeText: "text-orange-700", badgeBg: "bg-orange-50", border: "border-orange-200", dot: "bg-orange-500" };
  return               { bar: "bg-red-500",    badgeText: "text-red-700",    badgeBg: "bg-red-50",    border: "border-red-200",    dot: "bg-red-500"    };
};

// ✅ Statuts qui bloquent la création d'une nouvelle demande
const STATUTS_BLOQUANTS = [
  STATUT_DEMANDE.BROUILLON,
  STATUT_DEMANDE.EN_COURS,
  STATUT_DEMANDE.ACCREDITE,
];

const CreerDemandeAccreditation = () => {
  const { demandeId } = useParams();
  const navigate = useNavigate();

  const [uploadedFiles,         setUploadedFiles]         = useState([]);
  const [showModal,             setShowModal]             = useState(false);
  const [showRecapModal,        setShowRecapModal]        = useState(false);
  const [numeroDemande,         setNumeroDemande]         = useState("");
  const [formSubmitted,         setFormSubmitted]         = useState(false);
  const [isMobile,              setIsMobile]              = useState(false);
  const [isLoading,             setIsLoading]             = useState(true);
  const [isSubmitting,          setIsSubmitting]          = useState(false);
  const [createdDemandeId,      setCreatedDemandeId]      = useState(demandeId || null);
  const [hasCompleteEvaluation, setHasCompleteEvaluation] = useState(false);
  const [isEditing,             setIsEditing]             = useState(false);
  const [demande,               setDemande]               = useState(null);

  const [formData, setFormData] = useState({
    responsable: "", typeetablissement: "", institution: "",
    etablissement: "", domaine: "", mention: "", grade: "", parcours: "",
  });

  const [autoEvaluationResult, setAutoEvaluationResult] = useState(null);
  const [autoEvaluationId,     setAutoEvaluationId]     = useState(null);
  const [evaluationCriteres,   setEvaluationCriteres]   = useState([]);
  const [criteresDetails,      setCriteresDetails]      = useState({});

  const [formationScore,   setFormationScore]   = useState(0);
  const [gouvernanceScore, setGouvernanceScore] = useState(0);
  const [rechercheScore,   setRechercheScore]   = useState(0);

  const { theme } = useContext(ThemeContext);

  const levelConfig = {
    "non-conforme": { color: "bg-red-50 border-red-200",      badge: "bg-red-100 text-red-800",       bar: "bg-red-500",    bgCircle: "#FEE2E2", circleColor: "#EF4444", icon: AlertTriangle,  label: "Non conforme",  range: "0-91",    appreciation: "Absence d'une politique ou d'un dispositif crédible",             min: 0,   max: 91  },
    faible:         { color: "bg-orange-50 border-orange-200", badge: "bg-orange-100 text-orange-800", bar: "bg-orange-500", bgCircle: "#FEF3C7", circleColor: "#F97316", icon: Zap,            label: "Faible",        range: "92-183",  appreciation: "Plusieurs insuffisances majeures",                               min: 92,  max: 183 },
    acceptable:     { color: "bg-yellow-50 border-yellow-200", badge: "bg-yellow-100 text-yellow-800", bar: "bg-yellow-500", bgCircle: "#FEF9C3", circleColor: "#EAB308", icon: CheckCircle2,   label: "Acceptable",    range: "184-256", appreciation: "Conformité partielle, dispositifs à consolider",                 min: 184, max: 256 },
    satisfaisant:   { color: "bg-blue-50 border-blue-200",     badge: "bg-blue-100 text-blue-800",     bar: "bg-blue-500",   bgCircle: "#DBEAFE", circleColor: "#3B82F6", icon: CheckCircle2,   label: "Satisfaisant",  range: "257-311", appreciation: "Conformité générale avec quelques points à améliorer",          min: 257, max: 311 },
    excellent:      { color: "bg-green-50 border-green-200",   badge: "bg-green-100 text-green-800",   bar: "bg-green-500",  bgCircle: "#DCFCE7", circleColor: "#22C55E", icon: Star,           label: "Excellent",     range: "312-368", appreciation: "Très haute qualité, bonnes pratiques institutionnalisées",       min: 312, max: 368 },
  };

  const gradeOptions = [
    { value: GRADE.LICENCE,  label: GRADE.LICENCE  },
    { value: GRADE.MASTER,   label: GRADE.MASTER   },
    { value: GRADE.DOCTORAT, label: GRADE.DOCTORAT },
  ];

  // ===========================================================================
  // UTILITAIRES
  // ===========================================================================

  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    return new Date(dateString).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
  };

  const formatNumeroDemande = (numero) => {
    if (!numero) return numero;
    const match = numero.match(/^(ACC)-(\d{4})(\d{2})-(\d+)$/);
    if (match) {
      const [, prefix, year, month, seq] = match;
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      return `${prefix}-${day}-${month}-${year}-${seq}`;
    }
    return numero;
  };

  const getLevelFromScore = (score) => {
    if (score < 92)                      return "non-conforme";
    if (score >= 92  && score <= 183)    return "faible";
    if (score >= 184 && score <= 256)    return "acceptable";
    if (score >= 257 && score <= 311)    return "satisfaisant";
    if (score >= 312 && score <= 368)    return "excellent";
    return "excellent";
  };

  const isEligibleForSubmission = () => {
    if (!autoEvaluationResult) return false;
    const totalScore = autoEvaluationResult.totalNotes || 0;
    const niveau = getLevelFromScore(totalScore);
    return niveau !== "non-conforme" && niveau !== "faible";
  };

  const isFormPartiallyFilled = () => {
    const filledFields = Object.values(formData).filter((value) => value && value.trim() !== "").length;
    return filledFields > 0;
  };

  // ===========================================================================
  // GESTION DES FICHIERS
  // ===========================================================================

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      id:    `temp_${Math.random().toString(36).substr(2, 9)}`,
      name:  file.name,
      size:  (file.size / 1024).toFixed(2) + " KB",
      file:  file,
      isNew: true,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    toast.success(`${files.length} fichier(s) ajouté(s) avec succès`, { position: "top-right", autoClose: 3000 });
  };

  const removeFile = async (fileToRemove) => {
    try {
      if (fileToRemove.id && !fileToRemove.id.startsWith("temp_")) {
        await deleteDemandeFichier(createdDemandeId, fileToRemove.id);
        toast.info("Fichier supprimé de la base de données", { position: "top-right", autoClose: 3000 });
      }
      setUploadedFiles(uploadedFiles.filter((file) => file.id !== fileToRemove.id));
    } catch (error) {
      console.error("Erreur lors de la suppression du fichier:", error);
      toast.error("Erreur lors de la suppression du fichier", { position: "top-right", autoClose: 3000 });
    }
  };

  const handleDownloadFile = async (file) => {
    try {
      const blob = await downloadFichier(file.id);
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement du fichier");
    }
  };

  // ===========================================================================
  // GESTION DU FORMULAIRE
  // ===========================================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "typeetablissement") {
      setFormData({
        ...formData,
        [name]:           value,
        institution:      value === TYPE_ETABLISSEMENT.PRIVEE   ? formData.institution  : "",
        etablissement:    value === TYPE_ETABLISSEMENT.PUBLIQUE ? formData.etablissement : "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ===========================================================================
  // CHARGEMENT DES DONNÉES
  // ===========================================================================

  useEffect(() => {
    const checkMobile = () => { setIsMobile(window.innerWidth < 768); };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => { window.removeEventListener("resize", checkMobile); };
  }, []);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user") || "null")?.id;
    if (userId) {
      ["auto_evaluation_progression", "auto_evaluation_result", "expanded_sections"]
        .forEach((key) => { localStorage.removeItem(`${key}_${userId}`); });
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        if (demandeId) {
          await loadDemandeData();
        } else {
          const isComplete = await loadLatestAutoEvaluation();
          if (isComplete) { await loadExistingDemandes(); }
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };
    initializeData();
  }, [demandeId]);

  useEffect(() => {
    if (createdDemandeId && !demandeId) { reloadDemandeData(); }
  }, [createdDemandeId]);

  const loadDemandeData = async () => {
    if (!demandeId) return;
    try {
      const response   = await getDemande(demandeId);
      const demandeData = formatDemandeResponse(response.data || response);
      setDemande(demandeData);
      setFormData({
        responsable:       demandeData.responsable       || "",
        typeetablissement: demandeData.type_etablissement || "",
        institution:       demandeData.institution       || "",
        etablissement:     demandeData.etablissement     || "",
        domaine:           demandeData.domaine           || "",
        mention:           demandeData.mention           || "",
        grade:             demandeData.grade             || "",
        parcours:          demandeData.parcours          || "",
      });
      // ✅ Toujours utiliser le vrai numéro du backend
      setNumeroDemande(demandeData.numero_demande || "");
      setAutoEvaluationId(demandeData.auto_evaluation_id);
      setFormSubmitted(demandeData.statut === STATUT_DEMANDE.EN_COURS);
      setIsEditing(true);
      if (demandeData.auto_evaluation_id) {
        await loadAutoEvaluation(demandeData.auto_evaluation_id);
      }
      if (demandeData.fichiers && demandeData.fichiers.length > 0) {
        setUploadedFiles(demandeData.fichiers);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la demande:", error);
      toast.error("Erreur lors du chargement de la demande");
    }
  };

  const reloadDemandeData = async () => {
    if (!createdDemandeId) return;
    try {
      const response    = await getDemande(createdDemandeId);
      const demandeData  = formatDemandeResponse(response.data || response);
      setFormData({
        responsable:       demandeData.responsable       || "",
        typeetablissement: demandeData.type_etablissement || "",
        institution:       demandeData.institution       || "",
        etablissement:     demandeData.etablissement     || "",
        domaine:           demandeData.domaine           || "",
        mention:           demandeData.mention           || "",
        grade:             demandeData.grade             || "",
        parcours:          demandeData.parcours          || "",
      });
      if (demandeData.fichiers && demandeData.fichiers.length > 0) {
        setUploadedFiles(demandeData.fichiers);
      } else {
        setUploadedFiles([]);
      }
      // ✅ Toujours utiliser le vrai numéro du backend
      if (demandeData.numero_demande) setNumeroDemande(demandeData.numero_demande);
    } catch (error) {
      console.error("Erreur lors du rechargement des données:", error);
    }
  };

  const loadAutoEvaluation = async (evalId) => {
    try {
      const evalResponse = await getAutoEvaluation(evalId);
      const evalData     = evalResponse.data || evalResponse;
      const criteresObj  = {};
      if (evalData.criteres && Array.isArray(evalData.criteres)) {
        evalData.criteres.forEach((c) => {
          criteresObj[c.critere_id] = { note: c.note || 0, appreciation: c.appreciation, fichiers: c.fichiers || [] };
        });
      }
      setAutoEvaluationResult({
        totalNotes:       evalData.total_notes      || 0,
        scorePourcentage: evalData.score_pourcentage || 0,
        timestamp:        evalData.created_at,
        id:               evalData.id,
        formData:         { criteres: criteresObj },
      });
      setCriteresDetails(criteresObj);
      setHasCompleteEvaluation(true);
      calculateScores(criteresObj);
    } catch (error) {
      console.error("Erreur lors du chargement de l'auto-évaluation:", error);
    }
  };

  const loadLatestAutoEvaluation = async () => {
    try {
      const evaluations = await getMyAutoEvaluations();
      const list = Array.isArray(evaluations) ? evaluations : (evaluations?.data ?? []);
      if (list.length > 0) {
        const completeEval = list.find((e) => e.is_complete === true);
        if (completeEval) {
          await loadAutoEvaluation(completeEval.id);
          setAutoEvaluationId(completeEval.id);
          return true;
        } else {
          setHasCompleteEvaluation(false);
          toast.warning("Vous n'avez pas encore d'auto-évaluation complète. Veuillez d'abord compléter les 92 critères.");
        }
      } else {
        setHasCompleteEvaluation(false);
        toast.warning("Aucune auto-évaluation trouvée. Veuillez d'abord compléter l'auto-évaluation.");
      }
    } catch (error) {
      setHasCompleteEvaluation(false);
      console.error("Erreur lors du chargement de l'auto-évaluation:", error);
      toast.error("Erreur lors du chargement de l'auto-évaluation");
    }
    return false;
  };

  const loadExistingDemandes = async () => {
    if (demandeId) return;
    try {
      const demandes = await getMyDemandes();
      const list = Array.isArray(demandes) ? demandes : (demandes?.data ?? []);
      if (list.length > 0) {
        // ✅ FIX : chercher uniquement les brouillons — ignorer rejeté/ajourné
        // pour permettre une nouvelle demande après rejet ou ajournement
        const brouillonDemande = list.find(
          (d) => d.statut === STATUT_DEMANDE.BROUILLON
        );

        if (brouillonDemande) {
          const demandeDetails = await getDemande(brouillonDemande.id);
          const demandeData    = formatDemandeResponse(demandeDetails.data || demandeDetails);
          setFormData({
            responsable:       demandeData.responsable       || "",
            typeetablissement: demandeData.type_etablissement || "",
            institution:       demandeData.institution       || "",
            etablissement:     demandeData.etablissement     || "",
            domaine:           demandeData.domaine           || "",
            mention:           demandeData.mention           || "",
            grade:             demandeData.grade             || "",
            parcours:          demandeData.parcours          || "",
          });
          if (demandeData.fichiers && demandeData.fichiers.length > 0) {
            setUploadedFiles(demandeData.fichiers);
          }
          setCreatedDemandeId(demandeData.id);
          // ✅ Vrai numéro du backend
          setNumeroDemande(demandeData.numero_demande || "");
          toast.info("Demande en brouillon chargée");
        }
        // Si demande rejetée/ajournée → on ne charge rien, formulaire vierge
        // pour permettre une nouvelle soumission
      }
    } catch (error) {
      console.error("Erreur lors du chargement des demandes existantes:", error);
    }
  };

  const calculateScores = (criteres) => {
    let formation = 0, gouvernance = 0, recherche = 0;
    Object.entries(criteres).forEach(([id, data]) => {
      const note = parseInt(data.note) || 0;
      const num  = parseInt(id.split("_")[1]);
      if (num <= 37)      formation  += note;
      else if (num <= 88) gouvernance += note;
      else                recherche  += note;
    });
    setFormationScore(formation);
    setGouvernanceScore(gouvernance);
    setRechercheScore(recherche);
  };

  // ===========================================================================
  // ACTIONS PRINCIPALES
  // ===========================================================================

  const handleOpenForm = () => {
    if (!hasCompleteEvaluation || !autoEvaluationResult) {
      toast.error("Vous devez d'abord compléter une auto-évaluation des 92 critères.");
      return;
    }
    setShowModal(true);
  };

  const handleOpenRecap = (e) => {
    e.preventDefault();
    if (!hasCompleteEvaluation || !autoEvaluationResult) {
      toast.error("Vous devez d'abord compléter une auto-évaluation des 92 critères.");
      return;
    }
    const dataToValidate = {
      responsable:        formData.responsable,
      type_etablissement: formData.typeetablissement,
      domaine:            formData.domaine,
      mention:            formData.mention,
      grade:              formData.grade,
      parcours:           formData.parcours,
      etablissement:      formData.etablissement,
      institution:        formData.institution,
      auto_evaluation_id: autoEvaluationId,
    };
    const validation = validateDemandeData(dataToValidate);
    if (!validation.isValid) {
      const fieldLabels = {
        responsable: "Nom du responsable", type_etablissement: "Type d'établissement",
        domaine: "Domaine", mention: "Mention", grade: "Grade", parcours: "Parcours",
        etablissement: "Établissement", institution: "Institution", auto_evaluation_id: "Auto-évaluation",
      };
      const missingFieldsLabels = validation.missingFields.map((field) => fieldLabels[field] || field);
      toast.error(`Champs obligatoires manquants : ${missingFieldsLabels.join(", ")}`);
      return;
    }
    setShowRecapModal(true);
  };

  const handleSaveInformation = async () => {
    if (!hasCompleteEvaluation || !autoEvaluationResult) {
      toast.error("Vous devez d'abord compléter une auto-évaluation des 92 critères.");
      return;
    }
    if (!autoEvaluationId) {
      toast.error("ID d'auto-évaluation manquant. Veuillez recharger la page.");
      return;
    }

    setIsSubmitting(true);
    try {
      const demandeData = formatDemandeData(formData, autoEvaluationId);
      let currentDemandeId = createdDemandeId;
      let saved;

      // ✅ FIX : si la demande existante est rejetée ou ajournée,
      // on ne la met pas à jour — on en crée une nouvelle
      const demandeEstRejeteeOuAjournee =
        demande &&
        (demande.statut === STATUT_DEMANDE.REJETE ||
         demande.statut === STATUT_DEMANDE.AJOURNE);

      if (currentDemandeId && !demandeEstRejeteeOuAjournee) {
        saved = await updateDemande(currentDemandeId, demandeData);
        toast.success("Demande mise à jour avec succès !");
      } else {
        // Création d'une nouvelle demande (première fois OU après rejet/ajournement)
        saved = await createDemande(demandeData);
        currentDemandeId = saved.id || saved.data?.id;
        setCreatedDemandeId(currentDemandeId);
        toast.success("Demande créée avec succès !");
      }

      // ✅ Utiliser le vrai numéro auto-incrémenté retourné par le backend
      const realNumero = saved.numero_demande || saved.data?.numero_demande;
      if (realNumero) setNumeroDemande(realNumero);

      const newFiles = uploadedFiles.filter((f) => f.isNew && f.file instanceof File);
      if (newFiles.length > 0) {
        const fileObjects = newFiles.map((f) => f.file);
        await uploadDemandeFichiers(currentDemandeId, fileObjects);
        setTimeout(async () => {
          const response    = await getDemande(currentDemandeId);
          const updatedData = formatDemandeResponse(response.data || response);
          setUploadedFiles(updatedData.fichiers || []);
        }, 500);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast.error(error.response?.data?.detail || error.message || "Échec de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!autoEvaluationResult) { toast.error("Aucune auto-évaluation trouvée"); return; }
    const eligible = isEligibleForSubmission();
    if (!eligible) {
      toast.error("Votre établissement n'est pas éligible à la soumission d'une demande d'accréditation");
      return;
    }
    if (!createdDemandeId) {
      toast.error("Veuillez d'abord enregistrer les informations de la demande");
      return;
    }
    setIsSubmitting(true);
    try {
      const newFiles = uploadedFiles.filter((f) => f.isNew && f.file instanceof File);
      if (newFiles.length > 0) {
        const fileObjects = newFiles.map((f) => f.file);
        await uploadDemandeFichiers(createdDemandeId, fileObjects);
      }
      await submitDemande(createdDemandeId);
      setFormSubmitted(true);
      setShowRecapModal(false);
      toast.success(`Demande d'accréditation ${formatNumeroDemande(numeroDemande)} soumise avec succès !`);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error(error.response?.data?.detail || "Erreur lors de la soumission");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===========================================================================
  // COMPOSANTS INTERNES
  // ===========================================================================

  const PolicyCard = ({ title, score, maxScore, criteresCount }) => {
    const pct    = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const colors = getPolicyColorConfig(score, maxScore);
    return (
      <div className={`bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border dark:border-slate-700 ${colors.border}`}>
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{title}</h4>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${colors.badgeBg} ${colors.badgeText}`}>
            {score} / {maxScore} pts
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
          <div className={`h-full transition-all duration-700 ${colors.bar}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
            <span className="text-xs text-gray-600 dark:text-gray-300">{criteresCount} critères</span>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badgeBg} ${colors.badgeText}`}>{pct}%</span>
        </div>
      </div>
    );
  };

  const NiveauxInstitutionnelsTable = ({ currentLevel }) => {
    const levels = [
      { key: "excellent",    color: "bg-green-500",  textColor: "text-green-700",  bgColor: "bg-green-50"  },
      { key: "satisfaisant", color: "bg-blue-500",   textColor: "text-blue-700",   bgColor: "bg-blue-50"   },
      { key: "acceptable",   color: "bg-yellow-500", textColor: "text-yellow-700", bgColor: "bg-yellow-50" },
      { key: "faible",       color: "bg-orange-500", textColor: "text-orange-700", bgColor: "bg-orange-50" },
      { key: "non-conforme", color: "bg-red-500",    textColor: "text-red-700",    bgColor: "bg-red-50"    },
    ];
    const totalScore    = autoEvaluationResult?.totalNotes || 0;
    const currentLevelKey = getLevelFromScore(totalScore);
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-5 md:p-6 mt-6">
        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          Niveau institutionnel
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-200">Niveau</th>
                <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-200">Plage de points</th>
                <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-200">Appréciation globale</th>
                <th className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-200">Statut</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((level) => {
                const config    = levelConfig[level.key];
                const isCurrent = currentLevelKey === level.key;
                return (
                  <tr key={level.key} className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isCurrent ? level.bgColor : ""}`}>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${level.color}`} />
                        <span className={`font-medium ${isCurrent ? level.textColor : "text-slate-700 dark:text-slate-100"}`}>{config.label}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-medium text-slate-800 dark:text-slate-100">{config.range}</td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-300">{config.appreciation}</td>
                    <td className="py-3 px-2">
                      {isCurrent && (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${level.bgColor} ${level.textColor}`}>
                          <CheckCircle className="w-3 h-3" />
                          Niveau actuel
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-blue-700 dark:text-blue-200">
              <span className="font-semibold">Votre établissement : </span>
              Score de {totalScore}/368 - Niveau <span className="font-bold">{levelConfig[currentLevelKey].label}</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const PerformanceCircleChart = ({ score }) => {
    const maxScore = 368;
    const currentLevel = getLevelFromScore(score);
    const thresholds = [
      { value: 0,   label: "0",   color: "#EF4444" },
      { value: 92,  label: "92",  color: "#F97316" },
      { value: 184, label: "184", color: "#EAB308" },
      { value: 257, label: "257", color: "#3B82F6" },
      { value: 312, label: "312", color: "#22C55E" },
      { value: 368, label: "368", color: "#22C55E" },
    ];
    const nonConformeWidth  = (91 / maxScore) * 100;
    const faibleWidth       = ((183 - 92 + 1) / maxScore) * 100;
    const acceptableWidth   = ((256 - 184 + 1) / maxScore) * 100;
    const satisfaisantWidth = ((311 - 257 + 1) / maxScore) * 100;
    const excellentWidth    = ((368 - 312 + 1) / maxScore) * 100;
    const cursorPosition    = (score / maxScore) * 100;
    return (
      <div className="flex flex-col items-center justify-center w-full space-y-6">
        <div className="w-full bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <TrendingUp className="w-7 h-7 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">Score global</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">{score}</span>
                  <span className="text-base text-slate-400 dark:text-slate-500">/ {maxScore}</span>
                </div>
              </div>
            </div>
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold ${levelConfig[currentLevel].badge}`}>
              {React.createElement(levelConfig[currentLevel].icon, { className: "w-4 h-4" })}
              <span>{levelConfig[currentLevel].label}</span>
            </div>
          </div>
          <div className="relative mt-8 mb-10">
            <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <div className="flex h-full w-full">
                <div className="h-full bg-gradient-to-r from-red-500 to-red-400"       style={{ width: `${nonConformeWidth}%`  }} />
                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400" style={{ width: `${faibleWidth}%`       }} />
                <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400" style={{ width: `${acceptableWidth}%`   }} />
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400"     style={{ width: `${satisfaisantWidth}%` }} />
                <div className="h-full bg-gradient-to-r from-green-500 to-green-400"   style={{ width: `${excellentWidth}%`    }} />
              </div>
            </div>
            <div className="relative w-full mt-3">
              {thresholds.map((threshold, index) => {
                const position = (threshold.value / maxScore) * 100;
                return (
                  <div key={index} className="absolute flex flex-col items-center" style={{ left: `${position}%`, transform: "translateX(-50%)" }}>
                    <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-600" />
                    <span className="text-[11px] font-bold mt-1.5 px-1.5 py-0.5 bg-white dark:bg-slate-900 rounded-md border"
                      style={{ color: threshold.color, borderColor: threshold.color }}>
                      {threshold.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="absolute top-0 flex flex-col items-center transition-all duration-1000 ease-out"
              style={{ left: `${cursorPosition}%`, transform: "translateX(-50%)" }}>
              <div className="relative">
                <div className="w-6 h-6 bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-100 rounded-full shadow-lg" />
                <div className="absolute -top-11 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shadow-lg">
                  {score} pts
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3 mt-8">
          {Object.entries(levelConfig).map(([key, config]) => (
            <div key={key} className="flex flex-col items-center p-3 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 ${config.bar} rounded-full mb-2 flex items-center justify-center shadow-sm`}>
                {React.createElement(config.icon, { className: "w-5 h-5 text-white" })}
              </div>
              <span className="text-xs font-bold text-center">{config.label}</span>
              <span className="text-[10px] text-slate-600 font-medium mt-1">{config.range} pts</span>
            </div>
          ))}
        </div>
        <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">Appréciation globale</p>
              <p className="text-sm text-blue-700 dark:text-blue-100 italic leading-relaxed">
                {levelConfig[currentLevel].appreciation}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DetailCriteresSection = () => {
    if (!autoEvaluationResult || !criteresDetails) {
      return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-100 mb-2">Auto-évaluation non disponible</h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-200">Veuillez d'abord compléter l'auto-évaluation des 92 critères.</p>
        </div>
      );
    }
    const totalScore  = autoEvaluationResult.totalNotes || 0;
    const maxScore    = 368;
    const pourcentage = ((totalScore / maxScore) * 100).toFixed(1);
    const niveau      = getLevelFromScore(totalScore);
    const niveauConfig = levelConfig[niveau];
    const eligible    = isEligibleForSubmission();
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Résultat de l'Auto-évaluation</h4>
                <p className="text-sm text-blue-100">92 critères évalués</p>
              </div>
            </div>
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
              {autoEvaluationResult.timestamp
                ? new Date(autoEvaluationResult.timestamp).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
                : "Date inconnue"}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-sm text-blue-100 mb-1">Score global</p>
              <p className="text-3xl font-bold">{totalScore} <span className="text-lg font-normal text-blue-100">/ {maxScore}</span></p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-sm text-blue-100 mb-1">Taux de conformité</p>
              <p className="text-3xl font-bold">{pourcentage}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-sm text-blue-100 mb-1">Niveau</p>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${niveauConfig.bar}`} />
                <p className="text-xl font-bold">{niveauConfig.label}</p>
              </div>
            </div>
          </div>
        </div>
        {!eligible && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-red-800 dark:text-red-100 mb-1">Attention : Non éligible à la soumission</p>
                <p className="text-sm text-red-700 dark:text-red-200">
                  Votre établissement a obtenu un niveau <strong>{niveauConfig.label}</strong>. Vous pouvez enregistrer
                  vos informations en brouillon, mais seuls les niveaux <strong>Acceptable</strong>, <strong>Satisfaisant</strong> et{" "}
                  <strong>Excellent</strong> sont éligibles à la soumission finale.
                </p>
              </div>
            </div>
          </div>
        )}
        <div className={`${niveauConfig.color} border ${niveauConfig.badge} rounded-xl p-5 shadow-sm`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${niveauConfig.badge.split(" ")[0]}`}>
              {React.createElement(niveauConfig.icon, { className: `w-5 h-5 ${niveauConfig.badge.split(" ")[1]}` })}
            </div>
            <div>
              <p className="font-semibold mb-1">Appréciation globale</p>
              <p className="text-sm">{niveauConfig.appreciation}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PolicyCard title="POLITIQUE DE FORMATION"   score={formationScore}   maxScore={148} criteresCount={37} />
          <PolicyCard title="POLITIQUE DE GOUVERNANCE" score={gouvernanceScore} maxScore={204} criteresCount={51} />
          <PolicyCard title="POLITIQUE DE RECHERCHE"   score={rechercheScore}   maxScore={16}  criteresCount={4}  />
        </div>
      </div>
    );
  };

  const FileList = ({ files, onRemove, onDownload }) => {
    if (!files || files.length === 0) {
      return <p className="text-sm text-gray-500 dark:text-gray-400 italic">Aucun fichier joint</p>;
    }
    return (
      <div className="space-y-2">
        {files.map((file) => (
          <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{file.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {file.id && !file.id.startsWith("temp_") && (
                <button onClick={() => onDownload(file)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" title="Télécharger">
                  <Download className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              )}
              <button onClick={() => onRemove(file)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" title="Supprimer">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const RecapModal = () => {
    if (!showRecapModal) return null;
    const eligible     = isEligibleForSubmission();
    const totalScore   = autoEvaluationResult?.totalNotes || 0;
    const niveau       = getLevelFromScore(totalScore);
    const niveauConfig = levelConfig[niveau];
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-5 md:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Validation de votre demande</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Vérifiez les informations avant de soumettre votre demande d'accréditation</p>
                </div>
              </div>
              <button onClick={() => setShowRecapModal(false)} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-5 md:p-6">
            <div className="space-y-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">Informations de la demande</h3>
                  </div>
                  <button onClick={() => { setShowRecapModal(false); handleOpenForm(); }}
                    className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 text-sm font-medium flex items-center gap-1">
                    <Edit className="w-3.5 h-3.5" />
                    Modifier
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    {[
                      { label: "Numéro de demande :", value: formatNumeroDemande(numeroDemande), highlight: true },
                      { label: "Nom du responsable :", value: formData.responsable },
                      { label: "Type d'établissement :", value: formData.typeetablissement },
                      ...(formData.typeetablissement === TYPE_ETABLISSEMENT.PUBLIQUE ? [{ label: "Établissement :", value: formData.etablissement }] : []),
                      ...(formData.typeetablissement === TYPE_ETABLISSEMENT.PRIVEE   ? [{ label: "Institution :",   value: formData.institution   }] : []),
                    ].map(({ label, value, highlight }, i) => (
                      <div key={i} className="flex items-start">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-36">{label}</span>
                        <span className={`text-sm ${highlight ? "font-semibold text-blue-600" : "text-gray-900 dark:text-gray-100"}`}>
                          {value || "Non renseigné"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Domaine :",  value: formData.domaine  },
                      { label: "Mention :",  value: formData.mention  },
                      { label: "Grade :",    value: formData.grade    },
                      { label: "Parcours :", value: formData.parcours },
                    ].map(({ label, value }, i) => (
                      <div key={i} className="flex items-start">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-36">{label}</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">{value || "Non renseigné"}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Fichiers joints ({uploadedFiles.length})</h4>
                    <FileList files={uploadedFiles} onRemove={removeFile} onDownload={handleDownloadFile} />
                  </div>
                )}
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Résultat de l'Auto-évaluation</h3>
                </div>
                <DetailCriteresSection />
              </div>
              <div className={`mt-4 p-4 rounded-lg border ${eligible ? "bg-blue-50 border-blue-200" : "bg-yellow-50 border-yellow-200"}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {eligible ? <Info className="w-5 h-5 text-blue-600" /> : <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${eligible ? "text-blue-800" : "text-yellow-800"}`}>
                      {eligible ? "Prêt à soumettre" : "Enregistrement possible uniquement"}
                    </h4>
                    <p className={`text-sm ${eligible ? "text-blue-700" : "text-yellow-700"}`}>
                      {eligible
                        ? "Votre demande est éligible à la soumission. En soumettant cette demande, vous certifiez que toutes les informations fournies sont exactes et complètes."
                        : `Votre établissement a obtenu un niveau ${niveauConfig.label}. Vous pouvez enregistrer ces informations en brouillon, mais vous ne pourrez soumettre qu'à partir du niveau Acceptable.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-xl sticky bottom-0">
            <div className="flex flex-col md:flex-row gap-3 justify-end">
              <button onClick={() => setShowRecapModal(false)}
                className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm w-full md:w-auto font-medium">
                Retour
              </button>
              {eligible ? (
                <button onClick={handleConfirmSubmit} disabled={formSubmitted || isSubmitting}
                  className={`px-5 py-2.5 rounded-lg transition-colors text-sm w-full md:w-auto flex items-center justify-center gap-2 font-medium shadow-sm ${!formSubmitted && !isSubmitting ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
                  {isSubmitting ? (
                    <><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>Traitement en cours...</>
                  ) : (
                    <><Send className="w-4 h-4" />{formSubmitted ? "Demande déjà soumise" : "Confirmer et soumettre"}</>
                  )}
                </button>
              ) : (
                <button onClick={() => setShowRecapModal(false)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full md:w-auto font-medium">
                  Enregistrer plus tard
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ===========================================================================
  // RENDU PRINCIPAL
  // ===========================================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <p className="text-gray-600 dark:text-gray-300">Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Version mobile
  if (isMobile && showModal) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <ToastContainer />
        <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 overflow-y-auto">
          <div className="px-5 py-6">
            <div className="flex items-center mb-6">
              <button onClick={() => setShowModal(false)} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white mr-4">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Informations de la Demande</h1>
                {numeroDemande && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Numéro : <strong className="text-blue-600 dark:text-blue-300">{formatNumeroDemande(numeroDemande)}</strong>
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-5">
                {[{ label: "Nom du responsable", name: "responsable", type: "text", placeholder: "Nom du responsable de la demande" }]
                  .map(({ label, name, type, placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{label} <span className="text-red-500">*</span></label>
                    <input type={type} name={name} value={formData[name]} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      placeholder={placeholder} required />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Type d'établissement <span className="text-red-500">*</span></label>
                  <select name="typeetablissement" value={formData.typeetablissement} onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" required>
                    <option value="">-- Sélectionnez un type --</option>
                    <option value={TYPE_ETABLISSEMENT.PRIVEE}>Établissement Privé</option>
                    <option value={TYPE_ETABLISSEMENT.PUBLIQUE}>Établissement Public</option>
                  </select>
                </div>
                {formData.typeetablissement === TYPE_ETABLISSEMENT.PRIVEE && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Institution <span className="text-red-500">*</span></label>
                    <input type="text" name="institution" value={formData.institution} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      placeholder="Nom de l'institution privée" required />
                  </div>
                )}
                {formData.typeetablissement === TYPE_ETABLISSEMENT.PUBLIQUE && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Établissement <span className="text-red-500">*</span></label>
                    <input type="text" name="etablissement" value={formData.etablissement} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      placeholder="Nom de l'établissement public" required />
                  </div>
                )}
                {[
                  { label: "Domaine",  name: "domaine",  placeholder: "Ex: Sciences, Droit, Économie" },
                  { label: "Mention",  name: "mention",  placeholder: "Ex: Informatique, Management"  },
                ].map(({ label, name, placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{label} <span className="text-red-500">*</span></label>
                    <input type="text" name={name} value={formData[name]} onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      placeholder={placeholder} required />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Grade <span className="text-red-500">*</span></label>
                  <select name="grade" value={formData.grade} onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" required>
                    <option value="">-- Sélectionnez un grade --</option>
                    {gradeOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Parcours <span className="text-red-500">*</span></label>
                  <input type="text" name="parcours" value={formData.parcours} onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    placeholder="Ex: Génie Logiciel, Finance" required />
                </div>
              </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-700 p-5">
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-base font-medium">
                  Annuler
                </button>
                <button onClick={handleSaveInformation} disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>Enregistrement...</>
                  ) : (
                    <><Save className="w-4 h-4" />Enregistrer</>
                  )}
                </button>
              </div>
            </div>
          </div>
          <RecapModal />
        </div>
      </div>
    );
  }

  // Version desktop
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-slate-900 dark:text-slate-100">
      <ToastContainer />
      <RecapModal />

      {!isMobile && !showModal ? (
        <>
          <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-5 md:px-6 py-4 md:py-6 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {isEditing ? "Modifier la Demande" : "Créer une Demande"} d'Accréditation
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  {isEditing ? "Modifiez les informations de votre demande" : "Basée sur votre dernière auto-évaluation"}
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-5 md:px-6 py-8 md:py-12">
            <div className="space-y-8 md:space-y-12">
              {hasCompleteEvaluation && autoEvaluationResult ? (
                <>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 md:mb-6">
                      Résultat de votre Auto-évaluation
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
                      <div className="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-700 md:shadow-lg p-6 md:p-8">
                        <PerformanceCircleChart score={autoEvaluationResult?.totalNotes || 0} />
                        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
                          Évaluation du {autoEvaluationResult?.timestamp ? formatDate(autoEvaluationResult.timestamp) : "N/A"}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-700 md:shadow-lg p-5 md:p-6">
                        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 md:mb-6 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                          Évaluation des Politiques
                        </h3>
                        <div className="space-y-4">
                          <PolicyCard title="POLITIQUE DE FORMATION"   score={formationScore}   maxScore={148} criteresCount={37} />
                          <PolicyCard title="POLITIQUE DE GOUVERNANCE" score={gouvernanceScore} maxScore={204} criteresCount={51} />
                          <PolicyCard title="POLITIQUE DE RECHERCHE"   score={rechercheScore}   maxScore={16}  criteresCount={4}  />
                          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                              <span className="font-bold text-blue-800 dark:text-blue-200">TOTAL GÉNÉRAL</span>
                              <span className="text-xl font-bold text-blue-700 dark:text-blue-100">
                                {autoEvaluationResult?.totalNotes || 0}/368 pts
                              </span>
                            </div>
                            <div className="w-full bg-blue-100 dark:bg-blue-900 rounded-full h-2.5 overflow-hidden">
                              <div className="h-full bg-blue-600" style={{ width: `${((autoEvaluationResult?.totalNotes || 0) / 368) * 100}%` }} />
                            </div>
                            <div className="flex justify-end mt-2">
                              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full font-medium">
                                Niveau : {levelConfig[getLevelFromScore(autoEvaluationResult?.totalNotes || 0)].label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <NiveauxInstitutionnelsTable currentLevel={getLevelFromScore(autoEvaluationResult?.totalNotes || 0)} />
                </>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-8 text-center mb-6">
                  <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-100 mb-2">Auto-évaluation requise</h2>
                  <p className="text-lg text-yellow-700 dark:text-yellow-200 mb-6 max-w-2xl mx-auto">
                    Vous devez d'abord compléter une auto-évaluation des 92 critères avant de pouvoir créer une demande d'accréditation.
                  </p>
                  <button onClick={() => (window.location.href = "/dashboard/etablissement/accreditation/auto-evaluation?view=evaluation")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Commencer l'auto-évaluation
                  </button>
                </div>
              )}

              {/* Formulaire de Demande */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 md:mb-6">Formulaire de Demande</h2>
                <div className={`bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl border ${!hasCompleteEvaluation ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50" : "border-slate-200 dark:border-slate-700"} md:shadow-lg p-5 md:p-6 mb-6 md:mb-8`}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">Informations à remplir</h3>
                    {!hasCompleteEvaluation && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Auto-évaluation requise</span>
                    )}
                  </div>
                  {!hasCompleteEvaluation && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-700 dark:text-yellow-200">
                          Le formulaire de demande est désactivé. Vous devez d'abord compléter une auto-évaluation des 92 critères pour pouvoir remplir une demande d'accréditation.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {[
                        { label: "Numéro de demande :", value: numeroDemande ? formatNumeroDemande(numeroDemande) : "Sera généré automatiquement", highlight: true },
                        { label: "Nom du responsable :", value: formData.responsable },
                        { label: "Type d'établissement :", value: formData.typeetablissement },
                        ...(formData.typeetablissement === TYPE_ETABLISSEMENT.PUBLIQUE ? [{ label: "Établissement :", value: formData.etablissement }] : []),
                        ...(formData.typeetablissement === TYPE_ETABLISSEMENT.PRIVEE   ? [{ label: "Institution :",   value: formData.institution   }] : []),
                      ].map(({ label, value, highlight }, i) => (
                        <div key={i} className="flex items-start gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                          <strong className="text-slate-700 dark:text-slate-200 text-sm min-w-[140px]">{label}</strong>
                          <span className={`text-sm ${highlight ? "text-blue-600 dark:text-blue-300 font-semibold" : value ? "text-slate-900 dark:text-slate-100" : "text-gray-400 dark:text-gray-600 italic"}`}>
                            {value || "Non renseigné"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: "Domaine :",  value: formData.domaine  },
                        { label: "Mention :",  value: formData.mention  },
                        { label: "Grade :",    value: formData.grade    },
                        { label: "Parcours :", value: formData.parcours },
                      ].map(({ label, value }, i) => (
                        <div key={i} className="flex items-start gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                          <strong className="text-slate-700 dark:text-slate-200 text-sm min-w-[140px]">{label}</strong>
                          <span className={`text-sm ${value ? "text-slate-900 dark:text-slate-100" : "text-gray-400 dark:text-gray-600 italic"}`}>
                            {value || "Non renseigné"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 md:gap-4 mt-6">
                    <button onClick={handleOpenForm} disabled={!hasCompleteEvaluation}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-lg transition-all font-medium md:shadow-md hover:md:shadow-lg flex items-center justify-center gap-2 text-sm order-2 sm:order-1 ${hasCompleteEvaluation ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                      title={!hasCompleteEvaluation ? "Auto-évaluation requise" : ""}>
                      <Edit className="w-4 h-4" />
                      {isEditing ? "Modifier les informations" : isFormPartiallyFilled() ? "Modifier les informations" : "Remplir les informations"}
                    </button>
                    <button onClick={handleOpenRecap} disabled={formSubmitted || !isFormPartiallyFilled() || !hasCompleteEvaluation}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-lg transition-all font-medium md:shadow-md hover:md:shadow-lg flex items-center justify-center gap-2 text-sm order-1 sm:order-2 ${hasCompleteEvaluation && isFormPartiallyFilled() && !formSubmitted ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                      title={!hasCompleteEvaluation ? "Auto-évaluation requise" : !isFormPartiallyFilled() ? "Formulaire incomplet" : ""}>
                      <Eye className="w-4 h-4" />
                      {formSubmitted ? "Demande Soumise" : "Afficher le récapitulatif"}
                    </button>
                  </div>
                  {!hasCompleteEvaluation && isFormPartiallyFilled() && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 text-center mt-3">
                      ⚠️ Les informations saisies ne pourront pas être sauvegardées tant que l'auto-évaluation n'est pas complétée.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* Modal d'édition (desktop) */}
      {showModal && !isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 md:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {isEditing ? "Modifier la Demande" : "Informations de la Demande"}
                  </h2>
                  {numeroDemande && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      Numéro de demande : <strong className="text-blue-600 dark:text-blue-300">{formatNumeroDemande(numeroDemande)}</strong>
                    </p>
                  )}
                </div>
                <button onClick={() => setShowModal(false)} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-5 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Nom du responsable <span className="text-red-500">*</span></label>
                  <input type="text" name="responsable" value={formData.responsable} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    placeholder="Nom du responsable" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Type d'établissement <span className="text-red-500">*</span></label>
                  <select name="typeetablissement" value={formData.typeetablissement} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" required>
                    <option value="">-- Sélectionnez --</option>
                    <option value={TYPE_ETABLISSEMENT.PRIVEE}>Établissement Privé</option>
                    <option value={TYPE_ETABLISSEMENT.PUBLIQUE}>Établissement Public</option>
                  </select>
                </div>
                {formData.typeetablissement === TYPE_ETABLISSEMENT.PRIVEE && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Institution <span className="text-red-500">*</span></label>
                    <input type="text" name="institution" value={formData.institution} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      placeholder="Nom de l'institution" required />
                  </div>
                )}
                {formData.typeetablissement === TYPE_ETABLISSEMENT.PUBLIQUE && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Établissement <span className="text-red-500">*</span></label>
                    <input type="text" name="etablissement" value={formData.etablissement} onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      placeholder="Nom de l'établissement" required />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Domaine <span className="text-red-500">*</span></label>
                  <input type="text" name="domaine" value={formData.domaine} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    placeholder="Ex: Sciences" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Mention <span className="text-red-500">*</span></label>
                  <input type="text" name="mention" value={formData.mention} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    placeholder="Ex: Informatique" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Grade <span className="text-red-500">*</span></label>
                  <select name="grade" value={formData.grade} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" required>
                    <option value="">-- Sélectionnez --</option>
                    {gradeOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Parcours <span className="text-red-500">*</span></label>
                  <input type="text" name="parcours" value={formData.parcours} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    placeholder="Ex: Génie Logiciel" required />
                </div>
              </div>
            </div>
            <div className="p-5 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-xl">
              <div className="flex flex-col md:flex-row gap-3 justify-end">
                <button onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm w-full md:w-auto">
                  Annuler
                </button>
                <button onClick={handleSaveInformation} disabled={isSubmitting}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full md:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>Enregistrement...</>
                  ) : (
                    <><Save className="w-4 h-4" />{isEditing ? "Mettre à jour" : "Enregistrer"}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreerDemandeAccreditation;
