import API from "../config/axios";

const EQUIVALENCE_BASE = "/equivalences";

/**
 * Vérifie si l'utilisateur a déjà une demande pour un type de diplôme
 * @param {string} typeDiplome - Type de diplôme (Licence, Master, Doctorat)
 * @returns {Promise<Object>} - Résultat de la vérification
 */
export const checkDemandeExists = async (typeDiplome) => {
  try {
    const formData = new FormData();
    formData.append("type_diplome", typeDiplome);

    const response = await API.post(
      `${EQUIVALENCE_BASE}/check-exists`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la vérification de la demande:", error);
    throw error;
  }
};

/**
 * Crée une nouvelle demande d'équivalence
 * @param {Object} demandeData - Données de la demande
 * @param {Object} files - Fichiers à uploader avec les clés correspondant aux types de documents
 * @returns {Promise<Object>} - Résultat de la création
 */
export const createDemande = async (demandeData, files = {}) => {
  try {
    const formData = new FormData();

    // S'assurer que les données sont correctement formatées avant envoi
    const formattedData = formatDemandeData(demandeData);

    // Ajouter les données de la demande au format JSON
    formData.append("demande_data", JSON.stringify(formattedData));

    // Ajouter les fichiers avec des noms qui indiquent leur type
    Object.entries(files).forEach(([documentType, file]) => {
      if (file && file instanceof File) {
        const filename = `${documentType}--${file.name}`;
        formData.append("documents", file, filename);
      }
    });

    const response = await API.post(`${EQUIVALENCE_BASE}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la demande:", error);
    if (error.response) {
      console.error("Détails de l'erreur:", error.response.data);
    }
    throw error;
  }
};

/**
 * Fonction pour créer une demande (créé directement avec le statut soumise)
 * @param {Object} demandeData - Données de la demande
 * @param {Object} files - Fichiers à uploader
 * @returns {Promise<Object>} - Résultat de la création et soumission
 */
export const createAndSubmitDemande = async (demandeData, files = {}) => {
  try {
    console.log("Création de la demande...");
    const createResponse = await createDemande(demandeData, files);

    if (createResponse.success && createResponse.data) {
      const demandeId = createResponse.data.id;
      console.log("Demande créée et soumise avec ID:", demandeId);

      return {
        success: true,
        message: "Demande créée et soumise avec succès",
        data: createResponse.data,
        demandeId: demandeId,
        created: true,
        submitted: true,
      };
    }

    return createResponse;
  } catch (error) {
    console.error("Erreur lors de la création de la demande:", error);
    throw error;
  }
};

/**
 * Récupère toutes les demandes de l'utilisateur connecté
 * @param {Object} params - Paramètres de pagination et filtrage
 * @param {boolean} includeArchived - Inclure les demandes archivées
 * @returns {Promise<Object>} - Liste des demandes
 */
export const getUserDemandes = async (params = {}, includeArchived = false) => {
  try {
    const queryParams = new URLSearchParams({
      ...params,
      include_archived: includeArchived,
    }).toString();
    const url = queryParams
      ? `${EQUIVALENCE_BASE}?${queryParams}`
      : `${EQUIVALENCE_BASE}/`;

    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes:", error);
    throw error;
  }
};

/**
 * Récupère une demande spécifique par son ID
 * @param {number} demandeId - ID de la demande
 * @returns {Promise<Object>} - Détails de la demande
 */
export const getDemandeById = async (demandeId) => {
  try {
    const response = await API.get(`${EQUIVALENCE_BASE}/${demandeId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la demande:", error);
    throw error;
  }
};

/**
 * Met à jour une demande existante
 * @param {number} demandeId - ID de la demande
 * @param {Object} demandeData - Nouvelles données de la demande
 * @param {Object} files - Nouveaux fichiers à uploader
 * @returns {Promise<Object>} - Résultat de la mise à jour
 */
export const updateDemande = async (demandeId, demandeData, files = {}) => {
  try {
    const formData = new FormData();

    const formattedData = formatDemandeData(demandeData);
    formData.append("demande_data", JSON.stringify(formattedData));

    Object.entries(files).forEach(([documentType, file]) => {
      if (file && file instanceof File) {
        const filename = `${documentType}--${file.name}`;
        formData.append("documents", file, filename);
      }
    });

    const response = await API.put(
      `${EQUIVALENCE_BASE}/${demandeId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la demande:", error);
    if (error.response) {
      console.error("Détails de l'erreur:", error.response.data);
    }
    throw error;
  }
};

/**
 * Soumet une demande (passe du statut brouillon à soumise)
 * @param {number} demandeId - ID de la demande
 * @returns {Promise<Object>} - Résultat de la soumission
 */
export const submitDemande = async (demandeId) => {
  try {
    const response = await API.post(`${EQUIVALENCE_BASE}/${demandeId}/submit`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la soumission de la demande:", error);
    throw error;
  }
};

/**
 * Supprime une demande (uniquement si c'est un brouillon)
 * @param {number} demandeId - ID de la demande
 * @returns {Promise<Object>} - Résultat de la suppression
 */
export const deleteDemande = async (demandeId) => {
  try {
    const response = await API.delete(`${EQUIVALENCE_BASE}/${demandeId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression de la demande:", error);
    throw error;
  }
};

// ==================== ROUTES ADMIN ====================

/**
 * Récupère toutes les demandes (admin uniquement)
 * @param {Object} params - Paramètres de pagination et filtrage
 * @param {boolean} includeArchived - Inclure les demandes archivées
 * @returns {Promise<Object>} - Liste de toutes les demandes
 */
export const getAllDemandesAdmin = async (params = {}, includeArchived = false) => {
  try {
    const queryParams = new URLSearchParams({
      ...params,
      include_archived: includeArchived,
    }).toString();
    const url = queryParams
      ? `${EQUIVALENCE_BASE}/admin/all?${queryParams}`
: `${EQUIVALENCE_BASE}/admin/all`;

    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes (admin):", error);
    throw error;
  }
};

/**
 * Met à jour le statut d'une demande (admin uniquement)
 * @param {number} demandeId - ID de la demande
 * @param {string} statut - Nouveau statut
 * @param {string} commentaire - Commentaire optionnel
 * @returns {Promise<Object>} - Résultat de la mise à jour
 */
export const updateDemandeStatutAdmin = async (
  demandeId,
  statut,
  commentaire = null
) => {
  try {
    const response = await API.patch(
      `${EQUIVALENCE_BASE}/admin/${demandeId}/statut`,
      {
        statut,
        commentaire_admin: commentaire,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    throw error;
  }
};

/**
 * Archive une demande (admin uniquement)
 * @param {number} demandeId - ID de la demande
 * @param {string} reason - Raison de l'archivage (optionnel)
 * @returns {Promise<Object>} - Résultat de l'archivage
 */
export const archiveDemande = async (demandeId, reason = null) => {
  try {
    const response = await API.post(
      `${EQUIVALENCE_BASE}/admin/${demandeId}/archive`,
      reason ? { reason } : {}
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'archivage de la demande:", error);
    throw error;
  }
};

/**
 * Restaure une demande archivée (admin uniquement)
 * @param {number} demandeId - ID de la demande
 * @returns {Promise<Object>} - Résultat de la restauration
 */
export const restoreDemande = async (demandeId) => {
  try {
    const response = await API.post(
      `${EQUIVALENCE_BASE}/admin/${demandeId}/restore`
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la restauration de la demande:", error);
    throw error;
  }
};

/**
 * Récupère toutes les demandes archivées (admin uniquement)
 * @param {Object} params - Paramètres de pagination et filtrage
 * @returns {Promise<Object>} - Liste des demandes archivées
 */
export const getArchivesDemandes = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams
      ? `${EQUIVALENCE_BASE}/admin/archives?${queryParams}`
      : `${EQUIVALENCE_BASE}/admin/archives`;

    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des archives:", error);
    throw error;
  }
};

/**
 * Récupère les statistiques des demandes (admin uniquement)
 * @returns {Promise<Object>} - Statistiques
 */
export const getDemandesStats = async () => {
  try {
    const response = await API.get(`${EQUIVALENCE_BASE}/admin/statistiques`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    throw error;
  }
};




/**
 * Télécharge un document via la route dédiée du backend
 * @param {string} filePath - Chemin relatif depuis uploads/ 
 *   ex: "demandes_equivalence/2/arrete_habilitation_20260227.pdf"
 * @returns {Promise<{blob, filename}>}
 */
export const downloadDocument = async (filePath) => {
  try {
    // Nettoyer le préfixe "uploads/" si présent dans filePath
    const cleanPath = filePath.replace(/^uploads\//, "");

    const response = await API.get(`/equivalences/documents/download`, {
      params: { path: cleanPath },
      responseType: "blob",
    });

    const filename = cleanPath.split("/").pop();
    return { blob: response.data, filename };
  } catch (error) {
    console.error("Erreur lors du téléchargement du document:", error);
    throw error;
  }
};


// Helper pour formater les données du formulaire
export const formatDemandeData = (formData) => {
  let recapitulatif = [];

  if (formData.recapitulatif_formation) {
    if (Array.isArray(formData.recapitulatif_formation)) {
      recapitulatif = formData.recapitulatif_formation
        .map((item) => ({
          annee_obtention: String(item.annee_obtention || "").trim() || null,
          diplome: String(item.diplome || "").trim() || null,
          mention: String(item.mention || "").trim() || null,
          parcours_option_specialite:
            String(item.parcours_option_specialite || "").trim() || null,
          etablissement: String(item.etablissement || "").trim() || null,
        }))
        .filter(
          (item) =>
            (item.annee_obtention !== null && item.annee_obtention !== "") ||
            (item.diplome !== null && item.diplome !== "") ||
            (item.mention !== null && item.mention !== "") ||
            (item.parcours_option_specialite !== null &&
              item.parcours_option_specialite !== "") ||
            (item.etablissement !== null && item.etablissement !== "")
        );
    } else if (typeof formData.recapitulatif_formation === "string") {
      try {
        const parsed = JSON.parse(formData.recapitulatif_formation);
        if (Array.isArray(parsed)) {
          recapitulatif = parsed
            .map((item) => ({
              annee_obtention:
                String(item.annee_obtention || "").trim() || null,
              diplome: String(item.diplome || "").trim() || null,
              mention: String(item.mention || "").trim() || null,
              parcours_option_specialite:
                String(item.parcours_option_specialite || "").trim() || null,
              etablissement: String(item.etablissement || "").trim() || null,
            }))
            .filter(
              (item) =>
                item.annee_obtention !== null ||
                item.diplome !== null ||
                item.mention !== null ||
                item.parcours_option_specialite !== null ||
                item.etablissement !== null
            );
        }
      } catch (e) {
        console.error("Erreur lors du parsing du récapitulatif:", e);
        recapitulatif = [];
      }
    }
  }

  if (recapitulatif.length === 0) {
    recapitulatif = [
      {
        annee_obtention: null,
        diplome: null,
        mention: null,
        parcours_option_specialite: null,
        etablissement: null,
      },
    ];
  }

  return {
    type_diplome: formData.type_diplome || "",
    nom: (formData.nom || "").toUpperCase(),
    prenoms: formData.prenoms || "",
    code_postal: formData.code_postal || "",
    telephone: formData.telephone || "",
    email: (formData.email || "").toLowerCase(),
    motif: formData.motif || "",
    recapitulatif_formation: recapitulatif,
    destinataire:
      formData.destinataire ||
      "Madame/Monsieur Le Ministre de l'Enseignement Supérieur et de la Recherche Scientifique, Président(e) de la Commission Nationale des Équivalences",
  };
};

// Liste des types de documents obligatoires selon le diplôme
export const DOCUMENT_TYPES = {
  COMMUNS: [
    {
      key: "demande_equivalence",
      label: "Demande d'équivalence signée",
      required: true,
    },
    { key: "piece_identite", label: "Pièce d'identité", required: true },
    { key: "diplomes_certifies", label: "Diplômes certifiés", required: true },
    {
      key: "justificatifs_duree_etudes",
      label: "Justificatifs de durée d'études",
      required: true,
    },
    {
      key: "arrete_habilitation",
      label: "Arrêté d'habilitation",
      required: true,
    },
  ],
  MASTER: [
    {
      key: "attestation_master",
      label: "Attestation de Master",
      required: true,
    },
  ],
  OPTIONNELS: [
    {
      key: "traduction_diplomes",
      label: "Traduction des diplômes",
      required: false,
    },
    {
      key: "traduction_justificatifs",
      label: "Traduction des justificatifs",
      required: false,
    },
    { key: "memoire_these", label: "Mémoire/Thèse", required: false },
  ],
};