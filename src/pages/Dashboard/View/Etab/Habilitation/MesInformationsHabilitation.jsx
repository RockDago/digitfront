import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../../../../context/ThemeContext";

// ✅ CORRECTION: Composants extraits EN DEHORS du composant parent

const DeleteConfirmationDialog = ({ closeDeleteDialog, handleDelete }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-[60]">
    <div className="bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl border border-slate-100 dark:border-slate-800 w-full max-w-sm mx-2 sm:mx-4">
      <div className="p-4 sm:p-5">
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.942-.833-2.712 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50 text-center mb-2 sm:mb-3">
          Confirmation
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-center text-sm mb-4 sm:mb-5">
          Êtes-vous sûr de vouloir supprimer ces informations ?
        </p>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={closeDeleteDialog}
            className="flex-1 py-2.5 sm:py-3 text-sm border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 py-2.5 sm:py-3 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
);

const MainPage = ({
  hasExistingData,
  existingHabilitations,
  openAdd,
  openEdit,
  openDeleteDialog,
  getExpirationStatus,
  formatDate,
}) => (
  <div className="min-h-screen bg-white dark:bg-gray-950 w-full">
    <div className="bg-white dark:bg-gray-900 border-b border-slate-900/10 dark:border-slate-800 sticky top-0 z-10">
      <div className="w-full px-2 sm:px-3 py-2.5">
        <div>
          <h1 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-50 mb-0.5">
            Mes Informations d'Habilitation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gérez les informations d'habilitation de votre institution.
          </p>
        </div>
      </div>
    </div>

    <div className="w-full px-2 sm:px-3 py-3">
      <div className="space-y-3 sm:space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-5">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-50">
                Vos habilitations
              </h2>
              <p className="text-xs sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {hasExistingData
                  ? "1 habilitation(s)"
                  : "Aucune habilitation enregistrée"}
              </p>
            </div>

            {!hasExistingData && (
              <button
                onClick={openAdd}
                className="mt-3 sm:mt-0 w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center justify-center text-sm"
                aria-label="Ajouter des informations"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Ajouter
              </button>
            )}
          </div>

          <div className="space-y-3">
            {hasExistingData ? (
              existingHabilitations.map((habilitation) => {
                const status = getExpirationStatus(
                  habilitation.dateExpirationArrete,
                );

                return (
                  <div key={habilitation.id} className="space-y-4">
                    {/* Version Mobile */}
                    <div className="block sm:hidden">
                      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 dark:bg-slate-900 px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 pr-2">
                              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                                {habilitation.institution}
                              </h3>
                              <div className="flex items-center mt-0.5">
                                <span className="text-xs text-slate-600 dark:text-slate-300 mr-1.5">
                                  {habilitation.typeInstitution}
                                </span>
                                <span className="text-slate-400 text-xs">
                                  •
                                </span>
                                <span className="text-xs text-slate-600 dark:text-slate-300 ml-1.5">
                                  {habilitation.region}
                                </span>
                              </div>
                            </div>
                            {status && (
                              <span
                                className={`px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap ${status.color}`}
                              >
                                {status.text}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-3 bg-white dark:bg-slate-900">
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                                Adresse
                              </h4>
                              <p className="text-xs text-slate-900 dark:text-slate-100">
                                {habilitation.adresseExacte}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <h4 className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                                  Domaine
                                </h4>
                                <p className="text-xs text-slate-900 dark:text-slate-100">
                                  {habilitation.domaine}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                                  Mention
                                </h4>
                                <p className="text-xs text-slate-900 dark:text-slate-100">
                                  {habilitation.mention}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <h4 className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                                  Grade
                                </h4>
                                <p className="text-xs text-slate-900 dark:text-slate-100">
                                  {habilitation.grade}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                                  Spécification
                                </h4>
                                <p className="text-xs text-slate-900 dark:text-slate-100">
                                  {habilitation.specification}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                                Arrêté d'habilitation
                              </h4>
                              <p className="text-xs text-slate-900 dark:text-slate-100">
                                {habilitation.arreteHabilitation}
                              </p>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                              <div className="flex items-center">
                                <svg
                                  className="h-3.5 w-3.5 text-slate-400 mr-2 flex-shrink-0"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <div>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                    Date de l'arrêté
                                  </p>
                                  <p className="text-xs text-slate-900 dark:text-slate-100 font-medium">
                                    {formatDate(habilitation.dateArrete)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <svg
                                  className="h-3.5 w-3.5 text-slate-400 mr-2 flex-shrink-0"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <div>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                    Date d'expiration
                                  </p>
                                  <p className="text-xs text-slate-900 dark:text-slate-100 font-medium">
                                    {formatDate(
                                      habilitation.dateExpirationArrete,
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900 p-2 rounded">
                                La date d'expiration est calculée
                                automatiquement (validité de 5 ans à partir
                                de la date de l'arrêté)
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                            <button
                              onClick={openEdit}
                              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center justify-center text-xs"
                              aria-label="Modifier les informations"
                            >
                              <svg
                                className="h-3.5 w-3.5 mr-1.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Modifier
                            </button>

                            <button
                              onClick={openDeleteDialog}
                              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium flex items-center justify-center text-xs"
                              aria-label="Supprimer les informations"
                            >
                              <svg
                                className="h-3.5 w-3.5 mr-1.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Version Desktop */}
                    <div className="hidden sm:block">
                      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start">
                          <div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                              {habilitation.institution}
                            </h3>
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-slate-600 dark:text-slate-300 mr-2">
                                {habilitation.typeInstitution}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-sm text-slate-600 dark:text-slate-300 ml-2">
                                {habilitation.region}
                              </span>
                            </div>
                          </div>
                          {status && (
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}
                            >
                              {status.text}
                            </span>
                          )}
                        </div>

                        <div className="p-4 bg-white dark:bg-slate-900">
                          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                  Adresse
                                </h4>
                                <p className="text-sm text-slate-900 dark:text-slate-100">
                                  {habilitation.adresseExacte}
                                </p>
                              </div>

                              <div>
                                <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                  Domaine
                                </h4>
                                <p className="text-sm text-slate-900 dark:text-slate-100">
                                  {habilitation.domaine}
                                </p>
                              </div>

                              <div>
                                <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                  Mention
                                </h4>
                                <p className="text-sm text-slate-900 dark:text-slate-100">
                                  {habilitation.mention}
                                </p>
                              </div>

                              <div>
                                <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                  Arrêté d'habilitation
                                </h4>
                                <p className="text-sm text-slate-900 dark:text-slate-100">
                                  {habilitation.arreteHabilitation}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Grade
                                  </h4>
                                  <p className="text-sm text-slate-900 dark:text-slate-100">
                                    {habilitation.grade}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Spécification
                                  </h4>
                                  <p className="text-sm text-slate-900 dark:text-slate-100">
                                    {habilitation.specification}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                  Date de l'arrêté
                                </h4>
                                <p className="text-sm text-slate-900 dark:text-slate-100">
                                  {formatDate(habilitation.dateArrete)}
                                </p>
                              </div>

                              <div>
                                <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                  Date d'expiration
                                </h4>
                                <p className="text-sm text-slate-900 dark:text-slate-100">
                                  {formatDate(
                                    habilitation.dateExpirationArrete,
                                  )}
                                </p>
                              </div>

                              <div className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900 p-2 rounded">
                                La date d'expiration est calculée
                                automatiquement (validité de 5 ans à partir de la date de l'arrêté)
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                            <button
                              onClick={openEdit}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center justify-center text-sm"
                              aria-label="Modifier les informations"
                            >
                              <svg
                                className="h-4 w-4 mr-1.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Modifier
                            </button>

                            <button
                              onClick={openDeleteDialog}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium flex items-center justify-center text-sm"
                              aria-label="Supprimer les informations"
                            >
                              <svg
                                className="h-4 w-4 mr-1.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
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
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-50">
                  Aucune habilitation enregistrée
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Commencez par ajouter vos informations d'habilitation.
                </p>
              </div>
            )}
          </div>
        </div>

        {hasExistingData && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3 sm:p-4">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
              Instructions importantes
            </h3>
            <ul className="space-y-1.5 text-xs text-blue-800 dark:text-blue-200">
              <li className="flex items-start">
                <svg
                  className="h-3.5 w-3.5 text-blue-600 mr-1.5 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Tous les champs marqués d'un astérisque (*) sont
                  obligatoires.
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-3.5 w-3.5 text-blue-600 mr-1.5 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Les informations doivent correspondre exactement à celles
                  figurant sur l'arrêté d'habilitation.
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-3.5 w-3.5 text-blue-600 mr-1.5 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Pour le renouvellement d'habilitation, soumettez votre
                  demande au moins 3 mois avant la date d'expiration.
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-3.5 w-3.5 text-blue-600 mr-1.5 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  La date d'expiration est calculée automatiquement avec une
                  validité de 5 ans à partir de la date de l'arrêté.
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
);

const EditPage = ({
  formData,
  handleInputChange,
  handleSubmit,
  hasExistingData,
  closeEditPage,
  formatDate,
  typeInstitutionOptions,
  regionOptions,
  gradeOptions,
  specificationOptions,
}) => (
  <div className="min-h-screen bg-white dark:bg-gray-950 w-full">
    <div className="bg-white dark:bg-gray-900 border-b border-slate-900/10 dark:border-slate-800 sticky top-0 z-10">
      <div className="w-full px-2 sm:px-3 py-2.5">
        <div className="flex items-center">
          <button
            onClick={closeEditPage}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-2"
            aria-label="Retour"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="text-sm font-bold text-slate-900 dark:text-slate-50">
            {hasExistingData ? "Modifier" : "Ajouter"}
          </h1>
        </div>
      </div>
    </div>

    <form onSubmit={handleSubmit} className="w-full px-2 sm:px-3 py-3">
      <div className="space-y-4 pb-8">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">
            Informations de l'institution
          </h3>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Institution ou Établissement *
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution || ""}
                onChange={handleInputChange}
                placeholder="Ex: Université d'Antananarivo"
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Type d'institution *
              </label>
              <div className="relative">
                <select
                  name="typeInstitution"
                  value={formData.typeInstitution || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100"
                  required
                >
                  <option value="">Sélectionner le type</option>
                  {typeInstitutionOptions.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Région *
              </label>
              <div className="relative">
                <select
                  name="region"
                  value={formData.region || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100"
                  required
                >
                  <option value="">Sélectionner une région</option>
                  {regionOptions.map((region, index) => (
                    <option key={index} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Adresse exacte *
              </label>
              <input
                type="text"
                name="adresseExacte"
                value={formData.adresseExacte || ""}
                onChange={handleInputChange}
                placeholder="Ex: BP 566, Avenue de l'Indépendance, Antananarivo 101"
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">
            Informations académiques
          </h3>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Domaine *
              </label>
              <input
                type="text"
                name="domaine"
                value={formData.domaine || ""}
                onChange={handleInputChange}
                placeholder="Ex: Sciences et Technologies"
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Mention *
              </label>
              <input
                type="text"
                name="mention"
                value={formData.mention || ""}
                onChange={handleInputChange}
                placeholder="Ex: Informatique Appliquée"
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Grade *
              </label>
              <div className="relative">
                <select
                  name="grade"
                  value={formData.grade || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100"
                  required
                >
                  <option value="">Sélectionner un grade</option>
                  {gradeOptions.map((grade, index) => (
                    <option key={index} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Spécification *
              </label>
              <div className="relative">
                <select
                  name="specification"
                  value={formData.specification || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100"
                  required
                >
                  <option value="">Sélectionner une spécification</option>
                  {specificationOptions.map((spec, index) => (
                    <option key={index} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">
            Informations de l'arrêté d'habilitation
          </h3>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Arrêté d'habilitation *
              </label>
              <input
                type="text"
                name="arreteHabilitation"
                value={formData.arreteHabilitation || ""}
                onChange={handleInputChange}
                placeholder="Ex: Arrêté n°12345/2025-MESupRES"
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Date de l'arrêté *
              </label>
              <input
                type="date"
                name="dateArrete"
                value={formData.dateArrete || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Date d'expiration
              </label>
              <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200">
                {formData.dateExpirationArrete ? (
                  formatDate(formData.dateExpirationArrete)
                ) : (
                  <span className="text-slate-500 dark:text-slate-400 italic text-xs">
                    La date d'expiration sera calculée automatiquement après
                    la saisie de la date de l'arrêté
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-0.5">
                La date d'expiration est calculée automatiquement avec une
                validité de 5 ans à partir de la date de l'arrêté
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={closeEditPage}
            className="w-full py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium text-sm"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
          >
            {hasExistingData
              ? "Enregistrer les modifications"
              : "Ajouter"}
          </button>
        </div>
      </div>
    </form>
  </div>
);

const DesktopModal = ({
  formData,
  handleInputChange,
  handleSubmit,
  hasExistingData,
  closeModal,
  formatDate,
  typeInstitutionOptions,
  regionOptions,
  gradeOptions,
  specificationOptions,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
    <div className="bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl border border-slate-100 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 sm:px-5 py-3 flex justify-between items-center">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50">
          {hasExistingData
            ? "Modifier les informations"
            : "Ajouter une habilitation"}
        </h2>
        <button
          onClick={closeModal}
          className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          aria-label="Fermer"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
        <div className="space-y-3">
          <h3 className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-50">
            Informations de l'institution
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Institution ou Établissement *
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution || ""}
                onChange={handleInputChange}
                placeholder="Ex: Université d'Antananarivo"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Type d'institution *
              </label>
              <div className="relative">
                <select
                  name="typeInstitution"
                  value={formData.typeInstitution || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100"
                  required
                >
                  <option value="">Sélectionner le type</option>
                  {typeInstitutionOptions.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Région *
              </label>
              <div className="relative">
                <select
                  name="region"
                  value={formData.region || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100"
                  required
                >
                  <option value="">Sélectionner une région</option>
                  {regionOptions.map((region, index) => (
                    <option key={index} value={region}>{region}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Adresse exacte *
              </label>
              <input
                type="text"
                name="adresseExacte"
                value={formData.adresseExacte || ""}
                onChange={handleInputChange}
                placeholder="Ex: BP 566, Avenue de l'Indépendance, Antananarivo 101"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-50">
            Informations académiques
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Domaine *
              </label>
              <input
                type="text"
                name="domaine"
                value={formData.domaine || ""}
                onChange={handleInputChange}
                placeholder="Ex: Sciences et Technologies"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Mention *
              </label>
              <input
                type="text"
                name="mention"
                value={formData.mention || ""}
                onChange={handleInputChange}
                placeholder="Ex: Informatique Appliquée"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Grade *
              </label>
              <div className="relative">
                <select
                  name="grade"
                  value={formData.grade || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100"
                  required
                >
                  <option value="">Sélectionner un grade</option>
                  {gradeOptions.map((grade, index) => (
                    <option key={index} value={grade}>{grade}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Spécification *
              </label>
              <div className="relative">
                <select
                  name="specification"
                  value={formData.specification || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100"
                  required
                >
                  <option value="">Sélectionner une spécification</option>
                  {specificationOptions.map((spec, index) => (
                    <option key={index} value={spec}>{spec}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-50">
            Informations de l'arrêté d'habilitation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Arrêté d'habilitation *
              </label>
              <input
                type="text"
                name="arreteHabilitation"
                value={formData.arreteHabilitation || ""}
                onChange={handleInputChange}
                placeholder="Ex: Arrêté n°12345/2025-MESupRES"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Date de l'arrêté *
              </label>
              <input
                type="date"
                name="dateArrete"
                value={formData.dateArrete || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Date d'expiration
              </label>
              <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200">
                {formData.dateExpirationArrete ? (
                  formatDate(formData.dateExpirationArrete)
                ) : (
                  <span className="text-slate-500 dark:text-slate-400 italic text-xs">
                    La date d'expiration sera calculée automatiquement après
                    la saisie de la date de l'arrêté
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-0.5">
                La date d'expiration est calculée automatiquement avec une
                validité de 5 ans à partir de la date de l'arrêté
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 sm:gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium text-sm"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
          >
            {hasExistingData ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

// ✅ Composant principal allégé
const MesInformationsHabilitation = () => {
  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    institution: "",
    typeInstitution: "",
    region: "",
    adresseExacte: "",
    domaine: "",
    mention: "",
    grade: "",
    specification: "",
    arreteHabilitation: "",
    dateArrete: "",
    dateExpirationArrete: "",
  });

  const [existingHabilitations, setExistingHabilitations] = useState([]);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isMounted = useRef(true);

  const typeInstitutionOptions = ["Publique", "Privée"];

  const regionOptions = [
    "Alaotra Mangoro",
    "Ambatosoa",
    "Amoron'i Mania",
    "Analamanga",
    "Analanjirofo",
    "Androy",
    "Anosy",
    "Atsimo Andrefana",
    "Atsimo Atsinanana",
    "Atsinanana",
    "Betsiboka",
    "Boeny",
    "Bongolava",
    "Diana",
    "Fitovinany",
    "Haute Matsiatra",
    "Ihorombe",
    "Itasy",
    "Melaky",
    "Menabe",
    "Sava",
    "Sofia",
    "Vakinankaratra",
    "Vatovavy",
  ];

  const gradeOptions = ["DU", "DTS", "Licence", "Master", "Doctorat"];
  const specificationOptions = ["PROFESSIONNEL", "INDIFFERENCIE", "RECHERCHE"];

  const calculateExpirationDate = useCallback((dateArrete) => {
    if (!dateArrete) return "";
    const date = new Date(dateArrete);
    date.setFullYear(date.getFullYear() + 5);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "dateArrete") {
        return {
          ...prev,
          [name]: value,
          dateExpirationArrete: calculateExpirationDate(value),
        };
      }
      return { ...prev, [name]: value };
    });
  }, [calculateExpirationDate]);

  useEffect(() => {
    isMounted.current = true;
    const savedData = localStorage.getItem("habilitationData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (isMounted.current) {
          setFormData(parsedData);
          setExistingHabilitations([parsedData]);
          setHasExistingData(true);
        }
      } catch (error) {
        if (isMounted.current) {
          setExistingHabilitations([]);
          setHasExistingData(false);
          toast.error("Erreur lors du chargement des données sauvegardées");
        }
      }
    } else {
      if (isMounted.current) {
        setExistingHabilitations([]);
        setHasExistingData(false);
      }
    }
    return () => { isMounted.current = false; };
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      try {
        const habilitationData = { ...formData, id: Date.now() };
        if (!habilitationData.dateExpirationArrete && habilitationData.dateArrete) {
          habilitationData.dateExpirationArrete = calculateExpirationDate(habilitationData.dateArrete);
        }
        localStorage.setItem("habilitationData", JSON.stringify(habilitationData));
        if (isMounted.current) {
          setExistingHabilitations([habilitationData]);
          setHasExistingData(true);
          if (window.innerWidth < 768) {
            setShowEditPage(false);
          } else {
            setShowModal(false);
          }
          toast.success("Informations d'habilitation enregistrées avec succès !");
        }
      } catch (error) {
        console.error("Erreur lors de l'enregistrement:", error);
        if (isMounted.current) {
          toast.error("Une erreur est survenue lors de l'enregistrement");
        }
      }
    },
    [formData, calculateExpirationDate],
  );

  const openEdit = useCallback(() => {
    if (existingHabilitations.length > 0) {
      setFormData(existingHabilitations[0]);
    }
    if (window.innerWidth < 768) {
      setShowEditPage(true);
    } else {
      setShowModal(true);
    }
  }, [existingHabilitations]);

  const openAdd = useCallback(() => {
    setFormData({
      institution: "", typeInstitution: "", region: "", adresseExacte: "",
      domaine: "", mention: "", grade: "", specification: "",
      arreteHabilitation: "", dateArrete: "", dateExpirationArrete: "",
    });
    if (window.innerWidth < 768) {
      setShowEditPage(true);
    } else {
      setShowModal(true);
    }
  }, []);

  const closeEditPage = useCallback(() => setShowEditPage(false), []);
  const closeModal = useCallback(() => setShowModal(false), []);
  const openDeleteDialog = useCallback(() => setShowDeleteDialog(true), []);
  const closeDeleteDialog = useCallback(() => setShowDeleteDialog(false), []);

  const handleDelete = useCallback(() => {
    closeDeleteDialog();
    try {
      localStorage.removeItem("habilitationData");
      if (isMounted.current) {
        setExistingHabilitations([]);
        setHasExistingData(false);
        setFormData({
          institution: "", typeInstitution: "", region: "", adresseExacte: "",
          domaine: "", mention: "", grade: "", specification: "",
          arreteHabilitation: "", dateArrete: "", dateExpirationArrete: "",
        });
        toast.success("Informations supprimées avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      if (isMounted.current) {
        toast.error("Erreur lors de la suppression des informations");
      }
    }
  }, [closeDeleteDialog]);

  const getExpirationStatus = useCallback((expirationDate) => {
    if (!expirationDate) return null;
    const today = new Date();
    const expDate = new Date(expirationDate);
    const daysDiff = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    if (daysDiff < 0) return { text: "Expirée", color: "bg-red-100 text-red-800" };
    if (daysDiff < 90) return { text: "À renouveler", color: "bg-yellow-100 text-yellow-800" };
    return { text: "Valide", color: "bg-green-100 text-green-800" };
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit", month: "2-digit", year: "numeric",
      });
    } catch {
      return dateString;
    }
  }, []);

  const sharedFormProps = {
    formData,
    handleInputChange,
    handleSubmit,
    hasExistingData,
    formatDate,
    typeInstitutionOptions,
    regionOptions,
    gradeOptions,
    specificationOptions,
  };

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme={theme === "dark" ? "dark" : "light"}
          className="text-xs sm:text-sm"
          toastClassName="!rounded-lg !shadow-sm !border !border-slate-200 dark:!border-slate-800 !bg-white dark:!bg-slate-900 !text-slate-900 dark:!text-slate-100"
          bodyClassName="!text-xs sm:!text-sm"
        />

        {showDeleteDialog && (
          <DeleteConfirmationDialog
            closeDeleteDialog={closeDeleteDialog}
            handleDelete={handleDelete}
          />
        )}

        {showEditPage && (
          <EditPage
            {...sharedFormProps}
            closeEditPage={closeEditPage}
          />
        )}

        {showModal && (
          <DesktopModal
            {...sharedFormProps}
            closeModal={closeModal}
          />
        )}

        {!showEditPage && (
          <MainPage
            hasExistingData={hasExistingData}
            existingHabilitations={existingHabilitations}
            openAdd={openAdd}
            openEdit={openEdit}
            openDeleteDialog={openDeleteDialog}
            getExpirationStatus={getExpirationStatus}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
};

export default MesInformationsHabilitation;
