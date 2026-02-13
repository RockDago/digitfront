import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import daaqLogo from "../../assets/images/daaq.png";
import organigrame from "../../assets/images/organigrame.png";
import daaqOrgDetail from "../../assets/images/daaqorg.jpg";

const APropos = () => {
  // Toutes les sections fermées par défaut
  const [expandedSections, setExpandedSections] = useState({
    contexte: false,
    historique: false,
    missions: false,
    organigramme: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <section
      id="apropos"
      className="bg-gradient-to-b from-slate-50 to-white py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tete */}
        <header className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            PRESENTATION GENERALE
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl mx-auto text-justify px-4">
            La Direction de l'Accreditation et de l'Assurance Qualite a pour
            mission d'assurer la regulation, l'evaluation et la promotion de la
            qualite de l'enseignement superieur et de la recherche scientifique,
            en veillant a la conformite des Instituts d'Enseignement Superieur
            publics et prives aux normes etablies par les textes reglementaires
            en vigueur.
          </p>
        </header>

        <div className="space-y-4">
          {/* Section 1 : Structure organisationnelle */}
          <article className="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-5 sm:p-6 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => toggleSection("organigramme")}
              aria-expanded={expandedSections.organigramme}
            >
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 text-left">
                Structure organisationnelle
              </h3>
              {expandedSections.organigramme ? (
                <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 flex-shrink-0" />
              )}
            </button>

            {expandedSections.organigramme && (
              <div className="px-5 sm:px-6 pb-6 animate-fadeIn">
                {/* BLOC 1 : ORGANIGRAMME GENERAL */}
                <div className="mb-10">
                  <div className="mb-6 text-center bg-slate-50 rounded-lg p-6">
                    <h4 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase mb-3">
                      ORGANIGRAMME DU MINISTERE
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed max-w-3xl mx-auto">
                      Decret n 2019 - 073 Fixant les attributions du Ministere
                      de l'Enseignement Superieur et de la Recherche
                      Scientifique ainsi que l'organisation generale de son
                      Ministere.
                    </p>
                  </div>

                  {/* Image Organigramme Global */}
                  <div className="rounded-xl overflow-hidden border-2 border-slate-200 bg-white shadow-md mb-6">
                    <img
                      src={organigrame}
                      alt="Organigramme Ministere"
                      className="w-full h-auto max-h-[600px] object-contain"
                    />
                  </div>

                  {/* Liens Decrets */}
                  <div className="flex flex-col items-center space-y-4 border-t border-slate-100 pt-6">
                    <div className="text-center max-w-2xl w-full bg-blue-50 rounded-lg p-4">
                      <p className="text-slate-700 font-semibold text-xs sm:text-sm mb-2 uppercase tracking-wide">
                        Organigramme suivant le decret N 2019-073 du 06 fevrier
                        2019
                      </p>
                      <a
                        href="https://docs.google.com/viewer?url=https://www.mesupres.gov.mg/assets/front/documents/decret_2019-073_du_06_fevrier_2019_organisation_du_mesupres.pdf&embedded=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors group text-sm"
                      >
                        <FileText
                          size={16}
                          className="group-hover:scale-110 transition-transform"
                        />
                        <span>Consulter le decret N 2019-073</span>
                      </a>
                    </div>

                    <div className="text-center max-w-2xl w-full bg-blue-50 rounded-lg p-4">
                      <p className="text-slate-700 font-semibold text-xs sm:text-sm mb-2 uppercase tracking-wide">
                        Modification suivant le decret N 2022-510 du 13 avril
                        2022
                      </p>
                      <a
                        href="https://docs.google.com/viewer?url=https://www.mesupres.gov.mg/assets/front/documents/decret_2022-510_du_13_avril_2022_organisation_du_mesupres_(maj).pdf&embedded=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors group text-sm"
                      >
                        <FileText
                          size={16}
                          className="group-hover:scale-110 transition-transform"
                        />
                        <span>Consulter le decret N 2022-510</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* BLOC 2 : ORGANIGRAMME DETAILLE (DGES -> DAAQ) */}
                <div className="pt-6 border-t border-slate-200">
                  <div className="mb-6 text-center">
                    <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-3">
                      Rattachement Institutionnel
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed max-w-3xl mx-auto px-4">
                      La Direction de l'Accreditation et de l'Assurance Qualite
                      (DAAQ) est une structure centrale placee sous l'autorite
                      directe de la Direction Generale de l'Enseignement
                      Superieur (DGES), assurant la mise en oeuvre
                      operationnelle de la politique qualite.
                    </p>
                  </div>

                  {/* Image reduite - max-w-2xl au lieu de max-w-4xl */}
                  <div className="rounded-xl overflow-hidden border-2 border-slate-200 bg-white shadow-md mx-auto max-w-2xl">
                    <img
                      src={daaqOrgDetail}
                      alt="Organigramme DAAQ detaille"
                      className="w-full h-auto max-h-[400px] object-contain mx-auto"
                    />
                  </div>
                </div>
              </div>
            )}
          </article>

          {/* Section 2 : Localisation */}
          <article className="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-5 sm:p-6 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => toggleSection("historique")}
              aria-expanded={expandedSections.historique}
            >
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 text-left">
                Localisation
              </h3>
              {expandedSections.historique ? (
                <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 flex-shrink-0" />
              )}
            </button>

            {expandedSections.historique && (
              <div className="px-5 sm:px-6 pb-6 space-y-6 animate-fadeIn">
                <div className="space-y-4 text-sm sm:text-base">
                  <p className="text-slate-700 leading-relaxed text-justify">
                    La Direction est dirigee par un Directeur nomme par Decret
                    pris en conseil des Ministres, sur proposition du Ministre
                    de l'Enseignement Superieur et de la Recherche Scientifique,
                    le 06 juin 2019, portant abrogation du decret N 2010-071.
                    Suivant le decret N 2019-073 du 21 fevrier 2019 fixant les
                    attributions du Ministere de l'Enseignement Superieur et de
                    la Recherche Scientifique ainsi que l'organisation generale
                    de son ministere et suivant le chapitre I de DESUP, Article
                    20.
                  </p>

                  <p className="text-slate-700 leading-relaxed text-justify bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                    La Direction de l'Accreditation et de l'Assurance Qualite
                    est placee sous l'autorite de la Direction Generale de
                    l'Enseignement Superieur (DGES).
                  </p>

                  <p className="text-slate-700 leading-relaxed text-justify">
                    La Direction de l'Accreditation et de l'Assurance Qualite se
                    localise a Tsimbazaza-Antananarivo, dans le batiment de la
                    Direction Generale de l'Enseignement Superieur, avec le code
                    postal 101.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 font-semibold text-sm sm:text-base mb-4 text-center">
                    Etablissement de la DAAQ
                  </p>

                  <div className="rounded-xl overflow-hidden border-2 border-slate-200 bg-white shadow-md">
                    <img
                      src={daaqLogo}
                      alt="Logo DAAQ"
                      className="w-full h-auto max-h-[500px] object-contain"
                    />
                  </div>
                </div>
              </div>
            )}
          </article>

          {/* Section 3 : Missions et activites */}
          <article className="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-5 sm:p-6 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => toggleSection("missions")}
              aria-expanded={expandedSections.missions}
            >
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 text-left">
                Missions et activites de la DAAQ
              </h3>
              {expandedSections.missions ? (
                <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 flex-shrink-0" />
              )}
            </button>

            {expandedSections.missions && (
              <div className="px-5 sm:px-6 pb-6 space-y-5 text-sm sm:text-base animate-fadeIn">
                <p className="text-slate-700 leading-relaxed text-justify">
                  La Direction de l'Accreditation et de l'Assurance Qualite
                  oriente ses objectifs et activites vers un enseignement
                  superieur de qualite pour tous, ainsi qu'une recherche
                  scientifique de haut niveau au service du developpement de la
                  nation, et une bonne gouvernance. Elle vise la qualite des
                  Instituts d'Enseignement Superieur (IES), prives ou publics,
                  afin que ces derniers puissent remplir les normes fixees par
                  arrete du Ministre charge de l'enseignement superieur.
                </p>

                <p className="text-slate-700 leading-relaxed text-justify bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                  La DAAQ est chargee de la mise en oeuvre de la politique et du
                  programme du ministere en matiere d'amelioration de la qualite
                  de l'enseignement superieur et de la promotion de la culture
                  de la qualite.
                </p>

                <p className="text-slate-700 leading-relaxed text-justify">
                  Tous les IES doivent passer par des procedures d'evaluation de
                  qualite sur l'ensemble de leur etablissement. La DAAQ
                  intervient pour verifier si ces institutions remplissent les
                  criteres ou les normes fixes par arrete du Ministre charge de
                  l'Enseignement Superieur.
                </p>

                <p className="text-slate-700 leading-relaxed text-justify">
                  La Direction de l'Accreditation et de l'Assurance Qualite
                  accredite les IES dont les offres de formation sont
                  habilitees, plus precisement ceux ayant deja depose une
                  demande d'habilitation et disposant de la mention habilitee.
                </p>

                <div className="mt-6 bg-slate-50 rounded-lg p-5">
                  <h4 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
                    Activites principales
                  </h4>
                  <ul className="list-disc pl-5 sm:pl-6 text-slate-700 space-y-3">
                    <li className="leading-relaxed">
                      Accompagnement des IES dans l'appropriation de la demarche
                      qualite (mise en place et operationnalisation d'une
                      structure d'assurance qualite interne).
                    </li>
                    <li className="leading-relaxed">
                      Conduite des procedures d'accreditation des institutions
                      d'enseignement superieur et gestion des dossiers
                      d'accreditation des IES prives ou publics.
                    </li>
                    <li className="leading-relaxed">
                      Contribution au processus de mise en place d'une Agence
                      Nationale d'Accreditation (ANA) organisant les sessions
                      d'evaluation et la conformite des IES.
                    </li>
                    <li className="leading-relaxed">
                      Mise en place du Cadre National Malgache de Certification
                      (CNMC), en collaboration avec le ministere de
                      l'enseignement technique et de la formation
                      professionnelle.
                    </li>
                    <li className="leading-relaxed">
                      Validation des acquis de l'experience professionnelle.
                    </li>
                    <li className="leading-relaxed">
                      Accreditation de deux types d'IES : formations courtes a
                      vocation professionnelle et formations de la Licence au
                      Doctorat.
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </article>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default APropos;
