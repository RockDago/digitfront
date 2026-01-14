// Export centralisé de tous les services
export { default as AuthService } from "./auth.service";
export { default as UserService } from "./user.service";
export { default as RoleService } from "./role.service";
export { default as ArchiveService } from "./archive.service";

// Export de l'instance Axios pour usage personnalisé
export { default as API } from "../config/axios";
export { API_URL, BASE_URL } from "../config/axios";
