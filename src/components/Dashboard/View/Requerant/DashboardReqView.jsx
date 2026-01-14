import React, { useState, useEffect } from "react";
import {
  FaFileAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaChartLine,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function DashboardReqView() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDemandes: 0,
    enAttente: 0,
    traitees: 0,
    rejetees: 0,
  });

  const [recentDemandes, setRecentDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulation de données (à remplacer par une API réelle)
  useEffect(() => {
    // Simuler un chargement d'API
    setTimeout(() => {
      setStats({
        totalDemandes: 12,
        enAttente: 3,
        traitees: 7,
        rejetees: 2,
      });

      setRecentDemandes([
        {
          id: 1,
          type: "Équivalence Bac",
          date: "2024-03-15",
          statut: "En traitement",
          delai: "15 jours",
        },
        {
          id: 2,
          type: "Équivalence Master",
          date: "2024-03-10",
          statut: "Approuvé",
          delai: "Terminé",
        },
        {
          id: 3,
          type: "Équivalence Licence",
          date: "2024-03-05",
          statut: "En attente",
          delai: "20 jours",
        },
        {
          id: 4,
          type: "Équivalence Doctorat",
          date: "2024-02-28",
          statut: "Rejeté",
          delai: "Terminé",
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: "Demandes totales",
      value: stats.totalDemandes,
      icon: <FaFileAlt className="text-blue-500" />,
      color: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "En attente",
      value: stats.enAttente,
      icon: <FaClock className="text-yellow-500" />,
      color: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Traités",
      value: stats.traitees,
      icon: <FaCheckCircle className="text-green-500" />,
      color: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Rejetés",
      value: stats.rejetees,
      icon: <FaExclamationCircle className="text-red-500" />,
      color: "bg-red-50",
      textColor: "text-red-600",
    },
  ];

  const getStatusBadge = (statut) => {
    const styles = {
      "En traitement": "bg-blue-100 text-blue-800",
      Approuvé: "bg-green-100 text-green-800",
      "En attente": "bg-yellow-100 text-yellow-800",
      Rejeté: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${styles[statut]}`}
      >
        {statut}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Tableau de Bord Requérant
        </h1>
        <p className="text-gray-600">
          Bienvenue sur votre espace personnel. Suivez l'état de vos demandes.
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} rounded-2xl p-6 shadow-sm border border-gray-100`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`text-2xl font-bold ${card.textColor}`}>
                {loading ? "..." : card.value}
              </div>
              <div className="text-2xl">{card.icon}</div>
            </div>
            <div className="text-sm font-medium text-gray-600">
              {card.title}
            </div>
          </div>
        ))}
      </div>

      {/* Bouton d'action */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/dashboard/requerant/creer-demande")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <FaFileAlt /> Nouvelle Demande d'Équivalence
        </button>
      </div>

      {/* Graphique de progression */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaChartLine className="text-blue-500" /> Progression des Demandes
          </h2>
          <span className="text-sm text-gray-500">Ce mois-ci</span>
        </div>
        <div className="h-48 flex items-end gap-2">
          {["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"].map((month, index) => (
            <div key={month} className="flex-1 flex flex-col items-center">
              <div
                className="w-3/4 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg"
                style={{ height: `${(index + 1) * 20}%` }}
              ></div>
              <div className="text-xs text-gray-500 mt-2">{month}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Demandes récentes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Demandes Récentes
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Type de Demande
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Date de Soumission
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Statut
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Délai de Traitement
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    Chargement des données...
                  </td>
                </tr>
              ) : recentDemandes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    Aucune demande trouvée
                  </td>
                </tr>
              ) : (
                recentDemandes.map((demande) => (
                  <tr
                    key={demande.id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-800">
                        {demande.type}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{demande.date}</td>
                    <td className="p-4">{getStatusBadge(demande.statut)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{demande.delai}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/requerant/dossier/${demande.id}`)
                        }
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Voir le dossier
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 text-center">
          <button
            onClick={() =>
              navigate("/dashboard/requerant/decisions-allocations")
            }
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Voir toutes les demandes →
          </button>
        </div>
      </div>
    </div>
  );
}
