import API from "../config/axios";

const actualiteService = {
  /**
   * Obtenir l'URL de base de l'API
   */
  getBaseURL: () => {
    return API.defaults.baseURL.replace("/api", "");
  },

  /**
   * Récupérer toutes les actualités
   */
  getAllActualites: async () => {
    try {
      const response = await API.get("/actualites");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des actualités:", error);
      throw error;
    }
  },

  /**
   * Récupérer uniquement les actualités actives
   */
  getActiveFaqs: async () => {
    try {
      const response = await API.get("/actualites/actives");
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des actualités actives:",
        error,
      );
      throw error;
    }
  },

  /**
   * Récupérer une actualité par son ID
   */
  getActualiteById: async (id) => {
    try {
      const response = await API.get(`/actualites/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de l'actualité ${id}:`,
        error,
      );
      throw error;
    }
  },

  /**
   * Incrémenter le nombre de vues d'une actualité
   * @param {number} id - ID de l'actualité
   * @returns {Promise<Object>} Actualité mise à jour avec le nouveau nombre de vues
   */
  incrementViews: async (id) => {
    try {
      const response = await API.post(`/actualites/${id}/increment-views`);
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de l'incrémentation des vues pour l'actualité ${id}:`,
        error,
      );
      // Ne pas bloquer l'affichage si l'incrémentation échoue
      // On retourne null au lieu de throw pour ne pas casser l'UX
      return null;
    }
  },

  /**
   * Créer une nouvelle actualité avec progression
   */
  createActualite: async (formData, onProgress) => {
    try {
      const response = await API.post("/actualites", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          console.log(`Progression de l'upload: ${percentCompleted}%`);
          if (onProgress) {
            onProgress(percentCompleted);
          }
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'actualité:", error);

      if (error.response?.status === 400) {
        const errorMsg = error.response.data?.detail || "Données invalides";
        throw new Error(errorMsg);
      }

      if (error.response?.status === 413) {
        throw new Error(
          "Fichier trop volumineux. Taille maximale: 5 Mo par image",
        );
      }

      throw error;
    }
  },

  /**
   * Mettre à jour une actualité avec progression
   */
  updateActualite: async (id, formData, onProgress) => {
    try {
      const response = await API.put(`/actualites/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          console.log(`Progression de l'upload: ${percentCompleted}%`);
          if (onProgress) {
            onProgress(percentCompleted);
          }
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour de l'actualité ${id}:`,
        error,
      );

      if (error.response?.status === 404) {
        throw new Error("Actualité non trouvée");
      }

      if (error.response?.status === 400) {
        const errorMsg = error.response.data?.detail || "Données invalides";
        throw new Error(errorMsg);
      }

      throw error;
    }
  },

  /**
   * Activer/Désactiver une actualité
   */
  toggleActif: async (id) => {
    try {
      const response = await API.patch(`/actualites/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors du changement de statut de l'actualité ${id}:`,
        error,
      );

      if (error.response?.status === 404) {
        throw new Error("Actualité non trouvée");
      }

      throw error;
    }
  },

  /**
   * Supprimer une actualité
   */
  deleteActualite: async (id) => {
    try {
      const response = await API.delete(`/actualites/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la suppression de l'actualité ${id}:`,
        error,
      );

      if (error.response?.status === 404) {
        throw new Error("Actualité non trouvée");
      }

      throw error;
    }
  },

  /**
   * Supprimer une image de contenu
   */
  deleteImageContenu: async (actualiteId, imageId) => {
    try {
      const response = await API.delete(
        `/actualites/${actualiteId}/images/${imageId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);

      if (error.response?.status === 404) {
        throw new Error("Image ou actualité non trouvée");
      }

      throw error;
    }
  },
};

export default actualiteService;
