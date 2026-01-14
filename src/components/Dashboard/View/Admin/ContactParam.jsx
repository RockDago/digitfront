import React from "react";

export default function ContactParam() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Coordonnées & Contact</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email de contact</label>
            <input type="email" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500" defaultValue="contact@daaq.mg" />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500" defaultValue="+261 34 00 000 00" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse physique</label>
            <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500" defaultValue="Lot IV... Antananarivo" />
          </div>
          <div className="col-span-1 md:col-span-2 flex justify-end">
             <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors">Mettre à jour</button>
          </div>
        </form>
      </div>
    </div>
  );
}
