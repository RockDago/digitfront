import API from "../config/axios";

const NotificationService = {
  /**
   * Envoyer une nouvelle notification (Admin)
   * @param {Object} data - payload (title, message, content, type, target_roles)
   */
  sendNotification: async (data) => {
    try {
      const response = await API.post("/notifications/", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Recuperer les notifications de l'utilisateur connecte
   */
  getMyNotifications: async () => {
    try {
      const response = await API.get("/notifications/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Recuperer l'historique des notifications envoyees (Admin)
   */
  getSentNotifications: async () => {
    try {
      const response = await API.get("/notifications/sent");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Marquer une notification comme lue
   * @param {Number} id 
   */
  markAsRead: async (id) => {
    try {
      const response = await API.patch(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Marquer toutes les notifications comme lues
   */
  markAllAsRead: async () => {
    try {
      const response = await API.post("/notifications/read-all");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Modifier une notification (Admin)
   */
  updateNotification: async (id, data) => {
    try {
      const response = await API.patch(`/notifications/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Annuler une notification (Admin)
   */
  cancelNotification: async (id) => {
    try {
      const response = await API.patch(`/notifications/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default NotificationService;
