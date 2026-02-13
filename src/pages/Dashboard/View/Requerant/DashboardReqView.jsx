import React, { useState } from "react";
import {
  FaFileAlt,
  FaCheck,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaUniversity,
  FaDownload,
  FaUser,
  FaCircle,
  FaEye,
  FaCalendarAlt,
  FaPlus,
} from "react-icons/fa";

// --- Configuration des timelines par niveau de diplôme ---
const timelinesConfig = {
  Licence: [
    {
      titre: "Dépôt du dossier",
      description: "Votre dossier a été soumis avec succès sur la plateforme.",
      status: "completed",
    },
    {
      titre: "Vérification administrative (SAE)",
      description:
        "Vérification des pièces justificatives et documents requis.",
      status: "completed",
    },
    {
      titre: "Évaluation pédagogique (CNE)",
      description: "Analyse du parcours académique et validation des crédits.",
      status: "current",
    },
    {
      titre: "Décision de la Commission",
      description: "Délibération et prise de décision par la commission.",
      status: "upcoming",
    },
    {
      titre: "Délivrance de l'attestation",
      description: "Émission et signature de l'attestation d'équivalence.",
      status: "upcoming",
    },
  ],
  Master: [
    {
      titre: "Dépôt du dossier",
      description: "Votre dossier a été soumis avec succès sur la plateforme.",
      status: "completed",
    },
    {
      titre: "Vérification administrative (SAE)",
      description: "Examen complet des documents administratifs requis.",
      status: "completed",
    },
    {
      titre: "Expertise pédagogique (CNE)",
      description:
        "Évaluation approfondie du programme de master et du mémoire.",
      status: "current",
    },
    {
      titre: "Validation par la Commission",
      description: "Validation finale par la commission d'expertise.",
      status: "upcoming",
    },
    {
      titre: "Signature et délivrance",
      description: "Signature de l'arrêté et délivrance du document officiel.",
      status: "upcoming",
    },
  ],
  Doctorat: [
    {
      titre: "Dépôt du dossier",
      description: "Votre dossier a été soumis avec succès sur la plateforme.",
      status: "completed",
    },
    {
      titre: "Vérification approfondie (SAE)",
      description: "Examen rigoureux de tous les documents et de la thèse.",
      status: "completed",
    },
    {
      titre: "Évaluation scientifique (CNE)",
      description:
        "Analyse scientifique détaillée de la thèse et des publications.",
      status: "current",
    },
    {
      titre: "Validation par le Comité Scientifique",
      description: "Validation par le comité scientifique spécialisé.",
      status: "upcoming",
    },
    {
      titre: "Signature ministérielle et délivrance",
      description:
        "Signature ministérielle et délivrance de l'arrêté d'équivalence.",
      status: "upcoming",
    },
  ],
};

// --- Données de démonstration avec timelines conformes ---
const mockDemandes = [
  {
    id: "REQ-2025-0842",
    reference: "EQ-2025-0842",
    date_depot: "10 Déc. 2025",
    type_diplome: "Master",
    status_global: "En cours de traitement",
    nom: "ANDRIAMANANTSOA",
    prenoms: "Jean-Luc",
    email: "jean.luc@example.com",
    telephone: "+261 34 12 345 67",
    adresse: "Lot IVC 123 Bis, Antananarivo 101",
    diplome_cible: "Master en Informatique Appliquée",
    etablissement_cible: "Université de Bordeaux",
    pays_cible: "France",
    jours_ecoules: 25,
    timeline: timelinesConfig.Master,
    documents: [
      { nom: "Carte d'Identité Nationale.pdf", type: "Identité" },
      { nom: "Diplôme de Licence.pdf", type: "Diplôme" },
      { nom: "Relevés de notes L1-L3.pdf", type: "Relevés" },
      { nom: "Mémoire de Master.pdf", type: "Mémoire" },
    ],
  },
  {
    id: "REQ-2025-0935",
    reference: "EQ-2025-0935",
    date_depot: "05 Jan. 2026",
    type_diplome: "Licence",
    status_global: "En vérification administrative",
    nom: "RAKOTO",
    prenoms: "Marie Claire",
    email: "marie.rakoto@example.com",
    telephone: "+261 32 98 765 43",
    adresse: "Lot II M 45, Antsirabe 110",
    diplome_cible: "Licence en Sciences Économiques",
    etablissement_cible: "Université de Montréal",
    pays_cible: "Canada",
    jours_ecoules: 15,
    timeline: timelinesConfig.Licence.map((step, index) => ({
      ...step,
      status: index === 0 ? "completed" : index === 1 ? "current" : "upcoming",
    })),
    documents: [
      { nom: "Passeport.pdf", type: "Identité" },
      { nom: "Diplôme Baccalauréat.pdf", type: "Diplôme" },
      { nom: "Relevés de notes.pdf", type: "Relevés" },
    ],
  },
  {
    id: "REQ-2025-0789",
    reference: "EQ-2025-0789",
    date_depot: "25 Nov. 2025",
    type_diplome: "Doctorat",
    status_global: "En instruction pédagogique",
    nom: "RANDRIANARIVO",
    prenoms: "Paul",
    email: "paul.randria@example.com",
    telephone: "+261 33 45 678 90",
    adresse: "Lot VK 78, Tamatave 501",
    diplome_cible: "Doctorat en Biologie Moléculaire",
    etablissement_cible: "Université de Genève",
    pays_cible: "Suisse",
    jours_ecoules: 60,
    timeline: timelinesConfig.Doctorat,
    documents: [
      { nom: "Carte d'Identité.pdf", type: "Identité" },
      { nom: "Diplôme Master.pdf", type: "Diplôme" },
      { nom: "Thèse de Doctorat.pdf", type: "Thèse" },
      { nom: "Publications scientifiques.pdf", type: "Publications" },
    ],
  },
];

// --- Modal pour les détails ---
const DetailModal = ({ isOpen, onClose, dossier }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <FaFileAlt className="text-blue-600" />
            Détails du dossier - {dossier.reference}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Informations du requérant
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaUser className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="font-medium">
                      {dossier.nom} {dossier.prenoms}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{dossier.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhoneAlt className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-medium">{dossier.telephone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Adresse</p>
                    <p className="font-medium">{dossier.adresse}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Détails académiques
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Type de diplôme</p>
                  <p className="font-medium">{dossier.type_diplome}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Diplôme visé</p>
                  <p className="font-medium">{dossier.diplome_cible}</p>
                </div>
                <div className="flex items-center gap-3">
                  <FaUniversity className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Établissement</p>
                    <p className="font-medium">{dossier.etablissement_cible}</p>
                    <p className="text-xs text-gray-500">
                      {dossier.pays_cible}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date de dépôt</p>
                  <p className="font-medium">{dossier.date_depot}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Documents déposés
            </h3>
            <div className="space-y-2">
              {dossier.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FaFileAlt className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">{doc.nom}</p>
                      <p className="text-xs text-gray-500">{doc.type}</p>
                    </div>
                  </div>
                  <FaDownload className="text-gray-400 hover:text-blue-600 cursor-pointer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Composant Badge Simple ---
const StatusBadge = ({ status }) => {
  const styles = {
    "En cours de traitement": "bg-blue-100 text-blue-700",
    "En vérification administrative": "bg-yellow-100 text-yellow-700",
    "En instruction pédagogique": "bg-purple-100 text-purple-700",
    Validé: "bg-green-100 text-green-700",
    Rejeté: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${styles[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
};

// --- Composant pour une demande individuelle (SIMPLIFIÉ) ---
const DemandeCard = ({ demande, isActive, onClick, onViewDetails }) => {
  const currentStepIndex = demande.timeline.findIndex(
    (t) => t.status === "current",
  );

  return (
    <div
      className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
        isActive ? "border-blue-500 shadow-sm" : "border-gray-200"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-800 text-sm">
              {demande.reference}
            </h3>
            <StatusBadge status={demande.status_global} />
          </div>
          <p className="text-sm text-gray-600 line-clamp-1">
            {demande.diplome_cible}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(demande);
          }}
          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
        >
          <FaEye size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <FaCalendarAlt size={10} />
          {demande.date_depot}
        </div>
        <div className="text-xs font-semibold text-blue-600">
          {demande.jours_ecoules} jours
        </div>
      </div>
    </div>
  );
};

// --- Vue Principale ---
export default function DashboardReqView() {
  const [activeDemande, setActiveDemande] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalDemande, setModalDemande] = useState(null);

  // Vérifier s'il y a des demandes
  const hasDemandes = mockDemandes && mockDemandes.length > 0;
  const currentDemande = hasDemandes ? mockDemandes[activeDemande] : null;
  const currentStepIndex = currentDemande
    ? currentDemande.timeline.findIndex((t) => t.status === "current")
    : -1;

  // Vérifier si l'utilisateur a déjà les 3 types de demandes (Licence, Master, Doctorat)
  const typesDiplomesExistants = new Set(
    mockDemandes.map((d) => d.type_diplome),
  );
  const hasAllThreeTypes =
    typesDiplomesExistants.size === 3 &&
    typesDiplomesExistants.has("Licence") &&
    typesDiplomesExistants.has("Master") &&
    typesDiplomesExistants.has("Doctorat");

  // Le bouton est affiché seulement si l'utilisateur a 0, 1 ou 2 demandes (pas les 3 types)
  const showNewDemandButton = !hasAllThreeTypes;

  const handleViewDetails = (demande) => {
    setModalDemande(demande);
    setShowModal(true);
  };

  const handleNouvelleDemande = () => {
    // Logique pour créer une nouvelle demande
    alert("Fonctionnalité de nouvelle demande à implémenter");
  };

  // Si pas de demandes, afficher un état vide
  if (!hasDemandes) {
    return (
      <div className="min-h-screen bg-white p-4 font-sans text-gray-600">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Mes demandes d'équivalence
          </h1>
          <p className="text-gray-600">
            Suivez l'avancement de vos demandes en temps réel
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-gray-50 rounded-xl p-8 max-w-md w-full text-center border border-gray-200">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFileAlt className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Aucune demande en cours
            </h3>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore soumis de demande d'équivalence de diplôme.
            </p>
            <button
              onClick={handleNouvelleDemande}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <FaPlus />
              Faire une demande d'équivalence
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 font-sans text-gray-600">
      {/* En-tête simple */}
      <div className="mb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Mes demandes d'équivalence
          </h1>
          <p className="text-gray-600">
            Suivez l'avancement de vos demandes en temps réel
          </p>
        </div>

        {/* Liste des demandes */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Vos demandes ({mockDemandes.length})
            </h2>
            {showNewDemandButton && (
              <button
                onClick={handleNouvelleDemande}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaPlus />
                Nouvelle demande
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {mockDemandes.map((demande, index) => (
              <DemandeCard
                key={demande.id}
                demande={demande}
                isActive={activeDemande === index}
                onClick={() => setActiveDemande(index)}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Détails de la demande active */}
      {currentDemande && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* COLONNE GAUCHE (2/3) : Stepper & Détails de l'étape */}
          <div className="lg:col-span-2 space-y-4">
            {/* Stepper Horizontal */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-gray-800">
                  Progression du traitement
                </h3>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-500" />
                  <span>{currentDemande.jours_ecoules} jours écoulés</span>
                </div>
              </div>

              <div className="flex items-center justify-between overflow-x-auto">
                {currentDemande.timeline.map((step, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div
                      key={index}
                      className="relative flex flex-col items-center px-2"
                    >
                      {/* Ligne de connexion */}
                      {index !== 0 && (
                        <div
                          className={`absolute top-3 right-[50%] w-full h-[2px] -z-10 
                          ${index <= currentStepIndex ? "bg-blue-600" : "bg-gray-200"}`}
                        />
                      )}

                      {/* Cercle */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2
                        ${
                          isCompleted
                            ? "bg-blue-600 border-blue-600 text-white"
                            : isCurrent
                              ? "bg-white border-blue-600 text-blue-600"
                              : "bg-white border-gray-300 text-gray-300"
                        }`}
                      >
                        {isCompleted ? <FaCheck size={10} /> : index + 1}
                      </div>

                      {/* Titre */}
                      <p
                        className={`mt-2 text-[10px] font-medium text-center ${isCurrent ? "text-blue-700" : "text-gray-500"}`}
                      >
                        {step.titre.split(" (")[0]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contenu principal */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6">
                <div className="space-y-6">
                  {/* Étape actuelle */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCircle
                        className="text-blue-500 animate-pulse"
                        size={10}
                      />
                      <h3 className="font-semibold text-blue-800">
                        {currentDemande.timeline[currentStepIndex].titre}
                      </h3>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      {currentDemande.timeline[currentStepIndex].description}
                    </p>
                  </div>

                  {/* Historique simple */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-4">
                      Historique des étapes
                    </h4>
                    <div className="space-y-4">
                      {currentDemande.timeline.map((step, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 ${idx > currentStepIndex ? "opacity-50" : ""}`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full mt-1 flex-shrink-0
                            ${
                              idx < currentStepIndex
                                ? "bg-green-500"
                                : idx === currentStepIndex
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                            }`}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium text-gray-800">
                                {step.titre}
                              </p>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE (1/3) : Résumé Fixe */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Résumé de la demande
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Référence</p>
                  <p className="text-sm font-medium text-gray-800">
                    {currentDemande.reference}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Diplôme visé</p>
                  <p className="text-sm font-medium text-gray-800">
                    {currentDemande.diplome_cible}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <FaUniversity className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Établissement</p>
                    <p className="text-sm font-medium text-gray-800">
                      {currentDemande.etablissement_cible}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Date de dépôt</p>
                  <p className="text-sm font-medium text-gray-800">
                    {currentDemande.date_depot}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Statut</p>
                  <StatusBadge status={currentDemande.status_global} />
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Durée de traitement
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (currentDemande.jours_ecoules / 60) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {currentDemande.jours_ecoules} jours
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour les détails */}
      {modalDemande && (
        <DetailModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          dossier={modalDemande}
        />
      )}
    </div>
  );
}
