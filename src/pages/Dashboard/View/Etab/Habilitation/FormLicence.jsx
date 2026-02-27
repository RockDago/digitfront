import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaInfoCircle, FaPlus, FaTimes, FaChevronDown, FaChevronUp, FaExclamationTriangle } from "react-icons/fa";

const formSteps = [
  { id: 1, title: "Présentation\nde\nl'institution" },
  {
    id: 2,
    title: "Pertinence\net\njustification\nde la\ndemande d'habilitation",
  },
  { id: 3, title: "Organisation\ndes\nétudes" },
  { id: 4, title: "Dispositif\npédagogique\net\nmaquette" },
  { id: 5, title: "Moyens\ndisponibles" },
  {
    id: 6,
    title:
      "Gestion\ndes\nperformances\nacadémiques\net\npolitique\nd'insertion\nprofessionnelle",
  },
  { id: 7, title: "Gouvernance\net\nassurance\nqualité" },
  { id: 8, title: "Annexes" },
  { id: 9, title: "Récapitulatif" },
];

const FormLicence = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // État pour gérer les sections dépliables
  const [expandedSections, setExpandedSections] = useState({
    // Section 1
    infoInstitutionnelles: true,
    offresFormations: false,
    ressourcesHumaines: false,
    infrastructures: false,
    statistiques: false,
    // Section 2
    etudeSocioEconomique: true,
    ressourcesAttribuees: false
  });

  const [formData, setFormData] = useState({
    // SECTION 1 - Présentation de l'institution
    institution: {
      nom: "",
      adresse: "",
      telephone: "",
      email: "",
      siteweb: "",
      statut_juridique: "",
      arrete_ouverture: "",
      responsable_nom: "",
      responsable_prenoms: "",
      responsable_titre: "",
      organigramme: null,
      mission: "",
      vision: "",
      plan_developpement: "",
      date_approbation: "",
      demande_officielle: null,
      cahier_charges: null,
      dispositif_gouvernance: null
    },

    criteres: {
      demande_officielle: null,
      cahier_charges: null,
      dispositif_gouvernance: null
    },

    domainesGrades: [
      { domaine: "ST", grade_l: "", grade_m: "", responsable_nom: "", responsable_prenoms: "", email: "", telephone: "" },
      { domaine: "ALSH", grade_l: "", grade_m: "", responsable_nom: "", responsable_prenoms: "", email: "", telephone: "" },
      { domaine: "SEd", grade_l: "", grade_m: "", responsable_nom: "", responsable_prenoms: "", email: "", telephone: "" },
      { domaine: "SI", grade_l: "", grade_m: "", responsable_nom: "", responsable_prenoms: "", email: "", telephone: "" },
      { domaine: "SSa", grade_l: "", grade_m: "", responsable_nom: "", responsable_prenoms: "", email: "", telephone: "" },
      { domaine: "SSo", grade_l: "", grade_m: "", responsable_nom: "", responsable_prenoms: "", email: "", telephone: "" }
    ],

    mentions: [
      { domaine: "", grade: "", mention: "", etablissement: "", responsable_nom: "", responsable_prenoms: "", email: "", telephone: "" }
    ],

    enseignantsPermanents: [
      { nom: "", prenom: "", diplome: "", grade: "", specialite: "", mention_rattachement: "", type_intervention: "" }
    ],

    enseignantsVacataires: [
      { nom: "", prenom: "", diplome: "", grade: "", specialite: "", mention_rattachement: "", type_intervention: "" }
    ],

    personnelAT: [
      { fonction: "", effectif: "", affectation: "", preuves: null }
    ],

    sallesCours: [
      { capacite: "0–20", nombre: "", equipement: "", preuves: null }
    ],

    laboratoires: [
      { designation: "", nombre: "", etat: "", preuves: null }
    ],

    bibliotheque: {
      fonds: "",
      capacite: "",
      preuves: null
    },

    infrastructuresNumeriques: {
      salle_informatique: { disponible: false, standard: "", preuves: null },
      connectivite: { disponible: false, standard: "", preuves: null },
      lms: { disponible: false, standard: "", preuves: null },
      sanitaires: { disponible: false, standard: "", preuves: null },
      energie: { disponible: false, standard: "", preuves: null }
    },

    statistiques: [
      { domaine: "", mention: "", parcours: "", etudiants: "", enseignants_perm: "", enseignants_vac: "", ratio: "" }
    ],

    // SECTION 2 - Pertinence et justification
    etudeBesoins: {
      diagnostic: "",
      debouches: "",
      profils_vises: "",
      analyse_similaires: "",
      justification_opportunite: "",
      tableau_comparatif: null,
      lettres_appui: null
    },

    effectifsPrevisionnels: [
      { semestre: "S1", effectif: "", justification: "" },
      { semestre: "S2", effectif: "", justification: "" },
      { semestre: "S3", effectif: "", justification: "" },
      { semestre: "S4", effectif: "", justification: "" },
      { semestre: "S5", effectif: "", justification: "" },
      { semestre: "S6", effectif: "", justification: "" }
    ],

    projections: {
      annee1: "",
      annee2: "",
      annee3: "",
      annee4: "",
      annee5: "",
      hypotheses: ""
    },

    partenariats: {
      academiques: [
        { nom_partenaire: "", type_partenariat: "", convention: null }
      ],
      stages: [
        { entreprise: "", secteur: "", convention: null }
      ],
      projets: [
        { intitule_projet: "", partenaire: "", description: "" }
      ]
    },

    qualificationResponsables: [
      { domaine: "ST", grade: "L", mention: "", responsable_nom: "", responsable_prenoms: "", diplome: "", specialite: "" },
      { domaine: "ST", grade: "M", mention: "", responsable_nom: "", responsable_prenoms: "", diplome: "", specialite: "" },
      { domaine: "ALSH", grade: "L", mention: "", responsable_nom: "", responsable_prenoms: "", diplome: "", specialite: "" },
      { domaine: "ALSH", grade: "M", mention: "", responsable_nom: "", responsable_prenoms: "", diplome: "", specialite: "" },
      { domaine: "SEd", grade: "L", mention: "", responsable_nom: "", responsable_prenoms: "", diplome: "", specialite: "" },
      { domaine: "SEd", grade: "M", mention: "", responsable_nom: "", responsable_prenoms: "", diplome: "", specialite: "" },
      { domaine: "SI", grade: "L", mention: "", responsable_nom: "", responsable_prenoms: "", diplome: "", specialite: "" },
      { domaine: "SI", grade: "M", mention: "", responsable_nom: "", responsable_prenoms: "", diplome: "", specialite: "" },
      { domaine: "SSa", grade: "L", mention: "", responsable_nom: "", responsable_prenoms: "", diplome: "", specialite: "" },
      { domaine: "SSa", grade: "M", mention: "", responsable_nom: "", responsable_prenoms: "", diplome: "", specialite: "" },
      { domaine: "SSo", grade: "L", mention: "", responsable_nom: "", responsable_prenoms: "", diplome: "", specialite: "" },
      { domaine: "SSo", grade: "M", mention: "", responsable_nom: "", responsable_prenoms: "", diplome: "", specialite: "" }
    ],

    enseignantsDedies: [
      { nom: "", prenom: "", statut: "", diplome: "", specialite: "", ue_enseignees: "", charge_annuelle: "", cv: null, diplome_file: null, lettre_engagement: null }
    ],

    // Autres étapes
    step3: "",
    step4: "",
    step5: "",
    step6: "",
    step7: "",
    step8: null,
  });

  const [errors, setErrors] = useState({});
  
  // États pour les sections dépliables des tableaux dynamiques
  const [expandedMentions, setExpandedMentions] = useState({});
  const [expandedPermanents, setExpandedPermanents] = useState({});
  const [expandedVacataires, setExpandedVacataires] = useState({});
  const [expandedPersonnel, setExpandedPersonnel] = useState({});
  const [expandedSalles, setExpandedSalles] = useState({});
  const [expandedLabos, setExpandedLabos] = useState({});
  const [expandedStats, setExpandedStats] = useState({});
  const [expandedPartenairesAcad, setExpandedPartenairesAcad] = useState({});
  const [expandedStages, setExpandedStages] = useState({});
  const [expandedProjets, setExpandedProjets] = useState({});
  const [expandedEnseignantsDedies, setExpandedEnseignantsDedies] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (currentStep < formSteps.length) {
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

  const handleBackToCanevas = () => {
    navigate("/dashboard/etablissement/habilitation/creer-demande");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Demande de Licence soumise avec succès !", {
        position: "top-right",
        autoClose: 4000,
      });
      setTimeout(() => navigate("/dashboard/etablissement/habilitation/creer-demande"), 2000);
    } catch (error) {
      toast.error("Erreur lors de la soumission", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (step, value) => {
    setFormData((prev) => ({ ...prev, [step]: value }));
  };

  // Fonctions pour la section 1
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInstitutionChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      institution: { ...prev.institution, [field]: value }
    }));
  };

  const handleCriteresChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      criteres: { ...prev.criteres, [field]: value }
    }));
  };

  const handleDomaineGradeChange = (index, field, value) => {
    const updated = [...formData.domainesGrades];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, domainesGrades: updated }));
  };

  const addMention = () => {
    setFormData(prev => ({
      ...prev,
      mentions: [...prev.mentions, { domaine: "", grade: "", mention: "", etablissement: "", responsable_nom: "", responsable_prenoms: "", email: "", telephone: "" }]
    }));
  };

  const removeMention = (index) => {
    if (formData.mentions.length > 1) {
      const updated = formData.mentions.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, mentions: updated }));
    }
  };

  const toggleMention = (index) => {
    setExpandedMentions(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleMentionChange = (index, field, value) => {
    const updated = [...formData.mentions];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, mentions: updated }));
  };

  const addEnseignantPermanent = () => {
    setFormData(prev => ({
      ...prev,
      enseignantsPermanents: [...prev.enseignantsPermanents, { nom: "", prenom: "", diplome: "", grade: "", specialite: "", mention_rattachement: "", type_intervention: "" }]
    }));
  };

  const removeEnseignantPermanent = (index) => {
    if (formData.enseignantsPermanents.length > 1) {
      const updated = formData.enseignantsPermanents.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, enseignantsPermanents: updated }));
    }
  };

  const togglePermanent = (index) => {
    setExpandedPermanents(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handlePermanentChange = (index, field, value) => {
    const updated = [...formData.enseignantsPermanents];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, enseignantsPermanents: updated }));
  };

  const addEnseignantVacataire = () => {
    setFormData(prev => ({
      ...prev,
      enseignantsVacataires: [...prev.enseignantsVacataires, { nom: "", prenom: "", diplome: "", grade: "", specialite: "", mention_rattachement: "", type_intervention: "" }]
    }));
  };

  const removeEnseignantVacataire = (index) => {
    if (formData.enseignantsVacataires.length > 1) {
      const updated = formData.enseignantsVacataires.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, enseignantsVacataires: updated }));
    }
  };

  const toggleVacataire = (index) => {
    setExpandedVacataires(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleVacataireChange = (index, field, value) => {
    const updated = [...formData.enseignantsVacataires];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, enseignantsVacataires: updated }));
  };

  const addPersonnel = () => {
    setFormData(prev => ({
      ...prev,
      personnelAT: [...prev.personnelAT, { fonction: "", effectif: "", affectation: "", preuves: null }]
    }));
  };

  const removePersonnel = (index) => {
    if (formData.personnelAT.length > 1) {
      const updated = formData.personnelAT.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, personnelAT: updated }));
    }
  };

  const togglePersonnel = (index) => {
    setExpandedPersonnel(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handlePersonnelChange = (index, field, value) => {
    const updated = [...formData.personnelAT];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, personnelAT: updated }));
  };

  const addSalle = () => {
    setFormData(prev => ({
      ...prev,
      sallesCours: [...prev.sallesCours, { capacite: "0–20", nombre: "", equipement: "", preuves: null }]
    }));
  };

  const removeSalle = (index) => {
    if (formData.sallesCours.length > 1) {
      const updated = formData.sallesCours.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, sallesCours: updated }));
    }
  };

  const toggleSalle = (index) => {
    setExpandedSalles(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSalleChange = (index, field, value) => {
    const updated = [...formData.sallesCours];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, sallesCours: updated }));
  };

  const addLaboratoire = () => {
    setFormData(prev => ({
      ...prev,
      laboratoires: [...prev.laboratoires, { designation: "", nombre: "", etat: "", preuves: null }]
    }));
  };

  const removeLaboratoire = (index) => {
    if (formData.laboratoires.length > 1) {
      const updated = formData.laboratoires.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, laboratoires: updated }));
    }
  };

  const toggleLaboratoire = (index) => {
    setExpandedLabos(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleLaboratoireChange = (index, field, value) => {
    const updated = [...formData.laboratoires];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, laboratoires: updated }));
  };

  const addStatistique = () => {
    setFormData(prev => ({
      ...prev,
      statistiques: [...prev.statistiques, { domaine: "", mention: "", parcours: "", etudiants: "", enseignants_perm: "", enseignants_vac: "", ratio: "" }]
    }));
  };

  const removeStatistique = (index) => {
    if (formData.statistiques.length > 1) {
      const updated = formData.statistiques.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, statistiques: updated }));
    }
  };

  const toggleStatistique = (index) => {
    setExpandedStats(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleStatistiqueChange = (index, field, value) => {
    const updated = [...formData.statistiques];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, statistiques: updated }));
  };

  // Fonctions pour la section 2
  const handleEtudeBesoinsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      etudeBesoins: { ...prev.etudeBesoins, [field]: value }
    }));
  };

  const handleEffectifPrevisionnelChange = (index, field, value) => {
    const updated = [...formData.effectifsPrevisionnels];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, effectifsPrevisionnels: updated }));
  };

  const handleProjectionsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      projections: { ...prev.projections, [field]: value }
    }));
  };

  // Partenariats académiques
  const addPartenaireAcademique = () => {
    setFormData(prev => ({
      ...prev,
      partenariats: {
        ...prev.partenariats,
        academiques: [...prev.partenariats.academiques, { nom_partenaire: "", type_partenariat: "", convention: null }]
      }
    }));
  };

  const removePartenaireAcademique = (index) => {
    if (formData.partenariats.academiques.length > 1) {
      const updated = formData.partenariats.academiques.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        partenariats: { ...prev.partenariats, academiques: updated }
      }));
    }
  };

  const togglePartenaireAcademique = (index) => {
    setExpandedPartenairesAcad(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handlePartenaireAcademiqueChange = (index, field, value) => {
    const updated = [...formData.partenariats.academiques];
    updated[index][field] = value;
    setFormData(prev => ({
      ...prev,
      partenariats: { ...prev.partenariats, academiques: updated }
    }));
  };

  // Stages
  const addStage = () => {
    setFormData(prev => ({
      ...prev,
      partenariats: {
        ...prev.partenariats,
        stages: [...prev.partenariats.stages, { entreprise: "", secteur: "", convention: null }]
      }
    }));
  };

  const removeStage = (index) => {
    if (formData.partenariats.stages.length > 1) {
      const updated = formData.partenariats.stages.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        partenariats: { ...prev.partenariats, stages: updated }
      }));
    }
  };

  const toggleStage = (index) => {
    setExpandedStages(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleStageChange = (index, field, value) => {
    const updated = [...formData.partenariats.stages];
    updated[index][field] = value;
    setFormData(prev => ({
      ...prev,
      partenariats: { ...prev.partenariats, stages: updated }
    }));
  };

  // Projets
  const addProjet = () => {
    setFormData(prev => ({
      ...prev,
      partenariats: {
        ...prev.partenariats,
        projets: [...prev.partenariats.projets, { intitule_projet: "", partenaire: "", description: "" }]
      }
    }));
  };

  const removeProjet = (index) => {
    if (formData.partenariats.projets.length > 1) {
      const updated = formData.partenariats.projets.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        partenariats: { ...prev.partenariats, projets: updated }
      }));
    }
  };

  const toggleProjet = (index) => {
    setExpandedProjets(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleProjetChange = (index, field, value) => {
    const updated = [...formData.partenariats.projets];
    updated[index][field] = value;
    setFormData(prev => ({
      ...prev,
      partenariats: { ...prev.partenariats, projets: updated }
    }));
  };

  // Qualification des responsables
  const handleQualificationChange = (index, field, value) => {
    const updated = [...formData.qualificationResponsables];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, qualificationResponsables: updated }));
  };

  // Enseignants dédiés
  const addEnseignantDedie = () => {
    setFormData(prev => ({
      ...prev,
      enseignantsDedies: [...prev.enseignantsDedies, { nom: "", prenom: "", statut: "", diplome: "", specialite: "", ue_enseignees: "", charge_annuelle: "", cv: null, diplome_file: null, lettre_engagement: null }]
    }));
  };

  const removeEnseignantDedie = (index) => {
    if (formData.enseignantsDedies.length > 1) {
      const updated = formData.enseignantsDedies.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, enseignantsDedies: updated }));
    }
  };

  const toggleEnseignantDedie = (index) => {
    setExpandedEnseignantsDedies(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleEnseignantDedieChange = (index, field, value) => {
    const updated = [...formData.enseignantsDedies];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, enseignantsDedies: updated }));
  };

  const progressPercentage =
    formSteps.length > 1
      ? ((currentStep - 1) / (formSteps.length - 1)) * 100
      : 0;

  // Options pour les domaines
  const domaines = [
    { value: "ST", label: "Sciences et Technologies (ST)" },
    { value: "ALSH", label: "Arts, Lettres et Sciences humaines (ALSH)" },
    { value: "SEd", label: "Sciences de l'éducation (SEd)" },
    { value: "SI", label: "Sciences de l'ingénieur (SI)" },
    { value: "SSa", label: "Sciences de la Santé (SSa)" },
    { value: "SSo", label: "Sciences de la Société (SSo)" }
  ];

  const grades = [
    { value: "L", label: "Licence (L)" },
    { value: "M", label: "Master (M)" },
    { value: "LM", label: "Licence et Master (L&M)" }
  ];

  const typesIntervention = [
    { value: "CM", label: "Cours Magistraux (CM)" },
    { value: "TD", label: "Travaux Dirigés (TD)" },
    { value: "TP", label: "Travaux Pratiques (TP)" },
    { value: "CM+TD", label: "Cours Magistraux + Travaux Dirigés" },
    { value: "CM+TP", label: "Cours Magistraux + Travaux Pratiques" },
    { value: "TD+TP", label: "Travaux Dirigés + Travaux Pratiques" },
    { value: "CM+TD+TP", label: "Tous types d'intervention" }
  ];

  const statutsEnseignant = [
    { value: "permanent", label: "Permanent" },
    { value: "vacataire", label: "Vacataire" }
  ];

  const renderFormContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Message d'information */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <FaInfoCircle className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-700 text-sm">
                    Veuillez renseigner toutes les informations concernant votre institution.
                    Les champs marqués d'un astérisque (*) sont obligatoires.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 1.1 - Informations institutionnelles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                onClick={() => toggleSection('infoInstitutionnelles')}
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    1.1 Informations institutionnelles
                  </h3>
                </div>
                <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors">
                  {expandedSections.infoInstitutionnelles ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                </button>
              </div>

              {expandedSections.infoInstitutionnelles && (
                <div className="p-6 space-y-6">
                  {/* Coordonnées */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Nom de l'institution <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.institution.nom}
                        onChange={(e) => handleInstitutionChange('nom', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Université d'Antananarivo"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Adresse
                      </label>
                      <input
                        type="text"
                        value={formData.institution.adresse}
                        onChange={(e) => handleInstitutionChange('adresse', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Adresse complète"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Téléphone
                      </label>
                      <input
                        type="text"
                        value={formData.institution.telephone}
                        onChange={(e) => handleInstitutionChange('telephone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+261 34 00 000 00"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.institution.email}
                        onChange={(e) => handleInstitutionChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="contact@institution.mg"
                      />
                    </div>
                  </div>

                  {/* Statut juridique */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Statut juridique <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.institution.statut_juridique}
                        onChange={(e) => handleInstitutionChange('statut_juridique', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Établissement public, privé etc."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Arrêté d'ouverture
                      </label>
                      <input
                        type="text"
                        value={formData.institution.arrete_ouverture}
                        onChange={(e) => handleInstitutionChange('arrete_ouverture', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="N° arrêté / Date"
                      />
                    </div>
                  </div>

                  {/* Responsable */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-md font-medium text-gray-700 mb-3">Responsable de l'institution</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                          Nom <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.institution.responsable_nom}
                          onChange={(e) => handleInstitutionChange('responsable_nom', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                          Prénoms <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.institution.responsable_prenoms}
                          onChange={(e) => handleInstitutionChange('responsable_prenoms', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                          Titre/Fonction
                        </label>
                        <input
                          type="text"
                          value={formData.institution.responsable_titre}
                          onChange={(e) => handleInstitutionChange('responsable_titre', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Ex: Président, Directeur etc."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mission et Vision */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Mission de l'institution
                      </label>
                      <textarea
                        value={formData.institution.mission}
                        onChange={(e) => handleInstitutionChange('mission', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Décrivez la mission de votre institution..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Vision de l'institution
                      </label>
                      <textarea
                        value={formData.institution.vision}
                        onChange={(e) => handleInstitutionChange('vision', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Décrivez la vision de votre institution..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Plan de développement opérationnel
                      </label>
                      <textarea
                        value={formData.institution.plan_developpement}
                        onChange={(e) => handleInstitutionChange('plan_developpement', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Décrivez votre plan de développement..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Date d'approbation du dossier
                      </label>
                      <input
                        type="date"
                        value={formData.institution.date_approbation}
                        onChange={(e) => handleInstitutionChange('date_approbation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Organigramme */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Organigramme de l'institution
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleInstitutionChange('organigramme', e.target.files)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      accept=".pdf,.jpg,.png"
                    />
                    <p className="text-xs text-gray-500">Format accepté: PDF, JPG, PNG</p>
                  </div>

                  {/* Tableau des critères */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-md font-medium text-gray-700 mb-3">Critères institutionnels</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Critère
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Justificatifs requis
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">
                              Demande officielle signée par les instances de l'institution
                            </td>
                            <td className="px-4 py-3 border-b">
                              <input
                                type="file"
                                onChange={(e) => handleCriteresChange('demande_officielle', e.target.files)}
                                className="w-full text-sm"
                                accept=".pdf"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">
                              Cahier de charges institutionnel
                            </td>
                            <td className="px-4 py-3 border-b">
                              <input
                                type="file"
                                onChange={(e) => handleCriteresChange('cahier_charges', e.target.files)}
                                className="w-full text-sm"
                                accept=".pdf"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              Dispositif de gouvernance académique
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="file"
                                onChange={(e) => handleCriteresChange('dispositif_gouvernance', e.target.files)}
                                className="w-full text-sm"
                                accept=".pdf"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 1.2 - Offres de formations existantes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                onClick={() => toggleSection('offresFormations')}
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    1.2 Offres de formations existantes
                  </h3>
                </div>
                <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors">
                  {expandedSections.offresFormations ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                </button>
              </div>

              {expandedSections.offresFormations && (
                <div className="p-6 space-y-8">
                  {/* 1.2.1 Domaines et grades */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">1.2.1 Domaines et grades</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Renseignez les grades proposés pour chaque domaine ainsi que les responsables.
                    </p>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Domaines
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Grades proposés
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b" colSpan="4">
                              Noms des responsables et coordonnées
                            </th>
                          </tr>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 border-b"></th>
                            <th className="px-4 py-2 border-b"></th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500 border-b">Nom</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500 border-b">Prénoms</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500 border-b">Email</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500 border-b">Téléphone</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {formData.domainesGrades.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">
                                {domaines.find(d => d.value === item.domaine)?.label || item.domaine}
                              </td>
                              <td className="px-4 py-3 border-b">
                                <div className="space-y-1">
                                  <select
                                    value={item.grade_l}
                                    onChange={(e) => handleDomaineGradeChange(index, 'grade_l', e.target.value)}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                  >
                                    <option value="">Licence (L)</option>
                                    <option value="L">Oui</option>
                                    <option value="">Non</option>
                                  </select>
                                  <select
                                    value={item.grade_m}
                                    onChange={(e) => handleDomaineGradeChange(index, 'grade_m', e.target.value)}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                  >
                                    <option value="">Master (M)</option>
                                    <option value="M">Oui</option>
                                    <option value="">Non</option>
                                  </select>
                                </div>
                              </td>
                              <td className="px-4 py-3 border-b">
                                <input
                                  type="text"
                                  value={item.responsable_nom}
                                  onChange={(e) => handleDomaineGradeChange(index, 'responsable_nom', e.target.value)}
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                  placeholder="Nom"
                                />
                              </td>
                              <td className="px-4 py-3 border-b">
                                <input
                                  type="text"
                                  value={item.responsable_prenoms}
                                  onChange={(e) => handleDomaineGradeChange(index, 'responsable_prenoms', e.target.value)}
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                  placeholder="Prénoms"
                                />
                              </td>
                              <td className="px-4 py-3 border-b">
                                <input
                                  type="email"
                                  value={item.email}
                                  onChange={(e) => handleDomaineGradeChange(index, 'email', e.target.value)}
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                  placeholder="Email"
                                />
                              </td>
                              <td className="px-4 py-3 border-b">
                                <input
                                  type="text"
                                  value={item.telephone}
                                  onChange={(e) => handleDomaineGradeChange(index, 'telephone', e.target.value)}
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                  placeholder="Téléphone"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 1.2.2 Mentions */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-md font-medium text-gray-700 mb-3">1.2.2 Mentions</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Renseignez les mentions proposées avec leurs responsables.
                    </p>

                    <div className="space-y-4">
                      {formData.mentions.map((mention, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div
                            className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                            onClick={() => toggleMention(index)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                              </div>
                              <h5 className="font-medium text-gray-800">
                                Mention {mention.mention || `Mention ${index + 1}`}
                              </h5>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeMention(index);
                                }}
                                className={`p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors ${formData.mentions.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={formData.mentions.length <= 1}
                              >
                                <FaTimes size={14} />
                              </button>
                              <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
                                {expandedMentions[index] ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                              </button>
                            </div>
                          </div>

                          {expandedMentions[index] && (
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">
                                    Domaine <span className="text-red-500">*</span>
                                  </label>
                                  <select
                                    value={mention.domaine}
                                    onChange={(e) => handleMentionChange(index, 'domaine', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  >
                                    <option value="">Sélectionnez un domaine</option>
                                    {domaines.map(d => (
                                      <option key={d.value} value={d.value}>{d.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">
                                    Grade <span className="text-red-500">*</span>
                                  </label>
                                  <select
                                    value={mention.grade}
                                    onChange={(e) => handleMentionChange(index, 'grade', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  >
                                    <option value="">Sélectionnez un grade</option>
                                    {grades.map(g => (
                                      <option key={g.value} value={g.value}>{g.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">
                                    Intitulé de la mention <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={mention.mention}
                                    onChange={(e) => handleMentionChange(index, 'mention', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Ex: Informatique"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">
                                    Établissement de rattachement
                                  </label>
                                  <input
                                    type="text"
                                    value={mention.etablissement}
                                    onChange={(e) => handleMentionChange(index, 'etablissement', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Nom de l'établissement"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">
                                    Nom du responsable
                                  </label>
                                  <input
                                    type="text"
                                    value={mention.responsable_nom}
                                    onChange={(e) => handleMentionChange(index, 'responsable_nom', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Nom"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">
                                    Prénoms du responsable
                                  </label>
                                  <input
                                    type="text"
                                    value={mention.responsable_prenoms}
                                    onChange={(e) => handleMentionChange(index, 'responsable_prenoms', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Prénoms"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">
                                    Email
                                  </label>
                                  <input
                                    type="email"
                                    value={mention.email}
                                    onChange={(e) => handleMentionChange(index, 'email', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="email@exemple.com"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">
                                    Téléphone
                                  </label>
                                  <input
                                    type="text"
                                    value={mention.telephone}
                                    onChange={(e) => handleMentionChange(index, 'telephone', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="+261 34 00 000 00"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addMention}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full"
                      >
                        <FaPlus size={14} />
                        <span>Ajouter une mention</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 1.3 - Ressources humaines */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                onClick={() => toggleSection('ressourcesHumaines')}
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    1.3 Ressources humaines
                  </h3>
                </div>
                <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors">
                  {expandedSections.ressourcesHumaines ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                </button>
              </div>

              {expandedSections.ressourcesHumaines && (
                <div className="p-6 space-y-8">
                  {/* 1.3.1 Enseignants permanents */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">1.3.1 Enseignants permanents</h4>
                    
                    <div className="space-y-4">
                      {formData.enseignantsPermanents.map((ens, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div
                            className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                            onClick={() => togglePermanent(index)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                              </div>
                              <h5 className="font-medium text-gray-800">
                                {ens.nom && ens.prenom ? `${ens.nom} ${ens.prenom}` : `Enseignant ${index + 1}`}
                              </h5>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeEnseignantPermanent(index);
                                }}
                                className={`p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors ${formData.enseignantsPermanents.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={formData.enseignantsPermanents.length <= 1}
                              >
                                <FaTimes size={14} />
                              </button>
                              <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
                                {expandedPermanents[index] ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                              </button>
                            </div>
                          </div>

                          {expandedPermanents[index] && (
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Nom</label>
                                  <input
                                    type="text"
                                    value={ens.nom}
                                    onChange={(e) => handlePermanentChange(index, 'nom', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Prénom</label>
                                  <input
                                    type="text"
                                    value={ens.prenom}
                                    onChange={(e) => handlePermanentChange(index, 'prenom', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Diplôme</label>
                                  <input
                                    type="text"
                                    value={ens.diplome}
                                    onChange={(e) => handlePermanentChange(index, 'diplome', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Ex: Doctorat"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Grade</label>
                                  <input
                                    type="text"
                                    value={ens.grade}
                                    onChange={(e) => handlePermanentChange(index, 'grade', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Ex: Professeur, Maître de conférences"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Spécialité</label>
                                  <input
                                    type="text"
                                    value={ens.specialite}
                                    onChange={(e) => handlePermanentChange(index, 'specialite', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Ex: Informatique"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Mention de rattachement</label>
                                  <input
                                    type="text"
                                    value={ens.mention_rattachement}
                                    onChange={(e) => handlePermanentChange(index, 'mention_rattachement', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Ex: Informatique"
                                  />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700">Type d'intervention</label>
                                  <select
                                    value={ens.type_intervention}
                                    onChange={(e) => handlePermanentChange(index, 'type_intervention', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  >
                                    <option value="">Sélectionnez le type</option>
                                    {typesIntervention.map(t => (
                                      <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addEnseignantPermanent}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full"
                      >
                        <FaPlus size={14} />
                        <span>Ajouter un enseignant permanent</span>
                      </button>
                    </div>
                  </div>

                  {/* 1.3.2 Enseignants vacataires */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-md font-medium text-gray-700 mb-3">1.3.2 Enseignants vacataires</h4>
                    
                    <div className="space-y-4">
                      {formData.enseignantsVacataires.map((ens, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div
                            className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                            onClick={() => toggleVacataire(index)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                              </div>
                              <h5 className="font-medium text-gray-800">
                                {ens.nom && ens.prenom ? `${ens.nom} ${ens.prenom}` : `Vacataire ${index + 1}`}
                              </h5>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeEnseignantVacataire(index);
                                }}
                                className={`p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors ${formData.enseignantsVacataires.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={formData.enseignantsVacataires.length <= 1}
                              >
                                <FaTimes size={14} />
                              </button>
                              <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
                                {expandedVacataires[index] ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                              </button>
                            </div>
                          </div>

                          {expandedVacataires[index] && (
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Nom</label>
                                  <input
                                    type="text"
                                    value={ens.nom}
                                    onChange={(e) => handleVacataireChange(index, 'nom', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Prénom</label>
                                  <input
                                    type="text"
                                    value={ens.prenom}
                                    onChange={(e) => handleVacataireChange(index, 'prenom', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Diplôme</label>
                                  <input
                                    type="text"
                                    value={ens.diplome}
                                    onChange={(e) => handleVacataireChange(index, 'diplome', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Grade</label>
                                  <input
                                    type="text"
                                    value={ens.grade}
                                    onChange={(e) => handleVacataireChange(index, 'grade', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Spécialité</label>
                                  <input
                                    type="text"
                                    value={ens.specialite}
                                    onChange={(e) => handleVacataireChange(index, 'specialite', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Mention de rattachement</label>
                                  <input
                                    type="text"
                                    value={ens.mention_rattachement}
                                    onChange={(e) => handleVacataireChange(index, 'mention_rattachement', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700">Type d'intervention</label>
                                  <select
                                    value={ens.type_intervention}
                                    onChange={(e) => handleVacataireChange(index, 'type_intervention', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  >
                                    <option value="">Sélectionnez le type</option>
                                    {typesIntervention.map(t => (
                                      <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addEnseignantVacataire}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full"
                      >
                        <FaPlus size={14} />
                        <span>Ajouter un enseignant vacataire</span>
                      </button>
                    </div>
                  </div>

                  {/* 1.3.3 Personnel administratif et technique */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-md font-medium text-gray-700 mb-3">1.3.3 Personnel administratif et technique</h4>
                    
                    <div className="space-y-4">
                      {formData.personnelAT.map((pers, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div
                            className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                            onClick={() => togglePersonnel(index)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                              </div>
                              <h5 className="font-medium text-gray-800">
                                {pers.fonction || `Personnel ${index + 1}`}
                              </h5>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removePersonnel(index);
                                }}
                                className={`p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors ${formData.personnelAT.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={formData.personnelAT.length <= 1}
                              >
                                <FaTimes size={14} />
                              </button>
                              <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
                                {expandedPersonnel[index] ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                              </button>
                            </div>
                          </div>

                          {expandedPersonnel[index] && (
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Fonction</label>
                                  <input
                                    type="text"
                                    value={pers.fonction}
                                    onChange={(e) => handlePersonnelChange(index, 'fonction', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Ex: Bibliothécaire"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Effectif</label>
                                  <input
                                    type="number"
                                    value={pers.effectif}
                                    onChange={(e) => handlePersonnelChange(index, 'effectif', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Nombre"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Affectation</label>
                                  <input
                                    type="text"
                                    value={pers.affectation}
                                    onChange={(e) => handlePersonnelChange(index, 'affectation', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Service/ Département"
                                  />
                                </div>
                                <div className="space-y-1.5 md:col-span-3">
                                  <label className="block text-xs font-medium text-gray-700">Preuves</label>
                                  <input
                                    type="file"
                                    onChange={(e) => handlePersonnelChange(index, 'preuves', e.target.files)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addPersonnel}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full"
                      >
                        <FaPlus size={14} />
                        <span>Ajouter un personnel</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 1.4 - Infrastructures */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                onClick={() => toggleSection('infrastructures')}
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    1.4 Infrastructures
                  </h3>
                </div>
                <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors">
                  {expandedSections.infrastructures ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                </button>
              </div>

              {expandedSections.infrastructures && (
                <div className="p-6 space-y-8">
                  {/* 1.4.1 Salles de cours */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">1.4.1 Salles de cours</h4>
                    
                    <div className="space-y-4">
                      {formData.sallesCours.map((salle, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div
                            className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                            onClick={() => toggleSalle(index)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                              </div>
                              <h5 className="font-medium text-gray-800">
                                Capacité {salle.capacite}
                              </h5>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSalle(index);
                                }}
                                className={`p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors ${formData.sallesCours.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={formData.sallesCours.length <= 1}
                              >
                                <FaTimes size={14} />
                              </button>
                              <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
                                {expandedSalles[index] ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                              </button>
                            </div>
                          </div>

                          {expandedSalles[index] && (
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Capacité</label>
                                  <select
                                    value={salle.capacite}
                                    onChange={(e) => handleSalleChange(index, 'capacite', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  >
                                    <option value="0–20">0–20 places</option>
                                    <option value="20–50">20–50 places</option>
                                    <option value="50–100">50–100 places</option>
                                    <option value="100–300">100–300 places</option>
                                    <option value=">300">Plus de 300 places</option>
                                  </select>
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Nombre de salles</label>
                                  <input
                                    type="number"
                                    value={salle.nombre}
                                    onChange={(e) => handleSalleChange(index, 'nombre', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Ex: 5"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Équipement</label>
                                  <input
                                    type="text"
                                    value={salle.equipement}
                                    onChange={(e) => handleSalleChange(index, 'equipement', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="VP, tableau, etc."
                                  />
                                </div>
                                <div className="space-y-1.5 md:col-span-3">
                                  <label className="block text-xs font-medium text-gray-700">Preuves (photos, inventaire)</label>
                                  <input
                                    type="file"
                                    onChange={(e) => handleSalleChange(index, 'preuves', e.target.files)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addSalle}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full"
                      >
                        <FaPlus size={14} />
                        <span>Ajouter une catégorie de salle</span>
                      </button>
                    </div>
                  </div>

                  {/* 1.4.2 Laboratoires pédagogiques */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-md font-medium text-gray-700 mb-3">1.4.2 Laboratoires pédagogiques / équipements</h4>
                    
                    <div className="space-y-4">
                      {formData.laboratoires.map((labo, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div
                            className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                            onClick={() => toggleLaboratoire(index)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                              </div>
                              <h5 className="font-medium text-gray-800">
                                {labo.designation || `Équipement ${index + 1}`}
                              </h5>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeLaboratoire(index);
                                }}
                                className={`p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors ${formData.laboratoires.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={formData.laboratoires.length <= 1}
                              >
                                <FaTimes size={14} />
                              </button>
                              <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
                                {expandedLabos[index] ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                              </button>
                            </div>
                          </div>

                          {expandedLabos[index] && (
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Désignation de l'équipement</label>
                                  <input
                                    type="text"
                                    value={labo.designation}
                                    onChange={(e) => handleLaboratoireChange(index, 'designation', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Ex: Microscope optique"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Nombre</label>
                                  <input
                                    type="number"
                                    value={labo.nombre}
                                    onChange={(e) => handleLaboratoireChange(index, 'nombre', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Quantité"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">État</label>
                                  <input
                                    type="text"
                                    value={labo.etat}
                                    onChange={(e) => handleLaboratoireChange(index, 'etat', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Bon état, neuf, etc."
                                  />
                                </div>
                                <div className="space-y-1.5 md:col-span-3">
                                  <label className="block text-xs font-medium text-gray-700">Preuves</label>
                                  <input
                                    type="file"
                                    onChange={(e) => handleLaboratoireChange(index, 'preuves', e.target.files)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addLaboratoire}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full"
                      >
                        <FaPlus size={14} />
                        <span>Ajouter un équipement</span>
                      </button>
                    </div>
                  </div>

                  {/* 1.4.3 Bibliothèque et documentation */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-md font-medium text-gray-700 mb-3">1.4.3 Bibliothèque et documentation</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-gray-700">Fonds/Documentation</label>
                          <textarea
                            value={formData.bibliotheque.fonds}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              bibliotheque: { ...prev.bibliotheque, fonds: e.target.value }
                            }))}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Décrivez les ressources documentaires disponibles (livres, revues, etc.)"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-gray-700">Capacité (places)</label>
                          <input
                            type="number"
                            value={formData.bibliotheque.capacite}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              bibliotheque: { ...prev.bibliotheque, capacite: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Nombre de places assises"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Preuves</label>
                        <input
                          type="file"
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            bibliotheque: { ...prev.bibliotheque, preuves: e.target.files }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 1.4.4 Infrastructures numériques & hygiène/sécurité */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-md font-medium text-gray-700 mb-3">1.4.4 Infrastructures numériques & hygiène/sécurité</h4>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Item
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Disponibilité
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Standard attendu
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Preuves
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">Salle informatique</td>
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={formData.infrastructuresNumeriques.salle_informatique.disponible}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  infrastructuresNumeriques: {
                                    ...prev.infrastructuresNumeriques,
                                    salle_informatique: {
                                      ...prev.infrastructuresNumeriques.salle_informatique,
                                      disponible: e.target.checked
                                    }
                                  }
                                }))}
                                className="w-4 h-4 text-blue-600"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={formData.infrastructuresNumeriques.salle_informatique.standard}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  infrastructuresNumeriques: {
                                    ...prev.infrastructuresNumeriques,
                                    salle_informatique: {
                                      ...prev.infrastructuresNumeriques.salle_informatique,
                                      standard: e.target.value
                                    }
                                  }
                                }))}
                                placeholder="Postes fonctionnels; logiciels requis"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="file"
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  infrastructuresNumeriques: {
                                    ...prev.infrastructuresNumeriques,
                                    salle_informatique: {
                                      ...prev.infrastructuresNumeriques.salle_informatique,
                                      preuves: e.target.files
                                    }
                                  }
                                }))}
                                className="text-sm"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">Connectivité Internet</td>
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={formData.infrastructuresNumeriques.connectivite.disponible}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  infrastructuresNumeriques: {
                                    ...prev.infrastructuresNumeriques,
                                    connectivite: {
                                      ...prev.infrastructuresNumeriques.connectivite,
                                      disponible: e.target.checked
                                    }
                                  }
                                }))}
                                className="w-4 h-4 text-blue-600"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={formData.infrastructuresNumeriques.connectivite.standard}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  infrastructuresNumeriques: {
                                    ...prev.infrastructuresNumeriques,
                                    connectivite: {
                                      ...prev.infrastructuresNumeriques.connectivite,
                                      standard: e.target.value
                                    }
                                  }
                                }))}
                                placeholder="≥ 1 Mbps/étudiant"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="file"
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  infrastructuresNumeriques: {
                                    ...prev.infrastructuresNumeriques,
                                    connectivite: {
                                      ...prev.infrastructuresNumeriques.connectivite,
                                      preuves: e.target.files
                                    }
                                  }
                                }))}
                                className="text-sm"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">LMS (ex. Moodle)</td>
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={formData.infrastructuresNumeriques.lms.disponible}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  infrastructuresNumeriques: {
                                    ...prev.infrastructuresNumeriques,
                                    lms: {
                                      ...prev.infrastructuresNumeriques.lms,
                                      disponible: e.target.checked
                                    }
                                  }
                                }))}
                                className="w-4 h-4 text-blue-600"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={formData.infrastructuresNumeriques.lms.standard}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  infrastructuresNumeriques: {
                                    ...prev.infrastructuresNumeriques,
                                    lms: {
                                      ...prev.infrastructuresNumeriques.lms,
                                      standard: e.target.value
                                    }
                                  }
                                }))}
                                placeholder="Accès opérationnel"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="file"
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  infrastructuresNumeriques: {
                                    ...prev.infrastructuresNumeriques,
                                    lms: {
                                      ...prev.infrastructuresNumeriques.lms,
                                      preuves: e.target.files
                                    }
                                  }
                                }))}
                                className="text-sm"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">Sanitaires / issues de secours</td>
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={formData.infrastructuresNumeriques.sanitaires.disponible}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  infrastructuresNumeriques: {
                                    ...prev.infrastructuresNumeriques,
                                    sanitaires: {
                                      ...prev.infrastructuresNumeriques.sanitaires,
                                      disponible: e.target.checked
                                    }
                                  }
                                }))}
                                className="w-4 h-4 text-blue-600"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={formData.infrastructuresNumeriques.sanitaires.standard}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  infrastructuresNumeriques: {
                                    ...prev.infrastructuresNumeriques,
                                    sanitaires: {
                                      ...prev.infrastructuresNumeriques.sanitaires,
                                      standard: e.target.value
                                    }
                                  }
                                }))}
                                placeholder="Conformes, signalétique"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="file"
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  infrastructuresNumeriques: {
                                    ...prev.infrastructuresNumeriques,
                                    sanitaires: {
                                      ...prev.infrastructuresNumeriques.sanitaires,
                                      preuves: e.target.files
                                    }
                                  }
                                }))}
                                className="text-sm"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900">Énergie / solution alternative</td>
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={formData.infrastructuresNumeriques.energie.disponible}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  infrastructuresNumeriques: {
                                    ...prev.infrastructuresNumeriques,
                                    energie: {
                                      ...prev.infrastructuresNumeriques.energie,
                                      disponible: e.target.checked
                                    }
                                  }
                                }))}
                                className="w-4 h-4 text-blue-600"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={formData.infrastructuresNumeriques.energie.standard}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  infrastructuresNumeriques: {
                                    ...prev.infrastructuresNumeriques,
                                    energie: {
                                      ...prev.infrastructuresNumeriques.energie,
                                      standard: e.target.value
                                    }
                                  }
                                }))}
                                placeholder="Stabilité ou solution de secours"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="file"
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  infrastructuresNumeriques: {
                                    ...prev.infrastructuresNumeriques,
                                    energie: {
                                      ...prev.infrastructuresNumeriques.energie,
                                      preuves: e.target.files
                                    }
                                  }
                                }))}
                                className="text-sm"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 1.5 - Statistiques institutionnelles actuelles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                onClick={() => toggleSection('statistiques')}
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    1.5 Statistiques institutionnelles actuelles
                  </h3>
                </div>
                <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors">
                  {expandedSections.statistiques ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                </button>
              </div>

              {expandedSections.statistiques && (
                <div className="p-6 space-y-6">
                  <p className="text-sm text-gray-600">
                    Renseignez les statistiques pour chaque parcours de formation.
                  </p>

                  <div className="space-y-4">
                    {formData.statistiques.map((stat, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                          className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                          onClick={() => toggleStatistique(index)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                              <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                            </div>
                            <h5 className="font-medium text-gray-800">
                              {stat.domaine && stat.mention ? `${stat.domaine} - ${stat.mention}` : `Statistique ${index + 1}`}
                            </h5>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeStatistique(index);
                              }}
                              className={`p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors ${formData.statistiques.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                              disabled={formData.statistiques.length <= 1}
                            >
                              <FaTimes size={14} />
                            </button>
                            <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
                              {expandedStats[index] ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                            </button>
                          </div>
                        </div>

                        {expandedStats[index] && (
                          <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-700">Domaine</label>
                                <select
                                  value={stat.domaine}
                                  onChange={(e) => handleStatistiqueChange(index, 'domaine', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                >
                                  <option value="">Sélectionnez un domaine</option>
                                  {domaines.map(d => (
                                    <option key={d.value} value={d.value}>{d.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-700">Mention</label>
                                <input
                                  type="text"
                                  value={stat.mention}
                                  onChange={(e) => handleStatistiqueChange(index, 'mention', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  placeholder="Ex: Informatique"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-700">Parcours</label>
                                <input
                                  type="text"
                                  value={stat.parcours}
                                  onChange={(e) => handleStatistiqueChange(index, 'parcours', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  placeholder="Ex: Génie Logiciel"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-700">Étudiants inscrits</label>
                                <input
                                  type="number"
                                  value={stat.etudiants}
                                  onChange={(e) => handleStatistiqueChange(index, 'etudiants', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  placeholder="Nombre"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-700">Enseignants permanents</label>
                                <input
                                  type="number"
                                  value={stat.enseignants_perm}
                                  onChange={(e) => handleStatistiqueChange(index, 'enseignants_perm', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  placeholder="Nombre"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-700">Enseignants vacataires</label>
                                <input
                                  type="number"
                                  value={stat.enseignants_vac}
                                  onChange={(e) => handleStatistiqueChange(index, 'enseignants_vac', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  placeholder="Nombre"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-gray-700">Ratio étudiants/enseignant permanent</label>
                                <input
                                  type="text"
                                  value={stat.ratio}
                                  onChange={(e) => handleStatistiqueChange(index, 'ratio', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  placeholder="Calcul automatique"
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addStatistique}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full"
                    >
                      <FaPlus size={14} />
                      <span>Ajouter une statistique</span>
                    </button>
                  </div>

                  {/* Indicateurs clés */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-md font-medium text-gray-700 mb-3">Indicateurs clés</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h5 className="text-sm font-medium text-blue-800 mb-1">Ratio enseignants permanents / étudiants</h5>
                        <p className="text-2xl font-bold text-blue-900">
                          {formData.statistiques.reduce((acc, stat) => {
                            const etu = parseInt(stat.etudiants) || 0;
                            const perm = parseInt(stat.enseignants_perm) || 0;
                            return acc + (perm > 0 ? etu / perm : 0);
                          }, 0).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h5 className="text-sm font-medium text-green-800 mb-1">% enseignements par spécialistes</h5>
                        <p className="text-2xl font-bold text-green-900">À calculer</p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h5 className="text-sm font-medium text-purple-800 mb-1">Tendance évolution effectifs</h5>
                        <p className="text-2xl font-bold text-purple-900">À renseigner</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            {/* Message d'information */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <FaInfoCircle className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-700 text-sm">
                    Démontrez l'utilité sociale et économique de la formation, l'alignement aux besoins du territoire 
                    et l'articulation avec l'offre existante. Insistez sur la qualité des données et preuves fournies 
                    (étude signée, sources officielles).
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 2.1 - Etude socio-économique */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                onClick={() => toggleSection('etudeSocioEconomique')}
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    2.1 Etude socio-économique de la nouvelle offre de formation
                  </h3>
                </div>
                <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors">
                  {expandedSections.etudeSocioEconomique ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                </button>
              </div>

              {expandedSections.etudeSocioEconomique && (
                <div className="p-6 space-y-8">
                  {/* 2.1.1 Etude de besoins régionale / nationale */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-4">2.1.1 Etude de besoins régionale / nationale</h4>
                    
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                          Diagnostic des besoins <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.etudeBesoins.diagnostic}
                          onChange={(e) => handleEtudeBesoinsChange('diagnostic', e.target.value)}
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Décrivez les besoins identifiés au niveau régional et national..."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                          Cartographie des débouchés
                        </label>
                        <textarea
                          value={formData.etudeBesoins.debouches}
                          onChange={(e) => handleEtudeBesoinsChange('debouches', e.target.value)}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Décrivez les débouchés professionnels visés..."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                          Profils visés
                        </label>
                        <textarea
                          value={formData.etudeBesoins.profils_vises}
                          onChange={(e) => handleEtudeBesoinsChange('profils_vises', e.target.value)}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Décrivez les profils d'étudiants visés par cette formation..."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                          Analyse des formations similaires
                        </label>
                        <textarea
                          value={formData.etudeBesoins.analyse_similaires}
                          onChange={(e) => handleEtudeBesoinsChange('analyse_similaires', e.target.value)}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Analyse comparative avec les formations existantes similaires..."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                          Justification d'opportunité
                        </label>
                        <textarea
                          value={formData.etudeBesoins.justification_opportunite}
                          onChange={(e) => handleEtudeBesoinsChange('justification_opportunite', e.target.value)}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Justifiez l'opportunité de créer cette nouvelle formation..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-gray-700">
                            Tableau comparatif
                          </label>
                          <input
                            type="file"
                            onChange={(e) => handleEtudeBesoinsChange('tableau_comparatif', e.target.files)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            accept=".pdf,.xlsx,.docx"
                          />
                          <p className="text-xs text-gray-500">Format accepté: PDF, Excel, Word</p>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-gray-700">
                            Lettres d'appui
                          </label>
                          <input
                            type="file"
                            onChange={(e) => handleEtudeBesoinsChange('lettres_appui', e.target.files)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            accept=".pdf"
                            multiple
                          />
                          <p className="text-xs text-gray-500">Lettres d'appui des partenaires socio-économiques</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2.1.2 Effectifs prévisionnels */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-md font-medium text-gray-700 mb-4">2.1.2 Effectifs prévisionnels</h4>
                    
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Semestre
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Effectif prévisionnel
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Justification / Capacité d'accueil
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {formData.effectifsPrevisionnels.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">
                                {item.semestre}
                              </td>
                              <td className="px-4 py-3 border-b">
                                <input
                                  type="number"
                                  value={item.effectif}
                                  onChange={(e) => handleEffectifPrevisionnelChange(index, 'effectif', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  placeholder="Nombre d'étudiants"
                                />
                              </td>
                              <td className="px-4 py-3 border-b">
                                <input
                                  type="text"
                                  value={item.justification}
                                  onChange={(e) => handleEffectifPrevisionnelChange(index, 'justification', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  placeholder="Justification par rapport à la capacité d'accueil"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-6">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Séries de projection et hypothèses</h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-gray-700">Année 1</label>
                          <input
                            type="number"
                            value={formData.projections.annee1}
                            onChange={(e) => handleProjectionsChange('annee1', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Effectif prévu"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-gray-700">Année 2</label>
                          <input
                            type="number"
                            value={formData.projections.annee2}
                            onChange={(e) => handleProjectionsChange('annee2', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Effectif prévu"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-gray-700">Année 3</label>
                          <input
                            type="number"
                            value={formData.projections.annee3}
                            onChange={(e) => handleProjectionsChange('annee3', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Effectif prévu"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-gray-700">Année 4</label>
                          <input
                            type="number"
                            value={formData.projections.annee4}
                            onChange={(e) => handleProjectionsChange('annee4', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Effectif prévu"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-gray-700">Année 5</label>
                          <input
                            type="number"
                            value={formData.projections.annee5}
                            onChange={(e) => handleProjectionsChange('annee5', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Effectif prévu"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                          Hypothèses de projection
                        </label>
                        <textarea
                          value={formData.projections.hypotheses}
                          onChange={(e) => handleProjectionsChange('hypotheses', e.target.value)}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Décrivez les hypothèses retenues pour ces projections (taux de réussite, taux de passage, etc.)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2.1.3 Partenariats pour les nouvelles offres de formations */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-md font-medium text-gray-700 mb-4">2.1.3 Partenariats pour les nouvelles offres de formations</h4>
                    
                    {/* Partenaires académiques */}
                    <div className="mb-6">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Partenaires académiques</h5>
                      
                      <div className="space-y-4">
                        {formData.partenariats.academiques.map((partenaire, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div
                              className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                              onClick={() => togglePartenaireAcademique(index)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                  <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                                </div>
                                <h6 className="font-medium text-gray-800">
                                  {partenaire.nom_partenaire || `Partenaire ${index + 1}`}
                                </h6>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removePartenaireAcademique(index);
                                  }}
                                  className={`p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors ${formData.partenariats.academiques.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                  disabled={formData.partenariats.academiques.length <= 1}
                                >
                                  <FaTimes size={14} />
                                </button>
                                <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
                                  {expandedPartenairesAcad[index] ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                                </button>
                              </div>
                            </div>

                            {expandedPartenairesAcad[index] && (
                              <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-gray-700">Nom du partenaire</label>
                                    <input
                                      type="text"
                                      value={partenaire.nom_partenaire}
                                      onChange={(e) => handlePartenaireAcademiqueChange(index, 'nom_partenaire', e.target.value)}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                      placeholder="Nom de l'université, institution"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-gray-700">Type de partenariat</label>
                                    <input
                                      type="text"
                                      value={partenaire.type_partenariat}
                                      onChange={(e) => handlePartenaireAcademiqueChange(index, 'type_partenariat', e.target.value)}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                      placeholder="Ex: Mobilité, co-diplomation"
                                    />
                                  </div>
                                  <div className="space-y-1.5 md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700">Convention</label>
                                    <input
                                      type="file"
                                      onChange={(e) => handlePartenaireAcademiqueChange(index, 'convention', e.target.files)}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                      accept=".pdf"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={addPartenaireAcademique}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full"
                        >
                          <FaPlus size={14} />
                          <span>Ajouter un partenaire académique</span>
                        </button>
                      </div>
                    </div>

                    {/* Conventions de stages */}
                    <div className="mb-6">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Conventions de stages</h5>
                      
                      <div className="space-y-4">
                        {formData.partenariats.stages.map((stage, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div
                              className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                              onClick={() => toggleStage(index)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                  <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                                </div>
                                <h6 className="font-medium text-gray-800">
                                  {stage.entreprise || `Stage ${index + 1}`}
                                </h6>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeStage(index);
                                  }}
                                  className={`p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors ${formData.partenariats.stages.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                  disabled={formData.partenariats.stages.length <= 1}
                                >
                                  <FaTimes size={14} />
                                </button>
                                <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
                                  {expandedStages[index] ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                                </button>
                              </div>
                            </div>

                            {expandedStages[index] && (
                              <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-gray-700">Entreprise / Organisation</label>
                                    <input
                                      type="text"
                                      value={stage.entreprise}
                                      onChange={(e) => handleStageChange(index, 'entreprise', e.target.value)}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                      placeholder="Nom de l'entreprise"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-gray-700">Secteur d'activité</label>
                                    <input
                                      type="text"
                                      value={stage.secteur}
                                      onChange={(e) => handleStageChange(index, 'secteur', e.target.value)}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                      placeholder="Ex: Industrie, Service"
                                    />
                                  </div>
                                  <div className="space-y-1.5 md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700">Convention de stage</label>
                                    <input
                                      type="file"
                                      onChange={(e) => handleStageChange(index, 'convention', e.target.files)}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                      accept=".pdf"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={addStage}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full"
                        >
                          <FaPlus size={14} />
                          <span>Ajouter une convention de stage</span>
                        </button>
                      </div>
                    </div>

                    {/* Projets */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Projets</h5>
                      
                      <div className="space-y-4">
                        {formData.partenariats.projets.map((projet, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div
                              className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                              onClick={() => toggleProjet(index)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                  <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                                </div>
                                <h6 className="font-medium text-gray-800">
                                  {projet.intitule_projet || `Projet ${index + 1}`}
                                </h6>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeProjet(index);
                                  }}
                                  className={`p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors ${formData.partenariats.projets.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                  disabled={formData.partenariats.projets.length <= 1}
                                >
                                  <FaTimes size={14} />
                                </button>
                                <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
                                  {expandedProjets[index] ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                                </button>
                              </div>
                            </div>

                            {expandedProjets[index] && (
                              <div className="p-4">
                                <div className="grid grid-cols-1 gap-4">
                                  <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-gray-700">Intitulé du projet</label>
                                    <input
                                      type="text"
                                      value={projet.intitule_projet}
                                      onChange={(e) => handleProjetChange(index, 'intitule_projet', e.target.value)}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                      placeholder="Nom du projet"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-gray-700">Partenaire</label>
                                    <input
                                      type="text"
                                      value={projet.partenaire}
                                      onChange={(e) => handleProjetChange(index, 'partenaire', e.target.value)}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                      placeholder="Partenaire impliqué"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="block text-xs font-medium text-gray-700">Description</label>
                                    <textarea
                                      value={projet.description}
                                      onChange={(e) => handleProjetChange(index, 'description', e.target.value)}
                                      rows="2"
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                      placeholder="Description du projet"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={addProjet}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full"
                        >
                          <FaPlus size={14} />
                          <span>Ajouter un projet</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2.3 - Ressources attribuées aux nouvelles offres de formation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                onClick={() => toggleSection('ressourcesAttribuees')}
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    2.3 Ressources attribuées aux nouvelles offres de formation
                  </h3>
                </div>
                <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors">
                  {expandedSections.ressourcesAttribuees ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                </button>
              </div>

              {expandedSections.ressourcesAttribuees && (
                <div className="p-6 space-y-8">
                  {/* 2.3.1 Qualification des responsables */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-4">2.3.1 Qualification des responsables</h4>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Domaines
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Grades
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Mentions
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Noms des responsables
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Diplômes et spécialités
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {formData.qualificationResponsables.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">
                                {domaines.find(d => d.value === item.domaine)?.label || item.domaine}
                              </td>
                              <td className="px-4 py-3 border-b">
                                <span className="text-sm">{item.grade}</span>
                              </td>
                              <td className="px-4 py-3 border-b">
                                <input
                                  type="text"
                                  value={item.mention}
                                  onChange={(e) => handleQualificationChange(index, 'mention', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  placeholder="Mention"
                                />
                              </td>
                              <td className="px-4 py-3 border-b">
                                <div className="space-y-1">
                                  <input
                                    type="text"
                                    value={item.responsable_nom}
                                    onChange={(e) => handleQualificationChange(index, 'responsable_nom', e.target.value)}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                    placeholder="Nom"
                                  />
                                  <input
                                    type="text"
                                    value={item.responsable_prenoms}
                                    onChange={(e) => handleQualificationChange(index, 'responsable_prenoms', e.target.value)}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                    placeholder="Prénoms"
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-3 border-b">
                                <div className="space-y-1">
                                  <input
                                    type="text"
                                    value={item.diplome}
                                    onChange={(e) => handleQualificationChange(index, 'diplome', e.target.value)}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                    placeholder="Diplôme"
                                  />
                                  <input
                                    type="text"
                                    value={item.specialite}
                                    onChange={(e) => handleQualificationChange(index, 'specialite', e.target.value)}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                    placeholder="Spécialité"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 2.3.2 Enseignants dédiés aux nouvelles offres de formations */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-md font-medium text-gray-700 mb-4">2.3.2 Enseignants dédiés aux nouvelles offres de formations</h4>
                    
                    <div className="space-y-4">
                      {formData.enseignantsDedies.map((enseignant, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div
                            className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                            onClick={() => toggleEnseignantDedie(index)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                <span className="text-blue-600 text-xs font-medium">{index + 1}</span>
                              </div>
                              <h5 className="font-medium text-gray-800">
                                {enseignant.nom && enseignant.prenom ? `${enseignant.nom} ${enseignant.prenom}` : `Enseignant ${index + 1}`}
                              </h5>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeEnseignantDedie(index);
                                }}
                                className={`p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors ${formData.enseignantsDedies.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={formData.enseignantsDedies.length <= 1}
                              >
                                <FaTimes size={14} />
                              </button>
                              <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
                                {expandedEnseignantsDedies[index] ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                              </button>
                            </div>
                          </div>

                          {expandedEnseignantsDedies[index] && (
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Nom</label>
                                  <input
                                    type="text"
                                    value={enseignant.nom}
                                    onChange={(e) => handleEnseignantDedieChange(index, 'nom', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Prénom</label>
                                  <input
                                    type="text"
                                    value={enseignant.prenom}
                                    onChange={(e) => handleEnseignantDedieChange(index, 'prenom', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Statut</label>
                                  <select
                                    value={enseignant.statut}
                                    onChange={(e) => handleEnseignantDedieChange(index, 'statut', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                  >
                                    <option value="">Sélectionnez le statut</option>
                                    {statutsEnseignant.map(s => (
                                      <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Diplôme</label>
                                  <input
                                    type="text"
                                    value={enseignant.diplome}
                                    onChange={(e) => handleEnseignantDedieChange(index, 'diplome', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Ex: Doctorat"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Spécialité</label>
                                  <input
                                    type="text"
                                    value={enseignant.specialite}
                                    onChange={(e) => handleEnseignantDedieChange(index, 'specialite', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Ex: Informatique"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">UE enseignées</label>
                                  <input
                                    type="text"
                                    value={enseignant.ue_enseignees}
                                    onChange={(e) => handleEnseignantDedieChange(index, 'ue_enseignees', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Ex: Programmation, Algorithmique"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Charge annuelle (heures)</label>
                                  <input
                                    type="number"
                                    value={enseignant.charge_annuelle}
                                    onChange={(e) => handleEnseignantDedieChange(index, 'charge_annuelle', e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    placeholder="Nombre d'heures"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">CV</label>
                                  <input
                                    type="file"
                                    onChange={(e) => handleEnseignantDedieChange(index, 'cv', e.target.files)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    accept=".pdf"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Diplômes</label>
                                  <input
                                    type="file"
                                    onChange={(e) => handleEnseignantDedieChange(index, 'diplome_file', e.target.files)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    accept=".pdf"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-medium text-gray-700">Lettre d'engagement</label>
                                  <input
                                    type="file"
                                    onChange={(e) => handleEnseignantDedieChange(index, 'lettre_engagement', e.target.files)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                    accept=".pdf"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addEnseignantDedie}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full"
                      >
                        <FaPlus size={14} />
                        <span>Ajouter un enseignant</span>
                      </button>
                    </div>

                    {/* Indicateurs */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Indicateurs</h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500">% d'UE assurées par spécialistes</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formData.enseignantsDedies.length > 0 ? 'À calculer' : '0%'}
                          </p>
                        </div>
                        
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500">Ratio étudiants/enseignant permanent</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formData.enseignantsDedies.filter(e => e.statut === 'permanent').length > 0 ? 'À calculer' : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-3">
                        NB: Les CV, Diplômes et Lettres d'engagement doivent être à jour et signés.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
  // ... (code existant jusqu'à case 2)

      case 3:
        return (
          <div className="space-y-6">
            {/* Message d'information */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <FaInfoCircle className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-700 text-sm">
                    Structurez votre offre de formation selon le système LMD : domaines, mentions, parcours et passerelles.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3.1 - Domaines et grades */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  3.1 Domaines et grades
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Donner les grades proposés pour chaque domaine
                </p>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Domaines
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Grades
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b" colSpan="4">
                          Noms des responsables avec leurs coordonnées
                        </th>
                      </tr>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 border-b"></th>
                        <th className="px-4 py-2 border-b"></th>
                        <th className="px-4 py-2 text-xs font-medium text-gray-500 border-b">Nom</th>
                        <th className="px-4 py-2 text-xs font-medium text-gray-500 border-b">Prénoms</th>
                        <th className="px-4 py-2 text-xs font-medium text-gray-500 border-b">Email</th>
                        <th className="px-4 py-2 text-xs font-medium text-gray-500 border-b">Téléphone</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.domainesGrades.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">
                            {domaines.find(d => d.value === item.domaine)?.label || item.domaine}
                          </td>
                          <td className="px-4 py-3 border-b">
                            <div className="space-y-1">
                              <select
                                value={item.grade_l}
                                onChange={(e) => handleDomaineGradeChange(index, 'grade_l', e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                              >
                                <option value="">Licence (L)</option>
                                <option value="L">Oui</option>
                                <option value="">Non</option>
                              </select>
                              <select
                                value={item.grade_m}
                                onChange={(e) => handleDomaineGradeChange(index, 'grade_m', e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                              >
                                <option value="">Master (M)</option>
                                <option value="M">Oui</option>
                                <option value="">Non</option>
                              </select>
                            </div>
                          </td>
                          <td className="px-4 py-3 border-b">
                            <input
                              type="text"
                              value={item.responsable_nom}
                              onChange={(e) => handleDomaineGradeChange(index, 'responsable_nom', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                              placeholder="Nom"
                            />
                          </td>
                          <td className="px-4 py-3 border-b">
                            <input
                              type="text"
                              value={item.responsable_prenoms}
                              onChange={(e) => handleDomaineGradeChange(index, 'responsable_prenoms', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                              placeholder="Prénoms"
                            />
                          </td>
                          <td className="px-4 py-3 border-b">
                            <input
                              type="email"
                              value={item.email}
                              onChange={(e) => handleDomaineGradeChange(index, 'email', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                              placeholder="Email"
                            />
                          </td>
                          <td className="px-4 py-3 border-b">
                            <input
                              type="text"
                              value={item.telephone}
                              onChange={(e) => handleDomaineGradeChange(index, 'telephone', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                              placeholder="Téléphone"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* SECTION 3.2 - Mentions, parcours et passerelles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  3.2 Mentions, parcours et passerelles
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Préciser les mentions proposées et leur organisation en parcours
                </p>
              </div>
              <div className="p-6 space-y-8">
                {/* Tableau récapitulatif des mentions */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3">Fiche récapitulative des mentions</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Domaines
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Grades
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Mentions
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Noms des responsables
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Diplôme/Spécialités
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formData.mentions.map((mention, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">
                              {domaines.find(d => d.value === mention.domaine)?.label || mention.domaine}
                            </td>
                            <td className="px-4 py-3 border-b">
                              <span className="text-sm">{mention.grade}</span>
                            </td>
                            <td className="px-4 py-3 border-b">
                              <input
                                type="text"
                                value={mention.mention}
                                onChange={(e) => handleMentionChange(index, 'mention', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                placeholder="Intitulé de la mention"
                              />
                            </td>
                            <td className="px-4 py-3 border-b">
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  value={mention.responsable_nom}
                                  onChange={(e) => handleMentionChange(index, 'responsable_nom', e.target.value)}
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                  placeholder="Nom"
                                />
                                <input
                                  type="text"
                                  value={mention.responsable_prenoms}
                                  onChange={(e) => handleMentionChange(index, 'responsable_prenoms', e.target.value)}
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                  placeholder="Prénoms"
                                />
                                <input
                                  type="email"
                                  value={mention.email}
                                  onChange={(e) => handleMentionChange(index, 'email', e.target.value)}
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                  placeholder="Email"
                                />
                                <input
                                  type="text"
                                  value={mention.telephone}
                                  onChange={(e) => handleMentionChange(index, 'telephone', e.target.value)}
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                  placeholder="Téléphone"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 border-b">
                              <input
                                type="text"
                                value={mention.etablissement}
                                onChange={(e) => handleMentionChange(index, 'etablissement', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                placeholder="Diplôme/Spécialités"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Organisation des parcours */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-md font-medium text-gray-700 mb-3">Organisation des parcours</h4>
                  
                  {/* Exemple pour mention Physique-chimie */}
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Exemple : Mention "Physique-chimie"</h5>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Semestre
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b" colSpan="3">
                              Parcours
                            </th>
                          </tr>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 border-b"></th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500 border-b">Physique</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500 border-b">Chimie</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500 border-b">Physique-chimie</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">S6</td>
                            <td className="px-4 py-3 border-b"><input type="checkbox" className="w-4 h-4" /></td>
                            <td className="px-4 py-3 border-b"><input type="checkbox" className="w-4 h-4" /></td>
                            <td className="px-4 py-3 border-b"><input type="checkbox" className="w-4 h-4" /></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">S5</td>
                            <td className="px-4 py-3 border-b"><input type="checkbox" className="w-4 h-4" /></td>
                            <td className="px-4 py-3 border-b"><input type="checkbox" className="w-4 h-4" /></td>
                            <td className="px-4 py-3 border-b"><input type="checkbox" className="w-4 h-4" /></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">S4</td>
                            <td className="px-4 py-3 border-b"><input type="checkbox" className="w-4 h-4" /></td>
                            <td className="px-4 py-3 border-b"><input type="checkbox" className="w-4 h-4" /></td>
                            <td className="px-4 py-3 border-b"><input type="checkbox" className="w-4 h-4" /></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">S3</td>
                            <td className="px-4 py-3 border-b"><input type="checkbox" className="w-4 h-4" /></td>
                            <td className="px-4 py-3 border-b"><input type="checkbox" className="w-4 h-4" /></td>
                            <td className="px-4 py-3 border-b"><input type="checkbox" className="w-4 h-4" /></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">S2</td>
                            <td className="px-4 py-3 border-b text-center" colSpan="3">Enseignements communs (Tronc commun)</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">S1</td>
                            <td className="px-4 py-3 border-b text-center" colSpan="3">Enseignements communs (Tronc commun)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Passerelles */}
                  <div className="mt-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Passerelles</h5>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 mb-2">
                        <FaExclamationTriangle className="inline mr-1" />
                        Identifier les passerelles par des flèches dans le tableau d'organisation des parcours
                      </p>
                      <textarea
                        value={formData.passerelles || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, passerelles: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                        rows="3"
                        placeholder="Pour chaque passerelle, mentionner les UE optionnelles qui doivent avoir été obtenues..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Message d'information */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <FaInfoCircle className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-700 text-sm">
                    Attester la conformité de l'offre avec le principe du système LMD : 180 ECTS, équilibre CM/TD/TP/TPE, progression des études et professionnalisation.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 4 - Dispositif pédagogique et maquette */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  IV. Dispositif pédagogique et maquette
                </h3>
              </div>
              <div className="p-6 space-y-8">
                {/* 4.1 Description de la mention */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">4.1 Description de la mention</h4>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">4.1.1 Contexte et justification</label>
                      <textarea
                        value={formData.dispositif?.contexte || ""}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          dispositif: { ...prev.dispositif, contexte: e.target.value }
                        }))}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Décrivez le contexte et la justification de la formation..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">4.1.2 Objectifs de la formation</label>
                      <textarea
                        value={formData.dispositif?.objectifs || ""}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          dispositif: { ...prev.dispositif, objectifs: e.target.value }
                        }))}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Décrivez les objectifs de la formation..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">4.1.3 Vocation</label>
                      <select
                        value={formData.dispositif?.vocation || ""}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          dispositif: { ...prev.dispositif, vocation: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Sélectionnez la vocation</option>
                        <option value="academique">Académique (préparant principalement à la poursuite d'études et à la recherche)</option>
                        <option value="professionnelle">Professionnelle (orientée vers l'insertion dans le monde du travail)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">4.1.4 Débouchés professionnels</label>
                      <textarea
                        value={formData.dispositif?.debouchés || ""}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          dispositif: { ...prev.dispositif, debouchés: e.target.value }
                        }))}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Décrivez les débouchés professionnels..."
                      />
                    </div>
                  </div>
                </div>

                {/* 4.2 Description des parcours */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-md font-medium text-gray-700 mb-4">4.2 Description des parcours</h4>
                  
                  {/* Parcours 1 */}
                  <div className="mb-8">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">4.2.1 Parcours [Nom du parcours]</h5>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-gray-700">Intitulé du parcours</label>
                          <input
                            type="text"
                            value={formData.parcours1?.intitule || ""}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              parcours1: { ...prev.parcours1, intitule: e.target.value }
                            }))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Ex: Génie Logiciel"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-gray-700">Grade/Domaine concerné</label>
                          <select
                            value={formData.parcours1?.domaine || ""}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              parcours1: { ...prev.parcours1, domaine: e.target.value }
                            }))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          >
                            <option value="">Sélectionnez</option>
                            {domaines.map(d => (
                              <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-gray-700">Mention concernée</label>
                          <input
                            type="text"
                            value={formData.parcours1?.mention || ""}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              parcours1: { ...prev.parcours1, mention: e.target.value }
                            }))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Ex: Informatique"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-gray-700">Vocation principale</label>
                          <select
                            value={formData.parcours1?.vocation || ""}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              parcours1: { ...prev.parcours1, vocation: e.target.value }
                            }))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          >
                            <option value="">Sélectionnez</option>
                            <option value="academique">Académique</option>
                            <option value="professionnelle">Professionnelle</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-gray-700">Semestres concernés</label>
                          <input
                            type="text"
                            value={formData.parcours1?.semestres || ""}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              parcours1: { ...prev.parcours1, semestres: e.target.value }
                            }))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Ex: S1-S6"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-gray-700">Langue d'enseignement</label>
                          <input
                            type="text"
                            value={formData.parcours1?.langue || ""}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              parcours1: { ...prev.parcours1, langue: e.target.value }
                            }))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Ex: Français, Anglais"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-700">Objectif du parcours</label>
                        <textarea
                          value={formData.parcours1?.objectif || ""}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            parcours1: { ...prev.parcours1, objectif: e.target.value }
                          }))}
                          rows="3"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="Décrivez ce que l'étudiant doit acquérir..."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-gray-700">Nom du responsable du parcours</label>
                        <input
                          type="text"
                          value={formData.parcours1?.responsable || ""}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            parcours1: { ...prev.parcours1, responsable: e.target.value }
                          }))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                          placeholder="Nom du responsable"
                        />
                      </div>

                      {/* Tableau d'organisation des UE */}
                      <div className="mt-6">
                        <h6 className="text-sm font-medium text-gray-700 mb-3">Organisation du parcours en UE</h6>
                        
                        {[1,2,3,4,5,6].map((sem) => (
                          <div key={sem} className="mb-4">
                            <label className="block text-xs font-medium text-gray-700 mb-2">Semestre S{sem}</label>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">
                                      Unité d'enseignement
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">
                                      Crédit
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {[1,2,3,4,5].map((ue) => (
                                    <tr key={ue}>
                                      <td className="px-4 py-2 border-b">
                                        <input
                                          type="text"
                                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                          placeholder={`UE ${ue}`}
                                        />
                                      </td>
                                      <td className="px-4 py-2 border-b">
                                        <input
                                          type="number"
                                          className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
                                          placeholder="Crédits"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                  <tr className="bg-gray-50">
                                    <td className="px-4 py-2 text-right font-medium text-xs">Total</td>
                                    <td className="px-4 py-2 font-medium text-xs">30</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tableau récapitulatif des activités pédagogiques */}
                      <div className="mt-6">
                        <h6 className="text-sm font-medium text-gray-700 mb-3">Nature des activités pédagogiques</h6>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">
                                  Semestre
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b" colSpan="2">
                                  Cours
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b" colSpan="2">
                                  TD
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b" colSpan="2">
                                  TP
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b" colSpan="2">
                                  Stage
                                </th>
                              </tr>
                              <tr className="bg-gray-100">
                                <th className="px-4 py-1 border-b"></th>
                                <th className="px-4 py-1 text-xs font-medium text-gray-500 border-b">%</th>
                                <th className="px-4 py-1 text-xs font-medium text-gray-500 border-b">h</th>
                                <th className="px-4 py-1 text-xs font-medium text-gray-500 border-b">%</th>
                                <th className="px-4 py-1 text-xs font-medium text-gray-500 border-b">h</th>
                                <th className="px-4 py-1 text-xs font-medium text-gray-500 border-b">%</th>
                                <th className="px-4 py-1 text-xs font-medium text-gray-500 border-b">h</th>
                                <th className="px-4 py-1 text-xs font-medium text-gray-500 border-b">%</th>
                                <th className="px-4 py-1 text-xs font-medium text-gray-500 border-b">h</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[1,2,3,4,5,6].map((sem) => (
                                <tr key={sem}>
                                  <td className="px-4 py-2 text-xs font-medium text-gray-900 border-b">S{sem}</td>
                                  <td className="px-4 py-2 border-b"><input type="text" className="w-12 px-1 py-1 text-xs border rounded" /></td>
                                  <td className="px-4 py-2 border-b"><input type="text" className="w-12 px-1 py-1 text-xs border rounded" /></td>
                                  <td className="px-4 py-2 border-b"><input type="text" className="w-12 px-1 py-1 text-xs border rounded" /></td>
                                  <td className="px-4 py-2 border-b"><input type="text" className="w-12 px-1 py-1 text-xs border rounded" /></td>
                                  <td className="px-4 py-2 border-b"><input type="text" className="w-12 px-1 py-1 text-xs border rounded" /></td>
                                  <td className="px-4 py-2 border-b"><input type="text" className="w-12 px-1 py-1 text-xs border rounded" /></td>
                                  <td className="px-4 py-2 border-b"><input type="text" className="w-12 px-1 py-1 text-xs border rounded" /></td>
                                  <td className="px-4 py-2 border-b"><input type="text" className="w-12 px-1 py-1 text-xs border rounded" /></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Conditions et modalités d'accès */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-gray-700">Pré-requis</label>
                          <textarea
                            value={formData.parcours1?.prerequis || ""}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              parcours1: { ...prev.parcours1, prerequis: e.target.value }
                            }))}
                            rows="2"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Pré-requis nécessaires"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-gray-700">Capacité d'accueil</label>
                          <input
                            type="number"
                            value={formData.parcours1?.capacite || ""}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              parcours1: { ...prev.parcours1, capacite: e.target.value }
                            }))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Nombre maximum d'étudiants"
                          />
                        </div>
                      </div>

                      {/* Ouverture internationale, insertion, poursuite */}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-gray-700">Ouverture internationale</label>
                          <textarea
                            value={formData.parcours1?.international || ""}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              parcours1: { ...prev.parcours1, international: e.target.value }
                            }))}
                            rows="2"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Stages à l'étranger, conventions..."
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-gray-700">Insertion professionnelle</label>
                          <textarea
                            value={formData.parcours1?.insertion || ""}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              parcours1: { ...prev.parcours1, insertion: e.target.value }
                            }))}
                            rows="2"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Métiers accessibles"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-gray-700">Poursuite des études</label>
                          <textarea
                            value={formData.parcours1?.poursuite || ""}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              parcours1: { ...prev.parcours1, poursuite: e.target.value }
                            }))}
                            rows="2"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Masters accessibles..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fiche descriptive UE */}
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-4">C. Fiche descriptive des Unités d'Enseignement</h5>
                    
                    <div className="space-y-4">
                      {[1,2,3].map((ueIndex) => (
                        <div key={ueIndex} className="border border-gray-200 rounded-lg p-4">
                          <h6 className="font-medium text-gray-800 mb-3">UE {ueIndex}</h6>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-xs font-medium text-gray-700">Grade/Domaine concerné</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                placeholder="Ex: ST/Licence"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-xs font-medium text-gray-700">Intitulé</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                placeholder="Intitulé de l'UE"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-xs font-medium text-gray-700">Code et numéro</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                placeholder="Ex: INF-S1-01"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-xs font-medium text-gray-700">Responsable</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                placeholder="Nom du responsable"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-xs font-medium text-gray-700">Valeur en crédits</label>
                              <input
                                type="number"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                placeholder="Crédits ECTS"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-xs font-medium text-gray-700">Statut</label>
                              <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg">
                                <option value="">Sélectionnez</option>
                                <option value="obligatoire">Obligatoire</option>
                                <option value="optionnelle">Optionnelle</option>
                              </select>
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-xs font-medium text-gray-700 mb-2">Matières (EC)</label>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">Matières (EC)</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">C</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">TD</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">TP</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">Autres</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">Total</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">Travail personnel</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {[1,2,3].map((ec) => (
                                    <tr key={ec}>
                                      <td className="px-4 py-2 border-b">
                                        <input type="text" className="w-full px-2 py-1 text-xs border rounded" placeholder={`Matière ${ec}`} />
                                      </td>
                                      <td className="px-4 py-2 border-b"><input type="text" className="w-12 px-1 py-1 text-xs border rounded" /></td>
                                      <td className="px-4 py-2 border-b"><input type="text" className="w-12 px-1 py-1 text-xs border rounded" /></td>
                                      <td className="px-4 py-2 border-b"><input type="text" className="w-12 px-1 py-1 text-xs border rounded" /></td>
                                      <td className="px-4 py-2 border-b"><input type="text" className="w-12 px-1 py-1 text-xs border rounded" /></td>
                                      <td className="px-4 py-2 border-b"><input type="text" className="w-12 px-1 py-1 text-xs border rounded" /></td>
                                      <td className="px-4 py-2 border-b"><input type="text" className="w-12 px-1 py-1 text-xs border rounded" /></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-xs font-medium text-gray-700 mb-2">Modalités de contrôle des connaissances</label>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">UE/EC</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">Nature</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">Contrôle continu</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">Terminal</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">Rattrapage</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">Compensation</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">Traçabilité</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {[1,2,3].map((ec) => (
                                    <tr key={ec}>
                                      <td className="px-4 py-2 border-b"><input type="text" className="w-20 px-1 py-1 text-xs border rounded" /></td>
                                      <td className="px-4 py-2 border-b">
                                        <select className="w-full px-1 py-1 text-xs border rounded">
                                          <option value="">Type</option>
                                          <option value="ecrit">Écrit</option>
                                          <option value="oral">Oral</option>
                                          <option value="pratique">Pratique</option>
                                        </select>
                                      </td>
                                      <td className="px-4 py-2 border-b"><input type="text" className="w-12 px-1 py-1 text-xs border rounded" /></td>
                                      <td className="px-4 py-2 border-b"><input type="text" className="w-12 px-1 py-1 text-xs border rounded" /></td>
                                      <td className="px-4 py-2 border-b">
                                        <select className="w-full px-1 py-1 text-xs border rounded">
                                          <option value="OUI">OUI</option>
                                          <option value="NON">NON</option>
                                        </select>
                                      </td>
                                      <td className="px-4 py-2 border-b">
                                        <select className="w-full px-1 py-1 text-xs border rounded">
                                          <option value="OUI">OUI</option>
                                          <option value="NON">NON</option>
                                        </select>
                                      </td>
                                      <td className="px-4 py-2 border-b">
                                        <input type="file" className="text-xs" />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {/* Message d'information */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <FaInfoCircle className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-700 text-sm">
                    Détaillez les moyens humains, matériels et financiers disponibles pour la formation.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 5 - Moyens disponibles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  V. Moyens disponibles
                </h3>
              </div>
              <div className="p-6 space-y-8">
                {/* 5.1 Ressources humaines */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">5.1 Ressources humaines</h4>
                  
                  {/* 5.1.1 Récapitulatif des enseignants */}
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">5.1.1 Récapitulatif des enseignants permanents et intervenants</h5>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Grades
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Effectifs des permanents
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Effectifs des vacataires ou associés
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">Professeurs titulaires</td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">Professeurs</td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">Maître de conférences</td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">Assistants</td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                          </tr>
                          <tr className="bg-gray-50 font-medium">
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">Total</td>
                            <td className="px-4 py-3 border-b"><input type="text" className="w-20 px-2 py-1 border rounded bg-gray-100" readOnly /></td>
                            <td className="px-4 py-3 border-b"><input type="text" className="w-20 px-2 py-1 border rounded bg-gray-100" readOnly /></td>
                            <td className="px-4 py-3 border-b"><input type="text" className="w-20 px-2 py-1 border rounded bg-gray-100" readOnly /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Taux d'encadrement */}
                    <div className="mt-4">
                      <h6 className="text-sm font-medium text-gray-700 mb-2">Taux d'encadrement</h6>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">
                                Domaines
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border-b">
                                Taux d'encadrement (Nombre d'étudiants / Nombre d'enseignants)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {domaines.map((domaine, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-sm text-gray-900 border-b">{domaine.label}</td>
                                <td className="px-4 py-2 border-b"><input type="text" className="w-full px-2 py-1 border rounded" /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* 5.1.2 Personnel de soutien */}
                  <div className="border-t border-gray-200 pt-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">5.1.2 Personnel de soutien</h5>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Fonctions
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Effectifs
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">Technicien de laboratoire</td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">Bibliothécaire</td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">Agent de maintenance</td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">Secrétaire</td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">Autres</td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                          </tr>
                          <tr className="bg-gray-50 font-medium">
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">Total</td>
                            <td className="px-4 py-3 border-b"><input type="text" className="w-20 px-2 py-1 border rounded bg-gray-100" readOnly /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 5.2 Infrastructures et moyens matériels */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-md font-medium text-gray-700 mb-4">5.2 Infrastructures et moyens matériels disponibles</h4>
                  
                  {/* 5.2.1 Salles de cours */}
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">5.2.1 Salles de cours</h5>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Capacité
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Nombre
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">0-20 places</td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">20-50 places</td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">50-100 places</td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">100-300 places</td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">&gt; 300 places</td>
                            <td className="px-4 py-3 border-b"><input type="number" className="w-20 px-2 py-1 border rounded" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 5.2.2 Laboratoires pédagogiques et équipements */}
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">5.2.2 Laboratoires pédagogiques et équipements</h5>
                    
                    <div className="space-y-4">
                      {[1,2,3].map((labo, index) => (
                        <div key={labo} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-xs font-medium text-gray-700">N°</label>
                              <input type="text" className="w-full px-3 py-2 text-sm border rounded" value={index + 1} readOnly />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-xs font-medium text-gray-700">Désignation de l'équipement</label>
                              <input type="text" className="w-full px-3 py-2 text-sm border rounded" placeholder="Ex: Microscope optique" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-xs font-medium text-gray-700">Nombre</label>
                              <input type="number" className="w-full px-3 py-2 text-sm border rounded" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-xs font-medium text-gray-700">Preuves</label>
                              <input type="file" className="w-full text-sm" />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm w-full">
                        <FaPlus size={14} />
                        <span>Ajouter un équipement</span>
                      </button>
                    </div>
                  </div>

                  {/* 5.2.3 Laboratoires/Projets/Equipes de recherche */}
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">5.2.3 Laboratoires/Projets/Equipes de recherche de soutien</h5>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="4"
                      placeholder="Citez tous les laboratoires de recherche impliqués, les chercheurs et les thèmes/axes de recherche développés..."
                    />
                  </div>

                  {/* 5.2.4 Documentation */}
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">5.2.4 Documentation</h5>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="3"
                      placeholder="Précisez les ressources documentaires disponibles et leur nombre..."
                    />
                  </div>

                  {/* 5.2.5 Espaces de travaux personnels et TIC */}
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">5.2.5 Espaces de travaux personnels et TIC</h5>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="3"
                      placeholder="Indiquez la localisation, la capacité, l'équipement et le fonctionnement..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            {/* SECTION 6 - Gestion des performances académiques */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  VI. Gestion des performances académiques et politique d'insertion professionnelle
                </h3>
              </div>
              <div className="p-6 space-y-8">
                {/* 6.1 Indicateurs de suivi des performances académiques */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">6.1 Indicateurs de suivi des performances académiques</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <label className="block text-sm font-medium text-blue-800 mb-2">Taux de réussite attendu</label>
                      <input type="text" className="w-full px-3 py-2 border border-blue-300 rounded-lg" placeholder="%" />
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <label className="block text-sm font-medium text-green-800 mb-2">Taux de passage en année supérieure</label>
                      <input type="text" className="w-full px-3 py-2 border border-green-300 rounded-lg" placeholder="%" />
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <label className="block text-sm font-medium text-purple-800 mb-2">Taux d'abandon prévisionnel</label>
                      <input type="text" className="w-full px-3 py-2 border border-purple-300 rounded-lg" placeholder="%" />
                    </div>
                  </div>
                  
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows="4"
                    placeholder="Décrivez les indicateurs de suivi mis en place..."
                  />
                </div>

                {/* 6.2 Politique d'insertion professionnelle */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-md font-medium text-gray-700 mb-4">6.2 Politique d'insertion professionnelle</h4>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows="4"
                    placeholder="Décrivez votre politique d'insertion professionnelle..."
                  />
                </div>

                {/* 6.3 Politique pour le suivi des diplômés */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-md font-medium text-gray-700 mb-4">6.3 Politique pour le suivi des diplômés</h4>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows="4"
                    placeholder="Décrivez votre politique de suivi des diplômés..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            {/* Message d'information */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <FaInfoCircle className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-700 text-sm">
                    S'assurer que la formation est suivie et régulée par des instances fonctionnelles et une cellule Assurance Qualité active.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 7 - Gouvernance et assurance qualité */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  VII. Gouvernance et assurance qualité
                </h3>
              </div>
              <div className="p-6 space-y-8">
                {/* 7.1 Instances de gouvernance */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">7.1 Instances de gouvernance</h4>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Comité pédagogique</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows="2"
                        placeholder="Composition, missions, fréquence des réunions..."
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Comité scientifique et professionnel</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows="2"
                        placeholder="Composition, missions, fréquence des réunions..."
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Coordination administrative</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows="2"
                        placeholder="Organisation de la coordination administrative..."
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Implication des étudiants</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows="2"
                        placeholder="Mécanismes de participation des étudiants à la gouvernance..."
                      />
                    </div>
                  </div>
                </div>

                {/* 7.2 Structure d'assurance qualité */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-md font-medium text-gray-700 mb-4">7.2 Structure d'assurance qualité</h4>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Structure</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows="3"
                        placeholder="Décrivez la structure d'assurance qualité (organisation, composition, rattachement)..."
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Plan opérationnel</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows="4"
                        placeholder="Décrivez le plan opérationnel d'assurance qualité (actions, échéances, indicateurs)..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            {/* Message d'information */}
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <FaExclamationTriangle className="text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-yellow-700 text-sm font-medium">
                    TOUTE INFORMATION FOURNIE DOIT ETRE APPUYEE PAR DES PIECES JUSTIFICATIVES. 
                    LA QUALITE ET L'AUTHENTICITE DES PREUVES SONT DETERMINANTES POUR LA DECISION D'HABILITATION.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 8 - Annexes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  VIII. Annexes
                </h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Liste des CV et lettres d'engagement */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">Liste des CV et lettres d'engagement</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      id="cv-upload"
                      accept=".pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="cv-upload"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      <FaPlus size={16} />
                      Télécharger les CV et lettres d'engagement
                    </label>
                    <p className="mt-2 text-sm text-gray-500">Formats acceptés : PDF, DOC, DOCX</p>
                  </div>
                </div>

                {/* Conventions de partenariats signés */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">Conventions de partenariats signés</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      id="conventions-upload"
                      accept=".pdf"
                    />
                    <label
                      htmlFor="conventions-upload"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      <FaPlus size={16} />
                      Télécharger les conventions
                    </label>
                    <p className="mt-2 text-sm text-gray-500">Format accepté : PDF</p>
                  </div>
                </div>

                {/* Autres pièces justificatives */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-4">Autres pièces justificatives</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      id="autres-upload"
                    />
                    <label
                      htmlFor="autres-upload"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer"
                    >
                      <FaPlus size={16} />
                      Télécharger d'autres documents
                    </label>
                  </div>
                </div>

                {/* Récapitulatif des annexes téléchargées */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Documents téléchargés :</h5>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Aucun document téléchargé pour le moment
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <p className="text-gray-700">
              Récapitulatif de l'ensemble de votre demande. Vérifiez toutes
              les informations avant soumission finale.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">
                Aperçu de votre demande d'habilitation Licence
              </h3>
              <ul className="space-y-2">
                {formSteps.slice(0, -1).map((step, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    <span>{step.title.replace(/\n/g, " ")} - Complété</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">
                  Toutes les sections ont été complétées. Votre demande est
                  prête à être soumise.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white py-6 md:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12 bg-white pb-6 border-b border-gray-200 sticky top-0 z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 px-4">
            Demande d'habilitation des formations conduisant au grade de Licence
          </h1>
        </div>

        <div className="mb-8 md:mb-12">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm md:text-base font-medium text-gray-600">
              Progression
            </span>
            <span className="text-sm md:text-base font-semibold text-blue-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 md:h-3">
            <div
              className="h-2.5 md:h-3 rounded-full transition-all duration-500 ease-out bg-blue-600"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Version mobile : étape actuelle */}
        <div className="md:hidden mb-6">
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              Étape {currentStep} sur {formSteps.length}
            </h2>
            <p className="text-lg text-gray-700 mt-2 font-medium">
              {formSteps[currentStep - 1]?.title.replace(/\n/g, " ")}
            </p>
          </div>
        </div>

        {/* Version desktop : stepper adaptatif */}
        <div className="hidden md:block mb-10">
          <div className="relative">
            <div className="absolute left-0 right-0 top-[22px] h-0.5 bg-gray-200" />
            <div
              className="absolute left-0 top-[22px] h-0.5 transition-all duration-500 ease-out bg-blue-600"
              style={{ width: `${progressPercentage}%` }}
            />

            <div className="grid grid-cols-9 gap-3 relative z-10">
              {formSteps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-sm font-bold
                      ${
                        step.id < currentStep
                          ? "bg-green-600 border-green-600 text-white"
                          : step.id === currentStep
                            ? "bg-blue-600 border-blue-600 ring-blue-200 text-white ring-2"
                            : "bg-white border-gray-300 text-gray-500"
                      }
                    `}
                  >
                    {step.id < currentStep ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <p className="mt-2 text-xs font-medium text-gray-700 text-center leading-tight whitespace-pre-line">
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contenu étape */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-9 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            {formSteps[currentStep - 1]?.title.replace(/\n/g, " ")}
          </h2>

          <div className="min-h-[50vh]">{renderFormContent()}</div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6">
          {currentStep === 1 ? (
            <button
              onClick={handleBackToCanevas}
              className="flex items-center gap-2 px-6 md:px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 border border-gray-300 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Retour au canevas
            </button>
          ) : (
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 px-6 md:px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 border border-gray-300 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Précédent
            </button>
          )}

          {currentStep < formSteps.length ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 md:px-10 py-3 rounded-lg font-medium hover:opacity-90 shadow-sm transition bg-blue-600 text-white hover:bg-blue-700"
            >
              Suivant
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`
                flex items-center gap-2 px-8 md:px-10 py-3 rounded-lg font-medium shadow-sm transition
                ${
                  isSubmitting
                    ? "bg-green-400 text-white cursor-wait"
                    : "bg-green-600 text-white hover:bg-green-700"
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                "Soumettre la demande"
              )}
            </button>
          )}
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          aria-label="Retour en haut"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
};

export default FormLicence;