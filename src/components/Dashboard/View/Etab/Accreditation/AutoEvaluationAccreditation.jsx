import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

/* =======================
   SECTIONS D'ÉVALUATION
   ======================= */
const sectionsEvaluation = [
  {
    title: "1. LA POLITIQUE DE FORMATION",
    subsections: [
      {
        title: "1.1. LE PILOTAGE DE L'OFFRE DE FORMATION",
        description:
          "L'institution tient compte des besoins du développement local, régional et national dans la définition des objectifs et des contenus de ses offres de formation.",
        criteres: [
          {
            id: "critere_01",
            numero: 1,
            label:
              "Rôle du partenariat avec les milieux économiques et les autorités dans l'élaboration de l'offre",
            description: "",
          },
          {
            id: "critere_02",
            numero: 2,
            label:
              "Place des connaissances et des compétences préprofessionnelles dans les programmes de formation",
            description: "",
          },
          {
            id: "critere_03",
            numero: 3,
            label:
              "Part des charges d'enseignement confiées aux professionnels",
            description: "",
          },
          {
            id: "texte_entre_3_4",
            numero: null,
            label:
              "L'institution élabore ses offres de formation en fonction d'axes stratégiques et d'axes de recherche justifiés.",
            description: "",
            isTextOnly: true,
          },
          {
            id: "critere_04",
            numero: 4,
            label: "Cadrage des offres de formation par les axes stratégiques",
            description: "",
          },
          {
            id: "critere_05",
            numero: 5,
            label:
              "Adéquation des axes de recherche et des offres de formation",
            description: "",
          },
        ],
      },
      {
        title: "1.2. LA MISE EN ŒUVRE DE LA FORMATION",
        description:
          "L'institution met en œuvre un dispositif d'accueil des étudiants.",
        criteres: [
          {
            id: "critere_06",
            numero: 6,
            label: "Publication des conditions et procédures d'admission",
            description: "",
          },
          {
            id: "critere_07",
            numero: 7,
            label:
              "Publication de guides présentant les objectifs, les parcours et les programmes de formation",
            description: "",
          },
          {
            id: "critere_08",
            numero: 8,
            label: "Service d'information et d'orientation",
            description: "",
          },
          {
            id: "critere_09",
            numero: 9,
            label:
              "Dispositifs d'accueil des étudiants à tous les niveaux (LMD)",
            description: "",
          },
          {
            id: "texte_entre_9_10",
            label:
              "L'institution met en œuvre un dispositif de pilotage de la formation conforme aux normes",
            isTextOnly: true,
          },
          {
            id: "critere_10",
            numero: 10,
            label:
              "Qualification des responsables de l'institution et de la formation",
            description: "",
          },
          {
            id: "critere_11",
            numero: 11,
            label:
              "Composition, qualification et organisation des équipes de formation",
            description: "",
          },
          {
            id: "critere_12",
            numero: 12,
            label:
              "Composition, qualification et organisation des équipes pédagogiques",
            description: "",
          },
          {
            id: "critere_13",
            numero: 13,
            label: "Organisation de la formation",
            description: "",
          },
          {
            id: "critere_14",
            numero: 14,
            label: "Organisation des stages",
            description: "",
          },
          {
            id: "critere_15",
            numero: 15,
            label: "Organisation des voyages d'études",
            description: "",
          },
          {
            id: "texte_entre_15_16",
            label: "L'institution favorise la réussite des étudiants",
            isTextOnly: true,
          },
          {
            id: "critere_16",
            numero: 16,
            label:
              "Mise en place d'un dispositif d'accompagnement de l'étudiant en Licence, Master et Doctorat",
            description: "",
          },
          {
            id: "critere_17",
            numero: 17,
            label:
              "Diagnostic et résolution des difficultés rencontrées par l'étudiant",
            description: "",
          },
          {
            id: "critere_18",
            numero: 18,
            label: "Taux de réussite",
            description: "",
          },
          {
            id: "critere_19",
            numero: 19,
            label: "Durée moyenne des études",
            description: "",
          },
          {
            id: "critere_20",
            numero: 20,
            label: "Taux des diplômés",
            description: "",
          },
          {
            id: "critere_21",
            numero: 21,
            label: "Insertion professionnelle",
            description: "",
          },
          {
            id: "texte_entre_21_22",
            label:
              "L'institution a mis en place une politique documentaire utile à l'étudiant, à l'enseignant et au chercheur",
            isTextOnly: true,
          },
          {
            id: "critere_22",
            numero: 22,
            label: "Ressources documentaires adaptées",
            description: "",
          },
          {
            id: "critere_23",
            numero: 23,
            label: "Accès aux ressources documentaires",
            description: "",
          },
          {
            id: "texte_entre_23_24",
            label:
              "L'institution met en œuvre des procédures d'évaluation des étudiants",
            isTextOnly: true,
          },
          {
            id: "critere_24",
            numero: 24,
            label:
              "Charte du contrôle des connaissances et des compétences des étudiants",
            description: "",
          },
          {
            id: "critere_25",
            numero: 25,
            label:
              "Qualité de l'évaluation des étudiants et des diplômes délivrés",
            description: "",
          },
          {
            id: "critere_26",
            numero: 26,
            label: "Règles de compensation et de passage en année supérieure",
            description: "",
          },
          {
            id: "critere_27",
            numero: 27,
            label: "Jurys d'examen",
            description: "",
          },
        ],
      },
      {
        title: "1.3. LA DEMARCHE QUALITE PEDAGOGIQUE",
        description:
          "L'institution met en œuvre un dispositif lui permettant de gérer l'assurance qualité de la formation.",
        criteres: [
          {
            id: "critere_28",
            numero: 28,
            label: "Structure d'assurance qualité pédagogique",
            description: "",
          },
          {
            id: "critere_29",
            numero: 29,
            label:
              "Connaissance et prise en compte des caractéristiques des étudiants",
            description: "",
          },
          {
            id: "critere_30",
            numero: 30,
            label: "Adéquation du corps enseignant",
            description: "",
          },
          {
            id: "critere_31",
            numero: 31,
            label: "Adéquation des modalités de transmission des savoirs",
            description: "",
          },
          {
            id: "critere_32",
            numero: 32,
            label: "Évaluation des enseignements et des formations",
            description: "",
          },
          {
            id: "critere_33",
            numero: 33,
            label:
              "Degré de satisfaction des étudiants par rapport à l'offre de formation",
            description: "",
          },
          {
            id: "critere_34",
            numero: 34,
            label:
              "Communication sur les règlements divers, charte des examens, charte des stages, charte des thèses",
            description: "",
          },
          {
            id: "critere_35",
            numero: 35,
            label:
              "Enquête d'insertion professionnelle et adaptation de la formation",
            description: "",
          },
          {
            id: "texte_entre_35_36",
            label:
              "L'offre de formation est organisée de façon à rendre compatibles, pour les enseignants, leurs charges d'enseignement avec leurs autres missions (recherche, dialogue pédagogique entre enseignants et avec les étudiants, charges administratives …)",
            isTextOnly: true,
          },
          {
            id: "critere_36",
            numero: 36,
            label: "Contrats d'engagement et cahiers des charges",
            description: "",
          },
          {
            id: "critere_37",
            numero: 37,
            label:
              "Équilibre entre les activités pédagogiques, scientifiques et administratives",
            description: "",
          },
        ],
      },
    ],
  },
  {
    title: "2. LA POLITIQUE DE GOUVERNANCE",
    subsections: [
      {
        title: "2.1. ORGANISATION ET MANAGEMENT",
        description:
          "L'institution met en œuvre un dispositif administratif dont les structures organisationnelles et leurs fonctions respectives sont bien définies.",
        criteres: [
          {
            id: "critere_38",
            numero: 38,
            label: "Structures organisationnelles bien définies",
            description:
              "Dispositif administratif et fonctions des structures.",
          },
          {
            id: "critere_39",
            numero: 39,
            label: "Organisation et fonctions des structures",
            description: "",
          },
          {
            id: "texte_entre_39_40",
            label:
              "L'institution dispose d'un projet de développement en matière de formation, de gouvernance et de recherche.",
            isTextOnly: true,
          },
          {
            id: "critere_40",
            numero: 40,
            label: "Les axes stratégiques justifiés",
            description: "Projet de développement institutionnel",
          },
          {
            id: "critere_41",
            numero: 41,
            label: "Le suivi d'exécution",
            description: "",
          },
          {
            id: "texte_entre_41_42",
            label:
              "L'institution dispose d'une structure administrative capable de mettre en œuvre sa politique de développement",
            isTextOnly: true,
          },
          {
            id: "critere_42",
            numero: 42,
            label: "Organisation et fonctionnement de l'institution",
            description: "",
          },
          {
            id: "critere_43",
            numero: 43,
            label:
              "Capacité de pilotage et de mise en œuvre des objectifs stratégiques de l'institution",
            description: "",
          },
        ],
      },
      {
        title: "2.2. SYSTÈME D'INFORMATION ET DE COMMUNICATION",
        description:
          "L'institution développe une stratégie pour optimiser les performances de ses systèmes d'information et l'appropriation des TIC par le personnel administratif et technique.",
        criteres: [
          {
            id: "critere_44",
            numero: 44,
            label:
              "L'existence d'une politique d'information et de communication",
            description: "",
          },
          {
            id: "critere_45",
            numero: 45,
            label:
              "L'existence d'une structure de gestion de la politique d'information et de communication",
            description: "",
          },
          {
            id: "texte_entre_45_46",
            label:
              "L'institution gère efficacement les systèmes d'information et de communication mis en place",
            isTextOnly: true,
          },
          {
            id: "critere_46",
            numero: 46,
            label:
              "Champ d'utilisation de l'environnement numérique de travail",
            description: "",
          },
          {
            id: "critere_47",
            numero: 47,
            label:
              "Démarche qualité dans l'utilisation des applications informatiques entre les différents services et composantes",
            description: "",
          },
          {
            id: "critere_48",
            numero: 48,
            label: "Maintenance des systèmes d'information et de communication",
            description: "",
          },
        ],
      },
      {
        title: "2.3. GESTION DES RESSOURCES DOCUMENTAIRES",
        description:
          "L'institution dispose de structures permettant aux étudiants d'avoir accès aux documents dont ils ont besoin dans leur formation.",
        criteres: [
          {
            id: "critere_49",
            numero: 49,
            label:
              "Locaux et équipements destinés aux services de documentation",
            description: "",
          },
          {
            id: "critere_50",
            numero: 50,
            label: "Quantité suffisante des fonds documentaires",
            description: "",
          },
          {
            id: "critere_51",
            numero: 51,
            label: "Personnel administratif destiné à la documentation",
            description: "",
          },
        ],
      },
      {
        title: "2.4. GESTION DES RESSOURCES HUMAINES",
        description:
          "L'institution a une politique en matière d'emploi en phase avec des objectifs stratégiques.",
        criteres: [
          {
            id: "critere_52",
            numero: 52,
            label:
              "Les axes stratégiques de la gestion prévisionnelle des emplois et des compétences",
            description: "",
          },
          {
            id: "critere_53",
            numero: 53,
            label: "La politique en matière d'emplois contractuels",
            description: "",
          },
          {
            id: "texte_entre_53_54",
            label:
              "L'institution a une politique de gestion des ressources humaines qui intègre ses perspectives démographiques, sa politique de formation, de gouvernance et de recherche.",
            isTextOnly: true,
          },
          {
            id: "critere_54",
            numero: 54,
            label: "Procédure de recrutement réglementée",
            description: "",
          },
          {
            id: "critere_55",
            numero: 55,
            label: "Modalité de répartition des ressources humaines",
            description: "",
          },
          {
            id: "critere_56",
            numero: 56,
            label:
              "Modalité de répartition des charges d'enseignement, des obligations de recherche et des tâches administratives",
            description: "",
          },
          {
            id: "critere_57",
            numero: 57,
            label:
              "Taux d'encadrement en enseignants, encadreurs et mesures prises",
            description: "",
          },
          {
            id: "critere_58",
            numero: 58,
            label:
              "Actions de promotion du personnel enseignant, administratif et technique",
            description: "",
          },
          {
            id: "critere_59",
            numero: 59,
            label: "Politique menée en termes de vie associative et sociale",
            description: "",
          },
        ],
      },
      {
        title: "2.5. GESTION DES RESSOURCES FINANCIÈRES",
        description: "L'institution a une politique budgétaire et financière.",
        criteres: [
          {
            id: "critere_60",
            numero: 60,
            label: "Cadrage général institutionnalisé",
            description: "",
          },
          {
            id: "critere_61",
            numero: 61,
            label: "Pertinence des choix stratégiques",
            description: "",
          },
          {
            id: "critere_62",
            numero: 62,
            label: "Les structures de gestion",
            description: "",
          },
          {
            id: "critere_63",
            numero: 63,
            label: "Qualité de la construction budgétaire",
            description: "",
          },
          {
            id: "critere_64",
            numero: 64,
            label: "Politique d'investissement",
            description: "",
          },
          {
            id: "critere_65",
            numero: 65,
            label: "Évaluation de la qualité de l'exécution budgétaire",
            description: "",
          },
          {
            id: "critere_66",
            numero: 66,
            label: "Contrôle de gestion",
            description: "",
          },
        ],
      },
      {
        title: "2.6. POLITIQUE IMMOBILIÈRE ET LOGISTIQUE",
        description:
          "Les infrastructures et les équipements de l'institution sont adaptés à ses besoins et à ses objectifs.",
        criteres: [
          {
            id: "critere_67",
            numero: 67,
            label: "Adéquation des locaux de l'institution",
            description: "",
          },
          {
            id: "critere_68",
            numero: 68,
            label: "Adéquation des équipements aux activités de l'institution",
            description: "",
          },
          {
            id: "texte_entre_68_69",
            label:
              "L'institution a une politique de gestion de son patrimoine immobilier et logistique",
            isTextOnly: true,
          },
          {
            id: "critere_69",
            numero: 69,
            label: "Service de logistique",
            description: "",
          },
          {
            id: "critere_70",
            numero: 70,
            label: "Politique de maintenance",
            description: "",
          },
        ],
      },
      {
        title: "2.7. MANAGEMENT DE LA QUALITÉ",
        description:
          "L'institution a mis en place une structure de management de la qualité.",
        criteres: [
          {
            id: "critere_71",
            numero: 71,
            label: "Service de la qualité",
            description: "",
          },
          {
            id: "critere_72",
            numero: 72,
            label: "Champ de la démarche qualité",
            description: "",
          },
          {
            id: "critere_73",
            numero: 73,
            label: "Outils de l'évaluation",
            description: "",
          },
        ],
      },
      {
        title: "2.8. HYGIÈNE, SÉCURITÉ ET ENVIRONNEMENT",
        description:
          "L'institution a une politique dédiée à l'hygiène et à la sécurité.",
        criteres: [
          {
            id: "critere_74",
            numero: 74,
            label: "Service d'hygiène et de sécurité",
            description: "",
          },
          {
            id: "critere_75",
            numero: 75,
            label: "Règlements d'hygiène et de sécurité",
            description: "",
          },
          {
            id: "critere_76",
            numero: 76,
            label: "Sensibilisation écologique",
            description: "",
          },
          {
            id: "critere_77",
            numero: 77,
            label: "Méthode et moyen de diffusion des recommandations",
            description: "",
          },
        ],
      },
      {
        title: "2.9. GESTION DE LA VIE ÉTUDIANTE",
        description:
          "La politique de l'établissement contribue à garantir la qualité de vie des étudiants.",
        criteres: [
          {
            id: "critere_78",
            numero: 78,
            label: "Structure de gestion de la vie étudiante",
            description: "",
          },
          {
            id: "critere_79",
            numero: 79,
            label: "Services aux étudiants",
            description: "",
          },
          {
            id: "critere_80",
            numero: 80,
            label: "Aménagement de lieux de vie",
            description: "",
          },
          {
            id: "critere_81",
            numero: 81,
            label: "Vie culturelle",
            description: "",
          },
          {
            id: "critere_82",
            numero: 82,
            label: "Vie sportive",
            description: "",
          },
          {
            id: "critere_83",
            numero: 83,
            label: "Vie associative",
            description: "",
          },
          {
            id: "critere_84",
            numero: 84,
            label: "Médecine préventive",
            description: "",
          },
          {
            id: "critere_85",
            numero: 85,
            label:
              "Prise en charge des étudiants en cas d'accident ou de maladie au cours de la formation",
            description: "",
          },
        ],
      },
      {
        title: "2.10. LA GESTION DES PARTENARIATS",
        description:
          "L'institution a une politique de coopération avec les autres institutions d'enseignement supérieur.",
        criteres: [
          {
            id: "critere_86",
            numero: 86,
            label: "Structure de gestion des partenariats",
            description: "",
          },
          {
            id: "critere_87",
            numero: 87,
            label: "Conventions de partenariat",
            description: "",
          },
          {
            id: "critere_88",
            numero: 88,
            label:
              "Mutualisation des activités de formation, de recherche et de vie étudiante",
            description: "",
          },
        ],
      },
    ],
  },
  {
    title: "3. LA POLITIQUE DE RECHERCHE",
    subsections: [
      {
        title: "3.1. LA STRATÉGIE DE RECHERCHE DE L'INSTITUTION",
        description:
          "L'institution est en mesure d'élaborer une stratégie de recherche, de l'expliquer, de la justifier et de la faire évoluer.",
        criteres: [
          {
            id: "critere_89",
            numero: 89,
            label: "Les structures et les dispositifs en matière de recherche",
            description: "",
          },
          {
            id: "critere_90",
            numero: 90,
            label: "Les documents stratégiques en matière de recherche",
            description: "",
          },
        ],
      },
      {
        title: "3.2. L'ENSEIGNEMENT ET LA RECHERCHE",
        description: `La majorité des enseignants devront s'impliquer dans la recherche et pouvoir justifier de publications récentes dans des périodiques reconnus, comme preuves de leur qualité et de leur mérite. L'établissement veille à l'intégration effective des connaissances scientifiques récentes dans la formation.`,
        criteres: [
          {
            id: "critere_91",
            numero: 91,
            label: "Communications et publications des enseignants",
            description: "",
          },
          {
            id: "critere_92",
            numero: 92,
            label:
              "Intégration des résultats de la recherche en cours dans les enseignements",
            description: "",
          },
        ],
      },
    ],
  },
];

const appreciationOptions = [
  {
    value:
      "Aucune preuve ou élément ne montre que le critère est pris en compte.",
    label: "Aucune preuve",
  },
  {
    value:
      "Le critère est partiellement pris en compte, sans application formelle ou avec des preuves limitées.",
    label: "Partiellement pris en compte",
  },
  {
    value:
      "Le critère est appliqué mais de manière irrégulière ou non systématique. Des améliorations sont nécessaires.",
    label: "Appliqué irrégulièrement",
  },
  {
    value:
      "Le critère est bien respecté, preuves disponibles et procédures maîtrisées, quelques ajustements possibles.",
    label: "Bien respecté",
  },
  {
    value:
      "Le critère est pleinement atteint, systématisé et évalué périodiquement. Les résultats sont mesurables et améliorés continuellement.",
    label: "Pleinemenent atteint",
  },
];

const noteOptions = [
  { value: "0", label: "0 - Absent / Non conforme" },
  { value: "1", label: "1 - Faible / En cours d'élaboration" },
  { value: "2", label: "2 - Acceptable / En développement" },
  { value: "3", label: "3 - Satisfaisant / Conformité maîtrisée" },
  { value: "4", label: "4 - Excellent / Bonne pratique institutionnalisée" },
];

export default function CreerDemande() {
  const location = useLocation();
  const demandeToEdit = location.state?.demande || null;

  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showRecap, setShowRecap] = useState(false);
  const [formData, setFormData] = useState({
    nom_demandeur: "",
    numero_demande: "",
    type: "Privée",
    institution: "",
    etablissement: "",
    domaine: "",
    mention: "",
    grade: "",
    parcours: "",
    criteres: {},
  });

  const totalNotes = Object.values(formData.criteres || {}).reduce(
    (acc, critere) => {
      const note = parseInt(critere.note, 10);
      return acc + (isNaN(note) ? 0 : note);
    },
    0
  );

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = storedUser?.id;

  useEffect(() => {
    const initialCriteres = {};
    sectionsEvaluation.forEach((section) => {
      section.subsections.forEach((sub) => {
        sub.criteres.forEach((c) => {
          initialCriteres[c.id] = {
            preuves: [],
            appreciation: "",
            note: "",
            fichiers: [],
          };
        });
      });
    });

    if (demandeToEdit) {
      Object.entries(demandeToEdit.criteres || {}).forEach(([id, val]) => {
        if (initialCriteres[id]) {
          initialCriteres[id] = {
            preuves: val?.preuves || [],
            appreciation: val?.appreciation || "",
            note: val?.note || "",
            fichiers: val?.fichiers || [],
          };
        }
      });

      setFormData({
        nom_demandeur: demandeToEdit.nom_demandeur || "",
        numero_demande: demandeToEdit.numero_demande || "",
        type: demandeToEdit.type || "Privée",
        institution: demandeToEdit.institution || "",
        etablissement: demandeToEdit.etablissement || "",
        domaine: demandeToEdit.domaine || "",
        mention: demandeToEdit.mention || "",
        grade: demandeToEdit.grade || "",
        parcours: demandeToEdit.parcours || "",
        criteres: initialCriteres,
      });
      setShowModal(true);
    } else {
      setFormData((prev) => ({ ...prev, criteres: initialCriteres }));
    }
  }, [demandeToEdit]);

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleCritereChange = (critereId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      criteres: {
        ...prev.criteres,
        [critereId]: { ...prev.criteres[critereId], [field]: value },
      },
    }));
  };

  const handleFileUpload = (critereId, files) => {
    const newFiles = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      file: file,
    }));

    setFormData((prev) => ({
      ...prev,
      criteres: {
        ...prev.criteres,
        [critereId]: {
          ...prev.criteres[critereId],
          fichiers: [
            ...(prev.criteres[critereId]?.fichiers || []),
            ...newFiles,
          ],
        },
      },
    }));
  };

  const handleRemoveFile = (critereId, fileId) => {
    setFormData((prev) => ({
      ...prev,
      criteres: {
        ...prev.criteres,
        [critereId]: {
          ...prev.criteres[critereId],
          fichiers:
            prev.criteres[critereId]?.fichiers?.filter(
              (f) => f.id !== fileId
            ) || [],
        },
      },
    }));
  };

  const nextStep = () =>
    currentStep < sectionsEvaluation.length - 1 &&
    setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const resetForm = () => {
    const clearedCriteres = {};
    Object.keys(formData.criteres).forEach(
      (key) =>
        (clearedCriteres[key] = {
          preuves: [],
          appreciation: "",
          note: "",
          fichiers: [],
        })
    );

    setFormData({
      nom_demandeur: "",
      numero_demande: "",
      type: "Privée",
      institution: "",
      etablissement: "",
      domaine: "",
      mention: "",
      grade: "",
      parcours: "",
      criteres: clearedCriteres,
    });
    setCurrentStep(0);
    setShowModal(false);
    setShowRecap(false);
  };

  const handleModalContinue = async () => {
    const requiredFields = [
      "nom_demandeur",
      "numero_demande",
      "type",
      "institution",
      ...(formData.type === "Publique" ? ["etablissement"] : []),
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`⚠️ Le champ "${field}" est obligatoire !`);
        return;
      }
    }

    try {
      const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const url = `${API_BASE}/demandes-accreditation?userId=${currentUserId}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      let existingDemandes = [];
      try {
        existingDemandes = await res.json();
      } catch {}

      if (
        !demandeToEdit &&
        Array.isArray(existingDemandes) &&
        existingDemandes.length >= 1
      ) {
        alert("⚠️ Vous ne pouvez pas créer plus d'une demande !");
        return;
      }

      setShowModal(false);
    } catch (err) {
      console.error("❌ Erreur lors de la vérification:", err);
    }
  };

  const handleSubmit = async () => {
    if (!currentUserId) {
      alert("⚠️ Vous devez être connecté pour créer une demande !");
      return;
    }

    const criteresObj = formData.criteres || {};
    const missingCriteres = Object.entries(criteresObj)
      .filter(([id, val]) => !id.startsWith("texte_"))
      .filter(
        ([_, val]) =>
          !val.appreciation ||
          val.note === "" ||
          val.note === undefined ||
          val.fichiers.length === 0
      )
      .map(([id]) => id);

    if (missingCriteres.length > 0) {
      alert(
        `⚠️ Tous les critères doivent avoir au moins un fichier de preuve, une appréciation ET une note.\nCritères incomplets: ${missingCriteres
          .slice(0, 5)
          .join(", ")}...`
      );
      return;
    }

    setShowRecap(true);
  };

  const confirmSubmit = async () => {
    try {
      const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const method = demandeToEdit ? "PUT" : "POST";
      const url = demandeToEdit
        ? `${API_BASE}/demandes-accreditation/${demandeToEdit.id}`
        : `${API_BASE}/demandes-accreditation/`;

      const bodyToSend = {
        nom_demandeur: formData.nom_demandeur.trim(),
        numero_demande: formData.numero_demande.trim(),
        type_institution: formData.type || "",
        institution: formData.institution.trim(),
        etablissement: formData.etablissement.trim(),
        domaine: formData.domaine.trim(),
        mention: formData.mention.trim(),
        grade: formData.grade,
        parcours: formData.parcours.trim(),
        criteres: { ...formData.criteres },
        user_id: currentUserId,
        statut: "En attente",
        total_notes: totalNotes,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": String(currentUserId),
        },
        body: JSON.stringify(bodyToSend),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      alert("✅ Demande envoyée avec succès !");
      resetForm();
      setShowRecap(false);
    } catch (err) {
      console.error("❌ Erreur soumission :", err);
      alert(`❌ Erreur : ${err.message || "Erreur inconnue"}`);
    }
  };

  const FileUpload = ({ critereId, fichiers = [] }) => (
    <div className="space-y-3">
      <input
        type="file"
        id={`file-upload-${critereId}`}
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.mp4,.avi,.mov,.doc,.docx"
        onChange={(e) => handleFileUpload(critereId, e.target.files)}
        className="hidden"
      />
      <label
        htmlFor={`file-upload-${critereId}`}
        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-500 hover:bg-blue-50"
      >
        <div className="text-2xl mb-2">📎</div>
        <div className="font-semibold text-gray-700 text-center">
          {fichiers.length > 0
            ? `${fichiers.length} fichier(s) sélectionné(s)`
            : "Ajouter des preuves"}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          PDF, Images, Vidéos, Documents
        </div>
      </label>

      {fichiers.length > 0 && (
        <div className="space-y-2">
          {fichiers.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="text-blue-600">
                  {file.type.includes("pdf")
                    ? "📄"
                    : file.type.includes("image")
                    ? "🖼️"
                    : file.type.includes("video")
                    ? "🎥"
                    : "📎"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(critereId, file.id)}
                className="ml-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const RecapModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            📋 Récapitulatif de la Demande
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informations Générales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <strong className="text-gray-700">Nom du demandeur:</strong>{" "}
                {formData.nom_demandeur}
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <strong className="text-gray-700">Numéro de demande:</strong>{" "}
                {formData.numero_demande}
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <strong className="text-gray-700">Type:</strong> {formData.type}
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <strong className="text-gray-700">Institution:</strong>{" "}
                {formData.institution}
              </div>
              {formData.etablissement && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <strong className="text-gray-700">Établissement:</strong>{" "}
                  {formData.etablissement}
                </div>
              )}
              <div className="p-3 bg-gray-50 rounded-lg">
                <strong className="text-gray-700">Domaine:</strong>{" "}
                {formData.domaine}
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <strong className="text-gray-700">Mention:</strong>{" "}
                {formData.mention}
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <strong className="text-gray-700">Grade:</strong>{" "}
                {formData.grade}
              </div>
              <div className="p-3 bg-gray-50 rounded-lg md:col-span-2">
                <strong className="text-gray-700">Parcours:</strong>{" "}
                {formData.parcours}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Résumé des Évaluations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    Total des notes:
                  </span>
                  <span className="text-xl font-bold text-blue-700">
                    {totalNotes}/368
                  </span>
                </div>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    Critères évalués:
                  </span>
                  <span className="text-xl font-bold text-green-700">
                    {
                      Object.values(formData.criteres).filter(
                        (c) => c.note && c.appreciation && c.fichiers.length > 0
                      ).length
                    }
                    /
                    {
                      Object.values(formData.criteres).filter(
                        (c) => !c.id?.startsWith?.("texte_")
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Détails par Section
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Section
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Critères complétés
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fichiers joints
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Note section
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sectionsEvaluation.map((section, index) => {
                      const sectionCriteres = section.subsections.flatMap(
                        (sub) => sub.criteres.filter((c) => !c.isTextOnly)
                      );
                      const completedCriteres = sectionCriteres.filter(
                        (c) =>
                          formData.criteres[c.id]?.note &&
                          formData.criteres[c.id]?.appreciation &&
                          formData.criteres[c.id]?.fichiers.length > 0
                      );
                      const sectionNote = sectionCriteres.reduce((acc, c) => {
                        const note = parseInt(
                          formData.criteres[c.id]?.note || 0
                        );
                        return acc + (isNaN(note) ? 0 : note);
                      }, 0);
                      const totalFiles = sectionCriteres.reduce(
                        (acc, c) =>
                          acc +
                          (formData.criteres[c.id]?.fichiers?.length || 0),
                        0
                      );

                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {section.title}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {completedCriteres.length}/{sectionCriteres.length}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {totalFiles} fichier(s)
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                            {sectionNote}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={() => setShowRecap(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Modifier la demande
            </button>
            <button
              onClick={confirmSubmit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Confirmer l'envoi
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stepper */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute top-5 left-10 right-10 h-0.5 bg-gray-200 -z-10"></div>
          {sectionsEvaluation.map((section, index) => (
            <div
              key={index}
              className={`flex flex-col items-center relative z-10 flex-1 max-w-xs ${
                currentStep === index
                  ? "text-blue-600"
                  : currentStep > index
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-semibold text-sm mb-2 shadow-sm transition-all duration-300 ${
                  currentStep === index
                    ? "bg-blue-600 text-white scale-110 shadow-blue-200"
                    : currentStep > index
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > index ? "✓" : index + 1}
              </div>
              <div
                className={`text-xs font-medium text-center transition-colors ${
                  currentStep === index
                    ? "text-blue-600 font-semibold"
                    : currentStep > index
                    ? "text-green-600 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {section.title.split(". ")[1]}
              </div>
            </div>
          ))}
        </div>

        {/* Barre de progression */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-8 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-500 relative overflow-hidden"
            style={{
              width: `${
                ((currentStep + 1) / sectionsEvaluation.length) * 100
              }%`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent mb-2">
            Auto-évaluation pour l'Accréditation
          </h1>
          <p className="text-gray-600 text-center text-lg max-w-2xl mx-auto mb-8">
            Évaluez votre institution selon les critères nationaux
            d'accréditation
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
            <strong className="text-blue-900">
              Étape {currentStep + 1}/{sectionsEvaluation.length}:
            </strong>
            <span className="text-blue-800 ml-2">
              {sectionsEvaluation[currentStep]?.title}
            </span>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl mb-8 flex items-center gap-2"
          >
            📝 Modifier les informations générales
          </button>

          {/* Évaluation */}
          <div className="space-y-6">
            {sectionsEvaluation[currentStep]?.subsections.map(
              (sub, subIndex) => (
                <div
                  key={subIndex}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-6"
                >
                  <div className="flex items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {sub.title}
                    </h3>
                  </div>

                  {sub.description && (
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {sub.description}
                    </p>
                  )}

                  <div className="space-y-4">
                    {sub.criteres.map((c) => {
                      if (c.isTextOnly) {
                        return (
                          <div
                            key={c.id}
                            className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg"
                          >
                            <p className="text-green-800 italic">{c.label}</p>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={c.id}
                          className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-all duration-200"
                        >
                          <div className="flex items-start gap-3 mb-4">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold min-w-10 text-center">
                              {c.numero}
                            </span>
                            <span className="font-semibold text-gray-900 flex-1">
                              {c.label}
                            </span>
                          </div>

                          {c.description && (
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                              {c.description}
                            </p>
                          )}

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="lg:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preuves disponibles{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <FileUpload
                                critereId={c.id}
                                fichiers={
                                  formData.criteres[c.id]?.fichiers || []
                                }
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Appréciation qualitative{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={
                                  formData.criteres[c.id]?.appreciation || ""
                                }
                                onChange={(e) =>
                                  handleCritereChange(
                                    c.id,
                                    "appreciation",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                              >
                                <option value="">
                                  Sélectionnez une appréciation
                                </option>
                                {appreciationOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Note <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.criteres[c.id]?.note || ""}
                                onChange={(e) =>
                                  handleCritereChange(
                                    c.id,
                                    "note",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                              >
                                <option value="">Sélectionnez une note</option>
                                {noteOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 p-6 bg-white border border-gray-200 rounded-xl">
            <div className="text-sm text-gray-600 font-medium bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
              Étape {currentStep + 1} sur {sectionsEvaluation.length}
            </div>
            <div className="flex gap-3">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Précédent
              </button>

              {currentStep === sectionsEvaluation.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  📋 Voir le récapitulatif
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                >
                  Suivant →
                </button>
              )}
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
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du demandeur <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nom_demandeur}
                      onChange={(e) =>
                        handleInputChange("nom_demandeur", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Saisir le nom du demandeur"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de la demande{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.numero_demande}
                      onChange={(e) =>
                        handleInputChange("numero_demande", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Ex: DEM-2025-001"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de demande <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        handleInputChange("type", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">-- Sélectionnez un type --</option>
                      <option value="Privée">Privée</option>
                      <option value="Publique">Publique</option>
                    </select>
                  </div>

                  {formData.type && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institution <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.institution}
                        onChange={(e) =>
                          handleInputChange("institution", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Saisir le nom de l'institution"
                        required
                      />
                    </div>
                  )}

                  {formData.type === "Publique" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Établissement <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.etablissement}
                        onChange={(e) =>
                          handleInputChange("etablissement", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Saisir le nom de l'établissement"
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
                      value={formData.domaine}
                      onChange={(e) =>
                        handleInputChange("domaine", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Saisir le domaine"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mention <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.mention}
                      onChange={(e) =>
                        handleInputChange("mention", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Saisir la mention"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.grade}
                      onChange={(e) =>
                        handleInputChange("grade", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Entrez le grade"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parcours <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.parcours}
                      onChange={(e) =>
                        handleInputChange("parcours", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Saisir le parcours"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleModalContinue}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continuer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal récapitulatif */}
        {showRecap && <RecapModal />}
      </div>
    </div>
  );
}
