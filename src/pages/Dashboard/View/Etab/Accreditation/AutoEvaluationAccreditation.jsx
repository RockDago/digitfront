import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  createOrUpdateAutoEvaluation,
  getMyAutoEvaluations,
  getAutoEvaluation,
  uploadCritereFichiers,
  deleteCritereFichier,
  formatAutoEvaluationData,
} from "../../../../../services/accreditation.services";

// ─────────────────────────────────────────────────────────────────────────────
// DONNÉES
// ─────────────────────────────────────────────────────────────────────────────
const sectionsEvaluation = [
  {
    title: "LA POLITIQUE DE FORMATION",
    subsections: [
      {
        id: "section_1_1",
        title: "1.1. LE PILOTAGE DE L\'OFFRE DE FORMATION",
        description:
          "L\'institution tient compte des besoins du développement local, régional et national dans la définition des objectifs et des contenus de ses offres de formation.",
        criteres: [
          {
            id: "critere_01",
            numero: 1,
            label:
              "Rôle du partenariat avec les milieux économiques et les autorités dans l\'élaboration de l\'offre",
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
              "Part des charges d\'enseignement confiées aux professionnels",
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
        description:
          "L\'institution met en œuvre un dispositif d\'accueil des étudiants.",
        criteres: [
          {
            id: "critere_06",
            numero: 6,
            label: "Publication des conditions et procédures d\'admission",
          },
          {
            id: "critere_07",
            numero: 7,
            label:
              "Publication de guides présentant les objectifs, les parcours et les programmes de formation",
          },
          {
            id: "critere_08",
            numero: 8,
            label: "Service d\'information et d\'orientation",
          },
          {
            id: "critere_09",
            numero: 9,
            label:
              "Dispositifs d\'accueil des étudiants à tous les niveaux (LMD)",
          },
          {
            id: "critere_10",
            numero: 10,
            label:
              "Qualification des responsables de l\'institution et de la formation",
          },
          {
            id: "critere_11",
            numero: 11,
            label:
              "Composition, qualification et organisation des équipes de formation",
          },
          {
            id: "critere_12",
            numero: 12,
            label:
              "Composition, qualification et organisation des équipes pédagogiques",
          },
          {
            id: "critere_13",
            numero: 13,
            label: "Organisation de la formation",
          },
          { id: "critere_14", numero: 14, label: "Organisation des stages" },
          {
            id: "critere_15",
            numero: 15,
            label: "Organisation des voyages d\'études",
          },
          {
            id: "critere_16",
            numero: 16,
            label:
              "Mise en place d\'un dispositif d\'accompagnement de l\'étudiant en Licence, Master et Doctorat",
          },
          {
            id: "critere_17",
            numero: 17,
            label:
              "Diagnostic et résolution des difficultés rencontrées par l\'étudiant",
          },
          { id: "critere_18", numero: 18, label: "Taux de réussite" },
          { id: "critere_19", numero: 19, label: "Durée moyenne des études" },
          { id: "critere_20", numero: 20, label: "Taux des diplômés" },
          { id: "critere_21", numero: 21, label: "Insertion professionnelle" },
          {
            id: "critere_22",
            numero: 22,
            label: "Ressources documentaires adaptées",
          },
          {
            id: "critere_23",
            numero: 23,
            label: "Accès aux ressources documentaires",
          },
          {
            id: "critere_24",
            numero: 24,
            label:
              "Charte du contrôle des connaissances et des compétences des étudiants",
          },
          {
            id: "critere_25",
            numero: 25,
            label:
              "Qualité de l\'évaluation des étudiants et des diplômes délivrés",
          },
          {
            id: "critere_26",
            numero: 26,
            label: "Règles de compensation et de passage en année supérieure",
          },
          { id: "critere_27", numero: 27, label: "Jurys d\'examen" },
        ],
      },
      {
        id: "section_1_3",
        title: "1.3. LA DEMARCHE QUALITE PEDAGOGIQUE",
        description:
          "L\'institution met en œuvre un dispositif lui permettant de gérer l\'assurance qualité de la formation.",
        criteres: [
          {
            id: "critere_28",
            numero: 28,
            label: "Structure d\'assurance qualité pédagogique",
          },
          {
            id: "critere_29",
            numero: 29,
            label:
              "Connaissance et prise en compte des caractéristiques des étudiants",
          },
          {
            id: "critere_30",
            numero: 30,
            label: "Adéquation du corps enseignant",
          },
          {
            id: "critere_31",
            numero: 31,
            label: "Adéquation des modalités de transmission des savoirs",
          },
          {
            id: "critere_32",
            numero: 32,
            label: "Évaluation des enseignements et des formations",
          },
          {
            id: "critere_33",
            numero: 33,
            label:
              "Degré de satisfaction des étudiants par rapport à l\'offre de formation",
          },
          {
            id: "critere_34",
            numero: 34,
            label:
              "Communication sur les règlements divers, charte des examens, charte des stages, charte des thèses",
          },
          {
            id: "critere_35",
            numero: 35,
            label:
              "Enquête d\'insertion professionnelle et adaptation de la formation",
          },
          {
            id: "critere_36",
            numero: 36,
            label: "Contrats d\'engagement et cahiers des charges",
          },
          {
            id: "critere_37",
            numero: 37,
            label:
              "Équilibre entre les activités pédagogiques, scientifiques et administratives",
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
          "L\'institution met en œuvre un dispositif administratif dont les structures organisationnelles et leurs fonctions respectives sont bien définies.",
        criteres: [
          {
            id: "critere_38",
            numero: 38,
            label: "Structures organisationnelles bien définies",
          },
          {
            id: "critere_39",
            numero: 39,
            label: "Organisation et fonctions des structures",
          },
          {
            id: "critere_40",
            numero: 40,
            label: "Les axes stratégiques justifiés",
          },
          { id: "critere_41", numero: 41, label: "Le suivi d\'exécution" },
          {
            id: "critere_42",
            numero: 42,
            label: "Organisation et fonctionnement de l\'institution",
          },
          {
            id: "critere_43",
            numero: 43,
            label:
              "Capacité de pilotage et de mise en œuvre des objectifs stratégiques de l\'institution",
          },
        ],
      },
      {
        id: "section_2_2",
        title: "2.2. SYSTÈME D\'INFORMATION ET DE COMMUNICATION",
        description:
          "L\'institution développe une stratégie pour optimiser les performances de ses systèmes d\'information et l\'appropriation des TIC.",
        criteres: [
          {
            id: "critere_44",
            numero: 44,
            label:
              "L\'existence d\'une politique d\'information et de communication",
          },
          {
            id: "critere_45",
            numero: 45,
            label:
              "L\'existence d\'une structure de gestion de la politique d\'information et de communication",
          },
          {
            id: "critere_46",
            numero: 46,
            label:
              "Champ d\'utilisation de l\'environnement numérique de travail",
          },
          {
            id: "critere_47",
            numero: 47,
            label:
              "Démarche qualité dans l\'utilisation des applications informatiques",
          },
          {
            id: "critere_48",
            numero: 48,
            label:
              "Maintenance des systèmes d\'information et de communication",
          },
        ],
      },
      {
        id: "section_2_3",
        title: "2.3. GESTION DES RESSOURCES DOCUMENTAIRES",
        description:
          "L\'institution dispose de structures permettant aux étudiants d\'avoir accès aux documents.",
        criteres: [
          {
            id: "critere_49",
            numero: 49,
            label:
              "Locaux et équipements destinés aux services de documentation",
          },
          {
            id: "critere_50",
            numero: 50,
            label: "Quantité suffisante des fonds documentaires",
          },
          {
            id: "critere_51",
            numero: 51,
            label: "Personnel administratif destiné à la documentation",
          },
        ],
      },
      {
        id: "section_2_4",
        title: "2.4. GESTION DES RESSOURCES HUMAINES",
        description:
          "L\'institution a une politique en matière d\'emploi en phase avec des objectifs stratégiques.",
        criteres: [
          {
            id: "critere_52",
            numero: 52,
            label:
              "Les axes stratégiques de la gestion prévisionnelle des emplois et des compétences",
          },
          {
            id: "critere_53",
            numero: 53,
            label: "La politique en matière d\'emplois contractuels",
          },
          {
            id: "critere_54",
            numero: 54,
            label: "Procédure de recrutement réglementée",
          },
          {
            id: "critere_55",
            numero: 55,
            label: "Modalité de répartition des ressources humaines",
          },
          {
            id: "critere_56",
            numero: 56,
            label:
              "Modalité de répartition des charges d\'enseignement, des obligations de recherche et des tâches administratives",
          },
          {
            id: "critere_57",
            numero: 57,
            label:
              "Taux d\'encadrement en enseignants, encadreurs et mesures prises",
          },
          {
            id: "critere_58",
            numero: 58,
            label:
              "Actions de promotion du personnel enseignant, administratif et technique",
          },
          {
            id: "critere_59",
            numero: 59,
            label: "Politique menée en termes de vie associative et sociale",
          },
        ],
      },
      {
        id: "section_2_5",
        title: "2.5. GESTION DES RESSOURCES FINANCIÈRES",
        description: "L\'institution a une politique budgétaire et financière.",
        criteres: [
          {
            id: "critere_60",
            numero: 60,
            label: "Cadrage général institutionnalisé",
          },
          {
            id: "critere_61",
            numero: 61,
            label: "Pertinence des choix stratégiques",
          },
          { id: "critere_62", numero: 62, label: "Les structures de gestion" },
          {
            id: "critere_63",
            numero: 63,
            label: "Qualité de la construction budgétaire",
          },
          {
            id: "critere_64",
            numero: 64,
            label: "Politique d\'investissement",
          },
          {
            id: "critere_65",
            numero: 65,
            label: "Évaluation de la qualité de l\'exécution budgétaire",
          },
          { id: "critere_66", numero: 66, label: "Contrôle de gestion" },
        ],
      },
      {
        id: "section_2_6",
        title: "2.6. POLITIQUE IMMOBILIÈRE ET LOGISTIQUE",
        description:
          "Les infrastructures et les équipements de l\'institution sont adaptés à ses besoins et à ses objectifs.",
        criteres: [
          {
            id: "critere_67",
            numero: 67,
            label: "Adéquation des locaux de l\'institution",
          },
          {
            id: "critere_68",
            numero: 68,
            label: "Adéquation des équipements aux activités de l\'institution",
          },
          { id: "critere_69", numero: 69, label: "Service de logistique" },
          { id: "critere_70", numero: 70, label: "Politique de maintenance" },
        ],
      },
      {
        id: "section_2_7",
        title: "2.7. MANAGEMENT DE LA QUALITÉ",
        description:
          "L\'institution a mis en place une structure de management de la qualité.",
        criteres: [
          { id: "critere_71", numero: 71, label: "Service de la qualité" },
          {
            id: "critere_72",
            numero: 72,
            label: "Champ de la démarche qualité",
          },
          { id: "critere_73", numero: 73, label: "Outils de l\'évaluation" },
        ],
      },
      {
        id: "section_2_8",
        title: "2.8. HYGIÈNE, SÉCURITÉ ET ENVIRONNEMENT",
        description:
          "L\'institution a une politique dédiée à l\'hygiène et à la sécurité.",
        criteres: [
          {
            id: "critere_74",
            numero: 74,
            label: "Service d\'hygiène et de sécurité",
          },
          {
            id: "critere_75",
            numero: 75,
            label: "Règlements d\'hygiène et de sécurité",
          },
          { id: "critere_76", numero: 76, label: "Sensibilisation écologique" },
          {
            id: "critere_77",
            numero: 77,
            label: "Méthode et moyen de diffusion des recommandations",
          },
        ],
      },
      {
        id: "section_2_9",
        title: "2.9. GESTION DE LA VIE ÉTUDIANTE",
        description:
          "La politique de l\'établissement contribue à garantir la qualité de vie des étudiants.",
        criteres: [
          {
            id: "critere_78",
            numero: 78,
            label: "Structure de gestion de la vie étudiante",
          },
          { id: "critere_79", numero: 79, label: "Services aux étudiants" },
          {
            id: "critere_80",
            numero: 80,
            label: "Aménagement de lieux de vie",
          },
          { id: "critere_81", numero: 81, label: "Vie culturelle" },
          { id: "critere_82", numero: 82, label: "Vie sportive" },
          { id: "critere_83", numero: 83, label: "Vie associative" },
          { id: "critere_84", numero: 84, label: "Médecine préventive" },
          {
            id: "critere_85",
            numero: 85,
            label:
              "Prise en charge des étudiants en cas d\'accident ou de maladie au cours de la formation",
          },
        ],
      },
      {
        id: "section_2_10",
        title: "2.10. LA GESTION DES PARTENARIATS",
        description:
          "L\'institution a une politique de coopération avec les autres institutions d\'enseignement supérieur.",
        criteres: [
          {
            id: "critere_86",
            numero: 86,
            label: "Structure de gestion des partenariats",
          },
          { id: "critere_87", numero: 87, label: "Conventions de partenariat" },
          {
            id: "critere_88",
            numero: 88,
            label:
              "Mutualisation des activités de formation, de recherche et de vie étudiante",
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
        title: "3.1. LA STRATÉGIE DE RECHERCHE DE L\'INSTITUTION",
        description:
          "L\'institution est en mesure d\'élaborer une stratégie de recherche, de l\'expliquer, de la justifier et de la faire évoluer.",
        criteres: [
          {
            id: "critere_89",
            numero: 89,
            label: "Les structures et les dispositifs en matière de recherche",
          },
          {
            id: "critere_90",
            numero: 90,
            label: "Les documents stratégiques en matière de recherche",
          },
        ],
      },
      {
        id: "section_3_2",
        title: "3.2. L\'ENSEIGNEMENT ET LA RECHERCHE",
        description:
          "La majorité des enseignants devront s\'impliquer dans la recherche et pouvoir justifier de publications récentes dans des périodiques reconnus.",
        criteres: [
          {
            id: "critere_91",
            numero: 91,
            label: "Communications et publications des enseignants",
          },
          {
            id: "critere_92",
            numero: 92,
            label:
              "Intégration des résultats de la recherche en cours dans les enseignements",
          },
        ],
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
  { value: "pleinement_atteint", label: "Pleinement atteint" },
];
const noteOptions = [
  { value: "0", label: "0 - Absent / Non conforme" },
  { value: "1", label: "1 - Faible / En cours d\'élaboration" },
  { value: "2", label: "2 - Acceptable / En développement" },
  { value: "3", label: "3 - Satisfaisant / Conformité maîtrisée" },
  { value: "4", label: "4 - Excellent / Bonne pratique institutionnalisée" },
];
const appreciationToNoteMap = {
  aucune_preuve: "0",
  partiellement_pris_en_compte: "1",
  applique_irregulierement: "2",
  bien_respecte: "3",
  pleinement_atteint: "4",
};
const noteToAppreciationMap = {
  0: "aucune_preuve",
  1: "partiellement_pris_en_compte",
  2: "applique_irregulierement",
  3: "bien_respecte",
  4: "pleinement_atteint",
};
const STORAGE_KEY = "auto_evaluation_progression";
const EXPANDED_SECTIONS_KEY = "expanded_sections";
const AUTO_EVAL_RESULT_KEY = "auto_evaluation_result";
const MAX_POINTS = 368;

// ─── MODAL UPLOAD ─────────────────────────────────────────────────────────────
const UploadLoadingModal = ({ isVisible, fileName, fileCount, totalCount }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 flex flex-col items-center gap-5 animate-fadeInScale">
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
            <svg
              className="absolute w-20 h-20 animate-spin"
              viewBox="0 0 80 80"
              fill="none"
            >
              <circle cx="40" cy="40" r="36" stroke="#DBEAFE" strokeWidth="6" />
              <path
                d="M40 4 A36 36 0 0 1 76 40"
                stroke="#2563EB"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
            <svg
              className="w-8 h-8 text-blue-600 z-10"
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
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Importation en cours...
          </h3>
          {totalCount > 1 ? (
            <p className="text-sm text-gray-500">
              Fichier {fileCount} sur {totalCount}
            </p>
          ) : (
            <p className="text-sm text-gray-500 truncate max-w-[220px]">
              {fileName || "Chargement du fichier..."}
            </p>
          )}
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div className="h-2 bg-blue-600 rounded-full animate-indeterminate-bar" />
        </div>
        <p className="text-xs text-gray-400 text-center">
          Veuillez ne pas fermer cette page pendant l\'importation.
        </p>
      </div>
    </div>
  );
};

// ─── FILE UPLOAD ──────────────────────────────────────────────────────────────
// Source unique : critereData.fichiers (pas de prop fichiers séparée pour éviter doublon)
const FileUpload = React.memo(
  ({ critereId, critereData, uploadingCriteres, onUpload, onRemove }) => {
    const inputRef = React.useRef(null);
    const fichiers = critereData?.fichiers || []; // source unique
    const fileCount = fichiers.length;
    const remainingSlots = 3 - fileCount;
    const appreciationValue = critereData?.appreciation || "";
    const showFileUpload =
      appreciationValue !== "aucune_preuve" && appreciationValue !== "";
    const isUploading = uploadingCriteres[critereId] || false;

    if (!showFileUpload) return null;

    const formatFileSize = (bytes) => {
      if (!bytes && bytes !== 0) return "";
      if (bytes < 1024) return `${bytes} o`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
    };
    const getFileIcon = (typeMime, nomOriginal) => {
      const nom = (nomOriginal || "").toLowerCase();
      if (typeMime?.includes("pdf") || nom.endsWith(".pdf"))
        return { label: "PDF", bg: "bg-red-100", text: "text-red-700" };
      if (
        typeMime?.includes("image") ||
        /\.(jpg|jpeg|png|gif|bmp|webp|tiff)$/.test(nom)
      )
        return { label: "IMG", bg: "bg-blue-100", text: "text-blue-700" };
      if (typeMime?.includes("word") || /\.(doc|docx)$/.test(nom))
        return { label: "DOC", bg: "bg-indigo-100", text: "text-indigo-700" };
      return { label: "FILE", bg: "bg-gray-100", text: "text-gray-700" };
    };

    const handleChange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        onUpload(critereId, e.target.files);
        // Reset pour permettre re-selection du meme fichier
        if (inputRef.current) inputRef.current.value = "";
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-700">
            Preuves justificatives
            {fileCount === 0 && <span className="text-red-500 ml-0.5">*</span>}
          </span>
          <span
            className={`px-1.5 py-0.5 rounded text-xs font-semibold border
          ${
            fileCount === 0
              ? "bg-gray-50 text-gray-500 border-gray-200"
              : fileCount >= 3
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-blue-50 text-blue-600 border-blue-200"
          }`}
          >
            {fileCount}/3
          </span>
          {fileCount > 0 && fileCount < 3 && (
            <span className="text-xs text-gray-400">
              {remainingSlots} slot{remainingSlots > 1 ? "s" : ""} restant
              {remainingSlots > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          id={`file-upload-${critereId}`}
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,.doc,.docx"
          onChange={handleChange}
          className="hidden"
          disabled={fileCount >= 3 || isUploading}
        />
        <label
          htmlFor={`file-upload-${critereId}`}
          className={`flex items-center gap-2 w-full px-3 py-2 text-xs border rounded-lg transition-all duration-200
          ${
            fileCount >= 3
              ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
              : isUploading
                ? "bg-blue-50 border-blue-300 text-blue-600 cursor-wait"
                : "bg-white border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer"
          }`}
        >
          {isUploading ? (
            <>
              <svg
                className="animate-spin w-4 h-4 text-blue-500 flex-shrink-0"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="font-medium">Import en cours…</span>
              <span className="ml-auto text-blue-400">Patientez</span>
            </>
          ) : fileCount >= 3 ? (
            <>
              <svg
                className="w-4 h-4 flex-shrink-0 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              <span className="text-gray-400">
                Limite de 3 fichiers atteinte
              </span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 text-gray-400 flex-shrink-0"
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
              <span>
                {remainingSlots === 1
                  ? "Ajouter 1 fichier"
                  : `Ajouter des fichiers (${remainingSlots} restant${remainingSlots > 1 ? "s" : ""})`}
              </span>
              <span className="ml-auto text-gray-400 whitespace-nowrap">
                PDF · IMG · DOC · 8 Mo max
              </span>
            </>
          )}
        </label>

        {fichiers.length > 0 && (
          <div className="rounded-lg border border-green-200 overflow-hidden divide-y divide-green-100">
            {fichiers.map((file, idx) => {
              const icon = getFileIcon(
                file.type_mime,
                file.nom_original || file.name,
              );
              return (
                <div
                  key={file.id || `f-${idx}`}
                  className="flex items-center gap-2.5 px-3 py-2 bg-green-50/50 hover:bg-green-50 transition-colors group"
                >
                  <span
                    className={`inline-flex items-center justify-center w-9 h-6 rounded text-xs font-bold flex-shrink-0 ${icon.bg} ${icon.text}`}
                  >
                    {icon.label}
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-green-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate leading-tight">
                      {file.nom_original || file.name || `Fichier ${idx + 1}`}
                    </p>
                    <p className="text-xs text-green-600">
                      Importé
                      {file.taille || file.size
                        ? ` · ${formatFileSize(file.taille || file.size)}`
                        : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(critereId, file.id)}
                    className="flex-shrink-0 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Supprimer ce fichier"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);
FileUpload.displayName = "FileUpload";

// ─── MODAL REPRISE ────────────────────────────────────────────────────────────
// Gère les 2 sources : "server" (données BDD en cours) et "local" (localStorage < 24h)
const ResumeEvaluationModal = React.memo(
  ({ pendingProgression, formSteps, onResume, onNew, onClose }) => {
    if (!pendingProgression) return null;
    const criteresValues = Object.values(
      pendingProgression.formData?.criteres || {},
    );
    const hasAnyValue = criteresValues.some(
      (c) =>
        (c.note && c.note !== "") || (c.appreciation && c.appreciation !== ""),
    );
    if (!hasAnyValue) return null;

    const totalCriteresWithValues = criteresValues.filter(
      (c) => c.note && c.note !== "",
    ).length;
    const totalPoints = criteresValues.reduce(
      (acc, c) => acc + (parseInt(c.note) || 0),
      0,
    );
    const currentStepProgress = pendingProgression.currentStep || 0;
    const completionPct = Math.round((totalCriteresWithValues / 92) * 100);
    const isFromServer = pendingProgression.source === "server";

    const lastActivity = pendingProgression?.timestamp
      ? new Date(pendingProgression.timestamp).toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-lg w-full animate-fadeInScale shadow-2xl overflow-hidden">
            {/* Header — couleur différente selon source */}
            <div
              className={`px-6 py-5 ${isFromServer ? "bg-gradient-to-r from-emerald-600 to-teal-600" : "bg-gradient-to-r from-blue-600 to-indigo-600"}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  {isFromServer ? (
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
                        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                      />
                    </svg>
                  ) : (
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
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-white">
                      Évaluation en cours trouvée
                    </h3>
                    {isFromServer && (
                      <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Enregistrée en BDD
                      </span>
                    )}
                  </div>
                  <p className="text-sm opacity-80 text-white">
                    {isFromServer
                      ? "Vos données sont synchronisées sur le serveur."
                      : "Session locale non soumise."}
                    {lastActivity && (
                      <span className="ml-1">· {lastActivity}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Bannière source */}
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${isFromServer ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-amber-50 border border-amber-200 text-amber-800"}`}
              >
                {isFromServer ? (
                  <>
                    <svg
                      className="w-4 h-4 flex-shrink-0 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span>
                      <strong>
                        Données récupérées depuis la base de données.
                      </strong>{" "}
                      Vous pouvez reprendre exactement où vous en étiez, même
                      depuis un autre appareil.
                    </span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 flex-shrink-0 text-amber-600"
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
                    <span>
                      <strong>Session locale conservée</strong> (moins de 24h).
                      Ces données n'ont pas encore été soumises au serveur.
                    </span>
                  </>
                )}
              </div>

              {/* Barre de progression critères */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">
                    Progression de l'évaluation
                  </span>
                  <span
                    className={`text-sm font-bold ${isFromServer ? "text-emerald-600" : "text-blue-600"}`}
                  >
                    {completionPct}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-700 ${isFromServer ? "bg-emerald-500" : "bg-blue-600"}`}
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {totalCriteresWithValues} critère
                  {totalCriteresWithValues > 1 ? "s" : ""} évalué
                  {totalCriteresWithValues > 1 ? "s" : ""} sur 92 · Étape{" "}
                  {currentStepProgress + 1}/3 (
                  {formSteps[currentStepProgress]?.title?.replace("\n", " ")})
                </p>
              </div>

              {/* Deux stats */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`rounded-xl p-3 flex items-center gap-2.5 border ${isFromServer ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"}`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${isFromServer ? "bg-emerald-100" : "bg-blue-100"}`}
                  >
                    <svg
                      className={`w-5 h-5 ${isFromServer ? "text-emerald-600" : "text-blue-600"}`}
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
                    <p className="text-xl font-black text-gray-900">
                      {totalCriteresWithValues}
                      <span className="text-xs font-normal text-gray-400 ml-0.5">
                        /92
                      </span>
                    </p>
                  </div>
                </div>
                <div
                  className={`rounded-xl p-3 flex items-center gap-2.5 border ${isFromServer ? "bg-teal-50 border-teal-100" : "bg-indigo-50 border-indigo-100"}`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${isFromServer ? "bg-teal-100" : "bg-indigo-100"}`}
                  >
                    <svg
                      className={`w-5 h-5 ${isFromServer ? "text-teal-600" : "text-indigo-600"}`}
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
                    <p className="text-xs text-gray-500">Score actuel</p>
                    <p className="text-xl font-black text-gray-900">
                      {totalPoints}
                      <span className="text-xs font-normal text-gray-400 ml-0.5">
                        /368
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {isFromServer
                  ? "Souhaitez-vous reprendre cette évaluation enregistrée, ou repartir de zéro ?"
                  : "Souhaitez-vous reprendre votre session locale, ou démarrer une nouvelle évaluation ?"}
              </p>
            </div>

            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex flex-col sm:flex-row gap-3 justify-between border-t border-gray-100">
              <button
                onClick={onNew}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all flex items-center gap-2"
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
                Nouvelle évaluation
              </button>
              <button
                onClick={onResume}
                className={`px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all flex items-center justify-center gap-2 shadow-md ${isFromServer ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"}`}
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
                {isFromServer
                  ? "Reprendre depuis la BDD"
                  : "Reprendre ma session"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
ResumeEvaluationModal.displayName = "ResumeEvaluationModal";

// ═════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═════════════════════════════════════════════════════════════════════════════
export default function AutoEvaluationAccreditation() {
  const location = useLocation();
  const navigate = useNavigate();
  const demandeToEdit = location.state?.demande || null;

  const [currentEvalId, setCurrentEvalIdState] = useState(null);
  const currentEvalIdRef = useRef(null);
  const setCurrentEvalId = (id) => {
    currentEvalIdRef.current = id;
    setCurrentEvalIdState(id);
  };

  const [currentView, setCurrentView] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("view") === "recapitulatif"
      ? "recapitulatif"
      : "evaluation";
  });

  const [uploadModal, setUploadModal] = useState({
    visible: false,
    fileName: "",
    fileCount: 0,
    totalCount: 0,
  });
  const [uploadingCriteres, setUploadingCriteres] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [pendingProgression, setPendingProgression] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingFromServer, setIsLoadingFromServer] = useState(true);
  // Ref synchrone pour bloquer l'auto-save pendant toute la phase d'init (évite race condition)
  const isLoadingRef = useRef(true);
  const [formData, setFormData] = useState({ criteres: {} });

  // Animations récap
  const [animScore, setAnimScore] = useState(0);
  const [animNotes, setAnimNotes] = useState(0);
  const [animSections, setAnimSections] = useState([]);
  const [showNiveauBadge, setShowNiveauBadge] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const [currentUserId] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null")?.id ?? null;
    } catch {
      return null;
    }
  });

  const formDataRef = useRef(formData);
  const currentStepRef = useRef(currentStep);
  const expandedSectionsRef = useRef(expandedSections);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);
  useEffect(() => {
    expandedSectionsRef.current = expandedSections;
  }, [expandedSections]);

  const totalNotes = Object.values(formData.criteres || {}).reduce(
    (acc, c) => acc + (parseInt(c.note, 10) || 0),
    0,
  );
  const scorePct = (totalNotes / MAX_POINTS) * 100;

  const getNiveau = (pct) => {
    if (pct >= 80)
      return {
        niveau: "Excellent",
        color: "green",
        bg: "bg-green-500",
        border: "border-green-300",
        text: "text-green-700",
        lightBg: "bg-green-50",
        message:
          "Félicitations ! Votre institution démontre une excellence dans tous les domaines évalués. Vous êtes prêt pour l\'accréditation.",
      };
    if (pct >= 60)
      return {
        niveau: "Satisfaisant",
        color: "blue",
        bg: "bg-blue-500",
        border: "border-blue-300",
        text: "text-blue-700",
        lightBg: "bg-blue-50",
        message:
          "Bon niveau de conformité. Quelques axes d\'amélioration identifiés pour atteindre l\'excellence.",
      };
    if (pct >= 40)
      return {
        niveau: "En développement",
        color: "yellow",
        bg: "bg-yellow-500",
        border: "border-yellow-300",
        text: "text-yellow-700",
        lightBg: "bg-yellow-50",
        message:
          "Des progrès significatifs sont nécessaires. Concentrez-vous sur les critères les plus faibles.",
      };
    if (pct >= 20)
      return {
        niveau: "Faible",
        color: "orange",
        bg: "bg-orange-500",
        border: "border-orange-300",
        text: "text-orange-700",
        lightBg: "bg-orange-50",
        message:
          "Votre institution doit revoir en profondeur sa démarche qualité. Priorisez les actions correctives.",
      };
    return {
      niveau: "Insuffisant",
      color: "red",
      bg: "bg-red-500",
      border: "border-red-300",
      text: "text-red-700",
      lightBg: "bg-red-50",
      message:
        "Votre institution ne répond pas aux critères minimaux. Une refonte complète du système qualité est recommandée.",
    };
  };
  const niveau = getNiveau(scorePct);

  const getNoteFromAppreciation = (v) => appreciationToNoteMap[v] || "";
  const getAppreciationFromNote = (v) => noteToAppreciationMap[v] || "";

  const formSteps = [
    { id: 1, title: "LA POLITIQUE\nDE FORMATION" },
    { id: 2, title: "LA POLITIQUE\nDE GOUVERNANCE" },
    { id: 3, title: "LA POLITIQUE\nDE RECHERCHE" },
  ];
  const progressPct = (currentStep / 3) * 100;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("view", currentView);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [currentView, navigate, location.pathname]);

  useEffect(() => {
    const h = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Animation récap
  useEffect(() => {
    if (currentView !== "recapitulatif" || hasAnimated || totalNotes === 0)
      return;
    setIsAnimating(true);
    setShowNiveauBadge(false);
    const sectionTargets = sectionsEvaluation.map((sec) => {
      const crits = sec.subsections.flatMap((s) => s.criteres);
      const note = crits.reduce(
        (acc, c) =>
          acc + (parseInt(formData.criteres[c.id]?.note || 0, 10) || 0),
        0,
      );
      return {
        pourcentage: (note / (crits.length * 4)) * 100,
        note,
        maxPoints: crits.length * 4,
      };
    });
    const duration = 2200;
    let startTime = null;
    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimScore(Math.floor(scorePct * ease));
      setAnimNotes(Math.floor(totalNotes * ease));
      setAnimSections(
        sectionTargets.map((s) => ({
          ...s,
          animPct: Math.floor(s.pourcentage * ease),
          animNote: Math.floor(s.note * ease),
        })),
      );
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimScore(Math.round(scorePct));
        setAnimNotes(totalNotes);
        setAnimSections(
          sectionTargets.map((s) => ({
            ...s,
            animPct: Math.round(s.pourcentage),
            animNote: s.note,
          })),
        );
        setIsAnimating(false);
        setHasAnimated(true);
        setTimeout(() => setShowNiveauBadge(true), 150);
      }
    };
    requestAnimationFrame(animate);
  }, [currentView, totalNotes]);

  useEffect(() => {
    if (currentView === "evaluation") setHasAnimated(false);
  }, [currentView]);

  const saveExpandedSections = (s) => {
    if (currentUserId)
      localStorage.setItem(
        `${EXPANDED_SECTIONS_KEY}_${currentUserId}`,
        JSON.stringify(s),
      );
  };

  const buildInitialCriteres = () => {
    const init = {};
    sectionsEvaluation.forEach((sec) =>
      sec.subsections.forEach((sub) =>
        sub.criteres.forEach((c) => {
          init[c.id] = {
            preuves: [],
            appreciation: "",
            note: "",
            fichiers: [],
          };
        }),
      ),
    );
    return init;
  };

  const toggleSection = (id) => {
    setExpandedSections((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveExpandedSections(next);
      return next;
    });
  };
  const collapseAll = () => {
    const s = {};
    sectionsEvaluation.forEach((sec) =>
      sec.subsections.forEach((sub) => {
        s[sub.id] = false;
      }),
    );
    setExpandedSections(s);
    saveExpandedSections(s);
  };
  const expandAll = () => {
    const s = {};
    sectionsEvaluation.forEach((sec) =>
      sec.subsections.forEach((sub) => {
        s[sub.id] = true;
      }),
    );
    setExpandedSections(s);
    saveExpandedSections(s);
  };

  const saveProgression = () => {
    try {
      if (!currentUserId) return;
      // Sérialiser proprement : garder seulement les métadonnées des fichiers (pas les blobs)
      const fd = formDataRef.current;
      const serializableCriteres = {};
      Object.entries(fd.criteres || {}).forEach(([id, val]) => {
        serializableCriteres[id] = {
          appreciation: val.appreciation || "",
          note: val.note || "",
          preuves: val.preuves || "",
          // Garder uniquement les fichiers serveur (ont id + nom_original)
          fichiers: (val.fichiers || [])
            .filter((f) => f && f.id !== undefined)
            .map((f) => ({
              id: f.id,
              nom_original: f.nom_original,
              taille: f.taille,
              type_mime: f.type_mime,
            })),
        };
      });
      localStorage.setItem(
        `${STORAGE_KEY}_${currentUserId}`,
        JSON.stringify({
          formData: { criteres: serializableCriteres },
          currentStep: currentStepRef.current,
          expandedSections: expandedSectionsRef.current,
          timestamp: new Date().toISOString(),
          userId: currentUserId,
        }),
      );
    } catch (e) {
      console.error("saveProgression:", e);
    }
  };
  const loadProgression = () => {
    try {
      if (currentUserId) {
        const d = localStorage.getItem(`${STORAGE_KEY}_${currentUserId}`);
        if (d) {
          const data = JSON.parse(d);
          const h = (Date.now() - new Date(data.timestamp).getTime()) / 3600000;
          if (h < 24) return data;
          localStorage.removeItem(`${STORAGE_KEY}_${currentUserId}`);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };
  const restoreProgression = (data) => {
    setFormData(data.formData);
    setCurrentStep(data.currentStep);
    if (data.expandedSections) setExpandedSections(data.expandedSections);
    toast.success("Progression restaurée avec succès !", {
      position: "top-right",
      autoClose: 4000,
    });
  };
  const resetToNew = () => {
    try {
      if (currentUserId) {
        localStorage.removeItem(`${STORAGE_KEY}_${currentUserId}`);
        localStorage.removeItem(`${AUTO_EVAL_RESULT_KEY}_${currentUserId}`);
        // NE PAS effacer les expanded sections (préférence UX)
      }
    } catch (e) {}
    // Remettre le formulaire complet vide + reset evalId
    const initCriteres = buildInitialCriteres();
    setFormData({ criteres: initCriteres });
    setCurrentStep(0);
    // Reset evalId pour éviter d'associer les nouvelles données à l'ancienne éval
    setCurrentEvalId(null);
    currentEvalIdRef.current = null;
    setHasAnimated(false);
    setPendingProgression(null);
    const ie = {};
    sectionsEvaluation.forEach((s) =>
      s.subsections.forEach((sub) => {
        ie[sub.id] = true;
      }),
    );
    setExpandedSections(ie);
    saveExpandedSections(ie);
  };

  // ── CHARGEMENT INITIAL ────────────────────────────────────────────────────
  // CAS 1 — BDD complète (92/92 critères)   → récapitulatif direct, pas de modal
  // CAS 2 — BDD partielle (>0 critères)     → modal "Reprendre depuis BDD" (vert)
  // CAS 3 — BDD vide / erreur / 0 critères  → tester localStorage < 24h
  // CAS 4 — localStorage valide             → modal "Reprendre session locale" (ambre)
  // CAS 5 — Rien nulle part                 → formulaire vide
  useEffect(() => {
    // Cas spécial : mode édition d'une demande existante
    if (demandeToEdit) {
      const pf = buildInitialCriteres();
      Object.entries(demandeToEdit.criteres || {}).forEach(([id, val]) => {
        if (pf[id])
          pf[id] = {
            preuves: val?.preuves || [],
            appreciation: val?.appreciation || "",
            note: val?.note || "",
            fichiers: val?.fichiers || [],
          };
      });
      setFormData({ criteres: pf });
      setCurrentView("recapitulatif");
      isLoadingRef.current = false;
      setIsLoadingFromServer(false);
      return;
    }

    const init = async () => {
      isLoadingRef.current = true;
      setIsLoadingFromServer(true);
      let serverHandled = false;

      // ── Tentative chargement depuis le serveur ─────────────────────────
      if (currentUserId) {
        try {
          // getMyAutoEvaluations retourne maintenant TOUJOURS un tableau (normalisé dans le service)
          const evalsList = await getMyAutoEvaluations();
          console.log("[Init] evalsList:", evalsList?.length, "éval(s)");

          if (evalsList.length > 0) {
            const latest = evalsList[0];
            setCurrentEvalId(latest.id);

            // getAutoEvaluation retourne maintenant { id, criteres:[], is_complete, ... }
            const detail = await getAutoEvaluation(latest.id);
            console.log(
              "[Init] detail:",
              detail.id,
              "criteres:",
              detail.criteres?.length,
              "complet:",
              detail.is_complete,
            );

            // Construire le formData depuis les données serveur
            // On part du template complet (92 critères vides) et on écrase avec les valeurs serveur
            const sc = buildInitialCriteres();

            (detail.criteres || []).forEach((c) => {
              const cid = c.critere_id;
              if (sc[cid] !== undefined) {
                sc[cid] = {
                  appreciation: c.appreciation || "",
                  // note peut être int (0,1,2,3,4) ou string depuis le backend
                  note:
                    c.note !== null && c.note !== undefined && c.note !== ""
                      ? String(c.note)
                      : "",
                  // fichiers serveur : [{ id, nom_original, taille, type_mime }]
                  fichiers: Array.isArray(c.fichiers) ? c.fichiers : [],
                  preuves: c.preuves || "",
                };
              }
            });

            const TOTAL = 92;
            const filledCount = Object.values(sc).filter(
              (c) => c.appreciation !== "" && c.note !== "",
            ).length;
            const isComplete =
              detail.is_complete === true || filledCount >= TOTAL;
            const hasData = filledCount > 0;

            console.log(
              "[Init]",
              filledCount,
              "critères remplis / complet =",
              isComplete,
            );

            if (isComplete) {
              // CAS 1 — éval complète → afficher le récapitulatif directement
              setFormData({ criteres: sc });
              setCurrentView("recapitulatif");
              serverHandled = true;
            } else if (hasData) {
              // CAS 2 — éval partielle → proposer la reprise via modal (couleur verte)
              const serverStep =
                typeof detail.current_step === "number"
                  ? detail.current_step
                  : 0;
              const serverProgression = {
                formData: { criteres: sc },
                currentStep: serverStep,
                expandedSections: null,
                timestamp:
                  detail.updated_at ||
                  detail.created_at ||
                  new Date().toISOString(),
                source: "server",
              };
              setFormData({ criteres: sc });
              setCurrentStep(serverStep);
              setPendingProgression(serverProgression);
              setShowResumeModal(true);
              serverHandled = true;
            }
            // si filledCount === 0 : enregistrement vide → continuer vers localStorage
          }
        } catch (err) {
          // Ne pas bloquer sur une erreur réseau : on tente le localStorage
          console.warn(
            "[Init] Erreur serveur, fallback localStorage:",
            err?.response?.status || err?.message,
          );
        }
      }

      // ── Fallback localStorage si serveur n'a rien donné ──────────────
      if (!serverHandled) {
        const saved = loadProgression();
        const hasLocalData =
          saved?.formData?.criteres &&
          Object.values(saved.formData.criteres).some(
            (c) =>
              c.note &&
              c.note !== "" &&
              c.appreciation &&
              c.appreciation !== "",
          );
        console.log(
          "[Init] localStorage:",
          hasLocalData ? "données trouvées" : "vide",
        );

        if (saved && hasLocalData) {
          // CAS 4 — localStorage valide → proposer la reprise (couleur ambre)
          // Nettoyer les fichiers : garder seulement ceux avec un id serveur (pas les blobs)
          const cleanedCriteres = {};
          Object.entries(saved.formData.criteres).forEach(([id, val]) => {
            cleanedCriteres[id] = {
              ...val,
              fichiers: (val.fichiers || []).filter(
                (f) => f && f.id !== undefined,
              ),
            };
          });
          const cleanedProgression = {
            ...saved,
            formData: { criteres: cleanedCriteres },
            source: "local",
          };

          setFormData(cleanedProgression.formData);
          setCurrentStep(saved.currentStep || 0);
          if (saved.expandedSections)
            setExpandedSections(saved.expandedSections);
          setPendingProgression(cleanedProgression);
          setShowResumeModal(true);
        } else {
          // CAS 5 — Rien nulle part → formulaire vide
          setFormData({ criteres: buildInitialCriteres() });
          const ie = {};
          sectionsEvaluation.forEach((s) =>
            s.subsections.forEach((sub) => {
              ie[sub.id] = true;
            }),
          );
          setExpandedSections(ie);
          saveExpandedSections(ie);
        }
      }

      // Restaurer les préférences sections étendues (dernier car override)
      if (currentUserId) {
        try {
          const savedExp = localStorage.getItem(
            `${EXPANDED_SECTIONS_KEY}_${currentUserId}`,
          );
          if (savedExp) setExpandedSections(JSON.parse(savedExp));
        } catch (e) {}
      }

      // Libérer le verrou de chargement — le setTimeout garantit que tous
      // les setState React sont flushed avant que l'auto-save puisse partir
      setTimeout(() => {
        isLoadingRef.current = false;
        setIsLoadingFromServer(false);
      }, 50);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demandeToEdit, currentUserId]);

  // ── AUTO-SAVE SERVEUR ─────────────────────────────────────────────────────
  // isLoadingRef.current est le seul guard fiable (synchrone, pas de batch React)
  useEffect(() => {
    if (isLoadingRef.current) return; // bloque pendant toute la phase d'init
    const save = async () => {
      if (!currentUserId || currentView !== "evaluation") return;
      if (
        !Object.values(formData.criteres).some((c) => c.appreciation || c.note)
      )
        return;
      setIsSaving(true);
      try {
        // formatAutoEvaluationData filtre les critères vides → pas d'écrasement BDD
        const payload = formatAutoEvaluationData(formData);
        if (payload.criteres.length === 0) return; // rien à sauvegarder
        const res = await createOrUpdateAutoEvaluation(payload);
        // res.id est garanti par le service normalisé
        if (res?.id) setCurrentEvalId(res.id);
      } catch (e) {
        console.error("[Auto-save serveur]", e?.response?.status, e?.message);
        // Ne pas afficher de toast pour les erreurs silencieuses d'auto-save
      } finally {
        setIsSaving(false);
      }
    };
    const t = setTimeout(save, 2500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, currentStep, currentUserId, currentView]);

  // ── AUTO-SAVE LOCAL ────────────────────────────────────────────────────────
  useEffect(() => {
    if (isLoadingRef.current) return;
    const t = setTimeout(() => {
      if (
        currentUserId &&
        Object.keys(formData.criteres).length &&
        currentView === "evaluation"
      ) {
        saveProgression();
      }
    }, 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, currentStep, expandedSections, currentUserId, currentView]);

  const handleCritereChange = (critereId, field, value) => {
    setFormData((prev) => {
      const c = { ...prev.criteres[critereId] };
      if (field === "appreciation") {
        c[field] = value;
        c.note = value ? getNoteFromAppreciation(value) : "";
      } else if (field === "note") {
        c[field] = value;
        if (value) c.appreciation = getAppreciationFromNote(value);
      } else c[field] = value;
      return { ...prev, criteres: { ...prev.criteres, [critereId]: c } };
    });
  };

  const handleFileUpload = React.useCallback(async (critereId, files) => {
    if (!critereId || !files || files.length === 0) return;

    const filesArray = Array.from(files);

    // ── Lire le nb de fichiers ACTUELS depuis le ref (évite closure stale) ──
    const currentFichiers =
      formDataRef.current?.criteres?.[critereId]?.fichiers || [];
    const currentCount = currentFichiers.length;

    // Vérification limite 3 fichiers
    if (currentCount >= 3) {
      toast.error("Limite de 3 fichiers déjà atteinte pour ce critère.", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }
    if (currentCount + filesArray.length > 3) {
      const canAdd = 3 - currentCount;
      toast.error(
        `Vous ne pouvez ajouter que ${canAdd} fichier${canAdd > 1 ? "s" : ""} supplémentaire${canAdd > 1 ? "s" : ""} (limite : 3 par critère).`,
        { position: "top-right", autoClose: 5000 },
      );
      return;
    }

    // Vérification types autorisés
    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
      "image/tiff",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const invalid = filesArray.filter((f) => !allowed.includes(f.type));
    if (invalid.length) {
      toast.error(
        `Format${invalid.length > 1 ? "s" : ""} non autorisé${invalid.length > 1 ? "s" : ""} : ${invalid.map((f) => f.name).join(", ")}. Formats acceptés : PDF, JPG, PNG, DOC, DOCX.`,
        { position: "top-right", autoClose: 6000 },
      );
      return;
    }

    // Vérification taille 8 Mo max par fichier
    const MAX_SIZE = 8 * 1024 * 1024; // 8 Mo
    const tooLarge = filesArray.filter((f) => f.size > MAX_SIZE);
    if (tooLarge.length) {
      toast.error(
        `Fichier${tooLarge.length > 1 ? "s" : ""} trop volumineux (max 8 Mo) : ${tooLarge.map((f) => f.name).join(", ")}`,
        { position: "top-right", autoClose: 6000 },
      );
      return;
    }

    try {
      let evalId = currentEvalIdRef.current;
      setUploadingCriteres((prev) => ({ ...prev, [critereId]: true }));
      setUploadModal({
        visible: true,
        fileName: filesArray.length === 1 ? filesArray[0].name : "",
        fileCount: 1,
        totalCount: filesArray.length,
      });

      // Créer l'évaluation si elle n'existe pas encore
      if (!evalId) {
        const res = await createOrUpdateAutoEvaluation(
          formatAutoEvaluationData(formDataRef.current),
        );
        evalId = res.id;
        setCurrentEvalId(evalId);
      }

      const res = await uploadCritereFichiers(evalId, critereId, filesArray);
      setUploadModal({
        visible: false,
        fileName: "",
        fileCount: 0,
        totalCount: 0,
      });

      // Normaliser la réponse du serveur
      // Le service retourne response.data → peut être { fichiers: [...] } ou directement [...]
      let newFichiers = [];
      if (Array.isArray(res)) {
        newFichiers = res;
      } else if (Array.isArray(res?.fichiers)) {
        newFichiers = res.fichiers;
      } else if (Array.isArray(res?.data?.fichiers)) {
        newFichiers = res.data.fichiers;
      } else if (Array.isArray(res?.data)) {
        newFichiers = res.data;
      }

      setFormData((prev) => {
        const existingFichiers = prev.criteres[critereId]?.fichiers || [];
        // Dédoublonner par id pour éviter les doublons si le serveur renvoie tout
        const existingIds = new Set(existingFichiers.map((f) => f.id));
        const uniqueNew = newFichiers.filter((f) => !existingIds.has(f.id));
        return {
          ...prev,
          criteres: {
            ...prev.criteres,
            [critereId]: {
              ...prev.criteres[critereId],
              fichiers: [...existingFichiers, ...uniqueNew],
            },
          },
        };
      });

      toast.success(
        `${filesArray.length} fichier${filesArray.length > 1 ? "s" : ""} ajouté${filesArray.length > 1 ? "s" : ""} avec succès`,
        { position: "top-right", autoClose: 2500 },
      );
    } catch (err) {
      setUploadModal({
        visible: false,
        fileName: "",
        fileCount: 0,
        totalCount: 0,
      });
      const detail =
        err?.response?.data?.detail || err?.response?.data?.message;
      toast.error(
        detail
          ? `Erreur serveur : ${detail}`
          : "Erreur lors de l'upload. Veuillez réessayer.",
        { position: "top-right", autoClose: 5000 },
      );
    } finally {
      setUploadingCriteres((prev) => ({ ...prev, [critereId]: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveFile = React.useCallback(async (critereId, fileId) => {
    try {
      await deleteCritereFichier(currentEvalIdRef.current, critereId, fileId);
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
      toast.success("Fichier supprimé avec succès", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch {
      toast.error("Erreur lors de la suppression du fichier", {
        position: "top-right",
        autoClose: 4000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextStep = () => {
    if (currentStep >= 2) return;
    const invalid = sectionsEvaluation[currentStep].subsections
      .flatMap((sub) => sub.criteres)
      .filter((c) => {
        const cr = formData.criteres[c.id];
        return (
          !cr ||
          !cr.appreciation ||
          !cr.note ||
          (cr.appreciation !== "aucune_preuve" && cr.fichiers.length === 0)
        );
      });
    if (invalid.length) {
      toast.error(
        "Veuillez remplir tous les critères de cette section avant de continuer.",
        { position: "top-right", autoClose: 5000 },
      );
      return;
    }
    setCurrentStep(currentStep + 1);
    scrollToTop();
  };
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollToTop();
    }
  };

  const handleViewRecap = () => {
    const invalid = sectionsEvaluation
      .flatMap((s) => s.subsections.flatMap((sub) => sub.criteres))
      .filter((c) => {
        const cr = formData.criteres[c.id];
        return (
          !cr ||
          !cr.appreciation ||
          !cr.note ||
          (cr.appreciation !== "aucune_preuve" && cr.fichiers.length === 0)
        );
      });
    if (invalid.length) {
      toast.error(
        `Critères incomplets : ${invalid
          .slice(0, 5)
          .map((c) => c.numero)
          .join(", ")}...`,
        { position: "top-right", autoClose: 6000 },
      );
      return;
    }
    setCurrentView("recapitulatif");
    scrollToTop();
  };

  const barColor = (pct) =>
    pct >= 80
      ? "bg-green-500"
      : pct >= 60
        ? "bg-blue-500"
        : pct >= 40
          ? "bg-yellow-500"
          : pct >= 20
            ? "bg-orange-500"
            : "bg-red-500";

  // ── ÉCRAN CHARGEMENT ──────────────────────────────────────────────────────
  if (isLoadingFromServer) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <div className="relative w-20 h-20">
          <svg
            className="w-20 h-20 text-gray-100 absolute inset-0"
            viewBox="0 0 80 80"
            fill="none"
          >
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="6"
            />
          </svg>
          <svg
            className="w-20 h-20 absolute inset-0 animate-spin"
            viewBox="0 0 80 80"
            fill="none"
            style={{ animationDuration: "0.9s" }}
          >
            <path
              d="M40 4 A36 36 0 0 1 76 40"
              stroke="#2563EB"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">
            Chargement de votre évaluation...
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Récupération instantanée depuis le serveur
          </p>
        </div>
        <div className="w-48 bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-indeterminate-bar" />
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // VUE ÉVALUATION
  // ════════════════════════════════════════════════════════════════════════════
  const renderEvaluationView = () => (
    <div className="min-h-screen bg-white py-6 md:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Auto-évaluation
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Évaluez chaque critère selon les échelles fournies
            </p>
            {isSaving && (
              <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                <svg
                  className="animate-spin h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="none"
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
                Sauvegarde en cours...
              </p>
            )}
          </div>
          <button
            onClick={() =>
              navigate("/dashboard/etablissement/accreditation/auto-evaluation")
            }
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

        {/* Barre progression */}
        <div className="mb-6 md:mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Progression
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {Math.round(progressPct)}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Stepper mobile */}
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

        {/* Stepper desktop */}
        <div className="hidden md:block mb-8 lg:mb-10">
          <div className="relative">
            <div className="absolute left-0 right-0 top-[19px] h-0.5 bg-gray-100" />
            <div
              className="absolute left-0 top-[19px] h-0.5 bg-blue-600 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
            <div className="grid grid-cols-3 gap-3 relative z-10">
              {formSteps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-sm font-bold ${step.id < currentStep + 1 ? "bg-green-600 border-green-600 text-white" : step.id === currentStep + 1 ? "bg-blue-600 border-blue-600 ring-2 ring-blue-200 text-white" : "bg-white border-gray-300 text-gray-500"}`}
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

        <div className="bg-gray-50 px-3 md:px-4 py-2 md:py-3 rounded-lg mb-4">
          <p className="text-xs md:text-sm text-gray-700">
            Étape {currentStep + 1}/3 : {sectionsEvaluation[currentStep]?.title}
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

        {sectionsEvaluation[currentStep]?.subsections.map((sub, si) => {
          const isExpanded =
            expandedSections[sub.id] !== undefined
              ? expandedSections[sub.id]
              : true;
          const completedInSub = sub.criteres.filter((c) => {
            const cr = formData.criteres[c.id];
            return (
              cr &&
              cr.appreciation &&
              cr.note &&
              (cr.appreciation === "aucune_preuve" || cr.fichiers.length > 0)
            );
          }).length;
          const allDone = completedInSub === sub.criteres.length;
          return (
            <div
              key={si}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4"
            >
              <div
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleSection(sub.id)}
              >
                <div className="flex items-center gap-3">
                  {allDone && (
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-green-600"
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
                    </span>
                  )}
                  <h3
                    className={`text-base md:text-lg font-semibold ${allDone ? "text-green-800" : "text-gray-900"}`}
                  >
                    {sub.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${allDone ? "bg-green-100 text-green-700" : completedInSub > 0 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    {completedInSub}/{sub.criteres.length}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
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
                    <p className="text-xs md:text-sm text-gray-600 mb-4 leading-relaxed">
                      {sub.description}
                    </p>
                  )}
                  <div className="space-y-3 md:space-y-4">
                    {sub.criteres.map((c) => {
                      const crit = formData.criteres[c.id];
                      const isDone =
                        crit &&
                        crit.note &&
                        crit.appreciation &&
                        (crit.appreciation === "aucune_preuve" ||
                          crit.fichiers?.length > 0);
                      return (
                        <div
                          key={c.id}
                          className={`border rounded-lg p-4 md:p-5 transition-colors ${isDone ? "bg-green-50/40 border-green-200" : "bg-white border-gray-200 hover:border-gray-300"}`}
                        >
                          <div className="flex items-start gap-2 md:gap-3 mb-3 md:mb-4">
                            <span
                              className={`px-2 py-0.5 rounded-md text-xs font-medium flex-shrink-0 ${isDone ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                            >
                              {c.numero}
                            </span>
                            <span className="text-xs md:text-sm font-medium text-gray-900 flex-1">
                              {c.label}
                            </span>
                            {isDone && (
                              <svg
                                className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="lg:col-span-2">
                              <FileUpload
                                critereId={c.id}
                                critereData={formData.criteres[c.id]}
                                uploadingCriteres={uploadingCriteres}
                                onUpload={handleFileUpload}
                                onRemove={handleRemoveFile}
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
                              >
                                <option value="">Sélectionnez</option>
                                {appreciationOptions.map((o) => (
                                  <option key={o.value} value={o.value}>
                                    {o.label}
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
                                className={`w-full px-3 py-2 text-xs md:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${crit?.note !== "" && crit?.note !== undefined ? (parseInt(crit.note) >= 3 ? "border-green-300 text-green-800 bg-green-50" : parseInt(crit.note) >= 1 ? "border-yellow-300 text-yellow-800 bg-yellow-50" : "border-red-200 text-red-700 bg-red-50") : "border-gray-300"}`}
                              >
                                <option value="">Sélectionnez</option>
                                {noteOptions.map((o) => (
                                  <option key={o.value} value={o.value}>
                                    {o.label}
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
              )}
            </div>
          );
        })}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base transition ${currentStep === 0 ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"}`}
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
                className="w-4 h-4"
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
                className="w-4 h-4"
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

  // ════════════════════════════════════════════════════════════════════════════
  // VUE RÉCAPITULATIF
  // ════════════════════════════════════════════════════════════════════════════
  const renderRecapitulatifView = () => {
    const criteresCompletes = Object.values(formData.criteres).filter(
      (c) => c.note && c.appreciation,
    ).length;
    const totalCriteres = Object.values(formData.criteres).length;
    const sectionsScores = sectionsEvaluation.map((section, i) => {
      const crits = section.subsections.flatMap((s) => s.criteres);
      const note = crits.reduce(
        (acc, c) =>
          acc + (parseInt(formData.criteres[c.id]?.note || 0, 10) || 0),
        0,
      );
      const maxPts = crits.length * 4;
      const pct = (note / maxPts) * 100;
      const completed = crits.filter((c) => {
        const cr = formData.criteres[c.id];
        return cr && cr.note && cr.appreciation;
      }).length;
      const anim = animSections[i] || { animPct: 0, animNote: 0 };
      return {
        title: section.title,
        note,
        maxPoints: maxPts,
        pourcentage: pct,
        criteresCount: crits.length,
        completed,
        animPct: anim.animPct,
        animNote: anim.animNote,
      };
    });
    const displayScore = isAnimating ? animScore : Math.round(scorePct);
    const displayNotes = isAnimating ? animNotes : totalNotes;
    const circumference = 2 * Math.PI * 52;
    const strokeDashoffset = circumference * (1 - displayScore / 100);

    return (
      <div className="min-h-screen bg-white py-6 md:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Résultat de l\'Auto-Évaluation
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Analyse détaillée de votre niveau de conformité
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setCurrentView("evaluation");
                  scrollToTop();
                }}
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Modifier l'évaluation
              </button>
              <button
                onClick={() => {
                  setCurrentStep(0);
                  setCurrentView("evaluation");
                  scrollToTop();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
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
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
                Reprendre étape 1
              </button>
              <button
                onClick={() => {
                  resetToNew();
                  setCurrentView("evaluation");
                  scrollToTop();
                  toast.info("Nouvelle évaluation commencée", {
                    position: "top-right",
                    autoClose: 3000,
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
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
                Refaire l'évaluation
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Hero score */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 text-white overflow-hidden relative">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="relative text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold mb-1">
                  Résultat de l\'Auto-Évaluation
                </h2>
                <p className="text-gray-400 text-sm">
                  Analyse de conformité aux normes d\'accréditation
                </p>
              </div>
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Anneau SVG score */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 flex flex-col items-center">
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
                    Score Global
                  </p>
                  <div className="relative inline-flex items-center justify-center">
                    <svg width="140" height="140" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="10"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke={
                          {
                            green: "#22c55e",
                            blue: "#3b82f6",
                            yellow: "#eab308",
                            orange: "#f97316",
                            red: "#ef4444",
                          }[niveau.color]
                        }
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 60 60)"
                        style={{ transition: "stroke-dashoffset 0.1s linear" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-white tabular-nums">
                        {displayScore}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-4">
                    <div
                      className={`h-2 rounded-full ${niveau.bg}`}
                      style={{
                        width: `${displayScore}%`,
                        transition: "width 0.1s linear",
                      }}
                    />
                  </div>
                </div>
                {/* Points */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 flex flex-col items-center justify-center">
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
                    Points Obtenus
                  </p>
                  <div className="text-6xl md:text-7xl font-black tabular-nums mb-2">
                    {displayNotes}
                  </div>
                  <p className="text-gray-400 text-sm">
                    sur {MAX_POINTS} points
                  </p>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-4">
                    <div
                      className={`h-2 rounded-full ${niveau.bg}`}
                      style={{
                        width: `${(displayNotes / MAX_POINTS) * 100}%`,
                        transition: "width 0.1s linear",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Badge niveau — animation d\'apparition */}
              <div
                className={`relative transition-all duration-600 ease-out ${showNiveauBadge ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionProperty: "opacity,transform" }}
              >
                <div className="bg-white/10 border border-white/20 rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${niveau.bg} ${showNiveauBadge ? "animate-pulse-once" : ""}`}
                    >
                      {niveau.color === "green" && (
                        <svg
                          className="w-7 h-7 text-white"
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
                      {niveau.color === "blue" && (
                        <svg
                          className="w-7 h-7 text-white"
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
                      {niveau.color === "yellow" && (
                        <svg
                          className="w-7 h-7 text-white"
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
                      {(niveau.color === "orange" ||
                        niveau.color === "red") && (
                        <svg
                          className="w-7 h-7 text-white"
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
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold">
                          Niveau {niveau.niveau}
                        </h3>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {niveau.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
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

            {/* Détail par section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">
                  Détail des évaluations par section
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {sectionsScores.map((sec, i) => (
                  <div
                    key={i}
                    className="px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {sec.title}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>
                            <span className="font-medium text-gray-900">
                              {sec.completed}
                            </span>
                            / {sec.criteresCount} critères
                          </span>
                          <span>
                            <span className="font-medium text-gray-900">
                              {isAnimating ? sec.animNote : sec.note}
                            </span>{" "}
                            points
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 md:w-40 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full ${barColor(sec.pourcentage)} transition-all duration-700`}
                            style={{
                              width: `${isAnimating ? sec.animPct : sec.pourcentage}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-900 min-w-[50px] text-right">
                          {isAnimating
                            ? sec.animPct
                            : Math.round(sec.pourcentage)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribution */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">
                  Distribution des appréciations
                </h3>
              </div>
              <div className="px-4 md:px-6 py-5 space-y-3">
                {[
                  { label: "Pleinement atteint", note: 4, bar: "bg-green-500" },
                  { label: "Bien respecté", note: 3, bar: "bg-blue-500" },
                  {
                    label: "Appliqué irrégulièrement",
                    note: 2,
                    bar: "bg-yellow-500",
                  },
                  {
                    label: "Partiellement pris en compte",
                    note: 1,
                    bar: "bg-orange-500",
                  },
                  { label: "Aucune preuve", note: 0, bar: "bg-red-500" },
                ].map(({ label, note, bar }, li) => {
                  const count = Object.values(formData.criteres).filter(
                    (c) => parseInt(c.note) === note,
                  ).length;
                  const pct =
                    totalCriteres > 0 ? (count / totalCriteres) * 100 : 0;
                  return (
                    <div key={note} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-48 flex-shrink-0 truncate">
                        {label}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${bar} transition-all duration-700`}
                          style={{
                            width: `${isAnimating ? 0 : pct}%`,
                            transitionDelay: `${li * 80}ms`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-mono text-gray-500 w-6 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
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
    );
  };

  return (
    <>
      <style>{`
        @keyframes fadeInScale{0%{opacity:0;transform:scale(0.95)}100%{opacity:1;transform:scale(1)}}
        .animate-fadeInScale{animation:fadeInScale 0.3s ease-out}
        @keyframes indeterminate{0%{transform:translateX(-100%) scaleX(0.4)}50%{transform:translateX(50%) scaleX(0.6)}100%{transform:translateX(200%) scaleX(0.4)}}
        .animate-indeterminate-bar{animation:indeterminate 1.4s ease-in-out infinite;width:50%}
        @keyframes pulseOnce{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
        .animate-pulse-once{animation:pulseOnce 0.7s ease-in-out 0.1s 1}
      `}</style>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      {showResumeModal && (
        <ResumeEvaluationModal
          pendingProgression={pendingProgression}
          formSteps={formSteps}
          onClose={() => setShowResumeModal(false)}
          onResume={() => {
            if (pendingProgression.source === "local") {
              // Données déjà dans formData (chargées pendant init), juste confirmer
              setCurrentStep(pendingProgression.currentStep || 0);
              if (pendingProgression.expandedSections)
                setExpandedSections(pendingProgression.expandedSections);
              toast.success("Session locale restaurée avec succès !", {
                position: "top-right",
                autoClose: 4000,
              });
              // Effacer le localStorage après reprise (sera re-sauvegardé par auto-save)
              try {
                if (currentUserId)
                  localStorage.removeItem(`${STORAGE_KEY}_${currentUserId}`);
              } catch (e) {}
            } else {
              // source "server" : données déjà dans formData, step déjà set pendant init
              toast.success(
                "Évaluation récupérée depuis la base de données !",
                { position: "top-right", autoClose: 4000 },
              );
            }
            setShowResumeModal(false);
            setCurrentView("evaluation");
          }}
          onNew={() => {
            setShowResumeModal(false);
            setPendingProgression(null);
            resetToNew();
          }}
        />
      )}

      <UploadLoadingModal
        isVisible={uploadModal.visible}
        fileName={uploadModal.fileName}
        fileCount={uploadModal.fileCount}
        totalCount={uploadModal.totalCount}
      />

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition animate-fadeInScale"
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
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}

      <div className="min-h-screen bg-white">
        {currentView === "evaluation" && renderEvaluationView()}
        {currentView === "recapitulatif" && renderRecapitulatifView()}
      </div>
    </>
  );
}
