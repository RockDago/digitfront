import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import mesupresLogo from "../../../../../assets/images/mesupres-logo.png"; // Ajustez le chemin selon votre structure

/* =======================
   SECTIONS D'ÉVALUATION
   ======================= */
const sectionsEvaluation = [
  {
    title: "LA POLITIQUE DE FORMATION",
    subsections: [
      {
        id: "section_1_1",
        title: "1.1. LE PILOTAGE DE L'OFFRE DE FORMATION",
        description:
          "L'institution tient compte des besoins du développement local, régional et national dans la définition des objectifs et des contenus de ses offres de formation.",
        isExpanded: true,
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
        id: "section_1_2",
        title: "1.2. LA MISE EN ŒUVRE DE LA FORMATION",
        description:
          "L'institution met en œuvre un dispositif d'accueil des étudiants.",
        isExpanded: true,
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
        id: "section_1_3",
        title: "1.3. LA DEMARCHE QUALITE PEDAGOGIQUE",
        description:
          "L'institution met en œuvre un dispositif lui permettant de gérer l'assurance qualité de la formation.",
        isExpanded: true,
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
    title: "LA POLITIQUE DE GOUVERNANCE",
    subsections: [
      {
        id: "section_2_1",
        title: "2.1. ORGANISATION ET MANAGEMENT",
        description:
          "L'institution met en œuvre un dispositif administratif dont les structures organisationnelles et leurs fonctions respectives sont bien définies.",
        isExpanded: true,
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
        id: "section_2_2",
        title: "2.2. SYSTÈME D'INFORMATION ET DE COMMUNICATION",
        description:
          "L'institution développe une stratégie pour optimiser les performances de ses systèmes d'information et l'appropriation des TIC par le personnel administratif et technique.",
        isExpanded: true,
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
        id: "section_2_3",
        title: "2.3. GESTION DES RESSOURCES DOCUMENTAIRES",
        description:
          "L'institution dispose de structures permettant aux étudiants d'avoir accès aux documents dont ils ont besoin dans leur formation.",
        isExpanded: true,
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
        id: "section_2_4",
        title: "2.4. GESTION DES RESSOURCES HUMAINES",
        description:
          "L'institution a une politique en matière d'emploi en phase avec des objectifs stratégiques.",
        isExpanded: true,
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
        id: "section_2_5",
        title: "2.5. GESTION DES RESSOURCES FINANCIÈRES",
        description: "L'institution a une politique budgétaire et financière.",
        isExpanded: true,
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
        id: "section_2_6",
        title: "2.6. POLITIQUE IMMOBILIÈRE ET LOGISTIQUE",
        description:
          "Les infrastructures et les équipements de l'institution sont adaptés à ses besoins et à ses objectifs.",
        isExpanded: true,
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
        id: "section_2_7",
        title: "2.7. MANAGEMENT DE LA QUALITÉ",
        description:
          "L'institution a mis en place une structure de management de la qualité.",
        isExpanded: true,
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
        id: "section_2_8",
        title: "2.8. HYGIÈNE, SÉCURITÉ ET ENVIRONNEMENT",
        description:
          "L'institution a une politique dédiée à l'hygiène et à la sécurité.",
        isExpanded: true,
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
        id: "section_2_9",
        title: "2.9. GESTION DE LA VIE ÉTUDIANTE",
        description:
          "La politique de l'établissement contribue à garantir la qualité de vie des étudiants.",
        isExpanded: true,
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
        id: "section_2_10",
        title: "2.10. LA GESTION DES PARTENARIATS",
        description:
          "L'institution a une politique de coopération avec les autres institutions d'enseignement supérieur.",
        isExpanded: true,
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
    title: "LA POLITIQUE DE RECHERCHE",
    subsections: [
      {
        id: "section_3_1",
        title: "3.1. LA STRATÉGIE DE RECHERCHE DE L'INSTITUTION",
        description:
          "L'institution est en mesure d'élaborer une stratégie de recherche, de l'expliquer, de la justifier et de la faire évoluer.",
        isExpanded: true,
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
        id: "section_3_2",
        title: "3.2. L'ENSEIGNEMENT ET LA RECHERCHE",
        description: `La majorité des enseignants devront s'impliquer dans la recherche et pouvoir justifier de publications récentes dans des périodiques reconnus, comme preuves de leur qualité et de leur mérite. L'établissement veille à l'intégration effective des connaissances scientifiques récentes dans la formation.`,
        isExpanded: true,
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

// Options d'appréciation avec labels simples
const appreciationOptions = [
  {
    value: "aucune_preuve",
    label: "Aucune preuve",
  },
  {
    value: "partiellement_pris_en_compte",
    label: "Partiellement pris en compte",
  },
  {
    value: "applique_irregulierement",
    label: "Appliqué irrégulièrement",
  },
  {
    value: "bien_respecte",
    label: "Bien respecté",
  },
  {
    value: "pleinement_atteint",
    label: "Pleinemenent atteint",
  },
];

// Options de note
const noteOptions = [
  { value: "0", label: "0 - Absent / Non conforme" },
  { value: "1", label: "1 - Faible / En cours d'élaboration" },
  { value: "2", label: "2 - Acceptable / En développement" },
  { value: "3", label: "3 - Satisfaisant / Conformité maîtrisée" },
  { value: "4", label: "4 - Excellent / Bonne pratique institutionnalisée" },
];

// MAPPING pour synchroniser appréciation -> note
const appreciationToNoteMap = {
  aucune_preuve: "0",
  partiellement_pris_en_compte: "1",
  applique_irregulierement: "2",
  bien_respecte: "3",
  pleinement_atteint: "4",
};

// MAPPING pour synchroniser note -> appréciation
const noteToAppreciationMap = {
  0: "aucune_preuve",
  1: "partiellement_pris_en_compte",
  2: "applique_irregulierement",
  3: "bien_respecte",
  4: "pleinement_atteint",
};

// Clé pour le localStorage
const STORAGE_KEY = "auto_evaluation_progression";
const EXPANDED_SECTIONS_KEY = "expanded_sections";
const AUTO_EVAL_RESULT_KEY = "auto_evaluation_result";
const AUTO_EVAL_HISTORY_KEY = "auto_evaluation_history";

export default function AutoEvaluationAccreditation() {
  const location = useLocation();
  const navigate = useNavigate();
  const demandeToEdit = location.state?.demande || null;

  // État pour la vue actuelle avec synchronisation URL
  const [currentView, setCurrentView] = useState(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get("view");
    if (view === "evaluation") return "evaluation";
    if (view === "recapitulatif") return "recapitulatif";
    return "canevas";
  });

  const [hasReadCanevas, setHasReadCanevas] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [animatedTotalNotes, setAnimatedTotalNotes] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [pendingProgression, setPendingProgression] = useState(null);
  const [evaluationHistory, setEvaluationHistory] = useState([]);
  const [formData, setFormData] = useState({
    criteres: {},
  });

  // === FONCTIONS DE SYNCHRONISATION ===
  const getNoteFromAppreciation = (appreciationValue) => {
    return appreciationToNoteMap[appreciationValue] || "";
  };

  const getAppreciationFromNote = (noteValue) => {
    return noteToAppreciationMap[noteValue] || "";
  };

  const totalNotes = Object.values(formData.criteres || {}).reduce(
    (acc, critere) => {
      const note = parseInt(critere.note, 10);
      return acc + (isNaN(note) ? 0 : note);
    },
    0,
  );

  const MAX_POINTS = 92 * 4;
  const scorePourcentage = (totalNotes / MAX_POINTS) * 100;

  const getNiveauConformite = (pourcentage) => {
    if (pourcentage >= 80)
      return {
        niveau: "Excellent",
        color: "green",
        message:
          "Félicitations ! Votre institution démontre une excellence dans tous les domaines évalués. Vous êtes prêt pour l'accréditation.",
      };
    if (pourcentage >= 60)
      return {
        niveau: "Satisfaisant",
        color: "blue",
        message:
          "Bon niveau de conformité. Quelques axes d'amélioration identifiés pour atteindre l'excellence.",
      };
    if (pourcentage >= 40)
      return {
        niveau: "En développement",
        color: "yellow",
        message:
          "Des progrès significatifs sont nécessaires. Concentrez-vous sur les critères les plus faibles.",
      };
    if (pourcentage >= 20)
      return {
        niveau: "Faible",
        color: "orange",
        message:
          "Votre institution doit revoir en profondeur sa démarche qualité. Priorisez les actions correctives.",
      };
    return {
      niveau: "Insuffisant",
      color: "red",
      message:
        "Votre institution ne répond pas aux critères minimaux. Une refonte complète du système qualité est recommandée.",
    };
  };

  const niveauConformite = getNiveauConformite(scorePourcentage);

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = storedUser?.id;

  const formSteps = [
    { id: 1, title: "LA POLITIQUE\nDE FORMATION" },
    { id: 2, title: "LA POLITIQUE\nDE GOUVERNANCE" },
    { id: 3, title: "LA POLITIQUE\nDE RECHERCHE" },
  ];

  const progressPercentage = (currentStep / 3) * 100;

  // Synchroniser l'URL avec la vue actuelle
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("view", currentView);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [currentView, navigate, location.pathname]);

  // Effet pour le scroll to top
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

  // Sauvegarder automatiquement le résultat de l'auto-évaluation
  useEffect(() => {
    if (currentUserId && Object.keys(formData.criteres).length > 0) {
      const resultData = {
        totalNotes,
        scorePourcentage,
        niveauConformite,
        timestamp: new Date().toISOString(),
        formData: {
          ...formData,
          criteres: Object.keys(formData.criteres).reduce((acc, key) => {
            acc[key] = {
              note: formData.criteres[key]?.note || "",
              appreciation: formData.criteres[key]?.appreciation || "",
              fichiers: formData.criteres[key]?.fichiers?.length || 0,
            };
            return acc;
          }, {}),
        },
      };
      localStorage.setItem(
        `${AUTO_EVAL_RESULT_KEY}_${currentUserId}`,
        JSON.stringify(resultData),
      );
    }
  }, [totalNotes, scorePourcentage, niveauConformite, currentUserId, formData]);

  // Animation du compteur de points
  useEffect(() => {
    if (currentView === "recapitulatif" && totalNotes > 0) {
      setIsCalculating(true);
      let startTime = null;
      const duration = 2000;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);

        setAnimatedTotalNotes(Math.floor(totalNotes * easeOutCubic));
        setAnimatedScore(Math.floor(scorePourcentage * easeOutCubic));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setAnimatedTotalNotes(totalNotes);
          setAnimatedScore(scorePourcentage);
          setIsCalculating(false);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setAnimatedTotalNotes(totalNotes);
      setAnimatedScore(scorePourcentage);
    }
  }, [currentView, totalNotes, scorePourcentage]);

  // Charger l'état des sections expansées depuis localStorage
  useEffect(() => {
    if (currentUserId) {
      const savedExpanded = localStorage.getItem(
        `${EXPANDED_SECTIONS_KEY}_${currentUserId}`,
      );
      if (savedExpanded) {
        setExpandedSections(JSON.parse(savedExpanded));
      }
    }
  }, [currentUserId]);

  // Sauvegarder l'état des sections expansées
  const saveExpandedSections = (sections) => {
    if (currentUserId) {
      localStorage.setItem(
        `${EXPANDED_SECTIONS_KEY}_${currentUserId}`,
        JSON.stringify(sections),
      );
    }
  };

  // Construire les critères initiaux à partir de la définition des sections
  const buildInitialCriteres = () => {
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
    return initialCriteres;
  };

  // Fonction pour basculer l'état d'une section
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => {
      const newState = {
        ...prev,
        [sectionId]: !prev[sectionId],
      };
      saveExpandedSections(newState);
      return newState;
    });
  };

  // Fonction pour tout réduire
  const collapseAll = () => {
    const allCollapsed = {};
    sectionsEvaluation.forEach((section) => {
      section.subsections.forEach((sub) => {
        allCollapsed[sub.id] = false;
      });
    });
    setExpandedSections(allCollapsed);
    saveExpandedSections(allCollapsed);
  };

  // Fonction pour tout développer
  const expandAll = () => {
    const allExpanded = {};
    sectionsEvaluation.forEach((section) => {
      section.subsections.forEach((sub) => {
        allExpanded[sub.id] = true;
      });
    });
    setExpandedSections(allExpanded);
    saveExpandedSections(allExpanded);
  };

  // Fonction pour sauvegarder la progression
  const saveProgression = () => {
    try {
      if (currentUserId) {
        const progressionData = {
          formData,
          currentStep,
          expandedSections,
          timestamp: new Date().toISOString(),
          userId: currentUserId,
        };
        localStorage.setItem(
          `${STORAGE_KEY}_${currentUserId}`,
          JSON.stringify(progressionData),
        );
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la progression:", error);
    }
  };

  // Fonction pour charger la progression
  const loadProgression = () => {
    try {
      if (currentUserId) {
        const savedData = localStorage.getItem(
          `${STORAGE_KEY}_${currentUserId}`,
        );
        if (savedData) {
          const progressionData = JSON.parse(savedData);
          const savedTime = new Date(progressionData.timestamp).getTime();
          const currentTime = new Date().getTime();
          const hoursDiff = (currentTime - savedTime) / (1000 * 60 * 60);

          if (hoursDiff < 24) {
            return progressionData;
          } else {
            localStorage.removeItem(`${STORAGE_KEY}_${currentUserId}`);
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la progression:", error);
    }
    return null;
  };

  // Fonction pour restaurer la progression
  const restoreProgression = (progressionData) => {
    setFormData(progressionData.formData);
    setCurrentStep(progressionData.currentStep);
    if (progressionData.expandedSections) {
      setExpandedSections(progressionData.expandedSections);
    }
    toast.success("Progression restaurée avec succès !", {
      position: "top-right",
      autoClose: 4000,
    });
  };

  // Charger l'historique des auto-évaluations
  useEffect(() => {
    if (currentUserId) {
      const history = localStorage.getItem(
        `${AUTO_EVAL_HISTORY_KEY}_${currentUserId}`,
      );
      if (history) {
        setEvaluationHistory(JSON.parse(history).slice(0, 5));
      }
    }
  }, [currentUserId]);

  // Sauvegarder dans l'historique quand une évaluation est terminée
  const saveToHistory = () => {
    if (currentUserId && Object.keys(formData.criteres).length > 0) {
      const historyItem = {
        id: Date.now(),
        date: new Date().toISOString(),
        score: totalNotes,
        maxPoints: MAX_POINTS,
        pourcentage: scorePourcentage,
        niveau: niveauConformite.niveau,
        color: niveauConformite.color,
        completedCriteres: Object.values(formData.criteres).filter(
          (c) => c.note && c.appreciation,
        ).length,
        totalCriteres: Object.values(formData.criteres).length,
      };

      const existingHistory = JSON.parse(
        localStorage.getItem(`${AUTO_EVAL_HISTORY_KEY}_${currentUserId}`) ||
          "[]",
      );
      const updatedHistory = [historyItem, ...existingHistory].slice(0, 10);
      localStorage.setItem(
        `${AUTO_EVAL_HISTORY_KEY}_${currentUserId}`,
        JSON.stringify(updatedHistory),
      );
      setEvaluationHistory(updatedHistory.slice(0, 5));
    }
  };

  // Appeler saveToHistory quand on arrive au récapitulatif
  useEffect(() => {
    if (currentView === "recapitulatif" && totalNotes > 0) {
      saveToHistory();
    }
  }, [currentView, totalNotes]);

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
      const prefilled = buildInitialCriteres();
      Object.entries(demandeToEdit.criteres || {}).forEach(([id, val]) => {
        if (prefilled[id]) {
          prefilled[id] = {
            preuves: val?.preuves || [],
            appreciation: val?.appreciation || "",
            note: val?.note || "",
            fichiers: val?.fichiers || [],
          };
        }
      });

      setFormData({
        criteres: prefilled,
      });

      setCurrentView("recapitulatif");
    } else {
      // Vérifier s'il y a une progression sauvegardée et si des critères sont remplis
      const savedProgression = loadProgression();

      // Vérifier si la progression a des critères remplis
      const hasCompletedCriteres =
        savedProgression?.formData?.criteres &&
        Object.values(savedProgression.formData.criteres).some(
          (c) =>
            c.note && c.note !== "" && c.appreciation && c.appreciation !== "",
        );

      if (savedProgression && hasCompletedCriteres) {
        setPendingProgression(savedProgression);
        setShowResumeModal(true);
      }

      setFormData((prev) => ({ ...prev, criteres: buildInitialCriteres() }));
      const initialExpanded = {};
      sectionsEvaluation.forEach((section) => {
        section.subsections.forEach((sub) => {
          initialExpanded[sub.id] = true;
        });
      });
      setExpandedSections(initialExpanded);
      saveExpandedSections(initialExpanded);
    }
  }, [demandeToEdit, currentUserId]);

  // Sauvegarder automatiquement à chaque modification
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (
        currentUserId &&
        Object.keys(formData.criteres).length > 0 &&
        currentView === "evaluation"
      ) {
        saveProgression();
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [formData, currentStep, expandedSections, currentUserId, currentView]);

  // FONCTION DE SYNCHRONISATION AUTOMATIQUE
  const handleCritereChange = (critereId, field, value) => {
    setFormData((prev) => {
      const updatedCritere = { ...prev.criteres[critereId] };

      if (field === "appreciation") {
        // Mise à jour de l'appréciation
        updatedCritere[field] = value;
        // Synchronisation AUTOMATIQUE : la note est définie à partir de l'appréciation
        if (value) {
          updatedCritere.note = getNoteFromAppreciation(value);
        } else {
          updatedCritere.note = "";
        }
      } else if (field === "note") {
        // Mise à jour manuelle de la note
        updatedCritere[field] = value;
        // Synchronisation inverse : l'appréciation est définie à partir de la note
        if (value) {
          updatedCritere.appreciation = getAppreciationFromNote(value);
        }
      } else {
        updatedCritere[field] = value;
      }

      return {
        ...prev,
        criteres: {
          ...prev.criteres,
          [critereId]: updatedCritere,
        },
      };
    });
  };

  const handleFileUpload = (critereId, files) => {
    const critere = formData.criteres[critereId];
    const currentFiles = critere?.fichiers || [];

    if (currentFiles.length + files.length > 3) {
      toast.error("Vous ne pouvez pas ajouter plus de 3 fichiers par critère", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    const MAX_SIZE = 8 * 1024 * 1024;
    const oversizedFiles = Array.from(files).filter(
      (file) => file.size > MAX_SIZE,
    );

    if (oversizedFiles.length > 0) {
      toast.error(
        `Les fichiers suivants dépassent 8 Mo : ${oversizedFiles.map((f) => f.name).join(", ")}`,
        {
          position: "top-right",
          autoClose: 5000,
        },
      );
      return;
    }

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

    toast.success(`${files.length} fichier(s) ajouté(s) avec succès`, {
      position: "top-right",
      autoClose: 2000,
    });
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
              (f) => f.id !== fileId,
            ) || [],
        },
      },
    }));
  };

  const nextStep = () => {
    if (currentStep < 2) {
      const currentSectionCriteres = sectionsEvaluation[
        currentStep
      ].subsections.flatMap((sub) => sub.criteres);

      const invalidCriteres = currentSectionCriteres.filter((c) => {
        const crit = formData.criteres[c.id];
        if (!crit) return true;
        if (!crit.appreciation || crit.appreciation === "") return true;
        if (!crit.note || crit.note === "") return true;
        if (crit.appreciation !== "aucune_preuve" && crit.fichiers.length === 0)
          return true;
        return false;
      });

      if (invalidCriteres.length > 0) {
        toast.error(
          `Veuillez remplir tous les critères de cette section avant de continuer.`,
          {
            position: "top-right",
            autoClose: 5000,
          },
        );
        return;
      }
    }

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      scrollToTop();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollToTop();
    }
  };

  const handleStartEvaluation = () => {
    if (hasReadCanevas) {
      setCurrentView("evaluation");
      scrollToTop();
    }
  };

  const handleViewRecap = () => {
    const allCriteres = Object.values(sectionsEvaluation).flatMap((section) =>
      section.subsections.flatMap((sub) => sub.criteres),
    );

    const invalidCriteres = allCriteres.filter((c) => {
      const crit = formData.criteres[c.id];
      if (!crit) return true;
      if (!crit.appreciation || crit.appreciation === "") return true;
      if (!crit.note || crit.note === "") return true;
      if (crit.appreciation !== "aucune_preuve" && crit.fichiers.length === 0)
        return true;
      return false;
    });

    if (invalidCriteres.length > 0) {
      toast.error(
        `Tous les critères doivent être complétés avant de voir le récapitulatif.\nCritères incomplets: ${invalidCriteres
          .slice(0, 5)
          .map((c) => c.numero)
          .join(", ")}...`,
        {
          position: "top-right",
          autoClose: 6000,
        },
      );
      return;
    }

    setCurrentView("recapitulatif");
    scrollToTop();
  };

  const handleBackToCanevas = () => {
    setCurrentView("canevas");
    setHasReadCanevas(false);
    scrollToTop();
  };

  const handleRefaireEvaluation = () => {
    setCurrentView("evaluation");
    scrollToTop();
    toast.info("Vous pouvez maintenant modifier votre évaluation", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const FileUpload = ({ critereId, fichiers = [] }) => {
    const critere = formData.criteres[critereId];
    const fileCount = critere?.fichiers?.length || 0;
    const remainingSlots = 3 - fileCount;
    const appreciationValue = critere?.appreciation || "";
    const showFileUpload =
      appreciationValue !== "aucune_preuve" && appreciationValue !== "";

    if (!showFileUpload) {
      return null;
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              Preuves
              {appreciationValue !== "aucune_preuve" &&
                appreciationValue !== "" && (
                  <span className="text-red-500 ml-1">*</span>
                )}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                fileCount === 0
                  ? "bg-gray-100 text-gray-700"
                  : fileCount === 3
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
              }`}
            >
              {fileCount}/3
            </span>
          </div>
          <div className="text-xs text-gray-500">Max 8 Mo/fichier</div>
        </div>

        <input
          type="file"
          id={`file-upload-${critereId}`}
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,.doc,.docx"
          onChange={(e) => handleFileUpload(critereId, e.target.files)}
          className="hidden"
          disabled={fileCount >= 3}
        />

        <label
          htmlFor={`file-upload-${critereId}`}
          className={`
            relative flex items-center justify-between w-full px-4 py-3 
            border border-gray-300 rounded-lg cursor-pointer 
            transition-all duration-200 group
            ${
              fileCount >= 3
                ? "bg-gray-100 cursor-not-allowed opacity-60"
                : "bg-white hover:border-blue-400 hover:bg-blue-50/30"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div
              className={`
              p-2 rounded-lg transition-colors
              ${fileCount >= 3 ? "bg-gray-200" : "bg-blue-100 group-hover:bg-blue-200"}
            `}
            >
              <svg
                className={`w-5 h-5 ${fileCount >= 3 ? "text-gray-500" : "text-blue-600"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {fileCount >= 3
                  ? "Limite de 3 fichiers atteinte"
                  : remainingSlots === 1
                    ? "Ajouter 1 fichier"
                    : `Ajouter jusqu'à ${remainingSlots} fichiers`}
                {appreciationValue !== "aucune_preuve" &&
                  appreciationValue !== "" &&
                  fileCount === 0 && (
                    <span className="text-red-500 text-xs ml-2">
                      Obligatoire
                    </span>
                  )}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                PDF, JPG, JPEG, PNG, GIF, BMP, WEBP, TIFF, DOC, DOCX • 8 Mo max
              </p>
            </div>
          </div>
          {fileCount < 3 && (
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg group-hover:bg-blue-100 transition-colors">
              Parcourir
            </span>
          )}
        </label>

        {fichiers.length > 0 && (
          <div className="bg-gray-50 rounded-lg divide-y divide-gray-200 border border-gray-200">
            {fichiers.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {file.type.includes("pdf") ? (
                      <span className="text-red-500 text-lg">PDF</span>
                    ) : file.type.includes("image") ? (
                      <span className="text-blue-500 text-lg">IMG</span>
                    ) : (
                      <span className="text-gray-500 text-lg">DOC</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(0)} Ko
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(critereId, file.id)}
                  className="ml-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ========== MODAL DE REPRISE MODERNE ==========
  const ResumeEvaluationModal = () => {
    // Ne pas afficher la modale si aucune progression n'est en cours ou si aucun critère n'est rempli
    if (!pendingProgression) return null;

    // Vérifier s'il y a des critères avec des notes ou appréciations
    const criteresValues = Object.values(
      pendingProgression.formData?.criteres || {},
    );
    const hasAnyValue = criteresValues.some(
      (c) =>
        (c.note && c.note !== "") || (c.appreciation && c.appreciation !== ""),
    );

    if (!hasAnyValue) return null;

    // Calculer les statistiques réelles de la progression
    const totalCriteresWithValues = criteresValues.filter(
      (c) => c.note && c.note !== "",
    ).length;
    const totalPoints = criteresValues.reduce(
      (acc, c) => acc + (parseInt(c.note) || 0),
      0,
    );
    const currentStepProgress = pendingProgression.currentStep || 0;
    const stepProgressPercentage = Math.round((currentStepProgress / 3) * 100);

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
                    Évaluation en cours
                  </h3>
                  <p className="text-sm text-blue-100 mt-0.5">
                    Dernière activité :{" "}
                    {pendingProgression?.timestamp
                      ? new Date(pendingProgression.timestamp).toLocaleString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                      : ""}
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
                      {stepProgressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${stepProgressPercentage}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Étape {pendingProgression?.currentStep + 1}/3 :{" "}
                    {formSteps[pendingProgression?.currentStep]?.title?.replace(
                      "\n",
                      " ",
                    )}
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
                        <p className="text-xs text-gray-500">Critères</p>
                        <p className="text-lg font-bold text-gray-900">
                          {totalCriteresWithValues}
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            /92
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
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Score</p>
                        <p className="text-lg font-bold text-gray-900">
                          {totalPoints}
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            /368
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  Vous avez une auto-évaluation en cours. Souhaitez-vous la
                  reprendre là où vous vous étiez arrêté(e) ?
                </p>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex flex-col sm:flex-row gap-3 justify-end border-t border-gray-100">
              <button
                onClick={() => {
                  setShowResumeModal(false);
                  setPendingProgression(null);
                  // Supprimer la progression sauvegardée pour démarrer une nouvelle évaluation
                  try {
                    if (currentUserId) {
                      localStorage.removeItem(
                        `${STORAGE_KEY}_${currentUserId}`,
                      );
                      localStorage.removeItem(
                        `${AUTO_EVAL_RESULT_KEY}_${currentUserId}`,
                      );
                    }
                  } catch (e) {
                    console.error(
                      "Erreur lors de la suppression de la progression:",
                      e,
                    );
                  }
                  // Réinitialiser le formulaire et l'état
                  setFormData({ criteres: buildInitialCriteres() });
                  setCurrentStep(0);
                  const initialExpanded = {};
                  sectionsEvaluation.forEach((section) => {
                    section.subsections.forEach((sub) => {
                      initialExpanded[sub.id] = true;
                    });
                  });
                  setExpandedSections(initialExpanded);
                  saveExpandedSections(initialExpanded);
                }}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Nouvelle évaluation
              </button>
              <button
                onClick={() => {
                  restoreProgression(pendingProgression);
                  setShowResumeModal(false);
                  setCurrentView("evaluation");
                }}
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
                Reprendre l'évaluation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ========== COMPOSANT D'HISTORIQUE DES AUTO-ÉVALUATIONS ==========
  const EvaluationHistorySection = () => {
    if (evaluationHistory.length === 0) {
      return null;
    }

    return (
      <div className="mt-12 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Historique des auto-évaluations
              </h3>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200">
              {evaluationHistory.length} évaluation
              {evaluationHistory.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {evaluationHistory.map((evalItem, index) => {
            const date = new Date(evalItem.date);
            const formattedDate = date.toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });
            const formattedTime = date.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            const getColorClasses = (color) => {
              const colors = {
                green: "bg-green-100 text-green-700 border-green-200",
                blue: "bg-blue-100 text-blue-700 border-blue-200",
                yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
                orange: "bg-orange-100 text-orange-700 border-orange-200",
                red: "bg-red-100 text-red-700 border-red-200",
              };
              return (
                colors[color] || "bg-gray-100 text-gray-700 border-gray-200"
              );
            };

            return (
              <div
                key={evalItem.id}
                className="px-6 py-4 hover:bg-gray-50/80 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getColorClasses(evalItem.color)}`}
                      >
                        Niveau {evalItem.niveau}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formattedDate} à {formattedTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-gray-900">
                          {evalItem.pourcentage.toFixed(1)}%
                        </span>
                        <span className="text-xs text-gray-500">
                          score global
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-gray-900">
                          {evalItem.score}
                        </span>
                        <span className="text-xs text-gray-500">
                          / {evalItem.maxPoints} pts
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-gray-900">
                          {evalItem.completedCriteres}
                        </span>
                        <span className="text-xs text-gray-500">
                          / {evalItem.totalCriteres} critères
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          evalItem.color === "green"
                            ? "bg-green-500"
                            : evalItem.color === "blue"
                              ? "bg-blue-500"
                              : evalItem.color === "yellow"
                                ? "bg-yellow-500"
                                : evalItem.color === "orange"
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                        }`}
                        style={{ width: `${evalItem.pourcentage}%` }}
                      />
                    </div>
                    <button
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir les détails"
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {evaluationHistory.length > 5 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Voir les {evaluationHistory.length - 5} évaluations plus anciennes
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  };

  // ========== PAGE 1 : CANEVAS ET ACCEPTATION ==========
  const renderCanevasView = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 md:mb-12 bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-100">
          <div className="flex justify-center mb-4">
            <img
              src={mesupresLogo}
              alt="MESUPRES Logo"
              className="h-24 w-auto object-contain"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Auto-évaluation pour l'Accréditation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR ET DE LA RECHERCHE
            SCIENTIFIQUE
          </p>
        </div>

        <EvaluationHistorySection />

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-8">
          <div className="px-6 py-5 bg-white">
            <h2 className="text-xl font-bold text-gray-900">
              Mécanisme d'accréditation et de labellisation
            </h2>
            <p className="text-gray-600 text-sm mt-1">Objectifs</p>
          </div>
          <div className="p-6 md:p-8">
            <div className="space-y-8">
              <div className="bg-white border border-gray-100 rounded-lg p-6 mb-4">
                <ol className="list-decimal pl-5 text-slate-700 text-sm space-y-2 mb-4">
                  <li>
                    Accréditer les IES dont les offres de formation sont
                    habilitées.
                  </li>
                  <li>
                    Engager les procédures d'évaluation suivant les normes et
                    critères fixés par Arrêté ministériel.
                  </li>
                  <li>
                    Accorder l'accréditation aux IES offrant des formations
                    courtes, de la Licence au Doctorat.
                  </li>
                  <li>
                    Assurer une amélioration continue de la qualité de
                    l'enseignement supérieur.
                  </li>
                  <li>Durée de validité de l'accréditation : 5 ans.</li>
                  <li>
                    Renforcer la transparence et la communication des décisions
                    d'accréditation.
                  </li>
                </ol>
                <p className="text-sm text-slate-600">
                  <strong className="text-blue-800">Portée :</strong>{" "}
                  amélioration continue de la qualité des établissements
                  d'enseignement supérieur (IES).
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Procédure d'évaluation pour l'accréditation
                </h3>

                <div className="relative flex flex-col gap-6 md:gap-8">
                  {/* Étape 1-3 */}
                  <div className="relative grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-6">
                    {[
                      {
                        id: 1,
                        title: "Demande d'accréditation",
                        description:
                          "L'établissement d'enseignement supérieur (IES) soumet une demande officielle d'accréditation auprès du MESUPRES.",
                      },
                      {
                        id: 2,
                        title: "Auto-évaluation (interne)",
                        description:
                          "L'IES effectue une auto-évaluation selon le référentiel d'accréditation ou de labellisation, en analysant ses domaines de performance et en préparant un rapport d'auto-évaluation.",
                      },
                      {
                        id: 3,
                        title: "Traitement préalable par la DAAQ",
                        description:
                          "La Direction de l'Assurance de l'Assurance Qualité (DAAQ) analyse le rapport d'auto-évaluation soumis par l'IES avant la visite externe.",
                      },
                    ].map((step, index) => (
                      <div key={step.id} className="relative group h-full">
                        <div className="bg-white border border-blue-100 p-4 rounded-lg h-full flex flex-col gap-3 hover:border-blue-300 transition-colors z-20 relative">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                              {step.id}
                            </div>
                            <div className="text-slate-700 text-sm leading-relaxed">
                              <strong className="block text-slate-900 mb-1">
                                {step.title}
                              </strong>
                              {step.description}
                            </div>
                          </div>
                        </div>
                        {/* connectors removed */}
                      </div>
                    ))}
                  </div>

                  {/* Étape 4-6 */}
                  <div className="relative grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-6 pt-4 md:pt-0">
                    {[
                      {
                        id: 4,
                        title: "Évaluation externe par des experts",
                        description:
                          "Une équipe d'experts indépendants réalise l'évaluation externe sur terrain, examine les documents, rencontre le groupe de pilotage et rédige un rapport d'évaluation externe.",
                      },
                      {
                        id: 5,
                        title:
                          "Réunion de la Commission Nationale d'Accréditation (CNA)",
                        description:
                          "La CNA étudie les rapports d'évaluation externe et prend une décision formelle (positive ou négative) d'accréditation.",
                      },
                      {
                        id: 6,
                        title:
                          "Décision de la CNA et communication du résultat",
                        description:
                          "Le MESUPRES communique la décision officielle à l'IES et publie, le cas échéant, la liste des établissements accrédités.",
                      },
                    ].map((step, index) => (
                      <div key={step.id} className="relative group h-full">
                        <div className="bg-white border border-blue-100 p-4 rounded-lg h-full flex flex-col gap-3 hover:border-blue-300 transition-colors z-20 relative">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                              {step.id}
                            </div>
                            <div className="text-slate-700 text-sm leading-relaxed">
                              <strong className="block text-slate-900 mb-1">
                                {step.title}
                              </strong>
                              {step.description}
                            </div>
                          </div>
                        </div>
                        {/* connectors removed */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800">Important</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Chaque critère nécessite une appréciation, une note sur 4,
                    et des preuves (sauf si l'appréciation est "Aucune preuve").
                    Vous pouvez joindre jusqu'à 3 fichiers par critère (PDF,
                    images, documents Word) de 8 Mo maximum chacun.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-start">
              <input
                id="accept-canevas"
                type="checkbox"
                checked={hasReadCanevas}
                onChange={(e) => setHasReadCanevas(e.target.checked)}
                className="mt-1.5 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="accept-canevas"
                className="ml-3 text-base text-gray-700 leading-6"
              >
                J'ai pris connaissance du canevas d'évaluation et je m'engage à
                fournir des informations complètes, exactes et conformes aux
                exigences pour chaque critère.
                <span className="text-red-600 font-medium ml-1">
                  (obligatoire)
                </span>
              </label>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleStartEvaluation}
                disabled={!hasReadCanevas}
                className={`
                  px-10 py-4 rounded-lg font-medium transition flex items-center gap-3 text-base
                  ${
                    hasReadCanevas
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                Commencer l'auto-évaluation
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
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
    </div>
  );

  // ========== PAGE 2 : FORMULAIRE D'ÉVALUATION ==========
  const renderEvaluationView = () => (
    <div className="min-h-screen bg-white py-6 md:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Auto-évaluation
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Évaluez chaque critère selon les échelles fournies
            </p>
          </div>
          <button
            onClick={handleBackToCanevas}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour
          </button>
        </div>

        <div className="mb-6 md:mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs md:text-sm font-medium text-gray-600">
              Progression
            </span>
            <span className="text-xs md:text-sm font-semibold text-blue-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 md:h-2">
            <div
              className="h-1.5 md:h-2 rounded-full transition-all duration-500 ease-out bg-blue-600"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="md:hidden mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">
              Étape {currentStep + 1}/3
            </p>
            <p className="text-base font-semibold text-gray-900 whitespace-pre-line">
              {formSteps[currentStep]?.title}
            </p>
          </div>
        </div>

        <div className="hidden md:block mb-8 lg:mb-10">
          <div className="relative">
            <div className="absolute left-0 right-0 top-[19px] h-0.5 bg-gray-100" />
            <div
              className="absolute left-0 top-[19px] h-0.5 transition-all duration-500 ease-out bg-blue-600"
              style={{ width: `${progressPercentage}%` }}
            />

            <div className="grid grid-cols-3 gap-3 relative z-10">
              {formSteps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`
                      w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-sm font-bold
                      ${
                        step.id < currentStep + 1
                          ? "bg-green-600 border-green-600 text-white"
                          : step.id === currentStep + 1
                            ? "bg-blue-600 border-blue-600 ring-2 ring-blue-200 text-white"
                            : "bg-white border-gray-300 text-gray-500"
                      }
                    `}
                  >
                    {step.id < currentStep + 1 ? (
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
                  <p className="mt-2 text-xs font-medium text-gray-700 text-center leading-tight whitespace-pre-line max-w-[100px]">
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white mb-6">
          <div className="bg-gray-50 px-3 md:px-4 py-2 md:py-3 rounded-lg mb-4 md:mb-6">
            <p className="text-xs md:text-sm text-gray-700">
              Étape {currentStep + 1}/3 :{" "}
              {sectionsEvaluation[currentStep]?.title}
            </p>
          </div>

          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              Tout réduire
            </button>
            <button
              onClick={expandAll}
              className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
              Tout développer
            </button>
          </div>

          {sectionsEvaluation[currentStep]?.subsections.map((sub, subIndex) => {
            const isExpanded =
              expandedSections[sub.id] !== undefined
                ? expandedSections[sub.id]
                : true;

            return (
              <div
                key={subIndex}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4"
              >
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleSection(sub.id)}
                >
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">
                    {sub.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-gray-600">
                      {
                        sub.criteres.filter((c) => {
                          const crit = formData.criteres[c.id];
                          if (!crit) return false;
                          if (!crit.appreciation || crit.appreciation === "")
                            return false;
                          if (!crit.note || crit.note === "") return false;
                          if (
                            crit.appreciation !== "aucune_preuve" &&
                            crit.fichiers.length === 0
                          )
                            return false;
                          return true;
                        }).length
                      }
                      /{sub.criteres.length}
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isExpanded ? "transform rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 md:p-5 border-t border-gray-200">
                    {sub.description && (
                      <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6 leading-relaxed">
                        {sub.description}
                      </p>
                    )}

                    <div className="space-y-3 md:space-y-4">
                      {sub.criteres.map((c) => (
                        <div
                          key={c.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-start gap-2 md:gap-3 mb-3 md:mb-4">
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md text-xs font-medium">
                              {c.numero}
                            </span>
                            <span className="text-xs md:text-sm font-medium text-gray-900 flex-1">
                              {c.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                            <div className="lg:col-span-2">
                              <FileUpload
                                critereId={c.id}
                                fichiers={
                                  formData.criteres[c.id]?.fichiers || []
                                }
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Appréciation{" "}
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
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                              >
                                <option value="">Sélectionnez</option>
                                {appreciationOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Note <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={formData.criteres[c.id]?.note || ""}
                                onChange={(e) =>
                                  handleCritereChange(
                                    c.id,
                                    "note",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                              >
                                <option value="">Sélectionnez</option>
                                {noteOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              {/* Synchronisation visuelle supprimée */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`
              flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base transition
              ${
                currentStep === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
              }
            `}
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
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Précédent
          </button>

          {currentStep === 2 ? (
            <button
              onClick={handleViewRecap}
              className="flex items-center gap-2 px-8 md:px-10 py-2.5 md:py-3 bg-green-600 text-white rounded-lg font-medium text-sm md:text-base hover:bg-green-700 transition"
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
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Voir le résultat
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-8 md:px-10 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg font-medium text-sm md:text-base hover:bg-blue-700 transition"
            >
              Suivant
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
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
          )}
        </div>
      </div>
    </div>
  );

  // ========== PAGE 3 : RÉCAPITULATIF ET RÉSULTAT ==========
  const renderRecapitulatifView = () => {
    const criteresCompletes = Object.values(formData.criteres).filter(
      (c) => c.note && c.appreciation,
    ).length;
    const totalCriteres = Object.values(formData.criteres).length;
    const tauxCompletion = (criteresCompletes / totalCriteres) * 100;

    const sectionsScores = sectionsEvaluation.map((section) => {
      const sectionCriteres = section.subsections.flatMap(
        (sub) => sub.criteres,
      );
      const sectionNote = sectionCriteres.reduce((acc, c) => {
        const note = parseInt(formData.criteres[c.id]?.note || 0);
        return acc + (isNaN(note) ? 0 : note);
      }, 0);
      const sectionMaxPoints = sectionCriteres.length * 4;
      const sectionPourcentage = (sectionNote / sectionMaxPoints) * 100;
      return {
        title: section.title,
        note: sectionNote,
        maxPoints: sectionMaxPoints,
        pourcentage: sectionPourcentage,
        criteresCount: sectionCriteres.length,
        completedCount: sectionCriteres.filter((c) => {
          const crit = formData.criteres[c.id];
          return crit && crit.note && crit.appreciation;
        }).length,
      };
    });

    return (
      <div className="min-h-screen bg-white py-6 md:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Résultat de l'Auto-Évaluation
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Analyse détaillée de votre niveau de conformité
              </p>
            </div>
            <button
              onClick={handleRefaireEvaluation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Modifier l'évaluation
            </button>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">
                  Résultat de l'Auto-Évaluation
                </h2>
                <p className="text-gray-300">
                  Analyse de conformité aux normes d'accréditation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-center">
                    <div className="text-sm uppercase tracking-wider text-gray-300 mb-2">
                      Score Global
                    </div>
                    <div className="relative">
                      <div className="text-6xl font-bold mb-1">
                        {isCalculating ? (
                          <span className="inline-block min-w-[120px]">
                            {Math.round(animatedScore)}%
                          </span>
                        ) : (
                          <span>{Math.round(scorePourcentage)}%</span>
                        )}
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3 mt-4">
                        <div
                          className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                            niveauConformite.color === "green"
                              ? "bg-green-500"
                              : niveauConformite.color === "blue"
                                ? "bg-blue-500"
                                : niveauConformite.color === "yellow"
                                  ? "bg-yellow-500"
                                  : niveauConformite.color === "orange"
                                    ? "bg-orange-500"
                                    : "bg-red-500"
                          }`}
                          style={{
                            width: `${isCalculating ? animatedScore : scorePourcentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-center">
                    <div className="text-sm uppercase tracking-wider text-gray-300 mb-2">
                      Points Obtenus
                    </div>
                    <div className="text-6xl font-bold mb-1">
                      {isCalculating ? (
                        <span className="inline-block min-w-[100px]">
                          {animatedTotalNotes}
                        </span>
                      ) : (
                        <span>{totalNotes}</span>
                      )}
                    </div>
                    <div className="text-gray-300">sur {MAX_POINTS} points</div>
                  </div>
                </div>
              </div>

              <div
                className={`bg-${niveauConformite.color}-500/20 border border-${niveauConformite.color}-500/30 rounded-xl p-6`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      niveauConformite.color === "green"
                        ? "bg-green-500"
                        : niveauConformite.color === "blue"
                          ? "bg-blue-500"
                          : niveauConformite.color === "yellow"
                            ? "bg-yellow-500"
                            : niveauConformite.color === "orange"
                              ? "bg-orange-500"
                              : "bg-red-500"
                    }`}
                  >
                    {niveauConformite.color === "green" && (
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    {niveauConformite.color === "blue" && (
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    )}
                    {niveauConformite.color === "yellow" && (
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
                    )}
                    {(niveauConformite.color === "orange" ||
                      niveauConformite.color === "red") && (
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
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      Niveau {niveauConformite.niveau}
                    </h3>
                    <p className="text-gray-300">{niveauConformite.message}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 p-6 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-blue-800 uppercase tracking-wider mb-1">
                      Total des notes
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      {totalNotes}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      sur {MAX_POINTS} points
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
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
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100/30 p-6 rounded-xl border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-green-800 uppercase tracking-wider mb-1">
                      Critères évalués
                    </p>
                    <p className="text-3xl font-bold text-green-900">
                      {criteresCompletes}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      sur {totalCriteres} critères
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">
                  Détail des évaluations par section
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {sectionsScores.map((section, index) => (
                  <div
                    key={index}
                    className="px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {section.title}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <span className="font-medium text-gray-900">
                              {section.completedCount}
                            </span>
                            <span>/ {section.criteresCount} critères</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="font-medium text-gray-900">
                              {section.note}
                            </span>
                            <span>points</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              section.pourcentage >= 80
                                ? "bg-green-500"
                                : section.pourcentage >= 60
                                  ? "bg-blue-500"
                                  : section.pourcentage >= 40
                                    ? "bg-yellow-500"
                                    : section.pourcentage >= 20
                                      ? "bg-orange-500"
                                      : "bg-red-500"
                            }`}
                            style={{ width: `${section.pourcentage}%` }}
                          />
                        </div>
                        <div className="text-right min-w-[80px]">
                          <span className="text-sm font-bold text-gray-900">
                            {Math.round(section.pourcentage)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">
                      Auto-évaluation sauvegardée automatiquement
                    </span>
                    <br />
                    Vos résultats sont enregistrés en temps réel. Vous pouvez
                    revenir modifier votre évaluation à tout moment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out;
        }
      `}</style>

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
        theme="colored"
      />

      {showResumeModal && <ResumeEvaluationModal />}

      <div className="min-h-screen bg-white">
        {currentView === "canevas" && renderCanevasView()}
        {currentView === "evaluation" && renderEvaluationView()}
        {currentView === "recapitulatif" && renderRecapitulatifView()}
      </div>
    </>
  );
}
