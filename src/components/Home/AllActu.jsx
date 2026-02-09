import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Calendar,
  ArrowLeft,
  Search,
  Eye,
  Clock,
  ChevronRight,
  User,
  ImageIcon,
  X,
  Link as LinkIcon,
} from "lucide-react";
import actualiteService from "../../services/actualite.service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Fonction pour créer un slug à partir du titre
const createSlug = (titre) => {
  return titre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Enlever les accents
    .replace(/[^a-z0-9]+/g, "-") // Remplacer les caractères spéciaux par des tirets
    .replace(/^-+|-+$/g, ""); // Enlever les tirets au début et à la fin
};

function AllActu() {
  // === ÉTATS ===
  const [actualitesData, setActualitesData] = useState([]);
  const [selectedActu, setSelectedActu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareMenuOpen, setShareMenuOpen] = useState(null);

  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  // === RÉCUPÉRATION DES DONNÉES ===
  useEffect(() => {
    fetchActualites();
  }, []);

  const fetchActualites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await actualiteService.getActiveFaqs();

      // Transformer les données
      const formattedData = data.map((actu) => ({
        id: actu.id,
        titre: actu.titre,
        slug: createSlug(actu.titre),
        intro: actu.description,
        content: actu.contenu || actu.description,
        date: actu.date_publication,
        author: "DAAQ",
        category: "Actualité",
        image: `${actualiteService.getBaseURL()}${actu.couverture_url}`,
        gallery: actu.images_contenu_urls
          ? actu.images_contenu_urls.map(
              (url) => `${actualiteService.getBaseURL()}${url}`,
            )
          : [],
        vues: actu.vues || 0,
      }));

      setActualitesData(formattedData);

      // ✅ Si un slug est dans l'URL, afficher cet article
      if (slug && formattedData.length > 0) {
        const article = formattedData.find((actu) => actu.slug === slug);
        if (article) {
          setSelectedActu(article);
        } else {
          // Article non trouvé, rediriger vers la liste
          navigate("/actualites");
        }
      }
    } catch (err) {
      console.error("Erreur lors du chargement des actualités:", err);
      setError("Impossible de charger les actualités");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Surveiller les changements de slug dans l'URL
  useEffect(() => {
    if (slug && actualitesData.length > 0) {
      const article = actualitesData.find((actu) => actu.slug === slug);
      if (article) {
        setSelectedActu(article);
        window.scrollTo(0, 0);
      }
    } else if (!slug) {
      setSelectedActu(null);
    }
  }, [slug, actualitesData]);

  // === INCRÉMENTER LES VUES (avec localStorage pour persistance) ===
  const incrementViews = async (actuId) => {
    const viewedArticlesKey = "daaq_viewed_articles";
    const viewedArticles = JSON.parse(localStorage.getItem(viewedArticlesKey) || "{}");

    if (viewedArticles[actuId]) {
      console.log(`Actualité ${actuId} déjà vue précédemment`);
      return;
    }

    try {
      const updated = await actualiteService.incrementViews(actuId);
      if (updated) {
        viewedArticles[actuId] = {
          timestamp: new Date().toISOString(),
          titre: actualitesData.find((a) => a.id === actuId)?.titre,
        };
        localStorage.setItem(viewedArticlesKey, JSON.stringify(viewedArticles));

        setActualitesData((prev) =>
          prev.map((actu) =>
            actu.id === actuId ? { ...actu, vues: updated.vues } : actu,
          ),
        );
        if (selectedActu && selectedActu.id === actuId) {
          setSelectedActu({ ...selectedActu, vues: updated.vues });
        }

        console.log(`Vue comptée pour l'actualité ${actuId}`);
      }
    } catch (err) {
      console.error("Erreur incrémentation vues:", err);
    }
  };

  // === COPIER LE LIEN ===
  const handleCopyLink = (actualite) => {
    const url = `${window.location.origin}/actualites/${actualite.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Lien copié dans le presse-papier !");
    setShareMenuOpen(null);
  };

  // === MENU DE PARTAGE (simplifié) ===
  const ShareMenu = ({ actualite }) => (
    <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50 min-w-[200px]">
      <div className="text-xs font-semibold text-slate-400 mb-2 px-2">
        Partager
      </div>
      <button
        onClick={() => handleCopyLink(actualite)}
        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
      >
        <LinkIcon className="w-4 h-4" />
        Copier le lien
      </button>
    </div>
  );

  // Filtrage
  const filteredActualites = actualitesData.filter(
    (actu) =>
      actu.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actu.intro.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Utilitaires
  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getReadTime = (text) => {
    const words = text?.split(" ").length || 0;
    return `${Math.ceil(words / 200)} min`;
  };

  // === OUVRIR UN ARTICLE ===
  const openArticle = (actu) => {
    navigate(`/actualites/${actu.slug}`);
  };

  // === FERMER L'ARTICLE ===
  const closeArticle = () => {
    navigate("/actualites");
  };

  // === VUE DÉTAIL ===
  const ArticleDetailView = ({ article, onBack }) => {
    const hasIncrementedRef = useRef(false);

    useEffect(() => {
      if (!hasIncrementedRef.current) {
        incrementViews(article.id);
        hasIncrementedRef.current = true;
      }

      return () => {
        hasIncrementedRef.current = false;
      };
    }, []);

    return (
      <div className="animate-fade-in-up max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        {/* Bouton Retour */}
        <div className="p-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-20 flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
          >
            <ArrowLeft className="w-5 h-5" /> Retour aux actualités
          </button>
          <div className="flex gap-2 relative">
            <button
              onClick={() =>
                setShareMenuOpen(
                  shareMenuOpen === article.id ? null : article.id,
                )
              }
              className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition relative text-sm font-medium"
            >
              <LinkIcon className="w-4 h-4" />
              Partager
            </button>
            {shareMenuOpen === article.id && <ShareMenu actualite={article} />}
          </div>
        </div>

        {/* Hero Image */}
        <div
          className="relative h-64 md:h-96 w-full cursor-zoom-in group"
          onClick={() => setLightboxImage(article.image)}
        >
          <img
            src={article.image}
            alt={article.titre}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white pointer-events-none">
            <span className="bg-blue-600 px-3 py-1 rounded-md text-sm font-bold uppercase tracking-wider mb-3 inline-block">
              {article.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-2 shadow-sm">
              {article.titre}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-slate-200">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {formatDate(article.date)}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" /> {article.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {getReadTime(article.content)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {article.vues} vues
              </span>
            </div>
          </div>
        </div>

        {/* Contenu Article */}
        <div className="p-6 md:p-10">
          <p className="text-xl text-slate-700 font-medium mb-8 leading-relaxed border-l-4 border-blue-500 pl-4 italic">
            {article.intro}
          </p>
          <div className="prose prose-lg max-w-none text-slate-600 leading-loose whitespace-pre-wrap mb-10">
            {article.content}
          </div>

          {/* Galerie Photo */}
          {article.gallery && article.gallery.length > 0 && (
            <div className="mt-12 pt-10 border-t border-slate-100">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-blue-600" />
                En images
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {article.gallery.map((photoUrl, index) => (
                  <div
                    key={index}
                    className="group relative h-64 overflow-hidden rounded-xl cursor-zoom-in shadow-md hover:shadow-xl transition-all"
                    onClick={() => setLightboxImage(photoUrl)}
                  >
                    <img
                      src={photoUrl}
                      alt={`Galerie ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // === CARTE RECTANGULAIRE (À LA UNE) ===
  const HorizontalCard = ({ actu }) => (
    <div
      onClick={() => openArticle(actu)}
      className="group flex flex-col md:flex-row bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg border border-blue-100 hover:border-blue-300 h-full"
    >
      <div className="relative w-full md:w-48 lg:w-56 h-48 md:h-auto shrink-0 overflow-hidden">
        <img
          src={actu.image}
          alt={actu.titre}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000";
          }}
        />
        <div className="absolute top-2 left-2">
          <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide shadow-sm">
            ★ À la une
          </span>
        </div>
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <Calendar className="w-3 h-3" />{" "}
            <span>{formatDate(actu.date)}</span>
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
            {actu.titre}
          </h3>
          <p className="text-slate-500 text-sm leading-snug line-clamp-2">
            {actu.intro}
          </p>
        </div>
        <div className="pt-3 mt-2 border-t border-slate-50 flex justify-between items-center">
          <span className="text-slate-400 text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" /> {actu.vues || 0}
          </span>
          <span className="text-blue-600 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Lire <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );

  // === CARTE VERTICALE ===
  const VerticalCard = ({ actu }) => (
    <div
      onClick={() => openArticle(actu)}
      className="group bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg border border-slate-200 hover:border-blue-200 flex flex-col h-full"
    >
      <div className="relative h-40 overflow-hidden shrink-0">
        <img
          src={actu.image}
          alt={actu.titre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800";
          }}
        />
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-50">
            {actu.category}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-2">
          <Calendar className="w-3 h-3" /> <span>{formatDate(actu.date)}</span>
        </div>
        <h3 className="font-bold text-slate-800 text-base mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
          {actu.titre}
        </h3>
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-3 flex-grow">
          {actu.intro}
        </p>
        <div className="pt-3 border-t border-slate-50 flex justify-between items-center text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Eye className="w-3 h-3" /> {actu.vues || 0}
          </span>
          <span className="text-blue-600 font-bold hover:underline">
            Lire l'article
          </span>
        </div>
      </div>
    </div>
  );

  // === ÉTATS DE CHARGEMENT ===
  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Chargement des actualités...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-red-900 mb-2">Erreur</h2>
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // === RENDU PRINCIPAL ===
  return (
    <div className="bg-slate-50 min-h-screen pb-12 font-sans text-slate-900 relative">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all"
          >
            <X size={32} />
          </button>
          <img
            src={lightboxImage}
            alt="Zoom"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Header Sticky */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                selectedActu ? closeArticle() : navigate("/")
              }
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">
                {selectedActu ? "Retour liste" : "Accueil"}
              </span>
            </button>
            <div className="w-px h-5 bg-slate-200"></div>
            <h1 className="text-lg font-bold text-slate-800">
              {selectedActu ? "Lecture" : "Actualités"}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {selectedActu ? (
          <ArticleDetailView article={selectedActu} onBack={closeArticle} />
        ) : (
          <>
            {/* Recherche */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 mb-8 shadow-sm max-w-md mx-auto relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border-none rounded-lg focus:ring-0 text-slate-700 placeholder-slate-400"
              />
            </div>

            {/* À LA UNE */}
            {filteredActualites.length > 0 && (
              <div className="mb-12">
                <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>À
                  la une
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredActualites.slice(0, 4).map((actualite) => (
                    <HorizontalCard key={actualite.id} actu={actualite} />
                  ))}
                </div>
              </div>
            )}

            {/* AUTRES */}
            {filteredActualites.length > 4 && (
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                  Dernières publications
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredActualites.slice(4).map((actualite) => (
                    <VerticalCard key={actualite.id} actu={actualite} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredActualites.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500">Aucun résultat trouvé.</p>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default AllActu;
