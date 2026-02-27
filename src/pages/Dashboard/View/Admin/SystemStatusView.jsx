import React, { useState, useEffect, useContext, useRef } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaServer,
  FaDatabase,
  FaEnvelope,
  FaHdd,
  FaCircle,
  FaHistory,
  FaBell,
  FaSync,
  FaMicrochip,
  FaMemory,
  FaNetworkWired,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { ThemeContext } from "../../../../context/ThemeContext";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function generatePercentHistory(base, variance, count = 20) {
  return Array.from({ length: count }, (_, i) => ({
    t: i,
    v: clamp(base + (Math.random() - 0.5) * variance * 2, 0, 100),
  }));
}

function generateLatencyHistory(base, variance, count = 20) {
  return Array.from({ length: count }, (_, i) => ({
    t: i,
    v: Math.max(0, base + (Math.random() - 0.5) * variance * 2),
  }));
}

function formatTimeFR(d) {
  return d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// ─── SPARKLINE ────────────────────────────────────────────────────────────────

function Sparkline({ data, color, height = 34 }) {
  const id = `sp-${color.replace("#", "")}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.28} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.8}
          fill={`url(#${id})`}
          isAnimationActive={false}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

function StatusBadge({ status, isDark }) {
  const cfg =
    status === "online"
      ? { label: "Opérationnel", color: "#16a34a", bg: isDark ? "rgba(22,163,74,0.12)"   : "#f0fdf4", border: isDark ? "rgba(22,163,74,0.28)"   : "#bbf7d0" }
      : status === "warning"
      ? { label: "Dégradé",      color: "#ca8a04", bg: isDark ? "rgba(202,138,4,0.12)"   : "#fefce8", border: isDark ? "rgba(202,138,4,0.28)"   : "#fde68a" }
      : status === "offline"
      ? { label: "Arrêté",       color: "#dc2626", bg: isDark ? "rgba(220,38,38,0.12)"   : "#fef2f2", border: isDark ? "rgba(220,38,38,0.28)"   : "#fecaca" }
      : { label: "Inconnu",      color: "#94a3b8", bg: isDark ? "rgba(148,163,184,0.10)" : "#f8fafc", border: isDark ? "rgba(148,163,184,0.18)" : "#e2e8f0" };

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
    >
      <FaCircle className="text-[5px]" style={{ color: cfg.color }} />
      {cfg.label}
    </span>
  );
}

function StatusIcon({ status }) {
  if (status === "online")  return <FaCheckCircle />;
  if (status === "warning") return <FaExclamationTriangle />;
  if (status === "offline") return <FaTimesCircle />;
  return null;
}

// ─── SERVICE CARD ─────────────────────────────────────────────────────────────

function ServiceCard({ service, isDark }) {
  const palette =
    service.status === "online"
      ? { c: "#16a34a", bg: isDark ? "rgba(22,163,74,0.10)"  : "#f0fdf4", br: isDark ? "rgba(22,163,74,0.22)"  : "#bbf7d0" }
      : service.status === "warning"
      ? { c: "#ca8a04", bg: isDark ? "rgba(202,138,4,0.10)"  : "#fefce8", br: isDark ? "rgba(202,138,4,0.22)"  : "#fde68a" }
      : { c: "#dc2626", bg: isDark ? "rgba(220,38,38,0.10)"  : "#fef2f2", br: isDark ? "rgba(220,38,38,0.22)"  : "#fecaca" };

  const Ico = service.icon;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: isDark ? "#1e293b" : "#ffffff",
        border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
        boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.30)" : "0 1px 6px rgba(0,0,0,0.06)",
      }}
    >
      <div className="h-1 w-full" style={{ background: palette.c }} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: palette.bg, border: `1px solid ${palette.br}` }}
            >
              <Ico className="w-5 h-5" style={{ color: palette.c }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight truncate"
                style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
                {service.name}
              </p>
              <p className="text-[11px] mt-0.5 truncate"
                style={{ color: isDark ? "#64748b" : "#94a3b8" }}>
                {service.description}
              </p>
            </div>
          </div>
          <span className="text-xl flex-shrink-0" style={{ color: palette.c }}>
            <StatusIcon status={service.status} />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="rounded-xl p-3"
            style={{ background: isDark ? "#0f172a" : "#f8fafc", border: `1px solid ${isDark ? "#1e293b" : "#f1f5f9"}` }}>
            <p className="text-[10px] uppercase tracking-wide font-bold mb-1"
              style={{ color: isDark ? "#475569" : "#94a3b8" }}>Latence</p>
            <p className="text-lg font-black tabular-nums"
              style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>{service.latency}</p>
          </div>
          <div className="rounded-xl p-3"
            style={{ background: isDark ? "#0f172a" : "#f8fafc", border: `1px solid ${isDark ? "#1e293b" : "#f1f5f9"}` }}>
            <p className="text-[10px] uppercase tracking-wide font-bold mb-1"
              style={{ color: isDark ? "#475569" : "#94a3b8" }}>Uptime</p>
            <p className="text-lg font-black tabular-nums" style={{ color: palette.c }}>
              {service.uptime}
            </p>
          </div>
        </div>

        <div className="mb-2">
          <Sparkline data={service.latencyHistory} color={palette.c} />
        </div>

        <div className="flex items-center justify-between mt-2">
          <StatusBadge status={service.status} isDark={isDark} />
          <span className="text-[10px]" style={{ color: isDark ? "#334155" : "#94a3b8" }}>
            Vérif. il y a {service.lastCheck}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── METRIC CARD ──────────────────────────────────────────────────────────────

function MetricCard({ label, value, unit, icon: Icon, color, history, isDark, detail }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: isDark ? "#1e293b" : "#ffffff",
        border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
        boxShadow: isDark ? "0 1px 4px rgba(0,0,0,0.30)" : "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: color + "18" }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wide truncate"
            style={{ color: isDark ? "#64748b" : "#94a3b8" }}>
            {label}
          </span>
        </div>
        <span className="text-2xl font-black tabular-nums" style={{ color }}>
          {Number(value).toFixed(0)}
          <span className="text-sm font-normal"
            style={{ color: isDark ? "#475569" : "#94a3b8" }}>{unit}</span>
        </span>
      </div>

      <div className="w-full h-1.5 rounded-full mb-1"
        style={{ background: isDark ? "#0f172a" : "#f1f5f9" }}>
        <div className="h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }} />
      </div>

      {detail && (
        <p className="text-[10px] mt-1" style={{ color: isDark ? "#334155" : "#94a3b8" }}>
          {detail}
        </p>
      )}

      <div className="h-10 mt-2">
        <Sparkline data={history} color={color} />
      </div>
    </div>
  );
}

// ─── INCIDENT CARD ────────────────────────────────────────────────────────────

function IncidentCard({ incident, isDark }) {
  const cfg =
    incident.type === "offline"
      ? { c: "#dc2626", bg: isDark ? "rgba(220,38,38,0.08)"  : "#fef2f2", br: isDark ? "rgba(220,38,38,0.20)"  : "#fecaca", tag: "Critique",      Ico: FaTimesCircle }
      : incident.type === "warning"
      ? { c: "#ca8a04", bg: isDark ? "rgba(202,138,4,0.08)"  : "#fefce8", br: isDark ? "rgba(202,138,4,0.20)"  : "#fde68a", tag: "Avertissement", Ico: FaExclamationTriangle }
      : { c: "#16a34a", bg: isDark ? "rgba(22,163,74,0.08)"  : "#f0fdf4", br: isDark ? "rgba(22,163,74,0.20)"  : "#bbf7d0", tag: "Résolu",         Ico: FaCheckCircle };

  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl border"
      style={{ background: cfg.bg, borderColor: cfg.br }}>
      <cfg.Ico className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: cfg.c }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="text-sm font-bold" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
            {incident.title}
          </p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ color: cfg.c, background: cfg.c + "18" }}>
            {cfg.tag}
          </span>
        </div>
        <p className="text-xs" style={{ color: isDark ? "#cbd5e1" : "#475569" }}>
          {incident.description}
        </p>
        {incident.resolution && (
          <p className="text-xs mt-1 font-medium" style={{ color: "#16a34a" }}>
            ✓ {incident.resolution}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-[10px]" style={{ color: isDark ? "#475569" : "#94a3b8" }}>
          {incident.time}
        </span>
        <span className="text-[10px] font-mono" style={{ color: isDark ? "#334155" : "#cbd5e1" }}>
          {incident.service}
        </span>
      </div>
    </div>
  );
}

// ─── VIEW PRINCIPALE ──────────────────────────────────────────────────────────

export default function SystemStatusView() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const MAX_PTS = 20;
  const [cpuData,  setCpuData]  = useState(() => generatePercentHistory(38, 14, MAX_PTS));
  const [ramData,  setRamData]  = useState(() => generatePercentHistory(72,  6, MAX_PTS));
  const [diskData, setDiskData] = useState(() => generatePercentHistory(59,  3, MAX_PTS));
  const [netData,  setNetData]  = useState(() => generatePercentHistory(22, 16, MAX_PTS));
  const tickRef = useRef(MAX_PTS);

  useEffect(() => {
    const id = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current;
      const next = (arr, base, v) => [
        ...arr.slice(1),
        { t, v: clamp(base + (Math.random() - 0.5) * v * 2, 0, 100) },
      ];
      setCpuData((p)  => next(p, 38, 14));
      setRamData((p)  => next(p, 72,  6));
      setDiskData((p) => next(p, 59,  3));
      setNetData((p)  => next(p, 22, 16));
      setLastUpdate(new Date());
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdate(new Date());
      toast.success("Données actualisées avec succès", { autoClose: 2000 });
    }, 900);
  };

  const services = [
    {
      name: "Serveur API",
      description: "REST API principale",
      status: "online",
      latency: "45ms",
      uptime: "99.98%",
      lastCheck: "30s",
      icon: FaServer,
      latencyHistory: generateLatencyHistory(45, 12, MAX_PTS),
    },
    {
      name: "Base de données",
      description: "PostgreSQL · Cluster principal",
      status: "online",
      latency: "12ms",
      uptime: "99.99%",
      lastCheck: "30s",
      icon: FaDatabase,
      latencyHistory: generateLatencyHistory(12, 5, MAX_PTS),
    },
    {
      name: "Email (SMTP)",
      description: "Serveur d'envoi d'emails",
      status: "warning",
      latency: "800ms",
      uptime: "97.40%",
      lastCheck: "1 min",
      icon: FaEnvelope,
      latencyHistory: generateLatencyHistory(800, 200, MAX_PTS),
    },
  ];

  // 8 incidents pour bien tester le scroll
  const incidents = [
    {
      type: "offline",
      title: "Panne Stockage Fichiers",
      description: "Le serveur de fichiers ne répond pas depuis 10h42. Équipe technique notifiée.",
      service: "Stockage S3",
      time: "Il y a 20 min",
    },
    {
      type: "warning",
      title: "Latence SMTP élevée",
      description: "Délais d'envoi d'emails supérieurs à 800ms détectés. Surveillance renforcée.",
      service: "Email SMTP",
      time: "Il y a 1h",
    },
    {
      type: "resolved",
      title: "Surcharge CPU temporaire",
      description: "Pic d'utilisation CPU à 94% détecté lors de la migration de données.",
      resolution: "Résolu automatiquement après 3 min.",
      service: "Serveur API",
      time: "Il y a 3h",
    },
    {
      type: "resolved",
      title: "Timeout base de données",
      description: "Requêtes lentes détectées sur la table des utilisateurs.",
      resolution: "Index recréé, performances normales.",
      service: "PostgreSQL",
      time: "Il y a 6h",
    },
    {
      type: "warning",
      title: "Mémoire RAM critique",
      description: "Utilisation RAM supérieure à 90% détectée sur le nœud principal.",
      service: "Serveur API",
      time: "Il y a 8h",
    },
    {
      type: "resolved",
      title: "Certificat SSL proche expiration",
      description: "Le certificat SSL du domaine principal expire dans 7 jours.",
      resolution: "Certificat renouvelé automatiquement via Let's Encrypt.",
      service: "API Gateway",
      time: "Il y a 12h",
    },
    {
      type: "offline",
      title: "Service de cache Redis indisponible",
      description: "Le service Redis ne répond plus. Les sessions utilisateurs peuvent être affectées.",
      service: "Redis Cache",
      time: "Il y a 1j",
    },
    {
      type: "resolved",
      title: "Débit réseau anormal",
      description: "Pic de trafic inhabituel détecté — possible tentative DDoS.",
      resolution: "Trafic filtré, pare-feu mis à jour.",
      service: "Réseau",
      time: "Il y a 2j",
    },
  ];

  // 5 alertes pour remplir un peu
  const alerts = [
    {
      msg: "Stockage S3 hors ligne",
      detail: "Aucune réponse depuis 20 min",
      type: "offline",
      time: "20 min",
    },
    {
      msg: "SMTP latence > 500ms",
      detail: "Latence actuelle : 800ms",
      type: "warning",
      time: "1h",
    },
    {
      msg: "Disque > 55% utilisé",
      detail: "282 Go / 512 Go utilisés",
      type: "warning",
      time: "2h",
    },
    {
      msg: "RAM > 90% sur nœud #1",
      detail: "14.4 Go / 16 Go utilisés",
      type: "warning",
      time: "8h",
    },
    {
      msg: "Redis Cache hors ligne",
      detail: "Sessions utilisateurs affectées",
      type: "offline",
      time: "1j",
    },
  ];

  const countOnline  = services.filter((s) => s.status === "online").length;
  const countWarning = services.filter((s) => s.status === "warning").length;
  const countOffline = services.filter((s) => s.status === "offline").length;

  const rootBg   = isDark ? "#0f172a" : "#ffffff";
  const cardBg   = isDark ? "#1e293b" : "#ffffff";
  const borderC  = isDark ? "#334155" : "#e2e8f0";
  const titleC   = isDark ? "#f1f5f9" : "#0f172a";
  const subC     = isDark ? "#64748b" : "#94a3b8";
  const dividerC = isDark ? "#1e293b" : "#f1f5f9";

  const globalStatus = countOffline > 0 ? "offline" : countWarning > 0 ? "warning" : "online";
  const globalCfg =
    globalStatus === "online"
      ? { label: "Tous les systèmes opérationnels", color: "#16a34a", bg: isDark ? "rgba(22,163,74,0.12)"  : "#f0fdf4", border: isDark ? "rgba(22,163,74,0.30)"  : "#bbf7d0" }
      : globalStatus === "warning"
      ? { label: "Perturbations en cours",          color: "#ca8a04", bg: isDark ? "rgba(202,138,4,0.12)"  : "#fefce8", border: isDark ? "rgba(202,138,4,0.30)"  : "#fde68a" }
      : { label: "Incident critique détecté",       color: "#dc2626", bg: isDark ? "rgba(220,38,38,0.12)"  : "#fef2f2", border: isDark ? "rgba(220,38,38,0.30)"  : "#fecaca" };

  const cpuLatest  = cpuData.at(-1)?.v  ?? 0;
  const ramLatest  = ramData.at(-1)?.v  ?? 0;
  const diskLatest = diskData.at(-1)?.v ?? 0;
  const netLatest  = netData.at(-1)?.v  ?? 0;

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 font-sans"
      style={{ background: rootBg }}>
      <ToastContainer position="top-right" autoClose={3000} theme={isDark ? "dark" : "light"} />

      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── EN-TÊTE ── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold mb-0.5" style={{ color: titleC }}>
              État du Système
            </h1>
            <p className="text-sm" style={{ color: subC }}>
              Surveillance en temps réel des services de la plateforme.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs" style={{ color: subC }}>
              Mis à jour : {formatTimeFR(lastUpdate)}
            </span>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{ background: cardBg, border: `1px solid ${borderC}`, color: isDark ? "#cbd5e1" : "#475569" }}
            >
              <FaSync className={`w-3 h-3 text-indigo-500 ${refreshing ? "animate-spin" : ""}`} />
              Actualiser
            </button>
          </div>
        </div>

        {/* ── BANNIÈRE STATUT GLOBAL ── */}
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border"
          style={{ background: globalCfg.bg, borderColor: globalCfg.border }}>
          <FaCircle className="text-[8px] animate-pulse" style={{ color: globalCfg.color }} />
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: globalCfg.color }}>
              {globalCfg.label}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: subC }}>
              {countOnline} opérationnel{countOnline > 1 ? "s" : ""}
              {countWarning > 0 && ` · ${countWarning} dégradé${countWarning > 1 ? "s" : ""}`}
              {countOffline > 0 && ` · ${countOffline} arrêté${countOffline > 1 ? "s" : ""}`}
              {" "}sur {services.length} services
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {[
              { count: countOnline,  color: "#16a34a", label: "OK" },
              { count: countWarning, color: "#ca8a04", label: "⚠"  },
              { count: countOffline, color: "#dc2626", label: "✕"  },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
                style={{ background: s.color + "18", color: s.color }}>
                <span>{s.count}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CARTES SERVICES (3 colonnes) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {services.map((svc, i) => (
            <ServiceCard key={i} service={svc} isDark={isDark} />
          ))}
        </div>

        {/* ── MÉTRIQUES LIVE ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{
            background: cardBg,
            border: `1px solid ${borderC}`,
            boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.30)" : "0 1px 6px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: `1px solid ${dividerC}` }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: isDark ? "#0f172a" : "#f8fafc" }}>
                <FaMicrochip className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <h2 className="text-sm font-bold m-0" style={{ color: titleC }}>
                  Métriques Système
                </h2>
                <p className="text-[11px] m-0" style={{ color: subC }}>
                  Ressources en temps réel
                </p>
              </div>
            </div>
            <span
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{
                color: "#16a34a",
                background: isDark ? "rgba(22,163,74,0.15)" : "#f0fdf4",
                border: `1px solid ${isDark ? "rgba(22,163,74,0.30)" : "#bbf7d0"}`,
              }}
            >
              <FaCircle className="text-[5px] animate-pulse" /> Live
            </span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard label="CPU"    value={cpuLatest}  unit="%"   icon={FaMicrochip}    color="#6366f1" history={cpuData}  isDark={isDark} detail={`${((cpuLatest / 100) * 8).toFixed(1)} / 8 cœurs utilisés`} />
            <MetricCard label="RAM"    value={ramLatest}  unit="%"   icon={FaMemory}       color="#f59e0b" history={ramData}  isDark={isDark} detail={`${((ramLatest / 100) * 16).toFixed(1)} Go / 16 Go utilisés`} />
            <MetricCard label="Disque" value={diskLatest} unit="%"   icon={FaHdd}          color="#ef4444" history={diskData} isDark={isDark} detail={`${Math.round((diskLatest / 100) * 512)} Go / 512 Go utilisés`} />
            <MetricCard label="Réseau" value={netLatest}  unit=" ms" icon={FaNetworkWired} color="#10b981" history={netData}  isDark={isDark} detail="Latence réseau interne" />
          </div>
        </div>

        {/* ── INCIDENTS + ALERTES — HAUTEUR FIXE POUR SCROLL ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[420px]">
          {/* h-[420px] force une hauteur fixe pour que le scroll interne s'active */}

          {/* ── Incidents récents (2/3) ── */}
          <div
            className="lg:col-span-2 rounded-2xl flex flex-col h-full"
            style={{
              background: cardBg,
              border: `1px solid ${borderC}`,
              boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.30)" : "0 1px 6px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Header fixe */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-4"
              style={{ borderBottom: `1px solid ${dividerC}` }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: isDark ? "#0f172a" : "#f8fafc" }}>
                  <FaHistory className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-sm font-bold m-0" style={{ color: titleC }}>
                    Incidents récents
                  </h2>
                  <p className="text-[11px] m-0" style={{ color: subC }}>
                    Historique des {incidents.length} derniers événements
                  </p>
                </div>
              </div>
              {(countOffline + countWarning) > 0 && (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                  style={{ color: "#dc2626", background: isDark ? "rgba(220,38,38,0.12)" : "#fef2f2" }}>
                  {countOffline + countWarning} actif{(countOffline + countWarning) > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* ✅ Zone scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {incidents.map((inc, i) => (
                <IncidentCard key={i} incident={inc} isDark={isDark} />
              ))}
            </div>
          </div>

          {/* ── Alertes (1/3) ── */}
          <div
            className="rounded-2xl flex flex-col h-full"
            style={{
              background: cardBg,
              border: `1px solid ${borderC}`,
              boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.30)" : "0 1px 6px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Header fixe */}
            <div className="flex-shrink-0 flex items-center gap-2.5 px-5 py-4"
              style={{ borderBottom: `1px solid ${dividerC}` }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: isDark ? "#0f172a" : "#f8fafc" }}>
                <FaBell className="w-4 h-4 text-yellow-500" />
              </div>
              <div>
                <h2 className="text-sm font-bold m-0" style={{ color: titleC }}>
                  Alertes
                </h2>
                <p className="text-[11px] m-0" style={{ color: subC }}>
                  {alerts.length} alertes actives
                </p>
              </div>
            </div>

            {/* ✅ Zone scrollable */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {alerts.map((a, i) => {
                const col = a.type === "offline" ? "#dc2626" : "#ca8a04";
                return (
                  <div key={i}
                    className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
                    style={{ background: col + "10", border: `1px solid ${col}28` }}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                      style={{ background: col }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-snug"
                        style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
                        {a.msg}
                      </p>
                      <p className="text-xs mt-1" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>
                        {a.detail}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold flex-shrink-0 mt-0.5"
                      style={{ color: col }}>
                      {a.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
