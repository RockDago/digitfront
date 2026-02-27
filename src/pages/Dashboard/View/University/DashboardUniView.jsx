import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import {
  HiOutlineBuildingLibrary, HiOutlineCheckCircle, HiOutlineShieldCheck,
  HiOutlineExclamationTriangle, HiOutlineChartBar, HiOutlineChartPie,
  HiOutlineAcademicCap, HiOutlineChevronLeft, HiOutlineChevronRight,
  HiOutlineCalendar, HiOutlineMapPin, HiOutlineFlag,
  HiOutlineArrowsPointingOut, HiOutlineArrowsPointingIn,
  HiOutlineGlobeAlt, HiOutlinePhoto, HiOutlineMap,
} from 'react-icons/hi2';
import { PiChartLineUp, PiChartBar, PiChartPieSlice } from 'react-icons/pi';
import { MdSatelliteAlt, MdMap, MdDarkMode } from 'react-icons/md';

// ThemeContext
let ThemeContext;
try { ThemeContext = require('../../../../context/ThemeContext').ThemeContext; }
catch { ThemeContext = React.createContext({ theme: 'light' }); }

// ─── Tile modes ─────────────────────────────────────────────────────────────────
const TILE_MODES = {
  standard:  { url:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',                                                                 label:'Standard' },
  satellite: { url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',                      label:'Satellite' },
  dark:      { url:'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',                                                      label:'Sombre' },
};

// ─── Evaluation system ───────────────────────────────────────────────────────────
const getEvaluation = (pts) => {
  if (pts <= 91)  return { label:'Non conforme', color:'#dc2626', lb:'#fafafa', db:'rgba(220,38,38,0.08)',   lbr:'#fca5a5', dbr:'rgba(220,38,38,0.2)',   lt:'#b91c1c', dt:'#fca5a5' };
  if (pts <= 183) return { label:'Faible',        color:'#ea580c', lb:'#fafafa', db:'rgba(234,88,12,0.08)',  lbr:'#fed7aa', dbr:'rgba(234,88,12,0.2)',  lt:'#c2410c', dt:'#fdba74' };
  if (pts <= 256) return { label:'Acceptable',    color:'#ca8a04', lb:'#fafafa', db:'rgba(202,138,4,0.08)',  lbr:'#fde68a', dbr:'rgba(202,138,4,0.2)',  lt:'#92400e', dt:'#fde68a' };
  if (pts <= 311) return { label:'Satisfaisant',  color:'#2563eb', lb:'#fafafa', db:'rgba(37,99,235,0.08)',  lbr:'#bfdbfe', dbr:'rgba(37,99,235,0.2)',  lt:'#1d4ed8', dt:'#93c5fd' };
  return               { label:'Excellent',       color:'#16a34a', lb:'#fafafa', db:'rgba(22,163,74,0.08)',  lbr:'#bbf7d0', dbr:'rgba(22,163,74,0.2)',  lt:'#15803d', dt:'#86efac' };
};

const STATUS_CFG = {
  "Habilitée":     { lb:"#f8fafb", lt:"#166534", lbr:"#d1fae5", db:"rgba(22,163,74,0.07)",   dt:"#86efac", dbr:"rgba(22,163,74,0.18)",  dot:"#16a34a" },
  "Accréditée":    { lb:"#f8fafb", lt:"#6d28d9", lbr:"#ede9fe", db:"rgba(109,40,217,0.07)",  dt:"#c4b5fd", dbr:"rgba(109,40,217,0.18)", dot:"#7c3aed" },
  "Non habilitée": { lb:"#f8fafb", lt:"#c2410c", lbr:"#fed7aa", db:"rgba(234,88,12,0.07)",   dt:"#fdba74", dbr:"rgba(234,88,12,0.18)",  dot:"#ea580c" },
  "Non accréditée":{ lb:"#f8fafb", lt:"#92400e", lbr:"#fde68a", db:"rgba(202,138,4,0.07)",   dt:"#fde68a", dbr:"rgba(202,138,4,0.18)",  dot:"#ca8a04" },
  "Suspendue":     { lb:"#f8fafb", lt:"#b91c1c", lbr:"#fecaca", db:"rgba(220,38,38,0.07)",   dt:"#fca5a5", dbr:"rgba(220,38,38,0.18)",  dot:"#dc2626" },
};

const StatusPill = ({ status, isDark }) => {
  const c = STATUS_CFG[status] || {};
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap"
      style={{
        background: isDark ? c.db : c.lb,
        color: isDark ? c.dt : c.lt,
        border: `1px solid ${isDark ? c.dbr : c.lbr}`
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }}/>
      {status}
    </span>
  );
};

// ─── University data ────────────────────────────────────────────────────────
const UNIVERSITIES = [
  { id:"UNI-001", lat:-18.9137, lng:47.5361, name:"Université d'Antananarivo",      shortName:"UA",   ville:"Antananarivo", region:"Analamanga", type:"Publique", founded:1955, students:37914, address:"Campus d'Ankatso, BP 566, Antananarivo 101", phone:"+261 20 22 326 39", website:"univ-antananarivo.mg", domaines:"Droit, Médecine, Sciences, Lettres, Économie, Génie", pts:340, statuses:["Habilitée","Accréditée"],    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Universit%C3%A9_d%27Antananarivo.jpg/320px-Universit%C3%A9_d%27Antananarivo.jpg" },
  { id:"UNI-007", lat:-18.930,  lng:47.535,  name:"Univ. Catholique de Madagascar", shortName:"UCM",  ville:"Antananarivo", region:"Analamanga", type:"Privée",  founded:1960, students:6542,  address:"Faravohitra BP 8349, Antananarivo 101",   phone:"+261 20 22 641 90", website:"ucm.mg",               domaines:"Théologie, Droit, Gestion, Sciences Sociales",            pts:315, statuses:["Habilitée","Accréditée"],    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Antananarivo_panorama.jpg/320px-Antananarivo_panorama.jpg" },
  { id:"UNI-002", lat:-21.4545, lng:47.0856, name:"Université de Fianarantsoa",     shortName:"UF",   ville:"Fianarantsoa", region:"Haute Matsiatra", type:"Publique", founded:1977, students:18342, address:"BP 1264 Fianarantsoa 301",                  phone:"+261 20 75 508 02", website:"univ-fianarantsoa.mg", domaines:"Informatique, Pédagogie, Sciences, Lettres, Droit",         pts:295, statuses:["Habilitée","Accréditée"],    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Fianarantsoa_city.jpg/320px-Fianarantsoa_city.jpg" },
  { id:"UNI-010", lat:-18.920,  lng:47.525,  name:"ENS Antananarivo",               shortName:"ENS",  ville:"Antananarivo", region:"Analamanga", type:"Publique", founded:1962, students:3987,  address:"Ankatso BP 881, Antananarivo 101",         phone:"+261 20 22 279 03", website:"ens.mg",               domaines:"Formation des Enseignants, Lettres, Sciences, Maths",     pts:260, statuses:["Habilitée","Accréditée"],    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Universit%C3%A9_d%27Antananarivo.jpg/320px-Universit%C3%A9_d%27Antananarivo.jpg" },
  { id:"UNI-008", lat:-18.905,  lng:47.545,  name:"IST Antananarivo",               shortName:"IST",  ville:"Antananarivo", region:"Analamanga", type:"Publique", founded:1992, students:5432,  address:"Ampasapito BP 8122, Antananarivo 101",     phone:"+261 20 22 294 40", website:"ist.mg",               domaines:"Technologie, Informatique, Génie Civil, Électronique",   pts:258, statuses:["Habilitée","Accréditée"],    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Antananarivo_panorama.jpg/320px-Antananarivo_panorama.jpg" },
  { id:"UNI-003", lat:-15.7167, lng:46.3167, name:"Université de Mahajanga",        shortName:"UM",   ville:"Mahajanga", region:"Boeny",    type:"Publique", founded:1977, students:12567, address:"BP 652 Mahajanga 401",                     phone:"+261 20 62 227 24", website:"univ-mahajanga.mg",    domaines:"Médecine, Dentisterie, Sciences, Droit, Gestion",         pts:270, statuses:["Habilitée","Accréditée"],    photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Mahajanga_port.jpg/320px-Mahajanga_port.jpg" },
  { id:"UNI-004", lat:-18.1496, lng:49.4022, name:"Université de Toamasina",        shortName:"UT",   ville:"Toamasina", region:"Atsinanana",    type:"Publique", founded:1977, students:10891, address:"BP 591 Toamasina 501",                     phone:"+261 20 53 322 44", website:"univ-toamasina.mg",    domaines:"Sciences Économiques, Droit, Lettres, Sciences",          pts:240, statuses:["Habilitée","Non accréditée"], photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Toamasina_Port.jpg/320px-Toamasina_Port.jpg" },
  { id:"UNI-009", lat:-18.940,  lng:47.530,  name:"Université Privée de Madagascar",shortName:"UPM",  ville:"Antananarivo", region:"Analamanga", type:"Privée",  founded:2003, students:4321,  address:"Anosy, Antananarivo 101",                  phone:"+261 34 11 000 00", website:"upm.mg",               domaines:"Gestion, Économie, Droit, Commerce International",        pts:185, statuses:["Non habilitée","Non accréditée"], photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Antananarivo_panorama.jpg/320px-Antananarivo_panorama.jpg" },
  { id:"UNI-005", lat:-23.3568, lng:43.6917, name:"Université de Toliara",          shortName:"UTol", ville:"Toliara", region:"Atsimo-Andrefana",      type:"Publique", founded:1977, students:8945,  address:"BP Toliara 601",                           phone:"+261 20 94 417 73", website:"univ-toliara.mg",      domaines:"Sciences Marines, Droit, Lettres, Éducation",             pts:168, statuses:["Non habilitée","Non accréditée"], photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Tulear_beach.jpg/320px-Tulear_beach.jpg" },
  { id:"UNI-006", lat:-12.3547, lng:49.2964, name:"Université d'Antsiranana",       shortName:"UAN",  ville:"Antsiranana", region:"Diana",  type:"Publique", founded:1976, students:7843,  address:"BP 0 Antsiranana",                         phone:"+261 20 82 294 09", website:"univ-antsiranana.mg",  domaines:"Ingénierie, Polytechnique, Sciences, Gestion",            pts:78,  statuses:["Suspendue","Non habilitée"],   photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Diego_Suarez.jpg/320px-Diego_Suarez.jpg" },
];

// ─── Tile Icon Component ───────────────────────────────────────────────────────
const TileIcon = ({ mode, size = 14 }) => {
  if (mode === 'standard') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  );
  if (mode === 'satellite') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>
    </svg>
  );
  if (mode === 'dark') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
  return null;
};

// ─── GPS Icon ─────────────────────────────────────────────────────────────────
const GpsIcon = ({ size=14, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
  </svg>
);

// ─── Stat Card Component ───────────────────────────────────────────────────────
const StatCard = ({ title, value, sub, Icon, accent, trend, isDark }) => {
  const A = {
    blue:   { lb:'#f1f5f9', li:'#6366f1', lbr:'#e2e8f0', lv:'#4f46e5', db:'rgba(99,102,241,0.10)', di:'#a5b4fc', dbr:'rgba(99,102,241,0.20)', dv:'#a5b4fc' },
    green:  { lb:'#f1f5f9', li:'#6366f1', lbr:'#e2e8f0', lv:'#4f46e5', db:'rgba(99,102,241,0.10)', di:'#a5b4fc', dbr:'rgba(99,102,241,0.20)', dv:'#a5b4fc' },
    purple: { lb:'#f1f5f9', li:'#6366f1', lbr:'#e2e8f0', lv:'#4f46e5', db:'rgba(99,102,241,0.10)', di:'#a5b4fc', dbr:'rgba(99,102,241,0.20)', dv:'#a5b4fc' },
    orange: { lb:'#f1f5f9', li:'#6366f1', lbr:'#e2e8f0', lv:'#4f46e5', db:'rgba(99,102,241,0.10)', di:'#a5b4fc', dbr:'rgba(99,102,241,0.20)', dv:'#a5b4fc' }
  }[accent] || A.blue;

  const cbg = isDark ? '#1e2235' : '#ffffff';

  return (
    <div
      className="rounded-xl p-5 transition-all duration-200 cursor-default"
      style={{
        background: cbg,
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : `1px solid ${A.lbr}`,
        boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 4px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = isDark ? '0 8px 24px rgba(0,0,0,0.4)' : `0 8px 24px ${A.lbr}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 4px rgba(0,0,0,0.06)';
      }}
    >
      <div className="flex items-start justify-between mb-2.5">
        <div className="text-4xl font-black tracking-tight leading-none" style={{ color: isDark ? A.dv : A.lv }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: isDark ? A.db : A.lb }}>
          <Icon className="w-5 h-5" style={{ color: isDark ? A.di : A.li }} />
        </div>
      </div>
      <div className="text-xs font-bold mb-1" style={{ color: isDark ? '#e2e8f0' : '#334155' }}>{title}</div>
      <div className="flex items-center justify-between">
        <div className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : '#94a3b8' }}>{sub}</div>
        {trend && (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full border"
            style={{
              color: isDark ? '#a5b4fc' : '#4f46e5',
              background: isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff',
              borderColor: isDark ? 'rgba(99,102,241,0.3)' : '#c7d2fe'
            }}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Date Range Picker ─────────────────────────────────────────────────────────
const DateRangePicker = ({ value, onChange, isDark }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const presets = [
    { l: "Aujourd'hui", f: () => { const d = new Date().toISOString().slice(0, 10); return { from: d, to: d, label: "Aujourd'hui" }; } },
    { l: "7 derniers jours", f: () => { const e = new Date(); const s = new Date(); s.setDate(s.getDate() - 7); return { from: s.toISOString().slice(0, 10), to: e.toISOString().slice(0, 10), label: "7 derniers jours" }; } },
    { l: "Janvier 2026", f: () => ({ from: "2026-01-01", to: "2026-01-31", label: "Janvier 2026" }) },
    { l: "Février 2026", f: () => ({ from: "2026-02-01", to: "2026-02-28", label: "Février 2026" }) },
    { l: "Année 2025", f: () => ({ from: "2025-01-01", to: "2025-12-31", label: "Année 2025" }) },
    { l: "Année 2026", f: () => ({ from: "2026-01-01", to: "2026-12-31", label: "Année 2026" }) }
  ];

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const bb = isDark ? 'rgba(255,255,255,0.06)' : '#fff';
  const bbr = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
  const bc = isDark ? '#e2e8f0' : '#475569';
  const db = isDark ? '#1e2235' : '#fff';
  const dbr2 = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
        style={{
          background: bb,
          border: `1px solid ${bbr}`,
          color: bc,
        }}
      >
        <HiOutlineCalendar className="w-3.5 h-3.5 text-indigo-500" />
        {value.label || "Période"}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`ml-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <path d="M2 3.5l3 3 3-3" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute top-full right-0 z-[9999] min-w-[200px] p-1.5 rounded-xl shadow-xl animate-in fade-in duration-150"
          style={{
            background: db,
            border: `1px solid ${dbr2}`,
            boxShadow: isDark ? '0 16px 48px rgba(0,0,0,0.5)' : '0 12px 40px rgba(0,0,0,0.12)',
          }}
        >
          {presets.map(p => (
            <button
              key={p.l}
              onClick={() => { onChange(p.f()); setOpen(false); }}
              className="block w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              style={{
                background: value.label === p.l ? 'rgba(99,102,241,0.12)' : 'transparent',
                color: value.label === p.l ? '#6366f1' : isDark ? '#e2e8f0' : '#334155',
              }}
            >
              {p.l}
              {value.label === p.l && <span className="float-right text-indigo-500">✓</span>}
            </button>
          ))}
          <div className="mx-1.5 my-1 pt-1.5 border-t" style={{ borderColor: dbr2 }}>
            <div className="flex gap-1">
              <input
                type="date"
                value={value.from || ''}
                onChange={e => onChange({ ...value, from: e.target.value, label: 'Personnalisé' })}
                className="flex-1 px-1.5 py-1 rounded-md text-xs"
                style={{
                  border: `1px solid ${dbr2}`,
                  color: bc,
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#fff'
                }}
              />
              <input
                type="date"
                value={value.to || ''}
                onChange={e => onChange({ ...value, to: e.target.value, label: 'Personnalisé' })}
                className="flex-1 px-1.5 py-1 rounded-md text-xs"
                style={{
                  border: `1px solid ${dbr2}`,
                  color: bc,
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#fff'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Tableau des résultats d'auto-évaluation (avec tri par rang) ────────────────
const EvaluationTable = ({ filteredData, page, setPage, isDark, dateRange, sortConfig, setSortConfig }) => {
  const PER_PAGE = 10;

  // Fonction de tri incluant le rang
  const getSortedData = () => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (sortConfig.key === 'rang') {
        return sortConfig.direction === 'asc' ? a.globalRank - b.globalRank : b.globalRank - a.globalRank;
      }
      if (sortConfig.key === 'ville') {
        return sortConfig.direction === 'asc'
          ? a.ville.localeCompare(b.ville)
          : b.ville.localeCompare(a.ville);
      }
      if (sortConfig.key === 'region') {
        return sortConfig.direction === 'asc'
          ? (a.region||'').localeCompare(b.region||'')
          : (b.region||'').localeCompare(a.region||'');
      }
      if (sortConfig.key === 'type') {
        return sortConfig.direction === 'asc'
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      }
      if (sortConfig.key === 'score') {
        return sortConfig.direction === 'asc' ? a.pts - b.pts : b.pts - a.pts;
      }
      if (sortConfig.key === 'nom') {
        return sortConfig.direction === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });
  };

  const sortedData = getSortedData();
  const totalPages = Math.max(1, Math.ceil(sortedData.length / PER_PAGE));
  const pagedData = sortedData.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Fonction pour gérer le clic sur les en-têtes de tri
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
    setPage(1); // Revenir à la première page lors du tri
  };

  const getStatusColor = (score) => {
    if (score <= 91) return { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5', label: 'Non conforme' };
    if (score <= 183) return { bg: '#FFF3E0', text: '#9A3412', border: '#FED7AA', label: 'Faible' };
    if (score <= 256) return { bg: '#FEF9C3', text: '#854D0E', border: '#FDE047', label: 'Acceptable' };
    if (score <= 311) return { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD', label: 'Satisfaisant' };
    return { bg: '#DCFCE7', text: '#166534', border: '#86EFAC', label: 'Excellent' };
  };

  const typeConfig = {
    Publique: { bg: '#f1f5f9', text: '#334155', border: '#e2e8f0' },
    Privée:   { bg: '#f1f5f9', text: '#334155', border: '#e2e8f0' }
  };

  const statusColors = {
    "Habilitée":     { bg: '#f1f5f9', text: '#166534' },
    "Accréditée":    { bg: '#f1f5f9', text: '#5b21b6' },
    "Non habilitée": { bg: '#f1f5f9', text: '#9a3412' },
    "Non accréditée":{ bg: '#f1f5f9', text: '#78350f' },
    "Suspendue":     { bg: '#fef2f2', text: '#991b1b' }
  };

  const thClass = `px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer select-none transition-colors duration-200 border-b ${
    isDark ? 'text-slate-400 border-white/10' : 'text-slate-500 border-slate-200'
  }`;

  const thContentClass = "flex items-center justify-center gap-1";

  const tdClass = `px-4 py-4 text-sm border-b ${
    isDark ? 'text-slate-200 border-white/5' : 'text-slate-700 border-slate-100'
  } text-center`;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[800px]">
        <thead>
          <tr>
            <th
              className={thClass}
              onClick={() => handleSort('rang')}
              onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#fff' : '#000'}
              onMouseLeave={(e) => e.currentTarget.style.color = isDark ? '#94A3B8' : '#64748B'}
            >
              <div className={thContentClass}>
                Rang
                {sortConfig.key === 'rang' && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {sortConfig.direction === 'asc' ? (
                      <path d="M12 5v14M8 9l4-4 4 4" />
                    ) : (
                      <path d="M12 19V5M8 15l4 4 4-4" />
                    )}
                  </svg>
                )}
              </div>
            </th>
            <th
              className={thClass}
              onClick={() => handleSort('nom')}
              onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#fff' : '#000'}
              onMouseLeave={(e) => e.currentTarget.style.color = isDark ? '#94A3B8' : '#64748B'}
            >
              <div className={thContentClass}>
                Université
                {sortConfig.key === 'nom' && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {sortConfig.direction === 'asc' ? (
                      <path d="M12 5v14M8 9l4-4 4 4" />
                    ) : (
                      <path d="M12 19V5M8 15l4 4 4-4" />
                    )}
                  </svg>
                )}
              </div>
            </th>
            <th
              className={thClass}
              onClick={() => handleSort('type')}
              onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#fff' : '#000'}
              onMouseLeave={(e) => e.currentTarget.style.color = isDark ? '#94A3B8' : '#64748B'}
            >
              <div className={thContentClass}>
                Type
                {sortConfig.key === 'type' && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {sortConfig.direction === 'asc' ? (
                      <path d="M12 5v14M8 9l4-4 4 4" />
                    ) : (
                      <path d="M12 19V5M8 15l4 4 4-4" />
                    )}
                  </svg>
                )}
              </div>
            </th>
            <th
              className={thClass}
              onClick={() => handleSort('ville')}
              onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#fff' : '#000'}
              onMouseLeave={(e) => e.currentTarget.style.color = isDark ? '#94A3B8' : '#64748B'}
            >
              <div className={thContentClass}>
                Province / Région
                {sortConfig.key === 'ville' && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {sortConfig.direction === 'asc' ? (
                      <path d="M12 5v14M8 9l4-4 4 4" />
                    ) : (
                      <path d="M12 19V5M8 15l4 4 4-4" />
                    )}
                  </svg>
                )}
              </div>
            </th>
            <th
              className={thClass}
              onClick={() => handleSort('score')}
              onMouseEnter={(e) => e.currentTarget.style.color = isDark ? '#fff' : '#000'}
              onMouseLeave={(e) => e.currentTarget.style.color = isDark ? '#94A3B8' : '#64748B'}
            >
              <div className={thContentClass}>
                Score
                {sortConfig.key === 'score' && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {sortConfig.direction === 'asc' ? (
                      <path d="M12 5v14M8 9l4-4 4 4" />
                    ) : (
                      <path d="M12 19V5M8 15l4 4 4-4" />
                    )}
                  </svg>
                )}
              </div>
            </th>
            <th className={thClass}>Niveau</th>
            <th className={thClass}>Statuts</th>
          </tr>
        </thead>
        <tbody>
          {pagedData.map((uni) => {
            const rank = uni.globalRank;
            const scoreColor = getStatusColor(uni.pts);
            const typeStyle = typeConfig[uni.type] || typeConfig.Publique;

            return (
              <tr
                key={uni.id}
                className="transition-colors duration-200 cursor-default"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <td className={`${tdClass} font-semibold`}>
                  <div
                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold"
                    style={{
                      background: rank <= 3 ? scoreColor.bg : isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                      color: rank <= 3 ? scoreColor.text : isDark ? '#94A3B8' : '#475569',
                    }}
                  >
                    {rank}
                  </div>
                </td>

                <td className={`${tdClass} text-left font-semibold`}>
                  <div className="text-sm font-bold">
                    {uni.name}
                  </div>
                </td>

                <td className={tdClass}>
                  <span
                    className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold border"
                    style={{
                      background: typeStyle.bg,
                      color: typeStyle.text,
                      borderColor: typeStyle.border
                    }}
                  >
                    {uni.type}
                  </span>
                </td>

                {/* Colonne Ville/Région sur 2 lignes */}
                <td className={tdClass}>
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                        color: isDark ? '#E2E8F0' : '#475569',
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {uni.ville}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200"
                      style={{
                        background: isDark ? 'rgba(147, 51, 234, 0.1)' : '#faf5ff',
                        color: isDark ? '#d8b4fe' : '#6b21a8',
                        borderColor: isDark ? 'rgba(147, 51, 234, 0.3)' : '#e9d5ff',
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 10c0 4.4-8 12-8 12s-8-7.6-8-12a8 8 0 1 1 16 0z" />
                      </svg>
                      {uni.region}
                    </span>
                  </div>
                </td>

                <td className={tdClass}>
                  <div className="flex items-baseline gap-0.5 justify-center">
                    <span className="text-lg font-bold" style={{ color: scoreColor.text }}>
                      {uni.pts}
                    </span>
                    <span className="text-xs" style={{ color: isDark ? '#94A3B8' : '#94A3B8' }}>
                      /368
                    </span>
                  </div>
                </td>

                <td className={tdClass}>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border"
                    style={{
                      background: scoreColor.bg,
                      color: scoreColor.text,
                      borderColor: scoreColor.border
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: scoreColor.text }} />
                    {scoreColor.label}
                  </span>
                </td>

                {/* Colonne Statuts sur 2 lignes */}
                <td className={tdClass}>
                  <div className="flex flex-col items-center gap-1">
                    {uni.statuses.map((status, index) => {
                      const colors = statusColors[status] || { bg: '#F1F5F9', text: '#475569' };
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
                          style={{
                            background: colors.bg,
                            color: colors.text,
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ 
                            background: 
                              status === 'Habilitée' ? '#16a34a' :
                              status === 'Accréditée' ? '#7c3aed' :
                              status === 'Non habilitée' ? '#ea580c' :
                              status === 'Non accréditée' ? '#ca8a04' :
                              status === 'Suspendue' ? '#dc2626' : '#475569'
                          }} />
                          {status}
                        </div>
                      );
                    })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className={`px-5 py-4 border-t flex items-center justify-between flex-wrap gap-3 ${
        isDark ? 'border-white/10' : 'border-slate-200'
      }`}>
        <span className="text-xs" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
          Affichage {Math.min((page - 1) * PER_PAGE + 1, sortedData.length)}–{Math.min(page * PER_PAGE, sortedData.length)} sur {sortedData.length} établissements
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
              background: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
              opacity: page === 1 ? 0.5 : 1,
              cursor: page === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <span className="text-sm font-semibold min-w-[60px] text-center" style={{ color: isDark ? '#E2E8F0' : '#334155' }}>
            Page {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0',
              background: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
              opacity: page === totalPages ? 0.5 : 1,
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Madagascar Map Component (simplifié pour la lisibilité) ─────────────────
const MadagascarMap = ({ isDark }) => {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const instRef = useRef(null);
  const markersRef = useRef([]);
  const routeRef = useRef(null);
  const tileRef = useRef(null);
  const watchIdRef = useRef(null);

  const [tileMode, setTileMode] = useState(() => isDark ? 'dark' : 'standard');
  const [fullscreen, setFullscreen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [popup, setPopup] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const [routeMode, setRouteMode] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const loadL = () => new Promise(res => {
    if (window.L) { res(window.L); return; }
    const css = document.createElement('link'); css.rel='stylesheet'; css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(css);
    const js = document.createElement('script'); js.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; js.onload=()=>res(window.L); document.head.appendChild(js);
  });

  const switchTile = useCallback((mode) => {
    if (!instRef.current || !window.L) return;
    const { map } = instRef.current;
    if (tileRef.current) map.removeLayer(tileRef.current);
    tileRef.current = window.L.tileLayer(TILE_MODES[mode].url, { attribution:'', maxZoom:19 }).addTo(map);
    setTileMode(mode);
  }, []);

  useEffect(() => {
    if (!instRef.current) return;
    if (tileMode === 'dark' || tileMode === 'standard') switchTile(isDark ? 'dark' : 'standard');
  }, [isDark, tileMode, switchTile]);

  const detectGPS = useCallback(() => {
    if (!navigator.geolocation) { setGpsError('GPS non disponible sur cet appareil'); return; }
    setGpsLoading(true); setGpsError(null);
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);

    const opts = { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 };

    const onSuccess = (pos) => {
      const lp = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
      setUserPos(lp);
      setGpsLoading(false);
      setGpsError(null);
    };

    const onError = () => {
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        () => { setGpsLoading(false); setGpsError('Position introuvable. Autorisez la géolocalisation.'); },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
      );
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, opts);
    watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, ()=>{}, { enableHighAccuracy: true, maximumAge: 5000 });
  }, []);

  useEffect(() => {
    detectGPS();
    return () => { if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); };
  }, [detectGPS]);

  const placeUserMarker = useCallback((pos) => {
    if (!instRef.current || !window.L) return;
    const { map } = instRef.current;
    if (instRef.current.userMarker) instRef.current.userMarker.remove();
    if (instRef.current.accuracyCircle) instRef.current.accuracyCircle.remove();

    if (pos.accuracy && pos.accuracy < 5000) {
      instRef.current.accuracyCircle = window.L.circle([pos.lat, pos.lng], {
        radius: pos.accuracy, color:'#22d3ee', fillColor:'#22d3ee', fillOpacity:0.08, weight:1.5, opacity:0.4
      }).addTo(map);
    }

    const icon = window.L.divIcon({
      html:`<div style="width:18px;height:18px;border-radius:50%;background:#22d3ee;border:3px solid white;box-shadow:0 0 0 4px rgba(34,211,238,0.3),0 2px 8px rgba(0,0,0,0.4)"></div>`,
      iconSize:[18,18], iconAnchor:[9,9], className:'',
    });
    const m = window.L.marker([pos.lat, pos.lng], { icon, zIndexOffset:1000 }).addTo(map);
    m.bindTooltip(`Ma position${pos.accuracy ? ` (±${Math.round(pos.accuracy)}m)` : ''}`, { permanent:false, direction:'top', offset:[0,-12] });
    instRef.current.userMarker = m;
  }, []);

  useEffect(() => {
    if (userPos) {
      placeUserMarker(userPos);
      if (instRef.current && !instRef.current.centeredOnUser) {
        instRef.current.map.flyTo([userPos.lat, userPos.lng], 12, { duration:1.5 });
        instRef.current.centeredOnUser = true;
      }
    }
  }, [userPos, placeUserMarker]);

  const calculateRoute = useCallback((mode) => {
    if (!userPos || !selected || !instRef.current) return;
    setRouteLoading(true);
    const { map } = instRef.current;
    if (routeRef.current) { map.removeLayer(routeRef.current); routeRef.current = null; }
    const profile = mode === 'walking' ? 'foot' : 'car';
    const url = `https://router.project-osrm.org/route/v1/${profile}/${userPos.lng},${userPos.lat};${selected.lng},${selected.lat}?steps=true&geometries=geojson&overview=full&annotations=false`;
    fetch(url)
      .then(r => { if (!r.ok) throw new Error('Network error'); return r.json(); })
      .then(data => {
        if (!data.routes?.[0]) { setRouteLoading(false); return; }
        const route = data.routes[0];
        const L = window.L;
        const coords = route.geometry.coordinates.map(c => [c[1],c[0]]);
        const color = mode === 'walking' ? '#22d3ee' : '#22c55e';

        const glowPoly = L.polyline(coords, { color, weight:10, opacity:0.15, lineCap:'round', lineJoin:'round' }).addTo(map);
        const mainPoly = L.polyline(coords, { color, weight:4.5, opacity:0.95, dashArray:mode==='walking'?'10 7':null, lineCap:'round', lineJoin:'round' }).addTo(map);

        const group = L.layerGroup([glowPoly, mainPoly]).addTo(map);
        routeRef.current = group;
        map.fitBounds(mainPoly.getBounds(), { padding:[60,60] });

        const steps = [];
        route.legs.forEach(leg => leg.steps.forEach(step => {
          if (step.name || step.maneuver?.type) steps.push({ instruction:step.maneuver?.type||'continue', name:step.name||'', dist:step.distance, duration:step.duration });
        }));
        setRouteInfo({ distance:route.distance, duration:route.duration, steps:steps.slice(0,10) });
        setRouteLoading(false);
      })
      .catch(() => { setRouteLoading(false); });
    setRouteMode(mode);
  }, [userPos, selected]);

  const clearRoute = useCallback(() => {
    if (routeRef.current && instRef.current) { instRef.current.map.removeLayer(routeRef.current); routeRef.current = null; }
    setRouteInfo(null); setRouteMode(null);
  }, []);

  const createPinIcon = (color, sel = false) => {
    const sz = sel ? 44 : 32, h = sel ? 60 : 45;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${h}" viewBox="0 0 32 45"><defs><filter id="sh"><feDropShadow dx="0" dy="${sel?5:3}" stdDeviation="${sel?4:2.5}" flood-color="rgba(0,0,0,0.55)"/></filter></defs><path filter="url(#sh)" d="M16 2C9.4 2 4 7.4 4 14c0 9.6 12 28 12 28s12-18.4 12-28C28 7.4 22.6 2 16 2z" fill="${color}" stroke="rgba(255,255,255,0.4)" stroke-width="${sel?2:1.5}"/><circle cx="16" cy="14" r="${sel?7:5.5}" fill="rgba(255,255,255,0.93)"/>${sel?`<circle cx="16" cy="14" r="3.5" fill="${color}"/>`:''}  </svg>`;
    return { url:`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`, size:[sz,h], anchor:[sz/2,h] };
  };

  const updateIcons = useCallback(sel => {
    if (!window.L) return;
    markersRef.current.forEach(({ marker, uni }) => {
      const ev = getEvaluation(uni.pts), isSel = sel?.id === uni.id;
      const pin = createPinIcon(ev.color, isSel);
      marker.setIcon(window.L.icon({ iconUrl:pin.url, iconSize:pin.size, iconAnchor:pin.anchor }));
      marker.setZIndexOffset(isSel ? 500 : 0);
    });
  }, []);

  useEffect(() => {
    if (instRef.current?.map) setTimeout(() => { instRef.current.map.invalidateSize(); }, 100);
  }, [fullscreen, sidebarOpen]);

  useEffect(() => {
    loadL().then(L => {
      if (instRef.current) return;
      const map = L.map(mapRef.current, { center:[-19.5,46.8], zoom:5, zoomControl:false, scrollWheelZoom:false });
      map.on('click', () => map.scrollWheelZoom.enable());
      map.on('mouseout', () => map.scrollWheelZoom.disable());
      L.control.zoom({ position:'bottomright' }).addTo(map);
      map.attributionControl.remove();

      const initMode = isDark ? 'dark' : 'standard';
      tileRef.current = L.tileLayer(TILE_MODES[initMode].url, { attribution:'', maxZoom:19 }).addTo(map);
      setTileMode(initMode);

      const markers = UNIVERSITIES.map(u => {
        const ev = getEvaluation(u.pts);
        const pin = createPinIcon(ev.color, false);
        const m = L.marker([u.lat, u.lng], { icon: L.icon({ iconUrl:pin.url, iconSize:pin.size, iconAnchor:pin.anchor }) }).addTo(map);
        m.on('click', () => {
          if (map.getZoom() < 10) map.flyTo([u.lat, u.lng], 13, { duration:1.4, easeLinearity:0.3 });
          setSelected(u);
          setTimeout(() => {
            if (!instRef.current) return;
            const pt = instRef.current.map.latLngToContainerPoint([u.lat, u.lng]);
            setPopup({ uni:u, x:pt.x, y:pt.y });
          }, 120);
        });
        return { marker:m, uni:u };
      });
      markersRef.current = markers;
      instRef.current = { map, userMarker:null, accuracyCircle:null, centeredOnUser:false };
    });
    return () => {
      if (instRef.current?.map) { instRef.current.map.remove(); instRef.current = null; }
    };
  }, []);

  useEffect(() => { updateIcons(selected); }, [selected, updateIcons]);

  const listData = UNIVERSITIES.filter(u => {
    const q = search.toLowerCase();
    return (!q || u.name.toLowerCase().includes(q) || u.ville.toLowerCase().includes(q)) &&
           (filter === 'all' || u.statuses.includes(filter));
  });

  const sb = isDark
    ? { bg:'#1e2235', br:'rgba(255,255,255,0.08)', tx:'#f1f5f9', su:'rgba(255,255,255,0.4)', ib:'rgba(255,255,255,0.06)', ibr:'rgba(255,255,255,0.1)', rh:'rgba(255,255,255,0.05)' }
    : { bg:'#ffffff', br:'#e2e8f0', tx:'#0f172a', su:'#64748b', ib:'#f8fafc', ibr:'#e2e8f0', rh:'#f1f5f9' };

  const mc = isDark
    ? { bg:'rgba(20,22,40,0.92)', br:'rgba(255,255,255,0.12)', tx:'rgba(255,255,255,0.75)', abg:'rgba(99,102,241,0.3)', atx:'#a5b4fc', abr:'rgba(99,102,241,0.55)' }
    : { bg:'rgba(255,255,255,0.95)', br:'rgba(0,0,0,0.12)', tx:'#3c4043', abg:'#1a73e8', atx:'#fff', abr:'#1a73e8' };

  const pbg = isDark ? '#1a1e35' : '#ffffff';
  const pbr = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
  const ptx = isDark ? '#f1f5f9' : '#0f172a';
  const psu = isDark ? 'rgba(255,255,255,0.4)' : '#64748b';
  const psec = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
  const psecbr = isDark ? 'rgba(255,255,255,0.07)' : '#e2e8f0';

  const ev = popup?.uni ? getEvaluation(popup.uni.pts) : null;
  const evbg = ev ? (isDark ? ev.db : ev.lb) : '';
  const evbr = ev ? (isDark ? ev.dbr : ev.lbr) : '';

  const sbWidth = isMobile ? '100%' : 280;

  const fmtTime = (sec) => {
    const m = Math.round(sec / 60);
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60);
    const r = m % 60;
    return `${h} h ${r} min`;
  };

  const fmtDist = (m) => {
    if (m < 1000) return `${Math.round(m)} m`;
    return `${(m/1000).toFixed(1)} km`;
  };

  return (
    <div
      ref={containerRef}
      className={`flex w-full overflow-hidden transition-all duration-300 ${
        fullscreen ? 'fixed inset-0 z-[9000] h-screen' : 'relative h-full'
      }`}
    >
      {(sidebarOpen || !isMobile) && (
        <div
          className={`flex-shrink-0 flex flex-col overflow-hidden transition-all duration-300 ${
            isMobile ? 'absolute inset-y-0 left-0 z-[100]' : 'relative'
          }`}
          style={{
            width: sbWidth,
            maxWidth: isMobile ? '100%' : 280,
            background: sb.bg,
            borderRight: `1px solid ${sb.br}`,
          }}
        >
          <div className="p-3 pb-2.5 border-b" style={{ borderColor: sb.br }}>
            {isMobile && (
              <div className="flex justify-end mb-2">
                <button onClick={() => setSidebarOpen(false)} className="text-sm p-0.5" style={{ color: sb.su }}>
                  ✕
                </button>
              </div>
            )}

            <div className="relative mb-2">
              <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-35" viewBox="0 0 24 24" fill="none" stroke={isDark?'white':'#334155'} strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher une université..."
                className="w-full py-2 pl-8 pr-8 rounded-lg text-xs font-medium outline-none transition-colors"
                style={{
                  background: sb.ib,
                  border: `1px solid ${sb.ibr}`,
                  color: sb.tx,
                }}
                onFocus={e => e.target.style.borderColor='rgba(99,102,241,0.6)'}
                onBlur={e => e.target.style.borderColor=sb.ibr}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: sb.su }}
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold outline-none cursor-pointer"
              style={{
                background: sb.ib,
                border: `1px solid ${sb.ibr}`,
                color: sb.tx,
              }}
            >
              <option value="all">Tous les établissements</option>
              <option value="Habilitée">Habilitée</option>
              <option value="Accréditée">Accréditée</option>
              <option value="Non habilitée">Non habilitée</option>
              <option value="Non accréditée">Non accréditée</option>
              <option value="Suspendue">Suspendue</option>
            </select>
          </div>

          <div className="px-3 pt-1.5 pb-0.5 text-xs font-bold uppercase tracking-wider" style={{ color: sb.su }}>
            {listData.length} résultat{listData.length!==1?'s':''}
          </div>

          <div className="flex-1 overflow-y-auto px-1.5 pb-1.5 space-y-0.5">
            {listData.map((u) => {
              const ev = getEvaluation(u.pts), isSel = selected?.id === u.id;
              const rank = UNIVERSITIES.findIndex(x => x.id === u.id) + 1;
              return (
                <div
                  key={u.id}
                  onClick={() => {
                    setSelected(u);
                    if (isMobile) setSidebarOpen(false);
                    if (instRef.current) {
                      instRef.current.map.flyTo([u.lat, u.lng], 13, { duration:1.2 });
                      setTimeout(() => {
                        if (!instRef.current) return;
                        const pt = instRef.current.map.latLngToContainerPoint([u.lat, u.lng]);
                        setPopup({ uni:u, x:pt.x, y:pt.y });
                      }, 1350);
                    }
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-150 mb-0.5 ${
                    isSel ? 'bg-indigo-500/20 border border-indigo-500/35' : ''
                  }`}
                  style={!isSel ? { background: 'transparent' } : {}}
                  onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = sb.rh; }}
                  onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div
                    className="w-5.5 h-5.5 rounded-md flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{
                      background: rank <= 3 ? ev.color : (isDark?'rgba(255,255,255,0.08)':'#f1f5f9'),
                      color: rank <= 3 ? '#fff' : sb.su,
                      width: '22px',
                      height: '22px',
                    }}
                  >
                    {rank}
                  </div>

                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 tracking-tight border"
                    style={{
                      background: isDark?ev.db:ev.lb,
                      borderColor: isDark?ev.dbr:ev.lbr,
                      color: ev.color,
                    }}
                  >
                    {u.shortName}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate" style={{ color: isSel?'#a5b4fc':sb.tx }}>
                      {u.name}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: sb.su }}>
                      {u.ville} · {u.type}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-black" style={{ color: ev.color }}>{u.pts}</div>
                    <div className="text-[9px]" style={{ color: sb.su }}>/368</div>
                  </div>
                </div>
              );
            })}
            {listData.length===0 && (
              <div className="text-center py-9 px-3 text-xs" style={{ color: sb.su }}>
                Aucun résultat
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 relative overflow-hidden min-w-0">
        <div ref={mapRef} className="w-full h-full" />

        {isMobile && !sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-3 left-3 z-[999] px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md"
            style={{
              background: mc.bg,
              border: `1px solid ${mc.br}`,
              color: mc.tx,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            Liste
          </button>
        )}

        <div
          className="absolute top-3 left-3 z-[999] flex gap-0.5 p-0.5 rounded-xl backdrop-blur-md shadow-lg"
          style={{
            left: isMobile && !sidebarOpen ? 80 : 12,
            background: mc.bg,
            border: `1px solid ${mc.br}`,
          }}
        >
          {Object.entries(TILE_MODES).map(([key]) => (
            <button
              key={key}
              onClick={() => switchTile(key)}
              title={TILE_MODES[key].label}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all duration-150 ${
                tileMode===key ? 'border' : ''
              }`}
              style={{
                borderColor: tileMode===key ? mc.abr : 'transparent',
                background: tileMode===key ? mc.abg : 'transparent',
                color: tileMode===key ? mc.atx : mc.tx,
              }}
            >
              <TileIcon mode={key} size={13}/>
              {!isMobile && <span>{TILE_MODES[key].label}</span>}
            </button>
          ))}
        </div>

        <div className="absolute top-3 right-3 z-[999] flex flex-col gap-1.5">
          <button
            onClick={() => setFullscreen(f => !f)}
            title={fullscreen?'Réduire':'Agrandir'}
            className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md transition-all"
            style={{
              background: mc.bg,
              border: `1px solid ${mc.br}`,
              color: mc.tx,
            }}
          >
            {fullscreen ? <HiOutlineArrowsPointingIn className="w-4 h-4" /> : <HiOutlineArrowsPointingOut className="w-4 h-4" />}
          </button>

          <button
            onClick={detectGPS}
            title="Ma position"
            className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md transition-all"
            style={{
              background: userPos ? 'rgba(34,211,238,0.15)' : mc.bg,
              border: `1px solid ${userPos?'rgba(34,211,238,0.5)':gpsError?'rgba(239,68,68,0.5)':mc.br}`,
              color: userPos?'#22d3ee':gpsError?'#ef4444':mc.tx,
            }}
          >
            {gpsLoading ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
            ) : (
              <GpsIcon size={16} color="currentColor"/>
            )}
          </button>

          {userPos && (
            <button
              onClick={() => instRef.current?.map.flyTo([userPos.lat, userPos.lng], 14, { duration:1.2 })}
              title="Centrer sur ma position"
              className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md"
              style={{
                background: mc.bg,
                border: `1px solid ${mc.br}`,
                color: '#22d3ee',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/>
              </svg>
            </button>
          )}
        </div>

        {gpsError && (
          <div
            className="absolute top-16 left-1/2 -translate-x-1/2 z-[999] px-3.5 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md whitespace-nowrap shadow-lg pointer-events-none"
            style={{
              background: 'rgba(239,68,68,0.9)',
              color: '#fff',
            }}
          >
            {gpsError}
          </div>
        )}

        <div
          className={`absolute bottom-14 left-3 z-[999] p-2 rounded-xl backdrop-blur-md shadow-lg ${
            isMobile ? 'hidden' : 'flex flex-col gap-1'
          }`}
          style={{
            background: mc.bg,
            border: `1px solid ${mc.br}`,
          }}
        >
          {[{l:'Excellent',c:'#22c55e'},{l:'Satisfaisant',c:'#3b82f6'},{l:'Acceptable',c:'#eab308'},{l:'Faible',c:'#f97316'},{l:'Non conforme',c:'#ef4444'}].map(({l,c}) => (
            <div key={l} className="flex items-center gap-1">
              <svg width="7" height="11" viewBox="0 0 14 20">
                <path d="M7 1C3.686 1 1 3.686 1 7c0 4.5 6 12 6 12s6-7.5 6-12C13 3.686 10.314 1 7 1z" fill={c} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
              </svg>
              <span className="text-[10px] font-semibold" style={{ color: mc.tx }}>{l}</span>
            </div>
          ))}
        </div>

        {!popup && (
          <div
            className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-[999] px-3.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm whitespace-nowrap pointer-events-none"
            style={{
              background: 'rgba(0,0,0,0.55)',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            Cliquez sur une épingle pour explorer
          </div>
        )}

        {popup && ev && (
          <div
            className={`absolute z-[1000] rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-y-auto ${
              isMobile ? 'inset-x-2 bottom-2 max-h-[65vh]' : ''
            }`}
            style={!isMobile ? {
              left: Math.min(popup.x+16,(mapRef.current?.offsetWidth||800)-305),
              top: Math.max(popup.y-150, 8),
              width: 290,
              maxHeight: 'calc(100% - 24px)',
            } : {}}
          >
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                background: pbg,
                borderColor: pbr,
              }}
            >
              {popup.uni.photo && (
                <div className="h-20 relative overflow-hidden flex-shrink-0">
                  <img src={popup.uni.photo} alt="" className="w-full h-full object-cover" onError={e=>{e.target.style.display='none';}}/>
                  <div className="absolute inset-0" style={{background:isDark?'linear-gradient(to bottom,transparent 40%,rgba(15,15,35,0.85))':'linear-gradient(to bottom,transparent 40%,rgba(255,255,255,0.5))'}} />
                </div>
              )}

              <div className="px-3 py-2 border-b" style={{ borderColor: psecbr }}>
                <div className="flex items-start gap-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 border"
                    style={{
                      background: evbg,
                      borderColor: evbr,
                      color: ev.color,
                    }}
                  >
                    {popup.uni.shortName}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black truncate" style={{ color: ptx }}>
                      {popup.uni.name}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: psu }}>
                      {popup.uni.ville} · {popup.uni.type}
                    </div>
                  </div>
                  <button
                    onClick={() => { setPopup(null); setSelected(null); }}
                    className="w-5.5 h-5.5 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                    style={{
                      background: isDark?'rgba(255,255,255,0.08)':'#f1f5f9',
                      color: psu,
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="flex gap-1 flex-wrap mt-2">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border"
                    style={{
                      background: evbg,
                      borderColor: evbr,
                      color: ev.color,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10"/><path fill="white" d="M11 7h2v2h-2zm0 4h2v6h-2z"/>
                    </svg>
                    {popup.uni.pts} pts · {ev.label}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                    style={{
                      background: psec,
                      border: `1px solid ${psecbr}`,
                      color: psu,
                    }}
                  >
                    {popup.uni.students.toLocaleString()} étudiants
                  </span>
                </div>
              </div>

              <div className="px-3 py-2 border-b" style={{ borderColor: psecbr }}>
                <div className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: psu }}>
                  Domaines
                </div>
                <div className="text-[10px] leading-5" style={{ color: isDark?'rgba(255,255,255,0.52)':psu }}>
                  {popup.uni.domaines}
                </div>
              </div>

              <div className="px-3 py-1.5 border-b flex gap-1 flex-wrap" style={{ borderColor: psecbr }}>
                {popup.uni.statuses.map(s => <StatusPill key={s} status={s} isDark={isDark}/>)}
              </div>

              <div className="px-3 py-1.5 border-b space-y-0.5" style={{ borderColor: psecbr }}>
                {[
                  { Icon: HiOutlineMapPin, v:popup.uni.address },
                  { Icon: () => (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                      </svg>
                    ), v:popup.uni.phone },
                  { Icon: HiOutlineGlobeAlt, v:popup.uni.website },
                ].map(({Icon,v}) => (
                  <div key={v} className="flex gap-1 text-[10px]" style={{ color: psu }}>
                    <span className="flex-shrink-0 mt-0.5 text-indigo-400"><Icon className="w-2.5 h-2.5"/></span>
                    <span className="leading-4">{v}</span>
                  </div>
                ))}
              </div>

              <div className="px-3 py-2">
                <div className="text-[10px] font-bold mb-1.5 flex items-center gap-1" style={{ color: ptx }}>
                  <HiOutlineFlag className="w-2.5 h-2.5 text-indigo-400"/>
                  Itinéraire
                  {userPos ? (
                    <span className="text-[9px] text-green-500 font-bold">· GPS actif</span>
                  ) : (
                    <span className="text-[9px] text-orange-500 font-bold">· GPS requis</span>
                  )}
                </div>

                {!userPos ? (
                  <button
                    onClick={detectGPS}
                    className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border-dashed"
                    style={{
                      border: `1px dashed ${isDark?'rgba(255,255,255,0.2)':psecbr}`,
                      color: psu,
                    }}
                  >
                    <GpsIcon size={13} color="currentColor"/> Activer la localisation GPS
                  </button>
                ) : (
                  <>
                    <div className="flex gap-1 mb-1.5">
                      <button
                        onClick={() => calculateRoute('walking')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                          routeMode==='walking' ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500' : ''
                        }`}
                        style={{
                          border: `1px solid ${routeMode==='walking'?'#22d3ee':'rgba(34,211,238,0.3)'}`,
                          color: routeMode==='walking'?'#22d3ee':psu,
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <circle cx="12" cy="5" r="2"/><path d="M12 22V12m-4-4l4 4 4-4"/>
                        </svg>
                        À pied
                      </button>
                      <button
                        onClick={() => calculateRoute('driving')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                          routeMode==='driving' ? 'bg-green-500/15 text-green-400 border-green-500' : ''
                        }`}
                        style={{
                          border: `1px solid ${routeMode==='driving'?'#22c55e':'rgba(34,197,94,0.3)'}`,
                          color: routeMode==='driving'?'#22c55e':psu,
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                        </svg>
                        Voiture
                      </button>
                      {routeMode && (
                        <button
                          onClick={clearRoute}
                          title="Effacer l'itinéraire"
                          className="w-8 rounded-lg flex items-center justify-center"
                          style={{
                            border: `1px solid ${psecbr}`,
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      )}
                    </div>

                    {routeLoading && (
                      <div className="flex items-center gap-1.5 text-[10px] px-2 py-1.5 rounded-lg border" style={{ background: psec, borderColor: psecbr, color: psu }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
                          <path d="M21 12a9 9 0 11-6.219-8.56"/>
                        </svg>
                        Calcul de l'itinéraire…
                      </div>
                    )}

                    {routeInfo && !routeLoading && (
                      <div className="p-2 rounded-lg border flex gap-3.5 items-center" style={{ background: psec, borderColor: psecbr }}>
                        <div>
                          <div className="text-sm font-black" style={{ color: routeMode==='walking'?'#22d3ee':'#22c55e' }}>
                            {fmtTime(routeInfo.duration)}
                          </div>
                          <div className="text-[9px] mt-0.5" style={{ color: psu }}>Durée estimée</div>
                        </div>
                        <div className="w-px h-7" style={{ background: psecbr }}/>
                        <div>
                          <div className="text-sm font-bold" style={{ color: ptx }}>
                            {fmtDist(routeInfo.distance)}
                          </div>
                          <div className="text-[9px] mt-0.5" style={{ color: psu }}>Distance</div>
                        </div>
                        {!isMobile && (
                          <span className="ml-auto text-[9px] italic" style={{ color: psu }}>
                            Itinéraire affiché sur la carte
                          </span>
                        )}
                      </div>
                    )}

                    {routeMode && routeInfo && (
                      <div className="mt-1.5 text-[9px] italic text-center" style={{ color: psu }}>
                        L'itinéraire reste affiché même après fermeture du panneau
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Charts Components ──────────────────────────────────────────────────────────
const LineChart = ({ isDark }) => {
  const pts=[{y:'2020',v:28},{y:'2021',v:31},{y:'2022',v:34},{y:'2023',v:38},{y:'2024',v:41},{y:'2025',v:44},{y:'2026',v:47}];
  const [hov,setHov]=useState(null);
  const W=520,H=210,PL=44,PR=20,PT=36,PB=36,cW=W-PL-PR,cH=H-PT-PB,min=20,max=55;
  const xP=i=>PL+(i/(pts.length-1))*cW,yP=v=>PT+cH-((v-min)/(max-min))*cH;
  const lp=pts.map((d,i)=>`${i?'L':'M'} ${xP(i)} ${yP(d.v)}`).join(' ');
  const area=`${lp} L ${xP(pts.length-1)} ${PT+cH} L ${PL} ${PT+cH} Z`;
  const gc=isDark?'rgba(255,255,255,0.07)':'#f1f5f9',tc=isDark?'rgba(255,255,255,0.22)':'#cbd5e1',lc=isDark?'rgba(255,255,255,0.4)':'#64748b';
  return(
    <div>
      <p className="text-xs font-black mb-1" style={{ color: isDark?'#f1f5f9':'#1e293b' }}>Croissance du parc universitaire</p>
      <p className="text-[11px] mb-3" style={{ color: isDark?'rgba(255,255,255,0.35)':'#94a3b8' }}>Nombre d'universités par année</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
        <defs><linearGradient id="aG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity=".22"/><stop offset="100%" stopColor="#6366f1" stopOpacity="0"/></linearGradient></defs>
        {[25,30,35,40,45,50].map(v=>(<g key={v}><line x1={PL} y1={yP(v)} x2={W-PR} y2={yP(v)} stroke={gc} strokeWidth="1.5"/><text x={PL-7} y={yP(v)+4} textAnchor="end" fontSize="9.5" fill={tc} fontWeight="600">{v}</text></g>))}
        <path d={area} fill="url(#aG)"/>
        <path d={lp} fill="none" stroke="#6366f1" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((d,i)=>(<g key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} className="cursor-pointer">{hov===i&&(<><line x1={xP(i)} y1={PT} x2={xP(i)} y2={PT+cH} stroke="#6366f1" strokeWidth="1" strokeDasharray="3 3" opacity=".3"/><rect x={xP(i)-28} y={yP(d.v)-32} width="56" height="22" rx="7" fill="#4f46e5"/><text x={xP(i)} y={yP(d.v)-17} textAnchor="middle" fontSize="11" fontWeight="800" fill="white">{d.v} unis</text></>)}<circle cx={xP(i)} cy={yP(d.v)} r={hov===i?7:4.5} fill={hov===i?"#6366f1":isDark?"#2a2d4a":"white"} stroke="#6366f1" strokeWidth="2.5"/><text x={xP(i)} y={H-4} textAnchor="middle" fontSize="10" fill={lc} fontWeight="600">{d.y}</text><text x={xP(i)} y={yP(d.v)-9} textAnchor="middle" fontSize="9" fill="#6366f1" fontWeight="800" opacity={hov===i?0:1}>{d.v}</text></g>))}
      </svg>
    </div>
  );
};

const BarChart = ({ isDark }) => {
  const data=[{r:'Antananarivo',v:92,c:'#6366f1',cH:'#4f46e5'},{r:'Fianarantsoa',v:80,c:'#06b6d4',cH:'#0891b2'},{r:'Mahajanga',v:73,c:'#10b981',cH:'#059669'},{r:'Toamasina',v:65,c:'#eab308',cH:'#ca8a04'},{r:'Toliara',v:46,c:'#f97316',cH:'#ea580c'},{r:'Antsiranana',v:21,c:'#ef4444',cH:'#dc2626'}];
  const [hov,setHov]=useState(null);
  const W=520,H=220,PL=42,PR=16,PT=32,PB=58,cW=W-PL-PR,cH=H-PT-PB,bW=cW/data.length;
  const gc=isDark?'rgba(255,255,255,0.06)':'#f1f5f9',tc=isDark?'rgba(255,255,255,0.18)':'#d1d5db',lc=isDark?'rgba(255,255,255,0.38)':'#64748b';
  return(
    <div>
      <p className="text-xs font-black mb-1" style={{ color: isDark?'#f1f5f9':'#1e293b' }}>Qualité par région (%)</p>
      <p className="text-[11px] mb-3" style={{ color: isDark?'rgba(255,255,255,0.35)':'#94a3b8' }}>Score de performance</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
        <defs>{data.map((d,i)=>(<linearGradient key={i} id={`bg${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={hov===i?d.cH:d.c}/><stop offset="100%" stopColor={hov===i?d.cH:d.c} stopOpacity=".4"/></linearGradient>))}</defs>
        {[25,50,75,100].map(v=>{const y=PT+cH-(v/100)*cH;return(<g key={v}><line x1={PL} y1={y} x2={W-PR} y2={y} stroke={gc} strokeWidth="1.5"/><text x={PL-5} y={y+4} textAnchor="end" fontSize="9" fill={tc}>{v}%</text></g>);})}
        {data.map((d,i)=>{const bH=(d.v/100)*cH,x=PL+i*bW+bW*.15,w=bW*.7,y=PT+cH-bH;return(<g key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} className="cursor-pointer"><rect x={x} y={PT} width={w} height={cH} rx="5" fill={isDark?'rgba(255,255,255,0.03)':'#f8fafc'}/><rect x={x} y={y} width={w} height={bH} rx="5" fill={`url(#bg${i})`} opacity={hov!==null&&hov!==i?.4:1}/><text x={x+w/2} y={y-6} textAnchor="middle" fontSize="10" fontWeight="800" fill={d.v>=80?'#15803d':d.v>=60?'#d97706':'#dc2626'}>{d.v}%</text>{hov===i&&(<><rect x={x+w/2-30} y={y-30} width="60" height="20" rx="5" fill="#0f172a"/><text x={x+w/2} y={y-16} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="white">{d.v}% — {d.r}</text></>)}<text x={x+w/2} y={H-PB+16} textAnchor="middle" fontSize="8.5" fill={lc} fontWeight="600">{d.r}</text></g>);})}
      </svg>
    </div>
  );
};

const DonutChart = ({ isDark }) => {
  const data=[{name:'Habilitées',v:28,c:'#22c55e'},{name:'Non hab.',v:12,c:'#f97316'},{name:'Accréditées',v:7,c:'#a855f7'},{name:'Non accréd.',v:5,c:'#eab308'},{name:'Suspendues',v:3,c:'#ef4444'}];
  const total=data.reduce((s,d)=>s+d.v,0);
  const [hov,setHov]=useState(null);let cum=-90;
  const slices=data.map(d=>{const angle=(d.v/total)*360,s=cum;cum+=angle;return{...d,s,e:cum,mid:s+angle/2};});
  const polar=(cx,cy,r,a)=>({x:cx+r*Math.cos((a*Math.PI)/180),y:cy+r*Math.sin((a*Math.PI)/180)});
  const arc=(cx,cy,r,s,e)=>{const p1=polar(cx,cy,r,s),p2=polar(cx,cy,r,e);return`M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${e-s>180?1:0} 1 ${p2.x} ${p2.y} Z`;};
  const cx=90,cy=90,hS=hov!==null?slices[hov]:null;
  const df=isDark?'#2a2d4a':'white',lc=isDark?'rgba(255,255,255,0.28)':'#94a3b8',nc=isDark?'#e2e8f0':'#334155',tr=isDark?'rgba(255,255,255,0.07)':'#f1f5f9';
  return(
    <div>
      <p className="text-xs font-black mb-1" style={{ color: isDark?'#f1f5f9':'#1e293b' }}>Répartition des statuts</p>
      <p className="text-[11px] mb-3" style={{ color: isDark?'rgba(255,255,255,0.35)':'#94a3b8' }}>Distribution par catégorie</p>
      <div className="flex gap-5 items-center">
        <svg viewBox="0 0 180 180" className="w-[170px] h-[170px] flex-shrink-0">
          {slices.map((s,i)=>{const isH=hov===i,midRad=(s.mid*Math.PI)/180,off=isH?8:0;return(<g key={i} transform={`translate(${off*Math.cos(midRad)},${off*Math.sin(midRad)})`} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} className="cursor-pointer transition-transform duration-200"><path d={arc(cx,cy,76,s.s,s.e)} fill={s.c} opacity={hov!==null&&!isH?.45:1}/></g>);})} 
          <circle cx={cx} cy={cy} r={46} fill={df}/>
          <text x={cx} y={cy-8} textAnchor="middle" fontSize="26" fontWeight="900" fill={hS?hS.c:isDark?'#f1f5f9':'#0f172a'}>{hS?hS.v:total}</text>
          <text x={cx} y={cy+10} textAnchor="middle" fontSize="9.5" fill={lc}>{hS?hS.name:'établissements'}</text>
        </svg>
        <div className="flex-1 flex flex-col gap-2.5">
          {slices.map((s,i)=>(<div key={i} className="cursor-pointer" onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}><div className="flex justify-between mb-1"><div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{background:s.c}}/><span className="text-xs font-semibold" style={{color:nc}}>{s.name}</span></div><span className="text-sm font-black" style={{color:s.c}}>{s.v}</span></div><div className="h-1.5 rounded-full overflow-hidden" style={{background:tr}}><div className="h-full rounded-full" style={{width:`${(s.v/total)*100}%`,background:s.c,opacity:hov===i?1:.7}}/></div></div>))}
          <div className="mt-1 pt-2 border-t text-xs" style={{borderColor:tr,color:lc}}>Total : <strong style={{color:nc}}>{total}</strong></div>
        </div>
      </div>
    </div>
  );
};

const fmtDist = m => m >= 1000 ? `${(m/1000).toFixed(1)} km` : `${Math.round(m)} m`;
const fmtTime = s => s < 60 ? `${Math.round(s)} sec` : s < 3600 ? `${Math.round(s/60)} min` : `${Math.floor(s/3600)}h ${Math.round((s%3600)/60)}min`;

// ─── Main Dashboard ───────────────────────────────────────────────────────────────
export default function DashboardUniView() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // Fond blanc pur en mode light, fond sombre en mode dark
  const bg = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBr = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
  const hdrBr = isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9';
  const hC = isDark ? '#f1f5f9' : '#0f172a';
  const sC = isDark ? 'rgba(255,255,255,0.5)' : '#64748b';

  const stats = { total: 47, hab: 28, acc: 7, nonHab: 12, pub: 32, priv: 15 };
  const [page, setPage] = useState(1);
  const [tableFilter, setTableFilter] = useState('all');
  const [chart, setChart] = useState('line');
  const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });
  const [dateRange, setDateRange] = useState({
    label: 'Février 2026',
    from: '2026-02-01',
    to: '2026-02-28'
  });

  // Données avec rang global fixe (basé sur score décroissant)
  const tableData = [...UNIVERSITIES]
    .sort((a, b) => b.pts - a.pts)
    .map((u, index) => ({
      ...u,
      globalRank: index + 1
    }));

  const filteredData = tableFilter === 'all'
    ? tableData
    : tableData.filter(u => u.statuses.includes(tableFilter));

  const S = {
    card: {
      background: cardBg,
      border: `1px solid ${cardBr}`,
      borderRadius: 16,
      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.04)',
      overflow: 'hidden',
      marginBottom: 20,
      transition: 'background .3s,border-color .3s'
    },
    hdr: {
      padding: '16px 20px',
      borderBottom: `1px solid ${hdrBr}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 10
    },
    ib: c => ({
      width: 38,
      height: 38,
      borderRadius: 10,
      background: c,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }),
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        background: bg,
        fontFamily: "system-ui,-apple-system,sans-serif",
      }}
    >
      <style>{`
        @keyframes fadeIn  {from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn   {from{opacity:0;transform:scale(0.93) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes spin    {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .leaflet-control-attribution{display:none!important}
        .leaflet-control-zoom{border:none!important;border-radius:10px!important;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.4)!important}
        .leaflet-control-zoom a{background:rgba(15,15,35,0.9)!important;backdrop-filter:blur(8px);color:rgba(255,255,255,0.75)!important;border:none!important;width:38px!important;height:38px!important;line-height:38px!important;font-size:20px!important;border-bottom:1px solid rgba(255,255,255,0.08)!important;display:flex!important;align-items:center!important;justify-content:center!important}
        .leaflet-control-zoom a:hover{background:rgba(40,40,70,0.98)!important;color:white!important}
        .leaflet-control-zoom-out{border-bottom:none!important}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(128,128,128,0.22);border-radius:999px}
        @media(max-width:768px){
          .dash-stats{grid-template-columns:1fr 1fr!important}
          .dash-charts-grid{grid-template-columns:1fr!important}
          .dash-header{flex-direction:column!important;align-items:flex-start!important}
        }
        @media(max-width:480px){
          .dash-stats{grid-template-columns:1fr!important}
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="dash-header flex justify-between items-start flex-wrap gap-3 mb-6">
          <div>
            <h1 className="text-[clamp(20px,4vw,28px)] font-black tracking-tight m-0" style={{ color: hC }}>
              Tableau de bord
            </h1>
            <p className="text-xs font-medium mt-1" style={{ color: sC }}>
              Résultats des auto-évaluations · Classement des établissements
            </p>
          </div>
          <DateRangePicker value={dateRange} onChange={setDateRange} isDark={isDark} />
        </div>

        {/* Stats Cards */}
        <div className="dash-stats grid grid-cols-4 gap-3 mb-5">
          <StatCard
            title="Total Universités"
            value={stats.total}
            sub={`${stats.pub} publiques · ${stats.priv} privées`}
            Icon={HiOutlineBuildingLibrary}
            accent="blue"
            isDark={isDark}
          />
          <StatCard
            title="Habilitées"
            value={stats.hab}
            sub={`${Math.round(stats.hab / stats.total * 100)}% du total`}
            Icon={HiOutlineCheckCircle}
            accent="green"
            isDark={isDark}
            trend="+12%"
          />
          <StatCard
            title="Accréditées"
            value={stats.acc}
            sub={`${stats.total - stats.acc} non accréditées`}
            Icon={HiOutlineShieldCheck}
            accent="purple"
            isDark={isDark}
          />
          <StatCard
            title="Non Habilitées"
            value={stats.nonHab}
            sub="En attente d'évaluation"
            Icon={HiOutlineExclamationTriangle}
            accent="orange"
            isDark={isDark}
          />
        </div>

        {/* Map Card */}
        <div style={S.card} className="overflow-visible">
          <div style={S.hdr}>
            <div className="flex items-center gap-2.5">
              <div style={S.ib(isDark ? 'rgba(99,102,241,0.10)' : '#eef2ff')}>
                <HiOutlineMapPin className="w-4.5 h-4.5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-[clamp(13px,2vw,15px)] font-black m-0" style={{ color: hC }}>
                  Géolocalisation des universités
                </h2>
                <p className="text-[11px] m-0" style={{ color: sC }}>
                  Liste classée par performance · Carte interactive · GPS · Itinéraire
                </p>
              </div>
            </div>
          </div>
          <div className="h-[clamp(420px,60vh,620px)] rounded-b-xl overflow-hidden">
            <MadagascarMap isDark={isDark} />
          </div>
        </div>

        {/* Charts */}
        <div style={S.card}>
          <div style={S.hdr}>
            <div className="flex items-center gap-2.5">
              <div style={S.ib(isDark ? 'rgba(99,102,241,0.10)' : '#eef2ff')}>
                <HiOutlineChartBar className="w-4.5 h-4.5 text-purple-500" />
              </div>
              <div>
                <h2 className="text-[clamp(13px,2vw,15px)] font-black m-0" style={{ color: hC }}>
                  Analyses et performances
                </h2>
                <p className="text-[11px] m-0" style={{ color: sC }}>
                  {dateRange.label}
                </p>
              </div>
            </div>
            <div
              className="flex gap-0.5 p-0.5 rounded-xl border"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                borderColor: cardBr,
              }}
            >
              {[
                { k: 'line', I: PiChartLineUp, l: 'Courbe' },
                { k: 'bar', I: PiChartBar, l: 'Barres' },
                { k: 'pie', I: PiChartPieSlice, l: 'Secteurs' }
              ].map(({ k, I, l }) => (
                <button
                  key={k}
                  onClick={() => setChart(k)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-150"
                  style={{
                    background: chart === k ? (isDark ? 'rgba(99,102,241,0.2)' : '#fff') : 'transparent',
                    color: chart === k ? '#6366f1' : sC,
                    fontWeight: chart === k ? 700 : 500,
                    boxShadow: chart === k ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  <I className="w-3.5 h-3.5" />
                  <span>{l}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="dash-charts-grid p-5 grid grid-cols-[1fr_340px] gap-6 items-start">
            <div
              className="p-5 rounded-xl min-h-[250px]"
              style={{
                background: isDark ? 'rgba(255,255,255,0.025)' : '#fafbfc',
                border: `1px solid ${hdrBr}`,
              }}
            >
              {chart === 'line' && <LineChart isDark={isDark} />}
              {chart === 'bar' && <BarChart isDark={isDark} />}
              {chart === 'pie' && <DonutChart isDark={isDark} />}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1" style={{ color: sC }}>
                <HiOutlineAcademicCap className="w-3.5 h-3.5" />
                Top 5 des meilleurs scores
              </p>
              <div className="flex flex-col gap-1.5 max-h-[360px] overflow-y-auto">
                {UNIVERSITIES.slice(0, 5).map((u, i) => {
                  const ev = getEvaluation(u.pts);
                  return (
                    <div
                      key={u.id}
                      className="flex items-start gap-2 p-2.5 rounded-xl border transition-colors cursor-default"
                      style={{
                        background: cardBg,
                        borderColor: hdrBr,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = hdrBr; }}
                    >
                      <div
                        className="w-5.5 h-5.5 rounded-md flex items-center justify-center text-xs font-black flex-shrink-0"
                        style={{
                          background: i < 3 ? ev.color : (isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'),
                          color: i < 3 ? '#fff' : sC,
                        }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11.5px] font-bold truncate m-0" style={{ color: isDark ? '#E2E8F0' : '#1E293B' }}>
                          {u.name}
                        </p>
                        <div className="flex items-center gap-1 my-0.5">
                          <span className="text-sm font-black" style={{ color: ev.color }}>{u.pts}</span>
                          <span className="text-[9px]" style={{ color: sC }}>/368 pts · {ev.label}</span>
                        </div>
                        <div className="flex flex-wrap gap-0.5">
                          {u.statuses.map(s => <StatusPill key={s} status={s} isDark={isDark} />)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des résultats d'auto-évaluation */}
        <div style={S.card}>
          <div style={S.hdr}>
            <div className="flex items-center gap-2.5">
              <div style={S.ib(isDark ? 'rgba(34,197,94,0.12)' : '#f0fdf4')}>
                <HiOutlineChartPie className="w-4.5 h-4.5 text-green-500" />
              </div>
              <div>
                <h2 className="text-[clamp(13px,2vw,15px)] font-black m-0" style={{ color: hC }}>
                  Résultats des auto-évaluations
                </h2>
                <p className="text-[11px] m-0" style={{ color: sC }}>
                  Classement complet · {filteredData.length} établissements
                </p>
              </div>
            </div>
            <select
              value={tableFilter}
              onChange={e => {
                setTableFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border"
              style={{
                borderColor: cardBr,
                color: isDark ? '#e2e8f0' : '#475569',
                background: isDark ? '#1e293b' : '#fff',
              }}
            >
              <option value="all">Tous les statuts</option>
              <option value="Habilitée">Habilitée</option>
              <option value="Accréditée">Accréditée</option>
              <option value="Non habilitée">Non habilitée</option>
              <option value="Non accréditée">Non accréditée</option>
              <option value="Suspendue">Suspendue</option>
            </select>
          </div>

          <EvaluationTable
            filteredData={filteredData}
            page={page}
            setPage={setPage}
            isDark={isDark}
            dateRange={dateRange}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
          />
        </div>
      </div>
    </div>
  );
}