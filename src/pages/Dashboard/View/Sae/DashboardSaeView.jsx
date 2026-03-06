// src/pages/Dashboard/View/Sae/DashboardSaeView.jsx
import React, {
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRegFileAlt,
  FaClipboardCheck,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaChartLine,
  FaClipboardList,
  FaArrowRight,
  FaEye,
  FaArchive,
  FaFileSignature,
  FaUsers,
  FaGraduationCap,
  FaFileAlt,
} from "react-icons/fa";
import {
  HiOutlineCalendar,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { PiChartLineUp, PiChartBar, PiChartPieSlice } from "react-icons/pi";
import { ThemeContext } from "../../../../context/ThemeContext";
import {
  getAllDemandesAdmin,
  getDemandesStats,
} from "../../../../services/equivalence.services";
import {
  getMyDemandes as getAccreditationDemandes,
  getArchivedDemandes as getArchivedAccreditationDemandes,
  STATUT_DEMANDE,
} from "../../../../services/accreditation.services";
import { toast } from "react-toastify";

// ─── FONCTIONS UTILITAIRES ────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const normalizeStatut = (s) => {
  if (!s) return "";
  const raw = String(s).toLowerCase();
  const base = raw
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "_");
  const variants = {
    octroye: "complet",
    rejete: "rejete",
    rejet: "rejete",
    ajourne: "ajourne",
    accorde: "accorde",
    complet: "complet",
    en_cours: "en_cours",
    soumise: "soumise",
    brouillon: "brouillon",
  };
  if (variants[base]) return variants[base];
  if (base.includes("octroy")) return "complet";
  return base;
};

// ─── CONFIG STATUT ────────────────────────────────────────────────────────────
const getStatutCfg = (statut, isDark) => {
  const key = normalizeStatut(statut);
  const green = {
    dark: { lb: "rgba(22,163,74,0.15)", lt: "#86efac", lbr: "rgba(22,163,74,0.35)", dot: "#16a34a" },
    light: { lb: "#f0fdf4", lt: "#166534", lbr: "#bbf7d0", dot: "#16a34a" },
  };
  const red = {
    dark: { lb: "rgba(220,38,38,0.15)", lt: "#fca5a5", lbr: "rgba(220,38,38,0.35)", dot: "#dc2626" },
    light: { lb: "#fef2f2", lt: "#991b1b", lbr: "#fecaca", dot: "#dc2626" },
  };
  const orange = {
    dark: { lb: "rgba(249,115,22,0.15)", lt: "#fdba74", lbr: "rgba(249,115,22,0.35)", dot: "#f97316" },
    light: { lb: "#fff7ed", lt: "#c2410c", lbr: "#fed7aa", dot: "#f97316" },
  };
  const blue = {
    dark: { lb: "rgba(37,99,235,0.15)", lt: "#93c5fd", lbr: "rgba(37,99,235,0.35)", dot: "#2563eb" },
    light: { lb: "#eff6ff", lt: "#1d4ed8", lbr: "#bfdbfe", dot: "#2563eb" },
  };
  const neutral = {
    dark: { lb: "rgba(100,116,139,0.15)", lt: "#94a3b8", lbr: "rgba(100,116,139,0.35)", dot: "#64748b" },
    light: { lb: "#f1f5f9", lt: "#475569", lbr: "#e2e8f0", dot: "#64748b" },
  };
  const statusMap = {
    en_cours: { libelle: "En cours", ...blue },
    complet: { libelle: "Octroyé", ...green },
    accorde: { libelle: "Accordé", ...green },
    rejete: { libelle: "Rejeté", ...red },
    ajourne: { libelle: "Ajourné", ...orange },
    soumise: { libelle: "Reçu", ...blue },
    brouillon: { libelle: "Brouillon", ...neutral },
  };
  const cfg = statusMap[key] || statusMap.en_cours;
  return isDark ? cfg.dark : cfg.light;
};

// ─── DATE RANGE PICKER ────────────────────────────────────────────────────────
const DateRangePicker = ({ value, onChange, isDark }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const presets = [
    {
      l: "Aujourd'hui",
      f: () => { const d = new Date().toISOString().slice(0, 10); return { from: d, to: d, label: "Aujourd'hui" }; },
    },
    {
      l: "7 derniers jours",
      f: () => {
        const e = new Date(), s = new Date();
        s.setDate(s.getDate() - 7);
        return { from: s.toISOString().slice(0, 10), to: e.toISOString().slice(0, 10), label: "7 derniers jours" };
      },
    },
    {
      l: "Ce mois",
      f: () => {
        const d = new Date();
        return { from: new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10), to: d.toISOString().slice(0, 10), label: "Ce mois" };
      },
    },
    { l: "Année 2024", f: () => ({ from: "2024-01-01", to: "2024-12-31", label: "Année 2024" }) },
  ];
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const border = isDark ? "#334155" : "#e2e8f0";
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-normal transition-all cursor-pointer"
        style={{ background: isDark ? "#1e293b" : "#ffffff", border: `1px solid ${border}`, color: isDark ? "#cbd5e1" : "#475569" }}
      >
        <HiOutlineCalendar className="w-3.5 h-3.5 text-blue-500" />
        {value.label || "Période"}
      </button>
      {open && (
        <div
          className="absolute top-full right-0 z-[9999] min-w-[200px] p-1.5 rounded-xl mt-1"
          style={{ background: isDark ? "#1e293b" : "#ffffff", border: `1px solid ${border}`, boxShadow: "0 12px 40px rgba(0,0,0,0.2)" }}
        >
          {presets.map((p) => (
            <button
              key={p.l}
              onClick={() => { onChange(p.f()); setOpen(false); }}
              className="block w-full text-left px-3 py-1.5 rounded-lg text-xs font-normal transition-colors cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30"
              style={{ color: isDark ? "#cbd5e1" : "#334155" }}
            >
              {p.l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, trend, trendLabel, accentColor, isDark, total }) {
  const numValue = parseInt(value) || 0;
  const pct = total > 0 ? Math.round((numValue / total) * 100) : 0;
  const isTotal = label === "Total dossiers";
  const showPct = total !== undefined && !isTotal;

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
        <div className="text-3xl font-semibold tracking-tight leading-none" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
          {value}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: accentColor + "18" }}>
          <Icon className="w-5 h-5" style={{ color: accentColor }} />
        </div>
      </div>
      <div className="text-xs mb-2 font-normal" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
        {label}
      </div>
      {showPct ? (
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold" style={{ color: accentColor }}>{pct}%</span>
          <span className="text-xs font-normal" style={{ color: isDark ? "#475569" : "#94a3b8" }}>du total</span>
        </div>
      ) : trend !== undefined ? (
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold" style={{ color: trend >= 0 ? "#16a34a" : "#dc2626" }}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
          <span className="text-xs font-normal" style={{ color: isDark ? "#475569" : "#94a3b8" }}>{trendLabel}</span>
        </div>
      ) : null}
    </div>
  );
}

// ─── SECTION CARD ─────────────────────────────────────────────────────────────
function SectionCard({ title, subtitle, icon: Icon, iconBg, iconColor, stats, isDark }) {
  const totalCard = stats.find((s) => s.label === "Total dossiers");
  const total = totalCard ? parseInt(totalCard.value) || 0 : 0;
  const count = stats.length;
  const gridCols =
    count <= 3 ? "grid-cols-1 sm:grid-cols-3"
    : count === 4 ? "grid-cols-2 sm:grid-cols-4"
    : count === 5 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
    : "grid-cols-2 sm:grid-cols-3 xl:grid-cols-6";

  return (
    <div
      className="rounded-xl"
      style={{
        background: isDark ? "#1e293b" : "#ffffff",
        border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
        overflow: "hidden",
        boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)",
      }}
    >
      <div className="px-5 py-4 border-b flex items-center gap-2.5" style={{ borderColor: isDark ? "#334155" : "#e2e8f0" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: iconBg }}>
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        <div>
          <h2 className="text-base font-bold m-0" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>{title}</h2>
          <p className="text-xs m-0 font-normal" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>{subtitle}</p>
        </div>
      </div>
      <div className="p-5">
        <div className={`grid ${gridCols} gap-4`}>
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} isDark={isDark} total={total} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LINE CHART ───────────────────────────────────────────────────────────────
function LineChartSae({ isDark, data }) {
  const [hov, setHov] = useState(null);
  const pts = data || [];
  const W = 600, H = 250, PL = 30, PR = 30, PT = 20, PB = 30;
  const cW = W - PL - PR, cH = H - PT - PB;
  const maxV = Math.max(...pts.map((d) => Math.max(d.equivalence, d.accreditation)), 30);
  const xP = (i) => PL + (i / (pts.length - 1 || 1)) * cW;
  const yP = (v) => PT + cH - (v / maxV) * cH;
  const getSmoothPath = (key) => {
    if (pts.length === 0) return "";
    let path = `M ${xP(0).toFixed(1)} ${yP(pts[0][key]).toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const cx = (xP(i - 1) + xP(i)) / 2;
      path += ` C ${cx.toFixed(1)} ${yP(pts[i - 1][key]).toFixed(1)}, ${cx.toFixed(1)} ${yP(pts[i][key]).toFixed(1)}, ${xP(i).toFixed(1)} ${yP(pts[i][key]).toFixed(1)}`;
    }
    return path;
  };

  if (pts.length === 0) {
    return <div style={{ textAlign: "center", padding: "40px", color: isDark ? "#94a3b8" : "#64748b" }}>Aucune donnée disponible</div>;
  }

  const lpE = getSmoothPath("equivalence");
  const lpA = getSmoothPath("accreditation");
  const aE = `${lpE} L ${xP(pts.length - 1).toFixed(1)} ${PT + cH} L ${PL} ${PT + cH} Z`;
  const aA = `${lpA} L ${xP(pts.length - 1).toFixed(1)} ${PT + cH} L ${PL} ${PT + cH} Z`;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-bold" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Évolution des demandes</p>
          <p className="text-[11px] font-normal" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>Traitement mois par mois</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-md" style={{ background: "#3b82f6" }} />
            <span className="text-[11px] font-normal" style={{ color: isDark ? "#cbd5e1" : "#475569" }}>Équivalence</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-md" style={{ background: "#10b981" }} />
            <span className="text-[11px] font-normal" style={{ color: isDark ? "#cbd5e1" : "#475569" }}>Accréditation</span>
          </div>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible", display: "block" }}>
        <defs>
          <linearGradient id="saeLgE" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity=".25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="saeLgA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity=".25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <filter id="saeGlowE">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#3b82f6" floodOpacity="0.4" />
          </filter>
          <filter id="saeGlowA">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#10b981" floodOpacity="0.4" />
          </filter>
        </defs>
        {[0, Math.round(maxV / 4), Math.round(maxV / 2), Math.round((maxV * 3) / 4), maxV].map((v) => (
          <g key={v}>
            <line x1={PL} y1={yP(v)} x2={W - PR} y2={yP(v)} stroke={isDark ? "#334155" : "#f1f5f9"} strokeWidth="1" strokeDasharray="4 4" />
            <text x={PL - 10} y={yP(v) + 4} textAnchor="end" fontSize="10" fill={isDark ? "#64748b" : "#94a3b8"} fontWeight="normal">{v}</text>
          </g>
        ))}
        {pts.map((d, i) => (
          <text key={i} x={xP(i)} y={H - 10} textAnchor="middle" fontSize="11" fill={isDark ? "#94a3b8" : "#64748b"} fontWeight="normal">{d.month}</text>
        ))}
        <path d={aE} fill="url(#saeLgE)" />
        <path d={aA} fill="url(#saeLgA)" />
        <path d={lpE} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" filter="url(#saeGlowE)" />
        <path d={lpA} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" filter="url(#saeGlowA)" />
        {hov !== null && (
          <g>
            <line x1={xP(hov)} y1={PT} x2={xP(hov)} y2={PT + cH} stroke={isDark ? "#64748b" : "#94a3b8"} strokeWidth="1" strokeDasharray="4 4" />
            <circle cx={xP(hov)} cy={yP(pts[hov].equivalence)} r="5" fill="#3b82f6" stroke={isDark ? "#0f172a" : "#ffffff"} strokeWidth="2.5" />
            <circle cx={xP(hov)} cy={yP(pts[hov].accreditation)} r="5" fill="#10b981" stroke={isDark ? "#0f172a" : "#ffffff"} strokeWidth="2.5" />
            <g transform={`translate(${xP(hov) > W / 2 ? xP(hov) - 135 : xP(hov) + 15}, ${PT})`}>
              <rect width="120" height="65" rx="8" fill={isDark ? "#1e293b" : "#ffffff"} stroke={isDark ? "#334155" : "#e2e8f0"} filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
              <text x="12" y="20" fontSize="11" fontWeight="bold" fill={isDark ? "#f1f5f9" : "#0f172a"}>{pts[hov].month}</text>
              <circle cx="16" cy="36" r="3.5" fill="#3b82f6" />
              <text x="26" y="40" fontSize="11" fill={isDark ? "#94a3b8" : "#64748b"}>Équivalence:</text>
              <text x="108" y="40" fontSize="11" textAnchor="end" fill={isDark ? "#f1f5f9" : "#0f172a"}>{pts[hov].equivalence}</text>
              <circle cx="16" cy="52" r="3.5" fill="#10b981" />
              <text x="26" y="56" fontSize="11" fill={isDark ? "#94a3b8" : "#64748b"}>Accréditation:</text>
              <text x="108" y="56" fontSize="11" textAnchor="end" fill={isDark ? "#f1f5f9" : "#0f172a"}>{pts[hov].accreditation}</text>
            </g>
          </g>
        )}
        {pts.map((_, i) => (
          <rect key={i} x={xP(i) - cW / (pts.length - 1) / 2} y={PT} width={cW / (pts.length - 1)} height={cH} fill="transparent" onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} style={{ cursor: "pointer" }} />
        ))}
      </svg>
    </div>
  );
}

// ─── BAR CHART ────────────────────────────────────────────────────────────────
function BarChartSae({ isDark, data }) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const W = 580, H = 230, PL = 42, PR = 18, PT = 22, PB = 34;
  const cW = W - PL - PR, cH = H - PT - PB, bW = cW / data.length;

  if (data.length === 0) {
    return <div style={{ textAlign: "center", padding: "40px", color: isDark ? "#94a3b8" : "#64748b" }}>Aucune donnée disponible</div>;
  }

  return (
    <div>
      <p className="text-sm font-bold mb-0.5" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Demandes par niveau d'étude</p>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="mt-4" style={{ overflow: "visible", display: "block" }}>
        {[Math.round(maxVal / 5), Math.round((maxVal * 2) / 5), Math.round((maxVal * 3) / 5), Math.round((maxVal * 4) / 5), maxVal].map((v) => {
          const y = PT + cH - (v / maxVal) * cH;
          return (
            <g key={v}>
              <line x1={PL} y1={y} x2={W - PR} y2={y} stroke={isDark ? "#1e293b" : "#f1f5f9"} strokeWidth="1.2" />
              <text x={PL - 6} y={y + 4} textAnchor="end" fontSize="10.5" fill={isDark ? "#475569" : "#94a3b8"} fontWeight="normal">{v}</text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const bH = (d.value / maxVal) * cH, x = PL + i * bW + bW * 0.2, w = bW * 0.6, y = PT + cH - bH;
          return (
            <g key={i}>
              <rect x={x} y={PT} width={w} height={cH} rx="5" fill={isDark ? "#0f172a" : "#f8fafc"} />
              <rect x={x} y={y} width={w} height={bH} rx="5" fill={d.color} />
              <text x={x + w / 2} y={y - 7} textAnchor="middle" fontSize="12" fontWeight="normal" fill={d.color}>{d.value}</text>
              <text x={x + w / 2} y={H - 4} textAnchor="middle" fontSize="12" fill={isDark ? "#475569" : "#94a3b8"} fontWeight="normal">{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── DONUT CHART ──────────────────────────────────────────────────────────────
function DonutChartSae({ isDark, data }) {
  const [hov, setHov] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 120, cy = 120, R = 100, r = 62;
  let angle = -Math.PI / 2;

  if (data.length === 0) {
    return <div style={{ textAlign: "center", padding: "40px", color: isDark ? "#94a3b8" : "#64748b" }}>Aucune donnée disponible</div>;
  }

  return (
    <div>
      <p className="text-sm font-bold mb-0.5" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Répartition par type</p>
      <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
        <svg viewBox="0 0 240 240" width="200" style={{ display: "block", overflow: "visible" }}>
          {data.map((d, i) => {
            const a = (d.value / total) * 2 * Math.PI;
            const x1 = cx + R * Math.cos(angle), y1 = cy + R * Math.sin(angle);
            const x2 = cx + R * Math.cos(angle + a), y2 = cy + R * Math.sin(angle + a);
            const ix1 = cx + r * Math.cos(angle), iy1 = cy + r * Math.sin(angle);
            const ix2 = cx + r * Math.cos(angle + a), iy2 = cy + r * Math.sin(angle + a);
            const lg = a > Math.PI ? 1 : 0;
            const path = `M ${x1} ${y1} A ${R} ${R} 0 ${lg} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${r} ${r} 0 ${lg} 0 ${ix1} ${iy1} Z`;
            angle += a;
            return (
              <path key={i} d={path} fill={d.color} stroke={isDark ? "#1e293b" : "#ffffff"} strokeWidth="3"
                opacity={hov !== null && hov !== i ? 0.45 : 1}
                style={{ transformOrigin: `${cx}px ${cy}px`, transform: `scale(${hov === i ? 1.05 : 1})`, transition: "all .2s", cursor: "pointer" }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
              />
            );
          })}
          <text x={cx} y={cy - 10} textAnchor="middle" fontSize="30" fontWeight="bold" fill={isDark ? "#f1f5f9" : "#1e293b"}>{total}</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fontWeight="normal" fill="#64748b">demandes</text>
        </svg>
        <div className="flex-1 w-full space-y-3">
          {data.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl border transition-all"
              style={{ background: hov === i ? `${s.color}18` : "transparent", borderColor: hov === i ? s.color : isDark ? "#334155" : "#f1f5f9", cursor: "pointer" }}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                <span className="text-xs font-normal" style={{ color: isDark ? "#cbd5e1" : "#475569" }}>{s.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-normal" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px]" style={{ color: "#94a3b8" }}>({Math.round((s.value / total) * 100)}%)</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STATUT CHART ─────────────────────────────────────────────────────────────
function StatutChartSae({ isDark, data }) {
  const [hov, setHov] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 120, cy = 120, R = 100, r = 62;
  let angle = -Math.PI / 2;

  if (data.length === 0) {
    return <div style={{ textAlign: "center", padding: "40px", color: isDark ? "#94a3b8" : "#64748b" }}>Aucune donnée disponible</div>;
  }

  return (
    <div>
      <p className="text-sm font-bold mb-0.5" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Répartition par statut</p>
      <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
        <svg viewBox="0 0 240 240" width="200" style={{ display: "block", overflow: "visible" }}>
          {data.map((d, i) => {
            const a = (d.value / total) * 2 * Math.PI;
            const x1 = cx + R * Math.cos(angle), y1 = cy + R * Math.sin(angle);
            const x2 = cx + R * Math.cos(angle + a), y2 = cy + R * Math.sin(angle + a);
            const ix1 = cx + r * Math.cos(angle), iy1 = cy + r * Math.sin(angle);
            const ix2 = cx + r * Math.cos(angle + a), iy2 = cy + r * Math.sin(angle + a);
            const lg = a > Math.PI ? 1 : 0;
            const path = `M ${x1} ${y1} A ${R} ${R} 0 ${lg} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${r} ${r} 0 ${lg} 0 ${ix1} ${iy1} Z`;
            angle += a;
            return (
              <path key={i} d={path} fill={d.color} stroke={isDark ? "#1e293b" : "#ffffff"} strokeWidth="3"
                opacity={hov !== null && hov !== i ? 0.45 : 1}
                style={{ transformOrigin: `${cx}px ${cy}px`, transform: `scale(${hov === i ? 1.05 : 1})`, transition: "all .2s", cursor: "pointer" }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
              />
            );
          })}
          <text x={cx} y={cy - 10} textAnchor="middle" fontSize="30" fontWeight="bold" fill={isDark ? "#f1f5f9" : "#1e293b"}>{total}</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fontWeight="normal" fill="#64748b">demandes</text>
        </svg>
        <div className="flex-1 w-full space-y-3">
          {data.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl border transition-all"
              style={{ background: hov === i ? `${s.color}18` : "transparent", borderColor: hov === i ? s.color : isDark ? "#334155" : "#f1f5f9", cursor: "pointer" }}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                <span className="text-xs font-normal" style={{ color: isDark ? "#cbd5e1" : "#475569" }}>{s.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-normal" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px]" style={{ color: "#94a3b8" }}>({Math.round((s.value / total) * 100)}%)</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TABLEAU DES DEMANDES ─────────────────────────────────────────────────────
function DemandeTable({ isDark, data, loading }) {
  const [filter, setFilter] = useState("Tous");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

  let filteredData = [...data];
  if (filter !== "Tous") {
    if (filter === "Équivalence") {
      filteredData = filteredData.filter((d) => d.type === "Équivalence");
    } else if (filter === "Accréditation") {
      filteredData = filteredData.filter((d) => d.type === "Accréditation");
    } else if (["Licence", "Master", "Doctorat"].includes(filter)) {
      filteredData = filteredData.filter((d) => d.niveau === filter);
    } else {
      filteredData = filteredData.filter((d) => {
        const statusMap = {
          en_cours: "En cours", octroyé: "Octroyé", rejeté: "Rejeté", ajourné: "Ajourné",
          accorde: "Accordé", complet: "Octroyé", soumise: "Reçu", brouillon: "Brouillon",
          accredite: "Accrédité",
        };
        return statusMap[d.statut] === filter;
      });
    }
  }

  const handleSort = (key) => {
    setSortConfig((p) => ({ key, direction: p.key === key && p.direction === "asc" ? "desc" : "asc" }));
    setPage(1);
  };

  const sortedData = [...filteredData].sort((a, b) => {
    const dir = sortConfig.direction === "asc" ? 1 : -1;
    if (sortConfig.key === "date") return (new Date(a.date) - new Date(b.date)) * dir;
    if (sortConfig.key === "statut") {
      const statusMap = { brouillon: 1, soumise: 2, en_cours: 3, complet: 4, ajourne: 5, rejete: 6, accorde: 7, accredite: 8 };
      return (statusMap[a.statut] - statusMap[b.statut]) * dir;
    }
    return a[sortConfig.key]?.toString().localeCompare(b[sortConfig.key]?.toString()) * dir;
  });

  const totalPages = Math.max(1, Math.ceil(sortedData.length / perPage));
  const pagedData = sortedData.slice((page - 1) * perPage, page * perPage);

  const borderC = isDark ? "#334155" : "#e2e8f0";
  const headerBg = isDark ? "#0f172a" : "#f8fafc";
  const textC = isDark ? "#e2e8f0" : "#334155";
  const subC = isDark ? "#475569" : "#94a3b8";
  const rowHover = isDark ? "rgba(99,102,241,0.06)" : "#f8faff";

  const COLS = [
    { k: "id", l: "ID" },
    { k: "demandeur", l: "Demandeur" },
    { k: "type", l: "Type" },
    { k: "niveau", l: "Niveau" },
    { k: "statut", l: "Statut" },
    { k: "date", l: "Date" },
  ];

  const statusMap = {
    en_cours: "En cours", complet: "Octroyé", accorde: "Accordé", rejete: "Rejeté",
    ajourne: "Ajourné", soumise: "Reçu", brouillon: "Brouillon", accredite: "Accrédité",
  };

  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", color: subC }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <FaSpinner style={{ animation: "spin 0.8s linear infinite", fontSize: 22 }} />
          <span style={{ fontSize: 13 }}>Chargement des données...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: borderC }}>
        <div className="flex items-center gap-2 text-xs font-normal" style={{ color: subC }}>
          Afficher
          <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            className="p-1 rounded-md border text-xs bg-transparent outline-none cursor-pointer" style={{ borderColor: borderC, color: textC }}
          >
            {[5, 10, 20, 50].map((v) => (<option key={v} value={v}>{v}</option>))}
          </select>
          demandes
        </div>
        <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          className="px-3 py-1.5 rounded-lg border text-xs font-normal bg-transparent cursor-pointer outline-none" style={{ borderColor: borderC, color: textC }}
        >
          <option value="Tous">Toutes les demandes</option>
          <optgroup label="Par Type">
            <option value="Équivalence">Équivalence</option>
            <option value="Accréditation">Accréditation</option>
          </optgroup>
          <optgroup label="Par Statut">
            <option value="Brouillon">Brouillon</option>
            <option value="Reçu">Reçu</option>
            <option value="En cours">En cours</option>
            <option value="Octroyé">Octroyé</option>
            <option value="Ajourné">Ajourné</option>
            <option value="Rejeté">Rejeté</option>
            <option value="Accordé">Accordé</option>
            <option value="Accrédité">Accrédité</option>
          </optgroup>
          <optgroup label="Par Niveau">
            <option value="Licence">Licence</option>
            <option value="Master">Master</option>
            <option value="Doctorat">Doctorat</option>
          </optgroup>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[800px]">
          <thead>
            <tr style={{ background: headerBg, borderBottom: `2px solid ${borderC}` }}>
              {COLS.map(({ k, l }) => (
                <th key={k} onClick={() => handleSort(k)}
                  className="px-4 py-3.5 text-center text-xs font-normal uppercase tracking-wider whitespace-nowrap cursor-pointer select-none"
                  style={{ color: isDark ? "#64748b" : "#94a3b8" }}
                >
                  <div className="flex items-center justify-center gap-1">
                    {l}
                    {sortConfig.key === k && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        {sortConfig.direction === "asc" ? <path d="M12 5v14M8 9l4-4 4 4" /> : <path d="M12 19V5M8 15l4 4 4-4" />}
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td colSpan={COLS.length} className="px-4 py-10 text-center text-sm font-normal" style={{ color: subC }}>
                  Aucune demande trouvée.
                </td>
              </tr>
            ) : (
              pagedData.map((d, index) => {
                const cfg = getStatutCfg(d.statut, isDark);
                const sequentialId = (page - 1) * perPage + index + 1;
                return (
                  <tr key={d.id} className="transition-colors duration-150 cursor-default" style={{ borderBottom: `1px solid ${borderC}` }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = rowHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-4 py-4 text-center">
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-normal"
                        style={{ background: isDark ? "#0f172a" : "#f1f5f9", color: isDark ? "#94a3b8" : "#64748b" }}
                      >
                        {sequentialId}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-normal text-center" style={{ color: textC }}>{d.demandeur}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-normal"
                        style={{
                          background: d.type === "Accréditation" ? (isDark ? "rgba(16,185,129,0.12)" : "#f0fdf4") : (isDark ? "#0f172a" : "#f8fafc"),
                          color: d.type === "Accréditation" ? "#10b981" : (isDark ? "#94a3b8" : "#64748b"),
                          border: `1px solid ${d.type === "Accréditation" ? (isDark ? "rgba(16,185,129,0.3)" : "#bbf7d0") : (isDark ? "#1e293b" : "#e2e8f0")}`,
                        }}
                      >
                        {d.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-normal"
                        style={{ background: isDark ? "#0f172a" : "#f8fafc", color: isDark ? "#94a3b8" : "#64748b", border: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}` }}
                      >
                        {d.niveau}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-normal border"
                        style={{ background: cfg.lb, color: cfg.lt, borderColor: cfg.lbr }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                        {statusMap[d.statut] || d.statut}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-normal text-center" style={{ color: subC }}>{d.date}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: `1px solid ${borderC}` }}>
        <span className="text-xs font-normal" style={{ color: subC }}>
          {sortedData.length > 0
            ? `Affichage de ${(page - 1) * perPage + 1} à ${Math.min(page * perPage, sortedData.length)} sur ${sortedData.length} demandes`
            : "Aucune demande"}
        </span>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30 cursor-pointer"
            style={{ border: `1px solid ${borderC}`, background: isDark ? "#1e293b" : "#ffffff", color: isDark ? "#94a3b8" : "#64748b" }}
          >
            <HiOutlineChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className="w-8 h-8 rounded-lg text-xs font-normal transition cursor-pointer"
              style={{ background: p === page ? "#3b82f6" : isDark ? "#1e293b" : "#ffffff", color: p === page ? "#fff" : isDark ? "#94a3b8" : "#64748b", border: `1px solid ${p === page ? "#3b82f6" : borderC}` }}
            >
              {p}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30 cursor-pointer"
            style={{ border: `1px solid ${borderC}`, background: isDark ? "#1e293b" : "#ffffff", color: isDark ? "#94a3b8" : "#64748b" }}
          >
            <HiOutlineChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── VUE PRINCIPALE ───────────────────────────────────────────────────────────
export default function DashboardSaeView() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [chart, setChart] = useState("line");
  const [dateRange, setDateRange] = useState({ label: "Année 2024", from: "2024-01-01", to: "2024-12-31" });
  const [demandes, setDemandes] = useState([]);
  const [accDemandesData, setAccDemandesData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({ monthly: [], byNiveau: [], byType: [], byStatut: [] });

  const processChartData = (equivData, accData = []) => {
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    const monthlyData = months.map((month) => ({ month, equivalence: 0, accreditation: 0 }));
    const niveauCount = { Licence: 0, Master: 0, Doctorat: 0 };
    const typeCount = { Équivalence: 0, Accréditation: 0 };
    const statutCount = { en_cours: 0, complet: 0, accorde: 0, rejete: 0, ajourne: 0, soumise: 0, brouillon: 0, accredite: 0 };

    equivData.forEach((demande) => {
      const date = new Date(demande.submitted_at || demande.created_at);
      const monthIndex = date.getMonth();
      if (monthIndex >= 0 && monthIndex < 12) monthlyData[monthIndex].equivalence += 1;
      const niveau = demande.type_diplome || demande.typeDiplome;
      if (niveau in niveauCount) niveauCount[niveau] += 1;
      typeCount.Équivalence += 1;
      const statut = normalizeStatut(demande.statut);
      if (statut in statutCount) statutCount[statut] += 1;
    });

    // ✅ Accréditations par mois + stats
    accData.forEach((demande) => {
      const date = new Date(demande.created_at || demande.submitted_at);
      if (!isNaN(date)) {
        const monthIndex = date.getMonth();
        if (monthIndex >= 0 && monthIndex < 12) monthlyData[monthIndex].accreditation += 1;
      }
      typeCount.Accréditation += 1;
      // Niveau accréditation
      const grade = demande.grade;
      if (grade === "LICENCE") niveauCount.Licence += 1;
      else if (grade === "MASTER") niveauCount.Master += 1;
      else if (grade === "DOCTORAT") niveauCount.Doctorat += 1;
      // Statut accréditation
      const statut = demande.statut;
      if (statut === STATUT_DEMANDE.EN_COURS && "en_cours" in statutCount) statutCount.en_cours += 1;
      else if (statut === STATUT_DEMANDE.ACCREDITE && "accredite" in statutCount) statutCount.accredite += 1;
      else if (statut === STATUT_DEMANDE.REJETE && "rejete" in statutCount) statutCount.rejete += 1;
      else if (statut === STATUT_DEMANDE.AJOURNE && "ajourne" in statutCount) statutCount.ajourne += 1;
      else if (statut === STATUT_DEMANDE.BROUILLON && "brouillon" in statutCount) statutCount.brouillon += 1;
    });

    const byNiveau = Object.entries(niveauCount).map(([label, value]) => ({
      label, value, color: label === "Licence" ? "#3b82f6" : label === "Master" ? "#10b981" : "#f59e0b",
    }));
    const byType = Object.entries(typeCount)
      .filter(([_, v]) => v > 0)
      .map(([label, value]) => ({ label, value, color: label === "Équivalence" ? "#3b82f6" : "#10b981" }));

    const statutLabels = {
      en_cours: "En cours", complet: "Octroyé", accorde: "Accordé", rejete: "Rejeté",
      ajourne: "Ajourné", soumise: "Reçu", brouillon: "Brouillon", accredite: "Accrédité",
    };
    const statutColors = {
      en_cours: "#0ea5e9", complet: "#16a34a", accorde: "#16a34a", rejete: "#dc2626",
      ajourne: "#f97316", soumise: "#0891b2", brouillon: "#64748b", accredite: "#10b981",
    };
    const byStatut = Object.entries(statutCount)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => ({ label: statutLabels[key] || key, value, color: statutColors[key] || "#64748b" }));

    setChartData({ monthly: monthlyData, byNiveau, byType, byStatut });
  };

  const loadData = async () => {
    try {
      setLoading(true);

      const [equivResult, accResult, accArchivedResult] = await Promise.allSettled([
        getAllDemandesAdmin({}, true),
        getAccreditationDemandes(),
        getArchivedAccreditationDemandes(),
      ]);

      // Équivalences
      if (equivResult.status === "fulfilled" && equivResult.value?.success && equivResult.value?.data) {
        const demandesData = equivResult.value.data;
        setDemandes(demandesData);
        const statsResponse = await getDemandesStats();
        if (statsResponse.success) setStats(statsResponse.data);

        // Accréditations (actives)
        const accList = accResult.status === "fulfilled" ? (accResult.value || []) : [];
        // Accréditations archivées
        const accArchived = accArchivedResult.status === "fulfilled" ? (accArchivedResult.value || []) : [];
        // Fusion : actives + archivées
        const allAccDemandes = [
          ...accList,
          ...accArchived.filter((a) => !accList.some((b) => b.id === a.id)),
        ];
        setAccDemandesData(allAccDemandes);
        processChartData(demandesData, allAccDemandes);
      } else {
        toast.error("Impossible de charger les données d'équivalence");
        // Charger quand même les accréditations
        const accList = accResult.status === "fulfilled" ? (accResult.value || []) : [];
        const accArchived = accArchivedResult.status === "fulfilled" ? (accArchivedResult.value || []) : [];
        const allAccDemandes = [...accList, ...accArchived.filter((a) => !accList.some((b) => b.id === a.id))];
        setAccDemandesData(allAccDemandes);
        processChartData([], allAccDemandes);
      }

      if (accResult.status === "rejected") {
        console.warn("[loadData] Accréditations non chargées:", accResult.reason?.message);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      if (error.response?.status === 403) toast.error("Accès refusé - vous n'avez pas les droits administrateur");
      else if (error.response?.status === 401) toast.error("Session expirée - veuillez vous reconnecter");
      else toast.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ─── STATS ÉQUIVALENCE ────────────────────────────────────────────────────
  const getStats = () => {
    if (!demandes.length) return { total: 0, en_cours: 0, octroyes: 0, rejetes: 0, ajournes: 0, archives: 0, trend_total: 0 };
    const total = demandes.length;
    const en_cours = demandes.filter((d) => normalizeStatut(d.statut) === "en_cours").length;
    const octroyes = demandes.filter((d) => { const s = normalizeStatut(d.statut); return s === "complet" || s === "accorde"; }).length;
    const rejetes = demandes.filter((d) => normalizeStatut(d.statut) === "rejete").length;
    const ajournes = demandes.filter((d) => normalizeStatut(d.statut) === "ajourne").length;
    const archives = demandes.filter((d) => d.is_archived === true).length;

    const now = new Date();
    const currentMonth = now.getMonth(), currentYear = now.getFullYear();
    const prevDate = new Date(currentYear, currentMonth - 1, 1);
    const countInMonth = (year, month) =>
      demandes.filter((d) => {
        if (d.is_archived) return false;
        const dt = new Date(d.submitted_at || d.created_at);
        return !isNaN(dt) && dt.getFullYear() === year && dt.getMonth() === month;
      }).length;
    const currCount = countInMonth(currentYear, currentMonth);
    const prevCount = countInMonth(prevDate.getFullYear(), prevDate.getMonth());
    const trend_total = prevCount > 0 ? Math.round(((currCount - prevCount) / prevCount) * 100) : 0;

    return { total, en_cours, octroyes, rejetes, ajournes, archives, trend_total };
  };

  // ─── STATS ACCRÉDITATION ──────────────────────────────────────────────────
  const getAccStats = () => {
    const actives = accDemandesData.filter((d) => !d.is_archived && !d.isArchived);
    const archived = accDemandesData.filter((d) => d.is_archived === true || d.isArchived === true);

    const total = actives.length + archived.length;
    const en_cours = actives.filter((d) => d.statut === STATUT_DEMANDE.EN_COURS).length;
    const accredites = actives.filter((d) => d.statut === STATUT_DEMANDE.ACCREDITE).length;
    const rejetes = actives.filter((d) => d.statut === STATUT_DEMANDE.REJETE).length;
    const ajournes = actives.filter((d) => d.statut === STATUT_DEMANDE.AJOURNE).length;
    const brouillons = actives.filter((d) => d.statut === STATUT_DEMANDE.BROUILLON).length;
    const archives = archived.length;

    const now = new Date();
    const cm = now.getMonth(), cy = now.getFullYear();
    const pm = new Date(cy, cm - 1, 1);
    const countInMonth = (year, month) =>
      accDemandesData.filter((d) => {
        if (d.is_archived || d.isArchived) return false;
        const dt = new Date(d.created_at);
        return !isNaN(dt) && dt.getFullYear() === year && dt.getMonth() === month;
      }).length;
    const prevCount = countInMonth(pm.getFullYear(), pm.getMonth());
    const currCount = countInMonth(cy, cm);
    const trend = prevCount > 0 ? Math.round(((currCount - prevCount) / prevCount) * 100) : 0;

    return { total, en_cours, accredites, rejetes, ajournes, brouillons, archives, trend };
  };

  const statsData = getStats();
  const accStats = getAccStats();

  const equivalenceStats = [
    { label: "Total dossiers", value: statsData.total.toString(), icon: FaFileAlt, trend: statsData.trend_total || 0, trendLabel: "vs mois dernier", accentColor: "#3b82f6" },
    { label: "En cours", value: statsData.en_cours.toString(), icon: FaSpinner, accentColor: "#0ea5e9" },
    { label: "Octroyés", value: statsData.octroyes.toString(), icon: FaCheckCircle, accentColor: "#16a34a" },
    { label: "Rejetés", value: statsData.rejetes.toString(), icon: FaTimesCircle, accentColor: "#dc2626" },
    { label: "Ajournés", value: statsData.ajournes.toString(), icon: FaHourglassHalf, accentColor: "#f97316" },
    { label: "Archivés", value: statsData.archives?.toString() || "0", icon: FaArchive, accentColor: "#64748b" },
  ];

  // ✅ Section Accréditation avec archivés + total complet
  const accreditationStats = [
    { label: "Total dossiers", value: accStats.total.toString(), icon: FaGraduationCap, trend: accStats.trend, trendLabel: "vs mois dernier", accentColor: "#10b981" },
    { label: "En cours", value: accStats.en_cours.toString(), icon: FaSpinner, accentColor: "#0ea5e9" },
    { label: "Accrédités", value: accStats.accredites.toString(), icon: FaCheckCircle, accentColor: "#16a34a" },
    { label: "Rejetés", value: accStats.rejetes.toString(), icon: FaTimesCircle, accentColor: "#dc2626" },
    { label: "Ajournés", value: accStats.ajournes.toString(), icon: FaHourglassHalf, accentColor: "#f97316" },
    { label: "Archivés", value: accStats.archives.toString(), icon: FaArchive, accentColor: "#64748b" },
  ];

  // ─── TABLE DATA : Équivalences + Accréditations fusionnées ────────────────
  const equivTableData = demandes.map((d) => ({
    id: d.id,
    demandeur: `${d.nom || ""} ${d.prenoms || ""}`.trim(),
    type: "Équivalence",
    niveau: d.type_diplome || d.typeDiplome || "-",
    statut: normalizeStatut(d.statut),
    date: formatDate(d.submitted_at || d.created_at),
  }));

  const accTableData = accDemandesData.map((d) => ({
    id: `acc_${d.id}`,
    demandeur: d.responsable || "-",
    type: "Accréditation",
    niveau: d.grade
      ? d.grade === "LICENCE" ? "Licence" : d.grade === "MASTER" ? "Master" : d.grade === "DOCTORAT" ? "Doctorat" : d.grade
      : "-",
    statut: d.statut === STATUT_DEMANDE.ACCREDITE ? "accredite"
      : d.statut === STATUT_DEMANDE.EN_COURS ? "en_cours"
      : d.statut === STATUT_DEMANDE.REJETE ? "rejete"
      : d.statut === STATUT_DEMANDE.AJOURNE ? "ajourne"
      : d.statut === STATUT_DEMANDE.BROUILLON ? "brouillon"
      : normalizeStatut(d.statut),
    date: formatDate(d.created_at || d.submitted_at),
  }));

  const tableData = [...equivTableData, ...accTableData].sort(
    (a, b) => new Date(b.date.split("/").reverse().join("-")) - new Date(a.date.split("/").reverse().join("-"))
  );

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 font-sans" style={{ background: isDark ? "#0f172a" : "#ffffff" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold mb-0.5" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Tableau de bord SAE</h1>
            <p className="text-sm font-normal" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>
              {loading
                ? "Chargement des données..."
                : `${demandes.length} demande(s) d'équivalence · ${accDemandesData.length} accréditation(s)`}
            </p>
          </div>
          <DateRangePicker value={dateRange} onChange={setDateRange} isDark={isDark} />
        </div>

        {/* Section Équivalence */}
        <SectionCard
          title="Équivalence"
          subtitle="Gestion des demandes d'équivalence"
          icon={FaFileAlt}
          iconBg="#3b82f618"
          iconColor="#3b82f6"
          stats={equivalenceStats}
          isDark={isDark}
        />

        {/* Section Accréditation ✅ données réelles + archivés */}
        <SectionCard
          title="Accréditations"
          subtitle="Gestion des demandes d'accréditation"
          icon={FaGraduationCap}
          iconBg="#10b98118"
          iconColor="#10b981"
          stats={accreditationStats}
          isDark={isDark}
        />

        {/* Section Graphiques */}
        <div
          className="rounded-xl"
          style={{ background: isDark ? "#1e293b" : "#ffffff", border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`, overflow: "hidden", boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b flex-wrap gap-3" style={{ borderColor: isDark ? "#334155" : "#e2e8f0" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: isDark ? "#0f172a" : "#f8fafc" }}>
                <FaChartLine className="w-4 h-4" style={{ color: "#3b82f6" }} />
              </div>
              <div>
                <h2 className="text-sm font-bold m-0" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Analyses des demandes</h2>
                <p className="text-[11px] m-0 font-normal" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>{dateRange.label}</p>
              </div>
            </div>
            <div className="flex gap-0.5 p-0.5 rounded-xl" style={{ border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`, background: isDark ? "#0f172a" : "#f8fafc" }}>
              {[
                { k: "line", I: PiChartLineUp, l: "Évolution" },
                { k: "bar", I: PiChartBar, l: "Niveaux" },
                { k: "pie", I: PiChartPieSlice, l: "Types" },
                { k: "statut", I: PiChartPieSlice, l: "Statuts" },
              ].map(({ k, I, l }) => (
                <button key={k} onClick={() => setChart(k)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer"
                  style={{
                    background: chart === k ? (isDark ? "#1e293b" : "#ffffff") : "transparent",
                    color: chart === k ? "#3b82f6" : isDark ? "#64748b" : "#94a3b8",
                    boxShadow: chart === k ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
                  }}
                >
                  <I className="w-3.5 h-3.5" />
                  <span>{l}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="p-5">
            <div className="mx-auto" style={{ maxWidth: "740px" }}>
              {loading ? (
                <div style={{ textAlign: "center", padding: "40px", color: isDark ? "#94a3b8" : "#64748b" }}>
                  <FaSpinner style={{ animation: "spin 0.8s linear infinite", fontSize: 24, marginBottom: 10 }} />
                  <p>Chargement des graphiques...</p>
                </div>
              ) : (
                <>
                  {chart === "line" && <LineChartSae isDark={isDark} data={chartData.monthly} />}
                  {chart === "bar" && <BarChartSae isDark={isDark} data={chartData.byNiveau} />}
                  {chart === "pie" && <DonutChartSae isDark={isDark} data={chartData.byType} />}
                  {chart === "statut" && <StatutChartSae isDark={isDark} data={chartData.byStatut} />}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Section Tableau — Équivalences + Accréditations fusionnées */}
        <div
          className="rounded-xl"
          style={{ background: isDark ? "#1e293b" : "#ffffff", border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`, overflow: "hidden", boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)" }}
        >
          <div className="px-5 py-4 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: isDark ? "#0f172a" : "#f8fafc" }}>
              <FaClipboardList className="w-4 h-4" style={{ color: "#10b981" }} />
            </div>
            <div>
              <h2 className="text-sm font-bold m-0" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Demandes récentes</h2>
              <p className="text-[11px] m-0 font-normal" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>
                Équivalences et Accréditations — filtrez et triez
              </p>
            </div>
          </div>
          <DemandeTable isDark={isDark} data={tableData} loading={loading} />
        </div>
      </div>
    </div>
  );
}
