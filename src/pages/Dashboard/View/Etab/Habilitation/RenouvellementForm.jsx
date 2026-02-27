import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import mesupresLogo from "../../../../../assets/images/mesupres-logo.png";

const steps = [
  { id: 1, title: "Présentation de l'institution" },
  { id: 2, title: "Bilan de la formation précédente" },
  { id: 3, title: "Description actualisée de la formation" },
  { id: 4, title: "Ressources humaines et infrastructures" },
  { id: 5, title: "Gouvernance, assurance qualité et pilotage" },
  { id: 6, title: "Performances académiques et insertion professionnelle" },
  { id: 7, title: "Synthèse et conclusion" },
  { id: 8, title: "Récapitulatif" }, 
];

const STORAGE_KEY = "renouvellement_progression";
const AUTO_SAVE_KEY = "renouvellement_autosave";

const RenouvellementForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [pendingProgression, setPendingProgression] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  const [formData, setFormData] = useState({
    institutionName: "",
    institutionSigle: "",
    statutJuridique: "",
    responsableNom: "",
    responsablePrenom: "",
    responsableFonction: "",
    responsableEmail: "",
    responsableTelephone: "",
    arreteReference: "",
    arreteDate: "",
    adresseSiege: "",
    ville: "",
    codePostal: "",
    pays: "Madagascar",
    evolutionInstitutionnelle: "",
    
    resultatsAcademiques: {
      situationInitiale: "",
      situationActuelle: ""
    },
    maquettePedagogique: {
      situationInitiale: "",
      situationActuelle: ""
    },
    ressourcesHumaines: {
      situationInitiale: "",
      situationActuelle: ""
    },
    infrastructures: {
      situationInitiale: "",
      situationActuelle: ""
    },
    gouvernanceQualite: {
      situationInitiale: "",
      situationActuelle: ""
    },
    partenariats: {
      situationInitiale: "",
      situationActuelle: ""
    },
    
    
    domaine: "",
    mention: "",
    grade: "",
    parcours: "",
    responsableParcoursNom: "",
    responsableParcoursPrenom: "",
    responsableParcoursGrade: "",
    responsableParcoursSpecialite: "",
    maquetteActualisee: "",
    innovationsPedagogiques: "",
    orientationFormation: "",
    
    // Ressources humaines et infrastructures
    enseignantsPermanents: {
      situationInitiale: "",
      situationActuelle: ""
    },
    enseignantsVacataires: {
      situationInitiale: "",
      situationActuelle: ""
    },
    personnelAppui: {
      situationInitiale: "",
      situationActuelle: ""
    },
    sallesLaboratoires: {
      situationInitiale: "",
      situationActuelle: ""
    },
    bibliothequeNumerique: {
      situationInitiale: "",
      situationActuelle: ""
    },
    accessibiliteEnergie: {
      situationInitiale: "",
      situationActuelle: ""
    },
    
    // Gouvernance, assurance qualité et pilotage
    conseilPedagogique: {
      situationInitiale: "",
      situationActuelle: ""
    },
    celluleQualite: {
      situationInitiale: "",
      situationActuelle: ""
    },
    suiviEvaluation: {
      situationInitiale: "",
      situationActuelle: ""
    },
    planStrategique: {
      situationInitiale: "",
      situationActuelle: ""
    },
    participationActeurs: {
      situationInitiale: "",
      situationActuelle: ""
    },
    
    // Performances académiques et insertion professionnelle
    tauxReussite: {
      situationInitiale: "",
      situationActuelle: ""
    },
    tauxDiplomation: {
      situationInitiale: "",
      situationActuelle: ""
    },
    tauxInsertion: {
      situationInitiale: "",
      situationActuelle: ""
    },
    satisfaction: {
      situationInitiale: "",
      situationActuelle: ""
    },
    actionsAmelioration: {
      situationInitiale: "",
      situationActuelle: ""
    },
    
    // Synthèse et conclusion
    ressourcesHumainesSyn: {
      forces: "",
      pointsAmeliorer: "",
      actionsPrevues: ""
    },
    infrastructuresSyn: {
      forces: "",
      pointsAmeliorer: "",
      actionsPrevues: ""
    },
    pedagogieSyn: {
      forces: "",
      pointsAmeliorer: "",
      actionsPrevues: ""
    },
    resultatsSyn: {
      forces: "",
      pointsAmeliorer: "",
      actionsPrevues: ""
    },
    gouvernanceQualiteSyn: {
      forces: "",
      pointsAmeliorer: "",
      actionsPrevues: ""
    },
    
    // Fichiers (suppression des annexes obligatoires)
    files: {
      // Section 1
      statuts: [],
      responsableDocs: [],
      arreteHabilitation: [],
      planLocalisation: [],
      lettreDemande: [],
      rapportsOrganigrammes: [],
      
      // Section 2
      preuvesResultats: [],
      preuvesMaquette: [],
      preuvesRessourcesHumaines: [],
      preuvesInfrastructures: [],
      preuvesGouvernance: [],
      preuvesPartenariats: [],
      
      // Section 3
      justificatifsDomaine: [],
      justificatifsParcours: [],
      justificatifsResponsableParcours: [],
      justificatifsMaquette: [],
      justificatifsInnovations: [],
      justificatifsOrientation: [],
      
      // Section 4
      preuvesEnseignantsPermanents: [],
      preuvesEnseignantsVacataires: [],
      preuvesPersonnelAppui: [],
      preuvesSallesLaboratoires: [],
      preuvesBibliothequeNumerique: [],
      preuvesAccessibiliteEnergie: [],
      
      // Section 5
      preuvesConseilPedagogique: [],
      preuvesCelluleQualite: [],
      preuvesSuiviEvaluation: [],
      preuvesPlanStrategique: [],
      preuvesParticipationActeurs: [],
      
      // Section 6
      preuvesTauxReussite: [],
      preuvesTauxDiplomation: [],
      preuvesTauxInsertion: [],
      preuvesSatisfaction: [],
      preuvesActionsAmelioration: []
    }
  });

  // Effet pour le scroll to top
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fonction pour sauvegarder la progression
  const saveProgression = () => {
    try {
      const progressionData = {
        formData,
        currentStep,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressionData));
      setLastSaved(new Date());
      
      // Sauvegarde automatique silencieuse
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(progressionData));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la progression:", error);
    }
  };

  // Fonction pour charger la progression
  const loadProgression = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const progressionData = JSON.parse(savedData);
        const savedTime = new Date(progressionData.timestamp).getTime();
        const currentTime = new Date().getTime();
        const hoursDiff = (currentTime - savedTime) / (1000 * 60 * 60);

        // Conserver la progression si elle date de moins de 24h
        if (hoursDiff < 24) {
          return progressionData;
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la progression:", error);
    }
    return null;
  };

  // Vérifier la progression sauvegardée au chargement
  useEffect(() => {
    const savedProgression = loadProgression();
    
    // Vérifier s'il y a des données non vides dans la progression
    const hasData = savedProgression?.formData && 
      (savedProgression.formData.institutionName || 
       savedProgression.formData.responsableNom ||
       Object.values(savedProgression.formData.files || {}).some(arr => arr.length > 0));

    if (savedProgression && hasData) {
      setPendingProgression(savedProgression);
      setShowResumeModal(true);
    }
  }, []);

  // Sauvegarde automatique à chaque modification
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      // Ne sauvegarder que si des données ont été modifiées
      const hasData = formData.institutionName || 
                      formData.responsableNom ||
                      Object.values(formData.files).some(arr => arr.length > 0);
      
      if (hasData) {
        saveProgression();
      }
    }, 2000); // Sauvegarde 2 secondes après la dernière modification

    return () => clearTimeout(saveTimer);
  }, [formData, currentStep]);

  // Fonction pour restaurer la progression
  const restoreProgression = (progressionData) => {
    setFormData(progressionData.formData);
    setCurrentStep(progressionData.currentStep);
    setShowResumeModal(false);
    toast.success("Progression restaurée avec succès !", {
      position: "top-right",
      autoClose: 4000,
    });
  };

  // Fonction pour démarrer une nouvelle évaluation
  const startNewEvaluation = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(AUTO_SAVE_KEY);
    setFormData({
      ...formData,
      institutionName: "",
      institutionSigle: "",
      statutJuridique: "",
      responsableNom: "",
      responsablePrenom: "",
      responsableFonction: "",
      responsableEmail: "",
      responsableTelephone: "",
      arreteReference: "",
      arreteDate: "",
      adresseSiege: "",
      ville: "",
      codePostal: "",
      evolutionInstitutionnelle: "",
      
      resultatsAcademiques: { situationInitiale: "", situationActuelle: "" },
      maquettePedagogique: { situationInitiale: "", situationActuelle: "" },
      ressourcesHumaines: { situationInitiale: "", situationActuelle: "" },
      infrastructures: { situationInitiale: "", situationActuelle: "" },
      gouvernanceQualite: { situationInitiale: "", situationActuelle: "" },
      partenariats: { situationInitiale: "", situationActuelle: "" },
      
      domaine: "",
      mention: "",
      grade: "",
      parcours: "",
      responsableParcoursNom: "",
      responsableParcoursPrenom: "",
      responsableParcoursGrade: "",
      responsableParcoursSpecialite: "",
      maquetteActualisee: "",
      innovationsPedagogiques: "",
      orientationFormation: "",
      
      enseignantsPermanents: { situationInitiale: "", situationActuelle: "" },
      enseignantsVacataires: { situationInitiale: "", situationActuelle: "" },
      personnelAppui: { situationInitiale: "", situationActuelle: "" },
      sallesLaboratoires: { situationInitiale: "", situationActuelle: "" },
      bibliothequeNumerique: { situationInitiale: "", situationActuelle: "" },
      accessibiliteEnergie: { situationInitiale: "", situationActuelle: "" },
      
      conseilPedagogique: { situationInitiale: "", situationActuelle: "" },
      celluleQualite: { situationInitiale: "", situationActuelle: "" },
      suiviEvaluation: { situationInitiale: "", situationActuelle: "" },
      planStrategique: { situationInitiale: "", situationActuelle: "" },
      participationActeurs: { situationInitiale: "", situationActuelle: "" },
      
      tauxReussite: { situationInitiale: "", situationActuelle: "" },
      tauxDiplomation: { situationInitiale: "", situationActuelle: "" },
      tauxInsertion: { situationInitiale: "", situationActuelle: "" },
      satisfaction: { situationInitiale: "", situationActuelle: "" },
      actionsAmelioration: { situationInitiale: "", situationActuelle: "" },
      
      ressourcesHumainesSyn: { forces: "", pointsAmeliorer: "", actionsPrevues: "" },
      infrastructuresSyn: { forces: "", pointsAmeliorer: "", actionsPrevues: "" },
      pedagogieSyn: { forces: "", pointsAmeliorer: "", actionsPrevues: "" },
      resultatsSyn: { forces: "", pointsAmeliorer: "", actionsPrevues: "" },
      gouvernanceQualiteSyn: { forces: "", pointsAmeliorer: "", actionsPrevues: "" },
      
      files: {
        statuts: [],
        responsableDocs: [],
        arreteHabilitation: [],
        planLocalisation: [],
        lettreDemande: [],
        rapportsOrganigrammes: [],
        preuvesResultats: [],
        preuvesMaquette: [],
        preuvesRessourcesHumaines: [],
        preuvesInfrastructures: [],
        preuvesGouvernance: [],
        preuvesPartenariats: [],
        justificatifsDomaine: [],
        justificatifsParcours: [],
        justificatifsResponsableParcours: [],
        justificatifsMaquette: [],
        justificatifsInnovations: [],
        justificatifsOrientation: [],
        preuvesEnseignantsPermanents: [],
        preuvesEnseignantsVacataires: [],
        preuvesPersonnelAppui: [],
        preuvesSallesLaboratoires: [],
        preuvesBibliothequeNumerique: [],
        preuvesAccessibiliteEnergie: [],
        preuvesConseilPedagogique: [],
        preuvesCelluleQualite: [],
        preuvesSuiviEvaluation: [],
        preuvesPlanStrategique: [],
        preuvesParticipationActeurs: [],
        preuvesTauxReussite: [],
        preuvesTauxDiplomation: [],
        preuvesTauxInsertion: [],
        preuvesSatisfaction: [],
        preuvesActionsAmelioration: []
      }
    });
    setCurrentStep(1);
    setShowResumeModal(false);
    toast.info("Nouvelle demande de renouvellement démarrée", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Modal de reprise moderne
  const ResumeModal = () => {
    if (!pendingProgression) return null;

    const savedDate = new Date(pendingProgression.timestamp);
    const formattedDate = savedDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Calculer le nombre de sections complétées
    const completedSteps = pendingProgression.currentStep - 1;
    const progressPercentage = (completedSteps / (steps.length - 1)) * 100;

    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setShowResumeModal(false)}
        />

        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-md w-full transform transition-all animate-fadeInScale">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Demande en cours
                  </h3>
                  <p className="text-sm text-blue-100 mt-0.5">
                    Dernière activité : {formattedDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Progression
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Étape {pendingProgression.currentStep}/{steps.length} : {steps[pendingProgression.currentStep - 1]?.title}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Sections</p>
                        <p className="text-lg font-bold text-gray-900">
                          {completedSteps}
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            /{steps.length - 1}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fichiers</p>
                        <p className="text-lg font-bold text-gray-900">
                          {Object.values(pendingProgression.formData.files || {}).reduce(
                            (acc, files) => acc + files.length, 0
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  Vous avez une demande de renouvellement en cours. Souhaitez-vous la reprendre là où vous vous étiez arrêté(e) ?
                </p>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex flex-col sm:flex-row gap-3 justify-end border-t border-gray-100">
              <button
                onClick={startNewEvaluation}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Nouvelle demande
              </button>
              <button
                onClick={() => restoreProgression(pendingProgression)}
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Reprendre la demande
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Indicateur de sauvegarde automatique
  const AutoSaveIndicator = () => {
    if (!lastSaved) return null;

    return (
      <div className="fixed bottom-4 right-4 z-50 bg-green-100 text-green-800 px-3 py-2 rounded-lg shadow-lg text-xs flex items-center gap-2 animate-fadeIn">
        <svg
          className="w-4 h-4 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>Sauvegardé à {lastSaved.toLocaleTimeString()}</span>
      </div>
    );
  };

  // Fonction pour mettre à jour les champs texte
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Gestion des champs imbriqués (pour les situations initiales/actuelles)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Fonction pour gérer les fichiers multiples
  const handleFileChange = (e, fileKey) => {
    const files = Array.from(e.target.files);
    
    // Vérifier la taille de chaque fichier (max 8 Mo)
    const maxSize = 8 * 1024 * 1024; // 8 Mo en octets
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`Le fichier ${file.name} dépasse la taille maximale de 8 Mo`);
        return false;
      }
      return true;
    });

    // Limiter à 3 fichiers maximum
    const currentFiles = formData.files[fileKey] || [];
    const totalFiles = [...currentFiles, ...validFiles].slice(0, 3);
    
    setFormData(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [fileKey]: totalFiles
      }
    }));
  };

  // Fonction pour supprimer un fichier
  const removeFile = (fileKey, indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [fileKey]: prev.files[fileKey].filter((_, index) => index !== indexToRemove)
      }
    }));
  };

  // Fonction pour afficher les fichiers sélectionnés
  const renderFileList = (fileKey) => {
    const files = formData.files[fileKey];
    if (!files || files.length === 0) return null;

    return (
      <div className="mt-2 space-y-1">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between bg-blue-50 p-2 rounded-md">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</span>
              <span className="text-xs text-gray-500">({(file.size / (1024 * 1024)).toFixed(2)} Mo)</span>
            </div>
            <button
              type="button"
              onClick={() => removeFile(fileKey, index)}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      scrollToTop();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollToTop();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Ici vous pouvez ajouter la logique d'envoi des données
      const submitData = new FormData();
      
      // Ajout des champs simples
      Object.keys(formData).forEach(key => {
        if (key !== 'files' && typeof formData[key] !== 'object') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Ajout des objets imbriqués
      submitData.append('resultatsAcademiques', JSON.stringify(formData.resultatsAcademiques));
      submitData.append('maquettePedagogique', JSON.stringify(formData.maquettePedagogique));
      submitData.append('ressourcesHumaines', JSON.stringify(formData.ressourcesHumaines));
      submitData.append('infrastructures', JSON.stringify(formData.infrastructures));
      submitData.append('gouvernanceQualite', JSON.stringify(formData.gouvernanceQualite));
      submitData.append('partenariats', JSON.stringify(formData.partenariats));
      submitData.append('enseignantsPermanents', JSON.stringify(formData.enseignantsPermanents));
      submitData.append('enseignantsVacataires', JSON.stringify(formData.enseignantsVacataires));
      submitData.append('personnelAppui', JSON.stringify(formData.personnelAppui));
      submitData.append('sallesLaboratoires', JSON.stringify(formData.sallesLaboratoires));
      submitData.append('bibliothequeNumerique', JSON.stringify(formData.bibliothequeNumerique));
      submitData.append('accessibiliteEnergie', JSON.stringify(formData.accessibiliteEnergie));
      submitData.append('conseilPedagogique', JSON.stringify(formData.conseilPedagogique));
      submitData.append('celluleQualite', JSON.stringify(formData.celluleQualite));
      submitData.append('suiviEvaluation', JSON.stringify(formData.suiviEvaluation));
      submitData.append('planStrategique', JSON.stringify(formData.planStrategique));
      submitData.append('participationActeurs', JSON.stringify(formData.participationActeurs));
      submitData.append('tauxReussite', JSON.stringify(formData.tauxReussite));
      submitData.append('tauxDiplomation', JSON.stringify(formData.tauxDiplomation));
      submitData.append('tauxInsertion', JSON.stringify(formData.tauxInsertion));
      submitData.append('satisfaction', JSON.stringify(formData.satisfaction));
      submitData.append('actionsAmelioration', JSON.stringify(formData.actionsAmelioration));
      submitData.append('ressourcesHumainesSyn', JSON.stringify(formData.ressourcesHumainesSyn));
      submitData.append('infrastructuresSyn', JSON.stringify(formData.infrastructuresSyn));
      submitData.append('pedagogieSyn', JSON.stringify(formData.pedagogieSyn));
      submitData.append('resultatsSyn', JSON.stringify(formData.resultatsSyn));
      submitData.append('gouvernanceQualiteSyn', JSON.stringify(formData.gouvernanceQualiteSyn));
      
      // Ajout des fichiers
      Object.keys(formData.files).forEach(fileKey => {
        formData.files[fileKey].forEach((file, index) => {
          submitData.append(`${fileKey}[${index}]`, file);
        });
      });

      // Simulation d'envoi (à remplacer par votre logique réelle)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Supprimer la progression après soumission réussie
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(AUTO_SAVE_KEY);

      toast.success(
        <div className="text-sm">
          <div className="font-semibold">Demande soumise avec succès</div>
          <div className="text-xs mt-0.5">Accusé de réception par email</div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          className: "!max-w-[280px] md:!max-w-[320px]",
          bodyClassName: "!p-2",
        },
      );
    } catch (error) {
      toast.error(
        <div className="text-sm">
          <div className="font-semibold">Erreur de soumission</div>
          <div className="text-xs mt-0.5">Veuillez réessayer</div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          className: "!max-w-[280px] md:!max-w-[320px]",
          bodyClassName: "!p-2",
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction de rendu pour chaque étape
  const renderStepContent = (stepId) => {
    switch (stepId) {
      case 1:
        return (
          <div className="space-y-6">
            {/* En-tête de section */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Présentation de l'institution
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Cette section vise à présenter les informations administratives et structurelles 
                de l'établissement, en mettant en avant les changements institutionnels intervenus 
                depuis l'habilitation initiale.
              </p>
            </div>

            {/* Bonnes pratiques et points de vigilance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 font-semibold text-green-800 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Bonnes pratiques
                </h3>
                <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                  <li>Indiquer clairement les coordonnées de l'établissement et la filiation institutionnelle</li>
                  <li>Joindre de récents documents signés (arrêtés, statuts, lettres, rapports)</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 font-semibold text-yellow-800 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Points de vigilance
                </h3>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  <li>Les documents obsolètes ou non signés seront considérés comme non valides</li>
                  <li>Les incohérences entre adresses, responsables et statuts doivent être corrigées avant dépôt</li>
                </ul>
              </div>
            </div>

            {/* Formulaire principal */}
            <form className="space-y-8">
              {/* Nom de l'institution avec pièce jointe */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de l'institution <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="institutionName"
                      value={formData.institutionName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nom de l'institution ou Etablissement"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sigle <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="institutionSigle"
                      value={formData.institutionSigle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: UCM, UPF, etc."
                    />
                  </div>
                </div>
                
                {/* Pièce jointe pour le nom/sigle */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statuts / Agrément <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'statuts')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      multiple
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('statuts')}
                </div>
              </div>

              {/* Statut juridique */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut juridique <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="statutJuridique"
                    value={formData.statutJuridique}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionnez le statut juridique</option>
                    <option value="public">Public</option>
                    <option value="prive">Privé</option>
                    <option value="confessionnel">Confessionnel</option>
                  </select>
                </div>
              </div>

              {/* Responsable de l'institution avec pièces jointes */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Responsable de l'institution</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="responsableNom"
                      value={formData.responsableNom}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Nom du responsable"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="responsablePrenom"
                      value={formData.responsablePrenom}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Prénom du responsable"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fonction <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="responsableFonction"
                      value={formData.responsableFonction}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Ex: Directeur, Président, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      name="responsableEmail"
                      value={formData.responsableEmail}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="exemple@institution.edu"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input 
                      type="tel" 
                      name="responsableTelephone"
                      value={formData.responsableTelephone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="+261 34 00 000 00"
                    />
                  </div>
                </div>

                {/* Pièces jointes pour le responsable */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CV et arrêté de nomination <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'responsableDocs')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('responsableDocs')}
                </div>
              </div>

              {/* Arrêté d'habilitation antérieure avec pièce jointe */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Arrêté d'habilitation antérieure</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Référence de l'arrêté <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="arreteReference"
                      value={formData.arreteReference}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Arrêté n°12345/2025-MESupRES" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de l'arrêté <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      name="arreteDate"
                      value={formData.arreteDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                </div>

                {/* Pièce jointe pour l'arrêté */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Copie de l'arrêté d'habilitation antérieure <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'arreteHabilitation')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('arreteHabilitation')}
                </div>
              </div>

              {/* Localité et adresse avec pièce jointe */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Localisation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse complète du siège <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="adresseSiege"
                      value={formData.adresseSiege}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Numéro, rue, quartier, bâtiment" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="ville"
                      value={formData.ville}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Ex: Antananarivo, Toamasina"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code postal
                    </label>
                    <input 
                      type="text" 
                      name="codePostal"
                      value={formData.codePostal}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="101, 501, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pays <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="pays"
                      value={formData.pays}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                </div>

                {/* Pièce jointe pour la localisation */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan ou certificat de localisation <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'planLocalisation')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('planLocalisation')}
                </div>
              </div>

              {/* Lettre de demande de renouvellement avec pièce jointe */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Lettre de demande de renouvellement</h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Original signé par le responsable de l'institution</p>
                </div>

                {/* Pièce jointe pour la lettre */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lettre de demande de renouvellement <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'lettreDemande')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('lettreDemande')}
                </div>
              </div>

              {/* Évolution institutionnelle avec pièces jointes */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Évolution institutionnelle</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Changements intervenus depuis l'habilitation initiale
                  </label>
                  <textarea
                    name="evolutionInstitutionnelle"
                    value={formData.evolutionInstitutionnelle}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Décrivez les changements institutionnels (structure, direction, statuts, etc.)..."
                  ></textarea>
                </div>

                {/* Pièces jointes pour l'évolution */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rapports et organigrammes
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'rapportsOrganigrammes')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('rapportsOrganigrammes')}
                </div>
              </div>
            </form>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            {/* En-tête de section */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Bilan de la formation précédente
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Cette section retrace l'historique de la formation depuis sa précédente habilitation. 
                Il vise à mesurer les progrès accomplis et les ajustements réalisés dans la logique 
                d'amélioration continue.
              </p>
            </div>

            {/* Bonnes pratiques et points de vigilance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 font-semibold text-green-800 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Bonnes pratiques
                </h3>
                <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                  <li>Présenter des comparaisons chiffrées (avant/après)</li>
                  <li>Illustrer les progrès par des preuves concrètes : statistiques, photos, rapports</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 font-semibold text-yellow-800 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Points de vigilance
                </h3>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  <li>Les affirmations non justifiées ne seront pas prises en compte</li>
                  <li>Les données doivent provenir de sources institutionnelles officielles</li>
                </ul>
              </div>
            </div>

            {/* Formulaire principal */}
            <form className="space-y-8">
              {/* Résultats académiques */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Résultats académiques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation initiale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="resultatsAcademiques.situationInitiale"
                      value={formData.resultatsAcademiques.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Moyenne de réussite et diplomation précédente"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation actuelle / Améliorations <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="resultatsAcademiques.situationActuelle"
                      value={formData.resultatsAcademiques.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nouvelles statistiques actualisées"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preuves (PV, tableaux) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesResultats')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesResultats')}
                </div>
              </div>

              {/* Maquette pédagogique */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Maquette pédagogique</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation initiale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="maquettePedagogique.situationInitiale"
                      value={formData.maquettePedagogique.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Structure initiale de la maquette"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation actuelle / Améliorations <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="maquettePedagogique.situationActuelle"
                      value={formData.maquettePedagogique.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="UE modifiées, nouveaux parcours"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouvelle maquette <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesMaquette')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesMaquette')}
                </div>
              </div>

              {/* Ressources humaines */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Ressources humaines</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation initiale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="ressourcesHumaines.situationInitiale"
                      value={formData.ressourcesHumaines.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Équipe enseignante initiale"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation actuelle / Améliorations <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="ressourcesHumaines.situationActuelle"
                      value={formData.ressourcesHumaines.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Recrutements, formations, HDR obtenues"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CV, attestations <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesRessourcesHumaines')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesRessourcesHumaines')}
                </div>
              </div>

              {/* Infrastructures */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Infrastructures</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation initiale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="infrastructures.situationInitiale"
                      value={formData.infrastructures.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Moyens disponibles"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation actuelle / Améliorations <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="infrastructures.situationActuelle"
                      value={formData.infrastructures.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nouveaux locaux, équipements numériques"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos, factures <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesInfrastructures')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesInfrastructures')}
                </div>
              </div>

              {/* Gouvernance et qualité */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Gouvernance et qualité</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation initiale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="gouvernanceQualite.situationInitiale"
                      value={formData.gouvernanceQualite.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Dispositifs existants"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation actuelle / Améliorations <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="gouvernanceQualite.situationActuelle"
                      value={formData.gouvernanceQualite.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nouvelles procédures, autoévaluations"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rapports AQ <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesGouvernance')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesGouvernance')}
                </div>
              </div>

              {/* Partenariats */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Partenariats</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation initiale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="partenariats.situationInitiale"
                      value={formData.partenariats.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Conventions existantes"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation actuelle / Améliorations <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="partenariats.situationActuelle"
                      value={formData.partenariats.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nouvelles collaborations"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Copies des conventions <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesPartenariats')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesPartenariats')}
                </div>
              </div>
            </form>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            {/* En-tête de section */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Description actualisée de la formation
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Cette section présente la formation dans son état actuel, en mettant en avant 
                sa vocation, sa structure pédagogique et les innovations introduites depuis 
                l'habilitation précédente.
              </p>
            </div>

            {/* Bonnes pratiques et points de vigilance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 font-semibold text-green-800 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Bonnes pratiques
                </h3>
                <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                  <li>Mettre à jour la maquette selon le format LMD</li>
                  <li>Présenter les fiches UE complètes (crédits, responsables, modes d'évaluation)</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 font-semibold text-yellow-800 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Points de vigilance
                </h3>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  <li>Les documents doivent être signés et datés</li>
                  <li>La cohérence entre le grade et les parcours doit être vérifiée</li>
                </ul>
              </div>
            </div>

            {/* Formulaire principal */}
            <form className="space-y-8">
              {/* Domaine et mention */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Domaine et mention</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Domaine de formation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="domaine"
                      value={formData.domaine}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Sciences, Lettres, Droit, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mention concernée <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="mention"
                      value={formData.mention}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Mathématiques, Droit des affaires, etc."
                    />
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arrêté initial et mise à jour <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'justificatifsDomaine')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('justificatifsDomaine')}
                </div>
              </div>

              {/* Grade et parcours */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Grade et parcours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionnez le grade</option>
                      <option value="Licence">Licence</option>
                      <option value="Master">Master</option>
                      <option value="Doctorat">Doctorat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parcours <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="parcours"
                      value={formData.parcours}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Parcours maintenus ou ajoutés"
                    />
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiches parcours <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'justificatifsParcours')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('justificatifsParcours')}
                </div>
              </div>

              {/* Responsables de parcours */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Responsables de parcours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableParcoursNom"
                      value={formData.responsableParcoursNom}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nom du responsable"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableParcoursPrenom"
                      value={formData.responsableParcoursPrenom}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Prénom du responsable"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableParcoursGrade"
                      value={formData.responsableParcoursGrade}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Professeur, Maître de conférences, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Spécialité <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="responsableParcoursSpecialite"
                      value={formData.responsableParcoursSpecialite}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Domaine de spécialité"
                    />
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CV, arrêté de nomination <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'justificatifsResponsableParcours')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('justificatifsResponsableParcours')}
                </div>
              </div>

              {/* Maquette pédagogique actualisée */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Maquette pédagogique actualisée</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Structure conforme au LMD <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="maquetteActualisee"
                    value={formData.maquetteActualisee}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Décrivez la structure de la maquette (semestres, UE, crédits, etc.)"
                  ></textarea>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouvelle maquette signée <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'justificatifsMaquette')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('justificatifsMaquette')}
                </div>
              </div>

              {/* Innovations pédagogiques */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Innovations pédagogiques</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approches nouvelles <span className="text-red-500">*</span>
                    </label>
                  <textarea
                    name="innovationsPedagogiques"
                    value={formData.innovationsPedagogiques}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Décrivez les innovations (numérique, stages, projets, etc.)"
                  ></textarea>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PV, supports <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'justificatifsInnovations')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('justificatifsInnovations')}
                </div>
              </div>

              {/* Orientation de la formation */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Orientation de la formation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type d'orientation <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="orientationFormation"
                          value="academique"
                          checked={formData.orientationFormation === 'academique'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Académique</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="orientationFormation"
                          value="professionnelle"
                          checked={formData.orientationFormation === 'professionnelle'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Professionnelle</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document de présentation <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'justificatifsOrientation')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('justificatifsOrientation')}
                </div>
              </div>
            </form>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            {/* En-tête de section */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Ressources humaines et infrastructures
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Cette section évalue la disponibilité et la qualité des ressources humaines et matérielles. 
                Il compare la situation actuelle avec celle de l'habilitation initiale, pour vérifier les 
                améliorations apportées.
              </p>
            </div>

            {/* Bonnes pratiques et points de vigilance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 font-semibold text-green-800 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Bonnes pratiques
                </h3>
                <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                  <li>Mentionner les nouveaux recrutements, promotions, ou formations d'enseignants</li>
                  <li>Décrire les investissements en équipements pédagogiques</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 font-semibold text-yellow-800 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Points de vigilance
                </h3>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  <li>Les CV et lettre d'engagement non signé ne sont pas recevables</li>
                  <li>Les infrastructures partagées doivent être appuyées par des conventions écrites</li>
                </ul>
              </div>
            </div>

            {/* Formulaire principal */}
            <form className="space-y-8">
              {/* Enseignants permanents */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Enseignants permanents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation initiale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="enseignantsPermanents.situationInitiale"
                      value={formData.enseignantsPermanents.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nombre et spécialité"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation actuelle / Améliorations <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="enseignantsPermanents.situationActuelle"
                      value={formData.enseignantsPermanents.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nouvelles recrues, promotions HDR"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CV, diplômes <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesEnseignantsPermanents')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesEnseignantsPermanents')}
                </div>
              </div>

              {/* Enseignants vacataires */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Enseignants vacataires</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation initiale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="enseignantsVacataires.situationInitiale"
                      value={formData.enseignantsVacataires.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nombre et profils"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation actuelle / Améliorations <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="enseignantsVacataires.situationActuelle"
                      value={formData.enseignantsVacataires.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Évolution de la contribution"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PV de service <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesEnseignantsVacataires')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesEnseignantsVacataires')}
                </div>
              </div>

              {/* Personnel d'appui */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Personnel d'appui</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation initiale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="personnelAppui.situationInitiale"
                      value={formData.personnelAppui.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Techniciens, bibliothécaires"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation actuelle / Améliorations <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="personnelAppui.situationActuelle"
                      value={formData.personnelAppui.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Renforcement des équipes"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Liste nominative <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesPersonnelAppui')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesPersonnelAppui')}
                </div>
              </div>

              {/* Salles et laboratoires */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Salles et laboratoires</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation initiale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="sallesLaboratoires.situationInitiale"
                      value={formData.sallesLaboratoires.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="État initial"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation actuelle / Améliorations <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="sallesLaboratoires.situationActuelle"
                      value={formData.sallesLaboratoires.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Rénovations, nouveaux équipements"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos, factures <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesSallesLaboratoires')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesSallesLaboratoires')}
                </div>
              </div>

              {/* Bibliothèque et numérique */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Bibliothèque et numérique</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation initiale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="bibliothequeNumerique.situationInitiale"
                      value={formData.bibliothequeNumerique.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Fonds documentaire et accès"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation actuelle / Améliorations <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="bibliothequeNumerique.situationActuelle"
                      value={formData.bibliothequeNumerique.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Actualisation, abonnements"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Captures, inventaires <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesBibliothequeNumerique')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesBibliothequeNumerique')}
                </div>
              </div>

              {/* Accessibilité et énergie */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Accessibilité et énergie</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation initiale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="accessibiliteEnergie.situationInitiale"
                      value={formData.accessibiliteEnergie.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Conditions initiales"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation actuelle / Améliorations <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="accessibiliteEnergie.situationActuelle"
                      value={formData.accessibiliteEnergie.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Améliorations structurelles"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rapports, attestations <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesAccessibiliteEnergie')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesAccessibiliteEnergie')}
                </div>
              </div>
            </form>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6">
            {/* En-tête de section */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Gouvernance, assurance qualité et pilotage
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Cette section analyse la gouvernance académique et le pilotage de la qualité. 
                Il vise à vérifier que l'établissement dispose d'un suivi institutionnel régulier 
                et d'une cellule AQ fonctionnelle.
              </p>
            </div>

            {/* Bonnes pratiques et points de vigilance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 font-semibold text-green-800 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Bonnes pratiques
                </h3>
                <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                  <li>Joindre les PV récents du conseil pédagogique ou scientifique</li>
                  <li>Présenter un plan d'amélioration continue avec indicateurs suivis</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 font-semibold text-yellow-800 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Points de vigilance
                </h3>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  <li>Les rapports AQ doivent couvrir la période complète depuis la précédente habilitation</li>
                  <li>Les décisions sans preuve de mise en œuvre ne seront pas retenues</li>
                </ul>
              </div>
            </div>

            {/* Formulaire principal */}
            <form className="space-y-8">
              {/* Conseil pédagogique et scientifique */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Conseil pédagogique et scientifique</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation initiale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="conseilPedagogique.situationInitiale"
                      value={formData.conseilPedagogique.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Fréquence et fonctionnement antérieurs"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation actuelle / Progrès <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="conseilPedagogique.situationActuelle"
                      value={formData.conseilPedagogique.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Réunions régulières et PV"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PV, rapports <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesConseilPedagogique')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesConseilPedagogique')}
                </div>
              </div>

              {/* Cellule assurance qualité */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Cellule assurance qualité</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation initiale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="celluleQualite.situationInitiale"
                      value={formData.celluleQualite.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Existence et rôle"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation actuelle / Progrès <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="celluleQualite.situationActuelle"
                      value={formData.celluleQualite.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nouveaux outils, indicateurs"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rapports AQ <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesCelluleQualite')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesCelluleQualite')}
                </div>
              </div>

              {/* Suivi-évaluation */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Suivi-évaluation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation initiale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="suiviEvaluation.situationInitiale"
                      value={formData.suiviEvaluation.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Dispositif de suivi initial"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation actuelle / Progrès <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="suiviEvaluation.situationActuelle"
                      value={formData.suiviEvaluation.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tableaux de bord, indicateurs actualisés"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rapports d'évaluation <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesSuiviEvaluation')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesSuiviEvaluation')}
                </div>
              </div>

              {/* Plan stratégique */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Plan stratégique</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation initiale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="planStrategique.situationInitiale"
                      value={formData.planStrategique.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Alignement initial"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation actuelle / Progrès <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="planStrategique.situationActuelle"
                      value={formData.planStrategique.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Inclusion renforcée de la formation"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Extraits validés <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesPlanStrategique')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesPlanStrategique')}
                </div>
              </div>

              {/* Participation des acteurs */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Participation des acteurs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation initiale <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="participationActeurs.situationInitiale"
                      value={formData.participationActeurs.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Implication initiale"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Situation actuelle / Progrès <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="participationActeurs.situationActuelle"
                      value={formData.participationActeurs.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Mécanismes participatifs renforcés"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feuilles de présence <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesParticipationActeurs')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesParticipationActeurs')}
                </div>
              </div>
            </form>
          </div>
        );
      
      case 6:
        return (
          <div className="space-y-6">
            {/* En-tête de section */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Performances académiques et insertion professionnelle
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Ce bloc permet d'apprécier la performance académique et l'impact professionnel de la formation. 
                Les données doivent être comparées sur plusieurs cohortes pour évaluer les tendances.
              </p>
            </div>

            {/* Bonnes pratiques et points de vigilance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 font-semibold text-green-800 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Bonnes pratiques
                </h3>
                <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                  <li>Utiliser des tableaux statistiques synthétiques</li>
                  <li>Décrire le dispositif de suivi des diplômés</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 font-semibold text-yellow-800 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Points de vigilance
                </h3>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  <li>Les statistiques doivent être sourcées et vérifiables</li>
                  <li>Les indicateurs isolés (une seule année) ne sont pas représentatifs</li>
                </ul>
              </div>
            </div>

            {/* Formulaire principal */}
            <form className="space-y-8">
              {/* Taux de réussite */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Taux de réussite</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Données initiales <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="tauxReussite.situationInitiale"
                      value={formData.tauxReussite.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Moyenne sur 3 cohortes"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Données actualisées / Évolution <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="tauxReussite.situationActuelle"
                      value={formData.tauxReussite.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Dernières cohortes disponibles"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tableaux de résultats <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesTauxReussite')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesTauxReussite')}
                </div>
              </div>

              {/* Taux de diplomation */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Taux de diplomation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Données initiales <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="tauxDiplomation.situationInitiale"
                      value={formData.tauxDiplomation.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Pourcentage initial"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Données actualisées / Évolution <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="tauxDiplomation.situationActuelle"
                      value={formData.tauxDiplomation.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Évolution constatée"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PV de délibérations <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesTauxDiplomation')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesTauxDiplomation')}
                </div>
              </div>

              {/* Taux d'insertion */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Taux d'insertion</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Données initiales <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="tauxInsertion.situationInitiale"
                      value={formData.tauxInsertion.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Suivi initial"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Données actualisées / Évolution <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="tauxInsertion.situationActuelle"
                      value={formData.tauxInsertion.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Statistiques récentes"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enquêtes alumni <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesTauxInsertion')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesTauxInsertion')}
                </div>
              </div>

              {/* Satisfaction étudiants / employeurs */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Satisfaction étudiants / employeurs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Données initiales <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="satisfaction.situationInitiale"
                      value={formData.satisfaction.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Résultats d'enquêtes"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Données actualisées / Évolution <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="satisfaction.situationActuelle"
                      value={formData.satisfaction.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nouvelles données comparatives"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rapports AQ <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesSatisfaction')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesSatisfaction')}
                </div>
              </div>

              {/* Actions d'amélioration */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Actions d'amélioration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Données initiales <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="actionsAmelioration.situationInitiale"
                      value={formData.actionsAmelioration.situationInitiale}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Plan initial"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Données actualisées / Évolution <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="actionsAmelioration.situationActuelle"
                      value={formData.actionsAmelioration.situationActuelle}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Résultats observés"
                    ></textarea>
                  </div>
                </div>

                {/* Pièces jointes */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rapports AQ, PV <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(e, 'preuvesActionsAmelioration')}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, JPEG, PNG, GIF (Max 8 Mo par fichier, 3 fichiers maximum)
                  </p>
                  {renderFileList('preuvesActionsAmelioration')}
                </div>
              </div>
            </form>
          </div>
        );
      
      case 7:
        return (
          <div className="space-y-6">
            {/* En-tête de section */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Synthèse et conclusion
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Cette section permet de présenter une autoévaluation critique de la formation et d'identifier 
                les actions prioritaires pour le prochain cycle d'habilitation.
              </p>
            </div>

            {/* Bonnes pratiques et points de vigilance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 font-semibold text-green-800 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Bonnes pratiques
                </h3>
                <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                  <li>Être honnête, factuel et orienté vers la solution</li>
                  <li>Utiliser la méthode SWOT (forces/faiblesses/opportunités/menaces)</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 font-semibold text-yellow-800 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Points de vigilance
                </h3>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  <li>Les engagements doivent être réalistes et mesurables</li>
                  <li>La synthèse doit être signée par le responsable de la formation</li>
                </ul>
              </div>
            </div>

            {/* Formulaire principal */}
            <form className="space-y-8">
              {/* Ressources humaines */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Ressources humaines</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Forces identifiées <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="ressourcesHumainesSyn.forces"
                      value={formData.ressourcesHumainesSyn.forces}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Forces identifiées"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Points à améliorer <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="ressourcesHumainesSyn.pointsAmeliorer"
                      value={formData.ressourcesHumainesSyn.pointsAmeliorer}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Points à améliorer"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actions prévues <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="ressourcesHumainesSyn.actionsPrevues"
                      value={formData.ressourcesHumainesSyn.actionsPrevues}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Actions prévues"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Infrastructures */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Infrastructures</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Forces identifiées <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="infrastructuresSyn.forces"
                      value={formData.infrastructuresSyn.forces}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Forces identifiées"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Points à améliorer <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="infrastructuresSyn.pointsAmeliorer"
                      value={formData.infrastructuresSyn.pointsAmeliorer}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Points à améliorer"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actions prévues <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="infrastructuresSyn.actionsPrevues"
                      value={formData.infrastructuresSyn.actionsPrevues}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Actions prévues"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Pédagogie */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Pédagogie</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Forces identifiées <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="pedagogieSyn.forces"
                      value={formData.pedagogieSyn.forces}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Forces identifiées"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Points à améliorer <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="pedagogieSyn.pointsAmeliorer"
                      value={formData.pedagogieSyn.pointsAmeliorer}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Points à améliorer"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actions prévues <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="pedagogieSyn.actionsPrevues"
                      value={formData.pedagogieSyn.actionsPrevues}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Actions prévues"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Résultats */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Résultats</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Forces identifiées <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="resultatsSyn.forces"
                      value={formData.resultatsSyn.forces}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Forces identifiées"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Points à améliorer <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="resultatsSyn.pointsAmeliorer"
                      value={formData.resultatsSyn.pointsAmeliorer}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Points à améliorer"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actions prévues <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="resultatsSyn.actionsPrevues"
                      value={formData.resultatsSyn.actionsPrevues}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Actions prévues"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Gouvernance et assurance qualité */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Gouvernance et assurance qualité</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Forces identifiées <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="gouvernanceQualiteSyn.forces"
                      value={formData.gouvernanceQualiteSyn.forces}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Forces identifiées"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Points à améliorer <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="gouvernanceQualiteSyn.pointsAmeliorer"
                      value={formData.gouvernanceQualiteSyn.pointsAmeliorer}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Points à améliorer"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actions prévues <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="gouvernanceQualiteSyn.actionsPrevues"
                      value={formData.gouvernanceQualiteSyn.actionsPrevues}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Actions prévues"
                    ></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
        );
      
      case 8: // Ancien case 9 (Récapitulatif)
        return (
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4 md:p-6">
              <h4 className="font-semibold text-gray-800 mb-3 md:mb-4 text-lg md:text-xl">
                Récapitulatif complet
              </h4>
              <div className="space-y-3 md:space-y-4">
                {steps.slice(0, -1).map((step, index) => (
                  <div key={step.id} className="flex items-start">
                    <div
                      className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-3 ${
                        index < 7 ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {index < 7 ? (
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span className="text-xs md:text-sm text-gray-600">
                          {step.id}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm md:text-base">
                        {step.title}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">
                        {index < 7 ? "Section complétée" : "Section en cours"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm md:text-base">
                    Prêt à soumettre
                  </h4>
                  <p className="text-blue-700 text-xs md:text-sm">
                    Cliquez sur "Soumettre la demande" pour finaliser votre
                    renouvellement d'habilitation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">
                {steps[stepId - 1].title}
              </h3>
              <p className="text-gray-600 text-justify leading-relaxed text-sm md:text-base">
                Contenu de la section "{steps[stepId - 1].title}"...
              </p>
            </div>
          </div>
        );
    }
  };

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <>
      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      {showResumeModal && <ResumeModal />}
      <AutoSaveIndicator />

      <div className="min-h-screen bg-white py-4 md:py-8 px-3 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* En-tête */}
          <div className="mb-6 md:mb-10">
            <div className="md:hidden text-center mb-4">
              <div className="flex justify-center mb-2">
                <img
                  src={mesupresLogo}
                  alt="Logo MESUPReS"
                  className="h-12 w-auto"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                Renouvellement d'Habilitation
              </h1>
              <p className="text-gray-600 text-sm">
                MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR<br />
                ET DE LA RECHERCHE SCIENTIFIQUE
              </p>
            </div>

            <div className="hidden md:flex items-center mb-3">
              <img
                src={mesupresLogo}
                alt="Logo MESUPReS"
                className="h-12 w-auto mr-4"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Renouvellement d'Habilitation
                </h1>
                <p className="text-gray-600 text-base">
                  MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR ET DE LA RECHERCHE SCIENTIFIQUE
                </p>
              </div>
            </div>
          </div>

          {/* Barre de progression globale */}
          <div className="mb-6 md:mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs md:text-sm font-medium text-gray-700">
                Progression globale
              </span>
              <span className="text-xs md:text-sm font-semibold text-blue-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Affichage mobile uniquement: Étape actuelle */}
          <div className="md:hidden mb-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-bold text-gray-900">
                Étape {currentStep} : {steps[currentStep - 1].title}
              </h2>
              <p className="text-gray-600 text-xs mt-1">
                Étape {currentStep} sur {steps.length}
              </p>
            </div>
          </div>

          {/* Barre de progression détaillée - Masquée sur mobile */}
          <div className="mb-8 md:mb-10 hidden md:block">
            <div className="relative">
              <div className="absolute left-4 right-4 top-5 h-0.5 bg-gray-200 -translate-y-1/2"></div>

              <div
                className="absolute left-4 top-5 h-0.5 bg-blue-600 -translate-y-1/2 transition-all duration-500 ease-out"
                style={{
                  width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 2rem)`,
                }}
              ></div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
                {steps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className="relative z-10">
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          step.id < currentStep
                            ? "bg-green-500 border-green-500 text-white"
                            : step.id === currentStep
                              ? "bg-blue-600 border-blue-600 text-white ring-2 md:ring-4 ring-blue-100"
                              : "bg-white border-gray-300 text-gray-400"
                        }`}
                      >
                        {step.id < currentStep ? (
                          <svg
                            className="w-4 h-4 md:w-5 md:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <span
                            className={`font-bold text-sm md:text-base ${step.id === currentStep ? "text-white" : "text-gray-500"}`}
                          >
                            {step.id}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 text-center">
                      <p
                        className={`text-xs font-medium leading-tight ${
                          step.id <= currentStep
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title.split(" ").map((word, i) => (
                          <React.Fragment key={i}>
                            {word}
                            {i < step.title.split(" ").length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="max-w-5xl mx-auto">
            {/* Version Desktop/Tablette */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="max-w-none">
                  {renderStepContent(currentStep)}
                </div>
              </div>

              <div className="px-6 md:px-8 py-4 md:py-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    {currentStep > 1 && (
                      <button
                        onClick={handlePrevious}
                        className="px-4 py-2.5 md:px-5 md:py-3 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 border border-gray-300 hover:border-gray-400 flex items-center gap-2 text-sm md:text-base"
                      >
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        <span>Précédent</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-4 sm:mt-0">
                    {currentStep === steps.length ? (
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 md:px-8 md:py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Soumission en cours...</span>
                          </>
                        ) : (
                          <>
                            <span>Soumettre la demande</span>
                            <svg
                              className="w-4 h-4 md:w-5 md:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="px-6 py-2.5 md:px-8 md:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2 text-sm md:text-base"
                      >
                        <span>Suivant</span>
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Version Mobile */}
            <div className="md:hidden">
              <div className="pb-4">
                <div className="max-w-none">
                  {renderStepContent(currentStep)}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrevious}
                      className="flex-1 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg font-medium border border-gray-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <span>Précédent</span>
                    </button>
                  )}

                  {currentStep === steps.length ? (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Soumettre</span>
                        </>
                      ) : (
                        <>
                          <span>Soumettre</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm"
                    >
                      <span>Suivant</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Indicateurs - Desktop uniquement */}
          <div className="max-w-5xl mx-auto mt-6 hidden md:flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Étape complétée</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span>Étape actuelle</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full border-2 border-gray-300 bg-white"></div>
              <span>Étape à venir</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour en haut */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 bg-blue-600 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          aria-label="Retour en haut"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        className="!text-sm"
        toastClassName="!max-w-[280px] md:!max-w-[320px] !rounded-lg !shadow-lg"
        bodyClassName="!p-2"
        progressClassName="!h-0.5"
      />
    </>
  );
};

export default RenouvellementForm;