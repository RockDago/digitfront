// src/services/contact.services.js

import API from "../config/axios";

/**
 * Service pour gérer les opérations liées aux paramètres de contact
 * (Ce fichier a été renommé en contact.services.js. À ne plus utiliser.)
 */

// --- SERVICES API CONTACT PARAMÈTRES ---

/**
 * Récupère les informations de contact depuis l'API
 * @returns {Promise} Données de contact
 */
export const getContactInfo = async () => {
  try {
    const response = await API.get("/contact/");
    return {
      success: true,
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des contacts:", error);
    return {
      success: false,
      data: null,
      error: error.response?.data || error.message,
    };
  }
};

/**
 * Met à jour les informations de contact
 * @param {Object} contactData - Données de contact à mettre à jour
 * @returns {Promise} Résultat de la mise à jour
 */
export const updateContactInfo = async (contactData) => {
  try {
    const response = await API.put("/contact/", contactData);
    return {
      success: true,
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour des contacts:", error);
    return {
      success: false,
      data: null,
      error: error.response?.data || error.message,
      status: error.response?.status,
    };
  }
};

// --- UTILITAIRES DE VALIDATION ---

/**
 * Valide les données du formulaire de contact admin
 * @param {Object} formData - Données du formulaire
 * @returns {Object} Résultat de validation avec erreurs
 */
export const validateContactParamForm = (formData) => {
  const errors = {};

  // Validation email
  if (!formData.email?.trim()) {
    errors.email = "L'email est obligatoire";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Format d'email invalide";
  }

  // Validation téléphones (tableau de 1 à 3 numéros)
  if (
    !formData.phones ||
    !Array.isArray(formData.phones) ||
    formData.phones.length === 0
  ) {
    errors.phones = "Au moins un numéro de téléphone est obligatoire";
  } else {
    // Filtrer les numéros non vides
    const validPhones = formData.phones.filter((phone) => phone?.trim());

    if (validPhones.length === 0) {
      errors.phones = "Au moins un numéro de téléphone est obligatoire";
    } else if (validPhones.length > 3) {
      errors.phones = "Maximum 3 numéros de téléphone autorisés";
    } else {
      // Valider chaque numéro individuellement
      const phoneErrors = [];
      const seenPhones = new Set();

      validPhones.forEach((phone, index) => {
        const cleanPhone = phone.replace(/\s/g, "");

        // Vérifier format Madagascar: +261 suivi de 9 chiffres
        if (!/^\+261\d{9}$/.test(cleanPhone)) {
          phoneErrors.push(
            `Numéro ${index + 1}: Format invalide (utilisez +261 XX XX XXX XX)`,
          );
        }

        // Vérifier les doublons
        if (seenPhones.has(cleanPhone)) {
          phoneErrors.push(`Numéro ${index + 1}: Doublon détecté`);
        }
        seenPhones.add(cleanPhone);
      });

      if (phoneErrors.length > 0) {
        errors.phones = phoneErrors.join("; ");
      }
    }
  }

  // Validation adresse
  if (!formData.address?.trim()) {
    errors.address = "L'adresse est obligatoire";
  } else if (formData.address.trim().length < 10) {
    errors.address = "L'adresse doit contenir au moins 10 caractères";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Formate les données pour l'envoi à l'API
 * @param {Object} formData - Données brutes du formulaire
 * @returns {Object} Données formatées pour l'API
 */
export const formatContactParamData = (formData) => {
  // Nettoyer et filtrer les numéros de téléphone
  const cleanedPhones = formData.phones
    .filter((phone) => phone?.trim()) // Enlever les chaînes vides
    .map((phone) => phone.replace(/\s/g, "")); // Enlever tous les espaces

  return {
    email: formData.email.trim(),
    phones: cleanedPhones, // ✅ Envoyer comme tableau
    address: formData.address.trim(),
    horaires: formData.horaires?.trim() || "",
    latitude: formData.latitude?.trim() || "",
    longitude: formData.longitude?.trim() || "",
  };
};

/**
 * Traite les erreurs de validation de l'API (format FastAPI 422)
 * @param {Object} errorResponse - Réponse d'erreur de l'API
 * @returns {Object} Objet d'erreurs formatées par champ
 */
export const parseValidationErrors = (errorResponse) => {
  const errors = {};

  if (!errorResponse?.detail) return errors;

  const errorDetails = errorResponse.detail;

  if (Array.isArray(errorDetails)) {
    errorDetails.forEach((err) => {
      const field = err.loc?.[1];
      if (field) {
        errors[field] = err.msg || "Erreur de validation";
      }
    });
  } else if (typeof errorDetails === "string") {
    errors.general = errorDetails;
  }

  return errors;
};

// --- FONCTIONS ET CONSTANTES POUR LE FORMULAIRE PUBLIC ---

export const CONTACT_SUBJECTS = [
  { value: "info", label: "Demande d'information générale" },
  { value: "accreditation", label: "Accréditation d'un établissement" },
  { value: "equivalence", label: "Équivalence d'un diplôme" },
  { value: "signalement", label: "Signalement ou Réclamation" },
  { value: "partenariat", label: "Demande de partenariat" },
  { value: "carriere", label: "Carrières et recrutement" },
  { value: "autre", label: "Autre" },
];

export class StatusManager {
  constructor() {
    this.loading = false;
    this.error = null;
    this.success = false;
  }
  setLoading() {
    this.loading = true;
    this.error = null;
    this.success = false;
    return this;
  }
  setSuccess() {
    this.loading = false;
    this.error = null;
    this.success = true;
    return this;
  }
  setError(error) {
    this.loading = false;
    this.error = error;
    this.success = false;
    return this;
  }
  reset() {
    this.loading = false;
    this.error = null;
    this.success = false;
    return this;
  }
}

export const autoResizeTextarea = (textarea) => {
  if (!textarea) return;
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
  const maxHeight = 300;
  if (textarea.scrollHeight > maxHeight) {
    textarea.style.height = `${maxHeight}px`;
    textarea.style.overflowY = "auto";
  } else {
    textarea.style.overflowY = "hidden";
  }
};

export const getEmailSuggestions = (email) => {
  const POPULAR_DOMAINS = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "icloud.com",
    "orange.fr",
    "wanadoo.fr",
    "sfr.fr",
    "free.fr",
    "aol.com",
    "protonmail.com",
    "zoho.com",
    "yandex.com",
    "mail.com",
  ];
  if (!email.includes("@")) return [];
  const [localPart, domainPart] = email.split("@");
  if (!domainPart) return [];
  const filtered = POPULAR_DOMAINS.filter((domain) =>
    domain.toLowerCase().startsWith(domainPart.toLowerCase()),
  );
  return filtered.map((domain) => `${localPart}@${domain}`);
};

export const validateContactForm = (formData) => {
  const errors = {};
  if (!formData.name?.trim()) errors.name = "Le nom complet est requis";
  if (!formData.email?.trim()) errors.email = "L'email est requis";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    errors.email = "Veuillez saisir un email valide";
  if (!formData.subject?.trim()) errors.subject = "Le sujet est requis";
  if (!formData.message?.trim()) errors.message = "Le message est requis";
  else if (formData.message.trim().length < 10)
    errors.message = "Le message doit contenir au moins 10 caractères";
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const formatContactData = (formData) => ({
  name: formData.name.trim(),
  email: formData.email.trim().toLowerCase(),
  subject: formData.subject.trim(),
  message: formData.message.trim(),
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent,
  source: "website_contact_form",
});

export const sendContactMessage = async (messageData) => {
  try {
    const response = await API.post("/contact/message", messageData);
    return { success: true, data: response.data, error: null };
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du message:", error);
    return {
      success: false,
      data: null,
      error: error.response?.data || error.message,
    };
  }
};

// Exporter toutes les fonctions
export default {
  getContactInfo,
  updateContactInfo,
  validateContactParamForm,
  formatContactParamData,
  parseValidationErrors,
  CONTACT_SUBJECTS,
  StatusManager,
  autoResizeTextarea,
  getEmailSuggestions,
  validateContactForm,
  formatContactData,
  sendContactMessage,
};
