import React, { useState, useEffect } from "react";
import {
  Calendar,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Send,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Star,
  Upload,
  X,
  Info,
  ArrowLeft,
  Edit,
  Save,
  Eye,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreerDemandeAccreditation = () => {
  // État pour gérer les fichiers uploadés
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showRecapModal, setShowRecapModal] = useState(false);
  const [numeroDemande, setNumeroDemande] = useState("");
  const [demandeCount, setDemandeCount] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    responsable: "",
    type_etablissement: "",
    institution: "",
    etablissement: "",
    domaine: "",
    mention: "",
    grade: "",
    parcours: "",
  });
  
  // État pour stocker les résultats de l'auto-évaluation
  const [autoEvaluationResult, setAutoEvaluationResult] = useState(null);
  const [evaluationCriteres, setEvaluationCriteres] = useState([]);
  const [criteresDetails, setCriteresDetails] = useState({});

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Options pour le grade
  const gradeOptions = [
    { value: "DU", label: "DU" },
    { value: "DTS", label: "DTS" },
    { value: "LICENCE", label: "LICENCE" },
    { value: "MASTER", label: "MASTER" },
    { value: "DOCTORAT", label: "DOCTORAT" },
  ];

  // Données de la dernière auto-évaluation
  const lastEvaluation = {
    date: "2024-02-05",
    level: "satisfaisant",
    score: 268,
    totalPoints: 368,
    policies: [
      {
        name: "POLITIQUE DE FORMATION",
        totalScore: 68,
        maxScore: 148,
        level: "faible",
      },
      {
        name: "POLITIQUE DE GOUVERNANCE",
        totalScore: 184,
        maxScore: 204,
        level: "acceptable",
      },
      {
        name: "POLITIQUE DE RECHERCHE",
        totalScore: 16,
        maxScore: 16,
        level: "excellent",
      },
    ],
  };

  // Charger les résultats de l'auto-évaluation depuis localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const currentUserId = storedUser?.id;
    
    if (currentUserId) {
      const savedResult = localStorage.getItem(`auto_evaluation_result_${currentUserId}`);
      if (savedResult) {
        try {
          const result = JSON.parse(savedResult);
          setAutoEvaluationResult(result);
          
          // Extraire les critères pour le récapitulatif
          if (result.formData?.criteres) {
            setCriteresDetails(result.formData.criteres);
            
            const criteresList = Object.entries(result.formData.criteres).map(([id, data]) => ({
              id,
              note: parseInt(data.note) || 0,
              appreciation: data.appreciation,
              fichiers: data.fichiers || 0
            }));
            setEvaluationCriteres(criteresList);
          }
        } catch (error) {
          console.error("Erreur lors du chargement de l'auto-évaluation:", error);
        }
      }
    }
  }, []);

  // Mapping des niveaux de performance
  const levelConfig = {
    "non-conforme": {
      color: "bg-red-50 border-red-200",
      badge: "bg-red-100 text-red-800",
      bar: "bg-red-500",
      bgCircle: "#FEE2E2",
      circleColor: "#EF4444",
      icon: AlertTriangle,
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
      bgCircle: "#FEF3C7",
      circleColor: "#F97316",
      icon: Zap,
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
      bgCircle: "#FEF9C3",
      circleColor: "#EAB308",
      icon: CheckCircle2,
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
      bgCircle: "#DBEAFE",
      circleColor: "#3B82F6",
      icon: CheckCircle2,
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
      bgCircle: "#DCFCE7",
      circleColor: "#22C55E",
      icon: Star,
      label: "Excellent",
      range: "312 – 368",
      appreciation: "Très haute qualité, bonnes pratiques institutionnalisées",
      min: 312,
      max: 368,
    },
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fonction pour déterminer le niveau en fonction du score
  const getLevelFromScore = (score) => {
    if (score < 92) return "non-conforme";
    if (score >= 92 && score <= 183) return "faible";
    if (score >= 184 && score <= 256) return "acceptable";
    if (score >= 257 && score <= 311) return "satisfaisant";
    if (score >= 312 && score <= 368) return "excellent";
    return "excellent";
  };

  // Vérifier si le résultat est éligible pour soumission
  const isEligibleForSubmission = () => {
    if (!autoEvaluationResult) return false;
    const totalScore = autoEvaluationResult.totalNotes || 0;
    const niveau = getLevelFromScore(totalScore);
    return niveau !== "non-conforme" && niveau !== "faible";
  };

  // Générer un numéro de demande automatique avec auto-incrément
  const generateNumeroDemande = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const increment = String(demandeCount).padStart(4, "0");
    return `ACC-${year}${month}-${increment}`;
  };

  useEffect(() => {
    const savedCount = localStorage.getItem("demandeAccreditationCount");
    const initialCount = savedCount ? parseInt(savedCount) : 1;
    setDemandeCount(initialCount);
    setNumeroDemande(generateNumeroDemande());

    const submitted = localStorage.getItem("formSubmitted");
    if (submitted === "true") {
      setFormSubmitted(true);
    }

    const savedFormData = localStorage.getItem("formDataAccreditation");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    if (Object.values(formData).some((value) => value && value.trim() !== "")) {
      localStorage.setItem("formDataAccreditation", JSON.stringify(formData));
    }
  }, [formData]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      file: file,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    toast.success(`${files.length} fichier(s) ajouté(s) avec succès`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
    toast.info("Fichier supprimé", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "type_etablissement") {
      setFormData({
        ...formData,
        [name]: value,
        institution: value === "Privée" ? formData.institution : "",
        etablissement: value === "Publique" ? formData.etablissement : "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleOpenRecap = (e) => {
    e.preventDefault();
    
    // Vérifier les champs obligatoires
    const requiredFields = [
      "responsable",
      "type_etablissement",
      "domaine",
      "mention",
      "grade",
      "parcours",
    ];

    if (formData.type_etablissement === "Publique") {
      requiredFields.push("etablissement");
    } else if (formData.type_etablissement === "Privée") {
      requiredFields.push("institution");
    }

    const missingFields = [];
    for (const field of requiredFields) {
      if (!formData[field]) {
        const fieldLabels = {
          responsable: "Nom du responsable",
          type_etablissement: "Type d'établissement",
          institution: "Institution",
          etablissement: "Établissement",
          domaine: "Domaine",
          mention: "Mention",
          grade: "Grade",
          parcours: "Parcours",
        };
        missingFields.push(fieldLabels[field] || field);
      }
    }

    if (missingFields.length > 0) {
      toast.error(
        `Champs obligatoires manquants : ${missingFields.join(", ")}`,
        {
          position: "top-right",
          autoClose: 5000,
        },
      );
      return;
    }

    // Ouvrir le modal de récapitulatif
    setShowRecapModal(true);
  };

  const handleConfirmSubmit = () => {
    const newCount = demandeCount + 1;
    setDemandeCount(newCount);
    localStorage.setItem("demandeAccreditationCount", newCount.toString());

    setFormSubmitted(true);
    localStorage.setItem("formSubmitted", "true");
    
    setShowRecapModal(false);
    
    toast.success("Demande d'accréditation soumise avec succès !", {
      position: "top-right",
      autoClose: 5000,
    });
  };

  const handleSaveInformation = () => {
    const requiredFields = [
      "responsable",
      "type_etablissement",
      "domaine",
      "mention",
      "grade",
      "parcours",
    ];

    if (formData.type_etablissement === "Publique") {
      requiredFields.push("etablissement");
    } else if (formData.type_etablissement === "Privée") {
      requiredFields.push("institution");
    }

    const missingFields = [];
    for (const field of requiredFields) {
      if (!formData[field]) {
        const fieldLabels = {
          responsable: "Nom du responsable",
          type_etablissement: "Type d'établissement",
          institution: "Institution",
          etablissement: "Établissement",
          domaine: "Domaine",
          mention: "Mention",
          grade: "Grade",
          parcours: "Parcours",
        };
        missingFields.push(fieldLabels[field] || field);
      }
    }

    if (missingFields.length > 0) {
      toast.error(
        `Champs obligatoires manquants : ${missingFields.join(", ")}`,
        {
          position: "top-center",
          autoClose: 5000,
        },
      );
      return;
    }

    setShowModal(false);
    toast.success("Informations enregistrées avec succès !", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleOpenForm = () => {
    setShowModal(true);
  };

  const isFormPartiallyFilled = () => {
    const filledFields = Object.values(formData).filter(
      (value) => value && value.trim() !== "",
    ).length;
    return filledFields > 0;
  };

  // COMPOSANT TABLEAU DES NIVEAUX INSTITUTIONNELS
  const NiveauxInstitutionnelsTable = ({ currentLevel }) => {
    const levels = [
      { key: "excellent", color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50" },
      { key: "satisfaisant", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50" },
      { key: "acceptable", color: "bg-yellow-500", textColor: "text-yellow-700", bgColor: "bg-yellow-50" },
      { key: "faible", color: "bg-orange-500", textColor: "text-orange-700", bgColor: "bg-orange-50" },
      { key: "non-conforme", color: "bg-red-500", textColor: "text-red-700", bgColor: "bg-red-50" },
    ];

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-5 md:p-6 mt-6">
        <h3 className="text-base md:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          Niveau institutionnel
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-2 font-semibold text-slate-700">Niveau</th>
                <th className="text-left py-3 px-2 font-semibold text-slate-700">Plage de points</th>
                <th className="text-left py-3 px-2 font-semibold text-slate-700">Appréciation globale</th>
                <th className="text-left py-3 px-2 font-semibold text-slate-700">Statut</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((level) => {
                const config = levelConfig[level.key];
                const isCurrent = currentLevel === level.key;
                return (
                  <tr 
                    key={level.key} 
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                      isCurrent ? `${level.bgColor}` : ''
                    }`}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                        <span className={`font-medium ${isCurrent ? level.textColor : 'text-slate-700'}`}>
                          {config.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-medium">{config.range}</td>
                    <td className="py-3 px-2 text-slate-600">{config.appreciation}</td>
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
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-blue-700">
              <span className="font-semibold">Votre établissement : </span>
              Score de {lastEvaluation.score}/368 - Niveau <span className="font-bold">{levelConfig[getLevelFromScore(lastEvaluation.score)].label}</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  // COMPOSANT KPI LINÉAIRE
  const PerformanceCircleChart = ({ score, level }) => {
    const maxScore = 368;
    const currentLevel = getLevelFromScore(score);
    
    const thresholds = [
      { value: 0, label: "0", color: "#EF4444" },
      { value: 92, label: "92", color: "#F97316" },
      { value: 184, label: "184", color: "#EAB308" },
      { value: 257, label: "257", color: "#3B82F6" },
      { value: 312, label: "312", color: "#22C55E" },
      { value: 368, label: "368", color: "#22C55E" }
    ];

    const nonConformeWidth = (91 / maxScore) * 100;
    const faibleWidth = ((183 - 92 + 1) / maxScore) * 100;
    const acceptableWidth = ((256 - 184 + 1) / maxScore) * 100;
    const satisfaisantWidth = ((311 - 257 + 1) / maxScore) * 100;
    const excellentWidth = ((368 - 312 + 1) / maxScore) * 100;
    const cursorPosition = (score / maxScore) * 100;

    return (
      <div className="flex flex-col items-center justify-center w-full space-y-6">
        <div className="w-full bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <TrendingUp className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Score global</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">{score}</span>
                  <span className="text-base text-slate-400">/ {maxScore}</span>
                </div>
              </div>
            </div>
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold ${levelConfig[currentLevel].badge}`}>
              {React.createElement(levelConfig[currentLevel].icon, { className: "w-4 h-4" })}
              <span>{levelConfig[currentLevel].label}</span>
            </div>
          </div>

          <div className="relative mt-8 mb-10">
            <div className="h-5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div className="flex h-full w-full">
                <div className="h-full bg-gradient-to-r from-red-500 to-red-400" style={{ width: `${nonConformeWidth}%` }} />
                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400" style={{ width: `${faibleWidth}%` }} />
                <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400" style={{ width: `${acceptableWidth}%` }} />
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: `${satisfaisantWidth}%` }} />
                <div className="h-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: `${excellentWidth}%` }} />
              </div>
            </div>

            <div className="relative w-full mt-3">
              {thresholds.map((threshold, index) => {
                const position = (threshold.value / maxScore) * 100;
                return (
                  <div 
                    key={index}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="w-0.5 h-4 bg-slate-300"></div>
                    <span className="text-[11px] font-bold mt-1.5 px-1.5 py-0.5 bg-white rounded-md border" 
                      style={{ color: threshold.color, borderColor: threshold.color }}>
                      {threshold.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div 
              className="absolute top-0 flex flex-col items-center transition-all duration-1000 ease-out"
              style={{ left: `${cursorPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="relative">
                <div className="w-6 h-6 bg-white border-4 border-slate-900 rounded-full shadow-lg"></div>
                <div className="absolute -top-11 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shadow-lg">
                  {score} pts
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3 mt-8">
            <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-red-200 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-red-500 rounded-full mb-2 flex items-center justify-center shadow-sm">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold text-red-700 text-center">Non conforme</span>
              <span className="text-[10px] text-red-600 font-medium mt-1">0-91 pts</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-orange-200 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-orange-500 rounded-full mb-2 flex items-center justify-center shadow-sm">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold text-orange-700 text-center">Faible</span>
              <span className="text-[10px] text-orange-600 font-medium mt-1">92-183 pts</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-yellow-200 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-yellow-500 rounded-full mb-2 flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold text-yellow-700 text-center">Acceptable</span>
              <span className="text-[10px] text-yellow-600 font-medium mt-1">184-256 pts</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-500 rounded-full mb-2 flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold text-blue-700 text-center">Satisfaisant</span>
              <span className="text-[10px] text-blue-600 font-medium mt-1">257-311 pts</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-green-200 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-green-500 rounded-full mb-2 flex items-center justify-center shadow-sm">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold text-green-700 text-center">Excellent</span>
              <span className="text-[10px] text-green-600 font-medium mt-1">312-368 pts</span>
            </div>
          </div>

          <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">Appréciation globale</p>
                <p className="text-sm text-blue-700 italic leading-relaxed">
                  "{levelConfig[currentLevel].appreciation}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // COMPOSANT DÉTAIL DES CRITÈRES - 92 CRITÈRES
  const DetailCriteresSection = () => {
    if (!autoEvaluationResult || !criteresDetails) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-yellow-800 mb-2">Auto-évaluation non disponible</h4>
          <p className="text-sm text-yellow-700">
            Veuillez d'abord compléter l'auto-évaluation des 92 critères.
          </p>
        </div>
      );
    }

    const totalScore = autoEvaluationResult.totalNotes || 0;
    const maxScore = 368;
    const pourcentage = ((totalScore / maxScore) * 100).toFixed(1);
    const niveau = getLevelFromScore(totalScore);
    const niveauConfig = levelConfig[niveau];
    const eligible = isEligibleForSubmission();
    
    // Calcul des scores par politique
    const formationCriteres = Object.entries(criteresDetails).filter(([id]) => 
      id.includes('critere_') && parseInt(id.split('_')[1]) <= 37
    );
    const gouvernanceCriteres = Object.entries(criteresDetails).filter(([id]) => 
      id.includes('critere_') && parseInt(id.split('_')[1]) >= 38 && parseInt(id.split('_')[1]) <= 88
    );
    const rechercheCriteres = Object.entries(criteresDetails).filter(([id]) => 
      id.includes('critere_') && parseInt(id.split('_')[1]) >= 89
    );

    const formationScore = formationCriteres.reduce((acc, [_, data]) => acc + (parseInt(data.note) || 0), 0);
    const gouvernanceScore = gouvernanceCriteres.reduce((acc, [_, data]) => acc + (parseInt(data.note) || 0), 0);
    const rechercheScore = rechercheCriteres.reduce((acc, [_, data]) => acc + (parseInt(data.note) || 0), 0);

    return (
      <div className="space-y-6">
        {/* En-tête avec score global - Style élégant */}
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
              {new Date(autoEvaluationResult.timestamp).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
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
                <div className={`w-3 h-3 rounded-full ${niveauConfig.bar}`}></div>
                <p className="text-xl font-bold">{niveauConfig.label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message d'inéligibilité si niveau faible ou non conforme */}
        {!eligible && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-red-800 mb-1">Demande non éligible</p>
                <p className="text-sm text-red-700">
                  Votre établissement a obtenu un niveau <strong>"{niveauConfig.label}"</strong>. 
                  Seuls les niveaux <strong>Acceptable</strong>, <strong>Satisfaisant</strong> et <strong>Excellent</strong> sont éligibles à la soumission d'une demande d'accréditation.
                </p>
                <p className="text-sm text-red-700 mt-2">
                  Veuillez améliorer votre score via l'auto-évaluation avant de soumettre votre demande.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Appréciation - Style carte élégante */}
        <div className={`${niveauConfig.color} border ${niveauConfig.badge} rounded-xl p-5 shadow-sm`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${niveauConfig.badge.split(' ')[0]}`}>
              {React.createElement(niveauConfig.icon, { className: `w-5 h-5 ${niveauConfig.badge.split(' ')[1]}` })}
            </div>
            <div>
              <p className="font-semibold mb-1">Appréciation globale</p>
              <p className="text-sm">{niveauConfig.appreciation}</p>
            </div>
          </div>
        </div>

        {/* Scores par politique - Style cartes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h5 className="font-semibold text-gray-900 text-sm">POLITIQUE DE FORMATION</h5>
              <span className={`text-xs px-2 py-1 rounded-full ${levelConfig[getLevelFromScore(formationScore)].badge}`}>
                {levelConfig[getLevelFromScore(formationScore)].label}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">Score</span>
              <span className="text-sm font-bold">{formationScore}/148</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
              <div
                className={`h-2.5 rounded-full ${levelConfig[getLevelFromScore(formationScore)].bar}`}
                style={{ width: `${(formationScore / 148) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${levelConfig[getLevelFromScore(formationScore)].bar}`}></div>
              <span className="text-xs text-gray-600">{formationCriteres.length} critères</span>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h5 className="font-semibold text-gray-900 text-sm">POLITIQUE DE GOUVERNANCE</h5>
              <span className={`text-xs px-2 py-1 rounded-full ${levelConfig[getLevelFromScore(gouvernanceScore)].badge}`}>
                {levelConfig[getLevelFromScore(gouvernanceScore)].label}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">Score</span>
              <span className="text-sm font-bold">{gouvernanceScore}/204</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
              <div
                className={`h-2.5 rounded-full ${levelConfig[getLevelFromScore(gouvernanceScore)].bar}`}
                style={{ width: `${(gouvernanceScore / 204) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${levelConfig[getLevelFromScore(gouvernanceScore)].bar}`}></div>
              <span className="text-xs text-gray-600">{gouvernanceCriteres.length} critères</span>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h5 className="font-semibold text-gray-900 text-sm">POLITIQUE DE RECHERCHE</h5>
              <span className={`text-xs px-2 py-1 rounded-full ${levelConfig[getLevelFromScore(rechercheScore)].badge}`}>
                {levelConfig[getLevelFromScore(rechercheScore)].label}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">Score</span>
              <span className="text-sm font-bold">{rechercheScore}/16</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
              <div
                className={`h-2.5 rounded-full ${levelConfig[getLevelFromScore(rechercheScore)].bar}`}
                style={{ width: `${(rechercheScore / 16) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${levelConfig[getLevelFromScore(rechercheScore)].bar}`}></div>
              <span className="text-xs text-gray-600">{rechercheCriteres.length} critères</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // MODAL DE RÉCAPITULATIF AVANT SOUMISSION - STYLE ÉLÉGANT
  const RecapModal = () => {
    if (!showRecapModal) return null;
    
    const eligible = isEligibleForSubmission();
    const totalScore = autoEvaluationResult?.totalNotes || 0;
    const niveau = getLevelFromScore(totalScore);
    const niveauConfig = levelConfig[niveau];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* En-tête du modal */}
          <div className="p-5 md:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Validation de votre demande
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Vérifiez les informations avant de soumettre votre demande d'accréditation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRecapModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Contenu du modal */}
          <div className="p-5 md:p-6">
            <div className="space-y-6">
              {/* Section 1: Informations de la demande - 2 colonnes */}
              <div className="border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">
                      Informations de la demande
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowRecapModal(false);
                      handleOpenForm();
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Modifier
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-gray-600 w-36">Numéro de demande :</span>
                      <span className="text-sm font-semibold text-blue-600">{numeroDemande || "ACC-202602-0001"}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-gray-600 w-36">Nom du responsable :</span>
                      <span className="text-sm text-gray-900">{formData.responsable || "John Saina"}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-gray-600 w-36">Type d'établissement :</span>
                      <span className="text-sm text-gray-900">{formData.type_etablissement || "Publique"}</span>
                    </div>
                    {formData.type_etablissement === "Publique" && (
                      <div className="flex items-start">
                        <span className="text-sm font-medium text-gray-600 w-36">Établissement :</span>
                        <span className="text-sm text-gray-900">{formData.etablissement || "ENI"}</span>
                      </div>
                    )}
                    {formData.type_etablissement === "Privée" && (
                      <div className="flex items-start">
                        <span className="text-sm font-medium text-gray-600 w-36">Institution :</span>
                        <span className="text-sm text-gray-900">{formData.institution || "Non renseigné"}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-gray-600 w-36">Domaine :</span>
                      <span className="text-sm text-gray-900">{formData.domaine || "Informatique"}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-gray-600 w-36">Mention :</span>
                      <span className="text-sm text-gray-900">{formData.mention || "Informatique Appliquée"}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-gray-600 w-36">Grade :</span>
                      <span className="text-sm text-gray-900">{formData.grade || "DOCTORAT"}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-gray-600 w-36">Parcours :</span>
                      <span className="text-sm text-gray-900">{formData.parcours || "Management des Organisations"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Résultat de l'auto-évaluation - 92 critères */}
              <div className="border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">
                    Résultat de l'Auto-évaluation
                  </h3>
                </div>
                <DetailCriteresSection />
              </div>

              {/* Section 3: Documents fournis - Version simplifiée */}
              <div className="border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">
                    Documents fournis
                  </h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${uploadedFiles.length > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
                      <span className="text-sm">Documents complémentaires</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      uploadedFiles.length > 0 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {uploadedFiles.length > 0 ? "✓ Fourni" : "✗ Non fourni"}
                    </span>
                  </div>
                  
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between py-1 pl-4">
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <span className="text-xs text-gray-500">{file.size}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message de confirmation */}
              <div className={`mt-4 p-4 rounded-lg border ${
                eligible 
                  ? "bg-blue-50 border-blue-200" 
                  : "bg-red-50 border-red-200"
              }`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {eligible ? (
                      <Info className="w-5 h-5 text-blue-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h4 className={`font-medium mb-1 ${
                      eligible ? "text-blue-800" : "text-red-800"
                    }`}>
                      {eligible ? "Confirmation" : "Demande non éligible"}
                    </h4>
                    <p className={`text-sm ${
                      eligible ? "text-blue-700" : "text-red-700"
                    }`}>
                      {eligible 
                        ? "En soumettant cette demande, vous certifiez que toutes les informations fournies sont exactes et complètes. Votre demande sera traitée par la commission d'accréditation dans les plus brefs délais."
                        : `Votre établissement a obtenu un niveau "${niveauConfig.label}". Seuls les niveaux Acceptable, Satisfaisant et Excellent sont éligibles à la soumission d'une demande d'accréditation. Veuillez améliorer votre score via l'auto-évaluation.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pied du modal */}
          <div className="p-5 md:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl sticky bottom-0">
            <div className="flex flex-col md:flex-row gap-3 justify-end">
              <button
                onClick={() => setShowRecapModal(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm w-full md:w-auto font-medium"
              >
                Retour
              </button>
              <button
                onClick={handleConfirmSubmit}
                disabled={formSubmitted || !eligible}
                className={`px-5 py-2.5 rounded-lg transition-colors text-sm w-full md:w-auto flex items-center justify-center gap-2 font-medium shadow-sm ${
                  eligible && !formSubmitted
                    ? "bg-green-600 text-white hover:bg-green-700" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                title={!eligible ? "Non éligible - Niveau insuffisant" : ""}
              >
                <Send className="w-4 h-4" />
                {formSubmitted 
                  ? "Demande déjà soumise" 
                  : eligible 
                    ? "Confirmer et soumettre la demande" 
                    : "Non éligible"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Rendu conditionnel pour la version mobile avec modal
  if (isMobile && showModal) {
    return (
      <div className="min-h-screen bg-white">
        <ToastContainer />
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="px-5 py-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Informations de la Demande
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Numéro:{" "}
                  <strong className="text-blue-600">{numeroDemande}</strong>
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du responsable <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="responsable"
                    value={formData.responsable}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                    placeholder="Nom du responsable de la demande"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'établissement <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type_etablissement"
                    value={formData.type_etablissement}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                    required
                  >
                    <option value="">-- Sélectionnez un type --</option>
                    <option value="Privée">Établissement Privé</option>
                    <option value="Publique">Établissement Public</option>
                  </select>
                </div>
                {formData.type_etablissement === "Privée" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                      placeholder="Nom de l'institution privée"
                      required
                    />
                  </div>
                )}
                {formData.type_etablissement === "Publique" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Établissement <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="etablissement"
                      value={formData.etablissement}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                      placeholder="Nom de l'établissement public"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domaine <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="domaine"
                    value={formData.domaine}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                    placeholder="Ex: Sciences, Droit, Économie"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mention <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="mention"
                    value={formData.mention}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                    placeholder="Ex: Informatique, Management"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                    required
                  >
                    <option value="">-- Sélectionnez un grade --</option>
                    {gradeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parcours <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="parcours"
                    value={formData.parcours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                    placeholder="Ex: Génie Logiciel, Finance"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-5">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-base font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveInformation}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
        <RecapModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />
      <RecapModal />

      {/* Header */}
      {!isMobile || !showModal ? (
        <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-5 md:px-6 py-4 md:py-6">
            <div>
              <h1 className="text-lg font-semibold text-slate-900 mb-1">
                Créer une Demande d'Accréditation
              </h1>
              <p className="text-sm text-slate-500">
                Basée sur votre dernière auto-évaluation
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Content - Formulaire en 2 colonnes */}
      {!isMobile || !showModal ? (
        <div className="max-w-7xl mx-auto px-5 md:px-6 py-8 md:py-12">
          <div className="space-y-8 md:space-y-12">
            {/* Résultat de l'Auto-évaluation */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">
                Résultat de votre Auto-évaluation
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
                {/* Graphe de performance */}
                <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 md:shadow-lg p-6 md:p-8">
                  <PerformanceCircleChart
                    score={lastEvaluation.score}
                    level={getLevelFromScore(lastEvaluation.score)}
                  />
                  <p className="text-center text-xs text-slate-500 mt-4">
                    Évaluation du {formatDate(lastEvaluation.date)}
                  </p>
                </div>

                {/* Détails des politiques */}
                <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 md:shadow-lg p-5 md:p-6">
                  <h3 className="text-base md:text-lg font-bold text-slate-900 mb-4 md:mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    Évaluation des Politiques
                  </h3>
                  <div className="space-y-4">
                    {/* Politique de Formation */}
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-slate-800 text-sm">
                          POLITIQUE DE FORMATION
                        </h4>
                        <span className="text-sm font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
                          {lastEvaluation.policies[0].totalScore} pts
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-orange-500"
                          style={{ width: `${(lastEvaluation.policies[0].totalScore / lastEvaluation.policies[0].maxScore) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-600">
                          Score: {lastEvaluation.policies[0].totalScore}/{lastEvaluation.policies[0].maxScore}
                        </span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                          Faible
                        </span>
                      </div>
                    </div>

                    {/* Politique de Gouvernance */}
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-slate-800 text-sm">
                          POLITIQUE DE GOUVERNANCE
                        </h4>
                        <span className="text-sm font-bold text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full">
                          {lastEvaluation.policies[1].totalScore} pts
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-yellow-500"
                          style={{ width: `${(lastEvaluation.policies[1].totalScore / lastEvaluation.policies[1].maxScore) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-600">
                          Score: {lastEvaluation.policies[1].totalScore}/{lastEvaluation.policies[1].maxScore}
                        </span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                          Acceptable
                        </span>
                      </div>
                    </div>

                    {/* Politique de Recherche */}
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-slate-800 text-sm">
                          POLITIQUE DE RECHERCHE
                        </h4>
                        <span className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                          {lastEvaluation.policies[2].totalScore} pts
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${(lastEvaluation.policies[2].totalScore / lastEvaluation.policies[2].maxScore) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-600">
                          Score: {lastEvaluation.policies[2].totalScore}/{lastEvaluation.policies[2].maxScore}
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                          Excellent
                        </span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-blue-800">TOTAL GÉNÉRAL</span>
                        <span className="text-xl font-bold text-blue-700">
                          {lastEvaluation.policies.reduce((acc, policy) => acc + policy.totalScore, 0)} / 368 pts
                        </span>
                      </div>
                      <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${(lastEvaluation.score / 368) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-end mt-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                          Niveau {levelConfig[getLevelFromScore(lastEvaluation.score)].label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* TABLEAU DES NIVEAUX INSTITUTIONNELS */}
              <NiveauxInstitutionnelsTable currentLevel={getLevelFromScore(lastEvaluation.score)} />
            </div>

            {/* Formulaire de demande - EN 2 COLONNES */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">
                Formulaire de Demande
              </h2>

              {/* Section Informations Remplies - EN 2 COLONNES */}
              <div className="bg-white rounded-xl md:rounded-2xl border border-slate-200 md:shadow-lg p-5 md:p-6 mb-6 md:mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base md:text-lg font-bold text-slate-900">
                    Informations Remplies
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 pb-2 border-b border-gray-100">
                      <strong className="text-slate-700 text-sm min-w-[140px]">
                        Numéro de demande:
                      </strong>
                      <span className="text-blue-600 font-semibold text-sm">
                        {numeroDemande}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 pb-2 border-b border-gray-100">
                      <strong className="text-slate-700 text-sm min-w-[140px]">
                        Nom du responsable:
                      </strong>
                      <span className="text-sm">
                        {formData.responsable || "John Saina"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 pb-2 border-b border-gray-100">
                      <strong className="text-slate-700 text-sm min-w-[140px]">
                        Type d'établissement:
                      </strong>
                      <span className="text-sm">
                        {formData.type_etablissement || "Publique"}
                      </span>
                    </div>
                    {formData.type_etablissement === "Publique" && (
                      <div className="flex items-start gap-2 pb-2 border-b border-gray-100">
                        <strong className="text-slate-700 text-sm min-w-[140px]">
                          Établissement:
                        </strong>
                        <span className="text-sm">
                          {formData.etablissement || "ENI"}
                        </span>
                      </div>
                    )}
                    {formData.type_etablissement === "Privée" && (
                      <div className="flex items-start gap-2 pb-2 border-b border-gray-100">
                        <strong className="text-slate-700 text-sm min-w-[140px]">
                          Institution:
                        </strong>
                        <span className="text-sm">
                          {formData.institution || "Non renseigné"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 pb-2 border-b border-gray-100">
                      <strong className="text-slate-700 text-sm min-w-[140px]">
                        Domaine:
                      </strong>
                      <span className="text-sm">
                        {formData.domaine || "Informatique"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 pb-2 border-b border-gray-100">
                      <strong className="text-slate-700 text-sm min-w-[140px]">
                        Mention:
                      </strong>
                      <span className="text-sm">
                        {formData.mention || "Informatique Appliquée"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 pb-2 border-b border-gray-100">
                      <strong className="text-slate-700 text-sm min-w-[140px]">
                        Grade:
                      </strong>
                      <span className="text-sm">
                        {formData.grade || "DOCTORAT"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 pb-2 border-b border-gray-100">
                      <strong className="text-slate-700 text-sm min-w-[140px]">
                        Parcours:
                      </strong>
                      <span className="text-sm">
                        {formData.parcours || "Management des Organisations"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons alignés */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 md:gap-4">
                <button
                  onClick={handleOpenForm}
                  className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium md:shadow-md hover:md:shadow-lg flex items-center justify-center gap-2 text-sm order-2 sm:order-1"
                >
                  <Edit className="w-4 h-4" />
                  {isFormPartiallyFilled() ? "Modifier les informations" : "Remplir les informations"}
                </button>
                <button
                  onClick={handleOpenRecap}
                  disabled={formSubmitted || !isFormPartiallyFilled()}
                  className="w-full sm:w-auto px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium md:shadow-md hover:md:shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                >
                  <Eye className="w-4 h-4" />
                  {formSubmitted ? "Demande Soumise" : "Afficher le récapitulatif"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Modal Desktop */}
      {showModal && !isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 md:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Informations de la Demande
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">
                    Numéro de demande:{" "}
                    <strong className="text-blue-600">{numeroDemande}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-5 md:p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du responsable <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsable"
                      value={formData.responsable}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base"
                      placeholder="Nom du responsable"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type d'établissement <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type_etablissement"
                      value={formData.type_etablissement}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base"
                      required
                    >
                      <option value="">-- Sélectionnez --</option>
                      <option value="Privée">Établissement Privé</option>
                      <option value="Publique">Établissement Public</option>
                    </select>
                  </div>
                  {formData.type_etablissement === "Privée" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institution <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="institution"
                        value={formData.institution}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base"
                        placeholder="Nom de l'institution"
                        required
                      />
                    </div>
                  )}
                  {formData.type_etablissement === "Publique" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Établissement <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="etablissement"
                        value={formData.etablissement}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base"
                        placeholder="Nom de l'établissement"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Domaine <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="domaine"
                      value={formData.domaine}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base"
                      placeholder="Ex: Sciences"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mention <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="mention"
                      value={formData.mention}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base"
                      placeholder="Ex: Informatique"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base"
                      required
                    >
                      <option value="">-- Sélectionnez --</option>
                      {gradeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parcours <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="parcours"
                      value={formData.parcours}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm md:text-base"
                      placeholder="Ex: Génie Logiciel"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 md:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex flex-col md:flex-row gap-3 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm w-full md:w-auto"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveInformation}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full md:w-auto flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
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