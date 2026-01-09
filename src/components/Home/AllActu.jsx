import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  ArrowLeft,
  Search,
  Share2,
  Bookmark,
  Eye,
  Clock,
  ChevronRight,
  User,
  ImageIcon,
  X, // <--- AJOUT : Icône pour fermer la lightbox
} from "lucide-react";

function AllActu() {
  // === DONNÉES DE SIMULATION AVEC GALERIE ===
  const actualitesData = [
    {
      id: 1,
      titre: "Lancement de la Campagne d'Accréditation 2026",
      intro:
        "Le Service d'Accréditation (SAE) ouvre officiellement la session d'évaluation 2026.",
      content: `Le Service d'Accréditation et d'Évaluation (SAE) a le plaisir d'annoncer l'ouverture officielle de la campagne d'accréditation pour l'année 2026. Cette nouvelle session marque une étape importante dans notre engagement continu envers l'excellence académique.

      Les établissements d'enseignement supérieur publics et privés sont invités à soumettre leurs dossiers de demande d'accréditation via notre nouvelle plateforme numérique. Cette digitalisation vise à simplifier les démarches administratives et à accélérer le traitement des dossiers.

      Les critères d'évaluation ont été mis à jour pour inclure des indicateurs de performance liés à l'employabilité des diplômés et à l'innovation pédagogique. Des ateliers d'information seront organisés dans chaque province pour accompagner les responsables qualité des institutions.`,
      date: "2026-01-03",
      author: "Direction SAE",
      category: "Accréditation",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
      gallery: [
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
      ],
    },
    {
      id: 2,
      titre: "Nouveaux Protocoles d'Inspection SCIP",
      intro:
        "Adoption de nouveaux standards pour les audits de conformité des établissements.",
      content:
        "Le Service de Contrôle et d'Inspection de la Performance (SCIP) modernise ses outils. Désormais, les inspecteurs utiliseront des tablettes connectées permettant une remontée d'information en temps réel. Les protocoles incluent maintenant une vérification systématique des infrastructures numériques et de la sécurité des campus.",
      date: "2025-12-28",
      author: "Service SCIP",
      category: "Inspection",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000",
      gallery: [
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200",
      ],
    },
    {
      id: 3,
      titre: "Bilan de la Conférence Qualité 2025",
      intro:
        "Plus de 200 experts réunis pour discuter de l'avenir de l'assurance qualité.",
      content:
        "La conférence annuelle s'est clôturée sur une note très positive. Les échanges ont porté sur l'internationalisation des diplômes et la mobilité étudiante. Le ministre a salué les efforts fournis par les acteurs du secteur pour rehausser le niveau de l'enseignement supérieur national.",
      date: "2025-12-15",
      author: "Communication",
      category: "Événement",
      image:
        "https://images.unsplash.com/photo-1544531320-dadbed4d130c?auto=format&fit=crop&q=80&w=1000",
      gallery: [
        "https://images.unsplash.com/photo-1515168816178-54e7c2f231da?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1475721027785-f74eccf8e5fe?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200",
      ],
    },
    {
      id: 4,
      titre: "Certification d'Excellence : Les lauréats",
      intro:
        "Découvrez les 5 établissements ayant reçu le label d'excellence cette année.",
      content:
        "Suite aux audits rigoureux menés au cours des 12 derniers mois, la commission a décerné le label 'Excellence Académique' à 5 institutions. Ces établissements se distinguent par la qualité de leur recherche, leur gouvernance transparente et leurs taux d'insertion professionnelle exceptionnels.",
      date: "2025-12-01",
      author: "Commission",
      category: "Accréditation",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000",
      gallery: [],
    },
    {
      id: 5,
      titre: "Formation des Évaluateurs 2026",
      intro:
        "Appel à candidatures pour la prochaine session de formation des experts.",
      content:
        "Pour renforcer notre vivier d'experts, nous lançons un appel à candidatures pour la formation certifiante d'évaluateur qualité. La formation se tiendra du 15 au 20 février 2026 au centre de conférence national.",
      date: "2025-11-20",
      author: "RH DAAQ",
      category: "Formation",
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
      gallery: [],
    },
    {
      id: 6,
      titre: "Digitalisation des Diplômes",
      intro:
        "Vers une sécurisation des diplômes via la technologie Blockchain.",
      content:
        "Un projet pilote de sécurisation des diplômes via la blockchain est en cours de déploiement. L'objectif est de lutter contre la fraude académique et de faciliter la vérification des titres par les employeurs.",
      date: "2025-11-05",
      author: "Service IT",
      category: "Innovation",
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
      gallery: [],
    },
    {
      id: 7,
      titre: "Partenariat International ENQA",
      intro: "Signature d'un accord historique avec l'agence européenne.",
      content:
        "La DAAQ rejoint le réseau des partenaires de l'ENQA. Cet accord permettra de standardiser nos procédures sur le modèle européen LMD et facilitera les échanges d'étudiants vers l'Europe.",
      date: "2025-10-22",
      author: "Direction",
      category: "Coopération",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
      gallery: [],
    },
    {
      id: 8,
      titre: "Publication du Rapport Annuel",
      intro:
        "Transparence et résultats : téléchargez le rapport d'activités 2025.",
      content:
        "Le rapport public d'activité est disponible. Il détaille l'ensemble des missions effectuées, le budget utilisé et les objectifs atteints pour l'année écoulée.",
      date: "2025-10-10",
      author: "Direction",
      category: "Publication",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      gallery: [],
    },
  ];

  // État
  const [selectedActu, setSelectedActu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // NOUVEL ÉTAT : Pour gérer l'image ouverte en grand (Lightbox)
  const [lightboxImage, setLightboxImage] = useState(null);

  const navigate = useNavigate();

  // Filtrage simple
  const filteredActualites = actualitesData.filter(
    (actu) =>
      actu.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actu.intro.toLowerCase().includes(searchTerm.toLowerCase())
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
  const getReadTime = (text) =>
    `${Math.ceil((text?.split(" ").length || 0) / 200)} min`;

  // === VUE DÉTAIL ===
  const ArticleDetailView = ({ article, onBack }) => (
    <div className="animate-fade-in-up max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      {/* Bouton Retour */}
      <div className="p-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-20 flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
        >
          <ArrowLeft className="w-5 h-5" /> Retour aux actualités
        </button>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Image (Cliquable maintenant) */}
      <div
        className="relative h-64 md:h-96 w-full cursor-zoom-in group"
        onClick={() => setLightboxImage(article.image)} // Ouvre la lightbox
      >
        <img
          src={article.image}
          alt={article.titre}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white pointer-events-none">
          <span className="bg-blue-600 px-3 py-1 rounded-md text-sm font-bold uppercase tracking-wider mb-3 inline-block">
            {article.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-2 shadow-sm">
            {article.titre}
          </h1>
          <div className="flex items-center gap-4 text-sm md:text-base text-slate-200">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> {formatDate(article.date)}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" /> {article.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {getReadTime(article.content)}
            </span>
          </div>
        </div>
      </div>

      {/* Contenu Article */}
      <div className="p-6 md:p-10">
        <p className="text-xl text-slate-700 font-medium mb-8 leading-relaxed border-l-4 border-blue-500 pl-4 italic">
          {article.intro}
        </p>
        <div className="prose prose-lg max-w-none text-slate-600 leading-loose whitespace-pre-line mb-10">
          {article.content}
        </div>

        {/* --- SECTION GALERIE PHOTO --- */}
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
                  onClick={() => setLightboxImage(photoUrl)} // Ouvre la lightbox
                >
                  <img
                    src={photoUrl}
                    alt={`Galerie ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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

  // === CARTE RECTANGULAIRE (À LA UNE) ===
  const HorizontalCard = ({ actu }) => (
    <div
      onClick={() => {
        setSelectedActu(actu);
        window.scrollTo(0, 0);
      }}
      className="group flex flex-col md:flex-row bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg border border-blue-100 hover:border-blue-300 h-full"
    >
      <div className="relative w-full md:w-48 lg:w-56 h-48 md:h-auto shrink-0 overflow-hidden">
        <img
          src={actu.image}
          alt={actu.titre}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
        <div className="pt-3 mt-2 border-t border-slate-50 flex justify-end">
          <span className="text-blue-600 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Lire <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );

  // === CARTE CARRÉE / VERTICALE (AUTRES) ===
  const VerticalCard = ({ actu }) => (
    <div
      onClick={() => {
        setSelectedActu(actu);
        window.scrollTo(0, 0);
      }}
      className="group bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg border border-slate-200 hover:border-blue-200 flex flex-col h-full"
    >
      <div className="relative h-40 overflow-hidden shrink-0">
        <img
          src={actu.image}
          alt={actu.titre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
            <Eye className="w-3 h-3" /> 240
          </span>
          <span className="text-blue-600 font-bold hover:underline">
            Lire l'article
          </span>
        </div>
      </div>
    </div>
  );

  // === RENDU PRINCIPAL ===
  return (
    <div className="bg-slate-50 min-h-screen pb-12 font-sans text-slate-900 relative">
      {/* --- COMPOSANT LIGHTBOX (Overlay Image) --- */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)} // Fermer au clic sur le fond
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
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl scale-100"
            onClick={(e) => e.stopPropagation()} // Empêcher la fermeture au clic sur l'image
          />
        </div>
      )}

      {/* Header Sticky */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                selectedActu ? setSelectedActu(null) : navigate("/")
              }
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" />{" "}
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
        {/* LOGIQUE D'AFFICHAGE : DETAIL OU LISTE */}
        {selectedActu ? (
          <ArticleDetailView
            article={selectedActu}
            onBack={() => setSelectedActu(null)}
          />
        ) : (
          <>
            {/* Recherche Simple */}
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

            {/* SECTION 1: À LA UNE (2 Colonnes) */}
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

            {/* SECTION 2: AUTRES (4 Colonnes) */}
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
