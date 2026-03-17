import React, { useState, useRef } from "react";
import {
  FaSearch,
  FaPlus,
  FaTimes,
  FaFileAlt,
  FaUpload,
  FaChevronLeft,
  FaChevronRight,
  FaTrashAlt,
  FaEye,
  FaDownload,
  FaFilePdf,
  FaEdit,
  FaExclamationTriangle,
} from "react-icons/fa";

import inspectionControleService from "../../../../services/inspectionControle.service";
import { toast } from "react-toastify"; // Optional, assumes react-toastify is available or can be added for notifications

export default function InspectionControleIES() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const initialFormState = {
    date: "",
    universite: "",
    adresse: "",
    typeInspection: "",
    responsable: "",
    statut: "Prévue",
    problemes: "",
    recommandations: "",
    etapes: "",
    commentaires: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await inspectionControleService.getAllInspections();
      setData(res);
    } catch (error) {
      console.error("Erreur lors de la récupération des inspections", error);
    } finally {
      setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const MAX_FILE_SIZE = 8 * 1024 * 1024;
  const MAX_FILES = 10;
  const ALLOWED_TYPES = [
    "application/pdf", "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg", "image/png", "image/jpg",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFileError("");
    let validFiles = [];
    let errorMsg = "";

    if (files.length + selectedFiles.length > MAX_FILES) {
      errorMsg = `Vous ne pouvez pas uploader plus de ${MAX_FILES} fichiers.`;
    } else {
      selectedFiles.forEach((file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
          errorMsg = "Format non autorisé (PDF, DOCX, XLSX, Images uniquement).";
        } else if (file.size > MAX_FILE_SIZE) {
          errorMsg = `Le fichier ${file.name} dépasse la limite de 8 Mo.`;
        } else {
          validFiles.push(file);
        }
      });
    }

    if (errorMsg) setFileError(errorMsg);
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("date", formData.date);
      formDataToSend.append("universite", formData.universite);
      formDataToSend.append("adresse", formData.adresse);
      formDataToSend.append("type", formData.typeInspection);
      formDataToSend.append("responsable", formData.responsable);
      formDataToSend.append("statut", formData.statut);
      formDataToSend.append("problemes", formData.problemes);
      formDataToSend.append("recommandations", formData.recommandations);
      formDataToSend.append("etapes", formData.etapes);
      formDataToSend.append("commentaires", formData.commentaires);
      
      files.forEach((file) => {
        formDataToSend.append("files", file);
      });

      await inspectionControleService.createInspection(formDataToSend);
      await fetchData(); // Refresh data
      toast.success("Inspection créée avec succès !");
      setIsModalOpen(false);
      setFormData(initialFormState);
      setFiles([]);
    } catch (error) {
      console.error("Erreur post", error);
      toast.error("Erreur lors de la création de l'inspection.");
    }
  };

  const handleEditClick = (item) => {
    setFormData({
      date: item.date,
      universite: item.universite,
      adresse: item.adresse,
      typeInspection: item.type,
      responsable: item.responsable,
      statut: item.statut,
      problemes: item.problemes,
      recommandations: item.recommandations,
      etapes: item.etapes,
      commentaires: item.commentaires,
    });
    setEditItem(item);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("date", formData.date);
      formDataToSend.append("universite", formData.universite);
      formDataToSend.append("adresse", formData.adresse);
      formDataToSend.append("type", formData.typeInspection);
      formDataToSend.append("responsable", formData.responsable);
      formDataToSend.append("statut", formData.statut);
      formDataToSend.append("problemes", formData.problemes);
      formDataToSend.append("recommandations", formData.recommandations);
      formDataToSend.append("etapes", formData.etapes);
      formDataToSend.append("commentaires", formData.commentaires);
      
      files.forEach((file) => {
        formDataToSend.append("files", file);
      });

      await inspectionControleService.updateInspection(editItem.id, formDataToSend);
      await fetchData();
      toast.success("Inspection modifiée avec succès !");
      setEditItem(null);
      setFormData(initialFormState);
      setFiles([]);
    } catch (error) {
      console.error("Erreur put", error);
      console.error("===== ERREUR DETAILS =====", error.response?.data);
      toast.error("Erreur lors de la modification de l'inspection.");
    }
  };

  const confirmDelete = async () => {
    try {
      await inspectionControleService.deleteInspection(deleteItem.id);
      await fetchData();
      toast.success("Inspection supprimée avec succès !");
      setDeleteItem(null);
    } catch (error) {
      console.error("Erreur delete", error);
      toast.error("Erreur lors de la suppression de l'inspection.");
    }
  };

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.universite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());

    const itemDate = new Date(item.date);
    const start = dateStart ? new Date(dateStart) : null;
    const end = dateEnd ? new Date(dateEnd) : null;

    let matchesDate = true;
    if (start && end) matchesDate = itemDate >= start && itemDate <= end;
    else if (start) matchesDate = itemDate >= start;
    else if (end) matchesDate = itemDate <= end;

    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusColor = (statut) => {
    switch (statut) {
      case "Achevée": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "En cours": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default: return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* HEADER — bordure supprimée */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inspections & Contrôles</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gérez les inspections de performance des IES</p>
        </div>
        <button
          onClick={() => { setFormData(initialFormState); setFiles([]); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <FaPlus /> Nouvelle Inspection
        </button>
      </div>

      {/* FILTRES ET TABLEAU — bordure supprimée */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl transition-colors duration-300">

        {/* FILTRES */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par université ou type..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Du</span>
            <input
              type="date" value={dateStart}
              onChange={(e) => { setDateStart(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">au</span>
            <input
              type="date" value={dateEnd}
              onChange={(e) => { setDateEnd(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* TABLEAU */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400">
                <th className="px-4 py-3 font-semibold text-center">Date</th>
                <th className="px-4 py-3 font-semibold text-center">Université</th>
                <th className="px-4 py-3 font-semibold text-center">Type & Responsable</th>
                <th className="px-4 py-3 font-semibold text-center">Statut</th>
                <th className="px-4 py-3 font-semibold text-center">Rapports</th>
                <th className="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                 <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      Chargement des inspections...
                    </td>
                 </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 text-center">{item.date}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{item.universite}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.adresse}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="text-sm text-gray-900 dark:text-gray-200">{item.type}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.responsable}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.statut)}`}>
                        {item.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                        <FaFileAlt className="text-gray-400" />
                        {Array.isArray(item.rapports) && item.rapports.length > 0 ? `${item.rapports.length} fichier(s)` : "Aucun"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setViewItem(item)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors" title="Visualiser">
                          <FaEye className="text-base" />
                        </button>
                        <button onClick={() => handleEditClick(item)}
                          className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 p-2 rounded-full hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors" title="Modifier">
                          <FaEdit className="text-base" />
                        </button>
                        <button onClick={() => setDeleteItem(item)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full hover:bg-red-50 dark:hover:bg-gray-700 transition-colors" title="Supprimer">
                          <FaTrashAlt className="text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    Aucune inspection trouvée pour ces critères.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredData.length)} sur {filteredData.length}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <FaChevronLeft />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem] text-center">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL AJOUT ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ajouter une Inspection</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <form id="inspectionForm" onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2">Informations de base</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date <span className="text-red-500">*</span></label>
                      <input type="date" name="date" required onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Université <span className="text-red-500">*</span></label>
                      <input type="text" name="universite" required placeholder="Ex: Université de la ville..." onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse <span className="text-red-500">*</span></label>
                    <input type="text" name="adresse" required placeholder="Lieu complet (Rue, Ville, Code postal)" onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type d'inspection <span className="text-red-500">*</span></label>
                      <input type="text" name="typeInspection" required placeholder="Ex: Audit financier, Contrôle qualité..." onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut <span className="text-red-500">*</span></label>
                      <select name="statut" value={formData.statut} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option value="Prévue">Prévue</option>
                        <option value="En cours">En cours</option>
                        <option value="Achevée">Achevée</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-full w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Responsable(s) <span className="text-red-500">*</span></label>
                    <input type="text" name="responsable" required placeholder="Nom complet du responsable ou de l'équipe" onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2 mt-4">Observations & Rapports</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Problèmes observés <span className="text-red-500">*</span></label>
                    <textarea name="problemes" required rows="3" placeholder="Décrire les problèmes majeurs rencontrés..." onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none custom-scrollbar"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recommandations <span className="text-red-500">*</span></label>
                    <textarea name="recommandations" required rows="3" placeholder="Solutions ou améliorations suggérées..." onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none custom-scrollbar"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rapport (Optionnel, Max 10 fichiers, 8Mo/fich)</label>
                    <div className="mt-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl px-6 py-6 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800/80 text-center cursor-pointer" onClick={() => fileInputRef.current.click()}>
                      <FaUpload className="mx-auto text-3xl text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">Cliquez ou glissez-déposez pour uploader le(s) rapport(s).</p>
                      <p className="text-xs text-gray-500 mt-1">Formats acceptés : PDF, DOCX, XLSX, JPG, PNG.</p>
                      <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" />
                    </div>
                    {fileError && <p className="text-red-500 text-xs mt-2 font-medium">{fileError}</p>}
                    {files.length > 0 && (
                      <ul className="mt-3 space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                        {files.map((file, idx) => (
                          <li key={idx} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-sm border border-blue-100 dark:border-blue-800/30">
                            <span className="truncate flex-1 pr-2">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} Mo)</span>
                            <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700 p-1"><FaTrashAlt /></button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2 mt-4">Suivi</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prochaines étapes <span className="text-red-500">*</span></label>
                    <input type="text" name="etapes" required placeholder="Ex: Planifier une nouvelle visite dans 6 mois..." onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Commentaires divers <span className="text-red-500">*</span></label>
                    <textarea name="commentaires" required rows="4" placeholder="Ajoutez tout autre commentaire, remarque..." onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none custom-scrollbar"></textarea>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors">Annuler</button>
              <button type="submit" form="inspectionForm" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md transition-colors">Enregistrer l'inspection</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL MODIFICATION ================= */}
      {editItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Modifier l'Inspection</h2>
              <button onClick={() => setEditItem(null)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <form id="editForm" onSubmit={handleEditSubmit} className="space-y-8 max-w-3xl mx-auto">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2">Informations de base</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date <span className="text-red-500">*</span></label>
                      <input type="date" name="date" value={formData.date} required onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Université <span className="text-red-500">*</span></label>
                      <input type="text" name="universite" value={formData.universite} required onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse <span className="text-red-500">*</span></label>
                    <input type="text" name="adresse" value={formData.adresse} required onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type d'inspection <span className="text-red-500">*</span></label>
                      <input type="text" name="typeInspection" value={formData.typeInspection} required onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statut <span className="text-red-500">*</span></label>
                      <select name="statut" value={formData.statut} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option value="Prévue">Prévue</option>
                        <option value="En cours">En cours</option>
                        <option value="Achevée">Achevée</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-full w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Responsable(s) <span className="text-red-500">*</span></label>
                    <input type="text" name="responsable" value={formData.responsable} required onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2 mt-4">Observations & Rapports</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Problèmes observés <span className="text-red-500">*</span></label>
                    <textarea name="problemes" value={formData.problemes} required rows="3" onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none custom-scrollbar"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recommandations <span className="text-red-500">*</span></label>
                    <textarea name="recommandations" value={formData.recommandations} required rows="3" onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none custom-scrollbar"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ajouter de nouveaux rapports</label>
                    <div className="mt-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl px-6 py-6 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800/80 text-center cursor-pointer" onClick={() => fileInputRef.current.click()}>
                      <FaUpload className="mx-auto text-3xl text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">Cliquez ou glissez-déposez pour uploader.</p>
                      <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" />
                    </div>
                    {fileError && <p className="text-red-500 text-xs mt-2 font-medium">{fileError}</p>}
                    {files.length > 0 && (
                      <ul className="mt-3 space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                        {files.map((file, idx) => (
                          <li key={idx} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-sm border border-blue-100 dark:border-blue-800/30">
                            <span className="truncate flex-1 pr-2">{file.name}</span>
                            <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700 p-1"><FaTrashAlt /></button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2 mt-4">Suivi</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prochaines étapes <span className="text-red-500">*</span></label>
                    <input type="text" name="etapes" value={formData.etapes} required onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Commentaires divers <span className="text-red-500">*</span></label>
                    <textarea name="commentaires" value={formData.commentaires} required rows="4" onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none custom-scrollbar"></textarea>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
              <button type="button" onClick={() => setEditItem(null)} className="px-5 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors">Annuler</button>
              <button type="submit" form="editForm" className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-medium shadow-md transition-colors">Enregistrer les modifications</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL SUPPRESSION ================= */}
      {deleteItem && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-3xl text-red-600 dark:text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Supprimer l'inspection ?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer l'inspection de l'<strong>{deleteItem.universite}</strong> du {deleteItem.date} ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteItem(null)} className="px-5 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors">
                Annuler
              </button>
              <button onClick={confirmDelete} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors">
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL VISUALISATION ================= */}
      {viewItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Détails de l'inspection</h2>
              <button onClick={() => setViewItem(null)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Université</p><p className="text-sm font-semibold text-gray-900 dark:text-white">{viewItem.universite}</p></div>
                  <div><p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Date</p><p className="text-sm font-semibold text-gray-900 dark:text-white">{viewItem.date}</p></div>
                  <div><p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Adresse</p><p className="text-sm font-semibold text-gray-900 dark:text-white">{viewItem.adresse}</p></div>
                  <div><p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Responsable</p><p className="text-sm font-semibold text-gray-900 dark:text-white">{viewItem.responsable}</p></div>
                  <div><p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Type d'inspection</p><p className="text-sm font-semibold text-gray-900 dark:text-white">{viewItem.type}</p></div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Statut</p>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(viewItem.statut)}`}>{viewItem.statut}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">Problèmes observés</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{viewItem.problemes}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">Recommandations</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{viewItem.recommandations}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">Prochaines étapes</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{viewItem.etapes}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">Commentaires divers</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{viewItem.commentaires}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">Rapports & Pièces jointes</h4>
                {Array.isArray(viewItem.rapports) && viewItem.rapports.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {viewItem.rapports.map((rapport, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FaFilePdf className="text-red-500 text-xl flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate" title={rapport.original_name}>
                             {rapport.original_name || `Document_${idx + 1}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <a href={rapport.file_path && rapport.file_path.startsWith('/') ? `http://localhost:8000${rapport.file_path}` : `http://localhost:8000/${rapport.file_path}`} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 transition-colors" title="Visualiser">
                            <FaEye />
                          </a>
                          <a href={rapport.file_path && rapport.file_path.startsWith('/') ? `http://localhost:8000${rapport.file_path}` : `http://localhost:8000/${rapport.file_path}`} download={rapport.original_name} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 transition-colors" title="Télécharger">
                            <FaDownload />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">Aucun document attaché.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
