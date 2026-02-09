import React, { useState } from "react";
import {
  FaFileContract,
  FaClock,
  FaCheckCircle,
  FaEdit,
  FaTimes,
} from "react-icons/fa";

export default function MesInformationsHabilitation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    directorName: "",
    email: "",
    phone: "",
  });

  // Données simulées - à remplacer par des données réelles du backend
  const [habilitationInfo] = useState({
    certificateNumber: "CERT-2024-001",
    status: "Actif",
    issueDate: "2024-01-15",
    expiryDate: "2026-01-15",
    renewalDate: "2025-11-15",
    domains: ["Licence", "Master"],
    institutions: [
      {
        name: "Institut de Technologie Supérieure",
        location: "Antananarivo",
      },
      {
        name: "Centre d'Excellence en Informatique",
        location: "Fianarantsoa",
      },
    ],
    contacts: {
      directorName: "Dr. Jean Dupont",
      email: "contact@institution.mg",
      phone: "+261 20 XX XX XX",
    },
  });

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      directorName: "",
      email: "",
      phone: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Ajouter la logique de sauvegarde
    console.log("Données à sauvegarder:", formData);
    setIsModalOpen(false);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const getRemainingDays = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const remainingDays = getRemainingDays(habilitationInfo.expiryDate);
  const isExpiringSoon = remainingDays <= 90;

  return (
    <div className="space-y-6 p-6 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Mes Informations d'Habilitation
          </h1>
          <p className="text-slate-600">
            Consultez et mettez à jour vos données d'habilitation
          </p>
        </div>
        <button
          onClick={handleEditClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <FaEdit size={16} />
          Modifier
        </button>
      </div>

      {/* Statut et Validité */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Certificat */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 text-white p-3 rounded-lg">
              <FaFileContract size={24} />
            </div>
            <h3 className="font-semibold text-slate-900">
              Numéro de Certificat
            </h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {habilitationInfo.certificateNumber}
          </p>
        </div>

        {/* Statut */}
        <div
          className={`rounded-xl p-6 border-2 ${
            habilitationInfo.status === "Actif"
              ? "bg-green-50 border-green-300"
              : "bg-red-50 border-red-300"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-3 rounded-lg ${
                habilitationInfo.status === "Actif"
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              <FaCheckCircle size={24} />
            </div>
            <h3 className="font-semibold text-slate-900">Statut</h3>
          </div>
          <p
            className={`text-2xl font-bold ${
              habilitationInfo.status === "Actif"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {habilitationInfo.status}
          </p>
        </div>

        {/* Jours Restants */}
        <div
          className={`rounded-xl p-6 border-2 ${
            isExpiringSoon
              ? "bg-orange-50 border-orange-300"
              : "bg-gray-50 border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-3 rounded-lg ${
                isExpiringSoon
                  ? "bg-orange-600 text-white"
                  : "bg-gray-600 text-white"
              }`}
            >
              <FaClock size={24} />
            </div>
            <h3 className="font-semibold text-slate-900">Validité Restante</h3>
          </div>
          <p
            className={`text-2xl font-bold ${
              isExpiringSoon ? "text-orange-600" : "text-slate-600"
            }`}
          >
            {remainingDays} jours
          </p>
        </div>
      </div>

      {/* Dates importantes */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Dates Importantes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-slate-600">
              Date d'Émission
            </label>
            <p className="text-slate-900 font-medium mt-2">
              {formatDate(habilitationInfo.issueDate)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">
              Date d'Expiration
            </label>
            <p className="text-slate-900 font-medium mt-2">
              {formatDate(habilitationInfo.expiryDate)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">
              Date de Renouvellement
            </label>
            <p className="text-slate-900 font-medium mt-2">
              {formatDate(habilitationInfo.renewalDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Domaines d'Habilitation */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Domaines d'Habilitation
        </h2>
        <div className="flex flex-wrap gap-2">
          {habilitationInfo.domains.map((domain, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium text-sm"
            >
              {domain}
            </span>
          ))}
        </div>
      </div>

      {/* Établissements Habilités */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Établissements Habilités
        </h2>
        <div className="space-y-3">
          {habilitationInfo.institutions.map((institution, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
            >
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <FaFileContract size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                  {institution.name}
                </h3>
                <p className="text-sm text-slate-600">{institution.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Informations de Contact */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Informations de Contact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-slate-600">
              Directeur/Directrice
            </label>
            <p className="text-slate-900 font-medium mt-2">
              {habilitationInfo.contacts.directorName}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Email</label>
            <p className="text-slate-900 font-medium mt-2">
              {habilitationInfo.contacts.email}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">
              Téléphone
            </label>
            <p className="text-slate-900 font-medium mt-2">
              {habilitationInfo.contacts.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Bouton d'action */}
      {isExpiringSoon && (
        <div className="bg-orange-50 border border-orange-300 rounded-xl p-4 mt-6">
          <p className="text-orange-800 font-medium">
            ⚠️ Votre habilitation expire dans {remainingDays} jours. Pensez à
            renouveler votre demande.
          </p>
        </div>
      )}

      {/* MODAL MODERNE DE MODIFICATION */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 bg-white">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Modifier Informations de Contact
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Mettez à jour vos données de contact
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-lg transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Nom du Directeur */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Directeur / Directrice
                </label>
                <input
                  type="text"
                  name="directorName"
                  value={formData.directorName}
                  onChange={handleInputChange}
                  placeholder="Entrez le nom complet"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 hover:bg-white"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Nom complet du directeur ou de la directrice de
                  l'établissement
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Adresse Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="exemple@institution.mg"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 hover:bg-white"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Email de contact officiel de l'établissement
                </p>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Numéro de Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+261 XX XX XX XX"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50 hover:bg-white"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Numéro de téléphone international (format: +261 XX XX XX XX)
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">📋 Note:</span> Les
                  modifications seront enregistrées sur le serveur. Assurez-vous
                  que les informations sont correctes avant de soumettre.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex gap-3 p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
