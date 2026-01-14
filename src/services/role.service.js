import API from "../config/axios";

const ROLES_KEY = "activeRoles";

const RoleService = {
  /**
   * Récupérer les rôles activés
   * @returns {Promise<Object>} { roles: Array }
   */
  getActiveRoles: async () => {
    try {
      // Tentative de récupération depuis l'API
      const response = await API.get("/roles/active");
      return response.data;
    } catch (error) {
      // Fallback sur localStorage si API non disponible
      const stored = localStorage.getItem(ROLES_KEY);
      if (stored) {
        return { roles: JSON.parse(stored) };
      }
      // Rôles par défaut
      return { roles: ["Etablissement", "Requerant"] };
    }
  },

  /**
   * Récupérer tous les rôles disponibles
   * @returns {Promise<Array>}
   */
  getAllRoles: async () => {
    try {
      const response = await API.get("/roles");
      return response.data;
    } catch (error) {
      // Rôles par défaut si API non disponible
      return [
        { value: "Admin", label: "Administrateur" },
        { value: "Etablissement", label: "Établissement" },
        { value: "Requerant", label: "Requérant" },
        { value: "SAE", label: "SAE" },
        { value: "SICP", label: "SICP" },
      ];
    }
  },

  /**
   * Mettre à jour l'activation d'un rôle (Admin uniquement)
   * @param {String} role
   * @param {Boolean} enabled
   * @returns {Promise<Object>}
   */
  updateRoleActivation: async (role, enabled) => {
    try {
      const response = await API.post("/roles/toggle", { role, enabled });
      
      // Mise à jour du cache local
      const stored = localStorage.getItem(ROLES_KEY);
      let roles = stored ? JSON.parse(stored) : ["Etablissement", "Requerant"];
      
      if (enabled && !roles.includes(role)) {
        roles.push(role);
      }
      if (!enabled) {
        roles = roles.filter((r) => r !== role);
      }
      
      localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Vérifier si un rôle est actif
   * @param {String} role
   * @returns {Promise<Boolean>}
   */
  isRoleActive: async (role) => {
    try {
      const { roles } = await RoleService.getActiveRoles();
      return roles.includes(role);
    } catch (error) {
      return false;
    }
  },
};

export default RoleService;
