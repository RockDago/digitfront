import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Chemin relatif corrigé depuis le dossier Habilitation
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

const RenouvellementHabilitation = () => {
  const [hasAcceptedCanevas, setHasAcceptedCanevas] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Gestion du bouton de retour en haut - UNIQUEMENT pour la première page
  useEffect(() => {
    if (!showForm) {
      const handleScroll = () => {
        setShowScrollTop(window.scrollY > 300);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setShowScrollTop(false); // Désactiver sur le formulaire
    }
  }, [showForm]); // Dépend de showForm

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      scrollToTop(); // Redirige vers le haut
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollToTop(); // Redirige vers le haut
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentStep(1);
    scrollToTop(); // Redirige vers le haut
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(
        <div className="text-sm">
          <div className="font-semibold">Demande soumise avec succès</div>
          <div className="text-xs mt-0.5">Accusé de réception par email</div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          className: "!max-w-[280px] md:!max-w-[320px]",
          bodyClassName: "!p-2",
        },
      );
    } catch (error) {
      toast.error(
        <div className="text-sm">
          <div className="font-semibold">Erreur de soumission</div>
          <div className="text-xs mt-0.5">Veuillez réessayer</div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          className: "!max-w-[280px] md:!max-w-[320px]",
          bodyClassName: "!p-2",
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartForm = () => {
    if (hasAcceptedCanevas) {
      setShowForm(true);
      scrollToTop(); // Redirige vers le haut
    }
  };

  // Bouton de retour en haut (flottant) - UNIQUEMENT sur la page canevas
  const renderScrollTopButton = () => {
    if (!showScrollTop || showForm) return null; // Pas de bouton sur le formulaire

    return (
      <button
        onClick={scrollToTop}
        className="fixed z-50 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        aria-label="Retour en haut"
        // Taille différente pour mobile/tablette/desktop
        style={{
          bottom: "1.5rem",
          right: "1.5rem",
          padding: window.innerWidth < 768 ? "0.75rem" : "1rem", // Plus petit sur mobile
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

  const renderCanevasIntroduction = () => {
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
                      établissements d'enseignement supérieur dans la
                      préparation du dossier de renouvellement d'habilitation
                      d'une formation déjà autorisée par le MESUPReS. Ce dossier
                      doit permettre à la Commission Nationale d'Habilitation
                      (CNH) d'évaluer la qualité, la pertinence et la durabilité
                      de la formation en vérifiant :
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
                      dossier : les informations institutionnelles, le bilan de
                      la formation, la description actualisée de l'offre, les
                      ressources humaines et infrastructures, la gouvernance et
                      l'assurance qualité, les résultats et l'insertion
                      professionnelle, puis une synthèse générale.
                    </p>

                    <p>
                      Cette organisation permet d'assurer une lecture analytique
                      et comparative entre la situation lors de l'habilitation
                      initiale et les améliorations constatées au moment du
                      renouvellement, conformément aux exigences du système LMD
                      et aux standards de qualité du MESupReS.
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
                      mettant en avant les changements institutionnels
                      intervenus depuis l'habilitation initiale. Il s'agit
                      d'évaluer la stabilité juridique et organisationnelle de
                      l'institution, ainsi que sa capacité à garantir la qualité
                      de la formation.
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
                          Les documents obsolètes ou non signés seront
                          considérés comme non valides.
                        </li>
                        <li>
                          Les incohérences entre adresses, responsables et
                          statuts doivent être corrigées avant dépôt.
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
                                Adresse complète du siège et du site de
                                formation
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
                      Cette section retrace l'historique de la formation depuis
                      sa précédente habilitation. Il vise à mesurer les progrès
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
                          Les affirmations non justifiées ne seront pas prises
                          en compte.
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
                      Cette section présente la formation dans son état actuel,
                      en mettant en avant sa vocation, sa structure pédagogique
                      et les innovations introduites depuis l'habilitation
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
                      ressources humaines et matérielles. Il compare la
                      situation actuelle avec celle de l'habilitation initiale,
                      pour vérifier les améliorations apportées.
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
                          Décrire les investissements en équipements
                          pédagogiques.
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
                          Les infrastructures partagées doivent être appuyées
                          par des conventions écrites.
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
                          Les décisions sans preuve de mise en œuvre ne seront
                          pas retenues.
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
                      l'impact professionnel de la formation. Les données
                      doivent être comparées sur plusieurs cohortes pour évaluer
                      les tendances.
                    </p>

                    <div className="mb-3 md:mb-4">
                      <h4 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">
                        Bonnes pratiques :
                      </h4>
                      <ul className="list-disc pl-4 md:pl-5 space-y-1 text-sm md:text-base">
                        <li>
                          Utiliser des tableaux statistiques synthétiques.
                        </li>
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

                {/* Instructions importantes - Version réduite pour mobile */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mt-4 md:mt-6">
                  <h3 className="text-base md:text-lg font-semibold text-blue-800 mb-2 md:mb-3">
                    Instructions importantes
                  </h3>
                  <ul className="space-y-1 md:space-y-2 text-blue-700 text-sm md:text-base">
                    <li className="flex items-start">
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="flex-1">
                        Préparez tous les documents nécessaires avant de
                        commencer
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="flex-1">
                        Assurez-vous que toutes les informations sont exactes et
                        à jour
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="flex-1">
                        Consultez régulièrement les directives officielles du
                        MESUPReS
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section d'acceptation */}
            <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 bg-gray-50 border-t border-gray-200">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      id="accept-canevas"
                      type="checkbox"
                      checked={hasAcceptedCanevas}
                      onChange={(e) => setHasAcceptedCanevas(e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="accept-canevas" className="text-gray-700">
                      <span className="font-medium text-sm md:text-base">
                        Je certifie avoir lu et compris le canevas de
                        renouvellement d'habilitation
                      </span>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">
                        En cochant cette case, je confirme avoir pris
                        connaissance des exigences et de la structure du dossier
                        de renouvellement d'habilitation.
                      </p>
                    </label>
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

        {/* Bouton de retour en haut UNIQUEMENT sur la page canevas */}
        {!showForm && renderScrollTopButton()}
      </div>
    );
  };

  const renderStepContent = (stepId) => {
    switch (stepId) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">
                Présentation de l'institution
              </h3>
              <p className="text-gray-600 text-justify leading-relaxed text-sm md:text-base">
                Veuillez fournir les informations concernant votre institution :
                nom, statut juridique, historique, organigramme, etc.
              </p>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4 md:p-6">
              <h4 className="font-semibold text-gray-800 mb-3 md:mb-4 text-lg md:text-xl">
                Récapitulatif complet
              </h4>
              <div className="space-y-3 md:space-y-4">
                {steps.slice(0, -1).map((step, index) => (
                  <div key={step.id} className="flex items-start">
                    <div
                      className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-3 ${
                        index < 8 ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {index < 8 ? (
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span className="text-xs md:text-sm text-gray-600">
                          {step.id}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm md:text-base">
                        {step.title}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">
                        {index < 8 ? "Section complétée" : "Section en cours"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm md:text-base">
                    Prêt à soumettre
                  </h4>
                  <p className="text-blue-700 text-xs md:text-sm">
                    Cliquez sur "Soumettre la demande" pour finaliser votre
                    renouvellement d'habilitation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">
                {steps[stepId - 1].title}
              </h3>
              <p className="text-gray-600 text-justify leading-relaxed text-sm md:text-base">
                Contenu de la section "{steps[stepId - 1].title}"...
              </p>
            </div>
          </div>
        );
    }
  };

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  const renderForm = () => {
    return (
      <div className="min-h-screen bg-white py-4 md:py-8 px-3 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* En-tête - Version mobile ET desktop */}
          <div className="mb-6 md:mb-10">
            {/* Version mobile - centrée */}
            <div className="md:hidden text-center mb-4">
              <div className="flex justify-center mb-2">
                <img
                  src={mesupresLogo}
                  alt="Logo MESUPReS"
                  className="h-12 w-auto"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                Renouvellement d'Habilitation
              </h1>
              <p className="text-gray-600 text-sm">
                MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR<br />
                ET DE LA RECHERCHE SCIENTIFIQUE
              </p>
            </div>

            {/* Version desktop - alignée à gauche */}
            <div className="hidden md:flex items-center mb-3">
              <img
                src={mesupresLogo}
                alt="Logo MESUPReS"
                className="h-12 w-auto mr-4"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Renouvellement d'Habilitation
                </h1>
                <p className="text-gray-600 text-base">
                  MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR ET DE LA RECHERCHE SCIENTIFIQUE
                </p>
              </div>
            </div>
          </div>

          {/* Barre de progression globale */}
          <div className="mb-6 md:mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs md:text-sm font-medium text-gray-700">
                Progression globale
              </span>
              <span className="text-xs md:text-sm font-semibold text-blue-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Affichage mobile uniquement: Étape actuelle */}
          <div className="md:hidden mb-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-bold text-gray-900">
                Étape {currentStep} : {steps[currentStep - 1].title}
              </h2>
              <p className="text-gray-600 text-xs mt-1">
                Étape {currentStep} sur {steps.length}
              </p>
            </div>
          </div>

          {/* Barre de progression détaillée - Masquée sur mobile */}
          <div className="mb-8 md:mb-10 hidden md:block">
            <div className="relative">
              <div className="absolute left-4 right-4 top-5 h-0.5 bg-gray-200 -translate-y-1/2"></div>

              <div
                className="absolute left-4 top-5 h-0.5 bg-blue-600 -translate-y-1/2 transition-all duration-500 ease-out"
                style={{
                  width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 2rem)`,
                }}
              ></div>

              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-9 gap-3 md:gap-4">
                {steps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className="relative z-10">
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          step.id < currentStep
                            ? "bg-green-500 border-green-500 text-white"
                            : step.id === currentStep
                              ? "bg-blue-600 border-blue-600 text-white ring-2 md:ring-4 ring-blue-100"
                              : "bg-white border-gray-300 text-gray-400"
                        }`}
                      >
                        {step.id < currentStep ? (
                          <svg
                            className="w-4 h-4 md:w-5 md:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <span
                            className={`font-bold text-sm md:text-base ${step.id === currentStep ? "text-white" : "text-gray-500"}`}
                          >
                            {step.id}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 text-center">
                      <p
                        className={`text-xs font-medium leading-tight ${
                          step.id <= currentStep
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title.split(" ").map((word, i) => (
                          <React.Fragment key={i}>
                            {word}
                            {i < step.title.split(" ").length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="max-w-5xl mx-auto">
            {/* Version Desktop/Tablette */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="max-w-none">
                  {renderStepContent(currentStep)}
                </div>
              </div>

              <div className="px-6 md:px-8 py-4 md:py-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    {/* Bouton Précédent */}
                    {currentStep > 1 && (
                      <button
                        onClick={handlePrevious}
                        className="px-4 py-2.5 md:px-5 md:py-3 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 border border-gray-300 hover:border-gray-400 flex items-center gap-2 text-sm md:text-base"
                      >
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
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        <span>Précédent</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-4 sm:mt-0">
                    {/* Bouton Suivant/Terminer */}
                    {currentStep === steps.length ? (
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 md:px-8 md:py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Soumission en cours...</span>
                          </>
                        ) : (
                          <>
                            <span>Soumettre la demande</span>
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="px-6 py-2.5 md:px-8 md:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2 text-sm md:text-base"
                      >
                        <span>Suivant</span>
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Version Mobile */}
            <div className="md:hidden">
              {/* Contenu de l'étape pour mobile */}
              <div className="pb-4">
                <div className="max-w-none">
                  {renderStepContent(currentStep)}
                </div>
              </div>

              {/* Navigation - Mobile */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                {/* Boutons Précédent/Suivant */}
                <div className="flex items-center gap-3">
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrevious}
                      className="flex-1 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg font-medium border border-gray-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <span>Précédent</span>
                    </button>
                  )}

                  {currentStep === steps.length ? (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Soumettre</span>
                        </>
                      ) : (
                        <>
                          <span>Soumettre</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className={`flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 text-sm`}
                    >
                      <span>Suivant</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Indicateurs - Desktop uniquement */}
          <div className="max-w-5xl mx-auto mt-6 hidden md:flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Étape complétée</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span>Étape actuelle</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full border-2 border-gray-300 bg-white"></div>
              <span>Étape à venir</span>
            </div>
          </div>
        </div>
        {/* PAS de bouton de retour en haut sur le formulaire */}
      </div>
    );
  };

  return (
    <>
      {!showForm ? renderCanevasIntroduction() : renderForm()}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        className="!text-sm"
        toastClassName="!max-w-[280px] md:!max-w-[320px] !rounded-lg !shadow-lg"
        bodyClassName="!p-2"
        progressClassName="!h-0.5"
      />
    </>
  );
};

export default RenouvellementHabilitation;