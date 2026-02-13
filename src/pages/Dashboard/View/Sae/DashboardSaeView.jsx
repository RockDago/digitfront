import React, { useEffect, useRef, useState, useCallback } from "react";
import Chart from "chart.js/auto";
import {
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaFileAlt,
  FaGraduationCap,
  FaChevronUp,
  FaChevronDown,
  FaFilter,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaUserCircle,
  FaCalendar,
  FaArrowUp,
  FaArrowDown,
  FaArrowsAltV,
  FaAngleLeft,
  FaAngleRight,
  FaUserTie,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const DashboardSaeView = () => {
  // Références pour les graphiques
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const barChartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  // État pour le menu mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Données originales - 80 équivalences et 30 accréditations
  const [allReports] = useState([
    // Équivalences (80 dossiers)
    ...Array.from({ length: 80 }, (_, i) => ({
      id: i + 1,
      demandeur: `Demandeur ${i + 1}`,
      type: "Équivalence",
      dossier: `EQ-2024-${String(i + 1000).padStart(4, '0')}`,
      date: generateRandomDate("2024-01-01", "2024-05-31"),
      niveau: getRandomNiveau(),
      status: getRandomStatus(),
      delai: Math.floor(Math.random() * 30) + 1,
    })),
    
    // Accréditations (30 dossiers)
    ...Array.from({ length: 30 }, (_, i) => ({
      id: i + 101,
      demandeur: `Université ${i + 1}`,
      type: "Accréditation",
      dossier: `AC-2024-${String(i + 100).padStart(4, '0')}`,
      date: generateRandomDate("2024-01-01", "2024-05-31"),
      niveau: getRandomNiveau(),
      status: getRandomStatus(),
      delai: Math.floor(Math.random() * 30) + 1,
    })),
  ]);

  // Détecter la taille d'écran pour le responsive
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fermer le menu mobile lors du redimensionnement
  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  // Fonctions utilitaires
  function generateRandomDate(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    const date = new Date(randomTime);
    return date.toISOString().split('T')[0];
  }

  function getRandomNiveau() {
    const niveaux = ["SAE", "CNE", "SG", "Ministre", "PM"];
    return niveaux[Math.floor(Math.random() * niveaux.length)];
  }

  function getRandomStatus() {
    const status = ["en_cours", "octroyé", "rejeté", "ajourné"];
    return status[Math.floor(Math.random() * status.length)];
  }

  // États pour les données filtrées
  const [filteredReports, setFilteredReports] = useState(allReports);
  const [equivalenceStats, setEquivalenceStats] = useState([]);
  const [accreditationStats, setAccreditationStats] = useState([]);

  // Filtres
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState("presets");

  // Filtre pour le tableau
  const [tableFilterType, setTableFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginatedReports, setPaginatedReports] = useState([]);
  const [filteredTotalCount, setFilteredTotalCount] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  // État pour suivre le chargement des graphiques
  const [isChartInitializing, setIsChartInitializing] = useState(false);

  // Totaux initiaux pour référence (80 équivalences, 30 accréditations)
  const initialTotals = {
    equivalence: 80,
    accreditation: 30,
  };

  // Filtrer les rapports par période
  const filterReportsByDateRange = useCallback((reports, startDate, endDate) => {
    if (!reports || reports.length === 0) {
      return [];
    }

    if (!startDate && !endDate) {
      return reports;
    }

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    return reports.filter((r) => {
      if (!r.date) return false;
      const reportDate = new Date(r.date);

      if (start && end) {
        return reportDate >= start && reportDate <= end;
      } else if (start) {
        return reportDate >= start;
      } else if (end) {
        return reportDate <= end;
      }
      return true;
    });
  }, []);

  // Calculer les statistiques basées sur les données filtrées
  const calculateStats = useCallback((reports) => {
    // Filtrer les équivalences et accréditations
    const equivalenceReports = reports.filter(r => r.type === "Équivalence");
    const accreditationReports = reports.filter(r => r.type === "Accréditation");

    // Calculer les statistiques pour les équivalences
    const equivalenceTotal = equivalenceReports.length;
    const equivalenceEnCours = equivalenceReports.filter(r => r.status === "en_cours").length;
    const equivalenceOctroyé = equivalenceReports.filter(r => r.status === "octroyé").length;
    const equivalenceRejeté = equivalenceReports.filter(r => r.status === "rejeté").length;
    const equivalenceAjourné = equivalenceReports.filter(r => r.status === "ajourné").length;
    
    // Calculer par niveau pour les équivalences
    const equivalenceSAE = equivalenceReports.filter(r => r.niveau === "SAE").length;
    const equivalenceCNE = equivalenceReports.filter(r => r.niveau === "CNE").length;
    const equivalenceSG = equivalenceReports.filter(r => r.niveau === "SG").length;
    const equivalenceMinistre = equivalenceReports.filter(r => r.niveau === "Ministre").length;
    const equivalencePM = equivalenceReports.filter(r => r.niveau === "PM").length;

    // Calculer les statistiques pour les accréditations
    const accreditationTotal = accreditationReports.length;
    const accreditationEnCours = accreditationReports.filter(r => r.status === "en_cours").length;
    const accreditationOctroyé = accreditationReports.filter(r => r.status === "octroyé").length;
    const accreditationRejeté = accreditationReports.filter(r => r.status === "rejeté").length;
    const accreditationAjourné = accreditationReports.filter(r => r.status === "ajourné").length;

    // Mettre à jour les statistiques d'équivalences
    setEquivalenceStats([
      {
        title: "Total dossiers",
        value: equivalenceTotal.toString(),
        change: calculateChange(equivalenceTotal, initialTotals.equivalence),
        icon: <FaFileAlt className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />,
        color: "bg-blue-50",
        trend: equivalenceTotal >= initialTotals.equivalence ? "up" : "down",
      },
      {
        title: "Dossiers en traitement",
        value: equivalenceEnCours.toString(),
        change: calculateChange(equivalenceEnCours, Math.round(initialTotals.equivalence * 0.4)),
        icon: <FaClock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />,
        color: "bg-yellow-50",
        trend: equivalenceEnCours >= 32 ? "up" : "down",
      },
      {
        title: "Octroyés",
        value: equivalenceOctroyé.toString(),
        change: calculateChange(equivalenceOctroyé, Math.round(initialTotals.equivalence * 0.3)),
        icon: <FaCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />,
        color: "bg-green-50",
        trend: equivalenceOctroyé >= 24 ? "up" : "down",
      },
      {
        title: "Rejetés",
        value: equivalenceRejeté.toString(),
        change: calculateChange(equivalenceRejeté, Math.round(initialTotals.equivalence * 0.2)),
        icon: <FaTimesCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />,
        color: "bg-red-50",
        trend: equivalenceRejeté >= 16 ? "up" : "down",
      },
      {
        title: "Ajournés",
        value: equivalenceAjourné.toString(),
        change: calculateChange(equivalenceAjourné, Math.round(initialTotals.equivalence * 0.1)),
        icon: <FaHourglassHalf className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
        color: "bg-orange-50",
        trend: equivalenceAjourné >= 8 ? "up" : "down",
      },
      {
        title: "Au niveau SAE",
        value: equivalenceSAE.toString(),
        change: calculateChange(equivalenceSAE, Math.round(initialTotals.equivalence * 0.2)),
        icon: <FaUserTie className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />,
        color: "bg-purple-50",
        trend: equivalenceSAE >= 16 ? "up" : "down",
      },
      {
        title: "Au niveau CNE",
        value: equivalenceCNE.toString(),
        change: calculateChange(equivalenceCNE, Math.round(initialTotals.equivalence * 0.2)),
        icon: <FaUserTie className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />,
        color: "bg-indigo-50",
        trend: equivalenceCNE >= 16 ? "up" : "down",
      },
      {
        title: "Au niveau SG",
        value: equivalenceSG.toString(),
        change: calculateChange(equivalenceSG, Math.round(initialTotals.equivalence * 0.2)),
        icon: <FaUserTie className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600" />,
        color: "bg-cyan-50",
        trend: equivalenceSG >= 16 ? "up" : "down",
      },
      {
        title: "Au niveau Ministre",
        value: equivalenceMinistre.toString(),
        change: calculateChange(equivalenceMinistre, Math.round(initialTotals.equivalence * 0.2)),
        icon: <FaUserTie className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />,
        color: "bg-blue-50",
        trend: equivalenceMinistre >= 16 ? "up" : "down",
      },
      {
        title: "Au niveau PM",
        value: equivalencePM.toString(),
        change: calculateChange(equivalencePM, Math.round(initialTotals.equivalence * 0.2)),
        icon: <FaUserTie className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />,
        color: "bg-red-50",
        trend: equivalencePM >= 16 ? "up" : "down",
      },
    ]);

    // Mettre à jour les statistiques d'accréditations
    setAccreditationStats([
      {
        title: "Total dossiers",
        value: accreditationTotal.toString(),
        change: calculateChange(accreditationTotal, initialTotals.accreditation),
        icon: <FaGraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />,
        color: "bg-blue-50",
        trend: accreditationTotal >= initialTotals.accreditation ? "up" : "down",
      },
      {
        title: "Dossiers en traitement",
        value: accreditationEnCours.toString(),
        change: calculateChange(accreditationEnCours, Math.round(initialTotals.accreditation * 0.4)),
        icon: <FaClock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />,
        color: "bg-yellow-50",
        trend: accreditationEnCours >= 12 ? "up" : "down",
      },
      {
        title: "Accordées",
        value: accreditationOctroyé.toString(),
        change: calculateChange(accreditationOctroyé, Math.round(initialTotals.accreditation * 0.3)),
        icon: <FaCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />,
        color: "bg-green-50",
        trend: accreditationOctroyé >= 9 ? "up" : "down",
      },
      {
        title: "Rejetées",
        value: accreditationRejeté.toString(),
        change: calculateChange(accreditationRejeté, Math.round(initialTotals.accreditation * 0.2)),
        icon: <FaTimesCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />,
        color: "bg-red-50",
        trend: accreditationRejeté >= 6 ? "up" : "down",
      },
      {
        title: "Ajournées",
        value: accreditationAjourné.toString(),
        change: calculateChange(accreditationAjourné, Math.round(initialTotals.accreditation * 0.1)),
        icon: <FaHourglassHalf className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />,
        color: "bg-orange-50",
        trend: accreditationAjourné >= 3 ? "up" : "down",
      },
    ]);

    // Retourner les données pour les graphiques
    return {
      equivalenceReports,
      accreditationReports,
      equivalenceTotal,
      accreditationTotal,
    };
  }, []);

  // Fonction pour calculer le changement en pourcentage
  const calculateChange = (current, previous) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
  };

  // Mettre à jour toutes les données filtrées et statistiques
  useEffect(() => {
    const filtered = filterReportsByDateRange(
      allReports,
      dateFilter.startDate,
      dateFilter.endDate,
    );
    setFilteredReports(filtered);
    
    // Calculer les statistiques à partir des données filtrées
    const stats = calculateStats(filtered);
    
    // Réinitialiser les graphiques avec les nouvelles données
    setTimeout(() => {
      initializeCharts(stats);
    }, 100);
  }, [allReports, dateFilter, filterReportsByDateRange, calculateStats]);

  // Mettre à jour les données du tableau
  useEffect(() => {
    updateTableData();
  }, [filteredReports, currentPage, pageSize, tableFilterType, sortConfig]);

  const updateTableData = () => {
    let filtered = [...filteredReports];

    if (tableFilterType !== "all") {
      filtered = filtered.filter((r) => r.type === tableFilterType);
    }

    // Appliquer le tri
    filtered.sort((a, b) => {
      if (!sortConfig.key) return 0;

      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "date") {
        aValue = new Date(a.date || 0);
        bValue = new Date(b.date || 0);
      }

      if (sortConfig.key === "dossier") {
        aValue = (a.dossier || "").toLowerCase();
        bValue = (b.dossier || "").toLowerCase();
      }

      if (sortConfig.key === "demandeur") {
        aValue = (a.demandeur || "").toLowerCase();
        bValue = (b.demandeur || "").toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredTotalCount(filtered.length);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedReports(filtered.slice(startIndex, endIndex));
  };

  // Initialiser les graphiques avec les données filtrées
  const initializeCharts = (stats) => {
    setIsChartInitializing(true);
    
    // Détruire les anciens graphiques
    if (lineChartInstance.current) {
      lineChartInstance.current.destroy();
      lineChartInstance.current = null;
    }
    if (barChartInstance.current) {
      barChartInstance.current.destroy();
      barChartInstance.current = null;
    }
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy();
      pieChartInstance.current = null;
    }
    
    // Attendre un petit délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
      try {
        // Initialiser les graphiques avec les données filtrées
        if (lineChartRef.current) initializeLineChart(stats);
        if (barChartRef.current) initializeBarChart(stats);
        if (pieChartRef.current) initializePieChart(stats);
      } catch (error) {
        console.error("Erreur lors de l'initialisation des graphiques:", error);
      } finally {
        setIsChartInitializing(false);
      }
    }, 100);
  };

  // Générer les données pour le graphique en ligne basé sur les données filtrées
  const generateTimeBasedData = (stats) => {
    const monthsShort = [
      "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", 
      "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
    ];
    
    const currentYear = 2024;
    
    // Labels pour les 12 derniers mois
    const labels = monthsShort.map(month => `${month} ${currentYear}`);
    
    // Répartir les données filtrées sur les mois de manière réaliste
    const equivalenceData = distributeDataRealistically(stats.equivalenceTotal, 12);
    const accreditationData = distributeDataRealistically(stats.accreditationTotal, 12);

    return {
      labels,
      datasets: [
        {
          label: "Équivalences",
          data: equivalenceData,
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.15)",
          tension: 0.4,
          fill: true,
          pointRadius: isMobile ? 3 : 5,
          pointHoverRadius: isMobile ? 5 : 7,
          borderWidth: isMobile ? 2 : 3,
          pointBackgroundColor: "#3B82F6",
          pointBorderColor: "#ffffff",
          pointBorderWidth: isMobile ? 1 : 2,
          pointHoverBackgroundColor: "#2563EB",
          pointHoverBorderColor: "#ffffff",
        },
        {
          label: "Accréditations",
          data: accreditationData,
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          tension: 0.4,
          fill: true,
          pointRadius: isMobile ? 3 : 5,
          pointHoverRadius: isMobile ? 5 : 7,
          borderWidth: isMobile ? 2 : 3,
          pointBackgroundColor: "#10B981",
          pointBorderColor: "#ffffff",
          pointBorderWidth: isMobile ? 1 : 2,
          pointHoverBackgroundColor: "#059669",
          pointHoverBorderColor: "#ffffff",
        },
      ],
    };
  };

  // Distribuer les données de manière réaliste avec tendance
  const distributeDataRealistically = (total, monthsCount) => {
    const data = Array(monthsCount).fill(0);
    if (total === 0) return data;
    
    // Créer une tendance croissante réaliste
    const base = Math.floor(total / monthsCount);
    let remaining = total;
    
    for (let i = 0; i < monthsCount; i++) {
      // Augmentation progressive avec variation aléatoire
      const growthFactor = 1 + (i * 0.1); // Croissance de 10% par mois
      const variation = (Math.random() * 0.4) - 0.2; // Variation de ±20%
      const monthValue = Math.round(base * growthFactor * (1 + variation));
      
      data[i] = Math.max(1, monthValue);
      remaining -= data[i];
    }
    
    // Ajuster pour que le total soit exact
    if (remaining !== 0) {
      const avgAdjustment = Math.round(remaining / monthsCount);
      for (let i = 0; i < monthsCount; i++) {
        data[i] = Math.max(1, data[i] + avgAdjustment);
      }
    }
    
    return data;
  };

  const initializeLineChart = (stats) => {
    if (!lineChartRef.current) return;

    const { labels, datasets } = generateTimeBasedData(stats);

    const ctx = lineChartRef.current.getContext("2d");
    lineChartInstance.current = new Chart(ctx, {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
        interaction: { 
          mode: "index", 
          intersect: false,
        },
        plugins: {
          legend: {
            position: isMobile ? "bottom" : "top",
            labels: {
              usePointStyle: true,
              boxWidth: isMobile ? 8 : 10,
              font: {
                size: isMobile ? 10 : 12,
                family: "'Inter', sans-serif",
                weight: "500",
              },
              padding: isMobile ? 10 : 20,
              color: "#374151",
            },
          },
          tooltip: {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            titleColor: "#111827",
            bodyColor: "#374151",
            borderColor: "#E5E7EB",
            borderWidth: 1,
            padding: isMobile ? 12 : 16,
            boxPadding: isMobile ? 6 : 8,
            titleFont: {
              size: isMobile ? 11 : 13,
              family: "'Inter', sans-serif",
              weight: "600",
            },
            bodyFont: {
              size: isMobile ? 11 : 13,
              family: "'Inter', sans-serif",
            },
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y} dossiers`;
              }
            }
          },
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.05)",
              drawBorder: false,
            },
            ticks: {
              font: {
                size: isMobile ? 9 : 11,
                family: "'Inter', sans-serif",
              },
              maxRotation: isMobile ? 45 : 45,
              autoSkip: true,
              maxTicksLimit: isMobile ? 6 : 12,
              color: "#6B7280",
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
              drawBorder: false,
            },
            ticks: {
              font: {
                size: isMobile ? 9 : 11,
                family: "'Inter', sans-serif",
              },
              color: "#6B7280",
              callback: function(value) {
                return Number.isInteger(value) ? value : '';
              }
            },
            title: {
              display: !isMobile,
              text: "Nombre de dossiers",
              font: {
                size: 12,
                family: "'Inter', sans-serif",
                weight: "500",
              },
              color: "#4B5563",
              padding: { top: 10, bottom: 10 }
            },
          },
        },
        elements: {
          line: {
            tension: 0.4,
          },
        },
      },
    });
  };

  const initializeBarChart = (stats) => {
    if (!barChartRef.current) return;

    // Labels pour les 12 derniers mois
    const monthsShort = [
      "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", 
      "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
    ];
    const currentYear = 2024;
    
    const labels = monthsShort.map(month => `${month} ${currentYear}`);
    
    // Répartir les données filtrées sur les mois
    const equivalenceData = distributeDataRealistically(stats.equivalenceTotal, 12);
    const accreditationData = distributeDataRealistically(stats.accreditationTotal, 12);

    const datasets = [
      {
        label: "Équivalences",
        data: equivalenceData,
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "#3B82F6",
        borderWidth: isMobile ? 1 : 2,
        borderRadius: 4,
        hoverBackgroundColor: "#2563EB",
        hoverBorderColor: "#1D4ED8",
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
      {
        label: "Accréditations",
        data: accreditationData,
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "#10B981",
        borderWidth: isMobile ? 1 : 2,
        borderRadius: 4,
        hoverBackgroundColor: "#059669",
        hoverBorderColor: "#047857",
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
    ];

    const ctx = barChartRef.current.getContext("2d");
    barChartInstance.current = new Chart(ctx, {
      type: "bar",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
        plugins: {
          legend: {
            display: true,
            position: isMobile ? "bottom" : "top",
            labels: {
              usePointStyle: true,
              boxWidth: isMobile ? 8 : 10,
              padding: isMobile ? 10 : 15,
              font: {
                size: isMobile ? 10 : 12,
                family: "'Inter', sans-serif",
                weight: "500",
              },
              color: "#374151",
            },
          },
          tooltip: {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            titleColor: "#111827",
            bodyColor: "#374151",
            borderColor: "#E5E7EB",
            borderWidth: 1,
            padding: isMobile ? 12 : 16,
            boxPadding: isMobile ? 6 : 8,
            titleFont: {
              size: isMobile ? 11 : 13,
              family: "'Inter', sans-serif",
              weight: "600",
            },
            bodyFont: {
              size: isMobile ? 11 : 13,
              family: "'Inter', sans-serif",
            },
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.parsed.y} dossiers`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.05)",
              drawBorder: false,
            },
            ticks: {
              font: {
                size: isMobile ? 8 : 11,
                family: "'Inter', sans-serif",
              },
              maxRotation: isMobile ? 45 : 45,
              autoSkip: true,
              maxTicksLimit: isMobile ? 6 : 12,
              color: "#6B7280",
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: isMobile ? 8 : 11,
                family: "'Inter', sans-serif",
              },
              color: "#6B7280",
              stepSize: Math.max(1, Math.ceil(Math.max(...equivalenceData, ...accreditationData) / 10)),
              callback: function(value) {
                return Number.isInteger(value) ? value : '';
              }
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
              drawBorder: false,
            },
            title: {
              display: !isMobile,
              text: "Nombre de dossiers",
              font: {
                size: 12,
                family: "'Inter', sans-serif",
                weight: "500",
              },
              color: "#4B5563",
              padding: { top: 10, bottom: 10 }
            },
          },
        },
      },
    });
  };

  const initializePieChart = (stats) => {
    if (!pieChartRef.current) return;

    // Données pour le diagramme circulaire basées sur les données filtrées
    const equivalenceCount = stats.equivalenceTotal;
    const accreditationCount = stats.accreditationTotal;
    const total = equivalenceCount + accreditationCount;

    if (total === 0) {
      // Si pas de données, afficher un message
      const ctx = pieChartRef.current.getContext("2d");
      pieChartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Aucune donnée"],
          datasets: [
            {
              data: [1],
              backgroundColor: ["#E5E7EB"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
          },
        },
      });
      return;
    }

    const percentageEquivalence = total > 0 ? Math.round((equivalenceCount / total) * 100) : 0;
    const percentageAccreditation = total > 0 ? Math.round((accreditationCount / total) * 100) : 0;

    const labelsWithPercent = [
      `Équivalences (${percentageEquivalence}%)`,
      `Accréditations (${percentageAccreditation}%)`
    ];

    const ctx = pieChartRef.current.getContext("2d");
    pieChartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labelsWithPercent,
        datasets: [
          {
            data: [equivalenceCount, accreditationCount],
            backgroundColor: [
              "rgba(59, 130, 246, 0.8)",
              "rgba(16, 185, 129, 0.8)"
            ],
            borderColor: [
              "#3B82F6",
              "#10B981"
            ],
            borderWidth: isMobile ? 2 : 3,
            hoverBackgroundColor: [
              "#2563EB",
              "#059669"
            ],
            hoverBorderColor: [
              "#1D4ED8",
              "#047857"
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
        cutout: isMobile ? "60%" : "65%",
        plugins: {
          legend: {
            position: isMobile ? "bottom" : "right",
            labels: {
              boxWidth: isMobile ? 10 : 12,
              font: {
                size: isMobile ? 10 : 12,
                family: "'Inter', sans-serif",
                weight: "500",
              },
              padding: isMobile ? 8 : 15,
              color: "#374151",
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            titleColor: "#111827",
            bodyColor: "#374151",
            borderColor: "#E5E7EB",
            borderWidth: 1,
            padding: isMobile ? 12 : 16,
            boxPadding: isMobile ? 6 : 8,
            titleFont: {
              size: isMobile ? 11 : 13,
              family: "'Inter', sans-serif",
              weight: "600",
            },
            bodyFont: {
              size: isMobile ? 11 : 13,
              family: "'Inter', sans-serif",
            },
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                return `${label.split(" (")[0]}: ${value} dossiers (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  };

  const getDateFilterTitle = () => {
    if (dateFilter.startDate && dateFilter.endDate) {
      const start = new Date(dateFilter.startDate);
      const end = new Date(dateFilter.endDate);
      return `${start.toLocaleDateString("fr-FR")} - ${end.toLocaleDateString("fr-FR")}`;
    } else if (dateFilter.startDate) {
      const start = new Date(dateFilter.startDate);
      return `À partir du ${start.toLocaleDateString("fr-FR")}`;
    } else if (dateFilter.endDate) {
      const end = new Date(dateFilter.endDate);
      return `Jusqu'au ${end.toLocaleDateString("fr-FR")}`;
    } else {
      return "Toutes les périodes";
    }
  };

  const applyPresetFilter = (preset) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let startDate = null;
    let endDate = now.toISOString().split("T")[0];

    switch (preset) {
      case "today":
        startDate = today.toISOString().split("T")[0];
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = yesterday.toISOString().split("T")[0];
        endDate = yesterday.toISOString().split("T")[0];
        break;
      case "week":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 7);
        startDate = weekStart.toISOString().split("T")[0];
        break;
      case "month":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate = monthStart.toISOString().split("T")[0];
        break;
      case "year":
        const yearStart = new Date(today.getFullYear(), 0, 1);
        startDate = yearStart.toISOString().split("T")[0];
        break;
      case "all":
        startDate = null;
        endDate = null;
        break;
    }

    setDateFilter({ startDate, endDate });
    setShowDatePicker(false);
    setDatePickerMode("presets");
  };

  const resetFilter = () => {
    setDateFilter({ startDate: null, endDate: null });
    setShowDatePicker(false);
  };

  const DatePicker = () => (
    <div className={`absolute ${isMobile ? 'top-12 left-0 right-0' : 'top-10 right-0'} bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 min-w-64 sm:min-w-80 max-h-[90vh] overflow-y-auto`}>
      {datePickerMode === "presets" ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900 text-sm sm:text-base">
              Filtrer par période
            </h4>
            <button
              onClick={() => setDatePickerMode("custom")}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Période personnalisée
            </button>
          </div>

          <div className="space-y-1">
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-xs sm:text-sm text-gray-700"
              onClick={() => applyPresetFilter("today")}
            >
              Aujourd'hui
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-xs sm:text-sm text-gray-700"
              onClick={() => applyPresetFilter("yesterday")}
            >
              Hier
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-xs sm:text-sm text-gray-700"
              onClick={() => applyPresetFilter("week")}
            >
              7 derniers jours
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-xs sm:text-sm text-gray-700"
              onClick={() => applyPresetFilter("month")}
            >
              Ce mois-ci
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-xs sm:text-sm text-gray-700"
              onClick={() => applyPresetFilter("year")}
            >
              Cette année
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-xs sm:text-sm text-gray-700"
              onClick={() => applyPresetFilter("all")}
            >
              Toutes les périodes
            </button>
          </div>

          {(dateFilter.startDate || dateFilter.endDate) && (
            <button
              onClick={resetFilter}
              className="w-full mt-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs sm:text-sm"
            >
              Effacer le filtre
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900 text-sm sm:text-base">
              Période personnalisée
            </h4>
            <button
              onClick={() => setDatePickerMode("presets")}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              ← Retour
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Date de début
              </label>
              <input
                type="date"
                value={dateFilter.startDate || ""}
                onChange={(e) =>
                  setDateFilter((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs sm:text-sm"
                max={
                  dateFilter.endDate || new Date().toISOString().split("T")[0]
                }
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                value={dateFilter.endDate || ""}
                onChange={(e) =>
                  setDateFilter((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs sm:text-sm"
                min={dateFilter.startDate}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShowDatePicker(false)}
              className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs sm:text-sm hover:bg-blue-700"
            >
              Appliquer
            </button>
            <button
              onClick={() => setShowDatePicker(false)}
              className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs sm:text-sm hover:bg-gray-300"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const totalPages = Math.max(1, Math.ceil(filteredTotalCount / pageSize));

  const getDisplayStatus = (status) => {
    const statusMap = {
      en_cours: "En cours",
      octroyé: "Octroyé",
      rejeté: "Rejeté",
      ajourné: "Ajourné",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "en_cours":
        return "bg-blue-100 text-blue-800";
      case "octroyé":
        return "bg-green-100 text-green-800";
      case "rejeté":
        return "bg-red-100 text-red-800";
      case "ajourné":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const SortIcon = ({ isSorted, isAsc }) => {
    if (!isSorted) {
      return <FaArrowsAltV className="w-2 h-2 sm:w-3 sm:h-3 text-gray-400" />;
    }
    return isAsc ? (
      <FaArrowUp className="w-2 h-2 sm:w-3 sm:h-3 text-blue-600" />
    ) : (
      <FaArrowDown className="w-2 h-2 sm:w-3 sm:h-3 text-blue-600" />
    );
  };

  const handleSortClick = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleKPIClick = (type) => {
    setTableFilterType(tableFilterType === type ? "all" : type);
    setCurrentPage(1);
  };

  // Nettoyage des graphiques
  useEffect(() => {
    return () => {
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
        lineChartInstance.current = null;
      }
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
        barChartInstance.current = null;
      }
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
        pieChartInstance.current = null;
      }
    };
  }, []);

  // Rendu des cartes KPI de manière responsive
  const renderKpiCards = (stats, type) => {
    const gridCols = isMobile 
      ? "grid-cols-2" 
      : stats.length > 5 ? "grid-cols-2 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-5";

    return (
      <div className={`grid ${gridCols} gap-3 sm:gap-4`}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => type === 'equivalence' ? handleKPIClick("Équivalence") : handleKPIClick("Accréditation")}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  {stat.title}
                </p>
                <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2 truncate">
                  {stat.value}
                </p>
                <div className="flex items-center mt-1 sm:mt-3">
                  {stat.trend === "up" ? (
                    <FaChevronUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 flex-shrink-0" />
                  ) : stat.trend === "down" ? (
                    <FaChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mr-1 flex-shrink-0" />
                  ) : (
                    <span className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-gray-400 flex-shrink-0">●</span>
                  )}
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      stat.trend === "up" 
                        ? "text-green-600" 
                        : stat.trend === "down" 
                        ? "text-red-600" 
                        : "text-gray-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-2 sm:p-3 rounded-lg ml-2 flex-shrink-0`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-4 sm:pb-8 font-sans text-gray-900">
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 truncate">
            Dashboard SAE
          </h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            {mobileMenuOpen ? (
              <FaTimes className="h-5 w-5 text-gray-600" />
            ) : (
              <FaBars className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      )}

      <div className="px-3 sm:px-4 md:px-6 space-y-4 sm:space-y-5">
        {/* Header */}
        <div className={`${isMobile ? 'hidden' : 'flex flex-col md:flex-row md:items-center justify-between gap-3'}`}>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Tableau de bord SAE
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Gestion des demandes d'équivalence et d'accréditation
            </p>
          </div>
          <div className="relative">
            <button
              className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm hover:bg-gray-50 bg-white w-full md:w-auto justify-center"
              onClick={() => {
                setShowDatePicker(!showDatePicker);
                setDatePickerMode("presets");
              }}
            >
              <FaCalendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <span className="text-xs sm:text-sm truncate max-w-[200px]">
                {getDateFilterTitle()}
              </span>
              {(dateFilter.startDate || dateFilter.endDate) && (
                <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
              )}
            </button>
            {showDatePicker && <DatePicker />}
          </div>
        </div>

        {/* Mobile Header with Filter Button */}
        {isMobile && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                {filteredReports.length} dossiers
              </p>
            </div>
            <div className="relative">
              <button
                className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white"
                onClick={() => {
                  setShowDatePicker(!showDatePicker);
                  setDatePickerMode("presets");
                }}
              >
                <FaCalendar className="w-3 h-3 text-gray-500" />
                <span className="text-xs">Filtre</span>
                {(dateFilter.startDate || dateFilter.endDate) && (
                  <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </button>
              {showDatePicker && <DatePicker />}
            </div>
          </div>
        )}

        {/* Indicateur de filtre actif */}
        {(dateFilter.startDate || dateFilter.endDate) && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 sm:p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-blue-600 text-xs sm:text-sm truncate">
                  Filtre actif : {getDateFilterTitle()}
                </span>
              </div>
              <button
                onClick={resetFilter}
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex-shrink-0 ml-2"
              >
                Effacer
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        {isMobile && mobileMenuOpen && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Navigation rapide</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg">
                  Équivalences
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">
                  Accréditations
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">
                  Graphiques
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">
                  Liste des dossiers
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section 1: Cartes Équivalences */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm sm:shadow border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg mr-3 sm:mr-4">
                <FaFileAlt className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                  Équivalence
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Gestion des demandes d'équivalence
                </p>
              </div>
            </div>

            {renderKpiCards(equivalenceStats, 'equivalence')}
          </div>
        </div>

        {/* Section 2: Cartes Accréditations */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm sm:shadow border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg mr-3 sm:mr-4">
                <FaGraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                  Accréditations
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Gestion des demandes d'accréditation
                </p>
              </div>
            </div>

            {renderKpiCards(accreditationStats, 'accreditation')}
          </div>
        </div>

        {/* Section 3: Diagramme en courbe principal */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm sm:shadow border border-gray-200 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">
                  Évolution mensuelle des demandes
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Tendance sur 12 mois
                </p>
              </div>
              {isChartInitializing && (
                <div className="animate-pulse text-blue-500 text-xs sm:text-sm flex items-center flex-shrink-0">
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-500 mr-1 sm:mr-2"></div>
                  <span className="hidden sm:inline">Chargement...</span>
                </div>
              )}
            </div>

            <div className="h-56 sm:h-64 md:h-72 w-full relative bg-white rounded">
              <canvas ref={lineChartRef} />
              {isChartInitializing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Chargement du graphique...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Les deux autres diagrammes en 2 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Diagramme en barres */}
          <div className="bg-white rounded-lg shadow-sm sm:shadow border border-gray-200 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                  Répartition mensuelle
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                  Équivalences & Accréditations
                </p>
              </div>
              <FaChartBar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 flex-shrink-0" />
            </div>

            <div className="h-56 sm:h-64 md:h-72 w-full relative bg-white rounded">
              <canvas ref={barChartRef} />
              {isChartInitializing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Chargement...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Diagramme circulaire */}
          <div className="bg-white rounded-lg shadow-sm sm:shadow border border-gray-200 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                  Répartition des demandes
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                  Équivalences vs Accréditations
                </p>
              </div>
              <FaChartPie className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
            </div>

            <div className="h-56 sm:h-64 md:h-72 w-full relative bg-white rounded">
              <canvas ref={pieChartRef} />
              {isChartInitializing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Chargement...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tableau avec pagination */}
        <div className="bg-white rounded-lg shadow-sm sm:shadow border border-gray-200 overflow-hidden">
          {/* Header table */}
          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 bg-white">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-800 text-xs sm:text-sm md:text-base">
                Liste des dossiers
              </h3>
              {tableFilterType !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                  <span className="truncate max-w-[80px] sm:max-w-none">
                    {tableFilterType}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTableFilterType("all")}
                    className="ml-0.5 p-0.5 hover:bg-blue-100 rounded-full flex-shrink-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </span>
              )}
            </div>

            {/* Sélecteur de lignes */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-gray-500 text-xs hidden sm:inline">Lignes :</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="form-select text-xs border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 py-1 px-1 sm:px-2 bg-gray-50"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Content table - Version mobile en cartes */}
          {isMobile ? (
            <div className="divide-y divide-gray-100">
              {paginatedReports.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <span className="text-3xl mb-1">🔍</span>
                    <p className="text-xs">Aucun dossier trouvé pour ce filtre.</p>
                  </div>
                </div>
              ) : (
                paginatedReports.map((report) => (
                  <div key={report.id} className="p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {report.dossier}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}
                      >
                        {getDisplayStatus(report.status)}
                      </span>
                    </div>
                    <div className="flex items-center mb-1">
                      <FaUserCircle className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-800 truncate">
                        {report.demandeur}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{report.type} • {report.niveau}</span>
                      <span>{new Date(report.date).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Version desktop en tableau */
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-100 text-xs">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSortClick("dossier")}
                        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                      >
                        <span>N° DOSSIER</span>
                        <SortIcon
                          isSorted={sortConfig.key === "dossier"}
                          isAsc={sortConfig.direction === "asc"}
                        />
                      </button>
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSortClick("demandeur")}
                        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                      >
                        <span>DEMANDEUR</span>
                        <SortIcon
                          isSorted={sortConfig.key === "demandeur"}
                          isAsc={sortConfig.direction === "asc"}
                        />
                      </button>
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      TYPE
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSortClick("date")}
                        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                      >
                        <span>DATE</span>
                        <SortIcon
                          isSorted={sortConfig.key === "date"}
                          isAsc={sortConfig.direction === "asc"}
                        />
                      </button>
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      NIVEAU
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      STATUT
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedReports.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <span className="text-3xl mb-1">🔍</span>
                          <p className="text-xs">
                            Aucun dossier trouvé pour ce filtre.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedReports.map((report) => (
                      <tr
                        key={report.id}
                        className="hover:bg-blue-50/30 transition-colors group cursor-default"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-mono text-xs bg-gray-100 px-3 py-1 rounded inline-block">
                            {report.dossier}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaUserCircle className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                            <div className="truncate max-w-[200px]">
                              <div className="font-medium text-gray-800 text-xs">
                                {report.demandeur}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-gray-800 text-xs">
                            {report.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-600 text-xs">
                          {new Date(report.date).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-gray-800 text-xs font-medium">
                            {report.niveau}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}
                          >
                            {getDisplayStatus(report.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer pagination */}
          <div className="bg-white px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-100 flex justify-end">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                <FaAngleLeft className="w-3 h-3" />
              </button>

              {/* Affichage des numéros de page */}
              <div className="flex items-center gap-1 mx-1 sm:mx-2">
                {Array.from({ length: Math.min(isMobile ? 3 : 5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= (isMobile ? 3 : 5)) {
                    pageNum = i + 1;
                  } else if (currentPage <= (isMobile ? 2 : 3)) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - (isMobile ? 1 : 2)) {
                    pageNum = totalPages - (isMobile ? 2 : 4) + i;
                  } else {
                    pageNum = currentPage - (isMobile ? 1 : 2) + i;
                  }

                  return pageNum <= totalPages ? (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-2 sm:px-2.5 py-1 text-xs border rounded ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white hover:bg-gray-50 border-gray-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ) : null;
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                <FaAngleRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Indicateur de nombre total de dossiers */}
        <div className="text-xs text-gray-500 text-right">
          Total : {filteredTotalCount} dossiers
        </div>
      </div>
    </div>
  );
};

export default DashboardSaeView;