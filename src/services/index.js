// Export centralisé de tous les services
export { default as AuthService } from "./auth.service";
export { default as UserService } from "./user.service";
export { default as AnalyticsService } from "./analytics.service.js";

// Export de l'instance Axios pour usage personnalisé
export { default as API } from "../config/axios";
export { API_URL } from "../config/axios";
