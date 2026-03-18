// src/services/analytics.service.js
import API from "../config/axios";

const AnalyticsService = {
  /**
   * Enregistrer une nouvelle visite
   * @param {String} path - Le chemin de la page visitée (défaut: "/")
   * @returns {Promise<Object>}
   */
  recordVisit: async (path = "/") => {
    try {
      const response = await API.post("/analytics/visit", { path });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la visite:", error);
      // On ne lève pas l'erreur pour ne pas bloquer l'UI
      return null;
    }
  },

  /**
   * Récupérer les statistiques du tableau de bord
   * @returns {Promise<Object>} - { total_views, active_sessions }
   */
  getStats: async () => {
    try {
      const response = await API.get("/analytics/stats");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      throw error;
    }
  },

  /**
   * S'abonner aux mises à jour en temps réel via WebSocket
   * @param {Function} onUpdate - Callback appelé lors d'une mise à jour
   * @returns {Function} - Fonction pour fermer la connexion
   */
  subscribeToStats: (onUpdate) => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = process.env.REACT_APP_WS_URL || 
                (window.location.hostname === "localhost" ? "127.0.0.1:8000" : window.location.host);
    
    const wsUrl = `${protocol}//${host}/api/analytics/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onUpdate(data);
      } catch (error) {
        console.error("Erreur parsing WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("Erreur WebSocket:", error);
    };

    socket.onclose = () => {
      console.log("Connexion WebSocket fermée");
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  },
};

export default AnalyticsService;
