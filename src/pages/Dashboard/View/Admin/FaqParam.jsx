import React, { useState, useEffect, useContext } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import faqService from "../../../../services/faq.service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../../../context/ThemeContext";

export default function FaqParam() {
  const [faqs, setFaqs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);

  const [formData, setFormData] = useState({
    question: "",
    reponse: "",
    categorie: "Equivalences",
    ordre: 0,
    actif: true,
  });

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await faqService.getAllFaqs();
      setFaqs(data);
    } catch (error) {
      console.error("Erreur lors du chargement des FAQs:", error);
      toast.error("Impossible de charger les FAQs. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      if (editingFaq) {
        await faqService.updateFaq(editingFaq.id, formData);
        toast.success("FAQ mise à jour avec succès");
      } else {
        await faqService.createFaq(formData);
        toast.success("FAQ créée avec succès");
      }
      await fetchFaqs();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      const errorMessage = editingFaq
        ? "Erreur lors de la mise à jour de la FAQ"
        : "Erreur lors de la création de la FAQ";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (faq) => {
    setFaqToDelete(faq);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!faqToDelete) return;
    try {
      setIsLoading(true);
      await faqService.deleteFaq(faqToDelete.id);
      toast.success("FAQ supprimée avec succès");
      await fetchFaqs();
      setDeleteModalOpen(false);
      setFaqToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de la FAQ");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setFaqToDelete(null);
  };

  const openModal = (faq = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({
        question: faq.question,
        reponse: faq.reponse,
        categorie: faq.categorie,
        ordre: faq.ordre,
        actif: faq.actif,
      });
    } else {
      setEditingFaq(null);
      setFormData({
        question: "",
        reponse: "",
        categorie: "Equivalences",
        ordre: 0,
        actif: true,
      });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
    setError(null);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
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
              Gestion des FAQ
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Gérez les questions fréquemment posées
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
            <FaPlus /> Ajouter une FAQ
          </button>
        </div>

        {/* Loading state */}
        {isLoading && faqs.length === 0 ? (
          <div className="
            bg-white dark:bg-gray-800
            rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700
            p-12 text-center
          ">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-6">
              Chargement des FAQs...
            </p>
          </div>
        ) : (
          /* Liste des FAQs */
          <div className="
            bg-white dark:bg-gray-800
            rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700
            overflow-hidden
          ">
            {faqs.length === 0 ? (
              <div className="text-center py-16 px-6 text-gray-500 dark:text-gray-400">
                <p className="text-lg font-medium">Aucune FAQ disponible</p>
                <p className="text-sm mt-2">
                  Cliquez sur "Ajouter une FAQ" pour commencer
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Question */}
                        <div
                          onClick={() => toggleExpand(faq.id)}
                          className="flex items-start gap-3 cursor-pointer group"
                        >
                          <div className="
                            flex-shrink-0 w-8 h-8 rounded-lg
                            bg-blue-50 dark:bg-blue-900/30
                            flex items-center justify-center text-blue-600 dark:text-blue-400
                            group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition
                          ">
                            {expandedId === faq.id ? (
                              <FaChevronUp size={14} />
                            ) : (
                              <FaChevronDown size={14} />
                            )}
                          </div>
                          <h3 className="
                            text-base sm:text-lg font-semibold
                            text-gray-900 dark:text-gray-100
                            group-hover:text-blue-600 dark:group-hover:text-blue-400
                            transition break-words
                          ">
                            {faq.question}
                          </h3>
                        </div>

                        {/* Réponse */}
                        <div
                          className={`
                            overflow-hidden transition-all duration-300
                            ${expandedId === faq.id
                              ? "max-h-[500px] opacity-100 mt-4 ml-11"
                              : "max-h-0 opacity-0"}
                          `}
                        >
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed break-words">
                            {faq.reponse}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-4 text-xs sm:text-sm">
                            <span className="
                              px-3 py-1
                              bg-blue-50 dark:bg-blue-900/30
                              text-blue-700 dark:text-blue-300
                              rounded-md font-medium
                            ">
                              {faq.categorie}
                            </span>
                            {!faq.actif && (
                              <span className="
                                px-3 py-1
                                bg-gray-100 dark:bg-gray-700
                                text-gray-600 dark:text-gray-300
                                rounded-md font-medium
                              ">
                                Inactif
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0 sm:self-start">
                        <button
                          onClick={() => openModal(faq)}
                          disabled={isLoading}
                          className="
                            p-2.5 rounded-lg
                            text-blue-600 dark:text-blue-400
                            hover:bg-blue-50 dark:hover:bg-blue-900/30
                            transition disabled:opacity-50
                          "
                          title="Modifier"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(faq)}
                          disabled={isLoading}
                          className="
                            p-2.5 rounded-lg
                            text-red-600 dark:text-red-400
                            hover:bg-red-50 dark:hover:bg-red-900/30
                            transition disabled:opacity-50
                          "
                          title="Supprimer"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {deleteModalOpen && faqToDelete && (
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
              Voulez-vous vraiment supprimer cette FAQ ? Cette action est irréversible.
            </p>
            <div className="
              bg-gray-50 dark:bg-gray-700/50
              rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700
            ">
              <p className="font-medium text-gray-900 dark:text-gray-100 break-words">
                {faqToDelete.question}
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
            rounded-2xl shadow-2xl max-w-2xl w-full my-8
            border border-gray-200 dark:border-gray-700
          ">
            {/* Header */}
            <div className="
              sticky top-0 z-10 bg-white dark:bg-gray-800
              border-b border-gray-200 dark:border-gray-700
              px-6 py-5 flex justify-between items-center rounded-t-2xl
            ">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {editingFaq ? "Modifier la FAQ" : "Nouvelle FAQ"}
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

            {/* Formulaire */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6 max-h-[calc(100vh-14rem)] overflow-y-auto"
            >
              {/* Question */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="
                    w-full px-4 py-3 text-base
                    border border-gray-300 dark:border-gray-600
                    rounded-xl bg-white dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    placeholder-gray-400 dark:placeholder-gray-500
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                    disabled:opacity-60
                  "
                  placeholder="Ex: Quels sont les dossiers requis ?"
                  required
                  disabled={isLoading}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  {formData.question.length}/500 caractères
                </p>
              </div>

              {/* Réponse */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Réponse <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.reponse}
                  onChange={(e) => setFormData({ ...formData, reponse: e.target.value })}
                  className="
                    w-full px-4 py-3 text-base
                    border border-gray-300 dark:border-gray-600
                    rounded-xl bg-white dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    placeholder-gray-400 dark:placeholder-gray-500
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                    resize-none disabled:opacity-60
                  "
                  rows="6"
                  placeholder="Rédigez la réponse détaillée..."
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.categorie}
                  onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                  className="
                    w-full px-4 py-3 text-base
                    border border-gray-300 dark:border-gray-600
                    rounded-xl bg-white dark:bg-gray-800
                    text-gray-900 dark:text-gray-100
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                    disabled:opacity-60
                  "
                  disabled={isLoading}
                  required
                >
                  <option value="Equivalences">Equivalences</option>
                  <option value="Accréditation">Accréditation</option>
                  <option value="Habilitation">Habilitation</option>
                </select>
              </div>

              {/* Boutons */}
              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isLoading}
                  className="
                    w-full sm:flex-1 px-6 py-3 text-base
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
                    w-full sm:flex-1 px-6 py-3 text-base
                    bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600
                    text-white rounded-xl transition disabled:opacity-50
                    flex items-center justify-center gap-2 font-medium
                  "
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      <FaSave /> {editingFaq ? "Mettre à jour" : "Créer"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Animation */}
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