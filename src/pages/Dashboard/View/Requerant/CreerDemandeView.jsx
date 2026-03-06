// C:\Users\hp\Desktop\Digitalisation\frontend\src\views\Requérant\Demandes\CreerDemandeView.jsx

import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaUniversity,
  FaCheck,
  FaInfoCircle,
  FaGraduationCap,
  FaFileUpload,
  FaArrowLeft,
  FaArrowRight,
  FaPlus,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../../../context/ThemeContext";
import {
  updateDemande,
  createAndSubmitDemande,
  getDemandeById,
  getUserDemandes,
} from "../../../../services/equivalence.services";

const diplomeTypes = [
  {
    id: "licence",
    title: "Licence",
    description: "Équivalence de diplôme de niveau Licence (BAC+3)",
    icon: <FaGraduationCap />,
    color: "blue",
  },
  {
    id: "master",
    title: "Master",
    description: "Équivalence de diplôme de niveau Master (BAC+5)",
    icon: <FaUniversity />,
    color: "blue",
  },
  {
    id: "doctorat",
    title: "Doctorat",
    description: "Équivalence de diplôme de niveau Doctorat (BAC+8)",
    icon: <FaGraduationCap />,
    color: "blue",
  },
];

const documentsRequis = [
  {
    id: "demande_equivalence",
    titre: "Demande d'équivalence",
    description:
      "Une demande d'équivalence indiquant :\n• Les coordonnées personnelles : Nom et Prénoms, code postale, contact(s) téléphonique(s) et électronique\n• La date\n• Le motif (inscription dans un établissement de formation, recherche d'emploi, concours, ...)\n• Le(s) diplôme(s) sur lequel doit porter l'équivalence\n• Le récapitulatif des années de formation\n• La demande est adressée à Madame/Monsieur le Ministre de l'Enseignement Supérieur et de la Recherche Scientifique, Président(e) de la Commission Nationale des Équivalences",
    obligatoire: true,
  },
  {
    id: "piece_identite",
    titre: "Pièce d'identité du Requérant",
    description:
      "Photocopie lisible légalisée d'une pièce d'identité : Carte d'Identité Nationale ou Passeport.",
    obligatoire: true,
  },
  {
    id: "diplomes_certifies",
    titre: "Diplômes certifiés",
    description:
      "Photocopie lisible de l'ensemble des diplômes certifiée par l'Établissement de délivrance ou par le Consulat/Ministère des Affaires Étrangères pour les diplômes étrangers.",
    obligatoire: true,
  },
  {
    id: "traduction_diplomes",
    titre: "Traduction des diplômes",
    description:
      "Photocopie lisible de la traduction du/des diplôme(s) effectuée par un Traducteur autorisé ou par les autorités officielles du pays de délivrance (pour les diplômes non en langues Malagasy, Français ou Anglais).",
    obligatoire: false,
  },
  {
    id: "justificatifs_duree_etudes",
    titre: "Justificatifs de la durée des études",
    description:
      "Photocopie lisible des justificatifs de la durée officielle des études ou relevés de notes délivrée par l'Etablissement (Certifiée par l'Établissement de délivrance, par le Ministères des Affaires Étrangères ou le Consultat du Pays de délivrance pour diplômes étrangers).",
    obligatoire: true,
  },
  {
    id: "traduction_justificatifs",
    titre: "Traduction des justificatifs",
    description:
      "Photocopie lisible de la traduction de ces justificatifs/relevés de notes par Traducteur autorisé ou par les autorités officielles du Pays de délivrance (Pour les documents non rédigés en langues Malagasy, Française et Anglaise).",
    obligatoire: false,
  },
  {
    id: "memoire_these",
    titre: "Mémoire ou Thèse",
    description:
      "Mémoire ou Thèse de fin d'études certifiée par l'Établissement de délivrance ou par le Consulat du Pays de délivrance pour les diplômes étrangers.",
    obligatoire: false,
  },
  {
    id: "arrete_habilitation",
    titre: "Arrêté d'Habilitation",
    description:
      "Copie certifiée de l'Arrêté d'Habilitation à demander auprès du Service de la Législation MESUPRES (pour tous les Instituts d'Enseignement Supérieur Privés et Publics de Madagascar).",
    obligatoire: true,
  },
  {
    id: "attestation_master",
    titre: "Justificatif Master Recherche (pour Master uniquement)",
    description:
      "Pour les Master: Justificatif du diplôme Master Recherche venant de l'Etablissement.",
    obligatoire: true,
  },
];

const dossiersEquivalence = [
  {
    title: "Une demande d'équivalence indiquant :",
    details: [
      "Les coordonnées personnelles : Nom et Prénoms, code postale, contact(s) téléphonique(s) et électronique",
      "La date",
      "Le motif (inscription dans un établissement de formation, recherche d'emploi, concours, ...)",
      "Le(s) diplôme(s) sur lequel doit porter l'équivalence",
      "Le récapitulatif des années de formation",
      "La demande est adressée à Madame/Monsieur le Ministre de l'Enseignement Supérieur et de la Recherche Scientifique, Président(e) de la Commission Nationale des Équivalences",
    ],
  },
  {
    title:
      "Photocopie lisible légalisée d'une pièce d'identité du Requérant : Carte d'Identité Nationale ou Passeport.",
  },
  {
    title:
      "Photocopie lisible de l'ensemble des diplômes certifiée par l'Établissement de délivrance ou par le Consulat/Ministère des Affaires Étrangères pour les diplômes étrangers.",
  },
  {
    title:
      "Photocopie lisible de la traduction du/des diplôme(s) effectuée par un Traducteur autorisé ou par les autorités officielles du pays de délivrance (pour les diplômes non en langues Malagasy, Français ou Anglais).",
  },
  {
    title:
      "Photocopie lisible des justificatifs de la durée officielle des études ou relevés de notes délivrée par l'Etablissement (Certifiée par l'Établissement de délivrance, par le Ministères des Affaires Etrangères ou le Consultat du Pays de délivrance pour diplômes étrangers.)",
  },
  {
    title:
      "Photocopie lisible de la traduction de ces justificatifs/relevés de notes par Traducteur autorisé ou par les autorités officielles du Pays de délivrance(Pour les documents non rédigés en langues Malagasy, Française et Anglaise).",
  },
  {
    title:
      "Mémoire ou Thèse de fin d'études certifiée par l'Établissement de délivrance ou par le Consulat du Pays de délivrance pour les diplômes étrangers.",
  },
  {
    title:
      "Copie certifiée de l'Arrêté d'Habilitation à demander auprès du Service de la Législation MESUPRES (pour tous les Instituts d'Enseignement Supérieur Privés et Publics de Madagascar).",
  },
  {
    title:
      "Pour les Master: Justificatif du diplôme Master Recherche venant de l'Etablissement.",
  },
];

const stepsEquivalence = [
  { id: 1, title: "Dépôt des dossiers en ligne pour demande d'équivalence" },
  { id: 2, title: "Traitement des dossiers :\nCritères d'éligibilité" },
  { id: 3, title: "Dépôt des dossiers Physique pour demande d'équivalence" },
  {
    id: 4,
    title:
      "Étude des dossiers au niveau de la Commission Nationale d'Équivalences (CNE)\n(Membres : DAAQ • DGES • DGRS • DES • DRI • DRSE)",
  },
  { id: 5, title: "Lecture au niveau du Secrétariat Général du MESUPRES (SG)" },
  {
    id: 6,
    title:
      "Rédaction des projets d'arrêté d'équivalence\n(Français et Malagasy)",
  },
  {
    id: 7,
    title:
      "Signature des projets validés par la CNE\npar le Ministre du MESUPRES",
  },
  {
    id: 8,
    title:
      "Demande de numéro des arrêtés d'équivalence,\ndûment signés par le Ministre du MESUPRES, au niveau de la Primature",
  },
  {
    id: 9,
    title:
      "Notification aux Requérants pour les arrêtés octroyés et remise de la version Physique",
  },
];

const initialFormData = {
  type_diplome: "",
  nom: "",
  prenoms: "",
  code_postal: "",
  telephone: "",
  email: "",
  date_demande: new Date().toISOString().split("T")[0],
  motif: "",
  recapitulatif_formation: [
    {
      annee_obtention: "",
      diplome: "",
      mention: "",
      parcours_option_specialite: "",
      etablissement: "",
    },
  ],
  destinataire:
    "Madame/Monsieur Le Ministre de l'Enseignement Supérieur et de la Recherche Scientifique, Président(e) de la Commission Nationale des Équivalences",
  documents: {
    demande_equivalence: null,
    piece_identite: null,
    diplomes_certifies: null,
    traduction_diplomes: null,
    justificatifs_duree_etudes: null,
    traduction_justificatifs: null,
    memoire_these: null,
    arrete_habilitation: null,
    attestation_master: null,
  },
};

// Mapper les statuts du backend vers ceux affichés dans l'UI
const mapStatutToDisplay = (statut) => {
  const mapping = {
    "brouillon": "Brouillon",
    "soumise": "En cours",
    "en_cours": "En cours",
    "complet": "Complété",
    "rejete": "Rejetée",
    "accorde": "Acceptée"
  };
  return mapping[statut] || statut;
};

export default function CreerDemandeView() {
  const location = useLocation();
  const navigate = useNavigate();
  const demandeToEdit = location.state?.demande || null;

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [selectedDiplomeType, setSelectedDiplomeType] = useState(null);
  const [showFormulaire, setShowFormulaire] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [expandedFormations, setExpandedFormations] = useState([true]);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [existingDemandes, setExistingDemandes] = useState([]);
  const [, setLoadingTypes] = useState(false);

  // --- Helpers dark mode ---
  const bg = isDark ? "bg-gray-900" : "bg-white";
  const cardBg = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";
  const textMain = isDark ? "text-gray-100" : "text-gray-800";
  const textSub = isDark ? "text-gray-400" : "text-gray-600";
  const textMuted = isDark ? "text-gray-500" : "text-gray-500";
  const inputCls = (hasError) =>
    `w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none ${
      hasError
        ? "border-red-500 focus:ring-red-200"
        : isDark
          ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 hover:border-gray-500"
          : "border-gray-300 hover:border-gray-400 bg-white text-gray-800"
    }`;
  const inputSmCls = (hasError) =>
    `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none ${
      hasError
        ? "border-red-500"
        : isDark
          ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500"
          : "border-gray-300 bg-white text-gray-800"
    }`;
  const labelCls = `block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`;

  const steps = [
    { title: "Type de diplôme", fields: ["type_diplome"] },
    {
      title: "Informations Personnelles",
      fields: ["nom", "prenoms", "code_postal", "telephone", "email"],
    },
    { title: "Motif", fields: ["motif"] },
    { title: "Formation", fields: ["recapitulatif_formation", "destinataire"] },
    { title: "Documents", fields: ["documents"] },
    { title: "Validation", fields: [] },
  ];

  // Charger les demandes existantes pour griser les types déjà demandés
  useEffect(() => {
    const fetchExistingDemandes = async () => {
      if (!demandeToEdit) {
        try {
          setLoadingTypes(true);
          const response = await getUserDemandes();
          if (response.success && response.data) {
            setExistingDemandes(response.data);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des demandes existantes:", error);
        } finally {
          setLoadingTypes(false);
        }
      }
    };
    
    fetchExistingDemandes();
  }, [demandeToEdit]);

  const handleRecapChange = (index, field, value) => {
    if (field === "annee_obtention") {
      if (value && !/^\d*$/.test(value)) return;
      if (value.length > 4) return;
    } else if (
      field === "diplome" ||
      field === "etablissement" ||
      field === "parcours_option_specialite"
    ) {
      if (value && /\d/.test(value)) return;
    }
    const newRecaps = [...formData.recapitulatif_formation];
    newRecaps[index][field] = value;
    setFormData((prev) => ({ ...prev, recapitulatif_formation: newRecaps }));
    if (errors.recapitulatif_formation_details?.[index]?.[field]) {
      const newErrors = { ...errors };
      if (newErrors.recapitulatif_formation_details[index]) {
        delete newErrors.recapitulatif_formation_details[index][field];
        if (
          Object.keys(newErrors.recapitulatif_formation_details[index])
            .length === 0
        )
          delete newErrors.recapitulatif_formation_details[index];
        if (Object.keys(newErrors.recapitulatif_formation_details).length === 0)
          delete newErrors.recapitulatif_formation_details;
      }
      setErrors(newErrors);
    }
  };

  const validateCurrentFormation = () => {
    const newErrors = {};
    const lastIndex = formData.recapitulatif_formation.length - 1;
    const lastFormation = formData.recapitulatif_formation[lastIndex];
    [
      "annee_obtention",
      "diplome",
      "mention",
      "parcours_option_specialite",
      "etablissement",
    ].forEach((field) => {
      if (!lastFormation[field] || lastFormation[field].trim() === "") {
        if (!newErrors.recapitulatif_formation_details)
          newErrors.recapitulatif_formation_details = {};
        newErrors.recapitulatif_formation_details[lastIndex] =
          newErrors.recapitulatif_formation_details[lastIndex] || {};
        newErrors.recapitulatif_formation_details[lastIndex][field] =
          "Ce champ est obligatoire";
      }
    });
    if (
      lastFormation.annee_obtention &&
      lastFormation.annee_obtention.length !== 4
    ) {
      if (!newErrors.recapitulatif_formation_details)
        newErrors.recapitulatif_formation_details = {};
      newErrors.recapitulatif_formation_details[lastIndex] =
        newErrors.recapitulatif_formation_details[lastIndex] || {};
      newErrors.recapitulatif_formation_details[lastIndex]["annee_obtention"] =
        "L'année doit comporter 4 chiffres (ex: 2020)";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return false;
    }
    return true;
  };

  const addRecapLine = () => {
    if (!validateCurrentFormation()) {
      alert(
        "Veuillez remplir tous les champs de la formation actuelle avant d'en ajouter une nouvelle.",
      );
      return;
    }
    setFormData((prev) => ({
      ...prev,
      recapitulatif_formation: [
        ...prev.recapitulatif_formation,
        {
          annee_obtention: "",
          diplome: "",
          mention: "",
          parcours_option_specialite: "",
          etablissement: "",
        },
      ],
    }));
    setExpandedFormations([...expandedFormations, true]);
  };

  const removeRecapLine = (index) => {
    if (formData.recapitulatif_formation.length > 1) {
      setFormData((prev) => ({
        ...prev,
        recapitulatif_formation: prev.recapitulatif_formation.filter(
          (_, i) => i !== index,
        ),
      }));
      const newExpanded = [...expandedFormations];
      newExpanded.splice(index, 1);
      setExpandedFormations(newExpanded);
    }
  };

  const toggleFormation = (index) => {
    const newExpanded = [...expandedFormations];
    newExpanded[index] = !newExpanded[index];
    setExpandedFormations(newExpanded);
  };

  useEffect(() => {
    const loadDemandeToEdit = async () => {
      if (demandeToEdit) {
        try {
          setIsChecking(true);
          let demandeData = demandeToEdit;

          // Si on a seulement l'ID, charger les données complètes
          if (typeof demandeToEdit === "number" || demandeToEdit?.id) {
            const id =
              typeof demandeToEdit === "number"
                ? demandeToEdit
                : demandeToEdit.id;
            const response = await getDemandeById(id);
            if (response.success) {
              demandeData = response.data;
            }
          }

          const docs = {};
          Object.keys(initialFormData.documents).forEach((key) => {
            docs[key] = demandeData.documents?.[key] || null;
          });

          let recap = [];
          if (Array.isArray(demandeData.recapitulatif_formation))
            recap = demandeData.recapitulatif_formation;
          else if (typeof demandeData.recapitulatif_formation === "string") {
            try {
              recap = JSON.parse(demandeData.recapitulatif_formation);
            } catch (e) {
              recap = [];
            }
          }
          if (recap.length === 0)
            recap = [
              {
                annee_obtention: "",
                diplome: "",
                mention: "",
                parcours_option_specialite: "",
                etablissement: "",
              },
            ];

          setFormData((prev) => ({
            ...prev,
            ...demandeData,
            documents: docs,
            recapitulatif_formation: recap,
            type_diplome: demandeData.type_diplome || "",
          }));

          if (demandeData.type_diplome) {
            const diplome = diplomeTypes.find(
              (d) => d.title === demandeData.type_diplome,
            );
            if (diplome) setSelectedDiplomeType(diplome);
          }
          setShowFormulaire(true);
          setAcceptedTerms(true);
          setExpandedFormations(new Array(recap.length).fill(true));
        } catch (error) {
          console.error("Erreur lors du chargement de la demande:", error);
          toast.error("Erreur lors du chargement de la demande");
        } finally {
          setIsChecking(false);
        }
      }
    };

    loadDemandeToEdit();
  }, [demandeToEdit]);

  const handleInputChange = (field, value) => {
    if (field === "telephone") {
      if (value && !/^[\d\s+]*$/.test(value)) return;
    } else if (field === "nom" || field === "prenoms") {
      if (value && /\d/.test(value)) return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (documentId, file) => {
    if (file) {
      const maxSize = 8 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Le fichier dépasse la taille maximale autorisée de 8 Mo");
        return;
      }
      const allowed = [
        "application/pdf",
        "application/msword",
        "image/jpeg",
        "image/png",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowed.includes(file.type)) {
        toast.error(
          "Format de fichier invalide. Extensions autorisées : pdf, doc, docx, jpg, png",
        );
        return;
      }

      // Simuler la progression (pour l'UX)
      setUploadProgress((prev) => ({ ...prev, [documentId]: 0 }));
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev[documentId] >= 100) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [documentId]: (prev[documentId] || 0) + 10 };
        });
      }, 50);
    }

    setFormData((prev) => ({
      ...prev,
      documents: { ...prev.documents, [documentId]: file },
    }));
    if (errors[documentId])
      setErrors((prev) => ({ ...prev, [documentId]: "" }));
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};

    steps[stepIndex].fields.forEach((field) => {
      if (field === "type_diplome") {
        if (!formData.type_diplome || formData.type_diplome.trim() === "")
          newErrors[field] = "Veuillez sélectionner un type de diplôme";
      } else if (field === "documents") {
        // Vérifier les documents obligatoires en fonction du type de diplôme
        const docsObligatoires = documentsRequis.filter((doc) => {
          if (doc.obligatoire) {
            if (
              doc.id === "attestation_master" &&
              formData.type_diplome !== "Master"
            ) {
              return false;
            }
            return true;
          }
          return false;
        });

        docsObligatoires.forEach((doc) => {
          if (!formData.documents[doc.id])
            newErrors[doc.id] = "Ce document est obligatoire";
        });
      } else if (field === "recapitulatif_formation") {
        if (
          !formData.recapitulatif_formation ||
          formData.recapitulatif_formation.length === 0
        ) {
          newErrors.recapitulatif_formation =
            "Au moins une formation est requise";
        } else {
          formData.recapitulatif_formation.forEach((recap, index) => {
            [
              "annee_obtention",
              "diplome",
              "mention",
              "parcours_option_specialite",
              "etablissement",
            ].forEach((key) => {
              if (!recap[key] || recap[key].trim() === "") {
                if (!newErrors.recapitulatif_formation_details)
                  newErrors.recapitulatif_formation_details = {};
                newErrors.recapitulatif_formation_details[index] =
                  newErrors.recapitulatif_formation_details[index] || {};
                newErrors.recapitulatif_formation_details[index][key] =
                  "Ce champ est obligatoire";
              }
            });
            if (recap.annee_obtention && recap.annee_obtention.length !== 4) {
              if (!newErrors.recapitulatif_formation_details)
                newErrors.recapitulatif_formation_details = {};
              newErrors.recapitulatif_formation_details[index] =
                newErrors.recapitulatif_formation_details[index] || {};
              newErrors.recapitulatif_formation_details[index][
                "annee_obtention"
              ] = "L'année doit comporter 4 chiffres (ex: 2020)";
            }
          });
        }
      } else if (field === "telephone") {
        const phoneRegex = /^(\+261|0)[3-4][0-9]{8}$/;
        if (
          !formData[field] ||
          !phoneRegex.test(formData[field].replace(/\s+/g, ""))
        )
          newErrors[field] =
            "Numéro de téléphone invalide. Format: +261 34 12 345 67 ou 034 12 345 67";
      } else if (field === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData[field] || !emailRegex.test(formData[field]))
          newErrors[field] = "Email invalide";
      } else if (field === "nom" || field === "prenoms") {
        if (!formData[field] || formData[field].trim() === "")
          newErrors[field] = "Ce champ est obligatoire";
        else if (/\d/.test(formData[field]))
          newErrors[field] = "Ce champ ne doit pas contenir de chiffres";
      } else {
        if (
          !formData[field] ||
          (typeof formData[field] === "string" && formData[field].trim() === "")
        )
          newErrors[field] = "Ce champ est obligatoire";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < steps.length - 1) {
      window.scrollTo(0, 0);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      window.scrollTo(0, 0);
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex);
      window.scrollTo(0, 0);
    }
  };

  const selectDiplomeType = (diplome) => {
    // Vérifier si ce type existe déjà
    const existing = existingDemandes.find(
      d => d.type_diplome === diplome.title && 
      (d.statut === "brouillon" || d.statut === "soumise" || d.statut === "en_cours")
    );
    
    if (existing && !demandeToEdit) {
      toast.warning(
        <div>
          <strong>Demande déjà existante</strong>
          <p className="text-xs mt-1">
            Vous avez déjà une demande pour le diplôme {diplome.title} (statut: {mapStatutToDisplay(existing.statut)}).
            Vous ne pouvez pas créer une nouvelle demande pour ce type.
          </p>
        </div>,
        {
          icon: <FaExclamationTriangle className="text-amber-500" size={20} />,
          autoClose: 5000,
        }
      );
      return;
    }
    
    setSelectedDiplomeType(diplome);
    setFormData((prev) => ({ ...prev, type_diplome: diplome.title }));
    setErrors((prev) => ({ ...prev, type_diplome: "" }));
  };

  const handleStartCreation = () => {
    if (!acceptedTerms) {
      toast.error("Vous devez accepter les conditions avant de continuer");
      return;
    }
    setShowFormulaire(true);
    setCurrentStep(0);
    window.scrollTo(0, 0);
  };

  const handleCancelCreation = () => {
    if (demandeToEdit) {
      navigate("/dashboard/requerant");
    } else {
      if (
        window.confirm(
          "Êtes-vous sûr de vouloir annuler ? Toutes les données non sauvegardées seront perdues.",
        )
      ) {
        setShowFormulaire(false);
        setCurrentStep(0);
        setSelectedDiplomeType(null);
        setFormData(initialFormData);
        setErrors({});
        setAcceptedTerms(false);
        setExpandedFormations([true]);
        setUploadProgress({});
      }
    }
  };

  // Fonction pour soumettre une demande
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      setIsSubmitting(true);

      // Vérifier les documents obligatoires
      const docsObligatoires = documentsRequis.filter((doc) => {
        if (doc.obligatoire) {
          if (
            doc.id === "attestation_master" &&
            formData.type_diplome !== "Master"
          ) {
            return false;
          }
          return true;
        }
        return false;
      });

      const missingDocs = docsObligatoires.filter(
        (doc) => !formData.documents[doc.id],
      );
      if (missingDocs.length > 0) {
        toast.error(
          `Documents obligatoires manquants : ${missingDocs.map((d) => d.titre).join(", ")}`,
        );
        setIsSubmitting(false);
        return;
      }

      // Formater les données
      const formattedData = {
        type_diplome: formData.type_diplome,
        nom: (formData.nom || "").toUpperCase(),
        prenoms: formData.prenoms || "",
        code_postal: formData.code_postal || "",
        telephone: formData.telephone || "",
        email: (formData.email || "").toLowerCase(),
        motif: formData.motif || "",
        recapitulatif_formation: (formData.recapitulatif_formation || []).map(
          (item) => ({
            annee_obtention: String(item.annee_obtention || "").trim(),
            diplome: String(item.diplome || "").trim(),
            mention: String(item.mention || "").trim(),
            parcours_option_specialite: String(
              item.parcours_option_specialite || "",
            ).trim(),
            etablissement: String(item.etablissement || "").trim(),
          }),
        ),
        destinataire: formData.destinataire,
      };

      // Préparer les fichiers
      const files = {};
      docsObligatoires.forEach((doc) => {
        const file = formData.documents[doc.id];
        if (file && file instanceof File) {
          files[doc.id] = file;
        }
      });

      if (demandeToEdit) {
        // Mode édition
        const id =
          typeof demandeToEdit === "object" ? demandeToEdit.id : demandeToEdit;
        const response = await updateDemande(id, formattedData, files);

        if (response.success) {
          toast.success(
            <div>
              <strong>Demande mise à jour avec succès !</strong>
              <p className="text-xs mt-1 opacity-90">Les modifications ont été enregistrées.</p>
            </div>,
            {
              icon: <FaCheckCircle className="text-green-500" size={20} />,
              autoClose: 5000,
            }
          );

          setTimeout(() => {
            navigate("/dashboard/requerant");
          }, 2000);
        }
      } else {
        // Mode création - Créer et soumettre directement
        const response = await createAndSubmitDemande(formattedData, files);

        if (response.success) {
          let message, details;

          if (response.submitted) {
            message = "Demande créée et soumise avec succès !";
            details = "Elle sera traitée par la Commission Nationale des Équivalences.";
          } else {
            message = "Demande créée avec succès";
            details = response.error || "Votre demande a été enregistrée.";
          }

          toast.success(
            <div>
              <strong>{message}</strong>
              <p className="text-xs mt-1 opacity-90">{details}</p>
            </div>,
            {
              icon: <FaCheckCircle className="text-green-500" size={20} />,
              autoClose: 5000,
            }
          );

          setTimeout(() => {
            navigate("/dashboard/requerant");
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la création et soumission:", error);

      let errorMessage = "Une erreur est survenue.";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      toast.error(
        <div>
          <strong>Erreur lors de la création</strong>
          <p className="text-xs mt-1">{errorMessage}</p>
        </div>,
        {
          icon: <FaExclamationTriangle className="text-red-500" size={20} />,
          autoClose: 5000,
        }
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress({});
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className={`rounded-xl shadow-sm p-8 border ${cardBg}`}>
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDark ? "bg-blue-900/40" : "bg-blue-100"}`}
              >
                <FaGraduationCap
                  className={`text-2xl ${isDark ? "text-blue-400" : "text-blue-600"}`}
                />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${textMain}`}>
                Sélectionnez le type de diplôme
              </h3>
              <p className={`text-sm ${textSub}`}>
                Choisissez le niveau de diplôme pour lequel vous souhaitez une
                équivalence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {diplomeTypes.map((diplome) => {
                const existing = existingDemandes.find(
                  d => d.type_diplome === diplome.title && 
                  (d.statut === "brouillon" || d.statut === "soumise" || d.statut === "en_cours")
                );
                const isDisabled = !!existing && !demandeToEdit;
                
                return (
                  <div
                    key={diplome.id}
                    onClick={() => !isDisabled && !isChecking && selectDiplomeType(diplome)}
                    className={`border rounded-lg p-6 transition-all duration-200 flex flex-col items-center ${
                      isDisabled 
                        ? isDark
                          ? "border-gray-700 bg-gray-800/50 opacity-50 cursor-not-allowed"
                          : "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                        : selectedDiplomeType?.id === diplome.id
                          ? isDark
                            ? "border-blue-500 bg-blue-900/30 ring-2 ring-blue-500/50 cursor-pointer"
                            : "border-blue-500 bg-blue-50 ring-2 ring-blue-200 cursor-pointer"
                          : isDark
                            ? "border-gray-600 hover:border-gray-500 bg-gray-700/40 hover:bg-gray-700/60 cursor-pointer"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-md cursor-pointer"
                    } ${isChecking ? "opacity-50 cursor-wait" : ""}`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                        isDisabled
                          ? isDark
                            ? "bg-gray-800"
                            : "bg-gray-100"
                          : selectedDiplomeType?.id === diplome.id
                            ? isDark
                              ? "bg-blue-800/50"
                              : "bg-blue-100"
                            : isDark
                              ? "bg-gray-700"
                              : "bg-gray-100"
                      }`}
                    >
                      <div
                        className={`text-2xl ${
                          isDisabled
                            ? isDark
                              ? "text-gray-600"
                              : "text-gray-400"
                            : selectedDiplomeType?.id === diplome.id
                              ? isDark
                                ? "text-blue-400"
                                : "text-blue-600"
                              : isDark
                                ? "text-gray-400"
                                : "text-gray-600"
                        }`}
                      >
                        {React.cloneElement(diplome.icon, { size: 28 })}
                      </div>
                    </div>
                    <h4 className={`font-medium text-center mb-2 ${isDisabled ? (isDark ? "text-gray-500" : "text-gray-400") : textMain}`}>
                      {diplome.title}
                    </h4>
                    <p className={`text-xs text-center ${isDisabled ? (isDark ? "text-gray-600" : "text-gray-400") : textSub}`}>
                      {diplome.description}
                    </p>
                    {existing && (
                      <div className="mt-4">
                        <div className="inline-flex items-center gap-1 text-amber-500 text-sm">
                          <FaExclamationTriangle size={12} />
                          <span className="font-medium text-xs">Déjà demandé</span>
                        </div>
                      </div>
                    )}
                    {selectedDiplomeType?.id === diplome.id && !existing && (
                      <div className="mt-4">
                        <div className="inline-flex items-center gap-1 text-green-500 text-sm">
                          <FaCheck size={12} />
                          <span className="font-medium">Sélectionné</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {isChecking && (
              <div className="mt-6 text-center">
                <FaSpinner className="animate-spin inline-block mr-2" />
                <span className={textSub}>
                  Vérification des demandes existantes...
                </span>
              </div>
            )}

            {errors.type_diplome && (
              <div className="mt-6 p-3 bg-red-900/20 border border-red-500/40 rounded-lg">
                <p className="text-red-400 text-sm">{errors.type_diplome}</p>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={handleCancelCreation}
                className={`px-5 py-2.5 border rounded-lg transition-colors text-sm ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!selectedDiplomeType || isChecking}
                className={`px-5 py-2.5 rounded-lg transition-colors text-sm flex items-center gap-2 ${
                  selectedDiplomeType && !isChecking
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : isDark
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isChecking ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Vérification...</span>
                  </>
                ) : (
                  <>
                    <span>Continuer</span>
                    <FaArrowRight size={12} />
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className={`rounded-xl shadow-sm p-6 border ${cardBg}`}>
            <h3 className={`text-lg font-semibold mb-6 ${textMain}`}>
              Informations Personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelCls}>
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) =>
                    handleInputChange("nom", e.target.value.toUpperCase())
                  }
                  className={inputCls(errors.nom)}
                  placeholder="Ex: RAKOTOARISOA"
                />
                {errors.nom && (
                  <span className="text-red-400 text-xs">{errors.nom}</span>
                )}
              </div>
              <div className="space-y-2">
                <label className={labelCls}>
                  Prénom(s) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.prenoms}
                  onChange={(e) => handleInputChange("prenoms", e.target.value)}
                  className={inputCls(errors.prenoms)}
                  placeholder="Ex: Marie-Claude"
                />
                {errors.prenoms && (
                  <span className="text-red-400 text-xs">{errors.prenoms}</span>
                )}
              </div>
              <div className="space-y-2">
                <label className={labelCls}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    handleInputChange("email", e.target.value.toLowerCase())
                  }
                  className={inputCls(errors.email)}
                  placeholder="Ex: marierakoto@gmail.com"
                />
                {errors.email && (
                  <span className="text-red-400 text-xs">{errors.email}</span>
                )}
              </div>
              <div className="space-y-2">
                <label className={labelCls}>
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.telephone}
                  onChange={(e) =>
                    handleInputChange("telephone", e.target.value)
                  }
                  className={inputCls(errors.telephone)}
                  placeholder="Ex: +261 34 12 345 67 ou 034 12 345 67"
                />
                {errors.telephone && (
                  <span className="text-red-400 text-xs">
                    {errors.telephone}
                  </span>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className={labelCls}>
                  Adresse <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code_postal}
                  onChange={(e) =>
                    handleInputChange("code_postal", e.target.value)
                  }
                  className={inputCls(errors.code_postal)}
                  placeholder="Ex: Lot II A 45 Bis Ambohimanarina, Antananarivo 101"
                />
                {errors.code_postal && (
                  <span className="text-red-400 text-xs">
                    {errors.code_postal}
                  </span>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={`rounded-xl shadow-sm p-6 border ${cardBg}`}>
            <h3 className={`text-lg font-semibold mb-6 ${textMain}`}>
              Raison de la Demande
            </h3>
            <div className="space-y-3">
              <label className={labelCls}>
                Raison principale <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.motif}
                onChange={(e) => handleInputChange("motif", e.target.value)}
                className={inputCls(errors.motif)}
              >
                <option value="">Sélectionner une raison</option>
                <option value="inscription">
                  Inscription dans un établissement de formation
                </option>
                <option value="ecole_doctorale">
                  Inscription école Doctorale
                </option>
                <option value="recherche_emploi">Recherche d'emploi</option>
                <option value="concours">Participation à un concours</option>
                <option value="autres">Autres</option>
              </select>
              {errors.motif && (
                <span className="text-red-400 text-xs">{errors.motif}</span>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className={`rounded-xl shadow-sm p-6 border ${cardBg}`}>
            <h3 className={`text-lg font-semibold mb-6 ${textMain}`}>
              Détails académiques
            </h3>
            <div
              className={`mb-4 p-3 rounded-lg border ${isDark ? "bg-blue-950/30 border-blue-800" : "bg-blue-50 border-blue-200"}`}
            >
              <div className="flex items-start gap-2">
                <FaInfoCircle
                  className={`mt-0.5 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                />
                <p
                  className={`text-sm ${isDark ? "text-blue-300" : "text-blue-700"}`}
                >
                  Veuillez renseigner tous vos parcours académiques et diplômes
                  obtenus depuis le baccalauréat, dans l'ordre chronologique (du
                  plus ancien au plus récent).
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {formData.recapitulatif_formation.map((recap, index) => (
                <div
                  key={index}
                  className={`border rounded-lg overflow-hidden ${isDark ? "border-gray-600" : "border-gray-200"}`}
                >
                  <div
                    className={`flex justify-between items-center p-4 cursor-pointer ${isDark ? "bg-gray-700/60 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"}`}
                    onClick={() => toggleFormation(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center ${isDark ? "bg-blue-900/50" : "bg-blue-100"}`}
                      >
                        <span
                          className={`text-xs font-medium ${isDark ? "text-blue-400" : "text-blue-600"}`}
                        >
                          {index + 1}
                        </span>
                      </div>
                      <h4 className={`font-medium ${textMain}`}>
                        Formation {index + 1}
                      </h4>
                      {errors.recapitulatif_formation_details?.[index] && (
                        <FaExclamationTriangle className="text-red-500 text-sm" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecapLine(index);
                        }}
                        className={`p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors ${formData.recapitulatif_formation.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={formData.recapitulatif_formation.length <= 1}
                      >
                        <FaTimes size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFormation(index);
                        }}
                        className={`p-1.5 rounded transition-colors ${isDark ? "text-gray-400 hover:bg-gray-600" : "text-gray-500 hover:bg-gray-200"}`}
                      >
                        {expandedFormations[index] ? (
                          <FaChevronUp size={14} />
                        ) : (
                          <FaChevronDown size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedFormations[index] && (
                    <div
                      className={`p-4 ${isDark ? "bg-gray-800" : "bg-white"}`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className={labelCls}>
                            Diplôme obtenu{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={recap.diplome}
                            onChange={(e) =>
                              handleRecapChange(
                                index,
                                "diplome",
                                e.target.value,
                              )
                            }
                            className={inputSmCls(
                              errors.recapitulatif_formation_details?.[index]
                                ?.diplome,
                            )}
                            placeholder="Ex: Licence en Informatique"
                          />
                          {errors.recapitulatif_formation_details?.[index]
                            ?.diplome && (
                            <span className="text-red-400 text-xs">
                              {
                                errors.recapitulatif_formation_details[index]
                                  .diplome
                              }
                            </span>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label className={labelCls}>
                            Année d'obtention{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={recap.annee_obtention}
                            onChange={(e) =>
                              handleRecapChange(
                                index,
                                "annee_obtention",
                                e.target.value,
                              )
                            }
                            className={inputSmCls(
                              errors.recapitulatif_formation_details?.[index]
                                ?.annee_obtention,
                            )}
                            placeholder="Ex: 2020"
                            maxLength="4"
                          />
                          {errors.recapitulatif_formation_details?.[index]
                            ?.annee_obtention && (
                            <span className="text-red-400 text-xs">
                              {
                                errors.recapitulatif_formation_details[index]
                                  .annee_obtention
                              }
                            </span>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label className={labelCls}>
                            Établissement{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={recap.etablissement}
                            onChange={(e) =>
                              handleRecapChange(
                                index,
                                "etablissement",
                                e.target.value,
                              )
                            }
                            className={inputSmCls(
                              errors.recapitulatif_formation_details?.[index]
                                ?.etablissement,
                            )}
                            placeholder="Ex: Université d'Antananarivo"
                          />
                          {errors.recapitulatif_formation_details?.[index]
                            ?.etablissement && (
                            <span className="text-red-400 text-xs">
                              {
                                errors.recapitulatif_formation_details[index]
                                  .etablissement
                              }
                            </span>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label className={labelCls}>
                            Mention obtenue{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={recap.mention}
                            onChange={(e) =>
                              handleRecapChange(
                                index,
                                "mention",
                                e.target.value,
                              )
                            }
                            className={inputSmCls(
                              errors.recapitulatif_formation_details?.[index]
                                ?.mention,
                            )}
                            placeholder="Ex: Assez Bien, Bien, Très Bien"
                          />
                          {errors.recapitulatif_formation_details?.[index]
                            ?.mention && (
                            <span className="text-red-400 text-xs">
                              {
                                errors.recapitulatif_formation_details[index]
                                  .mention
                              }
                            </span>
                          )}
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className={labelCls}>
                            Parcours / Spécialité{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={recap.parcours_option_specialite}
                            onChange={(e) =>
                              handleRecapChange(
                                index,
                                "parcours_option_specialite",
                                e.target.value,
                              )
                            }
                            className={inputSmCls(
                              errors.recapitulatif_formation_details?.[index]
                                ?.parcours_option_specialite,
                            )}
                            placeholder="Ex: Génie Logiciel, Réseaux et Télécommunications"
                          />
                          {errors.recapitulatif_formation_details?.[index]
                            ?.parcours_option_specialite && (
                            <span className="text-red-400 text-xs">
                              {
                                errors.recapitulatif_formation_details[index]
                                  .parcours_option_specialite
                              }
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addRecapLine}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full"
            >
              <FaPlus />
              <span>Ajouter une autre formation</span>
            </button>

            <div className="mt-6 space-y-3">
              <label className={labelCls}>
                Destinataire <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.destinataire}
                onChange={(e) =>
                  handleInputChange("destinataire", e.target.value)
                }
                className={`${inputCls(errors.destinataire)} min-h-[100px]`}
                placeholder="Madame/Monsieur Le Ministre de l'Enseignement Supérieur et de la Recherche Scientifique, Président(e) de la Commission Nationale des Équivalences"
              />
              {errors.destinataire && (
                <span className="text-red-400 text-xs">
                  {errors.destinataire}
                </span>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className={`rounded-xl shadow-sm p-6 border ${cardBg}`}>
            <h3 className={`text-lg font-semibold mb-2 ${textMain}`}>
              Dossiers à fournir pour une demande d'équivalence
            </h3>
            <p className={`text-sm text-red-500 mb-4`}>
              Les champs marqués d'une étoile{" "}
              <span className="text-red-500">*</span> sont obligatoires.
            </p>
            <p className={`text-sm mb-6 ${textSub}`}>
              Taille maximale par fichier : 8 Mo. Formats acceptés : PDF, DOC,
              DOCX, JPG, PNG.
            </p>

            <div className="space-y-6">
              {documentsRequis
                .filter((doc) => {
                  // Filtrer l'attestation master si le type de diplôme n'est pas Master
                  if (
                    doc.id === "attestation_master" &&
                    formData.type_diplome !== "Master"
                  ) {
                    return false;
                  }
                  return true;
                })
                .map((doc) => (
                  <div
                    key={doc.id}
                    className={`border rounded-lg p-4 transition-shadow hover:shadow-sm ${isDark ? "border-gray-600" : "border-gray-200"}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${textMain}`}>
                            {doc.titre}{" "}
                            {doc.obligatoire && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </h4>
                          {!doc.obligatoire && (
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-600"}`}
                            >
                              Optionnel
                            </span>
                          )}
                        </div>
                        <p className={`text-sm whitespace-pre-line ${textSub}`}>
                          {doc.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {formData.documents[doc.id] ? (
                        <div
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            typeof formData.documents[doc.id] === "string"
                              ? isDark
                                ? "bg-green-900/20 border-green-700"
                                : "bg-green-50 border-green-200"
                              : isDark
                                ? "bg-blue-900/20 border-blue-700"
                                : "bg-blue-50 border-blue-200"
                          }`}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <FaFileAlt
                              className={
                                typeof formData.documents[doc.id] === "string"
                                  ? isDark
                                    ? "text-green-400"
                                    : "text-green-600"
                                  : isDark
                                    ? "text-blue-400"
                                    : "text-blue-600"
                              }
                            />
                            <div className="flex-1">
                              {typeof formData.documents[doc.id] ===
                              "string" ? (
                                <span
                                  className={`text-sm ${isDark ? "text-green-400" : "text-green-700"}`}
                                >
                                  {formData.documents[doc.id].split("/").pop()}
                                </span>
                              ) : (
                                <>
                                  <span
                                    className={`text-sm block ${isDark ? "text-blue-400" : "text-blue-700"}`}
                                  >
                                    {formData.documents[doc.id].name}
                                  </span>
                                  <span className={`text-xs ${textMuted}`}>
                                    {(
                                      formData.documents[doc.id].size /
                                      1024 /
                                      1024
                                    ).toFixed(2)}{" "}
                                    Mo
                                  </span>
                                  {uploadProgress[doc.id] > 0 &&
                                    uploadProgress[doc.id] < 100 && (
                                      <div className="mt-1">
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                          <div
                                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                            style={{
                                              width: `${uploadProgress[doc.id]}%`,
                                            }}
                                          ></div>
                                        </div>
                                      </div>
                                    )}
                                </>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFileChange(doc.id, null)}
                            className="text-red-500 hover:text-red-400 text-sm p-1"
                            title="Supprimer"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`border border-dashed rounded-lg p-4 transition-colors ${isDark ? "border-gray-600 hover:border-blue-500" : "border-gray-300 hover:border-blue-400"}`}
                        >
                          <input
                            type="file"
                            id={doc.id}
                            onChange={(e) =>
                              handleFileChange(doc.id, e.target.files[0])
                            }
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                          <label
                            htmlFor={doc.id}
                            className={`cursor-pointer transition-colors flex flex-col items-center ${isDark ? "text-gray-400 hover:text-blue-400" : "text-gray-600 hover:text-blue-600"}`}
                          >
                            <FaFileUpload className="text-xl mb-2" />
                            <div className="text-sm text-center">
                              Cliquez pour sélectionner un fichier
                            </div>
                            <div className={`text-xs mt-1 ${textMuted}`}>
                              PDF, DOC, DOCX, JPG, PNG (max 8 Mo)
                            </div>
                          </label>
                        </div>
                      )}
                      {errors[doc.id] && (
                        <span className="text-red-400 text-xs">
                          {errors[doc.id]}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className={`rounded-xl shadow-sm p-6 border ${cardBg}`}>
            <h3 className={`text-lg font-semibold mb-6 ${textMain}`}>
              Validation de votre demande
            </h3>

            <div className="space-y-4">
              {[
                {
                  title: "Type de diplôme",
                  step: 0,
                  content: (
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? "bg-blue-900/40" : "bg-blue-100"}`}
                      >
                        <FaGraduationCap
                          className={isDark ? "text-blue-400" : "text-blue-600"}
                        />
                      </div>
                      <p className={`font-medium ${textMain}`}>
                        {formData.type_diplome || "Non spécifié"}
                      </p>
                    </div>
                  ),
                },
                {
                  title: "Informations Personnelles",
                  step: 1,
                  content: (
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className={textSub}>Nom :</span>{" "}
                        <span className={`font-medium ${textMain}`}>
                          {formData.nom || "—"}
                        </span>
                      </div>
                      <div>
                        <span className={textSub}>Prénom(s) :</span>{" "}
                        <span className={`font-medium ${textMain}`}>
                          {formData.prenoms || "—"}
                        </span>
                      </div>
                      <div>
                        <span className={textSub}>Email :</span>{" "}
                        <span className={`font-medium ${textMain}`}>
                          {formData.email || "—"}
                        </span>
                      </div>
                      <div>
                        <span className={textSub}>Téléphone :</span>{" "}
                        <span className={`font-medium ${textMain}`}>
                          {formData.telephone || "—"}
                        </span>
                      </div>
                      <div>
                        <span className={textSub}>Adresse :</span>{" "}
                        <span className={`font-medium ${textMain}`}>
                          {formData.code_postal || "—"}
                        </span>
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Raison de la Demande",
                  step: 2,
                  content: (
                    <div className="text-sm">
                      <span className={textSub}>Raison principale :</span>
                      <span className={`font-medium ${textMain} ml-1`}>
                        {formData.motif
                          ? {
                              inscription:
                                "Inscription dans un établissement de formation",
                              ecole_doctorale: "Inscription école Doctorale",
                              recherche_emploi: "Recherche d'emploi",
                              concours: "Participation à un concours",
                              autres: "Autres",
                            }[formData.motif] || formData.motif
                          : "—"}
                      </span>
                    </div>
                  ),
                },
                {
                  title: "Détails académiques",
                  step: 3,
                  content: (
                    <div className="space-y-3">
                      {formData.recapitulatif_formation.map(
                        (formation, index) => (
                          <div
                            key={index}
                            className={`border-l-2 border-blue-500 pl-3 py-2 rounded-r ${isDark ? "bg-blue-950/20" : "bg-blue-50/30"}`}
                          >
                            <p
                              className={`font-medium mb-1 text-sm ${textMain}`}
                            >
                              Formation {index + 1}
                            </p>
                            <div className={`space-y-0.5 text-sm ${textSub}`}>
                              <div>
                                <span className="font-medium">Diplôme :</span>{" "}
                                {formation.diplome || "—"}
                              </div>
                              <div>
                                <span className="font-medium">Année :</span>{" "}
                                {formation.annee_obtention || "—"}
                              </div>
                              <div>
                                <span className="font-medium">
                                  Établissement :
                                </span>{" "}
                                {formation.etablissement || "—"}
                              </div>
                              <div>
                                <span className="font-medium">Mention :</span>{" "}
                                {formation.mention || "—"}
                              </div>
                              <div>
                                <span className="font-medium">
                                  Spécialité :
                                </span>{" "}
                                {formation.parcours_option_specialite || "—"}
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  ),
                },
                {
                  title: "Documents Fournis",
                  step: 4,
                  content: (
                    <div className="space-y-2">
                      {documentsRequis
                        .filter(
                          (doc) =>
                            !(
                              doc.id === "attestation_master" &&
                              formData.type_diplome !== "Master"
                            ),
                        )
                        .map((doc) => {
                          const isFourni = formData.documents[doc.id];
                          return (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between py-1.5"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${isFourni ? "bg-green-500" : "bg-red-500"}`}
                                />
                                <span className={`text-sm ${textMain}`}>
                                  {doc.titre}
                                  {!doc.obligatoire && (
                                    <span
                                      className={`text-xs ml-1 ${textMuted}`}
                                    >
                                      (optionnel)
                                    </span>
                                  )}
                                </span>
                              </div>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  isFourni
                                    ? isDark
                                      ? "bg-green-900/30 text-green-400"
                                      : "bg-green-100 text-green-800"
                                    : isDark
                                      ? "bg-red-900/30 text-red-400"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {isFourni ? "✓ Fourni" : "✗ Manquant"}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  ),
                },
              ].map(({ title, step, content }) => (
                <div
                  key={title}
                  className={`border rounded-lg p-4 ${isDark ? "border-gray-600" : "border-gray-200"}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-medium ${textMain}`}>{title}</h4>
                    <button
                      onClick={() => goToStep(step)}
                      className={`text-sm ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
                    >
                      Modifier
                    </button>
                  </div>
                  {content}
                </div>
              ))}
            </div>

            <div
              className={`mt-6 p-4 rounded-lg border ${isDark ? "bg-blue-950/30 border-blue-800" : "bg-blue-50 border-blue-200"}`}
            >
              <div className="flex items-start gap-3">
                <FaInfoCircle
                  className={`mt-0.5 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                />
                <div>
                  <h4
                    className={`font-medium mb-1 ${isDark ? "text-blue-300" : "text-blue-800"}`}
                  >
                    Confirmation
                  </h4>
                  <p
                    className={`text-sm ${isDark ? "text-blue-400" : "text-blue-700"}`}
                  >
                    En soumettant cette demande, vous certifiez que toutes les
                    informations fournies sont exactes et complètes. Votre
                    demande sera traitée dans les plus brefs délais par la
                    Commission Nationale des Équivalences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // --- PAGE INFO (avant formulaire) ---
  if (!showFormulaire && !demandeToEdit) {
    return (
      <div
        className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${bg}`}
      >
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className={`text-xl md:text-2xl font-bold mb-2 ${textMain}`}>
              Nouvelle demande d'équivalence
            </h1>
            <p className={`text-sm ${textSub}`}>
              Créez une nouvelle demande d'équivalence de diplôme
            </p>
          </div>

          <div className="mb-6">
            <div className={`border rounded-xl shadow-sm p-5 mb-4 ${cardBg}`}>
              <header className="mb-5 text-center">
                <h1
                  className={`text-lg sm:text-xl tracking-wide uppercase font-bold ${textMain}`}
                >
                  Dossiers à fournir pour une demande d'équivalence
                </h1>
              </header>

              <section
                className={`border p-4 sm:p-6 rounded-r-lg mb-8 ${isDark ? "bg-gray-700/30 border-gray-600" : "bg-white border-gray-200"}`}
              >
                <ol
                  className={`list-decimal pl-5 space-y-4 text-sm ${isDark ? "text-gray-300" : "text-slate-700"}`}
                >
                  {dossiersEquivalence.map((item, idx) => (
                    <li key={idx} className="pl-2">
                      <p className={`mb-1 ${textMain}`}>{item.title}</p>
                      {item.details && (
                        <ul
                          className={`list-disc pl-5 mt-2 space-y-1 ${textSub}`}
                        >
                          {item.details.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>
              </section>

              <header className="mb-5 text-center">
                <h1
                  className={`text-lg sm:text-xl tracking-wide uppercase font-bold ${textMain}`}
                >
                  Circuit de la demande d'équivalence
                </h1>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div
                  className={`p-5 rounded-lg border shadow-sm ${isDark ? "bg-gray-700/50 border-gray-600" : "bg-white border-gray-200"}`}
                >
                  <h3
                    className={`font-bold text-sm mb-2 ${isDark ? "text-blue-400" : "text-[#063a66]"}`}
                  >
                    Remarque :
                  </h3>
                  <p className={`text-sm ${textSub}`}>
                    Prise de décision par les membres de la CNE : La décision
                    peut être <strong className={textMain}>positive</strong> ou{" "}
                    <strong className={textMain}>négative</strong>. En cas de
                    décision défavorable, le motif du rejet sera communiqué.
                  </p>
                </div>
                <div
                  className={`p-5 rounded-lg border shadow-sm ${isDark ? "bg-gray-700/50 border-gray-600" : "bg-white border-gray-200"}`}
                >
                  <h3
                    className={`font-bold text-sm mb-2 ${isDark ? "text-blue-400" : "text-[#063a66]"}`}
                  >
                    Types de demande :
                  </h3>
                  <ul className={`list-disc pl-4 text-sm space-y-1 ${textSub}`}>
                    <li>
                      <strong className={textMain}>Diplômes nationaux :</strong>{" "}
                      Arrêtés nominatifs (Privé) ou non (Public).
                    </li>
                    <li>
                      <strong className={textMain}>Diplômes étrangers :</strong>{" "}
                      Dépend du pays et de l'établissement.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Workflow */}
              <div className="flex flex-col gap-10 md:gap-16 pb-2">
                {[
                  stepsEquivalence.slice(0, 3),
                  stepsEquivalence.slice(3, 6),
                  stepsEquivalence.slice(6, 9),
                ].map((group, groupIdx) => (
                  <div
                    key={groupIdx}
                    className={`relative grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-8 ${groupIdx > 0 ? "pt-4 md:pt-0" : ""}`}
                  >
                    {group.map((step, index) => (
                      <div key={step.id} className="relative group h-full">
                        <div
                          className={`border p-4 rounded-lg shadow-sm h-full flex gap-3 transition-colors z-20 relative ${
                            isDark
                              ? "bg-gray-700/50 border-blue-900 hover:border-blue-700"
                              : "bg-white border-blue-100 hover:border-blue-300"
                          }`}
                        >
                          <div className="bg-[#0b4b8a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                            {step.id}
                          </div>
                          <span
                            className={`text-sm leading-relaxed whitespace-pre-line ${textSub}`}
                          >
                            {step.title}
                          </span>
                        </div>
                        {index < 2 && (
                          <div className="hidden md:block absolute top-1/2 -right-10 w-12 h-0.5 bg-blue-200 transform -translate-y-1/2 z-0 after:content-[''] after:absolute after:-right-1 after:-top-1 after:border-t-4 after:border-t-transparent after:border-b-4 after:border-b-transparent after:border-l-4 after:border-l-blue-200" />
                        )}
                        {groupIdx < 2 && index === 2 && (
                          <div className="hidden md:block absolute top-full right-1/2 w-[calc(200%+4rem)] h-12 pointer-events-none z-0">
                            <div className="absolute top-0 right-0 h-full w-0.5 bg-blue-200 rounded-t-sm"></div>
                            <div className="absolute bottom-0 right-0 w-full h-0.5 bg-blue-200 rounded-bl-xl rounded-br-xl"></div>
                            <div className="absolute top-full left-0 h-4 w-0.5 bg-blue-200"></div>
                            <div className="absolute -bottom-4 -left-1.5 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[8px] border-t-blue-200"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Checkbox */}
            <div
              className={`border rounded-lg p-4 mb-4 ${isDark ? "bg-blue-950/20 border-blue-800" : "bg-blue-50 border-blue-200"}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    id="accept-terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="accept-terms"
                    className={`text-sm font-medium cursor-pointer ${textMain}`}
                  >
                    Je certifie avoir pris connaissance de la liste des
                    documents requis et m'engage à fournir l'ensemble des pièces
                    demandées. <span className="text-red-500">*</span>
                  </label>
                  <p className={`text-xs mt-1 ${textSub}`}>
                    En cochant cette case, vous acceptez les conditions de
                    traitement de votre demande d'équivalence.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <button
                onClick={handleStartCreation}
                disabled={!acceptedTerms}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors text-sm font-medium ${
                  acceptedTerms
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    : isDark
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FaPlus />
                <span>Commencer la demande</span>
              </button>
              <p className={`text-xs mt-2 ${textMuted}`}>
                {acceptedTerms
                  ? "Cliquez sur le bouton pour commencer à créer votre demande d'équivalence"
                  : "Vous devez accepter les conditions pour continuer"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- FORMULAIRE MULTI-ÉTAPES ---
  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${bg}`}
    >
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className={`text-xl md:text-2xl font-bold mb-1 ${textMain}`}>
            {demandeToEdit ? "Modifier la demande" : "Créer votre demande"}
          </h1>
          <p className={`text-sm ${textSub}`}>
            {demandeToEdit
              ? "Modifiez votre demande d'équivalence"
              : "Remplissez le formulaire pour créer votre demande"}
          </p>
          {demandeToEdit && (
            <p
              className={`text-xs mt-1 ${isDark ? "text-yellow-400" : "text-yellow-600"}`}
            >
              ⚠️ Vous êtes en mode édition. Les modifications seront
              enregistrées.
            </p>
          )}
        </div>

        <div className="mb-6">
          {/* Barre de progression */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className={`text-xs md:text-sm font-medium ${textSub}`}>
                Progression
              </span>
              <span className="text-xs md:text-sm font-semibold text-blue-500">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div
              className={`w-full rounded-full h-1.5 md:h-2 ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
            >
              <div
                className="h-1.5 md:h-2 rounded-full transition-all duration-500 ease-out bg-blue-600"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden mb-6">
            <div className={`border rounded-lg p-4 shadow-sm ${cardBg}`}>
              <p className={`text-xs mb-1 ${textMuted}`}>
                Étape {currentStep + 1}/{steps.length}
              </p>
              <p className={`text-base font-semibold ${textMain}`}>
                {steps[currentStep]?.title}
              </p>
            </div>
          </div>

          {/* Desktop stepper */}
          <div className="hidden md:block mb-8 lg:mb-10">
            <div className="relative">
              <div
                className={`absolute left-0 right-0 top-[19px] h-0.5 ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
              />
              <div
                className="absolute left-0 top-[19px] h-0.5 transition-all duration-500 ease-out bg-blue-600"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
              <div className="grid grid-cols-6 gap-3 relative z-10">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-sm font-bold ${
                        index < currentStep
                          ? "bg-green-600 border-green-600 text-white"
                          : index === currentStep
                            ? "bg-blue-600 border-blue-600 ring-2 ring-blue-200 text-white"
                            : isDark
                              ? "bg-gray-700 border-gray-600 text-gray-500"
                              : "bg-white border-gray-300 text-gray-500"
                      }`}
                    >
                      {index < currentStep ? (
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
                        index + 1
                      )}
                    </div>
                    <p
                      className={`mt-2 text-xs font-medium text-center leading-tight max-w-[100px] ${
                        index === currentStep
                          ? isDark
                            ? "text-blue-400"
                            : "text-blue-600"
                          : textMuted
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">{renderStepContent()}</div>

          {currentStep !== 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 px-6 py-3 border rounded-lg transition-colors text-sm font-medium w-full sm:w-auto ${
                  isDark
                    ? "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <FaArrowLeft size={14} />
                <span>Précédent</span>
              </button>

              {currentStep === steps.length - 1 ? (
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {/* Bouton de soumission pour nouvelle demande */}
                  {!demandeToEdit && (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin" size={14} />
                          <span>Traitement...</span>
                        </>
                      ) : (
                        <>
                          <FaCheck size={14} />
                          <span>Soumettre</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Bouton de mise à jour pour édition */}
                  {demandeToEdit && (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin" size={14} />
                          <span>Traitement...</span>
                        </>
                      ) : (
                        <>
                          <FaCheck size={14} />
                          <span>Mettre à jour</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Suivant</span>
                  <FaArrowRight size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}