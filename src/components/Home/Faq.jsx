import React, { useState } from "react";
import { Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react";

const Faq = () => {
  const [activeView, setActiveView] = useState("summary");
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const allFaqData = [
    // --- 5 PREMIÈRES QUESTIONS (Défaut) ---
    {
      question: "Comment se déroule le processus d'accréditation ?",
      answer:
        "Le processus débute par une demande officielle, suivie d'une auto-évaluation. Ensuite, une visite d'audit est organisée par nos experts pour rédiger un rapport décisif.",
    },
    {
      question: "Quels sont les délais pour obtenir une réponse ?",
      answer:
        "Le rapport provisoire est envoyé sous 30 jours. La décision finale de la commission est communiquée dans un délai maximum de 3 mois après l'audit.",
    },
    {
      question: "La certification est-elle valable à l'international ?",
      answer:
        "Oui, nos accréditations sont reconnues par les réseaux internationaux partenaires, facilitant la mobilité des étudiants.",
    },
    {
      question: "Comment devenir évaluateur pour la DAAQ ?",
      answer:
        "Nous lançons des appels à candidature pour des académiques ou professionnels. Une formation certifiante est obligatoire avant la première mission.",
    },
    {
      question: "Quelle est la durée de validité d'une accréditation ?",
      answer:
        "Une accréditation est valide pour 5 ans, avec un possible audit de suivi à mi-parcours.",
    },
    // --- QUESTIONS SUPPLÉMENTAIRES (Mode 'full') ---
    {
      question: "Quels documents sont requis pour le dossier ?",
      answer:
        "Le statut juridique, les maquettes pédagogiques, la liste du corps enseignant et les rapports d'activités des deux dernières années.",
    },
    {
      question: "Peut-on faire appel d'une décision de refus ?",
      answer:
        "Oui, un recours gracieux peut être déposé dans un délai de 2 mois suivant la notification.",
    },
    {
      question: "Les frais d'audit sont-ils à la charge de l'établissement ?",
      answer:
        "Oui, les frais logistiques et administratifs liés à l'audit sont à la charge de l'établissement demandeur.",
    },
    {
      question: "L'accréditation concerne-t-elle le e-learning ?",
      answer:
        "Oui, nous disposons d'un référentiel spécifique pour l'évaluation des formations à distance.",
    },
  ];

  const displayedFaq =
    activeView === "summary" ? allFaqData.slice(0, 5) : allFaqData;

  return (
    // CHANGEMENT 1: Fond blanc pur (bg-white) au lieu de bg-slate-50
    <section
      id="faq"
      className="relative py-12 sm:py-16 bg-white overflow-hidden"
    >
      {/* Fond décoratif (Blobs pastels très légers pour la texture sur blanc) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative container px-4 mx-auto max-w-3xl">
        {/* En-tête */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            {activeView === "summary"
              ? "Questions Fréquentes"
              : "Toutes les Questions"}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Réponses rapides sur nos procédures d'accréditation.
          </p>
        </div>

        {/* Liste des Accordéons */}
        <div className="space-y-3 animate-fade-in-up">
          {displayedFaq.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                // CHANGEMENT 2: Bordures et ombres adaptées pour détacher du fond blanc
                className={`group border rounded-xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-white border-indigo-200 shadow-lg shadow-indigo-100/50 ring-1 ring-indigo-50"
                    : "bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex items-center justify-between w-full p-4 sm:p-5 text-left focus:outline-none select-none"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-base sm:text-lg font-bold pr-4 transition-colors duration-300 leading-tight ${
                      isOpen ? "text-indigo-600" : "text-slate-800"
                    }`}
                  >
                    {item.question}
                  </span>

                  <div
                    className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                      isOpen
                        ? "bg-indigo-600 text-white rotate-180"
                        : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                    }`}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Zone des boutons en bas */}
        <div className="mt-8 text-center">
          {activeView === "summary" ? (
            // Bouton "Voir toutes"
            <button
              onClick={() => setActiveView("full")}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border border-indigo-100 text-indigo-600 text-sm font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm"
            >
              Voir toutes les questions <ArrowRight size={16} />
            </button>
          ) : (
            // Bouton "Retour"
            <button
              onClick={() => {
                setActiveView("summary");
                setOpenIndex(null);
                const el = document.getElementById("faq");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold hover:bg-indigo-100 transition-all shadow-sm"
            >
              <ArrowLeft size={16} /> Retour au résumé
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Faq;
