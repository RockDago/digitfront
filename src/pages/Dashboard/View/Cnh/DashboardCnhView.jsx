// C:\Users\hp\Desktop\Digitalisation\frontend\src\pages\Dashboard\View\Cnh\DashboardCnhView.jsx

import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRegFileAlt, FaHourglassHalf,
  FaCheckCircle, 
  FaSpinner, FaChartLine, FaClipboardList, FaArrowRight,
   FaArchive,
} from "react-icons/fa";
import { HiOutlineCalendar, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { PiChartLineUp, PiChartBar, PiChartPieSlice } from "react-icons/pi";
import { ThemeContext } from "../../../../context/ThemeContext";

// ─── DONNÉES CNH ──────────────────────────────────────────────────────────────

const demandesParMois = [
  { month: "Août", habilitation: 5, renouvellement: 2 },
  { month: "Sep",  habilitation: 8, renouvellement: 3 },
  { month: "Oct",  habilitation: 6, renouvellement: 4 },
  { month: "Nov",  habilitation: 10, renouvellement: 5 },
  { month: "Déc",  habilitation: 7, renouvellement: 3 },
  { month: "Jan",  habilitation: 12, renouvellement: 6 },
  { month: "Fév",  habilitation: 9, renouvellement: 4 },
];

const demandesParNiveau = [
  { label: "Licence",  value: 15, color: "#3b82f6" },
  { label: "Master",   value: 24, color: "#10b981" },
  { label: "Doctorat", value: 8, color: "#f59e0b" },
];

const demandesParType = [
  { label: "Habilitation",   value: 28, color: "#3b82f6" },
  { label: "Renouvellement", value: 19, color: "#10b981" },
];

const demandesParSecteur = [
  { label: "Public",  value: 32, color: "#3b82f6" },
  { label: "Privé",   value: 15, color: "#a855f7" },
];

const demandesCnh = [
  { id: "HAB-2026-031", demandeur: "Université d'Antananarivo", type: "Habilitation", niveau: "Master", statut: "En attente", date: "22/02/2026" },
  { id: "HAB-2026-030", demandeur: "ESPA", type: "Habilitation", niveau: "Licence", statut: "En cours", date: "21/02/2026" },
  { id: "HAB-2026-029", demandeur: "INSCAE", type: "Renouvellement", niveau: "Master", statut: "Habilité", date: "20/02/2026" },
  { id: "HAB-2026-028", demandeur: "Université de Fianarantsoa", type: "Habilitation", niveau: "Doctorat", statut: "En attente", date: "19/02/2026" },
  { id: "HAB-2026-027", demandeur: "ISPM", type: "Renouvellement", niveau: "Master", statut: "Rejeté", date: "18/02/2026" },
  { id: "HAB-2026-026", demandeur: "ESMIA", type: "Habilitation", niveau: "Licence", statut: "Habilité", date: "17/02/2026" },
  { id: "HAB-2026-025", demandeur: "Université de Toamasina", type: "Renouvellement", niveau: "Master", statut: "En cours", date: "16/02/2026" },
  { id: "HAB-2026-024", demandeur: "CNTEMAD", type: "Habilitation", niveau: "Licence", statut: "Ajourné", date: "15/02/2026" },
];

// ─── CONFIG STATUT ────────────────────────────────────────────────────────────
const getStatutCfg = (statut, isDark) => {
  switch (statut) {
    case "Habilité":   return isDark ? { lb:"rgba(22,163,74,0.15)",  lt:"#86efac", lbr:"rgba(22,163,74,0.35)",  dot:"#16a34a" } : { lb:"#f0fdf4", lt:"#166534", lbr:"#bbf7d0", dot:"#16a34a" };
    case "En cours":   return isDark ? { lb:"rgba(37,99,235,0.15)",  lt:"#93c5fd", lbr:"rgba(37,99,235,0.35)",  dot:"#2563eb" } : { lb:"#eff6ff", lt:"#1d4ed8", lbr:"#bfdbfe", dot:"#2563eb" };
    case "Rejeté":     return isDark ? { lb:"rgba(220,38,38,0.15)",  lt:"#fca5a5", lbr:"rgba(220,38,38,0.35)",  dot:"#dc2626" } : { lb:"#fef2f2", lt:"#991b1b", lbr:"#fecaca", dot:"#dc2626" };
    case "Ajourné":    return isDark ? { lb:"rgba(249,115,22,0.15)", lt:"#fdba74", lbr:"rgba(249,115,22,0.35)", dot:"#f97316" } : { lb:"#fff7ed", lt:"#c2410c", lbr:"#fed7aa", dot:"#f97316" };
    case "En attente": return isDark ? { lb:"rgba(234,179,8,0.15)",  lt:"#fde047", lbr:"rgba(234,179,8,0.35)",  dot:"#eab308" } : { lb:"#fefce8", lt:"#a16207", lbr:"#fef08a", dot:"#eab308" };
    default:           return isDark ? { lb:"rgba(37,99,235,0.15)",  lt:"#93c5fd", lbr:"rgba(37,99,235,0.35)",  dot:"#2563eb" } : { lb:"#eff6ff", lt:"#1d4ed8", lbr:"#bfdbfe", dot:"#2563eb" };
  }
};

// ─── DATE RANGE PICKER ────────────────────────────────────────────────────────
const DateRangePicker = ({ value, onChange, isDark }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const presets = [
    { l: "Aujourd'hui",      f: () => { const d = new Date().toISOString().slice(0,10); return { from:d, to:d, label:"Aujourd'hui" }; } },
    { l: "7 derniers jours", f: () => { const e=new Date(),s=new Date(); s.setDate(s.getDate()-7); return { from:s.toISOString().slice(0,10), to:e.toISOString().slice(0,10), label:"7 derniers jours" }; } },
    { l: "Ce mois",          f: () => { const d=new Date(); return { from:new Date(d.getFullYear(),d.getMonth(),1).toISOString().slice(0,10), to:d.toISOString().slice(0,10), label:"Ce mois" }; } },
    { l: "Année 2026",       f: () => ({ from:"2026-01-01", to:"2026-12-31", label:"Année 2026" }) },
  ];
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const border = isDark ? "#334155" : "#e2e8f0";
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-normal transition-all cursor-pointer"
        style={{ background: isDark ? "#1e293b" : "#ffffff", border: `1px solid ${border}`, color: isDark ? "#cbd5e1" : "#475569" }}>
        <HiOutlineCalendar className="w-3.5 h-3.5 text-blue-500" />
        {value.label || "Période"}
      </button>
      {open && (
        <div className="absolute top-full right-0 z-[9999] min-w-[200px] p-1.5 rounded-xl mt-1"
          style={{ background: isDark ? "#1e293b" : "#ffffff", border: `1px solid ${border}`, boxShadow: "0 12px 40px rgba(0,0,0,0.2)" }}>
          {presets.map(p => (
            <button key={p.l} onClick={() => { onChange(p.f()); setOpen(false); }}
              className="block w-full text-left px-3 py-1.5 rounded-lg text-xs font-normal transition-colors cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30"
              style={{ color: isDark ? "#cbd5e1" : "#334155" }}>
              {p.l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, trend, trendLabel, accentColor, isDark }) {
  const isPositive = trend >= 0;
  return (
    <div className="rounded-xl p-5"
      style={{ background: isDark ? "#1e293b" : "#ffffff", border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`, boxShadow: isDark ? "0 1px 4px rgba(0,0,0,0.4)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div className="flex items-start justify-between mb-2.5">
        <div className="text-3xl font-semibold tracking-tight leading-none" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
          {value}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: accentColor + "18" }}>
          <Icon className="w-5 h-5" style={{ color: accentColor }} />
        </div>
      </div>
      <div className="text-xs mb-2 font-normal" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>{label}</div>
      {trend !== undefined && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold" style={{ color: isPositive ? "#16a34a" : "#dc2626" }}>
            {isPositive ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
          <span className="text-xs font-normal" style={{ color: isDark ? "#475569" : "#94a3b8" }}>{trendLabel}</span>
        </div>
      )}
    </div>
  );
}

// ─── LINE CHART ───────────────────────────────────────────────────────────────
function LineChartCnh({ isDark }) {
  const [hov, setHov] = useState(null);
  const pts = demandesParMois;
  const W = 600, H = 250, PL = 30, PR = 30, PT = 20, PB = 30;
  const cW = W-PL-PR, cH = H-PT-PB, maxV = 15;
  const xP = i => PL + (i/(pts.length-1))*cW;
  const yP = v => PT + cH - (v/maxV)*cH;
  const getSmoothPath = (key) => {
    let path = `M ${xP(0).toFixed(1)} ${yP(pts[0][key]).toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const cx = (xP(i-1)+xP(i))/2;
      path += ` C ${cx.toFixed(1)} ${yP(pts[i-1][key]).toFixed(1)}, ${cx.toFixed(1)} ${yP(pts[i][key]).toFixed(1)}, ${xP(i).toFixed(1)} ${yP(pts[i][key]).toFixed(1)}`;
    }
    return path;
  };
  const lpH = getSmoothPath("habilitation");
  const lpR = getSmoothPath("renouvellement");
  const aH = `${lpH} L ${xP(pts.length-1).toFixed(1)} ${PT+cH} L ${PL} ${PT+cH} Z`;
  const aR = `${lpR} L ${xP(pts.length-1).toFixed(1)} ${PT+cH} L ${PL} ${PT+cH} Z`;
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-bold" style={{ color: isDark?"#f1f5f9":"#0f172a" }}>Évolution des demandes</p>
          <p className="text-[11px] font-normal" style={{ color: isDark?"#94a3b8":"#64748b" }}>Traitement mois par mois</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md" style={{background:"#3b82f6"}}/><span className="text-[11px] font-normal" style={{color:isDark?"#cbd5e1":"#475569"}}>Habilitation</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md" style={{background:"#10b981"}}/><span className="text-[11px] font-normal" style={{color:isDark?"#cbd5e1":"#475569"}}>Renouvellement</span></div>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow:"visible", display:"block" }}>
        <defs>
          <linearGradient id="cnhLgH" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity=".25"/><stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/></linearGradient>
          <linearGradient id="cnhLgR" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity=".25"/><stop offset="100%" stopColor="#10b981" stopOpacity="0"/></linearGradient>
          <filter id="cnhGlowH"><feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#3b82f6" floodOpacity="0.4"/></filter>
          <filter id="cnhGlowR"><feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#10b981" floodOpacity="0.4"/></filter>
        </defs>
        {[0,5,10,15].map(v => (
          <g key={v}>
            <line x1={PL} y1={yP(v)} x2={W-PR} y2={yP(v)} stroke={isDark?"#334155":"#f1f5f9"} strokeWidth="1" strokeDasharray="4 4"/>
            <text x={PL-10} y={yP(v)+4} textAnchor="end" fontSize="10" fill={isDark?"#64748b":"#94a3b8"} fontWeight="normal">{v}</text>
          </g>
        ))}
        {pts.map((d,i) => (
          <text key={i} x={xP(i)} y={H-10} textAnchor="middle" fontSize="11" fill={isDark?"#94a3b8":"#64748b"} fontWeight="normal">{d.month}</text>
        ))}
        <path d={aH} fill="url(#cnhLgH)" />
        <path d={aR} fill="url(#cnhLgR)" />
        <path d={lpH} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" filter="url(#cnhGlowH)" />
        <path d={lpR} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" filter="url(#cnhGlowR)" />
        {hov !== null && (
          <g>
            <line x1={xP(hov)} y1={PT} x2={xP(hov)} y2={PT+cH} stroke={isDark?"#64748b":"#94a3b8"} strokeWidth="1" strokeDasharray="4 4" />
            <circle cx={xP(hov)} cy={yP(pts[hov].habilitation)} r="5" fill="#3b82f6" stroke={isDark?"#0f172a":"#ffffff"} strokeWidth="2.5" />
            <circle cx={xP(hov)} cy={yP(pts[hov].renouvellement)} r="5" fill="#10b981" stroke={isDark?"#0f172a":"#ffffff"} strokeWidth="2.5" />
            <g transform={`translate(${xP(hov)>W/2?xP(hov)-135:xP(hov)+15}, ${PT})`}>
              <rect width="120" height="65" rx="8" fill={isDark?"#1e293b":"#ffffff"} stroke={isDark?"#334155":"#e2e8f0"} filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
              <text x="12" y="20" fontSize="11" fontWeight="bold" fill={isDark?"#f1f5f9":"#0f172a"}>{pts[hov].month} 2026</text>
              <circle cx="16" cy="36" r="3.5" fill="#3b82f6" />
              <text x="26" y="40" fontSize="11" fill={isDark?"#94a3b8":"#64748b"}>Habilitation:</text>
              <text x="108" y="40" fontSize="11" textAnchor="end" fill={isDark?"#f1f5f9":"#0f172a"}>{pts[hov].habilitation}</text>
              <circle cx="16" cy="52" r="3.5" fill="#10b981" />
              <text x="26" y="56" fontSize="11" fill={isDark?"#94a3b8":"#64748b"}>Renouv.:</text>
              <text x="108" y="56" fontSize="11" textAnchor="end" fill={isDark?"#f1f5f9":"#0f172a"}>{pts[hov].renouvellement}</text>
            </g>
          </g>
        )}
        {pts.map((_,i) => (
          <rect key={i} x={xP(i)-(cW/(pts.length-1))/2} y={PT} width={cW/(pts.length-1)} height={cH} fill="transparent"
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} style={{ cursor:"pointer" }} />
        ))}
      </svg>
    </div>
  );
}

// ─── BAR CHART ────────────────────────────────────────────────────────────────
function BarChartCnh({ isDark }) {
  const data = demandesParNiveau;
  const maxVal = 30;
  const W = 580, H = 230, PL = 42, PR = 18, PT = 22, PB = 34;
  const cW = W-PL-PR, cH = H-PT-PB, bW = cW/data.length;
  return (
    <div>
      <p className="text-sm font-bold mb-0.5" style={{ color: isDark?"#f1f5f9":"#0f172a" }}>Demandes par niveau d'étude</p>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="mt-4" style={{ overflow:"visible", display:"block" }}>
        {[10,20,30].map(v => {
          const y = PT+cH-(v/maxVal)*cH;
          return (
            <g key={v}>
              <line x1={PL} y1={y} x2={W-PR} y2={y} stroke={isDark?"#1e293b":"#f1f5f9"} strokeWidth="1.2"/>
              <text x={PL-6} y={y+4} textAnchor="end" fontSize="10.5" fill={isDark?"#475569":"#94a3b8"} fontWeight="normal">{v}</text>
            </g>
          );
        })}
        {data.map((d,i) => {
          const bH=(d.value/maxVal)*cH, x=PL+i*bW+bW*0.2, w=bW*0.6, y=PT+cH-bH;
          return (
            <g key={i}>
              <rect x={x} y={PT} width={w} height={cH} rx="5" fill={isDark?"#0f172a":"#f8fafc"}/>
              <rect x={x} y={y} width={w} height={bH} rx="5" fill={d.color}/>
              <text x={x+w/2} y={y-7} textAnchor="middle" fontSize="12" fontWeight="normal" fill={d.color}>{d.value}</text>
              <text x={x+w/2} y={H-4} textAnchor="middle" fontSize="12" fill={isDark?"#475569":"#94a3b8"} fontWeight="normal">{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── DONUT CHART ──────────────────────────────────────────────────────────────
function DonutChartCnh({ isDark }) {
  const [hov, setHov] = useState(null);
  const total = demandesParType.reduce((s,d) => s+d.value, 0);
  const cx=120, cy=120, R=100, r=62;
  let angle = -Math.PI/2;
  return (
    <div>
      <p className="text-sm font-bold mb-0.5" style={{ color: isDark?"#f1f5f9":"#0f172a" }}>Répartition par type</p>
      <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
        <svg viewBox="0 0 240 240" width="200" style={{ display:"block", overflow:"visible" }}>
          {demandesParType.map((d,i) => {
            const a=(d.value/total)*2*Math.PI;
            const x1=cx+R*Math.cos(angle), y1=cy+R*Math.sin(angle);
            const x2=cx+R*Math.cos(angle+a), y2=cy+R*Math.sin(angle+a);
            const ix1=cx+r*Math.cos(angle), iy1=cy+r*Math.sin(angle);
            const ix2=cx+r*Math.cos(angle+a), iy2=cy+r*Math.sin(angle+a);
            const lg = a>Math.PI ? 1 : 0;
            const path=`M ${x1} ${y1} A ${R} ${R} 0 ${lg} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${r} ${r} 0 ${lg} 0 ${ix1} ${iy1} Z`;
            angle += a;
            return (
              <path key={i} d={path} fill={d.color} stroke={isDark?"#1e293b":"#ffffff"} strokeWidth="3"
                opacity={hov!==null && hov!==i ? 0.45 : 1}
                style={{ transformOrigin:`${cx}px ${cy}px`, transform:`scale(${hov===i?1.05:1})`, transition:"all .2s", cursor:"pointer" }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} />
            );
          })}
          <text x={cx} y={cy-10} textAnchor="middle" fontSize="30" fontWeight="bold" fill={isDark?"#f1f5f9":"#1e293b"}>{total}</text>
          <text x={cx} y={cy+12} textAnchor="middle" fontSize="11" fontWeight="normal" fill="#64748b">demandes</text>
        </svg>
        <div className="flex-1 w-full space-y-3">
          {demandesParType.map((s,i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl border transition-all"
              style={{ background: hov===i?`${s.color}18`:"transparent", borderColor: hov===i?s.color:(isDark?"#334155":"#f1f5f9"), cursor:"pointer" }}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background:s.color }}/>
                <span className="text-xs font-normal" style={{ color:isDark?"#cbd5e1":"#475569" }}>{s.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-normal" style={{ color:s.color }}>{s.value}</div>
                <div className="text-[10px]" style={{ color:"#94a3b8" }}>({Math.round((s.value/total)*100)}%)</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SECTEUR CHART ───────────────────────────────────────────────────────────
function SecteurChartCnh({ isDark }) {
  const [hov, setHov] = useState(null);
  const total = demandesParSecteur.reduce((s,d) => s+d.value, 0);
  const cx=120, cy=120, R=100, r=62;
  let angle = -Math.PI/2;
  return (
    <div>
      <p className="text-sm font-bold mb-0.5" style={{ color: isDark?"#f1f5f9":"#0f172a" }}>Répartition par secteur</p>
      <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
        <svg viewBox="0 0 240 240" width="200" style={{ display:"block", overflow:"visible" }}>
          {demandesParSecteur.map((d,i) => {
            const a=(d.value/total)*2*Math.PI;
            const x1=cx+R*Math.cos(angle), y1=cy+R*Math.sin(angle);
            const x2=cx+R*Math.cos(angle+a), y2=cy+R*Math.sin(angle+a);
            const ix1=cx+r*Math.cos(angle), iy1=cy+r*Math.sin(angle);
            const ix2=cx+r*Math.cos(angle+a), iy2=cy+r*Math.sin(angle+a);
            const lg = a>Math.PI ? 1 : 0;
            const path=`M ${x1} ${y1} A ${R} ${R} 0 ${lg} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${r} ${r} 0 ${lg} 0 ${ix1} ${iy1} Z`;
            angle += a;
            return (
              <path key={i} d={path} fill={d.color} stroke={isDark?"#1e293b":"#ffffff"} strokeWidth="3"
                opacity={hov!==null && hov!==i ? 0.45 : 1}
                style={{ transformOrigin:`${cx}px ${cy}px`, transform:`scale(${hov===i?1.05:1})`, transition:"all .2s", cursor:"pointer" }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} />
            );
          })}
          <text x={cx} y={cy-10} textAnchor="middle" fontSize="30" fontWeight="bold" fill={isDark?"#f1f5f9":"#1e293b"}>{total}</text>
          <text x={cx} y={cy+12} textAnchor="middle" fontSize="11" fontWeight="normal" fill="#64748b">demandes</text>
        </svg>
        <div className="flex-1 w-full space-y-3">
          {demandesParSecteur.map((s,i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl border transition-all"
              style={{ background: hov===i?`${s.color}18`:"transparent", borderColor: hov===i?s.color:(isDark?"#334155":"#f1f5f9"), cursor:"pointer" }}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background:s.color }}/>
                <span className="text-xs font-normal" style={{ color:isDark?"#cbd5e1":"#475569" }}>{s.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-normal" style={{ color:s.color }}>{s.value}</div>
                <div className="text-[10px]" style={{ color:"#94a3b8" }}>({Math.round((s.value/total)*100)}%)</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TABLEAU DES DEMANDES ─────────────────────────────────────────────────────
function DemandeTable({ isDark, navigate }) {
  const [filter, setFilter] = useState("Tous");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key:'date', direction:'desc' });

  // Filtrer pour n'avoir que les statuts "En cours", "Habilité" et "Ajourné"
  let filteredData = demandesCnh.filter(d => d.statut === "En cours" || d.statut === "Habilité" || d.statut === "Ajourné");
  
  if (filter !== "Tous") {
    if (["Habilitation","Renouvellement"].includes(filter)) filteredData = filteredData.filter(d => d.type === filter);
    else if (["Licence","Master","Doctorat"].includes(filter)) filteredData = filteredData.filter(d => d.niveau === filter);
    else filteredData = filteredData.filter(d => d.statut === filter);
  }

  const handleSort = (key) => {
    setSortConfig(p => ({ key, direction: p.key===key && p.direction==='asc' ? 'desc' : 'asc' }));
    setPage(1);
  };

  const sortedData = [...filteredData].sort((a,b) => {
    const dir = sortConfig.direction==='asc' ? 1 : -1;
    if (sortConfig.key==='date') return (new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')))*dir;
    return a[sortConfig.key]?.toString().localeCompare(b[sortConfig.key]?.toString())*dir;
  });

  const totalPages = Math.max(1, Math.ceil(sortedData.length/perPage));
  const pagedData  = sortedData.slice((page-1)*perPage, page*perPage);

  const borderC  = isDark ? "#334155" : "#e2e8f0";
  const headerBg = isDark ? "#0f172a" : "#f8fafc";
  const textC    = isDark ? "#e2e8f0" : "#334155";
  const subC     = isDark ? "#475569" : "#94a3b8";
  const rowHover = isDark ? "rgba(99,102,241,0.06)" : "#f8faff";

  const COLS = [
    { k:"id",          l:"ID"         },
    { k:"demandeur",   l:"Demandeur"  },
    { k:"type",        l:"Type"       },
    { k:"niveau",      l:"Niveau"     },
    { k:"statut",      l:"Statut"     },
    { k:"date",        l:"Date"       },
  ];

  return (
    <div className="flex flex-col">
      <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: borderC }}>
        <div className="flex items-center gap-2 text-xs font-normal" style={{ color: subC }}>
          Afficher
          <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            className="p-1 rounded-md border text-xs bg-transparent outline-none cursor-pointer"
            style={{ borderColor: borderC, color: textC }}>
            {[5,10,20,50].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          demandes
        </div>
        <div className="flex items-center gap-2">
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border text-xs font-normal bg-transparent cursor-pointer outline-none"
            style={{ borderColor: borderC, color: textC }}>
            <option value="Tous">Toutes les demandes</option>
            <optgroup label="Par Statut">
              <option value="En cours">En cours</option>
              <option value="Habilité">Habilité</option>
              <option value="Ajourné">Ajourné</option>
            </optgroup>
            <optgroup label="Par Type">
              <option value="Habilitation">Habilitation</option>
              <option value="Renouvellement">Renouvellement</option>
            </optgroup>
            <optgroup label="Par Niveau">
              <option value="Licence">Licence</option>
              <option value="Master">Master</option>
              <option value="Doctorat">Doctorat</option>
            </optgroup>
          </select>
          <button onClick={() => navigate("/dashboard/cnh/listes-demandes-habilitations")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-normal cursor-pointer transition hover:opacity-80"
            style={{ background: "#3b82f6", color: "#ffffff" }}>
            Voir tout <FaArrowRight size={10} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[800px]">
          <thead>
            <tr style={{ background: headerBg, borderBottom: `2px solid ${borderC}` }}>
              {COLS.map(({k,l}) => (
                <th key={k} onClick={() => handleSort(k)}
                  className="px-4 py-3.5 text-center text-xs font-normal uppercase tracking-wider whitespace-nowrap cursor-pointer select-none"
                  style={{ color: isDark?"#64748b":"#94a3b8" }}>
                  <div className="flex items-center justify-center gap-1">
                    {l}
                    {sortConfig.key===k && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        {sortConfig.direction==='asc' ? <path d="M12 5v14M8 9l4-4 4 4"/> : <path d="M12 19V5M8 15l4 4 4-4"/>}
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
            ) : pagedData.map((d, index) => {
              const cfg = getStatutCfg(d.statut, isDark);
              // Calculer l'ID séquentiel basé sur la pagination
              const sequentialId = (page - 1) * perPage + index + 1;
              return (
                <tr key={d.id} className="transition-colors duration-150 cursor-default"
                  style={{ borderBottom: `1px solid ${borderC}` }}
                  onMouseEnter={e => e.currentTarget.style.background = rowHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-normal"
                      style={{ background: isDark?"#0f172a":"#f1f5f9", color: isDark?"#94a3b8":"#64748b" }}>
                      {sequentialId}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-normal text-center" style={{ color: textC }}>{d.demandeur}</td>
                  <td className="px-4 py-4 text-sm font-normal text-center" style={{ color: textC }}>{d.type}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-normal"
                      style={{ background: isDark?"#0f172a":"#f8fafc", color: isDark?"#94a3b8":"#64748b", border: `1px solid ${isDark?"#1e293b":"#e2e8f0"}` }}>
                      {d.niveau}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-normal border"
                      style={{ background: cfg.lb, color: cfg.lt, borderColor: cfg.lbr }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                      {d.statut}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-normal text-center" style={{ color: subC }}>{d.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: `1px solid ${borderC}` }}>
        <span className="text-xs font-normal" style={{ color: subC }}>
          {sortedData.length > 0 ? `Affichage de ${(page-1)*perPage+1} à ${Math.min(page*perPage, sortedData.length)} sur ${sortedData.length} demandes` : "Aucune demande"}
        </span>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(p-1,1))} disabled={page===1} className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30 cursor-pointer"
            style={{ border:`1px solid ${borderC}`, background: isDark?"#1e293b":"#ffffff", color: isDark?"#94a3b8":"#64748b" }}><HiOutlineChevronLeft className="w-4 h-4" /></button>
          {Array.from({ length: totalPages }, (_,i) => i+1).map(p => (
            <button key={p} onClick={() => setPage(p)} className="w-8 h-8 rounded-lg text-xs font-normal transition cursor-pointer"
              style={{ background: p===page ? "#3b82f6" : (isDark?"#1e293b":"#ffffff"), color: p===page ? "#fff" : (isDark?"#94a3b8":"#64748b"), border: `1px solid ${p===page?"#3b82f6":borderC}` }}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(p+1,totalPages))} disabled={page===totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30 cursor-pointer"
            style={{ border:`1px solid ${borderC}`, background: isDark?"#1e293b":"#ffffff", color: isDark?"#94a3b8":"#64748b" }}><HiOutlineChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}

// ─── VUE PRINCIPALE ───────────────────────────────────────────────────────────
export default function DashboardCnhView() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [chart, setChart] = useState("line");
  const [dateRange, setDateRange] = useState({ label:"Année 2026", from:"2026-01-01", to:"2026-12-31" });

  const stats = [
    { label: "Total demandes", value: "47", icon: FaRegFileAlt, trend: 12, trendLabel: "ce mois", accentColor: "#3b82f6" },
    { label: "Ajourner", value: "15", icon: FaHourglassHalf, trend: 5, trendLabel: "ce mois", accentColor: "#f97316" },
    { label: "En cours", value: "12", icon: FaSpinner, trend: 3, trendLabel: "ce mois", accentColor: "#0ea5e9" },
    { label: "Habilités", value: "18", icon: FaCheckCircle, trend: 8, trendLabel: "cette année", accentColor: "#16a34a" },
    { label: "Dossier archivés", value: "5", icon: FaArchive, trend: 0, trendLabel: "ce mois", accentColor: "#8b5cf6" },
  ];

  const cardStyle = { background: isDark?"#1e293b":"#ffffff", border: `1px solid ${isDark?"#334155":"#e2e8f0"}`, borderRadius: "16px", overflow: "hidden", boxShadow: isDark?"0 1px 6px rgba(0,0,0,0.4)":"0 1px 6px rgba(0,0,0,0.06)" };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 font-sans" style={{ background: isDark?"#0f172a":"#ffffff" }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold mb-0.5" style={{ color: isDark?"#f1f5f9":"#0f172a" }}>Tableau de bord CNH</h1>
            <p className="text-sm font-normal" style={{ color: isDark?"#64748b":"#94a3b8" }}>Vue d'ensemble des demandes d'habilitation</p>
          </div>
          <DateRangePicker value={dateRange} onChange={setDateRange} isDark={isDark} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat, i) => <StatCard key={i} {...stat} isDark={isDark} />)}
        </div>

        <div style={cardStyle}>
          <div className="flex items-center justify-between px-5 py-4 border-b flex-wrap gap-3" style={{ borderColor: isDark?"#334155":"#e2e8f0" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: isDark?"#0f172a":"#f8fafc" }}><FaChartLine className="w-4 h-4" style={{ color:"#3b82f6" }}/></div>
              <div><h2 className="text-sm font-bold m-0" style={{ color: isDark?"#f1f5f9":"#0f172a" }}>Analyses des demandes</h2><p className="text-[11px] m-0 font-normal" style={{ color: isDark?"#64748b":"#94a3b8" }}>{dateRange.label}</p></div>
            </div>
            <div className="flex gap-0.5 p-0.5 rounded-xl" style={{ border:`1px solid ${isDark?"#334155":"#e2e8f0"}`, background: isDark?"#0f172a":"#f8fafc" }}>
              {[
                {k:"line", I:PiChartLineUp, l:"Évolution"},
                {k:"bar", I:PiChartBar, l:"Niveaux"},
                {k:"pie", I:PiChartPieSlice, l:"Types"},
                {k:"secteur", I:PiChartPieSlice, l:"Secteurs"}
              ].map(({k,I,l}) => (
                <button key={k} onClick={() => setChart(k)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer" 
                  style={{ background: chart===k ? (isDark?"#1e293b":"#ffffff") : "transparent", color: chart===k ? "#3b82f6" : (isDark?"#64748b":"#94a3b8"), boxShadow: chart===k ? "0 1px 4px rgba(0,0,0,0.12)" : "none" }}>
                  <I className="w-3.5 h-3.5"/><span>{l}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="p-5">
            <div className="mx-auto" style={{ maxWidth:"740px" }}>
              {chart==="line" && <LineChartCnh isDark={isDark}/>}
              {chart==="bar"  && <BarChartCnh isDark={isDark}/>}
              {chart==="pie"  && <DonutChartCnh isDark={isDark}/>}
              {chart==="secteur" && <SecteurChartCnh isDark={isDark}/>}
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div className="px-5 py-4 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: isDark?"#0f172a":"#f8fafc" }}>
              <FaClipboardList className="w-4 h-4" style={{ color:"#10b981" }}/>
            </div>
            <div>
              <h2 className="text-sm font-bold m-0" style={{ color: isDark?"#f1f5f9":"#0f172a" }}>Demandes récentes</h2>
              <p className="text-[11px] m-0 font-normal" style={{ color: isDark?"#64748b":"#94a3b8" }}>Filtrez et triez les demandes</p>
            </div>
          </div>
          <DemandeTable isDark={isDark} navigate={navigate} />
        </div>
      </div>
    </div>
  );
}