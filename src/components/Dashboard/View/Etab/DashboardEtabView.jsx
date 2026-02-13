import React from "react";
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

const DashboardEtabView = () => {
  // Données simulées - Habilitation
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
        certificateNumber: "HABIL-2020-00542"
      },
      { 
        date: "2019-12-10", 
        status: "En traitement", 
        type: "Demande initiale",
        processingDays: 30,
        certificateNumber: "-"
      },
      { 
        date: "2019-11-05", 
        status: "Soumise", 
        type: "Dossier de demande",
        processingDays: 0,
        certificateNumber: "-"
      },
    ],
  };

  // Données simulées - Accréditation
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
        certificateNumber: "ACCRED-2024-00123"
      },
      { 
        date: "2023-10-20", 
        status: "En traitement", 
        type: "Demande d'accréditation",
        validUntil: "-",
        certificateNumber: "-"
      },
      { 
        date: "2023-08-05", 
        status: "Soumise", 
        type: "Dossier de demande",
        validUntil: "-",
        certificateNumber: "-"
      },
    ],
    evaluationHistory: [
      { date: "2024-02-05", level: "satisfaisant", score: 268, type: "Auto-évaluation" },
      { date: "2023-11-10", level: "acceptable", score: 210, type: "Auto-évaluation" },
      { date: "2023-08-22", level: "acceptable", score: 196, type: "Auto-évaluation" },
      { date: "2023-05-15", level: "faible", score: 152, type: "Auto-évaluation" },
      { date: "2023-02-03", level: "non-conforme", score: 78, type: "Auto-évaluation" },
    ],
    status: "En cours",
    nextEvalDate: "2024-08-05",
  };

  // Mapping des niveaux de performance pour l'accréditation (368 points)
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

  // COMPOSANT PERFORMANCE CHART - OPTIMISÉ MOBILE
  const PerformanceLinearChart = ({ score, maxScore = 368 }) => {
    const currentLevel = getLevelFromScore(score);
    
    const thresholds = [
      { value: 0, label: "0", color: "#EF4444" },
      { value: 92, label: "92", color: "#F97316" },
      { value: 184, label: "184", color: "#EAB308" },
      { value: 257, label: "257", color: "#3B82F6" },
      { value: 312, label: "312", color: "#22C55E" },
      { value: 368, label: "368", color: "#22C55E" }
    ];

    const nonConformeWidth = (91 / maxScore) * 100;
    const faibleWidth = ((183 - 92 + 1) / maxScore) * 100;
    const acceptableWidth = ((256 - 184 + 1) / maxScore) * 100;
    const satisfaisantWidth = ((311 - 257 + 1) / maxScore) * 100;
    const excellentWidth = ((368 - 312 + 1) / maxScore) * 100;
    const cursorPosition = (score / maxScore) * 100;

    return (
      <div className="flex flex-col items-center justify-center w-full">
        {/* KPI Score - Carte principale */}
        <div className="w-full bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-4 shadow-lg">
          {/* Header avec score et badge */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Score global</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-4xl font-bold text-slate-900">{score}</span>
                  <span className="text-xs sm:text-base text-slate-400">/ {maxScore}</span>
                </div>
              </div>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold w-fit ${levelConfig[currentLevel].badge}`}>
              {React.createElement(levelConfig[currentLevel].icon, { className: "w-3.5 h-3.5" })}
              <span>{levelConfig[currentLevel].label}</span>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="relative mt-6 mb-8">
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div className="flex h-full w-full">
                <div className="h-full bg-gradient-to-r from-red-500 to-red-400" style={{ width: `${nonConformeWidth}%` }} />
                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400" style={{ width: `${faibleWidth}%` }} />
                <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400" style={{ width: `${acceptableWidth}%` }} />
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: `${satisfaisantWidth}%` }} />
                <div className="h-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: `${excellentWidth}%` }} />
              </div>
            </div>

            {/* Marqueurs de seuils - Version mobile avec moins d'affichage */}
            <div className="relative w-full mt-2 hidden sm:block">
              {thresholds.map((threshold, index) => {
                const position = (threshold.value / maxScore) * 100;
                return (
                  <div 
                    key={index}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="w-0.5 h-3 bg-slate-300"></div>
                    <span className="text-[10px] font-bold mt-1 px-1 py-0.5 bg-white rounded border" 
                      style={{ color: threshold.color, borderColor: threshold.color }}>
                      {threshold.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Curseur de position */}
            <div 
              className="absolute top-0 flex flex-col items-center transition-all duration-1000 ease-out"
              style={{ left: `${cursorPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="relative">
                <div className="w-5 h-5 bg-white border-3 border-slate-900 rounded-full shadow-lg"></div>
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap shadow-lg">
                  {score} pts
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-1.5 h-1.5 bg-slate-900"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Légende des couleurs - Scroll horizontal sur mobile */}
          <div className="mt-6">
            <p className="text-xs font-medium text-slate-700 mb-2 sm:hidden">Niveaux de performance :</p>
            <div className="flex sm:grid sm:grid-cols-5 gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
              {/* Non conforme */}
              <div className="flex-shrink-0 w-28 sm:w-full flex flex-col items-center p-2 bg-white rounded-lg border border-red-200">
                <div className="w-8 h-8 bg-red-500 rounded-full mb-1 flex items-center justify-center shadow-sm">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <span className="text-[11px] font-bold text-red-700 text-center">Non conforme</span>
                <span className="text-[9px] text-red-600 font-medium mt-0.5">0-91 pts</span>
              </div>
              
              {/* Faible */}
              <div className="flex-shrink-0 w-28 sm:w-full flex flex-col items-center p-2 bg-white rounded-lg border border-orange-200">
                <div className="w-8 h-8 bg-orange-500 rounded-full mb-1 flex items-center justify-center shadow-sm">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-[11px] font-bold text-orange-700 text-center">Faible</span>
                <span className="text-[9px] text-orange-600 font-medium mt-0.5">92-183 pts</span>
              </div>
              
              {/* Acceptable */}
              <div className="flex-shrink-0 w-28 sm:w-full flex flex-col items-center p-2 bg-white rounded-lg border border-yellow-200">
                <div className="w-8 h-8 bg-yellow-500 rounded-full mb-1 flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-[11px] font-bold text-yellow-700 text-center">Acceptable</span>
                <span className="text-[9px] text-yellow-600 font-medium mt-0.5">184-256 pts</span>
              </div>
              
              {/* Satisfaisant */}
              <div className="flex-shrink-0 w-28 sm:w-full flex flex-col items-center p-2 bg-white rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-blue-500 rounded-full mb-1 flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-[11px] font-bold text-blue-700 text-center">Satisfaisant</span>
                <span className="text-[9px] text-blue-600 font-medium mt-0.5">257-311 pts</span>
              </div>
              
              {/* Excellent */}
              <div className="flex-shrink-0 w-28 sm:w-full flex flex-col items-center p-2 bg-white rounded-lg border border-green-200">
                <div className="w-8 h-8 bg-green-500 rounded-full mb-1 flex items-center justify-center shadow-sm">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <span className="text-[11px] font-bold text-green-700 text-center">Excellent</span>
                <span className="text-[9px] text-green-600 font-medium mt-0.5">312-368 pts</span>
              </div>
            </div>
          </div>

          {/* Appréciation */}
          <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-800 mb-0.5">Appréciation globale</p>
                <p className="text-xs text-blue-700 italic leading-relaxed">
                  "{levelConfig[currentLevel].appreciation}"
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-500 mt-3">
            Évaluation du {formatDate(accreditationData.currentEval.date)}
          </p>
        </div>
      </div>
    );
  };

  // COMPOSANT TABLEAU DES NIVEAUX INSTITUTIONNELS - OPTIMISÉ MOBILE
  const NiveauxInstitutionnelsTable = ({ currentLevel }) => {
    const levels = [
      { key: "excellent", color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50" },
      { key: "satisfaisant", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50" },
      { key: "acceptable", color: "bg-yellow-500", textColor: "text-yellow-700", bgColor: "bg-yellow-50" },
      { key: "faible", color: "bg-orange-500", textColor: "text-orange-700", bgColor: "bg-orange-50" },
      { key: "non-conforme", color: "bg-red-500", textColor: "text-red-700", bgColor: "bg-red-50" },
    ];

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mt-4">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-600" />
          Niveau institutionnel
        </h3>
        
        {/* Version mobile - Cartes */}
        <div className="block sm:hidden space-y-2">
          {levels.map((level) => {
            const config = levelConfig[level.key];
            const isCurrent = currentLevel === level.key;
            return (
              <div 
                key={level.key}
                className={`p-3 rounded-lg border ${isCurrent ? level.bgColor + ' border-2' : 'bg-white border-slate-200'}`}
                style={{ borderColor: isCurrent ? level.color.replace('bg-', '').replace('-500', '-500') : undefined }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${level.color}`}></div>
                    <span className={`font-semibold text-xs ${isCurrent ? level.textColor : 'text-slate-700'}`}>
                      {config.label}
                    </span>
                  </div>
                  {isCurrent && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${level.bgColor} ${level.textColor}`}>
                      <CheckCircle className="w-2.5 h-2.5" />
                      Actuel
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mb-0.5">
                  <span className="font-medium">Plage:</span> {config.range} pts
                </p>
                <p className="text-xs text-slate-600">
                  <span className="font-medium">Appréciation:</span> {config.appreciation}
                </p>
              </div>
            );
          })}
        </div>

        {/* Version desktop - Tableau */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-2 font-semibold text-slate-700">Niveau</th>
                <th className="text-left py-3 px-2 font-semibold text-slate-700">Plage de points</th>
                <th className="text-left py-3 px-2 font-semibold text-slate-700">Appréciation globale</th>
                <th className="text-left py-3 px-2 font-semibold text-slate-700">Statut</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((level) => {
                const config = levelConfig[level.key];
                const isCurrent = currentLevel === level.key;
                return (
                  <tr 
                    key={level.key} 
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                      isCurrent ? `${level.bgColor}` : ''
                    }`}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                        <span className={`font-medium ${isCurrent ? level.textColor : 'text-slate-700'}`}>
                          {config.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-medium">{config.range}</td>
                    <td className="py-3 px-2 text-slate-600 text-sm">{config.appreciation}</td>
                    <td className="py-3 px-2">
                      {isCurrent && (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${level.bgColor} ${level.textColor}`}>
                          <CheckCircle className="w-3 h-3" />
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
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              <span className="font-semibold">Votre établissement : </span>
              Score de {accreditationData.currentEval.score}/368 - Niveau <span className="font-bold">{levelConfig[getLevelFromScore(accreditationData.currentEval.score)].label}</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Composant - Carte Habilitation optimisée mobile
  const HabilitationCard = () => (
    <div className="bg-white rounded-xl border border-slate-200 p-4 w-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Habilitation
          </h3>
          <p className="text-[10px] text-slate-500">
            {habilitationData.certificateNumber}
          </p>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full font-medium text-[10px] ${habilitationData.status === "Actif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {getStatusIcon(habilitationData.status)}
          {habilitationData.status}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-slate-700">
              Durée restante
            </span>
            <span className="text-[11px] font-bold text-slate-900">
              {habilitationData.remainingDays} jours
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              style={{ width: `${calculateProgress(habilitationData.endDate)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Valide jusqu'au {formatDate(habilitationData.endDate)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
            <p className="text-[9px] text-slate-500 uppercase tracking-wide mb-0.5">
              Émise le
            </p>
            <p className="font-semibold text-slate-900 text-[11px]">
              {formatDate(habilitationData.startDate)}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
            <p className="text-[9px] text-slate-500 uppercase tracking-wide mb-0.5">
              Expire le
            </p>
            <p className="font-semibold text-slate-900 text-[11px]">
              {formatDate(habilitationData.endDate)}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 col-span-2">
            <p className="text-[9px] text-slate-500 uppercase tracking-wide mb-0.5">
              Renouvellement
            </p>
            <p className="font-semibold text-slate-900 text-[11px]">
              {formatDate(habilitationData.renewalDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Composant - Historique Habilitation optimisé mobile
  const HabilitationHistory = () => (
    <div className="bg-white rounded-xl border border-slate-200 p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Historique Habilitation
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {habilitationData.history.length} dossiers soumis
          </p>
        </div>
        <FileText className="w-4 h-4 text-slate-400" />
      </div>

      <div className="space-y-2">
        {habilitationData.history.map((item, idx) => {
          const isLatest = idx === 0;
          const statusConfig = {
            "Approuvée": { bg: "bg-green-50", border: "border-green-200", badge: "bg-green-100 text-green-800", icon: CheckCircle },
            "En traitement": { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-800", icon: Clock },
            "Soumise": { bg: "bg-slate-50", border: "border-slate-200", badge: "bg-slate-100 text-slate-800", icon: FileText },
          };
          const config = statusConfig[item.status];

          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${
                isLatest
                  ? config.bg + " " + config.border
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-start gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${config.badge} flex-shrink-0`}>
                  {React.createElement(config.icon, { className: "w-3.5 h-3.5" })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <p className="font-medium text-slate-900 text-xs">
                        {item.type}
                      </p>
                      <p className="text-[10px] text-slate-500">{formatDate(item.date)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] font-semibold text-slate-900">
                        {item.status}
                      </p>
                      <p className="text-[8px] text-slate-500">{item.certificateNumber}</p>
                    </div>
                  </div>
                  {isLatest && (
                    <div className="mt-1 inline-block px-1.5 py-0.5 bg-blue-600 text-white text-[8px] font-medium rounded">
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

  // Composant - Accréditation avec nouveau style - optimisé mobile
  const AccreditationWithChart = () => {
    const current = accreditationData.currentEval;
    const currentLevel = getLevelFromScore(current.score);

    return (
      <div className="space-y-4">
        {/* Graphe linéaire de performance */}
        <div className="bg-white rounded-xl border border-slate-200 p-0">
          <PerformanceLinearChart score={current.score} maxScore={368} />
        </div>

        {/* Évaluation des Politiques - optimisé mobile */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            Évaluation des Politiques
          </h3>
          <div className="space-y-3">
            {/* Politique de Formation */}
            <div className="bg-white rounded-lg p-3 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-slate-800 text-xs">
                  POLITIQUE DE FORMATION
                </h4>
                <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
                  {current.policies[0].totalScore} pts
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-orange-500"
                  style={{ width: `${(current.policies[0].totalScore / current.policies[0].maxScore) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] text-gray-600">
                  Score: {current.policies[0].totalScore}/{current.policies[0].maxScore}
                </span>
                <span className="text-[9px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                  Faible
                </span>
              </div>
            </div>

            {/* Politique de Gouvernance */}
            <div className="bg-white rounded-lg p-3 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-slate-800 text-xs">
                  POLITIQUE DE GOUVERNANCE
                </h4>
                <span className="text-xs font-bold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">
                  {current.policies[1].totalScore} pts
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${(current.policies[1].totalScore / current.policies[1].maxScore) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] text-gray-600">
                  Score: {current.policies[1].totalScore}/{current.policies[1].maxScore}
                </span>
                <span className="text-[9px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                  Acceptable
                </span>
              </div>
            </div>

            {/* Politique de Recherche */}
            <div className="bg-white rounded-lg p-3 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-slate-800 text-xs">
                  POLITIQUE DE RECHERCHE
                </h4>
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                  {current.policies[2].totalScore} pts
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(current.policies[2].totalScore / current.policies[2].maxScore) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] text-gray-600">
                  Score: {current.policies[2].totalScore}/{current.policies[2].maxScore}
                </span>
                <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  Excellent
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-blue-800 text-xs">TOTAL GÉNÉRAL</span>
                <span className="text-base font-bold text-blue-700">
                  {current.policies.reduce((acc, policy) => acc + policy.totalScore, 0)} / 368 pts
                </span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${(current.score / 368) * 100}%` }}
                />
              </div>
              <div className="flex justify-end mt-1.5">
                <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  Niveau {levelConfig[currentLevel].label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TABLEAU DES NIVEAUX INSTITUTIONNELS */}
        <NiveauxInstitutionnelsTable currentLevel={currentLevel} />
      </div>
    );
  };

  // Composant - Historique Unifié Accréditation - optimisé mobile
  const AccreditationUnifiedHistory = () => (
    <div className="bg-white rounded-xl border border-slate-200 p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Historique Accréditation
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {accreditationData.evaluationHistory.length + accreditationData.accreditationHistory.length} entrées
          </p>
        </div>
        <TrendingUp className="w-4 h-4 text-slate-400" />
      </div>

      <div className="space-y-2">
        {/* Historique des demandes d'accréditation */}
        {accreditationData.accreditationHistory.map((item, idx) => {
          const isLatest = idx === 0;
          const statusConfig = {
            "Accrédité": { bg: "bg-green-50", border: "border-green-200", badge: "bg-green-100 text-green-800", icon: CheckCircle },
            "En traitement": { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-800", icon: Clock },
            "Soumise": { bg: "bg-slate-50", border: "border-slate-200", badge: "bg-slate-100 text-slate-800", icon: FileText },
          };
          const config = statusConfig[item.status];

          return (
            <div
              key={`accred-${idx}`}
              className={`p-3 rounded-lg border ${
                isLatest
                  ? config.bg + " " + config.border
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-start gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${config.badge} flex-shrink-0`}>
                  {React.createElement(config.icon, { className: "w-3.5 h-3.5" })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <p className="font-medium text-slate-900 text-xs">
                        {item.type}
                      </p>
                      <p className="text-[10px] text-slate-500">{formatDate(item.date)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] font-semibold text-slate-900">
                        {item.status}
                      </p>
                      <p className="text-[8px] text-slate-500">
                        {item.validUntil !== "-" ? `Valide jusqu'au` : item.certificateNumber}
                      </p>
                    </div>
                  </div>
                  {item.validUntil !== "-" && (
                    <p className="text-[8px] text-slate-500 mt-0.5">
                      {formatDate(item.validUntil)}
                    </p>
                  )}
                  {isLatest && (
                    <div className="mt-1 inline-block px-1.5 py-0.5 bg-green-600 text-white text-[8px] font-medium rounded">
                      Actuel
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Historique des auto-évaluations */}
        {accreditationData.evaluationHistory.map((evaluation, idx) => {
          const config = levelConfig[evaluation.level];
          const isLatest = idx === 0;

          return (
            <div
              key={`eval-${idx}`}
              className={`p-3 rounded-lg border ${
                isLatest
                  ? config.color + " border-opacity-60"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-start gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${config.badge} flex-shrink-0`}>
                  {React.createElement(config.icon, { className: "w-3.5 h-3.5" })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <p className="font-medium text-slate-900 text-xs">
                        Auto-évaluation
                      </p>
                      <p className="text-[10px] text-slate-500">{formatDate(evaluation.date)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-900">
                        {evaluation.score}
                      </p>
                      <p className="text-[8px] text-slate-500">{config.label}</p>
                    </div>
                  </div>
                  {isLatest && (
                    <div className="mt-1 inline-block px-1.5 py-0.5 bg-slate-700 text-white text-[8px] font-medium rounded">
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
    <div className="min-h-screen bg-white">
      {/* Header optimisé mobile */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <h1 className="text-base font-semibold text-slate-900">
            Tableau de Bord
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Habilitation & Accréditation
          </p>
        </div>
      </div>

      {/* Main Content - Optimisé mobile */}
      <div className="px-4 py-4">
        <div className="space-y-5">
          {/* Vue d'ensemble - Statistiques */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3">
              Vue d'ensemble
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Habilitation - Jours Restants */}
              <div className="bg-white rounded-lg border border-slate-200 p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-blue-50">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">Habilitation</span>
                </div>
                <p className="text-xl font-bold text-slate-900 mb-0.5">
                  {habilitationData.remainingDays}
                </p>
                <p className="text-[9px] text-slate-500">
                  jours restants
                </p>
              </div>

              {/* Accréditation - Score */}
              <div className="bg-white rounded-lg border border-slate-200 p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-green-50">
                    <BarChart3 className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">Accréditation</span>
                </div>
                <p className="text-xl font-bold text-slate-900 mb-0.5">
                  {accreditationData.currentEval.score}
                </p>
                <p className="text-[9px] text-slate-500">
                  score /368
                </p>
              </div>

              {/* Politiques Évaluées */}
              <div className="bg-white rounded-lg border border-slate-200 p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-purple-50">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">Politiques</span>
                </div>
                <p className="text-xl font-bold text-slate-900 mb-0.5">
                  {accreditationData.currentEval.policies.length}
                </p>
                <p className="text-[9px] text-slate-500">
                  évaluées
                </p>
              </div>

              {/* Jours de Traitement */}
              <div className="bg-white rounded-lg border border-slate-200 p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-orange-50">
                    <Calendar className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">Traitement</span>
                </div>
                <p className="text-xl font-bold text-slate-900 mb-0.5">
                  {accreditationData.processingDays}
                </p>
                <p className="text-[9px] text-slate-500">
                  jours estimés
                </p>
              </div>
            </div>
          </div>

          {/* Habilitation */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3">
              Habilitation
            </h2>
            <div className="space-y-3">
              <HabilitationCard />
              <HabilitationHistory />
            </div>
          </div>

          {/* Accréditation */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3">
              Accréditation
            </h2>
            <AccreditationWithChart />
          </div>

          {/* Historique */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3">
              Historique
            </h2>
            <AccreditationUnifiedHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEtabView;