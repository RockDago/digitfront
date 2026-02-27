// src/pages/Home/APropos.jsx
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { fetchApropos } from "../../services/apropos.services";

const APropos = () => {
  const [aproposData, setAproposData]           = useState(null);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  // ─── Chargement API ──────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchApropos();
        setAproposData(data);
        const initState = {};
        (data.sections || []).forEach((s) => { initState[s.id] = false; });
        setExpandedSections(initState);
      } catch (e) {
        console.error("Erreur chargement APropos:", e);
        setError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleSection = (id) =>
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));

  // ─── Chargement ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section id="apropos" className="bg-gradient-to-b from-slate-50 to-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 text-sm">Chargement en cours...</p>
          </div>
        </div>
      </section>
    );
  }

  // ─── Erreur ──────────────────────────────────────────────────────────────────
  if (error || !aproposData) {
    return (
      <section id="apropos" className="bg-gradient-to-b from-slate-50 to-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-red-500 font-medium">{error || "Données indisponibles."}</p>
          </div>
        </div>
      </section>
    );
  }

  const sections = (aproposData.sections || [])
    .slice()
    .sort((a, b) => a.position - b.position);

  // ─── Rendu ───────────────────────────────────────────────────────────────────
  return (
    <section
      id="apropos"
      className="bg-gradient-to-b from-slate-50 to-white py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ─── EN-TÊTE ─────────────────────────────────────────────────────────── */}
        <header className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {aproposData.titre || ""}
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6" />
          {aproposData.description && (
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl mx-auto text-justify px-4">
              {aproposData.description}
            </p>
          )}
        </header>

        {/* ─── SECTIONS DYNAMIQUES ─────────────────────────────────────────────── */}
        {sections.length === 0 ? (
          <p className="text-center text-slate-400 italic text-sm py-10">
            Aucune section disponible pour le moment.
          </p>
        ) : (
          <div className="space-y-4">
            {sections.map((section) => (
              <article
                key={section.id}
                className="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* ─── BOUTON ACCORDÉON ─────────────────────────────────────── */}
                <button
                  className="w-full flex items-center justify-between p-5 sm:p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={!!expandedSections[section.id]}
                >
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 text-left">
                    {section.title}
                  </h3>
                  {expandedSections[section.id] ? (
                    <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {/* ─── CONTENU HTML RICHE ───────────────────────────────────── */}
                {expandedSections[section.id] && (
                  <div className="px-5 sm:px-6 pb-6 animate-fadeIn">
                    <div
                      className="apropos-content"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`

        /* ─── ANIMATION ──────────────────────────────────────────────────────── */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        /* ─── CONTENEUR PRINCIPAL ────────────────────────────────────────────── */
        .apropos-content {
          font-size: 0.95rem;
          line-height: 1.75;
          color: #334155;
        }

        /* ─── PARAGRAPHES ────────────────────────────────────────────────────── */
        .apropos-content p {
          margin-bottom: 0.9rem;
          text-align: justify;
          color: #334155;
        }

        /* ─── TITRES ─────────────────────────────────────────────────────────── */
        .apropos-content h1,
        .apropos-content h2,
        .apropos-content h3,
        .apropos-content h4 {
          font-weight: 700;
          color: #0f172a;
          margin-top: 1.2rem;
          margin-bottom: 0.6rem;
        }
        .apropos-content h1 { font-size: 1.5rem; }
        .apropos-content h2 { font-size: 1.3rem; }
        .apropos-content h3 { font-size: 1.1rem; }
        .apropos-content h4 { font-size: 1rem;   }

        /* ─── STYLES INLINE ──────────────────────────────────────────────────── */
        .apropos-content strong { font-weight: 700; }
        .apropos-content em     { font-style: italic; }
        .apropos-content u      { text-decoration: underline; }
        .apropos-content s      { text-decoration: line-through; }

        /* ─── LIENS ──────────────────────────────────────────────────────────── */
        .apropos-content a {
          color: #2563eb;
          text-decoration: underline;
          cursor: pointer;
          transition: color 0.2s;
        }
        .apropos-content a:hover { color: #1e40af; }

        /* ─── LISTES ─────────────────────────────────────────────────────────── */
        .apropos-content ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin: 0.8rem 0 !important;
        }
        .apropos-content ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin: 0.8rem 0 !important;
        }
        .apropos-content li {
          margin-bottom: 0.4rem;
          color: #334155;
          line-height: 1.7;
          text-align: left;
        }

        /* ─── CITATION ───────────────────────────────────────────────────────── */
        .apropos-content blockquote {
          border-left: 4px solid #2563eb !important;
          background-color: #eff6ff;
          border-radius: 0 8px 8px 0;
          padding: 0.75rem 1rem !important;
          color: #475569 !important;
          font-style: italic !important;
          margin: 1rem 0 !important;
        }

        /* ─── IMAGES ─────────────────────────────────────────────────────────── */

        /*
          ✅ margin auto  → centrage garanti
          ✅ PAS de width/max-width avec !important
             → le style="width:X%" inline de Tiptap prend le dessus
             et la taille du backoffice est respectée
        */
        .apropos-content img {
          display: block !important;
          margin-left: auto !important;
          margin-right: auto !important;
          margin-top: 1.2rem;
          margin-bottom: 1.2rem;
          height: auto !important;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

          /* Empêche juste le débordement, sans forcer une taille */
          max-width: 100%;
        }

        /* Responsive mobile : on repasse à 100% sur petit écran */
        @media (max-width: 640px) {
          .apropos-content img {
            width: 100% !important;
            max-width: 100% !important;
          }
        }

      `}</style>
    </section>
  );
};

export default APropos;
