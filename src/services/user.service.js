// src/services/user.service.js
import API from "../config/axios";

const UserService = {
  // ============================================
  // GESTION DES UTILISATEURS (ADMIN)
  // ============================================

  /**
   * Récupérer tous les utilisateurs (Admin)
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    try {
      const response = await API.get("/users");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer un utilisateur par ID (Admin)
   * @param {Number} id
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    try {
      const response = await API.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Créer un nouvel utilisateur (Admin)
   * @param {Object} data - {nom, prenom, username, email, password, role, is_active}
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    try {
      const response = await API.post("/users", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mettre à jour un utilisateur (Admin)
   * @param {Number} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  update: async (id, data) => {
    try {
      const response = await API.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Supprimer un utilisateur (Admin)
   * @param {Number} id
   * @returns {Promise<Object>}
   */
  delete: async (id) => {
    try {
      const response = await API.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Réinitialiser le mot de passe d'un utilisateur (Admin uniquement)
   * @param {Number} id - ID de l'utilisateur
   * @param {String} newPassword - Nouveau mot de passe (min 6 caractères)
   * @returns {Promise<Object>}
   */
  resetPassword: async (id, newPassword) => {
    try {
      const response = await API.put(`/users/${id}/reset-password`, {
        new_password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Activer/Désactiver un utilisateur (Admin)
   * @param {Number} id - ID de l'utilisateur
   * @param {Boolean} active - true pour activer, false pour désactiver
   * @returns {Promise<Object>}
   */
  toggleActive: async (id, active) => {
    try {
      const response = await API.patch(`/users/${id}/active?active=${active}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============================================
  // GESTION DU PROFIL DE L'UTILISATEUR CONNECTÉ
  // ============================================

  /**
   * Récupérer le profil de l'utilisateur connecté
   * @returns {Promise<Object>}
   */
  getMyProfile: async () => {
    try {
      console.log("📡 Chargement du profil utilisateur connecté...");
      const response = await API.get("/users/me/profile");
      console.log("✅ Profil chargé:", response.data);
      console.log("🔍 VALEUR BRUTE profileData.logo:", response.data.logo); // ← DEBUG
      return response.data;
    } catch (error) {
      console.error("❌ Erreur chargement profil:", error);
      throw error;
    }
  },

  /**
   * ✅ CORRECTION : Mettre à jour le profil avec mise à jour temps réel
   * @param {Object} formData - Données du formulaire
   * @param {File} imageFile - Fichier image optionnel
   * @returns {Promise<Object>}
   */
  updateMyProfile: async (formData, imageFile = null) => {
    try {
      console.log("📤 1. Envoi mise à jour profil:", formData);
      console.log("🖼️ 2. Fichier image:", imageFile);

      const data = new FormData();

      // Ajouter les champs texte
      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== null &&
          formData[key] !== undefined &&
          formData[key] !== ""
        ) {
          data.append(key, formData[key]);
        }
      });

      // ✅ Le backend attend "image"
      if (imageFile) {
        console.log("📎 3. Ajout de l'image au FormData avec clé 'image'");
        data.append("image", imageFile);
      }

      const response = await API.put("/users/me/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ 4. Réponse reçue:", response.data);
      console.log("🖼️ 5. Logo présent:", response.data.logo ? "Oui" : "Non");
      console.log("🔍 VALEUR BRUTE response.data.logo:", response.data.logo); // ← DEBUG

      // ✅ Mettre à jour localStorage et déclencher l'événement
      if (response.data.logo) {
        await UserService.refreshProfileImageInStorage();
      }

      return response.data;
    } catch (error) {
      console.error("❌ Erreur mise à jour profil:", error);
      throw error;
    }
  },

  /**
   * ✅ CORRIGÉ : Rafraîchir l'image avec nettoyage du double /api
   */
  refreshProfileImageInStorage: async () => {
    try {
      console.log("🔄 Rafraîchissement de l'image de profil...");

      // 1. Récupérer les données à jour depuis l'API
      const profileData = await UserService.getMyProfile();

      // 2. Récupérer l'utilisateur stocké
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      // 3. Construire l'URL complète de l'image
      let imageURL = null;
      if (profileData.logo) {
        const baseURL = "http://127.0.0.1:8000";

        // ✅ CORRECTION CRITIQUE : Nettoyer le double /api
        let cleanPath = profileData.logo;

        // Si c'est déjà une URL complète, la retourner
        if (
          cleanPath.startsWith("http://") ||
          cleanPath.startsWith("https://")
        ) {
          imageURL = cleanPath;
        }
        // Si c'est un chemin relatif
        else if (cleanPath.startsWith("/")) {
          // ✅ Nettoyer /api/api -> /api
          cleanPath = cleanPath.replace(/\/api\/api/g, "/api");
          imageURL = `${baseURL}${cleanPath}`;
        }
        // Sinon, ajouter le /
        else {
          imageURL = `${baseURL}/${cleanPath}`;
        }

        console.log("🔍 Chemin original:", profileData.logo);
        console.log("🧹 Chemin nettoyé:", cleanPath);
        console.log("✅ URL finale construite:", imageURL);
      }

      // 4. Mettre à jour localStorage
      const updatedUser = {
        ...storedUser,
        profileImage: imageURL,
        nom: profileData.nom,
        prenom: profileData.prenom,
        email: profileData.email,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log("💾 localStorage mis à jour");

      // 5. Déclencher l'événement
      const event = new CustomEvent("profileImageUpdated", {
        detail: { profileImage: imageURL },
      });
      window.dispatchEvent(event);
      console.log("📡 Événement 'profileImageUpdated' déclenché");

      return imageURL;
    } catch (error) {
      console.error("❌ Erreur rafraîchissement image:", error);
      throw error;
    }
  },

  /**
   * ✅ CORRIGÉ : Construire l'URL avec nettoyage du double /api
   * @param {String} logoPath - Chemin de l'image depuis la BDD
   * @returns {String} - URL complète
   */
  buildProfileImageUrl: (logoPath) => {
    if (!logoPath) return null;

    const baseURL = "http://127.0.0.1:8000";

    // Si c'est déjà une URL complète
    if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
      return logoPath;
    }

    // ✅ Nettoyer le double /api si présent
    let cleanPath = logoPath;
    if (logoPath.startsWith("/")) {
      cleanPath = logoPath.replace(/\/api\/api/g, "/api");
      return `${baseURL}${cleanPath}`;
    }

    return `${baseURL}/${logoPath}`;
  },

  /**
   * Mettre à jour le profil en JSON (sans image)
   * @param {Object} profileData
   * @returns {Promise<Object>}
   */
  updateMyProfileJson: async (profileData) => {
    try {
      const response = await API.patch("/users/me/profile", profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer l'URL de l'image de profil
   * @returns {String}
   */
  getMyProfileImageUrl: () => {
    return `${API.defaults.baseURL}/users/me/image`;
  },

  /**
   * Supprimer l'image de profil
   * @returns {Promise<Object>}
   */
  deleteMyProfileImage: async () => {
    try {
      const response = await API.delete("/users/me/image");

      // ✅ Mettre à jour après suppression
      await UserService.refreshProfileImageInStorage();

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============================================
  // GESTION DU PROFIL PAR ID (ADMIN)
  // ============================================

  /**
   * Récupérer le profil d'un utilisateur par ID (Admin)
   * @param {Number} userId
   * @returns {Promise<Object>}
   */
  getProfile: async (userId) => {
    try {
      const response = await API.get(`/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mettre à jour le profil d'un utilisateur par ID (Admin)
   * @param {Number} userId
   * @param {Object} profileData
   * @param {File} imageFile
   * @returns {Promise<Object>}
   */
  updateProfile: async (userId, profileData, imageFile = null) => {
    try {
      const formData = new FormData();

      // Ajouter tous les champs du profil
      if (profileData.nom) formData.append("nom", profileData.nom);
      if (profileData.prenom) formData.append("prenom", profileData.prenom);
      if (profileData.email) formData.append("email", profileData.email);
      if (profileData.telephone)
        formData.append("telephone", profileData.telephone);
      if (profileData.code_postal)
        formData.append("code_postal", profileData.code_postal);
      if (profileData.adresse) formData.append("adresse", profileData.adresse);
      if (profileData.contact) formData.append("contact", profileData.contact);

      // Mots de passe
      if (profileData.passwordCurrent)
        formData.append("passwordCurrent", profileData.passwordCurrent);
      if (profileData.passwordNew)
        formData.append("passwordNew", profileData.passwordNew);

      // Image
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await API.put(`/users/${userId}/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mettre à jour le profil en JSON (Admin)
   * @param {Number} userId
   * @param {Object} profileData
   * @returns {Promise<Object>}
   */
  updateProfileJson: async (userId, profileData) => {
    try {
      const response = await API.patch(`/users/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Récupérer l'URL de l'image d'un utilisateur par ID
   * @param {Number} userId
   * @returns {String}
   */
  getProfileImageUrl: (userId) => {
    return `${API.defaults.baseURL}/users/${userId}/image`;
  },

  /**
   * Supprimer l'image d'un utilisateur par ID (Admin)
   * @param {Number} userId
   * @returns {Promise<Object>}
   */
  deleteProfileImage: async (userId) => {
    try {
      const response = await API.delete(`/users/${userId}/image`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============================================
  // ANCIENNES FONCTIONS (COMPATIBILITÉ)
  // ============================================

  /**
   * @deprecated Utilisez updateMyProfile à la place
   */
  changePassword: async (data) => {
    try {
      const response = await API.post("/users/change-password", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * @deprecated Utilisez updateMyProfile avec imageFile à la place
   */
  updateProfilePhoto: async (formData) => {
    try {
      const response = await API.post("/users/profile-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default UserService;
