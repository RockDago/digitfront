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
} from "lucide-react";

const CreerDemandeAccreditation = () => {
  // État pour gérer les fichiers uploadés
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [numeroDemande, setNumeroDemande] = useState("");
  const [demandeCount, setDemandeCount] = useState(1); // Compteur pour auto-incrément
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

  // Options pour le grade
  const gradeOptions = [
    { value: "DU", label: "DU" },
    { value: "DTS", label: "DTS" },
    { value: "LICENCE", label: "LICENCE" },
    { value: "MASTER", label: "MASTER" },
    { value: "DOCTORAT", label: "DOCTORAT" },
  ];

  // Générer un numéro de demande automatique avec auto-incrément
  const generateNumeroDemande = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const increment = String(demandeCount).padStart(4, '0');
    return `ACC-${year}${month}-${increment}`;
  };

  useEffect(() => {
    // Générer un numéro de demande au chargement
    const savedCount = localStorage.getItem('demandeAccreditationCount');
    const initialCount = savedCount ? parseInt(savedCount) : 1;
    setDemandeCount(initialCount);
    setNumeroDemande(generateNumeroDemande());
  }, []);

  // Données de la dernière auto-évaluation
  const lastEvaluation = {
    date: "2024-02-05",
    level: "excellent",
    score: 92,
    policies: [
      {
        name: "POLITIQUE DE FORMATION",
        totalScore: 95,
        level: "excellent",
      },
      {
        name: "POLITIQUE DE GOUVERNANCE",
        totalScore: 88,
        level: "satisfait",
      },
      {
        name: "POLITIQUE DE RECHERCHE",
        totalScore: 92,
        level: "excellent",
      },
    ],
  };

  // Mapping des niveaux de performance
  const levelConfig = {
    insuffisant: {
      color: "bg-red-50 border-red-200",
      badge: "bg-red-100 text-red-800",
      bar: "bg-red-500",
      bgCircle: "#FEE2E2",
      circleColor: "#EF4444",
      icon: AlertTriangle,
      label: "Insuffisant",
      range: "0-50",
      min: 0,
      max: 50,
    },
    faible: {
      color: "bg-orange-50 border-orange-200",
      badge: "bg-orange-100 text-orange-800",
      bar: "bg-orange-500",
      bgCircle: "#FEF3C7",
      circleColor: "#F97316",
      icon: Zap,
      label: "Faible",
      range: "51-70",
      min: 51,
      max: 70,
    },
    satisfait: {
      color: "bg-blue-50 border-blue-200",
      badge: "bg-blue-100 text-blue-800",
      bar: "bg-blue-500",
      bgCircle: "#DBEAFE",
      circleColor: "#3B82F6",
      icon: CheckCircle2,
      label: "Satisfait",
      range: "71-85",
      min: 71,
      max: 85,
    },
    excellent: {
      color: "bg-green-50 border-green-200",
      badge: "bg-green-100 text-green-800",
      bar: "bg-green-500",
      bgCircle: "#DCFCE7",
      circleColor: "#22C55E",
      icon: Star,
      label: "Excellent",
      range: "86-100",
      min: 86,
      max: 100,
    },
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Gestionnaire d'upload de fichiers
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      file: file,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  // Supprimer un fichier
  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
  };

  // Gestionnaire de changement de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "type_etablissement") {
      // Réinitialiser les champs spécifiques quand on change le type
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

  // Soumettre la demande
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Incrémenter le compteur pour la prochaine demande
    const newCount = demandeCount + 1;
    setDemandeCount(newCount);
    localStorage.setItem('demandeAccreditationCount', newCount.toString());
    
    console.log("Demande soumise:", { ...formData, numero_demande: numeroDemande }, uploadedFiles);
    alert("✅ Demande d'accréditation soumise avec succès !");
    // Logique de soumission ici
  };

  // Fonction pour gérer la soumission de la modal
  const handleModalContinue = () => {
    // Validation des champs obligatoires selon le type
    const requiredFields = ["responsable", "type_etablissement", "domaine", "mention", "grade", "parcours"];
    
    if (formData.type_etablissement === "Publique") {
      requiredFields.push("etablissement");
    } else if (formData.type_etablissement === "Privée") {
      requiredFields.push("institution");
    }

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
        alert(`⚠️ Le champ "${fieldLabels[field] || field}" est obligatoire !`);
        return;
      }
    }

    setShowModal(false);
  };

  // Composant - Graphe en demi-cercle avec aiguille améliorée
  const PerformanceCircleChart = ({ score, level }) => {
    const [arrowRotation, setArrowRotation] = useState(-90);

    useEffect(() => {
      // Animation de l'aiguille après le chargement
      const targetRotation = (score / 100) * 180 - 90;
      const timer = setTimeout(() => {
        setArrowRotation(targetRotation);
      }, 1500);

      return () => clearTimeout(timer);
    }, [score]);

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-80 h-48 mb-6">
          <svg
            viewBox="0 0 280 160"
            className="w-full h-full"
            style={{
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
              animation: "fadeIn 0.6s ease-out",
            }}
          >
            <defs>
              <linearGradient
                id="gradInsuffisant"
                x1="0%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#FCA5A5" />
              </linearGradient>
              <linearGradient
                id="gradFaible"
                x1="0%"
                y1="100%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#FDB17C" />
              </linearGradient>
              <linearGradient
                id="gradSatisfait"
                x1="100%"
                y1="100%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#93C5FD" />
              </linearGradient>
              <linearGradient
                id="gradExcellent"
                x1="100%"
                y1="100%"
                x2="0%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#86EFAC" />
              </linearGradient>
            </defs>

            <path
              d="M 30,140 A 110,110 0 0,1 85,36"
              fill="none"
              stroke="url(#gradInsuffisant)"
              strokeWidth="28"
              strokeLinecap="round"
              opacity="0.95"
              style={{
                animation: "arcAppear 1s ease-out 0.1s both",
              }}
            />

            <path
              d="M 85,36 A 110,110 0 0,1 140,20"
              fill="none"
              stroke="url(#gradFaible)"
              strokeWidth="28"
              strokeLinecap="round"
              opacity="0.95"
              style={{
                animation: "arcAppear 1s ease-out 0.2s both",
              }}
            />

            <path
              d="M 140,20 A 110,110 0 0,1 195,36"
              fill="none"
              stroke="url(#gradSatisfait)"
              strokeWidth="28"
              strokeLinecap="round"
              opacity="0.95"
              style={{
                animation: "arcAppear 1s ease-out 0.3s both",
              }}
            />

            <path
              d="M 195,36 A 110,110 0 0,1 250,140"
              fill="none"
              stroke="url(#gradExcellent)"
              strokeWidth="28"
              strokeLinecap="round"
              opacity="0.95"
              style={{
                animation: "arcAppear 1s ease-out 0.4s both",
              }}
            />

            <line
              x1="30"
              y1="140"
              x2="36"
              y2="134"
              stroke="#999"
              strokeWidth="2"
            />
            <line
              x1="250"
              y1="140"
              x2="244"
              y2="134"
              stroke="#999"
              strokeWidth="2"
            />
            <line
              x1="140"
              y1="20"
              x2="140"
              y2="28"
              stroke="#999"
              strokeWidth="2"
            />
          </svg>

          <div className="absolute bottom-2 left-2">
            <div className="bg-white px-2.5 py-1 rounded-lg shadow-sm border border-red-100">
              <p className="text-[10px] font-semibold text-red-700">0</p>
              <p className="text-[9px] text-red-500 text-center">
                Insuffisant
              </p>
            </div>
          </div>

          <div className="absolute top-8 left-16">
            <div className="bg-white px-2.5 py-1 rounded-lg shadow-sm border border-orange-100">
              <p className="text-[10px] font-semibold text-orange-700">50</p>
              <p className="text-[9px] text-orange-500">Faible</p>
            </div>
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <div className="bg-white px-2.5 py-1 rounded-lg shadow-sm border border-blue-100">
              <p className="text-[10px] font-semibold text-blue-700 text-center">
                70-85
              </p>
              <p className="text-[9px] text-blue-500 text-center">Satisfait</p>
            </div>
          </div>

          <div className="absolute top-8 right-16">
            <div className="bg-white px-2.5 py-1 rounded-lg shadow-sm border border-green-100">
              <p className="text-[10px] font-semibold text-green-700">85+</p>
              <p className="text-[9px] text-green-500">Excellent</p>
            </div>
          </div>

          <div className="absolute bottom-2 right-2">
            <div className="bg-white px-2.5 py-1 rounded-lg shadow-sm border border-green-100">
              <p className="text-[10px] font-semibold text-green-700">100</p>
            </div>
          </div>

          {/* Aiguille améliorée et centrée */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            style={{
              width: "280px",
              height: "160px",
              marginBottom: "20px",
              transformOrigin: "center 140px",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: "0px",
                transform: `translateX(-50%) rotate(${arrowRotation}deg)`,
                transformOrigin: "center bottom",
                transition: "transform 2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                zIndex: 10,
              }}
            >
              <div
                className="relative"
                style={{
                  width: "4px",
                  height: "95px",
                  background: "linear-gradient(to top, #1e293b, #475569)",
                  borderRadius: "2px",
                  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.3)",
                  transformOrigin: "center bottom",
                }}
              >
                <div
                  className="absolute"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "8px solid transparent",
                    borderRight: "8px solid transparent",
                    borderBottom: "12px solid #1e293b",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%) rotate(180deg)",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                  }}
                />
              </div>
            </div>

            {/* Pivot central */}
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
              style={{
                width: "20px",
                height: "20px",
                background: "radial-gradient(circle at center, #475569, #1e293b)",
                borderRadius: "50%",
                border: "4px solid white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                zIndex: 20,
              }}
            />
          </div>
        </div>

        <div className="text-center mt-4">
          <div
            className="text-5xl font-bold bg-gradient-to-br from-slate-700 to-slate-900 bg-clip-text text-transparent mb-3"
            style={{ animation: "scoreAppear 0.8s ease-out 0.5s both" }}
          >
            {score}
          </div>
          <div
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm ${levelConfig[level].badge} shadow-sm`}
            style={{ animation: "badgeAppear 0.6s ease-out 0.8s both" }}
          >
            {React.createElement(levelConfig[level].icon, {
              className: "w-5 h-5",
            })}
            {levelConfig[level].label}
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes arcAppear {
            from {
              opacity: 0;
              stroke-dasharray: 1000;
              stroke-dashoffset: 1000;
            }
            to {
              opacity: 0.95;
              stroke-dasharray: 1000;
              stroke-dashoffset: 0;
            }
          }

          @keyframes scoreAppear {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes badgeAppear {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* Résultat de l'Auto-évaluation */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Résultat de l'Auto-évaluation
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphe de performance */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-8 text-center">
                  Score Global
                </h3>
                <PerformanceCircleChart
                  score={lastEvaluation.score}
                  level={lastEvaluation.level}
                />
                <p className="text-center text-xs text-slate-500 mt-6">
                  Évaluation du {formatDate(lastEvaluation.date)}
                </p>
              </div>

              {/* Détails des politiques */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">
                  Évaluation des Politiques
                </h3>
                <div className="space-y-3">
                  {lastEvaluation.policies.map((policy, idx) => {
                    return (
                      <div
                        key={idx}
                        className="bg-white rounded-lg p-4 border border-blue-200 transition-all hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-slate-900 text-sm">
                            {policy.name}
                          </h4>
                          <span className="text-sm font-bold text-blue-600">
                            {policy.totalScore} pts
                          </span>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden mt-2">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${policy.totalScore}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message d'éligibilité */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-900">
                        Éligible pour l'accréditation
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Votre score de {lastEvaluation.score} répond aux
                        critères requis pour soumettre une demande
                        d'accréditation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de demande */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Formulaire de Demande
            </h2>

            {/* Bouton pour ouvrir la modal */}
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl mb-8 flex items-center gap-2 text-sm"
            >
              📝 Remplir les informations
            </button>

            {/* Affichage des informations remplies */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Informations Remplies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <strong className="text-slate-700">Numéro de demande:</strong>{" "}
                  <span className="text-blue-600 font-semibold">{numeroDemande}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <strong className="text-slate-700">Nom du responsable:</strong>{" "}
                  {formData.responsable || "Non renseigné"}
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <strong className="text-slate-700">Type d'établissement:</strong>{" "}
                  {formData.type_etablissement || "Non renseigné"}
                </div>
                {formData.type_etablissement === "Privée" && formData.institution && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <strong className="text-slate-700">Institution:</strong>{" "}
                    {formData.institution}
                  </div>
                )}
                {formData.type_etablissement === "Publique" && formData.etablissement && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <strong className="text-slate-700">Établissement:</strong>{" "}
                    {formData.etablissement}
                  </div>
                )}
                {formData.domaine && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <strong className="text-slate-700">Domaine:</strong>{" "}
                    {formData.domaine}
                  </div>
                )}
                {formData.mention && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <strong className="text-slate-700">Mention:</strong>{" "}
                    {formData.mention}
                  </div>
                )}
                {formData.grade && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <strong className="text-slate-700">Grade:</strong>{" "}
                    {formData.grade}
                  </div>
                )}
                {formData.parcours && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <strong className="text-slate-700">Parcours:</strong>{" "}
                    {formData.parcours}
                  </div>
                )}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Êtes-vous sûr de vouloir annuler ? Toutes les informations seront perdues.")) {
                    // Réinitialiser le formulaire
                    setFormData({
                      responsable: "",
                      type_etablissement: "",
                      institution: "",
                      etablissement: "",
                      domaine: "",
                      mention: "",
                      grade: "",
                      parcours: "",
                    });
                    setUploadedFiles([]);
                  }
                }}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
                disabled={!formData.responsable || !formData.type_etablissement}
              >
                <Send className="w-4 h-4" />
                Soumettre la Demande
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal informations générales */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Informations Générales
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Numéro de demande: <strong className="text-blue-600">{numeroDemande}</strong>
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du responsable <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsable"
                      value={formData.responsable}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">-- Sélectionnez un type --</option>
                      <option value="Privée">Établissement Privé</option>
                      <option value="Publique">Établissement Public</option>
                    </select>
                  </div>

                  {/* Institution (uniquement pour Privée) */}
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Nom de l'institution privée"
                        required
                      />
                    </div>
                  )}

                  {/* Établissement (uniquement pour Publique) */}
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parcours <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="parcours"
                      value={formData.parcours}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Ex: Génie Logiciel, Finance"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handleModalContinue}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
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