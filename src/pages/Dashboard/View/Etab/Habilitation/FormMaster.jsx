import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaCheck,
  FaInfoCircle,
  FaPlus,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaFileUpload,
  FaFileAlt,
  FaArrowLeft,
  FaArrowRight,
  FaBook,
  FaGraduationCap,
  FaBriefcase,
  FaGlobe,
  FaUniversity,
  FaUsers,
  FaChartLine,
  FaBuilding,
} from "react-icons/fa";

const formSteps = [
  { id: 1, title: "Présentation\nde\nl'institution" },
  {
    id: 2,
    title:
      "Politique\net\nenvironnement\nde recherche\n(obligatoire –\nspécifique Master)",
  },
  {
    id: 3,
    title: "Pertinence\net\njustification\nde la\ndemande d'habilitation",
  },
  { id: 4, title: "Organisation\ndes\nétudes" },
  { id: 5, title: "Dispositif\npédagogique\net\nmaquette" },
  { id: 6, title: "Moyens\ndisponibles" },
  {
    id: 7,
    title:
      "Gestion\ndes\nperformances\nacadémiques\net\npolitique\nd'insertion\nprofessionnelle",
  },
  { id: 8, title: "Gouvernance\net\nassurance\nqualité" },
  { id: 9, title: "Annexes" },
  { id: 10, title: "Récapitulatif" },
];

const FormMaster = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    // Section 1
    institutionInfo: true,
    offresFormations: true,
    ressourcesHumaines: true,
    infrastructures: true,
    statistiques: true,
    // Section 2
    planCadre: true,
    laboratoires: true,
    activitesScientifiques: true,
    publications: true,
    partenariats: true,
    // Section 3
    etudeSocioEconomique: true,
    effectifsPrevisionnels: true,
    partenariatsOffres: true,
    qualificationResponsables: true,
    enseignantsDedies: true,
    alignementRecherche: true,
    // Section 4
    domainesGrades: true,
    mentionsParcours: true,
    organisationParcours: true,
    passerelles: true,
    // Section 5
    descriptionMention: true,
    parcours1: true,
    parcours2: true,
    organisationPedagogique: true,
    ueSemestre7: true,
    ueSemestre8: true,
    ueSemestre9: true,
    ueSemestre10: true,
    fichesUE: true,
    // Section 6
    ressourcesHumaines: true,
    enseignantsRecap: true,
    personnelSoutien: true,
    infrastructuresMaterielles: true,
    sallesCours: true,
    laboratoiresPedagogiques: true,
    laboratoiresRecherche: true,
    documentation: true,
    espacesTravail: true,
    // Section 7
    performancesAcademiques: true,
    insertionProfessionnelle: true,
    suiviDiplomes: true,
    publicationsRecherche: true,
    // Section 8
    gouvernance: true,
    assuranceQualite: true,
    // Section 9
    annexes: true,
  });

  const [formData, setFormData] = useState({
    step1: {
      institutionInfo: {
        nomCoordonnees: "",
        statutJuridique: "",
        responsableNomPrenoms: "",
        organigramme: null,
        missionVision: "",
        planDeveloppement: "",
        dateApprobation: "",
      },
      criteres: {
        demandeOfficielle: {
          lettreOfficielle: [],
        },
        cahierCharges: {
          arreteCreation: [],
          reglementsPedagogiques: [],
          statuts: [],
        },
        gouvernanceAcademique: {
          organigramme: [],
          pvConseils: [],
          celluleQualite: [],
        },
      },
      domainesGrades: [],
      mentions: [],
      enseignantsPermanents: [],
      enseignantsVacataires: [],
      personnelAT: [],
      infrastructures: {
        sallesCours: [],
        laboratoires: [],
        bibliotheque: {
          fondsDocumentation: "",
          capacitePlaces: "",
          preuves: [],
        },
        infrastructuresNumeriques: {
          salleInformatique: { disponible: false, preuves: [] },
          connectiviteInternet: { disponible: false, preuves: [] },
          lms: { disponible: false, preuves: [] },
          sanitairesSecours: { disponible: false, preuves: [] },
          energie: { disponible: false, preuves: [] },
        },
      },
      statistiques: [],
    },
    step2: {
      planCadre: "",
      laboratoires: "",
      activitesScientifiques: "",
      publications: "",
      partenariats: "",
    },
    step3: {
      etudeBesoins: {
        diagnosticBesoins: "",
        coherenceLicences: "",
        cartographieDebouches: "",
        profilsVises: "",
        analyseFormationsSimilaires: "",
        justificationOpportunite: "",
        tableauComparatif: [],
        lettresAppui: [],
      },
      effectifsPrevisionnels: {
        justificationCohortes: "",
        seriesProjection: "",
        projections: [],
      },
      partenariatsOffres: {
        partenairesAcademiques: [],
        conventionsStages: [],
        projets: [],
      },
      qualificationResponsables: [],
      enseignantsDedies: [],
      alignementRecherche: {
        concordanceFormationRecherche: "",
        contributionFormationCadres: "",
        coherencePolitiquesPubliques: "",
      },
      pourcentageUESpecialistes: "",
      ratioEtudiantsEnseignants: "",
    },
    step4: {
      domainesGrades: [],
      mentions: [],
      organisationParcours: [],
      passerelles: [],
    },
    step5: {
      descriptionMention: {
        contexteJustification: "",
        objectifsFormation: "",
        vocation: "",
        debouchesProfessionnels: "",
      },
      parcours: [
        {
          id: 1,
          intitule: "",
          gradeDomaine: "",
          mention: "",
          vocation: "academique",
          semestresConcernes: ["S7", "S8", "S9", "S10"],
          responsableNom: "",
          responsableEmail: "",
          responsableTelephone: "",
          responsableAdresse: "",
          langueEnseignement: "Français",
          objectifParcours: "",
          organisationUE: "",
          conditionsAcces: {
            prerequis: "",
            capaciteLimitee: false,
            capaciteMax: "",
            modalitesSelection: "",
          },
          ouvertureInternationale: {
            stagesEtranger: "",
            conventions: [],
          },
          insertionProfessionnelle: "",
          poursuiteEtudes: "",
          partenariats: "",
          memoiresMaster: {
            thematiques: "",
            grilleEvaluation: "",
            encadrement: "",
          },
          ueSemestre7: [],
          ueSemestre8: [],
          ueSemestre9: [],
          ueSemestre10: [],
          recapActivites: {
            s7: { cours: 0, td: 0, tp: 0, stage: 0, total: 30 },
            s8: { cours: 0, td: 0, tp: 0, stage: 0, total: 30 },
            s9: { cours: 0, td: 0, tp: 0, stage: 0, total: 30 },
            s10: { cours: 0, td: 0, tp: 0, stage: 0, total: 30 },
          },
        },
      ],
      fichesUE: [],
      listeUE: [],
    },
    step6: {
      ressourcesHumaines: {
        enseignantsRecap: [
          {
            grades: "Professeurs titulaires",
            effectifsPermanents: "",
            effectifsVacataires: "",
            total: "",
          },
          {
            grades: "Professeurs",
            effectifsPermanents: "",
            effectifsVacataires: "",
            total: "",
          },
          {
            grades: "Maître de conférences",
            effectifsPermanents: "",
            effectifsVacataires: "",
            total: "",
          },
          {
            grades: "Autres",
            effectifsPermanents: "",
            effectifsVacataires: "",
            total: "",
          },
        ],
        tauxEncadrement: [
          {
            domaines: "",
            taux: "",
          },
        ],
        personnelSoutien: [
          {
            fonctions: "Technicien de laboratoire",
            effectifs: "",
          },
          {
            fonctions: "Bibliothécaire",
            effectifs: "",
          },
          {
            fonctions: "Agent de maintenance",
            effectifs: "",
          },
          {
            fonctions: "Secrétaire",
            effectifs: "",
          },
          {
            fonctions: "Autres",
            effectifs: "",
          },
        ],
      },
      infrastructures: {
        sallesCours: [
          { capacite: "0-20", nombre: "" },
          { capacite: "20-50", nombre: "" },
          { capacite: "50-100", nombre: "" },
          { capacite: "100-300", nombre: "" },
          { capacite: ">300", nombre: "" },
        ],
        laboratoiresPedagogiques: [],
        laboratoiresRecherche: {
          description: "",
          laboratoires: [],
        },
        documentation: {
          description: "",
          ouvragesScientifiques: "",
          ouvragesTechniques: "",
          abonnements: "",
          preuves: [],
        },
        espacesTravail: {
          localisation: "",
          capacite: "",
          equipement: "",
          fonctionnement: "",
          preuves: [],
        },
      },
    },
    step7: {
      performancesAcademiques: {
        tauxReussite: "",
        tauxPoursuite: "",
        tauxAbandon: "",
        dureeMoyenne: "",
        indicateurs: [],
        preuves: [],
      },
      insertionProfessionnelle: {
        tauxInsertion: "",
        delaiInsertion: "",
        secteursActivite: "",
        partenariatsEntreprises: "",
        dispositifAccompagnement: "",
        enquetes: [],
        preuves: [],
      },
      suiviDiplomes: {
        dispositifSuivi: "",
        baseDonnees: "",
        associationAlumni: "",
        rencontresAnciens: "",
        preuves: [],
      },
      publicationsRecherche: {
        publicationsMemoires: "",
        nombrePublications: "",
        revues: "",
        conferences: "",
        poursuiteDoctorat: "",
        listePublications: [],
        preuves: [],
      },
    },
    step8: {
      gouvernance: {
        comitePedagogique: {
          composition: "",
          roles: "",
          frequenceReunions: "",
          pvReunions: [],
        },
        comiteScientifique: {
          composition: "",
          roles: "",
          frequenceReunions: "",
          pvReunions: [],
        },
        coordinationAdministrative: {
          composition: "",
          roles: "",
          contact: "",
        },
        implicationsEtudiants: {
          representation: "",
          participationInstances: "",
          evaluationEnseignements: "",
        },
      },
      assuranceQualite: {
        structure: {
          nom: "",
          composition: "",
          rattachement: "",
          contact: "",
        },
        planOperationnel: {
          objectifs: "",
          actions: "",
          indicateurs: "",
          calendrier: "",
          rapports: [],
        },
        procedures: {
          evaluationInterne: "",
          evaluationExterne: "",
          revisionProgrammes: "",
          gestionReclamations: "",
        },
        preuves: [],
      },
    },
    step9: {
      annexes: {
        cvEtLettresEngagement: [],
        conventionsPartenariats: [],
        autresDocuments: [],
      },
    },
  });

  const preventDefault = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleNext = (e) => {
    preventDefault(e);
    if (currentStep < formSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = (e) => {
    preventDefault(e);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackToCanevas = (e) => {
    preventDefault(e);
    navigate("/dashboard/etablissement/habilitation/creer-demande");
  };

  const handleSubmit = async (e) => {
    preventDefault(e);
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Demande de Master soumise avec succès !", {
        position: "top-right",
        autoClose: 4000,
      });
      setTimeout(
        () => navigate("/dashboard/etablissement/habilitation/creer-demande"),
        2000,
      );
    } catch (error) {
      toast.error("Erreur lors de la soumission", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (path, value, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!path) {
      console.warn("handleInputChange called without path");
      return;
    }
    const newFormData = { ...formData };
    const keys = path.split(".");
    let current = newFormData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFormData(newFormData);
  };

  const handleFileUpload = (path, files, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!path) {
      console.warn("handleFileUpload called without path");
      return;
    }
    const newFormData = { ...formData };
    const keys = path.split(".");
    let current = newFormData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    const fileArray = Array.from(files).slice(0, 3);
    current[keys[keys.length - 1]] = fileArray;
    setFormData(newFormData);
  };

  const handleArrayAdd = (path, newItem, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!path) {
      console.warn("handleArrayAdd called without path");
      return;
    }
    const newFormData = { ...formData };
    const keys = path.split(".");
    let current = newFormData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]].push(newItem);
    setFormData(newFormData);
  };

  const handleArrayRemove = (path, index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!path) {
      console.warn("handleArrayRemove called without path");
      return;
    }
    const newFormData = { ...formData };
    const keys = path.split(".");
    let current = newFormData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]].splice(index, 1);
    setFormData(newFormData);
  };

  const handleArrayUpdate = (path, index, field, value, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!path) {
      console.warn("handleArrayUpdate called without path");
      return;
    }
    const newFormData = { ...formData };
    const keys = path.split(".");
    let current = newFormData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]][index][field] = value;
    setFormData(newFormData);
  };

  const handleParcoursUpdate = (parcoursIndex, field, value, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const newFormData = { ...formData };
    newFormData.step5.parcours[parcoursIndex][field] = value;
    setFormData(newFormData);
  };

  const handleParcoursNestedUpdate = (parcoursIndex, parentField, field, value, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const newFormData = { ...formData };
    newFormData.step5.parcours[parcoursIndex][parentField][field] = value;
    setFormData(newFormData);
  };

  const handleUEAdd = (parcoursIndex, semestre, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const newFormData = { ...formData };
    const newUE = {
      id: Date.now(),
      code: "",
      intitule: "",
      credits: "",
      responsable: "",
      statut: "obligatoire",
      cm: "",
      td: "",
      tp: "",
      autres: "",
      travailPersonnel: "",
    };
    newFormData.step5.parcours[parcoursIndex][`ue${semestre}`].push(newUE);
    setFormData(newFormData);
  };

  const handleUERemove = (parcoursIndex, semestre, ueIndex, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const newFormData = { ...formData };
    newFormData.step5.parcours[parcoursIndex][`ue${semestre}`].splice(
      ueIndex,
      1,
    );
    setFormData(newFormData);
  };

  const handleUEUpdate = (
    parcoursIndex,
    semestre,
    ueIndex,
    field,
    value,
    e,
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const newFormData = { ...formData };
    newFormData.step5.parcours[parcoursIndex][`ue${semestre}`][ueIndex][field] =
      value;

    const ues = newFormData.step5.parcours[parcoursIndex][`ue${semestre}`];
    let totalCredits = 0;
    let totalCM = 0;
    let totalTD = 0;
    let totalTP = 0;
    let totalStage = 0;

    ues.forEach((ue) => {
      totalCredits += parseInt(ue.credits) || 0;
      totalCM += parseInt(ue.cm) || 0;
      totalTD += parseInt(ue.td) || 0;
      totalTP += parseInt(ue.tp) || 0;
      if (
        semestre === "Semestre10" &&
        ue.intitule && ue.intitule.toLowerCase().includes("stage")
      ) {
        totalStage += parseInt(ue.autres) || 0;
      }
    });

    const semestreKey = `s${semestre.replace("Semestre", "").toLowerCase()}`;
    newFormData.step5.parcours[parcoursIndex].recapActivites[semestreKey] = {
      cours: totalCM,
      td: totalTD,
      tp: totalTP,
      stage: totalStage,
      total: totalCredits,
    };

    setFormData(newFormData);
  };

  const handleFicheUEAdd = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const newFormData = { ...formData };
    const newFiche = {
      id: Date.now(),
      gradeDomaine: "",
      intitule: "",
      code: "",
      responsable: "",
      equipePedagogique: [],
      intervenantsExternes: [],
      statut: {
        parcours: "",
        statutUE: "obligatoire",
        semestre: "",
      },
      credits: "",
      objectifs: "",
      prerequis: "",
      matieres: [],
      modalitesControle: [],
      nbMinEtudiants: "",
      nbMaxEtudiants: "",
      noteEliminatoire: "",
      syllabus: "",
      pedagogie: "",
    };
    newFormData.step5.fichesUE.push(newFiche);
    setFormData(newFormData);
  };

  const handleFicheUEUpdate = (index, field, value) => {
    const newFormData = { ...formData };
    newFormData.step5.fichesUE[index][field] = value;
    setFormData(newFormData);
  };

  const handleFicheUEMatieresAdd = (ficheIndex, matiere) => {
    const newFormData = { ...formData };
    if (!newFormData.step5.fichesUE[ficheIndex].matieres) {
      newFormData.step5.fichesUE[ficheIndex].matieres = [];
    }
    newFormData.step5.fichesUE[ficheIndex].matieres.push(matiere);
    setFormData(newFormData);
  };

  const handleFicheUEMatieresRemove = (ficheIndex, matiereIndex) => {
    const newFormData = { ...formData };
    newFormData.step5.fichesUE[ficheIndex].matieres.splice(matiereIndex, 1);
    setFormData(newFormData);
  };

  const handleFicheUEModalitesAdd = (ficheIndex) => {
    const newFormData = { ...formData };
    if (!newFormData.step5.fichesUE[ficheIndex].modalitesControle) {
      newFormData.step5.fichesUE[ficheIndex].modalitesControle = [];
    }
    newFormData.step5.fichesUE[ficheIndex].modalitesControle.push({
      ueEc: "",
      nature: "ecrit",
      continu: "",
      terminal: "",
      rattrapage: true,
      compensation: true,
      traçabilité: true,
    });
    setFormData(newFormData);
  };

  const toggleSection = (section, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const progressPercentage =
    formSteps.length > 1
      ? ((currentStep - 1) / (formSteps.length - 1)) * 100
      : 0;

  const Section = ({ title, section, description, icon: Icon, children }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
      <div
        className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSection(section, e);
        }}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="text-indigo-600 text-xl" />}
          <div>
            <h3 className="text-xl font-semibold text-indigo-800">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          className="text-gray-500 hover:text-indigo-600"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSection(section, e);
          }}
        >
          <svg
            className={`w-6 h-6 transform transition-transform ${expandedSections[section] ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
      {expandedSections[section] && <div className="p-6">{children}</div>}
    </div>
  );

  const TextAreaField = ({
    label,
    path,
    placeholder = "",
    description = "",
    required = true,
  }) => {
    const getValue = () => {
      if (!path) return "";
      const keys = path.split(".");
      let current = formData;
      for (let i = 0; i < keys.length; i++) {
        current = current?.[keys[i]];
      }
      return current || "";
    };

    const handleChange = (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleInputChange(path, e.target.value, e);
    };

    return (
      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-2">
          <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {description && (
            <span className="text-xs text-gray-500 italic">
              ({description})
            </span>
          )}
        </div>
        <textarea
          value={getValue()}
          onChange={handleChange}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[120px] resize-y"
          placeholder={placeholder}
        />
      </div>
    );
  };

  const InputField = ({
    label,
    path,
    type = "text",
    placeholder = "",
    required = true,
    rows,
  }) => {
    const getValue = () => {
      if (!path) return "";
      const keys = path.split(".");
      let current = formData;
      for (let i = 0; i < keys.length; i++) {
        current = current?.[keys[i]];
      }
      return current || "";
    };

    const commonClasses =
      "w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none";

    const handleChange = (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleInputChange(path, e.target.value, e);
    };

    return (
      <div onClick={(e) => e.stopPropagation()}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {rows ? (
          <textarea
            value={getValue()}
            onChange={handleChange}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className={commonClasses}
            rows={rows}
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            value={getValue()}
            onChange={handleChange}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className={commonClasses}
            placeholder={placeholder}
          />
        )}
      </div>
    );
  };

  const FileUpload = ({
    path,
    label,
    accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
    multiple = true,
    maxSize = 8,
  }) => {
    const [isDragging, setIsDragging] = useState(false);

    const getFileIcon = (fileName) => {
      const ext = (fileName || "").split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png", "gif", "bmp"].includes(ext)) {
        return "🖼️";
      } else if (ext === "pdf") {
        return "📄";
      } else if (["doc", "docx"].includes(ext)) {
        return "📝";
      } else {
        return "📎";
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(path, files, e);
      }
    };

    const getCurrentFiles = () => {
      if (!path) return [];
      const keys = path.split(".");
      let current = formData;
      for (let i = 0; i < keys.length; i++) {
        current = current?.[keys[i]];
      }
      return current || [];
    };

    const currentFiles = getCurrentFiles();

    const handleFileInputChange = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.target.files.length > 0) {
        handleFileUpload(path, e.target.files, e);
      }
    };

    const handleRemoveFile = (index, e) => {
      e.preventDefault();
      e.stopPropagation();
      const newFiles = [...currentFiles];
      newFiles.splice(index, 1);
      const fakeEvent = { target: { files: newFiles } };
      handleFileUpload(path, fakeEvent.target.files, e);
    };

    return (
      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
        <label className="block text-xs font-medium text-gray-700">
          {label} <span className="text-red-500">*</span>
        </label>

        <div
          className={`relative border border-gray-300 rounded-lg p-3 transition-all ${
            isDragging
              ? "border-indigo-500 bg-indigo-50"
              : "hover:border-indigo-400 hover:bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={(e) => e.preventDefault()}
        >
          <input
            type="file"
            multiple={multiple}
            accept={accept}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileInputChange}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            id={(path || "").replace(/\./g, "-")}
          />

          <div className="text-center">
            <svg
              className="mx-auto h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            <p className="mt-1 text-xs text-gray-600">
              <span className="font-semibold text-indigo-600">Cliquez</span> ou
              glissez-déposez
            </p>
            <p className="text-[10px] text-gray-500">
              {multiple ? `Max ${multiple ? "3" : ""} fichiers • ` : ""}
              {maxSize} Mo max • {accept.replace(/\./g, "").replace(/,/g, ", ")}
            </p>
          </div>
        </div>

        {currentFiles.length > 0 && (
          <div className="mt-1 space-y-1">
            <p className="text-[10px] font-medium text-gray-600">
              Fichiers ({currentFiles.length}) :
            </p>
            {currentFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-1.5 border border-gray-200 rounded"
              >
                <div className="flex items-center space-x-1.5 min-w-0">
                  <span className="text-sm">{getFileIcon(file.name)}</span>
                  <div className="truncate">
                    <p className="text-xs font-medium text-gray-700 truncate max-w-[150px]">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} Mo
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleRemoveFile(index, e)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="text-red-500 hover:text-red-700 p-0.5"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const TableauFormation = ({
    items,
    onAdd,
    onRemove,
    onUpdate,
    title,
    columns,
    addButtonText = "Ajouter une ligne",
    emptyMessage = "Aucune donnée",
  }) => {
    const [expandedItems, setExpandedItems] = useState(items.map(() => true));

    const toggleItem = (index, e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const newExpanded = [...expandedItems];
      newExpanded[index] = !newExpanded[index];
      setExpandedItems(newExpanded);
    };

    useEffect(() => {
      if (items.length > expandedItems.length) {
        setExpandedItems([
          ...expandedItems,
          ...new Array(items.length - expandedItems.length).fill(true),
        ]);
      } else if (items.length < expandedItems.length) {
        setExpandedItems(expandedItems.slice(0, items.length));
      }
    }, [items.length]);

    const handleRemoveClick = (index, e) => {
      e.preventDefault();
      e.stopPropagation();
      onRemove(index, e);
    };

    const handleToggleClick = (index, e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleItem(index, e);
    };

    const handleSelectChange = (index, field, value, e) => {
      e.preventDefault();
      e.stopPropagation();
      onUpdate(index, field, value, e);
    };

    const handleInputChange = (index, field, value, e) => {
      e.preventDefault();
      e.stopPropagation();
      onUpdate(index, field, value, e);
    };

    return (
      <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
        <h4 className="text-lg font-medium text-gray-800">{title}</h4>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <FaInfoCircle className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-blue-700 text-sm">
                Veuillez renseigner tous les éléments demandés ci-dessous.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div
                className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                onClick={(e) => handleToggleClick(index, e)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded flex items-center justify-center">
                    <span className="text-indigo-600 text-xs font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-800">
                    {title} {index + 1}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleRemoveClick(index, e)}
                    onMouseDown={(e) => e.stopPropagation()}
                    className={`p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors ${items.length <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={items.length <= 1}
                  >
                    <FaTimes size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleToggleClick(index, e)}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors"
                  >
                    {expandedItems[index] ? (
                      <FaChevronUp size={14} />
                    ) : (
                      <FaChevronDown size={14} />
                    )}
                  </button>
                </div>
              </div>

              {expandedItems[index] && (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {columns.map((col) => (
                      <div
                        key={col.field}
                        className={col.fullWidth ? "md:col-span-2" : ""}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {col.label}{" "}
                          {col.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>
                        {col.type === "select" ? (
                          <select
                            value={item[col.field] || ""}
                            onChange={(e) =>
                              handleSelectChange(
                                index,
                                col.field,
                                e.target.value,
                                e,
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          >
                            <option value="">
                              {col.placeholder || `Sélectionner ${col.label}`}
                            </option>
                            {col.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : col.type === "file" ? (
                          <div onClick={(e) => e.stopPropagation()}>
                            <div className="border border-gray-300 rounded-lg p-3 hover:border-indigo-400 transition-colors">
                              <input
                                type="file"
                                onChange={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onUpdate(
                                    index,
                                    col.field,
                                    e.target.files[0],
                                    e,
                                  );
                                }}
                                onClick={(e) => e.preventDefault()}
                                onMouseDown={(e) => e.stopPropagation()}
                                className="hidden"
                                id={`file-${col.field}-${index}`}
                                accept={
                                  col.accept ||
                                  ".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                }
                              />
                              <label
                                htmlFor={`file-${col.field}-${index}`}
                                className="cursor-pointer text-gray-600 hover:text-indigo-600 transition-colors flex flex-col items-center"
                                onClick={(e) => e.preventDefault()}
                              >
                                <FaFileUpload className="text-xl mb-2" />
                                <div className="text-sm text-center">
                                  {item[col.field] && item[col.field].name
                                    ? "Fichier sélectionné"
                                    : col.placeholder ||
                                      "Cliquez pour sélectionner un fichier"}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {col.accept
                                    ?.replace(/\./g, "")
                                    .replace(/,/g, ", ") ||
                                    "PDF, DOC, JPG, PNG"}{" "}
                                  (max 8 Mo)
                                </div>
                              </label>
                            </div>
                            {item[col.field] && item[col.field].name && (
                              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FaFileAlt className="text-green-600" />
                                  <span className="text-green-700 text-sm">
                                    {item[col.field].name}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onUpdate(index, col.field, null, e);
                                  }}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTimes size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <input
                            type={col.type || "text"}
                            value={item[col.field] || ""}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                col.field,
                                e.target.value,
                                e,
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            placeholder={
                              col.placeholder || `Saisir ${col.label}`
                            }
                            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm w-full"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAdd(e);
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <FaPlus />
          <span>{addButtonText}</span>
        </button>
      </div>
    );
  };

  const UETable = ({ parcoursIndex, semestre, title }) => {
    const ues = formData.step5.parcours[parcoursIndex][`ue${semestre}`] || [];
    const semestreKey = `s${semestre.replace("Semestre", "").toLowerCase()}`;
    const recap =
      formData.step5.parcours[parcoursIndex].recapActivites[semestreKey];

    return (
      <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h5 className="font-medium text-gray-800">{title}</h5>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Intitulé UE
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Crédits
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Responsable
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  CM (h)
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  TD (h)
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  TP (h)
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Autres (h)
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Travail pers.
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ues.map((ue, ueIndex) => (
                <tr key={ue.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={ue.code || ""}
                      onChange={(e) =>
                        handleUEUpdate(
                          parcoursIndex,
                          semestre,
                          ueIndex,
                          "code",
                          e.target.value,
                          e,
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Ex: UE701"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={ue.intitule || ""}
                      onChange={(e) =>
                        handleUEUpdate(
                          parcoursIndex,
                          semestre,
                          ueIndex,
                          "intitule",
                          e.target.value,
                          e,
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-40 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Intitulé"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={ue.credits || ""}
                      onChange={(e) =>
                        handleUEUpdate(
                          parcoursIndex,
                          semestre,
                          ueIndex,
                          "credits",
                          e.target.value,
                          e,
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="ECTS"
                      min="0"
                      max="30"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={ue.responsable || ""}
                      onChange={(e) =>
                        handleUEUpdate(
                          parcoursIndex,
                          semestre,
                          ueIndex,
                          "responsable",
                          e.target.value,
                          e,
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Responsable"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={ue.statut || "obligatoire"}
                      onChange={(e) =>
                        handleUEUpdate(
                          parcoursIndex,
                          semestre,
                          ueIndex,
                          "statut",
                          e.target.value,
                          e,
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="obligatoire">Obligatoire</option>
                      <option value="optionnelle">Optionnelle</option>
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={ue.cm || ""}
                      onChange={(e) =>
                        handleUEUpdate(
                          parcoursIndex,
                          semestre,
                          ueIndex,
                          "cm",
                          e.target.value,
                          e,
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="h"
                      min="0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={ue.td || ""}
                      onChange={(e) =>
                        handleUEUpdate(
                          parcoursIndex,
                          semestre,
                          ueIndex,
                          "td",
                          e.target.value,
                          e,
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="h"
                      min="0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={ue.tp || ""}
                      onChange={(e) =>
                        handleUEUpdate(
                          parcoursIndex,
                          semestre,
                          ueIndex,
                          "tp",
                          e.target.value,
                          e,
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="h"
                      min="0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={ue.autres || ""}
                      onChange={(e) =>
                        handleUEUpdate(
                          parcoursIndex,
                          semestre,
                          ueIndex,
                          "autres",
                          e.target.value,
                          e,
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="h"
                      min="0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={ue.travailPersonnel || ""}
                      onChange={(e) =>
                        handleUEUpdate(
                          parcoursIndex,
                          semestre,
                          ueIndex,
                          "travailPersonnel",
                          e.target.value,
                          e,
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="h"
                      min="0"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={(e) =>
                        handleUERemove(parcoursIndex, semestre, ueIndex, e)
                      }
                      onMouseDown={(e) => e.stopPropagation()}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTimes size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td
                  colSpan="2"
                  className="px-3 py-2 text-right font-medium text-gray-700"
                >
                  Total
                </td>
                <td className="px-3 py-2 font-medium text-indigo-700">
                  {recap?.total || 0} ECTS
                </td>
                <td colSpan="2"></td>
                <td className="px-3 py-2 font-medium text-indigo-700">
                  {recap?.cours || 0}h
                </td>
                <td className="px-3 py-2 font-medium text-indigo-700">
                  {recap?.td || 0}h
                </td>
                <td className="px-3 py-2 font-medium text-indigo-700">
                  {recap?.tp || 0}h
                </td>
                <td className="px-3 py-2 font-medium text-indigo-700">
                  {recap?.stage || 0}h
                </td>
                <td colSpan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm"
            onClick={(e) => handleUEAdd(parcoursIndex, semestre, e)}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <FaPlus size={12} />
            Ajouter une UE
          </button>
        </div>
      </div>
    );
  };

  const RecapActivitesTable = ({ parcoursIndex }) => {
    const recap = formData.step5.parcours[parcoursIndex]?.recapActivites || {};

    const calculatePercentages = (semestre) => {
      const s = semestre || { cours: 0, td: 0, tp: 0, stage: 0 };
      const total =
        (s.cours || 0) + (s.td || 0) + (s.tp || 0) + (s.stage || 0) || 1;
      return {
        cours: (((s.cours || 0) / total) * 100).toFixed(1),
        td: (((s.td || 0) / total) * 100).toFixed(1),
        tp: (((s.tp || 0) / total) * 100).toFixed(1),
        stage: (((s.stage || 0) / total) * 100).toFixed(1),
      };
    };

    return (
      <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h5 className="font-medium text-gray-800">
            Récapitulatif des activités pédagogiques
          </h5>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Semestre
                </th>
                <th
                  colSpan="2"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-200"
                >
                  Cours
                </th>
                <th
                  colSpan="2"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-200"
                >
                  TD
                </th>
                <th
                  colSpan="2"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-200"
                >
                  TP
                </th>
                <th
                  colSpan="2"
                  className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-200"
                >
                  Stage
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-gray-200">
                  Total ECTS
                </th>
              </tr>
              <tr className="bg-gray-100">
                <th className="px-4 py-2"></th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600">
                  %
                </th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600">
                  heures
                </th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 border-l border-gray-200">
                  %
                </th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600">
                  heures
                </th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 border-l border-gray-200">
                  %
                </th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600">
                  heures
                </th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 border-l border-gray-200">
                  %
                </th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600">
                  heures
                </th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 border-l border-gray-200">
                  ECTS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {["S7", "S8", "S9", "S10"].map((sem, idx) => {
                const semKey = `s${sem.toLowerCase()}`;
                const data = recap[semKey] || {
                  cours: 0,
                  td: 0,
                  tp: 0,
                  stage: 0,
                  total: 0,
                };
                const percentages = calculatePercentages(data);

                return (
                  <tr key={sem} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {sem}
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-gray-700">
                      {percentages.cours}%
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-gray-700">
                      {data.cours || 0}h
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-gray-700 border-l border-gray-200">
                      {percentages.td}%
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-gray-700">
                      {data.td || 0}h
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-gray-700 border-l border-gray-200">
                      {percentages.tp}%
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-gray-700">
                      {data.tp || 0}h
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-gray-700 border-l border-gray-200">
                      {percentages.stage}%
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-gray-700">
                      {data.stage || 0}h
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-gray-700 border-l border-gray-200 font-medium">
                      {data.total || 0} ECTS
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-4 py-3 font-medium text-gray-800">Total</td>
                <td
                  colSpan="2"
                  className="px-2 py-3 text-center font-medium text-indigo-700"
                >
                  {Object.values(recap).reduce(
                    (acc, s) => acc + (s?.cours || 0),
                    0,
                  )}
                  h
                </td>
                <td
                  colSpan="2"
                  className="px-2 py-3 text-center font-medium text-indigo-700 border-l border-gray-200"
                >
                  {Object.values(recap).reduce(
                    (acc, s) => acc + (s?.td || 0),
                    0,
                  )}
                  h
                </td>
                <td
                  colSpan="2"
                  className="px-2 py-3 text-center font-medium text-indigo-700 border-l border-gray-200"
                >
                  {Object.values(recap).reduce(
                    (acc, s) => acc + (s?.tp || 0),
                    0,
                  )}
                  h
                </td>
                <td
                  colSpan="2"
                  className="px-2 py-3 text-center font-medium text-indigo-700 border-l border-gray-200"
                >
                  {Object.values(recap).reduce(
                    (acc, s) => acc + (s?.stage || 0),
                    0,
                  )}
                  h
                </td>
                <td className="px-2 py-3 text-center font-medium text-indigo-700 border-l border-gray-200">
                  {Object.values(recap).reduce(
                    (acc, s) => acc + (s?.total || 0),
                    0,
                  )}{" "}
                  ECTS
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const FicheUEModal = ({ fiche, index }) => {
    const [showMatiereForm, setShowMatiereForm] = useState(false);
    const [newMatiere, setNewMatiere] = useState({
      nom: "",
      cm: "",
      td: "",
      tp: "",
      autres: "",
      travailPersonnel: "",
    });

    const handleAddMatiere = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const newFiches = [...formData.step5.fichesUE];
      if (!newFiches[index].matieres) {
        newFiches[index].matieres = [];
      }
      newFiches[index].matieres.push(newMatiere);
      setFormData({ ...formData, step5: { ...formData.step5, fichesUE: newFiches } });
      setNewMatiere({
        nom: "",
        cm: "",
        td: "",
        tp: "",
        autres: "",
        travailPersonnel: "",
      });
      setShowMatiereForm(false);
    };

    const handleMatiereRemove = (mIndex, e) => {
      e.preventDefault();
      e.stopPropagation();
      const newFiches = [...formData.step5.fichesUE];
      newFiches[index].matieres = newFiches[index].matieres.filter(
        (_, i) => i !== mIndex,
      );
      setFormData({ ...formData, step5: { ...formData.step5, fichesUE: newFiches } });
    };

    const handleMatiereUpdate = (mIndex, field, value, e) => {
      e.preventDefault();
      e.stopPropagation();
      const newFiches = [...formData.step5.fichesUE];
      newFiches[index].matieres[mIndex][field] = value;
      setFormData({ ...formData, step5: { ...formData.step5, fichesUE: newFiches } });
    };

    const handleModaliteUpdate = (mIndex, field, value) => {
      const newFiches = [...formData.step5.fichesUE];
      if (!newFiches[index].modalitesControle) {
        newFiches[index].modalitesControle = [];
      }
      newFiches[index].modalitesControle[mIndex][field] = value;
      setFormData({ ...formData, step5: { ...formData.step5, fichesUE: newFiches } });
    };

    return (
      <div className="border border-gray-200 rounded-lg p-6 mb-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <InputField
            label="Grade / Domaine concerné"
            path={`step5.fichesUE.${index}.gradeDomaine`}
            placeholder="Ex: Sciences et Technologies / Master"
          />
          <InputField
            label="Intitulé de l'UE"
            path={`step5.fichesUE.${index}.intitule`}
            placeholder="Ex: Analyse numérique avancée"
          />
          <InputField
            label="Code et numéro"
            path={`step5.fichesUE.${index}.code`}
            placeholder="Ex: MTH-701 (max 15 caractères)"
          />
          <InputField
            label="Responsable"
            path={`step5.fichesUE.${index}.responsable`}
            placeholder="Nom et coordonnées du responsable"
          />
          <InputField
            label="Statut de l'UE (parcours concernés)"
            path={`step5.fichesUE.${index}.statut.parcours`}
            placeholder="Ex: Parcours Mathématiques"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut dans le parcours
            </label>
            <select
              value={fiche.statut?.statutUE || "obligatoire"}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const newFiches = [...formData.step5.fichesUE];
                newFiches[index].statut = {
                  ...newFiches[index].statut,
                  statutUE: e.target.value,
                };
                setFormData({ ...formData, step5: { ...formData.step5, fichesUE: newFiches } });
              }}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="obligatoire">UE Obligatoire</option>
              <option value="optionnelle">UE Optionnelle</option>
              <option value="transversale">UE Transversale</option>
              <option value="methodologique">UE Méthodologique</option>
              <option value="decouverte">UE de découverte</option>
            </select>
          </div>
          <InputField
            label="Semestre"
            path={`step5.fichesUE.${index}.statut.semestre`}
            placeholder="Ex: S7"
          />
          <InputField
            label="Valeur en crédits (ECTS)"
            path={`step5.fichesUE.${index}.credits`}
            type="number"
            placeholder="Ex: 6"
          />
        </div>

        <div className="space-y-4 mb-6">
          <TextAreaField
            label="Objectifs visés"
            path={`step5.fichesUE.${index}.objectifs`}
            placeholder="Décrivez ce que l'étudiant doit acquérir comme compétences après le succès à cette UE"
            rows={3}
          />

          <TextAreaField
            label="Pré-requis"
            path={`step5.fichesUE.${index}.prerequis`}
            placeholder="Connaissances requises pour suivre cette UE"
            rows={2}
          />
        </div>

        <div className="mb-6">
          <h6 className="text-md font-medium text-gray-800 mb-3">
            Nature des activités pédagogiques
          </h6>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                    Matières (EC)
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                    CM (h)
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                    TD (h)
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                    TP (h)
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                    Autres (h)
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                    Total
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                    Travail pers.
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {fiche.matieres?.map((matiere, mIndex) => (
                  <tr key={mIndex} className="border-t border-gray-200">
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={matiere.nom || ""}
                        onChange={(e) =>
                          handleMatiereUpdate(mIndex, "nom", e.target.value, e)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Nom de la matière"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={matiere.cm || ""}
                        onChange={(e) =>
                          handleMatiereUpdate(mIndex, "cm", e.target.value, e)
                        }
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        min="0"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={matiere.td || ""}
                        onChange={(e) =>
                          handleMatiereUpdate(mIndex, "td", e.target.value, e)
                        }
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        min="0"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={matiere.tp || ""}
                        onChange={(e) =>
                          handleMatiereUpdate(mIndex, "tp", e.target.value, e)
                        }
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        min="0"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={matiere.autres || ""}
                        onChange={(e) =>
                          handleMatiereUpdate(mIndex, "autres", e.target.value, e)
                        }
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        min="0"
                        placeholder="Stage, projet..."
                      />
                    </td>
                    <td className="px-3 py-2 text-center text-sm font-medium text-indigo-700">
                      {(parseInt(matiere.cm) || 0) +
                        (parseInt(matiere.td) || 0) +
                        (parseInt(matiere.tp) || 0) +
                        (parseInt(matiere.autres) || 0)}
                      h
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={matiere.travailPersonnel || ""}
                        onChange={(e) =>
                          handleMatiereUpdate(mIndex, "travailPersonnel", e.target.value, e)
                        }
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        min="0"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={(e) => handleMatiereRemove(mIndex, e)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="8" className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setShowMatiereForm(!showMatiereForm)}
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      <FaPlus size={12} />
                      Ajouter une matière
                    </button>
                  </td>
                </tr>
                {showMatiereForm && (
                  <tr>
                    <td colSpan="8" className="px-3 py-2 bg-gray-50">
                      <div className="grid grid-cols-7 gap-2">
                        <input
                          type="text"
                          value={newMatiere.nom}
                          onChange={(e) =>
                            setNewMatiere({
                              ...newMatiere,
                              nom: e.target.value,
                            })
                          }
                          className="col-span-2 px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Nom de la matière"
                        />
                        <input
                          type="number"
                          value={newMatiere.cm}
                          onChange={(e) =>
                            setNewMatiere({ ...newMatiere, cm: e.target.value })
                          }
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="CM"
                        />
                        <input
                          type="number"
                          value={newMatiere.td}
                          onChange={(e) =>
                            setNewMatiere({ ...newMatiere, td: e.target.value })
                          }
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="TD"
                        />
                        <input
                          type="number"
                          value={newMatiere.tp}
                          onChange={(e) =>
                            setNewMatiere({ ...newMatiere, tp: e.target.value })
                          }
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="TP"
                        />
                        <input
                          type="number"
                          value={newMatiere.autres}
                          onChange={(e) =>
                            setNewMatiere({
                              ...newMatiere,
                              autres: e.target.value,
                            })
                          }
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Autres"
                        />
                        <button
                          type="button"
                          onClick={handleAddMatiere}
                          className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                        >
                          Ajouter
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <h6 className="text-md font-medium text-gray-800 mb-3">
            Modalités de contrôle des connaissances
          </h6>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                    UE/EC
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                    Nature
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                    Contrôle continu
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                    Terminal
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                    Rattrapage
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                    Compensation
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                    Traçabilité
                  </th>
                </tr>
              </thead>
              <tbody>
                {fiche.modalitesControle?.map((modalite, mIndex) => (
                  <tr key={mIndex} className="border-t border-gray-200">
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={modalite.ueEc || ""}
                        onChange={(e) => {
                          const newFiches = [...formData.step5.fichesUE];
                          newFiches[index].modalitesControle[mIndex].ueEc = e.target.value;
                          setFormData({ ...formData, step5: { ...formData.step5, fichesUE: newFiches } });
                        }}
                        className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Ex: cours de bio"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={modalite.nature || "ecrit"}
                        onChange={(e) => {
                          const newFiches = [...formData.step5.fichesUE];
                          newFiches[index].modalitesControle[mIndex].nature = e.target.value;
                          setFormData({ ...formData, step5: { ...formData.step5, fichesUE: newFiches } });
                        }}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="ecrit">Écrit</option>
                        <option value="oral">Oral</option>
                        <option value="pratique">Pratique</option>
                        <option value="manip">Manipulation</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={modalite.continu || ""}
                        onChange={(e) => {
                          const newFiches = [...formData.step5.fichesUE];
                          newFiches[index].modalitesControle[mIndex].continu = e.target.value;
                          setFormData({ ...formData, step5: { ...formData.step5, fichesUE: newFiches } });
                        }}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        min="0"
                        max="1"
                        step="0.1"
                        placeholder="0.5"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={modalite.terminal || ""}
                        onChange={(e) => {
                          const newFiches = [...formData.step5.fichesUE];
                          newFiches[index].modalitesControle[mIndex].terminal = e.target.value;
                          setFormData({ ...formData, step5: { ...formData.step5, fichesUE: newFiches } });
                        }}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        min="0"
                        max="1"
                        step="0.1"
                        placeholder="0.5"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={modalite.rattrapage || false}
                        onChange={(e) => {
                          const newFiches = [...formData.step5.fichesUE];
                          newFiches[index].modalitesControle[mIndex].rattrapage = e.target.checked;
                          setFormData({ ...formData, step5: { ...formData.step5, fichesUE: newFiches } });
                        }}
                        className="w-4 h-4 text-indigo-600"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={modalite.compensation || false}
                        onChange={(e) => {
                          const newFiches = [...formData.step5.fichesUE];
                          newFiches[index].modalitesControle[mIndex].compensation = e.target.checked;
                          setFormData({ ...formData, step5: { ...formData.step5, fichesUE: newFiches } });
                        }}
                        className="w-4 h-4 text-indigo-600"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={modalite.traçabilité || false}
                        onChange={(e) => {
                          const newFiches = [...formData.step5.fichesUE];
                          newFiches[index].modalitesControle[mIndex].traçabilité = e.target.checked;
                          setFormData({ ...formData, step5: { ...formData.step5, fichesUE: newFiches } });
                        }}
                        className="w-4 h-4 text-indigo-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="7" className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newFiches = [...formData.step5.fichesUE];
                        if (!newFiches[index].modalitesControle) {
                          newFiches[index].modalitesControle = [];
                        }
                        newFiches[index].modalitesControle.push({
                          ueEc: "",
                          nature: "ecrit",
                          continu: "",
                          terminal: "",
                          rattrapage: true,
                          compensation: true,
                          traçabilité: true,
                        });
                        setFormData({ ...formData, step5: { ...formData.step5, fichesUE: newFiches } });
                      }}
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      <FaPlus size={12} />
                      Ajouter une modalité de contrôle
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            N.B : conservation des PV, listes et copies pendant au moins 3 ans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <InputField
            label="Nombre minimal d'étudiants"
            path={`step5.fichesUE.${index}.nbMinEtudiants`}
            type="number"
            placeholder="Ex: 15"
          />
          <InputField
            label="Nombre maximal d'étudiants"
            path={`step5.fichesUE.${index}.nbMaxEtudiants`}
            type="number"
            placeholder="Ex: 50"
          />
          <InputField
            label="Note éliminatoire"
            path={`step5.fichesUE.${index}.noteEliminatoire`}
            placeholder="Ex: 7/20"
          />
        </div>

        <TextAreaField
          label="Syllabus des EC avec bibliographie"
          path={`step5.fichesUE.${index}.syllabus`}
          placeholder="Décrivez les grandes lignes du programme et la bibliographie recommandée"
          rows={4}
        />

        <TextAreaField
          label="Éléments de pédagogie"
          path={`step5.fichesUE.${index}.pedagogie`}
          placeholder="Décrivez les démarches pédagogiques innovantes proposées"
          rows={3}
        />
      </div>
    );
  };

  // Nouveaux composants pour les sections 6, 7, 8, 9

  const TableauSimple = ({ items, columns, title, path }) => {
    return (
      <div className="overflow-x-auto mb-6">
        <h4 className="text-lg font-medium text-gray-800 mb-4">{title}</h4>
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.field}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.field} className="px-4 py-3">
                    {col.type === "input" ? (
                      <input
                        type="text"
                        value={item[col.field] || ""}
                        onChange={(e) => {
                          const newPath = `${path}.${index}.${col.field}`;
                          handleInputChange(newPath, e.target.value, e);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder={col.placeholder}
                      />
                    ) : (
                      item[col.field]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderFormContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* 1.1 Informations institutionnelles */}
            <Section
              title="1.1 Informations institutionnelles"
              section="institutionInfo"
              icon={FaUniversity}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Nom et coordonnées de l'institution"
                  path="step1.institutionInfo.nomCoordonnees"
                  placeholder="Ex: Université de Ouagadougou, 03 BP 7021 Ouagadougou 03, Burkina Faso"
                  rows={3}
                />

                <InputField
                  label="Statut juridique (arrêtés d'ouverture)"
                  path="step1.institutionInfo.statutJuridique"
                  placeholder="Ex: Arrêté N°2023-001/MESRSI du 15 janvier 2023"
                  rows={3}
                />

                <InputField
                  label="Nom et Prénoms du responsable"
                  path="step1.institutionInfo.responsableNomPrenoms"
                  placeholder="Ex: Pr. Jean Baptiste OUEDRAOGO"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organigramme et instance de gouvernance{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleFileUpload(
                        "step1.institutionInfo.organigramme",
                        e.target.files,
                        e,
                      );
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, DOCX, JPG, PNG • Max 8 Mo
                  </p>
                </div>

                <div className="md:col-span-2">
                  <InputField
                    label="Mission et vision de l'institution"
                    path="step1.institutionInfo.missionVision"
                    placeholder="Ex: Former des cadres de haut niveau, promouvoir la recherche scientifique et l'innovation..."
                    rows={4}
                  />
                </div>

                <div className="md:col-span-2">
                  <InputField
                    label="Plan de développement opérationnel"
                    path="step1.institutionInfo.planDeveloppement"
                    placeholder="Ex: Plan stratégique 2024-2028 : Axe 1 - Renforcement des capacités pédagogiques..."
                    rows={4}
                  />
                </div>

                <InputField
                  label="Date d'approbation du dossier"
                  path="step1.institutionInfo.dateApprobation"
                  type="date"
                  placeholder="AAAA-MM-JJ"
                />
              </div>

              <div className="mt-6">
                <h4 className="text-base font-medium mb-3 text-gray-800">
                  Critères et justificatifs requis
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border-b border-gray-200 w-1/3">
                          Critère
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase border-b border-gray-200">
                          Justificatifs requis
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-xs font-medium text-gray-900 align-top">
                          Demande officielle signée
                        </td>
                        <td className="px-4 py-3">
                          <FileUpload
                            path="step1.criteres.demandeOfficielle.lettreOfficielle"
                            label="Lettre officielle signée"
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-xs font-medium text-gray-900 align-top">
                          Cahier de charges institutionnel
                        </td>
                        <td className="px-4 py-3 space-y-3">
                          <FileUpload
                            path="step1.criteres.cahierCharges.arreteCreation"
                            label="Arrêté de création"
                          />
                          <FileUpload
                            path="step1.criteres.cahierCharges.reglementsPedagogiques"
                            label="Règlements pédagogiques internes"
                          />
                          <FileUpload
                            path="step1.criteres.cahierCharges.statuts"
                            label="Statuts et organigramme"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-xs font-medium text-gray-900 align-top">
                          Dispositif de gouvernance académique
                        </td>
                        <td className="px-4 py-3 space-y-3">
                          <FileUpload
                            path="step1.criteres.gouvernanceAcademique.organigramme"
                            label="Organigramme"
                          />
                          <FileUpload
                            path="step1.criteres.gouvernanceAcademique.pvConseils"
                            label="PV de conseils"
                          />
                          <FileUpload
                            path="step1.criteres.gouvernanceAcademique.celluleQualite"
                            label="Cellule assurance qualité"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            {/* 1.2 Offres de formations existantes */}
            <Section
              title="1.2 Offres de formations existantes"
              section="offresFormations"
              icon={FaBook}
            >
              <div className="mb-8">
                <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  Les six domaines sont : Sciences et Technologies (ST); Arts,
                  Lettres et Sciences humaines (ALSH); Sciences de l'éducation
                  (SEd); Sciences de l'ingénieur (SI); Sciences de la Santé
                  (SSa); Sciences de la Société (SSo).
                </p>

                <TableauFormation
                  title="Domaines et grades"
                  items={formData.step1.domainesGrades}
                  onAdd={(e) =>
                    handleArrayAdd(
                      "step1.domainesGrades",
                      {
                        domaine: "",
                        grade: "",
                        nomResponsable: "",
                        email: "",
                        telephone: "",
                      },
                      e,
                    )
                  }
                  onRemove={(index, e) =>
                    handleArrayRemove("step1.domainesGrades", index, e)
                  }
                  onUpdate={(index, field, value, e) =>
                    handleArrayUpdate(
                      "step1.domainesGrades",
                      index,
                      field,
                      value,
                      e,
                    )
                  }
                  addButtonText="+ Ajouter un domaine/grade"
                  columns={[
                    {
                      field: "domaine",
                      label: "Domaine",
                      required: true,
                      type: "select",
                      placeholder: "Sélectionner un domaine",
                      options: [
                        { value: "ST", label: "ST - Sciences et Technologies" },
                        {
                          value: "ALSH",
                          label: "ALSH - Arts, Lettres et Sciences humaines",
                        },
                        {
                          value: "SEd",
                          label: "SEd - Sciences de l'éducation",
                        },
                        { value: "SI", label: "SI - Sciences de l'ingénieur" },
                        { value: "SSa", label: "SSa - Sciences de la Santé" },
                        { value: "SSo", label: "SSo - Sciences de la Société" },
                      ],
                    },
                    {
                      field: "grade",
                      label: "Grade",
                      required: true,
                      type: "select",
                      placeholder: "Sélectionner un grade",
                      options: [
                        { value: "L", label: "Licence (L)" },
                        { value: "M", label: "Master (M)" },
                        { value: "D", label: "Doctorat (D)" },
                      ],
                    },
                    {
                      field: "nomResponsable",
                      label: "Nom du responsable",
                      required: true,
                      placeholder: "Ex: Dr. Jean RAKOTO",
                    },
                    {
                      field: "email",
                      label: "Email",
                      required: true,
                      placeholder: "exemple@universite.bf",
                    },
                    {
                      field: "telephone",
                      label: "Téléphone",
                      required: false,
                      placeholder: "+226 XX XX XX XX",
                    },
                  ]}
                />
              </div>

              <div>
                <TableauFormation
                  title="Mentions"
                  items={formData.step1.mentions}
                  onAdd={(e) =>
                    handleArrayAdd(
                      "step1.mentions",
                      {
                        domaine: "",
                        grade: "",
                        mention: "",
                        etablissement: "",
                        nomResponsable: "",
                        email: "",
                        telephone: "",
                      },
                      e,
                    )
                  }
                  onRemove={(index, e) =>
                    handleArrayRemove("step1.mentions", index, e)
                  }
                  onUpdate={(index, field, value, e) =>
                    handleArrayUpdate("step1.mentions", index, field, value, e)
                  }
                  addButtonText="+ Ajouter une mention"
                  columns={[
                    {
                      field: "domaine",
                      label: "Domaine",
                      required: true,
                      type: "select",
                      placeholder: "Sélectionner un domaine",
                      options: [
                        { value: "ST", label: "ST" },
                        { value: "ALSH", label: "ALSH" },
                        { value: "SEd", label: "SEd" },
                        { value: "SI", label: "SI" },
                        { value: "SSa", label: "SSa" },
                        { value: "SSo", label: "SSo" },
                      ],
                    },
                    {
                      field: "grade",
                      label: "Grade",
                      required: true,
                      type: "select",
                      placeholder: "Sélectionner un grade",
                      options: [
                        { value: "L", label: "Licence (L)" },
                        { value: "M", label: "Master (M)" },
                      ],
                    },
                    {
                      field: "mention",
                      label: "Mention",
                      required: true,
                      placeholder: "Ex: Informatique",
                    },
                    {
                      field: "etablissement",
                      label: "Établissement de rattachement",
                      required: false,
                      placeholder: "Ex: UFR Sciences",
                    },
                    {
                      field: "nomResponsable",
                      label: "Nom du responsable",
                      required: true,
                      placeholder: "Ex: Pr. Marie Claire KABORE",
                    },
                    {
                      field: "email",
                      label: "Email",
                      required: true,
                      placeholder: "responsable@universite.bf",
                    },
                    {
                      field: "telephone",
                      label: "Téléphone",
                      required: false,
                      placeholder: "+226 XX XX XX XX",
                    },
                  ]}
                />
              </div>
            </Section>

            {/* 1.3 Ressources humaines */}
            <Section
              title="1.3 Ressources humaines"
              section="ressourcesHumaines"
              icon={FaUsers}
            >
              <div className="mb-8">
                <TableauFormation
                  title="Enseignants permanents"
                  items={formData.step1.enseignantsPermanents}
                  onAdd={(e) =>
                    handleArrayAdd(
                      "step1.enseignantsPermanents",
                      {
                        nomPrenom: "",
                        diplome: "",
                        grade: "",
                        specialite: "",
                        mention: "",
                        typeIntervention: "",
                      },
                      e,
                    )
                  }
                  onRemove={(index, e) =>
                    handleArrayRemove("step1.enseignantsPermanents", index, e)
                  }
                  onUpdate={(index, field, value, e) =>
                    handleArrayUpdate(
                      "step1.enseignantsPermanents",
                      index,
                      field,
                      value,
                      e,
                    )
                  }
                  addButtonText="+ Ajouter un enseignant permanent"
                  columns={[
                    {
                      field: "nomPrenom",
                      label: "Nom et Prénom",
                      required: true,
                      placeholder: "Ex: Dr. Jean RAKOTO",
                    },
                    {
                      field: "diplome",
                      label: "Diplôme",
                      required: true,
                      placeholder: "Ex: Doctorat",
                    },
                    {
                      field: "grade",
                      label: "Grade",
                      required: true,
                      type: "select",
                      placeholder: "Sélectionner un grade",
                      options: [
                        {
                          value: "Professeur Titulaire",
                          label: "Professeur Titulaire",
                        },
                        {
                          value: "Maître de Conférences",
                          label: "Maître de Conférences",
                        },
                        {
                          value: "Maître-Assistant",
                          label: "Maître-Assistant",
                        },
                        { value: "Assistant", label: "Assistant" },
                      ],
                    },
                    {
                      field: "specialite",
                      label: "Spécialité",
                      required: true,
                      placeholder: "Ex: Informatique",
                    },
                    {
                      field: "mention",
                      label: "Mention de rattachement",
                      required: false,
                      placeholder: "Ex: Informatique",
                    },
                    {
                      field: "typeIntervention",
                      label: "Type d'intervention",
                      required: false,
                      type: "select",
                      placeholder: "Type d'intervention",
                      options: [
                        { value: "CM", label: "Cours Magistral (CM)" },
                        { value: "TD", label: "Travaux Dirigés (TD)" },
                        { value: "TP", label: "Travaux Pratiques (TP)" },
                        { value: "CM+TD", label: "CM + TD" },
                      ],
                    },
                  ]}
                />
              </div>

              <div className="mb-8">
                <TableauFormation
                  title="Enseignants vacataires"
                  items={formData.step1.enseignantsVacataires}
                  onAdd={(e) =>
                    handleArrayAdd(
                      "step1.enseignantsVacataires",
                      {
                        nomPrenom: "",
                        diplome: "",
                        grade: "",
                        specialite: "",
                        mention: "",
                        typeIntervention: "",
                      },
                      e,
                    )
                  }
                  onRemove={(index, e) =>
                    handleArrayRemove("step1.enseignantsVacataires", index, e)
                  }
                  onUpdate={(index, field, value, e) =>
                    handleArrayUpdate(
                      "step1.enseignantsVacataires",
                      index,
                      field,
                      value,
                      e,
                    )
                  }
                  addButtonText="+ Ajouter un enseignant vacataire"
                  columns={[
                    {
                      field: "nomPrenom",
                      label: "Nom et Prénom",
                      required: true,
                      placeholder: "Ex: M. Pierre ANDRIAMANGA",
                    },
                    {
                      field: "diplome",
                      label: "Diplôme",
                      required: true,
                      placeholder: "Ex: Master Professionnel",
                    },
                    {
                      field: "grade",
                      label: "Grade",
                      required: true,
                      placeholder: "Ex: Ingénieur",
                    },
                    {
                      field: "specialite",
                      label: "Spécialité",
                      required: true,
                      placeholder: "Ex: Réseaux",
                    },
                    {
                      field: "mention",
                      label: "Mention de rattachement",
                      required: false,
                      placeholder: "Ex: Informatique",
                    },
                    {
                      field: "typeIntervention",
                      label: "Type d'intervention",
                      required: false,
                      type: "select",
                      placeholder: "Type d'intervention",
                      options: [
                        { value: "CM", label: "Cours Magistral (CM)" },
                        { value: "TD", label: "Travaux Dirigés (TD)" },
                        { value: "TP", label: "Travaux Pratiques (TP)" },
                        {
                          value: "Professionnel",
                          label: "Intervention professionnelle",
                        },
                      ],
                    },
                  ]}
                />
              </div>

              <div>
                <TableauFormation
                  title="Personnel administratif et technique"
                  items={formData.step1.personnelAT}
                  onAdd={(e) =>
                    handleArrayAdd(
                      "step1.personnelAT",
                      {
                        fonction: "",
                        effectif: "",
                        preuves: null,
                      },
                      e,
                    )
                  }
                  onRemove={(index, e) =>
                    handleArrayRemove("step1.personnelAT", index, e)
                  }
                  onUpdate={(index, field, value, e) =>
                    handleArrayUpdate(
                      "step1.personnelAT",
                      index,
                      field,
                      value,
                      e,
                    )
                  }
                  addButtonText="+ Ajouter un personnel"
                  columns={[
                    {
                      field: "fonction",
                      label: "Fonction",
                      required: true,
                      placeholder: "Ex: Secrétaire pédagogique",
                    },
                    {
                      field: "effectif",
                      label: "Effectif",
                      required: true,
                      placeholder: "Ex: 3",
                    },
                    {
                      field: "preuves",
                      label: "Preuves",
                      required: false,
                      type: "file",
                      accept: ".pdf,.jpg,.jpeg,.png",
                    },
                  ]}
                />
              </div>
            </Section>

            {/* 1.4 Infrastructures */}
            <Section
              title="1.4 Infrastructures"
              section="infrastructures"
              icon={FaUniversity}
            >
              <div className="mb-8">
                <TableauFormation
                  title="Salles de cours"
                  items={formData.step1.infrastructures.sallesCours}
                  onAdd={(e) =>
                    handleArrayAdd(
                      "step1.infrastructures.sallesCours",
                      {
                        capacite: "",
                        nombre: "",
                        equipement: "",
                        preuves: null,
                      },
                      e,
                    )
                  }
                  onRemove={(index, e) =>
                    handleArrayRemove(
                      "step1.infrastructures.sallesCours",
                      index,
                      e,
                    )
                  }
                  onUpdate={(index, field, value, e) =>
                    handleArrayUpdate(
                      "step1.infrastructures.sallesCours",
                      index,
                      field,
                      value,
                      e,
                    )
                  }
                  addButtonText="+ Ajouter une salle"
                  columns={[
                    {
                      field: "capacite",
                      label: "Capacité (places)",
                      required: true,
                      type: "select",
                      placeholder: "Sélectionner la capacité",
                      options: [
                        { value: "0-20", label: "0–20 places" },
                        { value: "20-50", label: "20–50 places" },
                        { value: "50-100", label: "50–100 places" },
                        { value: "100-300", label: "100–300 places" },
                        { value: "300+", label: "Plus de 300 places" },
                      ],
                    },
                    {
                      field: "nombre",
                      label: "Nombre",
                      required: true,
                      placeholder: "Ex: 5",
                    },
                    {
                      field: "equipement",
                      label: "Équipement (VP, tableau, etc.)",
                      required: false,
                      placeholder: "Ex: Vidéoprojecteur, tableau blanc",
                    },
                    {
                      field: "preuves",
                      label: "Preuves (photos, inventaire)",
                      required: false,
                      type: "file",
                      accept: ".jpg,.jpeg,.png,.pdf",
                    },
                  ]}
                />
              </div>

              <div className="mb-8">
                <TableauFormation
                  title="Laboratoires pédagogiques / équipements"
                  items={formData.step1.infrastructures.laboratoires}
                  onAdd={(e) =>
                    handleArrayAdd(
                      "step1.infrastructures.laboratoires",
                      {
                        designation: "",
                        nombre: "",
                        preuves: null,
                      },
                      e,
                    )
                  }
                  onRemove={(index, e) =>
                    handleArrayRemove(
                      "step1.infrastructures.laboratoires",
                      index,
                      e,
                    )
                  }
                  onUpdate={(index, field, value, e) =>
                    handleArrayUpdate(
                      "step1.infrastructures.laboratoires",
                      index,
                      field,
                      value,
                      e,
                    )
                  }
                  addButtonText="+ Ajouter un équipement"
                  columns={[
                    {
                      field: "designation",
                      label: "Désignation de l'équipement",
                      required: true,
                      placeholder: "Ex: Microscope électronique",
                    },
                    {
                      field: "nombre",
                      label: "Nombre",
                      required: true,
                      placeholder: "Ex: 2",
                    },
                    {
                      field: "preuves",
                      label: "Preuves/État",
                      required: false,
                      type: "file",
                      accept: ".jpg,.jpeg,.png,.pdf",
                    },
                  ]}
                />
              </div>

              <div className="mb-8">
                <h4 className="text-lg font-medium mb-4 text-gray-800">
                  1.4.3 Bibliothèque et documentation
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Fonds/documentation"
                    path="step1.infrastructures.bibliotheque.fondsDocumentation"
                    placeholder="Ex: 5000 ouvrages, 50 abonnements à des revues scientifiques"
                    rows={3}
                  />

                  <InputField
                    label="Capacité (places)"
                    path="step1.infrastructures.bibliotheque.capacitePlaces"
                    type="number"
                    placeholder="Ex: 200"
                  />

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preuves <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors">
                      <input
                        type="file"
                        onChange={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleFileUpload(
                            "step1.infrastructures.bibliotheque.preuves",
                            e.target.files,
                            e,
                          );
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="hidden"
                        id="bibliotheque-preuves"
                        accept=".jpg,.jpeg,.png,.pdf"
                      />
                      <label
                        htmlFor="bibliotheque-preuves"
                        className="cursor-pointer text-gray-600 hover:text-indigo-600 transition-colors flex flex-col items-center"
                        onClick={(e) => e.preventDefault()}
                      >
                        <FaFileUpload className="text-xl mb-2" />
                        <div className="text-sm text-center">
                          Cliquez ou glissez-déposez
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Max 3 fichiers • 8 Mo max • pdf, jpg, png
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-4 text-gray-800">
                  1.4.4 Infrastructures numériques & hygiène/sécurité
                </h4>

                <div className="space-y-4">
                  {[
                    {
                      key: "salleInformatique",
                      label: "Salle informatique",
                      standard: "Postes fonctionnels ; logiciels requis",
                    },
                    {
                      key: "connectiviteInternet",
                      label: "Connectivité Internet",
                      standard: "≥ 1 Mbps/étudiant",
                    },
                    {
                      key: "lms",
                      label: "LMS (ex. Moodle)",
                      standard: "Accès opérationnel",
                    },
                    {
                      key: "sanitairesSecours",
                      label: "Sanitaires / issues de secours",
                      standard: "Conformes, signalétique",
                    },
                    {
                      key: "energie",
                      label: "Énergie / solution alternative",
                      standard: "Stabilité ou solution de secours",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <label
                            className="relative inline-flex items-center cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={
                                formData.step1.infrastructures
                                  .infrastructuresNumeriques[item.key]
                                  .disponible
                              }
                              onChange={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleInputChange(
                                  `step1.infrastructures.infrastructuresNumeriques.${item.key}.disponible`,
                                  e.target.checked,
                                  e,
                                );
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onMouseDown={(e) => e.stopPropagation()}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                          <h5 className="font-medium text-gray-800">
                            {item.label}
                          </h5>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {item.standard}
                      </p>

                      <div className="border border-gray-300 rounded-lg p-3 hover:border-indigo-400 transition-colors">
                        <input
                          type="file"
                          onChange={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFileUpload(
                              `step1.infrastructures.infrastructuresNumeriques.${item.key}.preuves`,
                              e.target.files,
                              e,
                            );
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="hidden"
                          id={`infra-${item.key}`}
                          accept=".jpg,.jpeg,.png,.pdf"
                        />
                        <label
                          htmlFor={`infra-${item.key}`}
                          className="cursor-pointer text-gray-600 hover:text-indigo-600 transition-colors flex flex-col items-center"
                          onClick={(e) => e.preventDefault()}
                        >
                          <FaFileUpload className="text-lg mb-1" />
                          <div className="text-xs text-center">
                            Cliquez ou glissez-déposez
                          </div>
                          <div className="text-[10px] text-gray-500 mt-1">
                            Max 3 fichiers • 8 Mo max • pdf, jpg, png
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* 1.5 Statistiques institutionnelles actuelles */}
            <Section
              title="1.5 Statistiques institutionnelles actuelles"
              section="statistiques"
              icon={FaChartLine}
            >
              <TableauFormation
                title="Statistiques institutionnelles"
                items={formData.step1.statistiques}
                onAdd={(e) =>
                  handleArrayAdd(
                    "step1.statistiques",
                    {
                      domaine: "",
                      mention: "",
                      parcours: "",
                      etudiants: "",
                      permanents: "",
                      vacataires: "",
                    },
                    e,
                  )
                }
                onRemove={(index, e) =>
                  handleArrayRemove("step1.statistiques", index, e)
                }
                onUpdate={(index, field, value, e) =>
                  handleArrayUpdate(
                    "step1.statistiques",
                    index,
                    field,
                    value,
                    e,
                  )
                }
                addButtonText="+ Ajouter une statistique"
                columns={[
                  {
                    field: "domaine",
                    label: "Domaine",
                    required: true,
                    type: "select",
                    placeholder: "Sélectionner un domaine",
                    options: [
                      {
                        value: "Sciences et Technologies",
                        label: "Sciences et Technologies",
                      },
                      {
                        value: "Arts, Lettres et Sciences humaines",
                        label: "Arts, Lettres et Sciences humaines",
                      },
                      {
                        value: "Sciences de l'éducation",
                        label: "Sciences de l'éducation",
                      },
                      {
                        value: "Sciences de l'ingénieur",
                        label: "Sciences de l'ingénieur",
                      },
                      {
                        value: "Sciences de la Santé",
                        label: "Sciences de la Santé",
                      },
                      {
                        value: "Sciences de la Société",
                        label: "Sciences de la Société",
                      },
                    ],
                  },
                  {
                    field: "mention",
                    label: "Mention",
                    required: true,
                    placeholder: "Ex: Informatique",
                  },
                  {
                    field: "parcours",
                    label: "Parcours",
                    required: false,
                    placeholder: "Ex: Génie Logiciel",
                  },
                  {
                    field: "etudiants",
                    label: "Étudiants inscrits",
                    required: true,
                    placeholder: "Ex: 150",
                  },
                  {
                    field: "permanents",
                    label: "Enseignants permanents",
                    required: true,
                    placeholder: "Ex: 8",
                  },
                  {
                    field: "vacataires",
                    label: "Enseignants vacataires",
                    required: false,
                    placeholder: "Ex: 5",
                  },
                ]}
              />

              <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-lg">
                <h4 className="text-lg font-medium mb-4 text-indigo-800">
                  📊 Indicateurs clés attendus
                </h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-200 text-indigo-800 text-xs font-bold mr-2 mt-0.5">
                      1
                    </span>
                    <span>Ratio enseignants permanents / étudiants</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-200 text-indigo-800 text-xs font-bold mr-2 mt-0.5">
                      2
                    </span>
                    <span>
                      % des enseignements assurés par des spécialistes du
                      domaine
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-200 text-indigo-800 text-xs font-bold mr-2 mt-0.5">
                      3
                    </span>
                    <span>
                      Tendance d'évolution des effectifs sur 3 ans si possible
                      (croissance, stabilité ou baisse)
                    </span>
                  </li>
                </ul>
              </div>
            </Section>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-blue-800 font-medium mb-1">
                    Politique et environnement de recherche (obligatoire –
                    spécifique Master)
                  </p>
                  <p className="text-blue-700 text-sm">
                    Ce volet est le cœur de la recevabilité du niveau Master.
                    L'établissement doit prouver qu'il dispose d'une politique
                    institutionnelle de recherche et qu'il est adossé à une ou
                    plusieurs structures de recherche actives (laboratoires,
                    centres ou équipes de recherche agréés).
                  </p>
                </div>
              </div>
            </div>

            <Section
              title="2.1 Plan cadre et thématique de recherche de l'institution"
              section="planCadre"
              description="Présentez les axes prioritaires, les projets structurants et la politique de recherche de votre institution"
              icon={FaBook}
            >
              <TextAreaField
                label="Description du plan cadre et des thématiques de recherche"
                path="step2.planCadre"
                placeholder="Décrivez de manière détaillée les axes de recherche prioritaires, les projets structurants, les thématiques émergentes et la politique d'innovation de votre institution..."
              />
            </Section>

            <Section
              title="2.2 Laboratoires et équipe de recherche de rattachement"
              section="laboratoires"
              description="Listez et décrivez les laboratoires, équipes de recherche et conditions d'accueil"
              icon={FaUsers}
            >
              <TextAreaField
                label="Description des laboratoires et équipes de recherche"
                path="step2.laboratoires"
                placeholder="Décrivez les laboratoires de recherche rattachés, les équipes de recherche, les effectifs de doctorants, les conditions d'hébergement et les plateformes techniques disponibles..."
              />
            </Section>

            <Section
              title="2.3 Activités scientifiques"
              section="activitesScientifiques"
              description="Présentez les colloques, l'encadrement et les séminaires"
              icon={FaGraduationCap}
            >
              <TextAreaField
                label="Description des activités scientifiques"
                path="step2.activitesScientifiques"
                placeholder="Décrivez les colloques et conférences organisés, l'encadrement des masters recherche et des thèses, ainsi que les séminaires de recherche réguliers..."
              />
            </Section>

            <Section
              title="2.4 Publications des enseignants permanents"
              section="publications"
              description="Renseignez les publications scientifiques récentes"
              icon={FaBook}
            >
              <TextAreaField
                label="Description des publications"
                path="step2.publications"
                placeholder="Détaillez les articles publiés dans des revues scientifiques, ouvrages et chapitres d'ouvrages, communications dans des congrès, brevets et autres productions scientifiques..."
              />
            </Section>

            <Section
              title="2.5 Partenariats scientifiques pour l'appui à la recherche"
              section="partenariats"
              description="Décrivez les collaborations et réseaux scientifiques"
              icon={FaGlobe}
            >
              <TextAreaField
                label="Description des partenariats scientifiques"
                path="step2.partenariats"
                placeholder="Décrivez les partenaires académiques, les partenaires industriels, les projets collaboratifs en cours, les conventions de recherche et les réseaux internationaux..."
              />
            </Section>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-blue-800 font-medium mb-1">
                    III. Pertinence et justification de la demande
                    d'habilitation
                  </p>
                  <p className="text-blue-700 text-sm">
                    Objectif : Démontrer l'utilité sociale et économique de la
                    formation, l'alignement aux besoins du territoire et
                    l'articulation avec l'offre existante. Il faut insister sur
                    la qualité des données et preuves fournies (Étude signée,
                    sources officielles).
                  </p>
                </div>
              </div>
            </div>

            <Section
              title="3.1 Étude socio-économique de la nouvelle offre de formation"
              section="etudeSocioEconomique"
              icon={FaChartLine}
            >
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-800">
                  3.1.1 Étude de besoins régionale / nationale
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextAreaField
                    label="Diagnostic des besoins"
                    path="step3.etudeBesoins.diagnosticBesoins"
                    placeholder="Analyse des besoins en compétences sur le territoire..."
                  />

                  <TextAreaField
                    label="Cohérence avec les parcours de grade licence existants"
                    path="step3.etudeBesoins.coherenceLicences"
                    placeholder="Articulation avec les formations de licence existantes..."
                  />

                  <TextAreaField
                    label="Cartographie des débouchés"
                    path="step3.etudeBesoins.cartographieDebouches"
                    placeholder="Secteurs d'activité, métiers visés, opportunités d'emploi..."
                  />

                  <TextAreaField
                    label="Profils visés"
                    path="step3.etudeBesoins.profilsVises"
                    placeholder="Compétences attendues, profils d'étudiants ciblés..."
                  />

                  <TextAreaField
                    label="Analyse des formations similaires"
                    path="step3.etudeBesoins.analyseFormationsSimilaires"
                    placeholder="Benchmark des formations existantes dans le même domaine..."
                  />

                  <TextAreaField
                    label="Justification d'opportunité"
                    path="step3.etudeBesoins.justificationOpportunite"
                    placeholder="Pourquoi cette formation est nécessaire maintenant ?..."
                  />
                </div>

                <div className="mt-8">
                  <TableauFormation
                    title="Tableau comparatif des formations similaires"
                    items={formData.step3.etudeBesoins.tableauComparatif}
                    onAdd={(e) =>
                      handleArrayAdd(
                        "step3.etudeBesoins.tableauComparatif",
                        {
                          etablissement: "",
                          intituleFormation: "",
                          pointsForts: "",
                          pointsFaibles: "",
                          differences: "",
                        },
                        e,
                      )
                    }
                    onRemove={(index, e) =>
                      handleArrayRemove(
                        "step3.etudeBesoins.tableauComparatif",
                        index,
                        e,
                      )
                    }
                    onUpdate={(index, field, value, e) =>
                      handleArrayUpdate(
                        "step3.etudeBesoins.tableauComparatif",
                        index,
                        field,
                        value,
                        e,
                      )
                    }
                    addButtonText="+ Ajouter une formation"
                    columns={[
                      {
                        field: "etablissement",
                        label: "Établissement",
                        required: true,
                        placeholder: "Ex: Université de Ouagadougou",
                      },
                      {
                        field: "intituleFormation",
                        label: "Intitulé de la formation",
                        required: true,
                        placeholder: "Ex: Master en Informatique",
                      },
                      {
                        field: "pointsForts",
                        label: "Points forts",
                        required: false,
                        placeholder: "Points forts de cette formation",
                      },
                      {
                        field: "pointsFaibles",
                        label: "Points faibles",
                        required: false,
                        placeholder: "Points faibles identifiés",
                      },
                      {
                        field: "differences",
                        label: "Différences avec notre projet",
                        required: false,
                        placeholder: "Ce qui distingue notre formation",
                      },
                    ]}
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Lettres d'appui (Étude signée, sources officielles){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <FileUpload
                    path="step3.etudeBesoins.lettresAppui"
                    label="Lettres d'appui"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
              </div>
            </Section>

            <Section
              title="3.1.2 Effectifs prévisionnels"
              section="effectifsPrevisionnels"
              icon={FaUsers}
            >
              <div className="space-y-6">
                <TextAreaField
                  label="Justification des cohortes annuelles (S7–S10) par rapport aux capacités d'accueil"
                  path="step3.effectifsPrevisionnels.justificationCohortes"
                  placeholder="Analyse de la capacité d'accueil et justification des effectifs prévus..."
                />

                <TextAreaField
                  label="Séries de projection et hypothèses"
                  path="step3.effectifsPrevisionnels.seriesProjection"
                  placeholder="Méthodologie de projection, hypothèses retenues (taux de réussite, attractivité, etc.)..."
                />

                <div className="mt-8">
                  <TableauFormation
                    title="Projections des effectifs"
                    items={formData.step3.effectifsPrevisionnels.projections}
                    onAdd={(e) =>
                      handleArrayAdd(
                        "step3.effectifsPrevisionnels.projections",
                        {
                          annee: "",
                          s7: "",
                          s8: "",
                          s9: "",
                          s10: "",
                          total: "",
                        },
                        e,
                      )
                    }
                    onRemove={(index, e) =>
                      handleArrayRemove(
                        "step3.effectifsPrevisionnels.projections",
                        index,
                        e,
                      )
                    }
                    onUpdate={(index, field, value, e) =>
                      handleArrayUpdate(
                        "step3.effectifsPrevisionnels.projections",
                        index,
                        field,
                        value,
                        e,
                      )
                    }
                    addButtonText="+ Ajouter une année de projection"
                    columns={[
                      {
                        field: "annee",
                        label: "Année universitaire",
                        required: true,
                        placeholder: "Ex: 2024-2025",
                      },
                      {
                        field: "s7",
                        label: "Semestre 7",
                        required: true,
                        placeholder: "Ex: 30",
                      },
                      {
                        field: "s8",
                        label: "Semestre 8",
                        required: true,
                        placeholder: "Ex: 28",
                      },
                      {
                        field: "s9",
                        label: "Semestre 9",
                        required: true,
                        placeholder: "Ex: 25",
                      },
                      {
                        field: "s10",
                        label: "Semestre 10",
                        required: true,
                        placeholder: "Ex: 23",
                      },
                      {
                        field: "total",
                        label: "Total",
                        required: true,
                        placeholder: "Ex: 106",
                      },
                    ]}
                  />
                </div>
              </div>
            </Section>

            <Section
              title="3.1.3 Partenariats pour les nouvelles offres de formations"
              section="partenariatsOffres"
              icon={FaGlobe}
            >
              <div className="space-y-8">
                <div>
                  <TableauFormation
                    title="Partenaires académiques"
                    items={
                      formData.step3.partenariatsOffres.partenairesAcademiques
                    }
                    onAdd={(e) =>
                      handleArrayAdd(
                        "step3.partenariatsOffres.partenairesAcademiques",
                        {
                          nomPartenaire: "",
                          typePartenariat: "",
                          objet: "",
                          duree: "",
                          preuve: null,
                        },
                        e,
                      )
                    }
                    onRemove={(index, e) =>
                      handleArrayRemove(
                        "step3.partenariatsOffres.partenairesAcademiques",
                        index,
                        e,
                      )
                    }
                    onUpdate={(index, field, value, e) =>
                      handleArrayUpdate(
                        "step3.partenariatsOffres.partenairesAcademiques",
                        index,
                        field,
                        value,
                        e,
                      )
                    }
                    addButtonText="+ Ajouter un partenaire académique"
                    columns={[
                      {
                        field: "nomPartenaire",
                        label: "Nom du partenaire",
                        required: true,
                        placeholder: "Ex: Université de Lyon",
                      },
                      {
                        field: "typePartenariat",
                        label: "Type de partenariat",
                        required: true,
                        placeholder: "Ex: Co-diplomation, mobilité",
                      },
                      {
                        field: "objet",
                        label: "Objet du partenariat",
                        required: true,
                        placeholder: "Description de la collaboration",
                      },
                      {
                        field: "duree",
                        label: "Durée",
                        required: false,
                        placeholder: "Ex: 2024-2028",
                      },
                      {
                        field: "preuve",
                        label: "Convention",
                        required: false,
                        type: "file",
                        accept: ".pdf",
                      },
                    ]}
                  />
                </div>

                <div>
                  <TableauFormation
                    title="Conventions de stages"
                    items={formData.step3.partenariatsOffres.conventionsStages}
                    onAdd={(e) =>
                      handleArrayAdd(
                        "step3.partenariatsOffres.conventionsStages",
                        {
                          entreprise: "",
                          secteur: "",
                          convention: null,
                        },
                        e,
                      )
                    }
                    onRemove={(index, e) =>
                      handleArrayRemove(
                        "step3.partenariatsOffres.conventionsStages",
                        index,
                        e,
                      )
                    }
                    onUpdate={(index, field, value, e) =>
                      handleArrayUpdate(
                        "step3.partenariatsOffres.conventionsStages",
                        index,
                        field,
                        value,
                        e,
                      )
                    }
                    addButtonText="+ Ajouter une convention de stage"
                    columns={[
                      {
                        field: "entreprise",
                        label: "Entreprise / Organisation",
                        required: true,
                        placeholder: "Ex: Société Générale",
                      },
                      {
                        field: "secteur",
                        label: "Secteur d'activité",
                        required: true,
                        placeholder: "Ex: Banque",
                      },
                      {
                        field: "convention",
                        label: "Convention signée",
                        required: true,
                        type: "file",
                        accept: ".pdf",
                      },
                    ]}
                  />
                </div>

                <div>
                  <TableauFormation
                    title="Projets collaboratifs"
                    items={formData.step3.partenariatsOffres.projets}
                    onAdd={(e) =>
                      handleArrayAdd(
                        "step3.partenariatsOffres.projets",
                        {
                          intituleProjet: "",
                          partenaires: "",
                          description: "",
                          duree: "",
                          financement: "",
                          preuve: null,
                        },
                        e,
                      )
                    }
                    onRemove={(index, e) =>
                      handleArrayRemove(
                        "step3.partenariatsOffres.projets",
                        index,
                        e,
                      )
                    }
                    onUpdate={(index, field, value, e) =>
                      handleArrayUpdate(
                        "step3.partenariatsOffres.projets",
                        index,
                        field,
                        value,
                        e,
                      )
                    }
                    addButtonText="+ Ajouter un projet"
                    columns={[
                      {
                        field: "intituleProjet",
                        label: "Intitulé du projet",
                        required: true,
                        placeholder: "Ex: Projet de recherche sur l'IA",
                      },
                      {
                        field: "partenaires",
                        label: "Partenaires impliqués",
                        required: true,
                        placeholder: "Ex: Entreprise X, Université Y",
                      },
                      {
                        field: "description",
                        label: "Description",
                        required: true,
                        placeholder: "Objectifs et activités du projet",
                        fullWidth: true,
                      },
                      {
                        field: "duree",
                        label: "Durée",
                        required: false,
                        placeholder: "Ex: 2024-2026",
                      },
                      {
                        field: "financement",
                        label: "Financement",
                        required: false,
                        placeholder: "Ex: 50 000 €",
                      },
                      {
                        field: "preuve",
                        label: "Document du projet",
                        required: false,
                        type: "file",
                        accept: ".pdf",
                      },
                    ]}
                  />
                </div>
              </div>
            </Section>

            <div className="mt-8">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-indigo-800">
                  3.3 Ressources attribuées aux nouvelles offres de formation
                </h3>
                <p className="text-indigo-700 text-sm mt-1">
                  Objectif : Vérifier la suffisance et l'adéquation des
                  enseignants et du personnel de soutien. Exiger la concordance
                  spécialité–UE et la stabilité minimale.
                </p>
              </div>
            </div>

            <Section
              title="3.3.1 Qualification des responsables"
              section="qualificationResponsables"
              icon={FaUsers}
            >
              <TableauFormation
                title="Responsables des formations"
                items={formData.step3.qualificationResponsables}
                onAdd={(e) =>
                  handleArrayAdd(
                    "step3.qualificationResponsables",
                    {
                      domaine: "",
                      grade: "",
                      mention: "",
                      nomResponsable: "",
                      diplomesSpecialites: "",
                    },
                    e,
                  )
                }
                onRemove={(index, e) =>
                  handleArrayRemove("step3.qualificationResponsables", index, e)
                }
                onUpdate={(index, field, value, e) =>
                  handleArrayUpdate(
                    "step3.qualificationResponsables",
                    index,
                    field,
                    value,
                    e,
                  )
                }
                addButtonText="+ Ajouter un responsable"
                columns={[
                  {
                    field: "domaine",
                    label: "Domaine",
                    required: true,
                    type: "select",
                    placeholder: "Sélectionner un domaine",
                    options: [
                      { value: "ST", label: "ST - Sciences et Technologies" },
                      {
                        value: "ALSH",
                        label: "ALSH - Arts, Lettres et Sciences humaines",
                      },
                      { value: "SEd", label: "SEd - Sciences de l'éducation" },
                      { value: "SI", label: "SI - Sciences de l'ingénieur" },
                      { value: "SSa", label: "SSa - Sciences de la Santé" },
                      { value: "SSo", label: "SSo - Sciences de la Société" },
                    ],
                  },
                  {
                    field: "grade",
                    label: "Grade",
                    required: true,
                    type: "select",
                    placeholder: "Sélectionner un grade",
                    options: [
                      { value: "L", label: "Licence (L)" },
                      { value: "M", label: "Master (M)" },
                    ],
                  },
                  {
                    field: "mention",
                    label: "Mention",
                    required: true,
                    placeholder: "Ex: Informatique",
                  },
                  {
                    field: "nomResponsable",
                    label: "Nom du responsable",
                    required: true,
                    placeholder: "Ex: Dr. Jean RAKOTO",
                  },
                  {
                    field: "diplomesSpecialites",
                    label: "Diplômes et spécialités",
                    required: true,
                    placeholder: "Ex: Doctorat en Informatique",
                  },
                ]}
              />
            </Section>

            <Section
              title="3.3.2 Enseignants dédiés aux nouvelles offres de formations"
              section="enseignantsDedies"
              icon={FaUsers}
            >
              <TableauFormation
                title="Enseignants dédiés"
                items={formData.step3.enseignantsDedies}
                onAdd={(e) =>
                  handleArrayAdd(
                    "step3.enseignantsDedies",
                    {
                      nomPrenom: "",
                      statut: "",
                      diplomeSpecialite: "",
                      ueEnseignees: "",
                      chargeAnnuelle: "",
                      pieces: null,
                    },
                    e,
                  )
                }
                onRemove={(index, e) =>
                  handleArrayRemove("step3.enseignantsDedies", index, e)
                }
                onUpdate={(index, field, value, e) =>
                  handleArrayUpdate(
                    "step3.enseignantsDedies",
                    index,
                    field,
                    value,
                    e,
                  )
                }
                addButtonText="+ Ajouter un enseignant"
                columns={[
                  {
                    field: "nomPrenom",
                    label: "Nom & Prénom",
                    required: true,
                    placeholder: "Ex: Dr. Marie Claire KABORE",
                  },
                  {
                    field: "statut",
                    label: "Statut",
                    required: true,
                    type: "select",
                    placeholder: "Sélectionner le statut",
                    options: [
                      { value: "permanent", label: "Permanent" },
                      { value: "vacataire", label: "Vacataire" },
                    ],
                  },
                  {
                    field: "diplomeSpecialite",
                    label: "Diplôme/Spécialité",
                    required: true,
                    placeholder: "Ex: Doctorat en Mathématiques",
                  },
                  {
                    field: "ueEnseignees",
                    label: "UE enseignées",
                    required: true,
                    placeholder: "Ex: Analyse numérique, Algèbre",
                  },
                  {
                    field: "chargeAnnuelle",
                    label: "Charge annuelle (h)",
                    required: true,
                    placeholder: "Ex: 120",
                  },
                  {
                    field: "pieces",
                    label: "Pièces (CV, diplômes, Lettre d'engagement)",
                    required: true,
                    type: "file",
                    accept: ".pdf,.jpg,.jpeg,.png",
                  },
                ]}
              />

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="% d'UE assurées par spécialistes"
                  path="step3.pourcentageUESpecialistes"
                  placeholder="Ex: 85%"
                />

                <InputField
                  label="Ratio étudiants/enseignant permanent"
                  path="step3.ratioEtudiantsEnseignants"
                  placeholder="Ex: 15:1"
                />
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <span className="font-semibold">N.B:</span> Les CV, Diplômes
                  et Lettre d'engagement doivent être à jour et signés.
                </p>
              </div>
            </Section>

            <Section
              title="3.4 Alignement de la formation avec les axes de recherche des enseignants"
              section="alignementRecherche"
              icon={FaBook}
            >
              <div className="space-y-6">
                <TextAreaField
                  label="Concordance entre la formation et les thématiques de recherche institutionnelles"
                  path="step3.alignementRecherche.concordanceFormationRecherche"
                  placeholder="Expliquez comment la formation s'aligne avec les axes de recherche de l'établissement..."
                />

                <TextAreaField
                  label="Contribution à la formation de cadres, chercheurs et experts"
                  path="step3.alignementRecherche.contributionFormationCadres"
                  placeholder="Comment cette formation contribue-t-elle à la formation de cadres et chercheurs ?..."
                />

                <TextAreaField
                  label="Cohérence avec les politiques publiques et de recherche"
                  path="step3.alignementRecherche.coherencePolitiquesPubliques"
                  placeholder="Alignement avec les stratégies nationales, les politiques sectorielles..."
                />
              </div>
            </Section>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-blue-800 font-medium mb-1">
                    IV. Organisation des études
                  </p>
                  <p className="text-blue-700 text-sm">
                    Présentez l'organisation complète des études, incluant les
                    domaines, grades, mentions, parcours et passerelles entre
                    les formations.
                  </p>
                </div>
              </div>
            </div>

            <Section
              title="4.1 Domaines, grades"
              section="domainesGrades"
              description="Donner les grades proposés pour chaque domaine"
              icon={FaUniversity}
            >
              <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                Les six domaines sont : Sciences et Technologies (ST); Arts,
                Lettres et Sciences humaines (ALSH); Sciences de l'éducation
                (SEd); Sciences de l'ingénieur (SI); Sciences de la Santé (SSa);
                Sciences de la Société (SSo).
              </p>

              <TableauFormation
                title="Domaines et grades avec responsables"
                items={formData.step4.domainesGrades}
                onAdd={(e) =>
                  handleArrayAdd(
                    "step4.domainesGrades",
                    {
                      domaine: "",
                      grade: "",
                      nomResponsable: "",
                      adresse: "",
                      telephone: "",
                      email: "",
                    },
                    e,
                  )
                }
                onRemove={(index, e) =>
                  handleArrayRemove("step4.domainesGrades", index, e)
                }
                onUpdate={(index, field, value, e) =>
                  handleArrayUpdate(
                    "step4.domainesGrades",
                    index,
                    field,
                    value,
                    e,
                  )
                }
                addButtonText="+ Ajouter un domaine/grade"
                columns={[
                  {
                    field: "domaine",
                    label: "Domaine",
                    required: true,
                    type: "select",
                    placeholder: "Sélectionner un domaine",
                    options: [
                      { value: "ST", label: "ST - Sciences et Technologies" },
                      {
                        value: "ALSH",
                        label: "ALSH - Arts, Lettres et Sciences humaines",
                      },
                      { value: "SEd", label: "SEd - Sciences de l'éducation" },
                      { value: "SI", label: "SI - Sciences de l'ingénieur" },
                      { value: "SSa", label: "SSa - Sciences de la Santé" },
                      { value: "SSo", label: "SSo - Sciences de la Société" },
                    ],
                  },
                  {
                    field: "grade",
                    label: "Grade",
                    required: true,
                    type: "select",
                    placeholder: "Sélectionner un grade",
                    options: [
                      { value: "L", label: "Licence (L)" },
                      { value: "M", label: "Master (M)" },
                    ],
                  },
                  {
                    field: "nomResponsable",
                    label: "Nom du responsable",
                    required: true,
                    placeholder: "Ex: Dr. Jean RAKOTO",
                  },
                  {
                    field: "adresse",
                    label: "Adresse",
                    required: false,
                    placeholder: "Adresse professionnelle",
                  },
                  {
                    field: "telephone",
                    label: "Téléphone",
                    required: true,
                    placeholder: "+226 XX XX XX XX",
                  },
                  {
                    field: "email",
                    label: "Email",
                    required: true,
                    placeholder: "responsable@universite.bf",
                  },
                ]}
              />
            </Section>

            <Section
              title="4.2 Mentions, parcours et passerelles"
              section="mentionsParcours"
              description="Les mentions sont des subdivisions d'un domaine. Elles peuvent se décliner en spécialités."
              icon={FaGraduationCap}
            >
              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Fiche récapitulative des mentions
                  </h4>
                  <TableauFormation
                    title="Mentions"
                    items={formData.step4.mentions}
                    onAdd={(e) =>
                      handleArrayAdd(
                        "step4.mentions",
                        {
                          domaine: "",
                          grade: "",
                          mention: "",
                          etablissementRattachement: "",
                          nomResponsable: "",
                          diplomeSpecialite: "",
                          adresse: "",
                          email: "",
                          telephone: "",
                        },
                        e,
                      )
                    }
                    onRemove={(index, e) =>
                      handleArrayRemove("step4.mentions", index, e)
                    }
                    onUpdate={(index, field, value, e) =>
                      handleArrayUpdate(
                        "step4.mentions",
                        index,
                        field,
                        value,
                        e,
                      )
                    }
                    addButtonText="+ Ajouter une mention"
                    columns={[
                      {
                        field: "domaine",
                        label: "Domaine",
                        required: true,
                        type: "select",
                        placeholder: "Sélectionner un domaine",
                        options: [
                          { value: "ST", label: "ST" },
                          { value: "ALSH", label: "ALSH" },
                          { value: "SEd", label: "SEd" },
                          { value: "SI", label: "SI" },
                          { value: "SSa", label: "SSa" },
                          { value: "SSo", label: "SSo" },
                        ],
                      },
                      {
                        field: "grade",
                        label: "Grade",
                        required: true,
                        type: "select",
                        placeholder: "Sélectionner un grade",
                        options: [
                          { value: "L", label: "Licence (L)" },
                          { value: "M", label: "Master (M)" },
                        ],
                      },
                      {
                        field: "mention",
                        label: "Mention",
                        required: true,
                        placeholder: "Ex: Mathématiques",
                      },
                      {
                        field: "etablissementRattachement",
                        label: "Établissement de rattachement",
                        required: true,
                        placeholder: "Ex: UFR Sciences",
                      },
                      {
                        field: "nomResponsable",
                        label: "Nom du responsable",
                        required: true,
                        placeholder: "Ex: Pr. Marie KABORE",
                      },
                      {
                        field: "diplomeSpecialite",
                        label: "Diplôme/Spécialités",
                        required: true,
                        placeholder: "Ex: Doctorat en Mathématiques",
                      },
                      {
                        field: "adresse",
                        label: "Adresse",
                        required: false,
                        placeholder: "Adresse professionnelle",
                      },
                      {
                        field: "email",
                        label: "Email",
                        required: true,
                        placeholder: "responsable@universite.bf",
                      },
                      {
                        field: "telephone",
                        label: "Téléphone",
                        required: true,
                        placeholder: "+226 XX XX XX XX",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Organisation des Parcours dans la mention
                  </h4>
                  <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    Exemple : Mention « mathématiques»
                  </p>

                  <TableauFormation
                    title="Organisation des parcours"
                    items={formData.step4.organisationParcours}
                    onAdd={(e) =>
                      handleArrayAdd(
                        "step4.organisationParcours",
                        {
                          mention: "",
                          semestre: "",
                          parcours1: "",
                          parcours2: "",
                          parcours3: "",
                          description: "",
                        },
                        e,
                      )
                    }
                    onRemove={(index, e) =>
                      handleArrayRemove("step4.organisationParcours", index, e)
                    }
                    onUpdate={(index, field, value, e) =>
                      handleArrayUpdate(
                        "step4.organisationParcours",
                        index,
                        field,
                        value,
                        e,
                      )
                    }
                    addButtonText="+ Ajouter une ligne d'organisation"
                    columns={[
                      {
                        field: "mention",
                        label: "Mention",
                        required: true,
                        placeholder: "Ex: Mathématiques",
                      },
                      {
                        field: "semestre",
                        label: "Semestre",
                        required: true,
                        type: "select",
                        placeholder: "Sélectionner le semestre",
                        options: [
                          { value: "S7", label: "Semestre 7" },
                          { value: "S8", label: "Semestre 8" },
                          { value: "S9", label: "Semestre 9" },
                          { value: "S10", label: "Semestre 10" },
                        ],
                      },
                      {
                        field: "parcours1",
                        label: "Parcours 1",
                        required: false,
                        placeholder: "Ex: Physique",
                      },
                      {
                        field: "parcours2",
                        label: "Parcours 2",
                        required: false,
                        placeholder: "Ex: Chimie",
                      },
                      {
                        field: "parcours3",
                        label: "Parcours 3",
                        required: false,
                        placeholder: "Ex: Physique-chimie",
                      },
                      {
                        field: "description",
                        label: "Description",
                        required: false,
                        placeholder: "Informations complémentaires",
                        fullWidth: true,
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Passerelles
                  </h4>
                  <p className="text-sm text-gray-600 mb-4 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <span className="font-semibold">Instructions :</span>
                    <br />
                    - Identifier les passerelles par des flèches dans le tableau
                    d'organisation des parcours
                    <br />- Pour chaque passerelle, mentionner les UE
                    optionnelles qui doivent avoir été obtenues pour utiliser la
                    passerelle.
                  </p>

                  <TableauFormation
                    title="Description des passerelles"
                    items={formData.step4.passerelles}
                    onAdd={(e) =>
                      handleArrayAdd(
                        "step4.passerelles",
                        {
                          mentionSource: "",
                          parcoursSource: "",
                          semestreSource: "",
                          mentionCible: "",
                          parcoursCible: "",
                          semestreCible: "",
                          ueRequis: "",
                          conditions: "",
                        },
                        e,
                      )
                    }
                    onRemove={(index, e) =>
                      handleArrayRemove("step4.passerelles", index, e)
                    }
                    onUpdate={(index, field, value, e) =>
                      handleArrayUpdate(
                        "step4.passerelles",
                        index,
                        field,
                        value,
                        e,
                      )
                    }
                    addButtonText="+ Ajouter une passerelle"
                    columns={[
                      {
                        field: "mentionSource",
                        label: "Mention source",
                        required: true,
                        placeholder: "Ex: Mathématiques",
                      },
                      {
                        field: "parcoursSource",
                        label: "Parcours source",
                        required: true,
                        placeholder: "Ex: Physique",
                      },
                      {
                        field: "semestreSource",
                        label: "Semestre source",
                        required: true,
                        placeholder: "Ex: S8",
                      },
                      {
                        field: "mentionCible",
                        label: "Mention cible",
                        required: true,
                        placeholder: "Ex: Informatique",
                      },
                      {
                        field: "parcoursCible",
                        label: "Parcours cible",
                        required: true,
                        placeholder: "Ex: Data Science",
                      },
                      {
                        field: "semestreCible",
                        label: "Semestre cible",
                        required: true,
                        placeholder: "Ex: S9",
                      },
                      {
                        field: "ueRequis",
                        label: "UE requises",
                        required: true,
                        placeholder: "Ex: Analyse numérique, Algèbre",
                        fullWidth: true,
                      },
                      {
                        field: "conditions",
                        label: "Conditions supplémentaires",
                        required: false,
                        placeholder: "Autres conditions d'accès",
                        fullWidth: true,
                      },
                    ]}
                  />
                </div>
              </div>
            </Section>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-blue-800 font-medium mb-1">
                    V. Dispositif pédagogique et maquette
                  </p>
                  <p className="text-blue-700 text-sm">
                    Objectif : Attester la conformité de l'offre avec le
                    principe du système LMD : total de crédit pour les 4
                    semestres (120 ECTS), équilibre entre les types
                    d'interventions CM/TD/TP/TPE, progression des études et
                    professionnalisation.
                  </p>
                </div>
              </div>
            </div>

            <Section
              title="5.1 Description de la mention"
              section="descriptionMention"
              icon={FaUniversity}
            >
              <div className="space-y-6">
                <TextAreaField
                  label="5.1.1 Contexte et justification"
                  path="step5.descriptionMention.contexteJustification"
                  placeholder="Présentez le contexte et la justification de la mention..."
                  rows={4}
                />

                <TextAreaField
                  label="5.1.2 Objectifs de la formation"
                  path="step5.descriptionMention.objectifsFormation"
                  placeholder="Décrivez les objectifs pédagogiques de la formation..."
                  rows={4}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    5.1.3 Vocation <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Décrire la vocation vers laquelle le parcours est orienté
                    pour se situer dans la poursuite de la formation. N.B: Les
                    établissements sont invités à indiquer clairement la
                    vocation de la formation proposée, en précisant s'il s'agit
                    d'une formation à vocation académique (préparant
                    principalement à la poursuite d'études et à la recherche) ou
                    d'une formation à vocation professionnelle (orientée vers
                    l'insertion dans le monde du travail et la pratique de
                    métier).
                  </p>
                  <select
                    value={formData.step5.descriptionMention.vocation}
                    onChange={(e) =>
                      handleInputChange(
                        "step5.descriptionMention.vocation",
                        e.target.value,
                        e,
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Sélectionner la vocation</option>
                    <option value="academique">
                      Académique (recherche, poursuite d'études)
                    </option>
                    <option value="professionnelle">
                      Professionnelle (insertion professionnelle)
                    </option>
                  </select>
                </div>

                <TextAreaField
                  label="5.1.4 Débouchés professionnels"
                  path="step5.descriptionMention.debouchesProfessionnels"
                  placeholder="Listez les débouchés professionnels visés par la formation..."
                  rows={4}
                />
              </div>
            </Section>

            {formData.step5.parcours.map((parcours, parcoursIndex) => (
              <div key={parcours.id} className="space-y-6">
                <Section
                  title={`5.2.${parcoursIndex + 1} - PARCOURS ${parcours.intitule || `XXXXXX ${parcoursIndex + 1}`}`}
                  section={`parcours${parcoursIndex + 1}`}
                  icon={FaGraduationCap}
                >
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                      A- Organisation du parcours
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Le parcours est une suite d'unités d'enseignements
                      conduisant à une qualification sanctionnée ou non par un
                      diplôme.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <InputField
                        label="Intitulé du parcours"
                        path={`step5.parcours.${parcoursIndex}.intitule`}
                        placeholder="Ex: Physique-chimie"
                      />

                      <InputField
                        label="Grade / Domaine concerné"
                        path={`step5.parcours.${parcoursIndex}.gradeDomaine`}
                        placeholder="Ex: Sciences et Technologies/MASTER"
                      />

                      <InputField
                        label="Mention concernée"
                        path={`step5.parcours.${parcoursIndex}.mention`}
                        placeholder="Ex: Physique-chimie"
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vocation principale du parcours{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={parcours.vocation}
                          onChange={(e) =>
                            handleParcoursUpdate(
                              parcoursIndex,
                              "vocation",
                              e.target.value,
                              e,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                          <option value="academique">
                            Académique (recherche, poursuite d'études)
                          </option>
                          <option value="professionnelle">
                            Professionnelle (insertion professionnelle)
                          </option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Semestres concernés
                        </label>
                        <div className="flex gap-4">
                          {["S7", "S8", "S9", "S10"].map((sem) => (
                            <label
                              key={sem}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                checked={parcours.semestresConcernes?.includes(
                                  sem,
                                )}
                                onChange={(e) => {
                                  const newSemestres = e.target.checked
                                    ? [
                                        ...(parcours.semestresConcernes || []),
                                        sem,
                                      ]
                                    : (
                                        parcours.semestresConcernes || []
                                      ).filter((s) => s !== sem);
                                  handleParcoursUpdate(
                                    parcoursIndex,
                                    "semestresConcernes",
                                    newSemestres,
                                    e,
                                  );
                                }}
                                className="w-4 h-4 text-indigo-600"
                              />
                              <span className="text-sm text-gray-700">
                                {sem}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <h5 className="font-medium text-gray-800 mb-3">
                        Nom du responsable du parcours et équipe de formation
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          label="Nom du responsable"
                          path={`step5.parcours.${parcoursIndex}.responsableNom`}
                          placeholder="Ex: Dr. Jean RAKOTO"
                        />
                        <InputField
                          label="Email"
                          path={`step5.parcours.${parcoursIndex}.responsableEmail`}
                          placeholder="responsable@universite.bf"
                          type="email"
                        />
                        <InputField
                          label="Téléphone"
                          path={`step5.parcours.${parcoursIndex}.responsableTelephone`}
                          placeholder="+226 XX XX XX XX"
                        />
                        <InputField
                          label="Adresse"
                          path={`step5.parcours.${parcoursIndex}.responsableAdresse`}
                          placeholder="Adresse professionnelle"
                        />
                      </div>
                    </div>

                    <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h5 className="font-medium text-gray-800">
                          Exemple d'organisation des parcours
                        </h5>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-3">
                          Exemple 1 : Mention « Physique-chimie »
                        </p>
                        <table className="min-w-full border border-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 border-b">
                                Parcours
                              </th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 border-b">
                                S7
                              </th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 border-b">
                                S8
                              </th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 border-b">
                                S9
                              </th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 border-b">
                                S10
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-4 py-2 border-b">
                                Enseignements communs
                              </td>
                              <td className="px-4 py-2 text-center border-b">
                                ✓
                              </td>
                              <td className="px-4 py-2 text-center border-b">
                                ✓
                              </td>
                              <td className="px-4 py-2 text-center border-b"></td>
                              <td className="px-4 py-2 text-center border-b"></td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 border-b">Physique</td>
                              <td className="px-4 py-2 text-center border-b"></td>
                              <td className="px-4 py-2 text-center border-b"></td>
                              <td className="px-4 py-2 text-center border-b">
                                ✓
                              </td>
                              <td className="px-4 py-2 text-center border-b">
                                ✓
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 border-b">Chimie</td>
                              <td className="px-4 py-2 text-center border-b"></td>
                              <td className="px-4 py-2 text-center border-b"></td>
                              <td className="px-4 py-2 text-center border-b">
                                ✓
                              </td>
                              <td className="px-4 py-2 text-center border-b">
                                ✓
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p className="text-sm text-gray-600 mt-4 mb-3">
                          Exemple 2 : Licence en Sciences de la vie
                        </p>
                        <table className="min-w-full border border-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 border-b">
                                Parcours
                              </th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 border-b">
                                S7
                              </th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 border-b">
                                S8
                              </th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 border-b">
                                S9
                              </th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 border-b">
                                S10
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-4 py-2 border-b">
                                Biologie générale
                              </td>
                              <td className="px-4 py-2 text-center border-b">
                                ✓
                              </td>
                              <td className="px-4 py-2 text-center border-b">
                                ✓
                              </td>
                              <td className="px-4 py-2 text-center border-b">
                                ✓
                              </td>
                              <td className="px-4 py-2 text-center border-b">
                                ✓
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 border-b">
                                Biologie moléculaire - physiologie
                              </td>
                              <td className="px-4 py-2 text-center border-b"></td>
                              <td className="px-4 py-2 text-center border-b"></td>
                              <td className="px-4 py-2 text-center border-b"></td>
                              <td className="px-4 py-2 text-center border-b">
                                ✓
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <InputField
                        label="Langue d'enseignement"
                        path={`step5.parcours.${parcoursIndex}.langueEnseignement`}
                        placeholder="Ex: Français, Anglais"
                      />

                      <TextAreaField
                        label="Objectif du parcours"
                        path={`step5.parcours.${parcoursIndex}.objectifParcours`}
                        placeholder="Décrivez ce que l'étudiant doit acquérir, assimiler, connaître à la fin de la formation, quels savoir-faire et compétences l'étudiant doit avoir acquis"
                        rows={3}
                      />

                      <TextAreaField
                        label="Organisation du parcours en UE"
                        path={`step5.parcours.${parcoursIndex}.organisationUE`}
                        placeholder="Décrivez les semestres généralistes et ceux qui sont spécialisés et mentionnez les stages"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                      B- Les unités d'enseignements (UE)
                    </h4>

                    <div className="overflow-x-auto mb-6">
                      <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                              Unité d'enseignement
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-b">
                              Crédit
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-gray-100">
                            <td
                              colSpan="2"
                              className="px-4 py-2 font-medium text-gray-800 border-b"
                            >
                              Semestre 10
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border-b">...</td>
                            <td className="px-4 py-2 text-center border-b"></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border-b font-medium text-right">
                              Total
                            </td>
                            <td className="px-4 py-2 text-center border-b font-medium">
                              30
                            </td>
                          </tr>

                          <tr className="bg-gray-100">
                            <td
                              colSpan="2"
                              className="px-4 py-2 font-medium text-gray-800 border-b"
                            >
                              Semestre 9
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border-b">...</td>
                            <td className="px-4 py-2 text-center border-b"></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border-b font-medium text-right">
                              Total
                            </td>
                            <td className="px-4 py-2 text-center border-b font-medium">
                              30
                            </td>
                          </tr>

                          <tr className="bg-gray-100">
                            <td
                              colSpan="2"
                              className="px-4 py-2 font-medium text-gray-800 border-b"
                            >
                              Semestre 8
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border-b">...</td>
                            <td className="px-4 py-2 text-center border-b"></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border-b font-medium text-right">
                              Total
                            </td>
                            <td className="px-4 py-2 text-center border-b font-medium">
                              30
                            </td>
                          </tr>

                          <tr className="bg-gray-100">
                            <td
                              colSpan="2"
                              className="px-4 py-2 font-medium text-gray-800 border-b"
                            >
                              Semestre 7
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border-b">...</td>
                            <td className="px-4 py-2 text-center border-b"></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border-b font-medium text-right">
                              Total
                            </td>
                            <td className="px-4 py-2 text-center border-b font-medium">
                              30
                            </td>
                          </tr>

                          <tr className="bg-indigo-50">
                            <td className="px-4 py-3 font-medium text-right text-indigo-800">
                              Total général
                            </td>
                            <td className="px-4 py-3 text-center font-medium text-indigo-800">
                              120
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                      (1) Unité d'enseignement optionnelle
                    </p>

                    <UETable
                      parcoursIndex={parcoursIndex}
                      semestre="Semestre7"
                      title="Semestre 7"
                    />
                    <UETable
                      parcoursIndex={parcoursIndex}
                      semestre="Semestre8"
                      title="Semestre 8"
                    />
                    <UETable
                      parcoursIndex={parcoursIndex}
                      semestre="Semestre9"
                      title="Semestre 9"
                    />
                    <UETable
                      parcoursIndex={parcoursIndex}
                      semestre="Semestre10"
                      title="Semestre 10"
                    />

                    <RecapActivitesTable parcoursIndex={parcoursIndex} />

                    <p className="text-sm text-gray-500 mt-2">
                      Le tableau est construit en fonction de la description des
                      UE obligatoires, le nombre de type d'enseignement n'est
                      pas limité.
                    </p>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                      Conditions et modalités d'accès
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextAreaField
                        label="Pré-requis"
                        path={`step5.parcours.${parcoursIndex}.conditionsAcces.prerequis`}
                        placeholder="Listez les pré-requis nécessaires pour accéder à la formation"
                        rows={3}
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Capacité d'accueil limitée ?
                        </label>
                        <div className="flex items-center gap-4 mb-3">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`capaciteLimitee-${parcoursIndex}`}
                              checked={
                                parcours.conditionsAcces?.capaciteLimitee ===
                                true
                              }
                              onChange={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleParcoursNestedUpdate(
                                  parcoursIndex,
                                  "conditionsAcces",
                                  "capaciteLimitee",
                                  true,
                                  e,
                                );
                              }}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <span className="text-sm text-gray-700">Oui</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`capaciteLimitee-${parcoursIndex}`}
                              checked={
                                parcours.conditionsAcces?.capaciteLimitee ===
                                false
                              }
                              onChange={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleParcoursNestedUpdate(
                                  parcoursIndex,
                                  "conditionsAcces",
                                  "capaciteLimitee",
                                  false,
                                  e,
                                );
                              }}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <span className="text-sm text-gray-700">Non</span>
                          </label>
                        </div>

                        {parcours.conditionsAcces?.capaciteLimitee && (
                          <InputField
                            label="Capacité maximale"
                            path={`step5.parcours.${parcoursIndex}.conditionsAcces.capaciteMax`}
                            placeholder="Ex: 50 étudiants"
                            type="number"
                          />
                        )}

                        <TextAreaField
                          label="Modalités de sélection"
                          path={`step5.parcours.${parcoursIndex}.conditionsAcces.modalitesSelection`}
                          placeholder="Décrivez comment se fait la sélection (si l'admission est régulée)"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                      <FaGlobe className="text-indigo-600" />
                      Ouverture internationale
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextAreaField
                        label="Possibilités de stage à l'étranger"
                        path={`step5.parcours.${parcoursIndex}.ouvertureInternationale.stagesEtranger`}
                        placeholder="Décrivez les possibilités de stages à l'étranger"
                        rows={2}
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Conventions avec des institutions étrangères
                        </label>
                        <FileUpload
                          path={`step5.parcours.${parcoursIndex}.ouvertureInternationale.conventions`}
                          label="Conventions"
                          accept=".pdf"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                      <FaBriefcase className="text-indigo-600" />
                      Insertion professionnelle
                    </h4>
                    <TextAreaField
                      label="Métiers accessibles"
                      path={`step5.parcours.${parcoursIndex}.insertionProfessionnelle`}
                      placeholder="Identifiez les métiers accessibles à la fin de la formation"
                      rows={3}
                    />
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                      <FaGraduationCap className="text-indigo-600" />
                      Poursuite des études
                    </h4>
                    <TextAreaField
                      label="Poursuites d'études possibles"
                      path={`step5.parcours.${parcoursIndex}.poursuiteEtudes`}
                      placeholder="Décrivez les poursuites d'études prévues (ex: après l'obtention de la licence, les étudiants ont la possibilité d'intégrer trois masters)"
                      rows={2}
                    />
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                      <FaUsers className="text-indigo-600" />
                      Partenariats
                    </h4>
                    <TextAreaField
                      label="Partenariats"
                      path={`step5.parcours.${parcoursIndex}.partenariats`}
                      placeholder="Décrivez les partenariats académiques et professionnels"
                      rows={2}
                    />
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                      <FaBook className="text-indigo-600" />
                      Mémoires de Master
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <TextAreaField
                        label="Thématiques"
                        path={`step5.parcours.${parcoursIndex}.memoiresMaster.thematiques`}
                        placeholder="Décrivez les thématiques de recherche proposées pour les mémoires"
                        rows={2}
                      />
                      <TextAreaField
                        label="Grille d'évaluation"
                        path={`step5.parcours.${parcoursIndex}.memoiresMaster.grilleEvaluation`}
                        placeholder="Décrivez la grille d'évaluation des mémoires"
                        rows={2}
                      />
                      <TextAreaField
                        label="Encadrement"
                        path={`step5.parcours.${parcoursIndex}.memoiresMaster.encadrement`}
                        placeholder="Décrivez les modalités d'encadrement des mémoires"
                        rows={2}
                      />
                    </div>
                  </div>
                </Section>
              </div>
            ))}

            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm w-full mb-6"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const newParcours = {
                  id: Date.now(),
                  intitule: "",
                  gradeDomaine: "",
                  mention: "",
                  vocation: "academique",
                  semestresConcernes: ["S7", "S8", "S9", "S10"],
                  responsableNom: "",
                  responsableEmail: "",
                  responsableTelephone: "",
                  responsableAdresse: "",
                  langueEnseignement: "Français",
                  objectifParcours: "",
                  organisationUE: "",
                  conditionsAcces: {
                    prerequis: "",
                    capaciteLimitee: false,
                    capaciteMax: "",
                    modalitesSelection: "",
                  },
                  ouvertureInternationale: {
                    stagesEtranger: "",
                    conventions: [],
                  },
                  insertionProfessionnelle: "",
                  poursuiteEtudes: "",
                  partenariats: "",
                  memoiresMaster: {
                    thematiques: "",
                    grilleEvaluation: "",
                    encadrement: "",
                  },
                  ueSemestre7: [],
                  ueSemestre8: [],
                  ueSemestre9: [],
                  ueSemestre10: [],
                  recapActivites: {
                    s7: { cours: 0, td: 0, tp: 0, stage: 0, total: 30 },
                    s8: { cours: 0, td: 0, tp: 0, stage: 0, total: 30 },
                    s9: { cours: 0, td: 0, tp: 0, stage: 0, total: 30 },
                    s10: { cours: 0, td: 0, tp: 0, stage: 0, total: 30 },
                  },
                };
                setFormData((prev) => ({
                  ...prev,
                  step5: {
                    ...prev.step5,
                    parcours: [...prev.step5.parcours, newParcours],
                  },
                }));
              }}
            >
              <FaPlus />
              Ajouter un nouveau parcours
            </button>

            <Section
              title="C- DESCRIPTION DES UNITES D'ENSEIGNEMENT (UE)"
              section="fichesUE"
              icon={FaBook}
            >
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">
                    C.1 Guide de remplissage de la Fiche de description d'une UE
                  </h5>
                  <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                    <li>Grade / domaine concerné*</li>
                    <li>
                      Intitulé* - Donner l'intitulé exact de l'unité
                      d'enseignement
                    </li>
                    <li>
                      Code et numéro - Maximum 15 caractères (ex: PSY pour
                      Psychologie)
                    </li>
                    <li>Responsable - Nom et coordonnées du responsable</li>
                    <li>
                      Statut de l'UE - Préciser les parcours, UE
                      obligatoire/optionnelle, caractéristique
                    </li>
                    <li>
                      Valeur en crédits - 1 crédit = 20 à 30 heures de travail
                      intégré
                    </li>
                    <li>Objectifs visés - Compétences acquises après succès</li>
                    <li>Pré-requis - Connaissances requises</li>
                    <li>
                      Nature des activités pédagogiques - Tableau des matières
                      (EC)
                    </li>
                    <li>
                      Modalités de contrôle des connaissances - Garantir
                      l'équité, validité et traçabilité
                    </li>
                    <li>Nombre minimal/maximal d'étudiants</li>
                    <li>Note éliminatoire</li>
                    <li>Règle de compensation</li>
                    <li>Contenu - Grandes lignes du programme</li>
                    <li>Syllabus des EC avec bibliographie</li>
                    <li>
                      Eléments de pédagogie - Démarches pédagogiques innovantes
                    </li>
                  </ul>
                </div>

                <h5 className="text-lg font-medium text-gray-800">
                  C2: FICHE DESCRIPTIVE PAR UE
                </h5>
                <p className="text-sm text-gray-600 mb-4">
                  Une fiche descriptive doit être remplie pour chaque unité
                  d'enseignement (UE) afin de préciser ses objectifs, contenus,
                  volumes horaires, crédits et modalités d'évaluation.
                </p>

                <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h6 className="font-medium text-gray-800">
                      Liste des UE proposées par domaine/grade
                    </h6>
                  </div>
                  <div className="p-4">
                    <table className="min-w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 border-b">
                            Domaine/Grade
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 border-b">
                            Code UE
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 border-b">
                            Nom UE
                          </th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 border-b">
                            Crédits
                          </th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 border-b">
                            Semestre
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 border-b">
                            Responsable
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.step5.listeUE.map((ue, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            <td className="px-4 py-2">{ue.domaineGrade}</td>
                            <td className="px-4 py-2">{ue.code}</td>
                            <td className="px-4 py-2">{ue.nom}</td>
                            <td className="px-4 py-2 text-center">
                              {ue.credits}
                            </td>
                            <td className="px-4 py-2 text-center">
                              {ue.semestre}
                            </td>
                            <td className="px-4 py-2">{ue.responsable}</td>
                          </tr>
                        ))}
                        {formData.step5.listeUE.length === 0 && (
                          <tr>
                            <td
                              colSpan="6"
                              className="px-4 py-4 text-center text-gray-500"
                            >
                              Aucune UE enregistrée. Utilisez le formulaire
                              ci-dessous pour ajouter des fiches UE.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {formData.step5.fichesUE.map((fiche, index) => (
                  <FicheUEModal
                    key={fiche.id}
                    fiche={fiche}
                    index={index}
                  />
                ))}

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm w-full"
                  onClick={handleFicheUEAdd}
                >
                  <FaPlus />
                  Ajouter une fiche descriptive d'UE
                </button>
              </div>
            </Section>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-blue-800 font-medium mb-1">
                    VI. Moyens disponibles
                  </p>
                  <p className="text-blue-700 text-sm">
                    Objectif : Démontrer la disponibilité des ressources humaines,
                    matérielles et infrastructurelles nécessaires à la mise en œuvre
                    de la formation.
                  </p>
                </div>
              </div>
            </div>

            <Section
              title="6.1 Ressources humaines"
              section="ressourcesHumaines"
              icon={FaUsers}
            >
              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    6.1.1 Récapitulatif des enseignants permanents et intervenants
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                            Grades
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                            Effectifs des permanents
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                            Effectifs des vacataires ou associés
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {formData.step6.ressourcesHumaines.enseignantsRecap.map((item, index) => (
                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">
                              {item.grades}
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={item.effectifsPermanents}
                                onChange={(e) => {
                                  const newPath = `step6.ressourcesHumaines.enseignantsRecap.${index}.effectifsPermanents`;
                                  handleInputChange(newPath, e.target.value, e);
                                }}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="0"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={item.effectifsVacataires}
                                onChange={(e) => {
                                  const newPath = `step6.ressourcesHumaines.enseignantsRecap.${index}.effectifsVacataires`;
                                  handleInputChange(newPath, e.target.value, e);
                                }}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="0"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={item.total}
                                onChange={(e) => {
                                  const newPath = `step6.ressourcesHumaines.enseignantsRecap.${index}.total`;
                                  handleInputChange(newPath, e.target.value, e);
                                }}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="0"
                              />
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-100 font-medium">
                          <td className="px-4 py-3 text-gray-800">Total</td>
                          <td className="px-4 py-3 text-indigo-700">
                            {formData.step6.ressourcesHumaines.enseignantsRecap.reduce(
                              (acc, item) => acc + (parseInt(item.effectifsPermanents) || 0), 0
                            )}
                          </td>
                          <td className="px-4 py-3 text-indigo-700">
                            {formData.step6.ressourcesHumaines.enseignantsRecap.reduce(
                              (acc, item) => acc + (parseInt(item.effectifsVacataires) || 0), 0
                            )}
                          </td>
                          <td className="px-4 py-3 text-indigo-700">
                            {formData.step6.ressourcesHumaines.enseignantsRecap.reduce(
                              (acc, item) => acc + (parseInt(item.total) || 0), 0
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Taux d'encadrement
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    (1) Le taux d'encadrement peut être donné à un niveau plus fin (mention, parcours)
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    (2) Nombre d'étudiants / Nombre d'enseignants
                  </p>

                  <TableauFormation
                    title="Taux d'encadrement par domaine"
                    items={formData.step6.ressourcesHumaines.tauxEncadrement}
                    onAdd={(e) =>
                      handleArrayAdd(
                        "step6.ressourcesHumaines.tauxEncadrement",
                        {
                          domaines: "",
                          taux: "",
                        },
                        e,
                      )
                    }
                    onRemove={(index, e) =>
                      handleArrayRemove("step6.ressourcesHumaines.tauxEncadrement", index, e)
                    }
                    onUpdate={(index, field, value, e) =>
                      handleArrayUpdate(
                        "step6.ressourcesHumaines.tauxEncadrement",
                        index,
                        field,
                        value,
                        e,
                      )
                    }
                    addButtonText="+ Ajouter un taux d'encadrement"
                    columns={[
                      {
                        field: "domaines",
                        label: "Domaines (1)",
                        required: true,
                        placeholder: "Ex: Sciences et Technologies",
                      },
                      {
                        field: "taux",
                        label: "Taux d'encadrement (2)",
                        required: true,
                        placeholder: "Ex: 15:1",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    6.1.2 Personnel de soutien
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                            Fonctions
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                            Effectifs
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {formData.step6.ressourcesHumaines.personnelSoutien.map((item, index) => (
                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">
                              {item.fonctions}
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={item.effectifs}
                                onChange={(e) => {
                                  const newPath = `step6.ressourcesHumaines.personnelSoutien.${index}.effectifs`;
                                  handleInputChange(newPath, e.target.value, e);
                                }}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="0"
                              />
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-100 font-medium">
                          <td className="px-4 py-3 text-gray-800">Total</td>
                          <td className="px-4 py-3 text-indigo-700">
                            {formData.step6.ressourcesHumaines.personnelSoutien.reduce(
                              (acc, item) => acc + (parseInt(item.effectifs) || 0), 0
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Section>

            <Section
              title="6.2 Infrastructures et moyens matériels disponibles"
              section="infrastructuresMaterielles"
              icon={FaBuilding}
            >
              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    6.2.1 Salles de cours
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Donner le nombre de salles en fonction de leur capacité (Tableau 14)
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                            Capacité
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                            Nombre
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {formData.step6.infrastructures.sallesCours.map((item, index) => (
                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">
                              {item.capacite}
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={item.nombre}
                                onChange={(e) => {
                                  const newPath = `step6.infrastructures.sallesCours.${index}.nombre`;
                                  handleInputChange(newPath, e.target.value, e);
                                }}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="0"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    6.2.2 Laboratoires pédagogiques et équipements
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Pour les laboratoires, donner l'intitulé de chaque laboratoire et la capacité en étudiants. Les équipements sont à présenter sous forme de tableau (Tableau 15).
                  </p>

                  <TableauFormation
                    title="Équipements des laboratoires pédagogiques"
                    items={formData.step6.infrastructures.laboratoiresPedagogiques}
                    onAdd={(e) =>
                      handleArrayAdd(
                        "step6.infrastructures.laboratoiresPedagogiques",
                        {
                          numero: "",
                          designation: "",
                          nombre: "",
                        },
                        e,
                      )
                    }
                    onRemove={(index, e) =>
                      handleArrayRemove("step6.infrastructures.laboratoiresPedagogiques", index, e)
                    }
                    onUpdate={(index, field, value, e) =>
                      handleArrayUpdate(
                        "step6.infrastructures.laboratoiresPedagogiques",
                        index,
                        field,
                        value,
                        e,
                      )
                    }
                    addButtonText="+ Ajouter un équipement"
                    columns={[
                      {
                        field: "numero",
                        label: "N°",
                        required: true,
                        placeholder: "Ex: 1",
                      },
                      {
                        field: "designation",
                        label: "Désignation de l'équipement",
                        required: true,
                        placeholder: "Ex: Microscope électronique",
                      },
                      {
                        field: "nombre",
                        label: "Nombre",
                        required: true,
                        placeholder: "Ex: 2",
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    6.2.3 Laboratoires/Projets/Equipes de recherche de soutien à la formation proposée
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Citer tous les laboratoires de recherche impliqués, les chercheurs et les thèmes/axes de recherche développés dans le cadre de la formation, notamment dans le cursus Master.
                  </p>
                  
                  <TextAreaField
                    label="Description des laboratoires de recherche"
                    path="step6.infrastructures.laboratoiresRecherche.description"
                    placeholder="Décrivez les laboratoires de recherche, les chercheurs impliqués et les thèmes de recherche..."
                    rows={6}
                  />

                  <TableauFormation
                    title="Laboratoires de recherche"
                    items={formData.step6.infrastructures.laboratoiresRecherche.laboratoires}
                    onAdd={(e) =>
                      handleArrayAdd(
                        "step6.infrastructures.laboratoiresRecherche.laboratoires",
                        {
                          nom: "",
                          chercheurs: "",
                          themes: "",
                        },
                        e,
                      )
                    }
                    onRemove={(index, e) =>
                      handleArrayRemove("step6.infrastructures.laboratoiresRecherche.laboratoires", index, e)
                    }
                    onUpdate={(index, field, value, e) =>
                      handleArrayUpdate(
                        "step6.infrastructures.laboratoiresRecherche.laboratoires",
                        index,
                        field,
                        value,
                        e,
                      )
                    }
                    addButtonText="+ Ajouter un laboratoire"
                    columns={[
                      {
                        field: "nom",
                        label: "Nom du laboratoire",
                        required: true,
                        placeholder: "Ex: Laboratoire de Mathématiques Appliquées",
                      },
                      {
                        field: "chercheurs",
                        label: "Chercheurs impliqués",
                        required: true,
                        placeholder: "Ex: 5 enseignants-chercheurs",
                      },
                      {
                        field: "themes",
                        label: "Thèmes/axes de recherche",
                        required: true,
                        placeholder: "Ex: Analyse numérique, optimisation",
                        fullWidth: true,
                      },
                    ]}
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    6.2.4 Documentation
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Préciser si les bibliothèques de l'institution d'enseignement supérieur sont pourvues en ouvrages scientifiques et techniques appropriés à la formation proposée. Donner leur nombre.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <InputField
                      label="Description de la documentation"
                      path="step6.infrastructures.documentation.description"
                      placeholder="Décrivez les ressources documentaires disponibles..."
                      rows={3}
                    />

                    <InputField
                      label="Nombre d'ouvrages scientifiques"
                      path="step6.infrastructures.documentation.ouvragesScientifiques"
                      type="number"
                      placeholder="Ex: 500"
                    />

                    <InputField
                      label="Nombre d'ouvrages techniques"
                      path="step6.infrastructures.documentation.ouvragesTechniques"
                      type="number"
                      placeholder="Ex: 300"
                    />

                    <InputField
                      label="Abonnements à des revues"
                      path="step6.infrastructures.documentation.abonnements"
                      placeholder="Ex: 20 revues scientifiques"
                    />
                  </div>

                  <FileUpload
                    path="step6.infrastructures.documentation.preuves"
                    label="Preuves (inventaire, photos)"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    6.2.5 Espaces de travaux personnels et TIC
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Indiquer la localisation, la capacité, l'équipement et le fonctionnement
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <InputField
                      label="Localisation"
                      path="step6.infrastructures.espacesTravail.localisation"
                      placeholder="Ex: Bâtiment A, 2ème étage"
                    />

                    <InputField
                      label="Capacité (places)"
                      path="step6.infrastructures.espacesTravail.capacite"
                      type="number"
                      placeholder="Ex: 50"
                    />

                    <InputField
                      label="Équipement"
                      path="step6.infrastructures.espacesTravail.equipement"
                      placeholder="Ex: 20 ordinateurs, connexion WiFi"
                      rows={2}
                    />

                    <InputField
                      label="Fonctionnement"
                      path="step6.infrastructures.espacesTravail.fonctionnement"
                      placeholder="Ex: Ouvert de 8h à 18h, accès libre"
                      rows={2}
                    />
                  </div>

                  <FileUpload
                    path="step6.infrastructures.espacesTravail.preuves"
                    label="Preuves (photos, règlement)"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
              </div>
            </Section>
          </div>
        );

      case 7:
        return (
          <div className="space-y-8">
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-blue-800 font-medium mb-1">
                    VII. Gestion des performances académiques et politique d'insertion professionnelle
                  </p>
                  <p className="text-blue-700 text-sm">
                    Objectif : Démontrer la capacité de l'établissement à suivre ses étudiants, à évaluer leurs performances et à faciliter leur insertion professionnelle.
                  </p>
                </div>
              </div>
            </div>

            <Section
              title="7.1 Indicateurs de suivi des performances académiques"
              section="performancesAcademiques"
              icon={FaChartLine}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InputField
                  label="Taux de réussite"
                  path="step7.performancesAcademiques.tauxReussite"
                  placeholder="Ex: 85%"
                />

                <InputField
                  label="Taux de poursuite d'études"
                  path="step7.performancesAcademiques.tauxPoursuite"
                  placeholder="Ex: 30%"
                />

                <InputField
                  label="Taux d'abandon"
                  path="step7.performancesAcademiques.tauxAbandon"
                  placeholder="Ex: 10%"
                />

                <InputField
                  label="Durée moyenne des études"
                  path="step7.performancesAcademiques.dureeMoyenne"
                  placeholder="Ex: 2 ans"
                />
              </div>

              <TableauFormation
                title="Autres indicateurs de performance"
                items={formData.step7.performancesAcademiques.indicateurs}
                onAdd={(e) =>
                  handleArrayAdd(
                    "step7.performancesAcademiques.indicateurs",
                    {
                      nom: "",
                      valeur: "",
                      annee: "",
                    },
                    e,
                  )
                }
                onRemove={(index, e) =>
                  handleArrayRemove("step7.performancesAcademiques.indicateurs", index, e)
                }
                onUpdate={(index, field, value, e) =>
                  handleArrayUpdate(
                    "step7.performancesAcademiques.indicateurs",
                    index,
                    field,
                    value,
                    e,
                  )
                }
                addButtonText="+ Ajouter un indicateur"
                columns={[
                  {
                    field: "nom",
                    label: "Indicateur",
                    required: true,
                    placeholder: "Ex: Taux de passage en année supérieure",
                  },
                  {
                    field: "valeur",
                    label: "Valeur",
                    required: true,
                    placeholder: "Ex: 90%",
                  },
                  {
                    field: "annee",
                    label: "Année",
                    required: true,
                    placeholder: "Ex: 2024",
                  },
                ]}
              />

              <FileUpload
                path="step7.performancesAcademiques.preuves"
                label="Preuves (statistiques, rapports)"
                accept=".pdf,.xls,.xlsx"
              />
            </Section>

            <Section
              title="7.2 Politique d'insertion professionnelle"
              section="insertionProfessionnelle"
              icon={FaBriefcase}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InputField
                  label="Taux d'insertion professionnelle"
                  path="step7.insertionProfessionnelle.tauxInsertion"
                  placeholder="Ex: 80% à 6 mois"
                />

                <InputField
                  label="Délai moyen d'insertion"
                  path="step7.insertionProfessionnelle.delaiInsertion"
                  placeholder="Ex: 3 mois"
                />

                <InputField
                  label="Secteurs d'activité"
                  path="step7.insertionProfessionnelle.secteursActivite"
                  placeholder="Ex: Enseignement, Recherche, Industrie"
                  rows={2}
                />

                <InputField
                  label="Partenariats avec les entreprises"
                  path="step7.insertionProfessionnelle.partenariatsEntreprises"
                  placeholder="Ex: 20 conventions de stage"
                  rows={2}
                />
              </div>

              <TextAreaField
                label="Dispositif d'accompagnement à l'insertion"
                path="step7.insertionProfessionnelle.dispositifAccompagnement"
                placeholder="Décrivez les dispositifs mis en place pour faciliter l'insertion professionnelle (stages, ateliers CV, forum entreprises, etc.)"
                rows={4}
              />

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Enquêtes d'insertion professionnelle
                </label>
                <FileUpload
                  path="step7.insertionProfessionnelle.enquetes"
                  label="Résultats d'enquêtes"
                  accept=".pdf"
                />
              </div>

              <FileUpload
                path="step7.insertionProfessionnelle.preuves"
                label="Preuves (conventions, partenariats)"
                accept=".pdf"
              />
            </Section>

            <Section
              title="7.3 Politique de suivi des diplômés"
              section="suiviDiplomes"
              icon={FaUsers}
            >
              <TextAreaField
                label="Dispositif de suivi des diplômés"
                path="step7.suiviDiplomes.dispositifSuivi"
                placeholder="Décrivez comment vous assurez le suivi de vos diplômés (enquêtes, réseau, etc.)"
                rows={3}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <InputField
                  label="Base de données des diplômés"
                  path="step7.suiviDiplomes.baseDonnees"
                  placeholder="Ex: 500 diplômés répertoriés"
                />

                <InputField
                  label="Association des anciens"
                  path="step7.suiviDiplomes.associationAlumni"
                  placeholder="Ex: Association créée en 2020"
                />

                <InputField
                  label="Rencontres avec les anciens"
                  path="step7.suiviDiplomes.rencontresAnciens"
                  placeholder="Ex: 2 rencontres par an"
                />
              </div>

              <FileUpload
                path="step7.suiviDiplomes.preuves"
                label="Preuves (statistiques, comptes-rendus)"
                accept=".pdf"
              />
            </Section>

            <Section
              title="7.4 Publications issues des mémoires ou poursuite des études en thèse de doctorat pour les masters à vocation recherche"
              section="publicationsRecherche"
              icon={FaBook}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InputField
                  label="Publications issues des mémoires"
                  path="step7.publicationsRecherche.publicationsMemoires"
                  placeholder="Ex: 10 publications par an"
                />

                <InputField
                  label="Nombre de publications"
                  path="step7.publicationsRecherche.nombrePublications"
                  type="number"
                  placeholder="Ex: 25"
                />

                <InputField
                  label="Revues de publication"
                  path="step7.publicationsRecherche.revues"
                  placeholder="Ex: Revue Africaine de Mathématiques"
                />

                <InputField
                  label="Conférences"
                  path="step7.publicationsRecherche.conferences"
                  placeholder="Ex: 5 communications par an"
                />

                <InputField
                  label="Taux de poursuite en doctorat"
                  path="step7.publicationsRecherche.poursuiteDoctorat"
                  placeholder="Ex: 20%"
                />
              </div>

              <TableauFormation
                title="Liste des publications"
                items={formData.step7.publicationsRecherche.listePublications}
                onAdd={(e) =>
                  handleArrayAdd(
                    "step7.publicationsRecherche.listePublications",
                    {
                      titre: "",
                      auteurs: "",
                      revue: "",
                      annee: "",
                    },
                    e,
                  )
                }
                onRemove={(index, e) =>
                  handleArrayRemove("step7.publicationsRecherche.listePublications", index, e)
                }
                onUpdate={(index, field, value, e) =>
                  handleArrayUpdate(
                    "step7.publicationsRecherche.listePublications",
                    index,
                    field,
                    value,
                    e,
                  )
                }
                addButtonText="+ Ajouter une publication"
                columns={[
                  {
                    field: "titre",
                    label: "Titre de la publication",
                    required: true,
                    placeholder: "Titre de l'article",
                  },
                  {
                    field: "auteurs",
                    label: "Auteurs",
                    required: true,
                    placeholder: "Ex: Dupont, J., Martin, P.",
                  },
                  {
                    field: "revue",
                    label: "Revue/Conférence",
                    required: true,
                    placeholder: "Nom de la revue",
                  },
                  {
                    field: "annee",
                    label: "Année",
                    required: true,
                    placeholder: "Ex: 2024",
                  },
                ]}
              />

              <FileUpload
                path="step7.publicationsRecherche.preuves"
                label="Preuves (articles, actes de conférence)"
                accept=".pdf"
              />
            </Section>
          </div>
        );

      case 8:
        return (
          <div className="space-y-8">
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-blue-800 font-medium mb-1">
                    VIII. Gouvernance et assurance qualité
                  </p>
                  <p className="text-blue-700 text-sm">
                    Objectif : S'assurer que la formation est suivie et régulée par des instances fonctionnelles et une cellule Assurance Qualité (AQ) active.
                    La gouvernance du parcours et l'assurance qualité constituent deux piliers essentiels pour garantir la crédibilité académique, la transparence institutionnelle et la conformité aux standards nationaux et internationaux.
                  </p>
                </div>
              </div>
            </div>

            <Section
              title="8.1 Instances de gouvernance"
              section="gouvernance"
              icon={FaUsers}
            >
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-3">
                    Comité pédagogique
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Composition"
                      path="step8.gouvernance.comitePedagogique.composition"
                      placeholder="Ex: Responsables de mention, enseignants, étudiants"
                    />
                    <InputField
                      label="Rôles et missions"
                      path="step8.gouvernance.comitePedagogique.roles"
                      placeholder="Ex: Validation des programmes, suivi pédagogique"
                    />
                    <InputField
                      label="Fréquence des réunions"
                      path="step8.gouvernance.comitePedagogique.frequenceReunions"
                      placeholder="Ex: 3 fois par an"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PV des réunions
                      </label>
                      <FileUpload
                        path="step8.gouvernance.comitePedagogique.pvReunions"
                        label="PV"
                        accept=".pdf"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-3">
                    Comité scientifique et professionnel
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Composition"
                      path="step8.gouvernance.comiteScientifique.composition"
                      placeholder="Ex: Chercheurs, professionnels, experts"
                    />
                    <InputField
                      label="Rôles et missions"
                      path="step8.gouvernance.comiteScientifique.roles"
                      placeholder="Ex: Orientation scientifique, veille professionnelle"
                    />
                    <InputField
                      label="Fréquence des réunions"
                      path="step8.gouvernance.comiteScientifique.frequenceReunions"
                      placeholder="Ex: 2 fois par an"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PV des réunions
                      </label>
                      <FileUpload
                        path="step8.gouvernance.comiteScientifique.pvReunions"
                        label="PV"
                        accept=".pdf"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-3">
                    Coordination administrative
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Composition"
                      path="step8.gouvernance.coordinationAdministrative.composition"
                      placeholder="Ex: Coordonnateur, secrétariat pédagogique"
                    />
                    <InputField
                      label="Rôles et missions"
                      path="step8.gouvernance.coordinationAdministrative.roles"
                      placeholder="Ex: Gestion des emplois du temps, suivi administratif"
                    />
                    <InputField
                      label="Contact"
                      path="step8.gouvernance.coordinationAdministrative.contact"
                      placeholder="Ex: coordination@universite.bf"
                    />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-3">
                    Implications des étudiants
                  </h5>
                  <div className="grid grid-cols-1 gap-4">
                    <InputField
                      label="Représentation étudiante"
                      path="step8.gouvernance.implicationsEtudiants.representation"
                      placeholder="Ex: 2 représentants par promotion"
                    />
                    <InputField
                      label="Participation aux instances"
                      path="step8.gouvernance.implicationsEtudiants.participationInstances"
                      placeholder="Ex: Présence au conseil pédagogique"
                    />
                    <InputField
                      label="Évaluation des enseignements"
                      path="step8.gouvernance.implicationsEtudiants.evaluationEnseignements"
                      placeholder="Ex: Enquêtes de satisfaction annuelles"
                    />
                  </div>
                </div>
              </div>
            </Section>

            <Section
              title="8.2 Structure d'assurance qualité"
              section="assuranceQualite"
              icon={FaCheck}
            >
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-3">
                    Structure
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Nom de la structure"
                      path="step8.assuranceQualite.structure.nom"
                      placeholder="Ex: Cellule Assurance Qualité"
                    />
                    <InputField
                      label="Composition"
                      path="step8.assuranceQualite.structure.composition"
                      placeholder="Ex: Responsable, 3 membres"
                    />
                    <InputField
                      label="Rattachement"
                      path="step8.assuranceQualite.structure.rattachement"
                      placeholder="Ex: Direction des Études"
                    />
                    <InputField
                      label="Contact"
                      path="step8.assuranceQualite.structure.contact"
                      placeholder="Ex: qualite@universite.bf"
                    />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-3">
                    Plan opérationnel
                  </h5>
                  <div className="grid grid-cols-1 gap-4">
                    <TextAreaField
                      label="Objectifs"
                      path="step8.assuranceQualite.planOperationnel.objectifs"
                      placeholder="Décrivez les objectifs du plan d'assurance qualité..."
                      rows={2}
                    />
                    <TextAreaField
                      label="Actions"
                      path="step8.assuranceQualite.planOperationnel.actions"
                      placeholder="Listez les actions prévues..."
                      rows={2}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Indicateurs"
                        path="step8.assuranceQualite.planOperationnel.indicateurs"
                        placeholder="Ex: Taux de satisfaction, nombre d'évaluations"
                      />
                      <InputField
                        label="Calendrier"
                        path="step8.assuranceQualite.planOperationnel.calendrier"
                        placeholder="Ex: 2024-2026"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rapports d'évaluation
                      </label>
                      <FileUpload
                        path="step8.assuranceQualite.planOperationnel.rapports"
                        label="Rapports"
                        accept=".pdf"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-3">
                    Procédures qualité
                  </h5>
                  <div className="grid grid-cols-1 gap-4">
                    <InputField
                      label="Évaluation interne"
                      path="step8.assuranceQualite.procedures.evaluationInterne"
                      placeholder="Ex: Auto-évaluation annuelle"
                    />
                    <InputField
                      label="Évaluation externe"
                      path="step8.assuranceQualite.procedures.evaluationExterne"
                      placeholder="Ex: Audit tous les 3 ans"
                    />
                    <InputField
                      label="Révision des programmes"
                      path="step8.assuranceQualite.procedures.revisionProgrammes"
                      placeholder="Ex: Révision quadriennale"
                    />
                    <InputField
                      label="Gestion des réclamations"
                      path="step8.assuranceQualite.procedures.gestionReclamations"
                      placeholder="Ex: Boîte à suggestions, traitement sous 15 jours"
                    />
                  </div>
                </div>

                <FileUpload
                  path="step8.assuranceQualite.preuves"
                  label="Preuves (documents qualité, procédures, rapports)"
                  accept=".pdf"
                />
              </div>
            </Section>
          </div>
        );

      case 9:
        return (
          <div className="space-y-8">
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-blue-800 font-medium mb-1">
                    IX. ANNEXES
                  </p>
                  <p className="text-blue-700 text-sm">
                    Téléchargez les pièces justificatives requises pour votre demande d'habilitation.
                  </p>
                  <p className="text-red-600 font-semibold mt-2">
                    Remarque: TOUTE INFORMATION FOURNIE DOIT ETRE APPUYEE PAR DES PIÈCES JUSTIFICATIVES. LA QUALITE ET L'AUTHENTICITE DES PREUVES SONT DETERMINANTES POUR LA DECISION D'HABILITATION.
                  </p>
                </div>
              </div>
            </div>

            <Section
              title="Annexes"
              section="annexes"
              icon={FaFileUpload}
            >
              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Liste des CV et lettres d'engagement
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    CV des enseignants-chercheurs et intervenants professionnels, accompagnés de leurs lettres d'engagement signées.
                  </p>
                  <FileUpload
                    path="step9.annexes.cvEtLettresEngagement"
                    label="CV et lettres d'engagement"
                    accept=".pdf"
                    multiple={true}
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Conventions de partenariats signées
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Conventions avec les partenaires académiques, les entreprises, les laboratoires de recherche, etc.
                  </p>
                  <FileUpload
                    path="step9.annexes.conventionsPartenariats"
                    label="Conventions signées"
                    accept=".pdf"
                    multiple={true}
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Autres documents justificatifs
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Tout autre document pertinent pour appuyer votre demande (attestations, certificats, etc.)
                  </p>
                  <FileUpload
                    path="step9.annexes.autresDocuments"
                    label="Autres documents"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    multiple={true}
                  />
                </div>

                <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h5 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <FaInfoCircle />
                    Rappel important
                  </h5>
                  <p className="text-yellow-700">
                    TOUTE INFORMATION FOURNIE DOIT ETRE APPUYEE PAR DES PIÈCES JUSTIFICATIVES. 
                    LA QUALITE ET L'AUTHENTICITE DES PREUVES SONT DETERMINANTES POUR LA DECISION D'HABILITATION.
                  </p>
                  <p className="text-yellow-700 mt-2">
                    Assurez-vous que tous les documents sont complets, signés et datés.
                  </p>
                </div>
              </div>
            </Section>
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <p className="text-gray-700">
              Récapitulatif de l'ensemble de votre demande d'habilitation
              Master. Vérifiez toutes les informations avant soumission finale.
            </p>
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Aperçu de votre demande d'habilitation Master
              </h3>
              <ul className="space-y-2">
                {formSteps.slice(0, -1).map((step, index) => (
                  <li key={index} className="flex items-center">
                    <FaCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>{step.title.replace(/\n/g, " ")} - Complété</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-indigo-800 font-medium">
                  Toutes les sections spécifiques au Master ont été complétées.
                  Votre demande est prête à être soumise.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white py-6 md:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12 bg-white pb-6 pt-4 px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 px-4">
            Demande d'habilitation des formations conduisant au grade de Master
          </h1>
        </div>

        <div className="mb-8 md:mb-12">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm md:text-base font-medium text-gray-600">
              Progression
            </span>
            <span className="text-sm md:text-base font-semibold text-indigo-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 md:h-3">
            <div
              className="h-2.5 md:h-3 rounded-full transition-all duration-500 ease-out bg-indigo-600"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="md:hidden mb-6">
          <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              Étape {currentStep} sur {formSteps.length}
            </h2>
            <p className="text-lg text-gray-700 mt-2 font-medium">
              {formSteps[currentStep - 1]?.title.replace(/\n/g, " ")}
            </p>
          </div>
        </div>

        <div className="hidden md:block mb-10">
          <div className="relative">
            <div className="absolute left-0 right-0 top-[22px] h-0.5 bg-gray-200" />
            <div
              className="absolute left-0 top-[22px] h-0.5 transition-all duration-500 ease-out bg-indigo-600"
              style={{ width: `${progressPercentage}%` }}
            />

            <div className="grid grid-cols-10 gap-3 relative z-10">
              {formSteps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-sm font-bold
                      ${
                        step.id < currentStep
                          ? "bg-green-600 border-green-600 text-white"
                          : step.id === currentStep
                            ? "bg-indigo-600 border-indigo-600 ring-4 ring-indigo-200 text-white"
                            : "bg-white border-gray-300 text-gray-500"
                      }
                    `}
                  >
                    {step.id < currentStep ? (
                      <FaCheck className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <p className="mt-2 text-xs font-medium text-gray-700 text-center leading-tight whitespace-pre-line">
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-9 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            {formSteps[currentStep - 1]?.title.replace(/\n/g, " ")}
          </h2>

          <div className="min-h-[50vh]">{renderFormContent()}</div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6">
          {currentStep === 1 ? (
            <button
              onClick={handleBackToCanevas}
              className="flex items-center gap-2 px-6 md:px-8 py-3 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 border border-gray-300 transition shadow-sm"
            >
              <FaArrowLeft className="w-5 h-5" />
              Retour au canevas
            </button>
          ) : (
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 px-6 md:px-8 py-3 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 border border-gray-300 transition shadow-sm"
            >
              <FaArrowLeft className="w-5 h-5" />
              Précédent
            </button>
          )}

          {currentStep < formSteps.length ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 md:px-10 py-3 rounded-lg font-medium shadow-sm transition bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Suivant
              <FaArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`
                flex items-center gap-2 px-8 md:px-10 py-3 rounded-lg font-medium shadow-sm transition
                ${
                  isSubmitting
                    ? "bg-green-400 text-white cursor-wait"
                    : "bg-green-600 text-white hover:bg-green-700"
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                "Soumettre la demande"
              )}
            </button>
          )}
        </div>
      </div>

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

export default FormMaster;