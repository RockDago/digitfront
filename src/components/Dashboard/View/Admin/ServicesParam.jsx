import React from "react";
import { FaTrash, FaPlus } from "react-icons/fa";

export default function ServicesParam() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Services</h1>
        <button className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-xl font-medium hover:bg-blue-100 transition-colors">
            <FaPlus size={12}/> Ajouter un service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3].map((item) => (
           <div key={item} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group">
              <button className="absolute top-4 right-4 text-gray-300 hover:text-red-500"><FaTrash /></button>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg mb-4"></div>
              <h3 className="font-bold text-gray-800 mb-2">Titre du service {item}</h3>
              <p className="text-sm text-gray-500">Description courte du service affichée sur la page d'accueil...</p>
           </div>
        ))}
      </div>
    </div>
  );
}
