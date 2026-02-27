import React, { useState, useContext, useEffect } from "react";
import { FaUserShield, FaCheckCircle, FaTimes, FaSave, FaInfoCircle } from "react-icons/fa";
import { ThemeContext } from "../../../../context/ThemeContext";

// ─── Rôles avec permissions initiales (sans Administrateur) ───────────────────
const INITIAL_ROLES = [
  { id: 2, name: "SAE",                       canRead: true,  canWrite: true  },
  { id: 3, name: "SICP",                      canRead: true,  canWrite: true  },
  { id: 4, name: "CNH",                       canRead: true,  canWrite: false },
  { id: 5, name: "Expert",                    canRead: true,  canWrite: false },
  { id: 6, name: "Responsable",               canRead: true,  canWrite: true  },
  { id: 7, name: "Gestionnaire Habilitation", canRead: true,  canWrite: true  },
  { id: 8, name: "Établissement",             canRead: true,  canWrite: true  },
  { id: 9, name: "Requérant",                 canRead: true,  canWrite: true  },
];

// ─── Toast notification ───────────────────────────────────────────────────────
const Toast = ({ message, onClose }) => {
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
  return (
    <div className="fixed top-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 bg-green-50 dark:bg-green-900/30 border-green-500 shadow-lg animate-slide-in-right">
      <FaCheckCircle className="text-green-500 text-xl" />
      <p className="text-sm font-medium text-green-800 dark:text-green-300">{message}</p>
      <button onClick={onClose} className="ml-2 text-green-800 dark:text-green-300 hover:opacity-70"><FaTimes /></button>
    </div>
  );
};

// ─── Composant principal ──────────────────────────────────────────────────────
export default function RolesPermissionsView() {
  const { theme } = useContext(ThemeContext);
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [hasChanges, setHasChanges] = useState(false);
  const [toast, setToast] = useState(null);

  // Gérer le clic sur une checkbox
  const handleToggle = (id, field) => {
    setRoles(roles.map((r) => r.id === id ? { ...r, [field]: !r[field] } : r));
    setHasChanges(true);
  };

  // Enregistrer
  const handleSave = () => {
    setHasChanges(false);
    setToast("Les permissions ont été mises à jour avec succès.");
  };

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      
      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

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
          disabled={!hasChanges}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-sm
            ${hasChanges 
              ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" 
              : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed border border-gray-200 dark:border-gray-700"}`}
        >
          <FaSave className="text-base" />
          Enregistrer les modifications
        </button>
      </div>

      {/* ── Tableau simple ── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                    {role.name}
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
