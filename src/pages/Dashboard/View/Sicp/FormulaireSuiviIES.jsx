import React, { useState } from "react";
import {
  FaUniversity, FaPlus, FaArrowLeft, FaArrowRight, FaChevronLeft, FaChevronRight,
  FaSearch, FaSort, FaSortUp, FaSortDown, FaTrash,
  FaExclamationTriangle, FaCalendarAlt, FaEdit, FaCheck,
  FaBuilding, FaUsers, FaFlask, FaAward
} from "react-icons/fa";

import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "http://localhost:8000/api/suivi-ies";

const ITEMS_PER_PAGE = 5;

const formatDate = (d) => {
  if (!d) return "";
  const [a, m, j] = d.split('-');
  return `${j}-${m}-${a}`;
};

// ─── 6 ÉTAPES EXACTES DE L'EXCEL ─────────────────────────────────────────
const steps = [
  { title: "Informations\nGénérales",     icon: <FaUniversity /> },
  { title: "Politique de\nFormation",      icon: <FaAward /> },
  { title: "Gouvernance\net Gestion",      icon: <FaBuilding /> },
  { title: "Ressources\nHumaines",         icon: <FaUsers /> },
  { title: "Infrastructure\net Équipements", icon: <FaFlask /> },
  { title: "Recherche &\nConformité",      icon: <FaCheck /> },
];

const initForm = {
  // I
  nom:"", province:"", region:"", statut:"", adresse:"", responsable:"",
  domaines:"", mentions:"", parcours:"", grade:"", annee_habilitation:"",
  arrete_habilitation:"", annee_accreditation:"", arrete_accreditation:"",
  // II
  q13:"", q14:"", q15:"", q16:"", q17:"", q18:"", q19:"", q20:"", q21:"",
  q22:"", q23:"", nb_etudiants:"", nb_diplomes:"", taux_reussite:"",
  taux_abandon:"", observations_formation:"", q28:"", q29:"", q30:"",
  q31:"", nb_ouvrages:"", salle_informatique:"", internet:"", nb_ordinateurs:"",
  // III
  q36:"", organigramme:"",
  // IV
  nb_enseignants:"", permanents:"", vacataires:"", professeurs:"",
  docteurs:"", assistants:"", ratio_etudiant_enseignant:"", observations_rh:"",
  // V
  nb_salles:"", etat_infra:"", parking:"", espace_vert:"", labo_fonctionnel:"",
  etat_labo:"", disponibilite_materiels:"", observations_infra:"",
  // VI
  nb_publications:"", projets_recherche:"", observations_recherche:"",
  conformite:"", recommandations:"",
};

export default function FormulaireSuiviIES() {
  const [page, setPage] = useState(1);
  const [universites, setUniversites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [universiteSelectionnee, setUniversiteSelectionnee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initForm);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // ─── CHARGEMENT DES DONNÉES ───────────────────────────────────────────────
  const fetchUniversites = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/`);
      setUniversites(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
      toast.error("Erreur de connexion au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUniversites();
  }, []);

  // ─── FILTRES ─────────────────────────────────────────────────────────────
  const filtered = universites.filter(u => {
    const t = searchTerm.toLowerCase();
    const ok = u.id?.toString().includes(t) || u.nom?.toLowerCase().includes(t) ||
      u.province?.toLowerCase().includes(t) || u.region?.toLowerCase().includes(t) ||
      (u.dateVisite && formatDate(u.dateVisite).includes(t));
    let dateOk = true;
    if (dateDebut || dateFin) {
      const d = new Date(u.dateVisite).getTime();
      dateOk = d >= (dateDebut ? new Date(dateDebut).getTime() : 0) &&
               d <= (dateFin  ? new Date(dateFin).getTime()  : Infinity);
    }
    return ok && dateOk;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortConfig.key === 'id')        return sortConfig.direction === 'asc' ? a.id - b.id : b.id - a.id;
    if (sortConfig.key === 'nom')       return sortConfig.direction === 'asc' ? a.nom.localeCompare(b.nom) : b.nom.localeCompare(a.nom);
    if (sortConfig.key === 'dateVisite') return sortConfig.direction === 'asc' ? new Date(a.dateVisite)-new Date(b.dateVisite) : new Date(b.dateVisite)-new Date(a.dateVisite);
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE) || 1;
  const paginated  = sorted.slice((currentPage-1)*ITEMS_PER_PAGE, currentPage*ITEMS_PER_PAGE);

  const handleSort = (key) => {
    setSortConfig(s => ({ key, direction: s.key===key && s.direction==='asc' ? 'desc' : 'asc' }));
    setCurrentPage(1);
  };
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="opacity-30 text-gray-400" />;
    return sortConfig.direction === 'asc' ? <FaSortUp className="text-blue-500" /> : <FaSortDown className="text-blue-500" />;
  };

  const triggerDelete = (id) => { setItemToDelete(id); setIsDeleteModalOpen(true); };
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/${itemToDelete}`);
      setUniversites(u => u.filter(x => x.id !== itemToDelete));
      if (paginated.length === 1 && currentPage > 1) setCurrentPage(p => p-1);
      toast.success("Évaluation supprimée avec succès.");
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error("Erreur lors de la suppression.");
    } finally {
      setIsDeleteModalOpen(false); setItemToDelete(null);
    }
  };

  const openForm = (univ = null) => {
    setUniversiteSelectionnee(univ);
    setCurrentStep(0); setErrors({});
    if (univ) {
      // Load all properties to formData, falling back to empty string for null values
      const loadedData = { ...initForm };
      Object.keys(initForm).forEach(key => {
        loadedData[key] = univ[key] !== null && univ[key] !== undefined ? univ[key] : "";
      });
      setFormData(loadedData);
    } else {
      setFormData(initForm);
    }
    setPage(2);
  };

  const handleChange = (f, v) => {
    setFormData(p => ({ ...p, [f]: v }));
    if (errors[f]) setErrors(p => ({ ...p, [f]: "" }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!formData.nom.trim())        e.nom = "Obligatoire";
      if (!formData.province.trim())   e.province = "Obligatoire";
      if (!formData.region.trim())     e.region = "Obligatoire";
      if (!formData.statut)            e.statut = "Obligatoire";
      if (!formData.adresse.trim())    e.adresse = "Obligatoire";
      if (!formData.responsable.trim()) e.responsable = "Obligatoire";
    }
    if (s === 5) {
      if (!formData.conformite)         e.conformite = "Obligatoire";
      if (!formData.recommandations.trim()) e.recommandations = "Obligatoire";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validateStep(currentStep) && currentStep < steps.length-1) setCurrentStep(s => s+1); };
  const prevStep = () => { if (currentStep > 0) setCurrentStep(s => s-1); };
  
  const handleSubmit = async () => { 
    if (!validateStep(currentStep)) return; 
    
    setIsSubmitting(true);
    try {
      // Nettoyer les données (remplacer les chaînes vides par null pour certains types si nécessaire, 
      // ou laisser string vide. Pydantic va gérer selon le schéma.)
      const payload = { ...formData };
      
      // Conversion des types si besoin
      ["nb_etudiants", "nb_diplomes", "taux_reussite", "taux_abandon", "nb_ouvrages", 
       "nb_ordinateurs", "nb_enseignants", "permanents", "vacataires", "professeurs", 
       "docteurs", "assistants", "nb_salles", "nb_publications"].forEach(key => {
        if (payload[key] === "") {
          payload[key] = null;
        } else if (payload[key] !== null) {
          payload[key] = Number(payload[key]);
        }
      });

      if (universiteSelectionnee) {
        await axios.put(`${API_BASE_URL}/${universiteSelectionnee.id}`, payload);
        toast.success("Évaluation mise à jour avec succès.");
      } else {
        await axios.post(`${API_BASE_URL}/`, payload);
        toast.success("Nouvelle évaluation créée avec succès.");
      }
      
      await fetchUniversites();
      setPage(1);
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      toast.error("Erreur lors de l'enregistrement. Vérifiez les champs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── BADGE ───────────────────────────────────────────────────────────────
  const BadgeConformite = ({ status }) => {
    const map = {
      "Conforme":     { c: "bg-green-50 text-green-700 border-green-200",  d: "bg-green-500" },
      "Partiellement":{ c: "bg-yellow-50 text-yellow-700 border-yellow-200", d: "bg-yellow-500" },
      "Non conforme": { c: "bg-red-50 text-red-700 border-red-200",        d: "bg-red-500" },
    };
    const { c = "bg-gray-100 text-gray-600 border-gray-200", d = "bg-gray-400" } = map[status] || {};
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${c}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${d}`} />{status || "En cours"}
      </span>
    );
  };

  // ─── HELPERS UI ──────────────────────────────────────────────────────────
  const inp = (f) => `w-full px-3 py-3 border rounded-lg text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[f] ? "border-red-400 bg-red-50 focus:ring-red-200" : "border-gray-300 hover:border-gray-400 bg-white"}`;

  const Lbl = ({ f, children }) => (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {children}{["nom","province","region","statut","adresse","responsable","conformite","recommandations"].includes(f) && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  const ErrMsg = ({ f }) => errors[f] ? (
    <p className="flex items-center gap-1 text-red-500 text-xs mt-1"><FaExclamationTriangle size={9}/>{errors[f]}</p>
  ) : null;

  // Oui/Non radio
  const OuiNon = ({ field, label, options = ["Oui","Non"] }) => (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <div className="flex gap-6">
        {options.map(o => (
          <label key={o} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name={field} value={o} checked={formData[field]===o} onChange={e => handleChange(field, e.target.value)} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">{o}</span>
          </label>
        ))}
      </div>
    </div>
  );

  // ─── CONTENU DES ÉTAPES ──────────────────────────────────────────────────
  const renderStep = () => {
    switch (currentStep) {

      // ── ÉTAPE 1 : INFORMATIONS GÉNÉRALES ──
      case 0: return (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-100 pb-4">I. Informations Générales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Lbl f="nom">1. Nom de l'Université</Lbl>
              <input type="text" value={formData.nom} onChange={e=>handleChange("nom",e.target.value)} className={inp("nom")} placeholder="Ex: Université d'Antananarivo" />
              <ErrMsg f="nom"/>
            </div>
            <div>
              <Lbl f="province">Province</Lbl>
              <input type="text" value={formData.province} onChange={e=>handleChange("province",e.target.value)} className={inp("province")} placeholder="Ex: Antananarivo" />
              <ErrMsg f="province"/>
            </div>
            <div>
              <Lbl f="region">Région</Lbl>
              <input type="text" value={formData.region} onChange={e=>handleChange("region",e.target.value)} className={inp("region")} placeholder="Ex: Analamanga" />
              <ErrMsg f="region"/>
            </div>
            <div className="md:col-span-2">
              <Lbl f="statut">2. Statut Juridique</Lbl>
              <div className="flex gap-8">
                {["Publique","Privé"].map(v => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="statut" value={v} checked={formData.statut===v} onChange={e=>handleChange("statut",e.target.value)} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-gray-700">{v}</span>
                  </label>
                ))}
              </div>
              <ErrMsg f="statut"/>
            </div>
            <div className="md:col-span-2">
              <Lbl f="adresse">3. Adresse</Lbl>
              <input type="text" value={formData.adresse} onChange={e=>handleChange("adresse",e.target.value)} className={inp("adresse")} placeholder="Ex: Lot II A 45, Antananarivo 101" />
              <ErrMsg f="adresse"/>
            </div>
            <div>
              <Lbl f="responsable">4. Nom du Responsable</Lbl>
              <input type="text" value={formData.responsable} onChange={e=>handleChange("responsable",e.target.value)} className={inp("responsable")} placeholder="Ex: Pr. RAZAFY Jean" />
              <ErrMsg f="responsable"/>
            </div>
            <div>
              <Lbl f="domaines">5. Domaines</Lbl>
              <input type="text" value={formData.domaines} onChange={e=>handleChange("domaines",e.target.value)} className={inp("domaines")} placeholder="Ex: Sciences, Droit" />
            </div>
            <div>
              <Lbl f="mentions">6. Mentions</Lbl>
              <input type="text" value={formData.mentions} onChange={e=>handleChange("mentions",e.target.value)} className={inp("mentions")} placeholder="Ex: Informatique, Gestion" />
            </div>
            <div>
              <Lbl f="parcours">7. Parcours</Lbl>
              <input type="text" value={formData.parcours} onChange={e=>handleChange("parcours",e.target.value)} className={inp("parcours")} placeholder="Ex: Licence Pro" />
            </div>
            <div className="md:col-span-2">
              <Lbl f="grade">8. Grade</Lbl>
              <div className="flex gap-8">
                {["Licence","Master"].map(v => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="grade" value={v} checked={formData.grade===v} onChange={e=>handleChange("grade",e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">{v}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Lbl f="annee_habilitation">9. Année d'habilitation</Lbl>
              <input type="text" value={formData.annee_habilitation} onChange={e=>handleChange("annee_habilitation",e.target.value)} className={inp("annee_habilitation")} placeholder="Ex: 2018" />
            </div>
            <div>
              <Lbl f="arrete_habilitation">10. Arrêté d'habilitation</Lbl>
              <input type="text" value={formData.arrete_habilitation} onChange={e=>handleChange("arrete_habilitation",e.target.value)} className={inp("arrete_habilitation")} placeholder="N° Arrêté" />
            </div>
            <div>
              <Lbl f="annee_accreditation">11. Année d'accréditation</Lbl>
              <input type="text" value={formData.annee_accreditation} onChange={e=>handleChange("annee_accreditation",e.target.value)} className={inp("annee_accreditation")} placeholder="Ex: 2020" />
            </div>
            <div>
              <Lbl f="arrete_accreditation">12. Arrêté d'accréditation</Lbl>
              <input type="text" value={formData.arrete_accreditation} onChange={e=>handleChange("arrete_accreditation",e.target.value)} className={inp("arrete_accreditation")} placeholder="N° Arrêté" />
            </div>
          </div>
        </div>
      );

      // ── ÉTAPE 2 : POLITIQUE DE FORMATION ──
      case 1: return (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-100 pb-4">II. Politique de Formation</h3>
          <div className="space-y-5">
            <OuiNon field="q13" label="13. L'institution tient compte des besoins du développement local, régional et national dans la définition des objectifs et des contenus de ses offres de formation." />
            <OuiNon field="q14" label="14. Existence de partenariat avec les milieux économiques et les autorités dans l'élaboration de l'offre." />
            <OuiNon field="q15" label="15. Alignement de la formation avec le LMD." />
            <OuiNon field="q16" label="16. Révision régulière des programmes." />
            <OuiNon field="q17" label="17. L'institution met en œuvre un dispositif d'accueil des étudiants." />
            <OuiNon field="q18" label="18. Publication des conditions et procédures d'admission." />
            <OuiNon field="q19" label="19. Publication de guides présentant les objectifs, les parcours et les programmes de formation." />
            <OuiNon field="q20" label="20. Service d'information et d'orientation." />
            <OuiNon field="q21" label="21. Dispositifs d'accueil des étudiants à tous les niveaux (LMD)." />
            <OuiNon field="q22" label="22. L'institution met en œuvre un dispositif de pilotage de la formation conforme aux normes." />
            <OuiNon field="q23" label="23. Existence d'un dispositif d'accompagnement de l'étudiant en Licence, Master et Doctorat." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-gray-100">
              <div>
                <Lbl f="nb_etudiants">24. Nombre d'étudiants</Lbl>
                <input type="number" value={formData.nb_etudiants} onChange={e=>handleChange("nb_etudiants",e.target.value)} className={inp("nb_etudiants")} placeholder="Ex: 5000" />
              </div>
              <div>
                <Lbl f="nb_diplomes">25. Nombre de diplômés</Lbl>
                <input type="number" value={formData.nb_diplomes} onChange={e=>handleChange("nb_diplomes",e.target.value)} className={inp("nb_diplomes")} placeholder="Ex: 1200" />
              </div>
              <div>
                <Lbl f="taux_reussite">26. Taux de réussite (%)</Lbl>
                <input type="number" min="0" max="100" value={formData.taux_reussite} onChange={e=>handleChange("taux_reussite",e.target.value)} className={inp("taux_reussite")} placeholder="Ex: 78" />
              </div>
              <div>
                <Lbl f="taux_abandon">26. Taux d'abandon (%)</Lbl>
                <input type="number" min="0" max="100" value={formData.taux_abandon} onChange={e=>handleChange("taux_abandon",e.target.value)} className={inp("taux_abandon")} placeholder="Ex: 12" />
              </div>
              <div className="md:col-span-2">
                <Lbl f="observations_formation">27. Observations</Lbl>
                <textarea rows={3} value={formData.observations_formation} onChange={e=>handleChange("observations_formation",e.target.value)} className={`${inp("observations_formation")} resize-none`} placeholder="Écrire les observations..." />
              </div>
            </div>
            <OuiNon field="q28" label="28. Existence de stages et employabilités." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Lbl f="q29">29. Existence d'un dispositif de suivi des diplômés</Lbl>
                <input type="text" value={formData.q29} onChange={e=>handleChange("q29",e.target.value)} className={inp("q29")} placeholder="Décrire..." />
              </div>
              <div>
                <Lbl f="q30">30. Existence d'une structure d'Assurance Qualité</Lbl>
                <input type="text" value={formData.q30} onChange={e=>handleChange("q30",e.target.value)} className={inp("q30")} placeholder="Décrire..." />
              </div>
              <div>
                <Lbl f="q31">31. Existence d'un centre de documentation</Lbl>
                <input type="text" value={formData.q31} onChange={e=>handleChange("q31",e.target.value)} className={inp("q31")} placeholder="Décrire..." />
              </div>
              <div>
                <Lbl f="nb_ouvrages">32. Nombre d'ouvrages</Lbl>
                <input type="number" value={formData.nb_ouvrages} onChange={e=>handleChange("nb_ouvrages",e.target.value)} className={inp("nb_ouvrages")} placeholder="Ex: 3000" />
              </div>
              <div>
                <Lbl f="salle_informatique">33. Salle Informatique</Lbl>
                <input type="text" value={formData.salle_informatique} onChange={e=>handleChange("salle_informatique",e.target.value)} className={inp("salle_informatique")} placeholder="Nombre / Description" />
              </div>
              <div>
                <Lbl f="internet">34. Connexion Internet</Lbl>
                <input type="text" value={formData.internet} onChange={e=>handleChange("internet",e.target.value)} className={inp("internet")} placeholder="Ex: Fibre, 100 Mbps" />
              </div>
              <div>
                <Lbl f="nb_ordinateurs">35. Nombre d'ordinateurs</Lbl>
                <input type="number" value={formData.nb_ordinateurs} onChange={e=>handleChange("nb_ordinateurs",e.target.value)} className={inp("nb_ordinateurs")} placeholder="Ex: 50" />
              </div>
            </div>
          </div>
        </div>
      );

      // ── ÉTAPE 3 : GOUVERNANCE ET GESTION ──
      case 2: return (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-100 pb-4">III. Gouvernance et Gestion</h3>
          <div className="space-y-5">
            <OuiNon field="q36" label="36. Existence d'un plan stratégique." />
            <div>
              <Lbl f="organigramme">37. Organigramme</Lbl>
              <input type="text" value={formData.organigramme} onChange={e=>handleChange("organigramme",e.target.value)} className={inp("organigramme")} placeholder="Décrire / Référence du document" />
            </div>
          </div>
        </div>
      );

      // ── ÉTAPE 4 : RESSOURCES HUMAINES ──
      case 3: return (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-100 pb-4">IV. Ressources Humaines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Lbl f="nb_enseignants">38. Nombre total d'enseignants</Lbl>
              <input type="number" value={formData.nb_enseignants} onChange={e=>handleChange("nb_enseignants",e.target.value)} className={inp("nb_enseignants")} placeholder="Ex: 120" />
            </div>
            <div>
              <Lbl f="permanents">39. Permanents</Lbl>
              <input type="number" value={formData.permanents} onChange={e=>handleChange("permanents",e.target.value)} className={inp("permanents")} placeholder="Ex: 80" />
            </div>
            <div>
              <Lbl f="vacataires">39. Vacataires</Lbl>
              <input type="number" value={formData.vacataires} onChange={e=>handleChange("vacataires",e.target.value)} className={inp("vacataires")} placeholder="Ex: 40" />
            </div>
            <div>
              <Lbl f="professeurs">40. Professeurs</Lbl>
              <input type="number" value={formData.professeurs} onChange={e=>handleChange("professeurs",e.target.value)} className={inp("professeurs")} placeholder="Ex: 25" />
            </div>
            <div>
              <Lbl f="docteurs">41. Docteurs</Lbl>
              <input type="number" value={formData.docteurs} onChange={e=>handleChange("docteurs",e.target.value)} className={inp("docteurs")} placeholder="Ex: 30" />
            </div>
            <div>
              <Lbl f="assistants">42. Assistants</Lbl>
              <input type="number" value={formData.assistants} onChange={e=>handleChange("assistants",e.target.value)} className={inp("assistants")} placeholder="Ex: 65" />
            </div>
            <div>
              <Lbl f="ratio_etudiant_enseignant">43. Ratio Étudiants / Enseignants</Lbl>
              <input type="text" value={formData.ratio_etudiant_enseignant} onChange={e=>handleChange("ratio_etudiant_enseignant",e.target.value)} className={inp("ratio_etudiant_enseignant")} placeholder="Ex: 42:1" />
            </div>
            <div className="md:col-span-2">
              <Lbl f="observations_rh">Observations</Lbl>
              <textarea rows={3} value={formData.observations_rh} onChange={e=>handleChange("observations_rh",e.target.value)} className={`${inp("observations_rh")} resize-none`} placeholder="Écrire les observations..." />
            </div>
          </div>
        </div>
      );

      // ── ÉTAPE 5 : INFRASTRUCTURE & ÉQUIPEMENTS ──
      case 4: return (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-100 pb-4">V. Infrastructure et Équipements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Lbl f="nb_salles">44. Nombre de salles de cours</Lbl>
              <input type="number" value={formData.nb_salles} onChange={e=>handleChange("nb_salles",e.target.value)} className={inp("nb_salles")} placeholder="Ex: 20" />
            </div>
            <div className="md:col-span-2">
              <OuiNon field="etat_infra" label="45. État des infrastructures" options={["Bon","Moyen","Mauvais"]} />
            </div>
            <OuiNon field="parking" label="46. Parking" />
            <OuiNon field="espace_vert" label="47. Espace vert" />
            <OuiNon field="labo_fonctionnel" label="48. Laboratoire fonctionnel" />
            <div className="md:col-span-2">
              <OuiNon field="etat_labo" label="49. État du Laboratoire" options={["Bon","Moyen","Mauvais"]} />
            </div>
            <div className="md:col-span-2">
              <Lbl f="disponibilite_materiels">50. Disponibilité des matériels</Lbl>
              <input type="text" value={formData.disponibilite_materiels} onChange={e=>handleChange("disponibilite_materiels",e.target.value)} className={inp("disponibilite_materiels")} placeholder="Décrire..." />
            </div>
            <div className="md:col-span-2">
              <Lbl f="observations_infra">51. Observations</Lbl>
              <textarea rows={3} value={formData.observations_infra} onChange={e=>handleChange("observations_infra",e.target.value)} className={`${inp("observations_infra")} resize-none`} placeholder="Écrire les observations..." />
            </div>
          </div>
        </div>
      );

      // ── ÉTAPE 6 : RECHERCHE & CONFORMITÉ ──
      case 5: return (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-100 pb-4">VI. Recherche, Partenariat et Conformité</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Lbl f="nb_publications">52. Nombre de publications scientifiques par an</Lbl>
              <input type="number" value={formData.nb_publications} onChange={e=>handleChange("nb_publications",e.target.value)} className={inp("nb_publications")} placeholder="Ex: 15" />
            </div>
            <div>
              <Lbl f="projets_recherche">53. Projets de recherche en cours</Lbl>
              <input type="text" value={formData.projets_recherche} onChange={e=>handleChange("projets_recherche",e.target.value)} className={inp("projets_recherche")} placeholder="Ex: 3 projets" />
            </div>
            <div className="md:col-span-2">
              <Lbl f="observations_recherche">54. Observations</Lbl>
              <textarea rows={3} value={formData.observations_recherche} onChange={e=>handleChange("observations_recherche",e.target.value)} className={`${inp("observations_recherche")} resize-none`} placeholder="Écrire les observations..." />
            </div>
          </div>
          {/* Conformité */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Conformité aux recommandations <span className="text-red-500">*</span></p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { v:"Conforme",      tw:"border-green-500 bg-green-50",  tc:"text-green-700" },
                  { v:"Partiellement", tw:"border-yellow-500 bg-yellow-50", tc:"text-yellow-700" },
                  { v:"Non conforme",  tw:"border-red-500 bg-red-50",      tc:"text-red-700" },
                ].map(o => (
                  <label key={o.v} className={`flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all ${formData.conformite===o.v ? `${o.tw}` : "border-gray-200 hover:border-gray-300 bg-white"}`}>
                    <input type="radio" name="conformite" value={o.v} checked={formData.conformite===o.v} onChange={e=>handleChange("conformite",e.target.value)} className="w-4 h-4 focus:ring-blue-500" />
                    <span className={`text-sm font-semibold ${formData.conformite===o.v ? o.tc : "text-gray-700"}`}>{o.v}</span>
                  </label>
                ))}
              </div>
              <ErrMsg f="conformite"/>
            </div>
            <div>
              <Lbl f="recommandations">Recommandations pour amélioration</Lbl>
              <textarea rows={5} value={formData.recommandations} onChange={e=>handleChange("recommandations",e.target.value)} className={`${inp("recommandations")} resize-none`} placeholder="Écrire les recommandations détaillées ici..." />
              <ErrMsg f="recommandations"/>
            </div>
          </div>
        </div>
      );

      default: return null;
    }
  };

  // ─── RENDER PRINCIPAL ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white font-sans p-4 sm:p-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* MODALE */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <FaExclamationTriangle className="text-xl text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Supprimer l'évaluation ?</h3>
              <p className="text-sm text-gray-500 mb-6">Cette action est définitive et irréversible.</p>
              <div className="flex w-full gap-3">
                <button onClick={()=>setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition">Annuler</button>
                <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition">Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">

        {/* ── PAGE 1 : LISTE ── */}
        {page === 1 && (
          <div className="space-y-6 pt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Liste des universités suivies
              </h2>
              <button onClick={()=>openForm(null)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm shadow-sm transition">
                <FaPlus size={12}/> Faire un suivi
              </button>
            </div>

            {/* Filtres */}
            <div className="p-4 rounded-xl border border-gray-200 flex flex-col lg:flex-row gap-4 bg-white shadow-sm">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13}/>
                <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={e=>{setSearchTerm(e.target.value);setCurrentPage(1);}}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"/>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                  <FaCalendarAlt className="text-gray-400" size={12}/>
                  <span className="text-sm text-gray-500">Du</span>
                  <input type="date" value={dateDebut} onChange={e=>{setDateDebut(e.target.value);setCurrentPage(1);}} className="bg-transparent border-none text-sm p-0 focus:ring-0 text-gray-700"/>
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-sm text-gray-500">Au</span>
                  <input type="date" value={dateFin} onChange={e=>{setDateFin(e.target.value);setCurrentPage(1);}} className="bg-transparent border-none text-sm p-0 focus:ring-0 text-gray-700"/>
                </div>
                {(dateDebut||dateFin) && <button onClick={()=>{setDateDebut("");setDateFin("");setCurrentPage(1);}} className="text-sm text-red-500 font-medium hover:underline">Effacer</button>}
              </div>
            </div>

            {/* Tableau */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 text-center w-16" onClick={()=>handleSort('id')}>
                        <div className="flex items-center justify-center gap-1">ID {getSortIcon('id')}</div>
                      </th>
                      <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600" onClick={()=>handleSort('nom')}>
                        <div className="flex items-center gap-1">Établissement {getSortIcon('nom')}</div>
                      </th>
                      <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Province / Région</th>
                      <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600" onClick={()=>handleSort('dateVisite')}>
                        <div className="flex items-center gap-1">Date visite {getSortIcon('dateVisite')}</div>
                      </th>
                      <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Statut</th>
                      <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginated.length > 0 ? paginated.map(u => (
                      <tr key={u.id} className="hover:bg-blue-50/40 transition-colors group">
                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600 font-mono text-xs font-bold">{u.id}</span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-900">{u.nom}</td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-800 text-sm">{u.province}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{u.region}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-700">
                            <FaCalendarAlt className="text-gray-400" size={11}/>{u.dateVisite ? formatDate(u.dateVisite) : "Non définie"}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center"><BadgeConformite status={u.conformite}/></td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={()=>openForm(u)} className="p-2 bg-white border border-gray-200 hover:border-blue-500 text-blue-600 rounded-lg transition" title="Modifier"><FaEdit size={13}/></button>
                            <button onClick={()=>triggerDelete(u.id)} className="p-2 bg-white border border-gray-200 hover:border-red-500 text-red-500 rounded-lg transition" title="Supprimer"><FaTrash size={13}/></button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="6" className="px-5 py-10 text-center text-gray-500 text-sm">Aucun résultat trouvé.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50">
                <span className="text-sm text-gray-500">
                  Affichage de <strong className="text-gray-800">{sorted.length===0?0:(currentPage-1)*ITEMS_PER_PAGE+1}</strong> à <strong className="text-gray-800">{Math.min(currentPage*ITEMS_PER_PAGE,sorted.length)}</strong> sur {sorted.length}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={()=>setCurrentPage(p=>Math.max(p-1,1))} disabled={currentPage===1} className="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 bg-white"><FaChevronLeft size={11}/></button>
                  {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                    <button key={n} onClick={()=>setCurrentPage(n)} className={`w-8 h-8 rounded-md text-xs font-semibold transition ${currentPage===n?"bg-blue-600 text-white":"bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"}`}>{n}</button>
                  ))}
                  <button onClick={()=>setCurrentPage(p=>Math.min(p+1,totalPages))} disabled={currentPage===totalPages} className="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 bg-white"><FaChevronRight size={11}/></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PAGE 2 : FORMULAIRE ── */}
        {page === 2 && (
          <div className="max-w-5xl mx-auto">

            {/* TITRE SEUL — sans "Retour à la liste" au-dessus */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {universiteSelectionnee ? `Édition : ${universiteSelectionnee.nom}` : "Nouvelle Inspection"}
              </h1>
            </div>

            {/* Barre de progression */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500">Étape {currentStep+1} sur {steps.length}</span>
                <span className="text-xs font-semibold text-blue-600">{Math.round(((currentStep+1)/steps.length)*100)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="h-2 rounded-full bg-blue-600 transition-all duration-500" style={{width:`${((currentStep+1)/steps.length)*100}%`}}/>
              </div>
            </div>

            {/* Stepper 6 étapes */}
            <div className="mb-10 overflow-x-auto pb-2">
              <div className="relative min-w-[600px]">
                <div className="absolute left-0 right-0 top-[20px] h-0.5 bg-gray-100"/>
                <div className="absolute left-0 top-[20px] h-0.5 bg-blue-600 transition-all duration-500" style={{width:`${((currentStep+1)/steps.length)*100}%`}}/>
                <div className="grid grid-cols-6 gap-2 relative z-10">
                  {steps.map((step, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-all duration-300 ${
                        i < currentStep  ? "bg-green-600 border-green-600 text-white"
                        : i === currentStep ? "bg-blue-600 border-blue-600 ring-4 ring-blue-100 text-white"
                        : "bg-white border-gray-300 text-gray-400"
                      }`}>
                        {i < currentStep ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                          </svg>
                        ) : (i+1)}
                      </div>
                      <p className="mt-2 text-xs font-medium text-center leading-tight whitespace-pre-line text-gray-500 max-w-[80px]">{step.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className="mb-6">{renderStep()}</div>

            <p className="text-xs text-gray-400 mb-6">Les champs <span className="text-red-500 font-bold">*</span> sont obligatoires</p>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              {currentStep === 0 ? (
                <button type="button" onClick={()=>setPage(1)} className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                  <FaArrowLeft size={11}/> Retour à la liste
                </button>
              ) : (
                <button type="button" onClick={prevStep} className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                  <FaArrowLeft size={11}/> Précédent
                </button>
              )}
              {currentStep === steps.length-1 ? (
                <button type="button" onClick={handleSubmit} disabled={isSubmitting} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition text-sm font-medium text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
                  {isSubmitting ? (
                    <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Enregistrement...</>
                  ) : (
                    <><FaCheck size={11}/> Enregistrer l'évaluation</>
                  )}
                </button>
              ) : (
                <button type="button" onClick={nextStep} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium">
                  Suivant <FaArrowRight size={11}/>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
