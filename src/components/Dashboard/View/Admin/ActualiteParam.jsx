import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaImage,
  FaSave,
  FaTimes,
  FaUpload,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import actualiteService from "../../../../services/actualite.service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ActualiteParam() {
  const [actualites, setActualites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActualite, setEditingActualite] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actualiteToDelete, setActualiteToDelete] = useState(null);
  const [previewCouverture, setPreviewCouverture] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    contenu: "",
    couverture: null,
    images_contenu: [],
    actif: true,
    date_publication: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchActualites();
  }, []);

  const fetchActualites = async () => {
    try {
      setIsLoading(true);
      const data = await actualiteService.getAllActualites();
      setActualites(data);
    } catch (error) {
      console.error("Erreur lors du chargement des actualités:", error);
      toast.error("Impossible de charger les actualités");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setUploadProgress(0);

      const formDataToSend = new FormData();
      formDataToSend.append("titre", formData.titre);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("contenu", formData.contenu);
      formDataToSend.append("actif", formData.actif);
      formDataToSend.append("date_publication", formData.date_publication);

      if (formData.couverture) {
        formDataToSend.append("couverture", formData.couverture);
      }

      if (formData.images_contenu.length > 0) {
        formData.images_contenu.forEach((file) => {
          formDataToSend.append("images_contenu", file);
        });
      }

      if (editingActualite) {
        await actualiteService.updateActualite(
          editingActualite.id,
          formDataToSend,
          (progress) => setUploadProgress(progress),
        );
        toast.success("Actualité mise à jour avec succès");
      } else {
        await actualiteService.createActualite(formDataToSend, (progress) =>
          setUploadProgress(progress),
        );
        toast.success("Actualité créée avec succès");
      }

      await fetchActualites();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error(
        error.message ||
          (editingActualite
            ? "Erreur lors de la mise à jour"
            : "Erreur lors de la création"),
      );
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const toggleActif = async (actualite) => {
    try {
      await actualiteService.toggleActif(actualite.id);
      toast.success(
        actualite.actif ? "Actualité désactivée" : "Actualité activée",
      );
      await fetchActualites();
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      toast.error("Erreur lors du changement de statut");
    }
  };

  const confirmDelete = (actualite) => {
    setActualiteToDelete(actualite);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!actualiteToDelete) return;

    try {
      setIsLoading(true);
      await actualiteService.deleteActualite(actualiteToDelete.id);
      toast.success("Actualité supprimée avec succès");
      await fetchActualites();
      setDeleteModalOpen(false);
      setActualiteToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setActualiteToDelete(null);
  };

  const openModal = (actualite = null) => {
    if (actualite) {
      setEditingActualite(actualite);
      setFormData({
        titre: actualite.titre,
        description: actualite.description,
        contenu: actualite.contenu || "",
        couverture: null,
        images_contenu: [],
        actif: actualite.actif,
        date_publication:
          actualite.date_publication?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
      });
      // Prévisualiser l'image de couverture existante
      setPreviewCouverture(
        `${actualiteService.getBaseURL()}${actualite.couverture_url}`,
      );
      // Prévisualiser les images de contenu existantes
      setPreviewImages(
        actualite.images_contenu_urls?.map(
          (url) => `${actualiteService.getBaseURL()}${url}`,
        ) || [],
      );
    } else {
      setEditingActualite(null);
      setFormData({
        titre: "",
        description: "",
        contenu: "",
        couverture: null,
        images_contenu: [],
        actif: true,
        date_publication: new Date().toISOString().split("T")[0],
      });
      setPreviewCouverture(null);
      setPreviewImages([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingActualite(null);
    setPreviewCouverture(null);
    setPreviewImages([]);
    setUploadProgress(0);
  };

  const handleCouvertureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5 Mo");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner une image valide");
        return;
      }

      setFormData({ ...formData, couverture: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewCouverture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesContenuChange = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} est trop volumineux (max 5 Mo)`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} n'est pas une image valide`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setFormData({
      ...formData,
      images_contenu: [...formData.images_contenu, ...validFiles],
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImageContenu = (index) => {
    setFormData({
      ...formData,
      images_contenu: formData.images_contenu.filter((_, i) => i !== index),
    });
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Gestion des Actualités
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Gérez les actualités et événements affichés sur le site
            </p>
          </div>
          <button
            onClick={() => openModal()}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-base font-medium"
          >
            <FaPlus className="text-sm" /> Ajouter une Actualité
          </button>
        </div>

        {/* Loading state */}
        {isLoading && actualites.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 sm:p-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4 text-sm sm:text-base">
              Chargement des actualités...
            </p>
          </div>
        ) : (
          /* Grille des actualités */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {actualites.length === 0 ? (
              <div className="col-span-full text-center py-12 sm:py-16 px-4 bg-white rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-base sm:text-lg font-medium text-gray-400">
                  Aucune actualité disponible
                </p>
                <p className="text-xs sm:text-sm mt-2 text-gray-500">
                  Cliquez sur "Ajouter une Actualité" pour commencer
                </p>
              </div>
            ) : (
              actualites.map((actualite) => (
                <div
                  key={actualite.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Image de couverture */}
                  <div className="relative h-48 sm:h-56 bg-gray-100 overflow-hidden group">
                    {actualite.couverture_url ? (
                      <img
                        src={`${actualiteService.getBaseURL()}${actualite.couverture_url}`}
                        alt={actualite.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "";
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-200"><svg class="text-gray-400 text-4xl" width="48" height="48" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/></svg></div>`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <FaImage className="text-gray-400 text-4xl" />
                      </div>
                    )}

                    {/* Badge actif/inactif */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => toggleActif(actualite)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg ${
                          actualite.actif
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {actualite.actif ? (
                          <>
                            <FaToggleOn /> Actif
                          </>
                        ) : (
                          <>
                            <FaToggleOff /> Inactif
                          </>
                        )}
                      </button>
                    </div>

                    {/* Nombre d'images de contenu */}
                    {actualite.images_contenu_count > 0 && (
                      <div className="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                        <FaImage /> {actualite.images_contenu_count}
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 flex-1">
                        {actualite.titre}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {actualite.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>
                        {new Date(
                          actualite.date_publication,
                        ).toLocaleDateString("fr-FR")}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(actualite)}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition disabled:opacity-50"
                      >
                        <FaEdit /> Modifier
                      </button>
                      <button
                        onClick={() => confirmDelete(actualite)}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                      >
                        <FaTrash /> Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal de suppression */}
      {deleteModalOpen && actualiteToDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 sm:p-6 animate-scale-in">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
              Confirmer la suppression
            </h3>

            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Voulez-vous vraiment supprimer cette actualité ? Cette action est
              irréversible.
            </p>

            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-5 sm:mb-6 border border-gray-200">
              <p className="font-medium text-gray-900 text-sm sm:text-base break-words">
                {actualiteToDelete.titre}
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={cancelDelete}
                disabled={isLoading}
                className="w-full sm:w-auto px-4 py-2.5 text-sm sm:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="w-full sm:w-auto px-4 py-2.5 text-sm sm:text-base bg-red-600 text-white hover:bg-red-700 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
              >
                {isLoading ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout/édition */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 animate-scale-in">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center rounded-t-xl z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {editingActualite
                  ? "Modifier l'Actualité"
                  : "Nouvelle Actualité"}
              </h2>
              <button
                onClick={closeModal}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <FaTimes size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Barre de progression d'upload */}
            {isLoading && uploadProgress > 0 && (
              <div className="px-4 sm:px-6 pt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">
                      Envoi en cours...
                    </span>
                    <span className="text-sm font-bold text-blue-900">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Body */}
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 space-y-5 max-h-[calc(100vh-12rem)] overflow-y-auto"
            >
              {/* Titre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) =>
                    setFormData({ ...formData, titre: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Titre de l'actualité"
                  required
                  disabled={isLoading}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  {formData.titre.length}/200 caractères
                </p>
              </div>

              {/* Description courte */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description courte <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  rows="3"
                  placeholder="Description affichée dans le carrousel"
                  required
                  disabled={isLoading}
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  {formData.description.length}/300 caractères
                </p>
              </div>

              {/* Contenu complet */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contenu complet
                </label>
                <textarea
                  value={formData.contenu}
                  onChange={(e) =>
                    setFormData({ ...formData, contenu: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  rows="6"
                  placeholder="Contenu détaillé de l'actualité (optionnel)"
                  disabled={isLoading}
                />
              </div>

              {/* Image de couverture */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image de couverture (Carrousel){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCouvertureChange}
                    className="hidden"
                    id="couverture-upload"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="couverture-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    {previewCouverture ? (
                      <div className="relative w-full h-64 rounded-lg overflow-hidden">
                        <img
                          src={previewCouverture}
                          alt="Couverture"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-medium">
                            Cliquer pour changer
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FaUpload className="mx-auto text-4xl text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 font-medium">
                          Cliquez pour télécharger une image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, WEBP jusqu'à 5 Mo
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Images de contenu (multiples) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Images du contenu (Optionnel - Multiple)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesContenuChange}
                    className="hidden"
                    id="images-contenu-upload"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="images-contenu-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <div className="text-center py-6">
                      <FaImage className="mx-auto text-3xl text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 font-medium">
                        Cliquez pour ajouter des images
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Vous pouvez sélectionner plusieurs images
                      </p>
                    </div>
                  </label>
                </div>

                {/* Prévisualisation des images de contenu */}
                {previewImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {previewImages.map((preview, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden border-2 border-gray-200"
                      >
                        <img
                          src={preview}
                          alt={`Contenu ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImageContenu(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date de publication et statut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date de publication <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date_publication}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_publication: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Statut
                  </label>
                  <div className="flex items-center h-full">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.actif}
                        onChange={(e) =>
                          setFormData({ ...formData, actif: e.target.checked })
                        }
                        className="sr-only peer"
                        disabled={isLoading}
                      />
                      <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {formData.actif ? "Actif" : "Inactif"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isLoading}
                  className="w-full sm:flex-1 px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:flex-1 px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {uploadProgress > 0
                        ? `${uploadProgress}%`
                        : "Traitement..."}
                    </>
                  ) : (
                    <>
                      <FaSave />
                      {editingActualite ? "Mettre à jour" : "Créer"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
