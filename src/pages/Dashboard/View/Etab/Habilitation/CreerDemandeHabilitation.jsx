import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const typesDemandes = [
  {
    id: "licence",
    title: "Habilitation Licence",
    color: "blue",
    fullTitle:
      "Demande d'habilitation des formations conduisant au grade de Licence",
    path: "/dashboard/etablissement/habilitation/formulaire/licence",
  },
  {
    id: "master",
    title: "Habilitation Master",
    color: "indigo",
    fullTitle:
      "Demande d'habilitation des formations conduisant au grade de Master",
    path: "/dashboard/etablissement/habilitation/formulaire/master",
  },
  {
    id: "doctorat",
    title: "Habilitation Doctorat",
    color: "purple",
    fullTitle:
      "Demande d'habilitation des formations conduisant au grade de Doctorat",
    path: "/dashboard/etablissement/habilitation/formulaire/doctorat",
  },
];

// Canevas pour la Licence
const canevasLicence = {
  introduction: `Ce canevas constitue une trame minimale que chaque établissement d'enseignement supérieur doit renseigner dans le cadre d'une demande d'habilitation de formation :
  • Il précise les informations essentielles attendues et les justificatifs à fournir.
  • L'examen des dossiers par la Commission nationale d'habilitation (CNH) se fera sur la base des éléments présentés, mais la pertinence des demandes dépendra avant tout de la qualité et de l'authenticité des preuves fournies.
  • Les établissements sont donc invités à préparer leurs dossiers avec rigueur, transparence et esprit de responsabilité, afin de garantir la crédibilité et la qualité de l'offre de formation proposée.`,

  structure: `La structure du cahier de charges suit une logique en huit blocs complémentaires :
  
  1) Informations institutionnelles : éléments de recevabilité et documents fondateurs.
  Ce bloc rassemble les éléments juridiques et organisationnels qui attestent de la recevabilité du dossier et de l'existence d'une gouvernance académique claire.
  
  2) Pertinence et justification de l'offre de formation : diagnostic et opportunité de la formation.
  Ce bloc permet de vérifier la pertinence de la formation proposée au regard des besoins nationaux et régionaux, ainsi que la cohérence de son ouverture avec l'existant.
  
  3) Ressources humaines : compétences et qualifications des enseignants.
  Ce bloc évalue la disponibilité, les qualifications et l'adéquation des enseignants et encadrants, ainsi que la pertinence des partenariats académiques et professionnels.
  
  4) Ressources matérielles et infrastructures : capacités d'accueil et équipements.
  Ce bloc vérifie la capacité d'accueil de l'établissement et la qualité des infrastructures physiques, numériques et logistiques mises à disposition des étudiants.
  
  5) Dispositif pédagogique et maquette (conformité LMD) : organisation académique et progression des études.
  Ce bloc examine l'organisation académique de la formation pour s'assurer qu'elle respecte les principes du système LMD, en termes de crédits, d'unités d'enseignement, de progression et de passerelles.
  
  6) Système d'évaluation des apprentissages : modalités, règlements et traçabilité.
  Ce bloc analyse la diversité, la validité et la traçabilité des modalités d'évaluation mises en place pour certifier les acquis des étudiants.
  
  7) Performances académiques et insertion professionnelle : résultats et insertion professionnelle.
  Ce bloc permet d'apprécier les performances académiques de la formation et le niveau d'insertion professionnelle des diplômés, à travers les taux de réussite, de diplômation et d'employabilité, ainsi que l'existence de dispositifs de suivi et d'actions correctives.
  
  8) Gouvernance et assurance qualité : pilotage et dispositifs d'amélioration continue.
  Ce bloc évalue l'existence d'une stratégie institutionnelle, d'une cellule interne d'assurance qualité et de mécanismes de suivi-évaluation visant l'amélioration continue des formations.
  
  Cette organisation permet d'évaluer de manière cohérente et progressive la capacité d'un établissement à proposer une formation pertinente, conforme au système LMD et soutenable dans la durée.`,

  sections: [
    {
      title: "I. PRÉSENTATION DE L'INSTITUTION",
      content: `1.1 Informations institutionnelles
      • Nom et coordonnées de l'institution :
      • Statut juridique (arrêtés d'ouverture)
      • Nom et Prénoms du responsable de l'institution :
      • Organigramme et instance de gouvernance
      • Mission et vision de l'institution
      • Plan de développement opérationnel de l'institution
      • Date d'approbation du dossier par les instances compétentes de l'institution :`,

      tables: [
        {
          headers: ["Critère", "Justificatifs requis"],
          rows: [
            [
              "Demande officielle signée par les instances de l'institutions",
              "Lettre officielle signée",
            ],
            [
              "Cahier de charges institutionnel",
              "Arrêté de création, règlements pédagogiques internes, statuts et organigramme",
            ],
            [
              "Dispositif de gouvernance académique",
              "Organigramme, PV de conseils, existence d'une cellule assurance qualité",
            ],
          ],
        },
        {
          title: "1.2.1 Domaines et grades",
          description:
            "Donner les grades proposés pour chaque domaine sous forme d'un tableau (les Six domaines sont : Sciences et Technologies (ST) ; Arts, Lettres et Sciences humaines (ALSH); Sciences de l'éducation (SEd); Sciences de l'ingénieur (SI); Sciences de la Santé (SSa) ; Sciences de la Société (SSo).) Ce tableau doit contenir : Les noms des responsables des grades / domaines ainsi que leurs coordonnées (adresse, e-mail, téléphone)",
          headers: ["Domaines", "Grades proposés", "Noms des responsables"],
          rows: [
            ["ST", "L", ""],
            ["ST", "M", ""],
            ["ALSH", "L", ""],
            ["Sed", "L", ""],
            ["Sed", "M", ""],
            ["SI", "L", ""],
            ["SI", "M", ""],
          ],
        },
        {
          title: "1.2.2 – Mentions",
          description:
            "Préciser les mentions proposées sous forme d'un tableau qui doit préciser les éléments ci-après : Intitulé de chaque mention*, Domaine et grade de rattachement, Etablissement de rattachement, Nom du responsable de chaque mention ainsi que ses coordonnées (adresse, e-mail, téléphone)",
          headers: ["Domaines", "Grades", "Mentions", "Noms des responsables"],
          rows: [
            ["ST", "L", "", ""],
            ["ST", "L", "", ""],
            ["ST", "L", "", ""],
            ["ST", "M", "", ""],
            ["ST", "M", "", ""],
            ["ALSH", "L", "", ""],
            ["ALSH", "L", "", ""],
            ["Sed", "L", "", ""],
            ["Sed", "M", "", ""],
            ["SI", "L", "", ""],
            ["SI", "L", "", ""],
            ["SI", "M", "", ""],
            ["SI", "M", "", ""],
            ["SI", "M", "", ""],
          ],
        },
        {
          title: "1.3.1 Enseignants permanents",
          headers: [
            "Nom, Prénom",
            "Diplôme",
            "Grade",
            "Spécialité",
            "Mention de Rattachement(1)",
            "Type d'intervention (2)",
          ],
          rows: [["", "", "", "", "", ""]],
        },
        {
          title: "1.3.2 Enseignants vacataires",
          headers: [
            "Nom, Prénom",
            "Diplôme",
            "Grade",
            "Spécialité",
            "Mention de Rattachement(1)",
            "Type d'intervention (2)",
          ],
          rows: [["", "", "", "", "", ""]],
        },
        {
          title:
            "1.3.3 Personnel administratif et technique (techniciens, bibliothécaires, maintenance)",
          headers: ["Fonction", "Effectif", "Affectation / Preuves"],
          rows: [["", "", ""]],
        },
        {
          title: "1.4.1 Salles de cours",
          headers: [
            "Capacité (places)",
            "Nombre",
            "Équipement (Video projecteure(VP), tableau, etc.)",
            "Preuves (photos, inventaire)",
          ],
          rows: [
            ["0–20", "", "", ""],
            ["20–50", "", "", ""],
            ["50–100", "", "", ""],
            ["100–300", "", "", ""],
            [">300", "", "", ""],
          ],
        },
        {
          title: "1.4.2 Laboratoires pédagogiques / équipements",
          headers: [
            "N°",
            "Désignation de l'équipement",
            "Nombre",
            "Preuves/État",
          ],
          rows: [
            ["1", "", "", ""],
            ["2", "", "", ""],
            ["3", "", "", ""],
            ["4", "", "", ""],
            ["5", "", "", ""],
          ],
        },
        {
          title: "1.4.3 Bibliothèque et documentation",
          headers: ["Fonds/documentation", "Capacité (places)", "Preuves"],
          rows: [["", "", ""]],
        },
        {
          title: "1.4.4 Infrastructures numériques & hygiène/sécurité",
          headers: ["Item", "Disponibilité", "Standard attendu", "Preuves"],
          rows: [
            [
              "Salle informatique",
              "",
              "Postes fonctionnels ; logiciels requis",
              "",
            ],
            [
              "Connectivité Internet",
              "",
              "≥ 1 Mbps/étudiant (ou justification contextuelle)",
              "",
            ],
            ["LMS (ex. Moodle)", "", "Accès opérationnel", ""],
            [
              "Sanitaires / issues de secours",
              "",
              "Conformes, signalétique",
              "",
            ],
            [
              "Énergie / solution alternative",
              "",
              "Stabilité ou solution de secours",
              "",
            ],
          ],
        },
        {
          title: "1.5 Statistiques institutionnelles actuelles",
          headers: [
            "Domaine",
            "Mention",
            "Parcours",
            "Étudiants inscrits",
            "Enseignants permanents",
            "Enseignants vacataires",
            "Ratio étudiants / enseignant permanent",
          ],
          rows: [
            ["Sciences et Technologies", "Informatique", "", "", "", "", ""],
            [
              "Lettres et Sciences Humaines",
              "Lettres modernes",
              "",
              "",
              "",
              "",
              "",
            ],
            ["Droit, Économie, Gestion", "Gestion", "", "", "", "", ""],
            ["...", "...", "...", "...", "...", "...", "..."],
          ],
        },
      ],

      subsections: [],
    },
    {
      title: "II. Pertinence et justification de la demande d'habilitation",
      content: `Objectif : Démontrer l'utilité sociale et économique de la formation, l'alignement aux besoins du territoire et l'articulation avec l'offre existante.
      
      2.1 Etude socio-économique de la nouvelle offre de formation
      
      2.1.1 Etude de besoins régionale / nationale
      • Diagnostic des besoins
      • Cartographie des débouchés ;
      • Profils visés
      • Analyse des formations similaires ;
      • Justification d'opportunité
      • Tableau comparatif,
      • Lettres d'appui
      
      2.1.2 Effectifs prévisionnels
      • Justification des cohortes annuelles (S1–S6) par rapport aux capacités d'accueil
      • Séries de projection et les hypothèses
      
      2.1.3 Partenariats pour les nouvelles offres de formations
      • Partenaires académique
      • Convention de stages
      • Projets
      
      NB: Il faut insister sur la qualité des données et preuves fournies (Étude signée, sources officielles)
      
      2.3 Ressources attribuées aux nouvelles offres de formation
      
      Objectif : Vérifier la suffisance et l'adéquation des enseignants et du personnel de soutien. Exiger la concordance spécialité–UE et la stabilité minimale.
      
      2.3.1 Qualification des responsables :
      • Intitulé du domaine:
      • Nom du Responsable:
      • Diplôme et spécialité`,

      tables: [
        {
          title: "2.3.1 Qualification des responsables",
          headers: [
            "Domaines",
            "Grades",
            "Mentions",
            "Noms des responsables",
            "Diplômes et spécialités",
          ],
          rows: [
            ["ST", "L", "", "", ""],
            ["ST", "L", "", "", ""],
            ["ST", "L", "", "", ""],
            ["ST", "M", "", "", ""],
            ["ST", "M", "", "", ""],
            ["ALSH", "L", "", "", ""],
            ["ALSH", "L", "", "", ""],
            ["Sed", "L", "", "", ""],
            ["Sed", "M", "", "", ""],
            ["SI", "L", "", "", ""],
            ["SI", "L", "", "", ""],
            ["SI", "M", "", "", ""],
            ["SI", "M", "", "", ""],
            ["SI", "M", "", "", ""],
          ],
        },
        {
          title:
            "2.3.2 Les enseignants dédiés aux nouvelles offres de formations",
          headers: [
            "Nom & Prénom",
            "Statut (perm./vac.)",
            "Diplôme/Spécialité",
            "UE enseignées",
            "Charge annuelle (h)",
            "Pièces (CV, diplômes, Lettre d'engagement)",
          ],
          rows: [["", "", "", "", "", ""]],
        },
      ],

      subsections: [],
    },
    {
      title: "III. Organisation des études",
      content: `3.1 Domaines, grades
      Donner les grades proposés pour chaque domaine sous forme d'un tableau (les Six domaines sont : Sciences et Technologies (ST) ; Arts, Lettres et Sciences humaines (ALSH); Sciences de l'éducation (SEd); Sciences de l'ingénieur (SI); Sciences de la Santé (SSa) ; Sciences de la Société (SSo).)`,

      tables: [
        {
          title: "3.1 Domaines, grades",
          headers: [
            "Domaines",
            "Grades",
            "Noms des responsables avec leurs coordonnées (Adresse, Tél, Mail)",
          ],
          rows: [
            ["ST", "L", ""],
            ["ST", "L", ""],
            ["ST", "L", ""],
            ["ST", "M", ""],
            ["ST", "M", ""],
            ["ALSH", "L", ""],
            ["ALSH", "L", ""],
            ["Sed", "L", ""],
            ["Sed", "M", ""],
            ["SI", "L", ""],
            ["SI", "L", ""],
            ["SI", "M", ""],
            ["SI", "M", ""],
            ["SI", "M", ""],
          ],
        },
        {
          title: "3.2 Mentions, parcours et passerelles",
          description:
            "Les mentions sont des subdivisions d'un domaine. Elles peuvent se décliner en spécialités. Préciser les mentions proposées sous forme d'un tableau qui doit préciser les éléments ci-après : Intitulé de chaque mention*, Domaine et grade de rattachement, Etablissement de rattachement, Nom du responsable de chaque mention ainsi que ses coordonnées (adresse, e-mail, téléphone)",
          headers: [
            "Domaines",
            "Grades",
            "Mentions",
            "Noms des responsables",
            "Diplôme/Specialités",
          ],
          rows: [
            ["ST", "L", "", "", ""],
            ["ST", "L", "", "", ""],
            ["ST", "L", "", "", ""],
            ["ST", "M", "", "", ""],
            ["ST", "M", "", "", ""],
            ["ALSH", "L", "", "", ""],
            ["ALSH", "L", "", "", ""],
            ["Sed", "L", "", "", ""],
            ["Sed", "M", "", "", ""],
            ["SI", "L", "", "", ""],
            ["SI", "L", "", "", ""],
            ["SI", "M", "", "", ""],
            ["SI", "M", "", "", ""],
            ["SI", "M", "", "", ""],
          ],
        },
        {
          title: "Organisation des Parcours dans la mention",
          description: "Exemple : Mention « Physique-chimie »",
          headers: ["Semestre", "Physique", "Chimie", "Physique-chimie"],
          rows: [
            ["S6", "", "", ""],
            ["S5", "", "", ""],
            ["S4", "", "", ""],
            ["S3", "", "", ""],
            [
              "S2",
              "Enseignements communs (Tronc commun)",
              "Enseignements communs (Tronc commun)",
              "Enseignements communs (Tronc commun)",
            ],
            [
              "S1",
              "Enseignements communs (Tronc commun)",
              "Enseignements communs (Tronc commun)",
              "Enseignements communs (Tronc commun)",
            ],
          ],
        },
      ],

      subsections: [],
    },
    {
      title: "IV. Dispositif pédagogique et maquette",
      content: `Objectif : Attester la conformité de l'offre avec le principe du système LMD:
      • total de crédit pour les 6 semestres (180 ECTS),
      • équilibre entre les types d'interventions CM/TD/TP/TPE,
      • progression des études et professionnalisation.
      
      4.1 Description du mention : XXXXX
      4.1.1 Contexte et justification
      4.1.2 Objectifs de la formation:
      4.1.3 Vocation
      Décrire la vocation vers laquelle le parcours est orienté pour se situer dans la poursuite de la formation.
      N.B: Les établissements sont invités à indiquer clairement la vocation de la formation proposée, en précisant s'il s'agit d'une formation à vocation académique (préparant principalement à la poursuite d'études et à la recherche) ou d'une formation à vocation professionnelle (orientée vers l'insertion dans le monde du travail et la pratique de métier).
      4.1.4 Débouchés professionnels
      
      4.2 DESCRIPTION DES PARCOURS
      4.2.1 - PARCOURS XXXXXX`,

      tables: [
        {
          title: "Exemple 1 :",
          headers: ["", "", "Noms des responsables"],
          rows: [
            ["Domaine/Grade", "Sciences et Technologies/Licence"],
            ["Mention", "Physique-chimie"],
            ["Parcours", "S1 S2 S3 S4 S5 S6"],
            ["Enseignements communs", "x x"],
            ["Physique", "x x x x"],
            ["Chimie", "x x x x"],
            ["physique-chimie", "x x x x"],
          ],
          colSpan: true,
        },
        {
          title: "Exemple 2 :",
          headers: ["", "", "Nom des responsables"],
          rows: [
            ["Domaine/Grade", "Sciences et Technologies/Licence"],
            ["Mention", "Sciences de la vie"],
            ["Parcours", "S1 S2 S3 S4 S5 S6"],
            ["Biologie générale", "x x x"],
            ["Biologie moléculaire - physiologie", "x x x"],
            ["Sciences de l'environnement", "x x x"],
            ["Métiers de l'enseignement", "x x x"],
            ["Chimie biologie", "x x"],
          ],
          colSpan: true,
        },
        {
          title: "B- Les unités d'enseignements (UE)",
          headers: ["Unité d'enseignement", "Crédit"],
          rows: [
            ["Semestre 6", ""],
            ["", ""],
            ["", ""],
            ["", ""],
            ["Total", "30"],
            ["Semestre 5", ""],
            ["", ""],
            ["", ""],
            ["", ""],
            ["Total", "30"],
            ["Semestre 4", ""],
            ["", ""],
            ["", ""],
            ["Total", "30"],
            ["Semestre 3", ""],
            ["", ""],
            ["", ""],
            ["", ""],
            ["Total", "30"],
            ["Semestre 2", ""],
            ["", ""],
            ["", ""],
            ["", ""],
            ["Total", "30"],
            ["Semestre 1", ""],
            ["", ""],
            ["", ""],
            ["", ""],
            ["Total", "30"],
            ["Total", "180"],
          ],
        },
        {
          title: "Nature des activités pédagogiques - Exemple :",
          headers: [
            "Semestre",
            "cours %",
            "cours heures",
            "TD %",
            "TD heures",
            "TP %",
            "TP heures",
            "Stage %",
            "Stage heures",
          ],
          rows: [
            ["S6", "0%", "", "20%", "", "0%", "", "80%", ""],
            ["S5", "40%", "", "60%", "", "0%", "", "0%", ""],
            ["S4", "50%", "", "30%", "", "20%", "", "0%", ""],
            ["S3", "50%", "", "30%", "", "20%", "", "0%", ""],
            ["S2", "60%", "", "20%", "", "20%", "", "0%", ""],
            ["S1", "70%", "", "30%", "", "0%", "", "0%", ""],
          ],
        },
        {
          title: "Modalités de contrôle des connaissances",
          headers: [
            "UE/EC",
            "Nature (écrit/oral/pratique)",
            "Contrôle continu (poids)",
            "Terminal (poids)",
            "Rattrapage (O/N)",
            "Compensation",
            "Traçabilité (PV/archivage)",
          ],
          rows: [["", "", "", "", "", "", ""]],
        },
        {
          title: "Exemple de modalités de contrôle :",
          headers: [
            "EC (1)",
            "Nature (2)",
            "Continu dans l'EC (3)",
            "Terminal dans l'EC (3)",
            "Autres (4)",
            "Rattrapage (5)",
            "Compensation",
            "Coefficient dans l'UE",
          ],
          rows: [
            [
              "cours de biotech",
              "écrit",
              "0,5",
              "0,5",
              "",
              "oui",
              "Oui",
              "0,2",
            ],
            ["TP de Biotech", "manip", "", "1", "", "non", "Non", "0,1"],
            [
              "cours et TD de BV",
              "écrit",
              "0,4",
              "0,6",
              "",
              "oui",
              "Oui",
              "0,2",
            ],
            ["TP de BV", "manip", "1", "0", "", "non", "Non", "0,1"],
            ["Cours et TD de PV", "écrit", "0", "1", "", "oui", "Non", "0,2"],
            [
              "Evaluation de l'ensemble de l'UE",
              "oral",
              "0",
              "1",
              "",
              "oui",
              "Non",
              "0,2",
            ],
          ],
        },
        {
          title: "Exemple de volume horaire par matière :",
          headers: [
            "Matières (EC)",
            "C",
            "TD",
            "TP",
            "Autres (1)",
            "total",
            "Travail personnel",
          ],
          rows: [
            ["Biotechnologie", "15", "10", "5", "15", "45", "80"],
            ["Biologie végétale", "10", "7", "3", "0", "20", "50"],
            ["Physiologie végétale", "10", "5", "5", "5", "20", "50"],
            ["Total", "35", "22", "13", "20", "90", "180"],
            ["Crédit", "9", "", "", "", "", ""],
          ],
        },
      ],

      subsections: [],
    },
    {
      title: "C2: FICHE DESCRIPTIVE PAR UE",
      content: `Une fiche descriptive doit être remplie pour chaque unité d'enseignement (UE) afin de préciser ses objectifs, contenus, volumes horaires, crédits et modalités d'évaluation.`,

      tables: [
        {
          title: "Fiche : description d'une UE",
          headers: ["", ""],
          rows: [
            ["Grade / domaine concerné :", ""],
            ["Intitulé :", ""],
            ["Code et numéro :", ""],
          ],
          noHeader: true,
        },
        {
          title: "Liste des UE proposées par domaine/grade",
          headers: ["Domaine/Grade", ""],
          subHeaders: [
            "Code UE",
            "Nom UE",
            "crédits",
            "sem",
            "Noms des reponsables",
          ],
          rows: [["", "", "", "", ""]],
          multiHeader: true,
        },
        {
          title: "Personnel enseignant interne à l'institution",
          headers: [
            "Nom, Prénom",
            "Diplôme",
            "Grade",
            "Rattachement(1)",
            "Spécialité",
            "Type d'intervention (2)",
          ],
          rows: [["", "", "", "", "", ""]],
        },
        {
          title: "Intervenants externes de l'institution",
          headers: [
            "Nom, Prénom",
            "Diplôme",
            "organisme de rattachement ou entreprise",
            "Spécialité",
            "Type d'intervention",
          ],
          rows: [["", "", "", "", ""]],
        },
        {
          title: "Statut de l'UE",
          headers: ["Parcours", "Statut de l'UE", "Semestre"],
          rows: [["", "", ""]],
        },
        {
          title: "Nature des activités pédagogiques :",
          headers: [
            "Matières (EC)",
            "C",
            "TD",
            "TP",
            "Autres (1)",
            "total",
            "Travail personnel",
          ],
          rows: [["", "", "", "", "", "", ""]],
        },
      ],

      subsections: [],
    },
    {
      title: "V- Moyens disponibles",
      content: `5.1 Ressources humaines`,

      tables: [
        {
          title:
            "5.1.1 Récapitulatif des enseignants permanents et intervenants",
          headers: [
            "Grades",
            "Effectifs des permanents",
            "Effectifs des vacataires ou associés",
            "Total",
          ],
          rows: [
            ["Professeurs titulaires", "", "", ""],
            ["Professeurs", "", "", ""],
            ["Maître de conférences", "", "", ""],
            ["…………..", "", "", ""],
            ["Total", "", "", ""],
          ],
        },
        {
          title: "Taux d'encadrement",
          headers: ["Domaines (1)", "Taux d'encadrement (2)"],
          rows: [
            ["", ""],
            ["", ""],
            ["", ""],
          ],
        },
        {
          title: "5.1.2 Personnel de soutien",
          headers: ["Fonctions", "Effectifs"],
          rows: [
            ["Technicien de laboratoire", ""],
            ["Bibliothécaire", ""],
            ["Agent de maintenance", ""],
            ["Secrétaire", ""],
            ["Autres", ""],
            ["Total", ""],
          ],
        },
        {
          title: "5.2.1 Salle de cours",
          headers: ["Capacité", "nombre"],
          rows: [
            ["0-20", ""],
            ["20-50", ""],
            ["50-100", ""],
            ["100-300", ""],
            ["> 300", ""],
          ],
        },
        {
          title: "5.2.2 Laboratoires pédagogiques et équipements",
          headers: ["N°", "Désignation de l'équipement", "Nombre"],
          rows: [
            ["1", "", ""],
            ["2", "", ""],
          ],
        },
      ],

      subsections: [],
    },
    {
      title:
        "VI. Gestion des performances académiques et politique d'insertion professionnelle",
      content: `6.1 Indicateurs de suivi des performances académiques
      
      6.2 Politique d'insertion professionnelle
      Xxxx
      
      6.3 Politique pour la suivi des diplômés
      Xxxxx`,

      tables: [],
      subsections: [],
    },
    {
      title: "VII. Gouvernance et assurance qualité",
      content: `Objectif : S'assurer que la formation est suivie et régulée par des instances fonctionnelles et une cellule Assurance Qualité (AQ) active.
      La gouvernance du parcours et l'assurance qualité constituent deux piliers essentiels pour garantir la crédibilité académique, la transparence institutionnelle et la conformité aux standards nationaux et internationaux.
      
      7.1. Instances de gouvernance
      • Comité pédagogique :
      • Comité scientifique et professionnel :
      • Une coordination administrative :
      • Implications des étudiants
      
      7.2 Structure d'assurance qualité
      • Structure
      • Plan opérationnel`,

      tables: [],
      subsections: [],
    },
    {
      title: "VIII. ANNEXES",
      content: `• Liste des CV et lettres d'engagement
      • Les conventions de partenariats signés`,

      tables: [],
      subsections: [],
    },
  ],
};

// Canevas pour le Master
const canevasMaster = {
  introduction: `Ce canevas constitue une trame minimale que chaque établissement d'enseignement supérieur doit renseigner dans le cadre d'une demande d'habilitation de formation :
  • Il précise les informations essentielles attendues et les justificatifs à fournir.
  • L'examen des dossiers par la Commission nationale d'habilitation (CNH) se fera sur la base des éléments présentés, mais la pertinence des demandes dépendra avant tout de la qualité et de l'authenticité des preuves fournies.
  • Les établissements sont donc invités à préparer leurs dossiers avec rigueur, transparence et esprit de responsabilité, afin de garantir la crédibilité et la qualité de l'offre de formation proposée.`,

  structure: `La structure du cahier de charges suit une logique en huit blocs complémentaires :
  
  1) Informations institutionnelles : éléments de recevabilité et documents fondateurs.
  Ce bloc rassemble les éléments juridiques et organisationnels qui attestent de la recevabilité du dossier et de l'existence d'une gouvernance académique claire.
  
  2) Politique et environnement de recherche 
  
  3) Pertinence et justification de l'offre de formation : diagnostic et opportunité de la formation.
  Ce bloc permet de vérifier la pertinence de la formation proposée au regard des besoins nationaux et régionaux, ainsi que la cohérence de son ouverture avec l'existant.
  
  4) Ressources humaines : compétences et qualifications des enseignants.
  Ce bloc évalue la disponibilité, les qualifications et l'adéquation des enseignants et encadrants, ainsi que la pertinence des partenariats académiques et professionnels.
  
  5) Ressources matérielles et infrastructures : capacités d'accueil et équipements.
  Ce bloc vérifie la capacité d'accueil de l'établissement et la qualité des infrastructures physiques, numériques et logistiques mises à disposition des étudiants.
  
  6) Dispositif pédagogique et maquette (conformité LMD) : organisation académique et progression des études.
  Ce bloc examine l'organisation académique de la formation pour s'assurer qu'elle respecte les principes du système LMD, en termes de crédits, d'unités d'enseignement, de progression et de passerelles.
  
  7) Système d'évaluation des apprentissages : modalités, règlements et traçabilité.
  Ce bloc analyse la diversité, la validité et la traçabilité des modalités d'évaluation mises en place pour certifier les acquis des étudiants.
  
  8) Performances académiques et insertion professionnelle : résultats et insertion professionnelle
  Ce bloc permet d'apprécier les performances académiques de la formation et le niveau d'insertion professionnelle des diplômés, à travers les taux de réussite, de diplômation et d'employabilité, ainsi que l'existence de dispositifs de suivi et d'actions correctives.
  
  9) Gouvernance et assurance qualité : pilotage et dispositifs d'amélioration continue.
  Ce bloc évalue l'existence d'une stratégie institutionnelle, d'une cellule interne d'assurance qualité et de mécanismes de suivi-évaluation visant l'amélioration continue des formations.
  
  Cette organisation permet d'évaluer de manière cohérente et progressive la capacité d'un établissement à proposer une formation pertinente, conforme au système LMD et soutenable dans la durée.`,

  sections: [
    {
      title: "I. PRÉSENTATION DE L'INSTITUTION",
      content: `1.1 Informations institutionnelles
      • Nom et coordonnées de l'institution :
      • Statut juridique (arrêtés d'ouverture)
      • Nom et Prénoms du responsable de l'institution :
      • Organigramme et instance de gouvernance
      • Mission et vision de l'institution
      • Plan de développement opérationnel de l'institution
      • Date d'approbation du dossier par les instances compétentes de l'institution :`,

      tables: [
        {
          headers: ["Critère", "Justificatifs requis"],
          rows: [
            [
              "Demande officielle signée par les instances de l'institutions",
              "Lettre officielle signée",
            ],
            [
              "Cahier de charges institutionnel",
              "Arrêté de création, règlements pédagogiques internes, statuts et organigramme",
            ],
            [
              "Dispositif de gouvernance académique",
              "Organigramme, PV de conseils, existence d'une cellule assurance qualité",
            ],
          ],
        },
        {
          title: "1.2.1 Domaines et grades",
          description:
            "Donner les grades proposés pour chaque domaine sous forme d'un tableau (les Six domaines sont : Sciences et Technologies (ST) ; Arts, Lettres et Sciences humaines (ALSH); Sciences de l'éducation (SEd); Sciences de l'ingénieur (SI); Sciences de la Santé (SSa) ; Sciences de la Société (SSo).) Ce tableau doit contenir : Les noms des responsables des grades / domaines ainsi que leurs coordonnées (adresse, e-mail, téléphone)",
          headers: ["Domaines", "Grades proposés", "Noms des responsables"],
          rows: [
            ["ST", "L", ""],
            ["ST", "M", ""],
            ["ALSH", "L", ""],
            ["Sed", "L", ""],
            ["Sed", "M", ""],
            ["SI", "L", ""],
            ["SI", "M", ""],
          ],
        },
        {
          title: "1.2.2 – Mentions",
          description:
            "Préciser les mentions proposées sous forme d'un tableau qui doit préciser les éléments ci-après : Intitulé de chaque mention*, Domaine et grade de rattachement, Etablissement de rattachement, Nom du responsable de chaque mention ainsi que ses coordonnées (adresse, e-mail, téléphone)",
          headers: ["Domaines", "Grades", "Mentions", "Noms des responsables"],
          rows: [
            ["ST", "L", "", ""],
            ["ST", "L", "", ""],
            ["ST", "L", "", ""],
            ["ST", "M", "", ""],
            ["ST", "M", "", ""],
            ["ALSH", "L", "", ""],
            ["ALSH", "L", "", ""],
            ["Sed", "L", "", ""],
            ["Sed", "M", "", ""],
            ["SI", "L", "", ""],
            ["SI", "L", "", ""],
            ["SI", "M", "", ""],
            ["SI", "M", "", ""],
            ["SI", "M", "", ""],
          ],
        },
        {
          title: "1.3.1 Enseignants permanents",
          headers: [
            "Nom, Prénom",
            "Diplôme",
            "Grade",
            "Spécialité",
            "Mention de Rattachement(1)",
            "Type d'intervention (2)",
          ],
          rows: [["", "", "", "", "", ""]],
        },
        {
          title: "1.3.2 Enseignants vacataires",
          headers: [
            "Nom, Prénom",
            "Diplôme",
            "Grade",
            "Spécialité",
            "Mention de Rattachement(1)",
            "Type d'intervention (2)",
          ],
          rows: [["", "", "", "", "", ""]],
        },
        {
          title:
            "1.3.3 Personnel administratif et technique (techniciens, bibliothécaires, maintenance)",
          headers: ["Fonction", "Effectif", "Affectation / Preuves"],
          rows: [["", "", ""]],
        },
        {
          title: "1.4.1 Salles de cours",
          headers: [
            "Capacité (places)",
            "Nombre",
            "Équipement (Video projecteure(VP), tableau, etc.)",
            "Preuves (photos, inventaire)",
          ],
          rows: [
            ["0–20", "", "", ""],
            ["20–50", "", "", ""],
            ["50–100", "", "", ""],
            ["100–300", "", "", ""],
            [">300", "", "", ""],
          ],
        },
        {
          title: "1.4.2 Laboratoires pédagogiques / équipements",
          headers: [
            "N°",
            "Désignation de l'équipement",
            "Nombre",
            "Preuves/État",
          ],
          rows: [
            ["1", "", "", ""],
            ["2", "", "", ""],
            ["3", "", "", ""],
            ["4", "", "", ""],
            ["5", "", "", ""],
          ],
        },
        {
          title: "1.4.3 Bibliothèque et documentation",
          headers: ["Fonds/documentation", "Capacité (places)", "Preuves"],
          rows: [["", "", ""]],
        },
        {
          title: "1.4.4 Infrastructures numériques & hygiène/sécurité",
          headers: ["Item", "Disponibilité", "Standard attendu", "Preuves"],
          rows: [
            [
              "Salle informatique",
              "",
              "Postes fonctionnels ; logiciels requis",
              "",
            ],
            [
              "Connectivité Internet",
              "",
              "≥ 1 Mbps/étudiant (ou justification contextuelle)",
              "",
            ],
            ["LMS (ex. Moodle)", "", "Accès opérationnel", ""],
            [
              "Sanitaires / issues de secours",
              "",
              "Conformes, signalétique",
              "",
            ],
            [
              "Énergie / solution alternative",
              "",
              "Stabilité ou solution de secours",
              "",
            ],
          ],
        },
        {
          title: "1.5 Statistiques institutionnelles actuelles",
          headers: [
            "Domaine",
            "Mention",
            "Parcours",
            "Étudiants inscrits",
            "Enseignants permanents",
            "Enseignants vacataires",
            "Ratio étudiants / enseignant permanent",
          ],
          rows: [
            ["Sciences et Technologies", "Informatique", "", "", "", "", ""],
            [
              "Lettres et Sciences Humaines",
              "Lettres modernes",
              "",
              "",
              "",
              "",
              "",
            ],
            ["Droit, Économie, Gestion", "Gestion", "", "", "", "", ""],
            ["...", "...", "...", "...", "...", "...", "..."],
          ],
        },
      ],

      subsections: [],
    },
    {
      title:
        "II. Politique et environnement de recherche (obligatoire – spécifique Master)",
      content: `Ce volet est le cœur de la recevabilité du niveau Master.
      L'établissement doit prouver qu'il dispose d'une politique institutionnelle de recherche et qu'il est adossé à une ou plusieurs structures de recherche actives (laboratoires, centres ou équipes de recherche agréés).
      
      2.1 Plan cadre et thématique de recherche de l'institution
      
      2.2 Laboratoires et équipe de recherche de rattachement
      
      2.3 Activités scientifiques
      • Colloque
      • Encadrement de master recherche et thèse
      • Séminaire
      
      2.4 Publications des enseignants permanents
      
      2.5 Partenariats scientifiques pour l'appui à la recherche`,

      tables: [],
      subsections: [],
    },
    {
      title: "III. Pertinence et justification de la demande d'habilitation",
      content: `Objectif : Démontrer l'utilité sociale et économique de la formation, l'alignement aux besoins du territoire et l'articulation avec l'offre existante.
      
      3.1 Etude socio-économique de la nouvelle offre de formation
      
      3.1.1 Etude de besoins régionale / nationale
      • Diagnostic des besoins,
      • Cohérence avec les parcours de grade licence existants
      • Cartographie des débouchés ;
      • Profils visés
      • Analyse des formations similaires ;
      • Justification d'opportunité
      • Tableau comparatif,
      • Lettres d'appui
      
      3.1.2 Effectifs prévisionnels
      • Justification des cohortes annuelles (S7–S10) par rapport aux capacités d'accueil
      • Séries de projection et les hypothèses
      
      3.1.3 Partenariats pour les nouvelles offres de formations
      • Partenaires académique
      • Convention de stages
      • Projets
      
      NB: Il faut insister sur la qualité des données et preuves fournies (Étude signée, sources officielles)
      
      3.3 Ressources attribuées aux nouvelles offres de formation
      
      Objectif : Vérifier la suffisance et l'adéquation des enseignants et du personnel de soutien. Exiger la concordance spécialité–UE et la stabilité minimale.
      
      3.3.1 Qualification des responsables :
      • Intitulé du domaine:
      • Nom du Responsable:
      • Diplôme et spécialité`,

      tables: [
        {
          title: "3.3.1 Qualification des responsables",
          headers: [
            "Domaines",
            "Grades",
            "Mentions",
            "Noms des responsables",
            "Diplômes et spécialités",
          ],
          rows: [
            ["ST", "L", "", "", ""],
            ["ST", "L", "", "", ""],
            ["ST", "L", "", "", ""],
            ["ST", "M", "", "", ""],
            ["ST", "M", "", "", ""],
            ["ALSH", "L", "", "", ""],
            ["ALSH", "L", "", "", ""],
            ["Sed", "L", "", "", ""],
            ["Sed", "M", "", "", ""],
            ["SI", "L", "", "", ""],
            ["SI", "L", "", "", ""],
            ["SI", "M", "", "", ""],
            ["SI", "M", "", "", ""],
            ["SI", "M", "", "", ""],
          ],
        },
        {
          title:
            "3.3.2 Les enseignants dédiés aux nouvelles offres de formations",
          headers: [
            "Nom & Prénom",
            "Statut (perm./vac.)",
            "Diplôme/Spécialité",
            "UE enseignées",
            "Charge annuelle (h)",
            "Pièces (CV, diplômes, Lettre d'engagement)",
          ],
          rows: [["", "", "", "", "", ""]],
        },
      ],

      subsections: [],
    },
    {
      title: "IV. Organisation des études",
      content: `4.1 Domaines, grades
      Donner les grades proposés pour chaque domaine sous forme d'un tableau (les Six domaines sont : Sciences et Technologies (ST) ; Arts, Lettres et Sciences humaines (ALSH); Sciences de l'éducation (SEd); Sciences de l'ingénieur (SI); Sciences de la Santé (SSa) ; Sciences de la Société (SSo).)`,

      tables: [
        {
          title: "4.1 Domaines, grades",
          headers: [
            "Domaines",
            "Grades",
            "Noms des responsables avec leurs coordonnées (Adresse, Tél, Mail)",
          ],
          rows: [
            ["ST", "L", ""],
            ["ST", "L", ""],
            ["ST", "L", ""],
            ["ST", "M", ""],
            ["ST", "M", ""],
            ["ALSH", "L", ""],
            ["ALSH", "L", ""],
            ["Sed", "L", ""],
            ["Sed", "M", ""],
            ["SI", "L", ""],
            ["SI", "L", ""],
            ["SI", "M", ""],
            ["SI", "M", ""],
            ["SI", "M", ""],
          ],
        },
        {
          title: "4.2 Mentions, parcours et passerelles",
          description:
            "Les mentions sont des subdivisions d'un domaine. Elles peuvent se décliner en spécialités. Préciser les mentions proposées sous forme d'un tableau qui doit préciser les éléments ci-après : Intitulé de chaque mention*, Domaine et grade de rattachement, Etablissement de rattachement, Nom du responsable de chaque mention ainsi que ses coordonnées (adresse, e-mail, téléphone)",
          headers: [
            "Domaines",
            "Grades",
            "Mentions",
            "Noms des responsables",
            "Diplôme/Specialités",
          ],
          rows: [
            ["ST", "L", "", "", ""],
            ["ST", "L", "", "", ""],
            ["ST", "L", "", "", ""],
            ["ST", "M", "", "", ""],
            ["ST", "M", "", "", ""],
            ["ALSH", "L", "", "", ""],
            ["ALSH", "L", "", "", ""],
            ["Sed", "L", "", "", ""],
            ["Sed", "M", "", "", ""],
            ["SI", "L", "", "", ""],
            ["SI", "L", "", "", ""],
            ["SI", "M", "", "", ""],
            ["SI", "M", "", "", ""],
            ["SI", "M", "", "", ""],
          ],
        },
        {
          title: "Organisation des Parcours dans la mention",
          description: "Exemple : Mention « mathématiques»",
          headers: ["Semestre", "Physique", "Chimie", "Physique-chimie"],
          rows: [
            ["S10", "", "", ""],
            ["S9", "", "", ""],
            [
              "S8",
              "Enseignements communs (Tronc commun)",
              "Enseignements communs (Tronc commun)",
              "Enseignements communs (Tronc commun)",
            ],
            [
              "S7",
              "Enseignements communs (Tronc commun)",
              "Enseignements communs (Tronc commun)",
              "Enseignements communs (Tronc commun)",
            ],
          ],
        },
      ],

      subsections: [],
    },
    {
      title: "V. Dispositif pédagogique et maquette",
      content: `Objectif : Attester la conformité de l'offre avec le principe du système LMD:
      • total de crédit pour les 4 semestres (120 ECTS),
      • équilibre entre les types d'interventions CM/TD/TP/TPE,
      • progression des études et professionnalisation.
      
      5.1 Description du mention : XXXXX
      5.1.1 Contexte et justification
      5.1.2 Objectifs de la formation:
      5.1.3 Vocation
      Décrire la vocation vers laquelle le parcours est orienté pour se situer dans la poursuite de la formation.
      N.B: Les établissements sont invités à indiquer clairement la vocation de la formation proposée, en précisant s'il s'agit d'une formation à vocation académique (préparant principalement à la poursuite d'études et à la recherche) ou d'une formation à vocation professionnelle (orientée vers l'insertion dans le monde du travail et la pratique de métier).
      5.1.4 Débouchés professionnels
      
      5.2 DESCRIPTION DES PARCOURS
      5.2.1 - PRESENTATION DU PARCOURS XXXXXX`,

      tables: [
        {
          title: "Exemple 1 :",
          headers: ["", "", "Noms des responsables"],
          rows: [
            ["Domaine/Grade", "Sciences et Technologies/MASTER"],
            ["Mention", "Physique-chimie"],
            ["Parcours", "S7 S8 S9 S10"],
            ["Enseignements communs", "x x"],
            ["Physique", "x x"],
            ["Chimie", "x x"],
            ["physique-chimie", "x x"],
          ],
          colSpan: true,
        },
        {
          title: "Exemple 2 :",
          headers: ["", "", "Nom des responsables"],
          rows: [
            ["Domaine/Grade", "Sciences et Technologies/Licence"],
            ["Mention", "Sciences de la vie"],
            ["Parcours", "S7 S8 S9 S10"],
            ["Biologie générale", "x x x X"],
            ["Biologie moléculaire - physiologie", "x"],
            ["Sciences de l'environnement", "x"],
            ["Métiers de l'enseignement", "x"],
            ["Chimie biologie", "x x"],
          ],
          colSpan: true,
        },
        {
          title: "B- Les unités d'enseignements (UE)",
          headers: ["Unité d'enseignement", "Crédit"],
          rows: [
            ["Semestre 10", ""],
            ["", ""],
            ["", ""],
            ["", ""],
            ["Total", "30"],
            ["Semestre 9", ""],
            ["", ""],
            ["", ""],
            ["", ""],
            ["Total", "30"],
            ["Semestre 8", ""],
            ["", ""],
            ["", ""],
            ["Total", "30"],
            ["Semestre 7", ""],
            ["", ""],
            ["", ""],
            ["", ""],
            ["Total", "30"],
            ["Total", "120"],
          ],
        },
        {
          title: "Nature des activités pédagogiques - Exemple :",
          headers: [
            "Semestre",
            "cours %",
            "cours heures",
            "TD %",
            "TD heures",
            "TP %",
            "TP heures",
            "Stage %",
            "Stage heures",
          ],
          rows: [
            ["S10", "0%", "", "20%", "", "0%", "", "80%", ""],
            ["S9", "40%", "", "60%", "", "0%", "", "0%", ""],
            ["S8", "50%", "", "30%", "", "20%", "", "0%", ""],
            ["S7", "50%", "", "30%", "", "20%", "", "0%", ""],
          ],
        },
        {
          title: "Modalités de contrôle des connaissances",
          headers: [
            "UE/EC",
            "Nature (écrit/oral/pratique)",
            "Contrôle continu (poids)",
            "Terminal (poids)",
            "Rattrapage (O/N)",
            "Compensation",
            "Traçabilité (PV/archivage)",
          ],
          rows: [["", "", "", "", "", "", ""]],
        },
        {
          title: "Exemple de modalités de contrôle :",
          headers: [
            "EC (1)",
            "Nature (2)",
            "Continu dans l'EC (3)",
            "Terminal dans l'EC (3)",
            "Autres (4)",
            "Rattrapage (5)",
            "Compensation",
            "Coefficient dans l'UE",
          ],
          rows: [
            [
              "cours de biotech",
              "écrit",
              "0,5",
              "0,5",
              "",
              "oui",
              "Oui",
              "0,2",
            ],
            ["TP de Biotech", "manip", "", "1", "", "non", "Non", "0,1"],
            [
              "cours et TD de BV",
              "écrit",
              "0,4",
              "0,6",
              "",
              "oui",
              "Oui",
              "0,2",
            ],
            ["TP de BV", "manip", "1", "0", "", "non", "Non", "0,1"],
            ["Cours et TD de PV", "écrit", "0", "1", "", "oui", "Non", "0,2"],
            [
              "Evaluation de l'ensemble de l'UE",
              "oral",
              "0",
              "1",
              "",
              "oui",
              "Non",
              "0,2",
            ],
          ],
        },
        {
          title: "Exemple de volume horaire par matière :",
          headers: [
            "Matières (EC)",
            "C",
            "TD",
            "TP",
            "Autres (1)",
            "total",
            "Travail personnel",
          ],
          rows: [
            ["Biotechnologie", "15", "10", "5", "15", "45", "80"],
            ["Biologie végétale", "10", "7", "3", "0", "20", "50"],
            ["Physiologie végétale", "10", "5", "5", "5", "20", "50"],
            ["Total", "35", "22", "13", "20", "90", "180"],
            ["Crédit", "9", "", "", "", "", ""],
          ],
        },
      ],

      subsections: [],
    },
    {
      title: "C2: FICHE DESCRIPTIVE PAR UE",
      content: `Une fiche descriptive doit être remplie pour chaque unité d'enseignement (UE) afin de préciser ses objectifs, contenus, volumes horaires, crédits et modalités d'évaluation.`,

      tables: [
        {
          title: "Fiche : description d'une UE",
          headers: ["", ""],
          rows: [
            ["Grade / domaine concerné :", ""],
            ["Intitulé :", ""],
            ["Code et numéro :", ""],
          ],
          noHeader: true,
        },
        {
          title: "Liste des UE proposées par domaine/grade",
          headers: ["Domaine/Grade", ""],
          subHeaders: [
            "Code UE",
            "Nom UE",
            "crédits",
            "sem",
            "Noms des reponsables",
          ],
          rows: [["", "", "", "", ""]],
          multiHeader: true,
        },
        {
          title: "Personnel enseignant interne à l'institution",
          headers: [
            "Nom, Prénom",
            "Diplôme",
            "Grade",
            "Rattachement(1)",
            "Spécialité",
            "Type d'intervention (2)",
          ],
          rows: [["", "", "", "", "", ""]],
        },
        {
          title: "Intervenants externes de l'institution",
          headers: [
            "Nom, Prénom",
            "Diplôme",
            "organisme de rattachement ou entreprise",
            "Spécialité",
            "Type d'intervention",
          ],
          rows: [["", "", "", "", ""]],
        },
        {
          title: "Statut de l'UE",
          headers: ["Parcours", "Statut de l'UE", "Semestre"],
          rows: [["", "", ""]],
        },
        {
          title: "Nature des activités pédagogiques :",
          headers: [
            "Matières (EC)",
            "C",
            "TD",
            "TP",
            "Autres (1)",
            "total",
            "Travail personnel",
          ],
          rows: [["", "", "", "", "", "", ""]],
        },
      ],

      subsections: [],
    },
    {
      title: "VI- Moyens disponibles",
      content: `6.1 Ressources humaines`,

      tables: [
        {
          title:
            "6.1.1 Récapitulatif des enseignants permanents et intervenants",
          headers: [
            "Grades",
            "Effectifs des permanents",
            "Effectifs des vacataires ou associés",
            "Total",
          ],
          rows: [
            ["Professeurs titulaires", "", "", ""],
            ["Professeurs", "", "", ""],
            ["Maître de conférences", "", "", ""],
            ["…………..", "", "", ""],
            ["Total", "", "", ""],
          ],
        },
        {
          title: "Taux d'encadrement",
          headers: ["Domaines (1)", "Taux d'encadrement (2)"],
          rows: [
            ["", ""],
            ["", ""],
          ],
        },
        {
          title: "6.1.2 Personnel de soutien",
          headers: ["Fonctions", "Effectifs"],
          rows: [
            ["Technicien de laboratoire", ""],
            ["Bibliothécaire", ""],
            ["Agent de maintenance", ""],
            ["Secrétaire", ""],
            ["Autres", ""],
            ["Total", ""],
          ],
        },
        {
          title: "6.2.1 Salle de cours",
          headers: ["Capacité", "nombre"],
          rows: [
            ["0-20", ""],
            ["20-50", ""],
            ["50-100", ""],
            ["100-300", ""],
            ["> 300", ""],
          ],
        },
        {
          title: "6.2.2 Laboratoires pédagogiques et équipements",
          headers: ["N°", "Désignation de l'équipement", "Nombre"],
          rows: [
            ["1", "", ""],
            ["2", "", ""],
          ],
        },
      ],

      subsections: [],
    },
    {
      title:
        "VII. Gestion des performances académiques et politique d'insertion professionnelle",
      content: `7.1 Indicateurs de suivi des performances académiques
      
      7.2 Politique d'insertion professionnelle
      Xxxx
      
      7.3 Politique pour la suivi des diplômés
      Xxxxx
      
      7.4 Publications issues des mémoires ou poursuite des études en thèse de doctorat pour les masters à vocation recherche`,

      tables: [],
      subsections: [],
    },
    {
      title: "VIII. Gouvernance et assurance qualité",
      content: `Objectif : S'assurer que la formation est suivie et régulée par des instances fonctionnelles et une cellule Assurance Qualité (AQ) active.
      La gouvernance du parcours et l'assurance qualité constituent deux piliers essentiels pour garantir la crédibilité académique, la transparence institutionnelle et la conformité aux standards nationaux et internationaux.
      
      8.1. Instances de gouvernance
      • Comité pédagogique :
      • Comité scientifique et professionnel :
      • Une coordination administrative :
      • Implications des étudiants
      
      8.2 Structure d'assurance qualité
      • Structure
      • Plan opérationnel`,

      tables: [],
      subsections: [],
    },
    {
      title: "IX. ANNEXES",
      content: `• Liste des CV et lettres d'engagement
      • Les conventions de partenariats signés`,

      tables: [],
      subsections: [],
    },
  ],
};

// Canevas pour le Doctorat
const canevasDoctorat = {
  introduction: `Le présent canevas a été élaboré dans le cadre de la réforme du dispositif national d'habilitation des écoles doctorales, conformément aux orientations du Ministère de l'Enseignement Supérieur et de la Recherche scientifique et aux recommandations issues des audits menés auprès des universités publiques et privées de Madagascar en 2025. Il constitue un outil d'accompagnement et d'évaluation pour les établissements d'enseignement supérieur souhaitant créer, renouveler ou faire évaluer une école doctorale.

  L'objectif est de garantir la qualité scientifique, académique et institutionnelle de la formation doctorale, conformément aux principes du LMD et de notre cadre d'assurance qualité.

  Ce canevas vise à :
  • évaluer la pertinence du projet de création de l'école doctorale et la cohérence scientifique des thématiques proposées ;
  • apprécier la capacité d'encadrement et de gouvernance de l'établissement porteur ;
  • vérifier la qualité de la formation et de la recherche, ainsi que l'intégrité académique des encadreurs et des doctorants ;
  • renforcer la culture d'assurance qualité, la transparence et la traçabilité des données scientifiques ;
  • intégrer une politique institutionnelle contre les revues et conférences prédatrices, garantissant la crédibilité des productions scientifiques.

  L'habilitation d'une École Doctorale repose désormais sur une approche intégrée et fondée sur des preuves.
  Le dossier doit être présenté de manière complète, claire et documentée ; chaque élément doit être appuyé par des pièces justificatives signées, datées et vérifiables.

  Le canevas comprend neuf (9) blocs complémentaires, correspondant aux dimensions essentielles de l'évaluation :

  • Informations institutionnelles ;
  • Structure et organisation ;
  • Ressources humaines et encadrement ;
  • Formation transversale et suivi des doctorants ;
  • Environnement scientifique et infrastructures ;
  • Production scientifique et intégrité ;
  • Suivi, débouchés et insertion ;
  • Gouvernance, éthique et assurance qualité ;
  • Annexes.`,

  structure: ``,

  sections: [
    {
      title: "I. INFORMATIONS INSTITUTIONNELLES",
      content: `Objectifs : 

      Ce premier bloc vise à présenter les informations de base sur l'institution porteuse de l'École Doctorale et à vérifier la conformité juridique, administrative et académique du projet. Il permet de s'assurer que l'établissement dispose d'une base légale solide, d'une gouvernance scientifique opérationnelle, et d'une stratégie de recherche cohérente avec les priorités nationales.

      1.1 Cadre administratif et juridique

      Ce tableau présente les éléments d'identification de l'établissement : sa dénomination, son statut, son adresse et la base juridique de son existence.
      Il vise à vérifier la recevabilité administrative du dossier d'habilitation et la conformité de l'établissement aux textes en vigueur.`,

      tables: [
        {
          title: "1.1 Cadre administratif et juridique",
          headers: [
            "Élément",
            "Contenu attendu / À remplir par l'établissement",
            "Justificatifs requis (à joindre)",
          ],
          rows: [
            [
              "Nom complet de l'établissement",
              "Indiquer la dénomination officielle telle qu'enregistrée auprès du MESupReS",
              "Statuts, arrêté de création",
            ],
            [
              "Statut juridique",
              "Préciser : Public / Privé / Confessionnel",
              "Copie de l'agrément ou de l'arrêté",
            ],
            [
              "Adresse et localisation",
              "Mentionner l'adresse complète du site principal et des annexes",
              "Certificat de localisation ou justificatif d'adresse",
            ],
            [
              "Responsable légal",
              "Nom, fonction, coordonnées officielles",
              "CV signé, arrêté de nomination",
            ],
            [
              "Date de validation du dossier: conseil de l'école doctorale, conseil scientifique de l'Institution et conseil d'administration",
              "Indiquer la date et l'instance de validation interne (conseil scientifique, pédagogique…)",
              "PV signé ou décision officielle",
            ],
            [
              "Références réglementaires",
              "Lister les textes nationaux encadrant les Écoles Doctorales",
              "Copies des arrêtés en vigueur",
            ],
          ],
        },
        {
          title:
            "1.2 Politique institutionnelle de recherche et gouvernance scientifique",
          description:
            "Ce tableau permet de décrire la stratégie de recherche de l'institution d'attache et d'identifier les structures scientifiques et instances de gouvernance qui soutiennent la formation doctorale. Il met en évidence la présence d'une structure de pilotage de la recherche, de laboratoires actifs, d'une cellule d'assurance qualité et d'un comité d'éthique fonctionnel.",
          headers: [
            "Élément",
            "Contenu attendu / À remplir par l'établissement",
            "Justificatifs requis (à joindre)",
          ],
          rows: [
            [
              "Politique institutionnelle de recherche",
              "Décrire le document officiel aligné au plan stratégique de l'établissement",
              "Copie validée par le conseil scientifique",
            ],
            [
              "Structure de pilotage de la recherche (Direction ou vice-président)",
              "Préciser la structure responsable de la recherche (organigramme, responsable)",
              "PV de création, arrêté de nomination",
            ],
            [
              "Plan stratégique de recherche",
              "Lister les axes prioritaires, programmes ou projets en cours",
              "Plan ou rapport institutionnel",
            ],
            [
              "Structures de recherche actives",
              "Indiquer les laboratoires, centres ou équipes d'accueil et leurs responsables",
              "PV, rapports d'activités",
            ],
            [
              "Cellule d'Assurance Qualité",
              "Mentionner son rôle dans le suivi de la recherche et la formation doctorale",
              "PV de nomination, rapport AQ",
            ],
            [
              "Comité d'éthique scientifique",
              "Indiquer la composition et le fonctionnement du comité",
              "PV de réunions, charte d'éthique",
            ],
          ],
        },
        {
          title: "1.3 Statistique et données institutionnelles",
          description:
            "Ce tableau vise à résumer les principaux indicateurs institutionnels relatifs aux ressources humaines, à la recherche et aux partenariats de l'établissement. Les données chiffrées fournissent une vue d'ensemble de la capacité scientifique et organisationnelle de l'institution à encadrer la formation doctorale.",
          headers: [
            "Indicateur",
            "Valeur actuelle (année en cours)",
            "Commentaires / Observations",
          ],
          rows: [
            ["Nombre total d'enseignants permanents", "", ""],
            ["Nombre de Docteurs", "", ""],
            ["Nombre de titulaires HDR", "", ""],
            ["Nombre d'équipes ou laboratoires de recherche", "", ""],
            ["Nombre de publications scientifiques par an", "", ""],
            [
              "Nombre de doctorants inscrits (tous établissements confondus)",
              "",
              "",
            ],
            ["Nombre de partenariats de recherche actifs", "", ""],
          ],
        },
        {
          title:
            "1.4 Résumé narratif des activités de recherche de l'Institution d'attache",
          description:
            "Présenter brièvement : - l'historique et la mission académique de l'institution ; - la politique de recherche et d'innovation ; - les axes de recherche en lien avec la formation doctorale ; - les partenariats nationaux et internationaux ; - les réalisations scientifiques des cinq dernières années (publications, projets, colloques).",
          rows: [["", ""]],
          noHeader: true,
        },
      ],

      subsections: [],
    },
    {
      title: "II. Structure et organisation de l'école doctorale",
      content: `Ce bloc vise à évaluer la structure de gouvernance, la composition du conseil, les équipes d'accueil doctorales (EAD), et le fonctionnement interne de l'École Doctorale. Il permet d'apprécier la cohérence entre les structures de recherche, les thématiques de formation et les capacités d'encadrement disponibles.
      L'organisation de l'École Doctorale doit démontrer une gouvernance académique transparente, participative et conforme aux textes nationaux (Arrêté 1610/2018 – MESupReS).

      2.1 Composition du Conseil de l'École Doctorale 
      Le conseil de l'École Doctorale est l'organe de gouvernance scientifique et administrative de l'école.
      Il doit refléter la diversité des parties prenantes : encadreurs, doctorants, administration, partenaires, et représentants du monde socio-économique.`,

      tables: [
        {
          title: "2.1 Composition du Conseil de l'École Doctorale",
          headers: ["Représentants", "Noms", "Grade", "Spécialité"],
          rows: [
            [
              "Représentants des Équipes d'accueil de l'École Doctorale (EAD)",
              "",
              "",
              "",
            ],
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""],
            ["", "", "", ""],
            ["Représentant de l'Institution support", "", "", ""],
            ["Personnel administratif et technique", "", "", ""],
            ["Doctorant (2 représentants des doctorants)", "", "", ""],
            ["", "", "", ""],
            ["Secteurs industriels et socio-économiques", "", "", ""],
            ["Partenaires techniques et financiers", "", "", ""],
          ],
        },
        {
          title:
            "2.2.1 Fiche Équipe d'accueil : EAD 1 (à remplir par équipe d'accueil)",
          description:
            "Intitulé de l'Équipe d'accueil doctorale (EAD):\nNom du responsable de l'EAD:\nContact (Tél et mail):\nDiplôme et spécialités du responsable de l'EAD;\nAdresse (Localité) de l'EAD:\nLaboratoire de recherche associé:",
          headers: ["", ""],
          rows: [
            ["Equipement informatique", "Logistique"],
            ["Désignation", "Nombre", "Salles", "Superficie (/m2)"],
            ["", "", "Bureau", ""],
            ["", "", "Salle de reunion", ""],
            ["", "", "", ""],
            ["", "", "", ""],
          ],
          multiRow: true,
        },
        {
          title: "Les membres de l'EAD",
          headers: [
            "Nom et Prénoms",
            "Grade",
            "Mention /Etablissement d'origine",
            "Diplôme et spécialité",
            "Domaine de compétences",
            "Nombre de publications dans la thématiques de l'EAD",
          ],
          rows: [
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
          ],
        },
        {
          title: "2.2.2 Fiche Équipe d'accueil : EAD 2",
          rows: [["Xxxxx"]],
          noHeader: true,
        },
        {
          title: "2.2.3 Fiche Équipe d'accueil : EAD 3",
          rows: [["x xxxx"]],
          noHeader: true,
        },
        {
          title: "2.3 Organigramme fonctionnel de l'École Doctorale",
          description:
            "L'établissement présente ici un organigramme clair et à jour, précisant les liens hiérarchiques et fonctionnels entre : - le Directeur de l'École Doctorale, - les responsables de formation doctorale, - les équipes d'accueil, - la cellule d'assurance qualité, - et le comité d'éthique scientifique.",
          headers: [
            "Fonction",
            "Nom et prénoms",
            "Diplôme et spécialités",
            "Mission principale",
          ],
          rows: [
            ["Directeur de l'EDT", "", "", ""],
            ["Secrétaire administratif", "", "", ""],
            ["Responsable de la scolarité doctorale", "", "", ""],
            ["Responsable de la formation transversale", "", "", ""],
            ["Responsable de la cellule qualité", "", "", ""],
            ["Responsable du comité d'éthique", "", "", ""],
          ],
        },
        {
          title: "2.4 Gouvernance et fonctionnement de l'École Doctorale",
          description:
            "Cette section permet de vérifier que l'école doctorale dispose d'une gouvernance claire, participative et documentée, conformément aux textes réglementaires. Indiquez les mécanismes de fonctionnement et les preuves disponibles.",
          headers: ["Critères", "Attentes", "Preuves attendues / À joindre"],
          rows: [
            [
              "Règlement intérieur de l'École Doctorale",
              "Adopté et diffusé auprès des encadreurs et doctorants",
              "Copie validée du règlement",
            ],
            [
              "Réunions du Conseil de l'École Doctorale",
              "Minimum 2 réunions par an",
              "PV des réunions",
            ],
            [
              "Comité de thèse pour chaque doctorant",
              "Oui, obligatoire",
              "PV de création, fiches de suivi",
            ],
            [
              "Système de gestion des inscriptions",
              "Manuel ou numérique avec traçabilité",
              "Base de données, registres",
            ],
            [
              "Communication institutionnelle",
              "Guide du doctorant, site web, affichage",
              "Captures ou exemplaires",
            ],
            [
              "Intégration de la cellule qualité",
              "Participation au conseil et aux décisions",
              "PV ou rapport qualité",
            ],
          ],
        },
        {
          title:
            "2.5 Résumé narratif sur le fonctionnement de l'Ecole doctorale",
          description:
            "Décrire brièvement : - le mode de fonctionnement global de l'École Doctorale ; - les relations entre la direction, les EAD et les instances de gouvernance ; - les mécanismes de communication et de coordination ; - et les bonnes pratiques identifiées en matière de gestion, d'assurance qualité et d'éthique scientifique. (Rédiger un texte synthétique d'environ 20 à 25 lignes)",
          rows: [["", ""]],
          noHeader: true,
        },
      ],

      subsections: [],
    },
    {
      title: "III. RESSOURCES HUMAINES ET ENCADREMENT",
      content: `Ce bloc vise à évaluer la capacité d'encadrement scientifique et la qualification du personnel impliqué dans la formation doctorale. Il s'agit de vérifier la pertinence, la disponibilité et la spécialisation des encadreurs, ainsi que la présence d'un personnel administratif et technique capable de soutenir efficacement les activités de recherche.

      3.1 Ressources d'encadrement scientifique

      Cette section recense les enseignants-chercheurs habilités à encadrer des doctorants, ainsi que leur répartition par équipe et par spécialité.
      Les encadreurs doivent justifier d'une activité scientifique soutenue, attestée par des publications et des projets récents.`,

      tables: [
        {
          title: "3.1 Ressources d'encadrement scientifique",
          headers: [
            "Nom et prénoms",
            "Grade/Statut",
            "HDR (oui/non)",
            "Spécialité",
            "Équipe d'accueil",
            "Nombre de doctorants encadrés",
            "Liste des publications récentes (3 ans)",
          ],
          rows: [
            ["", "", "", "", "", "", ""],
            ["", "", "", "", "", "", ""],
            ["", "", "", "", "", "", ""],
          ],
        },
        {
          title: "3.2 Ressources enseignantes et contributives",
          description:
            "Cette section recense les enseignants et chercheurs qui interviennent dans la formation transversale, les séminaires méthodologiques ou les modules de spécialisation proposés aux doctorants.",
          headers: [
            "Nom et prénoms",
            "Grade/Statut",
            "Discipline d'enseignement",
            "Volume horaire",
            "Type d'enseignement (Cours/Séminaire/Encadrement)",
            "Etablissement d'appartenance",
          ],
          rows: [
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
          ],
        },
        {
          title: "3.3 Personnel administratif et technique",
          description:
            "Cette section concerne les personnels d'appui à la recherche : secrétaires, responsables de scolarité, techniciens de laboratoire, documentalistes, etc. Ils jouent un rôle clé dans la gestion administrative, la logistique et le suivi des doctorants.",
          headers: [
            "Nom et prénoms",
            "Titre/Fonction",
            "Qualification / grade",
            "Expériences",
            "Attribution",
          ],
          rows: [
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "", "", "", ""],
          ],
        },
        {
          title: "3.4 Activités de renforcement de capacités",
          description:
            "Décrire les formations continues ou programmes de perfectionnement suivis par les encadreurs et le personnel administratif dans les trois dernières années. Ces éléments témoignent de la dynamique de mise à niveau scientifique et managériale de l'école doctorale.",
          headers: [
            "Nom du participant",
            "Fonction / Statut",
            "Thème de la formation",
            "Organisateur / Partenaire",
            "Date / Durée",
            "Résultats ou effets attendus",
          ],
          rows: [
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
          ],
        },
        {
          title: "3.4 Analyse de conformité et besoins en renforcement",
          description:
            "(à rédiger pour 15 à 20 lignes) - Décrire la pertinence et l'équilibre entre les encadreurs HDR, les docteurs et les intervenants extérieurs. - Identifier les besoins en formation ou en recrutement. - Présenter les actions envisagées pour renforcer la capacité d'encadrement et la qualité scientifique.",
          rows: [["", ""]],
          noHeader: true,
        },
      ],

      subsections: [],
    },
    {
      title: "IV. FORMATION TRANSVERSALE ET SUIVI DES DOCTORANTS",
      content: `Ce bloc vise à évaluer la qualité de la formation proposée par l'École Doctorale, à travers les dispositifs de formation transversale, les activités scientifiques encadrées et le suivi des doctorants.
      Il s'agit de s'assurer que la formation va au-delà de la simple recherche, en développant des compétences méthodologiques, éthiques, linguistiques et professionnelles utiles à la carrière des doctorants.
      
      4.1 Formation transversale proposée
      Cette section recense les modules communs offerts aux doctorants (méthodologie, rédaction, éthique, TIC, communication, etc.).
      L'objectif est de vérifier la diversité, la régularité et la pertinence de ces formations par rapport aux besoins du doctorat.`,

      tables: [
        {
          title: "4.1 Formation transversale proposée",
          headers: [
            "Thème / Module transversal",
            "Responsable ou intervenant",
            "Volume horaire (h)",
            "Type d'activité (Cours, Séminaire, Atelier)",
            "Public concerné",
            "Justificatifs (PV, programme, syllabus)",
          ],
          rows: [
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
          ],
        },
        {
          title: "4.2 Activités scientifiques des doctorants",
          description:
            "Les doctorants doivent participer à des activités scientifiques régulières (séminaires, colloques, journées doctorales, publications, communications orales). Ce tableau permet de suivre la dynamique scientifique de la communauté doctorale.",
          headers: [
            "Type d'activité",
            "Intitulé / Thème",
            "Date / Lieu",
            "Responsable / Organisateur",
            "Nombre de participants",
            "Justificatifs (PV, photos, attestations)",
          ],
          rows: [
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
          ],
        },
        {
          title: "4.3 Dispositif de suivi des doctorants",
          description:
            "Cette section concerne les outils et mécanismes mis en place pour le suivi pédagogique, administratif et scientifique des doctorants depuis l'inscription jusqu'à la soutenance.",
          headers: [
            "Type de dispositif",
            "Description / Fonctionnement",
            "Responsable / Structure",
            "Preuves / Documents associés",
          ],
          rows: [
            [
              "Comité de thèse",
              "Décrire la composition, la fréquence des réunions et le suivi réalisé",
              "",
              "PV, rapports de suivi, fiches de progression",
            ],
            [
              "Fiche individuelle de suivi",
              "Décrire le modèle et son utilisation",
              "",
              "Exemplaire de fiche signée",
            ],
            [
              "Système d'information (base de données ou logiciel)",
              "Indiquer le nom du système et ses fonctionnalités",
              "",
              "Captures d'écran, manuels",
            ],
            [
              "Rapport annuel du doctorant",
              "Décrire la périodicité et les modalités de validation",
              "",
              "Copies des rapports signés",
            ],
            [
              "Évaluation de mi-parcours",
              "Préciser la méthode d'évaluation et les critères",
              "",
              "Grilles ou PV d'évaluation",
            ],
          ],
        },
        {
          title: "4.4 Encadrement et accompagnement des doctorants",
          description:
            "Cette section vise à vérifier la disponibilité des encadreurs, la qualité du suivi scientifique et le respect de l'éthique académique dans la relation encadreur–doctorant.",
          headers: [
            "Nom de l'encadreur principal",
            "Nombre de doctorants encadrés",
            "Fréquence de suivi (réunions/an)",
            "Moyens de communication",
            "Commentaires / Observations",
          ],
          rows: [
            ["", "", "", "", ""],
            ["", "", "", "", ""],
          ],
        },
        {
          title: "4.5 Résumé narratif",
          description:
            "(à rédiger pour 20 à 25 lignes) Présenter ici une synthèse du dispositif de formation doctorale et de suivi des doctorants : - Description des modules transversaux offerts et des activités scientifiques organisées ; - Mécanismes de suivi, d'accompagnement et d'évaluation ; - Forces et points à améliorer dans la gestion pédagogique du doctorat.",
          rows: [["", ""]],
          noHeader: true,
        },
      ],

      subsections: [],
    },
    {
      title: "V. ENVIRONNEMENT SCIENTIFIQUE ET INFRASTRUCTURES",
      content: `Ce bloc vise à évaluer la capacité matérielle, documentaire et technologique de l'établissement à soutenir la formation doctorale et la recherche scientifique.
      Il permet de vérifier que les doctorants et les équipes de recherche disposent de conditions de travail adéquates : laboratoires, bibliothèques, ressources numériques, espaces de travail et dispositifs de sécurité.
      
      5.1 Laboratoires et espaces de recherche
      Cette section concerne les laboratoires, centres et plateformes de recherche rattachés à l'École Doctorale.
      Ils doivent être fonctionnels, dotés d'équipements adaptés et accessibles aux doctorants.`,

      tables: [
        {
          title: "5.1 Laboratoires et espaces de recherche",
          headers: [
            "Intitulé du laboratoire / centre",
            "Responsable",
            "Spécialité / Domaine",
            "Équipements disponibles",
            "État de fonctionnement",
            "Preuves (PV, photos, inventaire)",
          ],
          rows: [
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
          ],
        },
        {
          title: "5.2 Bibliothèque et ressources documentaires",
          description:
            "Cette section évalue la disponibilité des ressources documentaires (physiques et numériques) nécessaires à la recherche.",
          headers: [
            "Type de ressource",
            "Description",
            "Accessibilité (heures / usagers)",
            "Volume disponible (ouvrages / titres)",
            "État / Mise à jour",
            "Justificatifs",
          ],
          rows: [
            [
              "Bibliothèque physique",
              "Décrire la taille, les espaces et les conditions d'accès",
              "",
              "",
              "",
              "",
            ],
            [
              "Fonds documentaires spécialisés",
              "Préciser les domaines concernés et la date de mise à jour",
              "",
              "",
              "",
              "",
            ],
            [
              "Accès à des bases de données",
              "Indiquer les plateformes : Scopus, DOAJ, JSTOR, etc.",
              "",
              "",
              "",
              "",
            ],
            [
              "Revues et abonnements",
              "Lister les revues disponibles, papier et électroniques",
              "",
              "",
              "",
              "",
            ],
            [
              "Salle de documentation / lecture",
              "Préciser le nombre de places et les équipements",
              "",
              "",
              "",
              "",
            ],
          ],
        },
        {
          title: "5.3 Infrastructures numériques et connectivité",
          description:
            "Cette section évalue la capacité numérique de l'établissement à soutenir la recherche et la formation en ligne (salles informatiques, plateformes d'apprentissage, internet).",
          headers: [
            "Équipement / Outil",
            "Description et localisation",
            "Capacité / Spécifications",
            "État de fonctionnement",
            "Preuves (photos, inventaire)",
          ],
          rows: [
            [
              "Salle informatique",
              "Nombre de postes et logiciels installés",
              "",
              "",
              "",
            ],
            ["Connexion Internet", "Débit moyen disponible (Mbps)", "", "", ""],
            [
              "Plateforme de formation en ligne (LMS)",
              "Ex. : Moodle, Teams, etc.",
              "",
              "",
              "",
            ],
            [
              "Matériel audiovisuel (visioconférence)",
              "Projecteurs, micros, caméras, etc.",
              "",
              "",
              "",
            ],
            [
              "Sauvegarde et sécurité numérique",
              "Serveurs, systèmes de backup, antivirus",
              "",
              "",
              "",
            ],
          ],
        },
        {
          title: "5.4 Sécurité, hygiène et accessibilité",
          description:
            "Cette section évalue les conditions de sécurité et d'hygiène dans les espaces utilisés par les doctorants et les chercheurs.",
          headers: [
            "Critère",
            "Description / État",
            "Preuves attendues (photos, rapports)",
          ],
          rows: [
            [
              "Sécurité incendie",
              "Présence d'extincteurs, issues de secours signalées",
              "",
            ],
            [
              "Hygiène des locaux",
              "Toilettes, ventilation, entretien régulier",
              "",
            ],
            [
              "Accessibilité pour personnes à mobilité réduite",
              "Rampes, ascenseurs, toilettes adaptées",
              "",
            ],
            [
              "Éclairage et aération",
              "Qualité des installations électriques et naturelles",
              "",
            ],
            [
              "Plan de sécurité institutionnel",
              "Existence d'un plan ou protocole de sécurité validé",
              "",
            ],
          ],
        },
        {
          title: "5.5 Partenariats et environnement externe",
          description:
            "Cette section recense les partenariats scientifiques et institutionnels permettant aux doctorants d'accéder à des infrastructures complémentaires (laboratoires mutualisés, archives, terrains d'étude, etc.).",
          headers: [
            "Partenaire / Institution",
            "Type de partenariat",
            "Objet / Domaine concerné",
            "Durée / Date de signature",
            "Preuves (convention, PV)",
          ],
          rows: [
            ["", "", "", "", ""],
            ["", "", "", "", ""],
          ],
        },
        {
          title: "5.6 Résumé narratif",
          description:
            "Présenter une synthèse de l'environnement matériel et scientifique de l'école : - description des espaces de recherche et d'apprentissage ; - accessibilité et qualité des ressources documentaires ; - état des infrastructures numériques et de sécurité ; - partenariats scientifiques structurants. (Rédiger un texte synthétique de 20 à 25 lignes maximum.)",
          rows: [["", ""]],
          noHeader: true,
        },
      ],

      subsections: [],
    },
    {
      title: "VI. PRODUCTION SCIENTIFIQUE ET INTEGRITE ACADEMIQUE",
      content: `Ce bloc évalue la performance scientifique de l'École Doctorale et la qualité des productions de recherche réalisées par les encadreurs et les doctorants.
      Il vérifie également l'existence d'une politique institutionnelle d'intégrité scientifique, incluant la prévention du plagiat et la lutte contre les revues et conférences prédatrices.

      6.1 Publications scientifiques des enseignants-chercheurs et encadreurs
      Cette section recense les publications issues des activités de recherche menées par les enseignants-chercheurs, encadreurs et membres des équipes d'accueil doctorales.`,

      tables: [
        {
          title:
            "6.1 Publications scientifiques des enseignants-chercheurs et encadreurs",
          headers: [
            "Nom de l'auteur / encadreur",
            "Titre de la publication",
            "Revue / Acte / Ouvrage",
            "Année",
            "Indexation (Scopus, DOAJ, etc.)",
            "DOI / Lien",
            "Observation",
          ],
          rows: [
            ["", "", "", "", "", "", ""],
            ["", "", "", "", "", "", ""],
          ],
        },
        {
          title:
            "6.2 Publications scientifiques et communications des doctorants",
          description:
            "Cette section concerne les productions individuelles des doctorants (articles, posters, communications, rapports, ouvrages collectifs).",
          headers: [
            "Nom du doctorant",
            "Titre de la publication / communication",
            "Revue / Événement",
            "Date / Lieu",
            "Encadreur associé",
            "Preuve / DOI",
            "Observation",
          ],
          rows: [
            ["", "", "", "", "", "", ""],
            ["", "", "", "", "", "", ""],
          ],
        },
        {
          title: "6.3 Activités de recherche et projets collectifs",
          description:
            "Décrire ici les projets, programmes ou activités de recherche collectives portés par les équipes d'accueil doctorales, en lien avec les priorités nationales et institutionnelles.",
          headers: [
            "Titre du projet / programme",
            "Équipe / Responsable",
            "Partenaires",
            "Financement / Durée",
            "Résultats ou produits attendus",
            "Preuves (PV, convention, rapport)",
          ],
          rows: [
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
          ],
        },
        {
          title:
            "6.4 Politique institutionnelle contre les revues et conférences prédatrices",
          description:
            "Cette section évalue les mesures institutionnelles mises en place pour prévenir les publications et conférences prédatrices, qui nuisent à la crédibilité de la recherche.",
          headers: [
            "Titre du projet / programme",
            "Équipe / Responsable",
            "Partenaires",
          ],
          rows: [
            [
              "Existence d'une politique anti-revues prédatrices",
              "Oui / Non – Décrire le document institutionnel adopté",
              "Copie de la politique signée",
            ],
            [
              "Liste des revues autorisées / validées",
              "Ex. : DOAJ, Scopus, Web of Science, etc.",
              "Liste officielle validée par le conseil scientifique",
            ],
            [
              "Sensibilisation des doctorants et encadreurs",
              "Séances de formation ou modules de formation transversale",
              "PV, programmes, supports de formation",
            ],
            [
              "Procédure de validation des publications",
              "Validation obligatoire par le comité scientifique avant soumission",
              "Fiches de validation, PV",
            ],
            [
              "Sanctions et procédures internes",
              "Existence d'un règlement en cas de manquement",
              "Extrait du règlement intérieur",
            ],
            [
              "Suivi annuel des publications",
              "Contrôle par la cellule d'assurance qualité",
              "Rapport AQ annuel",
            ],
          ],
        },
        {
          title: "6.5 Lutte contre le plagiat et intégrité scientifique",
          description:
            "Cette sous-section concerne les dispositifs mis en place pour garantir la probité scientifique des travaux de recherche et des thèses.",
          headers: [
            "Dispositif / Outil",
            "Description",
            "Responsable",
            "Preuves (rapports, captures, règlements)",
          ],
          rows: [
            [
              "Logiciel anti-plagiat utilisé",
              "Ex. : Turnitin, Compilatio, PlagScan, etc.",
              "",
              "",
            ],
            [
              "Charte d'intégrité scientifique",
              "Document signé par doctorants et encadreurs",
              "",
              "",
            ],
            [
              "Comité d'éthique / intégrité",
              "Composition et fréquence des réunions",
              "",
              "",
            ],
            [
              "Sensibilisation à l'éthique scientifique",
              "Ateliers ou modules de formation",
              "",
              "",
            ],
          ],
        },
        {
          title: "6.6 Résumé narratif",
          description:
            "Présenter une synthèse de la production scientifique et de la politique d'intégrité : - résultats et productions notables des cinq dernières années ; - activités de recherche en cours et projets collaboratifs ; - existence et mise en œuvre de la politique d'intégrité et de prévention des dérives scientifiques. (Rédiger un texte synthétique d'environ 20 à 25 lignes.)",
          rows: [["", ""]],
          noHeader: true,
        },
      ],

      subsections: [],
    },
    {
      title:
        "VII. SUIVI DES DOCTORANTS, DEBOUCHES ET INSERTION PROFESSIONNELLE",
      content: `Ce bloc vise à mesurer l'efficacité du dispositif de suivi des doctorants et la pertinence socio-économique de la formation doctorale.
      Il s'agit d'évaluer la capacité de l'École Doctorale à :
      - assurer le suivi régulier des doctorants jusqu'à la soutenance ;
      - collecter et exploiter les données de réussite et d'insertion ;
      - maintenir le contact avec les anciens doctorants pour le suivi post-formation.

      7.1 Suivi des doctorants inscrits
      Cette section vise à vérifier que les doctorants sont effectivement suivis tout au long de leur parcours (inscription, progression, soutenance).`,

      tables: [
        {
          title: "7.1 Suivi des doctorants inscrits",
          headers: [
            "Année académique",
            "Nombre de doctorants inscrits",
            "Nombre de soutenances",
            "Taux de soutenance (%)",
            "Durée moyenne des thèses (ans)",
            "Commentaires / Observations",
          ],
          rows: [
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
          ],
        },
        {
          title: "7.2 Résultats académiques et production des diplômés",
          description:
            "Présente les résultats des doctorants diplômés : thèses soutenues, distinctions, publications issues des travaux.",
          headers: [
            "Année",
            "Nombre de thèses soutenues",
            "Thèses avec publications associées",
            "Distinctions / Prix obtenus",
            "Observations",
          ],
          rows: [
            ["", "", "", "", ""],
            ["", "", "", "", ""],
          ],
        },
        {
          title: "7.3 Insertion professionnelle des diplômés",
          description:
            "Cette section mesure l'impact réel du doctorat sur l'employabilité et la valorisation des compétences des diplômés.",
          headers: [
            "Cohorte / Année de diplomation",
            "Nombre total de diplômés",
            "Diplômés insérés (emploi / projet)",
            "Taux d'insertion (%)",
            "Type d'emploi / secteur",
            "Sources de données (enquêtes, attestations)",
          ],
          rows: [
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
          ],
        },
        {
          title: "7.4 Réseau des anciens (alumni) et suivi post-doctorat",
          description:
            "Cette section évalue l'existence et l'efficacité du réseau des anciens doctorants et les activités de suivi après la formation.",
          headers: [
            "Structure / dispositif alumni",
            "Date de mise en place",
            "Responsable",
            "Activités réalisées (5 dernières années)",
            "Outils de communication (site, base de données, réseau social)",
            "Preuves / documents associés",
          ],
          rows: [
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
          ],
        },
        {
          title: "7.5 – Valorisation et impact de la recherche doctorale",
          description:
            "Cette section valorise l'apport des travaux de thèse : contribution scientifique, innovation, impact socio-économique.",
          headers: [
            "Structure / dispositif alumni",
            "Date de mise en place",
            "Responsable",
            "Activités réalisées (5 dernières années)",
            "Outils de communication (site, base de données, réseau social)",
            "Preuves / documents associés",
          ],
          rows: [
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
          ],
        },
        {
          title: "7.6 Résumé narratif",
          description:
            "Présenter une synthèse sur : - la progression des doctorants et les taux de réussite ; - les stratégies d'insertion professionnelle et les partenariats ; - le fonctionnement du réseau des anciens ; - les retombées scientifiques et sociétales des travaux doctoraux. (Texte attendu : 20 à 25 lignes maximum)",
          rows: [["", ""]],
          noHeader: true,
        },
      ],

      subsections: [],
    },
    {
      title: "VIII. GOUVERNANCE, ETHIQUE ET ASSURANCE QUALITE",
      content: `Ce bloc vise à évaluer la qualité du pilotage institutionnel, le respect de l'éthique académique, et la mise en œuvre d'un système interne d'assurance qualité au sein de l'École Doctorale.
      Il permet de vérifier si l'école doctorale dispose de mécanismes transparents pour garantir l'intégrité scientifique, la redevabilité et l'amélioration continue de ses activités.

      8.1 Structure de gouvernance et instances de décision
      Cette section vérifie l'existence et le fonctionnement effectif des organes de pilotage et de décision au sein de l'École Doctorale.`,

      tables: [
        {
          title: "8.1 Structure de gouvernance et instances de décision",
          headers: [
            "Instance / Organe",
            "Composition",
            "Fréquence de réunion",
            "Attributions principales",
            "Preuves (PV, arrêtés, rapports)",
          ],
          rows: [
            [
              "Conseil de l'École Doctorale",
              "Liste des membres et leurs fonctions",
              "",
              "",
              "",
            ],
            [
              "Direction de l'École Doctorale",
              "Directeur, adjoints, cellule administrative",
              "",
              "",
              "",
            ],
            [
              "Comité scientifique / pédagogique",
              "Membres, rôles, compétences",
              "",
              "",
              "",
            ],
            [
              "Comité de thèse",
              "Composition et mode de fonctionnement",
              "",
              "",
              "",
            ],
          ],
        },
        {
          title: "8.2 Charte du doctorat et cadre réglementaire interne",
          description:
            "Cette section évalue les instruments de régulation interne : chartes, règlements, codes et documents contractuels encadrant les relations entre les acteurs de l'école doctorale.",
          headers: [
            "Document",
            "Contenu principal",
            "Date de validation / révision",
            "Preuves (copies signées / PV d'adoption)",
          ],
          rows: [
            [
              "Charte de thèse",
              "Engagements du doctorant, de l'encadreur et de l'institution",
              "",
              "",
            ],
            [
              "Règlement intérieur",
              "Modalités de fonctionnement de l'école doctorale",
              "",
              "",
            ],
            [
              "Contrat doctoral / fiche d'engagement",
              "Droits et obligations du doctorant",
              "",
              "",
            ],
            [
              "Code d'éthique et d'intégrité scientifique",
              "Règles de conduite et d'intégrité",
              "",
              "",
            ],
          ],
        },
        {
          title: "8.3 Comité d'éthique et intégrité scientifique",
          description:
            "Cette section évalue la mise en place et le fonctionnement du comité d'éthique, garant de la conformité scientifique, de la probité et du respect des valeurs institutionnelles.",
          headers: ["Élément", "Description / Détails", "Preuves à fournir"],
          rows: [
            [
              "Composition du comité",
              "Noms, spécialités, rattachements institutionnels",
              "Liste signée, arrêté de nomination",
            ],
            [
              "Mandat et attributions",
              "Rôle du comité dans la validation des projets et le contrôle éthique",
              "PV de réunions, extraits de statuts",
            ],
            [
              "Fréquence des réunions",
              "Nombre de sessions annuelles et modalités de rapport",
              "Rapports ou comptes rendus",
            ],
            [
              "Sensibilisation à l'éthique",
              "Actions de formation et d'information réalisées auprès des doctorants",
              "Supports, attestations, photos",
            ],
          ],
        },
        {
          title: "8.4 Démarche interne d'assurance qualité",
          description:
            "Cette section examine le dispositif de suivi-évaluation interne et les mécanismes d'amélioration continue mis en place dans l'école doctorale.",
          headers: [
            "Domaine évalué",
            "Méthode d'évaluation",
            "Fréquence / Responsable",
            "Preuves / Rapports produits",
          ],
          rows: [
            [
              "Formation doctorale",
              "Évaluations semestrielles, bilans de modules",
              "",
              "",
            ],
            [
              "Recherche scientifique",
              "Suivi des publications et des projets",
              "",
              "",
            ],
            [
              "Encadrement",
              "Suivi de charge et autoévaluation des encadreurs",
              "",
              "",
            ],
            [
              "Satisfaction des doctorants",
              "Enquêtes de satisfaction / entretiens",
              "",
              "",
            ],
            [
              "Gouvernance / fonctionnement",
              "Audit interne, analyse de performance",
              "",
              "",
            ],
          ],
        },
        {
          title: "8.5 Plan d'amélioration continue",
          description:
            "Décrire les principales actions prévues pour renforcer la qualité, la gouvernance et la transparence du fonctionnement de l'école doctorale.",
          headers: [
            "Action prévue",
            "Objectif visé",
            "Responsable",
            "Échéance",
            "Ressources nécessaires",
            "Indicateur de suivi / Preuves attendues",
          ],
          rows: [
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
          ],
        },
        {
          title:
            "8.6 Publication du rapport annuel et transparence institutionnelle",
          description:
            "Cette section évalue la communication et la diffusion des informations relatives aux activités et résultats de l'école doctorale.",
          headers: [
            "Type de rapport / document",
            "Contenu principal",
            "Mode de diffusion (site, affichage, email)",
            "Périodicité",
            "Preuves",
          ],
          rows: [
            [
              "Rapport annuel d'activités",
              "Résultats, taux de soutenance, insertion, projets",
              "",
              "",
              "",
            ],
            [
              "Rapport d'autoévaluation",
              "Diagnostic qualité et propositions d'amélioration",
              "",
              "",
              "",
            ],
            [
              "Bilan financier (si applicable)",
              "Budget, dépenses, appuis, partenariats",
              "",
              "",
              "",
            ],
            [
              "Communication institutionnelle",
              "Bulletins, infolettres, site web, réseaux",
              "",
              "",
              "",
            ],
          ],
        },
        {
          title: "8.7 Résumé narratif",
          description:
            "Présenter une synthèse sur : - les mécanismes de gouvernance et de coordination interne ; - le fonctionnement du comité d'éthique et du dispositif qualité ; - les actions d'amélioration continue entreprises ; - la politique de transparence et de communication institutionnelle. (Rédiger un texte de 20 à 25 lignes)",
          rows: [["", ""]],
          noHeader: true,
        },
      ],

      subsections: [],
    },
    {
      title: "IX. Annexes",
      content: `• Arrêté de création de l'établissement et statuts
      • Décision de création de l'École Doctorale (signé par les instances)
      • Règlement intérieur de l'école doctorale
      • CVs et diplômes des responsables de l'Ecole Doctorale, membres des équipes d'accueil et des encadreurs HDR
      • Convention(s) de partenariat scientifique
      • Liste des publications par équipes d'accueil.`,

      tables: [],
      subsections: [],
    },
  ],
};

const CreerDemandeHabilitation = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [hasReadCanevas, setHasReadCanevas] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  const currentType = typesDemandes.find((t) => t.id === selectedType);
  const pageTitle = currentType
    ? currentType.fullTitle
    : "Créer une demande d'habilitation";

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

  const handleSelectType = (typeId) => {
    setSelectedType(typeId);
    setHasReadCanevas(false);
    scrollToTop();
  };

  const handleStartForm = () => {
    if (hasReadCanevas && selectedType) {
      const type = typesDemandes.find((t) => t.id === selectedType);
      navigate(type.path);
    }
  };

  const renderPageHeader = () => (
    <div className="text-center mb-6 md:mb-8 lg:mb-12 bg-white pb-4 md:pb-6 border-b border-gray-200 sticky top-0 z-10">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 px-2 sm:px-4">
        {pageTitle}
      </h1>
    </div>
  );

  // Fonction pour rendre un tableau avec bordures complètes et responsive
  const renderTable = (table, index) => {
    if (!table) return null;

    return (
      <div key={index} className="mb-4 md:mb-6">
        {table.title && (
          <h6 className="font-medium text-gray-700 mb-2 text-sm md:text-base">
            {table.title}
          </h6>
        )}
        {table.description && (
          <p className="text-xs sm:text-sm text-gray-600 mb-2 whitespace-pre-line">
            {table.description}
          </p>
        )}
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-2 sm:px-0">
            <div className="overflow-hidden border border-gray-300 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                {table.multiHeader ? (
                  <>
                    <thead className="bg-gray-50">
                      <tr>
                        {table.headers.map((header, i) => (
                          <th
                            key={i}
                            className="px-2 py-2 sm:px-3 md:px-4 border border-gray-300 text-left font-medium text-gray-700 whitespace-normal break-words"
                            colSpan={header === "Domaine/Grade" ? 2 : 1}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                      <tr>
                        {table.subHeaders.map((subHeader, i) => (
                          <th
                            key={i}
                            className="px-2 py-2 sm:px-3 md:px-4 border border-gray-300 text-left font-medium text-gray-700 whitespace-normal break-words"
                          >
                            {subHeader}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {table.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-2 py-2 sm:px-3 md:px-4 border border-gray-300 whitespace-normal break-words"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </>
                ) : table.multiRow ? (
                  <>
                    <thead className="bg-gray-50">
                      <tr>
                        {table.headers.map((header, i) => (
                          <th
                            key={i}
                            className="px-2 py-2 sm:px-3 md:px-4 border border-gray-300 text-left font-medium text-gray-700 whitespace-normal break-words"
                            colSpan={i === 0 ? 2 : 1}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {table.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-2 py-2 sm:px-3 md:px-4 border border-gray-300 whitespace-normal break-words"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </>
                ) : table.noHeader ? (
                  <tbody className="bg-white">
                    {table.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-2 py-2 sm:px-3 md:px-4 border border-gray-300 whitespace-normal break-words"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                ) : table.colSpan ? (
                  <>
                    <thead className="bg-gray-50">
                      <tr>
                        {table.headers.map((header, i) => (
                          <th
                            key={i}
                            className="px-2 py-2 sm:px-3 md:px-4 border border-gray-300 text-left font-medium text-gray-700 whitespace-normal break-words"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {table.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          <td className="px-2 py-2 sm:px-3 md:px-4 border border-gray-300 font-medium whitespace-normal break-words">
                            {row[0]}
                          </td>
                          <td className="px-2 py-2 sm:px-3 md:px-4 border border-gray-300 whitespace-normal break-words">
                            {row[1]}
                          </td>
                          {row.length > 2 && (
                            <td className="px-2 py-2 sm:px-3 md:px-4 border border-gray-300 whitespace-normal break-words"></td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </>
                ) : (
                  <>
                    <thead className="bg-gray-50">
                      <tr>
                        {table.headers.map((header, i) => (
                          <th
                            key={i}
                            className="px-2 py-2 sm:px-3 md:px-4 border border-gray-300 text-left font-medium text-gray-700 whitespace-normal break-words"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {table.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-2 py-2 sm:px-3 md:px-4 border border-gray-300 whitespace-normal break-words"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fonction pour rendre une section avec son contenu et ses tableaux
  const renderSection = (section, sectionIndex) => {
    return (
      <div key={sectionIndex} className="border-t border-gray-200 pt-4 md:pt-6">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
          {section.title}
        </h3>
        <div className="text-xs sm:text-sm md:text-base">
          {section.content.split("\n").map((line, idx) => {
            if (line.trim().startsWith("•")) {
              return (
                <li
                  key={idx}
                  className="ml-3 sm:ml-4 md:ml-6 mb-1 text-gray-700 list-disc text-xs sm:text-sm md:text-base"
                >
                  {line.trim().substring(1).trim()}
                </li>
              );
            }
            if (line.trim().match(/^\d+\./)) {
              return (
                <h4
                  key={idx}
                  className="font-semibold mt-3 md:mt-4 mb-1 md:mb-2 text-gray-800 text-sm sm:text-base md:text-lg"
                >
                  {line}
                </h4>
              );
            }
            if (line.trim() === "") {
              return <div key={idx} className="h-1 md:h-2"></div>;
            }
            if (line.trim().match(/^\d+\.\d+/)) {
              return (
                <h5
                  key={idx}
                  className="font-medium text-gray-700 mb-1 mt-2 md:mt-3 text-xs sm:text-sm md:text-base"
                >
                  {line}
                </h5>
              );
            }
            return (
              <p
                key={idx}
                className="text-gray-700 mb-1 md:mb-2 whitespace-pre-line text-xs sm:text-sm md:text-base"
              >
                {line}
              </p>
            );
          })}

          {section.tables &&
            section.tables.map((table, idx) => renderTable(table, idx))}
        </div>
      </div>
    );
  };

  // Bouton de retour en haut
  const renderScrollTopButton = () => {
    if (!showScrollTop) return null;

    return (
      <button
        onClick={scrollToTop}
        className="fixed z-50 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        aria-label="Retour en haut"
        style={{
          bottom: "1rem",
          right: "1rem",
          padding:
            window.innerWidth < 640
              ? "0.6rem"
              : window.innerWidth < 768
                ? "0.75rem"
                : "1rem",
        }}
      >
        <svg
          className={
            window.innerWidth < 640
              ? "w-4 h-4"
              : window.innerWidth < 768
                ? "w-5 h-5"
                : "w-6 h-6"
          }
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

  // Rendu du contenu selon le type sélectionné
  const renderCanevasContent = () => {
    if (!selectedType) return null;

    const canevasData =
      selectedType === "licence"
        ? canevasLicence
        : selectedType === "master"
          ? canevasMaster
          : canevasDoctorat;
    const bgColor =
      selectedType === "licence"
        ? "blue"
        : selectedType === "master"
          ? "indigo"
          : "purple";

    return (
      <div
        className={`bg-white rounded-xl shadow-sm border border-${bgColor}-200 overflow-hidden mb-6 md:mb-8 lg:mb-10`}
      >
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="text-gray-800 text-justify leading-relaxed space-y-4 md:space-y-6 lg:space-y-8">
            {/* INTRODUCTION */}
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                INTRODUCTION
              </h2>
              <div className="text-xs sm:text-sm md:text-base">
                {selectedType !== "doctorat" ? (
                  <>
                    <p className="mb-2 md:mb-3">
                      Ce canevas constitue une trame minimale que chaque
                      établissement d'enseignement supérieur doit renseigner
                      dans le cadre d'une demande d'habilitation de formation :
                    </p>
                    <ul className="mb-2 md:mb-3 pl-3 sm:pl-4 md:pl-5 space-y-1 text-xs sm:text-sm md:text-base">
                      <li>
                        • Il précise les informations essentielles attendues et
                        les justificatifs à fournir.
                      </li>
                      <li>
                        • L'examen des dossiers par la Commission nationale
                        d'habilitation (CNH) se fera sur la base des éléments
                        présentés, mais la pertinence des demandes dépendra
                        avant tout de la qualité et de l'authenticité des
                        preuves fournies.
                      </li>
                      <li>
                        • Les établissements sont donc invités à préparer leurs
                        dossiers avec rigueur, transparence et esprit de
                        responsabilité, afin de garantir la crédibilité et la
                        qualité de l'offre de formation proposée.
                      </li>
                    </ul>

                    <p className="mb-2 md:mb-3 font-medium">
                      La structure du cahier de charges suit une logique en{" "}
                      {selectedType === "licence" ? "huit" : "neuf"} blocs
                      complémentaires :
                    </p>

                    <div className="mb-2 md:mb-3 pl-3 sm:pl-4 md:pl-5 space-y-1 text-xs sm:text-sm md:text-base">
                      {selectedType === "master" ? (
                        <>
                          <p>
                            <span className="font-medium">
                              1) Informations institutionnelles :
                            </span>{" "}
                            éléments de recevabilité et documents fondateurs.
                          </p>
                          <p>
                            <span className="font-medium">
                              2) Politique et environnement de recherche
                            </span>
                          </p>
                          <p>
                            <span className="font-medium">
                              3) Pertinence et justification de l'offre de
                              formation :
                            </span>{" "}
                            diagnostic et opportunité de la formation.
                          </p>
                          <p>
                            <span className="font-medium">
                              4) Ressources humaines :
                            </span>{" "}
                            compétences et qualifications des enseignants.
                          </p>
                          <p>
                            <span className="font-medium">
                              5) Ressources matérielles et infrastructures :
                            </span>{" "}
                            capacités d'accueil et équipements.
                          </p>
                          <p>
                            <span className="font-medium">
                              6) Dispositif pédagogique et maquette (conformité
                              LMD) :
                            </span>{" "}
                            organisation académique et progression des études.
                          </p>
                          <p>
                            <span className="font-medium">
                              7) Système d'évaluation des apprentissages :
                            </span>{" "}
                            modalités, règlements et traçabilité.
                          </p>
                          <p>
                            <span className="font-medium">
                              8) Performances académiques et insertion
                              professionnelle :
                            </span>{" "}
                            résultats et insertion professionnelle
                          </p>
                          <p>
                            <span className="font-medium">
                              9) Gouvernance et assurance qualité :
                            </span>{" "}
                            pilotage et dispositifs d'amélioration continue.
                          </p>
                        </>
                      ) : selectedType === "licence" ? (
                        <>
                          <p>
                            <span className="font-medium">
                              1) Informations institutionnelles :
                            </span>{" "}
                            éléments de recevabilité et documents fondateurs.
                          </p>
                          <p>
                            <span className="font-medium">
                              2) Pertinence et justification de l'offre de
                              formation :
                            </span>{" "}
                            diagnostic et opportunité de la formation.
                          </p>
                          <p>
                            <span className="font-medium">
                              3) Ressources humaines :
                            </span>{" "}
                            compétences et qualifications des enseignants.
                          </p>
                          <p>
                            <span className="font-medium">
                              4) Ressources matérielles et infrastructures :
                            </span>{" "}
                            capacités d'accueil et équipements.
                          </p>
                          <p>
                            <span className="font-medium">
                              5) Dispositif pédagogique et maquette (conformité
                              LMD) :
                            </span>{" "}
                            organisation académique et progression des études.
                          </p>
                          <p>
                            <span className="font-medium">
                              6) Système d'évaluation des apprentissages :
                            </span>{" "}
                            modalités, règlements et traçabilité.
                          </p>
                          <p>
                            <span className="font-medium">
                              7) Performances académiques et insertion
                              professionnelle :
                            </span>{" "}
                            résultats et insertion professionnelle
                          </p>
                          <p>
                            <span className="font-medium">
                              8) Gouvernance et assurance qualité :
                            </span>{" "}
                            pilotage et dispositifs d'amélioration continue.
                          </p>
                        </>
                      ) : null}
                    </div>

                    <p>
                      Cette organisation permet d'évaluer de manière cohérente
                      et progressive la capacité d'un établissement à proposer
                      une formation pertinente, conforme au système LMD et
                      soutenable dans la durée.
                    </p>
                  </>
                ) : (
                  <div className="whitespace-pre-line">
                    {canevasData.introduction}
                  </div>
                )}
              </div>
            </div>

            {/* Sections */}
            {canevasData.sections.map((section, index) =>
              renderSection(section, index),
            )}

            {/* Remarque finale */}
            <div className="mt-4 p-3 sm:p-4 bg-yellow-50 text-xs sm:text-sm">
              <p className="font-bold text-yellow-800 mb-1">Remarque:</p>
              <p className="text-yellow-700">
                TOUTE INFORMATION FOURNIE DOIT ETRE APPUYEE PAR DES PIÈCES
                JUSTIFICATIVES. LA QUALITE ET L'AUTHENTICITE DES PREUVES SONT
                DETERMINANTES POUR LA DECISION D'HABILITATION.
              </p>
            </div>
          </div>
        </div>

        {/* Section d'acceptation */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 bg-white border-t border-gray-200">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="text-center">
                <label
                  htmlFor="accept-canevas"
                  className="text-gray-700 flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
                >
                  <input
                    id="accept-canevas"
                    type="checkbox"
                    checked={hasReadCanevas}
                    onChange={(e) => setHasReadCanevas(e.target.checked)}
                    className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium">
                    J'ai pris connaissance du canevas et je m'engage à fournir
                    des informations complètes, exactes et conformes aux
                    exigences.
                  </span>
                </label>
                <p className="text-xs text-red-600 font-medium mt-1">
                  (obligatoire)
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleStartForm}
                disabled={!hasReadCanevas}
                className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
              >
                <span>Passer au formulaire</span>
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
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
    );
  };

  return (
    <div className="min-h-screen bg-white py-3 sm:py-4 md:py-6 lg:py-8 px-2 sm:px-3 md:px-4 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {renderPageHeader()}

        {/* Sélecteur de type de demande */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          {typesDemandes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleSelectType(type.id)}
              className={`
                relative group bg-white rounded-lg sm:rounded-xl shadow border p-3 sm:p-4 md:p-6 text-left transition-all duration-200
                hover:shadow-lg hover:border-${type.color}-500
                ${
                  selectedType === type.id
                    ? `border-${type.color}-600 bg-${type.color}-50/60 shadow-md`
                    : "border-gray-200"
                }
              `}
            >
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 md:mb-3">
                {type.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {type.id === "licence"
                  ? "Formation de Licence (LMD)"
                  : type.id === "master"
                    ? "Formation de Master (recherche / professionnel)"
                    : "Doctorat / École Doctorale"}
              </p>

              {selectedType === type.id && (
                <span
                  className={`absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 bg-${type.color}-100 text-${type.color}-800 text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full`}
                >
                  Sélectionné
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contenu du canevas sélectionné */}
        {selectedType && renderCanevasContent()}

        {/* Message si aucun type sélectionné */}
        {!selectedType && (
          <div className="text-center text-gray-500 mt-8 sm:mt-10 md:mt-12 text-sm sm:text-base md:text-lg">
            Sélectionnez un type de demande ci-dessus pour voir le canevas
            correspondant
          </div>
        )}
      </div>

      {/* Bouton de retour en haut */}
      {renderScrollTopButton()}

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
};

export default CreerDemandeHabilitation;
