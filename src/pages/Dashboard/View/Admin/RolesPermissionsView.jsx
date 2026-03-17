import React, { useState, useContext, useEffect } from "react";
import { FaUserShield, FaCheckCircle, FaTimes, FaSave, FaInfoCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";
import { ThemeContext } from "../../../../context/ThemeContext";
import RoleService from "../../../../services/role.service";

const ROLE_LABELS = {
  Admin: "Administrateur",
  admin: "Administrateur",
  Requerant: "Requérant",
  Etablissement: "Établissement",
  SAE: "Service SAE",
  SICP: "Service SICP",
  CNH: "Service CNH",
  Expert: "Expert Évaluateur",
  Universite: "Université",
  gestionnaire_habilitation: "Gestionnaire Habilitation",
};

const formatRole = (role) => {
  if (!role) return "";
  if (ROLE_LABELS[role]) return ROLE_LABELS[role];
  return role.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim().replace(/\b\w/g, (c) => c.toUpperCase());
};

// ─── Toast notification ───────────────────────────────────────────────────────
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
  const isError = type === "error";
  return (
    <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 shadow-lg animate-slide-in-right ${
      isError 
        ? "bg-red-50 dark:bg-red-900/30 border-red-500" 
        : "bg-green-50 dark:bg-green-900/30 border-green-500"
    }`}>
      {isError ? <FaTimesCircle className="text-red-500 text-xl" /> : <FaCheckCircle className="text-green-500 text-xl" />}
      <p className={`text-sm font-medium ${isError ? "text-red-800 dark:text-red-300" : "text-green-800 dark:text-green-300"}`}>{message}</p>
      <button onClick={onClose} className={`ml-2 hover:opacity-70 ${isError ? "text-red-800 dark:text-red-300" : "text-green-800 dark:text-green-300"}`}><FaTimes /></button>
    </div>
  );
};

// ─── Composant principal ──────────────────────────────────────────────────────
export default function RolesPermissionsView() {
  const { theme } = useContext(ThemeContext);
  const [roles, setRoles] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await RoleService.getRoles();
        // Rename can_read and can_write to camelCase for the frontend component if necessary
        const formattedRoles = rolesData.map((r) => ({
             id: r.id, 
             name: r.name, 
             canRead: r.can_read, 
             canWrite: r.can_write 
        }));
        setRoles(formattedRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setToast({ message: "Erreur lors du chargement des rôles.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  // Gérer le clic sur une checkbox
  const handleToggle = (id, field) => {
    setRoles(roles.map((r) => r.id === id ? { ...r, [field]: !r[field] } : r));
    setHasChanges(true);
  };

  // Enregistrer
  const handleSave = async () => {
    setSaving(true);
    try {
        const dataToSave = roles.map(r => ({
            id: r.id,
            can_read: r.canRead,
            can_write: r.canWrite
        }));
        await RoleService.updateRoles(dataToSave);
        setHasChanges(false);
        setToast({ message: "Les permissions ont été mises à jour avec succès.", type: "success" });
    } catch (e) {
        console.error("Error updating roles:", e);
        setToast({ message: "Erreur lors de la mise à jour des permissions.", type: "error" });
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── En-tête ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white leading-tight">
            Rôles & Permissions
          </h1>
          <div className="mt-2 flex flex-col gap-1">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <FaInfoCircle className="text-blue-500" />
              L'Administrateur possède tous les droits par défaut. Configurez ici l'accès des autres rôles.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 ml-5">
              <span className="font-semibold text-gray-600 dark:text-gray-300">Lecture :</span> Permet de consulter les données. <br className="hidden sm:block" />
              <span className="font-semibold text-gray-600 dark:text-gray-300">Écriture :</span> Permet d'ajouter, modifier ou supprimer des données.
            </p>
          </div>
        </div>

        {/* Bouton Sauvegarder */}
        <button 
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-sm
            ${hasChanges && !saving
              ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" 
              : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed border border-gray-200 dark:border-gray-700"}`}
        >
          {saving ? <FaSpinner className="text-base animate-spin" /> : <FaSave className="text-base" />}
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <FaSpinner className="animate-spin text-3xl text-blue-500" />
        </div>
      ) : (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* ── Tableau simple ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/80 border-b-2 border-gray-200 dark:border-gray-600">
                <th className="py-4 px-6 text-sm font-semibold text-blue-600 dark:text-blue-400 border-r border-gray-200 dark:border-gray-600 w-1/2">
                  Rôle utilisateur
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-blue-600 dark:text-blue-400 text-center border-r border-gray-200 dark:border-gray-600 w-1/4">
                  Lecture
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-blue-600 dark:text-blue-400 text-center w-1/4">
                  Écriture
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-blue-50/40 dark:hover:bg-gray-700/30 transition-colors">
                  
                  {/* Nom du rôle */}
                  <td className="py-4 px-6 text-sm text-gray-800 dark:text-gray-200 font-medium border-r border-gray-100 dark:border-gray-700">
                    {formatRole(role.name)}
                  </td>
                  
                  {/* Checkbox Lecture */}
                  <td className="py-4 px-6 text-center border-r border-gray-100 dark:border-gray-700">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={role.canRead}
                        onChange={() => handleToggle(role.id, "canRead")}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer transition-colors accent-blue-600"
                      />
                    </label>
                  </td>

                  {/* Checkbox Écriture */}
                  <td className="py-4 px-6 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={role.canWrite}
                        onChange={() => handleToggle(role.id, "canWrite")}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer transition-colors accent-blue-600"
                      />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
      `}</style>
    </div>
  );
}
