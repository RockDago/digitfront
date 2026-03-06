import API from "../config/axios";

const SYSTEM_LOG_BASE = "/system-logs";

/**
 * Service pour la gestion des logs système
 * Correspond au backend FastAPI avec les endpoints REST
 */
class SystemLogService {
  /**
   * Récupère tous les logs avec filtres et pagination
   * @param {Object} filters - Filtres à appliquer
   * @param {number} filters.page - Numéro de page
   * @param {number} filters.per_page - Nombre d'éléments par page
   * @param {string} filters.level - Niveau de log (Info, Warning, Error)
   * @param {string} filters.action - Action CRUD (All, Système, Créer, Lire, Modifier, Supprimer)
   * @param {string} filters.source - Source du log
   * @param {string} filters.date_from - Date de début (YYYY-MM-DD)
   * @param {string} filters.date_to - Date de fin (YYYY-MM-DD)
   * @param {string} filters.search - Terme de recherche
   * @returns {Promise<Object>} - Liste paginée des logs
   */
  async getLogs(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Ajouter les paramètres de filtrage
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value);
        }
      });

      const response = await API.get(`${SYSTEM_LOG_BASE}`, { params });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des logs:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupère un log par son ID
   * @param {number} id - ID du log
   * @returns {Promise<Object>} - Détails du log
   */
  async getLogById(id) {
    try {
      const response = await API.get(`${SYSTEM_LOG_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du log ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Crée un nouveau log
   * @param {Object} logData - Données du log à créer
   * @returns {Promise<Object>} - Log créé
   */
  async createLog(logData) {
    try {
      const response = await API.post(`${SYSTEM_LOG_BASE}`, logData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du log:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Met à jour un log existant
   * @param {number} id - ID du log à mettre à jour
   * @param {Object} logData - Données à mettre à jour
   * @returns {Promise<Object>} - Log mis à jour
   */
  async updateLog(id, logData) {
    try {
      const response = await API.put(`${SYSTEM_LOG_BASE}/${id}`, logData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du log ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Supprime un log
   * @param {number} id - ID du log à supprimer
   * @returns {Promise<Object>} - Résultat de la suppression
   */
  async deleteLog(id) {
    try {
      const response = await API.delete(`${SYSTEM_LOG_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du log ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupère les statistiques des logs
   * @returns {Promise<Object>} - Statistiques des logs
   */
  async getStatistics() {
    try {
      const response = await API.get(`${SYSTEM_LOG_BASE}/statistics`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupère la liste unique des sources de logs
   * @returns {Promise<Array>} - Liste des sources
   */
  async getSources() {
    try {
      const response = await API.get(`${SYSTEM_LOG_BASE}/sources`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des sources:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Nettoie les logs anciens
   * @param {number} days - Nombre de jours de conservation
   * @returns {Promise<Object>} - Résultat du nettoyage
   */
  async cleanupOldLogs(days = 30) {
    try {
      const response = await API.delete(`${SYSTEM_LOG_BASE}/cleanup/old`, {
        params: { days },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors du nettoyage des logs:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Exporte les logs au format CSV
   * @param {Array} logs - Liste des logs à exporter
   * @returns {Blob} - Fichier CSV
   */
  exportToCSV(logs) {
    try {
      // header matches the visible table columns; ID is omitted
      const header = [
        "Niveau",
        "Action",
        "Horodatage",
        "Utilisateur",
        "Source",
        "Message",
      ];
      const lines = logs.map((log) => {
        let userStr = "";
        if (log.user_prenom || log.user_nom) {
          userStr = `${log.user_prenom || ""} ${log.user_nom || ""}`.trim();
        } else if (log.user_id) {
          userStr = `#${log.user_id}`;
        }

        return [
          log.level,
          log.action || "Système",
          log.timestamp_formatted || log.timestamp,
          userStr,
          log.source,
          `"${(log.message || "").replace(/"/g, '""')}"`,
        ];
      });

      const csv = [header, ...lines].map((row) => row.join(";")).join("\n");
      const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      });

      return blob;
    } catch (error) {
      console.error("Erreur lors de l'export CSV:", error);
      throw error;
    }
  }

  /**
   * Génère le HTML pour l'export PDF
   * @param {Array} logs - Liste des logs à exporter
   * @returns {string} - Contenu HTML
   */
  generatePDFHtml(logs) {
    const tableRows = logs
      .map(
        (log) => `
      <tr>
        <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;color:${
          log.level === "Error"
            ? "#ef4444"
            : log.level === "Warning"
              ? "#f97316"
              : "#3b82f6"
        };font-weight:600;font-size:11px">${log.level}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;font-size:11px">${log.action || "—"}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;font-family:monospace;font-size:11px">${
          log.timestamp_formatted || log.timestamp
        }</td>
        <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;font-size:11px">${
          log.user_prenom || log.user_nom
            ? `${log.user_prenom || ""} ${log.user_nom || ""}`.trim()
            : log.user_id
              ? `#${log.user_id}`
              : ""
        }</td>
        <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;font-size:11px">
          <span style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:10px">${log.source}</span>
        </td>
        <td style="padding:7px 10px;border-bottom:1px solid #f3f4f6;max-width:320px;font-size:11px">${log.message}</td>
      </tr>
    `,
      )
      .join("");

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Logs système - ${new Date().toLocaleDateString("fr-FR")}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:Arial,sans-serif; padding:20px; }
    h1 { color:#1e40af; font-size:20px; margin-bottom:6px; }
    p { color:#6b7280; font-size:12px; margin-bottom:18px; }
    table { width:100%; border-collapse:collapse; }
    th { background:#eff6ff; color:#2563eb; font-size:11px; text-transform:uppercase; padding:10px 10px; text-align:left; border-bottom:2px solid #bfdbfe; font-weight:600; }
    tr:nth-child(even) td { background:#f9fafb; }
    @page { margin: 1.5cm; }
  </style>
</head>
<body>
  <h1>📋 Logs du système</h1>
  <p>${logs.length} entrée(s) · Exporté le ${new Date().toLocaleString("fr-FR")}</p>
  <table>
    <thead>
      <tr>
        <th>Niveau</th>
        <th>Action</th>
        <th>Horodatage</th>
        <th>Utilisateur</th>
        <th>Source</th>
        <th>Message</th>
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>
</body>
</html>`;
  }

  /**
   * Gère les erreurs de l'API
   * @param {Error} error - Erreur à traiter
   * @returns {Object} - Erreur formatée
   */
  handleError(error) {
    // Normalize into consistent object with string message
    if (error.response) {
      // Server responded with status code
      const data = error.response.data || {};
      let message = "Erreur serveur";

      if (data.detail !== undefined) {
        if (Array.isArray(data.detail)) {
          // Pydantic validation errors come as array of objects
          message = data.detail
            .map((d) => (d && d.msg ? d.msg : JSON.stringify(d)))
            .join(" ; ");
        } else if (typeof data.detail === "object") {
          message = data.detail.msg || JSON.stringify(data.detail);
        } else {
          message = String(data.detail);
        }
      } else if (data.message) {
        message = String(data.message);
      }

      return {
        status: error.response.status,
        message,
        data,
      };
    } else if (error.request) {
      // No response from server
      return {
        status: 503,
        message:
          "Impossible de contacter le serveur. Vérifiez votre connexion.",
      };
    } else {
      // Something went wrong setting up the request
      return {
        status: 500,
        message: error.message || "Erreur inattendue",
      };
    }
  }

  /**
   * Crée un log d'activité utilisateur
   * @param {Object} activity - Données de l'activité
   * @returns {Promise<Object>} - Log créé
   */
  async logUserActivity(activity) {
    const logData = {
      level: activity.level || "Info",
      action: activity.action,
      message: activity.message,
      source: activity.source || "Application",
      request_method: activity.method,
      request_path: activity.path,
      response_status: activity.status,
      execution_time: activity.executionTime,
    };

    return this.createLog(logData);
  }

  /**
   * Crée un log d'erreur système
   * @param {Error} error - Erreur à logger
   * @param {Object} context - Contexte de l'erreur
   * @returns {Promise<Object>} - Log créé
   */
  async logSystemError(error, context = {}) {
    const logData = {
      level: "Error",
      message: error.message || "Erreur système",
      source: context.source || "Système",
      request_method: context.method,
      request_path: context.path,
      response_status: context.status || 500,
      execution_time: context.executionTime,
    };

    return this.createLog(logData);
  }
}

// Export d'une instance unique du service
const systemLogService = new SystemLogService();
export default systemLogService;

// Export des constantes pour utilisation dans les composants
export const LOG_LEVELS = {
  INFO: "Info",
  WARNING: "Warning",
  ERROR: "Error",
};

export const LOG_ACTIONS = {
  CREATE: "Créer",
  READ: "Lire",
  UPDATE: "Modifier",
  DELETE: "Supprimer",
  SYSTEM: null,
};

export const ACTION_LABELS = {
  Créer: { label: "Créer", color: "green" },
  Lire: { label: "Lire", color: "blue" },
  Modifier: { label: "Modifier", color: "amber" },
  Supprimer: { label: "Supprimer", color: "red" },
  Système: { label: "Système", color: "gray" },
};

export const LEVEL_CONFIG = {
  Info: {
    color: "text-blue-600",
    dark: "dark:text-blue-400",
    label: "Information",
    icon: "info",
  },
  Warning: {
    color: "text-orange-500",
    dark: "dark:text-orange-400",
    label: "Avertissement",
    icon: "warning",
  },
  Error: {
    color: "text-red-500",
    dark: "dark:text-red-400",
    label: "Erreur",
    icon: "error",
  },
};
