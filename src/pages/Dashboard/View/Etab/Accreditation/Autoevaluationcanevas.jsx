import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mesupresLogo from "../../../../../assets/images/mesupres-logo.png";

export default function AutoEvaluationCanevas() {
  const navigate = useNavigate();
  const [hasReadCanevas, setHasReadCanevas] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleStartEvaluation = () => {
    if (hasReadCanevas) {
      navigate("/dashboard/etablissement/accreditation/auto-evaluation");
    }
  };

  const steps = [
    {
      id: 1,
      title: "Demande d'accréditation",
      description:
        "L'établissement d'enseignement supérieur (IES) soumet une demande officielle d'accréditation auprès du MESUPRES.",
    },
    {
      id: 2,
      title: "Auto-évaluation (interne)",
      description:
        "L'IES effectue une auto-évaluation selon le référentiel d'accréditation ou de labellisation, en analysant ses domaines de performance et en préparant un rapport d'auto-évaluation.",
    },
    {
      id: 3,
      title: "Traitement préalable par la DAAQ",
      description:
        "La Direction de l'Assurance de l'Assurance Qualité (DAAQ) analyse le rapport d'auto-évaluation soumis par l'IES avant la visite externe.",
    },
    {
      id: 4,
      title: "Évaluation externe par des experts",
      description:
        "Une équipe d'experts indépendants réalise l'évaluation externe sur terrain, examine les documents, rencontre le groupe de pilotage et rédige un rapport d'évaluation externe.",
    },
    {
      id: 5,
      title: "Réunion de la Commission Nationale d'Accréditation (CNA)",
      description:
        "La CNA étudie les rapports d'évaluation externe et prend une décision formelle (positive ou négative) d'accréditation.",
    },
    {
      id: 6,
      title: "Décision de la CNA et communication du résultat",
      description:
        "Le MESUPRES communique la décision officielle à l'IES et publie, le cas échéant, la liste des établissements accrédités.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* EN-TÊTE */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
          <div className="flex justify-center mb-5">
            <img
              src={mesupresLogo}
              alt="MESUPRES Logo"
              className="h-20 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Auto-évaluation pour l'Accréditation
          </h1>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR ET DE LA RECHERCHE
            SCIENTIFIQUE
          </p>
        </div>

        {/* OBJECTIFS */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              Mécanisme d'accréditation et de labellisation
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">Objectifs</p>
          </div>
          <div className="p-6">
            <ol className="list-decimal pl-5 text-slate-700 text-sm space-y-2 mb-5">
              <li>
                Accréditer les IES dont les offres de formation sont habilitées.
              </li>
              <li>
                Engager les procédures d'évaluation suivant les normes et
                critères fixés par Arrêté ministériel.
              </li>
              <li>
                Accorder l'accréditation aux IES offrant des formations courtes,
                de la Licence au Doctorat.
              </li>
              <li>
                Assurer une amélioration continue de la qualité de
                l'enseignement supérieur.
              </li>
              <li>Durée de validité de l'accréditation : 5 ans.</li>
              <li>
                Renforcer la transparence et la communication des décisions
                d'accréditation.
              </li>
            </ol>
            <p className="text-sm text-slate-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              <strong className="text-blue-800">Portée :</strong> amélioration
              continue de la qualité des établissements d'enseignement supérieur
              (IES).
            </p>
          </div>
        </div>

        {/* PROCÉDURE EN 6 ÉTAPES */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              Procédure d'évaluation pour l'accréditation
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="bg-white border border-blue-100 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step.id}
                    </div>
                    <div className="text-sm text-slate-700 leading-relaxed">
                      <strong className="block text-slate-900 mb-1">
                        {step.title}
                      </strong>
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NOTE IMPORTANTE */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold text-blue-800">Important</p>
            <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
              Chaque critère nécessite une appréciation, une note sur 4, et des
              preuves (sauf si l'appréciation est "Aucune preuve"). Vous pouvez
              joindre jusqu'à 3 fichiers par critère (PDF, images, documents
              Word) de 8 Mo maximum chacun.
            </p>
          </div>
        </div>

        {/* ACCEPTATION + BOUTON */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="max-w-3xl mx-auto space-y-6">
            <label
              htmlFor="accept-canevas"
              className="flex items-start gap-3 cursor-pointer group"
            >
              <input
                id="accept-canevas"
                type="checkbox"
                checked={hasReadCanevas}
                onChange={(e) => setHasReadCanevas(e.target.checked)}
                className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-gray-700 leading-6 group-hover:text-gray-900 transition-colors">
                J'ai pris connaissance du canevas d'évaluation et je m'engage à
                fournir des informations complètes, exactes et conformes aux
                exigences pour chaque critère.{" "}
                <span className="text-red-600 font-medium">(obligatoire)</span>
              </span>
            </label>

            <div className="flex justify-center pt-2">
              <button
                onClick={handleStartEvaluation}
                disabled={!hasReadCanevas}
                className={`
                  flex items-center gap-3 px-10 py-4 rounded-xl font-semibold text-base transition-all duration-200
                  ${
                    hasReadCanevas
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                Commencer l'auto-évaluation
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          aria-label="Retour en haut"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
