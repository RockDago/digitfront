import React, { useState, useEffect } from "react";
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

export default function FaqParam() {
  const [faqs, setFaqs] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);

  // Initialisation avec des valeurs par défaut fixes pour les champs cachés
  const [formData, setFormData] = useState({
    question: "",
    reponse: "",
    categorie: "Equivalences",
    ordre: 0,
    actif: true,
  });

  // Charger les FAQs depuis l'API
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
        toast.success("FAQ mise à jour avec succès", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        await faqService.createFaq(formData);
        toast.success("FAQ créée avec succès", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      await fetchFaqs();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      const errorMessage = editingFaq
        ? "Erreur lors de la mise à jour de la FAQ"
        : "Erreur lors de la création de la FAQ";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
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

      toast.success("FAQ supprimée avec succès", {
        position: "top-right",
        autoClose: 3000,
      });

      await fetchFaqs();
      setDeleteModalOpen(false);
      setFaqToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de la FAQ", {
        position: "top-right",
        autoClose: 4000,
      });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Toast Container */}
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
              Gestion des FAQ
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Gérez les questions fréquemment posées
            </p>
          </div>
          <button
            onClick={() => openModal()}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-base font-medium"
          >
            <FaPlus className="text-sm" /> Ajouter une FAQ
          </button>
        </div>

        {/* Loading state */}
        {isLoading && faqs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 sm:p-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4 text-sm sm:text-base">
              Chargement des FAQs...
            </p>
          </div>
        ) : (
          /* Liste des FAQs */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {faqs.length === 0 ? (
              <div className="text-center py-12 sm:py-16 px-4 text-gray-400">
                <p className="text-base sm:text-lg font-medium">
                  Aucune FAQ disponible
                </p>
                <p className="text-xs sm:text-sm mt-2">
                  Cliquez sur "Ajouter une FAQ" pour commencer
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-3 sm:p-4 lg:p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Question */}
                        <div
                          onClick={() => toggleExpand(faq.id)}
                          className="flex items-start gap-2 sm:gap-3 cursor-pointer group"
                        >
                          <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition mt-0.5">
                            {expandedId === faq.id ? (
                              <FaChevronUp
                                size={12}
                                className="sm:w-3.5 sm:h-3.5"
                              />
                            ) : (
                              <FaChevronDown
                                size={12}
                                className="sm:w-3.5 sm:h-3.5"
                              />
                            )}
                          </div>
                          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition break-words">
                            {faq.question}
                          </h3>
                        </div>

                        {/* Réponse (expandable) */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            expandedId === faq.id
                              ? "max-h-96 opacity-100 mt-3 sm:mt-4 ml-9 sm:ml-11"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <p className="text-sm sm:text-base text-gray-600 leading-relaxed break-words">
                            {faq.reponse}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3 text-xs sm:text-sm">
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
                              {faq.categorie}
                            </span>
                            {!faq.actif && (
                              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">
                                Inactif
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 sm:gap-2 flex-shrink-0 sm:self-start">
                        <button
                          onClick={() => openModal(faq)}
                          disabled={isLoading}
                          className="p-2 sm:p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Modifier"
                        >
                          <FaEdit size={16} className="sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(faq)}
                          disabled={isLoading}
                          className="p-2 sm:p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Supprimer"
                        >
                          <FaTrash size={16} className="sm:w-4 sm:h-4" />
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
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 sm:p-6 animate-scale-in">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
              Confirmer la suppression
            </h3>

            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Voulez-vous vraiment supprimer cette FAQ ? Cette action est
              irréversible.
            </p>

            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-5 sm:mb-6 border border-gray-200">
              <p className="font-medium text-gray-900 text-sm sm:text-base break-words">
                {faqToDelete.question}
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
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8 animate-scale-in">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {editingFaq ? "Modifier la FAQ" : "Nouvelle FAQ"}
              </h2>
              <button
                onClick={closeModal}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaTimes size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[calc(100vh-12rem)] overflow-y-auto"
            >
              {/* Question */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Ex: Quels sont les dossiers requis ?"
                  required
                  disabled={isLoading}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  {formData.question.length}/500 caractères
                </p>
              </div>

              {/* Réponse */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Réponse <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.reponse}
                  onChange={(e) =>
                    setFormData({ ...formData, reponse: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  rows="5"
                  placeholder="Rédigez la réponse détaillée..."
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.categorie}
                  onChange={(e) =>
                    setFormData({ ...formData, categorie: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  disabled={isLoading}
                  required
                >
                  <option value="Equivalences">Equivalences</option>
                  <option value="Accréditation">Accréditation</option>
                  <option value="Habilitation">Habilitation</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isLoading}
                  className="w-full sm:flex-1 px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:flex-1 px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
