import API from "../config/axios";

const RoleService = {
  /**
   * Reccuperer tous les roles et permissions
   */
  getRoles: async () => {
    try {
      const response = await API.get("/roles/");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mettre a jour les permissions de plusieurs roles
   * @param {Array} rolesData - La liste des roles avec leurs permissions modifiees
   */
  updateRoles: async (rolesData) => {
    try {
      const response = await API.put("/roles/", rolesData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default RoleService;
