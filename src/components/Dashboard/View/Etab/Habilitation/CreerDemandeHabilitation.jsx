import React, { useState } from "react";
import { FaFileContract, FaArrowRight } from "react-icons/fa";

export default function CreerDemandeHabilitation() {
  const [formData, setFormData] = useState({
    etablissementName: "",
    niveauHabilitation: "",
    domaines: [],
    motif: "",
    documents: {},
  });

  const [step, setStep] = useState(1);

  const niveauxHabilitation = [
    { id: "licence", label: "Licence (BAC+3)" },
    { id: "master", label: "Master (BAC+5)" },
    { id: "doctorat", label: "Doctorat (BAC+8)" },
  ];

  const domainesDisponibles = [
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
      domaines: prev.domaines.includes(domain)
        ? prev.domaines.filter((d) => d !== domain)
        : [...prev.domaines, domain],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Demande d'habilitation:", formData);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Nouvelle Demande d'Habilitation
          </h1>
          <p className="text-slate-600">
            Complétez ce formulaire pour demander une habilitation pour votre
            établissement
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
            <span>Informations</span>
            <span>Domaines</span>
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
                  Nom de l'Établissement
                </label>
                <input
                  type="text"
                  name="etablissementName"
                  value={formData.etablissementName}
                  onChange={handleInputChange}
                  placeholder="Entrez le nom complet de l'établissement"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Niveau d'Habilitation Demandé
                </label>
                <select
                  name="niveauHabilitation"
                  value={formData.niveauHabilitation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                >
                  <option value="">-- Sélectionnez un niveau --</option>
                  {niveauxHabilitation.map((niveau) => (
                    <option key={niveau.id} value={niveau.id}>
                      {niveau.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Motif de la Demande
                </label>
                <textarea
                  name="motif"
                  value={formData.motif}
                  onChange={handleInputChange}
                  placeholder="Décrivez le motif de votre demande d'habilitation..."
                  rows="5"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  required
                ></textarea>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6 bg-slate-50 rounded-xl p-8 border border-slate-200">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-4">
                  Domaines d'Habilitation
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {domainesDisponibles.map((domain) => (
                    <label
                      key={domain}
                      className="flex items-center gap-3 p-3 bg-white border border-slate-300 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.domaines.includes(domain)}
                        onChange={() => handleDomainToggle(domain)}
                        className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                      />
                      <span className="text-slate-900 font-medium">
                        {domain}
                      </span>
                    </label>
                  ))}
                </div>
                {formData.domaines.length === 0 && (
                  <p className="text-sm text-orange-600 mt-3">
                    ⚠️ Veuillez sélectionner au moins un domaine
                  </p>
                )}
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
                    <strong>Établissement:</strong>{" "}
                    {formData.etablissementName || "Non renseigné"}
                  </p>
                  <p>
                    <strong>Niveau:</strong>{" "}
                    {formData.niveauHabilitation || "Non sélectionné"}
                  </p>
                  <p>
                    <strong>Domaines:</strong>{" "}
                    {formData.domaines.join(", ") || "Aucun"}
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-sm text-orange-800">
                  <strong>📝 Important:</strong> Votre demande sera examinée par
                  nos services. Vous recevrez une confirmation par email.
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
                Soumettre la Demande
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
