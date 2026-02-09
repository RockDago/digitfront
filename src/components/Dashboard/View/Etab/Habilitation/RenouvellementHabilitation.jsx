import React, { useState } from "react";
import { FaCalendarAlt, FaCheckCircle, FaArrowRight } from "react-icons/fa";

export default function RenouvellementHabilitation() {
  const [formData, setFormData] = useState({
    numHabilitation: "",
    dateExpiration: "",
    raison: "",
    domainesAdditionels: [],
    documents: {},
  });

  const [step, setStep] = useState(1);

  const raisons = [
    "Renouvellement régulier après expiration",
    "Extension des domaines d'habilitation",
    "Amélioration des conditions d'études",
    "Augmentation de la capacité d'accueil",
  ];

  const domainesAdditionels = [
    "Informatique",
    "Génie Civil",
    "Électronique",
    "Gestion",
    "Droit",
    "Santé",
    "Agriculture",
    "Tourisme",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDomainToggle = (domain) => {
    setFormData((prev) => ({
      ...prev,
      domainesAdditionels: prev.domainesAdditionels.includes(domain)
        ? prev.domainesAdditionels.filter((d) => d !== domain)
        : [...prev.domainesAdditionels, domain],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Demande de renouvellement:", formData);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Renouvellement d'Habilitation
          </h1>
          <p className="text-slate-600">
            Renouvelez votre habilitation ou étendez vos domaines d'enseignement
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div
              className={`flex items-center ${step >= 1 ? "bg-blue-600" : "bg-slate-300"} text-white rounded-full w-10 h-10 justify-center font-semibold`}
            >
              1
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${step >= 2 ? "bg-blue-600" : "bg-slate-300"}`}
            ></div>
            <div
              className={`flex items-center ${step >= 2 ? "bg-blue-600" : "bg-slate-300"} text-white rounded-full w-10 h-10 justify-center font-semibold`}
            >
              2
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${step >= 3 ? "bg-blue-600" : "bg-slate-300"}`}
            ></div>
            <div
              className={`flex items-center ${step >= 3 ? "bg-blue-600" : "bg-slate-300"} text-white rounded-full w-10 h-10 justify-center font-semibold`}
            >
              3
            </div>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Informations Actuelles</span>
            <span>Domaines Additionnels</span>
            <span>Validation</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-6 bg-slate-50 rounded-xl p-8 border border-slate-200">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Numéro d'Habilitation Actuelle
                </label>
                <input
                  type="text"
                  name="numHabilitation"
                  value={formData.numHabilitation}
                  onChange={handleInputChange}
                  placeholder="Ex: CERT-2024-001"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Date d'Expiration Actuelle
                </label>
                <input
                  type="date"
                  name="dateExpiration"
                  value={formData.dateExpiration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Raison du Renouvellement
                </label>
                <select
                  name="raison"
                  value={formData.raison}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                >
                  <option value="">-- Sélectionnez une raison --</option>
                  {raisons.map((raison, idx) => (
                    <option key={idx} value={raison}>
                      {raison}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6 bg-slate-50 rounded-xl p-8 border border-slate-200">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-4">
                  Domaines à Ajouter (Optionnel)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {domainesAdditionels.map((domain) => (
                    <label
                      key={domain}
                      className="flex items-center gap-3 p-3 bg-white border border-slate-300 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.domainesAdditionels.includes(domain)}
                        onChange={() => handleDomainToggle(domain)}
                        className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                      />
                      <span className="text-slate-900 font-medium">
                        {domain}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-6 bg-slate-50 rounded-xl p-8 border border-slate-200">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Résumé de votre demande
                </h3>
                <div className="space-y-2 text-sm text-blue-900">
                  <p>
                    <strong>Numéro:</strong>{" "}
                    {formData.numHabilitation || "Non renseigné"}
                  </p>
                  <p>
                    <strong>Date d'expiration:</strong>{" "}
                    {formData.dateExpiration || "Non renseignée"}
                  </p>
                  <p>
                    <strong>Raison:</strong>{" "}
                    {formData.raison || "Non renseignée"}
                  </p>
                  <p>
                    <strong>Domaines additionnels:</strong>{" "}
                    {formData.domainesAdditionels.length > 0
                      ? formData.domainesAdditionels.join(", ")
                      : "Aucun"}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-800">
                  <strong>✓ Confirmation:</strong> Votre demande de
                  renouvellement sera traitée après validation. Un email de
                  confirmation vous sera envoyé.
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between gap-4 pt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-slate-300 text-slate-900 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Précédent
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Suivant
                <FaArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Soumettre le Renouvellement
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
