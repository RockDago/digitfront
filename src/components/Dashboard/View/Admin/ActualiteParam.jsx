import React from "react";
import { FaPen } from "react-icons/fa";

export default function ActualiteParam() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestion des Actualités
        </h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700">
          Nouvelle actualité
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Titre</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">
                  Mise à jour des accréditations 2026
                </td>
                <td className="px-6 py-4 text-gray-500">12 Janv 2026</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
                    <FaPen />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
