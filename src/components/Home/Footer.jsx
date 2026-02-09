import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Linkedin,
  Twitter,
  FileText,
  Clock,
  ChevronRight,
  Briefcase,
} from "lucide-react";

import API, { API_URL } from "../../config/axios";

import logoMinistere from "../../assets/images/mesupres-logo.png";

// Import des fichiers PDF
import arretePdf from "../../assets/pdf/Arrêté d'accréditation.pdf";
import decretPdf from "../../assets/pdf/Décret d'accréditation.pdf";
import habilitationPdf from "../../assets/pdf/Habilitation.pdf";
import organigrammePdf from "../../assets/pdf/Organigramme combine.pdf";

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

  // Récupérer les données de contact depuis l'API
  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/contact/`);

      // Utiliser les données de l'API ou des valeurs vides
      setContactInfo({
        email: response.data.email || "",
        phones: response.data.phones || [],
        address: response.data.address || "",
        horaires: response.data.horaires || "",
      });
    } catch (error) {
      console.error("Erreur lors du chargement des coordonnées:", error);
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

  // Fonction intelligente pour gérer la navigation vers une ancre
  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();

    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  // Format des horaires pour l'affichage
  const formatHoraires = (horaires) => {
    if (!horaires) return "";
    const lines = horaires.split("\n");
    return lines[0];
  };

  // Rendu conditionnel des informations de contact
  const renderContactInfo = () => {
    if (loading) {
      return (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-slate-700 rounded w-24"></div>
          <div className="h-4 bg-slate-700 rounded w-32"></div>
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
                Siege Social
              </strong>
              <span className="text-sm text-slate-400">
                {contactInfo.address}
              </span>
            </div>
          </div>
        )}

        {/* Telephones - Affichage ameliore pour 3 numeros */}
        {contactInfo.phones && contactInfo.phones.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="bg-slate-800 p-2 rounded-lg text-blue-500 shrink-0">
              <Phone size={18} />
            </div>
            <div className="flex-1">
              <strong className="block text-white text-xs uppercase tracking-wide mb-1">
                Telephone{contactInfo.phones.length > 1 ? "s" : ""}
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
        <div className="py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-12">
          {/* COLONNE 1 : IDENTITE (Largeur 5/12 sur Desktop) */}
          <div className="lg:col-span-5 space-y-6 lg:pr-8">
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
                <span className="text-xs font-bold text-blue-500 tracking-widest uppercase block mt-1">
                  Direction de l'Accreditation{" "}
                  <br className="hidden sm:block" />
                  et de l'Assurance Qualite
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md border-l-2 border-blue-600 pl-4">
              Garantir l'excellence de l'enseignement superieur a travers des
              standards rigoureux d'evaluation, d'accreditation et d'assurance
              qualite.
            </p>
          </div>

          {/* COLONNE 2 : LIENS & INFOS (Largeur 7/12 sur Desktop) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8">
            {/* Sous-colonne A : Documents */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <FileText size={16} className="text-blue-500" />
                Documents Legaux
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href={decretPdf}
                    download="Decret_Regime_d_Accreditation.pdf"
                    className="group flex flex-col hover:bg-slate-800/50 p-2 -mx-2 rounded-lg transition-all"
                  >
                    <span className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                      Decret_Regime d'Accreditation
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      PDF - Telecharger
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
                      Arrete_Normes d'Accreditation
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      PDF - Telecharger
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
                      Arrrete_Regime d'Habilitation
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      PDF - Telecharger
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href={organigrammePdf}
                    download="Organigrame_combone.pdf"
                    className="group flex flex-col hover:bg-slate-800/50 p-2 -mx-2 rounded-lg transition-all"
                  >
                    <span className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                      Organigrame
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      PDF - Telecharger
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Sous-colonne B : Services */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <Briefcase size={16} className="text-blue-500" />
                Services Cles
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
                      Service d'Accreditation (SAE)
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
                    <span className="leading-snug">Inspection et Controle</span>
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
                    <span className="leading-snug">Equivalence de Diplome</span>
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

            {/* Sous-colonne C : Horaires */}
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
                ) : contactInfo.horaires ? (
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
                      Ferme les week-ends et jours feries.
                    </p>
                  </>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-slate-400 text-sm">
                      Horaires non definis
                    </p>
                    <p className="text-[10px] text-slate-500 italic mt-2">
                      Veuillez contacter l'administrateur
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- PARTIE INFERIEURE : CONTACT & SOCIAL --- */}
        <div className="border-t border-slate-800 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
          {/* Rendu conditionnel des informations de contact */}
          {renderContactInfo()}

          {/* Message si aucune information de contact */}
          {!loading &&
            !contactInfo.address &&
            (!contactInfo.phones || contactInfo.phones.length === 0) &&
            !contactInfo.email && (
              <div className="md:col-span-3 flex items-center gap-3">
                <div className="bg-slate-800 p-2 rounded-lg text-yellow-500 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <strong className="block text-white text-xs uppercase tracking-wide mb-0.5">
                    Informations de contact
                  </strong>
                  <span className="text-sm text-slate-400">
                    En cours de configuration...
                  </span>
                </div>
              </div>
            )}

          {/* Social Icons */}
          <div className="flex items-center gap-3 md:justify-end mt-4 md:mt-0">
            {[
              { Icon: Facebook, href: "#", color: "hover:bg-[#1877F2]" },
              { Icon: Twitter, href: "#", color: "hover:bg-[#1DA1F2]" },
              { Icon: Linkedin, href: "#", color: "hover:bg-[#0A66C2]" },
            ].map(({ Icon, href, color }, index) => (
              <a
                key={index}
                href={href}
                className={`bg-slate-800 p-2.5 rounded-lg text-slate-400 hover:text-white transition-all duration-300 ${color}`}
                aria-label="Social link"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* --- COPYRIGHT --- */}
        <div className="border-t border-slate-800 py-6 text-center">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} DAAQ - Ministere de l'Enseignement
            Superieur et de la Recherche Scientifique.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
