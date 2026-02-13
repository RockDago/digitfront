// src/components/Dashboard/View/Etab/Habilitation/FormLicence.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formSteps = [
  { id: 1, title: "Présentation\nde\nl'institution" },
  {
    id: 2,
    title: "Pertinence\net\njustification\nde la\ndemande d'habilitation",
  },
  { id: 3, title: "Organisation\ndes\nétudes" },
  { id: 4, title: "Dispositif\npédagogique\net\nmaquette" },
  { id: 5, title: "Moyens\ndisponibles" },
  {
    id: 6,
    title:
      "Gestion\ndes\nperformances\nacadémiques\net\npolitique\nd'insertion\nprofessionnelle",
  },
  { id: 7, title: "Gouvernance\net\nassurance\nqualité" },
  { id: 8, title: "Annexes" },
  { id: 9, title: "Récapitulatif" },
];

const FormLicence = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formData, setFormData] = useState({
    step1: "",
    step2: "",
    step3: "",
    step4: "",
    step5: "",
    step6: "",
    step7: "",
    step8: null,
  });

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

  const handleNext = () => {
    if (currentStep < formSteps.length) {
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

  const handleBackToCanevas = () => {
    navigate("/dashboard/etablissement/habilitation/creer-demande");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Demande de Licence soumise avec succès !", {
        position: "top-right",
        autoClose: 4000,
      });
      setTimeout(() => navigate("/dashboard/etablissement/habilitation/creer-demande"), 2000);
    } catch (error) {
      toast.error("Erreur lors de la soumission", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (step, value) => {
    setFormData((prev) => ({ ...prev, [step]: value }));
  };

  const progressPercentage =
    formSteps.length > 1
      ? ((currentStep - 1) / (formSteps.length - 1)) * 100
      : 0;

  const renderFormContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <p className="text-gray-700">
              Présentez votre institution : historique, missions, valeurs,
              positionnement géographique, statut juridique, organigramme, et
              autres informations pertinentes.
            </p>
            <textarea
              value={formData.step1}
              onChange={(e) => handleInputChange("step1", e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rédigez ici la présentation de votre institution..."
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <p className="text-gray-700">
              Justifiez la pertinence de votre demande d'habilitation :
              besoins du marché, adéquation avec les politiques nationales,
              analyse du contexte socio-économique, et valeur ajoutée de la
              formation.
            </p>
            <textarea
              value={formData.step2}
              onChange={(e) => handleInputChange("step2", e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rédigez ici la pertinence et justification de la demande d'habilitation..."
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <p className="text-gray-700">
              Décrivez l'organisation des études : durée, semestres, rythme de
              formation, calendrier académique, modalités d'inscription, et
              structure générale du parcours.
            </p>
            <textarea
              value={formData.step3}
              onChange={(e) => handleInputChange("step3", e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rédigez ici l'organisation des études..."
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <p className="text-gray-700">
              Présentez le dispositif pédagogique et la maquette détaillée :
              unités d'enseignement, crédits ECTS, volume horaire, méthodes
              pédagogiques, et articulation entre les différents
              enseignements.
            </p>
            <textarea
              value={formData.step4}
              onChange={(e) => handleInputChange("step4", e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rédigez ici le dispositif pédagogique et maquette..."
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <p className="text-gray-700">
              Détaillez les moyens disponibles : ressources humaines
              (enseignants, administratifs), infrastructures (locaux,
              équipements, bibliothèque), moyens financiers, et ressources
              numériques.
            </p>
            <textarea
              value={formData.step5}
              onChange={(e) => handleInputChange("step5", e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rédigez ici les moyens disponibles..."
            />
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <p className="text-gray-700">
              Décrivez la gestion des performances académiques (taux de
              réussite, poursuite d'études) et présentez votre politique
              d'insertion professionnelle (stages, partenariats entreprises,
              accompagnement des diplômés).
            </p>
            <textarea
              value={formData.step6}
              onChange={(e) => handleInputChange("step6", e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rédigez ici la gestion des performances académiques et politique d'insertion professionnelle..."
            />
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <p className="text-gray-700">
              Présentez la gouvernance de la formation, les mécanismes
              d'assurance qualité, les instances de pilotage, et les
              procédures d'évaluation et d'amélioration continue.
            </p>
            <textarea
              value={formData.step7}
              onChange={(e) => handleInputChange("step7", e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rédigez ici la gouvernance et assurance qualité..."
            />
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <p className="text-gray-700">
              Téléchargez les annexes obligatoires : maquettes pédagogiques
              détaillées, CV des enseignants, conventions de partenariat,
              rapports d'évaluation, supports de cours, etc.
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mt-2 text-gray-600">
                Glissez-déposez vos fichiers ou cliquez pour sélectionner
              </p>
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                onChange={(e) => handleInputChange("step8", e.target.files)}
              />
              <label
                htmlFor="file-upload"
                className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Sélectionner des fichiers
              </label>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-6">
            <p className="text-gray-700">
              Récapitulatif de l'ensemble de votre demande. Vérifiez toutes
              les informations avant soumission finale.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">
                Aperçu de votre demande d'habilitation Licence
              </h3>
              <ul className="space-y-2">
                {formSteps.slice(0, -1).map((step, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{step.title.replace(/\n/g, " ")} - Complété</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">
                  ✅ Toutes les sections ont été complétées. Votre demande est
                  prête à être soumise.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white py-6 md:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12 bg-white pb-6 border-b border-gray-200 sticky top-0 z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 px-4">
            Demande d'habilitation des formations conduisant au grade de Licence
          </h1>
        </div>

        <div className="mb-8 md:mb-12">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm md:text-base font-medium text-gray-600">
              Progression
            </span>
            <span className="text-sm md:text-base font-semibold text-blue-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 md:h-3">
            <div
              className="h-2.5 md:h-3 rounded-full transition-all duration-500 ease-out bg-blue-600"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Version mobile : étape actuelle */}
        <div className="md:hidden mb-6">
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              Étape {currentStep} sur {formSteps.length}
            </h2>
            <p className="text-lg text-gray-700 mt-2 font-medium">
              {formSteps[currentStep - 1]?.title.replace(/\n/g, " ")}
            </p>
          </div>
        </div>

        {/* Version desktop : stepper adaptatif */}
        <div className="hidden md:block mb-10">
          <div className="relative">
            <div className="absolute left-0 right-0 top-[22px] h-0.5 bg-gray-200" />
            <div
              className="absolute left-0 top-[22px] h-0.5 transition-all duration-500 ease-out bg-blue-600"
              style={{ width: `${progressPercentage}%` }}
            />

            <div className="grid grid-cols-9 gap-3 relative z-10">
              {formSteps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-sm font-bold
                      ${
                        step.id < currentStep
                          ? "bg-green-600 border-green-600 text-white"
                          : step.id === currentStep
                            ? "bg-blue-600 border-blue-600 ring-blue-200 text-white ring-2"
                            : "bg-white border-gray-300 text-gray-500"
                      }
                    `}
                  >
                    {step.id < currentStep ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <p className="mt-2 text-xs font-medium text-gray-700 text-center leading-tight whitespace-pre-line">
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contenu étape */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-9 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            {formSteps[currentStep - 1]?.title.replace(/\n/g, " ")}
          </h2>

          <div className="min-h-[50vh]">{renderFormContent()}</div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6">
          {currentStep === 1 ? (
            <button
              onClick={handleBackToCanevas}
              className="flex items-center gap-2 px-6 md:px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 border border-gray-300 transition"
            >
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Retour au canevas
            </button>
          ) : (
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 px-6 md:px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 border border-gray-300 transition"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Précédent
            </button>
          )}

          {currentStep < formSteps.length ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 md:px-10 py-3 rounded-lg font-medium hover:opacity-90 shadow-sm transition bg-blue-600 text-white hover:bg-blue-700"
            >
              Suivant
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`
                flex items-center gap-2 px-8 md:px-10 py-3 rounded-lg font-medium shadow-sm transition
                ${
                  isSubmitting
                    ? "bg-green-400 text-white cursor-wait"
                    : "bg-green-600 text-white hover:bg-green-700"
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                "Soumettre la demande"
              )}
            </button>
          )}
        </div>
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

export default FormLicence;