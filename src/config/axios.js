// src/config/axios.js
import axios from "axios";

export const API_URL = "http://127.0.0.1:8000/api";
export const BASE_URL = "http://127.0.0.1:8000";

// Instance Axios principale
const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// ✅ Intercepteur pour ajouter le token ET l'ID utilisateur automatiquement
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Ajouter le token si présent
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    // ✅ NOUVEAU : Ajouter l'ID utilisateur dans le header X-User-ID
    if (user.id) {
      config.headers["X-User-ID"] = user.id;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Intercepteur de réponse SANS REDIRECTION AUTOMATIQUE
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("⏱️ Timeout: le serveur met trop de temps à répondre.");
    } else if (error.response) {
      const status = error.response.status;

      // ✅ Gestion des erreurs SANS refresh de page
      switch (status) {
        case 401:
          console.log("🔒 Non autorisé (401)");
          // ⚠️ NE PAS FAIRE window.location.href ici !
          // ⚠️ Laissez le composant Login gérer l'erreur
          break;
        case 403:
          console.log("⛔ Accès interdit (403)");
          break;
        case 404:
          console.log("🔍 Ressource introuvable (404)");
          break;
        case 500:
          console.log("💥 Erreur serveur interne (500)");
          break;
        default:
          console.log("⚠️ Erreur API:", status);
      }
    } else if (error.request) {
      console.log(
        "❌ Aucune réponse du serveur. Vérifiez que le backend est lancé."
      );
    } else {
      console.log("❌ Erreur inconnue:", error.message);
    }

    // ✅ Toujours rejeter l'erreur pour que le composant puisse la gérer
    return Promise.reject(error);
  }
);

export default API;
