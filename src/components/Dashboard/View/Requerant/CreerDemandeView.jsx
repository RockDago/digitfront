import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUpload,
  FaFilePdf,
  FaTrash,
  FaInfoCircle,
  FaCheck,
} from "react-icons/fa";

export default function CreerDemandeView() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    typeDemande: "",
    niveau: "",
    paysObtention: "",
    etablissement: "",
    anneeObtention: "",
    specialite: "",
    notesComplementaires: "",
  });

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      file: file,
      date: new Date().toISOString().split("T")[0],
    }));
    setDocuments([...documents, ...newDocuments]);
  };

  const removeDocument = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const getFileIcon = (fileName) => {
    if (fileName.toLowerCase().endsWith(".pdf")) {
      return <FaFilePdf className="text-red-500" />;
    }
    return <FaFilePdf className="text-blue-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simuler une soumission d'API
    setTimeout(() => {
      console.log("Données soumises:", formData);
      console.log("Documents:", documents);
      setLoading(false);
      setSubmitSuccess(true);

      // Réinitialiser le formulaire après succès
      setTimeout(() => {
        setFormData({
          typeDemande: "",
          niveau: "",
          paysObtention: "",
          etablissement: "",
          anneeObtention: "",
          specialite: "",
          notesComplementaires: "",
        });
        setDocuments([]);
        setSubmitSuccess(false);
      }, 3000);
    }, 2000);
  };

  const typesDemande = [
    { value: "bac", label: "Baccalauréat" },
    { value: "licence", label: "Licence" },
    { value: "master", label: "Master" },
    { value: "doctorat", label: "Doctorat" },
    { value: "autre", label: "Autre diplôme" },
  ];

  const niveaux = [
    { value: "bac", label: "Baccalauréat" },
    { value: "bac+3", label: "Licence (Bac+3)" },
    { value: "bac+5", label: "Master (Bac+5)" },
    { value: "bac+8", label: "Doctorat (Bac+8)" },
  ];

  const documentsRequis = [
    "Diplôme original ou copie certifiée conforme",
    "Relevé de notes officiel",
    "Programme détaillé des cours",
    "Pièce d'identité",
    "Photo d'identité",
    "Formulaire de demande dûment rempli",
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Nouvelle Demande d'Équivalence
            </h1>
            <p className="text-gray-600">
              Remplissez le formulaire ci-dessous pour soumettre votre demande
              d'équivalence
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/requerant")}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Retour au tableau de bord
          </button>
        </div>
      </div>

      {/* Message de succès */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3">
            <FaCheck className="text-green-500 text-xl" />
            <div>
              <h3 className="font-medium text-green-800">
                Demande soumise avec succès !
              </h3>
              <p className="text-green-600 text-sm">
                Votre demande a été enregistrée. Vous recevrez une notification
                par email.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Type de demande */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de demande *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {typesDemande.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, typeDemande: type.value })
                        }
                        className={`p-4 border rounded-xl text-center transition-all ${
                          formData.typeDemande === type.value
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div className="font-medium">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Informations du diplôme */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau du diplôme *
                    </label>
                    <select
                      name="niveau"
                      value={formData.niveau}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    >
                      <option value="">Sélectionnez un niveau</option>
                      {niveaux.map((niveau) => (
                        <option key={niveau.value} value={niveau.value}>
                          {niveau.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pays d'obtention *
                    </label>
                    <input
                      type="text"
                      name="paysObtention"
                      value={formData.paysObtention}
                      onChange={handleChange}
                      placeholder="Ex: France, Canada, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Établissement *
                    </label>
                    <input
                      type="text"
                      name="etablissement"
                      value={formData.etablissement}
                      onChange={handleChange}
                      placeholder="Nom de l'université/école"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Année d'obtention *
                    </label>
                    <input
                      type="number"
                      name="anneeObtention"
                      value={formData.anneeObtention}
                      onChange={handleChange}
                      min="1900"
                      max="2024"
                      placeholder="Ex: 2020"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Spécialité */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spécialité / Domaine d'études *
                  </label>
                  <input
                    type="text"
                    name="specialite"
                    value={formData.specialite}
                    onChange={handleChange}
                    placeholder="Ex: Informatique, Médecine, Droit, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>

                {/* Notes complémentaires */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes complémentaires
                  </label>
                  <textarea
                    name="notesComplementaires"
                    value={formData.notesComplementaires}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Informations supplémentaires concernant votre demande..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Bouton de soumission */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-xl font-medium text-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        <FaCheck /> Soumettre la demande
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Documents requis */}
        <div className="space-y-6">
          {/* Upload de documents */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaUpload /> Documents à fournir
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Télécharger les documents *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <FaUpload className="text-3xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">
                  Glissez-déposez vos fichiers ou cliquez pour parcourir
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  PDF, JPG, PNG (Max 10MB par fichier)
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium cursor-pointer transition-colors"
                >
                  Choisir des fichiers
                </label>
              </div>
            </div>

            {/* Liste des documents téléchargés */}
            {documents.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Documents téléchargés ({documents.length})
                </h4>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.name)}
                        <div>
                          <div className="font-medium text-sm text-gray-800">
                            {doc.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(doc.size)} • {doc.date}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Liste des documents requis */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaInfoCircle /> Documents requis
            </h3>
            <ul className="space-y-3">
              {documentsRequis.map((doc, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 text-sm">{doc}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important :</strong> Tous les documents doivent être en
                format PDF et d'une taille maximale de 10MB.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
