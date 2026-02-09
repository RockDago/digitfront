import API from "../config/axios";

class FaqService {
  /**
   * Récupérer toutes les FAQs
   * @param {Object} filters - Filtres optionnels { categorie, actif }
   * @returns {Promise<Array>}
   */
  async getAllFaqs(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.categorie) {
        params.append("categorie", filters.categorie);
      }

      if (filters.actif !== undefined) {
        params.append("actif", filters.actif);
      }

      const queryString = params.toString();
      const url = queryString ? `/faqs?${queryString}` : "/faqs";

      const response = await API.get(url);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des FAQs:", error);
      throw error;
    }
  }

  /**
   * Récupérer une FAQ par ID
   * @param {number} id - ID de la FAQ
   * @returns {Promise<Object>}
   */
  async getFaqById(id) {
    try {
      const response = await API.get(`/faqs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la FAQ ${id}:`, error);
      throw error;
    }
  }

  /**
   * Créer une nouvelle FAQ
   * @param {Object} faqData - Données de la FAQ { question, reponse, categorie, ordre, actif }
   * @returns {Promise<Object>}
   */
  async createFaq(faqData) {
    try {
      const response = await API.post("/faqs", faqData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la FAQ:", error);
      throw error;
    }
  }

  /**
   * Mettre à jour une FAQ
   * @param {number} id - ID de la FAQ
   * @param {Object} faqData - Données à mettre à jour
   * @returns {Promise<Object>}
   */
  async updateFaq(id, faqData) {
    try {
      const response = await API.put(`/faqs/${id}`, faqData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la FAQ ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprimer une FAQ
   * @param {number} id - ID de la FAQ
   * @returns {Promise<void>}
   */
  async deleteFaq(id) {
    try {
      await API.delete(`/faqs/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la FAQ ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupérer les catégories disponibles
   * @returns {Promise<Array<string>>}
   */
  async getCategories() {
    try {
      const response = await API.get("/faqs/categories/list");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
      throw error;
    }
  }

  /**
   * Récupérer les FAQs actives uniquement
   * @returns {Promise<Array>}
   */
  async getActiveFaqs() {
    return this.getAllFaqs({ actif: true });
  }

  /**
   * Récupérer les FAQs par catégorie
   * @param {string} categorie - Nom de la catégorie
   * @returns {Promise<Array>}
   */
  async getFaqsByCategorie(categorie) {
    return this.getAllFaqs({ categorie, actif: true });
  }
}

export default new FaqService();
