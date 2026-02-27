import React, { useState } from "react";
import {
  FaEye,
  FaEdit,
  FaSort,
  FaUniversity,
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
  FaArrowLeft,
  FaFileAlt,
  FaInfoCircle,
  FaExclamationTriangle,
  FaArchive,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaAward,
  FaStar,
  FaChartLine,
  FaUpload,
  FaChevronDown,
  FaChevronUp,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const levelConfig = {
  "non-conforme": {
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-800",
    bar: "bg-red-500",
    icon: FaExclamationTriangle,
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
    icon: FaClock,
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
    icon: FaCheckCircle,
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
    icon: FaCheckCircle,
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
    icon: FaStar,
    label: "Excellent",
    range: "312 – 368",
    appreciation: "Très haute qualité, bonnes pratiques institutionnalisées",
    min: 312,
    max: 368,
  },
};

const statusOptions = [
  {
    id: "en_attente",
    label: "En attente",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: FaClock,
  },
  {
    id: "accredite",
    label: "Accrédité",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: FaCheckCircle,
  },
  {
    id: "ajourne",
    label: "Ajourné",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: FaClock,
  },
  {
    id: "rejete",
    label: "Rejeté",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: FaTimesCircle,
  },
];

const sectionsEvaluation = [
  {
    title: "LA POLITIQUE DE FORMATION",
    subsections: [
      {
        id: "section_1_1",
        title: "1.1. LE PILOTAGE DE L'OFFRE DE FORMATION",
        criteres: [
          {
            id: "critere_01",
            numero: 1,
            label:
              "Rôle du partenariat avec les milieux économiques et les autorités dans l'élaboration de l'offre",
          },
          {
            id: "critere_02",
            numero: 2,
            label:
              "Place des connaissances et des compétences préprofessionnelles dans les programmes de formation",
          },
          {
            id: "critere_03",
            numero: 3,
            label:
              "Part des charges d'enseignement confiées aux professionnels",
          },
          {
            id: "critere_04",
            numero: 4,
            label: "Cadrage des offres de formation par les axes stratégiques",
          },
          {
            id: "critere_05",
            numero: 5,
            label:
              "Adéquation des axes de recherche et des offres de formation",
          },
        ],
      },
      {
        id: "section_1_2",
        title: "1.2. LA MISE EN ŒUVRE DE LA FORMATION",
        criteres: Array.from({ length: 22 }, (_, i) => ({
          id: `critere_${6 + i}`,
          numero: 6 + i,
          label: `Critère ${6 + i} - Mise en œuvre de la formation`,
        })),
      },
      {
        id: "section_1_3",
        title: "1.3. LA DEMARCHE QUALITE PEDAGOGIQUE",
        criteres: Array.from({ length: 10 }, (_, i) => ({
          id: `critere_${28 + i}`,
          numero: 28 + i,
          label: `Critère ${28 + i} - Démarche qualité pédagogique`,
        })),
      },
    ],
  },
  {
    title: "LA POLITIQUE DE GOUVERNANCE",
    subsections: [
      {
        id: "section_2_1",
        title: "2.1. ORGANISATION ET MANAGEMENT",
        criteres: Array.from({ length: 6 }, (_, i) => ({
          id: `critere_${38 + i}`,
          numero: 38 + i,
          label: `Critère ${38 + i} - Organisation et management`,
        })),
      },
      {
        id: "section_2_2",
        title: "2.2. SYSTÈME D'INFORMATION ET DE COMMUNICATION",
        criteres: Array.from({ length: 5 }, (_, i) => ({
          id: `critere_${44 + i}`,
          numero: 44 + i,
          label: `Critère ${44 + i} - Système d'information`,
        })),
      },
      {
        id: "section_2_3",
        title: "2.3. GESTION DES RESSOURCES DOCUMENTAIRES",
        criteres: Array.from({ length: 3 }, (_, i) => ({
          id: `critere_${49 + i}`,
          numero: 49 + i,
          label: `Critère ${49 + i} - Gestion documentaire`,
        })),
      },
      {
        id: "section_2_4",
        title: "2.4. GESTION DES RESSOURCES HUMAINES",
        criteres: Array.from({ length: 8 }, (_, i) => ({
          id: `critere_${52 + i}`,
          numero: 52 + i,
          label: `Critère ${52 + i} - Gestion des RH`,
        })),
      },
      {
        id: "section_2_5",
        title: "2.5. GESTION DES RESSOURCES FINANCIÈRES",
        criteres: Array.from({ length: 7 }, (_, i) => ({
          id: `critere_${60 + i}`,
          numero: 60 + i,
          label: `Critère ${60 + i} - Gestion financière`,
        })),
      },
      {
        id: "section_2_6",
        title: "2.6. POLITIQUE IMMOBILIÈRE ET LOGISTIQUE",
        criteres: Array.from({ length: 4 }, (_, i) => ({
          id: `critere_${67 + i}`,
          numero: 67 + i,
          label: `Critère ${67 + i} - Logistique`,
        })),
      },
      {
        id: "section_2_7",
        title: "2.7. MANAGEMENT DE LA QUALITÉ",
        criteres: Array.from({ length: 3 }, (_, i) => ({
          id: `critere_${71 + i}`,
          numero: 71 + i,
          label: `Critère ${71 + i} - Management qualité`,
        })),
      },
      {
        id: "section_2_8",
        title: "2.8. HYGIÈNE, SÉCURITÉ ET ENVIRONNEMENT",
        criteres: Array.from({ length: 4 }, (_, i) => ({
          id: `critere_${74 + i}`,
          numero: 74 + i,
          label: `Critère ${74 + i} - Hygiène et sécurité`,
        })),
      },
      {
        id: "section_2_9",
        title: "2.9. GESTION DE LA VIE ÉTUDIANTE",
        criteres: Array.from({ length: 8 }, (_, i) => ({
          id: `critere_${78 + i}`,
          numero: 78 + i,
          label: `Critère ${78 + i} - Vie étudiante`,
        })),
      },
      {
        id: "section_2_10",
        title: "2.10. LA GESTION DES PARTENARIATS",
        criteres: Array.from({ length: 3 }, (_, i) => ({
          id: `critere_${86 + i}`,
          numero: 86 + i,
          label: `Critère ${86 + i} - Partenariats`,
        })),
      },
    ],
  },
  {
    title: "LA POLITIQUE DE RECHERCHE",
    subsections: [
      {
        id: "section_3_1",
        title: "3.1. LA STRATÉGIE DE RECHERCHE DE L'INSTITUTION",
        criteres: Array.from({ length: 2 }, (_, i) => ({
          id: `critere_${89 + i}`,
          numero: 89 + i,
          label: `Critère ${89 + i} - Stratégie de recherche`,
        })),
      },
      {
        id: "section_3_2",
        title: "3.2. L'ENSEIGNEMENT ET LA RECHERCHE",
        criteres: Array.from({ length: 2 }, (_, i) => ({
          id: `critere_${91 + i}`,
          numero: 91 + i,
          label: `Critère ${91 + i} - Enseignement et recherche`,
        })),
      },
    ],
  },
];

const appreciationOptions = [
  { value: "aucune_preuve", label: "Aucune preuve" },
  {
    value: "partiellement_pris_en_compte",
    label: "Partiellement pris en compte",
  },
  { value: "applique_irregulierement", label: "Appliqué irrégulièrement" },
  { value: "bien_respecte", label: "Bien respecté" },
  { value: "pleinement_atteint", label: "Pleinemenent atteint" },
];

const noteOptions = [
  { value: "0", label: "0 - Absent" },
  { value: "1", label: "1 - Faible" },
  { value: "2", label: "2 - Acceptable" },
  { value: "3", label: "3 - Satisfaisant" },
  { value: "4", label: "4 - Excellent" },
];

const generateMockFiles = (critereId, count = 2) => {
  const files = [];
  const types = ["pdf", "jpg", "docx"];
  for (let i = 0; i < count; i++) {
    files.push({
      id: `${critereId}_file_${i}`,
      name: `Preuve_${critereId}_${i + 1}.${types[i % 3]}`,
      size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      type: types[i % 3],
      date: "2024-01-15",
    });
  }
  return files;
};

const generateMockCriteres = () => {
  const criteres = {};
  sectionsEvaluation.forEach((section) => {
    section.subsections.forEach((sub) => {
      sub.criteres.forEach((c) => {
        const note = Math.floor(Math.random() * 5);
        const appreciation = [
          "aucune_preuve",
          "partiellement_pris_en_compte",
          "applique_irregulierement",
          "bien_respecte",
          "pleinement_atteint",
        ][note];
        criteres[c.id] = {
          note: note.toString(),
          appreciation: appreciation,
          fichiers: generateMockFiles(c.id, Math.floor(Math.random() * 3) + 1),
        };
      });
    });
  });
  return criteres;
};

const DETAILED_DOSSIER = {
  id: 1,
  dossierNumber: "ACC-2024-001",
  institution: "Université Cheikh Anta Diop",
  program: "Licence Informatique",
  submittedDate: "2024-01-15",
  submittedBy: "Pr. Diallo Mamadou",
  email: "diallo@ucad.edu",
  phone: "+221 77 123 45 67",
  address: "Dakar, Sénégal",
  status: "en_attente",
  type_etablissement: "Publique",
  etablissement: "Université Cheikh Anta Diop",
  institution_privee: "",
  domaine: "Sciences et Technologies",
  mention: "Informatique",
  grade: "LICENCE",
  parcours: "Génie Logiciel",
  notes: "Dossier complet, en attente de traitement",
  autoEvaluation: {
    score: 268,
    maxScore: 368,
    pourcentage: 72.8,
    niveau: "satisfaisant",
    criteres: generateMockCriteres(),
    politiques: [
      { name: "FORMATION", score: 68, max: 148, niveau: "faible" },
      { name: "GOUVERNANCE", score: 184, max: 204, niveau: "acceptable" },
      { name: "RECHERCHE", score: 16, max: 16, niveau: "excellent" },
    ],
  },
  history: [
    { date: "2024-01-15", action: "Dossier soumis", user: "Pr. Diallo" },
    {
      date: "2024-01-16",
      action: "Accusé de réception envoyé",
      user: "Système",
    },
  ],
  isArchived: false,
};

const ACCREDITATION_DATA = [
  {
    id: 1,
    dossierNumber: "ACC-2024-001",
    institution: "Université Cheikh Anta Diop",
    program: "Licence Informatique",
    submittedDate: "2024-01-15",
    submittedBy: "Pr. Diallo Mamadou",
    email: "diallo@ucad.edu",
    phone: "+221 77 123 45 67",
    address: "Dakar, Sénégal",
    status: "en_attente",
    type_etablissement: "Publique",
    etablissement: "Université Cheikh Anta Diop",
    domaine: "Sciences et Technologies",
    mention: "Informatique",
    grade: "LICENCE",
    parcours: "Génie Logiciel",
    notes: "Dossier complet, en attente de traitement",
    autoEvaluation: {
      score: 268,
      maxScore: 368,
      pourcentage: 72.8,
      niveau: "satisfaisant",
      criteres: generateMockCriteres(),
      politiques: [
        { name: "FORMATION", score: 68, max: 148, niveau: "faible" },
        { name: "GOUVERNANCE", score: 184, max: 204, niveau: "acceptable" },
        { name: "RECHERCHE", score: 16, max: 16, niveau: "excellent" },
      ],
    },
    history: [
      { date: "2024-01-15", action: "Dossier soumis", user: "Pr. Diallo" },
      {
        date: "2024-01-16",
        action: "Accusé de réception envoyé",
        user: "Système",
      },
    ],
    isArchived: false,
  },
  {
    id: 2,
    dossierNumber: "ACC-2024-002",
    institution: "École Supérieure Polytechnique",
    program: "Master Génie Civil",
    submittedDate: "2024-01-10",
    submittedBy: "Dr. Sow Aminata",
    email: "sow@esp.sn",
    phone: "+221 78 456 78 90",
    address: "Dakar, Sénégal",
    status: "accredite",
    type_etablissement: "Publique",
    etablissement: "École Supérieure Polytechnique",
    domaine: "Ingénierie",
    mention: "Génie Civil",
    grade: "MASTER",
    parcours: "Structures et Matériaux",
    notes: "Accréditation octroyée pour 5 ans",
    autoEvaluation: {
      score: 335,
      maxScore: 368,
      pourcentage: 91.0,
      niveau: "excellent",
      criteres: generateMockCriteres(),
      politiques: [
        { name: "FORMATION", score: 142, max: 148, niveau: "excellent" },
        { name: "GOUVERNANCE", score: 189, max: 204, niveau: "excellent" },
        { name: "RECHERCHE", score: 16, max: 16, niveau: "excellent" },
      ],
    },
    history: [
      { date: "2024-01-10", action: "Dossier soumis", user: "Dr. Sow" },
      {
        date: "2024-01-11",
        action: "Analyse préliminaire",
        user: "Agent DAAQ",
      },
      {
        date: "2024-01-25",
        action: "Accréditation octroyée",
        user: "Commission",
      },
    ],
    isArchived: false,
  },
  {
    id: 3,
    dossierNumber: "ACC-2024-003",
    institution: "Institut Supérieur de Management",
    program: "MBA Finance",
    submittedDate: "2024-01-05",
    submittedBy: "Pr. Fall Ousmane",
    email: "fall@ism.sn",
    phone: "+221 76 987 65 43",
    address: "Dakar, Sénégal",
    status: "ajourne",
    type_etablissement: "Privée",
    institution_privee: "Institut Supérieur de Management",
    domaine: "Gestion",
    mention: "Finance",
    grade: "MASTER",
    parcours: "Finance d'Entreprise",
    notes: "Documents complémentaires requis",
    autoEvaluation: {
      score: 187,
      maxScore: 368,
      pourcentage: 50.8,
      niveau: "faible",
      criteres: generateMockCriteres(),
      politiques: [
        { name: "FORMATION", score: 76, max: 148, niveau: "faible" },
        { name: "GOUVERNANCE", score: 95, max: 204, niveau: "faible" },
        { name: "RECHERCHE", score: 16, max: 16, niveau: "excellent" },
      ],
    },
    history: [
      { date: "2024-01-05", action: "Dossier soumis", user: "Pr. Fall" },
      { date: "2024-01-06", action: "Accusé de réception", user: "Système" },
      {
        date: "2024-01-25",
        action: "Dossier ajourné - documents manquants",
        user: "Commission",
      },
    ],
    isArchived: false,
  },
  {
    id: 4,
    dossierNumber: "ACC-2024-004",
    institution: "Université Gaston Berger",
    program: "Licence Physique",
    submittedDate: "2023-12-20",
    submittedBy: "Dr. Ndiaye Fatou",
    email: "ndiaye@ugb.sn",
    phone: "+221 70 234 56 78",
    address: "Saint-Louis, Sénégal",
    status: "accredite",
    type_etablissement: "Publique",
    etablissement: "Université Gaston Berger",
    domaine: "Sciences Exactes",
    mention: "Physique",
    grade: "LICENCE",
    parcours: "Physique Fondamentale",
    notes: "Accréditation octroyée avec mention",
    autoEvaluation: {
      score: 298,
      maxScore: 368,
      pourcentage: 81.0,
      niveau: "satisfaisant",
      criteres: generateMockCriteres(),
      politiques: [
        { name: "FORMATION", score: 124, max: 148, niveau: "satisfaisant" },
        { name: "GOUVERNANCE", score: 168, max: 204, niveau: "satisfaisant" },
        { name: "RECHERCHE", score: 16, max: 16, niveau: "excellent" },
      ],
    },
    history: [],
    isArchived: false,
  },
  {
    id: 5,
    dossierNumber: "ACC-2024-005",
    institution: "École Supérieure d'Informatique",
    program: "Master Data Science",
    submittedDate: "2023-12-15",
    submittedBy: "Pr. Kane Modou",
    email: "kane@esi.sn",
    phone: "+221 77 890 12 34",
    address: "Dakar, Sénégal",
    status: "rejete",
    type_etablissement: "Privée",
    institution_privee: "École Supérieure d'Informatique",
    domaine: "Informatique",
    mention: "Data Science",
    grade: "MASTER",
    parcours: "Big Data",
    notes: "Dossier rejeté - non-conformité majeure",
    autoEvaluation: {
      score: 98,
      maxScore: 368,
      pourcentage: 26.6,
      niveau: "non-conforme",
      criteres: generateMockCriteres(),
      politiques: [
        { name: "FORMATION", score: 42, max: 148, niveau: "non-conforme" },
        { name: "GOUVERNANCE", score: 44, max: 204, niveau: "non-conforme" },
        { name: "RECHERCHE", score: 12, max: 16, niveau: "faible" },
      ],
    },
    history: [],
    isArchived: false,
  },
];

const getFileIcon = (type) => {
  if (type === "pdf") return <FaFilePdf className="w-4 h-4 text-red-500" />;
  if (type === "jpg" || type === "png" || type === "jpeg" || type === "image")
    return <FaFileImage className="w-4 h-4 text-blue-500" />;
  if (type === "docx" || type === "doc")
    return <FaFileWord className="w-4 h-4 text-blue-700" />;
  return <FaFileAlt className="w-4 h-4 text-gray-500" />;
};

const getLevelFromScore = (score) => {
  if (score < 92) return "non-conforme";
  if (score >= 92 && score <= 183) return "faible";
  if (score >= 184 && score <= 256) return "acceptable";
  if (score >= 257 && score <= 311) return "satisfaisant";
  if (score >= 312 && score <= 368) return "excellent";
  return "excellent";
};

const ScoreGlobalChart = ({ score, maxScore = 368, niveau }) => {
  const thresholds = [0, 92, 184, 257, 312, 368];
  const cursorPosition = (score / maxScore) * 100;

  const getBarWidth = (min, max) => {
    return ((max - min) / maxScore) * 100;
  };

  return (
    <div className="w-full">
      <div className="relative mt-8 mb-12">
        {/* Barre de progression colorée */}
        <div className="h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner flex">
          <div
            className="h-full bg-red-500"
            style={{ width: `${getBarWidth(0, 92)}%` }}
          />
          <div
            className="h-full bg-orange-500"
            style={{ width: `${getBarWidth(92, 184)}%` }}
          />
          <div
            className="h-full bg-yellow-500"
            style={{ width: `${getBarWidth(184, 257)}%` }}
          />
          <div
            className="h-full bg-blue-500"
            style={{ width: `${getBarWidth(257, 312)}%` }}
          />
          <div
            className="h-full bg-green-500"
            style={{ width: `${getBarWidth(312, 368)}%` }}
          />
        </div>

        {/* Marqueurs de seuils */}
        <div className="relative w-full mt-2">
          {thresholds.map((threshold, index) => {
            const position = (threshold / maxScore) * 100;
            return (
              <div
                key={index}
                className="absolute flex flex-col items-center"
                style={{ left: `${position}%`, transform: "translateX(-50%)" }}
              >
                <div className="w-0.5 h-3 bg-gray-400"></div>
                <span className="text-[10px] font-bold mt-1 px-1 py-0.5 bg-white rounded border border-gray-300">
                  {threshold}
                </span>
              </div>
            );
          })}
        </div>

        {/* Curseur de position */}
        <div
          className="absolute top-0 flex flex-col items-center transition-all duration-500"
          style={{ left: `${cursorPosition}%`, transform: "translateX(-50%)" }}
        >
          <div className="relative">
            <div className="w-5 h-5 bg-white border-4 border-gray-800 rounded-full shadow-lg"></div>
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
              {score} pts
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Légendes des niveaux */}
      <div className="grid grid-cols-5 gap-1 mt-6">
        <div className="text-center">
          <div className="w-full h-1 bg-red-500 mb-1"></div>
          <span className="text-[10px] font-medium text-red-700">
            Non conforme
          </span>
          <span className="text-[8px] text-gray-500 block">0-91 pts</span>
        </div>
        <div className="text-center">
          <div className="w-full h-1 bg-orange-500 mb-1"></div>
          <span className="text-[10px] font-medium text-orange-700">
            Faible
          </span>
          <span className="text-[8px] text-gray-500 block">92-183 pts</span>
        </div>
        <div className="text-center">
          <div className="w-full h-1 bg-yellow-500 mb-1"></div>
          <span className="text-[10px] font-medium text-yellow-700">
            Acceptable
          </span>
          <span className="text-[8px] text-gray-500 block">184-256 pts</span>
        </div>
        <div className="text-center">
          <div className="w-full h-1 bg-blue-500 mb-1"></div>
          <span className="text-[10px] font-medium text-blue-700">
            Satisfaisant
          </span>
          <span className="text-[8px] text-gray-500 block">257-311 pts</span>
        </div>
        <div className="text-center">
          <div className="w-full h-1 bg-green-500 mb-1"></div>
          <span className="text-[10px] font-medium text-green-700">
            Excellent
          </span>
          <span className="text-[8px] text-gray-500 block">312-368 pts</span>
        </div>
      </div>
    </div>
  );
};

const CriteresSection = ({ title, subsections, criteresData }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>

      {subsections.map((subsection) => {
        const isExpanded = expandedSections[subsection.id] !== false;

        return (
          <div
            key={subsection.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleSection(subsection.id)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <h4 className="font-semibold text-gray-800 text-sm">
                {subsection.title}
              </h4>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600">
                  {subsection.criteres.length} critères
                </span>
                {isExpanded ? (
                  <FaChevronUp size={14} />
                ) : (
                  <FaChevronDown size={14} />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="p-4 space-y-4">
                {subsection.criteres.map((critere) => {
                  const data = criteresData[critere.id] || {
                    note: "0",
                    appreciation: "",
                    fichiers: [],
                  };
                  const appreciation = appreciationOptions.find(
                    (opt) => opt.value === data.appreciation,
                  );

                  return (
                    <div
                      key={critere.id}
                      className="border border-gray-200 rounded-lg p-4 bg-white"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                          {critere.numero}
                        </span>
                        <span className="text-sm font-medium text-gray-900 flex-1">
                          {critere.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Appréciation
                          </p>
                          <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm">
                            {appreciation?.label || "Non évalué"}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Note</p>
                          <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium">
                            {data.note}/4
                          </div>
                        </div>
                      </div>

                      {/* Preuves jointes */}
                      {data.fichiers && data.fichiers.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <FaUpload size={10} />
                            Preuves jointes ({data.fichiers.length})
                          </p>
                          <div className="space-y-2">
                            {data.fichiers.map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center justify-between p-2 bg-blue-50 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  {getFileIcon(file.type)}
                                  <div>
                                    <p className="text-xs font-medium">
                                      {file.name}
                                    </p>
                                    <p className="text-[10px] text-gray-500">
                                      {file.size} • {file.date}
                                    </p>
                                  </div>
                                </div>
                                <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                  <FaDownload size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const AccreditationView = () => {
  // États
  const [accreditations, setAccreditations] = useState(ACCREDITATION_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  // États pour les modals
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [noteError, setNoteError] = useState("");

  // États pour la navigation
  const [viewMode, setViewMode] = useState("list");
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Configuration des toasts
  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  // Filtrer les données
  const filteredAccreditations = accreditations.filter((acc) => {
    const matchesSearch = searchQuery
      ? acc.dossierNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.status.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const submittedDate = new Date(
      acc.submittedDate.split("-").reverse().join("-"),
    );
    const startDate = startDateFilter ? new Date(startDateFilter) : null;
    const endDate = endDateFilter ? new Date(endDateFilter) : null;

    const matchesDateRange =
      (!startDate || submittedDate >= startDate) &&
      (!endDate || submittedDate <= endDate);

    const matchesStatus = statusFilter ? acc.status === statusFilter : true;

    const isArchived = acc.isArchived || false;

    return matchesSearch && matchesDateRange && matchesStatus && !isArchived;
  });

  // Trier les données
  const sortedAccreditations = [...filteredAccreditations].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "id") comparison = a.id - b.id;
    else if (sortBy === "date") {
      const dateA = new Date(a.submittedDate.split("-").reverse().join("-"));
      const dateB = new Date(b.submittedDate.split("-").reverse().join("-"));
      comparison = dateA - dateB;
    } else if (sortBy === "dossier")
      comparison = a.dossierNumber.localeCompare(b.dossierNumber);
    else if (sortBy === "institution")
      comparison = a.institution.localeCompare(b.institution);
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedAccreditations.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAccreditations = sortedAccreditations.slice(
    startIndex,
    startIndex + pageSize,
  );

  // Fonctions utilitaires
  const getStatusInfo = (status) =>
    statusOptions.find((opt) => opt.id === status) || statusOptions[0];
  const getLevelInfo = (level) =>
    levelConfig[level] || levelConfig["acceptable"];

  const resetAllFilters = () => {
    setSearchQuery("");
    setStartDateFilter("");
    setEndDateFilter("");
    setStatusFilter("");
    setCurrentPage(1);
    toast.info("Filtres réinitialisés", toastConfig);
  };

  const handleSortClick = (key) => {
    if (sortBy === key)
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ isSorted, isAsc }) => {
    if (!isSorted) return <FaSort className="w-3 h-3 text-gray-400" />;
    return (
      <FaSort
        className={`w-3 h-3 transition-transform ${isAsc ? "rotate-180" : ""}`}
      />
    );
  };

  // Fonctions pour les modals
  const openStatusModal = (dossier) => {
    setSelectedDossier(dossier);
    setNewStatus(dossier.status);
    setStatusNote("");
    setNoteError("");
    setShowStatusModal(true);
  };

  const openArchiveModal = (dossier) => {
    if (dossier.status === "en_attente") {
      toast.error("Impossible d'archiver un dossier en attente", toastConfig);
      return;
    }
    setSelectedDossier(dossier);
    setShowArchiveModal(true);
  };

  const closeModals = () => {
    setShowStatusModal(false);
    setShowArchiveModal(false);
    setSelectedDossier(null);
    setNewStatus("");
    setStatusNote("");
    setNoteError("");
  };

  const confirmArchive = () => {
    if (selectedDossier) {
      setAccreditations((prev) =>
        prev.map((acc) =>
          acc.id === selectedDossier.id ? { ...acc, isArchived: true } : acc,
        ),
      );

      if (selectedDetail && selectedDetail.id === selectedDossier.id) {
        setSelectedDetail({
          ...selectedDetail,
          isArchived: true,
          history: [
            ...selectedDetail.history,
            {
              date: new Date().toISOString().split("T")[0],
              action: "Dossier archivé",
              user: "Administrateur",
            },
          ],
        });
      }

      toast.success("Dossier archivé avec succès", toastConfig);
      closeModals();
    }
  };

  const confirmStatusChange = () => {
    if (!newStatus) {
      setNoteError("Sélectionnez un statut");
      return;
    }
    if (
      (newStatus === "ajourne" || newStatus === "rejete") &&
      !statusNote.trim()
    ) {
      setNoteError("Une note explicative est obligatoire");
      return;
    }

    if (selectedDossier) {
      const actionLabel =
        newStatus === "accredite"
          ? "Accrédité"
          : newStatus === "ajourne"
            ? "Ajourné"
            : newStatus === "rejete"
              ? "Rejeté"
              : "En attente";

      const noteText = statusNote ? ` - ${statusNote}` : "";

      setAccreditations((prev) =>
        prev.map((acc) =>
          acc.id === selectedDossier.id
            ? {
                ...acc,
                status: newStatus,
                notes: `Dossier ${actionLabel}${noteText}`,
                history: [
                  ...acc.history,
                  {
                    date: new Date().toISOString().split("T")[0],
                    action: `Statut modifié : ${actionLabel}`,
                    user: "Administrateur",
                  },
                ],
              }
            : acc,
        ),
      );

      if (selectedDetail && selectedDetail.id === selectedDossier.id) {
        setSelectedDetail({
          ...selectedDetail,
          status: newStatus,
          notes: `Dossier ${actionLabel}${noteText}`,
          history: [
            ...selectedDetail.history,
            {
              date: new Date().toISOString().split("T")[0],
              action: `Statut modifié : ${actionLabel}`,
              user: "Administrateur",
            },
          ],
        });
      }

      toast.success(`Statut mis à jour : ${actionLabel}`, toastConfig);
      closeModals();
    }
  };

  // Navigation
  const openDetailView = (dossier) => {
    setSelectedDetail(dossier);
    setViewMode("detail");
  };

  const backToList = () => {
    setViewMode("list");
    setSelectedDetail(null);
  };

  // Vue détail complète
  if (viewMode === "detail" && selectedDetail) {
    const ae = selectedDetail.autoEvaluation;
    const niveauInfo = getLevelInfo(ae.niveau);
    const NiveauIcon = niveauInfo.icon;
    const statusInfo = getStatusInfo(selectedDetail.status);
    const StatusIcon = statusInfo.icon;

    return (
      <div className="min-h-screen bg-white p-4 md:p-6">
        <ToastContainer />

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={backToList}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <FaArrowLeft size={14} /> Retour à la liste
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Détails du dossier
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-mono bg-gray-100 px-3 py-1 rounded text-sm">
                  {selectedDetail.dossierNumber}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${statusInfo.color}`}
                >
                  <StatusIcon size={12} /> {statusInfo.label}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-3 md:mt-0">
              <button
                onClick={() => openStatusModal(selectedDetail)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
              >
                <FaEdit size={14} /> Modifier le statut
              </button>
              <button
                onClick={() => openArchiveModal(selectedDetail)}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm disabled:opacity-50"
                disabled={selectedDetail.status === "en_attente"}
              >
                <FaArchive size={14} /> Archiver
              </button>
            </div>
          </div>
        </div>

        {/* Grille principale - Fond blanc */}
        <div className="space-y-6">
          {/* Informations Remplies */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Informations Remplies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center pb-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600 w-40">
                    Numéro de demande:
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {selectedDetail.dossierNumber}
                  </span>
                </div>
                <div className="flex items-center pb-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600 w-40">
                    Nom du responsable:
                  </span>
                  <span className="text-sm">{selectedDetail.submittedBy}</span>
                </div>
                <div className="flex items-center pb-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600 w-40">
                    Type d'établissement:
                  </span>
                  <span className="text-sm">
                    {selectedDetail.type_etablissement}
                  </span>
                </div>
                {selectedDetail.type_etablissement === "Privée" ? (
                  <div className="flex items-center pb-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600 w-40">
                      Institution:
                    </span>
                    <span className="text-sm">
                      {selectedDetail.institution_privee ||
                        selectedDetail.institution}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center pb-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600 w-40">
                      Établissement:
                    </span>
                    <span className="text-sm">
                      {selectedDetail.etablissement}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center pb-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600 w-40">
                    Domaine:
                  </span>
                  <span className="text-sm">{selectedDetail.domaine}</span>
                </div>
                <div className="flex items-center pb-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600 w-40">
                    Mention:
                  </span>
                  <span className="text-sm">{selectedDetail.mention}</span>
                </div>
                <div className="flex items-center pb-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600 w-40">
                    Grade:
                  </span>
                  <span className="text-sm">{selectedDetail.grade}</span>
                </div>
                <div className="flex items-center pb-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600 w-40">
                    Parcours:
                  </span>
                  <span className="text-sm">{selectedDetail.parcours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Résultat de l'Auto-évaluation */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Résultat de l'Auto-évaluation
            </h2>

            {/* Score global et niveau */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FaAward className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Score global</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {ae.score}
                    </span>
                    <span className="text-base text-gray-400">
                      / {ae.maxScore}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${niveauInfo.badge} mt-3 md:mt-0`}
              >
                <NiveauIcon size={16} />
                <span>{niveauInfo.label}</span>
              </div>
            </div>

            {/* Graphique linéaire */}
            <ScoreGlobalChart
              score={ae.score}
              maxScore={ae.maxScore}
              niveau={ae.niveau}
            />

            {/* Appréciation globale */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaInfoCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">
                    Appréciation globale
                  </p>
                  <p className="text-sm text-blue-700 italic">
                    "{niveauInfo.appreciation}"
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-right">
              Évaluation du 5 février 2024
            </p>

            {/* Évaluation des Politiques */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaChartLine className="text-blue-600" /> Évaluation des
                Politiques
              </h3>

              <div className="space-y-4">
                {/* Politique de Formation */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-800">
                      POLITIQUE DE FORMATION
                    </h4>
                    <span className="text-sm font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
                      {ae.politiques[0].score} pts
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-2">
                    <div
                      className="h-full bg-orange-500"
                      style={{
                        width: `${(ae.politiques[0].score / ae.politiques[0].max) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      Score: {ae.politiques[0].score}/{ae.politiques[0].max}
                    </span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      Faible
                    </span>
                  </div>
                </div>

                {/* Politique de Gouvernance */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-800">
                      POLITIQUE DE GOUVERNANCE
                    </h4>
                    <span className="text-sm font-bold text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full">
                      {ae.politiques[1].score} pts
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-2">
                    <div
                      className="h-full bg-yellow-500"
                      style={{
                        width: `${(ae.politiques[1].score / ae.politiques[1].max) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      Score: {ae.politiques[1].score}/{ae.politiques[1].max}
                    </span>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      Acceptable
                    </span>
                  </div>
                </div>

                {/* Politique de Recherche */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-800">
                      POLITIQUE DE RECHERCHE
                    </h4>
                    <span className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                      {ae.politiques[2].score} pts
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-2">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${(ae.politiques[2].score / ae.politiques[2].max) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      Score: {ae.politiques[2].score}/{ae.politiques[2].max}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Excellent
                    </span>
                  </div>
                </div>

                {/* TOTAL GÉNÉRAL */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-blue-800">
                      TOTAL GÉNÉRAL
                    </span>
                    <span className="text-xl font-bold text-blue-700">
                      {ae.score} / {ae.maxScore} pts
                    </span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${(ae.score / ae.maxScore) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      Niveau {niveauInfo.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Détail des 92 critères avec leurs preuves */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaFileAlt className="text-blue-600" /> Détail des 92 critères
              d'évaluation
            </h2>

            <div className="space-y-6">
              {sectionsEvaluation.map((section, idx) => (
                <CriteresSection
                  key={idx}
                  title={section.title}
                  subsections={section.subsections}
                  criteresData={ae.criteres}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Modals dans la vue détail */}
        {showStatusModal && selectedDossier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Modifier le statut</h3>
              <p className="text-sm text-gray-600 mb-3">
                Dossier:{" "}
                <span className="font-semibold">
                  {selectedDossier.dossierNumber}
                </span>
              </p>

              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg mb-4"
              >
                <option value="">Sélectionner un statut</option>
                {statusOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {(newStatus === "ajourne" || newStatus === "rejete") && (
                <div className="mb-4">
                  <textarea
                    className={`w-full px-3 py-2 border ${noteError ? "border-red-500" : "border-gray-300"} rounded-lg`}
                    rows="3"
                    placeholder={
                      newStatus === "rejete"
                        ? "Motif du rejet..."
                        : "Informations complémentaires requises..."
                    }
                    value={statusNote}
                    onChange={(e) => {
                      setStatusNote(e.target.value);
                      setNoteError("");
                    }}
                  />
                  {noteError && (
                    <p className="text-xs text-red-600 mt-1">{noteError}</p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmStatusChange}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}

        {showArchiveModal && selectedDossier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">
                Archiver le dossier
              </h3>
              <p className="text-sm mb-4">
                Voulez-vous archiver le dossier{" "}
                <span className="font-semibold">
                  {selectedDossier.dossierNumber}
                </span>{" "}
                ?
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Cette action déplacera le dossier vers les archives.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmArchive}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Archiver
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Vue liste
  return (
    <div className="min-h-screen bg-white p-2 md:p-4 lg:p-6">
      <ToastContainer />

      {/* En-tête principal */}
      <header className="mb-4 md:mb-6">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-1 md:mb-2">
          Liste des demandes d'accréditation
        </h1>
        <p className="text-gray-600 text-xs md:text-sm">
          Gestion des dossiers d'accréditation des établissements
        </p>
      </header>

      {/* Filtres */}
      <div className="mb-4 md:mb-6 bg-white p-3 md:p-4 rounded-lg shadow border border-gray-200">
        {/* Barre de recherche */}
        <div className="mb-3 md:mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Recherche globale
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
              placeholder="Rechercher par numéro, institution, programme..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <div className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2">
              <FaSearch className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
          {/* Filtre par date - Début */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Date début
            </label>
            <input
              type="date"
              className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
              value={startDateFilter}
              onChange={(e) => {
                setStartDateFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Filtre par date - Fin */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Date fin
            </label>
            <input
              type="date"
              className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
              value={endDateFilter}
              onChange={(e) => {
                setEndDateFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Filtre par statut */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Tous les statuts</option>
              {statusOptions.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tableau avec pagination */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {/* Header table avec sélecteur de lignes */}
        <div className="px-2 md:px-4 py-2 md:py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800 text-sm md:text-base">
              Liste des dossiers ({filteredAccreditations.length})
            </h3>
          </div>

          {/* Sélecteur de lignes */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Lignes :</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 bg-gray-50"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-100 text-xs">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-2 md:px-4 py-2 text-left font-bold text-gray-500 uppercase">
                  <button
                    onClick={() => handleSortClick("id")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    ID{" "}
                    <SortIcon
                      isSorted={sortBy === "id"}
                      isAsc={sortDirection === "asc"}
                    />
                  </button>
                </th>
                <th className="px-2 md:px-4 py-2 text-left font-bold text-gray-500 uppercase">
                  <button
                    onClick={() => handleSortClick("dossier")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    N° DOSSIER{" "}
                    <SortIcon
                      isSorted={sortBy === "dossier"}
                      isAsc={sortDirection === "asc"}
                    />
                  </button>
                </th>
                <th className="px-2 md:px-4 py-2 text-left font-bold text-gray-500 uppercase">
                  <button
                    onClick={() => handleSortClick("institution")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    INSTITUTION{" "}
                    <SortIcon
                      isSorted={sortBy === "institution"}
                      isAsc={sortDirection === "asc"}
                    />
                  </button>
                </th>
                <th className="px-2 md:px-4 py-2 text-left font-bold text-gray-500 uppercase hidden md:table-cell">
                  PROGRAMME
                </th>
                <th className="px-2 md:px-4 py-2 text-left font-bold text-gray-500 uppercase hidden md:table-cell">
                  <button
                    onClick={() => handleSortClick("date")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    DATE{" "}
                    <SortIcon
                      isSorted={sortBy === "date"}
                      isAsc={sortDirection === "asc"}
                    />
                  </button>
                </th>
                <th className="px-2 md:px-4 py-2 text-left font-bold text-gray-500 uppercase">
                  STATUT
                </th>
                <th className="px-2 md:px-4 py-2 text-left font-bold text-gray-500 uppercase">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedAccreditations.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <FaSearch className="w-8 h-8 text-gray-300 mb-2" />
                      <p>Aucun dossier trouvé</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedAccreditations.map((acc) => {
                  const statusInfo = getStatusInfo(acc.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr
                      key={acc.id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-2 md:px-4 py-2 whitespace-nowrap">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {acc.id}
                        </span>
                      </td>
                      <td className="px-2 md:px-4 py-2 whitespace-nowrap">
                        <span className="font-mono text-xs">
                          {acc.dossierNumber}
                        </span>
                      </td>
                      <td className="px-2 md:px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FaUniversity className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-xs truncate max-w-[150px]">
                            {acc.institution}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 md:px-4 py-2 whitespace-nowrap hidden md:table-cell">
                        <span className="text-xs">{acc.program}</span>
                      </td>
                      <td className="px-2 md:px-4 py-2 whitespace-nowrap hidden md:table-cell">
                        <span className="text-xs">
                          {new Date(acc.submittedDate).toLocaleDateString(
                            "fr-FR",
                          )}
                        </span>
                      </td>
                      <td className="px-2 md:px-4 py-2 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${statusInfo.color}`}
                        >
                          <StatusIcon size={10} />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-2 md:px-4 py-2 whitespace-nowrap">
                        <div className="flex gap-1">
                          <button
                            onClick={() => openDetailView(acc)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Voir le dossier"
                          >
                            <FaEye size={14} />
                          </button>
                          <button
                            onClick={() => openStatusModal(acc)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Modifier le statut"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => openArchiveModal(acc)}
                            className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-30"
                            title="Archiver"
                            disabled={acc.status === "en_attente"}
                          >
                            <FaArchive size={14} />
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
        <div className="px-2 md:px-4 py-2 md:py-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs text-gray-600">
            {sortedAccreditations.length > 0 ? (
              <>
                Affichage de {startIndex + 1} à{" "}
                {Math.min(startIndex + pageSize, sortedAccreditations.length)}{" "}
                sur {sortedAccreditations.length}
              </>
            ) : (
              <>Aucun résultat</>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 border rounded disabled:opacity-30 hover:bg-gray-50"
            >
              <FaAngleLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-2 py-1 text-xs border rounded ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 border rounded disabled:opacity-30 hover:bg-gray-50"
            >
              <FaAngleRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals dans la vue liste */}
      {showStatusModal && selectedDossier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Modifier le statut</h3>
            <p className="text-sm text-gray-600 mb-3">
              Dossier:{" "}
              <span className="font-semibold">
                {selectedDossier.dossierNumber}
              </span>
            </p>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
            >
              <option value="">Sélectionner un statut</option>
              {statusOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>

            {(newStatus === "ajourne" || newStatus === "rejete") && (
              <div className="mb-4">
                <textarea
                  className={`w-full px-3 py-2 border ${noteError ? "border-red-500" : "border-gray-300"} rounded-lg`}
                  rows="3"
                  placeholder={
                    newStatus === "rejete"
                      ? "Motif du rejet..."
                      : "Informations complémentaires requises..."
                  }
                  value={statusNote}
                  onChange={(e) => {
                    setStatusNote(e.target.value);
                    setNoteError("");
                  }}
                />
                {noteError && (
                  <p className="text-xs text-red-600 mt-1">{noteError}</p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModals}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {showArchiveModal && selectedDossier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Archiver le dossier</h3>
            <p className="text-sm mb-4">
              Voulez-vous archiver le dossier{" "}
              <span className="font-semibold">
                {selectedDossier.dossierNumber}
              </span>{" "}
              ?
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Cette action déplacera le dossier vers les archives.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModals}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmArchive}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Archiver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccreditationView;
