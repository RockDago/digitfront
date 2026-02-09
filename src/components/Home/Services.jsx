import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ClipboardList,
  CheckCircle2,
  ArrowRight,
  BadgeCheck,
  ArrowLeft,
  Search,
  School,
  FileCheck,
  FileSearch,
} from "lucide-react";

// --- DONNÉES ÉQUIVALENCE ---
const stepsEquivalence = [
  { id: 1, title: "Dépôt des dossiers en ligne pour demande d'équivalence" },
  { id: 2, title: "Traitement des dossiers :\nCritères d'éligibilité" },
  { id: 3, title: "Dépôt des dossiers Physique pour demande d'équivalence" },
  {
    id: 4,
    title:
      "Étude des dossiers au niveau de la Commission Nationale d'Équivalences (CNE)\n(Membres : DAAQ • DGES • DGRS • DES • DRI • DRSE)",
  },
  { id: 5, title: "Lecture au niveau du Secrétariat Général du MESUPRES (SG)" },
  {
    id: 6,
    title:
      "Rédaction des projets d'arrêté d'équivalence\n(Français et Malagasy)",
  },
  {
    id: 7,
    title:
      "Signature des projets validés par la CNE\npar le Ministre du MESUPRES",
  },
  {
    id: 8,
    title:
      "Demande de numéro des arrêtés d'équivalence,\ndûment signés par le Ministre du MESUPRES, au niveau de la Primature",
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
    title: "Demande d'accréditation",
    description:
      "L'établissement d'enseignement supérieur (IES) soumet une demande officielle d'accréditation auprès du MESUPRES.",
  },
  {
    id: 2,
    title: "Auto-évaluation (interne)",
    description:
      "L'IES effectue une auto-évaluation selon le référentiel d'accréditation ou de labellisation, en analysant ses domaines de performance et en préparant un rapport d'auto-évaluation.",
  },
  {
    id: 3,
    title: "Traitement préalable par la DAAQ",
    description:
      "La Direction de l'Assurance de l'Assurance Qualité (DAAQ) analyse le rapport d'auto-évaluation soumis par l'IES avant la visite externe.",
  },
  {
    id: 4,
    title: "Évaluation externe par des experts",
    description:
      "Une équipe d'experts indépendants réalise l'évaluation externe sur terrain, examine les documents, rencontre le groupe de pilotage et rédige un rapport d'évaluation externe.",
  },
  {
    id: 5,
    title: "Réunion de la Commission Nationale d'Accréditation (CNA)",
    description:
      "La CNA étudie les rapports d'évaluation externe et prend une décision formelle (positive ou négative) d'accréditation.",
  },
  {
    id: 6,
    title: "Décision de la CNA et communication du résultat",
    description:
      "Le MESUPRES communique la décision officielle à l'IES et publie, le cas échéant, la liste des établissements accrédités.",
  },
];

const objectifsAccreditation = [
  "Accréditer les IES dont les offres de formation sont habilitées.",
  "Engager les procédures d'évaluation suivant les normes et critères fixés par Arrêté ministériel.",
  "Accorder l'accréditation aux IES offrant des formations courtes, de la Licence au Doctorat.",
  "Assurer une amélioration continue de la qualité de l'enseignement supérieur.",
  "Durée de validité de l'accréditation : 5 ans.",
];

// --- DONNÉES SICP (VISUEL) ---
const missionsSicp = [
  {
    title: "Contrôle de Qualité",
    description:
      "Programmation et réalisation des descentes de contrôle après habilitation.",
    icon: <Search size={24} className="text-amber-600" />,
  },
  {
    title: "Vérification Institutionnelle",
    description: "Audit du fonctionnement, organisation et infrastructures.",
    icon: <School size={24} className="text-amber-600" />,
  },
  {
    title: "Conseil & Études",
    description: "Accompagnement des responsables et études systémiques.",
    icon: <FileSearch size={24} className="text-amber-600" />,
  },
  {
    title: "Collecte de Données",
    description: "Centralisation des listes d'étudiants et d'enseignants.",
    icon: <ClipboardList size={24} className="text-amber-600" />,
  },
];

// --- COMPOSANT INTERNE : VUE ÉQUIVALENCE ---
const EquivalenceContent = () => (
  <div className="animate-fade-in pb-8">
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

    {/* WORKFLOW */}
    <div className="flex flex-col gap-10 md:gap-16 pb-2">
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
            {index < 2 && (
              <div className="hidden md:block absolute top-1/2 -right-10 w-12 h-0.5 bg-blue-200 transform -translate-y-1/2 z-0 after:content-[''] after:absolute after:-right-1 after:-top-1 after:border-t-4 after:border-t-transparent after:border-b-4 after:border-b-transparent after:border-l-4 after:border-l-blue-200" />
            )}
            <div className="md:hidden absolute -bottom-8 left-1/2 w-0.5 h-8 bg-blue-200 transform -translate-x-1/2 z-0 after:content-[''] after:absolute after:-left-1 after:bottom-0 after:border-l-4 after:border-l-transparent after:border-r-4 after:border-r-transparent after:border-t-4 after:border-t-blue-200" />
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
            {index < 2 && (
              <div className="hidden md:block absolute top-1/2 -right-10 w-12 h-0.5 bg-blue-200 transform -translate-y-1/2 z-0 after:content-[''] after:absolute after:-right-1 after:-top-1 after:border-t-4 after:border-t-transparent after:border-b-4 after:border-b-transparent after:border-l-4 after:border-l-blue-200" />
            )}
            <div className="md:hidden absolute -bottom-8 left-1/2 w-0.5 h-8 bg-blue-200 transform -translate-x-1/2 z-0 after:content-[''] after:absolute after:-left-1 after:bottom-0 after:border-l-4 after:border-l-transparent after:border-r-4 after:border-r-transparent after:border-t-4 after:border-t-blue-200" />
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
            {index < 2 && (
              <div className="hidden md:block absolute top-1/2 -right-10 w-12 h-0.5 bg-blue-200 transform -translate-y-1/2 z-0 after:content-[''] after:absolute after:-right-1 after:-top-1 after:border-t-4 after:border-t-transparent after:border-b-4 after:border-b-transparent after:border-l-4 after:border-l-blue-200" />
            )}
            {index < 2 && (
              <div className="md:hidden absolute -bottom-8 left-1/2 w-0.5 h-8 bg-blue-200 transform -translate-x-1/2 z-0 after:content-[''] after:absolute after:-left-1 after:bottom-0 after:border-l-4 after:border-l-transparent after:border-r-4 after:border-r-transparent after:border-t-4 after:border-t-blue-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- COMPOSANT INTERNE : VUE ACCRÉDITATION ---
const AccreditationContent = () => (
  <div className="animate-fade-in pb-8">
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
        continue de la qualité des établissements d'enseignement supérieur
        (IES).
      </p>
    </section>

    <header className="mb-8 text-center">
      <h1 className="text-lg sm:text-xl text-[#067a50] tracking-wide uppercase font-bold border-b-2 border-[rgba(6,122,80,0.1)] pb-3">
        Procédure d'évaluation pour l'accréditation
      </h1>
    </header>

    <div className="flex flex-col gap-10 md:gap-16 pb-2">
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
            {index < 2 && (
              <div className="hidden md:block absolute top-1/2 -right-10 w-12 h-0.5 bg-emerald-200 transform -translate-y-1/2 z-0 after:content-[''] after:absolute after:-right-1 after:-top-1 after:border-t-4 after:border-t-transparent after:border-b-4 after:border-b-transparent after:border-l-4 after:border-l-emerald-200" />
            )}
            <div className="md:hidden absolute -bottom-8 left-1/2 w-0.5 h-8 bg-emerald-200 transform -translate-x-1/2 z-0 after:content-[''] after:absolute after:-left-1 after:bottom-0 after:border-l-4 after:border-l-transparent after:border-r-4 after:border-r-transparent after:border-t-4 after:border-t-emerald-200" />
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
            {index < 2 && (
              <div className="hidden md:block absolute top-1/2 -right-10 w-12 h-0.5 bg-emerald-200 transform -translate-y-1/2 z-0 after:content-[''] after:absolute after:-right-1 after:-top-1 after:border-t-4 after:border-t-transparent after:border-b-4 after:border-b-transparent after:border-l-4 after:border-l-emerald-200" />
            )}
            {index < 2 && (
              <div className="md:hidden absolute -bottom-8 left-1/2 w-0.5 h-8 bg-emerald-200 transform -translate-x-1/2 z-0 after:content-[''] after:absolute after:-left-1 after:bottom-0 after:border-l-4 after:border-l-transparent after:border-r-4 after:border-r-transparent after:border-t-4 after:border-t-emerald-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- COMPOSANT VUE SICP (Position Bouton Haut) ---
const SicpView = ({ onBack }) => (
  <div className="w-full max-w-[1200px] mx-auto bg-white border border-slate-200 rounded-xl p-4 sm:p-8 shadow-xl shadow-slate-200/50 animate-fade-in font-sans">
    {/* HEADER AVEC BOUTON RETOUR */}
    <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 font-semibold text-sm hover:text-slate-900 transition-colors group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Retour aux services
      </button>
      <div className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider">
        Service SICP
      </div>
    </div>

    {/* CONTENU */}
    <div>
      <header className="mb-10 text-center max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl text-slate-900 font-bold mb-6">
          Service d'Inspection et de Contrôle de Performance (SICP)
        </h1>

        <div className="space-y-6 text-slate-700 leading-relaxed text-left bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
          <p>
            Le Service d'Inspection et de Contrôle de Performance (SICP) a pour
            mission de programmer et de réaliser les descentes de contrôle de
            qualité des Institutions d'Enseignement Supérieur (IES) publiques et
            privées après habilitation et accréditation. Il vérifie le
            fonctionnement, l'organisation ainsi que les infrastructures des
            établissements, et élabore les rapports de contrôle de qualité
            correspondants.
          </p>
          <p>
            Le SICP conseille les responsables d'établissement et conduit toute
            étude ou réflexion relative aux structures et au fonctionnement du
            système d'enseignement supérieur. Il assure également la collecte
            des informations institutionnelles, notamment les listes des
            étudiants et des enseignants.
          </p>
          <p>
            En collaboration avec le service d'Accréditation et des
            Équivalences, il participe à la vérification de l'éligibilité des
            demandes d'accréditation, accompagne les IES candidates dans la
            finalisation de leur auto-évaluation et contribue, avec la
            Direction, à l'organisation des sessions de la Commission nationale
            d'Accréditation et des Équivalences.
          </p>
        </div>
      </header>

      {/* GRID ICONES VISUELS */}
      <div className="grid md:grid-cols-2 gap-8">
        {missionsSicp.map((mission, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg shadow-sm shrink-0">
                {mission.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {mission.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {mission.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- COMPOSANT VUE SAE (Position Bouton Haut) ---
const SaeView = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("accreditation");

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-white border border-slate-200 rounded-xl p-4 sm:p-8 shadow-xl shadow-slate-200/50 animate-fade-in font-sans">
      {/* HEADER AVEC BOUTON RETOUR */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 font-semibold text-sm hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Retour aux services
        </button>
        <div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
          Service SAE
        </div>
      </div>

      {/* Navigation Interne Onglets */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab("accreditation")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-t-lg transition-all border-b-2 ${
            activeTab === "accreditation"
              ? "border-emerald-600 text-emerald-700 bg-emerald-50/50 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium"
          }`}
        >
          <BadgeCheck size={20} />
          Accréditation & Qualité
        </button>
        <button
          onClick={() => setActiveTab("equivalence")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-t-lg transition-all border-b-2 ${
            activeTab === "equivalence"
              ? "border-blue-600 text-blue-700 bg-blue-50/50 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium"
          }`}
        >
          <ClipboardList size={20} />
          Équivalence de Diplômes
        </button>
      </div>

      {/* Contenu Dynamique */}
      <div>
        {activeTab === "accreditation" && <AccreditationContent />}
        {activeTab === "equivalence" && <EquivalenceContent />}
      </div>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL SERVICES ---
const servicesList = [
  {
    id: "sae",
    title: "Service de l'Accréditation et des Equivalences",
    subtitle: "SAE",
    shortDesc:
      "Gestion centralisée de l'accréditation des établissements, des offres de formation et des demandes d'équivalence de diplômes.",
    icon: <School size={32} />,
    color: "bg-blue-600",
    lightColor: "bg-blue-50 text-blue-600",
    features: [
      "Accréditation Institutionnelle",
      "Équivalences Nationales/Étrangères",
    ],
    isEmpty: false,
  },
  {
    id: "sicp",
    title: "Service d'Inspection et de Contrôle de Performance",
    subtitle: "SICP",
    shortDesc:
      "Suivi, contrôle et inspection administrative et pédagogique des Institutions d'Enseignement Supérieur.",
    icon: <Search size={32} />,
    color: "bg-amber-600",
    lightColor: "bg-amber-50 text-amber-600",
    features: [
      "Contrôle de qualité",
      "Suivi des infrastructures",
      "Collecte de données institutionnelles",
    ],
    isEmpty: false,
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
                Services de la DAAQ
              </h2>
              <p className="text-lg text-slate-600">
                Piliers de l'assurance qualité et de la régulation académique.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
              {servicesList.map((service) => (
                <div
                  key={service.id}
                  className={`group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-200 transition-all duration-300 flex flex-col h-full
                    ${
                      service.isEmpty
                        ? "opacity-80 hover:opacity-100 bg-slate-50/50"
                        : "hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1"
                    }`}
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-1 ${service.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                  ></div>
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`p-4 rounded-2xl ${
                        service.lightColor
                      } transition-transform duration-300 ${
                        !service.isEmpty && "group-hover:scale-110"
                      }`}
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
                  <p className="text-slate-600 mb-6 leading-relaxed flex-grow text-sm sm:text-base">
                    {service.shortDesc}
                  </p>

                  {!service.isEmpty ? (
                    <>
                      <ul className="space-y-2 mb-8">
                        {service.features.map((feature, i) => (
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
                        Accéder au service <ArrowRight size={18} />
                      </button>
                    </>
                  ) : (
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-400 italic flex items-center gap-2">
                        <FileCheck size={14} /> Information administrative
                        uniquement
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VUE SAE (Combinée) */}
        {activeView === "sae" && (
          <SaeView onBack={() => setActiveView("home")} />
        )}

        {/* VUE SICP */}
        {activeView === "sicp" && (
          <SicpView onBack={() => setActiveView("home")} />
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
