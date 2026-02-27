import React, { useContext } from "react";
import {
  Calendar,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  FileText,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Star,
  Info,
} from "lucide-react";
import { ThemeContext } from "../../../../context/ThemeContext";

const DashboardEtabView = () => {
  const { theme } = useContext(ThemeContext);

  const habilitationData = {
    status: "Actif",
    requestStatus: "Approuvée",
    processingDays: 45,
    startDate: "2020-03-15",
    endDate: "2025-03-15",
    remainingDays: 32,
    daysTotal: 1825,
    renewalDate: "2025-03-15",
    certificateNumber: "HABIL-2020-00542",
    history: [
      {
        date: "2020-03-15",
        status: "Approuvée",
        type: "Habilitation initiale",
        processingDays: 45,
        certificateNumber: "HABIL-2020-00542",
      },
      {
        date: "2019-12-10",
        status: "En traitement",
        type: "Demande initiale",
        processingDays: 30,
        certificateNumber: "-",
      },
      {
        date: "2019-11-05",
        status: "Soumise",
        type: "Dossier de demande",
        processingDays: 0,
        certificateNumber: "-",
      },
    ],
  };

  const accreditationData = {
    requestStatus: "En traitement",
    processingDays: 60,
    currentEval: {
      date: "2024-02-05",
      level: "satisfaisant",
      score: 268,
      totalPoints: 368,
      policies: [
        {
          name: "POLITIQUE DE FORMATION",
          totalScore: 68,
          maxScore: 148,
          level: "faible",
        },
        {
          name: "POLITIQUE DE GOUVERNANCE",
          totalScore: 184,
          maxScore: 204,
          level: "acceptable",
        },
        {
          name: "POLITIQUE DE RECHERCHE",
          totalScore: 16,
          maxScore: 16,
          level: "excellent",
        },
      ],
    },
    accreditationHistory: [
      {
        date: "2024-01-15",
        status: "Accrédité",
        type: "Accréditation",
        validUntil: "2029-01-15",
        certificateNumber: "ACCRED-2024-00123",
      },
      {
        date: "2023-10-20",
        status: "En traitement",
        type: "Demande d'accréditation",
        validUntil: "-",
        certificateNumber: "-",
      },
      {
        date: "2023-08-05",
        status: "Soumise",
        type: "Dossier de demande",
        validUntil: "-",
        certificateNumber: "-",
      },
    ],
    evaluationHistory: [
      {
        date: "2024-02-05",
        level: "satisfaisant",
        score: 268,
        type: "Auto-évaluation",
      },
      {
        date: "2023-11-10",
        level: "acceptable",
        score: 210,
        type: "Auto-évaluation",
      },
      {
        date: "2023-08-22",
        level: "acceptable",
        score: 196,
        type: "Auto-évaluation",
      },
      {
        date: "2023-05-15",
        level: "faible",
        score: 152,
        type: "Auto-évaluation",
      },
      {
        date: "2023-02-03",
        level: "non-conforme",
        score: 78,
        type: "Auto-évaluation",
      },
    ],
    status: "En cours",
    nextEvalDate: "2024-08-05",
  };

  const levelConfig = {
    "non-conforme": {
      color: "bg-red-50 border-red-200",
      badge: "bg-red-100 text-red-800",
      bar: "bg-red-500",
      bgCircle: "#FEE2E2",
      circleColor: "#EF4444",
      icon: AlertTriangle,
      label: "Non conforme",
      range: "< 92",
      appreciation: "Absence d'une politique ou d'un dispositif crédible",
      min: 0,
      max: 91,
    },
    faible: {
      color: "bg-orange-50 border-orange-200",
      badge: "bg-orange-100 text-orange-800",
      bar: "bg-orange-500",
      bgCircle: "#FEF3C7",
      circleColor: "#F97316",
      icon: Zap,
      label: "Faible",
      range: "92 – 183",
      appreciation: "Plusieurs insuffisances majeures",
      min: 92,
      max: 183,
    },
    acceptable: {
      color: "bg-yellow-50 border-yellow-200",
      badge: "bg-yellow-100 text-yellow-800",
      bar: "bg-yellow-500",
      bgCircle: "#FEF9C3",
      circleColor: "#EAB308",
      icon: CheckCircle2,
      label: "Acceptable",
      range: "184 – 256",
      appreciation: "Conformité partielle, dispositifs à consolider",
      min: 184,
      max: 256,
    },
    satisfaisant: {
      color: "bg-blue-50 border-blue-200",
      badge: "bg-blue-100 text-blue-800",
      bar: "bg-blue-500",
      bgCircle: "#DBEAFE",
      circleColor: "#3B82F6",
      icon: CheckCircle2,
      label: "Satisfaisant",
      range: "257 – 311",
      appreciation: "Conformité générale avec quelques points à améliorer",
      min: 257,
      max: 311,
    },
    excellent: {
      color: "bg-green-50 border-green-200",
      badge: "bg-green-100 text-green-800",
      bar: "bg-green-500",
      bgCircle: "#DCFCE7",
      circleColor: "#22C55E",
      icon: Star,
      label: "Excellent",
      range: "312 – 368",
      appreciation: "Très haute qualité, bonnes pratiques institutionnalisées",
      min: 312,
      max: 368,
    },
  };

  const calculateProgress = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const start = new Date(
      new Date(endDate).setFullYear(new Date(endDate).getFullYear() - 5),
    );

    const total = (end - start) / (1000 * 60 * 60 * 24);
    const remaining = (end - today) / (1000 * 60 * 60 * 24);

    return Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    return status === "Actif" ? (
      <CheckCircle className="w-5 h-5" />
    ) : (
      <AlertCircle className="w-5 h-5" />
    );
  };

  const getLevelFromScore = (score) => {
    if (score < 92) return "non-conforme";
    if (score >= 92 && score <= 183) return "faible";
    if (score >= 184 && score <= 256) return "acceptable";
    if (score >= 257 && score <= 311) return "satisfaisant";
    if (score >= 312 && score <= 368) return "excellent";
    return "excellent";
  };

  const PerformanceLinearChart = ({ score, maxScore = 368 }) => {
    const currentLevel = getLevelFromScore(score);

    const thresholds = [
      { value: 0, label: "0", color: "#EF4444" },
      { value: 92, label: "92", color: "#F97316" },
      { value: 184, label: "184", color: "#EAB308" },
      { value: 257, label: "257", color: "#3B82F6" },
      { value: 312, label: "312", color: "#22C55E" },
      { value: 368, label: "368", color: "#22C55E" },
    ];

    const nonConformeWidth = (91 / maxScore) * 100;
    const faibleWidth = ((183 - 92 + 1) / maxScore) * 100;
    const acceptableWidth = ((256 - 184 + 1) / maxScore) * 100;
    const satisfaisantWidth = ((311 - 257 + 1) / maxScore) * 100;
    const excellentWidth = ((368 - 312 + 1) / maxScore) * 100;
    const cursorPosition = (score / maxScore) * 100;

    return (
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Score global
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50">
                    {score}
                  </span>
                  <span className="text-lg sm:text-xl text-slate-400 dark:text-slate-500">
                    / {maxScore}
                  </span>
                </div>
              </div>
            </div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold w-fit ${levelConfig[currentLevel].badge}`}
            >
              {React.createElement(levelConfig[currentLevel].icon, {
                className: "w-5 h-5",
              })}
              <span>{levelConfig[currentLevel].label}</span>
            </div>
          </div>

          <div className="relative mt-8 mb-10">
            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <div className="flex h-full w-full">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-400"
                  style={{ width: `${nonConformeWidth}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                  style={{ width: `${faibleWidth}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400"
                  style={{ width: `${acceptableWidth}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                  style={{ width: `${satisfaisantWidth}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400"
                  style={{ width: `${excellentWidth}%` }}
                />
              </div>
            </div>

            <div className="relative w-full mt-3 hidden sm:block">
              {thresholds.map((threshold, index) => {
                const position = (threshold.value / maxScore) * 100;
                return (
                  <div
                    key={index}
                    className="absolute flex flex-col items-center"
                    style={{
                      left: `${position}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-600" />
                    <span
                      className="text-xs font-bold mt-1.5 px-2 py-1 bg-white dark:bg-slate-900 rounded border"
                      style={{
                        color: threshold.color,
                        borderColor: threshold.color,
                      }}
                    >
                      {threshold.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              className="absolute top-0 flex flex-col items-center transition-all duration-1000 ease-out"
              style={{
                left: `${cursorPosition}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="relative">
                <div className="w-7 h-7 bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-200 rounded-full shadow-lg" />
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shadow-lg">
                  {score} pts
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 sm:hidden">
              Niveaux de performance :
            </p>
            <div className="flex sm:grid sm:grid-cols-5 gap-3 overflow-x-auto pb-2 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
              <div className="flex-shrink-0 w-32 sm:w-full flex flex-col items-center p-3 bg-white dark:bg-slate-900 rounded-lg border border-red-200">
                <div className="w-10 h-10 bg-red-500 rounded-full mb-2 flex items-center justify-center shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-red-700 text-center">
                  Non conforme
                </span>
                <span className="text-xs text-red-600 font-medium mt-1">
                  0-91 pts
                </span>
              </div>

              <div className="flex-shrink-0 w-32 sm:w-full flex flex-col items-center p-3 bg-white dark:bg-slate-900 rounded-lg border border-orange-200">
                <div className="w-10 h-10 bg-orange-500 rounded-full mb-2 flex items-center justify-center shadow-sm">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-orange-700 text-center">
                  Faible
                </span>
                <span className="text-xs text-orange-600 font-medium mt-1">
                  92-183 pts
                </span>
              </div>

              <div className="flex-shrink-0 w-32 sm:w-full flex flex-col items-center p-3 bg-white dark:bg-slate-900 rounded-lg border border-yellow-200">
                <div className="w-10 h-10 bg-yellow-500 rounded-full mb-2 flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-yellow-700 text-center">
                  Acceptable
                </span>
                <span className="text-xs text-yellow-600 font-medium mt-1">
                  184-256 pts
                </span>
              </div>

              <div className="flex-shrink-0 w-32 sm:w-full flex flex-col items-center p-3 bg-white dark:bg-slate-900 rounded-lg border border-blue-200">
                <div className="w-10 h-10 bg-blue-500 rounded-full mb-2 flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-blue-700 text-center">
                  Satisfaisant
                </span>
                <span className="text-xs text-blue-600 font-medium mt-1">
                  257-311 pts
                </span>
              </div>

              <div className="flex-shrink-0 w-32 sm:w-full flex flex-col items-center p-3 bg-white dark:bg-slate-900 rounded-lg border border-green-200">
                <div className="w-10 h-10 bg-green-500 rounded-full mb-2 flex items-center justify-center shadow-sm">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-green-700 text-center">
                  Excellent
                </span>
                <span className="text-xs text-green-600 font-medium mt-1">
                  312-368 pts
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-blue-200 dark:border-slate-700">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex-shrink-0">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                  Appréciation globale
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 italic leading-relaxed">
                  "{levelConfig[currentLevel].appreciation}"
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
            Évaluation du {formatDate(accreditationData.currentEval.date)}
          </p>
        </div>
      </div>
    );
  };

  const NiveauxInstitutionnelsTable = ({ currentLevel }) => {
    const levels = [
      {
        key: "excellent",
        color: "bg-green-500",
        textColor: "text-green-700",
        bgColor: "bg-green-50",
      },
      {
        key: "satisfaisant",
        color: "bg-blue-500",
        textColor: "text-blue-700",
        bgColor: "bg-blue-50",
      },
      {
        key: "acceptable",
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
        bgColor: "bg-yellow-50",
      },
      {
        key: "faible",
        color: "bg-orange-500",
        textColor: "text-orange-700",
        bgColor: "bg-orange-50",
      },
      {
        key: "non-conforme",
        color: "bg-red-500",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
      },
    ];

    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mt-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          Niveau institutionnel
        </h3>

        <div className="block sm:hidden space-y-3">
          {levels.map((level) => {
            const config = levelConfig[level.key];
            const isCurrent = currentLevel === level.key;
            return (
              <div
                key={level.key}
                className={`p-4 rounded-lg border ${
                  isCurrent
                    ? level.bgColor + " border-2"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${level.color}`}
                    />
                    <span
                      className={`font-semibold text-sm ${
                        isCurrent
                          ? level.textColor
                          : "text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {config.label}
                    </span>
                  </div>
                  {isCurrent && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${level.bgColor} ${level.textColor}`}
                    >
                      <CheckCircle className="w-3 h-3" />
                      Actuel
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                  <span className="font-medium">Plage:</span> {config.range} pts
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-medium">Appréciation:</span>{" "}
                  {config.appreciation}
                </p>
              </div>
            );
          })}
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <th className="text-left py-4 px-3 font-semibold text-slate-700 dark:text-slate-300">
                  Niveau
                </th>
                <th className="text-left py-4 px-3 font-semibold text-slate-700 dark:text-slate-300">
                  Plage de points
                </th>
                <th className="text-left py-4 px-3 font-semibold text-slate-700 dark:text-slate-300">
                  Appréciation globale
                </th>
                <th className="text-left py-4 px-3 font-semibold text-slate-700 dark:text-slate-300">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {levels.map((level) => {
                const config = levelConfig[level.key];
                const isCurrent = currentLevel === level.key;
                return (
                  <tr
                    key={level.key}
                    className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      isCurrent ? `${level.bgColor}` : ""
                    }`}
                  >
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${level.color}`}
                        />
                        <span
                          className={`font-medium ${
                            isCurrent
                              ? level.textColor
                              : "text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          {config.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-3 font-medium">
                      {config.range}
                    </td>
                    <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                      {config.appreciation}
                    </td>
                    <td className="py-4 px-3">
                      {isCurrent && (
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${level.bgColor} ${level.textColor}`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Niveau actuel
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-5 p-4 bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 rounded-lg">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <span className="font-semibold">Votre établissement : </span>
              Score de {accreditationData.currentEval.score}/368 - Niveau{" "}
              <span className="font-bold">
                {
                  levelConfig[
                    getLevelFromScore(accreditationData.currentEval.score)
                  ].label
                }
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const HabilitationCard = () => (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 w-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Habilitation
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {habilitationData.certificateNumber}
          </p>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-sm ${
            habilitationData.status === "Actif"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {getStatusIcon(habilitationData.status)}
          {habilitationData.status}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Durée restante
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-50">
              {habilitationData.remainingDays} jours
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              style={{
                width: `${calculateProgress(habilitationData.endDate)}%`,
              }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Valide jusqu'au {formatDate(habilitationData.endDate)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
              Émise le
            </p>
            <p className="font-semibold text-slate-900 dark:text-slate-50 text-sm">
              {formatDate(habilitationData.startDate)}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
              Expire le
            </p>
            <p className="font-semibold text-slate-900 dark:text-slate-50 text-sm">
              {formatDate(habilitationData.endDate)}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-100 dark:border-slate-700 col-span-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
              Renouvellement
            </p>
            <p className="font-semibold text-slate-900 dark:text-slate-50 text-sm">
              {formatDate(habilitationData.renewalDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const HabilitationHistory = () => (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Historique Habilitation
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {habilitationData.history.length} dossiers soumis
          </p>
        </div>
        <FileText className="w-5 h-5 text-slate-400" />
      </div>

      <div className="space-y-3">
        {habilitationData.history.map((item, idx) => {
          const isLatest = idx === 0;
          const statusConfig = {
            Approuvée: {
              bg: "bg-green-50",
              border: "border-green-200",
              badge: "bg-green-100 text-green-800",
              icon: CheckCircle,
            },
            "En traitement": {
              bg: "bg-blue-50",
              border: "border-blue-200",
              badge: "bg-blue-100 text-blue-800",
              icon: Clock,
            },
            Soumise: {
              bg: "bg-slate-50",
              border: "border-slate-200",
              badge: "bg-slate-100 text-slate-800",
              icon: FileText,
            },
          };
          const config = statusConfig[item.status];

          return (
            <div
              key={idx}
              className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${config.badge} flex-shrink-0`}
                >
                  {React.createElement(config.icon, { className: "w-5 h-5" })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-50 text-sm">
                        {item.type}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {formatDate(item.date)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {item.status}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.certificateNumber}
                      </p>
                    </div>
                  </div>
                  {isLatest && (
                    <div className="mt-2 inline-block px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                      Actuel
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const AccreditationWithChart = () => {
    const current = accreditationData.currentEval;
    const currentLevel = getLevelFromScore(current.score);

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-0">
          <PerformanceLinearChart score={current.score} maxScore={368} />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            Évaluation des Politiques
          </h3>
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                  POLITIQUE DE FORMATION
                </h4>
                <span className="text-sm font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
                  {current.policies[0].totalScore} pts
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-orange-500"
                  style={{
                    width: `${
                      (current.policies[0].totalScore /
                        current.policies[0].maxScore) *
                      100
                    }%`,
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600 dark:text-slate-300">
                  Score: {current.policies[0].totalScore}/
                  {current.policies[0].maxScore}
                </span>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                  Faible
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                  POLITIQUE DE GOUVERNANCE
                </h4>
                <span className="text-sm font-bold text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full">
                  {current.policies[1].totalScore} pts
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-yellow-500"
                  style={{
                    width: `${
                      (current.policies[1].totalScore /
                        current.policies[1].maxScore) *
                      100
                    }%`,
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600 dark:text-slate-300">
                  Score: {current.policies[1].totalScore}/
                  {current.policies[1].maxScore}
                </span>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                  Acceptable
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                  POLITIQUE DE RECHERCHE
                </h4>
                <span className="text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  {current.policies[2].totalScore} pts
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${
                      (current.policies[2].totalScore /
                        current.policies[2].maxScore) *
                      100
                    }%`,
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600 dark:text-slate-300">
                  Score: {current.policies[2].totalScore}/
                  {current.policies[2].maxScore}
                </span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  Excellent
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-blue-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-blue-800 dark:text-blue-200 text-sm">
                  TOTAL GÉNÉRAL
                </span>
                <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {current.policies.reduce(
                    (acc, policy) => acc + policy.totalScore,
                    0,
                  )}{" "}
                  / 368 pts
                </span>
              </div>
              <div className="w-full bg-blue-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${(current.score / 368) * 100}%` }}
                />
              </div>
              <div className="flex justify-end mt-2">
                <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                  Niveau {levelConfig[currentLevel].label}
                </span>
              </div>
            </div>
          </div>
        </div>

        <NiveauxInstitutionnelsTable currentLevel={currentLevel} />
      </div>
    );
  };

  const AccreditationUnifiedHistory = () => (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Historique Accréditation
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {accreditationData.evaluationHistory.length +
              accreditationData.accreditationHistory.length}{" "}
            entrées
          </p>
        </div>
        <TrendingUp className="w-5 h-5 text-slate-400" />
      </div>

      <div className="space-y-3">
        {accreditationData.accreditationHistory.map((item, idx) => {
          const isLatest = idx === 0;
          const statusConfig = {
            Accrédité: {
              bg: "bg-green-50",
              border: "border-green-200",
              badge: "bg-green-100 text-green-800",
              icon: CheckCircle,
            },
            "En traitement": {
              bg: "bg-blue-50",
              border: "border-blue-200",
              badge: "bg-blue-100 text-blue-800",
              icon: Clock,
            },
            Soumise: {
              bg: "bg-slate-50",
              border: "border-slate-200",
              badge: "bg-slate-100 text-slate-800",
              icon: FileText,
            },
          };
          const config = statusConfig[item.status];

          return (
            <div
              key={`accred-${idx}`}
              className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${config.badge} flex-shrink-0`}
                >
                  {React.createElement(config.icon, { className: "w-5 h-5" })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-50 text-sm">
                        {item.type}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {formatDate(item.date)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {item.status}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.validUntil !== "-"
                          ? `Valide jusqu'au`
                          : item.certificateNumber}
                      </p>
                    </div>
                  </div>
                  {item.validUntil !== "-" && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {formatDate(item.validUntil)}
                    </p>
                  )}
                  {isLatest && (
                    <div className="mt-2 inline-block px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
                      Actuel
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {accreditationData.evaluationHistory.map((evaluation, idx) => {
          const config = levelConfig[evaluation.level];
          const isLatest = idx === 0;

          return (
            <div
              key={`eval-${idx}`}
              className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${config.badge} flex-shrink-0`}
                >
                  {React.createElement(config.icon, { className: "w-5 h-5" })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-50 text-sm">
                        Auto-évaluation
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {formatDate(evaluation.date)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
                        {evaluation.score}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {config.label}
                      </p>
                    </div>
                  </div>
                  {isLatest && (
                    <div className="mt-2 inline-block px-2 py-1 bg-slate-700 text-white text-xs font-medium rounded">
                      Récent
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              Tableau de Bord
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Habilitation & Accréditation
            </p>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                Vue d'ensemble
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/40 flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Habilitation
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                      {habilitationData.remainingDays}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      jours restants
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/40 flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Accréditation
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                      {accreditationData.currentEval.score}{" "}
                      <span className="text-base font-medium text-slate-500 dark:text-slate-400">
                        / 368
                      </span>
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      score total
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/40 flex-shrink-0">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Politiques
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                      {accreditationData.currentEval.policies.length}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      évaluées
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/40 flex-shrink-0">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Traitement
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                      {accreditationData.processingDays}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      jours estimés
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                Habilitation
              </h2>
              <div className="space-y-4">
                <HabilitationCard />
                <HabilitationHistory />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                Accréditation
              </h2>
              <AccreditationWithChart />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                Historique
              </h2>
              <AccreditationUnifiedHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEtabView;
