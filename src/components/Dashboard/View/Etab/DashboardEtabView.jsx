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
      level: "excellent",
      score: 92,
      policies: [
        {
          name: "LA POLITIQUE DE FORMATION",
          totalScore: 95,
          level: "excellent",
        },
        {
          name: "LA POLITIQUE DE GOUVERNANCE",
          totalScore: 88,
          level: "satisfait",
        },
        {
          name: "LA POLITIQUE DE RECHERCHE",
          totalScore: 92,
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
      { date: "2024-02-05", level: "excellent", score: 92, type: "Auto-évaluation" },
      { date: "2023-11-10", level: "satisfait", score: 78, type: "Auto-évaluation" },
      { date: "2023-08-22", level: "satisfait", score: 76, type: "Auto-évaluation" },
      { date: "2023-05-15", level: "faible", score: 65, type: "Auto-évaluation" },
      { date: "2023-02-03", level: "insuffisant", score: 52, type: "Auto-évaluation" },
    ],
    status: "En cours",
    nextEvalDate: "2024-08-05",
  };

  // Mapping des niveaux de performance
  const levelConfig = {
    insuffisant: {
      color: "bg-red-50 border-red-200",
      badge: "bg-red-100 text-red-800",
      bar: "bg-red-500",
      bgCircle: "#FEE2E2",
      circleColor: "#EF4444",
      icon: AlertTriangle,
      label: "Insuffisant",
      range: "0-50",
      min: 0,
      max: 50,
    },
    faible: {
      color: "bg-orange-50 border-orange-200",
      badge: "bg-orange-100 text-orange-800",
      bar: "bg-orange-500",
      bgCircle: "#FEF3C7",
      circleColor: "#F97316",
      icon: Zap,
      label: "Faible",
      range: "51-70",
      min: 51,
      max: 70,
    },
    satisfait: {
      color: "bg-blue-50 border-blue-200",
      badge: "bg-blue-100 text-blue-800",
      bar: "bg-blue-500",
      bgCircle: "#DBEAFE",
      circleColor: "#3B82F6",
      icon: CheckCircle2,
      label: "Satisfait",
      range: "71-85",
      min: 71,
      max: 85,
    },
    excellent: {
      color: "bg-green-50 border-green-200",
      badge: "bg-green-100 text-green-800",
      bar: "bg-green-500",
      bgCircle: "#DCFCE7",
      circleColor: "#22C55E",
      icon: Star,
      label: "Excellent",
      range: "86-100",
      min: 86,
      max: 100,
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

  // Composant - Graphe en demi-cercle comme tableau de bord de voiture
  const PerformanceCircleChart = ({ score, level }) => {
    // Calculer l'angle pour le demi-cercle (0° = bas gauche, 180° = bas droite)
    const getArrowRotation = () => {
      // Score 0-100 mappé sur 0-180 degrés
      return (score / 100) * 180;
    };

    const arrowRotation = getArrowRotation();

    return (
      <div className="flex flex-col items-center justify-center">
        {/* Graphe en demi-cercle */}
        <div className="relative w-80 h-48 mb-6">
          <svg
            viewBox="0 0 280 160"
            className="w-full h-full"
            style={{ 
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
              animation: "fadeIn 0.6s ease-out"
            }}
          >
            <defs>
              {/* Gradients pour chaque niveau */}
              <linearGradient id="gradInsuffisant" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#FCA5A5" />
              </linearGradient>
              <linearGradient id="gradFaible" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#FDB17C" />
              </linearGradient>
              <linearGradient id="gradSatisfait" x1="100%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#93C5FD" />
              </linearGradient>
              <linearGradient id="gradExcellent" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#86EFAC" />
              </linearGradient>
            </defs>

            {/* Arc 1: Insuffisant (0-50) - Rouge */}
            <path
              d="M 30,140 A 110,110 0 0,1 85,36"
              fill="none"
              stroke="url(#gradInsuffisant)"
              strokeWidth="28"
              strokeLinecap="round"
              opacity="0.95"
              style={{
                animation: "arcAppear 1s ease-out 0.1s both"
              }}
            />

            {/* Arc 2: Faible (51-70) - Orange */}
            <path
              d="M 85,36 A 110,110 0 0,1 140,20"
              fill="none"
              stroke="url(#gradFaible)"
              strokeWidth="28"
              strokeLinecap="round"
              opacity="0.95"
              style={{
                animation: "arcAppear 1s ease-out 0.2s both"
              }}
            />

            {/* Arc 3: Satisfait (71-85) - Bleu */}
            <path
              d="M 140,20 A 110,110 0 0,1 195,36"
              fill="none"
              stroke="url(#gradSatisfait)"
              strokeWidth="28"
              strokeLinecap="round"
              opacity="0.95"
              style={{
                animation: "arcAppear 1s ease-out 0.3s both"
              }}
            />

            {/* Arc 4: Excellent (86-100) - Vert */}
            <path
              d="M 195,36 A 110,110 0 0,1 250,140"
              fill="none"
              stroke="url(#gradExcellent)"
              strokeWidth="28"
              strokeLinecap="round"
              opacity="0.95"
              style={{
                animation: "arcAppear 1s ease-out 0.4s both"
              }}
            />

            {/* Marqueurs de graduation */}
            <line x1="30" y1="140" x2="36" y2="134" stroke="#999" strokeWidth="2" />
            <line x1="250" y1="140" x2="244" y2="134" stroke="#999" strokeWidth="2" />
            <line x1="140" y1="20" x2="140" y2="28" stroke="#999" strokeWidth="2" />
          </svg>

          {/* Labels des niveaux */}
          <div className="absolute bottom-2 left-2">
            <div className="bg-white px-2.5 py-1 rounded-lg shadow-sm border border-red-100">
              <p className="text-[10px] font-semibold text-red-700">0</p>
              <p className="text-[9px] text-red-500 text-center">Insuffisant</p>
            </div>
          </div>

          <div className="absolute top-8 left-16">
            <div className="bg-white px-2.5 py-1 rounded-lg shadow-sm border border-orange-100">
              <p className="text-[10px] font-semibold text-orange-700">50</p>
              <p className="text-[9px] text-orange-500">Faible</p>
            </div>
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <div className="bg-white px-2.5 py-1 rounded-lg shadow-sm border border-blue-100">
              <p className="text-[10px] font-semibold text-blue-700 text-center">70-85</p>
              <p className="text-[9px] text-blue-500 text-center">Satisfait</p>
            </div>
          </div>

          <div className="absolute top-8 right-16">
            <div className="bg-white px-2.5 py-1 rounded-lg shadow-sm border border-green-100">
              <p className="text-[10px] font-semibold text-green-700">85+</p>
              <p className="text-[9px] text-green-500">Excellent</p>
            </div>
          </div>

          <div className="absolute bottom-2 right-2">
            <div className="bg-white px-2.5 py-1 rounded-lg shadow-sm border border-green-100">
              <p className="text-[10px] font-semibold text-green-700">100</p>
            </div>
          </div>

          {/* Flèche indicatrice */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ marginBottom: '20px' }}>
            <div
              style={{
                transform: `rotate(${arrowRotation - 90}deg)`,
                transition: "transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transformOrigin: "bottom center",
              }}
            >
              <div className="relative flex items-end justify-center" style={{ width: '4px', height: '95px' }}>
                {/* Ligne de l'aiguille */}
                <div
                  className="absolute bg-gradient-to-t from-slate-900 to-slate-700 rounded-full"
                  style={{
                    width: "4px",
                    height: "95px",
                    bottom: "0px",
                    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.3)",
                  }}
                />

                {/* Pointe triangulaire */}
                <div
                  className="absolute"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "8px solid transparent",
                    borderRight: "8px solid transparent",
                    borderBottom: "12px solid rgb(15, 23, 42)",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%) rotate(180deg)",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                  }}
                />
              </div>
            </div>

            {/* Cercle central pivot */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border-4 border-white"
              style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)" }}
            />
          </div>
        </div>

        {/* Score et niveau actuel */}
        <div className="text-center mt-4">
          <div className="text-5xl font-bold bg-gradient-to-br from-slate-700 to-slate-900 bg-clip-text text-transparent mb-3" 
               style={{ animation: "scoreAppear 0.8s ease-out 0.5s both" }}>
            {score}
          </div>
          <div
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm ${levelConfig[level].badge} shadow-sm`}
            style={{ animation: "badgeAppear 0.6s ease-out 0.8s both" }}
          >
            {React.createElement(levelConfig[level].icon, {
              className: "w-5 h-5",
            })}
            {levelConfig[level].label}
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes arcAppear {
            from {
              opacity: 0;
              stroke-dasharray: 1000;
              stroke-dashoffset: 1000;
            }
            to {
              opacity: 0.95;
              stroke-dasharray: 1000;
              stroke-dashoffset: 0;
            }
          }

          @keyframes scoreAppear {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes badgeAppear {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    );
  };

  // Composant - Carte Habilitation (SANS BOUTON)
  const HabilitationCard = () => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Habilitation
          </h3>
          <p className="text-xs text-slate-500">
            {habilitationData.certificateNumber}
          </p>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full font-medium text-xs ${habilitationData.status === "Actif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {getStatusIcon(habilitationData.status)}
          {habilitationData.status}
        </div>
      </div>

      <div className="space-y-4">
        {/* Barre de progression */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-700">
              Durée restante
            </span>
            <span className="text-xs font-bold text-slate-900">
              {habilitationData.remainingDays} jours
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              style={{
                width: `${calculateProgress(habilitationData.endDate)}%`,
              }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Valide jusqu'au {formatDate(habilitationData.endDate)}
          </p>
        </div>

        {/* Grille d'informations */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
              Émise le
            </p>
            <p className="font-semibold text-slate-900 text-sm">
              {formatDate(habilitationData.startDate)}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
              Expire le
            </p>
            <p className="font-semibold text-slate-900 text-sm">
              {formatDate(habilitationData.endDate)}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 col-span-2">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
              Renouvellement
            </p>
            <p className="font-semibold text-slate-900 text-sm">
              {formatDate(habilitationData.renewalDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Composant - Historique Habilitation
  const HabilitationHistory = () => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Historique des Demandes d'Habilitation
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {habilitationData.history.length} dossiers soumis
          </p>
        </div>
        <FileText className="w-5 h-5 text-slate-400" />
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
              className={`flex items-center justify-between p-3 rounded-lg border transition-all text-sm ${
                isLatest
                  ? config.bg + " " + config.border
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${config.badge}`}>
                  {React.createElement(config.icon, { className: "w-4 h-4" })}
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-xs">
                    {item.type}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-900">
                    {item.status}
                  </p>
                  <p className="text-xs text-slate-500">{item.certificateNumber}</p>
                </div>
                {isLatest && (
                  <div className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                    Actuel
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Composant - Accréditation avec graphe (SANS BOUTON)
  const AccreditationWithChart = () => {
    const current = accreditationData.currentEval;

    return (
      <div className="space-y-6">
        {/* Graphe circulaire de performance */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-8 text-center">
            Résultat de l'Auto-évaluation
          </h3>
          <PerformanceCircleChart score={current.score} level={current.level} />
          <p className="text-center text-xs text-slate-500 mt-6">
            Évaluation du {formatDate(current.date)}
          </p>
        </div>

        {/* Politiques */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Évaluation des Politiques
          </h3>
          <div className="space-y-3">
            {current.policies.map((policy, idx) => {
              return (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 border border-blue-200 transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-900 text-sm">
                      {policy.name}
                    </h4>
                    <span className="text-sm font-bold text-blue-600">
                      {policy.totalScore} pts
                    </span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden mt-2">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${policy.totalScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Composant - Historique Unifié Accréditation
  const AccreditationUnifiedHistory = () => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Historique Accréditation
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {accreditationData.evaluationHistory.length + accreditationData.accreditationHistory.length} entrées au total
          </p>
        </div>
        <TrendingUp className="w-5 h-5 text-slate-400" />
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
              className={`flex items-center justify-between p-3 rounded-lg border transition-all text-sm ${
                isLatest
                  ? config.bg + " " + config.border
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${config.badge}`}>
                  {React.createElement(config.icon, { className: "w-4 h-4" })}
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-xs">
                    {item.type}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-900">
                    {item.status}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.validUntil !== "-" ? `Valide jusqu'au ${formatDate(item.validUntil)}` : item.certificateNumber}
                  </p>
                </div>
                {isLatest && (
                  <div className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
                    Actuel
                  </div>
                )}
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
              className={`flex items-center justify-between p-3 rounded-lg border transition-all text-sm ${
                isLatest
                  ? config.color + " border-opacity-60"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${config.badge}`}
                >
                  {React.createElement(config.icon, { className: "w-4 h-4" })}
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-xs">
                    Auto-évaluation
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(evaluation.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">
                    {evaluation.score}
                  </p>
                  <p className="text-xs text-slate-500">{config.label} ({config.range})</p>
                </div>
                {isLatest && (
                  <div className="px-2 py-1 bg-slate-700 text-white text-xs font-medium rounded">
                    Récent
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Composant - Statistiques
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 mb-1">
              Tableau de Bord Établissement
            </h1>
            <p className="text-sm text-slate-500">
              Gestion de votre habilitation et accréditation
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* Vue d'ensemble - Statistiques Principales */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Vue d'ensemble
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Habilitation - Jours Restants */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">
                      Habilitation
                    </p>
                    <p className="text-sm text-slate-600 mb-3">
                      Jours restants
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-3">
                  {habilitationData.remainingDays}
                </p>
                <p className="text-xs text-slate-500">
                  Statut: {habilitationData.requestStatus}
                </p>
              </div>

              {/* Accréditation - Score */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">
                      Accréditation
                    </p>
                    <p className="text-sm text-slate-600 mb-3">
                      Score d'évaluation
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-3">
                  {accreditationData.currentEval.score}%
                </p>
                <p className="text-xs text-slate-500">
                  Statut: {accreditationData.requestStatus}
                </p>
              </div>

              {/* Politiques Évaluées */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">
                      Accréditation
                    </p>
                    <p className="text-sm text-slate-600 mb-3">
                      Politiques évaluées
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-3">
                  {accreditationData.currentEval.policies.length}
                </p>
                <p className="text-xs text-slate-500">
                  Niveau: {accreditationData.currentEval.level}
                </p>
              </div>

              {/* Jours de Traitement */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">
                      Traitement
                    </p>
                    <p className="text-sm text-slate-600 mb-3">Jours estimés</p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-50">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-3">
                  {accreditationData.processingDays}
                </p>
                <p className="text-xs text-slate-500">Accréditation en cours</p>
              </div>
            </div>
          </div>

          {/* Habilitation - Détails complets */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Habilitation
            </h2>
            <div className="space-y-6">
              <HabilitationCard />
              <HabilitationHistory />
            </div>
          </div>

          {/* Accréditation - Détails complets */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Accréditation
            </h2>
            <AccreditationWithChart />
          </div>

          {/* Historique Accréditation Unifié */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
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