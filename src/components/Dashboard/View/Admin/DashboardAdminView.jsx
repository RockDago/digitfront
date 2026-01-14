import React from "react";
import { FaUsers, FaClipboardList, FaGlobe, FaChartLine } from "react-icons/fa";

export default function DashboardAdminView() {
  const stats = [
    {
      label: "Utilisateurs",
      value: "1,240",
      icon: FaUsers,
      color: "bg-blue-500",
    },
    {
      label: "Accréditations",
      value: "45",
      icon: FaClipboardList,
      color: "bg-purple-500",
    },
    {
      label: "Visiteurs (Mois)",
      value: "12k",
      icon: FaGlobe,
      color: "bg-green-500",
    },
    {
      label: "Taux de rebond",
      value: "24%",
      icon: FaChartLine,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">
            Bienvenue sur votre espace d'administration DAAQ.
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
          Télécharger le rapport
        </button>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4"
          >
            <div
              className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl shadow-md`}
            >
              <stat.icon />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Section Contenu récent (Exemple) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tableau Activité */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg text-gray-800 mb-4">
            Dernières demandes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">ID</th>
                  <th className="px-4 py-3">Institution</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 rounded-r-lg">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium">#REQ-00{i}</td>
                    <td className="px-4 py-3">Université {i}</td>
                    <td className="px-4 py-3">
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">
                        En attente
                      </span>
                    </td>
                    <td className="px-4 py-3">12 Jan 2026</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Carte info rapide */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg text-gray-800 mb-4">
            État du système
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Serveur API</span>
              <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-lg">
                Opérationnel
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Base de données</span>
              <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-lg">
                Connecté
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Dernière sauvegarde</span>
              <span className="text-gray-500">Il y a 2h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
