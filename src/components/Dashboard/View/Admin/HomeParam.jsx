import React from "react";

export default function HomeParam() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Paramètres de la page d'accueil</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg text-gray-800 mb-6 border-b pb-2">Section Héro (Bannière)</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre principal</label>
            <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Bienvenue sur DAAQ..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre / Description</label>
            <textarea rows="3" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Votre texte ici..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image de fond</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors">
              <span className="text-gray-500 text-sm">Cliquez pour uploader une image</span>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
             <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
