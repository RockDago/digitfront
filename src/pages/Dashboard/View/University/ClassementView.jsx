// C:\Users\hp\Desktop\Digitalisation\frontend\src\pages\Dashboard\View\University\ClassementView.jsx
import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import accreditationServices from "../../../../services/accreditation.services";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineMagnifyingGlass,
  HiOutlineEye,
  HiOutlineXMark,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineGlobeAlt,
  HiOutlineAcademicCap,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineBuildingLibrary,
  HiOutlineChevronUp,
  HiOutlineChevronDown,
} from "react-icons/hi2";
import {
  Award,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Star,
  Info,
} from "lucide-react";

const { getUniversitesGeolocalisations, NIVEAU_CONFORMITE } =
  accreditationServices;

// ─── Evaluation helpers ─────────────────────────────────────────────────────────
const getLevelKey = (score) => {
  if (score <= 91) return NIVEAU_CONFORMITE.INSUFFISANT;
  if (score <= 183) return NIVEAU_CONFORMITE.FAIBLE;
  if (score <= 256) return NIVEAU_CONFORMITE.EN_DEVELOPPEMENT;
  if (score <= 311) return NIVEAU_CONFORMITE.SATISFAISANT;
  return NIVEAU_CONFORMITE.EXCELLENT;
};

const LEVEL_CFG = {
  [NIVEAU_CONFORMITE.INSUFFISANT]: {
    label: "Non conforme",
    range: "0 – 91",
    appreciation: "Absence d'une politique ou d'un dispositif crédible",
    icon: AlertTriangle,
    pill: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    dot: "bg-red-500",
    bar: "bg-red-500",
    score: "text-red-700 dark:text-red-400",
    card: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
    badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    ring: "#ef4444",
  },
  [NIVEAU_CONFORMITE.FAIBLE]: {
    label: "Faible",
    range: "92 – 183",
    appreciation: "Plusieurs insuffisances majeures",
    icon: Zap,
    pill: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    dot: "bg-orange-500",
    bar: "bg-orange-500",
    score: "text-orange-700 dark:text-orange-400",
    card: "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800",
    badge:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    ring: "#f97316",
  },
  [NIVEAU_CONFORMITE.EN_DEVELOPPEMENT]: {
    label: "Acceptable",
    range: "184 – 256",
    appreciation: "Conformité partielle, dispositifs à consolider",
    icon: CheckCircle2,
    pill: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
    dot: "bg-yellow-500",
    bar: "bg-yellow-500",
    score: "text-yellow-700 dark:text-yellow-400",
    card: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
    badge:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    ring: "#eab308",
  },
  [NIVEAU_CONFORMITE.SATISFAISANT]: {
    label: "Satisfaisant",
    range: "257 – 311",
    appreciation: "Conformité générale avec quelques points à améliorer",
    icon: CheckCircle2,
    pill: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    dot: "bg-blue-500",
    bar: "bg-blue-500",
    score: "text-blue-700 dark:text-blue-400",
    card: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    ring: "#3b82f6",
  },
  [NIVEAU_CONFORMITE.EXCELLENT]: {
    label: "Excellent",
    range: "312 – 368",
    appreciation: "Très haute qualité, bonnes pratiques institutionnalisées",
    icon: Star,
    pill: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    dot: "bg-green-500",
    bar: "bg-green-500",
    score: "text-green-700 dark:text-green-400",
    card: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
    badge:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    ring: "#22c55e",
  },
};

const STATUS_CFG = {
  Habilitée: {
    pill: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    dot: "bg-green-500",
  },
  Accréditée: {
    pill: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    dot: "bg-purple-500",
  },
  "Non habilitée": {
    pill: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
    dot: "bg-orange-500",
  },
  "Non accréditée": {
    pill: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
    dot: "bg-yellow-500",
  },
  Suspendue: {
    pill: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    dot: "bg-red-500",
  },
};

// ─── Helper function to map API data to component structure ────────────────────
const mapApiToUniversity = (apiData) => {
  // Déterminer les statuts
  const statuses = [];
  const hab = (apiData.habilitation || "").toLowerCase();
  if (hab === "oui" || hab === "habilité" || hab === "habilitée")
    statuses.push("Habilitée");
  else statuses.push("Non habilitée");

  // Pour l'accréditation : si le statut est 'accredite', afficher 'Accréditée', sinon 'Non accréditée'
  if (apiData.statut === "accredite") {
    statuses.push("Accréditée");
  } else {
    // Pour tous les autres cas (brouillon, en_cours, ajourne, rejetee, etc.), afficher 'Non accréditée'
    statuses.push("Non accréditée");
  }

  // Calculer le shortName
  const shortName = (apiData.nom || "?")
    .split(/[\s-]+/)
    .slice(0, 3)
    .map((w) => w[0] || "")
    .join("")
    .toUpperCase()
    .slice(0, 4);

  // Déterminer le type (Publique/Privée)
  const type =
    apiData.type ||
    (apiData.type_etablissement === "Publique" ? "Publique" : "Privée");

  // Score total (sur 368)
  const score_total =
    apiData.score_total ??
    Math.round(((apiData.score_pourcentage || 0) * 368) / 100);

  return {
    id: apiData.id,
    name: apiData.nom || "Établissement inconnu",
    shortName,
    ville: apiData.province || apiData.region || "",
    region: apiData.region || "",
    province: apiData.province || "",
    type,
    founded: apiData.annee_creation || new Date().getFullYear() - 10,
    students: apiData.nombre_etudiants || 0,
    address: apiData.adresse || "",
    phone: apiData.telephone || "",
    website: apiData.site_web || "",
    domaines: apiData.domaine || "Non spécifié",
    pts: score_total,
    score_pourcentage: apiData.score_pourcentage || 0,
    statuses,
    description: apiData.description || "Aucune description disponible.",
    niveau_conformite:
      apiData.niveau_conformite || NIVEAU_CONFORMITE.INSUFFISANT,
    statut: apiData.statut || "",
    created_at: apiData.created_at,
    policies: [
      {
        name: "POLITIQUE DE FORMATION",
        score: Math.round(score_total * 0.35),
        max: 148,
      },
      {
        name: "POLITIQUE DE GOUVERNANCE",
        score: Math.round(score_total * 0.55),
        max: 204,
      },
      {
        name: "POLITIQUE DE RECHERCHE",
        score: Math.round(score_total * 0.1),
        max: 16,
      },
    ],
  };
};

// ─── Atoms ──────────────────────────────────────────────────────────────────────
const StatusPill = ({ status }) => {
  const c = STATUS_CFG[status] || {
    pill: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    dot: "bg-slate-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${c.pill}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
};

const EvalBadge = ({ pts }) => {
  const lk = getLevelKey(pts);
  const c = LEVEL_CFG[lk];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${c.pill}`}
    >
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

// Sort arrow
const SortIcon = ({ col, sortConfig }) => {
  if (sortConfig.key !== col)
    return <span className="opacity-30 text-[10px] ml-1">↕</span>;
  return sortConfig.dir === "asc" ? (
    <HiOutlineChevronUp className="w-3 h-3 ml-1" />
  ) : (
    <HiOutlineChevronDown className="w-3 h-3 ml-1" />
  );
};

// ─── Score gauge (barre multicolore + curseur) ──────────────────────────────────
const ScoreGauge = ({ score, max = 368 }) => {
  const pct = (score / max) * 100;
  const lk = getLevelKey(score);
  const cfg = LEVEL_CFG[lk];
  const Icon = cfg.icon;

  const segments = [
    { w: (91 / 368) * 100, cls: "bg-gradient-to-r from-red-500 to-red-400" },
    {
      w: ((183 - 92 + 1) / 368) * 100,
      cls: "bg-gradient-to-r from-orange-500 to-orange-400",
    },
    {
      w: ((256 - 184 + 1) / 368) * 100,
      cls: "bg-gradient-to-r from-yellow-500 to-yellow-400",
    },
    {
      w: ((311 - 257 + 1) / 368) * 100,
      cls: "bg-gradient-to-r from-blue-500 to-blue-400",
    },
    {
      w: ((368 - 312 + 1) / 368) * 100,
      cls: "bg-gradient-to-r from-green-500 to-green-400",
    },
  ];
  const thresholds = [0, 92, 184, 257, 312, 368];

  return (
    <div className="w-full space-y-6">
      {/* Score card */}
      <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
              <TrendingUp className="w-7 h-7 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                Score global
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                  {score}
                </span>
                <span className="text-base text-slate-400">/ {max}</span>
              </div>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold ${cfg.badge}`}
          >
            <Icon className="w-4 h-4" />
            {cfg.label}
          </span>
        </div>

        {/* Multi-color bar */}
        <div className="relative mt-8 mb-10">
          <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div className="flex h-full w-full">
              {segments.map((s, i) => (
                <div
                  key={i}
                  className={`h-full ${s.cls}`}
                  style={{ width: `${s.w}%` }}
                />
              ))}
            </div>
          </div>

          {/* Threshold labels */}
          <div className="relative w-full mt-3">
            {thresholds.map((t, i) => (
              <div
                key={i}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${(t / max) * 100}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
                <span
                  className="text-[11px] font-bold mt-1.5 px-1.5 py-0.5 bg-white dark:bg-slate-900 rounded-md border border-current"
                  style={{
                    color: LEVEL_CFG[getLevelKey(Math.max(t, 1))].ring,
                    borderColor: LEVEL_CFG[getLevelKey(Math.max(t, 1))].ring,
                  }}
                >
                  {t}
                </span>
              </div>
            ))}
          </div>

          {/* Cursor */}
          <div
            className="absolute top-0 flex flex-col items-center transition-all duration-700"
            style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
          >
            <div className="relative">
              <div className="w-6 h-6 bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-100 rounded-full shadow-lg" />
              <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shadow-lg">
                {score} pts
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900" />
            </div>
          </div>
        </div>
      </div>

      {/* Level icons */}
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(LEVEL_CFG)
          .reverse()
          .map(([k, v]) => {
            const Ic = v.icon;
            return (
              <div
                key={k}
                className={`flex flex-col items-center p-2.5 bg-white dark:bg-slate-900 rounded-xl border hover:shadow-md transition-shadow ${v.pill}`}
              >
                <div
                  className={`w-9 h-9 ${v.dot} rounded-full mb-1.5 flex items-center justify-center`}
                >
                  <Ic className="w-4 h-4 text-white" />
                </div>
                <span
                  className={`text-[10px] font-bold text-center ${v.score}`}
                >
                  {v.label}
                </span>
                <span className="text-[9px] opacity-70 mt-0.5 text-center">
                  {v.range}
                </span>
              </div>
            );
          })}
      </div>

      {/* Appreciation */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
              Appréciation globale
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-100 italic leading-relaxed">
              {cfg.appreciation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Policies cards ─────────────────────────────────────────────────────────────
const PoliciesSection = ({ policies }) => (
  <div className="space-y-4">
    {policies.map((p) => {
      const lk = getLevelKey(Math.round((p.score / p.max) * 368));
      const cfg = LEVEL_CFG[lk];
      const pct = Math.min(100, Math.round((p.score / p.max) * 100));
      return (
        <div
          key={p.name}
          className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700"
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
              {p.name}
            </h4>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold ${cfg.badge}`}
            >
              {p.score} pts
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden mb-2">
            <div
              className={`h-full rounded-full ${cfg.bar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-300">
              Score : {p.score}/{p.max}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}
            >
              {cfg.label}
            </span>
          </div>
        </div>
      );
    })}

    {/* Total */}
    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-blue-800 dark:text-blue-200">
          TOTAL GÉNÉRAL
        </span>
        <span className="text-xl font-bold text-blue-700 dark:text-blue-100">
          {policies.reduce((a, p) => a + p.score, 0)}/368 pts
        </span>
      </div>
      <div className="w-full bg-blue-100 dark:bg-blue-900 rounded-full h-2.5 overflow-hidden mb-2">
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{
            width: `${Math.min(100, (policies.reduce((a, p) => a + p.score, 0) / 368) * 100)}%`,
          }}
        />
      </div>
    </div>
  </div>
);

// ─── Niveaux table ──────────────────────────────────────────────────────────────
const NiveauxTable = ({ currentLevelKey }) => {
  const order = [
    NIVEAU_CONFORMITE.EXCELLENT,
    NIVEAU_CONFORMITE.SATISFAISANT,
    NIVEAU_CONFORMITE.EN_DEVELOPPEMENT,
    NIVEAU_CONFORMITE.FAIBLE,
    NIVEAU_CONFORMITE.INSUFFISANT,
  ];
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md p-5 mt-6">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-blue-600" /> Niveau institutionnel
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 dark:border-slate-700">
              {["Niveau", "Plage de points", "Appréciation", "Statut"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-2 font-semibold text-slate-700 dark:text-slate-200"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {order.map((k) => {
              const cfg = LEVEL_CFG[k];
              const isCurrent = k === currentLevelKey;
              const Ic = cfg.icon;
              return (
                <tr
                  key={k}
                  className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isCurrent ? cfg.card : ""}`}
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                      <span
                        className={`font-medium ${isCurrent ? cfg.score : "text-slate-700 dark:text-slate-100"}`}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </td>
                  <td
                    className={`py-3 px-2 font-medium ${isCurrent ? cfg.score : "text-slate-800 dark:text-slate-100"}`}
                  >
                    {cfg.range}
                  </td>
                  <td className="py-3 px-2 text-slate-600 dark:text-slate-300">
                    {cfg.appreciation}
                  </td>
                  <td className="py-3 px-2">
                    {isCurrent && (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.badge}`}
                      >
                        <Ic className="w-3 h-3" /> Niveau actuel
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          <p className="text-xs text-blue-700 dark:text-blue-200">
            <span className="font-semibold">Niveau actuel : </span>
            <span className="font-bold">
              {LEVEL_CFG[currentLevelKey].label}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Modal ──────────────────────────────────────────────────────────────────────
const UniversityModal = ({ uni, onClose }) => {
  if (!uni) return null;
  const lk = getLevelKey(uni.pts);
  const cfg = LEVEL_CFG[lk];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-[slideUp_0.25s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`@keyframes slideUp { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:none} }`}</style>

        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-700 p-5 z-10">
          <div className="flex items-start gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black border-2 flex-shrink-0 ${cfg.pill}`}
            >
              {uni.shortName}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
                  {uni.name}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${uni.type === "Publique" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}
                >
                  {uni.type}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <HiOutlineMapPin className="w-3 h-3" />
                  {uni.ville}
                </span>
                <span className="flex items-center gap-1">
                  <HiOutlineUserGroup className="w-3 h-3" />
                  {uni.students?.toLocaleString()} étudiants
                </span>
              </div>
              <div className="flex gap-1.5 flex-wrap mt-2">
                {uni.statuses.map((s) => (
                  <StatusPill key={s} status={s} />
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <HiOutlineXMark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Description */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
              <HiOutlineBuildingLibrary className="w-3.5 h-3.5" /> Description
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {uni.description}
            </p>
          </div>

          {/* Score gauge */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Score d'auto-évaluation
            </p>
            <ScoreGauge score={uni.pts} />
          </div>

          {/* Policies */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Évaluation des Politiques
            </p>
            <PoliciesSection policies={uni.policies} />
          </div>

          {/* Niveaux table */}
          <NiveauxTable currentLevelKey={lk} />

          {/* Domaines */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
              <HiOutlineAcademicCap className="w-3.5 h-3.5" /> Domaines de
              formation
            </p>
            <div className="flex flex-wrap gap-2">
              {uni.domaines.split(",").map((d) => (
                <span
                  key={d.trim()}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700"
                >
                  {d.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Coordonnées
            </p>
            <div className="space-y-2">
              {[
                { Icon: HiOutlineMapPin, v: uni.address },
                { Icon: HiOutlinePhone, v: uni.phone },
                { Icon: HiOutlineGlobeAlt, v: uni.website },
              ]
                .filter((x) => x.v)
                .map(({ Icon, v }) => (
                  <div
                    key={v}
                    className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                  >
                    <Icon className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <span>{v}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────────
export default function ClassementView() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedUni, setSelectedUni] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "pts", dir: "desc" });
  const PER_PAGE = 5;

  // Charger les données depuis le backend
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getUniversitesGeolocalisations(true)
      .then((data) => {
        if (cancelled) return;
        // Mapper les données API vers le format attendu par le composant
        const mapped = data
          .filter((d) => d.nom) // Garder seulement ceux qui ont un nom
          .map(mapApiToUniversity);
        setUniversities(mapped);
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Erreur chargement classement:", err);
          setError(err.message || "Erreur de chargement des données");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const sorted = [...universities].sort((a, b) => {
    const { key, dir } = sortConfig;
    let av = a[key],
      bv = b[key];
    if (
      key === "name" ||
      key === "ville" ||
      key === "type" ||
      key === "region"
    ) {
      return dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    return dir === "asc" ? av - bv : bv - av;
  });

  const filtered = sorted.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(q) ||
      u.id?.toString().toLowerCase().includes(q) ||
      u.ville.toLowerCase().includes(q) ||
      u.region.toLowerCase().includes(q) ||
      u.type.toLowerCase().includes(q) ||
      u.statuses.some((s) => s.toLowerCase().includes(q)) ||
      u.pts.toString().includes(search);
    const matchFilter = filter === "all" || u.statuses.includes(filter);
    return matchSearch && matchFilter;
  });

  // Rang global basé sur le score
  const globalRank = (id) => {
    const sortedByScore = [...universities].sort((a, b) => b.pts - a.pts);
    return sortedByScore.findIndex((x) => x.id === id) + 1;
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Top 6 universités avec descriptions personnalisées
  const top6 = [...universities]
    .sort((a, b) => b.pts - a.pts)
    .slice(0, 6)
    .map((u, idx) => ({
      rank: idx + 1,
      name: u.name,
      score: u.pts,
      desc:
        idx === 0
          ? "Leader absolu en recherche & innovation"
          : idx === 1
            ? "Excellence académique & valeurs humanistes"
            : idx === 2
              ? "Innovation technologique & informatique"
              : undefined,
    }));

  const TH = ({ children, col, align = "center" }) => (
    <th
      className={`px-4 py-3.5 text-${align} text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap select-none cursor-pointer hover:text-slate-900 dark:hover:text-slate-100 transition-colors`}
      onClick={() => col && handleSort(col)}
    >
      <span
        className={`inline-flex items-center ${align === "center" ? "justify-center" : ""}`}
      >
        {children}
        {col && <SortIcon col={col} sortConfig={sortConfig} />}
      </span>
    </th>
  );

  // Fonction pour obtenir les styles des statuts selon le thème
  const getStatusStyles = (status) => {
    const baseColors = {
      Habilitée: {
        bg: isDark ? "rgba(22, 163, 74, 0.1)" : "#f0fdf4",
        text: isDark ? "#86efac" : "#166534",
        dot: "#16a34a",
      },
      Accréditée: {
        bg: isDark ? "rgba(124, 58, 237, 0.1)" : "#faf5ff",
        text: isDark ? "#d8b4fe" : "#6b21a8",
        dot: "#7c3aed",
      },
      "Non habilitée": {
        bg: isDark ? "rgba(234, 88, 12, 0.1)" : "#fff7ed",
        text: isDark ? "#fdba74" : "#9a3412",
        dot: "#ea580c",
      },
      "Non accréditée": {
        bg: isDark ? "rgba(202, 138, 4, 0.1)" : "#fefce8",
        text: isDark ? "#fde047" : "#854d0e",
        dot: "#ca8a04",
      },
    };
    return (
      baseColors[status] || {
        bg: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
        text: isDark ? "#e2e8f0" : "#475569",
        dot: "#94a3b8",
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Chargement du classement...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-slate-900 dark:text-slate-100 font-inter p-5 md:p-6">
      <div className="max-w-screen-xl mx-auto space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Classement des universités
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Madagascar · {universities.length} établissement
            {universities.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* TOP 6 */}
        {top6.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              🏆 Top 6 Universités
            </h2>
            {/* Top 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              {top6.slice(0, 3).map((item) => {
                const gradientClass =
                  item.rank === 1
                    ? "from-green-600 to-green-700"
                    : item.rank === 2
                      ? "from-green-500 to-green-600"
                      : "from-blue-600 to-blue-700";
                return (
                  <div
                    key={item.rank}
                    className={`bg-gradient-to-br ${gradientClass} rounded-2xl p-5 text-center shadow-lg`}
                  >
                    <div className="text-4xl mb-2">🏆</div>
                    <div className="text-3xl font-black text-white/90 mb-1">
                      #{item.rank}
                    </div>
                    <div className="text-sm font-bold text-white mb-2 leading-tight">
                      {item.name}
                    </div>
                    <div className="text-2xl font-black text-white">
                      {item.score}
                      <span className="text-xs text-white/70">/368</span>
                    </div>
                    {item.desc && (
                      <p className="text-[10px] text-white/80 mt-1.5 leading-snug">
                        {item.desc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            {/* #4-6 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {top6.slice(3, 6).map((item) => {
                const cfg = LEVEL_CFG[getLevelKey(item.score)];
                return (
                  <div
                    key={item.rank}
                    className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="text-xl font-black text-slate-900 dark:text-slate-100 mb-1">
                      #{item.rank}
                    </div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 leading-tight">
                      {item.name}
                    </div>
                    <div className={`text-2xl font-black ${cfg.score}`}>
                      {item.score}
                      <span className="text-xs text-slate-400">/368</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {cfg.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LÉGENDE */}
        <div className="flex flex-wrap gap-3 p-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-xl">
          {Object.entries(LEVEL_CFG)
            .reverse()
            .map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-sm ${v.dot}`} />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {v.label}
                </span>
                <span className="text-[10px] text-slate-500">{v.range}</span>
              </div>
            ))}
        </div>

        {/* FILTRES */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 transition"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 transition min-w-[160px]"
          >
            <option value="all">Tous les statuts</option>
            <option value="Habilitée">Habilitée</option>
            <option value="Accréditée">Accréditée</option>
            <option value="Non habilitée">Non habilitée</option>
            <option value="Non accréditée">Non accréditée</option>
          </select>
          <span className="text-xs text-slate-500 whitespace-nowrap">
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* TABLEAU */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr>
                  <TH col="pts" align="center">
                    Rang
                  </TH>
                  <TH col="name" align="left">
                    Université
                  </TH>
                  <TH col="type" align="center">
                    Type
                  </TH>
                  <TH col="ville" align="center">
                    Provinces et Régions
                  </TH>
                  <TH col="pts" align="center">
                    Score
                  </TH>
                  <TH align="center">Niveau</TH>
                  <TH align="center">Statuts</TH>
                  <TH align="center">Action</TH>
                </tr>
              </thead>
              <tbody>
                {paged.map((u, idx) => {
                  const lk = getLevelKey(u.pts);
                  const cfg = LEVEL_CFG[lk];
                  const rank = globalRank(u.id);
                  const isLast = idx === paged.length - 1;

                  return (
                    <tr
                      key={u.id}
                      className={`group hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${!isLast ? "border-b border-slate-100 dark:border-slate-800" : ""}`}
                    >
                      {/* Rang */}
                      <td className="px-4 py-4 text-center">
                        <div
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black ${
                            rank <= 3
                              ? cfg.badge
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          }`}
                        >
                          {rank}
                        </div>
                      </td>

                      {/* Nom - sans l'ID en dessous */}
                      <td className="px-4 py-4">
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {u.name}
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            u.type === "Publique"
                              ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                              : "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800"
                          }`}
                        >
                          {u.type}
                        </span>
                      </td>

                      {/* Colonne Provinces et Régions sur 2 lignes */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          {/* Ville */}
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium w-full justify-center border"
                            style={{
                              background: isDark
                                ? "rgba(255,255,255,0.05)"
                                : "#F8FAFC",
                              color: isDark ? "#E2E8F0" : "#475569",
                              borderColor: isDark
                                ? "rgba(255,255,255,0.1)"
                                : "#E2E8F0",
                            }}
                          >
                            <HiOutlineMapPin className="w-3 h-3" />
                            {u.ville || "Non spécifié"}
                          </span>
                          {/* Région */}
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium w-full justify-center border"
                            style={{
                              background: isDark
                                ? "rgba(147, 51, 234, 0.1)"
                                : "#faf5ff",
                              color: isDark ? "#d8b4fe" : "#6b21a8",
                              borderColor: isDark
                                ? "rgba(147, 51, 234, 0.3)"
                                : "#e9d5ff",
                            }}
                          >
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M20 10c0 4.4-8 12-8 12s-8-7.6-8-12a8 8 0 1 1 16 0z" />
                            </svg>
                            {u.region || "Non spécifié"}
                          </span>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-baseline gap-0.5 justify-center">
                          <span className={`text-xl font-black ${cfg.score}`}>
                            {u.pts}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            /368
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-14 mx-auto bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cfg.bar}`}
                            style={{
                              width: `${Math.round((u.pts / 368) * 100)}%`,
                            }}
                          />
                        </div>
                      </td>

                      {/* Niveau */}
                      <td className="px-4 py-4 text-center">
                        <EvalBadge pts={u.pts} />
                      </td>

                      {/* Statuts sur 2 lignes */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          {u.statuses.map((status, index) => {
                            const styles = getStatusStyles(status);
                            return (
                              <div
                                key={index}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap w-full justify-start border"
                                style={{
                                  background: styles.bg,
                                  color: styles.text,
                                  borderColor: isDark
                                    ? "rgba(255,255,255,0.1)"
                                    : "transparent",
                                }}
                              >
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ background: styles.dot }}
                                />
                                {status}
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      {/* Action - Icône seulement */}
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => setSelectedUni(u)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
                          title="Voir les détails"
                        >
                          <HiOutlineEye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm"
                    >
                      <div className="text-3xl mb-2">🔍</div>
                      {search
                        ? `Aucun résultat pour « ${search} »`
                        : "Aucune donnée disponible"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–
                {Math.min(page * PER_PAGE, filtered.length)} sur{" "}
                {filtered.length} établissements
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <HiOutlineChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg border text-xs font-semibold transition ${
                        p === page
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <HiOutlineChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedUni && (
        <UniversityModal
          uni={selectedUni}
          onClose={() => setSelectedUni(null)}
        />
      )}
    </div>
  );
}
