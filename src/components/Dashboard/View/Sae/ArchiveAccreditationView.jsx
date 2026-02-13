import React, { useState } from "react";
import { FaArchive, FaRedo, FaEye } from "react-icons/fa";

const ArchiveAccreditationView = () => {
  const [archivedAccreditations, setArchivedAccreditations] = useState([
    {
      id: 1,
      institution: "Université D",
      program: "Licence Commerce",
      archivedDate: "2023-01-10",
      reason: "Complété",
    },
    {
      id: 2,
      institution: "École E",
      program: "Master Finance",
      archivedDate: "2023-02-05",
      reason: "Rejeté",
    },
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          Lists des archives des Accréditations
        </h1>
       
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
       

        {/* Archived List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                  <th className="p-4">Institution</th>
                  <th className="p-4">Programme</th>
                  <th className="p-4">Raison d'Archivage</th>
                  <th className="p-4">Date d'Archivage</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {archivedAccreditations.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium">{item.institution}</td>
                    <td className="p-4">{item.program}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {item.reason}
                      </span>
                    </td>
                    <td className="p-4">{item.archivedDate}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Consulter"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Restaurer"
                        >
                          <FaRedo size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {archivedAccreditations.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <FaArchive className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500">Aucune accréditation archivée</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ArchiveAccreditationView;
