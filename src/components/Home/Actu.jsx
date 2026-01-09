import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";

const Actu = () => {
  // === DONNÉES ===
  const actualites = [
    {
      id: 1,
      title: "Service d'Accréditation (SAE)",
      description:
        "Accréditation des établissements et évaluation institutionnelle pour garantir la qualité de l'enseignement supérieur selon les standards nationaux.",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
      thumb:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=480",
    },
    {
      id: 2,
      title: "Contrôle et Inspection (SCIP)",
      description:
        "Campagne annuelle d'inspections et d'audits périodiques pour vérifier la performance et la conformité administrative des établissements.",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
      thumb:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=480",
    },
    {
      id: 3,
      title: "Conférence Annuelle Qualité",
      description:
        "Grand rassemblement des experts et partenaires pour débattre des nouveaux référentiels et des défis de l'assurance qualité.",
      image:
        "https://images.unsplash.com/photo-1544531320-dadbed4d130c?auto=format&fit=crop&q=80&w=1200",
      thumb:
        "https://images.unsplash.com/photo-1544531320-dadbed4d130c?auto=format&fit=crop&q=80&w=480",
    },
    {
      id: 4,
      title: "Certification d'Excellence",
      description:
        "Lancement des nouveaux labels d'excellence pour récompenser les institutions modèles en matière de gouvernance et de pédagogie.",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
      thumb:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=480",
    },
    {
      id: 5,
      title: "Formation Continue",
      description:
        "Ateliers de renforcement de capacités destinés aux évaluateurs externes et aux responsables qualité des IES.",
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
      thumb:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=480",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // État pour l'auto-play
  const trackRef = useRef(null);
  const wrapRef = useRef(null);

  // Détection de la taille d'écran (Mobile vs Tablette/Desktop)
  // On considère "mobile" tout ce qui est < 768px (MD Tailwind)
  const isMobile = () => window.innerWidth < 768;

  // --- LOGIQUE AUTO-SCROLL (BOUCLE INFINIE) ---
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        // Avancer d'un cran, si on est à la fin, on revient à 0 (boucle)
        setCurrent((prev) => (prev + 1) % actualites.length);
      }, 5000); // Défilement toutes les 5 secondes
    }
    return () => clearInterval(interval);
  }, [isPlaying, actualites.length]);

  // --- LOGIQUE DE CENTRAGE (UNIVERSELLE) ---
  const scrollToCard = (index) => {
    if (!trackRef.current || !wrapRef.current) return;
    const card = trackRef.current.children[index];
    if (!card) return;

    // Calcul universel pour centrer l'élément
    const cardLeft = card.offsetLeft;
    const cardWidth = card.clientWidth;
    const containerWidth = wrapRef.current.clientWidth;

    // Position idéale : (Centre carte) - (Moitié conteneur)
    const scrollPos = cardLeft + cardWidth / 2 - containerWidth / 2;

    wrapRef.current.scrollTo({
      left: scrollPos,
      behavior: "smooth",
    });
  };

  // Met à jour le scroll quand 'current' change
  useEffect(() => {
    scrollToCard(current);
  }, [current]);

  // Gestion du redimensionnement
  useEffect(() => {
    const handleResize = () => scrollToCard(current);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [current]);

  const activate = (i) => {
    setCurrent(i);
    setIsPlaying(false); // Arrête l'auto-play si l'utilisateur interagit manuellement
    // Optionnel : Redémarrer l'auto-play après un délai si on veut
  };

  const go = (step) => {
    // Gestion du modulo pour la boucle manuelle aussi
    let newIndex = current + step;
    if (newIndex < 0) newIndex = actualites.length - 1;
    if (newIndex >= actualites.length) newIndex = 0;

    activate(newIndex);
  };

  return (
    <section
      id="actu"
      className="relative py-10 sm:py-14 lg:py-20 bg-white overflow-hidden"
      // Pause au survol pour ne pas gêner la lecture
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 opacity-100" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-8 sm:mb-12">
          <div className="max-w-2xl w-full sm:w-auto">
            <span className="text-orange-500 font-bold tracking-wider uppercase text-xs sm:text-sm mb-2 block animate-pulse">
              À la une • En direct
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Actualités & Événements
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {/* Bouton Pause/Play discret */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors mr-2"
              title={isPlaying ? "Mettre en pause" : "Reprendre le défilement"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <button
              onClick={() => go(-1)}
              className="w-12 h-12 rounded-full border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => go(1)}
              className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* SLIDER WRAPPER */}
        <div
          ref={wrapRef}
          className="
            overflow-x-auto overflow-y-hidden 
            snap-x snap-mandatory scroll-smooth 
            pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-12
            scrollbar-hide
          "
        >
          <div
            ref={trackRef}
            className="flex flex-row items-stretch sm:items-center lg:items-start gap-4 sm:gap-6 lg:gap-8"
          >
            {actualites.map((actu, index) => {
              const isActive = index === current;

              // --- CLASSES CSS RESPONSIVE OPTIMISÉES ---
              // Mobile : w-[85vw] (Très large pour bien voir)
              // Tablette (sm) : w-[300px] inactive / w-[450px] active (Mieux proportionné)
              // Desktop (lg) : w-[100px] inactive / w-[650px] active (Effet accordéon)

              let widthClass = "";
              // Mobile (< 640px)
              widthClass += "w-[85vw] ";
              // Tablette (>= 640px)
              widthClass += isActive ? "sm:w-[450px] " : "sm:w-[280px] ";
              // Desktop (>= 1024px)
              widthClass += isActive ? "lg:w-[650px] " : "lg:w-[100px] ";

              // Hauteur responsive
              let heightClass = "h-[400px] sm:h-[420px] lg:h-[550px]";

              let cardClasses = `
                relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer 
                transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex-shrink-0
                snap-center
                ${widthClass}
                ${heightClass}
              `;

              if (isActive) {
                cardClasses +=
                  " shadow-xl shadow-slate-300 z-10 scale-100 opacity-100";
              } else {
                // Opacité un peu réduite pour les éléments inactifs sur tablette/desktop
                cardClasses +=
                  " opacity-100 sm:opacity-70 hover:opacity-100 hover:sm:w-[300px] hover:lg:w-[120px]";
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
                      absolute inset-0 p-6 sm:p-8 flex flex-col justify-end 
                      transition-all duration-500
                      ${
                        isActive
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 sm:translate-y-8 opacity-100 sm:opacity-80"
                      }
                    `}
                  >
                    {/* Vignette (Visible uniquement si actif et sur grand écran) */}
                    {isActive && (
                      <div className="hidden lg:block mb-auto self-end animate-fade-in delay-100">
                        <div className="w-24 h-32 rounded-xl border-2 border-white/20 overflow-hidden shadow-lg transform rotate-3 transition-transform group-hover:rotate-0">
                          <img
                            src={actu.thumb}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <div className="max-w-xl w-full">
                      {/* Badge (Toujours visible si actif) */}
                      <span
                        className={`inline-block px-3 py-1 mb-3 rounded-full bg-orange-500/90 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${
                          isActive
                            ? "opacity-100"
                            : "opacity-0 sm:opacity-0 lg:opacity-0"
                        }`}
                      >
                        Actualité
                      </span>

                      {/* Titre : Taille adaptative */}
                      <h3
                        className={`font-bold text-white mb-3 leading-tight transition-all duration-300 ${
                          isActive
                            ? "text-xl sm:text-2xl lg:text-4xl"
                            : "text-lg sm:text-xl lg:text-xl lg:hidden" // Caché sur desktop inactif (mode vertical)
                        }`}
                      >
                        {actu.title}
                      </h3>

                      {/* Description : Visible si actif */}
                      <div
                        className={`space-y-4 overflow-hidden transition-all duration-500 ${
                          isActive
                            ? "max-h-[300px] opacity-100"
                            : "max-h-0 opacity-0 hidden"
                        }`}
                      >
                        <p className="text-gray-200 text-sm sm:text-base leading-relaxed line-clamp-3">
                          {actu.description}
                        </p>

                        <Link
                          to={`/actualite/${actu.id}`}
                          className="inline-flex items-center gap-2 text-white font-semibold border-b border-orange-500 pb-0.5 hover:text-orange-400 transition-colors text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Lire l'article <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Titre vertical pour Desktop Inactif uniquement */}
                  {!isActive && (
                    <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none">
                      <h3 className="text-xl font-bold text-white/80 whitespace-nowrap [writing-mode:vertical-rl] rotate-180 tracking-widest uppercase">
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

        {/* PROGRESS BAR / PAGINATION (Indicateur de boucle) */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {actualites.map((_, idx) => (
            <button
              key={idx}
              onClick={() => activate(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === current
                  ? "w-8 sm:w-12 bg-orange-500"
                  : "w-2 sm:w-4 bg-slate-200"
              }`}
              aria-label={`Aller à la diapositive ${idx + 1}`}
            />
          ))}
        </div>

        {/* BOUTON GENERAL */}
        <div className="text-center mt-8 sm:mt-10">
          <Link
            to="/actualites"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 border border-slate-200 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-all text-sm sm:text-base group"
          >
            Toutes nos actualités
            <ArrowRight
              size={18}
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
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Actu;
