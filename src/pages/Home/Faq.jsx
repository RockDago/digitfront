import React, { useState, useEffect } from "react";
import { Plus, Minus, ArrowRight, ArrowLeft, Search } from "lucide-react";
import faqService from "../../services/faq.service"; // Ajustez le chemin selon l'emplacement

export default function Faq() {
  const [faqs, setFaqs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [openIndex, setOpenIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // État pour gérer la limite d'affichage (5 ou tous)
  const [showAll, setShowAll] = useState(false);

  const categories = ["Tous", "Equivalences", "Accréditation", "Habilitation"];

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setIsLoading(true);
        // Récupérer les FAQs actives depuis l'API
        const data = await faqService.getActiveFaqs();
        if (data && data.length > 0) {
          setFaqs(data);
        } else {
          setFaqs([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des FAQs:", error);
        setFaqs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  // 1. Filtrer par catégorie
  const filteredByCategory =
    activeCategory === "Tous"
      ? faqs
      : faqs.filter((faq) => faq.categorie === activeCategory);

  // 2. Appliquer la limite d'affichage (5 premiers ou tous)
  const displayedFaqs = showAll
    ? filteredByCategory
    : filteredByCategory.slice(0, 5);

  // Vérifier s'il y a plus de 5 éléments pour afficher le bouton "Voir toutes"
  const hasMoreItems = filteredByCategory.length > 5;

  const toggleFaq = (id) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setOpenIndex(null);
    setShowAll(false); // Réinitialiser la vue "Voir toutes" au changement de catégorie
  };

  return (
    <section
      id="faq"
      className="relative py-20 bg-white min-h-screen overflow-hidden"
    >
      {/* Fond décoratif (Blobs) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container px-4 mx-auto max-w-5xl relative z-10">
        {/* En-tête */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            {showAll ? "Toutes les Questions" : "Questions Fréquentes"}
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Retrouvez ici les réponses aux questions les plus courantes sur nos
            procédures.
          </p>
        </div>

        {/* Navigation par Catégories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200 scale-105"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Liste des FAQ */}
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl" />
              ))}
            </div>
          ) : displayedFaqs.length > 0 ? (
            <div className="space-y-4 animate-fade-in-up">
              {displayedFaqs.map((faq) => {
                const isOpen = openIndex === faq.id;

                return (
                  <div
                    key={faq.id}
                    className={`group rounded-2xl transition-all duration-300 border ${
                      isOpen
                        ? "bg-white border-blue-100 shadow-xl shadow-blue-50 ring-1 ring-blue-50"
                        : "bg-white border-slate-100 hover:border-blue-100 hover:shadow-md"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="flex items-start justify-between w-full p-6 text-left focus:outline-none"
                    >
                      <span
                        className={`text-lg font-semibold pr-8 transition-colors duration-300 ${
                          isOpen ? "text-blue-600" : "text-slate-800"
                        }`}
                      >
                        {faq.question}
                      </span>
                      <span
                        className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                          isOpen
                            ? "bg-blue-600 text-white rotate-180"
                            : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"
                        }`}
                      >
                        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                      </span>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-6 pb-6 pt-0">
                        <div className="pt-4 border-t border-slate-50">
                          <p className="text-slate-600 leading-relaxed text-base">
                            {faq.reponse}
                          </p>
                          <div className="mt-4 flex items-center gap-2">
                            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-500">
                              {faq.categorie}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white mb-4 shadow-sm">
                <Search className="text-slate-400" size={20} />
              </div>
              <h3 className="text-lg font-medium text-slate-900">
                Aucune question trouvée
              </h3>
              <p className="text-slate-500 mt-1">
                {activeCategory === "Tous"
                  ? "Aucune FAQ n'a encore été ajoutée."
                  : `Aucune FAQ disponible pour la catégorie "${activeCategory}".`}
              </p>
            </div>
          )}

          {/* Boutons Voir Plus / Retour */}
          <div className="mt-10 text-center">
            {hasMoreItems && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-indigo-100 text-indigo-600 text-sm font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md"
              >
                Voir toutes les questions <ArrowRight size={16} />
              </button>
            )}

            {showAll && (
              <button
                onClick={() => {
                  setShowAll(false);
                  setOpenIndex(null);
                  const el = document.getElementById("faq");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold hover:bg-indigo-100 transition-all shadow-sm"
              >
                <ArrowLeft size={16} /> Retour au résumé
              </button>
            )}
          </div>
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
}
