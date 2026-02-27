import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  HiOutlineBuildingLibrary,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
  HiOutlineChartPie,
  HiOutlineAcademicCap,
  HiOutlineCalendar,
  HiOutlineClipboardDocument,
  HiOutlineFlag,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi2';
import { PiChartLineUp, PiChartBar, PiChartPieSlice } from 'react-icons/pi';
import { AlertTriangle, Zap, CheckCircle2, Star } from 'lucide-react';
import { ThemeContext } from '../../../../context/ThemeContext';

// ─── Evaluation helpers ───────────────────────────────────────────────────────
const getLevelKey = (pts) => {
  if (pts <= 91)  return 'non-conforme';
  if (pts <= 183) return 'faible';
  if (pts <= 256) return 'acceptable';
  if (pts <= 311) return 'satisfaisant';
  return 'excellent';
};

const LEVEL_CFG = {
  'non-conforme': {
    label: 'Non conforme', icon: AlertTriangle,
    score: 'text-red-700 dark:text-red-400',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    ring: '#ef4444', dot: 'bg-red-500',
  },
  'faible': {
    label: 'Faible', icon: Zap,
    score: 'text-orange-700 dark:text-orange-400',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    ring: '#f97316', dot: 'bg-orange-500',
  },
  'acceptable': {
    label: 'Acceptable', icon: CheckCircle2,
    score: 'text-yellow-700 dark:text-yellow-400',
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    ring: '#eab308', dot: 'bg-yellow-500',
  },
  'satisfaisant': {
    label: 'Satisfaisant', icon: CheckCircle2,
    score: 'text-blue-700 dark:text-blue-400',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    ring: '#3b82f6', dot: 'bg-blue-500',
  },
  'excellent': {
    label: 'Excellent', icon: Star,
    score: 'text-green-700 dark:text-green-400',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    ring: '#22c55e', dot: 'bg-green-500',
  },
};

// ─── UNIVERSITIES data ────────────────────────────────────────────────────────
const UNIVERSITIES = [
  { id:'UNI-001', name:"Université d'Antananarivo",       shortName:'UA',   pts:340 },
  { id:'UNI-007', name:'Univ. Catholique de Madagascar',  shortName:'UCM',  pts:315 },
  { id:'UNI-002', name:'Université de Fianarantsoa',      shortName:'UF',   pts:295 },
  { id:'UNI-003', name:'Université de Mahajanga',         shortName:'UM',   pts:270 },
  { id:'UNI-010', name:'ENS Antananarivo',                shortName:'ENS',  pts:260 },
  { id:'UNI-008', name:'IST Antananarivo',                shortName:'IST',  pts:258 },
  { id:'UNI-004', name:'Université de Toamasina',         shortName:'UT',   pts:240 },
  { id:'UNI-009', name:'Université Privée de Madagascar', shortName:'UPM',  pts:185 },
  { id:'UNI-005', name:'Université de Toliara',           shortName:'UTol', pts:168 },
  { id:'UNI-006', name:"Université d'Antsiranana",        shortName:'UAN',  pts:78  },
];
const SORTED_UNIS = [...UNIVERSITIES].sort((a, b) => b.pts - a.pts);

// ─── Inspections data ─────────────────────────────────────────────────────────
const inspectionsData = [
  { id:1, universite:"Université d'Antananarivo",  type:'Audit Annuel',         responsable:'Jean Rakoto',    date:'2026-02-20', statut:'Achevée',  rapports:2 },
  { id:2, universite:'Université de Fianarantsoa', type:'Inspection Surprise',  responsable:'Marie Rasoa',    date:'2026-03-05', statut:'Prévue',   rapports:0 },
  { id:3, universite:'Université de Toamasina',    type:'Contrôle Qualité',     responsable:'Hery Randria',   date:'2026-02-15', statut:'En cours', rapports:1 },
  { id:4, universite:'Université de Mahajanga',    type:'Suivi Pédagogique',    responsable:'Lucie Andria',   date:'2026-01-10', statut:'Achevée',  rapports:3 },
  { id:5, universite:"Université d'Antsiranana",   type:'Audit Financier',      responsable:'Marc Solofo',    date:'2026-04-12', statut:'Prévue',   rapports:0 },
  { id:6, universite:'Université de Toliara',      type:'Inspection Bâtiments', responsable:'Pauline Razafy', date:'2026-02-28', statut:'En cours', rapports:1 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return '–';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
};
const parseIso = (s) => (s ? new Date(s) : null);

const getStatutCfg = (statut, isDark) => {
  switch (statut) {
    case 'Achevée':
      return isDark
        ? { lb:'rgba(22,163,74,0.15)',  lt:'#86efac', lbr:'rgba(22,163,74,0.35)',  dot:'#16a34a' }
        : { lb:'#f0fdf4', lt:'#166534', lbr:'#bbf7d0', dot:'#16a34a' };
    case 'En cours':
      return isDark
        ? { lb:'rgba(202,138,4,0.15)',  lt:'#fde047', lbr:'rgba(202,138,4,0.35)',  dot:'#ca8a04' }
        : { lb:'#fefce8', lt:'#854d0e', lbr:'#fde68a', dot:'#ca8a04' };
    default:
      return isDark
        ? { lb:'rgba(37,99,235,0.15)',  lt:'#93c5fd', lbr:'rgba(37,99,235,0.35)', dot:'#2563eb' }
        : { lb:'#eff6ff', lt:'#1d4ed8', lbr:'#bfdbfe', dot:'#2563eb' };
  }
};

// ─── DateRangePicker ──────────────────────────────────────────────────────────
const DateRangePicker = ({ value, onChange, isDark }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const presets = [
    { l:"Aujourd'hui",      f:() => { const d=new Date().toISOString().slice(0,10); return {from:d,to:d,label:"Aujourd'hui"}; } },
    { l:'7 derniers jours', f:() => { const e=new Date(),s=new Date(); s.setDate(s.getDate()-7); return {from:s.toISOString().slice(0,10),to:e.toISOString().slice(0,10),label:'7 derniers jours'}; } },
    { l:'Janvier 2026',     f:() => ({from:'2026-01-01',to:'2026-01-31',label:'Janvier 2026'}) },
    { l:'Février 2026',     f:() => ({from:'2026-02-01',to:'2026-02-28',label:'Février 2026'}) },
    { l:'Année 2025',       f:() => ({from:'2025-01-01',to:'2025-12-31',label:'Année 2025'}) },
    { l:'Année 2026',       f:() => ({from:'2026-01-01',to:'2026-12-31',label:'Année 2026'}) },
  ];

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const bg      = isDark ? '#1e293b' : '#fff';
  const border  = isDark ? '#334155' : '#e2e8f0';
  const color   = isDark ? '#cbd5e1' : '#475569';
  const dropBg  = isDark ? '#1e293b' : '#fff';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
        style={{ background: bg, border: `1px solid ${border}`, color }}
      >
        <HiOutlineCalendar className="w-3.5 h-3.5 text-indigo-500" />
        {value.label || 'Période'}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
          className={`ml-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <path d="M2 3.5l3 3 3-3" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full right-0 z-[9999] min-w-[200px] p-1.5 rounded-xl"
          style={{ background: dropBg, border: `1px solid ${border}`, boxShadow:'0 12px 40px rgba(0,0,0,0.2)' }}
        >
          {presets.map(p => (
            <button
              key={p.l}
              onClick={() => { onChange(p.f()); setOpen(false); }}
              className="block w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              style={{
                background: value.label === p.l ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: value.label === p.l ? '#818cf8' : isDark ? '#cbd5e1' : '#334155',
              }}
            >
              {p.l}
              {value.label === p.l && <span className="float-right text-indigo-400">✓</span>}
            </button>
          ))}
          <div className="mx-1.5 my-1 pt-1.5" style={{ borderTop: `1px solid ${border}` }}>
            <div className="flex gap-1">
              {['from','to'].map(k => (
                <input key={k} type="date"
                  value={value[k] || ''}
                  onChange={e => onChange({ ...value, [k]: e.target.value, label:'Personnalisé' })}
                  className="flex-1 px-1.5 py-1 rounded-md text-xs border"
                  style={{
                    borderColor: border,
                    background: isDark ? '#0f172a' : '#fff',
                    color: isDark ? '#e2e8f0' : '#334155',
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

// ─── StatCard ─────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, sub, Icon, isDark }) => (
  <div
    className="rounded-xl p-5 transition-all duration-200 cursor-default"
    style={{
      background: isDark ? '#1e293b' : '#ffffff',
      border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.4)' : '0 1px 4px rgba(0,0,0,0.06)',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = isDark
        ? '0 8px 24px rgba(99,102,241,0.2)'
        : '0 8px 24px #c7d2fe';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = '';
      e.currentTarget.style.boxShadow = isDark
        ? '0 1px 4px rgba(0,0,0,0.4)'
        : '0 1px 4px rgba(0,0,0,0.06)';
    }}
  >
    <div className="flex items-start justify-between mb-2.5">
      <div className="text-4xl font-black tracking-tight leading-none text-indigo-500">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: isDark ? '#0f172a' : '#f8fafc' }}>
        <Icon className="w-5 h-5 text-indigo-400"/>
      </div>
    </div>
    <div className="text-xs font-bold mb-1"
      style={{ color: isDark ? '#e2e8f0' : '#334155' }}>{title}</div>
    <div className="text-xs"
      style={{ color: isDark ? '#475569' : '#94a3b8' }}>{sub}</div>
  </div>
);

// ─── Top10Section ─────────────────────────────────────────────────────────────
const Top10Section = ({ isDark }) => {
  const top3 = SORTED_UNIS.slice(0, 3);
  const rest = SORTED_UNIS.slice(3, 10);

  const PODIUM_GRAD = [
    'from-green-600 to-green-700',
    'from-green-500 to-green-600',
    'from-blue-600 to-blue-700',
  ];
  const PODIUM_DESC = [
    'Leader absolu en recherche & innovation',
    'Excellence académique & valeurs humanistes',
    'Innovation technologique & informatique',
  ];

  return (
    <div>
      <h2 className="text-base font-bold mb-3 flex items-center gap-2"
        style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
        🏆 Top 10 Universités
      </h2>

      {/* Top 3 podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        {top3.map((u, i) => (
          <div key={u.id}
            className={`bg-gradient-to-br ${PODIUM_GRAD[i]} rounded-2xl p-5 text-center shadow-lg`}>
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-3xl font-black text-white/90 mb-1">#{i + 1}</div>
            <div className="text-sm font-bold text-white mb-2 leading-tight">{u.name}</div>
            <div className="text-2xl font-black text-white">
              {u.pts}<span className="text-xs text-white/70">/368</span>
            </div>
            <p className="text-[10px] text-white/80 mt-1.5 leading-snug">{PODIUM_DESC[i]}</p>
          </div>
        ))}
      </div>

      {/* #4 – #10 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {rest.map((u, i) => {
          const lk  = getLevelKey(u.pts);
          const cfg = LEVEL_CFG[lk];
          return (
            <div key={u.id}
              className="rounded-xl p-3.5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow cursor-default"
              style={{
                background: isDark ? '#1e293b' : '#ffffff',
                border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              }}
            >
              <div className="text-base font-black mb-1"
                style={{ color: isDark ? '#64748b' : '#94a3b8' }}>#{i + 4}</div>

              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-black border-2 flex-shrink-0"
                style={{ background: cfg.ring + '18', borderColor: cfg.ring, color: cfg.ring }}
              >
                {u.shortName.slice(0, 3)}
              </div>

              <div className="text-[11px] font-semibold leading-tight mb-2 min-h-[30px] flex items-center justify-center"
                style={{ color: isDark ? '#cbd5e1' : '#334155' }}>
                {u.name}
              </div>

              <div className="mt-auto flex flex-col items-center gap-1">
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className={`text-2xl font-black ${cfg.score}`}>{u.pts}</span>
                  <span className="text-[10px]"
                    style={{ color: isDark ? '#64748b' : '#94a3b8' }}>/368</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                  {cfg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div
        className="flex flex-wrap gap-3 p-3 rounded-xl mt-3"
        style={{
          background: isDark ? '#1e293b' : '#ffffff',
          border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        }}
      >
        {Object.entries(LEVEL_CFG).reverse().map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm ${v.dot}`}/>
            <span className="text-xs font-semibold"
              style={{ color: isDark ? '#e2e8f0' : '#334155' }}>{v.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── LineChartSVG ─────────────────────────────────────────────────────────────
const LineChartSVG = ({ isDark }) => {
  const [hov, setHov] = useState(null);
  const pts = [
    {y:'Oct',v:1},{y:'Nov',v:2},{y:'Déc',v:3},
    {y:'Jan',v:2},{y:'Fév',v:4},{y:'Mar',v:3},
  ];
  const gridC  = isDark ? '#1e293b' : '#f1f5f9';
  const labelC = isDark ? '#475569' : '#94a3b8';
  const W=520,H=210,PL=44,PR=20,PT=36,PB=36,cW=W-PL-PR,cH=H-PT-PB,max=6;
  const xP = i => PL + (i / (pts.length - 1)) * cW;
  const yP = v => PT + cH - (v / max) * cH;
  const lp   = pts.map((d,i) => `${i?'L':'M'} ${xP(i)} ${yP(d.v)}`).join(' ');
  const area = `${lp} L ${xP(pts.length-1)} ${PT+cH} L ${PL} ${PT+cH} Z`;

  return (
    <div>
      <p className="text-xs font-black mb-1"
        style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
        Évolution mensuelle des missions
      </p>
      <p className="text-[11px] mb-3"
        style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
        Nombre de missions de descente par mois
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="lgLine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6366f1" stopOpacity=".22"/>
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {[1,2,3,4,5].map(v => (
          <g key={v}>
            <line x1={PL} y1={yP(v)} x2={W-PR} y2={yP(v)}
              stroke={gridC} strokeWidth="1.5"/>
            <text x={PL-7} y={yP(v)+4} textAnchor="end"
              fontSize="9.5" fill={labelC} fontWeight="600">{v}</text>
          </g>
        ))}

        <path d={area} fill="url(#lgLine)"/>
        <path d={lp} fill="none" stroke="#6366f1"
          strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>

        {pts.map((d, i) => (
          <g key={i}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={{ cursor:'pointer' }}
          >
            {hov === i && (
              <>
                <line x1={xP(i)} y1={PT} x2={xP(i)} y2={PT+cH}
                  stroke="#6366f1" strokeWidth="1"
                  strokeDasharray="3 3" opacity=".3"/>
                <rect x={xP(i)-30} y={yP(d.v)-34}
                  width="60" height="22" rx="7" fill="#4f46e5"/>
                <text x={xP(i)} y={yP(d.v)-19}
                  textAnchor="middle" fontSize="11"
                  fontWeight="800" fill="white">
                  {d.v} mission{d.v > 1 ? 's' : ''}
                </text>
              </>
            )}
            <circle
              cx={xP(i)} cy={yP(d.v)}
              r={hov === i ? 7 : 4.5}
              fill={hov === i ? '#6366f1' : isDark ? '#1e293b' : 'white'}
              stroke="#6366f1" strokeWidth="2.5"
            />
            <text x={xP(i)} y={H-4}
              textAnchor="middle" fontSize="10"
              fill={labelC} fontWeight="600">{d.y}</text>
            <text x={xP(i)} y={yP(d.v)-9}
              textAnchor="middle" fontSize="9"
              fill="#6366f1" fontWeight="800"
              opacity={hov === i ? 0 : 1}>{d.v}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// ─── BarChartSVG ──────────────────────────────────────────────────────────────
const BarChartSVG = ({ isDark }) => {
  const [hov, setHov] = useState(null);
  const data = [
    {r:'Antananarivo',v:92,c:'#6366f1',cH:'#4f46e5'},
    {r:'Fianarantsoa',v:80,c:'#06b6d4',cH:'#0891b2'},
    {r:'Mahajanga',   v:73,c:'#10b981',cH:'#059669'},
    {r:'Toamasina',   v:65,c:'#eab308',cH:'#ca8a04'},
    {r:'Toliara',     v:46,c:'#f97316',cH:'#ea580c'},
    {r:'Antsiranana', v:21,c:'#ef4444',cH:'#dc2626'},
  ];
  const gridC  = isDark ? '#1e293b' : '#f1f5f9';
  const labelC = isDark ? '#475569' : '#94a3b8';
  const barBg  = isDark ? '#0f172a' : '#f8fafc';
  const W=520,H=220,PL=42,PR=16,PT=32,PB=58,cW=W-PL-PR,cH=H-PT-PB,bW=cW/data.length;

  return (
    <div>
      <p className="text-xs font-black mb-1"
        style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
        Qualité par région (%)
      </p>
      <p className="text-[11px] mb-3"
        style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
        Score de performance des IES par province
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
        <defs>
          {data.map((d, i) => (
            <linearGradient key={i} id={`bg${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={hov===i ? d.cH : d.c}/>
              <stop offset="100%" stopColor={hov===i ? d.cH : d.c} stopOpacity=".4"/>
            </linearGradient>
          ))}
        </defs>

        {[25,50,75,100].map(v => {
          const y = PT + cH - (v/100)*cH;
          return (
            <g key={v}>
              <line x1={PL} y1={y} x2={W-PR} y2={y}
                stroke={gridC} strokeWidth="1.5"/>
              <text x={PL-5} y={y+4}
                textAnchor="end" fontSize="9" fill={labelC}>{v}%</text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const bH = (d.v/100)*cH, x = PL+i*bW+bW*.15, w = bW*.7, y = PT+cH-bH;
          return (
            <g key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{ cursor:'pointer' }}
            >
              <rect x={x} y={PT} width={w} height={cH} rx="5" fill={barBg}/>
              <rect x={x} y={y} width={w} height={bH} rx="5"
                fill={`url(#bg${i})`}
                opacity={hov !== null && hov !== i ? 0.4 : 1}/>
              <text x={x+w/2} y={y-6}
                textAnchor="middle" fontSize="10" fontWeight="800"
                fill={d.v>=80 ? '#15803d' : d.v>=60 ? '#d97706' : '#dc2626'}>
                {d.v}%
              </text>
              {hov === i && (
                <>
                  <rect x={x+w/2-32} y={y-30}
                    width="64" height="20" rx="5" fill="#0f172a"/>
                  <text x={x+w/2} y={y-16}
                    textAnchor="middle" fontSize="9.5"
                    fontWeight="700" fill="white">
                    {d.v}% — {d.r}
                  </text>
                </>
              )}
              <text x={x+w/2} y={H-PB+16}
                textAnchor="middle" fontSize="8.5"
                fill={labelC} fontWeight="600">{d.r}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ─── DonutChartSVG ────────────────────────────────────────────────────────────
const DonutChartSVG = ({ isDark }) => {
  const [hov, setHov] = useState(null);
  const data = [
    { label:'Conforme',      value:4, color:'#22c55e' },
    { label:'Partiellement', value:2, color:'#eab308' },
    { label:'Non conforme',  value:1, color:'#ef4444' },
  ];
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx=160, cy=130, R=100, r=62;
  let angle = -Math.PI / 2;

  const slices = data.map((d) => {
    const a   = (d.value / total) * 2 * Math.PI;
    const x1  = cx + R * Math.cos(angle),    y1  = cy + R * Math.sin(angle);
    const x2  = cx + R * Math.cos(angle+a),  y2  = cy + R * Math.sin(angle+a);
    const ix1 = cx + r * Math.cos(angle),    iy1 = cy + r * Math.sin(angle);
    const ix2 = cx + r * Math.cos(angle+a),  iy2 = cy + r * Math.sin(angle+a);
    const lg  = a > Math.PI ? 1 : 0;
    const path = `M ${x1} ${y1} A ${R} ${R} 0 ${lg} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${r} ${r} 0 ${lg} 0 ${ix1} ${iy1} Z`;
    const sl  = { ...d, path };
    angle += a;
    return sl;
  });

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center mb-4">
        <p className="text-sm font-black"
          style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
          Conformité des IES
        </p>
        <p className="text-xs mt-0.5"
          style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
          Répartition par niveau de conformité
        </p>
      </div>

      <svg viewBox="0 0 320 260"
        className="w-full max-w-[340px] overflow-visible mx-auto">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color}
            opacity={hov !== null && hov !== i ? 0.45 : 1}
            stroke={isDark ? '#0f172a' : '#fff'} strokeWidth="3"
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              transform: `scale(${hov === i ? 1.05 : 1})`,
              transition: 'all .2s', cursor:'pointer',
            }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
          />
        ))}
        <text x={cx} y={cy-14} textAnchor="middle"
          fontSize="34" fontWeight="900"
          fill={isDark ? '#f1f5f9' : '#1e293b'}>{total}</text>
        <text x={cx} y={cy+10} textAnchor="middle"
          fontSize="12" fontWeight="600" fill="#64748b">IES évalués</text>
      </svg>

      <div className="flex flex-col gap-3 w-full max-w-[300px] mx-auto mt-4">
        {data.map((d, i) => (
          <div key={i}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl border cursor-pointer transition-all"
            style={{
              background:   hov === i ? d.color+'22' : isDark ? '#1e293b' : '#ffffff',
              borderColor:  hov === i ? d.color       : isDark ? '#334155' : '#e2e8f0',
            }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                style={{ background: d.color }}/>
              <span className="text-sm font-semibold"
                style={{ color: isDark ? '#cbd5e1' : '#334155' }}>{d.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black" style={{ color: d.color }}>{d.value}</span>
              <span className="text-xs font-medium"
                style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                ({Math.round((d.value / total) * 100)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── InspectionTable ──────────────────────────────────────────────────────────
const InspectionTable = ({ filteredData, isDark }) => {
  const [page, setPage]             = useState(1);
  const [sortConfig, setSortConfig] = useState({ key:'id', direction:'asc' });
  const PER_PAGE = 5;

  const handleSort = (key) => {
    setSortConfig(p => ({
      key,
      direction: p.key === key && p.direction === 'asc' ? 'desc' : 'asc',
    }));
    setPage(1);
  };

  const sorted = [...filteredData].sort((a, b) => {
    const dir = sortConfig.direction === 'asc' ? 1 : -1;
    if (sortConfig.key === 'id')         return (a.id - b.id) * dir;
    if (sortConfig.key === 'universite') return a.universite.localeCompare(b.universite) * dir;
    if (sortConfig.key === 'date')       return (new Date(a.date) - new Date(b.date)) * dir;
    if (sortConfig.key === 'rapports')   return (a.rapports - b.rapports) * dir;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const paged      = sorted.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const borderC  = isDark ? '#1e293b' : '#f1f5f9';
  const headerBg = isDark ? '#0f172a' : '#f8fafc';
  const headerC  = isDark ? '#64748b' : '#94a3b8';
  const textC    = isDark ? '#e2e8f0' : '#334155';
  const subC     = isDark ? '#475569' : '#94a3b8';
  const rowHover = isDark ? 'rgba(99,102,241,0.06)' : '#f8faff';
  const cardBg   = isDark ? '#1e293b' : '#ffffff';

  const SA = ({ k }) => sortConfig.key === k ? (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" className="inline ml-1">
      {sortConfig.direction === 'asc'
        ? <path d="M12 5v14M8 9l4-4 4 4"/>
        : <path d="M12 19V5M8 15l4 4 4-4"/>}
    </svg>
  ) : null;

  const COLS = [
    {k:'id',          l:'ID'},
    {k:'universite',  l:'Université'},
    {k:'type',        l:'Type'},
    {k:'responsable', l:'Responsable'},
    {k:'date',        l:'Date'},
    {k:'statut',      l:'Statut'},
    {k:'rapports',    l:'Rapports'},
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[700px]">
        <thead>
          <tr style={{ background: headerBg, borderBottom: `2px solid ${borderC}` }}>
            {COLS.map(({ k, l }) => (
              <th key={k}
                className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer select-none transition-colors"
                style={{ color: headerC }}
                onClick={() => handleSort(k)}
                onMouseEnter={e => e.currentTarget.style.color = isDark ? '#e2e8f0' : '#0f172a'}
                onMouseLeave={e => e.currentTarget.style.color = headerC}
              >
                <div className="flex items-center justify-center gap-1">
                  {l}<SA k={k}/>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paged.length > 0 ? paged.map(item => {
            const cfg = getStatutCfg(item.statut, isDark);
            return (
              <tr key={item.id}
                className="transition-colors duration-150 cursor-default"
                style={{ borderBottom: `1px solid ${borderC}` }}
                onMouseEnter={e => e.currentTarget.style.background = rowHover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td className="px-4 py-4 text-center">
                  <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold"
                    style={{
                      background: isDark ? '#0f172a' : '#f1f5f9',
                      color:      isDark ? '#94a3b8' : '#64748b',
                    }}>
                    {item.id}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-left"
                  style={{ color: textC }}>{item.universite}</td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background:  isDark ? '#0f172a' : '#f8fafc',
                      color:       isDark ? '#94a3b8' : '#64748b',
                      border:      `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
                    }}>
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-center"
                  style={{ color: subC }}>{item.responsable}</td>
                <td className="px-4 py-4 text-sm text-center"
                  style={{ color: subC }}>{formatDate(item.date)}</td>
                <td className="px-4 py-4 text-center">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border"
                    style={{ background: cfg.lb, color: cfg.lt, borderColor: cfg.lbr }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full"
                      style={{ background: cfg.dot }}/>
                    {item.statut}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-lg font-bold"
                    style={{
                      color: item.rapports > 0
                        ? '#818cf8'
                        : isDark ? '#334155' : '#cbd5e1',
                    }}>
                    {item.rapports}
                  </span>
                </td>
              </tr>
            );
          }) : (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center"
                style={{ color: subC }}>
                <div className="flex flex-col items-center gap-2 opacity-40">
                  <HiOutlineClipboardDocument className="w-8 h-8"/>
                  <span className="text-sm">Aucune inspection pour cette période</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-3"
        style={{ borderTop: `1px solid ${borderC}` }}>
        <span className="text-xs" style={{ color: subC }}>
          Affichage {Math.min((page-1)*PER_PAGE+1, sorted.length)}–{Math.min(page*PER_PAGE, sorted.length)} sur {sorted.length} inspections
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(p-1, 1))}
            disabled={page === 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30"
            style={{
              border:      `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              background:  cardBg,
              color:       isDark ? '#94a3b8' : '#64748b',
            }}>
            <HiOutlineChevronLeft className="w-4 h-4"/>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className="w-8 h-8 rounded-lg text-xs font-semibold transition"
              style={{
                background:  p === page ? '#6366f1' : cardBg,
                color:       p === page ? '#fff'     : isDark ? '#94a3b8' : '#64748b',
                border:      `1px solid ${p === page ? '#6366f1' : isDark ? '#334155' : '#e2e8f0'}`,
              }}>
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage(p => Math.min(p+1, totalPages))}
            disabled={page === totalPages}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition disabled:opacity-30"
            style={{
              border:      `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              background:  cardBg,
              color:       isDark ? '#94a3b8' : '#64748b',
            }}>
            <HiOutlineChevronRight className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function DashboardSicpView() {
  const { theme }         = useContext(ThemeContext);
  const isDark            = theme === 'dark';
  const [chart, setChart] = useState('line');
  const [dateRange, setDateRange] = useState({
    label:'Année 2026', from:'2026-01-01', to:'2026-12-31',
  });

  const filteredData = inspectionsData.filter(item => {
    const d = parseIso(item.date);
    const s = parseIso(dateRange.from);
    const e = parseIso(dateRange.to);
    if (s && e) return d >= s && d <= e;
    if (s)      return d >= s;
    if (e)      return d <= e;
    return true;
  });

  const kpis = [
    { title:'Inspections prévues',   value: inspectionsData.filter(i=>i.statut==='Prévue').length,  sub:'Missions planifiées',     Icon: HiOutlineClipboardDocument },
    { title:'En cours',              value: inspectionsData.filter(i=>i.statut==='En cours').length, sub:'Missions actives',        Icon: HiOutlineFlag              },
    { title:'Achevées',              value: inspectionsData.filter(i=>i.statut==='Achevée').length,  sub:'Missions terminées',      Icon: HiOutlineCheckCircle       },
    { title:'IES visités',           value: 8,                                                        sub:'Établissements couverts', Icon: HiOutlineBuildingLibrary   },
    { title:'Rapports finalisés',    value: inspectionsData.reduce((s,i)=>s+i.rapports,0),           sub:'Documents produits',      Icon: HiOutlineShieldCheck       },
    { title:'Établissements actifs', value: 6,                                                        sub:'IES répertoriés',         Icon: HiOutlineAcademicCap       },
  ];

  // ── Couleurs dynamiques ──
  const rootBg   = isDark ? '#0f172a' : '#ffffff';
  const cardBg   = isDark ? '#1e293b' : '#ffffff';
  const borderC  = isDark ? '#334155' : '#e2e8f0';
  const titleC   = isDark ? '#f1f5f9' : '#0f172a';
  const subC     = isDark ? '#64748b' : '#94a3b8';
  const dividerC = isDark ? '#1e293b' : '#f1f5f9';

  const cardS = {
    background:   cardBg,
    border:       `1px solid ${borderC}`,
    borderRadius: '16px',
    boxShadow:    isDark ? '0 1px 6px rgba(0,0,0,0.4)' : '0 1px 6px rgba(0,0,0,0.06)',
    overflow:     'hidden',
  };

  const hdrS = {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        '16px 20px',
    borderBottom:   `1px solid ${dividerC}`,
    gap:            '12px',
    flexWrap:       'wrap',
  };

  const CHART_TABS = [
    { k:'line', I: PiChartLineUp,   l:'Courbe'   },
    { k:'bar',  I: PiChartBar,      l:'Barres'   },
    { k:'pie',  I: PiChartPieSlice, l:'Secteurs' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-5 font-sans"
      style={{ background: rootBg }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black tracking-tight m-0"
            style={{ color: titleC }}>
            Tableau de bord des inspections
          </h1>
          <p className="text-xs mt-0.5 m-0" style={{ color: subC }}>
            Service d'Inspection et de Contrôle de Performance · SICP
          </p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} isDark={isDark}/>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k, i) => (
          <StatCard key={i}
            title={k.title} value={k.value}
            sub={k.sub} Icon={k.Icon} isDark={isDark}/>
        ))}
      </div>

      {/* ── Top 10 ── */}
      <Top10Section isDark={isDark}/>

      {/* ── Charts ── */}
      <div style={cardS}>
        <div style={hdrS}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: isDark ? '#0f172a' : '#f8fafc' }}>
              <HiOutlineChartBar className="w-4 h-4 text-purple-500"/>
            </div>
            <div>
              <h2 className="text-[clamp(13px,2vw,15px)] font-black m-0"
                style={{ color: titleC }}>Analyses et performances</h2>
              <p className="text-[11px] m-0" style={{ color: subC }}>{dateRange.label}</p>
            </div>
          </div>

          <div className="flex gap-0.5 p-0.5 rounded-xl"
            style={{
              border:     `1px solid ${borderC}`,
              background: isDark ? '#0f172a' : '#f8fafc',
            }}>
            {CHART_TABS.map(({ k, I, l }) => (
              <button key={k} onClick={() => setChart(k)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] transition-all duration-150"
                style={{
                  background: chart === k ? cardBg : 'transparent',
                  color:      chart === k ? '#6366f1' : subC,
                  fontWeight: chart === k ? 700 : 500,
                  boxShadow:  chart === k ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
                }}>
                <I className="w-3.5 h-3.5"/><span>{l}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          <div className="p-5 rounded-xl min-h-[250px]"
            style={{ background: cardBg, border: `1px solid ${dividerC}` }}>
            {chart === 'line' && <LineChartSVG  isDark={isDark}/>}
            {chart === 'bar'  && <BarChartSVG   isDark={isDark}/>}
            {chart === 'pie'  && <DonutChartSVG isDark={isDark}/>}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={cardS}>
        <div style={hdrS}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: isDark ? '#0f172a' : '#f8fafc' }}>
              <HiOutlineChartPie className="w-4 h-4 text-green-500"/>
            </div>
            <div>
              <h2 className="text-[clamp(13px,2vw,15px)] font-black m-0"
                style={{ color: titleC }}>Récapitulatif des inspections</h2>
              <p className="text-[11px] m-0" style={{ color: subC }}>
                {dateRange.label} · {filteredData.length} inspection{filteredData.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <InspectionTable filteredData={filteredData} isDark={isDark}/>
      </div>

    </div>
  );
}
