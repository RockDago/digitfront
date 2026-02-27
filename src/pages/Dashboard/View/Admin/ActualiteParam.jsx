import React, { useState, useEffect, useContext } from "react";
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
import { ThemeContext } from "../../../../context/ThemeContext";

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

  const { theme } = useContext(ThemeContext);

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
          (progress) => setUploadProgress(progress)
        );
        toast.success("Actualité mise à jour avec succès");
      } else {
        await actualiteService.createActualite(
          formDataToSend,
          (progress) => setUploadProgress(progress)
        );
        toast.success("Actualité créée avec succès");
      }

      await fetchActualites();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error(
        error.message ||
          (editingActualite ? "Erreur lors de la mise à jour" : "Erreur lors de la création")
      );
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const toggleActif = async (actualite) => {
    try {
      await actualiteService.toggleActif(actualite.id);
      toast.success(actualite.actif ? "Actualité désactivée" : "Actualité activée");
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
      setPreviewCouverture(
        actualite.couverture_url
          ? `${actualiteService.getBaseURL()}${actualite.couverture_url}`
          : null
      );
      setPreviewImages(
        actualite.images_contenu_urls?.map(
          (url) => `${actualiteService.getBaseURL()}${url}`
        ) || []
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
    <div
      className={`
        min-h-screen 
        bg-white dark:bg-gray-900 
        text-gray-900 dark:text-gray-100 
        transition-colors duration-300 
        p-4 sm:p-6 lg:p-8
      `}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === "dark" ? "dark" : "light"}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Gestion des Actualités
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Gérez les actualités et événements affichés sur le site
            </p>
          </div>
          <button
            onClick={() => openModal()}
            disabled={isLoading}
            className={`
              flex items-center justify-center gap-2
              bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600
              text-white px-5 py-3 rounded-xl shadow-sm hover:shadow-md
              transition-all disabled:opacity-50 disabled:cursor-not-allowed
              w-full sm:w-auto text-base font-medium
            `}
          >
            <FaPlus /> Ajouter une Actualité
          </button>
        </div>

        {/* Loading */}
        {isLoading && actualites.length === 0 ? (
          <div className="
            bg-white dark:bg-gray-800 
            rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 
            p-12 text-center
          ">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-6">
              Chargement des actualités...
            </p>
          </div>
        ) : (
          /* Grille des actualités */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {actualites.length === 0 ? (
              <div className="
                col-span-full text-center py-16 px-6 
                bg-white dark:bg-gray-800 
                rounded-2xl border-2 border-dashed 
                border-gray-300 dark:border-gray-700
              ">
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                  Aucune actualité disponible
                </p>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                  Cliquez sur "Ajouter une Actualité" pour commencer
                </p>
              </div>
            ) : (
              actualites.map((actualite) => (
                <div
                  key={actualite.id}
                  className="
                    bg-white dark:bg-gray-800 
                    rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 
                    overflow-hidden hover:shadow-md transition-shadow
                  "
                >
                  {/* Image couverture */}
                  <div className="relative h-48 sm:h-56 bg-gray-100 dark:bg-gray-700 overflow-hidden group">
                    {actualite.couverture_url ? (
                      <img
                        src={`${actualiteService.getBaseURL()}${actualite.couverture_url}`}
                        alt={actualite.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "";
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                              <FaImage class="text-gray-400 dark:text-gray-500 text-4xl" />
                            </div>`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                        <FaImage className="text-gray-400 dark:text-gray-500 text-4xl" />
                      </div>
                    )}

                    {/* Badge actif/inactif */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => toggleActif(actualite)}
                        className={`
                          px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg transition-colors
                          ${actualite.actif
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-gray-500 hover:bg-gray-600 text-white"}
                        `}
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

                    {/* Nombre d'images */}
                    {actualite.images_contenu_count > 0 && (
                      <div className="
                        absolute top-3 left-3 
                        bg-black/60 text-white px-2 py-1 rounded-lg 
                        text-xs font-medium flex items-center gap-1
                      ">
                        <FaImage /> {actualite.images_contenu_count}
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                      {actualite.titre}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                      {actualite.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <span>
                        {new Date(actualite.date_publication).toLocaleDateString("fr-FR")}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => openModal(actualite)}
                        disabled={isLoading}
                        className="
                          flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm
                          bg-blue-50 dark:bg-blue-900/30 
                          text-blue-600 dark:text-blue-400 
                          hover:bg-blue-100 dark:hover:bg-blue-900/50 
                          rounded-lg transition disabled:opacity-50
                        "
                      >
                        <FaEdit /> Modifier
                      </button>
                      <button
                        onClick={() => confirmDelete(actualite)}
                        disabled={isLoading}
                        className="
                          flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm
                          bg-red-50 dark:bg-red-900/30 
                          text-red-600 dark:text-red-400 
                          hover:bg-red-100 dark:hover:bg-red-900/50 
                          rounded-lg transition disabled:opacity-50
                        "
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

      {/* Modal suppression */}
      {deleteModalOpen && actualiteToDelete && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="
            bg-white dark:bg-gray-800 
            rounded-2xl shadow-2xl max-w-md w-full p-6
            border border-gray-200 dark:border-gray-700
          ">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-5">
              Voulez-vous vraiment supprimer cette actualité ? Cette action est irréversible.
            </p>
            <div className="
              bg-gray-50 dark:bg-gray-700/50 
              rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700
            ">
              <p className="font-medium text-gray-900 dark:text-gray-100 break-words">
                {actualiteToDelete.titre}
              </p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
              <button
                onClick={cancelDelete}
                disabled={isLoading}
                className="
                  w-full sm:w-auto px-5 py-3 text-base
                  border border-gray-300 dark:border-gray-600
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-50 dark:hover:bg-gray-700
                  rounded-xl transition disabled:opacity-50 font-medium
                "
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="
                  w-full sm:w-auto px-5 py-3 text-base
                  bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600
                  text-white rounded-xl transition disabled:opacity-50
                  flex items-center justify-center gap-2 font-medium
                "
              >
                {isLoading ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ajout / édition */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="
            bg-white dark:bg-gray-800 
            rounded-2xl shadow-2xl max-w-4xl w-full my-8
            border border-gray-200 dark:border-gray-700
          ">
            {/* Header */}
            <div className="
              sticky top-0 z-10 bg-white dark:bg-gray-800 
              border-b border-gray-200 dark:border-gray-700 
              px-6 py-5 flex justify-between items-center rounded-t-2xl
            ">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {editingActualite ? "Modifier l'Actualité" : "Nouvelle Actualité"}
              </h2>
              <button
                onClick={closeModal}
                disabled={isLoading}
                className="
                  p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 
                  rounded-lg transition disabled:opacity-50
                  text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                "
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Progression upload */}
            {isLoading && uploadProgress > 0 && (
              <div className="px-6 pt-4">
                <div className="
                  bg-blue-50 dark:bg-blue-900/30 
                  border border-blue-200 dark:border-blue-800 
                  rounded-lg p-3
                ">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                      Envoi en cours...
                    </span>
                    <span className="text-sm font-bold text-blue-900 dark:text-blue-300">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Formulaire */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6 max-h-[calc(100vh-14rem)] overflow-y-auto"
            >
              {/* Titre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  className="
                    w-full px-4 py-3 text-base
                    border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                    bg-white dark:bg-gray-800
                    border-gray-300 dark:border-gray-600
                    text-gray-900 dark:text-gray-100
                    placeholder-gray-400 dark:placeholder-gray-500
                    disabled:opacity-60
                  "
                  placeholder="Titre de l'actualité"
                  required
                  disabled={isLoading}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  {formData.titre.length}/200 caractères
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description courte <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="
                    w-full px-4 py-3 text-base resize-none
                    border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                    bg-white dark:bg-gray-800
                    border-gray-300 dark:border-gray-600
                    text-gray-900 dark:text-gray-100
                    placeholder-gray-400 dark:placeholder-gray-500
                    disabled:opacity-60
                  "
                  rows="3"
                  placeholder="Description affichée dans le carrousel"
                  required
                  disabled={isLoading}
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  {formData.description.length}/300 caractères
                </p>
              </div>

              {/* Contenu */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Contenu complet
                </label>
                <textarea
                  value={formData.contenu}
                  onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                  className="
                    w-full px-4 py-3 text-base resize-none
                    border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                    bg-white dark:bg-gray-800
                    border-gray-300 dark:border-gray-600
                    text-gray-900 dark:text-gray-100
                    placeholder-gray-400 dark:placeholder-gray-500
                    disabled:opacity-60
                  "
                  rows="6"
                  placeholder="Contenu détaillé de l'actualité (optionnel)"
                  disabled={isLoading}
                />
              </div>

              {/* Couverture */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Image de couverture (Carrousel) <span className="text-red-500">*</span>
                </label>
                <div className="
                  border-2 border-dashed rounded-xl p-6
                  border-gray-300 dark:border-gray-600
                  hover:border-blue-400 dark:hover:border-blue-500 transition
                ">
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
                      <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                          src={previewCouverture}
                          alt="Couverture"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-medium">Changer l'image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <FaUpload className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-3" />
                        <p className="text-base font-medium text-gray-600 dark:text-gray-300">
                          Cliquez pour télécharger une image
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          PNG, JPG, WEBP – max 5 Mo
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Images contenu */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Images du contenu (Optionnel – Multiple)
                </label>
                <div className="
                  border-2 border-dashed rounded-xl p-6
                  border-gray-300 dark:border-gray-600
                  hover:border-blue-400 dark:hover:border-blue-500 transition
                ">
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
                    <div className="text-center py-8">
                      <FaImage className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-3" />
                      <p className="text-base font-medium text-gray-600 dark:text-gray-300">
                        Cliquez pour ajouter des images
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Plusieurs images possibles
                      </p>
                    </div>
                  </label>
                </div>

                {/* Preview images contenu */}
                {previewImages.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {previewImages.map((preview, index) => (
                      <div
                        key={index}
                        className="
                          relative group rounded-lg overflow-hidden
                          border border-gray-200 dark:border-gray-700
                          shadow-sm hover:shadow-md transition-shadow
                        "
                      >
                        <img
                          src={preview}
                          alt={`Image ${index + 1}`}
                          className="w-full h-40 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImageContenu(index)}
                          className="
                            absolute top-2 right-2 bg-red-600 text-white 
                            rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity
                          "
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date & Statut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Date de publication <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date_publication}
                    onChange={(e) => setFormData({ ...formData, date_publication: e.target.value })}
                    className="
                      w-full px-4 py-3 text-base
                      border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                      bg-white dark:bg-gray-800
                      border-gray-300 dark:border-gray-600
                      text-gray-900 dark:text-gray-100
                      disabled:opacity-60
                    "
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Statut
                  </label>
                  <div className="flex items-center h-full">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.actif}
                        onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                        className="sr-only peer"
                        disabled={isLoading}
                      />
                      <div className="
                        relative w-12 h-6 bg-gray-300 dark:bg-gray-600 
                        peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                        rounded-full peer after:content-[''] after:absolute 
                        after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
                        after:border after:rounded-full after:h-5 after:w-5 
                        after:transition-all peer-checked:bg-blue-600 
                        peer-checked:after:translate-x-full peer-checked:after:border-white
                      "></div>
                      <span className="ml-4 text-base font-medium text-gray-700 dark:text-gray-300">
                        {formData.actif ? "Actif" : "Inactif"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isLoading}
                  className="
                    w-full sm:flex-1 px-6 py-3.5 text-base
                    border border-gray-300 dark:border-gray-600
                    text-gray-700 dark:text-gray-300
                    hover:bg-gray-50 dark:hover:bg-gray-700
                    rounded-xl transition disabled:opacity-50 font-medium
                  "
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    w-full sm:flex-1 px-6 py-3.5 text-base
                    bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600
                    text-white rounded-xl transition disabled:opacity-50
                    flex items-center justify-center gap-2.5 font-semibold shadow-sm
                  "
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      {uploadProgress > 0 ? `${uploadProgress}%` : "Traitement..."}
                    </>
                  ) : (
                    <>
                      <FaSave className="w-5 h-5" />
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
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}