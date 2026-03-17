import React, { useState, useRef, useEffect, useContext, useMemo } from "react";
import {
  FaUsers, FaGlobe, FaChartLine, FaClock,
  FaUserPlus, FaServer, FaCircle,
  FaHdd, FaMemory, FaMicrochip, FaNetworkWired,
} from "react-icons/fa";
import { HiOutlineCalendar } from "react-icons/hi2";
import { PiChartLineUp, PiChartBar, PiChartPieSlice } from "react-icons/pi";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { ThemeContext } from "../../../../context/ThemeContext";
import UserService from "../../../../services/user.service";
import AnalyticsService from "../../../../services/analytics.service";

// ─── DONNÉES ──────────────────────────────────────────────────────────────────

const userGrowthData = [
  { month: "Août", utilisateurs: 820  },
  { month: "Sep",  utilisateurs: 940  },
  { month: "Oct",  utilisateurs: 1020 },
  { month: "Nov",  utilisateurs: 1100 },
  { month: "Déc",  utilisateurs: 1180 },
  { month: "Jan",  utilisateurs: 1210 },
  { month: "Fév",  utilisateurs: 1240 },
];

const activityData = [
  { day: "Lun", vues: 1400 },
  { day: "Mar", vues: 1800 },
  { day: "Mer", vues: 2200 },
  { day: "Jeu", vues: 1600 },
  { day: "Ven", vues: 2500 },
  { day: "Sam", vues: 1100 },
  { day: "Dim", vues: 900  },
];

const userDistributionData = [
  { name: "CNH",                       value: 210 },
  { name: "SAE",                       value: 185 },
  { name: "SICP",                      value: 320 },
  { name: "Expert",                    value: 145 },
  { name: "Gestionnaire habilitation", value: 98  },
  { name: "Université",                value: 282 },
];

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6"];

function generateHistory(base, variance, count = 30) {
  return Array.from({ length: count }, (_, i) => ({
    t: i,
    v: Math.min(100, Math.max(0, base + (Math.random() - 0.5) * variance * 2)),
  }));
}

// ─── DATE RANGE PICKER ────────────────────────────────────────────────────────

const DateRangePicker = ({ value, onChange, isDark }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const presets = [
    { l: "Aujourd'hui",      f: () => { const d = new Date().toISOString().slice(0,10); return { from:d, to:d, label:"Aujourd'hui" }; } },
    { l: "7 derniers jours", f: () => { const e=new Date(),s=new Date(); s.setDate(s.getDate()-7); return { from:s.toISOString().slice(0,10), to:e.toISOString().slice(0,10), label:"7 derniers jours" }; } },
    { l: "Janvier 2026",     f: () => ({ from:"2026-01-01", to:"2026-01-31", label:"Janvier 2026" }) },
    { l: "Février 2026",     f: () => ({ from:"2026-02-01", to:"2026-02-28", label:"Février 2026" }) },
    { l: "Année 2025",       f: () => ({ from:"2025-01-01", to:"2025-12-31", label:"Année 2025" }) },
    { l: "Année 2026",       f: () => ({ from:"2026-01-01", to:"2026-12-31", label:"Année 2026" }) },
  ];

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const bg     = isDark ? "#1e293b" : "#fff";
  const border = isDark ? "#334155" : "#e2e8f0";
  const color  = isDark ? "#cbd5e1" : "#475569";
  const dropBg = isDark ? "#1e293b" : "#fff";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
        style={{ background: bg, border: `1px solid ${border}`, color }}
      >
        <HiOutlineCalendar className="w-3.5 h-3.5 text-indigo-500" />
        {value.label || "Période"}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
          className={`ml-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="M2 3.5l3 3 3-3" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full right-0 z-[9999] min-w-[200px] p-1.5 rounded-xl"
          style={{ background: dropBg, border: `1px solid ${border}`, boxShadow: "0 12px 40px rgba(0,0,0,0.2)" }}
        >
          {presets.map(p => (
            <button
              key={p.l}
              onClick={() => { onChange(p.f()); setOpen(false); }}
              className="block w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              style={{
                background: value.label === p.l ? "rgba(99,102,241,0.15)" : "transparent",
                color: value.label === p.l ? "#818cf8" : isDark ? "#cbd5e1" : "#334155",
              }}
            >
              {p.l}
              {value.label === p.l && <span className="float-right text-indigo-400">✓</span>}
            </button>
          ))}
          <div className="mx-1.5 my-1 pt-1.5" style={{ borderTop: `1px solid ${border}` }}>
            <div className="flex gap-1">
              {["from","to"].map(k => (
                <input key={k} type="date"
                  value={value[k] || ""}
                  onChange={e => onChange({ ...value, [k]: e.target.value, label:"Personnalisé" })}
                  className="flex-1 px-1.5 py-1 rounded-md text-xs border"
                  style={{
                    borderColor: border,
                    background: isDark ? "#0f172a" : "#fff",
                    color: isDark ? "#e2e8f0" : "#334155",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, trend, trendLabel, accentColor, isDark }) {
  const isPositive = trend >= 0;
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: isDark ? "#1e293b" : "#ffffff",
        border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
        boxShadow: isDark ? "0 1px 4px rgba(0,0,0,0.4)" : "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-start justify-between mb-2.5">
        <div className="text-3xl font-semibold tracking-tight leading-none"
          style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
          {value}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: accentColor + "18" }}>
          <Icon className="w-5 h-5" style={{ color: accentColor }} />
        </div>
      </div>
      <div className="text-xs mb-2" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
        {label}
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold"
            style={{ color: isPositive ? "#16a34a" : "#dc2626" }}>
            {isPositive ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
          <span className="text-xs" style={{ color: isDark ? "#475569" : "#94a3b8" }}>
            {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── MINI GRAPHIQUE TEMPS RÉEL ────────────────────────────────────────────────

function RealtimeMiniChart({ data, color, label, icon: Icon, unit = "%", totalCap = null, capUnit = "Go", isDark }) {
  const latest = data[data.length - 1]?.v ?? 0;
  const used = totalCap ? (latest / 100) * totalCap : null;
  const free = totalCap ? totalCap - used : null;

  return (
    <div className="flex flex-col gap-1 rounded-xl p-3 flex-1 min-w-0"
      style={{
        background: isDark ? "#0f172a" : "#f8fafc",
        border: `1px solid ${isDark ? "#1e293b" : "#f1f5f9"}`,
      }}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="text-xs" style={{ color }}><Icon /></span>
        <span className="text-[10px] font-black uppercase tracking-wide"
          style={{ color: isDark ? "#475569" : "#94a3b8" }}>
          {label}
        </span>
      </div>
      <div className="text-xl font-black leading-none tabular-nums"
        style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
        {latest.toFixed(0)}
        <span className="text-xs font-normal" style={{ color: isDark ? "#475569" : "#94a3b8" }}>
          {unit}
        </span>
      </div>
      {totalCap && (
        <div className="flex flex-col leading-tight">
          <span className="text-[9px] font-mono font-semibold"
            style={{ color: isDark ? "#64748b" : "#475569" }}>
            {used.toFixed(1)} / {totalCap} {capUnit}
          </span>
          <span className="text-[9px]" style={{ color: isDark ? "#334155" : "#94a3b8" }}>
            Libre : {free.toFixed(1)} {capUnit}
          </span>
        </div>
      )}
      <div className="h-10 w-full mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`g-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={color} stopOpacity={0}    />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2}
              fill={`url(#g-${label})`} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── COURBE SVG ───────────────────────────────────────────────────────────────

function LineChartSVG({ isDark, data = userGrowthData }) {
  const pts = data.map(d => ({ y: d.month, v: d.utilisateurs }));

  const W = 580, H = 230;
  const PL = 46, PR = 22, PT = 22, PB = 30;
  const cW = W - PL - PR, cH = H - PT - PB;
  const minV = Math.max(0, Math.min(...pts.map(p => p.v)) - 50);
  const maxV = Math.max(...pts.map(p => p.v)) + 100;
  const xP = i => PL + (i / (pts.length - 1)) * cW;
  const yP = v => maxV === minV ? PT + cH / 2 : PT + cH - ((v - minV) / (maxV - minV)) * cH;
  const lp   = pts.map((d, i) => `${i ? "L" : "M"} ${xP(i).toFixed(1)} ${yP(d.v).toFixed(1)}`).join(" ");

  const gridC  = isDark ? "#e2e8f0" : "#f1f5f9";
  const labelC = isDark ? "#64748b" : "#94a3b8";

  return (
    <div>
      <p className="text-xs font-semibold mb-0.5" style={{ color: "#0f172a" }}>
        Croissance des utilisateurs
      </p>
      <p className="text-[11px] mb-4" style={{ color: "#94a3b8" }}>
        Évolution mensuelle des inscrits
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible", display: "block" }}>
        {[800, 900, 1000, 1100, 1200, 1300].map(v => (
          <g key={v}>
            <line x1={PL} y1={yP(v)} x2={W - PR} y2={yP(v)} stroke={gridC} strokeWidth="1" />
            <text x={PL - 8} y={yP(v) + 4} textAnchor="end" fontSize="11" fill={labelC} fontWeight="500">
              {v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
            </text>
          </g>
        ))}

        <path d={lp} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {pts.map((d, i) => (
          <g key={i}>
            <circle
              cx={xP(i)} cy={yP(d.v)}
              r={4}
              fill="#ffffff"
              stroke="#6366f1" strokeWidth="2"
            />
            <text x={xP(i)} y={H - 4} textAnchor="middle"
              fontSize="11" fill={labelC} fontWeight="500">
              {d.y}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── BARRES SVG ───────────────────────────────────────────────────────────────

function BarChartSVG({ isDark }) {
  const [hov, setHov] = useState(null);
  const data = activityData.map((d, i) => ({
    r: d.day, v: d.vues,
    c: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const W = 580, H = 230;
  const PL = 42, PR = 18, PT = 22, PB = 34;
  const cW = W - PL - PR, cH = H - PT - PB;
  const bW = cW / data.length;
  const max = Math.max(...data.map(d => d.v));

  const gridC  = isDark ? "#e2e8f0" : "#f1f5f9";
  const labelC = isDark ? "#64748b" : "#94a3b8";
  const barBg  = "#f8fafc";

  return (
    <div>
      <p className="text-xs font-semibold mb-0.5" style={{ color: "#0f172a" }}>
        Activité hebdomadaire
      </p>
      <p className="text-[11px] mb-4" style={{ color: "#94a3b8" }}>
        Vues par jour de la semaine
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible", display: "block" }}>
        <defs>
          {data.map((d, i) => (
            <linearGradient key={i} id={`bgrad${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={d.c} />
              <stop offset="100%" stopColor={d.c} stopOpacity=".4" />
            </linearGradient>
          ))}
        </defs>

        {[500, 1000, 1500, 2000].map(v => {
          const y = PT + cH - (v / max) * cH;
          return (
            <g key={v}>
              <line x1={PL} y1={y} x2={W - PR} y2={y} stroke={gridC} strokeWidth="1.2" />
              <text x={PL - 6} y={y + 4} textAnchor="end" fontSize="10.5" fill={labelC} fontWeight="500">
                {v >= 1000 ? `${v / 1000}k` : v}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const bH = (d.v / max) * cH;
          const x  = PL + i * bW + bW * 0.18;
          const w  = bW * 0.64;
          const y  = PT + cH - bH;
          return (
            <g key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
              style={{ cursor: "pointer" }}>
              <rect x={x} y={PT} width={w} height={cH} rx="5" fill={barBg} />
              <rect x={x} y={y} width={w} height={bH} rx="5"
                fill={`url(#bgrad${i})`}
                opacity={hov !== null && hov !== i ? 0.4 : 1} />
              <text x={x + w / 2} y={y - 6} textAnchor="middle"
                fontSize="10.5" fontWeight="700" fill={d.c}>
                {d.v >= 1000 ? `${(d.v / 1000).toFixed(1)}k` : d.v}
              </text>
              {hov === i && (
                <>
                  <rect x={x + w / 2 - 34} y={y - 30} width="68" height="20" rx="5" fill="#0f172a" />
                  <text x={x + w / 2} y={y - 16} textAnchor="middle"
                    fontSize="10" fontWeight="600" fill="white">
                    {d.v} · {d.r}
                  </text>
                </>
              )}
              <text x={x + w / 2} y={H - 4} textAnchor="middle"
                fontSize="11" fill={labelC} fontWeight="500">
                {d.r}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── DONUT SVG ────────────────────────────────────────────────────────────────

function DonutChartSVG({ isDark, data = userDistributionData }) {
  const [hov, setHov] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);

  const cx = 120, cy = 120, R = 100, r = 62;
  let angle = -Math.PI / 2;

  const slices = userDistributionData.map((d, i) => {
    const a    = (d.value / total) * 2 * Math.PI;
    const x1   = cx + R * Math.cos(angle),     y1   = cy + R * Math.sin(angle);
    const x2   = cx + R * Math.cos(angle + a), y2   = cy + R * Math.sin(angle + a);
    const ix1  = cx + r * Math.cos(angle),     iy1  = cy + r * Math.sin(angle);
    const ix2  = cx + r * Math.cos(angle + a), iy2  = cy + r * Math.sin(angle + a);
    const lg   = a > Math.PI ? 1 : 0;
    const path = `M ${x1} ${y1} A ${R} ${R} 0 ${lg} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${r} ${r} 0 ${lg} 0 ${ix1} ${iy1} Z`;
    angle += a;
    return { ...d, path, color: PIE_COLORS[i % PIE_COLORS.length] };
  });

  return (
    <div>
      <p className="text-xs font-semibold mb-0.5" style={{ color: "#0f172a" }}>
        Répartition des utilisateurs
      </p>
      <p className="text-[11px] mb-4" style={{ color: "#94a3b8" }}>
        Par type de profil
      </p>

      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Donut */}
        <div className="flex-shrink-0 mx-auto sm:mx-0">
          <svg viewBox="0 0 240 240" width="200" style={{ display: "block", overflow: "visible" }}>
            {slices.map((s, i) => (
              <path key={i} d={s.path} fill={s.color}
                opacity={hov !== null && hov !== i ? 0.45 : 1}
                stroke="white" strokeWidth="3"
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  transform: `scale(${hov === i ? 1.05 : 1})`,
                  transition: "all .2s",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
              />
            ))}
            <text x={cx} y={cy - 10} textAnchor="middle" fontSize="30"
              fontWeight="800" fill="#1e293b">
              {total}
            </text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11"
              fontWeight="500" fill="#64748b">
              utilisateurs
            </text>
          </svg>
        </div>

        {/* Légende 2 colonnes */}
        <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-2.5 w-full">
          {slices.map((s, i) => (
            <div key={i}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all"
              style={{
                background:  hov === i ? s.color + "18" : "#fafafa",
                borderColor: hov === i ? s.color : "#f1f5f9",
                cursor: "default",
              }}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: s.color }} />
                <span className="text-xs truncate" style={{ color: "#475569" }} title={s.name}>
                  {s.name}
                </span>
              </div>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <span className="text-xs font-semibold" style={{ color: s.color }}>
                  {s.value}
                </span>
                <span className="text-[10px]" style={{ color: "#94a3b8" }}>
                  ({Math.round((s.value / total) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MONITORING SERVEUR ───────────────────────────────────────────────────────

function ServerStatusCard({ isDark }) {
  const MAX_POINTS    = 30;
  const TOTAL_RAM_GB  = 16;
  const TOTAL_DISK_GB = 512;

  const [cpuData,  setCpuData]  = useState(() => generateHistory(38, 12, MAX_POINTS));
  const [memData,  setMemData]  = useState(() => generateHistory(72,  5, MAX_POINTS));
  const [diskData, setDiskData] = useState(() => generateHistory(59,  2, MAX_POINTS));
  const [netData,  setNetData]  = useState(() => generateHistory(22, 15, MAX_POINTS));
  const tickRef = useRef(MAX_POINTS);

  useEffect(() => {
    const id = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current;
      const next = (arr, base, v) => [
        ...arr.slice(1),
        { t, v: Math.min(100, Math.max(0, base + (Math.random() - 0.5) * v * 2)) },
      ];
      setCpuData(p  => next(p, 38, 12));
      setMemData(p  => next(p, 72,  5));
      setDiskData(p => next(p, 59,  2));
      setNetData(p  => next(p, 22, 15));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const services = [
    { name: "API Gateway",     status: "online",  latency: "42 ms"  },
    { name: "Base de données", status: "online",  latency: "8 ms"   },
    { name: "Stockage S3",     status: "online",  latency: "120 ms" },
    { name: "SMTP Service",    status: "warning", latency: "340 ms" },
    { name: "Redis Cache",     status: "online",  latency: "18 ms"  },
  ];

  const statusConfig = {
    online: {
      label: "Opérationnel", color: "#16a34a",
      bg:     isDark ? "rgba(22,163,74,0.12)"  : "#f0fdf4",
      border: isDark ? "rgba(22,163,74,0.3)"   : "#bbf7d0",
      dot: "#16a34a",
    },
    warning: {
      label: "Dégradé", color: "#ca8a04",
      bg:     isDark ? "rgba(202,138,4,0.12)"  : "#fefce8",
      border: isDark ? "rgba(202,138,4,0.3)"   : "#fde68a",
      dot: "#ca8a04",
    },
    offline: {
      label: "Arrêté", color: "#dc2626",
      bg:     isDark ? "rgba(220,38,38,0.12)"  : "#fef2f2",
      border: isDark ? "rgba(220,38,38,0.3)"   : "#fecaca",
      dot: "#dc2626",
    },
  };

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: isDark ? "#1e293b" : "#ffffff",
        border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
        boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: `1px solid ${isDark ? "#1e293b" : "#f1f5f9"}` }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: isDark ? "#0f172a" : "#f8fafc" }}>
            <FaServer className="w-4 h-4" style={{ color: "#6366f1" }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold m-0"
              style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
              Monitoring Système
            </h3>
            <p className="text-[11px] m-0" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>
              Surveillance en temps réel
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{
            color: "#16a34a",
            background: isDark ? "rgba(22,163,74,0.15)" : "#f0fdf4",
            border: `1px solid ${isDark ? "rgba(22,163,74,0.3)" : "#bbf7d0"}`,
          }}>
          <FaCircle className="text-[6px] animate-pulse" /> Live
        </span>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex flex-row gap-3 overflow-x-auto pb-1">
          <RealtimeMiniChart data={cpuData}  color="#6366f1" label="CPU"    icon={FaMicrochip}    isDark={isDark} />
          <RealtimeMiniChart data={memData}  color="#f59e0b" label="RAM"    icon={FaMemory}       isDark={isDark} totalCap={TOTAL_RAM_GB}  capUnit="Go" />
          <RealtimeMiniChart data={diskData} color="#ef4444" label="Disque" icon={FaHdd}          isDark={isDark} totalCap={TOTAL_DISK_GB} capUnit="Go" />
          <RealtimeMiniChart data={netData}  color="#10b981" label="Réseau" icon={FaNetworkWired} isDark={isDark} unit=" ms" />
        </div>

        <div style={{ borderTop: `1px solid ${isDark ? "#1e293b" : "#f1f5f9"}` }} />

        <div className="overflow-y-auto" style={{ maxHeight: "190px" }}>
          <div className="space-y-2">
            {services.map(svc => {
              const cfg = statusConfig[svc.status];
              return (
                <div key={svc.name}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border"
                  style={{ background: cfg.bg, borderColor: cfg.border }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
                    <span className="text-sm" style={{ color: isDark ? "#cbd5e1" : "#334155" }}>
                      {svc.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono" style={{ color: isDark ? "#475569" : "#94a3b8" }}>
                      {svc.latency}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide"
                      style={{ color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs flex items-center gap-1.5"
          style={{ color: isDark ? "#334155" : "#94a3b8" }}>
          <FaClock className="text-xs" style={{ color: isDark ? "#1e293b" : "#cbd5e1" }} />
          Uptime 99.98% · Dernier reboot il y a 14j 03h
        </p>
      </div>
    </div>
  );
}

// ─── VUE PRINCIPALE ───────────────────────────────────────────────────────────

export default function DashboardAdminView() {
  const { theme } = useContext(ThemeContext);
  const isDark    = theme === "dark";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chart, setChart]         = useState("line");
  const [dateRange, setDateRange] = useState({
    label: "Année 2026", from: "2026-01-01", to: "2026-12-31",
  });
  const [analytics, setAnalytics] = useState({ total_views: 0, active_sessions: 0 });

  const processedDistribution = useMemo(() => {
    if (loading || !users.length) return userDistributionData;
    const counts = {};
    users.forEach(u => {
      const role = u.role || "Inconnu";
      counts[role] = (counts[role] || 0) + 1;
    });
    // Use proper labels if possible, but role names for now
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [users, loading]);

  const processedGrowth = useMemo(() => {
    if (loading || !users.length) return userGrowthData;
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Simplification : count users per month for the current year
    const growth = months.map((m, idx) => {
      const count = users.filter(u => {
        if (!u.created_at) return false;
        const d = new Date(u.created_at);
        return d.getFullYear() === currentYear && d.getMonth() <= idx;
      }).length;
      return { month: m, utilisateurs: count };
    });
    
    // Only return up to current month or similar
    return growth.slice(0, now.getMonth() + 1);
  }, [users, loading]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await UserService.getAll();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();

    const fetchAnalytics = async () => {
      try {
        const data = await AnalyticsService.getStats();
        setAnalytics(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des analytics:", error);
      }
    };
    fetchAnalytics();
    
    // 📡 Abonnement temps réel via WebSocket
    const unsubscribe = AnalyticsService.subscribeToStats((data) => {
      setAnalytics(data);
    });
    
    return () => unsubscribe();
  }, []);

  const stats = [
    { 
      label: "Utilisateurs totaux",  
      value: loading ? "..." : users.length.toLocaleString(),  
      icon: FaUsers,     
      trend: 4.8,  
      trendLabel: "ce mois",       
      accentColor: "#6366f1" 
    },
    { 
      label: "Vues totales",         
      value: loading ? "..." : analytics.total_views.toLocaleString(), 
      icon: FaGlobe,     
      trend: 12.3, 
      trendLabel: "cette semaine", 
      accentColor: "#10b981" 
    },
    { 
      label: "Sessions actives",     
      value: loading ? "..." : analytics.active_sessions.toLocaleString(),    
      icon: FaChartLine, 
      trend: 7.1,  
      trendLabel: "aujourd'hui",   
      accentColor: "#3b82f6" 
    },
    { 
      label: "Nouveaux inscrits",    
      value: loading ? "..." : users.filter(u => {
        if (!u.created_at) return false;
        const now = new Date();
        const created = new Date(u.created_at);
        const diffDays = (now - created) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      }).length.toLocaleString(),     
      icon: FaUserPlus,  
      trend: 9.2,  
      trendLabel: "cette semaine", 
      accentColor: "#8b5cf6" 
    },
    { 
      label: "Temps de réponse",     
      value: "124 ms", 
      icon: FaClock,     
      trend: -8,   
      trendLabel: "vs hier",       
      accentColor: "#ef4444" 
    },
  ];

  const CHART_TABS = [
    { k: "line", I: PiChartLineUp,   l: "Courbe"   },
    { k: "bar",  I: PiChartBar,      l: "Barres"   },
    { k: "pie",  I: PiChartPieSlice, l: "Secteurs" },
  ];

  const rootBg   = isDark ? "#0f172a" : "#ffffff";
  const cardBg   = isDark ? "#1e293b" : "#ffffff";
  const borderC  = isDark ? "#334155" : "#e2e8f0";
  const titleC   = isDark ? "#f1f5f9" : "#0f172a";
  const subC     = isDark ? "#64748b" : "#94a3b8";
  const dividerC = isDark ? "#1e293b" : "#f1f5f9";

  const cardStyle = {
    background:   cardBg,
    border:       `1px solid ${borderC}`,
    borderRadius: "16px",
    boxShadow:    isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)",
    overflow:     "hidden",
  };

  const headerStyle = {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    padding:        "16px 20px",
    borderBottom:   `1px solid ${dividerC}`,
    gap:            "12px",
    flexWrap:       "wrap",
  };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 font-sans"
      style={{ background: rootBg }}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── En-tête : Titre + sous-titre + DateRangePicker ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold mb-0.5" style={{ color: titleC }}>
              Tableau de bord
            </h1>
            <p className="text-sm" style={{ color: subC }}>
              Bienvenue sur votre espace d'administration — mis à jour il y a 1 min.
            </p>
          </div>
          <DateRangePicker value={dateRange} onChange={setDateRange} isDark={isDark} />
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} isDark={isDark} />
          ))}
        </div>

        {/* ── Card graphiques avec onglets ── */}
        <div style={cardStyle}>
          <div style={headerStyle}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: isDark ? "#0f172a" : "#f8fafc" }}>
                <FaChartLine className="w-4 h-4" style={{ color: "#8b5cf6" }} />
              </div>
              <div>
                <h2 className="text-sm font-semibold m-0" style={{ color: titleC }}>
                  Analyses et performances
                </h2>
                <p className="text-[11px] m-0" style={{ color: subC }}>
                  {dateRange.label}
                </p>
              </div>
            </div>

            {/* Onglets */}
            <div className="flex gap-0.5 p-0.5 rounded-xl"
              style={{ border: `1px solid ${borderC}`, background: isDark ? "#0f172a" : "#f8fafc" }}>
              {CHART_TABS.map(({ k, I, l }) => (
                <button key={k} onClick={() => setChart(k)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] transition-all duration-150"
                  style={{
                    background: chart === k ? cardBg    : "transparent",
                    color:      chart === k ? "#6366f1" : subC,
                    fontWeight: chart === k ? 600       : 400,
                    boxShadow:  chart === k ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
                  }}>
                  <I className="w-3.5 h-3.5" />
                  <span>{l}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Zone diagramme — fond blanc fixe, taille légèrement réduite */}
          <div className="p-5">
            <div className="p-5 rounded-xl mx-auto"
              style={{
                background: "#ffffff",
                border: `1px solid ${dividerC}`,
                maxWidth: "740px",
              }}
            >
              {chart === "line" && <LineChartSVG  isDark={isDark} data={processedGrowth} />}
              {chart === "bar"  && <BarChartSVG   isDark={isDark} />}
              {chart === "pie"  && <DonutChartSVG isDark={isDark} data={processedDistribution} />}
            </div>
          </div>
        </div>

        {/* ── Monitoring pleine largeur ── */}
        <ServerStatusCard isDark={isDark} />

      </div>
    </div>
  );
}
