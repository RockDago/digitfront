import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import actualiteService from "../../services/actualite.service";

// ✅ Fonction pour créer un slug à partir du titre
const createSlug = (titre) => {
  return titre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
    .replace(/[^a-z0-9]+/g, "-") // Remplacer les caractères spéciaux par des tirets
    .replace(/^-+|-+$/g, ""); // Enlever les tirets au début et à la fin
};

const Actu = () => {
  // === ÉTATS ===
  const [actualites, setActualites] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const trackRef = useRef(null);
  const wrapRef = useRef(null);

  // === RÉCUPÉRATION DES DONNÉES (5 PLUS RÉCENTES) ===
  useEffect(() => {
    const fetchActualites = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await actualiteService.getActiveFaqs();

        const sortedData = data
          .sort(
            (a, b) =>
              new Date(b.date_publication) - new Date(a.date_publication),
          )
          .slice(0, 5);

        const formattedData = sortedData.map((actu) => ({
          id: actu.id,
          title: actu.titre,
          slug: createSlug(actu.titre), // ✅ AJOUT du slug
          description: actu.description,
          contenu: actu.contenu,
          image: `${actualiteService.getBaseURL()}${actu.couverture_url}`,
          thumb: `${actualiteService.getBaseURL()}${actu.couverture_url}`,
          date_publication: actu.date_publication,
        }));

        setActualites(formattedData);
        setCurrent(0);
      } catch (err) {
        console.error("Erreur lors du chargement des actualités:", err);
        setError("Impossible de charger les actualités");
        setActualites([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActualites();
  }, []);

  // --- LOGIQUE AUTO-SCROLL ---
  useEffect(() => {
    let interval;
    if (actualites.length > 0) {
      interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % actualites.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [actualites.length]);

  // --- LOGIQUE DE CENTRAGE ---
  const scrollToCard = (index) => {
    if (!trackRef.current || !wrapRef.current) return;
    const card = trackRef.current.children[index];
    if (!card) return;

    const cardLeft = card.offsetLeft;
    const cardWidth = card.clientWidth;
    const containerWidth = wrapRef.current.clientWidth;
    const scrollPos = cardLeft + cardWidth / 2 - containerWidth / 2;

    wrapRef.current.scrollTo({
      left: scrollPos,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (actualites.length > 0) {
      scrollToCard(current);
    }
  }, [current, actualites.length]);

  useEffect(() => {
    const handleResize = () => scrollToCard(current);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [current]);

  const activate = (i) => {
    setCurrent(i);
  };

  const go = (step) => {
    let newIndex = current + step;
    if (newIndex < 0) newIndex = actualites.length - 1;
    if (newIndex >= actualites.length) newIndex = 0;
    activate(newIndex);
  };

  // === ÉTATS DE CHARGEMENT ET ERREUR ===
  if (isLoading) {
    return (
      <section className="relative py-8 sm:py-12 lg:py-16 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 opacity-100" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Chargement des actualités...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || actualites.length === 0) {
    return (
      <section className="relative py-8 sm:py-12 lg:py-16 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 opacity-100" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="max-w-2xl mx-auto">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-xs sm:text-sm mb-2 block">
                Actualités
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-4">
                Actualités & Événements
              </h2>
              <p className="text-slate-600 text-base">
                {error || "Aucune actualité disponible pour le moment."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="actu"
      className="relative py-8 sm:py-12 lg:py-16 bg-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 opacity-100" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-6 sm:mb-10">
          <div className="max-w-2xl w-full sm:w-auto">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-xs sm:text-sm mb-2 block animate-pulse">
              À la une • En direct
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
              Actualités & Événements
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => go(-1)}
              className="w-10 h-10 rounded-full border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all"
              aria-label="Actualité précédente"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => go(1)}
              className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
              aria-label="Actualité suivante"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* SLIDER WRAPPER - Taille réduite */}
        <div
          ref={wrapRef}
          className="
            overflow-x-auto overflow-y-hidden 
            snap-x snap-mandatory scroll-smooth 
            pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-8
            scrollbar-hide
          "
        >
          <div
            ref={trackRef}
            className="flex flex-row items-stretch sm:items-center lg:items-start gap-3 sm:gap-5 lg:gap-6"
          >
            {actualites.map((actu, index) => {
              const isActive = index === current;

              // Tailles réduites
              let widthClass = "";
              widthClass += "w-[80vw] ";
              widthClass += isActive ? "sm:w-[400px] " : "sm:w-[240px] ";
              widthClass += isActive ? "lg:w-[550px] " : "lg:w-[90px] ";

              let heightClass = "h-[320px] sm:h-[360px] lg:h-[420px]";

              let cardClasses = `
                relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer 
                transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex-shrink-0
                snap-center
                ${widthClass}
                ${heightClass}
              `;

              if (isActive) {
                cardClasses +=
                  " shadow-xl shadow-slate-300 z-10 scale-100 opacity-100";
              } else {
                cardClasses +=
                  " opacity-100 sm:opacity-70 hover:opacity-100 hover:sm:w-[260px] hover:lg:w-[110px]";
              }

              return (
                <article
                  key={actu.id}
                  onClick={() => activate(index)}
                  className={cardClasses}
                >
                  <img
                    src={actu.image}
                    alt={actu.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${
                      isActive ? "scale-100" : "scale-110 grayscale-[10%]"
                    }`}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200";
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${
                      isActive ? "opacity-100" : "opacity-80"
                    }`}
                  />

                  {/* Contenu */}
                  <div
                    className={`
                      absolute inset-0 p-5 sm:p-6 flex flex-col justify-end 
                      transition-all duration-500
                      ${
                        isActive
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 sm:translate-y-6 opacity-100 sm:opacity-80"
                      }
                    `}
                  >
                    <div className="max-w-xl w-full">
                      {/* Badge bleu */}
                      <span
                        className={`inline-block px-2.5 py-1 mb-2.5 rounded-full bg-blue-600/90 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${
                          isActive
                            ? "opacity-100"
                            : "opacity-0 sm:opacity-0 lg:opacity-0"
                        }`}
                      >
                        {index === 0 ? "Nouvelle Actualité" : "Actualité"}
                      </span>

                      {/* Titre */}
                      <h3
                        className={`font-bold text-white mb-2.5 leading-tight transition-all duration-300 ${
                          isActive
                            ? "text-lg sm:text-xl lg:text-3xl"
                            : "text-base sm:text-lg lg:text-lg lg:hidden"
                        }`}
                      >
                        {actu.title}
                      </h3>

                      {/* Description */}
                      <div
                        className={`space-y-3 overflow-hidden transition-all duration-500 ${
                          isActive
                            ? "max-h-[250px] opacity-100"
                            : "max-h-0 opacity-0 hidden"
                        }`}
                      >
                        <p className="text-gray-200 text-xs sm:text-sm leading-relaxed line-clamp-2">
                          {actu.description}
                        </p>

                        {/* Date de publication */}
                        <p className="text-gray-300 text-xs">
                          Publié le{" "}
                          {new Date(actu.date_publication).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </p>

                        {/* ✅ LIEN AVEC SLUG AU LIEU DE L'ID */}
                        <Link
                          to={`/actualites/${actu.slug}`}
                          className="inline-flex items-center gap-2 text-white font-semibold border-b border-blue-500 pb-0.5 hover:text-blue-400 transition-colors text-xs sm:text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Lire l'article <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Titre vertical pour Desktop Inactif */}
                  {!isActive && (
                    <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none">
                      <h3 className="text-lg font-bold text-white/80 whitespace-nowrap [writing-mode:vertical-rl] rotate-180 tracking-widest uppercase">
                        {actu.title.length > 15
                          ? actu.title.substring(0, 15) + "..."
                          : actu.title}
                      </h3>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* PROGRESS BAR / PAGINATION */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {actualites.map((_, idx) => (
            <button
              key={idx}
              onClick={() => activate(idx)}
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === current
                  ? "w-6 sm:w-10 bg-blue-600"
                  : "w-1.5 sm:w-3 bg-slate-200"
              }`}
              aria-label={`Aller à la diapositive ${idx + 1}`}
            />
          ))}
        </div>

        {/* BOUTON GENERAL */}
        <div className="text-center mt-6 sm:mt-8">
          <Link
            to="/actualites"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-all text-sm group"
          >
            Toutes nos actualités
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Actu;
