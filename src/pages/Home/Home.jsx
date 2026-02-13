import React, { useState, useEffect } from "react";
import mesupres from "../../assets/images/mesupres.png";

// Import des composants
import Services from "./Services";
import Actu from "./Actu";
import Faq from "./Faq";
import Apropos from "./APropos";
import Contact from "./Contact"; // Import du nouveau composant Contact

// --- COMPOSANT UTILITAIRE : CONTENEUR ---
const PageContainer = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

// --- SCROLL TO TOP ---
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 sm:p-4 rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 hover:scale-110 transition-all duration-300 z-50 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        aria-label="Retour en haut"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 sm:h-6 sm:w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    )
  );
};

// --- HOME ---
const Home = () => {
  return (
    <>
      {/* === 1. SECTION ACCUEIL === */}
      <section
        id="accueil"
        aria-label="hero"
        className="relative w-full min-h-[55vh] sm:min-h-[60vh] lg:min-h-[100dvh] flex items-center overflow-hidden pt-24 pb-20 lg:py-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat lg:bg-fixed"
          style={{ backgroundImage: `url(${mesupres})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40" />
        </div>

        <PageContainer className="relative z-10">
          <div className="max-w-4xl space-y-6 sm:space-y-8 lg:space-y-8 animate-fade-in-up text-left">
            <div className="flex justify-start">
              <div className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-medium text-[10px] sm:text-xs lg:text-sm tracking-wide uppercase backdrop-blur-sm">
                Assurance Qualité & Excellence
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-7xl font-extrabold text-white leading-[1.2] lg:leading-[1.1] tracking-tight">
              Direction de l'Accréditation <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 block sm:inline mt-2 sm:mt-0">
                et de l'Assurance Qualité
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-xl text-slate-300 max-w-xl lg:max-w-2xl leading-relaxed">
              Garantir l'excellence de l'enseignement supérieur à travers des
              standards rigoureux et une évaluation transparente.
            </p>

            <div className="flex flex-row gap-3 mt-20 sm:mt-24 lg:pt-4">
              <a
                href="#services"
                className="inline-flex items-center justify-center px-5 py-2.5 lg:px-8 lg:py-4 text-xs sm:text-sm lg:text-base font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 hover:-translate-y-1"
              >
                Découvrir
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-5 py-2.5 lg:px-8 lg:py-4 text-xs sm:text-sm lg:text-base font-bold text-white border border-white/20 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all hover:-translate-y-1"
              >
                Contact
              </a>
            </div>
          </div>
        </PageContainer>

        <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block">
          <a
            href="#apropos"
            className="text-white/50 hover:text-white transition-colors p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </a>
        </div>
      </section>

      {/* === 2. À PROPOS === */}
      <div id="apropos">
        <Apropos />
      </div>

      {/* === 3. SERVICES === */}
      <div id="services">
        <Services />
      </div>

      {/* === 4. ACTUALITÉS === */}
      <div id="actu">
        <Actu />
      </div>

      {/* === 5. FAQ === */}
      <div id="faq">
        <Faq />
      </div>

      {/* === 6. CONTACT (Importé) === */}
      <div id="contact">
        <Contact />
      </div>

      <ScrollToTop />
    </>
  );
};

export default Home;
