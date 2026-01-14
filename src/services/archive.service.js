import API from "../config/axios";

const ArchiveService = {
  /**
   * Récupérer toutes les archives d'accréditation
   * @returns {Promise<Array>}
   */
  getAllAccreditation: async () => {
    try {
      const response = await API.get("/archivage-accreditation");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer une archive par ID
   * @param {Number} id
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    try {
      const response = await API.get(`/archivage-accreditation/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Créer une nouvelle archive
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    try {
      const response = await API.post("/archivage-accreditation", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mettre à jour une archive
   * @param {Number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: async (id, data) => {
    try {
      const response = await API.put(`/archivage-accreditation/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Supprimer une archive
   * @param {Number} id
   * @returns {Promise<Object>}
   */
  delete: async (id) => {
    try {
      const response = await API.delete(`/archivage-accreditation/${id}`);
      return response.data;
    } catch (error) {
      console.error("⚠️ Erreur lors de la suppression de l'archive :", error);
      throw error;
    }
  },

  /**
   * Rechercher des archives
   * @param {Object} filters - { search, dateDebut, dateFin, statut }
   * @returns {Promise<Array>}
   */
  search: async (filters) => {
    try {
      const response = await API.get("/archivage-accreditation/search", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ArchiveService;
