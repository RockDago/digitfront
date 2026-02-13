import React from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaServer,
  FaDatabase,
  FaEnvelope,
} from "react-icons/fa";

export default function SystemStatusView() {
  // Simulation des statuts (à remplacer plus tard par des vraies données API)
  const services = [
    { name: "Serveur API", status: "online", latency: "45ms", icon: FaServer },
    {
      name: "Base de Données",
      status: "online",
      latency: "12ms",
      icon: FaDatabase,
    },
    {
      name: "Service Email (SMTP)",
      status: "warning",
      latency: "800ms",
      icon: FaEnvelope,
    },
    {
      name: "Stockage Fichiers",
      status: "offline",
      latency: "-",
      icon: FaServer,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "text-green-500 bg-green-50 border-green-200";
      case "warning":
        return "text-orange-500 bg-orange-50 border-orange-200";
      case "offline":
        return "text-red-500 bg-red-50 border-red-200";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "online":
        return <FaCheckCircle />;
      case "warning":
        return <FaExclamationTriangle />;
      case "offline":
        return <FaTimesCircle />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">État du Système</h1>
          <p className="text-gray-500 mt-1">
            Surveillance en temps réel des services de la plateforme.
          </p>
        </div>
        <div className="text-sm text-gray-400">
          Dernière mise à jour : {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between h-40 ${
              getStatusColor(service.status).split(" ")[2]
            } bg-white`}
          >
            <div className="flex justify-between items-start">
              <div
                className={`p-3 rounded-xl ${getStatusColor(service.status)}`}
              >
                <service.icon className="text-xl" />
              </div>
              <div
                className={`text-xl ${
                  getStatusColor(service.status).split(" ")[0]
                }`}
              >
                {getStatusIcon(service.status)}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-700">{service.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs font-semibold uppercase text-gray-400">
                  Latence
                </span>
                <span className="text-sm font-mono text-gray-600">
                  {service.latency}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section Logs ou Détails supplémentaires */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-lg text-gray-800 mb-4">
          Incidents récents
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
            <FaTimesCircle className="text-red-500 mt-1" />
            <div>
              <p className="font-bold text-red-700 text-sm">
                Panne Stockage Fichiers
              </p>
              <p className="text-red-600 text-xs mt-1">
                Le serveur de fichiers ne répond pas depuis 10h42. Équipe
                technique notifiée.
              </p>
            </div>
            <span className="text-xs text-red-400 ml-auto whitespace-nowrap">
              Il y a 20 min
            </span>
          </div>

          <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
            <FaExclamationTriangle className="text-orange-500 mt-1" />
            <div>
              <p className="font-bold text-orange-700 text-sm">
                Latence SMTP élevée
              </p>
              <p className="text-orange-600 text-xs mt-1">
                Délais d'envoi d'emails supérieurs à 5s détectés.
              </p>
            </div>
            <span className="text-xs text-orange-400 ml-auto whitespace-nowrap">
              Il y a 1h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
