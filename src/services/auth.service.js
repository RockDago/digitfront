import API from "../config/axios";

const AuthService = {
  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} data - { nom, prenom, email, password, role, username?, recaptchaToken? }
   * @returns {Promise<Object>} Données utilisateur
   */
  register: async (data) => {
    try {
      const payload = {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        password: data.password,
        role: data.role,
      };

      // ✅ Ajouter username si fourni (pour Requerant et Etablissement)
      if (data.username) {
        payload.username = data.username;
      }

      // ✅ NOUVEAU : Ajouter recaptchaToken si fourni
      if (data.recaptchaToken) {
        payload.recaptchaToken = data.recaptchaToken;
      }

      const response = await API.post("/users/", payload);

      // ✅ Sauvegarde automatique du user dans localStorage après inscription
      if (response.data && response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else if (response.data && response.data.email) {
        // Si le backend renvoie directement les données utilisateur (sans clé "user")
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Connexion utilisateur avec email OU username
   * @param {Object} credentials - { email: string (email ou username), password: string, recaptchaToken?: string }
   * @returns {Promise<Object>} Données utilisateur + token
   */
  login: async (credentials) => {
    try {
      // ✅ Envoyer 'identifier' au lieu de 'email' pour accepter email OU username
      const payload = {
        identifier: credentials.email, // Le champ 'email' du frontend devient 'identifier'
        password: credentials.password,
      };

      // ✅ NOUVEAU : Ajouter recaptchaToken si fourni
      if (credentials.recaptchaToken) {
        payload.recaptchaToken = credentials.recaptchaToken;
      }

      const response = await API.post("/users/login", payload);

      // ✅ Sauvegarde automatique du user dans localStorage après connexion
      if (response.data && response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else if (response.data && response.data.email) {
        // Si le backend renvoie directement les données utilisateur (sans clé "user")
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  },

  /**
   * ✅ Authentification Google OAuth avec reCAPTCHA
   * @param {Object} data - { token: string, role?: string, recaptchaToken?: string }
   * @returns {Promise<Object>} Données utilisateur
   */
  googleAuth: async (data) => {
    try {
      const payload = {
        token: data.token,
      };

      // Ajouter le rôle uniquement pour l'inscription
      if (data.role) {
        payload.role = data.role;
      }

      // ✅ NOUVEAU : Ajouter recaptchaToken si fourni
      if (data.recaptchaToken) {
        payload.recaptchaToken = data.recaptchaToken;
      }

      const response = await API.post("/users/auth/google", payload);

      // ✅ Sauvegarde automatique du user dans localStorage
      if (response.data && response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else if (response.data && response.data.email) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      console.error("Erreur Google Auth:", error);
      throw error;
    }
  },

  /**
   * Déconnexion utilisateur
   */
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token"); // Si vous utilisez des tokens JWT
  },

  /**
   * Récupération de l'utilisateur connecté
   * @returns {Object|null} Utilisateur ou null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Vérification si l'utilisateur est authentifié
   * @returns {Boolean}
   */
  isAuthenticated: () => {
    const user = AuthService.getCurrentUser();
    return !!user && !!user.email;
  },

  /**
   * ✅ Vérifier si l'utilisateur utilise Google OAuth
   * @returns {Boolean}
   */
  isGoogleAuthUser: () => {
    const user = AuthService.getCurrentUser();
    return !!user && user.google_auth === true;
  },

  /**
   * Demande de réinitialisation de mot de passe
   * @param {String} email
   * @returns {Promise<Object>}
   */
  forgotPassword: async (email) => {
    try {
      const response = await API.post("/users/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Réinitialisation du mot de passe
   * @param {Object} data - { token, newPassword }
   * @returns {Promise<Object>}
   */
  resetPassword: async (data) => {
    try {
      const response = await API.post("/users/reset-password", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default AuthService;
