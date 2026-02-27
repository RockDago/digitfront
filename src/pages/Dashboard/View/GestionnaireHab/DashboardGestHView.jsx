import React, { useState, useRef, useEffect, useContext } from "react";
import {
  FaInbox, FaSync, FaUniversity, FaUserTie, FaBuilding,
  FaHourglassHalf, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaTimesCircle,
  FaChartLine, FaClipboardList
} from "react-icons/fa";
import { HiOutlineCalendar, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { PiChartLineUp, PiChartBar, PiChartPieSlice } from "react-icons/pi";
import { ThemeContext } from "../../../../context/ThemeContext";

// ─── DONNÉES ──────────────────────────────────────────────────────────────────

const demandesParMois = [
  { month: "Août", habilitation: 3,  renouvellement: 1 },
  { month: "Sep",  habilitation: 5,  renouvellement: 2 },
  { month: "Oct",  habilitation: 4,  renouvellement: 1 },
  { month: "Nov",  habilitation: 6,  renouvellement: 3 },
  { month: "Déc",  habilitation: 2,  renouvellement: 1 },
  { month: "Jan",  habilitation: 7,  renouvellement: 2 },
  { month: "Fév",  habilitation: 8,  renouvellement: 3 },
];

const demandesParNiveau = [
  { label: "Licence",  value: 12, color: "#3b82f6" },
  { label: "Master",   value: 18, color: "#10b981" },
  { label: "Doctorat", value: 6,  color: "#f59e0b" },
];

const demandesParType = [
  { label: "Habilitation", value: 24, color: "#3b82f6" },
  { label: "Renouvellement", value: 12, color: "#10b981" },
];

const tousDossiers = [
  { id: 1, typeDemande: "Habilitation", institut: "Université d'Antananarivo", secteur: "Public", niveau: "Master", statut: "En cours", expert: "Dr. Rakoto", cnh: "Pr. Jean", date: "20/02/2026" },
  { id: 2, typeDemande: "Renouvellement", institut: "Université de Fianarantsoa", secteur: "Public", niveau: "Master", statut: "En attente", expert: "Dr. Rabe", cnh: "Non assigné", date: "19/02/2026" },
  { id: 3, typeDemande: "Habilitation", institut: "Université de Toamasina", secteur: "Public", niveau: "Licence", statut: "Habilité", expert: "Dr. Rakoto", cnh: "Pr. Rakotondraibe", date: "18/02/2026" },
  { id: 4, typeDemande: "Habilitation", institut: "Université de Mahajanga", secteur: "Public", niveau: "Doctorat", statut: "Rejeté", expert: "Dr. Rabe", cnh: "Dr. Raharison", date: "17/02/2026" },
  { id: 5, typeDemande: "Renouvellement", institut: "UCM", secteur: "Privé", niveau: "Licence", statut: "Ajourné", expert: "Non assigné", cnh: "Non assigné", date: "16/02/2026" },
  { id: 6, typeDemande: "Habilitation", institut: "Université de Tuléar", secteur: "Public", niveau: "Master", statut: "En cours", expert: "Dr. Andry", cnh: "Pr. Rajaonarivelo", date: "15/02/2026" },
  { id: 7, typeDemande: "Habilitation", institut: "Université de Diego", secteur: "Public", niveau: "Licence", statut: "En attente", expert: "Non assigné", cnh: "Non assigné", date: "14/02/2026" },
  { id: 8, typeDemande: "Habilitation", institut: "INSCAE", secteur: "Public", niveau: "Master", statut: "Habilité", expert: "Dr. Haja", cnh: "Dr. Ramanantsoa", date: "12/02/2026" },
  { id: 9, typeDemande: "Renouvellement", institut: "ESMIA", secteur: "Privé", niveau: "Doctorat", statut: "Habilité", expert: "Dr. Rakoto", cnh: "Pr. Rakotondraibe", date: "10/02/2026" },
  { id: 10, typeDemande: "Renouvellement", institut: "ISPM", secteur: "Privé", niveau: "Master", statut: "En cours", expert: "Non assigné", cnh: "Pr. Jean", date: "08/02/2026" },
  { id: 11, typeDemande: "Habilitation", institut: "Université de Fianarantsoa", secteur: "Public", niveau: "Licence", statut: "Ajourné", expert: "Dr. Ranaivo", cnh: "Non assigné", date: "05/02/2026" },
];

const getStatutCfg = (statut, isDark) => {
  switch (statut) {
    case "Habilité": return isDark 
      ? { lb: "rgba(22,163,74,0.15)", lt: "#86efac", lbr: "rgba(22,163,74,0.35)", dot: "#16a34a" }
      : { lb: "#f0fdf4", lt: "#166534", lbr: "#bbf7d0", dot: "#16a34a" };
    case "En cours": return isDark 
      ? { lb: "rgba(37,99,235,0.15)", lt: "#93c5fd", lbr: "rgba(37,99,235,0.35)", dot: "#2563eb" }
      : { lb: "#eff6ff", lt: "#1d4ed8", lbr: "#bfdbfe", dot: "#2563eb" };
    case "Rejeté": return isDark 
      ? { lb: "rgba(220,38,38,0.15)", lt: "#fca5a5", lbr: "rgba(220,38,38,0.35)", dot: "#dc2626" }
      : { lb: "#fef2f2", lt: "#991b1b", lbr: "#fecaca", dot: "#dc2626" };
    case "Ajourné": return isDark
      ? { lb: "rgba(249,115,22,0.15)", lt: "#fdba74", lbr: "rgba(249,115,22,0.35)", dot: "#f97316" }
      : { lb: "#fff7ed", lt: "#c2410c", lbr: "#fed7aa", dot: "#f97316" };
    case "En attente": return isDark
      ? { lb: "rgba(234,179,8,0.15)", lt: "#fde047", lbr: "rgba(234,179,8,0.35)", dot: "#eab308" }
      : { lb: "#fefce8", lt: "#a16207", lbr: "#fef08a", dot: "#eab308" };
    default: return isDark 
      ? { lb: "rgba(37,99,235,0.15)", lt: "#93c5fd", lbr: "rgba(37,99,235,0.35)", dot: "#2563eb" }
      : { lb: "#eff6ff", lt: "#1d4ed8", lbr: "#bfdbfe", dot: "#2563eb" };
  }
};

// ─── DATE RANGE PICKER ────────────────────────────────────────────────────────

const DateRangePicker = ({ value, onChange, isDark }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const presets = [
    { l: "Aujourd'hui",      f: () => { const d = new Date().toISOString().slice(0,10); return { from:d, to:d, label:"Aujourd'hui" }; } },
    { l: "7 derniers jours", f: () => { const e=new Date(),s=new Date(); s.setDate(s.getDate()-7); return { from:s.toISOString().slice(0,10), to:e.toISOString().slice(0,10), label:"7 derniers jours" }; } },
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
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-normal transition-all cursor-pointer"
        style={{ background: isDark ? "#1e293b" : "#ffffff", border: `1px solid ${border}`, color: isDark ? "#cbd5e1" : "#475569" }}
      >
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
      style={{
        background: isDark ? "#1e293b" : "#ffffff",
        border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
        boxShadow: isDark ? "0 1px 4px rgba(0,0,0,0.4)" : "0 1px 4px rgba(0,0,0,0.06)",
      }}>
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

// ─── SVG CHARTS ───────────────────────────────────────────────────────────────

function LineChartHab({ isDark }) {
  const [hov, setHov] = useState(null);
  const pts = demandesParMois;
  const W = 600, H = 250, PL = 30, PR = 30, PT = 20, PB = 30;
  const cW = W - PL - PR, cH = H - PT - PB;
  const maxV = 10;
  
  const xP = i => PL + (i / (pts.length - 1)) * cW;
  const yP = v => PT + cH - (v / maxV) * cH;

  const getSmoothPath = (key) => {
    if (pts.length === 0) return "";
    let path = `M ${xP(0).toFixed(1)} ${yP(pts[0][key]).toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const cx = (xP(i - 1) + xP(i)) / 2;
      path += ` C ${cx.toFixed(1)} ${yP(pts[i - 1][key]).toFixed(1)}, ${cx.toFixed(1)} ${yP(pts[i][key]).toFixed(1)}, ${xP(i).toFixed(1)} ${yP(pts[i][key]).toFixed(1)}`;
    }
    return path;
  };

  const lpH = getSmoothPath("habilitation");
  const lpR = getSmoothPath("renouvellement");

  const aH = `${lpH} L ${xP(pts.length - 1).toFixed(1)} ${PT + cH} L ${PL} ${PT + cH} Z`;
  const aR = `${lpR} L ${xP(pts.length - 1).toFixed(1)} ${PT + cH} L ${PL} ${PT + cH} Z`;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-bold" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Évolution des demandes</p>
          <p className="text-[11px] font-normal" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>Comparaison mensuelle fluide</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md" style={{background:"#3b82f6"}}/><span className="text-[11px] font-normal" style={{color:isDark?"#cbd5e1":"#475569"}}>Habilitation</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md" style={{background:"#10b981"}}/><span className="text-[11px] font-normal" style={{color:isDark?"#cbd5e1":"#475569"}}>Renouvellement</span></div>
        </div>
      </div>
      
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow:"visible", display:"block" }}>
        <defs>
          <linearGradient id="lgH" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity=".25"/><stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/></linearGradient>
          <linearGradient id="lgR" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity=".25"/><stop offset="100%" stopColor="#10b981" stopOpacity="0"/></linearGradient>
          <filter id="glowH" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#3b82f6" floodOpacity="0.4"/>
          </filter>
          <filter id="glowR" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#10b981" floodOpacity="0.4"/>
          </filter>
        </defs>

        {[0, 2, 4, 6, 8, 10].map(v => (
          <g key={v}>
            <line x1={PL} y1={yP(v)} x2={W-PR} y2={yP(v)} stroke={isDark?"#334155":"#f1f5f9"} strokeWidth="1" strokeDasharray="4 4"/>
            <text x={PL-10} y={yP(v)+4} textAnchor="end" fontSize="10" fill={isDark?"#64748b":"#94a3b8"} fontWeight="normal">{v}</text>
          </g>
        ))}

        {pts.map((d, i) => (
          <text key={i} x={xP(i)} y={H-10} textAnchor="middle" fontSize="11" fill={isDark?"#94a3b8":"#64748b"} fontWeight="normal">{d.month}</text>
        ))}

        <path d={aH} fill="url(#lgH)" />
        <path d={aR} fill="url(#lgR)" />
        <path d={lpH} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" filter="url(#glowH)" />
        <path d={lpR} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" filter="url(#glowR)" />

        {hov !== null && (
          <g>
            <line x1={xP(hov)} y1={PT} x2={xP(hov)} y2={PT + cH} stroke={isDark?"#64748b":"#94a3b8"} strokeWidth="1" strokeDasharray="4 4" />
            <circle cx={xP(hov)} cy={yP(pts[hov].habilitation)} r="5" fill="#3b82f6" stroke={isDark?"#0f172a":"#ffffff"} strokeWidth="2.5" />
            <circle cx={xP(hov)} cy={yP(pts[hov].renouvellement)} r="5" fill="#10b981" stroke={isDark?"#0f172a":"#ffffff"} strokeWidth="2.5" />
            
            <g transform={`translate(${xP(hov) > W/2 ? xP(hov) - 135 : xP(hov) + 15}, ${PT})`}>
              <rect width="120" height="65" rx="8" fill={isDark?"#1e293b":"#ffffff"} stroke={isDark?"#334155":"#e2e8f0"} filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
              <text x="12" y="20" fontSize="11" fontWeight="bold" fill={isDark?"#f1f5f9":"#0f172a"}>{pts[hov].month} 2026</text>
              
              <circle cx="16" cy="36" r="3.5" fill="#3b82f6" />
              <text x="26" y="40" fontSize="11" fill={isDark?"#94a3b8":"#64748b"}>Habilitation:</text>
              <text x="108" y="40" fontSize="11" fontWeight="normal" textAnchor="end" fill={isDark?"#f1f5f9":"#0f172a"}>{pts[hov].habilitation}</text>
              
              <circle cx="16" cy="52" r="3.5" fill="#10b981" />
              <text x="26" y="56" fontSize="11" fill={isDark?"#94a3b8":"#64748b"}>Renouv.:</text>
              <text x="108" y="56" fontSize="11" fontWeight="normal" textAnchor="end" fill={isDark?"#f1f5f9":"#0f172a"}>{pts[hov].renouvellement}</text>
            </g>
          </g>
        )}

        {pts.map((_, i) => (
          <rect key={i} x={xP(i) - (cW / (pts.length - 1)) / 2} y={PT} width={cW / (pts.length - 1)} height={cH} fill="transparent" 
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} style={{ cursor: "pointer" }} />
        ))}
      </svg>
    </div>
  );
}

function BarChartHab({ isDark }) {
  const data = demandesParNiveau;
  const W = 580, H = 230, PL = 42, PR = 18, PT = 22, PB = 34;
  const cW = W - PL - PR, cH = H - PT - PB, bW = cW / data.length;
  
  return (
    <div>
      <p className="text-sm font-bold mb-0.5" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Demandes par niveau</p>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="mt-4" style={{ overflow:"visible", display:"block" }}>
        {[6,12,18,24].map(v => {
          const y = PT + cH - (v/24)*cH;
          return (
            <g key={v}>
              <line x1={PL} y1={y} x2={W-PR} y2={y} stroke={isDark?"#1e293b":"#f1f5f9"} strokeWidth="1.2"/>
              <text x={PL-6} y={y+4} textAnchor="end" fontSize="10.5" fill={isDark?"#475569":"#94a3b8"} fontWeight="normal">{v}</text>
            </g>
          );
        })}
        {data.map((d,i) => {
          const bH = (d.value/24)*cH, x = PL + i*bW + bW*0.2, w = bW*0.6, y = PT + cH - bH;
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

function DonutChartHab({ isDark }) {
  const [hov, setHov] = useState(null);
  const total = demandesParType.reduce((s,d) => s+d.value, 0);
  const cx=120, cy=120, R=100, r=62;
  let angle = -Math.PI/2;

  return (
    <div>
      <p className="text-sm font-bold mb-0.5" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Taux de Demande</p>
      <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
        <svg viewBox="0 0 240 240" width="200" style={{ display:"block", overflow:"visible" }}>
          {demandesParType.map((d,i) => {
            const a = (d.value/total)*2*Math.PI;
            const x1 = cx+R*Math.cos(angle), y1 = cy+R*Math.sin(angle);
            const x2 = cx+R*Math.cos(angle+a), y2 = cy+R*Math.sin(angle+a);
            const ix1 = cx+r*Math.cos(angle), iy1 = cy+r*Math.sin(angle);
            const ix2 = cx+r*Math.cos(angle+a), iy2 = cy+r*Math.sin(angle+a);
            const lg = a > Math.PI ? 1 : 0;
            const path = `M ${x1} ${y1} A ${R} ${R} 0 ${lg} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${r} ${r} 0 ${lg} 0 ${ix1} ${iy1} Z`;
            angle += a;
            return (
              <path key={i} d={path} fill={d.color} stroke={isDark?"#1e293b":"#ffffff"} strokeWidth="3"
                opacity={hov !== null && hov !== i ? 0.45 : 1}
                style={{ 
                  transformOrigin: `${cx}px ${cy}px`, 
                  transform: `scale(${hov === i ? 1.05 : 1})`, 
                  transition: "all .2s ease-in-out", 
                  cursor: "pointer" 
                }}
                onMouseEnter={() => setHov(i)} 
                onMouseLeave={() => setHov(null)}
              />
            );
          })}
          <text x={cx} y={cy-10} textAnchor="middle" fontSize="30" fontWeight="bold" fill={isDark?"#f1f5f9":"#1e293b"}>{total}</text>
          <text x={cx} y={cy+12} textAnchor="middle" fontSize="11" fontWeight="normal" fill="#64748b">demandes</text>
        </svg>
        <div className="flex-1 w-full space-y-3">
          {demandesParType.map((s,i) => (
            <div key={i} 
              className="flex items-center justify-between px-3 py-2 rounded-xl border transition-all" 
              style={{ 
                background: hov === i ? `${s.color}18` : "transparent",
                borderColor: hov === i ? s.color : (isDark ? "#334155" : "#f1f5f9"),
                cursor: "pointer"
              }}
              onMouseEnter={() => setHov(i)} 
              onMouseLeave={() => setHov(null)}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background:s.color }}/>
                <span className="text-xs font-normal" style={{ color:isDark?"#cbd5e1":"#475569" }}>{s.label}</span>
              </div>
              <div className="text-right flex items-center gap-2">
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

// ─── TABLEAU PAGINÉ AVEC COMBOBOX ET LIMITES ─────────────────────────────────

function DossierTable({ isDark }) {
  const [filter, setFilter] = useState("Tous");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  let filteredData = tousDossiers;
  if (filter !== "Tous") {
    if (["Habilitation", "Renouvellement"].includes(filter)) {
      filteredData = tousDossiers.filter(d => d.typeDemande === filter);
    } else {
      filteredData = tousDossiers.filter(d => d.niveau === filter);
    }
  }

  const handleSort = (key) => {
    setSortConfig(p => ({ key, direction: p.key === key && p.direction === 'asc' ? 'desc' : 'asc' }));
    setPage(1);
  };

  const sortedData = [...filteredData].sort((a, b) => {
    const dir = sortConfig.direction === 'asc' ? 1 : -1;
    if (sortConfig.key === 'id') return (a.id - b.id) * dir;
    if (sortConfig.key === 'date') return (new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-'))) * dir;
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
    { k:"id", l:"ID" }, 
    { k:"institut", l:"Institut" },
    { k:"secteur", l:"Secteur" },
    { k:"typeDemande", l:"Type" }, 
    { k:"niveau", l:"Niveau" }, 
    { k:"statut", l:"Statut" }, 
    { k:"expert", l:"Expert Assigné" }, 
    { k:"cnh", l:"CNH" }, 
    { k:"date", l:"Date" }
  ];

  return (
    <div className="flex flex-col">
      <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: borderC }}>
        <div className="flex items-center gap-2 text-xs font-normal" style={{ color: subC }}>
          Afficher
          <select 
            value={perPage} 
            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            className="p-1 rounded-md border text-xs bg-transparent outline-none cursor-pointer"
            style={{ borderColor: borderC, color: textC }}>
            {[10, 20, 30, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          dossiers
        </div>
        
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          className="px-3 py-1.5 rounded-lg border text-xs font-normal bg-transparent cursor-pointer outline-none"
          style={{ borderColor: borderC, color: textC }}>
          <option value="Tous">Tous les dossiers</option>
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
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[950px]">
          <thead>
            <tr style={{ background: headerBg, borderBottom: `2px solid ${borderC}` }}>
              {COLS.map(({k, l}) => (
                <th key={k} onClick={() => handleSort(k)} 
                  className="px-4 py-3.5 text-center text-xs font-normal uppercase tracking-wider whitespace-nowrap cursor-pointer select-none transition-colors"
                  style={{ color: isDark ? "#64748b" : "#94a3b8" }}>
                  <div className="flex items-center justify-center gap-1">
                    {l}
                    {sortConfig.key === k && (
                       <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="inline ml-1">
                         {sortConfig.direction === 'asc' ? <path d="M12 5v14M8 9l4-4 4 4" /> : <path d="M12 19V5M8 15l4 4 4-4" />}
                       </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedData.map((d) => {
              const cfg = getStatutCfg(d.statut, isDark);
              return (
                <tr key={d.id} className="transition-colors duration-150 cursor-default"
                  style={{ borderBottom: `1px solid ${borderC}` }}
                  onMouseEnter={e => e.currentTarget.style.background = rowHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-normal"
                      style={{ background: isDark ? "#0f172a" : "#f1f5f9", color: isDark ? "#94a3b8" : "#64748b" }}>
                      {d.id}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-normal text-center" style={{ color: textC }}>{d.institut}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-normal"
                      style={{
                        background: d.secteur === "Public" ? (isDark ? "rgba(59,130,246,0.15)" : "#eff6ff") : (isDark ? "rgba(168,85,247,0.15)" : "#faf5ff"),
                        color: d.secteur === "Public" ? "#3b82f6" : "#a855f7",
                        border: `1px solid ${d.secteur === "Public" ? (isDark ? "rgba(59,130,246,0.3)" : "#bfdbfe") : (isDark ? "rgba(168,85,247,0.3)" : "#e9d5ff")}`
                      }}>
                      {d.secteur}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-normal text-center" style={{ color: textC }}>{d.typeDemande}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-normal"
                      style={{ background: isDark ? "#0f172a" : "#f8fafc", color: isDark ? "#94a3b8" : "#64748b", border: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`}}>
                      {d.niveau}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-normal border"
                      style={{ background: cfg.lb, color: cfg.lt, borderColor: cfg.lbr }}>
                      {d.statut}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {d.expert !== "Non assigné" ? (
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-normal bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        {d.expert}
                      </span>
                    ) : <span className="text-[10px] text-gray-400 italic">--</span>}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {d.cnh && d.cnh !== "Non assigné" ? (
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-normal bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                        {d.cnh}
                      </span>
                    ) : <span className="text-[10px] text-gray-400 italic">--</span>}
                  </td>
                  <td className="px-4 py-4 text-sm text-center font-normal" style={{ color: subC }}>{d.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: `1px solid ${borderC}` }}>
        <span className="text-xs font-normal" style={{ color: subC }}>
          Affichage {Math.min((page - 1) * perPage + 1, sortedData.length)} à {Math.min(page * perPage, sortedData.length)} sur {sortedData.length} dossiers
        </span>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30 cursor-pointer"
            style={{ border: `1px solid ${borderC}`, background: isDark ? "#1e293b" : "#ffffff", color: isDark ? "#94a3b8" : "#64748b" }}>
            <HiOutlineChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className="w-8 h-8 rounded-lg text-xs font-normal transition cursor-pointer"
              style={{
                background: p === page ? "#3b82f6" : (isDark ? "#1e293b" : "#ffffff"),
                color: p === page ? "#fff" : (isDark ? "#94a3b8" : "#64748b"),
                border: `1px solid ${p === page ? "#3b82f6" : borderC}`,
              }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30 cursor-pointer"
            style={{ border: `1px solid ${borderC}`, background: isDark ? "#1e293b" : "#ffffff", color: isDark ? "#94a3b8" : "#64748b" }}>
            <HiOutlineChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── VUE PRINCIPALE ───────────────────────────────────────────────────────────

export default function DashboardGestHView() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [chart, setChart] = useState("line");
  const [dateRange, setDateRange] = useState({ label:"Année 2026", from:"2026-01-01", to:"2026-12-31" });

  // 10 CARTES STATISTIQUES AU TOTAL POUR UN AFFICHAGE PARFAIT SUR 2 LIGNES DE 5 COLONNES (XL Screens)
  const stats = [
    // LIGNE 1 (Demandes et Assignations)
    { label: "Habilitations",        value: "24", icon: FaInbox,               trend: 12, trendLabel: "ce mois",      accentColor: "#3b82f6" },
    { label: "Renouvellements",      value: "12", icon: FaSync,                trend: 5,  trendLabel: "ce mois",      accentColor: "#10b981" },
    { label: "Assignées Experts",    value: "18", icon: FaUserTie,             trend: 4,  trendLabel: "ce mois",      accentColor: "#6366f1" },
    { label: "Assignées CNH",        value: "9",  icon: FaUniversity,          trend: 2,  trendLabel: "ce mois",      accentColor: "#8b5cf6" },
    { label: "Instituts Habilités",  value: "15", icon: FaBuilding,            trend: 3,  trendLabel: "cette année",  accentColor: "#64748b" },
    
    // LIGNE 2 (Tous les Statuts détaillés)
    { label: "En attente",           value: "5",  icon: FaHourglassHalf,       trend: -1, trendLabel: "vs hier",      accentColor: "#eab308" },
    { label: "En cours",             value: "10", icon: FaSpinner,             trend: 2,  trendLabel: "ce mois",      accentColor: "#0ea5e9" },
    { label: "Habilités",            value: "15", icon: FaCheckCircle,         trend: 3,  trendLabel: "cette année",  accentColor: "#16a34a" },
    { label: "Ajournés",             value: "3",  icon: FaExclamationTriangle, trend: -2, trendLabel: "vs hier",      accentColor: "#f97316" },
    { label: "Rejetés",              value: "2",  icon: FaTimesCircle,         trend: 0,  trendLabel: "ce mois",      accentColor: "#dc2626" },
  ];

  const CHART_TABS = [
    { k:"line", I: PiChartLineUp,   l:"Évolution" },
    { k:"bar",  I: PiChartBar,      l:"Niveaux"   },
    { k:"pie",  I: PiChartPieSlice, l:"Taux"   },
  ];

  const rootBg   = isDark ? "#0f172a" : "#ffffff";
  const cardBg   = isDark ? "#1e293b" : "#ffffff";
  const borderC  = isDark ? "#334155" : "#e2e8f0";
  const titleC   = isDark ? "#f1f5f9" : "#0f172a";
  const subC     = isDark ? "#64748b" : "#94a3b8";

  const cardStyle = {
    background: cardBg, border: `1px solid ${borderC}`, borderRadius: "16px", overflow: "hidden",
    boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)",
  };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 font-sans" style={{ background: rootBg }}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold mb-0.5" style={{ color: titleC }}>Tableau de bord</h1>
            <p className="text-sm font-normal" style={{ color: subC }}>Vue d'ensemble de votre activité de gestion des habilitations</p>
          </div>
          <DateRangePicker value={dateRange} onChange={setDateRange} isDark={isDark} />
        </div>

        {/* Cartes Stats - Configuration de la Grille */}
        {/* L'utilisation de xl:grid-cols-5 permet de placer exactement 10 cartes sur 2 lignes de 5 sur les grands écrans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats.map((stat, i) => <StatCard key={i} {...stat} isDark={isDark} />)}
        </div>

        {/* Diagrammes */}
        <div style={cardStyle}>
          <div className="flex items-center justify-between px-5 py-4 border-b flex-wrap gap-3" style={{ borderColor: borderC }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: isDark ? "#0f172a" : "#f8fafc" }}>
                <FaChartLine className="w-4 h-4" style={{ color: "#3b82f6" }}/>
              </div>
              <div>
                <h2 className="text-sm font-bold m-0" style={{ color: titleC }}>Analyses des habilitations</h2>
                <p className="text-[11px] m-0 font-normal" style={{ color: subC }}>{dateRange.label}</p>
              </div>
            </div>
            <div className="flex gap-0.5 p-0.5 rounded-xl" style={{ border:`1px solid ${borderC}`, background: isDark ? "#0f172a" : "#f8fafc" }}>
              {CHART_TABS.map(({ k, I, l }) => (
                <button key={k} onClick={() => setChart(k)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] transition-all duration-150 cursor-pointer"
                  style={{
                    background: chart===k ? cardBg : "transparent", color: chart===k ? "#3b82f6" : subC,
                    fontWeight: chart===k ? 'normal' : 'normal', boxShadow: chart===k ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
                  }}>
                  <I className="w-3.5 h-3.5"/><span>{l}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-5">
            <div className="mx-auto" style={{ maxWidth:"740px" }}>
              {chart === "line" && <LineChartHab  isDark={isDark}/>}
              {chart === "bar"  && <BarChartHab   isDark={isDark}/>}
              {chart === "pie"  && <DonutChartHab isDark={isDark}/>}
            </div>
          </div>
        </div>

        {/* Tableaux des dossiers */}
        <div style={cardStyle}>
          <div className="flex items-center justify-between px-5 py-4 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: isDark ? "#0f172a" : "#f8fafc" }}>
                <FaClipboardList className="w-4 h-4" style={{ color: "#10b981" }}/>
              </div>
              <div>
                <h2 className="text-sm font-bold m-0" style={{ color: titleC }}>Liste des dossiers reçus</h2>
                <p className="text-[11px] m-0 font-normal" style={{ color: subC }}>Recherchez, filtrez et triez vos dossiers</p>
              </div>
            </div>
          </div>
          <DossierTable isDark={isDark} />
        </div>

      </div>
    </div>
  );
}
