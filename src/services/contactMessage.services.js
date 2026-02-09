// src/services/contactMessage.services.js
import API from "../config/axios";

/**
 * Service pour gérer les messages de contact
 * Compatible avec le formulaire Contact.jsx
 */

// ==================== FONCTIONS PUBLIQUES ====================

/**
 * Envoyer un message de contact (accessible à tous)
 * @param {Object} messageData - Données du formulaire { name, email, subject, message }
 * @returns {Promise<Object>} - { success, data, message }
 */
export const sendContactMessage = async (messageData) => {
  try {
    const response = await API.post("/contact/messages/", messageData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Erreur lors de l'envoi du message",
      errors: error.response?.data,
    };
  }
};

// ==================== FONCTIONS ADMIN ====================

/**
 * Récupérer tous les messages (admin seulement)
 * @param {Object} filters - { status, search }
 * @returns {Promise<Object>} - { success, data }
 */
export const getContactMessages = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    // Ajouter les filtres
    if (filters.status && filters.status !== "all") {
      params.append("status", filters.status);
    }

    if (filters.search) {
      params.append("search", filters.search);
    }

    const response = await API.get(`/contact/messages/?${params.toString()}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Erreur lors du chargement des messages",
    };
  }
};

/**
 * Récupérer un message par son ID (admin seulement)
 * @param {number} id - ID du message
 * @returns {Promise<Object>} - { success, data }
 */
export const getContactMessageById = async (id) => {
  try {
    const response = await API.get(`/contact/messages/${id}/`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message || "Erreur lors du chargement du message",
    };
  }
};

/**
 * Marquer un message comme lu (admin seulement)
 * @param {number} id - ID du message
 * @returns {Promise<Object>} - { success, data, message }
 */
export const markMessageAsRead = async (id) => {
  try {
    const response = await API.post(`/contact/messages/${id}/mark-as-read/`);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Erreur lors de la mise à jour",
    };
  }
};

/**
 * Archiver un message (admin seulement)
 * @param {number} id - ID du message
 * @returns {Promise<Object>} - { success, data, message }
 */
export const archiveContactMessage = async (id) => {
  try {
    const response = await API.post(`/contact/messages/${id}/archive/`);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Erreur lors de l'archivage",
    };
  }
};

/**
 * Supprimer un message (admin seulement)
 * @param {number} id - ID du message
 * @returns {Promise<Object>} - { success, message }
 */
export const deleteContactMessage = async (id) => {
  try {
    const response = await API.delete(`/contact/messages/${id}/`);
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Erreur lors de la suppression",
    };
  }
};

/**
 * Récupérer les statistiques des messages (admin seulement)
 * @returns {Promise<Object>} - { success, data: { total, unread, read, archived } }
 */
export const getMessageStatistics = async () => {
  try {
    const response = await API.get("/contact/messages/stats/");
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Erreur lors du chargement des statistiques",
    };
  }
};

// ==================== FONCTIONS UTILITAIRES ====================

/**
 * Formater les données du formulaire avant envoi
 * @param {Object} formData - Données brutes du formulaire
 * @returns {Object} - Données formatées
 */
export const formatContactData = (formData) => {
  return {
    name: formData.name.trim(),
    email: formData.email.trim().toLowerCase(),
    subject: formData.subject.trim(),
    message: formData.message.trim(),
  };
};

/**
 * Valider le formulaire de contact
 * @param {Object} formData - Données du formulaire
 * @returns {Object} - { isValid, errors }
 */
export const validateContactForm = (formData) => {
  const errors = {};

  // Validation du nom
  if (!formData.name?.trim()) {
    errors.name = "Le nom complet est requis";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Le nom doit contenir au moins 2 caractères";
  }

  // Validation de l'email
  if (!formData.email?.trim()) {
    errors.email = "L'email est requis";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Veuillez saisir un email valide";
  }

  // Validation du sujet
  if (!formData.subject?.trim()) {
    errors.subject = "Le sujet est requis";
  } else if (formData.subject.trim().length < 3) {
    errors.subject = "Le sujet doit contenir au moins 3 caractères";
  }

  // Validation du message (minimum 50 caractères)
  if (!formData.message?.trim()) {
    errors.message = "Le message est requis";
  } else if (formData.message.trim().length < 50) {
    errors.message = `Le message doit contenir au moins 50 caractères (${formData.message.trim().length}/50)`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Classe pour gérer les statuts de chargement
 */
export class StatusManager {
  constructor() {
    this.loading = false;
    this.error = null;
    this.success = false;
  }

  setLoading() {
    return { loading: true, error: null, success: false };
  }

  setSuccess() {
    return { loading: false, error: null, success: true };
  }

  setError(error) {
    return { loading: false, error, success: false };
  }
}

// Ajoutez ceci à la fin de vos services
export const unarchiveContactMessage = async (id) => {
  try {
    const response = await API.post(`/contact/messages/${id}/unarchive`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || "Erreur lors du désarchivage",
    };
  }
};

/**
 * Constantes pour les sujets de contact (optionnel)
 */
export const CONTACT_SUBJECTS = [
  { value: "accreditation", label: "Demande d'accréditation" },
  { value: "information", label: "Demande d'information" },
  { value: "support", label: "Support technique" },
  { value: "reclamation", label: "Réclamation" },
  { value: "autre", label: "Autre" },
];
