// src/pages/CreerDemandeHabilitation.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const typesDemandes = [
  {
    id: "licence",
    title: "Habilitation Licence",
    color: "blue",
    fullTitle:
      "Demande d'habilitation des formations conduisant au grade de Licence",
    path: "/dashboard/etablissement/habilitation/formulaire/licence",
  },
  {
    id: "master",
    title: "Habilitation Master",
    color: "indigo",
    fullTitle:
      "Demande d'habilitation des formations conduisant au grade de Master",
    path: "/dashboard/etablissement/habilitation/formulaire/master",
  },
  {
    id: "doctorat",
    title: "Habilitation Doctorat",
    color: "blue",
    fullTitle:
      "Demande d'habilitation des formations conduisant au grade de Docteur",
    path: "/dashboard/etablissement/habilitation/formulaire/doctorat",
  },
];

const canevasParType = {
  licence: [
    "I. Présentation de l'institution",
    "II. Pertinence et justification de la demande d'habilitation",
    "III. Organisation des études",
    "IV. Dispositif pédagogique et maquette",
    "V. Moyens disponibles",
    "VI. Gestion des performances académiques et politique d'insertion professionnelle",
    "VII. Gouvernance et assurance qualité",
    "VIII. Annexes",
    "IX. Récapitulatif",
  ],
  master: [
    "I. Présentation de l'institution",
    "II. Politique et environnement de recherche (obligatoire – spécifique Master)",
    "III. Pertinence et justification de la demande d'habilitation",
    "IV. Organisation des études",
    "V. Dispositif pédagogique et maquette",
    "VI. Moyens disponibles",
    "VII. Gestion des performances académiques et politique d'insertion professionnelle",
    "VIII. Gouvernance et assurance qualité",
    "IX. ANNEXES",
    "X. Récapitulatif",
  ],
  doctorat: [
    "I. Informations institutionnelles",
    "II. Structure et organisation de l'école doctorale",
    "III. Ressources humaines et encadrement",
    "IV. Formation transversale et suivi des doctorants",
    "V. Environnement scientifique et infrastructures",
    "VI. Production scientifique et intégrité académique",
    "VII. Suivi des doctorants, débouchés et insertion professionnelle",
    "VIII. Gouvernance, éthique et assurance qualité",
    "IX. Annexes",
    "X. Récapitulatif",
  ],
};

const CreerDemandeHabilitation = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [hasReadCanevas, setHasReadCanevas] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  const currentType = typesDemandes.find((t) => t.id === selectedType);
  const pageTitle = currentType
    ? currentType.fullTitle
    : "Créer une demande d'habilitation";

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectType = (typeId) => {
    setSelectedType(typeId);
    setHasReadCanevas(false);
    scrollToTop();
  };

  const handleStartForm = () => {
    if (hasReadCanevas && selectedType) {
      const type = typesDemandes.find((t) => t.id === selectedType);
      navigate(type.path);
    }
  };

  const renderPageHeader = () => (
    <div className="text-center mb-8 md:mb-12 bg-white pb-6 border-b border-gray-200 sticky top-0 z-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 px-4">
        {pageTitle}
      </h1>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto">
        {renderPageHeader()}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {typesDemandes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleSelectType(type.id)}
              className={`
                relative group bg-white rounded-xl shadow border p-6 text-left transition-all duration-200
                hover:shadow-lg hover:border-${type.color}-500
                ${
                  selectedType === type.id
                    ? `border-${type.color}-600 bg-${type.color}-50/60 shadow-md`
                    : "border-gray-200"
                }
              `}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {type.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {type.id === "licence"
                  ? "Formation de Licence (LMD)"
                  : type.id === "master"
                    ? "Formation de Master (recherche / professionnel)"
                    : "Doctorat / École Doctorale"}
              </p>

              {selectedType === type.id && (
                <span
                  className={`absolute top-4 right-4 bg-${type.color}-100 text-${type.color}-800 text-xs font-medium px-2.5 py-1 rounded-full`}
                >
                  Sélectionné
                </span>
              )}
            </button>
          ))}
        </div>

        {selectedType && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Canevas</h2>

              <p className="text-gray-700 mb-4 font-medium">
                Éléments et informations à préparer pour cette demande :
              </p>

              <ul className="list-disc pl-6 space-y-2.5 text-gray-700">
                {canevasParType[selectedType].map((item, index) => (
                  <li key={index} className="text-base">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-6 md:px-8 py-8">
              <div className="space-y-6 max-w-lg mx-auto">
                <div className="flex items-start">
                  <input
                    id="accept-canevas"
                    type="checkbox"
                    checked={hasReadCanevas}
                    onChange={(e) => setHasReadCanevas(e.target.checked)}
                    className="mt-1.5 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="accept-canevas"
                    className="ml-3 text-sm md:text-base text-gray-700 leading-6"
                  >
                    J'ai pris connaissance du canevas et je m'engage à fournir
                    des informations complètes, exactes et conformes aux
                    exigences.
                    <span className="text-red-600 font-medium">
                      {" "}
                      (obligatoire)
                    </span>
                  </label>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleStartForm}
                    disabled={!hasReadCanevas}
                    className={`
                      px-10 py-4 rounded-lg font-medium transition flex items-center gap-3 shadow-md text-base
                      ${
                        hasReadCanevas
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }
                    `}
                  >
                    Passer au formulaire
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
        )}

        {!selectedType && (
          <div className="text-center text-gray-500 mt-12 text-lg">
            Sélectionnez un type de demande ci-dessus pour voir le canevas
            correspondant
          </div>
        )}
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          aria-label="Retour en haut"
        >
          <svg
            className="w-6 h-6"
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

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
};

export default CreerDemandeHabilitation;