import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MesInformationsHabilitation = () => {
  // États pour la gestion des données
  const [formData, setFormData] = useState({
    institution: '',
    typeInstitution: '',
    region: '',
    adresseExacte: '',
    domaine: '',
    mention: '',
    grade: '',
    specification: '',
    arreteHabilitation: '',
    dateArrete: '',
    dateExpirationArrete: '' // Calculée automatiquement
  });

  // États pour les habilitations existantes
  const [existingHabilitations, setExistingHabilitations] = useState([]);
  const [hasExistingData, setHasExistingData] = useState(false);

  // État pour la modal (Desktop/Tablette)
  const [showModal, setShowModal] = useState(false);

  // État pour la page d'édition (Mobile)
  const [showEditPage, setShowEditPage] = useState(false);

  // État pour la dialog de suppression
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Options pour les sélecteurs
  const typeInstitutionOptions = [
    'Publique',
    'Privée'
  ];

  const regionOptions = [
    'Alaotra Mangoro',
    'Ambatosoa',
    'Amoron\'i Mania',
    'Analamanga',
    'Analanjirofo',
    'Androy',
    'Anosy',
    'Atsimo Andrefana',
    'Atsimo Atsinanana',
    'Atsinanana',
    'Betsiboka',
    'Boeny',
    'Bongolava',
    'Diana',
    'Fitovinany',
    'Haute Matsiatra',
    'Ihorombe',
    'Itasy',
    'Melaky',
    'Menabe',
    'Sava',
    'Sofia',
    'Vakinankaratra',
    'Vatovavy'
  ];

  const gradeOptions = [
    'DU',
    'DTS',
    'Licence',
    'Master',
    'Doctorat'
  ];

  const specificationOptions = [
    'PROFESSIONNEL',
    'INDIFFERENCIE',
    'RECHERCHE'
  ];

  // Fonction pour calculer la date d'expiration (5 ans après la date de l'arrêté)
  const calculateExpirationDate = (dateArrete) => {
    if (!dateArrete) return '';
    
    const date = new Date(dateArrete);
    date.setFullYear(date.getFullYear() + 5);
    
    // Formater en YYYY-MM-DD pour l'input date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Charger les données existantes
  useEffect(() => {
    const savedData = localStorage.getItem('habilitationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        setExistingHabilitations([parsedData]);
        setHasExistingData(true);
      } catch (error) {
        setExistingHabilitations([]);
        setHasExistingData(false);
        toast.error('Erreur lors du chargement des données sauvegardées');
      }
    } else {
      setExistingHabilitations([]);
      setHasExistingData(false);
    }
  }, []);

  // Gestion des changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Si la date de l'arrêté change, recalculer automatiquement la date d'expiration
    if (name === 'dateArrete') {
      const dateExpirationArrete = calculateExpirationDate(value);
      setFormData({
        ...formData,
        [name]: value,
        dateExpirationArrete: dateExpirationArrete
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // S'assurer que la date d'expiration est calculée si elle n'est pas déjà présente
      const habilitationData = {
        ...formData,
        id: Date.now()
      };
      
      // Si la date d'expiration n'est pas définie mais la date d'arrêté l'est, la calculer
      if (!habilitationData.dateExpirationArrete && habilitationData.dateArrete) {
        habilitationData.dateExpirationArrete = calculateExpirationDate(habilitationData.dateArrete);
      }
      
      localStorage.setItem('habilitationData', JSON.stringify(habilitationData));
      setExistingHabilitations([habilitationData]);
      setHasExistingData(true);
      
      // Fermer selon le device
      if (window.innerWidth < 768) {
        setShowEditPage(false);
      } else {
        setShowModal(false);
      }
      
      toast.success('Informations d\'habilitation enregistrées avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast.error('Une erreur est survenue lors de l\'enregistrement');
    }
  };

  // Ouvrir l'édition (device-specific)
  const openEdit = () => {
    if (existingHabilitations.length > 0) {
      setFormData(existingHabilitations[0]);
    }
    
    if (window.innerWidth < 768) {
      // Mobile: afficher une nouvelle page
      setShowEditPage(true);
    } else {
      // Desktop/Tablette: afficher modal
      setShowModal(true);
    }
  };

  // Ouvrir l'ajout (nouvelle habilitation)
  const openAdd = () => {
    setFormData({
      institution: '',
      typeInstitution: '',
      region: '',
      adresseExacte: '',
      domaine: '',
      mention: '',
      grade: '',
      specification: '',
      arreteHabilitation: '',
      dateArrete: '',
      dateExpirationArrete: '' // Sera calculée automatiquement
    });
    
    if (window.innerWidth < 768) {
      setShowEditPage(true);
    } else {
      setShowModal(true);
    }
  };

  // Fermer l'édition mobile
  const closeEditPage = () => {
    setShowEditPage(false);
  };

  // Fermer la modal desktop/tablette
  const closeModal = () => {
    setShowModal(false);
  };

  // Ouvrir la dialog de suppression
  const openDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  // Fermer la dialog de suppression
  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  // Supprimer les données (après confirmation)
  const handleDelete = () => {
    closeDeleteDialog();
    try {
      localStorage.removeItem('habilitationData');
      setExistingHabilitations([]);
      setHasExistingData(false);
      toast.success('Informations supprimées avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression des informations');
    }
  };

  // Calcul du statut d'expiration
  const getExpirationStatus = (expirationDate) => {
    if (!expirationDate) return null;
    
    const today = new Date();
    const expDate = new Date(expirationDate);
    const timeDiff = expDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
      return { text: 'Expirée', color: 'bg-red-100 text-red-800' };
    } else if (daysDiff < 90) {
      return { text: 'À renouveler', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { text: 'Valide', color: 'bg-green-100 text-green-800' };
    }
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Dialog de suppression personnalisé
  const DeleteConfirmationDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-[60]">
      <div className="bg-white rounded-lg sm:rounded-xl border border-slate-100 w-full max-w-sm mx-2 sm:mx-4">
        <div className="p-4 sm:p-5">
          {/* Icône d'avertissement */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.942-.833-2.712 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 text-center mb-2 sm:mb-3">
            Confirmation
          </h3>
          <p className="text-slate-600 text-center text-sm mb-4 sm:mb-5">
            Êtes-vous sûr de vouloir supprimer ces informations ?
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={closeDeleteDialog}
              className="flex-1 py-2.5 sm:py-3 text-sm sm:text-sm border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-2.5 sm:py-3 text-sm sm:text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Page principale - Affichage des informations
  const MainPage = () => (
    <div className="min-h-screen bg-white w-full">
      {/* Header avec bordure noire de séparation */}
      <div className="bg-white border-b border-slate-900/10 sticky top-0 z-30">
        <div className="w-full px-2 sm:px-3 py-2.5">
          <div>
            <h1 className="text-sm sm:text-base font-semibold text-slate-900 mb-0.5">
              Mes Informations d'Habilitation
            </h1>
            <p className="text-xs text-slate-500">
              Gérez les informations d'habilitation de votre institution.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-2 sm:px-3 py-3">
        <div className="space-y-3 sm:space-y-4">
          {/* Section avec boutons d'action en haut */}
          <div className="bg-white rounded-lg border border-slate-100 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-5">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Vos habilitations
                </h2>
                <p className="text-xs sm:text-xs text-slate-500 mt-0.5">
                  {hasExistingData ? '1 habilitation(s)' : 'Aucune habilitation enregistrée'}
                </p>
              </div>
              
              {/* Bouton Ajouter - Visible seulement si pas de données */}
              {!hasExistingData && (
                <button
                  onClick={openAdd}
                  className="mt-3 sm:mt-0 w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center justify-center text-sm"
                  aria-label="Ajouter des informations"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter
                </button>
              )}
            </div>

            {/* Affichage des habilitations */}
            <div className="space-y-3">
              {hasExistingData ? (
                existingHabilitations.map((habilitation) => {
                  const status = getExpirationStatus(habilitation.dateExpirationArrete);
                  
                  return (
                    <div key={habilitation.id} className="space-y-4">
                      {/* Version Mobile (1 colonne) - TOUS LES BOUTONS SONT VISIBLES */}
                      <div className="block sm:hidden">
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                          {/* En-tête avec institution et statut - Mobile */}
                          <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 pr-2">
                                <h3 className="text-sm font-semibold text-slate-900">{habilitation.institution}</h3>
                                <div className="flex items-center mt-0.5">
                                  <span className="text-xs text-slate-600 mr-1.5">{habilitation.typeInstitution}</span>
                                  <span className="text-slate-400 text-xs">•</span>
                                  <span className="text-xs text-slate-600 ml-1.5">{habilitation.region}</span>
                                </div>
                              </div>
                              {status && (
                                <span className={`px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap ${status.color}`}>
                                  {status.text}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Corps - Mobile */}
                          <div className="p-3">
                            <div className="space-y-3">
                              {/* Adresse */}
                              <div>
                                <h4 className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-0.5">Adresse</h4>
                                <p className="text-xs text-slate-900">{habilitation.adresseExacte}</p>
                              </div>
                              
                              {/* Domaine et Mention en grille 2 colonnes */}
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <h4 className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-0.5">Domaine</h4>
                                  <p className="text-xs text-slate-900">{habilitation.domaine}</p>
                                </div>
                                <div>
                                  <h4 className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-0.5">Mention</h4>
                                  <p className="text-xs text-slate-900">{habilitation.mention}</p>
                                </div>
                              </div>
                              
                              {/* Grade et Spécification en grille 2 colonnes */}
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <h4 className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-0.5">Grade</h4>
                                  <p className="text-xs text-slate-900">{habilitation.grade}</p>
                                </div>
                                <div>
                                  <h4 className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-0.5">Spécification</h4>
                                  <p className="text-xs text-slate-900">{habilitation.specification}</p>
                                </div>
                              </div>
                              
                              {/* Arrêté d'habilitation */}
                              <div>
                                <h4 className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-0.5">Arrêté d'habilitation</h4>
                                <p className="text-xs text-slate-900">{habilitation.arreteHabilitation}</p>
                              </div>
                              
                              {/* Dates */}
                              <div className="space-y-2 pt-2 border-t border-slate-100">
                                <div className="flex items-center">
                                  <svg className="h-3.5 w-3.5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <div>
                                    <p className="text-[10px] text-slate-500">Date de l'arrêté</p>
                                    <p className="text-xs text-slate-900 font-medium">{formatDate(habilitation.dateArrete)}</p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <svg className="h-3.5 w-3.5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <div>
                                    <p className="text-[10px] text-slate-500">Date d'expiration</p>
                                    <p className="text-xs text-slate-900 font-medium">{formatDate(habilitation.dateExpirationArrete)}</p>
                                  </div>
                                </div>
                                <div className="text-[10px] text-slate-500 italic bg-slate-50 p-2 rounded">
                                  La date d'expiration est calculée automatiquement (validité de 5 ans à partir de la date de l'arrêté)
                                </div>
                              </div>
                            </div>
                            
                            {/* BOUTONS MODIFIER/SUPPRIMER - VISIBLES EN MOBILE */}
                            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col gap-2">
                              <button
                                onClick={openEdit}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center justify-center text-xs"
                                aria-label="Modifier les informations"
                              >
                                <svg className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier
                              </button>
                              
                              <button
                                onClick={openDeleteDialog}
                                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium flex items-center justify-center text-xs"
                                aria-label="Supprimer les informations"
                              >
                                <svg className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Version Desktop (2 colonnes) */}
                      <div className="hidden sm:block">
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                          {/* En-tête avec institution et statut - Desktop */}
                          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-start">
                            <div>
                              <h3 className="text-base font-semibold text-slate-900">{habilitation.institution}</h3>
                              <div className="flex items-center mt-1">
                                <span className="text-sm text-slate-600 mr-2">{habilitation.typeInstitution}</span>
                                <span className="text-slate-400">•</span>
                                <span className="text-sm text-slate-600 ml-2">{habilitation.region}</span>
                              </div>
                            </div>
                            {status && (
                              <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}>
                                {status.text}
                              </span>
                            )}
                          </div>
                          
                          {/* Corps en 2 colonnes - Desktop */}
                          <div className="p-4">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                              {/* Colonne 1 */}
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Adresse</h4>
                                  <p className="text-sm text-slate-900">{habilitation.adresseExacte}</p>
                                </div>
                                
                                <div>
                                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Domaine</h4>
                                  <p className="text-sm text-slate-900">{habilitation.domaine}</p>
                                </div>
                                
                                <div>
                                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Mention</h4>
                                  <p className="text-sm text-slate-900">{habilitation.mention}</p>
                                </div>
                                
                                <div>
                                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Arrêté d'habilitation</h4>
                                  <p className="text-sm text-slate-900">{habilitation.arreteHabilitation}</p>
                                </div>
                              </div>
                              
                              {/* Colonne 2 */}
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Grade</h4>
                                    <p className="text-sm text-slate-900">{habilitation.grade}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Spécification</h4>
                                    <p className="text-sm text-slate-900">{habilitation.specification}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Date de l'arrêté</h4>
                                  <p className="text-sm text-slate-900">{formatDate(habilitation.dateArrete)}</p>
                                </div>
                                
                                <div>
                                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Date d'expiration</h4>
                                  <p className="text-sm text-slate-900">{formatDate(habilitation.dateExpirationArrete)}</p>
                                </div>
                                
                                <div className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded">
                                  La date d'expiration est calculée automatiquement (validité de 5 ans à partir de la date de l'arrêté)
                                </div>
                              </div>
                            </div>
                            
                            {/* Boutons d'action - Desktop */}
                            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3">
                              <button
                                onClick={openEdit}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center justify-center text-sm"
                                aria-label="Modifier les informations"
                              >
                                <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier
                              </button>
                              
                              <button
                                onClick={openDeleteDialog}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium flex items-center justify-center text-sm"
                                aria-label="Supprimer les informations"
                              >
                                <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Message lorsqu'il n'y a pas d'habilitation
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-3 text-sm font-medium text-slate-900">Aucune habilitation enregistrée</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Commencez par ajouter vos informations d'habilitation.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          {hasExistingData && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 sm:p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Instructions importantes
              </h3>
              <ul className="space-y-1.5 text-xs text-blue-800">
                <li className="flex items-start">
                  <svg className="h-3.5 w-3.5 text-blue-600 mr-1.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Tous les champs marqués d'un astérisque (*) sont obligatoires.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-3.5 w-3.5 text-blue-600 mr-1.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Les informations doivent correspondre exactement à celles figurant sur l'arrêté d'habilitation.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-3.5 w-3.5 text-blue-600 mr-1.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Pour le renouvellement d'habilitation, soumettez votre demande au moins 3 mois avant la date d'expiration.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-3.5 w-3.5 text-blue-600 mr-1.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>La date d'expiration est calculée automatiquement avec une validité de 5 ans à partir de la date de l'arrêté.</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Page d'édition - Mobile
  const EditPage = () => (
    <div className="min-h-screen bg-white w-full">
      {/* Header avec bordure noire de séparation */}
      <div className="bg-white border-b border-slate-900/10 sticky top-0 z-30">
        <div className="w-full px-2 sm:px-3 py-2.5">
          <div className="flex items-center">
            <button
              onClick={closeEditPage}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-2"
              aria-label="Retour"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-sm font-bold text-slate-900">
              {hasExistingData ? 'Modifier' : 'Ajouter'}
            </h1>
          </div>
        </div>
      </div>

      {/* Formulaire d'édition */}
      <form onSubmit={handleSubmit} className="w-full px-2 sm:px-3 py-3">
        <div className="space-y-4 pb-8">
          {/* Informations de l'institution */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-900">Informations de l'institution</h3>
            
            <div className="space-y-3">
              {/* Institution */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Institution ou Établissement *
                </label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="Ex: Université d'Antananarivo"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Type d'institution */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Type d'institution *
                </label>
                <div className="relative">
                  <select
                    name="typeInstitution"
                    value={formData.typeInstitution}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                    required
                  >
                    <option value="">Sélectionner le type</option>
                    {typeInstitutionOptions.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Région */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Région *
                </label>
                <div className="relative">
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                    required
                  >
                    <option value="">Sélectionner une région</option>
                    {regionOptions.map((region, index) => (
                      <option key={index} value={region}>{region}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Adresse exacte *
                </label>
                <input
                  type="text"
                  name="adresseExacte"
                  value={formData.adresseExacte}
                  onChange={handleInputChange}
                  placeholder="Ex: BP 566, Avenue de l'Indépendance, Antananarivo 101"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Informations académiques */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-900">Informations académiques</h3>
            
            <div className="space-y-3">
              {/* Domaine */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Domaine *
                </label>
                <input
                  type="text"
                  name="domaine"
                  value={formData.domaine}
                  onChange={handleInputChange}
                  placeholder="Ex: Sciences et Technologies"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Mention */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Mention *
                </label>
                <input
                  type="text"
                  name="mention"
                  value={formData.mention}
                  onChange={handleInputChange}
                  placeholder="Ex: Informatique Appliquée"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Grade */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Grade *
                </label>
                <div className="relative">
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                    required
                  >
                    <option value="">Sélectionner un grade</option>
                    {gradeOptions.map((grade, index) => (
                      <option key={index} value={grade}>{grade}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Spécification */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Spécification *
                </label>
                <div className="relative">
                  <select
                    name="specification"
                    value={formData.specification}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                    required
                  >
                    <option value="">Sélectionner une spécification</option>
                    {specificationOptions.map((spec, index) => (
                      <option key={index} value={spec}>{spec}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informations de l'arrêté */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-900">Informations de l'arrêté d'habilitation</h3>
            
            <div className="space-y-3">
              {/* Arrêté */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Arrêté d'habilitation *
                </label>
                <input
                  type="text"
                  name="arreteHabilitation"
                  value={formData.arreteHabilitation}
                  onChange={handleInputChange}
                  placeholder="Ex: Arrêté n°12345/2025-MESupRES"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Date Arrêté */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Date de l'arrêté *
                </label>
                <input
                  type="date"
                  name="dateArrete"
                  value={formData.dateArrete}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Date d'expiration - Affichage seulement */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Date d'expiration
                </label>
                <div className="px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-700">
                  {formData.dateExpirationArrete ? (
                    formatDate(formData.dateExpirationArrete)
                  ) : (
                    <span className="text-slate-500 italic text-xs">
                      La date d'expiration sera calculée automatiquement après la saisie de la date de l'arrêté
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 italic mt-0.5">
                  La date d'expiration est calculée automatiquement avec une validité de 5 ans à partir de la date de l'arrêté
                </p>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={closeEditPage}
              className="w-full py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition font-medium text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
            >
              {hasExistingData ? 'Enregistrer les modifications' : 'Ajouter'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  // Modal pour Desktop/Tablette
  const DesktopModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-lg sm:rounded-xl border border-slate-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-4 sm:px-5 py-3 flex justify-between items-center">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">
            {hasExistingData ? 'Modifier les informations' : 'Ajouter une habilitation'}
          </h2>
          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Fermer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {/* Informations de l'institution */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-medium text-slate-900">Informations de l'institution</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Institution */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Institution ou Établissement *
                </label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="Ex: Université d'Antananarivo"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Type d'institution */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Type d'institution *
                </label>
                <div className="relative">
                  <select
                    name="typeInstitution"
                    value={formData.typeInstitution}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                    required
                  >
                    <option value="">Sélectionner le type</option>
                    {typeInstitutionOptions.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Région */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Région *
                </label>
                <div className="relative">
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                    required
                  >
                    <option value="">Sélectionner une région</option>
                    {regionOptions.map((region, index) => (
                      <option key={index} value={region}>{region}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700">
                  Adresse exacte *
                </label>
                <input
                  type="text"
                  name="adresseExacte"
                  value={formData.adresseExacte}
                  onChange={handleInputChange}
                  placeholder="Ex: BP 566, Avenue de l'Indépendance, Antananarivo 101"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Informations académiques */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-medium text-slate-900">Informations académiques</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Domaine */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Domaine *
                </label>
                <input
                  type="text"
                  name="domaine"
                  value={formData.domaine}
                  onChange={handleInputChange}
                  placeholder="Ex: Sciences et Technologies"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Mention */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Mention *
                </label>
                <input
                  type="text"
                  name="mention"
                  value={formData.mention}
                  onChange={handleInputChange}
                  placeholder="Ex: Informatique Appliquée"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Grade */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Grade *
                </label>
                <div className="relative">
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                    required
                  >
                    <option value="">Sélectionner un grade</option>
                    {gradeOptions.map((grade, index) => (
                      <option key={index} value={grade}>{grade}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Spécification */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Spécification *
                </label>
                <div className="relative">
                  <select
                    name="specification"
                    value={formData.specification}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm"
                    required
                  >
                    <option value="">Sélectionner une spécification</option>
                    {specificationOptions.map((spec, index) => (
                      <option key={index} value={spec}>{spec}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informations de l'arrêté */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-medium text-slate-900">Informations de l'arrêté d'habilitation</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Arrêté */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700">
                  Arrêté d'habilitation *
                </label>
                <input
                  type="text"
                  name="arreteHabilitation"
                  value={formData.arreteHabilitation}
                  onChange={handleInputChange}
                  placeholder="Ex: Arrêté n°12345/2025-MESupRES"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Date Arrêté */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Date de l'arrêté *
                </label>
                <input
                  type="date"
                  name="dateArrete"
                  value={formData.dateArrete}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              {/* Date d'expiration - Affichage seulement */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Date d'expiration
                </label>
                <div className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-700">
                  {formData.dateExpirationArrete ? (
                    formatDate(formData.dateExpirationArrete)
                  ) : (
                    <span className="text-slate-500 italic text-xs">
                      La date d'expiration sera calculée automatiquement après la saisie de la date de l'arrêté
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 italic mt-0.5">
                  La date d'expiration est calculée automatiquement avec une validité de 5 ans à partir de la date de l'arrêté
                </p>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-2 sm:gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition font-medium text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
            >
              {hasExistingData ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Rendu conditionnel selon le device et l'état
  return (
    <>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="text-xs sm:text-sm"
        toastClassName="!rounded-lg !shadow-sm !border !border-slate-100"
        bodyClassName="!text-xs sm:!text-sm"
      />
      
      {/* Dialog de suppression */}
      {showDeleteDialog && <DeleteConfirmationDialog />}
      
      {/* Mobile: Page d'édition séparée */}
      {showEditPage && <EditPage />}
      
      {/* Desktop/Tablette: Modal */}
      {showModal && <DesktopModal />}
      
      {/* Page principale (toujours rendue, masquée si on est sur la page d'édition mobile) */}
      {!showEditPage && <MainPage />}
    </>
  );
};

export default MesInformationsHabilitation;