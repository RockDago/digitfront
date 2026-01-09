import React, { useState, useEffect } from "react";
import mesupres from "../../assets/images/mesupres.png";
import Services from "./Services";
import Actu from "./Actu";
import Faq from "./Faq";
import { Mail, Phone, MapPin, Send } from "lucide-react";

// --- COMPOSANT UTILITAIRE : CONTENEUR RESPONSIVE PRO ---
const PageContainer = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

// --- COMPOSANT : BOUTON RETOUR EN HAUT ---
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

// --- COMPOSANT PRINCIPAL : HOME ---
const Home = () => {
  return (
    <>
      {/* === SECTION HERO === */}
      <section
        id="accueil"
        aria-label="hero"
        // MODIF 1: 'pt-24 pb-20' -> Augmentation forte du padding haut/bas sur mobile
        className="relative w-full min-h-[55vh] sm:min-h-[60vh] lg:min-h-[100dvh] flex items-center overflow-hidden pt-24 pb-20 lg:py-0"
      >
        {/* Image de fond */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat lg:bg-fixed"
          style={{ backgroundImage: `url(${mesupres})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40" />
        </div>

        {/* Contenu Hero */}
        <PageContainer className="relative z-10">
          {/* MODIF 2: 'space-y-6' -> Espacement vertical entre les blocs de texte augmenté */}
          <div className="max-w-4xl space-y-6 sm:space-y-8 lg:space-y-8 animate-fade-in-up text-left">
            {/* Badge */}
            <div className="flex justify-start">
              <div className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-medium text-[10px] sm:text-xs lg:text-sm tracking-wide uppercase backdrop-blur-sm">
                Assurance Qualité & Excellence
              </div>
            </div>

            {/* Titre Principal */}
            <h1 className="text-2xl sm:text-4xl lg:text-7xl font-extrabold text-white leading-[1.2] lg:leading-[1.1] tracking-tight">
              Direction de l'Accréditation <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 block sm:inline mt-2 sm:mt-0">
                et de l'Assurance Qualité
              </span>
            </h1>

            {/* Paragraphe */}
            <p className="text-sm sm:text-base lg:text-xl text-slate-300 max-w-xl lg:max-w-2xl leading-relaxed">
              Garantir l'excellence de l'enseignement supérieur à travers des
              standards rigoureux et une évaluation transparente pour un avenir
              certifié.
            </p>

            {/* Boutons d'action */}
            {/* MODIF 3: 'mt-20' -> Marge très importante au-dessus des boutons sur mobile */}
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

        {/* Scroll Down Indicator (Desktop uniquement) */}
        <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block">
          <a
            href="#services"
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

      {/* === SECTION SERVICES === */}
      <Services />

      {/* === SECTION ACTUALITES === */}
      <Actu />

      {/* === SECTION FAQ === */}
      <Faq />

      {/* === SECTION CONTACT === */}
      <section
        id="contact"
        className="relative py-12 sm:py-20 lg:py-24 bg-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 opacity-100" />

        <PageContainer className="relative z-10">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-24">
            {/* Colonne Gauche : Infos */}
            <div className="lg:w-1/2 space-y-8 sm:space-y-10">
              <div className="text-left">
                <span className="text-indigo-600 font-semibold tracking-wider uppercase text-xs sm:text-sm">
                  Contact
                </span>
                <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl lg:text-5xl font-bold text-slate-900 leading-tight">
                  Parlons de votre <br className="hidden sm:block" /> projet
                  d'accréditation.
                </h2>
                <p className="mt-3 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-lg">
                  Notre équipe est disponible pour répondre à toutes vos
                  questions concernant les procédures, les audits et les
                  standards de qualité.
                </p>
              </div>

              <div className="space-y-6 sm:space-y-8">
                {/* Email */}
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Mail size={18} className="lg:w-6 lg:h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900">
                      Email
                    </h3>
                    <p className="mt-0.5 lg:mt-1 text-xs sm:text-sm lg:text-base text-slate-600">
                      Notre équipe répond sous 24h.
                    </p>
                    <a
                      href="mailto:contact@daaq.mg"
                      className="mt-1 inline-block text-indigo-600 hover:text-indigo-700 font-medium text-xs sm:text-sm lg:text-base"
                    >
                      contact@daaq.mg
                    </a>
                  </div>
                </div>

                {/* Téléphone */}
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Phone size={18} className="lg:w-6 lg:h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900">
                      Téléphone
                    </h3>
                    <p className="mt-0.5 lg:mt-1 text-xs sm:text-sm lg:text-base text-slate-600">
                      Du Lundi au Vendredi, 8h-17h.
                    </p>
                    <a
                      href="tel:+261340000000"
                      className="mt-1 inline-block text-indigo-600 hover:text-indigo-700 font-medium text-xs sm:text-sm lg:text-base"
                    >
                      +261 34 00 000 00
                    </a>
                  </div>
                </div>

                {/* Adresse */}
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <MapPin size={18} className="lg:w-6 lg:h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900">
                      Bureaux
                    </h3>
                    <p className="mt-0.5 lg:mt-1 text-xs sm:text-sm lg:text-base text-slate-600 max-w-xs">
                      Lot II K 34, Ankadivato, Antananarivo 101, Madagascar
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Formulaire */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xl shadow-slate-200 border border-slate-100">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-5 sm:mb-8 text-left">
                  Envoyez-nous un message
                </h3>

                <form className="space-y-4 lg:space-y-6">
                  <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-1.5 lg:space-y-2">
                      <label className="text-xs lg:text-sm font-semibold text-slate-700">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        placeholder="Jean Dupont"
                        className="w-full px-4 py-2.5 lg:py-3 text-sm lg:text-base rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5 lg:space-y-2">
                      <label className="text-xs lg:text-sm font-semibold text-slate-700">
                        Email pro
                      </label>
                      <input
                        type="email"
                        placeholder="jean@etablissement.mg"
                        className="w-full px-4 py-2.5 lg:py-3 text-sm lg:text-base rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 lg:space-y-2">
                    <label className="text-xs lg:text-sm font-semibold text-slate-700">
                      Sujet
                    </label>
                    <select className="w-full px-4 py-2.5 lg:py-3 text-sm lg:text-base rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all appearance-none cursor-pointer">
                      <option>Demande d'information générale</option>
                      <option>Accréditation d'un établissement</option>
                      <option>Signalement ou Réclamation</option>
                      <option>Autre</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 lg:space-y-2">
                    <label className="text-xs lg:text-sm font-semibold text-slate-700">
                      Message
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Dites-nous en plus sur votre besoin..."
                      className="w-full px-4 py-2.5 lg:py-3 text-sm lg:text-base rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 lg:py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm lg:text-lg shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <span>Envoyer le message</span>
                    <Send size={18} className="lg:w-5 lg:h-5" />
                  </button>

                  <p className="text-[10px] sm:text-xs text-center text-slate-400 mt-2 lg:mt-4">
                    En envoyant ce formulaire, vous acceptez notre politique de
                    confidentialité.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <ScrollToTop />
    </>
  );
};

export default Home;
