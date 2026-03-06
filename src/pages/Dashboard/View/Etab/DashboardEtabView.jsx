import React, { useContext, useState, useEffect } from "react";
import {
  Calendar, Award, TrendingUp, Clock, CheckCircle, AlertCircle,
  BarChart3, FileText, AlertTriangle, Zap, CheckCircle2, Star,
  Info, Loader2, RefreshCw, XCircle, PauseCircle,
} from "lucide-react";
import { ThemeContext } from "../../../../context/ThemeContext";
import accreditationServices, {
  getMyAutoEvaluations,
  getAutoEvaluation,
  getMyDemandes,
  getStatutLibelle,
} from "../../../../services/accreditation.services";

// ── Helpers ───────────────────────────────────────────────────────────────────

const getLevelKey = (score) => {
  if (score < 92)   return "non-conforme";
  if (score <= 183) return "faible";
  if (score <= 256) return "acceptable";
  if (score <= 311) return "satisfaisant";
  return "excellent";
};

const daysSince = (dateStr) => {
  if (!dateStr) return null;
  const diff = new Date() - new Date(dateStr);
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

const buildEvalSummary = (ev) => {
  if (!ev) return null;
  const policyMap = {
    FORMATION:   { name: "POLITIQUE DE FORMATION",   maxScore: 148, totalScore: 0 },
    GOUVERNANCE: { name: "POLITIQUE DE GOUVERNANCE", maxScore: 204, totalScore: 0 },
    RECHERCHE:   { name: "POLITIQUE DE RECHERCHE",   maxScore: 16,  totalScore: 0 },
  };
  const criteres = ev.criteres || [];
  criteres.forEach((c) => {
    const pol = (c.politique || "").toUpperCase();
    if (pol.includes("FORMATION"))        policyMap.FORMATION.totalScore   += Number(c.note) || 0;
    else if (pol.includes("GOUVERNANCE")) policyMap.GOUVERNANCE.totalScore += Number(c.note) || 0;
    else if (pol.includes("RECHERCHE"))   policyMap.RECHERCHE.totalScore   += Number(c.note) || 0;
    else {
      const num = parseInt((c.critere_id || c.numero || "0").toString().replace(/[^0-9]/g, "")) || 0;
      if (num <= 37)      policyMap.FORMATION.totalScore   += Number(c.note) || 0;
      else if (num <= 88) policyMap.GOUVERNANCE.totalScore += Number(c.note) || 0;
      else                policyMap.RECHERCHE.totalScore   += Number(c.note) || 0;
    }
  });
  const fromCriteres = Object.values(policyMap).reduce((s, p) => s + p.totalScore, 0);
  const backendScore = Number(ev.score_total ?? ev.total_notes ?? ev.score ?? null);
  const totalScore   = backendScore > 0 ? backendScore : fromCriteres;
  return {
    date:        ev.updated_at || ev.created_at || new Date().toISOString(),
    score:       totalScore,
    totalPoints: 368,
    policies:    Object.values(policyMap).map((p) => ({ ...p, level: getLevelKey(p.totalScore) })),
  };
};

// ── Config statut demande ─────────────────────────────────────────────────────
const getDemandeStatusConfig = (rawStatut) => {
  const s = (rawStatut || "").toLowerCase();
  if (s === "accredite") return { badge: "bg-green-100 text-green-800",   icon: CheckCircle,  label: "Accrédité",  iconBg: "bg-green-50 dark:bg-green-900/40",   iconColor: "text-green-600"  };
  if (s === "en_cours")  return { badge: "bg-blue-100 text-blue-800",     icon: Clock,        label: "En cours",   iconBg: "bg-blue-50 dark:bg-blue-900/40",     iconColor: "text-blue-600"   };
  if (s === "brouillon") return { badge: "bg-slate-100 text-slate-700",   icon: FileText,     label: "Brouillon",  iconBg: "bg-slate-100 dark:bg-slate-800",     iconColor: "text-slate-500"  };
  if (s === "rejetee")   return { badge: "bg-red-100 text-red-800",       icon: XCircle,      label: "Rejeté",     iconBg: "bg-red-50 dark:bg-red-900/40",       iconColor: "text-red-600"    };
  if (s === "ajourne")   return { badge: "bg-orange-100 text-orange-800", icon: PauseCircle,  label: "Ajourné",    iconBg: "bg-orange-50 dark:bg-orange-900/40", iconColor: "text-orange-600" };
  return                        { badge: "bg-slate-100 text-slate-600",   icon: FileText,     label: rawStatut || "—", iconBg: "bg-slate-100 dark:bg-slate-800", iconColor: "text-slate-500"  };
};

// ─────────────────────────────────────────────────────────────────────────────

const DashboardEtabView = () => {
  const { theme } = useContext(ThemeContext);

  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const [habilitationData, setHabilitationData] = useState({
    status: "Actif",
    requestStatus: "Approuvée",
    processingDays: 45,
    startDate: "2020-03-15",
    endDate: "2025-03-15",
    remainingDays: daysUntil("2025-03-15"),
    daysTotal: 1825,
    renewalDate: "2025-03-15",
    certificateNumber: "HABIL-2020-00542",
    history: [
      { date: "2020-03-15", status: "Approuvée",     type: "Habilitation initiale", processingDays: 45, certificateNumber: "HABIL-2020-00542" },
      { date: "2019-12-10", status: "En traitement", type: "Demande initiale",      processingDays: 30, certificateNumber: "-" },
      { date: "2019-11-05", status: "Soumise",        type: "Dossier de demande",    processingDays: 0,  certificateNumber: "-" },
    ],
  });

  const [accreditationData, setAccreditationData] = useState({
    requestStatus: "—",
    processingDays: null,
    submissionDate: null,
    currentEval: {
      date: null,
      level: "non-conforme",
      score: 0,
      totalPoints: 368,
      policies: [
        { name: "POLITIQUE DE FORMATION",   totalScore: 0, maxScore: 148, level: "non-conforme" },
        { name: "POLITIQUE DE GOUVERNANCE", totalScore: 0, maxScore: 204, level: "non-conforme" },
        { name: "POLITIQUE DE RECHERCHE",   totalScore: 0, maxScore: 16,  level: "non-conforme" },
      ],
    },
    accreditationHistory: [],
    evaluationHistory: [],
    status: "—",
    nextEvalDate: null,
  });

  // ── Chargement API ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [rawDemandes, rawAutoEvals] = await Promise.all([
          getMyDemandes(),
          getMyAutoEvaluations(),
        ]);

        const demandes  = Array.isArray(rawDemandes)  ? rawDemandes  : (rawDemandes?.data  ?? rawDemandes?.results  ?? []);
        const autoEvals = Array.isArray(rawAutoEvals) ? rawAutoEvals : (rawAutoEvals?.data ?? rawAutoEvals?.results ?? []);

        console.log(`[Dashboard] demandes=${demandes.length}  autoEvals=${autoEvals.length}`);

        const accredHistory = [...demandes]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((d) => ({
            date:              d.submitted_at || d.created_at,
            status:            getStatutLibelle(d.statut),
            rawStatut:         d.statut,
            type:              "Demande d'accréditation",
            validUntil:        d.date_fin_accreditation || "-",
            certificateNumber: d.numero_demande         || "-",
            notes:             d.notes                  || null,
          }));

        const latestDemande = demandes.reduce(
          (latest, d) => (!latest || new Date(d.created_at) > new Date(latest.created_at) ? d : latest),
          null
        );

        const isSubmitted    = latestDemande?.statut && latestDemande.statut !== "brouillon";
        const submissionDate =
          latestDemande?.submitted_at ||
          (isSubmitted ? latestDemande?.updated_at || latestDemande?.created_at : null) ||
          null;
        const processingDays = submissionDate ? daysSince(submissionDate) : null;

        const evalHistory = [...autoEvals]
          .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
          .map((ev) => {
            const score = Number(ev.score_total ?? ev.total_notes ?? ev.score) || 0;
            return {
              date:         ev.updated_at || ev.created_at,
              level:        getLevelKey(score),
              score,
              isComplete:   ev.is_complete === true,
              type:         "Auto-évaluation",
              critereCount: ev.criteres_completes ?? null,
            };
          });

        const latestEvalMeta = autoEvals.find((ev) => ev.is_complete === true) || autoEvals[0] || null;
        let evalSummary = null;
        if (latestEvalMeta?.id) {
          try {
            const fullEval = await getAutoEvaluation(latestEvalMeta.id);
            evalSummary    = buildEvalSummary(fullEval);
          } catch {
            evalSummary = buildEvalSummary(latestEvalMeta);
          }
        }

        setAccreditationData((prev) => ({
          ...prev,
          requestStatus:        latestDemande ? getStatutLibelle(latestDemande.statut) : "—",
          submissionDate,
          processingDays,
          accreditationHistory: accredHistory,
          evaluationHistory:    evalHistory,
          status:               latestDemande ? getStatutLibelle(latestDemande.statut) : "—",
          currentEval: evalSummary
            ? {
                date:        evalSummary.date,
                level:       getLevelKey(evalSummary.score),
                score:       evalSummary.score,
                totalPoints: 368,
                policies:    evalSummary.policies,
              }
            : prev.currentEval,
        }));
      } catch (err) {
        console.error("[DashboardEtabView] Erreur:", err);
        setError("Impossible de charger les données. Vérifiez votre connexion.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── levelConfig ─────────────────────────────────────────────────────────────
  const levelConfig = {
    "non-conforme": {
      color: "bg-red-50 border-red-200",       badge: "bg-red-100 text-red-800",
      bar: "bg-red-500",                       icon: AlertTriangle,
      label: "Non conforme", range: "< 92",
      appreciation: "Absence d'une politique ou d'un dispositif crédible",
    },
    faible: {
      color: "bg-orange-50 border-orange-200", badge: "bg-orange-100 text-orange-800",
      bar: "bg-orange-500",                    icon: Zap,
      label: "Faible", range: "92 – 183",
      appreciation: "Plusieurs insuffisances majeures",
    },
    acceptable: {
      color: "bg-yellow-50 border-yellow-200", badge: "bg-yellow-100 text-yellow-800",
      bar: "bg-yellow-500",                    icon: CheckCircle2,
      label: "Acceptable", range: "184 – 256",
      appreciation: "Conformité partielle, dispositifs à consolider",
    },
    satisfaisant: {
      color: "bg-blue-50 border-blue-200",     badge: "bg-blue-100 text-blue-800",
      bar: "bg-blue-500",                      icon: CheckCircle2,
      label: "Satisfaisant", range: "257 – 311",
      appreciation: "Conformité générale avec quelques points à améliorer",
    },
    excellent: {
      color: "bg-green-50 border-green-200",   badge: "bg-green-100 text-green-800",
      bar: "bg-green-500",                     icon: Star,
      label: "Excellent", range: "312 – 368",
      appreciation: "Très haute qualité, bonnes pratiques institutionnalisées",
    },
  };

  const calculateProgress = (endDate) => {
    const today = new Date(), end = new Date(endDate);
    const start = new Date(new Date(endDate).setFullYear(new Date(endDate).getFullYear() - 5));
    const total = (end - start) / 86400000, remaining = (end - today) / 86400000;
    return Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
  };

  const getStatusIcon = (status) =>
    status === "Actif" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />;

  const getLevelFromScore = getLevelKey;

  // ── PerformanceLinearChart ───────────────────────────────────────────────────
  const PerformanceLinearChart = ({ score, maxScore = 368 }) => {
    const currentLevel = getLevelFromScore(score);
    const thresholds   = [
      { value: 0,   label: "0",   color: "#EF4444" },
      { value: 92,  label: "92",  color: "#F97316" },
      { value: 184, label: "184", color: "#EAB308" },
      { value: 257, label: "257", color: "#3B82F6" },
      { value: 312, label: "312", color: "#22C55E" },
      { value: 368, label: "368", color: "#22C55E" },
    ];
    const segments = [
      { w: (91 / maxScore) * 100,             cls: "from-red-500 to-red-400"      },
      { w: ((183 - 92 + 1)  / maxScore) * 100, cls: "from-orange-500 to-orange-400" },
      { w: ((256 - 184 + 1) / maxScore) * 100, cls: "from-yellow-500 to-yellow-400" },
      { w: ((311 - 257 + 1) / maxScore) * 100, cls: "from-blue-500 to-blue-400"    },
      { w: ((368 - 312 + 1) / maxScore) * 100, cls: "from-green-500 to-green-400"  },
    ];
    const cursor = (score / maxScore) * 100;

    return (
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Score global</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50">{score}</span>
                  <span className="text-lg sm:text-xl text-slate-400 dark:text-slate-500">/ {maxScore}</span>
                </div>
              </div>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold w-fit ${levelConfig[currentLevel].badge}`}>
              {React.createElement(levelConfig[currentLevel].icon, { className: "w-5 h-5" })}
              <span>{levelConfig[currentLevel].label}</span>
            </div>
          </div>

          <div className="relative mt-8 mb-10">
            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <div className="flex h-full w-full">
                {segments.map((s, i) => (
                  <div key={i} className={`h-full bg-gradient-to-r ${s.cls}`} style={{ width: `${s.w}%` }} />
                ))}
              </div>
            </div>
            <div className="relative w-full mt-3 hidden sm:block">
              {thresholds.map((t, i) => (
                <div key={i} className="absolute flex flex-col items-center" style={{ left: `${(t.value / maxScore) * 100}%`, transform: "translateX(-50%)" }}>
                  <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-600" />
                  <span className="text-xs font-bold mt-1.5 px-2 py-1 bg-white dark:bg-slate-900 rounded border" style={{ color: t.color, borderColor: t.color }}>{t.label}</span>
                </div>
              ))}
            </div>
            <div className="absolute top-0 flex flex-col items-center transition-all duration-1000" style={{ left: `${cursor}%`, transform: "translateX(-50%)" }}>
              <div className="relative">
                <div className="w-7 h-7 bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-200 rounded-full shadow-lg" />
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shadow-lg">
                  {score} pts
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex sm:grid sm:grid-cols-5 gap-3 overflow-x-auto pb-2 sm:pb-0">
              {[
                { cls: "red",    label: "Non conforme", pts: "0-91",    Icon: AlertTriangle },
                { cls: "orange", label: "Faible",       pts: "92-183",  Icon: Zap           },
                { cls: "yellow", label: "Acceptable",   pts: "184-256", Icon: CheckCircle2  },
                { cls: "blue",   label: "Satisfaisant", pts: "257-311", Icon: CheckCircle2  },
                { cls: "green",  label: "Excellent",    pts: "312-368", Icon: Star          },
              ].map(({ cls, label, pts, Icon }) => (
                <div key={cls} className={`flex-shrink-0 w-32 sm:w-full flex flex-col items-center p-3 bg-white dark:bg-slate-900 rounded-lg border border-${cls}-200`}>
                  <div className={`w-10 h-10 bg-${cls}-500 rounded-full mb-2 flex items-center justify-center shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-xs font-bold text-${cls}-700 text-center`}>{label}</span>
                  <span className={`text-xs text-${cls}-600 font-medium mt-1`}>{pts} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-blue-200 dark:border-slate-700">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex-shrink-0">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">Appréciation globale</p>
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

  // ── NiveauxInstitutionnelsTable ──────────────────────────────────────────────
  const NiveauxInstitutionnelsTable = ({ currentLevel }) => {
    const levels = [
      { key: "excellent",    color: "bg-green-500",  textColor: "text-green-700",  bgColor: "bg-green-50"  },
      { key: "satisfaisant", color: "bg-blue-500",   textColor: "text-blue-700",   bgColor: "bg-blue-50"   },
      { key: "acceptable",   color: "bg-yellow-500", textColor: "text-yellow-700", bgColor: "bg-yellow-50" },
      { key: "faible",       color: "bg-orange-500", textColor: "text-orange-700", bgColor: "bg-orange-50" },
      { key: "non-conforme", color: "bg-red-500",    textColor: "text-red-700",    bgColor: "bg-red-50"    },
    ];
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mt-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          Niveau institutionnel
        </h3>
        {/* Mobile */}
        <div className="block sm:hidden space-y-3">
          {levels.map((level) => {
            const config    = levelConfig[level.key];
            const isCurrent = currentLevel === level.key;
            return (
              <div key={level.key} className={`p-4 rounded-lg border ${isCurrent ? level.bgColor + " border-2" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${level.color}`} />
                    <span className={`font-semibold text-sm ${isCurrent ? level.textColor : "text-slate-700 dark:text-slate-200"}`}>{config.label}</span>
                  </div>
                  {isCurrent && (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${level.bgColor} ${level.textColor}`}>
                      <CheckCircle className="w-3 h-3" /> Actuel
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-1"><span className="font-medium">Plage :</span> {config.range} pts</p>
                <p className="text-sm text-slate-600 dark:text-slate-300"><span className="font-medium">Appréciation :</span> {config.appreciation}</p>
              </div>
            );
          })}
        </div>
        {/* Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <th className="text-left py-4 px-3 font-semibold text-slate-700 dark:text-slate-300">Niveau</th>
                <th className="text-left py-4 px-3 font-semibold text-slate-700 dark:text-slate-300">Plage de points</th>
                <th className="text-left py-4 px-3 font-semibold text-slate-700 dark:text-slate-300">Appréciation globale</th>
                <th className="text-left py-4 px-3 font-semibold text-slate-700 dark:text-slate-300">Statut</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((level) => {
                const config    = levelConfig[level.key];
                const isCurrent = currentLevel === level.key;
                return (
                  <tr key={level.key} className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${isCurrent ? level.bgColor : ""}`}>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${level.color}`} />
                        <span className={`font-medium ${isCurrent ? level.textColor : "text-slate-700 dark:text-slate-200"}`}>{config.label}</span>
                      </div>
                    </td>
                    <td className="py-4 px-3 font-medium">{config.range}</td>
                    <td className="py-4 px-3 text-slate-600 dark:text-slate-300">{config.appreciation}</td>
                    <td className="py-4 px-3">
                      {isCurrent && (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${level.bgColor} ${level.textColor}`}>
                          <CheckCircle className="w-4 h-4" /> Niveau actuel
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
              Score de {accreditationData.currentEval.score}/368 — Niveau{" "}
              <span className="font-bold">{levelConfig[getLevelFromScore(accreditationData.currentEval.score)].label}</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ── HabilitationCard ─────────────────────────────────────────────────────────
  const HabilitationCard = () => (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 w-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">Habilitation</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{habilitationData.certificateNumber}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-sm ${habilitationData.status === "Actif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {getStatusIcon(habilitationData.status)}
          {habilitationData.status}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Durée restante</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-50">{habilitationData.remainingDays} jours</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500" style={{ width: `${calculateProgress(habilitationData.endDate)}%` }} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Valide jusqu'au {formatDate(habilitationData.endDate)}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[["Émise le", habilitationData.startDate], ["Expire le", habilitationData.endDate]].map(([label, date]) => (
            <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{label}</p>
              <p className="font-semibold text-slate-900 dark:text-slate-50 text-sm">{formatDate(date)}</p>
            </div>
          ))}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-100 dark:border-slate-700 col-span-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Renouvellement</p>
            <p className="font-semibold text-slate-900 dark:text-slate-50 text-sm">{formatDate(habilitationData.renewalDate)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // ── HabilitationHistory ──────────────────────────────────────────────────────
  const HabilitationHistory = () => (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Historique Habilitation</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{habilitationData.history.length} dossiers soumis</p>
        </div>
        <FileText className="w-5 h-5 text-slate-400" />
      </div>
      <div className="space-y-3">
        {habilitationData.history.map((item, idx) => {
          const isLatest = idx === 0;
          const cfgMap   = {
            "Approuvée":     { badge: "bg-green-100 text-green-800",  icon: CheckCircle },
            "En traitement": { badge: "bg-blue-100 text-blue-800",    icon: Clock       },
            "Soumise":       { badge: "bg-slate-100 text-slate-800",  icon: FileText    },
          };
          const cfg = cfgMap[item.status] || cfgMap["Soumise"];
          return (
            <div key={idx} className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${cfg.badge} flex-shrink-0`}>
                  {React.createElement(cfg.icon, { className: "w-5 h-5" })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-50 text-sm">{item.type}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{formatDate(item.date)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{item.status}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.certificateNumber}</p>
                    </div>
                  </div>
                  {isLatest && <div className="mt-2 inline-block px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">Actuel</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── getPolicyColorConfig ─────────────────────────────────────────────────────
  const getPolicyColorConfig = (score, max) => {
    const ratio = max > 0 ? score / max : 0;
    if (ratio >= 0.90) return { bar: "bg-green-500",  badge: "text-green-700 bg-green-50",   border: "border-green-200"  };
    if (ratio >= 0.75) return { bar: "bg-blue-500",   badge: "text-blue-700 bg-blue-50",     border: "border-blue-200"   };
    if (ratio >= 0.50) return { bar: "bg-yellow-500", badge: "text-yellow-700 bg-yellow-50", border: "border-yellow-200" };
    if (ratio >= 0.25) return { bar: "bg-orange-500", badge: "text-orange-700 bg-orange-50", border: "border-orange-200" };
    return                    { bar: "bg-red-500",    badge: "text-red-700 bg-red-50",       border: "border-red-200"    };
  };

  // ── AccreditationWithChart ───────────────────────────────────────────────────
  const AccreditationWithChart = () => {
    const current      = accreditationData.currentEval;
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
            {current.policies.map((policy, idx) => {
              const pct    = policy.maxScore > 0 ? Math.round((policy.totalScore / policy.maxScore) * 100) : 0;
              const colors = getPolicyColorConfig(policy.totalScore, policy.maxScore);
              return (
                <div key={idx} className={`bg-white dark:bg-slate-900 rounded-lg p-4 border dark:border-slate-700 ${colors.border}`}>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{policy.name}</h4>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${colors.badge}`}>
                      {policy.totalScore} / {policy.maxScore} pts
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className={`h-full transition-all duration-700 ${colors.bar}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-end mt-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>{pct}%</span>
                  </div>
                </div>
              );
            })}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-blue-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-blue-800 dark:text-blue-200 text-sm">TOTAL GÉNÉRAL</span>
                <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {current.policies.reduce((acc, p) => acc + p.totalScore, 0)} / 368 pts
                </span>
              </div>
              <div className="w-full bg-blue-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${(current.score / 368) * 100}%` }} />
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

  // ── AccreditationUnifiedHistory ──────────────────────────────────────────────
  const AccreditationUnifiedHistory = () => {
    const totalEntries =
      accreditationData.evaluationHistory.length +
      accreditationData.accreditationHistory.length;
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 w-full">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Historique Accréditation</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {loading ? "Chargement…" : `${totalEntries} entrée${totalEntries > 1 ? "s" : ""}`}
            </p>
          </div>
          <TrendingUp className="w-5 h-5 text-slate-400" />
        </div>

        {/* Demandes */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            Soumission de dossier
            {accreditationData.accreditationHistory.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                {accreditationData.accreditationHistory.length}
              </span>
            )}
          </h4>
          <div className="space-y-3">
            {loading && (
              <div className="flex items-center gap-2 text-sm text-slate-400 px-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Chargement…
              </div>
            )}
            {!loading && accreditationData.accreditationHistory.length === 0 && (
              <p className="text-sm text-slate-400 italic px-2">Aucune demande soumise.</p>
            )}
            {accreditationData.accreditationHistory.map((item, idx) => {
              const isLatest = idx === 0;
              const cfg = getDemandeStatusConfig(item.rawStatut);
              return (
                <div key={`accred-${idx}`} className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${cfg.badge} flex-shrink-0`}>
                      {React.createElement(cfg.icon, { className: "w-5 h-5" })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-50 text-sm">{item.type}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{formatDate(item.date)}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
                            {cfg.label}
                          </span>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.certificateNumber}</p>
                        </div>
                      </div>
                      {item.notes && (
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded px-2 py-1 italic">
                          📝 {item.notes}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {isLatest && (
                          <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">Actuel</span>
                        )}
                        {isLatest && accreditationData.processingDays !== null && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                            <Clock className="w-3 h-3" />
                            {accreditationData.processingDays} j depuis le dépôt
                          </span>
                        )}
                        {item.validUntil && item.validUntil !== "-" && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            <Calendar className="w-3 h-3" />
                            Valide jusqu'au {formatDate(item.validUntil)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Auto-évaluations */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-500" />
            Historique auto-évaluation
            {accreditationData.evaluationHistory.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                {accreditationData.evaluationHistory.length}
              </span>
            )}
          </h4>
          <div className="space-y-3">
            {!loading && accreditationData.evaluationHistory.length === 0 && (
              <p className="text-sm text-slate-400 italic px-2">Aucune auto-évaluation enregistrée.</p>
            )}
            {accreditationData.evaluationHistory.map((evaluation, idx) => {
              const config   = levelConfig[evaluation.level] || levelConfig["non-conforme"];
              const isLatest = idx === 0;
              return (
                <div key={`eval-${idx}`} className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${config.badge} flex-shrink-0`}>
                      {React.createElement(config.icon, { className: "w-5 h-5" })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-50 text-sm">Auto-évaluation</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{formatDate(evaluation.date)}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{evaluation.score}</p>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${config.badge}`}>
                            {config.label}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {isLatest && (
                          <span className="inline-block px-2 py-1 bg-slate-700 text-white text-xs font-medium rounded">Récent</span>
                        )}
                        {evaluation.isComplete ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            <CheckCircle className="w-3 h-3" /> Complète
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                            <AlertCircle className="w-3 h-3" /> En cours
                          </span>
                        )}
                        {evaluation.critereCount !== null && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {evaluation.critereCount}/92 critères
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ── Rendu principal ──────────────────────────────────────────────────────────
  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-gray-950">

        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Tableau de Bord</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Habilitation & Accréditation</p>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" /> Chargement…
              </div>
            )}
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-2 inline-flex items-center gap-1 text-xs text-red-700 dark:text-red-300 underline hover:no-underline">
                <RefreshCw className="w-3 h-3" /> Réessayer
              </button>
            </div>
          </div>
        )}

        <div className="px-6 py-6">
          <div className="space-y-8">

            {/* ── Vue d'ensemble ── */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">Vue d'ensemble</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

                {/* Card 1 — Habilitation */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/40 flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Habilitation</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{habilitationData.remainingDays}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">jours restants</p>
                  </div>
                </div>

                {/* Card 2 — Score */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/40 flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Accréditation</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                      {accreditationData.currentEval.score}{" "}
                      <span className="text-base font-medium text-slate-500 dark:text-slate-400">/ 368</span>
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">score total</p>
                  </div>
                </div>

                {/* Card 3 — Politiques */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/40 flex-shrink-0">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Politiques</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                      {accreditationData.currentEval.policies.length}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">évaluées</p>
                  </div>
                </div>

                {/* Card 4 — Traitement */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/40 flex-shrink-0">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Traitement</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                      {accreditationData.processingDays !== null ? accreditationData.processingDays : "—"}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {accreditationData.processingDays !== null ? "jours depuis le dépôt" : "Pas encore soumis"}
                    </p>
                    {accreditationData.submissionDate && (
                      <p className="text-xs text-orange-500 dark:text-orange-400 mt-0.5">
                        Soumis le {formatDate(accreditationData.submissionDate)}
                      </p>
                    )}
                  </div>
                </div>

                {/* ✅ Card 5 — Statut du dossier */}
                {(() => {
                  const latest  = accreditationData.accreditationHistory[0] || null;
                  const raw     = latest?.rawStatut || null;
                  const cfg     = getDemandeStatusConfig(raw);
                  const numero  = latest?.certificateNumber || null;
                  return (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex items-center gap-4">
                      <div className={`p-3 rounded-lg flex-shrink-0 ${cfg.iconBg}`}>
                        {React.createElement(cfg.icon, { className: `w-6 h-6 ${cfg.iconColor}` })}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Statut du dossier</p>
                        {raw ? (
                          <>
                            <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-sm font-semibold ${cfg.badge}`}>
                              {cfg.label}
                            </span>
                            {numero && (
                              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate" title={numero}>
                                {numero}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="text-2xl font-bold text-slate-400 dark:text-slate-500 mt-1">—</p>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Aucun dossier</p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()}

              </div>
            </div>

            {/* ── Habilitation ── */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">Habilitation</h2>
              <div className="space-y-4">
                <HabilitationCard />
                <HabilitationHistory />
              </div>
            </div>

            {/* ── Accréditation ── */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">Accréditation</h2>
              <AccreditationWithChart />
            </div>

            {/* ── Historique ── */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">Historique</h2>
              <AccreditationUnifiedHistory />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEtabView;
