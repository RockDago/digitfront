import React, { useState, useRef, useEffect } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

// --- COMPOSANT UTILITAIRE : CONTENEUR ---
const PageContainer = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

const Contact = () => {
  // --- GESTION DE L'AUTOCOMPLÉTION EMAIL ---
  const [emailValue, setEmailValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // --- GESTION DU MESSAGE AUTO-EXPAND ---
  const [messageValue, setMessageValue] = useState("");
  const textareaRef = useRef(null);

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResizeTextarea();
  }, [messageValue]);

  // Liste des domaines populaires
  const POPULAR_DOMAINS = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "icloud.com",
    "orange.fr",
    "wanadoo.fr",
    "sfr.fr",
    "free.fr",
  ];

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmailValue(val);

    if (val.includes("@")) {
      const [localPart, domainPart] = val.split("@");
      if (domainPart !== undefined) {
        const filtered = POPULAR_DOMAINS.filter((d) =>
          d.startsWith(domainPart)
        );
        setSuggestions(filtered.map((d) => `${localPart}@${d}`));
        setShowSuggestions(filtered.length > 0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    setEmailValue(suggestion);
    setShowSuggestions(false);
  };

  return (
    // RETRAIT DE L'ID ICI car il est déjà dans Home.jsx
    <section className="relative py-12 sm:py-20 lg:py-24 bg-white overflow-hidden min-h-screen">
      {/* Fond décoratif */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 opacity-100" />

      <PageContainer className="relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-24">
          {/* --- COLONNE GAUCHE : INFOS DE CONTACT --- */}
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
                Notre équipe est disponible pour répondre à toutes vos questions
                concernant les procédures, les audits et les standards de
                qualité.
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

          {/* --- COLONNE DROITE : FORMULAIRE --- */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-slate-200 border border-slate-100 relative">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-6 text-left">
                Envoyez-nous un message
              </h3>

              <form className="space-y-5" autoComplete="off">
                {/* 1. Nom Complet */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jean Dupont"
                    className="w-full px-4 py-3 text-base rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* 2. Email avec Suggestion */}
                <div className="space-y-2 relative">
                  <label className="text-sm font-semibold text-slate-700 block">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={emailValue}
                    onChange={handleEmailChange}
                    placeholder="jean@exemple.com"
                    autoComplete="off"
                    className="w-full px-4 py-3 text-base rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
                  />

                  {showSuggestions && (
                    <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1 animate-fade-in">
                      {suggestions.map((sug, index) => (
                        <li
                          key={index}
                          onClick={() => selectSuggestion(sug)}
                          className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-slate-700 text-sm transition-colors"
                        >
                          {sug}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* 3. Sujet */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block">
                    Sujet de votre message{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      className="w-full px-4 py-3 text-base rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none cursor-pointer text-slate-700 invalid:text-slate-400"
                    >
                      <option value="" disabled selected>
                        Sélectionnez un sujet...
                      </option>
                      <option value="info">
                        Demande d'information générale
                      </option>
                      <option value="accreditation">
                        Accréditation d'un établissement
                      </option>
                      <option value="signalement">
                        Signalement ou Réclamation
                      </option>
                      <option value="autre">Autre</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 4. Message Auto-Expand (Style Messenger) */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    ref={textareaRef}
                    required
                    value={messageValue}
                    onChange={(e) => setMessageValue(e.target.value)}
                    placeholder="Dites-nous en plus sur votre besoin..."
                    className="w-full px-4 py-3 text-base rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none placeholder:text-slate-400 min-h-[120px] overflow-hidden leading-relaxed"
                    style={{ height: "auto" }}
                  ></textarea>
                </div>

                {/* Bouton d'envoi */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base sm:text-lg shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                >
                  <span>Envoyer le message</span>
                  <Send
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <p className="text-xs text-center text-slate-400 mt-4">
                  En envoyant ce formulaire, vous acceptez notre politique de
                  confidentialité.
                </p>
              </form>
            </div>
          </div>
        </div>
      </PageContainer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Contact;
