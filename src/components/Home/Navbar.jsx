import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Login from "../Login/Login";

const NAV_ITEMS = [
  { id: "accueil", label: "Accueil" },
  { id: "apropos", label: "À propos" },
  { id: "services", label: "Services" },
  { id: "actu", label: "Actualités" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

const Navbar = ({ children }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [activeId, setActiveId] = useState("accueil");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // --- LOGIQUE DE CONNEXION ---
  const handleLoginClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
      navigate("/login");
    } else {
      setShowLoginModal(true);
    }
  };

  // --- GESTION SCROLL & OBSERVERS ---
  useEffect(() => {
    // Si on n'est pas sur la page d'accueil, on ne track pas le scroll
    if (location.pathname !== "/") {
      setIsHeroVisible(false);
      return;
    }

    // 1. Observer pour le Hero (transparence navbar)
    const hero = document.getElementById("accueil");
    if (hero) {
      const heroObserver = new IntersectionObserver(
        ([entry]) => setIsHeroVisible(entry.isIntersecting),
        { threshold: 0.1 } // Dès que 10% du hero est visible/invisible
      );
      heroObserver.observe(hero);
    }

    // 2. Observer pour les Sections (Active Link)
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        // ASTUCE PRO :
        // On définit une zone de détection très fine au milieu de l'écran (-50% en haut, -50% en bas).
        // L'élément qui croise cette ligne centrale est considéré comme "Actif".
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      }
    );

    // On observe chaque section définie dans NAV_ITEMS
    NAV_ITEMS.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) sectionObserver.observe(element);
    });

    return () => {
      sectionObserver.disconnect();
    };
  }, [location.pathname]);

  // --- NAVIGATION ---
  const handleNavClick = (e, id) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }

    const scrollToElement = () => {
      const el = document.getElementById(id);
      if (el) {
        // Offset pour compenser la hauteur de la navbar fixe (environ 80px)
        const headerOffset = 80;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        setActiveId(id); // Force l'actif immédiatement au clic
      }
    };

    // Petit délai pour assurer la fluidité
    setTimeout(scrollToElement, 100);
  };

  // Gestion du scroll après navigation depuis une autre page
  useEffect(() => {
    if (location.state?.scrollTo && location.pathname === "/") {
      setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500); // Délai un peu plus long pour laisser le temps au rendu
    }
  }, [location]);

  // Bloquer le scroll body quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

  // Couleur du burger selon le fond
  const burgerColor =
    isHeroVisible && !isMobileMenuOpen ? "text-white" : "text-slate-900";

  return (
    <div className="flex flex-col min-h-screen font-sans antialiased text-slate-900 bg-slate-50">
      {/* --- HEADER --- */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isHeroVisible && !isMobileMenuOpen
            ? "bg-transparent py-6"
            : "bg-white/95 backdrop-blur-md shadow-sm py-4 border-b border-gray-100"
        }`}
      >
        <div className="container px-4 mx-auto max-w-7xl flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="relative z-50 flex items-center gap-2 group">
            <span
              className={`text-2xl font-black tracking-tight transition-colors duration-300 ${
                isHeroVisible && !isMobileMenuOpen
                  ? "text-white"
                  : "text-blue-600"
              }`}
            >
              DAAQ
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`text-sm font-semibold transition-colors duration-200 relative group ${
                    isHeroVisible
                      ? "text-white/80 hover:text-white"
                      : isActive
                      ? "text-blue-600"
                      : "text-slate-600 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                  {/* Ligne soulignée animée */}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-current transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </a>
              );
            })}
          </nav>

          {/* DESKTOP LOGIN BUTTON */}
          <div className="hidden lg:block">
            <button
              onClick={handleLoginClick}
              className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                isHeroVisible
                  ? "bg-white text-blue-900 hover:bg-gray-100"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              }`}
            >
              Se connecter
            </button>
          </div>

          {/* MOBILE BURGER BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden relative z-50 p-2 focus:outline-none ${burgerColor}`}
            aria-label="Menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-right ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-[2px] w-full" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-right ${
                  isMobileMenuOpen ? "rotate-45 translate-y-[2px] w-full" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* --- MOBILE MENU --- */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-all duration-500 ease-in-out lg:hidden flex flex-col items-center justify-center ${
          isMobileMenuOpen
            ? "opacity-100 visible clip-circle-full"
            : "opacity-0 invisible clip-circle-0"
        }`}
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
        </div>

        <nav className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md px-6">
          {NAV_ITEMS.map((item, index) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`text-2xl md:text-3xl font-bold tracking-tight transition-all duration-300 transform ${
                  isMobileMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                } ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-800 hover:text-blue-600"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {item.label}
              </a>
            );
          })}

          <div
            className={`w-full pt-8 mt-4 border-t border-gray-100 transition-all duration-500 delay-300 transform ${
              isMobileMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <button
              onClick={handleLoginClick}
              className="w-full py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98] transition-all"
            >
              Se connecter
            </button>
          </div>
        </nav>
      </div>

      <main className="flex-grow">{children}</main>
      <Footer />

      {/* --- LOGIN MODAL --- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowLoginModal(false)}
          ></div>
          <div className="relative z-10 animate-fade-in-up w-full max-w-2xl">
            <Login isModal={true} onClose={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .clip-circle-0 {
          clip-path: circle(0% at 100% 0);
          pointer-events: none;
        }
        .clip-circle-full {
          clip-path: circle(150% at 100% 0);
          pointer-events: auto;
        }
        :global(.Toastify__toast-container) {
          z-index: 99999 !important;
        }
      `}</style>
    </div>
  );
};

export default Navbar;
