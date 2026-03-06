import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaUniversity,
  FaUser,
  FaEye,
  FaCalendarAlt,
  FaPlus,
  FaTimesCircle,
  FaCheckCircle,
  FaHourglassHalf,
  FaClock,
  FaHistory,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSpinner,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../../../context/ThemeContext";
import { getUserDemandes } from "../../../../services/equivalence.services";

const GRADES_AUTORISES = ["Licence", "Master", "Doctorat"];

// Mapper les statuts du backend vers ceux affichés dans l'UI
const mapStatutToDisplay = (statut) => {
  const mapping = {
    brouillon: "En cours",
    soumise: "En cours",
    en_cours: "En cours",
    complet: "Complété",
    rejete: "Refusé",
    accorde: "Complété",
    // variantes sans/avec accent
    ajourne: "Ajournée",
    ajourné: "Ajournée",
    ajournee: "Ajournée",
  };
  return mapping[statut] || statut;
};

// Formatter les dates
const formatDate = (dateString) => {
  if (!dateString) return "Non définie";
  const date = new Date(dateString);
  return date
    .toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(".", "");
};

// Calculer les jours écoulés
const calculateDaysElapsed = (dateString) => {
  if (!dateString) return 0;
  const startDate = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// --- Config statut ---
const statutConfig = {
  "En cours": {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    dot: "bg-blue-500",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    icon: FaClock,
    label: "En cours",
  },
  Ajournée: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    icon: FaHourglassHalf,
    label: "Ajournée",
  },
  Complété: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
    icon: FaCheckCircle,
    label: "Complété",
  },
  Refusé: {
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    dot: "bg-red-500",
    iconBg: "bg-red-100 dark:bg-red-900/50",
    icon: FaTimesCircle,
    label: "Refusé",
  },
};

// --- Badge Statut ---
const StatutBadge = ({ statut, size = "md" }) => {
  const displayStatut = mapStatutToDisplay(statut);
  const cfg = statutConfig[displayStatut] || statutConfig["En cours"];
  const padding =
    size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border} ${padding}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// --- Badge Type Diplôme ---
const TypeBadge = ({ type }) => {
  const colors = {
    Licence:
      "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800",
    Master:
      "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    Doctorat:
      "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
        colors[type] ||
        "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
      }`}
    >
      {type}
    </span>
  );
};

// --- Card Remarque / Motif ---
const RemarqueCard = ({ remarque, statut }) => {
  if (!remarque) return null;
  const displayStatut = mapStatutToDisplay(statut);
  const isRefus = displayStatut === "Refusé";
  return (
    <div
      className={`rounded-xl border p-4 ${
        isRefus
          ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800"
          : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 mt-0.5 ${
            isRefus
              ? "text-red-500 dark:text-red-400"
              : "text-amber-500 dark:text-amber-400"
          }`}
        >
          {isRefus ? (
            <FaTimesCircle size={15} />
          ) : (
            <FaExclamationTriangle size={15} />
          )}
        </div>
        <div>
          <p
            className={`text-xs font-bold uppercase tracking-wide mb-1 ${
              isRefus
                ? "text-red-700 dark:text-red-400"
                : "text-amber-700 dark:text-amber-400"
            }`}
          >
            {isRefus ? "Motif de refus" : "Motif d'ajournement"}
          </p>
          <p
            className={`text-sm leading-relaxed ${
              isRefus
                ? "text-red-800 dark:text-red-300"
                : "text-amber-800 dark:text-amber-300"
            }`}
          >
            {remarque}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Historique Soumissions amélioré ---
const HistoriqueCard = ({ demande, isDark }) => {
  const generateHistorique = () => {
    const historique = [];

    if (demande.created_at) {
      historique.push({
        date: demande.created_at,
        formattedDate: formatDate(demande.created_at),
        statut: "brouillon",
        action: "Création",
        note: "Création de la demande d'équivalence.",
        type: "creation",
      });
    }

    if (demande.submitted_at && demande.submitted_at !== demande.created_at) {
      historique.push({
        date: demande.submitted_at,
        formattedDate: formatDate(demande.submitted_at),
        statut: "soumise",
        action: "Soumission",
        note: "Demande soumise et en cours de traitement à la DGES.",
        type: "submission",
      });
    }

    // Vérifier s'il y a eu des modifications
    if (
      demande.updated_at &&
      demande.updated_at !== demande.created_at &&
      demande.updated_at !== demande.submitted_at
    ) {
      historique.push({
        date: demande.updated_at,
        formattedDate: formatDate(demande.updated_at),
        statut: demande.statut,
        action: "Modification",
        note: "Mise à jour du dossier.",
        type: "update",
      });
    }

    // Ajouter le commentaire admin s'il existe
    if (demande.commentaire_admin) {
      const commentaireDate =
        demande.updated_at || demande.submitted_at || demande.created_at;
      historique.push({
        date: commentaireDate,
        formattedDate: formatDate(commentaireDate),
        statut: demande.statut,
        action: "Note administrative",
        note: demande.commentaire_admin,
        type: "admin",
      });
    }

    // Trier par date (plus récent en premier)
    return historique.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const historique = generateHistorique();
  if (historique.length === 0) return null;

  return (
    <div
      className={`border rounded-xl p-5 ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-center gap-2 mb-5">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
        >
          <FaHistory
            className={isDark ? "text-gray-500" : "text-gray-400"}
            size={13}
          />
        </div>
        <h3
          className={`text-sm font-bold ${
            isDark ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Historique des modifications
        </h3>
        <span
          className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
            isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-400"
          }`}
        >
          {historique.length} entrée{historique.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="relative">
        {historique.map((entry, idx) => {
          const displayStatut = mapStatutToDisplay(entry.statut);
          const eCfg = statutConfig[displayStatut] || statutConfig["En cours"];
          const EIcon = eCfg.icon;
          const isFirst = idx === 0;
          const isLast = idx === historique.length - 1;

          // Couleur selon le type d'événement
          let bgColor = eCfg.bg;
          let borderColor = eCfg.border;
          let textColor = eCfg.text;

          if (entry.type === "creation") {
            bgColor = isDark ? "bg-blue-950/40" : "bg-blue-50";
            borderColor = isDark ? "border-blue-800" : "border-blue-200";
            textColor = isDark ? "text-blue-400" : "text-blue-700";
          } else if (entry.type === "admin") {
            bgColor = isDark ? "bg-purple-950/40" : "bg-purple-50";
            borderColor = isDark ? "border-purple-800" : "border-purple-200";
            textColor = isDark ? "text-purple-400" : "text-purple-700";
          }

          return (
            <div key={idx} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 z-10
                    ${
                      isFirst
                        ? `${bgColor} ${borderColor}`
                        : isDark
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-50 border-gray-200"
                    }`}
                >
                  {entry.type === "creation" ? (
                    <FaPlus
                      size={13}
                      className={
                        isFirst
                          ? textColor
                          : isDark
                            ? "text-gray-500"
                            : "text-gray-400"
                      }
                    />
                  ) : entry.type === "submission" ? (
                    <FaCheckCircle
                      size={13}
                      className={
                        isFirst
                          ? textColor
                          : isDark
                            ? "text-gray-500"
                            : "text-gray-400"
                      }
                    />
                  ) : entry.type === "admin" ? (
                    <FaInfoCircle
                      size={13}
                      className={
                        isFirst
                          ? textColor
                          : isDark
                            ? "text-gray-500"
                            : "text-gray-400"
                      }
                    />
                  ) : (
                    <EIcon
                      size={13}
                      className={
                        isFirst
                          ? textColor
                          : isDark
                            ? "text-gray-500"
                            : "text-gray-400"
                      }
                    />
                  )}
                </div>
                {!isLast && (
                  <div
                    className="w-px flex-1 mt-1 mb-1"
                    style={{
                      backgroundColor: isDark ? "#374151" : "#e5e7eb",
                      minHeight: "24px",
                    }}
                  />
                )}
              </div>

              <div className={`flex-1 ${isLast ? "pb-0" : "pb-5"}`}>
                <div
                  className={`rounded-xl border p-4 transition-all ${
                    isFirst
                      ? `${bgColor} ${borderColor}`
                      : isDark
                        ? "bg-gray-700/50 border-gray-600"
                        : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-bold uppercase ${textColor}`}
                      >
                        {entry.action}
                      </span>
                      {isFirst && (
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-gray-400"
                              : "bg-white border-gray-200 text-gray-500"
                          }`}
                        >
                          Récent
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] flex items-center gap-1 flex-shrink-0 ${
                        isFirst
                          ? textColor
                          : isDark
                            ? "text-gray-500"
                            : "text-gray-400"
                      }`}
                    >
                      <FaCalendarAlt size={9} />
                      {entry.formattedDate}
                    </span>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      isFirst
                        ? `${textColor} opacity-90`
                        : isDark
                          ? "text-gray-400"
                          : "text-gray-500"
                    }`}
                  >
                    {entry.note}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Modal Détails ---
const DetailModal = ({ isOpen, onClose, demande, isDark }) => {
  if (!isOpen || !demande) return null;

  // Extraire la première formation pour afficher le diplôme cible
  const firstFormation =
    demande.recapitulatif_formation &&
    demande.recapitulatif_formation.length > 0
      ? demande.recapitulatif_formation[0]
      : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        className={`rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark ? "bg-blue-900/50" : "bg-blue-50"
              }`}
            >
              <FaFileAlt className="text-blue-500" size={14} />
            </div>
            <div>
              <h2
                className={`text-base font-bold ${
                  isDark ? "text-gray-100" : "text-gray-800"
                }`}
              >
                EQ-{demande.id.toString().padStart(4, "0")}
              </h2>
              <p
                className={
                  isDark ? "text-gray-500 text-xs" : "text-gray-400 text-xs"
                }
              >
                Détails du dossier
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatutBadge statut={demande.statut} />
            <button
              onClick={onClose}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors text-sm font-bold ${
                isDark
                  ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                  : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              }`}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(85vh-72px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Requérant */}
            <div>
              <h3
                className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Requérant
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: FaUser,
                    label: "Nom complet",
                    value:
                      `${demande.nom || ""} ${demande.prenoms || ""}`.trim() ||
                      "Non renseigné",
                  },
                  {
                    icon: FaEnvelope,
                    label: "Email",
                    value: demande.email || "Non renseigné",
                  },
                  {
                    icon: FaPhoneAlt,
                    label: "Téléphone",
                    value: demande.telephone || "Non renseigné",
                  },
                  {
                    icon: FaMapMarkerAlt,
                    label: "Adresse",
                    value: demande.code_postal || "Non renseignée",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isDark ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <Icon
                        className={isDark ? "text-gray-500" : "text-gray-400"}
                        size={11}
                      />
                    </div>
                    <div>
                      <p
                        className={`text-[10px] font-medium uppercase ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {label}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Infos académiques */}
            <div>
              <h3
                className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Informations académiques
              </h3>
              <div className="space-y-3">
                <div>
                  <p
                    className={`text-[10px] font-medium uppercase ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Niveau
                  </p>
                  <div className="mt-1">
                    <TypeBadge type={demande.type_diplome} />
                  </div>
                </div>
                <div>
                  <p
                    className={`text-[10px] font-medium uppercase ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Diplôme visé
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {firstFormation?.diplome ||
                      demande.type_diplome ||
                      "Non spécifié"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isDark ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <FaUniversity
                      className={isDark ? "text-gray-500" : "text-gray-400"}
                      size={11}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-[10px] font-medium uppercase ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Établissement
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {firstFormation?.etablissement || "Non spécifié"}
                    </p>
                  </div>
                </div>
                <div>
                  <p
                    className={`text-[10px] font-medium uppercase ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Date de dépôt
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {formatDate(demande.submitted_at || demande.created_at)}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-[10px] font-medium uppercase ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Dernière mise à jour
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {formatDate(demande.updated_at || demande.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Remarque dans modal */}
          {demande.commentaire_admin && (
            <div className="mt-4">
              <RemarqueCard
                remarque={demande.commentaire_admin}
                statut={demande.statut}
              />
            </div>
          )}

          {/* Historique dans modal */}
          <div className="mt-6">
            <HistoriqueCard demande={demande} isDark={isDark} />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Card Dossier ---
const DemandeCard = ({ demande, isActive, onClick, onViewDetails, isDark }) => {
  const displayStatut = mapStatutToDisplay(demande.statut);
  const cfg = statutConfig[displayStatut] || statutConfig["En cours"];
  const daysElapsed = calculateDaysElapsed(
    demande.submitted_at || demande.created_at,
  );
  const firstFormation =
    demande.recapitulatif_formation &&
    demande.recapitulatif_formation.length > 0
      ? demande.recapitulatif_formation[0]
      : null;

  return (
    <div
      className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
        isActive
          ? "border-blue-400 shadow-sm ring-1 ring-blue-100 dark:ring-blue-900"
          : isDark
            ? "border-gray-700 hover:border-gray-600"
            : "border-gray-100 hover:border-gray-200"
      } ${isDark ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:shadow-md"}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <TypeBadge type={demande.type_diplome} />
            <StatutBadge statut={demande.statut} size="sm" />
            {demande.is_archived && (
              <span className="ml-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded border bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600">
                Archivé
              </span>
            )}
          </div>
          <p
            className={`text-sm font-semibold truncate ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}
          >
            EQ-{demande.id.toString().padStart(4, "0")}
          </p>
          <p
            className={`text-xs mt-0.5 truncate ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {firstFormation?.diplome ||
              demande.type_diplome ||
              "Demande d'équivalence"}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(demande);
          }}
          className={`ml-2 w-7 h-7 flex items-center justify-center rounded-lg transition-colors flex-shrink-0 ${
            isDark
              ? "text-gray-500 hover:text-blue-400 hover:bg-blue-900/30"
              : "text-gray-300 hover:text-blue-600 hover:bg-blue-50"
          }`}
        >
          <FaEye size={13} />
        </button>
      </div>

      <div
        className={`flex items-center justify-between pt-2 border-t ${
          isDark ? "border-gray-700" : "border-gray-50"
        }`}
      >
        <span
          className={`text-[11px] flex items-center gap-1 ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <FaCalendarAlt size={9} />
          {formatDate(demande.submitted_at || demande.created_at)}
        </span>
        <span
          className={`text-[11px] font-semibold flex items-center gap-1 ${cfg.text}`}
        >
          <FaClock size={9} />
          {daysElapsed} jours
        </span>
      </div>
    </div>
  );
};

// --- Panneau Détail Dossier ---
const DossierDetail = ({ demande, isDark }) => {
  const displayStatut = mapStatutToDisplay(demande.statut);
  const cfg = statutConfig[displayStatut] || statutConfig["En cours"];
  const Icon = cfg.icon;
  const daysElapsed = calculateDaysElapsed(
    demande.submitted_at || demande.created_at,
  );
  const firstFormation =
    demande.recapitulatif_formation &&
    demande.recapitulatif_formation.length > 0
      ? demande.recapitulatif_formation[0]
      : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Colonne principale */}
      <div className="lg:col-span-2 space-y-4">
        {/* Bloc statut principal */}
        <div className={`rounded-xl border p-5 ${cfg.bg} ${cfg.border}`}>
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}
            >
              <Icon size={22} className={cfg.text} />
            </div>
            <div className="flex-1">
              <h3 className={`text-base font-bold mb-1 ${cfg.text}`}>
                {displayStatut === "En cours" &&
                  "Dossier en cours de traitement"}
                {displayStatut === "Ajournée" && "Dossier ajourné"}
                {displayStatut === "Complété" && "Traitement complété"}
                {displayStatut === "Refusé" && "Demande refusée"}
              </h3>
              <p className={`text-sm leading-relaxed ${cfg.text} opacity-80`}>
                {displayStatut === "En cours" &&
                  "Votre dossier est actuellement examiné par la Direction Générale de l'Enseignement Supérieur (DGES)."}
                {displayStatut === "Ajournée" &&
                  "Votre dossier a été ajourné par la DGES. Des informations ou documents complémentaires sont requis."}
                {displayStatut === "Complété" &&
                  "Votre demande d'équivalence a été traitée avec succès. L'arrêté a été signé et le document officiel est disponible."}
                {displayStatut === "Refusé" &&
                  "Votre demande d'équivalence a été refusée par la DGES. Consultez le motif ci-dessous pour plus d'informations."}
              </p>
              {displayStatut === "En cours" && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-blue-500 dark:text-blue-400 font-medium">
                    Traitement en cours à la DGES
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Remarque / Motif */}
        {demande.commentaire_admin && (
          <RemarqueCard
            remarque={demande.commentaire_admin}
            statut={demande.statut}
          />
        )}

        {/* Historique soumissions */}
        <HistoriqueCard demande={demande} isDark={isDark} />
      </div>

      {/* Colonne droite — Résumé */}
      <div className="space-y-4">
        <div
          className={`border rounded-xl p-5 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          }`}
        >
          <h3
            className={`text-xs font-bold uppercase tracking-wider mb-4 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Résumé du dossier
          </h3>
          <div className="space-y-4">
            {/* Référence */}
            <div>
              <p
                className={`text-[10px] font-medium uppercase mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Référence
              </p>
              <p
                className={`text-sm font-mono font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
              >
                EQ-{demande.id.toString().padStart(4, "0")}
              </p>
            </div>
            {/* Nom complet */}
            <div>
              <p
                className={`text-[10px] font-medium uppercase mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Nom complet
              </p>
              <p
                className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}
              >
                {demande.nom} {demande.prenoms}
              </p>
            </div>
            {/* Niveau */}
            <div>
              <p
                className={`text-[10px] font-medium uppercase mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Niveau
              </p>
              <TypeBadge type={demande.type_diplome} />
            </div>
            {/* Diplôme visé */}
            <div>
              <p
                className={`text-[10px] font-medium uppercase mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Diplôme visé
              </p>
              <p
                className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}
              >
                {firstFormation?.diplome ||
                  demande.type_diplome ||
                  "Non spécifié"}
              </p>
            </div>
            {/* Établissement */}
            <div>
              <p
                className={`text-[10px] font-medium uppercase mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Établissement
              </p>
              <div className="flex items-start gap-2">
                <FaUniversity
                  className={
                    isDark
                      ? "text-gray-600 mt-0.5 flex-shrink-0"
                      : "text-gray-300 mt-0.5 flex-shrink-0"
                  }
                  size={11}
                />
                <div>
                  <p
                    className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}
                  >
                    {firstFormation?.etablissement || "Non spécifié"}
                  </p>
                </div>
              </div>
            </div>
            {/* Date de dépôt */}
            <div>
              <p
                className={`text-[10px] font-medium uppercase mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Date de dépôt
              </p>
              <p
                className={`text-sm font-medium flex items-center gap-1.5 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <FaCalendarAlt
                  className={isDark ? "text-gray-600" : "text-gray-300"}
                  size={11}
                />
                {formatDate(demande.submitted_at || demande.created_at)}
              </p>
            </div>
            {/* Statut DGES */}
            <div>
              <p
                className={`text-[10px] font-medium uppercase mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Statut DGES
              </p>
              <StatutBadge statut={demande.statut} />
            </div>
            {/* Durée de traitement */}
            <div>
              <p
                className={`text-[10px] font-medium uppercase mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Durée de traitement
              </p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className={isDark ? "text-gray-500" : "text-gray-400"}>
                    {daysElapsed} jours
                  </span>
                </div>
                <div
                  className={`w-full rounded-full h-1.5 ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div
                    className={`h-1.5 rounded-full transition-all duration-700 ${
                      displayStatut === "Refusé"
                        ? "bg-red-400"
                        : displayStatut === "Ajournée"
                          ? "bg-amber-400"
                          : displayStatut === "Complété"
                            ? "bg-emerald-400"
                            : "bg-blue-500"
                    }`}
                    style={{
                      width: `${Math.min(100, (daysElapsed / 90) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info DGES */}
        <div
          className={`border rounded-xl p-4 ${
            isDark
              ? "bg-blue-950/30 border-blue-900"
              : "bg-blue-50 border-blue-100"
          }`}
        >
          <div className="flex items-start gap-2">
            <FaInfoCircle
              className={`mt-0.5 flex-shrink-0 ${
                isDark ? "text-blue-500" : "text-blue-400"
              }`}
              size={13}
            />
            <div>
              <p
                className={`text-xs font-bold mb-1 ${
                  isDark ? "text-blue-400" : "text-blue-700"
                }`}
              >
                Direction Générale de l'Enseignement Supérieur
              </p>
              <p
                className={`text-[11px] leading-relaxed ${
                  isDark ? "text-blue-500" : "text-blue-600"
                }`}
              >
                Toutes les demandes sont traitées exclusivement par la DGES.
                Pour toute question, contactez directement le service compétent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Vue Principale ---
export default function DashboardReqView() {
  const [activeDemande, setActiveDemande] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalDemande, setModalDemande] = useState(null);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  // Charger les demandes réelles depuis l'API
  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        setLoading(true);
        // Inclure les demandes archivées pour qu'elles ne soient pas masquées
        const response = await getUserDemandes({}, true);
        if (response.success && response.data) {
          setDemandes(response.data);
        } else {
          setError("Impossible de charger les demandes");
          toast.error("Impossible de charger les demandes");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des demandes:", err);
        setError("Erreur de connexion au serveur");
        toast.error("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, []);

  const hasDemandes = demandes && demandes.length > 0;
  const currentDemande = hasDemandes ? demandes[activeDemande] : null;

  const gradesExistants = new Set(demandes.map((d) => d.type_diplome));
  const gradesDisponibles = GRADES_AUTORISES.filter(
    (g) => !gradesExistants.has(g),
  );
  const showNewDemandButton = gradesDisponibles.length > 0;

  const handleViewDetails = (demande) => {
    setModalDemande(demande);
    setShowModal(true);
  };

  const handleNouvelleDemande = () => {
    navigate("/dashboard/requerant/creer-demande");
  };

  // État de chargement
  if (loading) {
    return (
      <div
        className={`min-h-screen p-6 font-sans transition-colors duration-300 flex items-center justify-center ${
          isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDark ? "dark" : "light"}
        />
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Chargement de vos demandes...
          </p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div
        className={`min-h-screen p-6 font-sans transition-colors duration-300 flex items-center justify-center ${
          isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDark ? "dark" : "light"}
        />
        <div className="text-center max-w-md">
          <div
            className={`rounded-2xl p-10 border shadow-sm ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
                isDark ? "bg-red-900/40" : "bg-red-50"
              }`}
            >
              <FaExclamationTriangle className="text-red-500 text-2xl" />
            </div>
            <h3
              className={`text-lg font-bold mb-2 ${
                isDark ? "text-gray-100" : "text-gray-800"
              }`}
            >
              Erreur de chargement
            </h3>
            <p
              className={`text-sm mb-6 ${
                isDark ? "text-gray-400" : "text-gray-400"
              }`}
            >
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- État vide ---
  if (!hasDemandes) {
    return (
      <div
        className={`min-h-screen p-6 font-sans transition-colors duration-300 ${
          isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDark ? "dark" : "light"}
        />
        <div className="mb-8">
          <h1
            className={`text-2xl font-bold mb-1 ${isDark ? "text-gray-100" : "text-gray-800"}`}
          >
            Mes demandes d'équivalence
          </h1>
          <p
            className={
              isDark ? "text-sm text-gray-500" : "text-sm text-gray-400"
            }
          >
            Suivez l'avancement de vos demandes auprès de la DGES
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <div
            className={`rounded-2xl p-10 max-w-sm w-full text-center border shadow-sm ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
                isDark ? "bg-blue-900/40" : "bg-blue-50"
              }`}
            >
              <FaFileAlt className="text-blue-500 text-2xl" />
            </div>
            <h3
              className={`text-lg font-bold mb-2 ${
                isDark ? "text-gray-100" : "text-gray-800"
              }`}
            >
              Aucune demande en cours
            </h3>
            <p
              className={`text-sm mb-6 ${
                isDark ? "text-gray-400" : "text-gray-400"
              }`}
            >
              Vous n'avez pas encore soumis de demande d'équivalence de diplôme
              auprès de la DGES.
            </p>
            <button
              onClick={handleNouvelleDemande}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 mx-auto text-sm"
            >
              <FaPlus size={12} />
              Faire une demande d'équivalence
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 font-sans transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? "dark" : "light"}
      />
      {/* En-tête */}
      <div className="mb-6">
        <h1
          className={`text-xl font-bold mb-0.5 ${
            isDark ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Mes demandes d'équivalence
        </h1>
        <p
          className={isDark ? "text-sm text-gray-500" : "text-sm text-gray-400"}
        >
          Suivi en temps réel de vos dossiers auprès de la DGES
        </p>
      </div>

      {/* Liste des dossiers */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2
            className={`text-sm font-bold uppercase tracking-wide ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Vos dossiers — {demandes.length}
          </h2>
          {showNewDemandButton && (
            <button
              onClick={handleNouvelleDemande}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-900/20"
            >
              <FaPlus size={10} />
              Nouvelle demande
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {demandes.map((demande, index) => (
            <DemandeCard
              key={demande.id}
              demande={demande}
              isActive={activeDemande === index}
              onClick={() => setActiveDemande(index)}
              onViewDetails={handleViewDetails}
              isDark={isDark}
            />
          ))}
        </div>
      </div>

      {/* Séparateur */}
      <div
        className={`border-t mb-6 ${
          isDark ? "border-gray-800" : "border-gray-100"
        }`}
      />

      {/* Détail du dossier actif */}
      {currentDemande && (
        <DossierDetail demande={currentDemande} isDark={isDark} />
      )}

      {/* Modal */}
      {modalDemande && (
        <DetailModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          demande={modalDemande}
          isDark={isDark}
        />
      )}
    </div>
  );
}
