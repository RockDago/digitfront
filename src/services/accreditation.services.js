// src/services/accreditation.services.js
import API from "../config/axios";

// ===========================================================================
// CONSTANTES
// ✅ Seuls 3 statuts sont gérables manuellement par admin/SAE
// ===========================================================================
export const STATUT_DEMANDE = {
  BROUILLON: "brouillon",
  EN_COURS: "en_cours", // ✅ statut automatique après soumission
  ACCREDITE: "accredite", // ✅ décision admin (finale — non modifiable)
  AJOURNE: "ajourne", // ✅ décision admin (peut → rejetee)
  REJETE: "rejetee", // ✅ décision admin (peut → ajourne)  ← "rejetee" côté backend
};

// ✅ Les 3 statuts que l'admin peut attribuer manuellement
export const STATUTS_ADMIN = [
  STATUT_DEMANDE.ACCREDITE,
  STATUT_DEMANDE.AJOURNE,
  STATUT_DEMANDE.REJETE,
];

// ✅ Transitions autorisées par statut courant
// accredite → aucune transition (décision finale)
// ajourne   → rejetee uniquement
// rejetee   → ajourne uniquement
// en_cours  → accredite | ajourne | rejetee
export const TRANSITIONS_AUTORISEES = {
  [STATUT_DEMANDE.EN_COURS]: [
    STATUT_DEMANDE.ACCREDITE,
    STATUT_DEMANDE.AJOURNE,
    STATUT_DEMANDE.REJETE,
  ],
  [STATUT_DEMANDE.AJOURNE]: [STATUT_DEMANDE.REJETE],
  [STATUT_DEMANDE.REJETE]: [STATUT_DEMANDE.AJOURNE],
  [STATUT_DEMANDE.ACCREDITE]: [], // aucune transition possible
};

export const TYPE_ETABLISSEMENT = { PUBLIQUE: "Publique", PRIVEE: "Privée" };
export const GRADE = {
  LICENCE: "LICENCE",
  MASTER: "MASTER",
  DOCTORAT: "DOCTORAT",
};

export const normalizeEnumValue = (value) => {
  if (!value || typeof value !== "string") return value;
  if (value.includes(".")) return value.split(".").pop();
  return value;
};

const normalizeArray = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.results)) return raw.results;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.results)) return raw.data.results;
  console.warn(
    "[normalizeArray] Structure inattendue:",
    typeof raw,
    Object.keys(raw || {}),
  );
  return [];
};

const normalizeObject = (raw) => {
  if (raw?.data && typeof raw.data === "object" && !Array.isArray(raw.data))
    return raw.data;
  return raw;
};

const normalizeDemandeFichier = (f) => ({
  id: f.id,
  nom_original: f.nom_original || f.name || `fichier_${f.id}`,
  nom_stockage: f.nom_stockage || "",
  taille: f.taille || f.size || 0,
  type_mime: f.type_mime || f.type || "application/octet-stream",
  uploaded_at: f.uploaded_at || f.date_upload || null,
  name: f.nom_original || f.name,
  size: f.taille || f.size,
  date: f.uploaded_at || f.date_upload,
  type: f.type_mime || f.type,
});

const normalizeDemandeObject = (d) => {
  if (!d) return d;
  return {
    ...d,
    statut: normalizeEnumValue(d.statut),
    type_etablissement: normalizeEnumValue(d.type_etablissement),
    grade: normalizeEnumValue(d.grade),
    niveau_conformite: normalizeEnumValue(d.niveau_conformite),
    fichiers: Array.isArray(d.fichiers)
      ? d.fichiers.map(normalizeDemandeFichier)
      : [],
    historique: Array.isArray(d.historique) ? d.historique : [],
  };
};

// ===========================================================================
// AUTO-ÉVALUATION
// ===========================================================================
export const getMyAutoEvaluations = async () => {
  try {
    const response = await API.get("/accreditation/auto-evaluations");
    const list = normalizeArray(response.data);
    console.log(
      `[getMyAutoEvaluations] ${list.length} évaluation(s) trouvée(s)`,
    );
    return list;
  } catch (error) {
    console.error(
      "[getMyAutoEvaluations]",
      error?.response?.status,
      error?.message,
    );
    throw error;
  }
};

export const getAutoEvaluation = async (evalId) => {
  try {
    const response = await API.get(`/accreditation/auto-evaluations/${evalId}`);
    const detail = normalizeObject(response.data);
    if (!Array.isArray(detail.criteres)) detail.criteres = [];
    detail.criteres = detail.criteres.map((c) => ({
      ...c,
      appreciation: normalizeEnumValue(c.appreciation),
      critere_id: normalizeCritereId(c.critere_id || c.id),
      fichiers: Array.isArray(c.fichiers)
        ? c.fichiers.map(normalizeDemandeFichier)
        : [],
    }));
    console.log(
      `[getAutoEvaluation] id=${evalId} → ${detail.criteres.length} critère(s)`,
    );
    return detail;
  } catch (error) {
    console.error(
      `[getAutoEvaluation] id=${evalId}`,
      error?.response?.status,
      error?.message,
    );
    throw error;
  }
};

const normalizeCritereId = (critereId) => {
  if (!critereId) return critereId;
  const match = critereId.toString().match(/(\D+)(\d+)$/);
  if (match) return `${match[1]}${match[2].padStart(2, "0")}`;
  return critereId;
};

export const createOrUpdateAutoEvaluation = async (data) => {
  try {
    console.log(
      `[createOrUpdateAutoEvaluation] ${data.criteres?.length} critère(s)`,
    );
    const response = await API.post("/accreditation/auto-evaluations", data);
    const result = normalizeObject(response.data);
    console.log(`[createOrUpdateAutoEvaluation] → id=${result.id}`);
    return result;
  } catch (error) {
    console.error(
      "[createOrUpdateAutoEvaluation]",
      error?.response?.status,
      error?.response?.data,
    );
    throw error;
  }
};

export const deleteAutoEvaluation = async (evalId) => {
  try {
    const response = await API.delete(
      `/accreditation/auto-evaluations/${evalId}`,
    );
    return response.data;
  } catch (error) {
    console.error(`[deleteAutoEvaluation] id=${evalId}`, error);
    throw error;
  }
};

// ===========================================================================
// FICHIERS DES CRITÈRES
// ===========================================================================
export const uploadCritereFichiers = async (evalId, critereId, files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const response = await API.post(
      `/accreditation/auto-evaluations/${evalId}/criteres/${critereId}/fichiers`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    const raw = response.data;
    let fichiers = [];
    if (Array.isArray(raw)) fichiers = raw;
    else if (Array.isArray(raw?.fichiers)) fichiers = raw.fichiers;
    else if (Array.isArray(raw?.data?.fichiers)) fichiers = raw.data.fichiers;
    else if (Array.isArray(raw?.data)) fichiers = raw.data;
    fichiers = fichiers.map(normalizeDemandeFichier);
    console.log(
      `[uploadCritereFichiers] critere=${critereId} → ${fichiers.length} fichier(s)`,
    );
    return { fichiers };
  } catch (error) {
    console.error(
      `[uploadCritereFichiers] eval=${evalId} critere=${critereId}`,
      error?.response?.data,
    );
    throw error;
  }
};

export const deleteCritereFichier = async (evalId, critereId, fichierId) => {
  try {
    const response = await API.delete(
      `/accreditation/auto-evaluations/${evalId}/criteres/${critereId}/fichiers/${fichierId}`,
    );
    return response.data;
  } catch (error) {
    console.error(`[deleteCritereFichier] fichier=${fichierId}`, error);
    throw error;
  }
};

// ===========================================================================
// DEMANDES D'ACCRÉDITATION
// ===========================================================================
export const getMyDemandes = async () => {
  try {
    const response = await API.get("/accreditation/demandes");
    const raw = normalizeArray(response.data);
    const normalized = raw.map(normalizeDemandeObject);
    console.log(`[getMyDemandes] ${normalized.length} demande(s)`);
    return normalized;
  } catch (error) {
    console.error("[getMyDemandes]", error);
    throw error;
  }
};

export const getDemande = async (demandeId) => {
  try {
    const response = await API.get(`/accreditation/demandes/${demandeId}`);
    const raw = normalizeObject(response.data);
    const normalized = normalizeDemandeObject(raw);
    console.log(`[getDemande] id=${demandeId}, statut="${normalized.statut}"`);
    return normalized;
  } catch (error) {
    console.error(`[getDemande] id=${demandeId}`, error);
    throw error;
  }
};

export const createDemande = async (data) => {
  try {
    const formData = new FormData();
    if (!data.auto_evaluation_id)
      throw new Error("L'ID de l'auto-évaluation est requis");
    const autoEvaluationId = parseInt(data.auto_evaluation_id);
    if (isNaN(autoEvaluationId))
      throw new Error("L'ID de l'auto-évaluation doit être un nombre valide");
    formData.append("responsable", data.responsable || "");
    formData.append("type_etablissement", data.type_etablissement || "");
    formData.append("domaine", data.domaine || "");
    formData.append("mention", data.mention || "");
    formData.append("grade", data.grade || "");
    formData.append("parcours", data.parcours || "");
    formData.append("auto_evaluation_id", autoEvaluationId);
    if (
      data.type_etablissement === TYPE_ETABLISSEMENT.PUBLIQUE &&
      data.etablissement
    )
      formData.append("etablissement", data.etablissement);
    else if (
      data.type_etablissement === TYPE_ETABLISSEMENT.PRIVEE &&
      data.institution
    )
      formData.append("institution", data.institution);
    const response = await API.post("/accreditation/demandes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeDemandeObject(normalizeObject(response.data));
  } catch (error) {
    console.error("[createDemande]", error?.response?.data);
    if (error.response?.data?.detail)
      error.message = error.response.data.detail;
    else if (error.response?.data?.message)
      error.message = error.response.data.message;
    throw error;
  }
};

export const updateDemande = async (demandeId, data) => {
  try {
    const formData = new FormData();
    if (data.responsable) formData.append("responsable", data.responsable);
    if (data.type_etablissement)
      formData.append("type_etablissement", data.type_etablissement);
    if (data.domaine) formData.append("domaine", data.domaine);
    if (data.mention) formData.append("mention", data.mention);
    if (data.grade) formData.append("grade", data.grade);
    if (data.parcours) formData.append("parcours", data.parcours);
    if (
      data.type_etablissement === TYPE_ETABLISSEMENT.PUBLIQUE &&
      data.etablissement
    )
      formData.append("etablissement", data.etablissement);
    else if (
      data.type_etablissement === TYPE_ETABLISSEMENT.PRIVEE &&
      data.institution
    )
      formData.append("institution", data.institution);
    const response = await API.put(
      `/accreditation/demandes/${demandeId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return normalizeDemandeObject(normalizeObject(response.data));
  } catch (error) {
    console.error(`[updateDemande] id=${demandeId}`, error);
    throw error;
  }
};

export const deleteDemande = async (demandeId) => {
  try {
    const response = await API.delete(`/accreditation/demandes/${demandeId}`);
    return response.data;
  } catch (error) {
    console.error(`[deleteDemande] id=${demandeId}`, error);
    throw error;
  }
};

export const submitDemande = async (demandeId) => {
  try {
    const response = await API.patch(
      `/accreditation/demandes/${demandeId}/soumettre`,
    );
    return normalizeDemandeObject(normalizeObject(response.data));
  } catch (error) {
    console.error(`[submitDemande] id=${demandeId}`, error);
    throw error;
  }
};

/**
 * ✅ Change le statut — admin/SAE uniquement.
 * Transitions autorisées :
 *   en_cours  → accredite | ajourne | rejete
 *   ajourne   → rejete
 *   rejete    → ajourne
 *   accredite → aucune (décision finale)
 */
export const updateDemandeStatut = async (demandeId, statut, notes = null) => {
  try {
    const payload = { statut };
    if (notes) payload.notes = notes;
    const response = await API.patch(
      `/accreditation/demandes/${demandeId}/statut`,
      payload,
    );
    const result = normalizeDemandeObject(normalizeObject(response.data));
    console.log(
      `[updateDemandeStatut] id=${demandeId} → statut="${result.statut}"`,
    );
    return result;
  } catch (error) {
    console.error(
      `[updateDemandeStatut] id=${demandeId}`,
      error?.response?.data,
    );
    if (error.response?.data?.detail)
      error.message = error.response.data.detail;
    throw error;
  }
};

// ===========================================================================
// FICHIERS DES DEMANDES
// ===========================================================================
export const uploadDemandeFichiers = async (demandeId, files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const response = await API.post(
      `/accreditation/demandes/${demandeId}/fichiers`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    const raw = normalizeObject(response.data);
    const fichiers = Array.isArray(raw?.fichiers)
      ? raw.fichiers.map(normalizeDemandeFichier)
      : Array.isArray(raw)
        ? raw.map(normalizeDemandeFichier)
        : [];
    return { fichiers };
  } catch (error) {
    console.error(`[uploadDemandeFichiers] id=${demandeId}`, error);
    throw error;
  }
};

export const downloadFichier = async (fichierId) => {
  try {
    const response = await API.get(`/accreditation/fichiers/${fichierId}`, {
      responseType: "blob",
      transformResponse: [(data) => data],
      validateStatus: (status) => status >= 200 && status < 300,
    });
    if (!response.data || response.data.size === 0) {
      throw new Error("Réponse vide — possiblement interceptée par IDM");
    }
    if (response.data instanceof Blob) return response.data;
    return new Blob([response.data]);
  } catch (error) {
    console.error(
      `[downloadFichier] id=${fichierId}`,
      error?.response?.status,
      error?.message,
    );
    throw error;
  }
};

export const deleteDemandeFichier = async (demandeId, fichierId) => {
  try {
    const response = await API.delete(
      `/accreditation/demandes/${demandeId}/fichiers/${fichierId}`,
    );
    return response.data;
  } catch (error) {
    console.error(`[deleteDemandeFichier] fichier=${fichierId}`, error);
    throw error;
  }
};

// ===========================================================================
// FORMATAGE
// ===========================================================================
export const formatAutoEvaluationData = (formData) => {
  const criteres = Object.entries(formData.criteres)
    .filter(([, data]) => data.appreciation !== "" && data.note !== "")
    .map(([critereId, data]) => ({
      critere_id: critereId,
      numero: parseInt(critereId.replace(/\D/g, "")) || 0,
      section_id: getSectionIdFromCritere(critereId),
      section_titre: getSectionTitreFromCritere(critereId),
      politique: getPolitiqueFromCritere(critereId),
      appreciation: data.appreciation,
      note: parseInt(data.note) || 0,
      preuves: data.preuves || null,
    }));
  return { criteres };
};

export const formatDemandeData = (formData, autoEvaluationId = null) => {
  let typeEtab =
    formData.typeetablissement || formData.type_etablissement || "";
  if (typeof typeEtab === "string") {
    if (typeEtab.toLowerCase().includes("public"))
      typeEtab = TYPE_ETABLISSEMENT.PUBLIQUE;
    else if (typeEtab.toLowerCase().includes("priv"))
      typeEtab = TYPE_ETABLISSEMENT.PRIVEE;
  }
  const evalId = autoEvaluationId ? parseInt(autoEvaluationId) : null;
  const data = {
    responsable: formData.responsable || "",
    type_etablissement: typeEtab,
    domaine: formData.domaine || "",
    mention: formData.mention || "",
    grade: formData.grade || "",
    parcours: formData.parcours || "",
    auto_evaluation_id: evalId,
  };
  if (formData.institution) data.institution = formData.institution;
  if (formData.etablissement) data.etablissement = formData.etablissement;
  return data;
};

export const formatDemandeResponse = (backendData) => ({
  id: backendData.id,
  numero_demande: backendData.numero_demande,
  responsable: backendData.responsable,
  type_etablissement: normalizeEnumValue(backendData.type_etablissement),
  typeetablissement: normalizeEnumValue(backendData.type_etablissement),
  institution: backendData.institution,
  etablissement: backendData.etablissement,
  domaine: backendData.domaine,
  mention: backendData.mention,
  grade: normalizeEnumValue(backendData.grade),
  parcours: backendData.parcours,
  statut: normalizeEnumValue(backendData.statut),
  est_eligible: backendData.est_eligible,
  auto_evaluation_id: backendData.auto_evaluation_id,
  fichiers: (backendData.fichiers || []).map(normalizeDemandeFichier),
  created_at: backendData.created_at,
  updated_at: backendData.updated_at,
});

export const validateDemandeData = (data) => {
  const missingFields = [];
  [
    "responsable",
    "type_etablissement",
    "domaine",
    "mention",
    "grade",
    "parcours",
    "auto_evaluation_id",
  ].forEach((f) => {
    if (!data[f] || (typeof data[f] === "string" && !data[f].trim()))
      missingFields.push(f);
  });
  if (
    data.type_etablissement === TYPE_ETABLISSEMENT.PUBLIQUE &&
    !data.etablissement?.trim()
  )
    missingFields.push("etablissement");
  else if (
    data.type_etablissement === TYPE_ETABLISSEMENT.PRIVEE &&
    !data.institution?.trim()
  )
    missingFields.push("institution");
  return { isValid: missingFields.length === 0, missingFields };
};

// ✅ canSubmitDemande : uniquement si brouillon + éligible
export const canSubmitDemande = (d) =>
  d?.statut === STATUT_DEMANDE.BROUILLON && d?.est_eligible === true;
export const canEditDemande = (d) => d?.statut === STATUT_DEMANDE.BROUILLON;
export const canDeleteDemande = (d) => d?.statut === STATUT_DEMANDE.BROUILLON;

/**
 * ✅ canChangeStatut : autorisé pour en_cours, ajourne, rejete.
 * Le statut accredite est une décision finale — aucune modification possible.
 */
export const canChangeStatut = (d) =>
  d?.statut !== undefined &&
  (TRANSITIONS_AUTORISEES[d.statut] || []).length > 0;

export const getStatutLibelle = (statut) =>
  ({
    [STATUT_DEMANDE.BROUILLON]: "Brouillon",
    [STATUT_DEMANDE.EN_COURS]: "En cours",
    [STATUT_DEMANDE.ACCREDITE]: "Accréditée",
    [STATUT_DEMANDE.AJOURNE]: "Ajournée",
    [STATUT_DEMANDE.REJETE]: "Rejetée", // rejetee
  })[normalizeEnumValue(statut)] || statut;

export const getStatutColor = (statut) =>
  ({
    [STATUT_DEMANDE.BROUILLON]: "gray",
    [STATUT_DEMANDE.EN_COURS]: "blue",
    [STATUT_DEMANDE.ACCREDITE]: "green",
    [STATUT_DEMANDE.AJOURNE]: "orange",
    [STATUT_DEMANDE.REJETE]: "red", // rejetee
  })[normalizeEnumValue(statut)] || "gray";

// ===========================================================================
// HELPERS PRIVÉS — mapping critere_id → section / politique
// ===========================================================================
const getSectionIdFromCritere = (critereId) => {
  const n = parseInt(critereId.replace(/\D/g, ""));
  if (n <= 5) return "section_1_1";
  if (n <= 27) return "section_1_2";
  if (n <= 37) return "section_1_3";
  if (n <= 43) return "section_2_1";
  if (n <= 48) return "section_2_2";
  if (n <= 51) return "section_2_3";
  if (n <= 59) return "section_2_4";
  if (n <= 66) return "section_2_5";
  if (n <= 70) return "section_2_6";
  if (n <= 73) return "section_2_7";
  if (n <= 77) return "section_2_8";
  if (n <= 85) return "section_2_9";
  if (n <= 88) return "section_2_10";
  if (n <= 90) return "section_3_1";
  return "section_3_2";
};

const getSectionTitreFromCritere = (critereId) => {
  const n = parseInt(critereId.replace(/\D/g, ""));
  if (n <= 5) return "1.1. LE PILOTAGE DE L'OFFRE DE FORMATION";
  if (n <= 27) return "1.2. LA MISE EN ŒUVRE DE LA FORMATION";
  if (n <= 37) return "1.3. LA DEMARCHE QUALITE PEDAGOGIQUE";
  if (n <= 43) return "2.1. ORGANISATION ET MANAGEMENT";
  if (n <= 48) return "2.2. SYSTÈME D'INFORMATION ET DE COMMUNICATION";
  if (n <= 51) return "2.3. GESTION DES RESSOURCES DOCUMENTAIRES";
  if (n <= 59) return "2.4. GESTION DES RESSOURCES HUMAINES";
  if (n <= 66) return "2.5. GESTION DES RESSOURCES FINANCIÈRES";
  if (n <= 70) return "2.6. POLITIQUE IMMOBILIÈRE ET LOGISTIQUE";
  if (n <= 73) return "2.7. MANAGEMENT DE LA QUALITÉ";
  if (n <= 77) return "2.8. HYGIÈNE, SÉCURITÉ ET ENVIRONNEMENT";
  if (n <= 85) return "2.9. GESTION DE LA VIE ÉTUDIANTE";
  if (n <= 88) return "2.10. LA GESTION DES PARTENARIATS";
  if (n <= 90) return "3.1. LA STRATÉGIE DE RECHERCHE DE L'INSTITUTION";
  return "3.2. L'ENSEIGNEMENT ET LA RECHERCHE";
};

const getPolitiqueFromCritere = (critereId) => {
  const n = parseInt(critereId.replace(/\D/g, ""));
  if (n <= 37) return "FORMATION";
  if (n <= 88) return "GOUVERNANCE";
  return "RECHERCHE";
};

// ===========================================================================
// ARCHIVES
// ===========================================================================

/**
 * Récupère toutes les demandes archivées (admin/SAE uniquement).
 * Utilise include_archived=true et filtre is_archived côté frontend.
 */
export const getArchivedDemandes = async () => {
  try {
    const response = await API.get("/accreditation/demandes", {
      params: { include_archived: true },
    });
    const raw = normalizeArray(response.data);
    const normalized = raw
      .map(normalizeDemandeObject)
      .filter((d) => d.is_archived === true || d.isArchived === true);
    console.log(
      `[getArchivedDemandes] ${normalized.length} dossier(s) archivé(s)`,
    );
    return normalized;
  } catch (error) {
    console.error("[getArchivedDemandes]", error);
    throw error;
  }
};

/**
 * Archive un dossier (le place dans les archives).
 */
export const archiverDemande = async (demandeId, reason) => {
  try {
    const response = await API.patch(
      `/accreditation/demandes/${demandeId}/archiver`,
      { reason },
    );
    const result = normalizeDemandeObject(normalizeObject(response.data));
    console.log(`[archiverDemande] id=${demandeId} archivé`);
    return result;
  } catch (error) {
    console.error(`[archiverDemande] id=${demandeId}`, error?.response?.data);
    if (error.response?.data?.detail)
      error.message = error.response.data.detail;
    throw error;
  }
};

/**
 * Restaure un dossier archivé (le retire des archives).
 */
export const restaurerDemande = async (demandeId) => {
  try {
    const response = await API.patch(
      `/accreditation/demandes/${demandeId}/restaurer`,
    );
    const result = normalizeDemandeObject(normalizeObject(response.data));
    console.log(`[restaurerDemande] id=${demandeId} restauré`);
    return result;
  } catch (error) {
    console.error(`[restaurerDemande] id=${demandeId}`, error?.response?.data);
    if (error.response?.data?.detail)
      error.message = error.response.data.detail;
    throw error;
  }
};

// ===========================================================================
// EXPORT PAR DÉFAUT
// ===========================================================================
const accreditationServices = {
  STATUT_DEMANDE,
  STATUTS_ADMIN,
  TRANSITIONS_AUTORISEES,
  TYPE_ETABLISSEMENT,
  GRADE,
  getMyAutoEvaluations,
  getAutoEvaluation,
  createOrUpdateAutoEvaluation,
  deleteAutoEvaluation,
  uploadCritereFichiers,
  deleteCritereFichier,
  getMyDemandes,
  getDemande,
  createDemande,
  updateDemande,
  deleteDemande,
  submitDemande,
  updateDemandeStatut,
  uploadDemandeFichiers,
  downloadFichier,
  deleteDemandeFichier,
  getArchivedDemandes,
  archiverDemande,
  restaurerDemande,
  formatAutoEvaluationData,
  formatDemandeData,
  formatDemandeResponse,
  validateDemandeData,
  canSubmitDemande,
  canEditDemande,
  canDeleteDemande,
  canChangeStatut,
  getStatutLibelle,
  getStatutColor,
  normalizeEnumValue,
};
export default accreditationServices;
