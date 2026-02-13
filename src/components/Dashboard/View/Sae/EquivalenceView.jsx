import React, { useState } from "react";
import {
  FaEye,
  FaEdit,
  FaSort,
  FaUserCircle,
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
  FaArrowLeft,
  FaFileAlt,
  FaCalendarAlt,
  FaTag,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUniversity,
  FaGraduationCap,
  FaInfoCircle,
  FaCheck,
  FaFileUpload,
  FaExclamationTriangle,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
  FaArchive,
  FaTrashAlt,
} from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Types de diplôme disponibles (simplifié)
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

const EquivalenceView = () => {
  // Nouveau système de statut avec étapes et sous-statuts
  const statusHierarchy = [
    { id: "SAE", label: "SAE", nextLevels: ["CNE"] },
    { id: "CNE", label: "CNE", nextLevels: ["SG"] },
    { id: "SG", label: "SG", nextLevels: ["Ministre"] },
    { id: "Ministre", label: "Ministre", nextLevels: ["PM"] },
    { id: "PM", label: "PM", nextLevels: ["Octroyé"] },
    { id: "Octroyé", label: "Octroyé", nextLevels: [] },
  ];

  const subStatusOptions = [
    { id: "accepte", label: "Accepté", color: "bg-green-100 text-green-800 border-green-200", description: "Le dossier passe à l'étape suivante" },
    { id: "ajourne", label: "Ajourné", color: "bg-yellow-100 text-yellow-800 border-yellow-200", description: "Le dossier nécessite des informations complémentaires" },
    { id: "rejete", label: "Rejeté", color: "bg-red-100 text-red-800 border-red-200", description: "Le dossier est définitivement rejeté" },
  ];

  const [equivalences, setEquivalences] = useState([
    {
      id: 1,
      dossierNumber: "DOS-2023-001",
      applicant: "Jean Dupont",
      qualification: "Licence",
      status: "SAE",
      subStatus: "accepte",
      submittedDate: "2023-01-20",
      email: "jean.dupont@email.com",
      phone: "+33 6 12 34 56 78",
      address: "123 Rue de Paris, 75001 Paris, France",
      institution: "Université de Paris",
      country: "France",
      year: "2022",
      notes: "Dossier complet, en attente de validation",
      documents: ["Diplôme", "Relevé de notes", "Pièce d'identité"],
      history: [
        { date: "2023-01-20", action: "Soumission", user: "Système", status: "SAE", subStatus: "accepte", note: "" },
        { date: "2023-01-22", action: "Vérification initiale", user: "Agent SAE", status: "SAE", subStatus: "accepte", note: "" },
      ],
      motif: "inscription",
      type_diplome: "Licence",
      nom: "Dupont",
      prenoms: "Jean",
      code_postal: "75001 Paris",
      recapitulatif_formation: [
        {
          annee_obtention: "2022",
          diplome: "Licence en Informatique",
          mention: "Assez Bien",
          parcours_option_specialite: "Génie Logiciel",
          etablissement: "Université de Paris",
        },
      ],
      destinataire: "Madame/Monsieur le Ministre de l'Enseignement Supérieur",
      isArchived: false,
    },
    {
      id: 2,
      dossierNumber: "DOS-2023-002",
      applicant: "Marie Martin",
      qualification: "Master",
      status: "CNE",
      subStatus: "ajourne",
      submittedDate: "2023-02-10",
      email: "marie.martin@email.com",
      phone: "+33 6 23 45 67 89",
      address: "456 Avenue des Champs, 69000 Lyon, France",
      institution: "Université Lyon 1",
      country: "France",
      year: "2021",
      notes: "Documents complémentaires requis",
      documents: ["Diplôme", "CV", "Lettre de motivation"],
      history: [
        { date: "2023-02-10", action: "Soumission", user: "Système", status: "SAE", subStatus: "accepte", note: "" },
        { date: "2023-02-12", action: "Pré-évaluation", user: "Agent SAE", status: "SAE", subStatus: "accepte", note: "" },
        { date: "2023-02-15", action: "Transmis à CNE", user: "Superviseur", status: "CNE", subStatus: "ajourne", note: "Documents manquants : relevé de notes certifié conforme" },
      ],
      motif: "ecole_doctorale",
      type_diplome: "Master",
      nom: "Martin",
      prenoms: "Marie",
      code_postal: "69000 Lyon",
      recapitulatif_formation: [
        {
          annee_obtention: "2021",
          diplome: "Master en Finance",
          mention: "Bien",
          parcours_option_specialite: "Finance d'Entreprise",
          etablissement: "Université Lyon 1",
        },
      ],
      destinataire: "Madame/Monsieur le Ministre de l'Enseignement Supérieur",
      isArchived: false,
    },
    {
      id: 3,
      dossierNumber: "DOS-2023-003",
      applicant: "Pierre Bernard",
      qualification: "Doctorat",
      status: "Octroyé",
      subStatus: "terminé",
      submittedDate: "2023-03-15",
      email: "pierre.bernard@email.com",
      phone: "+33 6 34 56 78 90",
      address: "789 Boulevard Maritime, 13000 Marseille, France",
      institution: "École Technique Supérieure",
      country: "France",
      year: "2020",
      notes: "Dossier octroyé avec succès",
      documents: ["Diplôme technique", "Certificat de travail", "Attestation"],
      history: [
        { date: "2023-03-15", action: "Soumission", user: "Système", status: "SAE", subStatus: "accepte", note: "" },
        { date: "2023-03-18", action: "Validation SAE", user: "Agent SAE", status: "SAE", subStatus: "accepte", note: "" },
        { date: "2023-03-20", action: "Validation CNE", user: "Expert CNE", status: "CNE", subStatus: "accepte", note: "" },
        { date: "2023-03-22", action: "Validation SG", user: "Secrétaire Général", status: "SG", subStatus: "accepte", note: "" },
        { date: "2023-03-25", action: "Validation Ministre", user: "Ministre", status: "Ministre", subStatus: "accepte", note: "" },
        { date: "2023-03-28", action: "Validation PM", user: "Premier Ministre", status: "PM", subStatus: "accepte", note: "" },
        { date: "2023-03-30", action: "Dossier octroyé", user: "Système", status: "Octroyé", subStatus: "terminé", note: "" },
      ],
      motif: "recherche",
      type_diplome: "Doctorat",
      nom: "Bernard",
      prenoms: "Pierre",
      code_postal: "13000 Marseille",
      recapitulatif_formation: [
        {
          annee_obtention: "2020",
          diplome: "Doctorat en Physique",
          mention: "Très Bien",
          parcours_option_specialite: "Physique Quantique",
          etablissement: "École Technique Supérieure",
        },
      ],
      destinataire: "Madame/Monsieur le Ministre de l'Enseignement Supérieur",
      isArchived: true,
    },
  ]);

  // États pour la vue principale
  const [searchQuery, setSearchQuery] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [newSubStatus, setNewSubStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [noteError, setNoteError] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  // Configuration des toasts - sans emoji
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

  // Filtrer les données (exclure les archives sauf si explicitement demandé)
  const filteredEquivalences = equivalences.filter((eq) => {
    const matchesSearch = searchQuery
      ? eq.dossierNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.status.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const submittedDate = new Date(
      eq.submittedDate.split("-").reverse().join("-"),
    );
    const startDate = startDateFilter ? new Date(startDateFilter) : null;
    const endDate = endDateFilter ? new Date(endDateFilter) : null;

    const matchesDateRange =
      (!startDate || submittedDate >= startDate) &&
      (!endDate || submittedDate <= endDate);

    const matchesStatus = statusFilter ? eq.status === statusFilter : true;

    const isArchived = eq.isArchived || false;

    return matchesSearch && matchesDateRange && matchesStatus && !isArchived;
  });

  // Trier les données
  const sortedEquivalences = [...filteredEquivalences].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "id") {
      comparison = a.id - b.id;
    } else if (sortBy === "date") {
      const dateA = new Date(a.submittedDate.split("-").reverse().join("-"));
      const dateB = new Date(b.submittedDate.split("-").reverse().join("-"));
      comparison = dateA - dateB;
    } else if (sortBy === "dossier") {
      comparison = a.dossierNumber.localeCompare(b.dossierNumber);
    } else if (sortBy === "demandeur") {
      comparison = a.applicant.localeCompare(b.applicant);
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedEquivalences.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedEquivalences = sortedEquivalences.slice(
    startIndex,
    startIndex + pageSize,
  );

  // Réinitialiser tous les filtres
  const resetAllFilters = () => {
    setSearchQuery("");
    setStartDateFilter("");
    setEndDateFilter("");
    setStatusFilter("");
    setCurrentPage(1);
    toast.info("Tous les filtres ont été réinitialisés", toastConfig);
  };

  // Ouvrir modal pour modifier le statut
  const openStatusModal = (dossier) => {
    setSelectedDossier(dossier);
    setNewStatus(dossier.status);
    setNewSubStatus(dossier.subStatus);
    setStatusNote("");
    setNoteError("");
    setShowModal(true);
  };

  // Ouvrir vue détail - SANS TOAST
  const openDetailView = (dossier) => {
    setSelectedDetail(dossier);
    setViewMode("detail");
    // SUPPRIMÉ : toast.info pour la visualisation
  };

  // Retour à la liste - SANS TOAST
  const backToList = () => {
    setViewMode("list");
    setSelectedDetail(null);
    // SUPPRIMÉ : toast.info pour le retour à la liste
  };

  // Archiver un dossier
  const archiveDossier = (dossier) => {
    const canArchive = dossier.status === "Octroyé" || 
                      dossier.subStatus === "ajourne" || 
                      dossier.subStatus === "rejete";
    
    if (!canArchive) {
      toast.error("Impossible d'archiver un dossier qui est encore en cours de traitement.", toastConfig);
      return;
    }

    setShowArchiveModal(true);
    setSelectedDossier(dossier);
  };

  // Confirmer l'archivage
  const confirmArchive = () => {
    if (selectedDossier) {
      const updatedEquivalences = equivalences.map((eq) =>
        eq.id === selectedDossier.id ? { 
          ...eq, 
          isArchived: true,
          history: [...eq.history, {
            date: new Date().toISOString().split("T")[0],
            action: "Dossier archivé",
            user: "Administrateur",
            status: eq.status,
            subStatus: eq.subStatus,
            note: ""
          }],
          notes: eq.notes + " (Archivé)"
        } : eq,
      );
      setEquivalences(updatedEquivalences);
      
      if (selectedDetail && selectedDetail.id === selectedDossier.id) {
        setSelectedDetail({
          ...selectedDetail, 
          isArchived: true,
          history: [...selectedDetail.history, {
            date: new Date().toISOString().split("T")[0],
            action: "Dossier archivé",
            user: "Administrateur",
            status: selectedDetail.status,
            subStatus: selectedDetail.subStatus,
            note: ""
          }],
          notes: selectedDetail.notes + " (Archivé)"
        });
      }
      
      setShowArchiveModal(false);
      toast.success(`Dossier ${selectedDossier.dossierNumber} archivé avec succès`, toastConfig);
      setSelectedDossier(null);
    }
  };

  // Confirmer le changement de statut avec sous-statut et note obligatoire
  const confirmStatusChange = () => {
    if (newSubStatus === "rejete" || newSubStatus === "ajourne") {
      if (!statusNote || statusNote.trim() === "") {
        setNoteError("Une note explicative est obligatoire pour le rejet ou l'ajournement du dossier.");
        return;
      }
    }

    if (selectedDossier && newSubStatus) {
      const targetStatus = newStatus || selectedDossier.status;
      
      let nextStatus = targetStatus;
      let nextSubStatus = newSubStatus;
      
      if (newSubStatus === "accepte" && targetStatus !== "Octroyé") {
        const currentStatusIndex = statusHierarchy.findIndex(s => s.id === targetStatus);
        if (currentStatusIndex < statusHierarchy.length - 1) {
          nextStatus = statusHierarchy[currentStatusIndex + 1].id;
          nextSubStatus = "";
        }
      }
      
      if (newSubStatus === "rejete") {
        nextStatus = targetStatus;
        nextSubStatus = "rejete";
      }
      
      if (newSubStatus === "ajourne") {
        nextStatus = targetStatus;
        nextSubStatus = "ajourne";
      }
      
      if (nextStatus === "Octroyé") {
        nextSubStatus = "terminé";
      }
      
      const actionLabel = newSubStatus === "accepte" ? "Accepté" : 
                         newSubStatus === "ajourne" ? "Ajourné" : 
                         newSubStatus === "rejete" ? "Rejeté" : "Terminé";
      
      let actionNote = "";
      if (newSubStatus === "rejete" || newSubStatus === "ajourne") {
        actionNote = statusNote.trim();
      }
      
      const newHistoryEntry = {
        date: new Date().toISOString().split("T")[0],
        action: `${actionLabel} au niveau ${targetStatus}`,
        user: "Administrateur",
        status: targetStatus,
        subStatus: newSubStatus,
        note: actionNote
      };
      
      let notesUpdate = selectedDossier.notes;
      if (newSubStatus === "rejete" || newSubStatus === "ajourne") {
        notesUpdate = `Dossier ${actionLabel.toLowerCase()} au niveau ${targetStatus}. Motif : ${statusNote.trim()}`;
      } else {
        notesUpdate = `Dossier ${actionLabel.toLowerCase()} au niveau ${targetStatus}`;
      }
      
      const updatedEquivalences = equivalences.map((eq) =>
        eq.id === selectedDossier.id ? { 
          ...eq, 
          status: nextStatus,
          subStatus: nextSubStatus,
          history: [...eq.history, newHistoryEntry],
          notes: notesUpdate
        } : eq,
      );
      setEquivalences(updatedEquivalences);
      
      if (selectedDetail && selectedDetail.id === selectedDossier.id) {
        setSelectedDetail({
          ...selectedDetail, 
          status: nextStatus,
          subStatus: nextSubStatus,
          history: [...selectedDetail.history, newHistoryEntry],
          notes: notesUpdate
        });
      }
      
      setShowModal(false);
      
      // Toast de succès selon le type de décision - SANS EMOJI
      if (newSubStatus === "accepte") {
        toast.success(`Dossier ${selectedDossier.dossierNumber} - Accepté. Nouveau statut : ${nextStatus}`, toastConfig);
      } else if (newSubStatus === "ajourne") {
        toast.warning(`Dossier ${selectedDossier.dossierNumber} - Ajourné. Note : ${statusNote.substring(0, 50)}${statusNote.length > 50 ? '...' : ''}`, toastConfig);
      } else if (newSubStatus === "rejete") {
        toast.error(`Dossier ${selectedDossier.dossierNumber} - Rejeté. Motif : ${statusNote.substring(0, 50)}${statusNote.length > 50 ? '...' : ''}`, toastConfig);
      }
      
      setSelectedDossier(null);
      setNewStatus("");
      setNewSubStatus("");
      setStatusNote("");
      setNoteError("");
    }
  };

  // Gérer le tri
  const handleSortClick = (key) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
    setCurrentPage(1);
    toast.info(`Tri par ${key}`, toastConfig);
  };

  // Composant icône de tri
  const SortIcon = ({ isSorted, isAsc }) => {
    if (!isSorted) return <FaSort className="w-3 h-3 text-gray-400" />;
    return (
      <FaSort
        className={`w-3 h-3 transition-transform ${isAsc ? "rotate-180" : ""}`}
      />
    );
  };

  // Fonction pour obtenir la couleur du statut principal
  const getStatusColor = (status) => {
    switch (status) {
      case "SAE":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      case "CNE":
        return "bg-blue-50 text-blue-700 border border-blue-100";
      case "SG":
        return "bg-purple-50 text-purple-700 border border-purple-100";
      case "Ministre":
        return "bg-yellow-50 text-yellow-700 border border-yellow-100";
      case "PM":
        return "bg-green-50 text-green-700 border border-green-100";
      case "Octroyé":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Fonction pour obtenir la couleur du sous-statut
  const getSubStatusColor = (subStatus) => {
    if (subStatus === "terminé") {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    const option = subStatusOptions.find(opt => opt.id === subStatus);
    return option ? option.color : "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Fonction pour obtenir le label du sous-statut
  const getSubStatusLabel = (subStatus) => {
    if (subStatus === "terminé") {
      return "Terminé";
    }
    const option = subStatusOptions.find(opt => opt.id === subStatus);
    return option ? option.label : "En cours";
  };

  // Vue détail
  if (viewMode === "detail" && selectedDetail) {
    return (
      <div className="min-h-screen bg-white p-2 md:p-4 lg:p-6">
        <ToastContainer />
        
        {/* Header de la vue détail */}
        <div className="mb-4 md:mb-6">
          <button
            onClick={backToList}
            className="flex items-center gap-1 md:gap-2 text-blue-600 hover:text-blue-800 mb-2 md:mb-4 text-xs md:text-sm"
          >
            <FaArrowLeft size={12} className="md:size-4" />
            <span>Retour à la liste</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
                Détails du dossier
              </h1>
              <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1 md:mt-2">
                <span className="font-mono text-xs md:text-sm bg-gray-100 px-2 py-0.5 md:px-3 md:py-1 rounded">
                  {selectedDetail.dossierNumber}
                </span>
                <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDetail.status)}`}>
                  {selectedDetail.status}
                </span>
                <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-medium ${getSubStatusColor(selectedDetail.subStatus)}`}>
                  {getSubStatusLabel(selectedDetail.subStatus)}
                </span>
              </div>
            </div>
            <div className="flex gap-1 md:gap-2 mt-2 md:mt-4 lg:mt-0">
              <button
                onClick={() => openStatusModal(selectedDetail)}
                className="flex items-center gap-1 md:gap-2 bg-blue-600 text-white px-2 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 text-xs md:text-sm transition-all duration-200"
              >
                <FaEdit size={10} className="md:size-3" />
                <span className="hidden sm:inline">Modifier le statut</span>
                <span className="sm:hidden">Modifier</span>
              </button>
              <button
                onClick={() => archiveDossier(selectedDetail)}
                className="flex items-center gap-1 md:gap-2 bg-gray-600 text-white px-2 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-gray-700 text-xs md:text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedDetail.status !== "Octroyé" && selectedDetail.subStatus !== "rejete" && selectedDetail.subStatus !== "ajourne"}
                title={selectedDetail.status !== "Octroyé" && selectedDetail.subStatus !== "rejete" && selectedDetail.subStatus !== "ajourne" ? 
                  "Impossible d'archiver un dossier encore en cours" : 
                  "Archiver le dossier"}
              >
                <FaArchive size={10} className="md:size-3" />
                <span className="hidden sm:inline">Archiver</span>
                <span className="sm:hidden">Archiver</span>
              </button>
            </div>
          </div>
        </div>

        {/* Workflow des étapes de traitement */}
        <div className="mb-4 md:mb-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 md:p-4 lg:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <FaTag className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              <h2 className="text-base md:text-lg font-semibold text-gray-800">
                Workflow de traitement du dossier
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center min-w-max">
                {statusHierarchy.map((status, index) => {
                  const isCurrent = selectedDetail.status === status.id;
                  const isCompleted = statusHierarchy.findIndex(s => s.id === selectedDetail.status) > index;
                  
                  return (
                    <div key={status.id} className="flex items-center mb-4 md:mb-0">
                      <div className="flex flex-col items-center">
                        <div className={`
                          w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
                          ${isCurrent ? 'bg-blue-600 text-white border-2 border-blue-600' : 
                            isCompleted ? 'bg-green-500 text-white border-2 border-green-500' : 
                            'bg-gray-200 text-gray-600 border-2 border-gray-300'}
                        `}>
                          {isCompleted ? (
                            <FaCheck size={14} className="md:size-4" />
                          ) : (
                            <span className="text-xs md:text-sm font-bold">{index + 1}</span>
                          )}
                        </div>
                        <span className="text-xs md:text-sm font-medium mt-1 text-center min-w-[60px] md:min-w-[80px]">
                          {status.label}
                        </span>
                        {isCurrent && (
                          <span className="text-xs text-blue-600 font-medium mt-1">En cours</span>
                        )}
                      </div>
                      
                      {index < statusHierarchy.length - 1 && (
                        <div className={`
                          hidden md:block w-16 h-0.5 mx-2
                          ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                        `} />
                      )}
                      
                      {index < statusHierarchy.length - 1 && (
                        <div className={`
                          md:hidden w-0.5 h-8 mx-auto my-1
                          ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                        `} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaInfoCircle className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                <h3 className="text-sm md:text-base font-semibold text-gray-800">Décision actuelle</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                <div>
                  <p className="text-xs text-gray-500">Statut</p>
                  <span className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium inline-block ${getStatusColor(selectedDetail.status)}`}>
                    {selectedDetail.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Décision</p>
                  <span className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium inline-block ${getSubStatusColor(selectedDetail.subStatus)}`}>
                    {getSubStatusLabel(selectedDetail.subStatus)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu détail - Grid responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {/* Colonne gauche - Informations principales */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4 lg:space-y-6">
            {/* Carte Informations personnelles */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 md:p-4 lg:p-6">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <FaUserCircle className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-800">
                  Informations personnelles
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-2 md:space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 block">Nom complet</label>
                    <p className="font-medium text-sm md:text-base">{selectedDetail.nom} {selectedDetail.prenoms}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">Email</label>
                    <div className="flex items-center gap-1 md:gap-2">
                      <FaEnvelope className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                      <p className="font-medium text-sm md:text-base">{selectedDetail.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">Téléphone</label>
                    <div className="flex items-center gap-1 md:gap-2">
                      <FaPhone className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                      <p className="font-medium text-sm md:text-base">{selectedDetail.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 md:space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 block">Adresse</label>
                    <div className="flex items-start gap-1 md:gap-2">
                      <FaMapMarkerAlt className="h-3 w-3 md:h-4 md:w-4 text-gray-400 mt-0.5" />
                      <p className="font-medium text-sm md:text-base">{selectedDetail.address}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">Date de soumission</label>
                    <div className="flex items-center gap-1 md:gap-2">
                      <FaCalendarAlt className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                      <p className="font-medium text-sm md:text-base">{selectedDetail.submittedDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte Informations académiques */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 md:p-4 lg:p-6">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <FaGraduationCap className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-800">
                  Informations académiques
                </h2>
              </div>
              
              <div className="mb-3 md:mb-4">
                <label className="text-xs text-gray-500 block">Type de diplôme</label>
                <div className="flex items-center gap-1 md:gap-2 mt-1">
                  <span className={`px-2 py-0.5 md:px-2 md:py-1 rounded text-xs font-medium ${
                    selectedDetail.type_diplome === "Licence" ? "bg-blue-100 text-blue-800" :
                    selectedDetail.type_diplome === "Master" ? "bg-purple-100 text-purple-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {selectedDetail.type_diplome}
                  </span>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                {selectedDetail.recapitulatif_formation && selectedDetail.recapitulatif_formation.map((formation, index) => (
                  <div key={index} className="border-l-2 border-blue-500 pl-2 md:pl-3 py-2 md:py-3 bg-blue-50/30 rounded-r">
                    <p className="font-medium text-gray-800 text-sm md:text-base mb-1 md:mb-2">Formation {index + 1}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 text-xs md:text-sm">
                      <div>
                        <span className="text-gray-600">Diplôme :</span> {formation.diplome}
                      </div>
                      <div>
                        <span className="text-gray-600">Année :</span> {formation.annee_obtention}
                      </div>
                      <div>
                        <span className="text-gray-600">Établissement :</span> {formation.etablissement}
                      </div>
                      <div>
                        <span className="text-gray-600">Mention :</span> {formation.mention}
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-gray-600">Spécialité :</span> {formation.parcours_option_specialite}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte Motif de la demande */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 md:p-4 lg:p-6">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <FaInfoCircle className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-800">
                  Motif de la demande
                </h2>
              </div>
              
              <div className="space-y-2 md:space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block">Raison principale</label>
                  <p className="font-medium text-sm md:text-base">
                    {selectedDetail.motif === "inscription" ? "Inscription dans un établissement de formation" :
                     selectedDetail.motif === "ecole_doctorale" ? "Inscription école Doctorale" :
                     selectedDetail.motif === "recherche" ? "Recherche d'emploi" :
                     selectedDetail.motif === "concours" ? "Participation à un concours" : "Autres"}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 block">Destinataire</label>
                  <p className="font-medium text-xs md:text-sm mt-1">{selectedDetail.destinataire}</p>
                </div>
              </div>
            </div>

            {/* Carte Historique avec notes */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 md:p-4 lg:p-6">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <FaFileAlt className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-800">
                  Historique du dossier
                </h2>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                {selectedDetail.history.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 md:gap-3 pb-3 md:pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex-shrink-0 w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full mt-1.5 md:mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 md:gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 text-sm md:text-base truncate">{item.action}</p>
                          <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-0.5 md:mt-1">
                            <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-xs ${getSubStatusColor(item.subStatus)}`}>
                              {getSubStatusLabel(item.subStatus)}
                            </span>
                          </div>
                          {item.note && (
                            <div className="mt-1 md:mt-2 text-xs bg-gray-50 p-2 rounded border-l-2 border-blue-400">
                              <span className="font-medium text-gray-700">Note : </span>
                              <span className="text-gray-600">{item.note}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{item.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 md:mt-1 truncate">Effectué par: {item.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne droite - Informations secondaires */}
          <div className="space-y-3 md:space-y-4 lg:space-y-6">
            {/* Carte Documents */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 md:p-4 lg:p-6">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <FaFileAlt className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-800">
                  Documents attachés
                </h2>
              </div>
              
              <div className="space-y-2 md:space-y-3">
                {selectedDetail.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <div className="h-6 w-6 md:h-8 md:w-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaFileAlt className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-xs md:text-sm truncate">{doc}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-xs md:text-sm font-medium flex items-center gap-0.5 md:gap-1 flex-shrink-0">
                      <FaEye size={10} className="md:size-3" />
                      <span className="hidden sm:inline">Voir</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte Métadonnées */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 md:p-4 lg:p-6">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <FaInfoCircle className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-800">
                  Métadonnées
                </h2>
              </div>
              
              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs md:text-sm text-gray-600">ID interne</span>
                  <span className="font-medium text-xs md:text-sm">{selectedDetail.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs md:text-sm text-gray-600">Dernière mise à jour</span>
                  <span className="font-medium text-xs md:text-sm">{selectedDetail.history[selectedDetail.history.length - 1]?.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs md:text-sm text-gray-600">Nombre d'étapes</span>
                  <span className="font-medium text-xs md:text-sm">{selectedDetail.history.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs md:text-sm text-gray-600">Archivé</span>
                  <span className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs ${selectedDetail.isArchived ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                    {selectedDetail.isArchived ? "Oui" : "Non"}
                  </span>
                </div>
              </div>
            </div>

            {/* Carte Notes actuelles */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 md:p-4 lg:p-6">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <FaInfoCircle className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-800">
                  Notes actuelles
                </h2>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="text-xs text-gray-500 block">Commentaires</label>
                  <p className="mt-1 text-xs md:text-sm text-gray-700 p-2 md:p-3 bg-gray-50 rounded-lg">
                    {selectedDetail.notes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL DANS LA PAGE 2 (vue détail) AVEC NOTE OBLIGATOIRE ET AFFICHAGE EN COLONNES */}
        {showModal && selectedDossier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
            <div className="bg-white rounded-lg md:rounded-xl shadow-lg w-full max-w-lg mx-2 md:mx-0">
              <div className="p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                  <FaEdit className="text-blue-600" />
                  Modifier le statut du dossier
                </h3>

                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-600">Dossier sélectionné :</p>
                  <p className="font-medium text-sm md:text-base">
                    {selectedDossier.dossierNumber} - {selectedDossier.applicant}
                  </p>
                  <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1 md:mt-2">
                    <span className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs ${getStatusColor(selectedDossier.status)}`}>
                      {selectedDossier.status} (actuel)
                    </span>
                    <span className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs ${getSubStatusColor(selectedDossier.subStatus)}`}>
                      {getSubStatusLabel(selectedDossier.subStatus)}
                    </span>
                  </div>
                </div>

                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Changer l'étape
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="">Sélectionner une étape</option>
                    {statusHierarchy.map((status) => (
                      <option 
                        key={status.id} 
                        value={status.id}
                        disabled={status.id === selectedDossier.status}
                      >
                        {status.label} {status.id === selectedDossier.status ? "(actuel)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Décision sur cette étape
                  </label>
                  
                  {/* AFFICHAGE EN 3 COLONNES */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {subStatusOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`
                          border rounded-lg p-3 cursor-pointer transition-all h-full flex flex-col
                          ${newSubStatus === option.id 
                            ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/20' 
                            : 'hover:border-gray-400 hover:bg-gray-50'
                          }
                          ${option.id === 'accepte' && newSubStatus === option.id ? 'bg-green-50' : ''}
                          ${option.id === 'ajourne' && newSubStatus === option.id ? 'bg-yellow-50' : ''}
                          ${option.id === 'rejete' && newSubStatus === option.id ? 'bg-red-50' : ''}
                        `}
                        onClick={() => {
                          setNewSubStatus(option.id);
                          setNoteError("");
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`
                            w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0
                            ${newSubStatus === option.id 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'border-gray-300'
                            }
                          `}>
                            {newSubStatus === option.id && (
                              <FaCheck size={10} className="text-white m-auto" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className={`
                              font-medium text-sm block
                              ${option.id === 'accepte' ? 'text-green-700' : 
                                option.id === 'ajourne' ? 'text-yellow-700' : 
                                'text-red-700'}
                            `}>
                              {option.label}
                            </span>
                            <p className="text-xs text-gray-600 mt-1">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Champ de note obligatoire pour Rejeté et Ajourné */}
                {(newSubStatus === "rejete" || newSubStatus === "ajourne") && (
                  <div className="mb-4 md:mb-6 border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-1 text-red-600">
                        <FaExclamationTriangle size={14} />
                        Note explicative <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <textarea
                      className={`w-full px-3 py-2 border ${
                        noteError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                      rows="4"
                      placeholder={newSubStatus === "rejete" 
                        ? "Veuillez indiquer le motif du rejet du dossier..." 
                        : "Veuillez indiquer les informations complémentaires requises..."
                      }
                      value={statusNote}
                      onChange={(e) => {
                        setStatusNote(e.target.value);
                        if (noteError) setNoteError("");
                      }}
                    ></textarea>
                    {noteError && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <FaExclamationTriangle size={10} />
                        {noteError}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                      <FaInfoCircle size={12} />
                      Cette note sera envoyée au requérant et visible dans l'historique.
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2 md:gap-3 border-t pt-4">
                  <button
                    className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedDossier(null);
                      setNewStatus("");
                      setNewSubStatus("");
                      setStatusNote("");
                      setNoteError("");
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-1"
                    onClick={confirmStatusChange}
                    disabled={!newSubStatus}
                  >
                    <FaCheck size={12} />
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL D'ARCHIVAGE */}
        {showArchiveModal && selectedDossier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-2 md:mx-0">
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full mx-auto mb-3 md:mb-4">
                  <FaArchive className="text-red-600 text-lg md:text-xl" />
                </div>
                
                <h3 className="text-base md:text-lg font-semibold text-gray-800 text-center mb-4 md:mb-6">
                  Archiver le dossier
                </h3>

                <div className="text-center mb-4 md:mb-6">
                  <p className="text-sm text-gray-600 mb-3 md:mb-4">Voulez-vous vraiment archiver ce dossier ?</p>
                  
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg mb-3 md:mb-4">
                    <p className="text-xs md:text-sm text-gray-500 mb-1 md:mb-2">Dossier sélectionné :</p>
                    <p className="font-semibold text-base md:text-lg text-gray-800">{selectedDossier.dossierNumber}</p>
                    <p className="text-sm text-gray-600">{selectedDossier.applicant}</p>
                    
                    <div className="grid grid-cols-2 gap-2 md:gap-4 mt-2 md:mt-4">
                      <div>
                        <p className="text-xs text-gray-500">Statut</p>
                        <span className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs font-medium ${getStatusColor(selectedDossier.status)}`}>
                          {selectedDossier.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Décision</p>
                        <span className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs font-medium ${getSubStatusColor(selectedDossier.subStatus)}`}>
                          {getSubStatusLabel(selectedDossier.subStatus)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-2 md:gap-3">
                      <FaInfoCircle className="text-blue-600 mt-0.5 flex-shrink-0 text-sm md:text-base" />
                      <div className="text-left">
                        <p className="text-xs md:text-sm font-medium text-blue-800 mb-1 md:mb-2">Important à savoir</p>
                        <ul className="text-xs text-blue-700 space-y-0.5 md:space-y-1">
                          <li className="flex items-start gap-1">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Le dossier sera déplacé vers les archives</span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Il ne sera plus visible dans la liste principale</span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>Cette action est définitive et irréversible</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 md:gap-3">
                  <button
                    className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    onClick={() => {
                      setShowArchiveModal(false);
                      setSelectedDossier(null);
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
                    onClick={confirmArchive}
                  >
                    <FaArchive size={12} />
                    Archiver
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Vue liste (originale)
  return (
    <div className="min-h-screen bg-white p-2 md:p-4 lg:p-6">
      <ToastContainer />
      
      {/* En-tête principal */}
      <header className="mb-4 md:mb-6">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-1 md:mb-2">
          Liste de toutes les demandes d'équivalence de diplômes
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-4">
          <p className="text-gray-600 text-xs md:text-sm">
            Gestion complète des dossiers d'équivalence
          </p>
        </div>
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
              placeholder="Rechercher par numéro de dossier, demandeur, diplôme ou statut..."
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
              {statusHierarchy.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bouton de réinitialisation des filtres */}
        {(searchQuery || startDateFilter || endDateFilter || statusFilter) && (
          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={resetAllFilters}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3 h-3 md:w-4 md:h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Réinitialiser tous les filtres
            </button>
          </div>
        )}
      </div>

      {/* Tableau avec pagination */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
        {/* Header table */}
        <div className="px-2 md:px-4 py-2 md:py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-3 bg-white">
          <div className="flex items-center gap-1 md:gap-2">
            <h3 className="font-bold text-gray-800 text-sm md:text-base">
              Liste des dossiers
            </h3>
            {(searchQuery || statusFilter || startDateFilter || endDateFilter) && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                Filtre actif
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="ml-0.5 p-0.5 hover:bg-blue-100 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-2 h-2 md:w-3 md:h-3"
                  >
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </span>
            )}
          </div>

          {/* Sélecteur de lignes */}
          <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
            <span className="text-gray-500 text-xs hidden sm:inline">Lignes :</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="form-select text-xs border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 py-0.5 md:py-1 px-1 md:px-2 bg-gray-50"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Content table - Responsive */}
        <div className="w-full overflow-x-auto -mx-2 md:mx-0">
          <table className="w-full min-w-full divide-y divide-gray-100 text-xs">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-2 md:px-4 py-1.5 md:py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSortClick("id")}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors w-full text-left"
                  >
                    <span>ID</span>
                    <SortIcon
                      isSorted={sortBy === "id"}
                      isAsc={sortDirection === "asc"}
                    />
                  </button>
                </th>
                <th className="px-2 md:px-4 py-1.5 md:py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSortClick("dossier")}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors w-full text-left"
                  >
                    <span>N° DOSSIER</span>
                    <SortIcon
                      isSorted={sortBy === "dossier"}
                      isAsc={sortDirection === "asc"}
                    />
                  </button>
                </th>
                <th className="px-2 md:px-4 py-1.5 md:py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSortClick("demandeur")}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors w-full text-left"
                  >
                    <span>DEMANDEUR</span>
                    <SortIcon
                      isSorted={sortBy === "demandeur"}
                      isAsc={sortDirection === "asc"}
                    />
                  </button>
                </th>
                <th className="px-2 md:px-4 py-1.5 md:py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  TYPE DE DIPLÔME
                </th>
                <th className="px-2 md:px-4 py-1.5 md:py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  <button
                    onClick={() => handleSortClick("date")}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors w-full text-left"
                  >
                    <span>DATE</span>
                    <SortIcon
                      isSorted={sortBy === "date"}
                      isAsc={sortDirection === "asc"}
                    />
                  </button>
                </th>
                <th className="px-2 md:px-4 py-1.5 md:py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  STATUT
                </th>
                <th className="px-2 md:px-4 py-1.5 md:py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedEquivalences.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-2 md:px-4 py-4 md:py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="h-8 w-8 md:h-12 md:w-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 md:mb-3">
                        <FaSearch className="h-4 w-4 md:h-6 md:w-6 text-gray-400" />
                      </div>
                      <p className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                        Aucun dossier trouvé
                      </p>
                      <p className="text-xs text-gray-400 mb-3 md:mb-4">
                        Aucun résultat ne correspond à vos critères de recherche.
                      </p>
                      {(searchQuery || statusFilter || startDateFilter || endDateFilter) && (
                        <button
                          onClick={resetAllFilters}
                          className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Réinitialiser les filtres
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedEquivalences.map((eq) => (
                  <tr
                    key={eq.id}
                    className="hover:bg-blue-50/30 transition-colors group cursor-default"
                  >
                    <td className="px-2 md:px-4 py-1.5 md:py-3 whitespace-nowrap">
                      <div className="font-mono text-xs bg-gray-100 px-1.5 md:px-3 py-0.5 md:py-1 rounded inline-block">
                        {eq.id}
                      </div>
                    </td>
                    <td className="px-2 md:px-4 py-1.5 md:py-3 whitespace-nowrap">
                      <div className="font-mono text-xs bg-gray-100 px-1.5 md:px-3 py-0.5 md:py-1 rounded inline-block">
                        {eq.dossierNumber}
                      </div>
                    </td>
                    <td className="px-2 md:px-4 py-1.5 md:py-3 whitespace-nowrap">
                      <div className="flex items-center min-w-0">
                        <FaUserCircle className="h-4 w-4 md:h-5 md:w-5 text-gray-400 mr-1 md:mr-3 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium text-gray-800 text-xs truncate">
                            {eq.applicant}
                          </div>
                          <div className="text-xs text-gray-500 md:hidden truncate">
                            {eq.qualification}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 md:px-4 py-1.5 md:py-3 whitespace-nowrap text-center">
                      <span className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs inline-block ${
                        eq.qualification === "Licence" ? "bg-blue-100 text-blue-800" :
                        eq.qualification === "Master" ? "bg-purple-100 text-purple-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {eq.qualification}
                      </span>
                    </td>
                    <td className="px-2 md:px-4 py-1.5 md:py-3 whitespace-nowrap text-gray-600 text-xs hidden md:table-cell">
                      {eq.submittedDate}
                    </td>
                    <td className="px-2 md:px-4 py-1.5 md:py-3 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5 md:gap-1">
                        <span className={`px-1.5 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-medium ${getStatusColor(eq.status)}`}>
                          {eq.status}
                        </span>
                        <span className={`px-1.5 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-medium ${getSubStatusColor(eq.subStatus)}`}>
                          {getSubStatusLabel(eq.subStatus)}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 md:px-4 py-1.5 md:py-3 whitespace-nowrap">
                      <div className="flex gap-1 md:gap-2">
                        <button
                          className="p-1 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir le dossier"
                          onClick={() => openDetailView(eq)}
                        >
                          <FaEye size={12} className="md:size-4" />
                        </button>
                        <button
                          className="p-1 md:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Modifier le statut"
                          onClick={() => openStatusModal(eq)}
                        >
                          <FaEdit size={12} className="md:size-4" />
                        </button>
                        <button
                          className="p-1 md:p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Archiver le dossier"
                          onClick={() => archiveDossier(eq)}
                          disabled={eq.status !== "Octroyé" && eq.subStatus !== "rejete" && eq.subStatus !== "ajourne"}
                        >
                          <FaArchive size={12} className="md:size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination - Responsive */}
        <div className="bg-white px-2 md:px-4 py-2 md:py-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-3">
          <div className="text-xs text-gray-600">
            Affichage de {startIndex + 1} à {Math.min(startIndex + pageSize, sortedEquivalences.length)} sur {sortedEquivalences.length} dossiers
          </div>
          
          <div className="flex items-center gap-0.5 md:gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 md:p-1.5 border rounded disabled:opacity-50 hover:bg-gray-50"
            >
              <FaAngleLeft className="w-2 h-2 md:w-3 md:h-3" />
            </button>

            <div className="flex items-center gap-0.5 md:gap-1 mx-1 md:mx-2">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 3) {
                  pageNum = i + 1;
                } else if (currentPage <= 2) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - 2 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }

                return pageNum <= totalPages ? (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-1.5 md:px-2.5 py-0.5 md:py-1 text-xs border rounded ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white hover:bg-gray-50 border-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                ) : null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 md:p-1.5 border rounded disabled:opacity-50 hover:bg-gray-50"
            >
              <FaAngleRight className="w-2 h-2 md:w-3 md:h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE MODIFICATION DU STATUT DANS LA PAGE 1 - AVEC AFFICHAGE EN 3 COLONNES */}
      {viewMode === "list" && showModal && selectedDossier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg w-full max-w-lg mx-2 md:mx-0">
            <div className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
                <FaEdit className="text-blue-600" />
                Modifier le statut du dossier
              </h3>

              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-lg">
                <p className="text-xs md:text-sm text-gray-600">Dossier sélectionné :</p>
                <p className="font-medium text-sm md:text-base">
                  {selectedDossier.dossierNumber} - {selectedDossier.applicant}
                </p>
                <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1 md:mt-2">
                  <span className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs ${getStatusColor(selectedDossier.status)}`}>
                    {selectedDossier.status} (actuel)
                  </span>
                  <span className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs ${getSubStatusColor(selectedDossier.subStatus)}`}>
                    {getSubStatusLabel(selectedDossier.subStatus)}
                  </span>
                </div>
              </div>

              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Changer l'étape
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="">Sélectionner une étape</option>
                  {statusHierarchy.map((status) => (
                    <option 
                      key={status.id} 
                      value={status.id}
                      disabled={status.id === selectedDossier.status}
                    >
                      {status.label} {status.id === selectedDossier.status ? "(actuel)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Décision sur cette étape
                </label>
                
                {/* AFFICHAGE EN 3 COLONNES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {subStatusOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`
                        border rounded-lg p-3 cursor-pointer transition-all h-full flex flex-col
                        ${newSubStatus === option.id 
                          ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/20' 
                          : 'hover:border-gray-400 hover:bg-gray-50'
                        }
                        ${option.id === 'accepte' && newSubStatus === option.id ? 'bg-green-50' : ''}
                        ${option.id === 'ajourne' && newSubStatus === option.id ? 'bg-yellow-50' : ''}
                        ${option.id === 'rejete' && newSubStatus === option.id ? 'bg-red-50' : ''}
                      `}
                      onClick={() => {
                        setNewSubStatus(option.id);
                        setNoteError("");
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`
                          w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0
                          ${newSubStatus === option.id 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-300'
                          }
                        `}>
                          {newSubStatus === option.id && (
                            <FaCheck size={10} className="text-white m-auto" />
                          )}
                        </div>
                        <div className="flex-1">
                          <span className={`
                            font-medium text-sm block
                            ${option.id === 'accepte' ? 'text-green-700' : 
                              option.id === 'ajourne' ? 'text-yellow-700' : 
                              'text-red-700'}
                          `}>
                            {option.label}
                          </span>
                          <p className="text-xs text-gray-600 mt-1">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Champ de note obligatoire pour Rejeté et Ajourné */}
              {(newSubStatus === "rejete" || newSubStatus === "ajourne") && (
                <div className="mb-4 md:mb-6 border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-1 text-red-600">
                      <FaExclamationTriangle size={14} />
                      Note explicative <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <textarea
                    className={`w-full px-3 py-2 border ${
                      noteError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    rows="4"
                    placeholder={newSubStatus === "rejete" 
                      ? "Veuillez indiquer le motif du rejet du dossier..." 
                      : "Veuillez indiquer les informations complémentaires requises..."
                    }
                    value={statusNote}
                    onChange={(e) => {
                      setStatusNote(e.target.value);
                      if (noteError) setNoteError("");
                    }}
                  ></textarea>
                  {noteError && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <FaExclamationTriangle size={10} />
                      {noteError}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <FaInfoCircle size={12} />
                    Cette note sera envoyée au requérant et visible dans l'historique.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 md:gap-3 border-t pt-4">
                <button
                  className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedDossier(null);
                    setNewStatus("");
                    setNewSubStatus("");
                    setStatusNote("");
                    setNoteError("");
                  }}
                >
                  Annuler
                </button>
                <button
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-1"
                  onClick={confirmStatusChange}
                  disabled={!newSubStatus}
                >
                  <FaCheck size={12} />
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL D'ARCHIVAGE DANS LA PAGE 1 */}
      {viewMode === "list" && showArchiveModal && selectedDossier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-2 md:mx-0">
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full mx-auto mb-3 md:mb-4">
                <FaArchive className="text-red-600 text-lg md:text-xl" />
              </div>
              
              <h3 className="text-base md:text-lg font-semibold text-gray-800 text-center mb-4 md:mb-6">
                Archiver le dossier
              </h3>

              <div className="text-center mb-4 md:mb-6">
                <p className="text-sm text-gray-600 mb-3 md:mb-4">Voulez-vous vraiment archiver ce dossier ?</p>
                
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg mb-3 md:mb-4">
                  <p className="text-xs md:text-sm text-gray-500 mb-1 md:mb-2">Dossier sélectionné :</p>
                  <p className="font-semibold text-base md:text-lg text-gray-800">{selectedDossier.dossierNumber}</p>
                  <p className="text-sm text-gray-600">{selectedDossier.applicant}</p>
                  
                  <div className="grid grid-cols-2 gap-2 md:gap-4 mt-2 md:mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Statut</p>
                      <span className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs font-medium ${getStatusColor(selectedDossier.status)}`}>
                        {selectedDossier.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Décision</p>
                      <span className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs font-medium ${getSubStatusColor(selectedDossier.subStatus)}`}>
                        {getSubStatusLabel(selectedDossier.subStatus)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-2 md:gap-3">
                    <FaInfoCircle className="text-blue-600 mt-0.5 flex-shrink-0 text-sm md:text-base" />
                    <div className="text-left">
                      <p className="text-xs md:text-sm font-medium text-blue-800 mb-1 md:mb-2">Important à savoir</p>
                      <ul className="text-xs text-blue-700 space-y-0.5 md:space-y-1">
                        <li className="flex items-start gap-1">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Le dossier sera déplacé vers les archives</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Il ne sera plus visible dans la liste principale</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Cette action est définitive et irréversible</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 md:gap-3">
                <button
                  className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  onClick={() => {
                    setShowArchiveModal(false);
                    setSelectedDossier(null);
                  }}
                >
                  Annuler
                </button>
                <button
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
                  onClick={confirmArchive}
                >
                  <FaArchive size={12} />
                  Archiver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquivalenceView;