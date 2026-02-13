import React, { useState } from "react";
import {
  FaArchive,
  FaRedo,
  FaEye,
  FaSearch,
  FaAngleLeft,
  FaAngleRight,
  FaSort,
  FaUserCircle,
  FaGraduationCap,
  FaUniversity,
  FaCalendarAlt,
  FaInfoCircle,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";

// Réutilisation des mêmes statuts et couleurs pour la cohérence
const statusHierarchy = [
  { id: "SAE", label: "SAE" },
  { id: "CNE", label: "CNE" },
  { id: "SG", label: "SG" },
  { id: "Ministre", label: "Ministre" },
  { id: "PM", label: "PM" },
  // Octroyé a été retiré des niveaux
];

// Fonctions de couleur réutilisées
const getStatusColor = (status) => {
  switch (status) {
    case "SAE": return "bg-gray-100 text-gray-800 border border-gray-200";
    case "CNE": return "bg-blue-50 text-blue-700 border border-blue-100";
    case "SG": return "bg-purple-50 text-purple-700 border border-purple-100";
    case "Ministre": return "bg-yellow-50 text-yellow-700 border border-yellow-100";
    case "PM": return "bg-green-50 text-green-700 border border-green-100";
    default: return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

const getSubStatusColor = (subStatus) => {
  if (subStatus === "terminé") return "bg-blue-100 text-blue-800 border-blue-200";
  if (subStatus === "accepte") return "bg-green-100 text-green-800 border-green-200";
  if (subStatus === "ajourne") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (subStatus === "rejete") return "bg-red-100 text-red-800 border-red-200";
  return "bg-gray-100 text-gray-800 border-gray-200";
};

const getSubStatusLabel = (subStatus) => {
  if (subStatus === "terminé") return "Terminé";
  if (subStatus === "accepte") return "Accepté";
  if (subStatus === "ajourne") return "Ajourné";
  if (subStatus === "rejete") return "Rejeté";
  return "En cours";
};

const ArchiveEquivalenceView = () => {
  // État pour les dossiers archivés
  const [archivedEquivalences, setArchivedEquivalences] = useState([
    {
      id: 3,
      dossierNumber: "DOS-2023-003",
      applicant: "Pierre Bernard",
      qualification: "Doctorat",
      status: "PM", // Changé de "Octroyé" à "PM"
      subStatus: "terminé",
      submittedDate: "2023-03-15",
      archivedDate: "2023-04-02",
      archivedBy: "Administrateur",
      email: "pierre.bernard@email.com",
      phone: "+33 6 34 56 78 90",
      address: "789 Boulevard Maritime, 13000 Marseille, France",
      institution: "École Technique Supérieure",
      country: "France",
      year: "2020",
      notes: "Dossier octroyé avec succès (Archivé)",
      documents: ["Diplôme technique", "Certificat de travail", "Attestation"],
      history: [
        { date: "2023-03-15", action: "Soumission", user: "Système", status: "SAE", subStatus: "accepte" },
        { date: "2023-03-18", action: "Validation SAE", user: "Agent SAE", status: "SAE", subStatus: "accepte" },
        { date: "2023-03-20", action: "Validation CNE", user: "Expert CNE", status: "CNE", subStatus: "accepte" },
        { date: "2023-03-22", action: "Validation SG", user: "Secrétaire Général", status: "SG", subStatus: "accepte" },
        { date: "2023-03-25", action: "Validation Ministre", user: "Ministre", status: "Ministre", subStatus: "accepte" },
        { date: "2023-03-28", action: "Validation PM", user: "Premier Ministre", status: "PM", subStatus: "accepte" },
        { date: "2023-03-30", action: "Dossier octroyé", user: "Système", status: "PM", subStatus: "terminé" },
        { date: "2023-04-02", action: "Dossier archivé", user: "Administrateur", status: "PM", subStatus: "terminé" },
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
      archiveReason: "Octroyé", // Octroyé reste ici comme raison d'archivage
    },
    {
      id: 5,
      dossierNumber: "DOS-2023-005",
      applicant: "Isabelle Moreau",
      qualification: "Master",
      status: "CNE",
      subStatus: "rejete",
      submittedDate: "2023-04-10",
      archivedDate: "2023-05-15",
      archivedBy: "Superviseur CNE",
      email: "isabelle.moreau@email.com",
      phone: "+33 6 45 67 89 01",
      address: "321 Rue de la République, 44000 Nantes, France",
      institution: "Université de Nantes",
      country: "France",
      year: "2022",
      notes: "Dossier rejeté - Diplôme non conforme (Archivé)",
      documents: ["Diplôme", "Relevé de notes", "Pièce d'identité"],
      history: [
        { date: "2023-04-10", action: "Soumission", user: "Système", status: "SAE", subStatus: "accepte" },
        { date: "2023-04-12", action: "Pré-évaluation", user: "Agent SAE", status: "SAE", subStatus: "accepte" },
        { date: "2023-04-15", action: "Transmis à CNE", user: "Superviseur", status: "CNE", subStatus: "accepte" },
        { date: "2023-04-20", action: "Évaluation CNE", user: "Expert CNE", status: "CNE", subStatus: "rejete" },
        { date: "2023-05-15", action: "Dossier archivé", user: "Superviseur CNE", status: "CNE", subStatus: "rejete" },
      ],
      motif: "ecole_doctorale",
      type_diplome: "Master",
      nom: "Moreau",
      prenoms: "Isabelle",
      code_postal: "44000 Nantes",
      recapitulatif_formation: [
        {
          annee_obtention: "2022",
          diplome: "Master en Droit",
          mention: "Passable",
          parcours_option_specialite: "Droit des Affaires",
          etablissement: "Université de Nantes",
        },
      ],
      destinataire: "Madame/Monsieur le Ministre de l'Enseignement Supérieur",
      isArchived: true,
      archiveReason: "Rejeté",
    },
    {
      id: 7,
      dossierNumber: "DOS-2023-007",
      applicant: "Thomas Petit",
      qualification: "Licence",
      status: "SAE",
      subStatus: "ajourne",
      submittedDate: "2023-06-05",
      archivedDate: "2023-07-20",
      archivedBy: "Agent SAE",
      email: "thomas.petit@email.com",
      phone: "+33 6 56 78 90 12",
      address: "159 Avenue de la Liberté, 59000 Lille, France",
      institution: "Université de Lille",
      country: "France",
      year: "2021",
      notes: "Dossier ajourné - Documents incomplets (Archivé)",
      documents: ["Diplôme", "Relevé de notes", "Pièce d'identité"],
      history: [
        { date: "2023-06-05", action: "Soumission", user: "Système", status: "SAE", subStatus: "accepte" },
        { date: "2023-06-08", action: "Vérification", user: "Agent SAE", status: "SAE", subStatus: "ajourne" },
        { date: "2023-06-20", action: "Relance", user: "Agent SAE", status: "SAE", subStatus: "ajourne" },
        { date: "2023-07-20", action: "Dossier archivé", user: "Agent SAE", status: "SAE", subStatus: "ajourne" },
      ],
      motif: "inscription",
      type_diplome: "Licence",
      nom: "Petit",
      prenoms: "Thomas",
      code_postal: "59000 Lille",
      recapitulatif_formation: [
        {
          annee_obtention: "2021",
          diplome: "Licence en Lettres",
          mention: "Assez Bien",
          parcours_option_specialite: "Littérature Française",
          etablissement: "Université de Lille",
        },
      ],
      destinataire: "Madame/Monsieur le Ministre de l'Enseignement Supérieur",
      isArchived: true,
      archiveReason: "Ajourné",
    },
  ]);

  // États pour la vue principale
  const [searchQuery, setSearchQuery] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [archiveReasonFilter, setArchiveReasonFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("archivedDate");
  const [sortDirection, setSortDirection] = useState("desc");
  
  // États pour la vue détail et modals
  const [viewMode, setViewMode] = useState("list");
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState(null);

  // Options pour le filtre de raison d'archivage (décision)
  const archiveReasonOptions = [
    "Octroyé",
    "Rejeté",
    "Ajourné",
  ];

  // Filtrer les données
  const filteredArchives = archivedEquivalences.filter((eq) => {
    const matchesSearch = searchQuery
      ? eq.dossierNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (eq.archiveReason && eq.archiveReason.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    const archivedDate = new Date(eq.archivedDate);
    const startDate = startDateFilter ? new Date(startDateFilter) : null;
    const endDate = endDateFilter ? new Date(endDateFilter) : null;

    const matchesDateRange =
      (!startDate || archivedDate >= startDate) &&
      (!endDate || archivedDate <= endDate);

    const matchesStatus = statusFilter ? eq.status === statusFilter : true;
    const matchesArchiveReason = archiveReasonFilter ? eq.archiveReason === archiveReasonFilter : true;

    return matchesSearch && matchesDateRange && matchesStatus && matchesArchiveReason;
  });

  // Trier les données
  const sortedArchives = [...filteredArchives].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "id") {
      comparison = a.id - b.id;
    } else if (sortBy === "archivedDate") {
      const dateA = new Date(a.archivedDate);
      const dateB = new Date(b.archivedDate);
      comparison = dateA - dateB;
    } else if (sortBy === "dossier") {
      comparison = a.dossierNumber.localeCompare(b.dossierNumber);
    } else if (sortBy === "demandeur") {
      comparison = a.applicant.localeCompare(b.applicant);
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedArchives.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedArchives = sortedArchives.slice(startIndex, startIndex + pageSize);

  // Réinitialiser tous les filtres
  const resetAllFilters = () => {
    setSearchQuery("");
    setStartDateFilter("");
    setEndDateFilter("");
    setStatusFilter("");
    setArchiveReasonFilter("");
    setCurrentPage(1);
  };

  // Ouvrir vue détail
  const openDetailView = (dossier) => {
    setSelectedDetail(dossier);
    setViewMode("detail");
  };

  // Retour à la liste
  const backToList = () => {
    setViewMode("list");
    setSelectedDetail(null);
  };

  // Restaurer un dossier
  const restoreDossier = (dossier) => {
    setSelectedDossier(dossier);
    setShowRestoreModal(true);
  };

  // Confirmer la restauration
  const confirmRestore = () => {
    if (selectedDossier) {
      const updatedArchives = archivedEquivalences.filter(
        (eq) => eq.id !== selectedDossier.id
      );
      setArchivedEquivalences(updatedArchives);
      
      if (selectedDetail && selectedDetail.id === selectedDossier.id) {
        setViewMode("list");
        setSelectedDetail(null);
      }
      
      setShowRestoreModal(false);
      setSelectedDossier(null);
      
      alert(`Le dossier ${selectedDossier.dossierNumber} a été restauré avec succès.`);
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

  // Vue détail d'un dossier archivé
  if (viewMode === "detail" && selectedDetail) {
    return (
      <div className="min-h-screen bg-white p-2 md:p-4 lg:p-6">
        {/* Header de la vue détail */}
        <div className="mb-4 md:mb-6">
          <button
            onClick={backToList}
            className="flex items-center gap-1 md:gap-2 text-blue-600 hover:text-blue-800 mb-2 md:mb-4 text-xs md:text-sm"
          >
            <FaArrowLeft size={12} className="md:size-4" />
            <span>Retour aux archives</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
                Archives des demandes d'équivalence de diplômes
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
                <span className="bg-gray-200 text-gray-800 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-medium">
                  Archivé
                </span>
              </div>
            </div>
            <div className="flex gap-1 md:gap-2 mt-2 md:mt-4 lg:mt-0">
              <button
                onClick={() => restoreDossier(selectedDetail)}
                className="flex items-center gap-1 md:gap-2 bg-green-600 text-white px-2 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-green-700 text-xs md:text-sm transition-all duration-200"
              >
                <FaRedo size={10} className="md:size-3" />
                <span className="hidden sm:inline">Restaurer le dossier</span>
                <span className="sm:hidden">Restaurer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informations d'archivage */}
        <div className="mb-4 md:mb-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 md:p-4">
            <div className="flex items-start gap-2 md:gap-3">
              <FaInfoCircle className="text-amber-600 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <h3 className="text-sm md:text-base font-semibold text-amber-800 mb-1">
                  Informations d'archivage
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
                  <div>
                    <span className="text-amber-700">Date d'archivage :</span>
                    <span className="ml-1 font-medium text-amber-900">{selectedDetail.archivedDate}</span>
                  </div>
                  <div>
                    <span className="text-amber-700">Archivé par :</span>
                    <span className="ml-1 font-medium text-amber-900">{selectedDetail.archivedBy || "Administrateur"}</span>
                  </div>
                  <div>
                    <span className="text-amber-700">Raison :</span>
                    <span className="ml-1 font-medium text-amber-900">{selectedDetail.archiveReason || "Archivage système"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu détail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {/* Colonne gauche */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4 lg:space-y-6">
            {/* Informations personnelles */}
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
                    <p className="font-medium text-sm md:text-base">{selectedDetail.email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">Téléphone</label>
                    <p className="font-medium text-sm md:text-base">{selectedDetail.phone}</p>
                  </div>
                </div>
                
                <div className="space-y-2 md:space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 block">Adresse</label>
                    <p className="font-medium text-sm md:text-base">{selectedDetail.address}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block">Date de soumission</label>
                    <p className="font-medium text-sm md:text-base">{selectedDetail.submittedDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations académiques */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 md:p-4 lg:p-6">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <FaGraduationCap className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-800">
                  Informations académiques
                </h2>
              </div>
              
              <div className="mb-3 md:mb-4">
                <label className="text-xs text-gray-500 block">Type de diplôme</label>
                <div className="flex items-center gap-1 md:gap-2 mt-1">
                  <span className="px-2 py-0.5 md:px-2 md:py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
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

            {/* Historique */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 md:p-4 lg:p-6">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <FaCalendarAlt className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-800">
                  Historique complet du dossier
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

          {/* Colonne droite */}
          <div className="space-y-3 md:space-y-4 lg:space-y-6">
            {/* Documents */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 md:p-4 lg:p-6">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <FaArchive className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-800">
                  Documents attachés
                </h2>
              </div>
              
              <div className="space-y-2 md:space-y-3">
                {selectedDetail.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <div className="h-6 w-6 md:h-8 md:w-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaArchive className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
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

            {/* Métadonnées */}
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
                  <span className="text-xs md:text-sm text-gray-600">Date d'archivage</span>
                  <span className="font-medium text-xs md:text-sm">{selectedDetail.archivedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs md:text-sm text-gray-600">Archivé par</span>
                  <span className="font-medium text-xs md:text-sm">{selectedDetail.archivedBy || "Administrateur"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs md:text-sm text-gray-600">Raison d'archivage</span>
                  <span className="font-medium text-xs md:text-sm">{selectedDetail.archiveReason || "Non spécifiée"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs md:text-sm text-gray-600">Dernière mise à jour</span>
                  <span className="font-medium text-xs md:text-sm">{selectedDetail.history[selectedDetail.history.length - 1]?.date}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 md:p-4 lg:p-6">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <FaInfoCircle className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
                <h2 className="text-base md:text-lg font-semibold text-gray-800">
                  Notes
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
      </div>
    );
  }

  // Vue liste des archives
  return (
    <div className="min-h-screen bg-white p-2 md:p-4 lg:p-6">
      {/* En-tête principal */}
      <header className="mb-4 md:mb-6">
        <div className="mb-1 md:mb-2">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
            Archives des demandes d'équivalence de diplômes
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-4">
          <p className="text-gray-600 text-xs md:text-sm">
            Consultation et gestion des dossiers archivés
          </p>
          <div className="text-xs md:text-sm bg-gray-100 px-3 py-1.5 rounded-lg">
            <span className="font-medium">{archivedEquivalences.length}</span> dossier(s) archivé(s)
          </div>
        </div>
      </header>

      {/* FILTRES - Affichage permanent */}
      <div className="mb-4 md:mb-6 bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-3 md:p-4">
          {/* Barre de recherche */}
          <div className="mb-3 md:mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Recherche globale
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
                placeholder="Rechercher par numéro, demandeur, diplôme, niveau, décision..."
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
            {/* Filtre par date d'archivage - Début */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Date archivage (début)
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

            {/* Filtre par date d'archivage - Fin */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Date archivage (fin)
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

            {/* Filtre par niveau (anciennement statut) */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Niveau
              </label>
              <select
                className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Tous les niveaux</option>
                {statusHierarchy.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par décision (Ajourné/Rejeté/Octroyé) */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Décision
              </label>
              <select
                className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm"
                value={archiveReasonFilter}
                onChange={(e) => {
                  setArchiveReasonFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Toutes les décisions</option>
                {archiveReasonOptions.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bouton de réinitialisation des filtres */}
          {(searchQuery || startDateFilter || endDateFilter || statusFilter || archiveReasonFilter) && (
            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={resetAllFilters}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <FaTimes className="w-3 h-3" />
                Réinitialiser tous les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tableau des archives */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
        {/* Header table */}
        <div className="px-2 md:px-4 py-2 md:py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-3 bg-white">
          <div className="flex items-center gap-1 md:gap-2">
            <h3 className="font-bold text-gray-800 text-sm md:text-base">
              Liste des dossiers archivés
            </h3>
            {(searchQuery || statusFilter || startDateFilter || endDateFilter || archiveReasonFilter) && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100">
                Filtre actif
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="ml-0.5 p-0.5 hover:bg-amber-100 rounded-full"
                >
                  <FaTimes className="w-2 h-2 md:w-3 md:h-3" />
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

        {/* Content table */}
        <div className="w-full overflow-x-auto -mx-2 md:mx-0">
          <table className="w-full min-w-full divide-y divide-gray-100 text-xs">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-2 md:px-4 py-1.5 md:py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSortClick("id")}
                    className="flex items-center justify-center gap-1 hover:text-blue-600 transition-colors w-full"
                  >
                    <span>ID</span>
                    <SortIcon
                      isSorted={sortBy === "id"}
                      isAsc={sortDirection === "asc"}
                    />
                  </button>
                </th>
                <th className="px-2 md:px-4 py-1.5 md:py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSortClick("dossier")}
                    className="flex items-center justify-center gap-1 hover:text-blue-600 transition-colors w-full"
                  >
                    <span>N° DOSSIER</span>
                    <SortIcon
                      isSorted={sortBy === "dossier"}
                      isAsc={sortDirection === "asc"}
                    />
                  </button>
                </th>
                <th className="px-2 md:px-4 py-1.5 md:py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSortClick("demandeur")}
                    className="flex items-center justify-center gap-1 hover:text-blue-600 transition-colors w-full"
                  >
                    <span>DEMANDEUR</span>
                    <SortIcon
                      isSorted={sortBy === "demandeur"}
                      isAsc={sortDirection === "asc"}
                    />
                  </button>
                </th>
                <th className="px-2 md:px-4 py-1.5 md:py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  DIPLÔME
                </th>
                <th className="px-2 md:px-4 py-1.5 md:py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  NIVEAUX
                </th>
                <th className="px-2 md:px-4 py-1.5 md:py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  DÉCISION
                </th>
                <th className="px-2 md:px-4 py-1.5 md:py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  RAISON ARCHIVAGE
                </th>
                <th className="px-2 md:px-4 py-1.5 md:py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSortClick("archivedDate")}
                    className="flex items-center justify-center gap-1 hover:text-blue-600 transition-colors w-full"
                  >
                    <span>DATE ARCHIVE</span>
                    <SortIcon
                      isSorted={sortBy === "archivedDate"}
                      isAsc={sortDirection === "asc"}
                    />
                  </button>
                </th>
                <th className="px-2 md:px-4 py-1.5 md:py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedArchives.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-2 md:px-4 py-4 md:py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="h-8 w-8 md:h-12 md:w-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 md:mb-3">
                        <FaArchive className="h-4 w-4 md:h-6 md:w-6 text-gray-400" />
                      </div>
                      <p className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                        Aucun dossier archivé trouvé
                      </p>
                      <p className="text-xs text-gray-400 mb-3 md:mb-4">
                        Aucun résultat ne correspond à vos critères de recherche.
                      </p>
                      {(searchQuery || statusFilter || startDateFilter || endDateFilter || archiveReasonFilter) && (
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
                paginatedArchives.map((eq) => (
                  <tr
                    key={eq.id}
                    className="hover:bg-amber-50/30 transition-colors group cursor-default text-center"
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
                      <div className="flex items-center justify-center min-w-0">
                        <FaUserCircle className="h-4 w-4 md:h-5 md:w-5 text-gray-400 mr-1 md:mr-3 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium text-gray-800 text-xs truncate">
                            {eq.applicant}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 md:px-4 py-1.5 md:py-3 whitespace-nowrap">
                      <span className="px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs inline-block bg-gray-100 text-gray-800">
                        {eq.qualification}
                      </span>
                    </td>
                    <td className="px-2 md:px-4 py-1.5 md:py-3 whitespace-nowrap">
                      <span className={`px-1.5 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-medium ${getStatusColor(eq.status)}`}>
                        {eq.status}
                      </span>
                    </td>
                    <td className="px-2 md:px-4 py-1.5 md:py-3 whitespace-nowrap">
                      <span className={`px-1.5 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-medium ${getSubStatusColor(eq.subStatus)}`}>
                        {getSubStatusLabel(eq.subStatus)}
                      </span>
                    </td>
                    <td className="px-2 md:px-4 py-1.5 md:py-3 whitespace-nowrap hidden lg:table-cell">
                      <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 max-w-[150px] truncate inline-block">
                        {eq.archiveReason || "Archivage système"}
                      </span>
                    </td>
                    <td className="px-2 md:px-4 py-1.5 md:py-3 whitespace-nowrap text-gray-600 text-xs">
                      {eq.archivedDate}
                    </td>
                    <td className="px-2 md:px-4 py-1.5 md:py-3 whitespace-nowrap">
                      <div className="flex gap-1 md:gap-2 justify-center">
                        <button
                          className="p-1 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Consulter le dossier"
                          onClick={() => openDetailView(eq)}
                        >
                          <FaEye size={12} className="md:size-4" />
                        </button>
                        <button
                          className="p-1 md:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Restaurer le dossier"
                          onClick={() => restoreDossier(eq)}
                        >
                          <FaRedo size={12} className="md:size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination */}
        <div className="bg-white px-2 md:px-4 py-2 md:py-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-3">
          <div className="text-xs text-gray-600">
            Affichage de {startIndex + 1} à {Math.min(startIndex + pageSize, sortedArchives.length)} sur {sortedArchives.length} dossiers archivés
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

      {/* Modal de confirmation de restauration */}
      {showRestoreModal && selectedDossier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-2 md:mx-0">
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full mx-auto mb-3 md:mb-4">
                <FaRedo className="text-green-600 text-lg md:text-xl" />
              </div>
              
              <h3 className="text-base md:text-lg font-semibold text-gray-800 text-center mb-4 md:mb-6">
                Restaurer le dossier
              </h3>

              <div className="text-center mb-4 md:mb-6">
                <p className="text-sm text-gray-600 mb-3 md:mb-4">
                  Voulez-vous vraiment restaurer ce dossier depuis les archives ?
                </p>
                
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg mb-3 md:mb-4">
                  <p className="text-xs md:text-sm text-gray-500 mb-1 md:mb-2">Dossier sélectionné :</p>
                  <p className="font-semibold text-base md:text-lg text-gray-800">{selectedDossier.dossierNumber}</p>
                  <p className="text-sm text-gray-600">{selectedDossier.applicant}</p>
                  
                  <div className="grid grid-cols-2 gap-2 md:gap-4 mt-2 md:mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Niveau</p>
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
                  
                  <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Date d'archivage</p>
                    <p className="text-sm font-medium text-gray-800">{selectedDossier.archivedDate}</p>
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
                          <span>Le dossier sera retiré des archives</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Il sera de nouveau visible dans la liste principale</span>
                        </li>
                        <li className="flex items-start gap-1">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>L'historique complet du dossier sera conservé</span>
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
                    setShowRestoreModal(false);
                    setSelectedDossier(null);
                  }}
                >
                  Annuler
                </button>
                <button
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  onClick={confirmRestore}
                >
                  Restaurer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveEquivalenceView;