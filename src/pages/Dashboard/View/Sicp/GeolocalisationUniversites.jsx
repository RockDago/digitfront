import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  HiOutlineArrowsPointingOut,
  HiOutlineArrowsPointingIn,
  HiOutlineMapPin,
  HiOutlineFlag,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";

// ─── Tile modes ──────────────────────────────────────────────────────────────
const TILE_MODES = {
  standard: { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",                                                            label: "Standard"  },
  satellite:{ url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",                 label: "Satellite" },
  dark:     { url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",                                                 label: "Sombre"    },
};

// ─── Evaluation system ───────────────────────────────────────────────────────
const getEvaluation = (pts) => {
  if (pts <= 91)  return { label:"Non conforme", color:"#dc2626", lb:"#fafafa", db:"rgba(220,38,38,0.08)",  lbr:"#fca5a5", dbr:"rgba(220,38,38,0.2)",  lt:"#b91c1c", dt:"#fca5a5" };
  if (pts <= 183) return { label:"Faible",        color:"#ea580c", lb:"#fafafa", db:"rgba(234,88,12,0.08)", lbr:"#fed7aa", dbr:"rgba(234,88,12,0.2)", lt:"#c2410c", dt:"#fdba74" };
  if (pts <= 256) return { label:"Acceptable",    color:"#ca8a04", lb:"#fafafa", db:"rgba(202,138,4,0.08)", lbr:"#fde68a", dbr:"rgba(202,138,4,0.2)", lt:"#92400e", dt:"#fde68a" };
  if (pts <= 311) return { label:"Satisfaisant",  color:"#2563eb", lb:"#fafafa", db:"rgba(37,99,235,0.08)", lbr:"#bfdbfe", dbr:"rgba(37,99,235,0.2)", lt:"#1d4ed8", dt:"#93c5fd" };
  return               { label:"Excellent",       color:"#16a34a", lb:"#fafafa", db:"rgba(22,163,74,0.08)", lbr:"#bbf7d0", dbr:"rgba(22,163,74,0.2)", lt:"#15803d", dt:"#86efac" };
};

// ─── Status config ───────────────────────────────────────────────────────────
const STATUS_CFG = {
  "Habilitée":      { lb:"#f8fafb", lt:"#166534", lbr:"#d1fae5", db:"rgba(22,163,74,0.07)",   dt:"#86efac", dbr:"rgba(22,163,74,0.18)",  dot:"#16a34a" },
  "Accréditée":     { lb:"#f8fafb", lt:"#6d28d9", lbr:"#ede9fe", db:"rgba(109,40,217,0.07)",  dt:"#c4b5fd", dbr:"rgba(109,40,217,0.18)", dot:"#7c3aed" },
  "Non habilitée":  { lb:"#f8fafb", lt:"#c2410c", lbr:"#fed7aa", db:"rgba(234,88,12,0.07)",   dt:"#fdba74", dbr:"rgba(234,88,12,0.18)",  dot:"#ea580c" },
  "Non accréditée": { lb:"#f8fafb", lt:"#92400e", lbr:"#fde68a", db:"rgba(202,138,4,0.07)",   dt:"#fde68a", dbr:"rgba(202,138,4,0.18)",  dot:"#ca8a04" },
  "Suspendue":      { lb:"#f8fafb", lt:"#b91c1c", lbr:"#fecaca", db:"rgba(220,38,38,0.07)",   dt:"#fca5a5", dbr:"rgba(220,38,38,0.18)",  dot:"#dc2626" },
};

const StatusPill = ({ status, isDark }) => {
  const c = STATUS_CFG[status] || {};
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap"
      style={{
        background: isDark ? c.db : c.lb,
        color:      isDark ? c.dt : c.lt,
        border:     `1px solid ${isDark ? c.dbr : c.lbr}`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {status}
    </span>
  );
};

// ─── University data ─────────────────────────────────────────────────────────
const UNIVERSITIES = [
  { id:"UNI-001", lat:-18.9137, lng:47.5361, name:"Université d'Antananarivo",       shortName:"UA",   ville:"Antananarivo", region:"Analamanga",        type:"Publique", founded:1955, students:37914, address:"Campus d'Ankatso, BP 566, Antananarivo 101", phone:"+261 20 22 326 39", website:"univ-antananarivo.mg", domaines:"Droit, Médecine, Sciences, Lettres, Économie, Génie",           pts:340, statuses:["Habilitée","Accréditée"],             photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Universit%C3%A9_d%27Antananarivo.jpg/320px-Universit%C3%A9_d%27Antananarivo.jpg" },
  { id:"UNI-007", lat:-18.930,  lng:47.535,  name:"Univ. Catholique de Madagascar",  shortName:"UCM",  ville:"Antananarivo", region:"Analamanga",        type:"Privée",   founded:1960, students:6542,  address:"Faravohitra BP 8349, Antananarivo 101",     phone:"+261 20 22 641 90", website:"ucm.mg",               domaines:"Théologie, Droit, Gestion, Sciences Sociales",                   pts:315, statuses:["Habilitée","Accréditée"],             photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Antananarivo_panorama.jpg/320px-Antananarivo_panorama.jpg" },
  { id:"UNI-002", lat:-21.4545, lng:47.0856, name:"Université de Fianarantsoa",      shortName:"UF",   ville:"Fianarantsoa", region:"Haute Matsiatra",   type:"Publique", founded:1977, students:18342, address:"BP 1264 Fianarantsoa 301",                   phone:"+261 20 75 508 02", website:"univ-fianarantsoa.mg", domaines:"Informatique, Pédagogie, Sciences, Lettres, Droit",              pts:295, statuses:["Habilitée","Accréditée"],             photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Fianarantsoa_city.jpg/320px-Fianarantsoa_city.jpg" },
  { id:"UNI-010", lat:-18.920,  lng:47.525,  name:"ENS Antananarivo",                shortName:"ENS",  ville:"Antananarivo", region:"Analamanga",        type:"Publique", founded:1962, students:3987,  address:"Ankatso BP 881, Antananarivo 101",           phone:"+261 20 22 279 03", website:"ens.mg",               domaines:"Formation des Enseignants, Lettres, Sciences, Maths",            pts:260, statuses:["Habilitée","Accréditée"],             photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Universit%C3%A9_d%27Antananarivo.jpg/320px-Universit%C3%A9_d%27Antananarivo.jpg" },
  { id:"UNI-008", lat:-18.905,  lng:47.545,  name:"IST Antananarivo",                shortName:"IST",  ville:"Antananarivo", region:"Analamanga",        type:"Publique", founded:1992, students:5432,  address:"Ampasapito BP 8122, Antananarivo 101",       phone:"+261 20 22 294 40", website:"ist.mg",               domaines:"Technologie, Informatique, Génie Civil, Électronique",          pts:258, statuses:["Habilitée","Accréditée"],             photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Antananarivo_panorama.jpg/320px-Antananarivo_panorama.jpg" },
  { id:"UNI-003", lat:-15.7167, lng:46.3167, name:"Université de Mahajanga",         shortName:"UM",   ville:"Mahajanga",    region:"Boeny",             type:"Publique", founded:1977, students:12567, address:"BP 652 Mahajanga 401",                       phone:"+261 20 62 227 24", website:"univ-mahajanga.mg",    domaines:"Médecine, Dentisterie, Sciences, Droit, Gestion",               pts:270, statuses:["Habilitée","Accréditée"],             photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Mahajanga_port.jpg/320px-Mahajanga_port.jpg" },
  { id:"UNI-004", lat:-18.1496, lng:49.4022, name:"Université de Toamasina",         shortName:"UT",   ville:"Toamasina",    region:"Atsinanana",        type:"Publique", founded:1977, students:10891, address:"BP 591 Toamasina 501",                       phone:"+261 20 53 322 44", website:"univ-toamasina.mg",    domaines:"Sciences Économiques, Droit, Lettres, Sciences",                pts:240, statuses:["Habilitée","Non accréditée"],          photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Toamasina_Port.jpg/320px-Toamasina_Port.jpg" },
  { id:"UNI-009", lat:-18.940,  lng:47.530,  name:"Université Privée de Madagascar", shortName:"UPM",  ville:"Antananarivo", region:"Analamanga",        type:"Privée",   founded:2003, students:4321,  address:"Anosy, Antananarivo 101",                    phone:"+261 34 11 000 00", website:"upm.mg",               domaines:"Gestion, Économie, Droit, Commerce International",              pts:185, statuses:["Non habilitée","Non accréditée"],      photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Antananarivo_panorama.jpg/320px-Antananarivo_panorama.jpg" },
  { id:"UNI-005", lat:-23.3568, lng:43.6917, name:"Université de Toliara",           shortName:"UTol", ville:"Toliara",      region:"Atsimo-Andrefana",  type:"Publique", founded:1977, students:8945,  address:"BP Toliara 601",                             phone:"+261 20 94 417 73", website:"univ-toliara.mg",      domaines:"Sciences Marines, Droit, Lettres, Éducation",                   pts:168, statuses:["Non habilitée","Non accréditée"],      photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Tulear_beach.jpg/320px-Tulear_beach.jpg" },
  { id:"UNI-006", lat:-12.3547, lng:49.2964, name:"Université d'Antsiranana",        shortName:"UAN",  ville:"Antsiranana",  region:"Diana",             type:"Publique", founded:1976, students:7843,  address:"BP 0 Antsiranana",                           phone:"+261 20 82 294 09", website:"univ-antsiranana.mg",  domaines:"Ingénierie, Polytechnique, Sciences, Gestion",                  pts:78,  statuses:["Suspendue","Non habilitée"],           photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Diego_Suarez.jpg/320px-Diego_Suarez.jpg" },
];

// ─── Tile Icon ────────────────────────────────────────────────────────────────
const TileIcon = ({ mode, size = 14 }) => {
  if (mode === "standard") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  );
  if (mode === "satellite") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>
    </svg>
  );
  if (mode === "dark") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
  return null;
};

// ─── GPS Icon ─────────────────────────────────────────────────────────────────
const GpsIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
  </svg>
);

// ─── Madagascar Map Component ─────────────────────────────────────────────────
const MadagascarMap = ({ isDark }) => {
  const mapRef       = useRef(null);
  const containerRef = useRef(null);
  const instRef      = useRef(null);
  const markersRef   = useRef([]);
  const routeRef     = useRef(null);
  const tileRef      = useRef(null);
  const watchIdRef   = useRef(null);

  const [tileMode,      setTileMode]      = useState(() => (isDark ? "dark" : "standard"));
  const [fullscreen,    setFullscreen]    = useState(false);
  const [selected,      setSelected]      = useState(null);
  const [popup,         setPopup]         = useState(null);
  const [userPos,       setUserPos]       = useState(null);
  const [routeMode,     setRouteMode]     = useState(null);
  const [routeInfo,     setRouteInfo]     = useState(null);
  const [routeLoading,  setRouteLoading]  = useState(false);
  const [gpsLoading,    setGpsLoading]    = useState(false);
  const [gpsError,      setGpsError]      = useState(null);
  const [search,        setSearch]        = useState("");
  const [filter,        setFilter]        = useState("all");
  const [isMobile,      setIsMobile]      = useState(false);
  const [sidebarOpen,   setSidebarOpen]   = useState(true);

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

  const loadL = () =>
    new Promise((res) => {
      if (window.L) { res(window.L); return; }
      const css = document.createElement("link"); css.rel = "stylesheet"; css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"; document.head.appendChild(css);
      const js  = document.createElement("script"); js.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"; js.onload = () => res(window.L); document.head.appendChild(js);
    });

  const switchTile = useCallback((mode) => {
    if (!instRef.current || !window.L) return;
    const { map } = instRef.current;
    if (tileRef.current) map.removeLayer(tileRef.current);
    tileRef.current = window.L.tileLayer(TILE_MODES[mode].url, { attribution: "", maxZoom: 19 }).addTo(map);
    setTileMode(mode);
  }, []);

  useEffect(() => {
    if (!instRef.current) return;
    if (tileMode === "dark" || tileMode === "standard") switchTile(isDark ? "dark" : "standard");
  }, [isDark, tileMode, switchTile]);

  const detectGPS = useCallback(() => {
    if (!navigator.geolocation) { setGpsError("GPS non disponible sur cet appareil"); return; }
    setGpsLoading(true); setGpsError(null);
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    const opts = { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 };
    const onSuccess = (pos) => {
      const lp = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
      setUserPos(lp); setGpsLoading(false); setGpsError(null);
    };
    const onError = () => {
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        () => { setGpsLoading(false); setGpsError("Position introuvable. Autorisez la géolocalisation."); },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
      );
    };
    navigator.geolocation.getCurrentPosition(onSuccess, onError, opts);
    watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, () => {}, { enableHighAccuracy: true, maximumAge: 5000 });
  }, []);

  useEffect(() => {
    detectGPS();
    return () => { if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); };
  }, [detectGPS]);

  const placeUserMarker = useCallback((pos) => {
    if (!instRef.current || !window.L) return;
    const { map } = instRef.current;
    if (instRef.current.userMarker)     instRef.current.userMarker.remove();
    if (instRef.current.accuracyCircle) instRef.current.accuracyCircle.remove();
    if (pos.accuracy && pos.accuracy < 5000) {
      instRef.current.accuracyCircle = window.L.circle([pos.lat, pos.lng], {
        radius: pos.accuracy, color: "#22d3ee", fillColor: "#22d3ee", fillOpacity: 0.08, weight: 1.5, opacity: 0.4,
      }).addTo(map);
    }
    const icon = window.L.divIcon({
      html: `<div style="width:18px;height:18px;border-radius:50%;background:#22d3ee;border:3px solid white;box-shadow:0 0 0 4px rgba(34,211,238,0.3),0 2px 8px rgba(0,0,0,0.4)"></div>`,
      iconSize: [18, 18], iconAnchor: [9, 9], className: "",
    });
    const m = window.L.marker([pos.lat, pos.lng], { icon, zIndexOffset: 1000 }).addTo(map);
    m.bindTooltip(`Ma position${pos.accuracy ? ` (±${Math.round(pos.accuracy)}m)` : ""}`, { permanent: false, direction: "top", offset: [0, -12] });
    instRef.current.userMarker = m;
  }, []);

  useEffect(() => {
    if (userPos) {
      placeUserMarker(userPos);
      if (instRef.current && !instRef.current.centeredOnUser) {
        instRef.current.map.flyTo([userPos.lat, userPos.lng], 12, { duration: 1.5 });
        instRef.current.centeredOnUser = true;
      }
    }
  }, [userPos, placeUserMarker]);

  const calculateRoute = useCallback((mode) => {
    if (!userPos || !selected || !instRef.current) return;
    setRouteLoading(true);
    const { map } = instRef.current;
    if (routeRef.current) { map.removeLayer(routeRef.current); routeRef.current = null; }
    const profile = mode === "walking" ? "foot" : "car";
    const url = `https://router.project-osrm.org/route/v1/${profile}/${userPos.lng},${userPos.lat};${selected.lng},${selected.lat}?steps=true&geometries=geojson&overview=full&annotations=false`;
    fetch(url)
      .then((r) => { if (!r.ok) throw new Error("Network error"); return r.json(); })
      .then((data) => {
        if (!data.routes?.[0]) { setRouteLoading(false); return; }
        const route = data.routes[0];
        const L = window.L;
        const coords = route.geometry.coordinates.map((c) => [c[1], c[0]]);
        const color = mode === "walking" ? "#22d3ee" : "#22c55e";
        const glowPoly = L.polyline(coords, { color, weight: 10, opacity: 0.15, lineCap: "round", lineJoin: "round" }).addTo(map);
        const mainPoly = L.polyline(coords, { color, weight: 4.5, opacity: 0.95, dashArray: mode === "walking" ? "10 7" : null, lineCap: "round", lineJoin: "round" }).addTo(map);
        const group = L.layerGroup([glowPoly, mainPoly]).addTo(map);
        routeRef.current = group;
        map.fitBounds(mainPoly.getBounds(), { padding: [60, 60] });
        const steps = [];
        route.legs.forEach((leg) =>
          leg.steps.forEach((step) => {
            if (step.name || step.maneuver?.type)
              steps.push({ instruction: step.maneuver?.type || "continue", name: step.name || "", dist: step.distance, duration: step.duration });
          })
        );
        setRouteInfo({ distance: route.distance, duration: route.duration, steps: steps.slice(0, 10) });
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
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${h}" viewBox="0 0 32 45"><defs><filter id="sh"><feDropShadow dx="0" dy="${sel ? 5 : 3}" stdDeviation="${sel ? 4 : 2.5}" flood-color="rgba(0,0,0,0.55)"/></filter></defs><path filter="url(#sh)" d="M16 2C9.4 2 4 7.4 4 14c0 9.6 12 28 12 28s12-18.4 12-28C28 7.4 22.6 2 16 2z" fill="${color}" stroke="rgba(255,255,255,0.4)" stroke-width="${sel ? 2 : 1.5}"/><circle cx="16" cy="14" r="${sel ? 7 : 5.5}" fill="rgba(255,255,255,0.93)"/>${sel ? `<circle cx="16" cy="14" r="3.5" fill="${color}"/>` : ""}</svg>`;
    return { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`, size: [sz, h], anchor: [sz / 2, h] };
  };

  const updateIcons = useCallback((sel) => {
    if (!window.L) return;
    markersRef.current.forEach(({ marker, uni }) => {
      const ev = getEvaluation(uni.pts), isSel = sel?.id === uni.id;
      const pin = createPinIcon(ev.color, isSel);
      marker.setIcon(window.L.icon({ iconUrl: pin.url, iconSize: pin.size, iconAnchor: pin.anchor }));
      marker.setZIndexOffset(isSel ? 500 : 0);
    });
  }, []);

  useEffect(() => {
    if (instRef.current?.map) setTimeout(() => { instRef.current.map.invalidateSize(); }, 100);
  }, [fullscreen, sidebarOpen]);

  useEffect(() => {
    loadL().then((L) => {
      if (instRef.current) return;
      const map = L.map(mapRef.current, { center: [-19.5, 46.8], zoom: 5, zoomControl: false, scrollWheelZoom: false });
      map.on("click",    () => map.scrollWheelZoom.enable());
      map.on("mouseout", () => map.scrollWheelZoom.disable());
      L.control.zoom({ position: "bottomright" }).addTo(map);
      map.attributionControl.remove();
      const initMode = isDark ? "dark" : "standard";
      tileRef.current = L.tileLayer(TILE_MODES[initMode].url, { attribution: "", maxZoom: 19 }).addTo(map);
      setTileMode(initMode);
      const markers = UNIVERSITIES.map((u) => {
        const ev  = getEvaluation(u.pts);
        const pin = createPinIcon(ev.color, false);
        const m   = L.marker([u.lat, u.lng], { icon: L.icon({ iconUrl: pin.url, iconSize: pin.size, iconAnchor: pin.anchor }) }).addTo(map);
        m.on("click", () => {
          if (map.getZoom() < 10) map.flyTo([u.lat, u.lng], 13, { duration: 1.4, easeLinearity: 0.3 });
          setSelected(u);
          setTimeout(() => {
            if (!instRef.current) return;
            const pt = instRef.current.map.latLngToContainerPoint([u.lat, u.lng]);
            setPopup({ uni: u, x: pt.x, y: pt.y });
          }, 120);
        });
        return { marker: m, uni: u };
      });
      markersRef.current = markers;
      instRef.current = { map, userMarker: null, accuracyCircle: null, centeredOnUser: false };
    });
    return () => { if (instRef.current?.map) { instRef.current.map.remove(); instRef.current = null; } };
  }, []);

  useEffect(() => { updateIcons(selected); }, [selected, updateIcons]);

  const listData = UNIVERSITIES.filter((u) => {
    const q = search.toLowerCase();
    return (
      (!q || u.name.toLowerCase().includes(q) || u.ville.toLowerCase().includes(q)) &&
      (filter === "all" || u.statuses.includes(filter))
    );
  });

  const sb = isDark
    ? { bg:"#1e2235", br:"rgba(255,255,255,0.08)", tx:"#f1f5f9", su:"rgba(255,255,255,0.4)", ib:"rgba(255,255,255,0.06)", ibr:"rgba(255,255,255,0.1)", rh:"rgba(255,255,255,0.05)" }
    : { bg:"#ffffff", br:"#e2e8f0",                tx:"#0f172a", su:"#64748b",                ib:"#f8fafc",                ibr:"#e2e8f0",               rh:"#f1f5f9"                };

  const mc = isDark
    ? { bg:"rgba(20,22,40,0.92)",    br:"rgba(255,255,255,0.12)", tx:"rgba(255,255,255,0.75)", abg:"rgba(99,102,241,0.3)", atx:"#a5b4fc", abr:"rgba(99,102,241,0.55)" }
    : { bg:"rgba(255,255,255,0.95)", br:"rgba(0,0,0,0.12)",       tx:"#3c4043",               abg:"#1a73e8",              atx:"#fff",    abr:"#1a73e8"               };

  const pbg    = isDark ? "#1a1e35"                  : "#ffffff";
  const pbr    = isDark ? "rgba(255,255,255,0.1)"    : "#e2e8f0";
  const ptx    = isDark ? "#f1f5f9"                  : "#0f172a";
  const psu    = isDark ? "rgba(255,255,255,0.4)"    : "#64748b";
  const psec   = isDark ? "rgba(255,255,255,0.04)"   : "#f8fafc";
  const psecbr = isDark ? "rgba(255,255,255,0.07)"   : "#e2e8f0";

  const ev    = popup?.uni ? getEvaluation(popup.uni.pts) : null;
  const evbg  = ev ? (isDark ? ev.db : ev.lb)  : "";
  const evbr  = ev ? (isDark ? ev.dbr : ev.lbr) : "";
  const sbWidth = isMobile ? "100%" : 280;

  const fmtTime = (sec) => {
    const m = Math.round(sec / 60);
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60), r = m % 60;
    return `${h} h ${r} min`;
  };
  const fmtDist = (m) => (m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`);

  return (
    <div
      ref={containerRef}
      className={`flex w-full overflow-hidden transition-all duration-300 ${
        fullscreen ? "fixed inset-0 z-[9000] h-screen" : "relative h-full"
      }`}
    >
      {/* ── Sidebar ── */}
      {(sidebarOpen || !isMobile) && (
        <div
          className={`flex-shrink-0 flex flex-col overflow-hidden transition-all duration-300 ${
            isMobile ? "absolute inset-y-0 left-0 z-[100]" : "relative"
          }`}
          style={{ width: sbWidth, maxWidth: isMobile ? "100%" : 280, background: sb.bg, borderRight: `1px solid ${sb.br}` }}
        >
          <div className="p-3 pb-2.5 border-b" style={{ borderColor: sb.br }}>
            {isMobile && (
              <div className="flex justify-end mb-2">
                <button onClick={() => setSidebarOpen(false)} className="text-sm p-0.5" style={{ color: sb.su }}>✕</button>
              </div>
            )}
            <div className="relative mb-2">
              <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-35" viewBox="0 0 24 24" fill="none" stroke={isDark ? "white" : "#334155"} strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une université..."
                className="w-full py-2 pl-8 pr-8 rounded-lg text-xs font-medium outline-none transition-colors"
                style={{ background: sb.ib, border: `1px solid ${sb.ibr}`, color: sb.tx }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.6)")}
                onBlur={(e)  => (e.target.style.borderColor = sb.ibr)}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs" style={{ color: sb.su }}>✕</button>
              )}
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold outline-none cursor-pointer"
              style={{ background: sb.ib, border: `1px solid ${sb.ibr}`, color: sb.tx }}
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
            {listData.length} résultat{listData.length !== 1 ? "s" : ""}
          </div>

          <div className="flex-1 overflow-y-auto px-1.5 pb-1.5 space-y-0.5">
            {listData.map((u) => {
              const ev = getEvaluation(u.pts), isSel = selected?.id === u.id;
              const rank = UNIVERSITIES.findIndex((x) => x.id === u.id) + 1;
              return (
                <div
                  key={u.id}
                  onClick={() => {
                    setSelected(u);
                    if (isMobile) setSidebarOpen(false);
                    if (instRef.current) {
                      instRef.current.map.flyTo([u.lat, u.lng], 13, { duration: 1.2 });
                      setTimeout(() => {
                        if (!instRef.current) return;
                        const pt = instRef.current.map.latLngToContainerPoint([u.lat, u.lng]);
                        setPopup({ uni: u, x: pt.x, y: pt.y });
                      }, 1350);
                    }
                  }}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-150 mb-0.5 ${
                    isSel ? "bg-indigo-500/20 border border-indigo-500/35" : ""
                  }`}
                  style={!isSel ? { background: "transparent" } : {}}
                  onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = sb.rh; }}
                  onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = "transparent"; }}
                >
                  <div
                    className="rounded-md flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: rank <= 3 ? ev.color : (isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9"), color: rank <= 3 ? "#fff" : sb.su, width: "22px", height: "22px" }}
                  >{rank}</div>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 tracking-tight border"
                    style={{ background: isDark ? ev.db : ev.lb, borderColor: isDark ? ev.dbr : ev.lbr, color: ev.color }}
                  >{u.shortName}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate" style={{ color: isSel ? "#a5b4fc" : sb.tx }}>{u.name}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: sb.su }}>{u.ville} · {u.type}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-black" style={{ color: ev.color }}>{u.pts}</div>
                    <div className="text-[9px]" style={{ color: sb.su }}>/368</div>
                  </div>
                </div>
              );
            })}
            {listData.length === 0 && (
              <div className="text-center py-9 px-3 text-xs" style={{ color: sb.su }}>Aucun résultat</div>
            )}
          </div>
        </div>
      )}

      {/* ── Map area ── */}
      <div className="flex-1 relative overflow-hidden min-w-0">
        <div ref={mapRef} className="w-full h-full" />

        {isMobile && !sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-3 left-3 z-[999] px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md"
            style={{ background: mc.bg, border: `1px solid ${mc.br}`, color: mc.tx }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            Liste
          </button>
        )}

        {/* Tile switcher */}
        <div
          className="absolute top-3 z-[999] flex gap-0.5 p-0.5 rounded-xl backdrop-blur-md shadow-lg"
          style={{ left: isMobile && !sidebarOpen ? 80 : 12, background: mc.bg, border: `1px solid ${mc.br}` }}
        >
          {Object.entries(TILE_MODES).map(([key]) => (
            <button
              key={key}
              onClick={() => switchTile(key)}
              title={TILE_MODES[key].label}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all duration-150 ${tileMode === key ? "border" : ""}`}
              style={{ borderColor: tileMode === key ? mc.abr : "transparent", background: tileMode === key ? mc.abg : "transparent", color: tileMode === key ? mc.atx : mc.tx }}
            >
              <TileIcon mode={key} size={13} />
              {!isMobile && <span>{TILE_MODES[key].label}</span>}
            </button>
          ))}
        </div>

        {/* Controls top-right */}
        <div className="absolute top-3 right-3 z-[999] flex flex-col gap-1.5">
          <button
            onClick={() => setFullscreen((f) => !f)}
            title={fullscreen ? "Réduire" : "Agrandir"}
            className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md transition-all"
            style={{ background: mc.bg, border: `1px solid ${mc.br}`, color: mc.tx }}
          >
            {fullscreen ? <HiOutlineArrowsPointingIn className="w-4 h-4" /> : <HiOutlineArrowsPointingOut className="w-4 h-4" />}
          </button>
          <button
            onClick={detectGPS}
            title="Ma position"
            className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md transition-all"
            style={{ background: userPos ? "rgba(34,211,238,0.15)" : mc.bg, border: `1px solid ${userPos ? "rgba(34,211,238,0.5)" : gpsError ? "rgba(239,68,68,0.5)" : mc.br}`, color: userPos ? "#22d3ee" : gpsError ? "#ef4444" : mc.tx }}
          >
            {gpsLoading ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
            ) : (
              <GpsIcon size={16} color="currentColor" />
            )}
          </button>
          {userPos && (
            <button
              onClick={() => instRef.current?.map.flyTo([userPos.lat, userPos.lng], 14, { duration: 1.2 })}
              title="Centrer sur ma position"
              className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md"
              style={{ background: mc.bg, border: `1px solid ${mc.br}`, color: "#22d3ee" }}
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
            style={{ background: "rgba(239,68,68,0.9)", color: "#fff" }}
          >
            {gpsError}
          </div>
        )}

        {/* Legend */}
        <div
          className={`absolute bottom-14 left-3 z-[999] p-2 rounded-xl backdrop-blur-md shadow-lg ${isMobile ? "hidden" : "flex flex-col gap-1"}`}
          style={{ background: mc.bg, border: `1px solid ${mc.br}` }}
        >
          {[
            { l: "Excellent",     c: "#22c55e" },
            { l: "Satisfaisant",  c: "#3b82f6" },
            { l: "Acceptable",    c: "#eab308" },
            { l: "Faible",        c: "#f97316" },
            { l: "Non conforme",  c: "#ef4444" },
          ].map(({ l, c }) => (
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
            style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.7)" }}
          >
            Cliquez sur une épingle pour explorer
          </div>
        )}

        {/* Popup */}
        {popup && ev && (
          <div
            className={`absolute z-[1000] rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-y-auto ${
              isMobile ? "inset-x-2 bottom-2 max-h-[65vh]" : ""
            }`}
            style={
              !isMobile
                ? { left: Math.min(popup.x + 16, (mapRef.current?.offsetWidth || 800) - 305), top: Math.max(popup.y - 150, 8), width: 290, maxHeight: "calc(100% - 24px)" }
                : {}
            }
          >
            <div className="rounded-xl border overflow-hidden" style={{ background: pbg, borderColor: pbr }}>
              {popup.uni.photo && (
                <div className="h-20 relative overflow-hidden flex-shrink-0">
                  <img src={popup.uni.photo} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                  <div className="absolute inset-0" style={{ background: isDark ? "linear-gradient(to bottom,transparent 40%,rgba(15,15,35,0.85))" : "linear-gradient(to bottom,transparent 40%,rgba(255,255,255,0.5))" }} />
                </div>
              )}
              <div className="px-3 py-2 border-b" style={{ borderColor: psecbr }}>
                <div className="flex items-start gap-2">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 border" style={{ background: evbg, borderColor: evbr, color: ev.color }}>
                    {popup.uni.shortName}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black truncate" style={{ color: ptx }}>{popup.uni.name}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: psu }}>{popup.uni.ville} · {popup.uni.type}</div>
                  </div>
                  <button
                    onClick={() => { setPopup(null); setSelected(null); }}
                    className="rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                    style={{ width: "22px", height: "22px", background: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9", color: psu }}
                  >✕</button>
                </div>
                <div className="flex gap-1 flex-wrap mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border" style={{ background: evbg, borderColor: evbr, color: ev.color }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path fill="white" d="M11 7h2v2h-2zm0 4h2v6h-2z"/></svg>
                    {popup.uni.pts} pts · {ev.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold" style={{ background: psec, border: `1px solid ${psecbr}`, color: psu }}>
                    {popup.uni.students.toLocaleString()} étudiants
                  </span>
                </div>
              </div>
              <div className="px-3 py-2 border-b" style={{ borderColor: psecbr }}>
                <div className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: psu }}>Domaines</div>
                <div className="text-[10px] leading-5" style={{ color: isDark ? "rgba(255,255,255,0.52)" : psu }}>{popup.uni.domaines}</div>
              </div>
              <div className="px-3 py-1.5 border-b flex gap-1 flex-wrap" style={{ borderColor: psecbr }}>
                {popup.uni.statuses.map((s) => <StatusPill key={s} status={s} isDark={isDark} />)}
              </div>
              <div className="px-3 py-1.5 border-b space-y-0.5" style={{ borderColor: psecbr }}>
                {[
                  { Icon: HiOutlineMapPin, v: popup.uni.address },
                  {
                    Icon: () => (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                      </svg>
                    ),
                    v: popup.uni.phone,
                  },
                  { Icon: HiOutlineGlobeAlt, v: popup.uni.website },
                ].map(({ Icon, v }) => (
                  <div key={v} className="flex gap-1 text-[10px]" style={{ color: psu }}>
                    <span className="flex-shrink-0 mt-0.5 text-indigo-400"><Icon className="w-2.5 h-2.5" /></span>
                    <span className="leading-4">{v}</span>
                  </div>
                ))}
              </div>
              <div className="px-3 py-2">
                <div className="text-[10px] font-bold mb-1.5 flex items-center gap-1" style={{ color: ptx }}>
                  <HiOutlineFlag className="w-2.5 h-2.5 text-indigo-400" />
                  Itinéraire
                  {userPos
                    ? <span className="text-[9px] text-green-500 font-bold">· GPS actif</span>
                    : <span className="text-[9px] text-orange-500 font-bold">· GPS requis</span>}
                </div>
                {!userPos ? (
                  <button
                    onClick={detectGPS}
                    className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border-dashed"
                    style={{ border: `1px dashed ${isDark ? "rgba(255,255,255,0.2)" : psecbr}`, color: psu }}
                  >
                    <GpsIcon size={13} color="currentColor" /> Activer la localisation GPS
                  </button>
                ) : (
                  <>
                    <div className="flex gap-1 mb-1.5">
                      <button
                        onClick={() => calculateRoute("walking")}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${routeMode === "walking" ? "bg-cyan-500/15 text-cyan-400 border-cyan-500" : ""}`}
                        style={{ border: `1px solid ${routeMode === "walking" ? "#22d3ee" : "rgba(34,211,238,0.3)"}`, color: routeMode === "walking" ? "#22d3ee" : psu }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <circle cx="12" cy="5" r="2"/><path d="M12 22V12m-4-4l4 4 4-4"/>
                        </svg>
                        À pied
                      </button>
                      <button
                        onClick={() => calculateRoute("driving")}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${routeMode === "driving" ? "bg-green-500/15 text-green-400 border-green-500" : ""}`}
                        style={{ border: `1px solid ${routeMode === "driving" ? "#22c55e" : "rgba(34,197,94,0.3)"}`, color: routeMode === "driving" ? "#22c55e" : psu }}
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
                          style={{ border: `1px solid ${psecbr}` }}
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
                          <div className="text-sm font-black" style={{ color: routeMode === "walking" ? "#22d3ee" : "#22c55e" }}>{fmtTime(routeInfo.duration)}</div>
                          <div className="text-[9px] mt-0.5" style={{ color: psu }}>Durée estimée</div>
                        </div>
                        <div className="w-px h-7" style={{ background: psecbr }} />
                        <div>
                          <div className="text-sm font-bold" style={{ color: ptx }}>{fmtDist(routeInfo.distance)}</div>
                          <div className="text-[9px] mt-0.5" style={{ color: psu }}>Distance</div>
                        </div>
                        {!isMobile && (
                          <span className="ml-auto text-[9px] italic" style={{ color: psu }}>Itinéraire affiché sur la carte</span>
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

// ─── Page principale ──────────────────────────────────────────────────────────
export default function GeolocalisationUniversites() {
  return (
    // ✅ overflow-hidden : supprime le scroll vertical sur toute la page
    // ✅ Pas de border ni shadow sur le conteneur principal
    <div className="flex flex-col bg-white dark:bg-gray-800 transition-colors duration-300 overflow-hidden" style={{ height: "100%" }}>

      {/* ── Header (sans bordure grise) ── */}
      <div className="px-6 pt-5 pb-3 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Géolocalisation des universités
        </h1>
        {/* ✅ Texte remplacé */}
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Explorez et localisez les universités à travers Madagascar en temps réel.
        </p>
      </div>

      {/* ── Carte (prend tout l'espace restant, sans bordure) ── */}
      <div className="flex-1 min-h-0">
        <MadagascarMap isDark={false} />
      </div>

    </div>
  );
}
