import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ClipboardList,
  CheckCircle2,
  ArrowRight,
  BadgeCheck,
  ArrowLeft,
} from "lucide-react";

// --- DONNÉES ÉQUIVALENCE ---
const stepsEquivalence = [
  { id: 1, title: "Dépôt des dossiers en ligne pour demande d’équivalence" },
  { id: 2, title: "Traitement des dossiers :\nCritères d’éligibilité" },
  { id: 3, title: "Dépôt des dossiers Physique pour demande d’équivalence" },
  {
    id: 4,
    title:
      "Étude des dossiers au niveau de la Commission Nationale d’Équivalences (CNE)\n(Membres : DAAQ • DGES • DGRS • DES • DRI • DRSE)",
  },
  { id: 5, title: "Lecture au niveau du Secrétariat Général du MESUPRES (SG)" },
  {
    id: 6,
    title:
      "Rédaction des projets d’arrêté d’équivalence\n(Français et Malagasy)",
  },
  {
    id: 7,
    title:
      "Signature des projets validés par la CNE\npar le Ministre du MESUPRES",
  },
  {
    id: 8,
    title:
      "Demande de numéro des arrêtés d’équivalence,\ndûment signés par le Ministre du MESUPRES, au niveau de la Primature",
  },
  {
    id: 9,
    title:
      "Notification aux Requérants pour les arrêtés octroyés et remise de la version Physique",
  },
];

const dossiersEquivalence = [
  {
    title: "Une demande d'équivalence indiquant :",
    details: [
      "Les coordonnées personnelles : Nom et Prénoms, code postale, contact(s) téléphonique(s) et électronique ;",
      "La date ;",
      "Le motif (inscription dans un établissement de formation, recherche d'emploi, concours, ...) ;",
      "Le(s) diplôme(s) sur lequel doit porter l'équivalence ;",
      "Le récapitulatif des années de formation ;",
      "La demande est adressée à Madame/Monsieur le Ministre de l'Enseignement Supérieur et de la Recherche Scientifique, Président(e) de la Commission Nationale des Équivalences.",
    ],
  },
  {
    title:
      "Photocopie lisible légalisée d'une pièce d'identité du Requérant : Carte d'Identité Nationale ou Passeport.",
  },
  {
    title:
      "Photocopie lisible de l'ensemble des diplômes certifiée par l'Établissement de délivrance ou par le Consulat/Ministère des Affaires Étrangères pour les diplômes étrangers.",
  },
  {
    title:
      "Photocopie lisible de la traduction du/des diplôme(s) effectuée par un Traducteur autorisé ou par les autorités officielles du pays de délivrance (pour les diplômes non en langues Malagasy, Français ou Anglais).",
  },
  {
    title:
      "Photocopie lisible des justificatifs de la durée officielle des études ou relevés de notes délivrée par l'Etablissement (Certifiée par l'Etablissement de délivrance, par le Ministères des Affaires Etrangères ou le Consultat du Pays de délivrance pour diplômes étrangers.)",
  },
  {
    title:
      "Photocopie lisible de la traduction de ces justificatifs/relevés de notes par Traducteur autorisé ou par les autorités officielles du Pays de délivrance(Pour les documents non rédigés en langues Malagasy, Française et Anglaise).",
  },
  {
    title:
      "Mémoire ou Thèse de fin d'études certifiée par l'Établissement de délivrance ou par le Consulat du Pays de délivrance pour les diplômes étrangers.",
  },
  {
    title:
      "Enveloppe non-timbrée au format A4 avec Nom complet, adresse et contact rapide du requérant rédigés sur le dos de l'enveloppe.",
  },
  {
    title:
      "Copie certifiée de l'Arrêté d'Habilitation à demander auprès du Service de la Législation MESUPRES (pour tous les Instituts d'Enseignement Supérieur Privés et Publics de Madagascar).",
  },
  {
    title:
      "Pour les Master: Justificatif du diplôme Master Recherche venant de l'Etablissement.",
  },
];

// --- DONNÉES ACCRÉDITATION ---
const processusAccreditation = [
  {
    id: 1,
    title: "Demande d’accréditation",
    description:
      "L’établissement d’enseignement supérieur (IES) soumet une demande officielle d’accréditation auprès du MESUPRES.",
  },
  {
    id: 2,
    title: "Auto-évaluation (interne)",
    description:
      "L’IES effectue une auto-évaluation selon le référentiel d’accréditation ou de labellisation, en analysant ses domaines de performance et en préparant un rapport d’auto-évaluation.",
  },
  {
    id: 3,
    title: "Traitement préalable par la DAAQ",
    description:
      "La Direction de l’Assurance de l’Assurance Qualité (DAAQ) analyse le rapport d’auto-évaluation soumis par l’IES avant la visite externe.",
  },
  {
    id: 4,
    title: "Évaluation externe par des experts",
    description:
      "Une équipe d’experts indépendants réalise l’évaluation externe sur terrain, examine les documents, rencontre le groupe de pilotage et rédige un rapport d’évaluation externe.",
  },
  {
    id: 5,
    title: "Réunion de la Commission Nationale d’Accréditation (CNA)",
    description:
      "La CNA étudie les rapports d’évaluation externe et prend une décision formelle (positive ou négative) d’accréditation.",
  },
  {
    id: 6,
    title: "Décision de la CNA et communication du résultat",
    description:
      "Le MESUPRES communique la décision officielle à l’IES et publie, le cas échéant, la liste des établissements accrédités.",
  },
];

const objectifsAccreditation = [
  "Accréditer les IES dont les offres de formation sont habilitées.",
  "Engager les procédures d’évaluation suivant les normes et critères fixés par Arrêté ministériel.",
  "Accorder l’accréditation aux IES offrant des formations courtes, de la Licence au Doctorat.",
  "Assurer une amélioration continue de la qualité de l’enseignement supérieur.",
  "Durée de validité de l’accréditation : 5 ans.",
];

// --- COMPOSANT VUE ÉQUIVALENCE (Style Bleu) ---
const EquivalenceView = ({ onBack }) => (
  <div className="w-full max-w-[1100px] mx-auto bg-white border border-slate-200 rounded-xl p-4 sm:p-8 shadow-xl shadow-slate-200/50 animate-fade-in font-sans">
    <div className="mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#0b4b8a] font-semibold text-sm hover:underline"
      >
        <ArrowLeft size={16} /> Retour aux services
      </button>
    </div>
    <header className="mb-5 text-center">
      <h1 className="text-lg sm:text-xl text-[#0b4b8a] tracking-wide uppercase font-bold border-b-2 border-[rgba(11,75,138,0.1)] pb-3">
        Dossiers à fournir pour une demande d'équivalence
      </h1>
    </header>
    <section className="bg-blue-50/50 border-l-4 border-[#0b4b8a] p-4 sm:p-6 rounded-r-lg mb-8">
      <ol className="list-decimal pl-5 space-y-4 text-slate-700 text-sm">
        {dossiersEquivalence.map((item, idx) => (
          <li key={idx} className="pl-2">
            <p className="font-semibold text-[#0b4b8a] mb-1">{item.title}</p>
            {item.details && (
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                {item.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>

    <header className="mb-8 text-center">
      <h1 className="text-lg sm:text-xl text-[#0b4b8a] tracking-wide uppercase font-bold border-b-2 border-[rgba(11,75,138,0.1)] pb-3">
        Circuit de la demande d'équivalence
      </h1>
    </header>

    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-5 rounded-lg border-l-4 border-[#0b4b8a] shadow-sm ring-1 ring-slate-100">
        <h3 className="text-[#063a66] font-bold text-sm mb-2">Remarque :</h3>
        <p className="text-slate-600 text-sm">
          Prise de décision par les membres de la CNE : La décision peut être{" "}
          <strong className="text-slate-900">positive</strong> ou{" "}
          <strong className="text-slate-900">négative</strong>. En cas de
          décision défavorable, le motif du rejet sera communiqué.
        </p>
      </div>
      <div className="bg-white p-5 rounded-lg border-l-4 border-[#0b4b8a] shadow-sm ring-1 ring-slate-100">
        <h3 className="text-[#063a66] font-bold text-sm mb-2">
          Types de demande :
        </h3>
        <ul className="list-disc pl-4 text-slate-600 text-sm space-y-1">
          <li>
            <strong>Diplômes nationaux :</strong> Arrêtés nominatifs (Privé) ou
            non (Public).
          </li>
          <li>
            <strong>Diplômes étrangers :</strong> Dépend du pays et de
            l'établissement.
          </li>
        </ul>
      </div>
    </section>

    {/* WORKFLOW RESPONSIVE */}
    {/* On utilise un gap fixe de 2rem (32px) sur md pour que les calculs CSS soient justes */}
    <div className="flex flex-col gap-10 md:gap-16 pb-10">
      
      {/* LIGNE 1 : Étapes 1, 2, 3 */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-8">
        {stepsEquivalence.slice(0, 3).map((step, index) => (
          <div key={step.id} className="relative group h-full">
            <div className="bg-white border border-blue-100 p-4 rounded-lg shadow-sm h-full flex gap-3 hover:border-blue-300 transition-colors z-20 relative">
              <div className="bg-[#0b4b8a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                {step.id}
              </div>
              <span className="text-slate-700 text-sm leading-relaxed">
                {step.title}
              </span>
            </div>
            
            {/* Flèche Droite Classique (Entre 1-2 et 2-3) */}
            {index < 2 && (
              <div className="hidden md:block absolute top-1/2 -right-10 w-12 h-0.5 bg-blue-200 transform -translate-y-1/2 z-0 after:content-[''] after:absolute after:-right-1 after:-top-1 after:border-t-4 after:border-t-transparent after:border-b-4 after:border-b-transparent after:border-l-4 after:border-l-blue-200" />
            )}
            
            {/* Flèche Verticale Mobile */}
            <div className="md:hidden absolute -bottom-8 left-1/2 w-0.5 h-8 bg-blue-200 transform -translate-x-1/2 z-0 after:content-[''] after:absolute after:-left-1 after:bottom-0 after:border-l-4 after:border-l-transparent after:border-r-4 after:border-r-transparent after:border-t-4 after:border-t-blue-200" />
            
            {/* --- LIAISON 3 -> 4 (RETOUR LIGNE CALCULÉ) --- */}
            {index === 2 && (
               // Ce conteneur "Bracket" part du centre du 3 et va au centre du 4
               // Largeur = 2 cartes (200%) + 2 gaps (4rem si gap-8)
               <div className="hidden md:block absolute top-full right-1/2 w-[calc(200%+4rem)] h-12 pointer-events-none z-0">
                  {/* Bordure Droite (Descend du 3) */}
                  <div className="absolute top-0 right-0 h-full w-0.5 bg-blue-200 rounded-t-sm"></div>
                  
                  {/* Bordure Bas (Traverse vers la gauche) */}
                  <div className="absolute bottom-0 right-0 w-full h-0.5 bg-blue-200 rounded-bl-xl rounded-br-xl"></div>
                  
                  {/* Bordure Gauche (Descend vers le 4) */}
                  <div className="absolute top-full left-0 h-4 w-0.5 bg-blue-200"></div>

                  {/* Pointe de flèche (Sur le 4) */}
                  <div className="absolute -bottom-4 -left-1.5 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[8px] border-t-blue-200"></div>
               </div>
            )}
          </div>
        ))}
      </div>

      {/* LIGNE 2 : Étapes 4, 5, 6 */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-8 pt-4 md:pt-0">
        {stepsEquivalence.slice(3, 6).map((step, index) => (
          <div key={step.id} className="relative group h-full">
            <div className="bg-white border border-blue-100 p-4 rounded-lg shadow-sm h-full flex gap-3 hover:border-blue-300 transition-colors z-20 relative">
              <div className="bg-[#0b4b8a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                {step.id}
              </div>
              <span className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {step.title}
              </span>
            </div>

             {/* Flèche Droite (Entre 4-5 et 5-6) */}
            {index < 2 && (
              <div className="hidden md:block absolute top-1/2 -right-10 w-12 h-0.5 bg-blue-200 transform -translate-y-1/2 z-0 after:content-[''] after:absolute after:-right-1 after:-top-1 after:border-t-4 after:border-t-transparent after:border-b-4 after:border-b-transparent after:border-l-4 after:border-l-blue-200" />
            )}
             {/* Flèche Verticale Mobile */}
            <div className="md:hidden absolute -bottom-8 left-1/2 w-0.5 h-8 bg-blue-200 transform -translate-x-1/2 z-0 after:content-[''] after:absolute after:-left-1 after:bottom-0 after:border-l-4 after:border-l-transparent after:border-r-4 after:border-r-transparent after:border-t-4 after:border-t-blue-200" />
            
             {/* --- LIAISON 6 -> 7 (RETOUR LIGNE CALCULÉ) --- */}
             {index === 2 && (
               <div className="hidden md:block absolute top-full right-1/2 w-[calc(200%+4rem)] h-12 pointer-events-none z-0">
                  <div className="absolute top-0 right-0 h-full w-0.5 bg-blue-200 rounded-t-sm"></div>
                  <div className="absolute bottom-0 right-0 w-full h-0.5 bg-blue-200 rounded-bl-xl rounded-br-xl"></div>
                  <div className="absolute top-full left-0 h-4 w-0.5 bg-blue-200"></div>
                  <div className="absolute -bottom-4 -left-1.5 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[8px] border-t-blue-200"></div>
               </div>
            )}
          </div>
        ))}
      </div>

      {/* LIGNE 3 : Étapes 7, 8, 9 */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-8 pt-4 md:pt-0">
        {stepsEquivalence.slice(6, 9).map((step, index) => (
          <div key={step.id} className="relative group h-full">
            <div className="bg-white border border-blue-100 p-4 rounded-lg shadow-sm h-full flex gap-3 hover:border-blue-300 transition-colors z-20 relative">
              <div className="bg-[#0b4b8a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                {step.id}
              </div>
              <span className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {step.title}
              </span>
            </div>
             {/* Flèche Droite (Entre 7-8 et 8-9) */}
            {index < 2 && (
              <div className="hidden md:block absolute top-1/2 -right-10 w-12 h-0.5 bg-blue-200 transform -translate-y-1/2 z-0 after:content-[''] after:absolute after:-right-1 after:-top-1 after:border-t-4 after:border-t-transparent after:border-b-4 after:border-b-transparent after:border-l-4 after:border-l-blue-200" />
            )}
            
            {/* Flèche Verticale Mobile (Sauf le dernier) */}
            {index < 2 && (
              <div className="md:hidden absolute -bottom-8 left-1/2 w-0.5 h-8 bg-blue-200 transform -translate-x-1/2 z-0 after:content-[''] after:absolute after:-left-1 after:bottom-0 after:border-l-4 after:border-l-transparent after:border-r-4 after:border-r-transparent after:border-t-4 after:border-t-blue-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- COMPOSANT VUE ACCRÉDITATION (Style Vert) ---
const AccreditationView = ({ onBack }) => (
  <div className="w-full max-w-[1100px] mx-auto bg-white border border-slate-200 rounded-xl p-4 sm:p-8 shadow-xl shadow-slate-200/50 animate-fade-in font-sans">
    {/* Bouton Retour */}
    <div className="mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#067a50] font-semibold text-sm hover:underline"
      >
        <ArrowLeft size={16} /> Retour aux services
      </button>
    </div>

    {/* Section 1 : Mécanisme */}
    <header className="mb-5 text-center">
      <h1 className="text-lg sm:text-xl text-[#067a50] tracking-wide uppercase font-bold border-b-2 border-[rgba(6,122,80,0.1)] pb-3">
        Mécanisme d'accréditation et de labellisation
      </h1>
    </header>

    <section className="bg-emerald-50/30 border border-emerald-100 rounded-lg p-6 mb-8">
      <h3 className="text-[#067a50] text-base border-l-4 border-[#067a50] pl-3 font-bold mb-4">
        Objectifs
      </h3>
      <ul className="list-disc pl-5 text-slate-700 text-sm space-y-2 mb-4">
        {objectifsAccreditation.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <p className="text-sm text-slate-600">
        <strong className="text-[#067a50]">Portée :</strong> amélioration
        continue de la qualité des établissements d’enseignement supérieur (IES).
      </p>
    </section>

    {/* Section 2 : Processus */}
    <header className="mb-8 text-center">
      <h1 className="text-lg sm:text-xl text-[#067a50] tracking-wide uppercase font-bold border-b-2 border-[rgba(6,122,80,0.1)] pb-3">
        Procédure d'évaluation pour l'accréditation
      </h1>
    </header>

    <div className="flex flex-col gap-10 md:gap-16 pb-10">
      {/* LIGNE 1 : Étapes 1, 2, 3 */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-8">
        {processusAccreditation.slice(0, 3).map((step, index) => (
          <div key={step.id} className="relative group h-full">
            <div className="bg-white border border-emerald-100 p-4 rounded-lg shadow-sm h-full flex gap-3 hover:border-emerald-300 transition-colors z-20 relative">
              <div className="bg-[#067a50] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                {step.id}
              </div>
              <div className="text-slate-700 text-sm leading-relaxed">
                <strong className="block text-slate-900 mb-1">
                  {step.title}
                </strong>
                {step.description}
              </div>
            </div>

            {/* Flèche Droite Desktop */}
            {index < 2 && (
              <div className="hidden md:block absolute top-1/2 -right-10 w-12 h-0.5 bg-emerald-200 transform -translate-y-1/2 z-0 after:content-[''] after:absolute after:-right-1 after:-top-1 after:border-t-4 after:border-t-transparent after:border-b-4 after:border-b-transparent after:border-l-4 after:border-l-emerald-200" />
            )}

            {/* Flèche Verticale Mobile */}
            <div className="md:hidden absolute -bottom-8 left-1/2 w-0.5 h-8 bg-emerald-200 transform -translate-x-1/2 z-0 after:content-[''] after:absolute after:-left-1 after:bottom-0 after:border-l-4 after:border-l-transparent after:border-r-4 after:border-r-transparent after:border-t-4 after:border-t-emerald-200" />

            {/* --- LIAISON 3 -> 4 (RETOUR LIGNE CALCULÉ) --- */}
            {index === 2 && (
               <div className="hidden md:block absolute top-full right-1/2 w-[calc(200%+4rem)] h-12 pointer-events-none z-0">
                  <div className="absolute top-0 right-0 h-full w-0.5 bg-emerald-200 rounded-t-sm"></div>
                  <div className="absolute bottom-0 right-0 w-full h-0.5 bg-emerald-200 rounded-bl-xl rounded-br-xl"></div>
                  <div className="absolute top-full left-0 h-4 w-0.5 bg-emerald-200"></div>
                  <div className="absolute -bottom-4 -left-1.5 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[8px] border-t-emerald-200"></div>
               </div>
            )}
          </div>
        ))}
      </div>

      {/* LIGNE 2 : Étapes 4, 5, 6 */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-8 pt-4 md:pt-0">
        {processusAccreditation.slice(3, 6).map((step, index) => (
          <div key={step.id} className="relative group h-full">
            <div className="bg-white border border-emerald-100 p-4 rounded-lg shadow-sm h-full flex gap-3 hover:border-emerald-300 transition-colors z-20 relative">
              <div className="bg-[#067a50] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                {step.id}
              </div>
              <div className="text-slate-700 text-sm leading-relaxed">
                <strong className="block text-slate-900 mb-1">
                  {step.title}
                </strong>
                {step.description}
              </div>
            </div>

            {/* Flèche Droite Desktop */}
            {index < 2 && (
              <div className="hidden md:block absolute top-1/2 -right-10 w-12 h-0.5 bg-emerald-200 transform -translate-y-1/2 z-0 after:content-[''] after:absolute after:-right-1 after:-top-1 after:border-t-4 after:border-t-transparent after:border-b-4 after:border-b-transparent after:border-l-4 after:border-l-emerald-200" />
            )}

            {/* Flèche Verticale Mobile */}
            {index < 2 && (
              <div className="md:hidden absolute -bottom-8 left-1/2 w-0.5 h-8 bg-emerald-200 transform -translate-x-1/2 z-0 after:content-[''] after:absolute after:-left-1 after:bottom-0 after:border-l-4 after:border-l-transparent after:border-r-4 after:border-r-transparent after:border-t-4 after:border-t-emerald-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- COMPOSANT PRINCIPAL SERVICES ---
const servicesList = [
  {
    id: "accreditation",
    title: "Accréditation & Évaluation",
    subtitle: "Service SAE",
    shortDesc:
      "Certification des établissements et des programmes selon les standards nationaux.",
    icon: <BadgeCheck size={32} />,
    color: "bg-blue-600",
    lightColor: "bg-blue-50 text-blue-600",
    features: [
      "Habilitation LMD",
      "Accréditation Universités",
      "Labels d'Excellence",
    ],
  },
  {
    id: "equivalence",
    title: "Équivalence de Diplômes",
    subtitle: "Service Équivalences",
    shortDesc:
      "Traitement des demandes d'équivalence pour les diplômes nationaux et étrangers.",
    icon: <ClipboardList size={32} />,
    color: "bg-indigo-600",
    lightColor: "bg-indigo-50 text-indigo-600",
    features: [
      "Traitement des dossiers",
      "Commission CNE",
      "Arrêtés officiels",
    ],
  },
];

const Services = () => {
  const [activeView, setActiveView] = useState("home");

  useEffect(() => {
    if (activeView !== "home") {
      const element = document.getElementById("services");
      if (element)
        element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeView]);

  return (
    <section
      id="services"
      className="relative py-24 bg-white overflow-hidden min-h-screen"
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#4f46e5 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* VUE ACCUEIL */}
        {activeView === "home" && (
          <div className="animate-fade-in">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4">
                <ShieldCheck size={14} />{" "}
                <span>Nos Domaines d'Intervention</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                Piliers de l'Excellence Académique
              </h2>
              <p className="text-lg text-slate-600">
                Sélectionnez un service pour accéder aux procédures.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
              {servicesList.map((service) => (
                <div
                  key={service.id}
                  className="group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-1 ${service.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                  ></div>
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`p-4 rounded-2xl ${service.lightColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      {service.icon}
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wide">
                      {service.subtitle}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                    {service.shortDesc}
                  </p>
                  <ul className="space-y-2 mb-8">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <CheckCircle2
                          size={16}
                          className="text-green-500 shrink-0 mt-0.5"
                        />{" "}
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setActiveView(service.id)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-100 text-slate-700 font-semibold hover:border-indigo-600 hover:text-indigo-600 transition-all group-hover:bg-indigo-50"
                  >
                    En savoir plus <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VUE ÉQUIVALENCE */}
        {activeView === "equivalence" && (
          <EquivalenceView onBack={() => setActiveView("home")} />
        )}

        {/* VUE ACCRÉDITATION */}
        {activeView === "accreditation" && (
          <AccreditationView onBack={() => setActiveView("home")} />
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Services;
