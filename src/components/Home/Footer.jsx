import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

import logoMinistere from "../../assets/images/mesupres-logo.png";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Fonction intelligente pour gérer la navigation vers une ancre (ex: #services)
  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();

    // Si on est déjà sur la page d'accueil
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Sinon, on navigue vers l'accueil avec l'état pour scroller après chargement
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  return (
    <footer className="bg-[#0f172a] text-slate-300 font-sans border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- PARTIE HAUTE (PRINCIPALE) --- */}
        <div className="py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-12">
          {/* COLONNE 1 : IDENTITÉ (Largeur 5/12 sur Desktop) */}
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
                  Direction de l'Accréditation{" "}
                  <br className="hidden sm:block" />
                  et de l'Assurance Qualité
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md border-l-2 border-blue-600 pl-4">
              Garantir l'excellence de l'enseignement supérieur à travers des
              standards rigoureux d'évaluation, d'accréditation et d'assurance
              qualité.
            </p>
          </div>

          {/* COLONNE 2 : LIENS & INFOS (Largeur 7/12 sur Desktop) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8">
            {/* Sous-colonne A : Documents */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <FileText size={16} className="text-blue-500" />
                Documents Légaux
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/arrete-accreditation"
                    className="group flex flex-col hover:bg-slate-800/50 p-2 -mx-2 rounded-lg transition-all"
                  >
                    <span className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                      Arrêté d'accréditation
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      PDF • Télécharger
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/decret-accreditation"
                    className="group flex flex-col hover:bg-slate-800/50 p-2 -mx-2 rounded-lg transition-all"
                  >
                    <span className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                      Décret d'accréditation
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      PDF • Télécharger
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sous-colonne B : Services (LIÉS AU NAVBAR) */}
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
                    <span className="leading-snug">
                      Contrôle & Inspection (SCIP)
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
                    <span className="leading-snug">
                      Équivalence de Diplômes
                    </span>
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
                <div className="flex items-start gap-3 mb-3">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] shrink-0"></div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      Lundi - Vendredi
                    </p>
                    <p className="text-slate-400 text-xs mt-1">08h00 - 16h00</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 italic border-t border-slate-700/50 pt-2 mt-2">
                  Fermé les week-ends et jours fériés.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- PARTIE INFÉRIEURE : CONTACT & SOCIAL --- */}
        <div className="border-t border-slate-800 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
          {/* Contact Items */}
          <div className="flex items-start gap-3">
            <div className="bg-slate-800 p-2 rounded-lg text-blue-500 shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <strong className="block text-white text-xs uppercase tracking-wide mb-0.5">
                Siège Social
              </strong>
              <span className="text-sm text-slate-400">
                Fiadanana, Antananarivo 101
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-slate-800 p-2 rounded-lg text-blue-500 shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <strong className="block text-white text-xs uppercase tracking-wide mb-0.5">
                Téléphone
              </strong>
              <a
                href="tel:+261340000000"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                +261 34 00 000 00
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-slate-800 p-2 rounded-lg text-blue-500 shrink-0">
              <Mail size={18} />
            </div>
            <div>
              <strong className="block text-white text-xs uppercase tracking-wide mb-0.5">
                Email
              </strong>
              <a
                href="mailto:contact@mesupres.gov.mg"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                contact@mesupres.gov.mg
              </a>
            </div>
          </div>

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
            &copy; {new Date().getFullYear()} DAAQ - Ministère de l'Enseignement
            Supérieur et de la Recherche Scientifique.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
