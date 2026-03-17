// src/pages/admin/GeolocalisationUniversites.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  HiOutlineArrowsPointingOut,
  HiOutlineArrowsPointingIn,
  HiOutlineMapPin,
  HiOutlineFlag,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";
import accreditationServices from "../../../../services/accreditation.services";

const { getUniversitesGeolocalisations, normalizeNiveauConformite, NIVEAU_CONFORMITE } =
  accreditationServices;

// ─── Tile modes ───────────────────────────────────────────────────────────────
const TILE_MODES = {
  standard:  { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",                                            label: "Standard"  },
  satellite: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", label: "Satellite" },
};

// ─── Système d'évaluation ─────────────────────────────────────────────────────
const EVAL_CONFIG = {
  [NIVEAU_CONFORMITE.INSUFFISANT]:     { label: "Insuffisant",  color: "#dc2626", lb: "#fafafa", db: "rgba(220,38,38,0.08)",  lbr: "#fca5a5", dbr: "rgba(220,38,38,0.2)",  lt: "#b91c1c", dt: "#fca5a5" },
  [NIVEAU_CONFORMITE.FAIBLE]:          { label: "Faible",       color: "#ea580c", lb: "#fafafa", db: "rgba(234,88,12,0.08)",  lbr: "#fed7aa", dbr: "rgba(234,88,12,0.2)",  lt: "#c2410c", dt: "#fdba74" },
  [NIVEAU_CONFORMITE.EN_DEVELOPPEMENT]:{ label: "Acceptable",   color: "#ca8a04", lb: "#fafafa", db: "rgba(202,138,4,0.08)",  lbr: "#fde68a", dbr: "rgba(202,138,4,0.2)",  lt: "#92400e", dt: "#fde68a" },
  [NIVEAU_CONFORMITE.SATISFAISANT]:    { label: "Satisfaisant", color: "#2563eb", lb: "#fafafa", db: "rgba(37,99,235,0.08)",  lbr: "#bfdbfe", dbr: "rgba(37,99,235,0.2)",  lt: "#1d4ed8", dt: "#93c5fd" },
  [NIVEAU_CONFORMITE.EXCELLENT]:       { label: "Excellent",    color: "#16a34a", lb: "#fafafa", db: "rgba(22,163,74,0.08)",  lbr: "#bbf7d0", dbr: "rgba(22,163,74,0.2)",  lt: "#15803d", dt: "#86efac" },
};

const getEvaluation = (uni) => {
  const pct = uni.score_pourcentage ?? 0;
  if (pct >= 80) return EVAL_CONFIG[NIVEAU_CONFORMITE.EXCELLENT];
  if (pct >= 60) return EVAL_CONFIG[NIVEAU_CONFORMITE.SATISFAISANT];
  if (pct >= 40) return EVAL_CONFIG[NIVEAU_CONFORMITE.EN_DEVELOPPEMENT];
  if (pct >= 20) return EVAL_CONFIG[NIVEAU_CONFORMITE.FAIBLE];
  return EVAL_CONFIG[NIVEAU_CONFORMITE.INSUFFISANT];
};

// ─── Mapping réponse API → structure composant ───────────────────────────────
const mapApiToUni = (d) => {
  const shortName = (d.nom || "?")
    .split(/[\s-]+/)
    .slice(0, 3)
    .map((w) => w[0] || "")
    .join("")
    .toUpperCase()
    .slice(0, 4);

  const statuses = [];
  const hab = (d.habilitation || "").toLowerCase();
  if (hab === "oui" || hab === "habilité" || hab === "habilitée") statuses.push("Habilitée");
  else statuses.push("Non habilitée");

  if (d.statut === "accredite") statuses.push("Accréditée");
  else statuses.push("Non accréditée");

  return {
    id:             d.id,
    lat:            parseFloat(d.latitude),
    lng:            parseFloat(d.longitude),
    name:           d.nom            || "Établissement inconnu",
    shortName,
    numero_demande: d.numero_demande || "",
    responsable:    d.responsable    || "",
    type:           d.type           || "",
    ville:          d.province       || d.region || "",
    region:         d.region         || "",
    province:       d.province       || "",
    address:        d.adresse        || "",
    phone:          d.telephone      || "",
    website:        d.site_web       || "",
    domaines:       d.domaine        || "",
    mention:        d.mention        || "",
    grade:          d.grade          || "",
    parcours:       d.parcours       || "",
    habilitation:   d.habilitation   || "",
    description:    d.description    || "",
    students:       d.nombre_etudiants || 0,
    score_total:       d.score_total       ?? null,
    score_pourcentage: d.score_pourcentage ?? 0,
    niveau_conformite: d.niveau_conformite || null,
    statut:            d.statut            || "",
    statuses,
    photo: null,
  };
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG = {
  "Habilitée":      { lb: "#f8fafb", lt: "#166534", lbr: "#d1fae5", db: "rgba(22,163,74,0.07)",  dt: "#86efac", dbr: "rgba(22,163,74,0.18)",  dot: "#16a34a" },
  "Accréditée":     { lb: "#f8fafb", lt: "#6d28d9", lbr: "#ede9fe", db: "rgba(109,40,217,0.07)", dt: "#c4b5fd", dbr: "rgba(109,40,217,0.18)", dot: "#7c3aed" },
  "Non habilitée":  { lb: "#f8fafb", lt: "#c2410c", lbr: "#fed7aa", db: "rgba(234,88,12,0.07)",  dt: "#fdba74", dbr: "rgba(234,88,12,0.18)",  dot: "#ea580c" },
  "Non accréditée": { lb: "#f8fafb", lt: "#92400e", lbr: "#fde68a", db: "rgba(202,138,4,0.07)",  dt: "#fde68a", dbr: "rgba(202,138,4,0.18)",  dot: "#ca8a04" },
};

const StatusPill = ({ status, isDark }) => {
  const c = STATUS_CFG[status] || {};
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap"
      style={{ background: isDark ? c.db : c.lb, color: isDark ? c.dt : c.lt, border: `1px solid ${isDark ? c.dbr : c.lbr}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {status}
    </span>
  );
};

// ─── Icons ────────────────────────────────────────────────────────────────────
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
  return null;
};

const GpsIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
  </svg>
);

// ─── Composant carte ──────────────────────────────────────────────────────────
const MadagascarMap = ({ universities }) => {
  const mapRef       = useRef(null);
  const containerRef = useRef(null);
  const instRef      = useRef(null);
  const markersRef   = useRef([]);
  const routeRef     = useRef(null);
  const tileRef      = useRef(null);
  const watchIdRef   = useRef(null);

  const [tileMode,     setTileMode]     = useState("standard");
  const [fullscreen,   setFullscreen]   = useState(false);
  const [selected,     setSelected]     = useState(null);
  const [popup,        setPopup]        = useState(null);
  const [userPos,      setUserPos]      = useState(null);
  const [routeMode,    setRouteMode]    = useState(null);
  const [routeInfo,    setRouteInfo]    = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [gpsLoading,   setGpsLoading]   = useState(false);
  const [gpsError,     setGpsError]     = useState(null);
  const [search,       setSearch]       = useState("");
  const [filter,       setFilter]       = useState("all");
  const [isMobile,     setIsMobile]     = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(true);

  // ✅ Bloquer le scroll de la page quand la carte est présente (hors plein écran)
  useEffect(() => {
    const preventScroll = (e) => {
      if (containerRef.current && containerRef.current.contains(e.target)) {
        e.preventDefault();
      }
    };
    document.addEventListener("wheel", preventScroll, { passive: false });
    return () => document.removeEventListener("wheel", preventScroll);
  }, []);

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
    tileRef.current = window.L.tileLayer(TILE_MODES[mode].url, { attribution: "", maxZoom: 19 }).addTo(map);
    setTileMode(mode);
  }, []);

  // ✅ GPS amélioré — timeout plus long, fallback robuste
  const detectGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError("GPS non disponible sur cet appareil");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    const handleSuccess = (pos) => {
      const lp = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      };
      setUserPos(lp);
      setGpsLoading(false);
      setGpsError(null);
    };

    const handleError = (err) => {
      console.warn("GPS haute précision échouée, tentative basse précision…", err);
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        (err2) => {
          console.error("GPS complètement échoué:", err2);
          setGpsLoading(false);
          setGpsError("Position introuvable. Autorisez la géolocalisation dans votre navigateur.");
        },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 120000 }
      );
    };

    // Première tentative haute précision
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    });

    // Watch continu pour mise à jour en temps réel
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 30000 }
    );
  }, []);

  useEffect(() => {
    detectGPS();
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [detectGPS]);

  const placeUserMarker = useCallback((pos) => {
    if (!instRef.current || !window.L) return;
    const { map } = instRef.current;
    if (instRef.current.userMarker)     instRef.current.userMarker.remove();
    if (instRef.current.accuracyCircle) instRef.current.accuracyCircle.remove();

    // Cercle de précision
    if (pos.accuracy && pos.accuracy < 10000) {
      instRef.current.accuracyCircle = window.L.circle([pos.lat, pos.lng], {
        radius: pos.accuracy,
        color: "#22d3ee",
        fillColor: "#22d3ee",
        fillOpacity: 0.08,
        weight: 1.5,
        opacity: 0.4,
      }).addTo(map);
    }

    // Marqueur position utilisateur pulsant
    const icon = window.L.divIcon({
      html: `
        <div style="position:relative;width:22px;height:22px">
          <div style="position:absolute;inset:0;border-radius:50%;background:rgba(34,211,238,0.3);animation:gps-pulse 2s ease-out infinite"></div>
          <div style="position:absolute;inset:3px;border-radius:50%;background:#22d3ee;border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>
        </div>
        <style>@keyframes gps-pulse{0%{transform:scale(1);opacity:0.6}100%{transform:scale(2.5);opacity:0}}</style>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      className: "",
    });

    const m = window.L.marker([pos.lat, pos.lng], { icon, zIndexOffset: 1000 }).addTo(map);
    m.bindTooltip(
      `📍 Ma position${pos.accuracy ? ` (±${Math.round(pos.accuracy)}m)` : ""}`,
      { permanent: false, direction: "top", offset: [0, -14] }
    );
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

  // ✅ Calcul d'itinéraire avec plusieurs serveurs OSRM de secours
  const calculateRoute = useCallback((mode) => {
    if (!userPos || !selected || !instRef.current) return;
    setRouteLoading(true);

    const { map } = instRef.current;
    if (routeRef.current) { map.removeLayer(routeRef.current); routeRef.current = null; }

    const profile = mode === "walking" ? "foot" : "car";

    // Serveurs OSRM publics avec fallback
    const endpoints = [
      `https://router.project-osrm.org/route/v1/${profile}/${userPos.lng},${userPos.lat};${selected.lng},${selected.lat}?steps=true&geometries=geojson&overview=full`,
      `https://routing.openstreetmap.de/routed-${profile === "foot" ? "foot" : "car"}/route/v1/driving/${userPos.lng},${userPos.lat};${selected.lng},${selected.lat}?steps=true&geometries=geojson&overview=full`,
    ];

    const tryFetch = (idx) => {
      if (idx >= endpoints.length) {
        // Fallback : tracer une ligne droite si tous les serveurs échouent
        const L = window.L;
        const coords = [[userPos.lat, userPos.lng], [selected.lat, selected.lng]];
        const color = mode === "walking" ? "#22d3ee" : "#22c55e";
        const glowPoly = L.polyline(coords, { color, weight: 10, opacity: 0.15, lineCap: "round" }).addTo(map);
        const mainPoly = L.polyline(coords, { color, weight: 4, opacity: 0.9, dashArray: "12 8", lineCap: "round" }).addTo(map);
        routeRef.current = L.layerGroup([glowPoly, mainPoly]).addTo(map);
        map.fitBounds(mainPoly.getBounds(), { padding: [60, 60] });

        // Distance à vol d'oiseau
        const R = 6371000;
        const dLat = (selected.lat - userPos.lat) * Math.PI / 180;
        const dLng = (selected.lng - userPos.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(userPos.lat*Math.PI/180)*Math.cos(selected.lat*Math.PI/180)*Math.sin(dLng/2)**2;
        const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const speed = mode === "walking" ? 5000/3600 : 50000/3600; // m/s
        setRouteInfo({ distance: dist, duration: dist / speed, steps: [], isFallback: true });
        setRouteLoading(false);
        return;
      }

      fetch(endpoints[idx])
        .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .then((data) => {
          if (!data.routes?.[0]) { tryFetch(idx + 1); return; }

          const route = data.routes[0];
          const L = window.L;
          const coords = route.geometry.coordinates.map((c) => [c[1], c[0]]);
          const color = mode === "walking" ? "#22d3ee" : "#22c55e";

          const glowPoly = L.polyline(coords, { color, weight: 10, opacity: 0.15, lineCap: "round", lineJoin: "round" }).addTo(map);
          const mainPoly = L.polyline(coords, { color, weight: 4.5, opacity: 0.95, dashArray: mode === "walking" ? "10 7" : null, lineCap: "round", lineJoin: "round" }).addTo(map);
          routeRef.current = L.layerGroup([glowPoly, mainPoly]).addTo(map);
          map.fitBounds(mainPoly.getBounds(), { padding: [60, 60] });

          const steps = [];
          route.legs?.forEach((leg) =>
            leg.steps?.forEach((step) => {
              if (step.name || step.maneuver?.type)
                steps.push({
                  instruction: step.maneuver?.type || "continue",
                  name: step.name || "",
                  dist: step.distance,
                  duration: step.duration,
                });
            })
          );
          setRouteInfo({ distance: route.distance, duration: route.duration, steps: steps.slice(0, 10), isFallback: false });
          setRouteLoading(false);
        })
        .catch(() => tryFetch(idx + 1));
    };

    tryFetch(0);
    setRouteMode(mode);
  }, [userPos, selected]);

  const clearRoute = useCallback(() => {
    if (routeRef.current && instRef.current) {
      instRef.current.map.removeLayer(routeRef.current);
      routeRef.current = null;
    }
    setRouteInfo(null);
    setRouteMode(null);
  }, []);

  const createPinIcon = (color, sel = false) => {
    const sz = sel ? 44 : 32, h = sel ? 60 : 45;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${h}" viewBox="0 0 32 45"><defs><filter id="sh"><feDropShadow dx="0" dy="${sel ? 5 : 3}" stdDeviation="${sel ? 4 : 2.5}" flood-color="rgba(0,0,0,0.55)"/></filter></defs><path filter="url(#sh)" d="M16 2C9.4 2 4 7.4 4 14c0 9.6 12 28 12 28s12-18.4 12-28C28 7.4 22.6 2 16 2z" fill="${color}" stroke="rgba(255,255,255,0.4)" stroke-width="${sel ? 2 : 1.5}"/><circle cx="16" cy="14" r="${sel ? 7 : 5.5}" fill="rgba(255,255,255,0.93)"/>${sel ? `<circle cx="16" cy="14" r="3.5" fill="${color}"/>` : ""}</svg>`;
    return { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`, size: [sz, h], anchor: [sz / 2, h] };
  };

  const updateIcons = useCallback((sel) => {
    if (!window.L) return;
    markersRef.current.forEach(({ marker, uni }) => {
      const ev = getEvaluation(uni), isSel = sel?.id === uni.id;
      const pin = createPinIcon(ev.color, isSel);
      marker.setIcon(window.L.icon({ iconUrl: pin.url, iconSize: pin.size, iconAnchor: pin.anchor }));
      marker.setZIndexOffset(isSel ? 500 : 0);
    });
  }, []);

  useEffect(() => {
    if (instRef.current?.map) setTimeout(() => { instRef.current.map.invalidateSize(); }, 100);
  }, [fullscreen, sidebarOpen]);

  // ✅ Initialisation carte — scrollWheelZoom TOUJOURS activé
  useEffect(() => {
    if (!universities.length) return;
    loadL().then((L) => {
      if (instRef.current) {
        markersRef.current.forEach(({ marker }) => marker.remove());
        markersRef.current = [];
      } else {
        const map = L.map(mapRef.current, {
          center: [-19.5, 46.8],
          zoom: 5,
          zoomControl: false,
          // ✅ Scroll de la roue toujours actif, pas de clic requis
          scrollWheelZoom: true,
        });

        L.control.zoom({ position: "bottomright" }).addTo(map);
        map.attributionControl.remove();
        tileRef.current = L.tileLayer(TILE_MODES["standard"].url, { attribution: "", maxZoom: 19 }).addTo(map);
        setTileMode("standard");
        instRef.current = { map, userMarker: null, accuracyCircle: null, centeredOnUser: false };
      }

      const { map } = instRef.current;
      const markers = universities
        .filter((u) => !isNaN(u.lat) && !isNaN(u.lng))
        .map((u) => {
          const ev  = getEvaluation(u);
          const pin = createPinIcon(ev.color, false);
          const m   = L.marker([u.lat, u.lng], {
            icon: L.icon({ iconUrl: pin.url, iconSize: pin.size, iconAnchor: pin.anchor }),
          }).addTo(map);

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
    });

    return () => {
      if (instRef.current?.map) {
        instRef.current.map.remove();
        instRef.current = null;
      }
    };
  }, [universities]);

  useEffect(() => { updateIcons(selected); }, [selected, updateIcons]);

  // Données filtrées pour la sidebar
  const listData = universities.filter((u) => {
    const q = search.toLowerCase();
    return (
      (!q || u.name.toLowerCase().includes(q) || u.ville.toLowerCase().includes(q) || u.region.toLowerCase().includes(q)) &&
      (filter === "all" || u.statuses.includes(filter))
    );
  });
  const sortedList = [...listData].sort((a, b) => (b.score_pourcentage ?? 0) - (a.score_pourcentage ?? 0));

  const sb  = { bg: "#ffffff", br: "#e2e8f0", tx: "#0f172a", su: "#64748b", ib: "#f8fafc", ibr: "#e2e8f0", rh: "#f1f5f9" };
  const mc  = { bg: "rgba(255,255,255,0.95)", br: "rgba(0,0,0,0.12)", tx: "#3c4043", abg: "#1a73e8", atx: "#fff", abr: "#1a73e8" };
  const pbg = "#ffffff";
  const pbr = "#e2e8f0";
  const ptx = "#0f172a";
  const psu = "#64748b";
  const psec   = "#f8fafc";
  const psecbr = "#e2e8f0";

  const ev   = popup?.uni ? getEvaluation(popup.uni) : null;
  const evbg = ev ? ev.lb  : "";
  const evbr = ev ? ev.lbr : "";
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
      // ✅ Empêche le scroll vertical de la page quand on survole la carte
      onWheel={(e) => e.stopPropagation()}
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
              <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-35" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round">
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
            </select>
          </div>

          <div className="px-3 pt-1.5 pb-0.5 text-xs font-bold uppercase tracking-wider" style={{ color: sb.su }}>
            {sortedList.length} résultat{sortedList.length !== 1 ? "s" : ""}
          </div>

          <div className="flex-1 overflow-y-auto px-1.5 pb-1.5 space-y-0.5">
            {sortedList.map((u, idx) => {
              const ev = getEvaluation(u), isSel = selected?.id === u.id;
              const rank = idx + 1;
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
                    style={{ background: rank <= 3 ? ev.color : "#f1f5f9", color: rank <= 3 ? "#fff" : sb.su, width: "22px", height: "22px" }}
                  >{rank}</div>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 tracking-tight border"
                    style={{ background: ev.lb, borderColor: ev.lbr, color: ev.color }}
                  >{u.shortName}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate" style={{ color: isSel ? "#a5b4fc" : sb.tx }}>{u.name}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: sb.su }}>{u.ville} · {u.type}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-black" style={{ color: ev.color }}>
                      {u.score_total != null ? u.score_total : Math.round((u.score_pourcentage ?? 0) * 368 / 100)}
                    </div>
                    <div className="text-[9px]" style={{ color: sb.su }}>/368</div>
                  </div>
                </div>
              );
            })}
            {sortedList.length === 0 && (
              <div className="text-center py-9 px-3 text-xs" style={{ color: sb.su }}>Aucun résultat</div>
            )}
          </div>
        </div>
      )}

      {/* ── Zone carte ── */}
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
              style={{
                borderColor: tileMode === key ? mc.abr : "transparent",
                background:  tileMode === key ? mc.abg : "transparent",
                color:       tileMode === key ? mc.atx : mc.tx,
              }}
            >
              <TileIcon mode={key} size={13} />
              {!isMobile && <span>{TILE_MODES[key].label}</span>}
            </button>
          ))}
        </div>

        {/* Contrôles haut-droite */}
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
            title="Détecter ma position GPS"
            className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md transition-all"
            style={{
              background: userPos ? "rgba(34,211,238,0.15)" : mc.bg,
              border: `1px solid ${userPos ? "rgba(34,211,238,0.5)" : gpsError ? "rgba(239,68,68,0.5)" : mc.br}`,
              color: userPos ? "#22d3ee" : gpsError ? "#ef4444" : mc.tx,
            }}
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

        {/* Message erreur GPS */}
        {gpsError && (
          <div
            className="absolute top-16 left-1/2 -translate-x-1/2 z-[999] px-3.5 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md whitespace-nowrap shadow-lg"
            style={{ background: "rgba(239,68,68,0.9)", color: "#fff" }}
          >
            ⚠️ {gpsError}
          </div>
        )}

        {/* Légende */}
        <div
          className={`absolute bottom-3 left-3 z-[999] p-2 rounded-xl backdrop-blur-md shadow-lg ${isMobile ? "hidden" : "flex flex-col gap-1"}`}
          style={{ background: mc.bg, border: `1px solid ${mc.br}` }}
        >
          {[
            { l: "Excellent",    c: "#16a34a" },
            { l: "Satisfaisant", c: "#2563eb" },
            { l: "Acceptable",   c: "#ca8a04" },
            { l: "Faible",       c: "#ea580c" },
            { l: "Insuffisant",  c: "#dc2626" },
          ].map(({ l, c }) => (
            <div key={l} className="flex items-center gap-1">
              <svg width="7" height="11" viewBox="0 0 14 20">
                <path d="M7 1C3.686 1 1 3.686 1 7c0 4.5 6 12 6 12s6-7.5 6-12C13 3.686 10.314 1 7 1z" fill={c} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
              </svg>
              <span className="text-[10px] font-semibold" style={{ color: mc.tx }}>{l}</span>
            </div>
          ))}
        </div>

        {/* Hint clic */}
        {!popup && (
          <div
            className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-[999] px-3.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm whitespace-nowrap pointer-events-none"
            style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.7)" }}
          >
            Cliquez sur une épingle pour explorer
          </div>
        )}

        {/* ── Popup université ── */}
        {popup && ev && (
          <div
            className={`absolute z-[1000] rounded-xl shadow-2xl overflow-y-auto ${
              isMobile ? "inset-x-2 bottom-2 max-h-[65vh]" : ""
            }`}
            style={
              !isMobile
                ? { left: Math.min(popup.x + 16, (mapRef.current?.offsetWidth || 800) - 305), top: Math.max(popup.y - 150, 8), width: 290, maxHeight: "calc(100% - 24px)" }
                : {}
            }
          >
            <div className="rounded-xl border overflow-hidden" style={{ background: pbg, borderColor: pbr }}>

              {/* En-tête */}
              <div className="px-3 py-2 border-b" style={{ borderColor: psecbr }}>
                <div className="flex items-start gap-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 border"
                    style={{ background: evbg, borderColor: evbr, color: ev.color }}
                  >
                    {popup.uni.shortName}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black truncate" style={{ color: ptx }}>{popup.uni.name}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: psu }}>
                      {popup.uni.ville}{popup.uni.type ? ` · ${popup.uni.type}` : ""}
                    </div>
                  </div>
                  <button
                    onClick={() => { setPopup(null); setSelected(null); }}
                    className="rounded-full flex items-center justify-center flex-shrink-0 text-xs"
                    style={{ width: "22px", height: "22px", background: "#f1f5f9", color: psu }}
                  >✕</button>
                </div>

                <div className="flex gap-1 flex-wrap mt-2">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border"
                    style={{ background: evbg, borderColor: evbr, color: ev.color }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10"/><path fill="white" d="M11 7h2v2h-2zm0 4h2v6h-2z"/>
                    </svg>
                    {popup.uni.score_total != null
                      ? `${popup.uni.score_total} / 368 pts`
                      : `${Math.round((popup.uni.score_pourcentage ?? 0) * 368 / 100)} / 368 pts`
                    } · {ev.label}
                  </span>
                  {popup.uni.students > 0 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold" style={{ background: psec, border: `1px solid ${psecbr}`, color: psu }}>
                      {popup.uni.students.toLocaleString()} étudiants
                    </span>
                  )}
                </div>
              </div>

              {/* Numéro de demande + Responsable */}
              {(popup.uni.numero_demande || popup.uni.responsable) && (
                <div className="px-3 py-2 border-b" style={{ borderColor: psecbr }}>
                  {popup.uni.numero_demande && (
                    <div className="mb-1">
                      <div className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: psu }}>Numéro de demande</div>
                      <div className="text-[10px] font-bold" style={{ color: "#6366f1" }}>{popup.uni.numero_demande}</div>
                    </div>
                  )}
                  {popup.uni.responsable && (
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: psu }}>Responsable</div>
                      <div className="text-[10px]" style={{ color: ptx }}>{popup.uni.responsable}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Informations académiques */}
              {(popup.uni.domaines || popup.uni.mention || popup.uni.grade || popup.uni.parcours) && (
                <div className="px-3 py-2 border-b" style={{ borderColor: psecbr }}>
                  <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: psu }}>Informations académiques</div>
                  <div className="space-y-0.5">
                    {popup.uni.domaines && (
                      <div className="flex gap-1 text-[10px]">
                        <span className="font-semibold flex-shrink-0" style={{ color: psu }}>Domaine :</span>
                        <span style={{ color: ptx }}>{popup.uni.domaines}</span>
                      </div>
                    )}
                    {popup.uni.mention && (
                      <div className="flex gap-1 text-[10px]">
                        <span className="font-semibold flex-shrink-0" style={{ color: psu }}>Mention :</span>
                        <span style={{ color: ptx }}>{popup.uni.mention}</span>
                      </div>
                    )}
                    {popup.uni.grade && (
                      <div className="flex gap-1 text-[10px]">
                        <span className="font-semibold flex-shrink-0" style={{ color: psu }}>Grade :</span>
                        <span className="font-bold" style={{ color: "#6366f1" }}>{popup.uni.grade}</span>
                      </div>
                    )}
                    {popup.uni.parcours && (
                      <div className="flex gap-1 text-[10px]">
                        <span className="font-semibold flex-shrink-0" style={{ color: psu }}>Parcours :</span>
                        <span style={{ color: ptx }}>{popup.uni.parcours}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Statuts */}
              <div className="px-3 py-1.5 border-b flex gap-1 flex-wrap" style={{ borderColor: psecbr }}>
                {popup.uni.statuses.map((s) => <StatusPill key={s} status={s} isDark={false} />)}
              </div>

              {/* Description */}
              {popup.uni.description && (
                <div className="px-3 py-2 border-b" style={{ borderColor: psecbr }}>
                  <div className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: psu }}>Description</div>
                  <div className="text-[10px] leading-4" style={{ color: psu }}>{popup.uni.description}</div>
                </div>
              )}

              {/* Coordonnées */}
              {(popup.uni.address || popup.uni.phone || popup.uni.website) && (
                <div className="px-3 py-1.5 border-b space-y-0.5" style={{ borderColor: psecbr }}>
                  {popup.uni.address && (
                    <div className="flex gap-1 text-[10px]" style={{ color: psu }}>
                      <span className="flex-shrink-0 mt-0.5 text-indigo-400"><HiOutlineMapPin className="w-2.5 h-2.5" /></span>
                      <span className="leading-4">
                        {popup.uni.address}
                        {popup.uni.region   ? `, ${popup.uni.region}`   : ""}
                        {popup.uni.province ? `, ${popup.uni.province}` : ""}
                      </span>
                    </div>
                  )}
                  {popup.uni.phone && (
                    <div className="flex gap-1 text-[10px]" style={{ color: psu }}>
                      <span className="flex-shrink-0 mt-0.5 text-indigo-400">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                        </svg>
                      </span>
                      <span className="leading-4">{popup.uni.phone}</span>
                    </div>
                  )}
                  {popup.uni.website && (
                    <div className="flex gap-1 text-[10px]" style={{ color: psu }}>
                      <span className="flex-shrink-0 mt-0.5 text-indigo-400"><HiOutlineGlobeAlt className="w-2.5 h-2.5" /></span>
                      <a
                        href={popup.uni.website.startsWith("http") ? popup.uni.website : `https://${popup.uni.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="leading-4 hover:text-indigo-500 transition-colors truncate"
                        style={{ color: "#6366f1" }}
                      >
                        {popup.uni.website}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* ── Itinéraire ── */}
              <div className="px-3 py-2">
                <div className="text-[10px] font-bold mb-1.5 flex items-center gap-1" style={{ color: ptx }}>
                  <HiOutlineFlag className="w-2.5 h-2.5 text-indigo-400" />
                  Itinéraire
                  {userPos
                    ? <span className="text-[9px] text-green-500 font-bold">· GPS actif ✓</span>
                    : <span className="text-[9px] text-orange-500 font-bold">· GPS requis</span>}
                </div>

                {!userPos ? (
                  <button
                    onClick={detectGPS}
                    className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border-dashed transition-all hover:bg-indigo-50"
                    style={{ border: `1px dashed ${psecbr}`, color: psu }}
                  >
                    <GpsIcon size={13} color="currentColor" /> Activer la localisation GPS
                  </button>
                ) : (
                  <>
                    <div className="flex gap-1 mb-1.5">
                      <button
                        onClick={() => calculateRoute("walking")}
                        className="flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                        style={{
                          border: `1px solid ${routeMode === "walking" ? "#22d3ee" : "rgba(34,211,238,0.3)"}`,
                          background: routeMode === "walking" ? "rgba(34,211,238,0.1)" : "transparent",
                          color: routeMode === "walking" ? "#22d3ee" : psu,
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <circle cx="12" cy="5" r="2"/><path d="M12 22V12m-4-4l4 4 4-4"/>
                        </svg>
                        À pied
                      </button>
                      <button
                        onClick={() => calculateRoute("driving")}
                        className="flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                        style={{
                          border: `1px solid ${routeMode === "driving" ? "#22c55e" : "rgba(34,197,94,0.3)"}`,
                          background: routeMode === "driving" ? "rgba(34,197,94,0.1)" : "transparent",
                          color: routeMode === "driving" ? "#22c55e" : psu,
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
                      <>
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
                          {routeInfo.isFallback && (
                            <span className="ml-auto text-[9px] italic text-orange-400">À vol d'oiseau</span>
                          )}
                        </div>
                        {routeMode && (
                          <div className="mt-1.5 text-[9px] italic text-center" style={{ color: psu }}>
                            L'itinéraire reste affiché même après fermeture du panneau
                          </div>
                        )}
                      </>
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
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getUniversitesGeolocalisations();
        const mapped = result
          .filter((d) => d.latitude != null && d.longitude != null)
          .map(mapApiToUni)
          .filter((u) => !isNaN(u.lat) && !isNaN(u.lng));
        setUniversities(mapped);
      } catch (err) {
        console.error("GeolocalisationUniversites — Erreur chargement:", err);
        setError("Impossible de charger les données. Vérifiez votre connexion ou vos droits d'accès.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    // ✅ overflow-hidden sur le conteneur principal — zéro scroll de page
    <div className="flex flex-col overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>

      {/* Header */}
      <div className="px-6 pt-5 pb-3 flex-shrink-0 bg-white dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Géolocalisation des universités
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Explorez et localisez les universités accréditées à travers Madagascar en temps réel.
        </p>
      </div>

      {/* État chargement */}
      {loading && (
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
          <div className="text-center">
            <svg className="animate-spin h-9 w-9 text-blue-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Chargement des universités…</p>
          </div>
        </div>
      )}

      {/* État erreur */}
      {!loading && error && (
        <div className="flex-1 flex items-center justify-center px-6 bg-white dark:bg-gray-800">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6 text-center max-w-md">
            <svg className="w-10 h-10 text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="text-red-700 dark:text-red-200 text-sm font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* État vide */}
      {!loading && !error && universities.length === 0 && (
        <div className="flex-1 flex items-center justify-center px-6 bg-white dark:bg-gray-800">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
            </svg>
            <p className="text-sm font-medium">Aucune université avec coordonnées GPS disponible.</p>
            <p className="text-xs mt-1 opacity-70">Les universités accréditées avec géolocalisation apparaîtront ici.</p>
          </div>
        </div>
      )}

      {/* Carte — prend tout l'espace restant */}
      {!loading && !error && universities.length > 0 && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <MadagascarMap universities={universities} />
        </div>
      )}
    </div>
  );
}