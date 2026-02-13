import React, { useState } from "react";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const AccreditationView = () => {
  const [accreditations, setAccreditations] = useState([
    {
      id: 1,
      institution: "Université A",
      program: "Licence Informatique",
      status: "En Attente",
      submittedDate: "2023-01-15",
    },
    {
      id: 2,
      institution: "Collège B",
      program: "Master Commerce",
      status: "Approuvée",
      submittedDate: "2023-02-20",
    },
    {
      id: 3,
      institution: "École C",
      program: "Diplôme Technique",
      status: "Rejetée",
      submittedDate: "2023-03-10",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "En Attente":
        return "bg-yellow-100 text-yellow-800";
      case "Approuvée":
        return "bg-green-100 text-green-800";
      case "Rejetée":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestion des Accréditations
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Liste de toutes les demandes d'accréditation
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">
              Demandes d'Accréditation
            </h2>
            <p className="text-sm text-gray-500">
              Total: {accreditations.length}
            </p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <FaPlus size={18} />
            Nouvelle Demande
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                  <th className="p-4">Institution</th>
                  <th className="p-4">Programme</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Date de Soumission</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {accreditations.map((acc) => (
                  <tr
                    key={acc.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium">{acc.institution}</td>
                    <td className="p-4">{acc.program}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(acc.status)}`}
                      >
                        {acc.status}
                      </span>
                    </td>
                    <td className="p-4">{acc.submittedDate}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State Fallback */}
        {accreditations.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">
              Aucune demande d'accréditation trouvée
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AccreditationView;
