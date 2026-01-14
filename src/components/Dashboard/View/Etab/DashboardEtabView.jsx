import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaFileAlt,
  FaClock,
  FaCheckCircle,
  FaUsers,
  FaChartLine,
  FaBell,
  FaCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function DashboardEtabView() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDemandes: 0,
    enAttente: 0,
    approuvees: 0,
    rejetees: 0,
    etudiants: 0,
  });

  const [recentActivites, setRecentActivites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulation de données
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalDemandes: 156,
        enAttente: 23,
        approuvees: 120,
        rejetees: 13,
        etudiants: 2450,
      });

      setRecentActivites([
        {
          id: 1,
          type: "Nouvelle demande",
          description: "Demande d'équivalence Bac S",
          date: "2024-03-15 10:30",
          etudiant: "Jean Dupont",
        },
        {
          id: 2,
          type: "Décision",
          description: "Équivalence Master approuvée",
          date: "2024-03-14 14:20",
          etudiant: "Marie Curie",
        },
        {
          id: 3,
          type: "Document",
          description: "Relevé de notes reçu",
          date: "2024-03-13 09:15",
          etudiant: "Paul Martin",
        },
        {
          id: 4,
          type: "Rappel",
          description: "Échéance paiement allocation",
          date: "2024-03-12 16:45",
          etudiant: "Sophie Lambert",
        },
      ]);

      setNotifications([
        {
          id: 1,
          message: "5 nouvelles demandes en attente de traitement",
          type: "warning",
          date: "Il y a 2h",
        },
        {
          id: 2,
          message: "Allocation de 50,000 FCFA approuvée pour l'étudiant X",
          type: "success",
          date: "Il y a 1 jour",
        },
        {
          id: 3,
          message: "Rappel : Rapport trimestriel à soumettre avant le 30 mars",
          type: "info",
          date: "Il y a 2 jours",
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: "Total Demandes",
      value: stats.totalDemandes,
      icon: <FaFileAlt className="text-blue-500" />,
      color: "bg-blue-50",
      textColor: "text-blue-600",
      trend: "+12% ce mois",
    },
    {
      title: "En Attente",
      value: stats.enAttente,
      icon: <FaClock className="text-yellow-500" />,
      color: "bg-yellow-50",
      textColor: "text-yellow-600",
      trend: "À traiter",
    },
    {
      title: "Approuvées",
      value: stats.approuvees,
      icon: <FaCheckCircle className="text-green-500" />,
      color: "bg-green-50",
      textColor: "text-green-600",
      trend: "78% de taux",
    },
    {
      title: "Étudiants",
      value: stats.etudiants,
      icon: <FaUsers className="text-purple-500" />,
      color: "bg-purple-50",
      textColor: "text-purple-600",
      trend: "Inscrits cette année",
    },
  ];

  const getNotificationColor = (type) => {
    const colors = {
      warning: "bg-yellow-100 text-yellow-800",
      success: "bg-green-100 text-green-800",
      info: "bg-blue-100 text-blue-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Tableau de Bord Établissement
            </h1>
            <p className="text-gray-600">
              Bienvenue sur votre espace de gestion des équivalences
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
              <FaCalendarAlt className="inline mr-2" />
              Calendrier
            </button>
            <button
              onClick={() => navigate("/dashboard/institut/creer-demande")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Nouvelle Demande
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaBell className="text-blue-500" /> Notifications Récentes
              </h2>
              <span className="text-sm text-blue-600 font-medium">
                {notifications.length} non lues
              </span>
            </div>
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg ${getNotificationColor(
                    notif.type
                  )}`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{notif.message}</p>
                    <span className="text-sm opacity-75">{notif.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} rounded-2xl p-6 shadow-sm border border-gray-100`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`text-2xl font-bold ${card.textColor}`}>
                {loading ? "..." : card.value.toLocaleString()}
              </div>
              <div className="text-2xl">{card.icon}</div>
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">
              {card.title}
            </div>
            <div className="text-xs text-gray-500">{card.trend}</div>
          </div>
        ))}
      </div>

      {/* Graphique et Activités */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Graphique de progression */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaChartLine className="text-blue-500" /> Activité Mensuelle
            </h2>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
              <option>Mars 2024</option>
              <option>Février 2024</option>
              <option>Janvier 2024</option>
            </select>
          </div>
          <div className="h-64 flex items-end gap-2">
            {["Sem 1", "Sem 2", "Sem 3", "Sem 4"].map((semaine, index) => (
              <div key={semaine} className="flex-1 flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-2">{semaine}</div>
                <div
                  className="w-3/4 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg"
                  style={{ height: `${(index + 1) * 25}%` }}
                ></div>
                <div className="text-xs text-gray-700 mt-1">
                  {index * 10 + 15}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activités récentes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Activités Récentes
          </h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Chargement des activités...
              </div>
            ) : recentActivites.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune activité récente
              </div>
            ) : (
              recentActivites.map((activite) => (
                <div
                  key={activite.id}
                  className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FaFileAlt className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-800">
                        {activite.type}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {activite.date}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {activite.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Étudiant : {activite.etudiant}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/dashboard/institut/creer-demande")}
            className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl text-left hover:from-blue-100 hover:to-blue-200 transition-all"
          >
            <FaFileAlt className="text-2xl text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">
              Nouvelle Demande
            </h3>
            <p className="text-sm text-gray-600">
              Soumettre une nouvelle demande d'équivalence pour un étudiant
            </p>
          </button>

          <button
            onClick={() => navigate("/dashboard/institut/decisions")}
            className="p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl text-left hover:from-green-100 hover:to-green-200 transition-all"
          >
            <FaCheckCircle className="text-2xl text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">
              Voir les Décisions
            </h3>
            <p className="text-sm text-gray-600">
              Consulter les décisions et télécharger les arrêtés
            </p>
          </button>

          <button className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl text-left hover:from-purple-100 hover:to-purple-200 transition-all">
            <FaUsers className="text-2xl text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">
              Gérer les Étudiants
            </h3>
            <p className="text-sm text-gray-600">
              Liste des étudiants et suivi des dossiers
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}