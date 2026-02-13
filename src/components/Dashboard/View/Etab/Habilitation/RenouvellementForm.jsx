import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import mesupresLogo from "../../../../../assets/images/mesupres-logo.png";

const steps = [
  { id: 1, title: "Présentation de l'institution" },
  { id: 2, title: "Bilan de la formation précédente" },
  { id: 3, title: "Description actualisée de la formation" },
  { id: 4, title: "Ressources humaines et infrastructures" },
  { id: 5, title: "Gouvernance, assurance qualité et pilotage" },
  { id: 6, title: "Performances académiques et insertion professionnelle" },
  { id: 7, title: "Synthèse et conclusion" },
  { id: 8, title: "Annexes obligatoires" },
  { id: 9, title: "Récapitulatif" },
];

const RenouvellementForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      scrollToTop();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollToTop();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(
        <div className="text-sm">
          <div className="font-semibold">Demande soumise avec succès</div>
          <div className="text-xs mt-0.5">Accusé de réception par email</div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          className: "!max-w-[280px] md:!max-w-[320px]",
          bodyClassName: "!p-2",
        },
      );
    } catch (error) {
      toast.error(
        <div className="text-sm">
          <div className="font-semibold">Erreur de soumission</div>
          <div className="text-xs mt-0.5">Veuillez réessayer</div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          className: "!max-w-[280px] md:!max-w-[320px]",
          bodyClassName: "!p-2",
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (stepId) => {
    switch (stepId) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">
                Présentation de l'institution
              </h3>
              <p className="text-gray-600 text-justify leading-relaxed text-sm md:text-base">
                Veuillez fournir les informations concernant votre institution :
                nom, statut juridique, historique, organigramme, etc.
              </p>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4 md:p-6">
              <h4 className="font-semibold text-gray-800 mb-3 md:mb-4 text-lg md:text-xl">
                Récapitulatif complet
              </h4>
              <div className="space-y-3 md:space-y-4">
                {steps.slice(0, -1).map((step, index) => (
                  <div key={step.id} className="flex items-start">
                    <div
                      className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-3 ${
                        index < 8 ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {index < 8 ? (
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span className="text-xs md:text-sm text-gray-600">
                          {step.id}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm md:text-base">
                        {step.title}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">
                        {index < 8 ? "Section complétée" : "Section en cours"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm md:text-base">
                    Prêt à soumettre
                  </h4>
                  <p className="text-blue-700 text-xs md:text-sm">
                    Cliquez sur "Soumettre la demande" pour finaliser votre
                    renouvellement d'habilitation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">
                {steps[stepId - 1].title}
              </h3>
              <p className="text-gray-600 text-justify leading-relaxed text-sm md:text-base">
                Contenu de la section "{steps[stepId - 1].title}"...
              </p>
            </div>
          </div>
        );
    }
  };

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <>
      <div className="min-h-screen bg-white py-4 md:py-8 px-3 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* En-tête - Version mobile ET desktop */}
          <div className="mb-6 md:mb-10">
            {/* Version mobile - centrée */}
            <div className="md:hidden text-center mb-4">
              <div className="flex justify-center mb-2">
                <img
                  src={mesupresLogo}
                  alt="Logo MESUPReS"
                  className="h-12 w-auto"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                Renouvellement d'Habilitation
              </h1>
              <p className="text-gray-600 text-sm">
                MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR<br />
                ET DE LA RECHERCHE SCIENTIFIQUE
              </p>
            </div>

            {/* Version desktop - alignée à gauche */}
            <div className="hidden md:flex items-center mb-3">
              <img
                src={mesupresLogo}
                alt="Logo MESUPReS"
                className="h-12 w-auto mr-4"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Renouvellement d'Habilitation
                </h1>
                <p className="text-gray-600 text-base">
                  MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR ET DE LA RECHERCHE SCIENTIFIQUE
                </p>
              </div>
            </div>
          </div>

          {/* Barre de progression globale */}
          <div className="mb-6 md:mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs md:text-sm font-medium text-gray-700">
                Progression globale
              </span>
              <span className="text-xs md:text-sm font-semibold text-blue-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Affichage mobile uniquement: Étape actuelle */}
          <div className="md:hidden mb-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-bold text-gray-900">
                Étape {currentStep} : {steps[currentStep - 1].title}
              </h2>
              <p className="text-gray-600 text-xs mt-1">
                Étape {currentStep} sur {steps.length}
              </p>
            </div>
          </div>

          {/* Barre de progression détaillée - Masquée sur mobile */}
          <div className="mb-8 md:mb-10 hidden md:block">
            <div className="relative">
              <div className="absolute left-4 right-4 top-5 h-0.5 bg-gray-200 -translate-y-1/2"></div>

              <div
                className="absolute left-4 top-5 h-0.5 bg-blue-600 -translate-y-1/2 transition-all duration-500 ease-out"
                style={{
                  width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 2rem)`,
                }}
              ></div>

              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-9 gap-3 md:gap-4">
                {steps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className="relative z-10">
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          step.id < currentStep
                            ? "bg-green-500 border-green-500 text-white"
                            : step.id === currentStep
                              ? "bg-blue-600 border-blue-600 text-white ring-2 md:ring-4 ring-blue-100"
                              : "bg-white border-gray-300 text-gray-400"
                        }`}
                      >
                        {step.id < currentStep ? (
                          <svg
                            className="w-4 h-4 md:w-5 md:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <span
                            className={`font-bold text-sm md:text-base ${step.id === currentStep ? "text-white" : "text-gray-500"}`}
                          >
                            {step.id}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 text-center">
                      <p
                        className={`text-xs font-medium leading-tight ${
                          step.id <= currentStep
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title.split(" ").map((word, i) => (
                          <React.Fragment key={i}>
                            {word}
                            {i < step.title.split(" ").length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="max-w-5xl mx-auto">
            {/* Version Desktop/Tablette */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="max-w-none">
                  {renderStepContent(currentStep)}
                </div>
              </div>

              <div className="px-6 md:px-8 py-4 md:py-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    {/* Bouton Précédent */}
                    {currentStep > 1 && (
                      <button
                        onClick={handlePrevious}
                        className="px-4 py-2.5 md:px-5 md:py-3 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 border border-gray-300 hover:border-gray-400 flex items-center gap-2 text-sm md:text-base"
                      >
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        <span>Précédent</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-4 sm:mt-0">
                    {/* Bouton Suivant/Terminer */}
                    {currentStep === steps.length ? (
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 md:px-8 md:py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Soumission en cours...</span>
                          </>
                        ) : (
                          <>
                            <span>Soumettre la demande</span>
                            <svg
                              className="w-4 h-4 md:w-5 md:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="px-6 py-2.5 md:px-8 md:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2 text-sm md:text-base"
                      >
                        <span>Suivant</span>
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Version Mobile */}
            <div className="md:hidden">
              {/* Contenu de l'étape pour mobile */}
              <div className="pb-4">
                <div className="max-w-none">
                  {renderStepContent(currentStep)}
                </div>
              </div>

              {/* Navigation - Mobile */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                {/* Boutons Précédent/Suivant */}
                <div className="flex items-center gap-3">
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrevious}
                      className="flex-1 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg font-medium border border-gray-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <span>Précédent</span>
                    </button>
                  )}

                  {currentStep === steps.length ? (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Soumettre</span>
                        </>
                      ) : (
                        <>
                          <span>Soumettre</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className={`flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm`}
                    >
                      <span>Suivant</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Indicateurs - Desktop uniquement */}
          <div className="max-w-5xl mx-auto mt-6 hidden md:flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Étape complétée</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span>Étape actuelle</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full border-2 border-gray-300 bg-white"></div>
              <span>Étape à venir</span>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        className="!text-sm"
        toastClassName="!max-w-[280px] md:!max-w-[320px] !rounded-lg !shadow-lg"
        bodyClassName="!p-2"
        progressClassName="!h-0.5"
      />
    </>
  );
};

export default RenouvellementForm;