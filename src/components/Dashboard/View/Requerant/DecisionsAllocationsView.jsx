import React, { useState, useEffect } from "react";
import {
  FaDownload,
  FaEye,
  FaPrint,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaFilePdf,
  FaFilter,
  FaSearch,
} from "react-icons/fa";

export default function DecisionsAllocationsView() {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Simulation de données
  useEffect(() => {
    setTimeout(() => {
      setDecisions([
        {
          id: 1,
          numero: "DAAQ-2024-00123",
          type: "Équivalence Bac",
          dateDecision: "2024-03-15",
          statut: "Approuvé",
          decision: "Équivalence accordée",
          fichierArrete: "arrete_00123.pdf",
          montantAllocation: "50,000 FCFA",
          dateLimiteRecours: "2024-04-15",
        },
        {
          id: 2,
          numero: "DAAQ-2024-00124",
          type: "Équivalence Master",
          dateDecision: "2024-03-12",
          statut: "En attente",
          decision: "En cours d'étude",
          fichierArrete: null,
          montantAllocation: null,
          dateLimiteRecours: null,
        },
        {
          id: 3,
          numero: "DAAQ-2024-00125",
          type: "Équivalence Licence",
          dateDecision: "2024-03-10",
          statut: "Rejeté",
          decision: "Équivalence refusée",
          fichierArrete: "arrete_00125.pdf",
          montantAllocation: null,
          dateLimiteRecours: "2024-04-10",
        },
        {
          id: 4,
          numero: "DAAQ-2024-00126",
          type: "Équivalence Doctorat",
          dateDecision: "2024-03-05",
          statut: "Approuvé",
          decision: "Équivalence partielle",
          fichierArrete: "arrete_00126.pdf",
          montantAllocation: "75,000 FCFA",
          dateLimiteRecours: "2024-04-05",
        },
        {
          id: 5,
          numero: "DAAQ-2024-00127",
          type: "Équivalence Bac",
          dateDecision: "2024-02-28",
          statut: "Approuvé",
          decision: "Équivalence accordée",
          fichierArrete: "arrete_00127.pdf",
          montantAllocation: "45,000 FCFA",
          dateLimiteRecours: "2024-03-28",
        },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const getStatusIcon = (statut) => {
    switch (statut) {
      case "Approuvé":
        return <FaCheckCircle className="text-green-500" />;
      case "En attente":
        return <FaClock className="text-yellow-500" />;
      case "Rejeté":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case "Approuvé":
        return "bg-green-100 text-green-800";
      case "En attente":
        return "bg-yellow-100 text-yellow-800";
      case "Rejeté":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredDecisions = decisions.filter((decision) => {
    if (filter !== "all" && decision.statut !== filter) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        decision.numero.toLowerCase().includes(searchLower) ||
        decision.type.toLowerCase().includes(searchLower) ||
        decision.decision.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const handleDownload = (fileName) => {
    // Simulation de téléchargement
    alert(`Téléchargement de ${fileName} démarré`);
    // Ici, vous intégreriez le téléchargement réel du fichier
  };

  const handleViewArrete = (fileName) => {
    // Simulation de visualisation
    alert(`Ouverture de ${fileName} en visualisation`);
    // Ici, vous intégreriez l'ouverture du PDF dans une nouvelle fenêtre
  };

  const stats = {
    total: decisions.length,
    approves: decisions.filter((d) => d.statut === "Approuvé").length,
    enAttente: decisions.filter((d) => d.statut === "En attente").length,
    rejetes: decisions.filter((d) => d.statut === "Rejeté").length,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Décisions & Allocations
        </h1>
        <p className="text-gray-600">
          Consultez les décisions d'équivalence et téléchargez les arrêtés
          officiels
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-800 mb-2">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600">Total des décisions</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-6 shadow-sm border border-green-100">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {stats.approuves}
          </div>
          <div className="text-sm text-green-700">Décisions approuvées</div>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-6 shadow-sm border border-yellow-100">
          <div className="text-2xl font-bold text-yellow-600 mb-2">
            {stats.enAttente}
          </div>
          <div className="text-sm text-yellow-700">En attente</div>
        </div>
        <div className="bg-red-50 rounded-2xl p-6 shadow-sm border border-red-100">
          <div className="text-2xl font-bold text-red-600 mb-2">
            {stats.rejetes}
          </div>
          <div className="text-sm text-red-700">Décisions rejetées</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Filtrer par :
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "Approuvé", "En attente", "Rejeté"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status === "all" ? "all" : status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === (status === "all" ? "all" : status)
                      ? status === "all"
                        ? "bg-blue-600 text-white"
                        : `${
                            status === "Approuvé"
                              ? "bg-green-600 text-white"
                              : status === "En attente"
                              ? "bg-yellow-600 text-white"
                              : "bg-red-600 text-white"
                          }`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status === "all" ? "Tous" : status}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une décision..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tableau des décisions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Liste des Décisions
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des décisions...</p>
          </div>
        ) : filteredDecisions.length === 0 ? (
          <div className="p-12 text-center">
            <FaFilePdf className="text-4xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Aucune décision trouvée
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Aucune décision ne correspond à votre recherche"
                : "Vous n'avez aucune décision pour le moment"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    N° Décision
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    Type
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    Date Décision
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    Statut
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    Décision
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    Allocation
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDecisions.map((decision) => (
                  <tr
                    key={decision.id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="font-mono text-sm font-medium text-gray-800">
                        {decision.numero}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">
                        {decision.type}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {decision.dateDecision}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(decision.statut)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            decision.statut
                          )}`}
                        >
                          {decision.statut}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">
                        {decision.decision}
                      </div>
                    </td>
                    <td className="p-4">
                      {decision.montantAllocation ? (
                        <div className="font-bold text-green-600">
                          {decision.montantAllocation}
                        </div>
                      ) : (
                        <div className="text-gray-400">-</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {decision.fichierArrete && (
                          <>
                            <button
                              onClick={() =>
                                handleDownload(decision.fichierArrete)
                              }
                              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                              title="Télécharger l'arrêté"
                            >
                              <FaDownload /> PDF
                            </button>
                            <button
                              onClick={() =>
                                handleViewArrete(decision.fichierArrete)
                              }
                              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                              title="Visualiser l'arrêté"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() =>
                                alert(`Impression de ${decision.fichierArrete}`)
                              }
                              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                              title="Imprimer"
                            >
                              <FaPrint />
                            </button>
                          </>
                        )}
                        {decision.statut === "Rejeté" &&
                          decision.dateLimiteRecours && (
                            <button
                              onClick={() =>
                                alert(
                                  `Formulaire de recours pour ${decision.numero}`
                                )
                              }
                              className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                            >
                              Recours
                            </button>
                          )}
                      </div>
                      {decision.dateLimiteRecours && (
                        <div className="mt-2 text-xs text-gray-500">
                          Recours jusqu'au : {decision.dateLimiteRecours}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Informations légales */}
        <div className="p-6 border-t border-gray-100 bg-blue-50">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            Informations importantes :
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • Les arrêtés sont disponibles uniquement pour les décisions
              finalisées
            </li>
            <li>
              • Vous disposez d'un délai de 30 jours pour faire recours en cas
              de désaccord
            </li>
            <li>
              • Les allocations sont versées sous 15 jours ouvrés après
              l'approbation
            </li>
            <li>
              • Conservez une copie physique de l'arrêté pour vos démarches
            </li>
          </ul>
        </div>
      </div>

      {/* Guide d'utilisation */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <FaDownload className="text-blue-600 text-xl" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Télécharger l'arrêté
          </h3>
          <p className="text-sm text-gray-600">
            Cliquez sur "PDF" pour télécharger l'arrêté officiel au format
            numérique.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <FaEye className="text-green-600 text-xl" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Visualiser avant impression
          </h3>
          <p className="text-sm text-gray-600">
            Utilisez "Visualiser" pour vérifier le document avant impression ou
            partage.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
            <FaPrint className="text-yellow-600 text-xl" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Imprimer en haute qualité
          </h3>
          <p className="text-sm text-gray-600">
            L'impression directe garantit une qualité optimale pour les
            documents officiels.
          </p>
        </div>
      </div>
    </div>
  );
}
