import React, { useState, useRef, useEffect } from "react";
import { Mail, Phone, MapPin, Send, Loader2, Clock } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import des services
import { getContactInfo } from "../../services/contact.services";

// ✅ NOUVEAU: Import du service pour les messages
import {
  sendContactMessage,
  formatContactData,
  validateContactForm,
  StatusManager,
} from "../../services/contactMessage.services";

// --- TOP 10 DOMAINES EMAIL LES PLUS UTILISES ---
const POPULAR_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "protonmail.com",
  "aol.com",
  "zoho.com",
  "mail.com",
  "yandex.com",
];

// --- FONCTION UTILITAIRE DE FORMATAGE TELEPHONE ---
const formatPhoneNumberDisplay = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/[^0-9+]/g, "");

  if (cleaned.startsWith("+261") && cleaned.length === 13) {
    return cleaned.replace(
      /(\+261)(\d{2})(\d{2})(\d{3})(\d{2})/,
      "$1 $2 $3 $4 $5",
    );
  }

  if (phone.includes(" ")) return phone;

  return cleaned.replace(/(.{3})/g, "$1 ").trim();
};

// --- COMPOSANT UTILITAIRE : CONTENEUR ---
const PageContainer = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

const Contact = () => {
  // --- ETATS ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [contactInfo, setContactInfo] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState(new StatusManager());
  const [contactInfoStatus, setContactInfoStatus] = useState(
    new StatusManager(),
  );

  const textareaRef = useRef(null);
  const emailInputRef = useRef(null);

  // --- EFFETS ---
  useEffect(() => {
    fetchContactData();
  }, []);

  // Auto-resize du textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [formData.message]);

  // Fermer les suggestions si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emailInputRef.current &&
        !emailInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- FONCTIONS ---
  const fetchContactData = async () => {
    const statusManager = new StatusManager();
    setContactInfoStatus(statusManager.setLoading());

    const result = await getContactInfo();

    if (result.success && result.data) {
      setContactInfo(result.data);
      setContactInfoStatus(statusManager.setSuccess());
    } else {
      setContactInfoStatus(statusManager.setError(result.error));
    }
  };

  // Fonction pour obtenir les suggestions d'email après @
  const getEmailSuggestions = (email) => {
    if (!email.includes("@")) return [];

    const [localPart, domainPart] = email.split("@");

    // Afficher toutes les suggestions si domainPart est vide ou incomplet
    if (!domainPart || domainPart.length === 0) {
      return POPULAR_EMAIL_DOMAINS.map((domain) => `${localPart}@${domain}`);
    }

    // Filtrer selon ce qui est tapé
    const filtered = POPULAR_EMAIL_DOMAINS.filter((domain) =>
      domain.toLowerCase().startsWith(domainPart.toLowerCase()),
    );

    return filtered.map((domain) => `${localPart}@${domain}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (name === "email") {
      const newSuggestions = getEmailSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0 && value.includes("@"));
    }
  };

  const selectSuggestion = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      email: suggestion,
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation avec la fonction du service
    const validation = validateContactForm(formData);

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    // ✅ Mise à jour du statut de chargement
    setStatus(new StatusManager().setLoading());

    // ✅ Formatage et envoi avec le nouveau service
    const formattedData = formatContactData(formData);
    const result = await sendContactMessage(formattedData);

    if (result.success) {
      toast.success(
        "Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.",
      );

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setFormErrors({});
      setStatus(new StatusManager().setSuccess());
    } else {
      toast.error(result.error || "Erreur lors de l'envoi du message");
      setStatus(new StatusManager().setError(result.error));
    }
  };

  const renderContactInfo = () => {
    if (!contactInfo) {
      return (
        <div className="text-center p-6 bg-gray-50 rounded-xl">
          <p className="text-gray-500">
            Les coordonnées de contact ne sont pas encore disponibles.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Email */}
        {contactInfo.email && (
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Mail size={22} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Email</h3>
              <a
                href={`mailto:${contactInfo.email}`}
                className="mt-1 inline-block text-indigo-600 hover:text-indigo-700 font-medium text-base"
              >
                {contactInfo.email}
              </a>
            </div>
          </div>
        )}

        {/* Telephones */}
        {Array.isArray(contactInfo.phones) && contactInfo.phones.length > 0 && (
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Phone size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Téléphone{contactInfo.phones.length > 1 ? "s" : ""}
              </h3>
              <div className="space-y-2">
                {contactInfo.phones.slice(0, 3).map((phone, idx) => (
                  <a
                    key={idx}
                    href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                    className="block text-indigo-600 hover:text-indigo-700 font-medium text-base transition-colors"
                  >
                    {formatPhoneNumberDisplay(phone)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Adresse */}
        {contactInfo.address && (
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <MapPin size={22} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Bureaux</h3>
              <p className="mt-1 text-base text-slate-600 max-w-md">
                {contactInfo.address}
              </p>
            </div>
          </div>
        )}

        {/* Horaires */}
        {contactInfo.horaires && (
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Clock size={22} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Horaires</h3>
              <p className="mt-1 text-base text-slate-600 max-w-md whitespace-pre-line">
                {contactInfo.horaires}
              </p>
            </div>
          </div>
        )}

        {/* Message si aucun contact */}
        {!contactInfo.email &&
          !contactInfo.phones?.length &&
          !contactInfo.address &&
          !contactInfo.horaires && (
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
              <p className="text-yellow-700 text-sm">
                Les coordonnées de contact n'ont pas encore été configurées.
                Veuillez contacter l'administrateur du site.
              </p>
            </div>
          )}
      </div>
    );
  };

  // Calculer le nombre de caractères
  const messageLength = formData.message.trim().length;
  const minLength = 50;
  const isMessageValid = messageLength >= minLength;

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-white overflow-hidden min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Fond decoratif */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 opacity-100" />

      <PageContainer className="relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* --- COLONNE GAUCHE : INFOS DE CONTACT --- */}
          <div className="lg:w-1/2 space-y-8">
            <div className="text-left">
              <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm">
                Contact
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                Parlons de votre projet d'accréditation.
              </h2>
              <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Notre équipe est disponible pour répondre à toutes vos questions
                concernant les procédures, les audits et les standards de
                qualité.
              </p>
            </div>

            {contactInfoStatus.loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : contactInfoStatus.error ? (
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <p className="text-red-600">
                  Impossible de charger les coordonnées
                </p>
                <button
                  onClick={fetchContactData}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Réessayer
                </button>
              </div>
            ) : (
              renderContactInfo()
            )}
          </div>

          {/* --- COLONNE DROITE : FORMULAIRE --- */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200 border border-slate-100 relative">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 text-left">
                Envoyez-nous un message
              </h3>

              <form
                className="space-y-5"
                autoComplete="off"
                onSubmit={handleSubmit}
              >
                {/* 1. Nom Complet */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Jean Dupont"
                    className={`w-full px-4 py-3 text-base rounded-xl bg-slate-50 border ${
                      formErrors.name ? "border-red-300" : "border-slate-200"
                    } focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* 2. Email avec Suggestion */}
                <div className="space-y-2 relative" ref={emailInputRef}>
                  <label className="text-sm font-semibold text-slate-700 block">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jean@exemple.com"
                    autoComplete="off"
                    className={`w-full px-4 py-3 text-base rounded-xl bg-slate-50 border ${
                      formErrors.email ? "border-red-300" : "border-slate-200"
                    } focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </p>
                  )}

                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto py-1 animate-fade-in">
                      {suggestions.map((sug, index) => (
                        <li
                          key={index}
                          onClick={() => selectSuggestion(sug)}
                          className="px-4 py-2.5 hover:bg-indigo-50 cursor-pointer text-slate-700 text-base transition-colors"
                        >
                          {sug}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* 3. Sujet - Input simple */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 block">
                    Sujet de votre message{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Ex: Demande d'accréditation"
                    className={`w-full px-4 py-3 text-base rounded-xl bg-slate-50 border ${
                      formErrors.subject ? "border-red-300" : "border-slate-200"
                    } focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400`}
                  />
                  {formErrors.subject && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.subject}
                    </p>
                  )}
                </div>

                {/* 4. Message Auto-Expand avec compteur */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700 block">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <span
                      className={`text-xs font-medium ${
                        isMessageValid ? "text-green-600" : "text-slate-400"
                      }`}
                    >
                      {messageLength}/{minLength}
                    </span>
                  </div>
                  <textarea
                    ref={textareaRef}
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Dites-nous en plus sur votre besoin... (minimum 50 caractères)"
                    rows={5}
                    className={`w-full px-4 py-3 text-base rounded-xl bg-slate-50 border ${
                      formErrors.message ? "border-red-300" : "border-slate-200"
                    } focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-y placeholder:text-slate-400 min-h-[120px] max-h-[400px] leading-relaxed`}
                  ></textarea>
                  {formErrors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.message}
                    </p>
                  )}
                </div>

                {/* Bouton d'envoi */}
                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full py-4 px-6 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status.loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Envoyer le message</span>
                      <Send
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
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
