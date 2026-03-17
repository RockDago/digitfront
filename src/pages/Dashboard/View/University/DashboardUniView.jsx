import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  useMemo,
} from "react";
import {
  HiOutlineBuildingLibrary,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineExclamationTriangle,
  HiOutlineChartBar,
  HiOutlineChartPie,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCalendar,
  HiOutlineMapPin,
  HiOutlineFlag,
  HiOutlineArrowsPointingOut,
  HiOutlineArrowsPointingIn,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";
import { PiChartLineUp, PiChartBar, PiChartPieSlice } from "react-icons/pi";
import { MdSatelliteAlt, MdMap } from "react-icons/md";

import {
  getMyDemandes,
  getUniversitesGeolocalisations,
  normalizeEnumValue,
} from "../../../../services/accreditation.services";

let ThemeContext;
try {
  ThemeContext = require("../../../../context/ThemeContext").ThemeContext;
} catch {
  ThemeContext = React.createContext({ theme: "light" });
}

const TILE_MODES = {
  standard: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    label: "Standard",
    Icon: MdMap,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    label: "Satellite",
    Icon: MdSatelliteAlt,
  },
};

const MONTHS_FULL = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const MONTHS_SHORT = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

const STATUS_CFG = {
  Habilitée: {
    lb: "#f8fafb",
    lt: "#166534",
    lbr: "#d1fae5",
    db: "rgba(22,163,74,0.07)",
    dt: "#86efac",
    dbr: "rgba(22,163,74,0.18)",
    dot: "#16a34a",
  },
  Accréditée: {
    lb: "#f8fafb",
    lt: "#6d28d9",
    lbr: "#ede9fe",
    db: "rgba(109,40,217,0.07)",
    dt: "#c4b5fd",
    dbr: "rgba(109,40,217,0.18)",
    dot: "#7c3aed",
  },
  "Non habilitée": {
    lb: "#f8fafb",
    lt: "#c2410c",
    lbr: "#fed7aa",
    db: "rgba(234,88,12,0.07)",
    dt: "#fdba74",
    dbr: "rgba(234,88,12,0.18)",
    dot: "#ea580c",
  },
  "Non accréditée": {
    lb: "#f8fafb",
    lt: "#92400e",
    lbr: "#fde68a",
    db: "rgba(202,138,4,0.07)",
    dt: "#fde68a",
    dbr: "rgba(202,138,4,0.18)",
    dot: "#ca8a04",
  },
  Suspendue: {
    lb: "#f8fafb",
    lt: "#b91c1c",
    lbr: "#fecaca",
    db: "rgba(220,38,38,0.07)",
    dt: "#fca5a5",
    dbr: "rgba(220,38,38,0.18)",
    dot: "#dc2626",
  },
};

const getEvaluation = (pts) => {
  if (pts <= 91) {
    return {
      label: "Non conforme",
      color: "#dc2626",
      lb: "#fafafa",
      db: "rgba(220,38,38,0.08)",
      lbr: "#fca5a5",
      dbr: "rgba(220,38,38,0.20)",
      lt: "#b91c1c",
      dt: "#fca5a5",
    };
  }
  if (pts <= 183) {
    return {
      label: "Faible",
      color: "#ea580c",
      lb: "#fafafa",
      db: "rgba(234,88,12,0.08)",
      lbr: "#fed7aa",
      dbr: "rgba(234,88,12,0.20)",
      lt: "#c2410c",
      dt: "#fdba74",
    };
  }
  if (pts <= 256) {
    return {
      label: "Acceptable",
      color: "#ca8a04",
      lb: "#fafafa",
      db: "rgba(202,138,4,0.08)",
      lbr: "#fde68a",
      dbr: "rgba(202,138,4,0.20)",
      lt: "#92400e",
      dt: "#fde68a",
    };
  }
  if (pts <= 311) {
    return {
      label: "Satisfaisant",
      color: "#2563eb",
      lb: "#fafafa",
      db: "rgba(37,99,235,0.08)",
      lbr: "#bfdbfe",
      dbr: "rgba(37,99,235,0.20)",
      lt: "#1d4ed8",
      dt: "#93c5fd",
    };
  }
  return {
    label: "Excellent",
    color: "#16a34a",
    lb: "#fafafa",
    db: "rgba(22,163,74,0.08)",
    lbr: "#bbf7d0",
    dbr: "rgba(22,163,74,0.20)",
    lt: "#15803d",
    dt: "#86efac",
  };
};

const safeDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const fmtDist = (m) =>
  m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
const fmtTime = (s) => {
  if (s < 60) return `${Math.round(s)} sec`;
  if (s < 3600) return `${Math.round(s / 60)} min`;
  const h = Math.floor(s / 3600);
  const r = Math.round((s % 3600) / 60);
  return `${h}h ${r}min`;
};

const getInitials = (name = "") => {
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "ET";
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return `${words[0][0] || ""}${words[1]?.[0] || ""}${words[2]?.[0] || ""}`.toUpperCase();
};

const mapGeolocByName = (items = []) => {
  const map = new Map();

  items.forEach((g) => {
    const keys = [
      g?.etablissement,
      g?.institution,
      g?.nom,
      g?.name,
      g?.mention,
      g?.nom_etablissement,
      g?.universite,
    ]
      .filter(Boolean)
      .map((k) => String(k).trim().toLowerCase());

    keys.forEach((key) => {
      if (!map.has(key)) map.set(key, g);
    });
  });

  return map;
};

const mapDemandeByName = (items = []) => {
  const map = new Map();

  items.forEach((d) => {
    const keys = [
      d?.nom_etablissement,
      d?.etablissement,
      d?.institution,
      d?.universite,
      d?.university,
      d?.nom,
      d?.name,
      d?.mention,
      d?.parcours,
      d?.domaine,
    ]
      .filter(Boolean)
      .map((k) => String(k).trim().toLowerCase());

    keys.forEach((key) => {
      if (!map.has(key)) map.set(key, d);
    });
  });

  return map;
};

const getBestName = (d) => {
  return (
    d?.nom_etablissement ||
    d?.etablissement ||
    d?.institution ||
    d?.universite ||
    d?.university ||
    d?.nom ||
    d?.name ||
    d?.mention ||
    d?.parcours ||
    d?.domaine ||
    `Établissement #${d?.id ?? Math.random().toString(36).slice(2, 8)}`
  );
};

const buildStatusesFromDemande = (d) => {
  const statuses = [];
  const rawStatut = normalizeEnumValue(
    d?.statut_final || d?.statut_demande || d?.statut || d?.status,
  );

  const hasHabilitation = !!(
    d?.habilitation &&
    String(d.habilitation).trim() &&
    String(d.habilitation).trim().toLowerCase() !== "null"
  );

  if (
    rawStatut === "accredite" ||
    rawStatut === "accreditee" ||
    rawStatut === "accreditation_validee"
  ) {
    statuses.push("Habilitée");
    statuses.push("Accréditée");
  } else {
    if (hasHabilitation) {
      statuses.push("Habilitée");
    } else {
      statuses.push("Non habilitée");
    }

    if (
      rawStatut === "rejetee" ||
      rawStatut === "rejete" ||
      rawStatut === "ajourne"
    ) {
      statuses.push("Non accréditée");
    } else if (rawStatut === "suspendue" || rawStatut === "suspendu") {
      statuses.push("Suspendue");
    } else {
      statuses.push("Non accréditée");
    }
  }

  return [...new Set(statuses)];
};

const buildUniversityFromDemande = (d, geoMap, index = 0) => {
  const name = getBestName(d);

  const geo =
    geoMap.get(String(name).trim().toLowerCase()) ||
    geoMap.get(
      String(d?.nom_etablissement || "")
        .trim()
        .toLowerCase(),
    ) ||
    geoMap.get(
      String(d?.etablissement || "")
        .trim()
        .toLowerCase(),
    ) ||
    geoMap.get(
      String(d?.institution || "")
        .trim()
        .toLowerCase(),
    ) ||
    geoMap.get(
      String(d?.universite || "")
        .trim()
        .toLowerCase(),
    );

  const rawScore =
    d?.score_total ??
    d?.score ??
    d?.total_score ??
    d?.note_finale ??
    d?.points_total ??
    d?.pts ??
    0;

  const rawPercent =
    d?.score_pourcentage ?? d?.pourcentage ?? d?.percentage ?? d?.taux ?? 0;

  const score =
    Number(rawScore) > 0
      ? Number(rawScore)
      : Math.round((Number(rawPercent) || 0) * 3.68);

  return {
    id: d?.id ?? d?.uuid ?? d?._id ?? `${name}-${index}`,
    lat: Number(d?.latitude ?? geo?.latitude ?? geo?.lat) || null,
    lng: Number(d?.longitude ?? geo?.longitude ?? geo?.lng) || null,
    name,
    shortName: getInitials(name),
    ville: d?.ville || d?.province || geo?.province || geo?.ville || "-",
    region: d?.region || geo?.region || "-",
    type: d?.type_etablissement || d?.statut_juridique || d?.type || "-",
    founded: null,
    students: Number(d?.nombre_etudiants || d?.students || 0),
    address: d?.adresse || geo?.adresse || "-",
    phone: d?.telephone || d?.phone || "-",
    website: d?.site_web || d?.website || "-",
    domaines:
      [d?.domaine, d?.mention, d?.parcours, d?.filiere]
        .filter(Boolean)
        .join(" • ") || "-",
    pts: Number.isFinite(score) ? score : 0,
    statuses: buildStatusesFromDemande(d),
    photo: null,
    statut:
      normalizeEnumValue(
        d?.statut_final || d?.statut_demande || d?.statut || d?.status,
      ) || "brouillon",
    niveau_conformite: d?.niveau_conformite || "-",
    created_at: d?.created_at || null,
    submitted_at: d?.submitted_at || d?.date_soumission || null,
    updated_at: d?.updated_at || null,
    raw: d,
  };
};

const buildUniversityFromGeo = (g, demande = null, index = 0) => {
  const name =
    g?.nom ||
    g?.name ||
    g?.etablissement ||
    g?.institution ||
    g?.nom_etablissement ||
    g?.universite ||
    getBestName(demande) ||
    `Établissement #${index + 1}`;

  const rawScore =
    demande?.score_total ??
    demande?.score ??
    demande?.total_score ??
    demande?.note_finale ??
    demande?.points_total ??
    demande?.pts ??
    g?.score_total ??
    g?.score ??
    0;

  const rawPercent =
    demande?.score_pourcentage ??
    demande?.pourcentage ??
    demande?.percentage ??
    demande?.taux ??
    g?.score_pourcentage ??
    0;

  const score =
    Number(rawScore) > 0
      ? Number(rawScore)
      : Math.round((Number(rawPercent) || 0) * 3.68);

  return {
    id: g?.id ?? demande?.id ?? `${name}-${index}`,
    lat: Number(g?.latitude ?? g?.lat) || null,
    lng: Number(g?.longitude ?? g?.lng) || null,
    name,
    shortName: getInitials(name),
    ville:
      g?.province || g?.ville || demande?.ville || demande?.province || "-",
    region: g?.region || demande?.region || "-",
    type:
      demande?.type_etablissement ||
      g?.type ||
      g?.statut_juridique ||
      demande?.type ||
      "-",
    founded: null,
    students: Number(demande?.nombre_etudiants || g?.nombre_etudiants || 0),
    address: demande?.adresse || g?.adresse || "-",
    phone: demande?.telephone || g?.telephone || g?.phone || "-",
    website: demande?.site_web || g?.site_web || g?.website || "-",
    domaines:
      [
        demande?.domaine,
        demande?.mention,
        demande?.parcours,
        demande?.filiere,
        g?.domaine,
      ]
        .filter(Boolean)
        .join(" • ") || "-",
    pts: Number.isFinite(score) ? score : 0,
    statuses: demande
      ? buildStatusesFromDemande(demande)
      : ["Non habilitée", "Non accréditée"],
    photo: null,
    statut:
      normalizeEnumValue(
        demande?.statut_final ||
          demande?.statut_demande ||
          demande?.statut ||
          demande?.status,
      ) || "brouillon",
    niveau_conformite:
      demande?.niveau_conformite || g?.niveau_conformite || "-",
    created_at: demande?.created_at || null,
    submitted_at: demande?.submitted_at || demande?.date_soumission || null,
    updated_at: demande?.updated_at || null,
    raw: demande || g,
  };
};

const StatusPill = ({ status, isDark }) => {
  const c = STATUS_CFG[status] || STATUS_CFG["Non accréditée"];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap"
      style={{
        background: isDark ? c.db : c.lb,
        color: isDark ? c.dt : c.lt,
        border: `1px solid ${isDark ? c.dbr : c.lbr}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: c.dot }}
      />
      {status}
    </span>
  );
};

const StatCard = ({ title, value, sub, Icon, accent, trend, isDark }) => {
  const A = {
    blue: {
      lb: "#eef2ff",
      li: "#6366f1",
      lbr: "#c7d2fe",
      lv: "#4f46e5",
      db: "rgba(99,102,241,0.12)",
      di: "#a5b4fc",
      dbr: "rgba(99,102,241,0.22)",
      dv: "#c7d2fe",
    },
    green: {
      lb: "#ecfdf5",
      li: "#16a34a",
      lbr: "#bbf7d0",
      lv: "#15803d",
      db: "rgba(22,163,74,0.12)",
      di: "#86efac",
      dbr: "rgba(22,163,74,0.22)",
      dv: "#bbf7d0",
    },
    purple: {
      lb: "#f5f3ff",
      li: "#7c3aed",
      lbr: "#ddd6fe",
      lv: "#6d28d9",
      db: "rgba(124,58,237,0.12)",
      di: "#c4b5fd",
      dbr: "rgba(124,58,237,0.22)",
      dv: "#ddd6fe",
    },
    orange: {
      lb: "#fff7ed",
      li: "#ea580c",
      lbr: "#fed7aa",
      lv: "#c2410c",
      db: "rgba(234,88,12,0.12)",
      di: "#fdba74",
      dbr: "rgba(234,88,12,0.22)",
      dv: "#fed7aa",
    },
  }[accent];

  const cbg = isDark ? "#1e293b" : "#ffffff";

  return (
    <div
      className="rounded-xl p-5 transition-all duration-200 cursor-default"
      style={{
        background: cbg,
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : A.lbr}`,
        boxShadow: isDark
          ? "0 2px 8px rgba(0,0,0,0.20)"
          : "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-start justify-between mb-2.5">
        <div
          className="text-4xl font-black tracking-tight leading-none"
          style={{ color: isDark ? A.dv : A.lv }}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: isDark ? A.db : A.lb }}
        >
          <Icon className="w-5 h-5" style={{ color: isDark ? A.di : A.li }} />
        </div>
      </div>

      <div
        className="text-xs font-bold mb-1"
        style={{ color: isDark ? "#e2e8f0" : "#334155" }}
      >
        {title}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div
          className="text-xs"
          style={{ color: isDark ? "rgba(255,255,255,0.38)" : "#94a3b8" }}
        >
          {sub}
        </div>
        {trend ? (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full border whitespace-nowrap"
            style={{
              color: isDark ? "#a5b4fc" : "#4f46e5",
              background: isDark ? "rgba(99,102,241,0.15)" : "#eef2ff",
              borderColor: isDark ? "rgba(99,102,241,0.28)" : "#c7d2fe",
            }}
          >
            {trend}
          </span>
        ) : null}
      </div>
    </div>
  );
};

const DateRangePicker = ({ value, onChange, isDark }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const presets = [
    {
      l: "Tous les résultats",
      f: () => ({ from: null, to: null, label: "Tous les résultats" }),
    },
    {
      l: "Aujourd'hui",
      f: () => {
        const d = new Date().toISOString().slice(0, 10);
        return { from: d, to: d, label: "Aujourd'hui" };
      },
    },
    {
      l: "7 derniers jours",
      f: () => {
        const e = new Date();
        const s = new Date();
        s.setDate(s.getDate() - 7);
        return {
          from: s.toISOString().slice(0, 10),
          to: e.toISOString().slice(0, 10),
          label: "7 derniers jours",
        };
      },
    },
    {
      l: "Année 2025",
      f: () => ({ from: "2025-01-01", to: "2025-12-31", label: "Année 2025" }),
    },
    {
      l: "Année 2026",
      f: () => ({ from: "2026-01-01", to: "2026-12-31", label: "Année 2026" }),
    },
  ];

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const bb = isDark ? "rgba(255,255,255,0.06)" : "#fff";
  const bbr = isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0";
  const bc = isDark ? "#e2e8f0" : "#475569";
  const db = isDark ? "#1e2235" : "#fff";
  const dbr2 = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
        style={{ background: bb, border: `1px solid ${bbr}`, color: bc }}
      >
        <HiOutlineCalendar className="w-3.5 h-3.5 text-indigo-500" />
        {value.label || "Période"}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`ml-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2 3.5l3 3 3-3"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full right-0 z-[9999] min-w-[220px] p-1.5 rounded-xl shadow-xl animate-in fade-in duration-150"
          style={{
            background: db,
            border: `1px solid ${dbr2}`,
            boxShadow: isDark
              ? "0 16px 48px rgba(0,0,0,0.5)"
              : "0 12px 40px rgba(0,0,0,0.12)",
          }}
        >
          {presets.map((p) => (
            <button
              key={p.l}
              onClick={() => {
                onChange(p.f());
                setOpen(false);
              }}
              className="block w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              style={{
                background:
                  value.label === p.l ? "rgba(99,102,241,0.12)" : "transparent",
                color:
                  value.label === p.l
                    ? "#6366f1"
                    : isDark
                      ? "#e2e8f0"
                      : "#334155",
              }}
            >
              {p.l}
              {value.label === p.l && (
                <span className="float-right text-indigo-500">✓</span>
              )}
            </button>
          ))}

          <div
            className="mx-1.5 my-1 pt-1.5 border-t"
            style={{ borderColor: dbr2 }}
          >
            <div className="flex gap-1">
              <input
                type="date"
                value={value.from || ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    from: e.target.value,
                    label: "Personnalisé",
                  })
                }
                className="flex-1 px-1.5 py-1 rounded-md text-xs"
                style={{
                  border: `1px solid ${dbr2}`,
                  color: bc,
                  background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
                }}
              />
              <input
                type="date"
                value={value.to || ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    to: e.target.value,
                    label: "Personnalisé",
                  })
                }
                className="flex-1 px-1.5 py-1 rounded-md text-xs"
                style={{
                  border: `1px solid ${dbr2}`,
                  color: bc,
                  background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AccreditationLineChart = ({ isDark, data }) => {
  const [hovered, setHovered] = useState(null);

  const W = 640;
  const H = 260;
  const PL = 48;
  const PR = 20;
  const PT = 30;
  const PB = 42;
  const chartW = W - PL - PR;
  const chartH = H - PT - PB;

  const maxValue = Math.max(
    1,
    ...data.flatMap((d) => [
      d.habilite,
      d.nonHabilite,
      d.accredite,
      d.nonAccredite,
    ]),
  );

  const x = (i) => PL + (i / Math.max(data.length - 1, 1)) * chartW;
  const y = (v) => PT + chartH - (v / maxValue) * chartH;

  const series = [
    { key: "habilite", label: "Habilitée", color: "#16a34a" },
    { key: "nonHabilite", label: "Non habilitée", color: "#ea580c" },
    { key: "accredite", label: "Accréditée", color: "#7c3aed" },
    { key: "nonAccredite", label: "Non accréditée", color: "#ca8a04" },
  ];

  const buildPath = (key) =>
    data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d[key])}`).join(" ");
  const gridColor = isDark ? "rgba(255,255,255,0.07)" : "#e2e8f0";
  const axisColor = isDark ? "rgba(255,255,255,0.38)" : "#64748b";
  const labelColor = isDark ? "#e2e8f0" : "#1e293b";

  return (
    <div>
      <p className="text-xs font-black mb-1" style={{ color: labelColor }}>
        Évolution mensuelle des statuts
      </p>
      <p className="text-[11px] mb-3" style={{ color: axisColor }}>
        Janvier à décembre · nombre des établissements par statut
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {series.map((s) => (
          <span
            key={s.key}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
            style={{
              background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
              color: isDark ? "#e2e8f0" : "#334155",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const val = Math.round(maxValue * ratio);
          const yy = PT + chartH - ratio * chartH;
          return (
            <g key={idx}>
              <line
                x1={PL}
                y1={yy}
                x2={W - PR}
                y2={yy}
                stroke={gridColor}
                strokeWidth="1"
              />
              <text
                x={PL - 8}
                y={yy + 4}
                textAnchor="end"
                fontSize="10"
                fill={axisColor}
                fontWeight="600"
              >
                {val}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => (
          <text
            key={d.month}
            x={x(i)}
            y={H - 10}
            textAnchor="middle"
            fontSize="10"
            fill={axisColor}
            fontWeight="600"
          >
            {d.month}
          </text>
        ))}

        {series.map((s) => (
          <path
            key={s.key}
            d={buildPath(s.key)}
            fill="none"
            stroke={s.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {data.map((d, i) => (
          <g
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="cursor-pointer"
          >
            <line
              x1={x(i)}
              y1={PT}
              x2={x(i)}
              y2={PT + chartH}
              stroke="#6366f1"
              strokeDasharray="4 4"
              opacity={hovered === i ? 0.3 : 0}
            />

            {series.map((s) => (
              <circle
                key={s.key}
                cx={x(i)}
                cy={y(d[s.key])}
                r={hovered === i ? 5 : 4}
                fill={s.color}
                stroke={isDark ? "#0f172a" : "#fff"}
                strokeWidth="2"
              />
            ))}

            {hovered === i && (
              <>
                <rect
                  x={Math.max(10, x(i) - 64)}
                  y={8}
                  width="128"
                  height="68"
                  rx="10"
                  fill={isDark ? "#0f172a" : "#ffffff"}
                  stroke={isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0"}
                />
                <text
                  x={x(i)}
                  y={24}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="800"
                  fill="#6366f1"
                >
                  {d.monthLong}
                </text>
                <text
                  x={x(i)}
                  y={38}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill={labelColor}
                >
                  Hab: {d.habilite} · Non hab: {d.nonHabilite}
                </text>
                <text
                  x={x(i)}
                  y={52}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill={labelColor}
                >
                  Acc: {d.accredite} · Non acc: {d.nonAccredite}
                </text>
                <text
                  x={x(i)}
                  y={65}
                  textAnchor="middle"
                  fontSize="8.5"
                  fill={axisColor}
                >
                  Année {d.year}
                </text>
              </>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

const AccreditationBarChart = ({ isDark, data }) => {
  const groups = data.map((d) => ({
    month: d.month,
    monthLong: d.monthLong,
    values: [
      { label: "Hab", v: d.habilite, c: "#16a34a" },
      { label: "Non hab", v: d.nonHabilite, c: "#ea580c" },
      { label: "Acc", v: d.accredite, c: "#7c3aed" },
      { label: "Non acc", v: d.nonAccredite, c: "#ca8a04" },
    ],
  }));

  const [hov, setHov] = useState(null);
  const W = 700;
  const H = 250;
  const PL = 42;
  const PR = 16;
  const PT = 32;
  const PB = 58;
  const cW = W - PL - PR;
  const cH = H - PT - PB;
  const maxValue = Math.max(
    1,
    ...groups.flatMap((g) => g.values.map((v) => v.v)),
  );
  const groupW = cW / Math.max(groups.length, 1);
  const gc = isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9";
  const tc = isDark ? "rgba(255,255,255,0.20)" : "#94a3b8";
  const lc = isDark ? "rgba(255,255,255,0.42)" : "#64748b";
  const nc = isDark ? "#f1f5f9" : "#1e293b";

  return (
    <div>
      <p className="text-xs font-black mb-1" style={{ color: nc }}>
        Répartition mensuelle par barres
      </p>
      <p className="text-[11px] mb-3" style={{ color: lc }}>
        Vue comparative des statuts par mois
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const val = Math.round(maxValue * ratio);
          const yy = PT + cH - ratio * cH;
          return (
            <g key={idx}>
              <line
                x1={PL}
                y1={yy}
                x2={W - PR}
                y2={yy}
                stroke={gc}
                strokeWidth="1.5"
              />
              <text
                x={PL - 6}
                y={yy + 4}
                textAnchor="end"
                fontSize="9"
                fill={tc}
              >
                {val}
              </text>
            </g>
          );
        })}

        {groups.map((g, i) => {
          const innerGap = 4;
          const barW = Math.max(6, (groupW - 10 - innerGap * 3) / 4);
          const startX = PL + i * groupW + 5;

          return (
            <g key={g.month}>
              {g.values.map((item, j) => {
                const bH = (item.v / maxValue) * cH;
                const x = startX + j * (barW + innerGap);
                const y = PT + cH - bH;
                const active = hov && hov.i === i && hov.j === j;

                return (
                  <g
                    key={item.label}
                    className="cursor-pointer"
                    onMouseEnter={() =>
                      setHov({
                        i,
                        j,
                        month: g.monthLong,
                        label: item.label,
                        value: item.v,
                      })
                    }
                    onMouseLeave={() => setHov(null)}
                  >
                    <rect
                      x={x}
                      y={PT}
                      width={barW}
                      height={cH}
                      rx="4"
                      fill={isDark ? "rgba(255,255,255,0.03)" : "#f8fafc"}
                    />
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={bH}
                      rx="4"
                      fill={item.c}
                      opacity={hov && !active ? 0.35 : 1}
                    />
                    {active && (
                      <>
                        <rect
                          x={x - 20}
                          y={Math.max(6, y - 28)}
                          width="58"
                          height="20"
                          rx="6"
                          fill={isDark ? "#0f172a" : "#111827"}
                        />
                        <text
                          x={x + barW / 2 + 9}
                          y={Math.max(19, y - 15)}
                          textAnchor="middle"
                          fontSize="9.5"
                          fontWeight="700"
                          fill="#fff"
                        >
                          {item.v}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}

              <text
                x={PL + i * groupW + groupW / 2}
                y={H - 16}
                textAnchor="middle"
                fontSize="8.5"
                fill={lc}
                fontWeight="700"
              >
                {g.month}
              </text>
            </g>
          );
        })}
      </svg>

      {hov && (
        <div
          className="mt-2 text-[11px] font-semibold"
          style={{ color: isDark ? "#cbd5e1" : "#475569" }}
        >
          {hov.month} · {hov.label} :{" "}
          <span style={{ color: isDark ? "#f8fafc" : "#111827" }}>
            {hov.value}
          </span>
        </div>
      )}
    </div>
  );
};

const AccreditationDonutChart = ({ isDark, stats }) => {
  const data = [
    { name: "Habilitées", v: stats.hab, c: "#22c55e" },
    { name: "Non habilitées", v: stats.nonHab, c: "#f97316" },
    { name: "Accréditées", v: stats.acc, c: "#a855f7" },
    { name: "Non accréditées", v: stats.nonAcc, c: "#eab308" },
  ];

  const total = data.reduce((s, d) => s + d.v, 0) || 1;
  const [hov, setHov] = useState(null);

  let cum = -90;
  const slices = data.map((d) => {
    const angle = (d.v / total) * 360;
    const s = cum;
    cum += angle;
    return { ...d, s, e: cum, mid: s + angle / 2 };
  });

  const polar = (cx, cy, r, a) => ({
    x: cx + r * Math.cos((a * Math.PI) / 180),
    y: cy + r * Math.sin((a * Math.PI) / 180),
  });

  const arc = (cx, cy, r, s, e) => {
    const p1 = polar(cx, cy, r, s);
    const p2 = polar(cx, cy, r, e);
    return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${e - s > 180 ? 1 : 0} 1 ${p2.x} ${p2.y} Z`;
  };

  const cx = 90;
  const cy = 90;
  const hS = hov !== null ? slices[hov] : null;
  const df = isDark ? "#2a2d4a" : "#ffffff";
  const lc = isDark ? "rgba(255,255,255,0.30)" : "#94a3b8";
  const nc = isDark ? "#e2e8f0" : "#334155";
  const tr = isDark ? "rgba(255,255,255,0.07)" : "#f1f5f9";

  return (
    <div>
      <p
        className="text-xs font-black mb-1"
        style={{ color: isDark ? "#f1f5f9" : "#1e293b" }}
      >
        Répartition des statuts
      </p>
      <p
        className="text-[11px] mb-3"
        style={{ color: isDark ? "rgba(255,255,255,0.35)" : "#94a3b8" }}
      >
        Distribution globale des établissements
      </p>

      <div className="flex gap-5 items-center flex-wrap">
        <svg
          viewBox="0 0 180 180"
          className="w-[170px] h-[170px] flex-shrink-0"
        >
          {slices.map((s, i) => {
            const isH = hov === i;
            const midRad = (s.mid * Math.PI) / 180;
            const off = isH ? 8 : 0;
            return (
              <g
                key={i}
                transform={`translate(${off * Math.cos(midRad)}, ${off * Math.sin(midRad)})`}
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
                className="cursor-pointer transition-transform duration-200"
              >
                <path
                  d={arc(cx, cy, 76, s.s, s.e)}
                  fill={s.c}
                  opacity={hov !== null && !isH ? 0.45 : 1}
                />
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r="46" fill={df} />
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            fontSize="26"
            fontWeight="900"
            fill={hS ? hS.c : isDark ? "#f1f5f9" : "#0f172a"}
          >
            {hS ? hS.v : total}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9.5" fill={lc}>
            {hS ? hS.name : "établissements"}
          </text>
        </svg>

        <div className="flex-1 flex flex-col gap-2.5 min-w-[220px]">
          {slices.map((s, i) => (
            <div
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
            >
              <div className="flex justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ background: s.c }}
                  />
                  <span className="text-xs font-semibold" style={{ color: nc }}>
                    {s.name}
                  </span>
                </div>
                <span className="text-sm font-black" style={{ color: s.c }}>
                  {s.v}
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: tr }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(s.v / total) * 100}%`,
                    background: s.c,
                    opacity: hov === i ? 1 : 0.75,
                  }}
                />
              </div>
            </div>
          ))}
          <div
            className="mt-1 pt-2 border-t text-xs"
            style={{ borderColor: tr, color: lc }}
          >
            Total : <strong style={{ color: nc }}>{total}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

const EvaluationTable = ({
  filteredData,
  page,
  setPage,
  isDark,
  sortConfig,
  setSortConfig,
}) => {
  const PER_PAGE = 10;

  const getSortedData = () => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (sortConfig.key === "rang") {
        return sortConfig.direction === "asc"
          ? a.globalRank - b.globalRank
          : b.globalRank - a.globalRank;
      }
      if (sortConfig.key === "ville") {
        return sortConfig.direction === "asc"
          ? String(a.ville || "").localeCompare(String(b.ville || ""))
          : String(b.ville || "").localeCompare(String(a.ville || ""));
      }
      if (sortConfig.key === "region") {
        return sortConfig.direction === "asc"
          ? String(a.region || "").localeCompare(String(b.region || ""))
          : String(b.region || "").localeCompare(String(a.region || ""));
      }
      if (sortConfig.key === "type") {
        return sortConfig.direction === "asc"
          ? String(a.type || "").localeCompare(String(b.type || ""))
          : String(b.type || "").localeCompare(String(a.type || ""));
      }
      if (sortConfig.key === "score") {
        return sortConfig.direction === "asc" ? a.pts - b.pts : b.pts - a.pts;
      }
      if (sortConfig.key === "nom") {
        return sortConfig.direction === "asc"
          ? String(a.name || "").localeCompare(String(b.name || ""))
          : String(b.name || "").localeCompare(String(a.name || ""));
      }
      return 0;
    });
  };

  const sortedData = getSortedData();
  const totalPages = Math.max(1, Math.ceil(sortedData.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagedData = sortedData.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
    setPage(1);
  };

  const getStatusColor = (score) => {
    if (score <= 91)
      return {
        bg: "#FEE2E2",
        text: "#991B1B",
        border: "#FCA5A5",
        label: "Non conforme",
      };
    if (score <= 183)
      return {
        bg: "#FFF3E0",
        text: "#9A3412",
        border: "#FED7AA",
        label: "Faible",
      };
    if (score <= 256)
      return {
        bg: "#FEF9C3",
        text: "#854D0E",
        border: "#FDE047",
        label: "Acceptable",
      };
    if (score <= 311)
      return {
        bg: "#DBEAFE",
        text: "#1D4ED8",
        border: "#93C5FD",
        label: "Satisfaisant",
      };
    return {
      bg: "#DCFCE7",
      text: "#166534",
      border: "#86EFAC",
      label: "Excellent",
    };
  };

  const typeConfig = {
    Publique: { bg: "#f1f5f9", text: "#334155", border: "#e2e8f0" },
    Privée: { bg: "#f1f5f9", text: "#334155", border: "#e2e8f0" },
    "-": { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0" },
  };

  const statusColors = {
    Habilitée: { bg: "#f1f5f9", text: "#166534" },
    Accréditée: { bg: "#f1f5f9", text: "#5b21b6" },
    "Non habilitée": { bg: "#f1f5f9", text: "#9a3412" },
    "Non accréditée": { bg: "#f1f5f9", text: "#78350f" },
    Suspendue: { bg: "#fef2f2", text: "#991b1b" },
  };

  const thClass = `px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer select-none transition-colors duration-200 border-b ${
    isDark
      ? "text-slate-400 border-white/10"
      : "text-slate-500 border-slate-200"
  }`;

  const tdClass = `px-4 py-4 text-sm border-b ${
    isDark ? "text-slate-200 border-white/5" : "text-slate-700 border-slate-100"
  } text-center`;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[800px]">
        <thead>
          <tr>
            {[
              ["rang", "Rang"],
              ["nom", "Université"],
              ["type", "Type"],
              ["ville", "Province / Région"],
              ["score", "Score"],
            ].map(([key, label]) => (
              <th key={key} className={thClass} onClick={() => handleSort(key)}>
                <div className="flex items-center justify-center gap-1">
                  {label}
                  {sortConfig.key === key && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      {sortConfig.direction === "asc" ? (
                        <path d="M12 5v14M8 9l4-4 4 4" />
                      ) : (
                        <path d="M12 19V5M8 15l4 4 4-4" />
                      )}
                    </svg>
                  )}
                </div>
              </th>
            ))}
            <th className={thClass}>Niveau</th>
            <th className={thClass}>Statuts</th>
          </tr>
        </thead>

        <tbody>
          {pagedData.map((uni) => {
            const rank = uni.globalRank;
            const scoreColor = getStatusColor(uni.pts);
            const typeStyle = typeConfig[uni.type] || typeConfig["-"];

            return (
              <tr
                key={uni.id}
                className="transition-colors duration-200 cursor-default"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark
                    ? "rgba(255,255,255,0.03)"
                    : "#F8FAFC";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <td className={`${tdClass} font-semibold`}>
                  <div
                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold"
                    style={{
                      background:
                        rank <= 3
                          ? scoreColor.bg
                          : isDark
                            ? "rgba(255,255,255,0.05)"
                            : "#F1F5F9",
                      color:
                        rank <= 3
                          ? scoreColor.text
                          : isDark
                            ? "#94A3B8"
                            : "#475569",
                    }}
                  >
                    {rank}
                  </div>
                </td>

                <td className={`${tdClass} text-left font-semibold`}>
                  <div className="text-sm font-bold">{uni.name}</div>
                </td>

                <td className={tdClass}>
                  <span
                    className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold border"
                    style={{
                      background: typeStyle.bg,
                      color: typeStyle.text,
                      borderColor: typeStyle.border,
                    }}
                  >
                    {uni.type}
                  </span>
                </td>

                <td className={tdClass}>
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,0.05)"
                          : "#F8FAFC",
                        color: isDark ? "#E2E8F0" : "#475569",
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {uni.ville}
                    </span>

                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
                      style={{
                        background: isDark
                          ? "rgba(147, 51, 234, 0.10)"
                          : "#faf5ff",
                        color: isDark ? "#d8b4fe" : "#6b21a8",
                        border: `1px solid ${isDark ? "rgba(147,51,234,0.25)" : "#e9d5ff"}`,
                      }}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 10c0 4.4-8 12-8 12s-8-7.6-8-12a8 8 0 1 1 16 0z" />
                      </svg>
                      {uni.region}
                    </span>
                  </div>
                </td>

                <td className={tdClass}>
                  <div className="flex items-baseline gap-0.5 justify-center">
                    <span
                      className="text-lg font-bold"
                      style={{ color: scoreColor.text }}
                    >
                      {uni.pts}
                    </span>
                    <span className="text-xs" style={{ color: "#94A3B8" }}>
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
                      borderColor: scoreColor.border,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: scoreColor.text }}
                    />
                    {scoreColor.label}
                  </span>
                </td>

                <td className={tdClass}>
                  <div className="flex flex-col items-center gap-1">
                    {uni.statuses.map((status, index) => {
                      const colors = statusColors[status] || {
                        bg: "#F1F5F9",
                        text: "#475569",
                      };
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
                          style={{ background: colors.bg, color: colors.text }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              background:
                                status === "Habilitée"
                                  ? "#16a34a"
                                  : status === "Accréditée"
                                    ? "#7c3aed"
                                    : status === "Non habilitée"
                                      ? "#ea580c"
                                      : status === "Non accréditée"
                                        ? "#ca8a04"
                                        : "#dc2626",
                            }}
                          />
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

      <div
        className={`px-5 py-4 border-t flex items-center justify-between flex-wrap gap-3 ${isDark ? "border-white/10" : "border-slate-200"}`}
      >
        <span
          className="text-xs"
          style={{ color: isDark ? "#94A3B8" : "#64748B" }}
        >
          Affichage{" "}
          {Math.min((currentPage - 1) * PER_PAGE + 1, sortedData.length)}–
          {Math.min(currentPage * PER_PAGE, sortedData.length)} sur{" "}
          {sortedData.length} établissements
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              border: isDark
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid #E2E8F0",
              background: isDark ? "rgba(255,255,255,0.05)" : "#FFFFFF",
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            <HiOutlineChevronLeft className="w-4 h-4" />
          </button>

          <span
            className="text-sm font-semibold min-w-[60px] text-center"
            style={{ color: isDark ? "#E2E8F0" : "#334155" }}
          >
            Page {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              border: isDark
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid #E2E8F0",
              background: isDark ? "rgba(255,255,255,0.05)" : "#FFFFFF",
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            <HiOutlineChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const MadagascarMap = ({ isDark, universitiesData }) => {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const instRef = useRef(null);
  const markersRef = useRef([]);
  const routeRef = useRef(null);
  const tileRef = useRef(null);
  const watchIdRef = useRef(null);

  const [tileMode, setTileMode] = useState("standard");
  const [fullscreen, setFullscreen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [popup, setPopup] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const [routeMode, setRouteMode] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const loadLeaflet = () =>
    new Promise((res) => {
      if (window.L) {
        res(window.L);
        return;
      }
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(css);

      const js = document.createElement("script");
      js.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      js.onload = () => res(window.L);
      document.head.appendChild(js);
    });

  const switchTile = useCallback((mode) => {
    if (!instRef.current || !window.L) return;
    const { map } = instRef.current;
    if (tileRef.current) map.removeLayer(tileRef.current);
    tileRef.current = window.L.tileLayer(TILE_MODES[mode].url, {
      attribution: "",
      maxZoom: 19,
    }).addTo(map);
    setTileMode(mode);
  }, []);

  const detectGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError("GPS non disponible sur cet appareil");
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    const opts = { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 };

    const onSuccess = (pos) => {
      const lp = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      };
      setUserPos(lp);
      setGpsLoading(false);
      setGpsError(null);
    };

    const onError = () => {
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        () => {
          setGpsLoading(false);
          setGpsError("Position introuvable. Autorisez la géolocalisation.");
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
      );
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, opts);
    watchIdRef.current = navigator.geolocation.watchPosition(
      onSuccess,
      () => {},
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
      },
    );
  }, []);

  useEffect(() => {
    detectGPS();
    return () => {
      if (watchIdRef.current !== null)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [detectGPS]);

  const placeUserMarker = useCallback((pos) => {
    if (!instRef.current || !window.L) return;
    const { map } = instRef.current;

    if (instRef.current.userMarker) instRef.current.userMarker.remove();
    if (instRef.current.accuracyCircle) instRef.current.accuracyCircle.remove();

    if (pos.accuracy && pos.accuracy < 5000) {
      instRef.current.accuracyCircle = window.L.circle([pos.lat, pos.lng], {
        radius: pos.accuracy,
        color: "#22d3ee",
        fillColor: "#22d3ee",
        fillOpacity: 0.08,
        weight: 1.5,
        opacity: 0.4,
      }).addTo(map);
    }

    const icon = window.L.divIcon({
      html: `<div style="width:18px;height:18px;border-radius:50%;background:#22d3ee;border:3px solid white;box-shadow:0 0 0 4px rgba(34,211,238,0.3),0 2px 8px rgba(0,0,0,0.4)"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      className: "",
    });

    const m = window.L.marker([pos.lat, pos.lng], {
      icon,
      zIndexOffset: 1000,
    }).addTo(map);
    m.bindTooltip(
      `Ma position${pos.accuracy ? ` (±${Math.round(pos.accuracy)}m)` : ""}`,
      {
        permanent: false,
        direction: "top",
        offset: [0, -12],
      },
    );
    instRef.current.userMarker = m;
  }, []);

  useEffect(() => {
    if (userPos) {
      placeUserMarker(userPos);
      if (instRef.current && !instRef.current.centeredOnUser) {
        instRef.current.map.flyTo([userPos.lat, userPos.lng], 12, {
          duration: 1.5,
        });
        instRef.current.centeredOnUser = true;
      }
    }
  }, [userPos, placeUserMarker]);

  const calculateRoute = useCallback(
    (mode) => {
      if (
        !userPos ||
        !selected ||
        !instRef.current ||
        !selected.lat ||
        !selected.lng
      )
        return;
      setRouteLoading(true);

      const map = instRef.current.map;
      if (routeRef.current) {
        map.removeLayer(routeRef.current);
        routeRef.current = null;
      }

      const profile = mode === "walking" ? "foot" : "car";
      const url = `https://router.project-osrm.org/route/v1/${profile}/${userPos.lng},${userPos.lat}/${selected.lng},${selected.lat}?steps=true&geometries=geojson&overview=full&annotations=false`;

      fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error("Network error");
          return r.json();
        })
        .then((data) => {
          if (!data.routes?.[0]) {
            setRouteLoading(false);
            return;
          }

          const route = data.routes[0];
          const L = window.L;
          const coords = route.geometry.coordinates.map((c) => [c[1], c[0]]);
          const color = mode === "walking" ? "#22d3ee" : "#22c55e";

          const glowPoly = L.polyline(coords, {
            color,
            weight: 10,
            opacity: 0.15,
            lineCap: "round",
            lineJoin: "round",
          }).addTo(map);

          const mainPoly = L.polyline(coords, {
            color,
            weight: 4.5,
            opacity: 0.95,
            dashArray: mode === "walking" ? "10 7" : null,
            lineCap: "round",
            lineJoin: "round",
          }).addTo(map);

          const group = L.layerGroup([glowPoly, mainPoly]).addTo(map);
          routeRef.current = group;
          map.fitBounds(mainPoly.getBounds(), { padding: [60, 60] });

          setRouteInfo({
            distance: route.distance,
            duration: route.duration,
          });
          setRouteLoading(false);
          setRouteMode(mode);
        })
        .catch(() => {
          setRouteLoading(false);
        });
    },
    [userPos, selected],
  );

  const clearRoute = useCallback(() => {
    if (routeRef.current && instRef.current) {
      instRef.current.map.removeLayer(routeRef.current);
      routeRef.current = null;
    }
    setRouteInfo(null);
    setRouteMode(null);
  }, []);

  const createPinIcon = (color, sel = false) => {
    const sz = sel ? 44 : 32;
    const h = sel ? 60 : 45;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${h}" viewBox="0 0 32 45">
        <defs>
          <filter id="sh">
            <feDropShadow dx="0" dy="${sel ? 5 : 3}" stdDeviation="${sel ? 4 : 2.5}" flood-color="rgba(0,0,0,0.55)"/>
          </filter>
        </defs>
        <path filter="url(#sh)" d="M16 2C9.4 2 4 7.4 4 14c0 9.6 12 28 12 28s12-18.4 12-28C28 7.4 22.6 2 16 2z"
          fill="${color}" stroke="rgba(255,255,255,0.4)" stroke-width="${sel ? 2 : 1.5}"/>
        <circle cx="16" cy="14" r="${sel ? 7 : 5.5}" fill="rgba(255,255,255,0.93)"/>
        <circle cx="16" cy="14" r="3.5" fill="${color}"/>
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      size: [sz, h],
      anchor: [sz / 2, h],
    };
  };

  const updateIcons = useCallback((sel) => {
    if (!window.L) return;
    markersRef.current.forEach(({ marker, uni }) => {
      const ev = getEvaluation(uni.pts);
      const isSel = sel?.id === uni.id;
      const pin = createPinIcon(ev.color, isSel);
      marker.setIcon(
        window.L.icon({
          iconUrl: pin.url,
          iconSize: pin.size,
          iconAnchor: pin.anchor,
        }),
      );
      marker.setZIndexOffset(isSel ? 500 : 0);
    });
  }, []);

  useEffect(() => {
    if (instRef.current?.map)
      setTimeout(() => instRef.current.map.invalidateSize(), 100);
  }, [fullscreen, sidebarOpen]);

  const mappedUniversities = useMemo(
    () =>
      universitiesData.filter(
        (u) => typeof u.lat === "number" && typeof u.lng === "number",
      ),
    [universitiesData],
  );

  useEffect(() => {
    loadLeaflet().then((L) => {
      if (!mapRef.current) return;

      if (!instRef.current) {
        const map = L.map(mapRef.current, {
          center: [-19.5, 46.8],
          zoom: 5,
          zoomControl: false,
          scrollWheelZoom: false,
        });

        map.on("click", () => map.scrollWheelZoom.enable());
        map.on("mouseout", () => map.scrollWheelZoom.disable());
        L.control.zoom({ position: "bottomright" }).addTo(map);
        map.attributionControl.remove();

        const initMode = "standard";
        tileRef.current = L.tileLayer(TILE_MODES[initMode].url, {
          attribution: "",
          maxZoom: 19,
        }).addTo(map);
        setTileMode(initMode);

        instRef.current = {
          map,
          userMarker: null,
          accuracyCircle: null,
          centeredOnUser: false,
        };
      }

      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];

      const map = instRef.current.map;

      const markers = mappedUniversities.map((u) => {
        const ev = getEvaluation(u.pts);
        const pin = createPinIcon(ev.color, false);

        const marker = L.marker([u.lat, u.lng], {
          icon: L.icon({
            iconUrl: pin.url,
            iconSize: pin.size,
            iconAnchor: pin.anchor,
          }),
        }).addTo(map);

        marker.on("click", () => {
          if (map.getZoom() < 10)
            map.flyTo([u.lat, u.lng], 13, {
              duration: 1.4,
              easeLinearity: 0.3,
            });
          setSelected(u);

          setTimeout(() => {
            if (!instRef.current) return;
            const pt = instRef.current.map.latLngToContainerPoint([
              u.lat,
              u.lng,
            ]);
            setPopup({ uni: u, x: pt.x, y: pt.y });
          }, 120);
        });

        return { marker, uni: u };
      });

      markersRef.current = markers;

      if (mappedUniversities.length) {
        const bounds = L.latLngBounds(
          mappedUniversities.map((u) => [u.lat, u.lng]),
        );
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    });
  }, [mappedUniversities]);

  useEffect(() => {
    updateIcons(selected);
  }, [selected, updateIcons]);

  const listData = useMemo(() => {
    const q = search.toLowerCase();
    return universitiesData.filter((u) => {
      const okSearch =
        !q ||
        String(u.name || "")
          .toLowerCase()
          .includes(q) ||
        String(u.ville || "")
          .toLowerCase()
          .includes(q) ||
        String(u.region || "")
          .toLowerCase()
          .includes(q);

      const okFilter = filter === "all" ? true : u.statuses.includes(filter);
      return okSearch && okFilter;
    });
  }, [universitiesData, search, filter]);

  const sb = isDark
    ? {
        bg: "#1e2235",
        br: "rgba(255,255,255,0.08)",
        tx: "#f1f5f9",
        su: "rgba(255,255,255,0.4)",
        ib: "rgba(255,255,255,0.06)",
        ibr: "rgba(255,255,255,0.1)",
        rh: "rgba(255,255,255,0.05)",
      }
    : {
        bg: "#ffffff",
        br: "#e2e8f0",
        tx: "#0f172a",
        su: "#64748b",
        ib: "#f8fafc",
        ibr: "#e2e8f0",
        rh: "#f1f5f9",
      };

  const mc = isDark
    ? {
        bg: "rgba(20,22,40,0.92)",
        br: "rgba(255,255,255,0.12)",
        tx: "rgba(255,255,255,0.75)",
        abg: "rgba(99,102,241,0.3)",
        atx: "#a5b4fc",
        abr: "rgba(99,102,241,0.55)",
      }
    : {
        bg: "rgba(255,255,255,0.95)",
        br: "rgba(0,0,0,0.12)",
        tx: "#3c4043",
        abg: "#1a73e8",
        atx: "#fff",
        abr: "#1a73e8",
      };

  const pbg = isDark ? "#1a1e35" : "#ffffff";
  const pbr = isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0";
  const ptx = isDark ? "#f1f5f9" : "#0f172a";
  const psu = isDark ? "rgba(255,255,255,0.4)" : "#64748b";
  const psec = isDark ? "rgba(255,255,255,0.04)" : "#f8fafc";
  const psecbr = isDark ? "rgba(255,255,255,0.07)" : "#e2e8f0";
  const ev = popup?.uni ? getEvaluation(popup.uni.pts) : null;
  const evbg = ev ? (isDark ? ev.db : ev.lb) : psec;
  const evbr = ev ? (isDark ? ev.dbr : ev.lbr) : psecbr;

  return (
    <div
      ref={containerRef}
      className={`flex w-full overflow-hidden transition-all duration-300 ${
        fullscreen ? "fixed inset-0 z-[9000] h-screen" : "relative h-full"
      }`}
    >
      {sidebarOpen && !isMobile && (
        <div
          className="flex-shrink-0 flex flex-col overflow-hidden transition-all duration-300"
          style={{
            width: 280,
            background: sb.bg,
            borderRight: `1px solid ${sb.br}`,
          }}
        >
          <div className="p-3 pb-2.5 border-b" style={{ borderColor: sb.br }}>
            <div className="relative mb-2">
              <svg
                className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-35"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isDark ? "white" : "#334155"}
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une université..."
                className="w-full py-2 pl-8 pr-8 rounded-lg text-xs font-medium outline-none transition-colors"
                style={{
                  background: sb.ib,
                  border: `1px solid ${sb.ibr}`,
                  color: sb.tx,
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: sb.su }}
                >
                  ×
                </button>
              )}
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
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

          <div
            className="px-3 pt-1.5 pb-0.5 text-xs font-bold uppercase tracking-wider"
            style={{ color: sb.su }}
          >
            {listData.length} résultat{listData.length !== 1 ? "s" : ""}
          </div>

          <div className="flex-1 overflow-y-auto px-1.5 pb-1.5 space-y-0.5">
            {listData.map((u) => {
              const evv = getEvaluation(u.pts);
              const isSel = selected?.id === u.id;
              const rank = universitiesData.findIndex((x) => x.id === u.id) + 1;

              return (
                <div
                  key={u.id}
                  onClick={() => {
                    setSelected(u);
                    if (instRef.current && u.lat && u.lng) {
                      instRef.current.map.flyTo([u.lat, u.lng], 13, {
                        duration: 1.2,
                      });
                      setTimeout(() => {
                        if (!instRef.current) return;
                        const pt = instRef.current.map.latLngToContainerPoint([
                          u.lat,
                          u.lng,
                        ]);
                        setPopup({ uni: u, x: pt.x, y: pt.y });
                      }, 350);
                    }
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-150 mb-0.5 ${
                    isSel ? "bg-indigo-500/20 border border-indigo-500/35" : ""
                  }`}
                  style={!isSel ? { background: "transparent" } : undefined}
                >
                  <div
                    className="w-5.5 h-5.5 rounded-md flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{
                      background:
                        rank <= 3
                          ? evv.color
                          : isDark
                            ? "rgba(255,255,255,0.08)"
                            : "#f1f5f9",
                      color: rank <= 3 ? "#fff" : sb.su,
                      width: 22,
                      height: 22,
                    }}
                  >
                    {rank}
                  </div>

                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 tracking-tight border"
                    style={{
                      background: isDark ? evv.db : evv.lb,
                      borderColor: isDark ? evv.dbr : evv.lbr,
                      color: evv.color,
                    }}
                  >
                    {u.shortName}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs font-bold truncate"
                      style={{ color: isSel ? "#a5b4fc" : sb.tx }}
                    >
                      {u.name}
                    </div>
                    <div
                      className="text-[10px] mt-0.5"
                      style={{ color: sb.su }}
                    >
                      {u.ville} · {u.type}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div
                      className="text-sm font-black"
                      style={{ color: evv.color }}
                    >
                      {u.pts}
                    </div>
                    <div className="text-[9px]" style={{ color: sb.su }}>
                      /368
                    </div>
                  </div>
                </div>
              );
            })}

            {listData.length === 0 && (
              <div
                className="text-center py-9 px-3 text-xs"
                style={{ color: sb.su }}
              >
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
          {Object.entries(TILE_MODES).map(([key, item]) => {
            const Icon = item.Icon;
            return (
              <button
                key={key}
                onClick={() => switchTile(key)}
                title={item.label}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all duration-150"
                style={{
                  borderColor: tileMode === key ? mc.abr : "transparent",
                  background: tileMode === key ? mc.abg : "transparent",
                  color: tileMode === key ? mc.atx : mc.tx,
                  borderWidth: 1,
                  borderStyle: "solid",
                }}
              >
                <Icon size={13} />
                {!isMobile && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        <div className="absolute top-3 right-3 z-[999] flex flex-col gap-1.5">
          <button
            onClick={() => setFullscreen((f) => !f)}
            title={fullscreen ? "Réduire" : "Agrandir"}
            className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md transition-all"
            style={{
              background: mc.bg,
              border: `1px solid ${mc.br}`,
              color: mc.tx,
            }}
          >
            {fullscreen ? (
              <HiOutlineArrowsPointingIn className="w-4 h-4" />
            ) : (
              <HiOutlineArrowsPointingOut className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={detectGPS}
            title="Ma position"
            className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md transition-all"
            style={{
              background: userPos ? "rgba(34,211,238,0.15)" : mc.bg,
              border: `1px solid ${
                userPos
                  ? "rgba(34,211,238,0.5)"
                  : gpsError
                    ? "rgba(239,68,68,0.5)"
                    : mc.br
              }`,
              color: userPos ? "#22d3ee" : gpsError ? "#ef4444" : mc.tx,
            }}
          >
            {gpsLoading ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animate-spin"
              >
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
              </svg>
            )}
          </button>
        </div>

        {popup && ev && (
          <div
            className={`absolute z-[1000] rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-y-auto ${
              isMobile ? "inset-x-2 bottom-2 max-h-[65vh]" : ""
            }`}
            style={
              !isMobile
                ? {
                    left: Math.min(
                      popup.x || 16,
                      (mapRef.current?.offsetWidth || 800) - 305,
                    ),
                    top: Math.max((popup.y || 150) - 150, 8),
                    width: 290,
                    maxHeight: "calc(100% - 24px)",
                  }
                : undefined
            }
          >
            <div
              className="rounded-xl border overflow-hidden"
              style={{ background: pbg, borderColor: pbr }}
            >
              <div
                className="px-3 py-2 border-b"
                style={{ borderColor: psecbr }}
              >
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
                    <div
                      className="text-xs font-black truncate"
                      style={{ color: ptx }}
                    >
                      {popup.uni.name}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: psu }}>
                      {popup.uni.ville} · {popup.uni.type}
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
                        {popup.uni.pts} pts · {ev.label}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setPopup(null);
                      setSelected(null);
                    }}
                    className="w-5.5 h-5.5 rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                    style={{
                      background: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9",
                      color: psu,
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>

              <div
                className="px-3 py-2 border-b"
                style={{ borderColor: psecbr }}
              >
                <div
                  className="text-[9px] font-bold uppercase tracking-wider mb-0.5"
                  style={{ color: psu }}
                >
                  Domaines
                </div>
                <div
                  className="text-[10px] leading-5"
                  style={{ color: isDark ? "rgba(255,255,255,0.56)" : psu }}
                >
                  {popup.uni.domaines}
                </div>
              </div>

              <div
                className="px-3 py-1.5 border-b flex gap-1 flex-wrap"
                style={{ borderColor: psecbr }}
              >
                {popup.uni.statuses.map((status) => (
                  <StatusPill key={status} status={status} isDark={isDark} />
                ))}
              </div>

              <div
                className="px-3 py-1.5 border-b space-y-1"
                style={{ borderColor: psecbr }}
              >
                {[
                  { Icon: HiOutlineMapPin, v: popup.uni.address },
                  { Icon: HiOutlineGlobeAlt, v: popup.uni.website },
                ]
                  .filter((x) => x.v && x.v !== "-")
                  .map(({ Icon, v }, idx) => (
                    <div
                      key={idx}
                      className="flex gap-1 text-[10px]"
                      style={{ color: psu }}
                    >
                      <span className="flex-shrink-0 mt-0.5 text-indigo-400">
                        <Icon className="w-2.5 h-2.5" />
                      </span>
                      <span className="leading-4 break-all">{v}</span>
                    </div>
                  ))}
              </div>

              <div className="px-3 py-2">
                <div
                  className="text-[10px] font-bold mb-1.5 flex items-center gap-1"
                  style={{ color: ptx }}
                >
                  <HiOutlineFlag className="w-2.5 h-2.5 text-indigo-400" />
                  Itinéraire
                </div>

                {!userPos ? (
                  <button
                    onClick={detectGPS}
                    className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border-dashed"
                    style={{
                      border: `1px dashed ${isDark ? "rgba(255,255,255,0.2)" : psecbr}`,
                      color: psu,
                    }}
                  >
                    Activer la localisation GPS
                  </button>
                ) : (
                  <>
                    <div className="flex gap-1 mb-1.5">
                      <button
                        onClick={() => calculateRoute("walking")}
                        className="flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                        style={{
                          border: `1px solid ${routeMode === "walking" ? "#22d3ee" : "rgba(34,211,238,0.3)"}`,
                          color: routeMode === "walking" ? "#22d3ee" : psu,
                          background:
                            routeMode === "walking"
                              ? "rgba(34,211,238,0.12)"
                              : "transparent",
                        }}
                      >
                        À pied
                      </button>

                      <button
                        onClick={() => calculateRoute("driving")}
                        className="flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                        style={{
                          border: `1px solid ${routeMode === "driving" ? "#22c55e" : "rgba(34,197,94,0.3)"}`,
                          color: routeMode === "driving" ? "#22c55e" : psu,
                          background:
                            routeMode === "driving"
                              ? "rgba(34,197,94,0.12)"
                              : "transparent",
                        }}
                      >
                        Voiture
                      </button>

                      {routeMode && (
                        <button
                          onClick={clearRoute}
                          title="Effacer l'itinéraire"
                          className="w-8 rounded-lg flex items-center justify-center"
                          style={{ border: `1px solid ${psecbr}`, color: psu }}
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {routeLoading && (
                      <div
                        className="flex items-center gap-1.5 text-[10px] px-2 py-1.5 rounded-lg border"
                        style={{
                          background: psec,
                          borderColor: psecbr,
                          color: psu,
                        }}
                      >
                        Calcul de l'itinéraire...
                      </div>
                    )}

                    {routeInfo && !routeLoading && (
                      <div
                        className="p-2 rounded-lg border flex gap-3.5 items-center"
                        style={{ background: psec, borderColor: psecbr }}
                      >
                        <div>
                          <div
                            className="text-sm font-black"
                            style={{
                              color:
                                routeMode === "walking" ? "#22d3ee" : "#22c55e",
                            }}
                          >
                            {fmtTime(routeInfo.duration)}
                          </div>
                          <div
                            className="text-[9px] mt-0.5"
                            style={{ color: psu }}
                          >
                            Durée estimée
                          </div>
                        </div>

                        <div
                          className="w-px h-7"
                          style={{ background: psecbr }}
                        />

                        <div>
                          <div
                            className="text-sm font-bold"
                            style={{ color: ptx }}
                          >
                            {fmtDist(routeInfo.distance)}
                          </div>
                          <div
                            className="text-[9px] mt-0.5"
                            style={{ color: psu }}
                          >
                            Distance
                          </div>
                        </div>
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

export default function DashboardUniView() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const bg = isDark ? "#0f172a" : "#ffffff";
  const cardBg = isDark ? "#1e293b" : "#ffffff";
  const cardBr = isDark ? "rgba(255,255,255,0.10)" : "#e2e8f0";
  const hdrBr = isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9";
  const hC = isDark ? "#f1f5f9" : "#0f172a";
  const sC = isDark ? "rgba(255,255,255,0.5)" : "#64748b";

  const [page, setPage] = useState(1);
  const [tableFilter, setTableFilter] = useState("all");
  const [chart, setChart] = useState("line");
  const [sortConfig, setSortConfig] = useState({
    key: "score",
    direction: "desc",
  });
  const [dateRange, setDateRange] = useState({
    label: "Tous les résultats",
    from: null,
    to: null,
  });

  const [demandes, setDemandes] = useState([]);
  const [geolocs, setGeolocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [demandesData, geolocsData] = await Promise.all([
          getMyDemandes(),
          getUniversitesGeolocalisations(true),
        ]);

        if (cancelled) return;

        setDemandes(Array.isArray(demandesData) ? demandesData : []);
        setGeolocs(Array.isArray(geolocsData) ? geolocsData : []);
      } catch (err) {
        if (cancelled) return;
        console.error("Erreur chargement dashboard universités :", err);
        setError(err?.message || "Erreur de chargement des données");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const geoMap = useMemo(() => mapGeolocByName(geolocs), [geolocs]);
  const demandeMap = useMemo(() => mapDemandeByName(demandes), [demandes]);

  const universitiesData = useMemo(() => {
    const fromGeolocs = (geolocs || []).map((g, index) => {
      const keys = [
        g?.nom,
        g?.name,
        g?.etablissement,
        g?.institution,
        g?.nom_etablissement,
        g?.universite,
        g?.mention,
      ]
        .filter(Boolean)
        .map((v) => String(v).trim().toLowerCase());

      const demande =
        keys.map((key) => demandeMap.get(key)).find(Boolean) || null;

      return buildUniversityFromGeo(g, demande, index);
    });

    const knownIds = new Set(fromGeolocs.map((u) => String(u.id)));
    const knownNames = new Set(
      fromGeolocs.map((u) => String(u.name).trim().toLowerCase()),
    );

    const demandesOnly = (demandes || [])
      .map((d, index) => {
        const uni = buildUniversityFromDemande(d, geoMap, index);
        const keyName = String(uni.name).trim().toLowerCase();

        if (knownIds.has(String(uni.id)) || knownNames.has(keyName))
          return null;
        return uni;
      })
      .filter(Boolean);

    return [...fromGeolocs, ...demandesOnly].sort((a, b) => b.pts - a.pts);
  }, [geolocs, demandes, geoMap, demandeMap]);

  const stats = useMemo(() => {
    const source = universitiesData;

    return {
      total: source.length,
      hab: source.filter((u) => u.statuses.includes("Habilitée")).length,
      nonHab: source.filter((u) => u.statuses.includes("Non habilitée")).length,
      acc: source.filter((u) => u.statuses.includes("Accréditée")).length,
      nonAcc: source.filter((u) => u.statuses.includes("Non accréditée"))
        .length,
      pub: source.filter(
        (u) => String(u.type || "").toLowerCase() === "publique",
      ).length,
      priv: source.filter((u) => {
        const t = String(u.type || "").toLowerCase();
        return t === "privée" || t === "privee";
      }).length,
    };
  }, [universitiesData]);

  const selectedYear = useMemo(() => {
    const from = safeDate(dateRange.from);
    return from?.getFullYear() || new Date().getFullYear();
  }, [dateRange]);

  const monthlySeries = useMemo(() => {
    const base = MONTHS_SHORT.map((m, index) => ({
      month: m,
      monthLong: MONTHS_FULL[index],
      monthIndex: index,
      year: selectedYear,
      habilite: 0,
      nonHabilite: 0,
      accredite: 0,
      nonAccredite: 0,
    }));

    universitiesData.forEach((u) => {
      const rawDate = u.submitted_at || u.updated_at || u.created_at;
      const dt = safeDate(rawDate);
      if (!dt) return;
      if (dt.getFullYear() !== selectedYear) return;

      const month = dt.getMonth();
      if (u.statuses.includes("Habilitée")) base[month].habilite += 1;
      if (u.statuses.includes("Non habilitée")) base[month].nonHabilite += 1;
      if (u.statuses.includes("Accréditée")) base[month].accredite += 1;
      if (u.statuses.includes("Non accréditée")) base[month].nonAccredite += 1;
    });

    return base;
  }, [universitiesData, selectedYear]);

  const tableData = useMemo(() => {
    return [...universitiesData].map((u, index) => ({
      ...u,
      globalRank: index + 1,
    }));
  }, [universitiesData]);

  const filteredData = useMemo(() => {
    const from = safeDate(dateRange.from);
    const to = safeDate(dateRange.to);

    return tableData.filter((u) => {
      const okStatus =
        tableFilter === "all" ? true : u.statuses.includes(tableFilter);

      const d = safeDate(u.submitted_at || u.updated_at || u.created_at);
      const okDate =
        !from || !to || !d
          ? true
          : d >= new Date(new Date(from).setHours(0, 0, 0, 0)) &&
            d <= new Date(new Date(to).setHours(23, 59, 59, 999));

      return okStatus && okDate;
    });
  }, [tableData, tableFilter, dateRange]);

  useEffect(() => {
    setPage(1);
  }, [tableFilter, dateRange]);

  useEffect(() => {
    console.log("demandes backend =", demandes);
    console.log("universitiesData =", universitiesData);
  }, [demandes, universitiesData]);

  const S = {
    card: {
      background: cardBg,
      border: `1px solid ${cardBr}`,
      borderRadius: 16,
      boxShadow: isDark
        ? "0 4px 20px rgba(0,0,0,0.3)"
        : "0 1px 4px rgba(0,0,0,0.04)",
      overflow: "hidden",
      marginBottom: 20,
      transition: "background .3s, border-color .3s",
    },
    hdr: {
      padding: "16px 20px",
      borderBottom: `1px solid ${hdrBr}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 10,
    },
    ib: (c) => ({
      width: 38,
      height: 38,
      borderRadius: 10,
      background: c,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }),
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        background: bg,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <style>{`
        .leaflet-control-attribution { display:none !important; }
        .leaflet-control-zoom { border:none !important; border-radius:10px !important; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.4) !important; }
        .leaflet-control-zoom a { background:rgba(15,15,35,0.9) !important; backdrop-filter:blur(8px); color:rgba(255,255,255,0.75) !important; border:none !important; width:38px !important; height:38px !important; line-height:38px !important; font-size:20px !important; border-bottom:1px solid rgba(255,255,255,0.08) !important; display:flex !important; align-items:center !important; justify-content:center !important; }
        .leaflet-control-zoom a:hover { background:rgba(40,40,70,0.98) !important; color:white !important; }
        .leaflet-control-zoom-out { border-bottom:none !important; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(128,128,128,0.22); border-radius:999px; }
        @media (max-width:768px) {
          .dash-stats { grid-template-columns:1fr 1fr !important; }
          .dash-header { flex-direction:column !important; align-items:flex-start !important; }
        }
        @media (max-width:480px) {
          .dash-stats { grid-template-columns:1fr !important; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="dash-header flex justify-between items-start flex-wrap gap-3 mb-6">
          <div>
            <h1
              className="text-[clamp(20px,4vw,28px)] font-black tracking-tight m-0"
              style={{ color: hC }}
            >
              Tableau de bord
            </h1>
            <p className="text-xs font-medium mt-1" style={{ color: sC }}>
              Résultats des auto-évaluations · Classement des établissements
            </p>
          </div>

          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            isDark={isDark}
          />
        </div>

        <div className="dash-stats grid grid-cols-4 gap-3 mb-5">
          <StatCard
            title="Total établissements"
            value={stats.total}
            sub={`${stats.pub} publiques · ${stats.priv} privées`}
            Icon={HiOutlineBuildingLibrary}
            accent="blue"
            isDark={isDark}
          />
          <StatCard
            title="Habilitées"
            value={stats.hab}
            sub={`${stats.total ? Math.round((stats.hab / stats.total) * 100) : 0}% du total`}
            Icon={HiOutlineCheckCircle}
            accent="green"
            isDark={isDark}
            trend={`${stats.nonHab} non habilitées`}
          />
          <StatCard
            title="Accréditées"
            value={stats.acc}
            sub={`${stats.nonAcc} non accréditées`}
            Icon={HiOutlineShieldCheck}
            accent="purple"
            isDark={isDark}
          />
          <StatCard
            title="Non habilitées"
            value={stats.nonHab}
            sub="Selon les demandes chargées"
            Icon={HiOutlineExclamationTriangle}
            accent="orange"
            isDark={isDark}
          />
        </div>

        {error && (
          <div
            className="mb-5 px-4 py-3 rounded-xl text-sm font-semibold"
            style={{
              background: isDark ? "rgba(239,68,68,0.12)" : "#fef2f2",
              border: `1px solid ${isDark ? "rgba(239,68,68,0.28)" : "#fecaca"}`,
              color: isDark ? "#fca5a5" : "#b91c1c",
            }}
          >
            {error}
          </div>
        )}

        <div style={S.card} className="overflow-visible">
          <div style={S.hdr}>
            <div className="flex items-center gap-2.5">
              <div style={S.ib(isDark ? "rgba(99,102,241,0.10)" : "#eef2ff")}>
                <HiOutlineMapPin className="w-4.5 h-4.5 text-blue-500" />
              </div>
              <div>
                <h2
                  className="text-[clamp(13px,2vw,15px)] font-black m-0"
                  style={{ color: hC }}
                >
                  Géolocalisation des universités
                </h2>
                <p className="text-[11px] m-0" style={{ color: sC }}>
                  Liste classée par performance · Carte interactive · GPS ·
                  Itinéraire
                </p>
              </div>
            </div>
          </div>

          <div className="h-[clamp(420px,60vh,620px)] rounded-b-xl overflow-hidden">
            <MadagascarMap
              isDark={isDark}
              universitiesData={universitiesData}
            />
          </div>
        </div>

        <div style={S.card}>
          <div style={S.hdr}>
            <div className="flex items-center gap-2.5">
              <div style={S.ib(isDark ? "rgba(99,102,241,0.10)" : "#eef2ff")}>
                <HiOutlineChartBar className="w-4.5 h-4.5 text-purple-500" />
              </div>
              <div>
                <h2
                  className="text-[clamp(13px,2vw,15px)] font-black m-0"
                  style={{ color: hC }}
                >
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
                background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
                borderColor: cardBr,
              }}
            >
              {[
                { k: "line", I: PiChartLineUp, l: "Courbe" },
                { k: "bar", I: PiChartBar, l: "Barres" },
                { k: "pie", I: PiChartPieSlice, l: "Secteurs" },
              ].map(({ k, I, l }) => (
                <button
                  key={k}
                  onClick={() => setChart(k)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-150"
                  style={{
                    background:
                      chart === k
                        ? isDark
                          ? "rgba(99,102,241,0.2)"
                          : "#fff"
                        : "transparent",
                    color: chart === k ? "#6366f1" : sC,
                    fontWeight: chart === k ? 700 : 500,
                    boxShadow:
                      chart === k ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  <I className="w-3.5 h-3.5" />
                  <span>{l}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5">
            <div
              className="p-5 rounded-xl min-h-[250px]"
              style={{
                background: isDark ? "rgba(255,255,255,0.025)" : "#fafbfc",
                border: `1px solid ${hdrBr}`,
              }}
            >
              {loading ? (
                <div
                  className="py-16 text-center text-sm font-semibold"
                  style={{ color: sC }}
                >
                  Chargement des statistiques...
                </div>
              ) : chart === "line" ? (
                <AccreditationLineChart isDark={isDark} data={monthlySeries} />
              ) : chart === "bar" ? (
                <AccreditationBarChart isDark={isDark} data={monthlySeries} />
              ) : (
                <AccreditationDonutChart isDark={isDark} stats={stats} />
              )}
            </div>
          </div>
        </div>

        <div style={S.card}>
          <div style={S.hdr}>
            <div className="flex items-center gap-2.5">
              <div style={S.ib(isDark ? "rgba(34,197,94,0.12)" : "#f0fdf4")}>
                <HiOutlineChartPie className="w-4.5 h-4.5 text-green-500" />
              </div>
              <div>
                <h2
                  className="text-[clamp(13px,2vw,15px)] font-black m-0"
                  style={{ color: hC }}
                >
                  Résultats des auto-évaluations
                </h2>
                <p className="text-[11px] m-0" style={{ color: sC }}>
                  Classement complet · {filteredData.length} établissements
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={tableFilter}
                onChange={(e) => {
                  setTableFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border"
                style={{
                  borderColor: cardBr,
                  color: isDark ? "#e2e8f0" : "#475569",
                  background: isDark ? "#1e293b" : "#fff",
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
          </div>

          <EvaluationTable
            filteredData={filteredData}
            page={page}
            setPage={setPage}
            isDark={isDark}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
          />
        </div>
      </div>
    </div>
  );
}
