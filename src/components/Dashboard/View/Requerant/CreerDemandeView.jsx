import React, { useState, useEffect } from "react";
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
} from "react-icons/fa";

// Types de diplôme disponibles
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
    color: "purple",
  },
  {
    id: "doctorat",
    title: "Doctorat",
    description: "Équivalence de diplôme de niveau Doctorat (BAC+8)",
    icon: <FaGraduationCap />,
    color: "green",
  },
];

// Documents requis selon les spécifications officielles
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

// Données pour la section "Dossiers à fournir" - ENVELOPPE SUPPRIMÉE
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

// Steps pour le circuit de la demande d'équivalence
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
  destinataire: "",
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

export default function CreerDemandeView() {
  const location = useLocation();
  const navigate = useNavigate();
  const demandeToEdit = location.state?.demande || null;

  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [selectedDiplomeType, setSelectedDiplomeType] = useState(null);
  const [showFormulaire, setShowFormulaire] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [expandedFormations, setExpandedFormations] = useState([true]);

  const steps = [
    {
      title: "Type de diplôme",
      fields: ["type_diplome"],
    },
    {
      title: "Informations Personnelles",
      fields: ["nom", "prenoms", "code_postal", "telephone", "email"],
    },
    {
      title: "Motif",
      fields: ["motif"],
    },
    {
      title: "Formation",
      fields: ["recapitulatif_formation", "destinataire"],
    },
    {
      title: "Documents",
      fields: ["documents"],
    },
    {
      title: "Validation",
      fields: [],
    },
  ];

  const handleRecapChange = (index, field, value) => {
    // Validation selon le type de champ
    if (field === "annee_obtention") {
      // Seuls les chiffres pour l'année
      if (value && !/^\d*$/.test(value)) {
        return;
      }
      // Limiter à 4 chiffres pour une année
      if (value.length > 4) {
        return;
      }
    } else if (
      field === "diplome" ||
      field === "etablissement" ||
      field === "parcours_option_specialite"
    ) {
      // Pas de chiffres dans les champs texte
      if (value && /\d/.test(value)) {
        return;
      }
    }

    const newRecaps = [...formData.recapitulatif_formation];
    newRecaps[index][field] = value;
    setFormData((prev) => ({ ...prev, recapitulatif_formation: newRecaps }));

    // Supprimer l'erreur pour ce champ spécifique
    if (errors.recapitulatif_formation_details?.[index]?.[field]) {
      const newErrors = { ...errors };
      if (newErrors.recapitulatif_formation_details[index]) {
        delete newErrors.recapitulatif_formation_details[index][field];
        if (
          Object.keys(newErrors.recapitulatif_formation_details[index])
            .length === 0
        ) {
          delete newErrors.recapitulatif_formation_details[index];
        }
        if (
          Object.keys(newErrors.recapitulatif_formation_details).length === 0
        ) {
          delete newErrors.recapitulatif_formation_details;
        }
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

    // Validation spécifique pour l'année (doit être 4 chiffres)
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
    // Valider la formation actuelle avant d'ajouter une nouvelle
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
    if (demandeToEdit) {
      const docs = {};
      Object.keys(initialFormData.documents).forEach((key) => {
        docs[key] = demandeToEdit[`${key}_nom`] || null;
      });

      let recap = [];
      if (Array.isArray(demandeToEdit.recapitulatif_formation)) {
        recap = demandeToEdit.recapitulatif_formation;
      } else if (typeof demandeToEdit.recapitulatif_formation === "string") {
        try {
          recap = JSON.parse(demandeToEdit.recapitulatif_formation);
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
        ...demandeToEdit,
        documents: docs,
        recapitulatif_formation: recap,
        type_diplome: demandeToEdit.type_diplome || "",
      }));

      if (demandeToEdit.type_diplome) {
        const diplome = diplomeTypes.find(
          (d) => d.title === demandeToEdit.type_diplome,
        );
        if (diplome) {
          setSelectedDiplomeType(diplome);
        }
      }

      // Si on édite une demande, on affiche directement le formulaire
      setShowFormulaire(true);
      setAcceptedTerms(true);
      setExpandedFormations(new Array(recap.length).fill(true));
    }
  }, [demandeToEdit]);

  const handleInputChange = (field, value) => {
    // Validation spécifique pour le téléphone
    if (field === "telephone") {
      // Autoriser uniquement les chiffres, les espaces et le signe +
      if (value && !/^[\d\s+]*$/.test(value)) {
        return;
      }
    }
    // Validation pour le nom et prénom (pas de chiffres)
    else if (field === "nom" || field === "prenoms") {
      if (value && /\d/.test(value)) {
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (documentId, file) => {
    if (file) {
      const maxSize = 8 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("Le fichier dépasse la taille maximale autorisée de 8 Mo");
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
        alert(
          "Format de fichier invalide. Extensions autorisées : pdf, doc, jpg, png",
        );
        return;
      }
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
    const currentStepFields = steps[stepIndex].fields;

    currentStepFields.forEach((field) => {
      if (field === "type_diplome") {
        if (!formData.type_diplome || formData.type_diplome.trim() === "") {
          newErrors[field] = "Veuillez sélectionner un type de diplôme";
        }
      } else if (field === "documents") {
        documentsRequis
          .filter((doc) => doc.obligatoire)
          .forEach((doc) => {
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

            // Validation spécifique pour l'année
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
        ) {
          newErrors[field] =
            "Numéro de téléphone invalide. Format: +261 34 123 45 67 ou 034 12 345 67";
        }
      } else if (field === "nom" || field === "prenoms") {
        if (!formData[field] || formData[field].trim() === "") {
          newErrors[field] = "Ce champ est obligatoire";
        } else if (/\d/.test(formData[field])) {
          newErrors[field] = "Ce champ ne doit pas contenir de chiffres";
        }
      } else {
        if (
          !formData[field] ||
          (typeof formData[field] === "string" && formData[field].trim() === "")
        ) {
          newErrors[field] = "Ce champ est obligatoire";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < steps.length - 1)
      setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex);
    }
  };

  const selectDiplomeType = (diplome) => {
    setSelectedDiplomeType(diplome);
    setFormData((prev) => ({ ...prev, type_diplome: diplome.title }));
    setErrors((prev) => ({ ...prev, type_diplome: "" }));
  };

  const handleStartCreation = () => {
    if (!acceptedTerms) {
      alert("Vous devez accepter les conditions avant de continuer");
      return;
    }
    setShowFormulaire(true);
    setCurrentStep(0);
  };

  const handleCancelCreation = () => {
    if (demandeToEdit) {
      navigate("/dashboard/requerant");
    } else {
      setShowFormulaire(false);
      setCurrentStep(0);
      setSelectedDiplomeType(null);
      setFormData(initialFormData);
      setErrors({});
      setAcceptedTerms(false);
      setExpandedFormations([true]);
    }
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;
    const isEditing = !!demandeToEdit;
    setSubmissionResult({
      success: true,
      message: isEditing
        ? "Votre demande a été mise à jour avec succès !"
        : "Votre demande a été soumise avec succès !",
      details: isEditing
        ? "Les modifications ont été enregistrées et seront traitées par notre équipe."
        : "Votre demande a été enregistrée et sera traitée dans les plus brefs délais. Vous recevrez un email de confirmation.",
    });
    setShowSuccessModal(true);

    if (!isEditing) {
      setFormData(initialFormData);
      setCurrentStep(0);
      setSelectedDiplomeType(null);
      setErrors({});
      setShowFormulaire(false);
      setAcceptedTerms(false);
      setExpandedFormations([true]);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <FaGraduationCap className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Sélectionnez le type de diplôme
              </h3>
              <p className="text-gray-600 text-sm">
                Choisissez le niveau de diplôme pour lequel vous souhaitez une
                équivalence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {diplomeTypes.map((diplome) => (
                <div
                  key={diplome.id}
                  onClick={() => selectDiplomeType(diplome)}
                  className={`border rounded-lg p-6 cursor-pointer transition-all duration-200 flex flex-col items-center ${
                    selectedDiplomeType?.id === diplome.id
                      ? `border-${diplome.color}-500 bg-${diplome.color}-50`
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      selectedDiplomeType?.id === diplome.id
                        ? `bg-${diplome.color}-100`
                        : "bg-gray-100"
                    }`}
                  >
                    <div
                      className={`text-2xl ${
                        selectedDiplomeType?.id === diplome.id
                          ? `text-${diplome.color}-600`
                          : "text-gray-600"
                      }`}
                    >
                      {React.cloneElement(diplome.icon, { size: 28 })}
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-800 text-center mb-2">
                    {diplome.title}
                  </h4>
                  <p className="text-xs text-gray-600 text-center">
                    {diplome.description}
                  </p>
                  {selectedDiplomeType?.id === diplome.id && (
                    <div className="mt-4">
                      <div className="inline-flex items-center gap-1 text-green-600 text-sm">
                        <FaCheck size={12} />
                        <span className="font-medium">Sélectionné</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {errors.type_diplome && (
              <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.type_diplome}</p>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={handleCancelCreation}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!selectedDiplomeType}
                className={`px-5 py-2.5 rounded-lg transition-colors text-sm ${
                  selectedDiplomeType
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continuer
              </button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Informations Personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleInputChange("nom", e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none ${
                    errors.nom
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Ex: RAKOTOARISOA"
                />
                {errors.nom && (
                  <span className="text-red-500 text-xs">{errors.nom}</span>
                )}
              </div>

              {/* Prénom */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Prénom(s) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.prenoms}
                  onChange={(e) => handleInputChange("prenoms", e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none ${
                    errors.prenoms
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Ex: Marie-Claude"
                />
                {errors.prenoms && (
                  <span className="text-red-500 text-xs">{errors.prenoms}</span>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none ${
                    errors.email
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Ex: marierakoto@gmail.com"
                />
                {errors.email && (
                  <span className="text-red-500 text-xs">{errors.email}</span>
                )}
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.telephone}
                  onChange={(e) =>
                    handleInputChange("telephone", e.target.value)
                  }
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none ${
                    errors.telephone
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Ex: +261 34 12 345 67 ou 034 12 345 67"
                />
                {errors.telephone && (
                  <span className="text-red-500 text-xs">
                    {errors.telephone}
                  </span>
                )}
              </div>

              {/* Adresse */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Adresse <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code_postal}
                  onChange={(e) =>
                    handleInputChange("code_postal", e.target.value)
                  }
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none ${
                    errors.code_postal
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="Ex: Lot II A 45 Bis Ambohimanarina, Antananarivo 101"
                />
                {errors.code_postal && (
                  <span className="text-red-500 text-xs">
                    {errors.code_postal}
                  </span>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Raison de la Demande
            </h3>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Raison principale <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.motif}
                onChange={(e) => handleInputChange("motif", e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none ${
                  errors.motif
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <option value="">Sélectionner une raison</option>
                <option value="inscription">
                  Inscription dans un établissement de formation
                </option>
                <option value="ecole_doctorale">
                  Inscription école Doctorale
                </option>
                <option value="recherche">Recherche d'emploi</option>
                <option value="concours">Participation à un concours</option>
                <option value="autres">Autres</option>
              </select>
              {errors.motif && (
                <span className="text-red-500 text-xs">{errors.motif}</span>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Détails académiques
            </h3>

            {/* Message d'information */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <FaInfoCircle className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-700 text-sm">
                    Veuillez renseigner tous vos parcours académiques et
                    diplômes obtenus depuis le baccalauréat, dans l'ordre
                    chronologique (du plus ancien au plus récent).
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {formData.recapitulatif_formation.map((recap, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* En-tête de la formation */}
                  <div
                    className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                    onClick={() => toggleFormation(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-medium">
                          {index + 1}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-800">
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
                        className={`p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors ${formData.recapitulatif_formation.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
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
                        className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors"
                      >
                        {expandedFormations[index] ? (
                          <FaChevronUp size={14} />
                        ) : (
                          <FaChevronDown size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Contenu de la formation */}
                  {expandedFormations[index] && (
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Diplôme */}
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-gray-700">
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
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none ${
                              errors.recapitulatif_formation_details?.[index]
                                ?.diplome
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Ex: Licence en Informatique"
                          />
                          {errors.recapitulatif_formation_details?.[index]
                            ?.diplome && (
                            <span className="text-red-500 text-xs">
                              {
                                errors.recapitulatif_formation_details[index]
                                  .diplome
                              }
                            </span>
                          )}
                        </div>

                        {/* Année d'obtention */}
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-gray-700">
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
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none ${
                              errors.recapitulatif_formation_details?.[index]
                                ?.annee_obtention
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Ex: 2020"
                          />
                          {errors.recapitulatif_formation_details?.[index]
                            ?.annee_obtention && (
                            <span className="text-red-500 text-xs">
                              {
                                errors.recapitulatif_formation_details[index]
                                  .annee_obtention
                              }
                            </span>
                          )}
                        </div>

                        {/* Établissement */}
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-gray-700">
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
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none ${
                              errors.recapitulatif_formation_details?.[index]
                                ?.etablissement
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Ex: Université d'Antananarivo"
                          />
                          {errors.recapitulatif_formation_details?.[index]
                            ?.etablissement && (
                            <span className="text-red-500 text-xs">
                              {
                                errors.recapitulatif_formation_details[index]
                                  .etablissement
                              }
                            </span>
                          )}
                        </div>

                        {/* Mention */}
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-gray-700">
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
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none ${
                              errors.recapitulatif_formation_details?.[index]
                                ?.mention
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Ex: Assez Bien, Bien, Très Bien"
                          />
                          {errors.recapitulatif_formation_details?.[index]
                            ?.mention && (
                            <span className="text-red-500 text-xs">
                              {
                                errors.recapitulatif_formation_details[index]
                                  .mention
                              }
                            </span>
                          )}
                        </div>

                        {/* Parcours/Spécialité */}
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
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
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none ${
                              errors.recapitulatif_formation_details?.[index]
                                ?.parcours_option_specialite
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Ex: Génie Logiciel, Réseaux et Télécommunications"
                          />
                          {errors.recapitulatif_formation_details?.[index]
                            ?.parcours_option_specialite && (
                            <span className="text-red-500 text-xs">
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
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full"
              onClick={addRecapLine}
            >
              <FaPlus />
              <span>Ajouter une autre formation</span>
            </button>

            <div className="mt-6 space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Destinataire <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.destinataire}
                onChange={(e) =>
                  handleInputChange("destinataire", e.target.value)
                }
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none min-h-[100px] ${
                  errors.destinataire
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="Madame/Monsieur Le Ministre de l'Enseignement Supérieur et de la Recherche Scientifique, Président(e) de la Commission Nationale des Équivalences"
              />
              {errors.destinataire && (
                <span className="text-red-500 text-xs">
                  {errors.destinataire}
                </span>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Dossiers à fournir pour une demande d'équivalence
            </h3>
            <p className="text-sm text-red-600 mb-4">
              Les champs marqués d'une étoile{" "}
              <span className="text-red-500">*</span> sont obligatoires.
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Taille maximale par fichier : 8 Mo. Formats acceptés : PDF, DOC,
              JPG, PNG.
            </p>
            <div className="space-y-6">
              {documentsRequis.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-800">
                          {doc.titre}{" "}
                          {doc.obligatoire && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </h4>
                        {!doc.obligatoire && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            Optionnel
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {doc.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {formData.documents[doc.id] ? (
                      typeof formData.documents[doc.id] === "string" ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FaFileAlt className="text-green-600" />
                            <span className="text-green-700 text-sm">
                              {formData.documents[doc.id]}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFileChange(doc.id, null)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FaFileAlt className="text-blue-600" />
                            <div>
                              <span className="text-blue-700 text-sm block">
                                {formData.documents[doc.id].name}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {(
                                  formData.documents[doc.id].size /
                                  1024 /
                                  1024
                                ).toFixed(2)}{" "}
                                Mo
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFileChange(doc.id, null)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="border border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
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
                          className="cursor-pointer text-gray-600 hover:text-blue-600 transition-colors flex flex-col items-center"
                        >
                          <FaFileUpload className="text-xl mb-2" />
                          <div className="text-sm text-center">
                            Cliquez pour sélectionner un fichier
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            PDF, DOC, JPG, PNG (max 8 Mo)
                          </div>
                        </label>
                      </div>
                    )}
                    {errors[doc.id] && (
                      <span className="text-red-500 text-xs">
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
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Validation de votre demande
            </h3>

            <div className="space-y-6">
              {/* Type de diplôme */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">Type de diplôme</h4>
                  <button
                    onClick={() => goToStep(0)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Modifier
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaGraduationCap className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {formData.type_diplome}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations Personnelles */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">
                    Informations Personnelles
                  </h4>
                  <button
                    onClick={() => goToStep(1)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Modifier
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 text-sm">Nom :</span>
                    <p className="font-medium">{formData.nom}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Prénom(s) :</span>
                    <p className="font-medium">{formData.prenoms}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Email :</span>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Téléphone :</span>
                    <p className="font-medium">{formData.telephone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Adresse :</span>
                    <p className="font-medium">{formData.code_postal}</p>
                  </div>
                </div>
              </div>

              {/* Raison de la Demande */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">
                    Raison de la Demande
                  </h4>
                  <button
                    onClick={() => goToStep(2)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Modifier
                  </button>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">
                    Raison principale :
                  </span>
                  <p className="font-medium">{formData.motif}</p>
                </div>
              </div>

              {/* Formations */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">
                    Détails académiques
                  </h4>
                  <button
                    onClick={() => goToStep(3)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Modifier
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.recapitulatif_formation.map((formation, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-blue-500 pl-3 py-3 bg-blue-50/30 rounded-r"
                    >
                      <p className="font-medium text-gray-800 mb-2">
                        Formation {index + 1}
                      </p>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-gray-600">Diplôme :</span>{" "}
                          {formation.diplome}
                        </div>
                        <div>
                          <span className="text-gray-600">Année :</span>{" "}
                          {formation.annee_obtention}
                        </div>
                        <div>
                          <span className="text-gray-600">Établissement :</span>{" "}
                          {formation.etablissement}
                        </div>
                        <div>
                          <span className="text-gray-600">Mention :</span>{" "}
                          {formation.mention}
                        </div>
                        <div>
                          <span className="text-gray-600">Spécialité :</span>{" "}
                          {formation.parcours_option_specialite}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">
                    Documents Fournis
                  </h4>
                  <button
                    onClick={() => goToStep(4)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Modifier
                  </button>
                </div>
                <div className="space-y-2">
                  {documentsRequis.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            formData.documents[doc.id]
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-sm">
                          {doc.titre}
                          {!doc.obligatoire && (
                            <span className="text-gray-500 text-xs ml-1">
                              (optionnel)
                            </span>
                          )}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          formData.documents[doc.id]
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {formData.documents[doc.id] ? "✓ Fourni" : "✗ Manquant"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">
                    Confirmation
                  </h4>
                  <p className="text-blue-700 text-sm">
                    En soumettant cette demande, vous certifiez que toutes les
                    informations fournies sont exactes et complètes. Votre
                    demande sera traitée dans les plus brefs délais.
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

  if (!showFormulaire && !demandeToEdit) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Nouvelle demande d'équivalence
            </h1>
            <p className="text-gray-600 text-sm">
              Créez une nouvelle demande d'équivalence de diplôme
            </p>
          </div>

          {/* SECTION AMÉLIORÉE : Dossiers à fournir - ENVELOPPE SUPPRIMÉE */}
          <div className="mb-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-4">
              <header className="mb-5 text-center">
                <h1 className="text-lg sm:text-xl text-gray-900 tracking-wide uppercase font-bold">
                  Dossiers à fournir pour une demande d'équivalence
                </h1>
              </header>

              <section className="bg-white border border-gray-200 p-4 sm:p-6 rounded-r-lg mb-8">
                <ol className="list-decimal pl-5 space-y-4 text-slate-700 text-sm">
                  {dossiersEquivalence.map((item, idx) => (
                    <li key={idx} className="pl-2">
                      <p className="text-gray-900 mb-1">{item.title}</p>
                      {item.details && (
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
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
                <h1 className="text-lg sm:text-xl text-gray-900 tracking-wide uppercase font-bold">
                  Circuit de la demande d'équivalence
                </h1>
              </header>

              {/* Remarque et Types de demande */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm ring-1 ring-slate-100">
                  <h3 className="text-[#063a66] font-bold text-sm mb-2">
                    Remarque :
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Prise de décision par les membres de la CNE : La décision
                    peut être{" "}
                    <strong className="text-slate-900">positive</strong> ou{" "}
                    <strong className="text-slate-900">négative</strong>. En cas
                    de décision défavorable, le motif du rejet sera communiqué.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm ring-1 ring-slate-100">
                  <h3 className="text-[#063a66] font-bold text-sm mb-2">
                    Types de demande :
                  </h3>
                  <ul className="list-disc pl-4 text-slate-600 text-sm space-y-1">
                    <li>
                      <strong>Diplômes nationaux :</strong> Arrêtés nominatifs
                      (Privé) ou non (Public).
                    </li>
                    <li>
                      <strong>Diplômes étrangers :</strong> Dépend du pays et de
                      l'établissement.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Workflow de la demande */}
              <div className="flex flex-col gap-10 md:gap-16 pb-2">
                {/* Première ligne */}
                <div className="relative grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-8">
                  {stepsEquivalence.slice(0, 3).map((step, index) => (
                    <div key={step.id} className="relative group h-full">
                      <div className="bg-white border border-blue-100 p-4 rounded-lg shadow-sm h-full flex gap-3 hover:border-blue-300 transition-colors z-20 relative">
                        <div className="bg-[#0b4b8a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                          {step.id}
                        </div>
                        <span className="text-slate-700 text-sm leading-relaxed">
                          {step.title}
                        </span>
                      </div>
                      {index < 2 && (
                        <div className="hidden md:block absolute top-1/2 -right-10 w-12 h-0.5 bg-blue-200 transform -translate-y-1/2 z-0 after:content-[''] after:absolute after:-right-1 after:-top-1 after:border-t-4 after:border-t-transparent after:border-b-4 after:border-b-transparent after:border-l-4 after:border-l-blue-200" />
                      )}
                      <div className="md:hidden absolute -bottom-8 left-1/2 w-0.5 h-8 bg-blue-200 transform -translate-x-1/2 z-0 after:content-[''] after:absolute after:-left-1 after:bottom-0 after:border-l-4 after:border-l-transparent after:border-r-4 after:border-r-transparent after:border-t-4 after:border-t-blue-200" />
                      {index === 2 && (
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

                {/* Deuxième ligne */}
                <div className="relative grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-8 pt-4 md:pt-0">
                  {stepsEquivalence.slice(3, 6).map((step, index) => (
                    <div key={step.id} className="relative group h-full">
                      <div className="bg-white border border-blue-100 p-4 rounded-lg shadow-sm h-full flex gap-3 hover:border-blue-300 transition-colors z-20 relative">
                        <div className="bg-[#0b4b8a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                          {step.id}
                        </div>
                        <span className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                          {step.title}
                        </span>
                      </div>
                      {index < 2 && (
                        <div className="hidden md:block absolute top-1/2 -right-10 w-12 h-0.5 bg-blue-200 transform -translate-y-1/2 z-0 after:content-[''] after:absolute after:-right-1 after:-top-1 after:border-t-4 after:border-t-transparent after:border-b-4 after:border-b-transparent after:border-l-4 after:border-l-blue-200" />
                      )}
                      <div className="md:hidden absolute -bottom-8 left-1/2 w-0.5 h-8 bg-blue-200 transform -translate-x-1/2 z-0 after:content-[''] after:absolute after:-left-1 after:bottom-0 after:border-l-4 after:border-l-transparent after:border-r-4 after:border-r-transparent after:border-t-4 after:border-t-blue-200" />
                      {index === 2 && (
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

                {/* Troisième ligne */}
                <div className="relative grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-8 pt-4 md:pt-0">
                  {stepsEquivalence.slice(6, 9).map((step, index) => (
                    <div key={step.id} className="relative group h-full">
                      <div className="bg-white border border-blue-100 p-4 rounded-lg shadow-sm h-full flex gap-3 hover:border-blue-300 transition-colors z-20 relative">
                        <div className="bg-[#0b4b8a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                          {step.id}
                        </div>
                        <span className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                          {step.title}
                        </span>
                      </div>
                      {index < 2 && (
                        <div className="hidden md:block absolute top-1/2 -right-10 w-12 h-0.5 bg-blue-200 transform -translate-y-1/2 z-0 after:content-[''] after:absolute after:-right-1 after:-top-1 after:border-t-4 after:border-t-transparent after:border-b-4 after:border-b-transparent after:border-l-4 after:border-l-blue-200" />
                      )}
                      {index < 2 && (
                        <div className="md:hidden absolute -bottom-8 left-1/2 w-0.5 h-8 bg-blue-200 transform -translate-x-1/2 z-0 after:content-[''] after:absolute after:-left-1 after:bottom-0 after:border-l-4 after:border-l-transparent after:border-r-4 after:border-r-transparent after:border-t-4 after:border-t-blue-200" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Acceptation des conditions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
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
                    className="text-sm font-medium text-gray-800 cursor-pointer"
                  >
                    Je certifie avoir pris connaissance de la liste des
                    documents requis et m'engage à fournir l'ensemble des pièces
                    demandées. <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
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
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FaPlus />
                <span>Commencer la demande</span>
              </button>
              <p className="text-gray-500 text-xs mt-2">
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

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
            {demandeToEdit ? "Modifier la demande" : "Créer votre demande"}
          </h1>
          <p className="text-gray-600 text-sm">
            {demandeToEdit
              ? "Modifiez votre demande d'équivalence"
              : "Remplissez le formulaire pour créer votre demande"}
          </p>
        </div>

        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 mb-4">
            <div className="flex items-center justify-between overflow-x-auto no-scrollbar">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center flex-shrink-0">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
                      index === currentStep
                        ? "bg-blue-600 border-blue-600 text-white"
                        : index < currentStep
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {index < currentStep ? <FaCheck size={10} /> : index + 1}
                    </span>
                  </div>
                  <div
                    className={`ml-2 ${
                      index === currentStep
                        ? "text-blue-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    <div className="text-xs whitespace-nowrap">
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-6 h-0.5 mx-2 ${
                        index < currentStep ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">{renderStepContent()}</div>

          {currentStep !== 0 && (
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <FaArrowLeft size={12} />
                <span>Précédent</span>
              </button>

              {currentStep === steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <FaCheck size={12} />
                  <span>
                    {demandeToEdit ? "Mettre à jour" : "Soumettre la demande"}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <span>Suivant</span>
                  <FaArrowRight size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showSuccessModal && submissionResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-sm max-w-md w-full p-5">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                submissionResult.success ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <span
                className={`text-xl ${
                  submissionResult.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {submissionResult.success ? <FaCheck /> : <FaTimes />}
              </span>
            </div>
            <h2
              className={`text-lg font-semibold text-center mb-2 ${
                submissionResult.success ? "text-green-800" : "text-red-800"
              }`}
            >
              {submissionResult.message}
            </h2>
            <p className="text-gray-600 text-center mb-4 text-sm">
              {submissionResult.details}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  if (submissionResult.success && !demandeToEdit) {
                    navigate("/dashboard/requerant");
                  }
                }}
                className={`px-5 py-2 rounded-lg text-white font-medium text-sm ${
                  submissionResult.success
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition-colors`}
              >
                {submissionResult.success
                  ? "Retour au tableau de bord"
                  : "Fermer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
