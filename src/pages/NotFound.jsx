// src/pages/NotFound.jsx

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "@lottiefiles/lottie-player";
import { FaHome, FaArrowLeft, FaEnvelope } from "react-icons/fa";

export default function NotFound() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const titleRef     = useRef(null);
  const badgeRef     = useRef(null);
  const actionsRef   = useRef(null);
  const particle1Ref = useRef(null);
  const particle2Ref = useRef(null);
  const particle3Ref = useRef(null);

  const [isReady, setIsReady] = useState(false);

  const isDark   = document.documentElement.classList.contains("dark");
  const lottieBg = isDark ? "#030712" : "#EFF6FF";

  useEffect(() => {
    setIsReady(true);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: -40 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, delay: 0.4, ease: "back.out(1.7)" }
      );
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.7, ease: "power2.out" }
      );
      gsap.fromTo(
        actionsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.9, ease: "power2.out" }
      );

      const tlPulse = gsap.timeline({
        repeat: -1,
        delay: 2.5,
        defaults: { duration: 0.9, ease: "power1.inOut", yoyo: true },
      });
      tlPulse.to(titleRef.current, { scale: 1.04 });

      [particle1Ref, particle2Ref, particle3Ref].forEach((ref, i) => {
        gsap.to(ref.current, {
          y: -18 - i * 6,
          x: i % 2 === 0 ? 10 : -10,
          repeat: -1,
          yoyo: true,
          duration: 2.5 + i * 0.5,
          ease: "sine.inOut",
          delay: i * 0.4,
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      className={`
        relative min-h-screen flex items-center justify-center px-4
        bg-blue-50 dark:bg-gray-950 overflow-hidden
        transition-colors duration-300
        ${isReady ? "opacity-100" : "opacity-0"}
      `}
    >
      {/* ── Décoration fond ── */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-60px] w-80 h-80 bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-30 pointer-events-none" />

      {/* ── Particules flottantes ── */}
      <div ref={particle1Ref} className="absolute top-20 left-[10%] w-4 h-4 rounded-full bg-blue-400/40 dark:bg-blue-500/30 pointer-events-none" />
      <div ref={particle2Ref} className="absolute top-40 right-[12%] w-3 h-3 rounded-full bg-indigo-400/40 dark:bg-indigo-500/30 pointer-events-none" />
      <div ref={particle3Ref} className="absolute bottom-28 left-[18%] w-5 h-5 rounded-full bg-blue-300/30 dark:bg-blue-600/20 pointer-events-none" />

      {/* ── Contenu principal ── */}
      <div
        ref={containerRef}
        className="relative z-10 flex flex-col items-center text-center max-w-sm w-full"
      >
        {/* ── Animation Lottie ── */}
        <div
          className="relative rounded-2xl overflow-hidden mb-2"
          style={{ width: 260, height: 260, backgroundColor: lottieBg }}
        >
          <lottie-player
            src="https://assets5.lottiefiles.com/packages/lf20_3a0bpmmc.json"
            background="transparent"
            speed="1"
            style={{ width: "260px", height: "260px" }}
            autoplay
            loop
          />
        </div>

        {/* ── Badge 404 ── */}
        <div ref={badgeRef} className="mb-3">
          <span className="text-8xl font-black text-blue-200 dark:text-gray-800 leading-none select-none">
            404
          </span>
        </div>

        {/* ── Titre et description ── */}
        <div ref={titleRef} className="-mt-6 z-10 mb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Page introuvable !
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed px-2">
            Oups ! La page que vous recherchez n'existe pas,<br />
            a été déplacée ou n'est plus disponible.
          </p>
        </div>

        {/* ── Séparateur ── */}
        <div className="w-12 h-0.5 rounded-full bg-blue-200 dark:bg-gray-700 my-5" />

        {/* ── Boutons ── */}
        <div ref={actionsRef} className="flex items-center gap-2">
          {/* Bouton principal */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700
                       text-white text-xs font-semibold rounded-lg
                       shadow-md shadow-blue-200 dark:shadow-blue-900/30
                       transition-all duration-200 hover:-translate-y-0.5"
          >
            <FaHome className="text-[10px]" />
            Retour à l'accueil
          </button>

          {/* Bouton secondaire */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-4 py-2
                       bg-white dark:bg-gray-800
                       text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-lg
                       border border-gray-200 dark:border-gray-700
                       hover:bg-gray-50 dark:hover:bg-gray-700
                       shadow-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            <FaArrowLeft className="text-[10px]" />
            Page précédente
          </button>
        </div>

        {/* ── Liens rapides (sans "Chercher une page") ── */}
        <div className="mt-7 flex items-center gap-5 text-xs text-gray-400 dark:text-gray-500">
          <button
            onClick={() => navigate("/apropos")}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            À propos
          </button>
          <span className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FaEnvelope className="text-[10px]" />
            Connexion
          </button>
        </div>

        {/* ── Code erreur discret ── */}
        <p className="mt-6 text-[11px] font-mono text-gray-300 dark:text-gray-700 select-none">
          ERREUR · HTTP 404 · PAGE_NOT_FOUND
        </p>
      </div>
    </div>
  );
}
