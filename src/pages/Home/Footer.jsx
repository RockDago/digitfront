import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Globe,
  FileText,
  Clock,
  ChevronRight,
  Briefcase,
  Info,
  Compass,
  UserCircle
} from "lucide-react";

import API from "../../config/axios";

import logoMinistere from "../../assets/images/mesupres-logo.png";

// Import des fichiers PDF
import arretePdf from "../../assets/pdf/Arrêté d'accréditation.pdf";
import decretPdf from "../../assets/pdf/Décret d'accréditation.pdf";
import habilitationPdf from "../../assets/pdf/Habilitation.pdf";
import organigrammePdf from "../../assets/pdf/Organigramme combine.pdf";

// --- CONSTANTES ---
const NAV_ITEMS = [
  { id: "accueil", label: "Accueil" },
  { id: "apropos", label: "À propos" },
  { id: "services", label: "Services" },
  { id: "actu", label: "Actualités" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
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

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // État pour les données de contact
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phones: [],
    address: "",
    horaires: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Récupérer les données de contact depuis l'API
  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await API.get(`/contact/`);

      setContactInfo({
        email: response.data.email || "",
        phones: response.data.phones || [],
        address: response.data.address || "",
        horaires: response.data.horaires || "",
      });
    } catch (error) {
      console.error("Erreur lors du chargement des coordonnées:", error);
      setError(true);
      setContactInfo({
        email: "",
        phones: [],
        address: "",
        horaires: "",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour gérer la navigation vers une ancre
  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();

    if (location.pathname === "/") {
      if (sectionId === "accueil") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  // --- LOGIQUE DE CONNEXION ---
  const handleLoginClick = (e) => {
    e.preventDefault();
    if (window.innerWidth < 1024) {
      navigate("/login");
    } else {
      // Tu peux adapter ceci si tu as une modale globale
      navigate("/login"); 
    }
  };

  // Format des horaires pour l'affichage
  const formatHoraires = (horaires) => {
    if (!horaires) return "";
    const lines = horaires.split("\n");
    return lines[0];
  };

  // Rendu conditionnel des informations de contact en bas
  const renderContactInfo = () => {
    if (loading) {
      return (
        <>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-slate-800 rounded w-24"></div>
            <div className="h-4 bg-slate-800 rounded w-32"></div>
          </div>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-slate-800 rounded w-24"></div>
            <div className="h-4 bg-slate-800 rounded w-32"></div>
          </div>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-slate-800 rounded w-24"></div>
            <div className="h-4 bg-slate-800 rounded w-32"></div>
          </div>
        </>
      );
    }

    const noInfoAvailable = !contactInfo.address && 
                           (!contactInfo.phones || contactInfo.phones.length === 0) && 
                           !contactInfo.email;

    if (error || noInfoAvailable) {
      return (
        <div className="md:col-span-3 flex items-center gap-3">
          <div className="bg-slate-800/50 p-2 rounded-lg text-slate-400 shrink-0 border border-slate-700">
            <Info size={18} />
          </div>
          <div>
            <strong className="block text-white text-xs uppercase tracking-wide mb-0.5">
              Informations de contact
            </strong>
            <span className="text-sm text-slate-400">
              Disponibles prochainement...
            </span>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Adresse */}
        {contactInfo.address && (
          <div className="flex items-start gap-3">
            <div className="bg-slate-800 p-2 rounded-lg text-blue-500 shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <strong className="block text-white text-xs uppercase tracking-wide mb-0.5">
                Siège Social
              </strong>
              <span className="text-sm text-slate-400">
                {contactInfo.address}
              </span>
            </div>
          </div>
        )}

        {/* Telephones */}
        {contactInfo.phones && contactInfo.phones.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="bg-slate-800 p-2 rounded-lg text-blue-500 shrink-0">
              <Phone size={18} />
            </div>
            <div className="flex-1">
              <strong className="block text-white text-xs uppercase tracking-wide mb-1">
                Téléphone{contactInfo.phones.length > 1 ? "s" : ""}
              </strong>
              <div className="space-y-1.5">
                {contactInfo.phones.slice(0, 3).map((phone, index) => (
                  <a
                    key={index}
                    href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                    className="block text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {formatPhoneNumberDisplay(phone)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Email */}
        {contactInfo.email && (
          <div className="flex items-start gap-3">
            <div className="bg-slate-800 p-2 rounded-lg text-blue-500 shrink-0">
              <Mail size={18} />
            </div>
            <div>
              <strong className="block text-white text-xs uppercase tracking-wide mb-0.5">
                Email
              </strong>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-sm text-slate-400 hover:text-white transition-colors break-all"
              >
                {contactInfo.email}
              </a>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <footer className="bg-[#0f172a] text-slate-300 font-sans border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- PARTIE HAUTE (PRINCIPALE) --- */}
        <div className="py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-8">
          
          {/* COLONNE 1 : IDENTITE (Largeur 3/12 sur Desktop) */}
          <div className="lg:col-span-3 space-y-6 lg:pr-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="bg-white p-2.5 rounded-xl shadow-lg shrink-0">
                <img
                  src={logoMinistere}
                  alt="Logo MESUPRES"
                  className="h-14 w-auto object-contain"
                />
              </div>
              <div>
                <h2 className="text-white font-black text-xl uppercase tracking-tight">
                  MESUPRES
                </h2>
                <span className="text-[10px] font-bold text-blue-500 tracking-widest uppercase block mt-1 leading-snug">
                  Direction de l'Accréditation <br /> et de l'Assurance Qualité
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-blue-600 pl-4">
              Garantir l'excellence de l'enseignement supérieur à travers des
              standards rigoureux d'évaluation, d'accréditation et d'assurance
              qualité.
            </p>
          </div>

          {/* COLONNE 2 : LIENS & INFOS (Largeur 9/12 sur Desktop) - 4 sous-colonnes */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Sous-colonne 1 : Navigation Rapide (NOUVEAU) */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <Compass size={16} className="text-blue-500" />
                Navigation
              </h3>
              <ul className="space-y-3">
                {NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleScrollToSection(e, item.id)}
                      className="group flex items-center gap-2 text-sm hover:text-white transition-colors cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors"></span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
                <li className="pt-2">
                  <a
                    href="/login"
                    onClick={handleLoginClick}
                    className="group flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
                  >
                    <UserCircle size={16} className="shrink-0 group-hover:scale-110 transition-transform" />
                    <span>Se connecter</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Sous-colonne 2 : Documents Légaux */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <FileText size={16} className="text-blue-500" />
                Documents Légaux
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href={decretPdf}
                    download="Decret_Regime_d_Accreditation.pdf"
                    className="group flex flex-col hover:bg-slate-800/50 p-2 -mx-2 rounded-lg transition-all"
                  >
                    <span className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                      Décret Régime d'Accréditation
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      PDF - Télécharger
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href={arretePdf}
                    download="Arrete_Normes_d_Accreditation.pdf"
                    className="group flex flex-col hover:bg-slate-800/50 p-2 -mx-2 rounded-lg transition-all"
                  >
                    <span className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                      Arrêté Normes d'Accréditation
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      PDF - Télécharger
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href={habilitationPdf}
                    download="Arrrete_Regime_d_Habilitation.pdf"
                    className="group flex flex-col hover:bg-slate-800/50 p-2 -mx-2 rounded-lg transition-all"
                  >
                    <span className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                      Arrêté Régime d'Habilitation
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      PDF - Télécharger
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href={organigrammePdf}
                    download="Organigrame_combine.pdf"
                    className="group flex flex-col hover:bg-slate-800/50 p-2 -mx-2 rounded-lg transition-all"
                  >
                    <span className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                      Organigramme
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      PDF - Télécharger
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Sous-colonne 3 : Services Clés */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <Briefcase size={16} className="text-blue-500" />
                Services Clés
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#services"
                    onClick={(e) => handleScrollToSection(e, "services")}
                    className="group flex items-start gap-2 text-sm hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight
                      size={16}
                      className="text-blue-600 mt-0.5 shrink-0 group-hover:translate-x-1 transition-transform"
                    />
                    <span className="leading-snug">
                      Service d'Accréditation (SAE)
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    onClick={(e) => handleScrollToSection(e, "services")}
                    className="group flex items-start gap-2 text-sm hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight
                      size={16}
                      className="text-blue-600 mt-0.5 shrink-0 group-hover:translate-x-1 transition-transform"
                    />
                    <span className="leading-snug">Inspection et Contrôle</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    onClick={(e) => handleScrollToSection(e, "services")}
                    className="group flex items-start gap-2 text-sm hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight
                      size={16}
                      className="text-blue-600 mt-0.5 shrink-0 group-hover:translate-x-1 transition-transform"
                    />
                    <span className="leading-snug">Equivalence de Diplôme</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    onClick={(e) => handleScrollToSection(e, "services")}
                    className="group flex items-start gap-2 text-sm hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight
                      size={16}
                      className="text-blue-600 mt-0.5 shrink-0 group-hover:translate-x-1 transition-transform"
                    />
                    <span className="leading-snug">Habilitation</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Sous-colonne 4 : Horaires */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                Horaires
              </h3>
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-800">
                {loading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-3 bg-slate-700 rounded w-24"></div>
                    <div className="h-3 bg-slate-700 rounded w-32"></div>
                  </div>
                ) : error || !contactInfo.horaires ? (
                  <div className="text-center py-2">
                    <p className="text-slate-400 text-sm">
                      Bientôt disponibles
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] shrink-0"></div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {formatHoraires(contactInfo.horaires).split(":")[0]}
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                          {formatHoraires(contactInfo.horaires)
                            .split(":")
                            .slice(1)
                            .join(":")
                            .trim()}
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 italic border-t border-slate-700/50 pt-2 mt-2">
                      Fermé les week-ends et jours fériés.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- PARTIE INFERIEURE : CONTACT & SOCIAL --- */}
        <div className="border-t border-slate-800 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
          
          {/* Rendu conditionnel des informations de contact */}
          {renderContactInfo()}

          {/* Social & Web Icons */}
          <div className="flex items-center gap-3 md:justify-end mt-4 md:mt-0 lg:col-start-4">
            {[
              { 
                Icon: Facebook, 
                href: "https://www.facebook.com/fampianaranaambonysynyfikarohanaaratsiansa", 
                color: "hover:bg-[#1877F2]",
                target: "_blank",
                title: "Facebook MESUPRES"
              },
              { 
                Icon: Globe, 
                href: "https://www.mesupres.gov.mg/", 
                color: "hover:bg-blue-600",
                target: "_blank",
                title: "Site Officiel MESUPRES"
              },
            ].map(({ Icon, href, color, target, title }, index) => (
              <a
                key={index}
                href={href}
                target={target}
                rel={target === "_blank" ? "noopener noreferrer" : ""}
                title={title}
                className={`bg-slate-800 p-2.5 rounded-lg text-slate-400 hover:text-white transition-all duration-300 ${color}`}
                aria-label={title}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* --- COPYRIGHT --- */}
        <div className="border-t border-slate-800 py-6 text-center">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} DAAQ - Ministère de l'Enseignement
            Supérieur et de la Recherche Scientifique.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
