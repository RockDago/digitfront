import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mesupresLogo from "../../../../../assets/images/mesupres-logo.png";

const steps = [
  { id: 1, title: "Présentation de l'institution" },
  { id: 2, title: "Bilan de la formation précédente" },
  { id: 3, title: "Description actualisée de la formation" },
  { id: 4, title: "Ressources humaines et infrastructures" },
  { id: 5, title: "Gouvernance, assurance qualité et pilotage" },
  { id: 6, title: "Performances académiques et insertion professionnelle" },
  { id: 7, title: "Synthèse et conclusion" },
  { id: 8, title: "Annexes obligatoires" },
  { id: 9, title: "Récapitulatif" },
];

const RenouvellementCanevas = () => {
  const navigate = useNavigate();
  const [hasAcceptedCanevas, setHasAcceptedCanevas] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Gestion du bouton de retour en haut
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartForm = () => {
    if (hasAcceptedCanevas) {
      navigate("/renouvellement-form");
      scrollToTop();
    }
  };

  // Bouton de retour en haut (flottant)
  const renderScrollTopButton = () => {
    if (!showScrollTop) return null;

    return (
      <button
        onClick={scrollToTop}
        className="fixed z-50 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        aria-label="Retour en haut"
        style={{
          bottom: "1.5rem",
          right: "1.5rem",
          padding: window.innerWidth < 768 ? "0.75rem" : "1rem",
        }}
      >
        <svg
          className={window.innerWidth < 768 ? "w-5 h-5" : "w-6 h-6"}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-white py-4 md:py-8 px-3 sm:px-4 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* En-tête avec logo et titre */}
        <div className="text-center mb-6 md:mb-10">
          <div className="flex flex-col items-center">
            <div className="mb-3 md:mb-4">
              <img
                src={mesupresLogo}
                alt="Logo MESUPReS"
                className="h-16 md:h-20 w-auto"
              />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
              Canevas de Renouvellement d'Habilitation
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR ET DE LA RECHERCHE
              SCIENTIFIQUE
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8 md:mb-10">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="text-gray-800 text-justify leading-relaxed space-y-6 md:space-y-8">
              {/* Introduction */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                  Introduction
                </h2>
                <div className="text-sm md:text-base">
                  <p className="mb-3 md:mb-4">
                    Le présent canevas a pour objectif d'accompagner les
                    établissements d'enseignement supérieur dans la préparation
                    du dossier de renouvellement d'habilitation d'une formation
                    déjà autorisée par le MESUPReS. Ce dossier doit permettre à
                    la Commission Nationale d'Habilitation (CNH) d'évaluer la
                    qualité, la pertinence et la durabilité de la formation en
                    vérifiant :
                  </p>

                  <ul className="mb-3 md:mb-4 pl-4 md:pl-5 space-y-1 md:space-y-2 text-sm md:text-base">
                    <li>• sa conformité au système LMD,</li>
                    <li>
                      • les améliorations apportées depuis l'habilitation
                      initiale,
                    </li>
                    <li>
                      • et sa capacité d'adaptation aux besoins évolutifs du
                      contexte socio-économique et académique.
                    </li>
                  </ul>

                  <p className="mb-3 md:mb-4">
                    Le document est structuré en sept blocs complémentaires,
                    conçus pour guider les établissements dans la présentation
                    complète et cohérente de leur demande de renouvellement
                    d'habilitation. Chaque bloc traite un aspect spécifique du
                    dossier : les informations institutionnelles, le bilan de la
                    formation, la description actualisée de l'offre, les
                    ressources humaines et infrastructures, la gouvernance et
                    l'assurance qualité, les résultats et l'insertion
                    professionnelle, puis une synthèse générale.
                  </p>

                  <p>
                    Cette organisation permet d'assurer une lecture analytique
                    et comparative entre la situation lors de l'habilitation
                    initiale et les améliorations constatées au moment du
                    renouvellement, conformément aux exigences du système LMD et
                    aux standards de qualité du MESupReS.
                  </p>
                </div>
              </div>

              {/* Section I */}
              <div className="border-t border-gray-200 pt-4 md:pt-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  I. Présentation de l'institution
                </h3>
                <div className="text-sm md:text-base">
                  <p className="mb-3 md:mb-4">
                    Cette première section vise à présenter les informations
                    administratives et structurelles de l'établissement, en
                    mettant en avant les changements institutionnels intervenus
                    depuis l'habilitation initiale. Il s'agit d'évaluer la
                    stabilité juridique et organisationnelle de l'institution,
                    ainsi que sa capacité à garantir la qualité de la formation.
                  </p>

                  <div className="mb-3 md:mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">
                      Bonnes pratiques :
                    </h4>
                    <ul className="list-disc pl-4 md:pl-5 space-y-1 text-sm md:text-base">
                      <li>
                        Indiquer clairement les coordonnées de l'établissement
                        et la filiation institutionnelle.
                      </li>
                      <li>
                        Joindre de récents documents signés (arrêtés, statuts,
                        lettres, rapports).
                      </li>
                    </ul>
                  </div>

                  <div className="mb-3 md:mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">
                      Points de vigilance :
                    </h4>
                    <ul className="list-disc pl-4 md:pl-5 space-y-1 text-sm md:text-base">
                      <li>
                        Les documents obsolètes ou non signés seront considérés
                        comme non valides.
                      </li>
                      <li>
                        Les incohérences entre adresses, responsables et statuts
                        doivent être corrigées avant dépôt.
                      </li>
                    </ul>
                  </div>

                  <div className="overflow-x-auto -mx-2 md:-mx-0">
                    <div className="min-w-[600px] md:min-w-full px-2 md:px-0">
                      <table className="w-full divide-y divide-gray-200 border border-gray-300 text-xs md:text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Élément
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Contenu attendu
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Pièces justificatives
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Nom de l'institution
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Dénomination complète et sigle
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Statuts, agrément
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Statut juridique
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Public / Privé / Confessionnel
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Copie du statut
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Responsable de l'institution
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Nom, prénom, fonction, coordonnées
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              CV et arrêté de nomination
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Arrêté d'habilitation antérieure
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Référence, date et portée de l'arrêté
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Copie officielle
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Localité et adresse
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Adresse complète du siège et du site de formation
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Plan ou certificat de localisation
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Lettre de demande de renouvellement
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Signée par le responsable de l'institution
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Original signé
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Évolution institutionnelle
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Changements intervenus depuis l'habilitation
                              initiale
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Rapports, organigrammes
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section II */}
              <div className="border-t border-gray-200 pt-4 md:pt-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  II. Bilan de la formation précédente
                </h3>
                <div className="text-sm md:text-base">
                  <p className="mb-3 md:mb-4">
                    Cette section retrace l'historique de la formation depuis sa
                    précédente habilitation. Il vise à mesurer les progrès
                    accomplis et les ajustements réalisés dans la logique
                    d'amélioration continue.
                  </p>

                  <div className="mb-3 md:mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">
                      Bonnes pratiques :
                    </h4>
                    <ul className="list-disc pl-4 md:pl-5 space-y-1 text-sm md:text-base">
                      <li>
                        Présenter des comparaisons chiffrées (avant/après).
                      </li>
                      <li>
                        Illustrer les progrès par des preuves concrètes :
                        statistiques, photos, rapports.
                      </li>
                    </ul>
                  </div>

                  <div className="mb-3 md:mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">
                      Points de vigilance :
                    </h4>
                    <ul className="list-disc pl-4 md:pl-5 space-y-1 text-sm md:text-base">
                      <li>
                        Les affirmations non justifiées ne seront pas prises en
                        compte.
                      </li>
                      <li>
                        Les données doivent provenir de sources
                        institutionnelles officielles.
                      </li>
                    </ul>
                  </div>

                  <div className="overflow-x-auto -mx-2 md:-mx-0">
                    <div className="min-w-[700px] md:min-w-full px-2 md:px-0">
                      <table className="w-full divide-y divide-gray-200 border border-gray-300 text-xs md:text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Critère
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Situation initiale
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Situation actuelle / Améliorations
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Preuves
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Résultats académiques
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Moyenne de réussite et diplomation
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Nouvelles statistiques actualisées
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              PV, tableaux
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Maquette pédagogique
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Structure initiale
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              UE modifiées, nouveaux parcours
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Nouvelle maquette
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Ressources humaines
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Équipe enseignante initiale
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Recrutements, formations, HDR obtenues
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              CV, attestations
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Infrastructures
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Moyens disponibles
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Nouveaux locaux, équipements numériques
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Photos, factures
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Gouvernance et qualité
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Dispositifs existants
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Nouvelles procédures, autoévaluations
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Rapports AQ
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Partenariats
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Conventions existantes
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Nouvelles collaborations
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Copies des conventions
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section III */}
              <div className="border-t border-gray-200 pt-4 md:pt-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  III. Description actualisée de la formation
                </h3>
                <div className="text-sm md:text-base">
                  <p className="mb-3 md:mb-4">
                    Cette section présente la formation dans son état actuel, en
                    mettant en avant sa vocation, sa structure pédagogique et
                    les innovations introduites depuis l'habilitation
                    précédente.
                  </p>

                  <div className="mb-3 md:mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">
                      Bonnes pratiques :
                    </h4>
                    <ul className="list-disc pl-4 md:pl-5 space-y-1 text-sm md:text-base">
                      <li>Mettre à jour la maquette selon le format LMD.</li>
                      <li>
                        Présenter les fiches UE complètes (crédits,
                        responsables, modes d'évaluation).
                      </li>
                    </ul>
                  </div>

                  <div className="overflow-x-auto -mx-2 md:-mx-0">
                    <div className="min-w-[600px] md:min-w-full px-2 md:px-0">
                      <table className="w-full divide-y divide-gray-200 border border-gray-300 text-xs md:text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Élément
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Détails attendus
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Justificatifs
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Domaine et mention
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Domaine de formation et mention concernée
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Arrêté initial et mise à jour
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Grade et parcours
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Licence ou Master, parcours maintenus ou ajoutés
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Fiches parcours
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Responsables de parcours
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Nom, grade, spécialité
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              CV, arrêté de nomination
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Maquette pédagogique actualisée
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Structure conforme au LMD
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Nouvelle maquette signée
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Innovations pédagogiques
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Approches nouvelles (numérique, stages, projets)
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              PV, supports
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Orientation de la formation
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Académique OU Professionnelle
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Document de présentation
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section IV */}
              <div className="border-t border-gray-200 pt-4 md:pt-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  IV. Ressources humaines et infrastructures
                </h3>
                <div className="text-sm md:text-base">
                  <p className="mb-3 md:mb-4">
                    Cette section évalue la disponibilité et la qualité des
                    ressources humaines et matérielles. Il compare la situation
                    actuelle avec celle de l'habilitation initiale, pour
                    vérifier les améliorations apportées.
                  </p>

                  <div className="mb-3 md:mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">
                      Bonnes pratiques :
                    </h4>
                    <ul className="list-disc pl-4 md:pl-5 space-y-1 text-sm md:text-base">
                      <li>
                        Mentionner les nouveaux recrutements, promotions, ou
                        formations d'enseignants.
                      </li>
                      <li>
                        Décrire les investissements en équipements pédagogiques.
                      </li>
                    </ul>
                  </div>

                  <div className="mb-3 md:mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">
                      Points de vigilance :
                    </h4>
                    <ul className="list-disc pl-4 md:pl-5 space-y-1 text-sm md:text-base">
                      <li>
                        Les CV et lettre d'engagement non signé ne sont pas
                        recevables.
                      </li>
                      <li>
                        Les infrastructures partagées doivent être appuyées par
                        des conventions écrites.
                      </li>
                    </ul>
                  </div>

                  <div className="overflow-x-auto -mx-2 md:-mx-0">
                    <div className="min-w-[700px] md:min-w-full px-2 md:px-0">
                      <table className="w-full divide-y divide-gray-200 border border-gray-300 text-xs md:text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Domaine
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Situation initiale
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Situation actuelle / Améliorations
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Preuves
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Enseignants permanents
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Nombre et spécialité
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Nouvelles recrues, promotions HDR
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              CV, diplômes
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Enseignants vacataires
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Nombre et profils
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Évolution de la contribution
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              PV de service
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Personnel d'appui
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Techniciens, bibliothécaires
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Renforcement des équipes
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Liste nominative
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Salles et laboratoires
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              État initial
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Rénovations, nouveaux équipements
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Photos, factures
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Bibliothèque et numérique
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Fonds documentaire et accès
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Actualisation, abonnements
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Captures, inventaires
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Accessibilité et énergie
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Conditions initiales
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Améliorations structurelles
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Rapports, attestations
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section V */}
              <div className="border-t border-gray-200 pt-4 md:pt-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  V. Gouvernance, assurance qualité et pilotage
                </h3>
                <div className="text-sm md:text-base">
                  <p className="mb-3 md:mb-4">
                    Cette section analyse la gouvernance académique et le
                    pilotage de la qualité. Il vise à vérifier que
                    l'établissement dispose d'un suivi institutionnel régulier
                    et d'une cellule AQ fonctionnelle.
                  </p>

                  <div className="mb-3 md:mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">
                      Bonnes pratiques :
                    </h4>
                    <ul className="list-disc pl-4 md:pl-5 space-y-1 text-sm md:text-base">
                      <li>
                        Joindre les PV récents du conseil pédagogique ou
                        scientifique.
                      </li>
                      <li>
                        Présenter un plan d'amélioration continue avec
                        indicateurs suivis.
                      </li>
                    </ul>
                  </div>

                  <div className="mb-3 md:mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">
                      Points de vigilance :
                    </h4>
                    <ul className="list-disc pl-4 md:pl-5 space-y-1 text-sm md:text-base">
                      <li>
                        Les rapports AQ doivent couvrir la période complète
                        depuis la précédente habilitation.
                      </li>
                      <li>
                        Les décisions sans preuve de mise en œuvre ne seront pas
                        retenues.
                      </li>
                    </ul>
                  </div>

                  <div className="overflow-x-auto -mx-2 md:-mx-0">
                    <div className="min-w-[700px] md:min-w-full px-2 md:px-0">
                      <table className="w-full divide-y divide-gray-200 border border-gray-300 text-xs md:text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Élément
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Situation initiale
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Situation actuelle / Progrès
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Preuves
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Conseil pédagogique et scientifique
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Fréquence et fonctionnement antérieurs
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Réunions régulières et PV
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              PV, rapports
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Cellule assurance qualité
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Existence et rôle
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Nouveaux outils, indicateurs
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Rapports AQ
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Suivi-évaluation
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Dispositif de suivi initial
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Tableaux de bord, indicateurs actualisés
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Rapports d'évaluation
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Plan stratégique
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Alignement initial
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Inclusion renforcée de la formation
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Extraits validés
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Participation des acteurs
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Implication initiale
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Mécanismes participatifs renforcés
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Feuilles de présence
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section VI */}
              <div className="border-t border-gray-200 pt-4 md:pt-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  VI. Performances académiques et insertion professionnelle
                </h3>
                <div className="text-sm md:text-base">
                  <p className="mb-3 md:mb-4">
                    Ce bloc permet d'apprécier la performance académique et
                    l'impact professionnel de la formation. Les données doivent
                    être comparées sur plusieurs cohortes pour évaluer les
                    tendances.
                  </p>

                  <div className="mb-3 md:mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">
                      Bonnes pratiques :
                    </h4>
                    <ul className="list-disc pl-4 md:pl-5 space-y-1 text-sm md:text-base">
                      <li>Utiliser des tableaux statistiques synthétiques.</li>
                      <li>Décrire le dispositif de suivi des diplômés.</li>
                    </ul>
                  </div>

                  <div className="mb-3 md:mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">
                      Points de vigilance :
                    </h4>
                    <ul className="list-disc pl-4 md:pl-5 space-y-1 text-sm md:text-base">
                      <li>
                        Les statistiques doivent être sourcées et vérifiables.
                      </li>
                      <li>
                        Les indicateurs isolés (une seule année) ne sont pas
                        représentatifs.
                      </li>
                    </ul>
                  </div>

                  <div className="overflow-x-auto -mx-2 md:-mx-0">
                    <div className="min-w-[700px] md:min-w-full px-2 md:px-0">
                      <table className="w-full divide-y divide-gray-200 border border-gray-300 text-xs md:text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Indicateur
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Données initiales
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Données actualisées / Évolution
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Preuves
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Taux de réussite
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Moyenne sur 3 cohortes
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Dernières cohortes disponibles
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Tableaux de résultats
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Taux de diplomation
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Pourcentage initial
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Évolution constatée
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              PV de délibérations
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Taux d'insertion
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Suivi initial
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Statistiques récentes
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Enquêtes alumni
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Satisfaction étudiants / employeurs
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Résultats d'enquêtes
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Nouvelles données comparatives
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Rapports AQ
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Actions d'amélioration
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Plan initial
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Résultats observés
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Rapports AQ, PV
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section VII */}
              <div className="border-t border-gray-200 pt-4 md:pt-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  VII. Synthèse et conclusion
                </h3>
                <div className="text-sm md:text-base">
                  <p className="mb-3 md:mb-4">
                    Cette section permet de présenter une autoévaluation
                    critique de la formation et d'identifier les actions
                    prioritaires pour le prochain cycle d'habilitation.
                  </p>

                  <div className="mb-3 md:mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">
                      Bonnes pratiques :
                    </h4>
                    <ul className="list-disc pl-4 md:pl-5 space-y-1 text-sm md:text-base">
                      <li>
                        Être honnête, factuel et orienté vers la solution.
                      </li>
                      <li>
                        Utiliser la méthode SWOT
                        (forces/faiblesses/opportunités/menaces).
                      </li>
                    </ul>
                  </div>

                  <div className="mb-3 md:mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">
                      Points de vigilance :
                    </h4>
                    <ul className="list-disc pl-4 md:pl-5 space-y-1 text-sm md:text-base">
                      <li>
                        Les engagements doivent être réalistes et mesurables.
                      </li>
                      <li>
                        La synthèse doit être signée par le responsable de la
                        formation.
                      </li>
                    </ul>
                  </div>

                  <div className="overflow-x-auto -mx-2 md:-mx-0">
                    <div className="min-w-[600px] md:min-w-full px-2 md:px-0">
                      <table className="w-full divide-y divide-gray-200 border border-gray-300 text-xs md:text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Domaine
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Forces identifiées
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Points à améliorer
                            </th>
                            <th className="px-2 md:px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                              Actions prévues
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Ressources humaines
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top"></td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top"></td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top"></td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Infrastructures
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top"></td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top"></td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top"></td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Pédagogie
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top"></td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top"></td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top"></td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Résultats
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top"></td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top"></td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top"></td>
                          </tr>
                          <tr>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top">
                              Gouvernance et assurance qualité
                            </td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top"></td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top"></td>
                            <td className="px-2 md:px-4 py-2 text-gray-900 border border-gray-300 align-top"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section VIII */}
              <div className="border-t border-gray-200 pt-4 md:pt-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  VIII. Annexes obligatoires
                </h3>
                <div className="text-sm md:text-base">
                  <p className="mb-3 md:mb-4">
                    Les annexes constituent les pièces justificatives
                    essentielles permettant de vérifier la véracité des
                    informations.
                  </p>

                  <div className="mb-3 md:mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">
                      Bonnes pratiques :
                    </h4>
                    <ul className="list-disc pl-4 md:pl-5 space-y-1 text-sm md:text-base">
                      <li>
                        Classer les documents par bloc et numéroter les pages.
                      </li>
                      <li>Fournir des copies nettes, datées, signées.</li>
                    </ul>
                  </div>

                  <div className="mb-3 md:mb-4">
                    <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">
                      Points de vigilance :
                    </h4>
                    <ul className="list-disc pl-4 md:pl-5 space-y-1 text-sm md:text-base">
                      <li>
                        Les preuves non conformes (non datées, incomplètes)
                        affaiblissent le dossier.
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 md:mb-3 text-sm md:text-base">
                      Pièces justificatives indispensables à l'analyse du
                      dossier par la CNH
                    </h4>
                    <ul className="list-disc pl-4 md:pl-5 space-y-1 md:space-y-2 text-sm md:text-base">
                      <li>Copie de l'arrêté d'habilitation initiale.</li>
                      <li>Maquette pédagogique actualisée.</li>
                      <li>
                        CV, diplômes et lettre d'engagement des enseignants.
                      </li>
                      <li>
                        Listes d'effectifs des étudiants (3 dernières années).
                      </li>
                      <li>Rapports AQ et plan d'amélioration.</li>
                      <li>Photos et plans des infrastructures.</li>
                      <li>Conventions de partenariat récentes.</li>
                      <li>Fiche Domaine, Mention et Parcours</li>
                      <li>Fiches UE et supports pédagogiques.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section d'acceptation - MODIFIÉE */}
          <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-white border-t border-gray-200">
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-center">
                  <label
                    htmlFor="accept-canevas"
                    className="text-gray-700 flex items-center justify-center gap-2"
                  >
                    <input
                      id="accept-canevas"
                      type="checkbox"
                      checked={hasAcceptedCanevas}
                      onChange={(e) => setHasAcceptedCanevas(e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="font-medium text-sm md:text-base">
                      Je certifie avoir lu et compris le canevas de
                      renouvellement d'habilitation
                    </span>
                  </label>
                  <p className="text-xs md:text-sm text-gray-500 mt-1 max-w-2xl mx-auto">
                    En cochant cette case, je confirme avoir pris connaissance
                    des exigences et de la structure du dossier de
                    renouvellement d'habilitation.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleStartForm}
                  disabled={!hasAcceptedCanevas}
                  className="px-6 py-3 md:px-8 md:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  <span>Commencer le remplissage du formulaire</span>
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton de retour en haut */}
      {renderScrollTopButton()}
    </div>
  );
};

export default RenouvellementCanevas;
