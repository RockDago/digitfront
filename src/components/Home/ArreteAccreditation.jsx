import React from "react";
// Importation du logo (Assurez-vous que l'image est bien dans ce dossier)
import repLogo from "../../assets/images/rep-logo.png";

const ArreteAccreditation = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-serif">
      {/* Conteneur Papier A4 centré */}
      <div className="max-w-[21cm] mx-auto bg-white shadow-2xl p-8 md:p-16 text-gray-900 leading-relaxed border border-gray-200 print:shadow-none print:border-none print:max-w-none">
        {/* EN-TÊTE OFFICIEL */}
        <header className="text-center mb-12 space-y-4">
          <div className="flex flex-col items-center justify-center">
            {/* Logo République */}
            <img
              src={repLogo}
              alt="Emblème de la République de Madagascar"
              className="w-64 h-auto mb-4 object-contain"
            />
            <p className="text-sm font-bold uppercase tracking-widest">
              Repoblikan'i Madagasikara
            </p>
            <p className="text-xs italic font-medium text-gray-600">
              Fitiavana - Tanindrazana - Fandrosoana
            </p>
          </div>

          <div className="mt-6 border-t border-gray-300 pt-4 w-3/4 mx-auto">
            <p className="text-xs font-bold uppercase text-gray-700">
              Ministère de l'Enseignement Supérieur <br />
              et de la Recherche Scientifique
            </p>
          </div>

          <div className="pt-8 pb-4">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight decoration-double underline decoration-2 underline-offset-4">
              Arrêté N° 14803/2013-MESupReS
            </h1>
            <p className="mt-4 text-base md:text-lg font-medium italic text-gray-700 px-8">
              " fixant les normes d'accréditation pour l'enseignement supérieur
              public et privé à Madagascar "
            </p>
          </div>
        </header>

        {/* SECTION DES VISAS */}
        <section className="mb-10 text-justify text-sm md:text-base space-y-4">
          <h2 className="font-bold text-center uppercase mb-6 text-lg">
            Le Ministre de l'Enseignement Supérieur <br /> et de la Recherche
            Scientifique,
          </h2>

          <ul className="list-none space-y-3 pl-4 md:pl-8 border-l-4 border-gray-100">
            {[
              "Vu la Constitution;",
              "Vu la loi n°2011-014 du 28 décembre 2011 portant insertion dans l'ordonnancement juridique interne de la Feuille de Route signée par les partis politiques malgaches le 17 décembre 2011;",
              "Vu la Loi n°2004-004 du 26 juillet 2004, modifiée par la loi n°2008-011 du 17 juillet 2008 portant orientation générale du système d'Education, d'Enseignement et de Formation à Madagascar ;",
              "Vu le décret n° 2011-653 du 28 Octobre 2011 portant nomination du Premier Ministre, Chef du Gouvernement de Transition d'Union Nationale;",
              "Vu le décret n°2011-687 du 21 Novembre 2011, modifié par les décrets n°2012-495 du 13 avril 2012 et n°2012-496 du 13 avril 2012 portant nomination des membres du Gouvernement de Transition d'Union Nationale;",
              "Vu le décret n°2009-574 du 08 mai 2009 complété par le décret n°2010-0194 du 08 avril 2010 fixant les attributions du Ministre de l'Enseignement Supérieur et de la Recherche Scientifique ainsi que l'organisation générale de son Ministère ;",
              "Vu le décret 2008-179 du 15 février 2008, modifié par le décret n°2012-831 du 18 septembre 2012 portant réforme du Système de l'Enseignement Supérieur et de la Recherche Scientifique en vue de la mise en place du système « Licence, Master, Doctorat (LMD) »;",
              "Vu le décret n°2013-255 du 09 avril 2013 portant régime d'accréditation et de labellisation des institutions d'enseignement supérieur;",
            ].map((text, index) => (
              <li key={index} className="flex">
                <span className="italic mr-2 font-medium">Vu</span>
                <span>{text.replace(/^Vu /, "")}</span>
              </li>
            ))}
          </ul>

          <div className="text-center mt-8 mb-8">
            <span className="inline-block px-6 py-2 border-t-2 border-b-2 border-black font-black text-xl tracking-widest uppercase">
              Arrête :
            </span>
          </div>
        </section>

        {/* ARTICLES */}
        <main className="space-y-8">
          {/* Article 1 */}
          <article>
            <h3 className="font-bold underline mb-2">Article premier</h3>
            <p className="text-justify">
              Le présent arrêté a pour objet de fixer les normes d'accréditation
              et de labellisation des institutions et des offres de formation de
              l'enseignement supérieur.
            </p>
          </article>

          {/* Article 2 */}
          <article>
            <h3 className="font-bold underline mb-2">Article 2</h3>
            <p className="text-justify">
              Les normes d'accréditation sont constituées de standards minimaux
              de qualité alors que les normes de labellisation sont définies par
              un niveau élevé de qualité qui en fait des normes d'excellence.
            </p>
          </article>

          {/* Article 3 */}
          <article>
            <h3 className="font-bold underline mb-2">Article 3</h3>
            <p className="text-justify mb-2">
              Les normes d'accréditation et de labellisation distinguent deux
              types d'institutions d'enseignement supérieur selon leur vocation
              :
            </p>
            <ul className="list-disc pl-8 space-y-1">
              <li>
                Les institutions proposant des formations courtes à vocation
                professionnelle de niveau inférieur ou égal à la licence (bac +
                3) ;
              </li>
              <li>
                Les institutions proposant des formations à vocation académique
                et/ou professionnelle, s'appuyant sur la recherche et pouvant
                aller de la licence au doctorat.
              </li>
            </ul>
          </article>

          {/* Article 4 */}
          <article>
            <h3 className="font-bold underline mb-2">Article 4</h3>
            <p className="text-justify">
              Les normes d'accréditation et de labellisation portent sur la{" "}
              <strong>politique de formation</strong> et la{" "}
              <strong>politique de management</strong> pour les institutions
              proposant des formations courtes à vocation professionnelle de
              niveau inférieur ou égal à la licence.
            </p>
            <p className="text-justify mt-2">
              Il faut y ajouter la <strong>politique de recherche</strong> pour
              les institutions proposant des formations à vocation académique
              et/ou professionnelle, s'appuyant sur la recherche et pouvant
              aller de la licence au doctorat.
            </p>
          </article>

          {/* Article 5 */}
          <article className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold underline mb-4 text-lg">
              Article 5 : Les Standards d'Accréditation (Standards minimaux de
              qualité)
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">
                  A. LA POLITIQUE DE FORMATION :
                </h4>
                <ol className="list-decimal pl-6 space-y-1 text-sm">
                  <li>
                    L'institution tient compte des besoins du développement
                    local, régional et national dans la définition des objectifs
                    et des contenus de ses offres de formation;
                  </li>
                  <li>
                    L'institution élabore ses offres de formation en fonction
                    d'axes stratégiques et d'axes de recherche justifiés;
                  </li>
                  <li>
                    L'institution a mis en place un dispositif d'accueil des
                    étudiants;
                  </li>
                  <li>
                    L'institution met en œuvre un dispositif de pilotage de la
                    formation conforme aux normes;
                  </li>
                  <li>L'institution favorise la réussite des étudiants;</li>
                  <li>
                    L'institution a mis en place une politique documentaire
                    utile à l'étudiant, à l'enseignant et au chercheur;
                  </li>
                  <li>
                    L'institution met en œuvre des procédures d'évaluation des
                    étudiants;
                  </li>
                  <li>
                    L'institution a mis en place un dispositif lui permettant de
                    s'inscrire pleinement dans la démarche qualité pédagogique;
                  </li>
                  <li>
                    L'offre de formation est organisée de façon à rendre
                    compatibles, pour les enseignants, leurs charges
                    d'enseignement avec leurs autres missions.
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">
                  B. LA POLITIQUE DE GOUVERNANCE :
                </h4>
                <ol className="list-decimal pl-6 space-y-1 text-sm">
                  <li>
                    L'institution dispose d'un projet de développement en
                    matière de formation, de gouvernance et de recherche ;
                  </li>
                  <li>
                    L'institution met en œuvre un dispositif administratif dont
                    les structures organisationnelles et les fonctions
                    respectives sont bien définies;
                  </li>
                  <li>
                    L'institution dispose d'une structure administrative capable
                    de mettre en œuvre sa politique de développement;
                  </li>
                  <li>
                    L'institution développe une stratégie pour optimiser les
                    performances de ses systèmes d'information et
                    l'appropriation des TIC par le personnel administratif et
                    technique;
                  </li>
                  <li>
                    L'institution gère efficacement les systèmes d'information
                    et de communication mis en place;
                  </li>
                  <li>
                    L'institution dispose de structures permettant aux étudiants
                    d'avoir accès aux documents dont ils ont besoin dans leur
                    formation;
                  </li>
                  <li>
                    L'institution a une politique en matière d'emploi en phase
                    avec des objectifs stratégiques;
                  </li>
                  <li>
                    L'institution a une politique de gestion des ressources
                    humaines qui intègre ses perspectives démographiques, sa
                    politique de formation, de gouvernance et de recherche;
                  </li>
                  <li>
                    L'institution a une politique budgétaire et financière;
                  </li>
                  <li>
                    L'institution exécute son budget dans l'observation des
                    règles ;
                  </li>
                  <li>
                    Les infrastructures et les équipements de l'institution sont
                    adaptés à ses besoins et à ses objectifs ;
                  </li>
                  <li>
                    L'institution a une politique de gestion de son patrimoine
                    immobilier et logistique;
                  </li>
                  <li>
                    L'institution a mis en place une structure de management de
                    la qualité ;
                  </li>
                  <li>
                    L'institution a une politique dédiée à l'hygiène et à la
                    sécurité ;
                  </li>
                  <li>
                    La politique de l'établissement contribue à garantir la
                    qualité de vie des étudiants;
                  </li>
                  <li>
                    L'institution a une politique de coopération avec les autres
                    institutions d'enseignement supérieur ;
                  </li>
                  <li>
                    L'institution a une politique de coopération internationale
                    en matière de recherche et de formation.
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">
                  C. LA POLITIQUE DE RECHERCHE :
                </h4>
                <ol className="list-decimal pl-6 space-y-1 text-sm">
                  <li>
                    L'institution est en mesure d'élaborer une stratégie de
                    recherche, de l'expliquer, de la justifier et de la faire
                    évoluer ;
                  </li>
                  <li>
                    La majorité des enseignants devront s'impliquer dans la
                    recherche et pouvoir justifier de publications récentes dans
                    des périodiques reconnus.
                  </li>
                </ol>
              </div>
            </div>
          </article>

          {/* Article 6 */}
          <article className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold underline mb-4 text-lg">
              Article 6 : Normes de Labellisation (Normes d'excellence)
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">
                  A. LA POLITIQUE DE FORMATION :
                </h4>
                <ol className="list-decimal pl-6 space-y-1 text-sm">
                  <li>
                    L'offre d'études s'intègre dans l'offre de formation
                    universitaire existante, ou la complète de manière
                    judicieuse et/ou innovatrice;
                  </li>
                  <li>
                    L'offre de formation permet l'acquisition des principaux
                    concepts et méthodes de la spécialité et inclut dans la
                    mesure du possible des sujets interdisciplinaires;
                  </li>
                  <li>
                    L'offre de formation est conçue de manière à assurer la
                    cohérence des objectifs, des contenus et des méthodes
                    d'enseignement;
                  </li>
                  <li>
                    L'établissement doit s'assurer que les ressources affectées
                    aux outils pédagogiques et au soutien des étudiants sont
                    adéquates;
                  </li>
                  <li>
                    L'établissement met en œuvre les formations annoncées dans
                    de bonnes conditions;
                  </li>
                  <li>
                    L'enseignement est dispensé par un corps enseignant
                    compétent du point de vue didactique et qualifié
                    scientifiquement;
                  </li>
                  <li>
                    L'institution dispose d'un service d'information et
                    d'orientation numérique;
                  </li>
                  <li>
                    L'institution a mis en place un environnement numérique de
                    travail accessible à l'étudiant;
                  </li>
                  <li>
                    L'établissement met à la disposition des étudiants les
                    documents de présentation des objectifs, des parcours et des
                    programmes de formation;
                  </li>
                  <li>
                    L'institution a mis en place une structure d'aide à
                    l'insertion professionnelle;
                  </li>
                  <li>
                    L'institution met en œuvre un dispositif de valorisation de
                    l'offre de formation auprès du public;
                  </li>
                  <li>
                    L'institution met en œuvre un système d'assurance qualité
                    pédagogique;
                  </li>
                  <li>
                    L'institution exploite les informations collectées
                    périodiquement auprès de ses diplômés.
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">
                  B. LA POLITIQUE DE MANAGEMENT :
                </h4>
                <ol className="list-decimal pl-6 space-y-1 text-sm">
                  <li>
                    Les processus, les compétences et les responsabilités
                    décisionnels sont déterminés;
                  </li>
                  <li>
                    L'institution doit mener la programmation et l'évaluation
                    stratégiques et budgétaires correspondant à sa mission;
                  </li>
                  <li>
                    L'institution fournira des informations complètes, justes,
                    accessibles, claires et suffisantes au public;
                  </li>
                  <li>
                    L'institution doit garantir qu'elle collecte, analyse et se
                    sert des informations nécessaires au pilotage efficace;
                  </li>
                  <li>
                    Les ressources et services appropriés en matière de
                    bibliothèques et d'informations seront disponibles;
                  </li>
                  <li>
                    Le nombre des enseignants permanents et la qualification des
                    enseignants doivent répondre à un niveau d'exigence minimum;
                  </li>
                  <li>
                    Les rémunérations et avantages accordés au corps enseignant
                    seront suffisamment consistants;
                  </li>
                  <li>
                    L'institution conduit une politique durable de la relève;
                  </li>
                  <li>
                    L'établissement démontrera que sa programmation financière
                    pour le futur est un processus guidé par une stratégie;
                  </li>
                  <li>
                    Les infrastructures et les équipements de l'institution sont
                    évalués, révisés et améliorés;
                  </li>
                  <li>
                    L'institution a une structure, une politique et une
                    méthodologie de suivi et d'évaluation de ses acteurs;
                  </li>
                  <li>
                    L'institution doit exploiter les informations collectées
                    pour améliorer la qualité des programmes;
                  </li>
                  <li>
                    L'établissement encourage la participation des étudiants à
                    la vie institutionnelle;
                  </li>
                  <li>
                    L'établissement doit définir ses priorités dans sa politique
                    de coopération.
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">
                  C. LA POLITIQUE DE RECHERCHE :
                </h4>
                <ol className="list-decimal pl-6 space-y-1 text-sm">
                  <li>
                    L'établissement dispose de structures lui permettant de
                    définir et de mettre en œuvre une politique de recherche;
                  </li>
                  <li>
                    L'institution se donne les moyens de mettre en œuvre et
                    d'assurer le suivi de sa stratégie de recherche;
                  </li>
                  <li>
                    L'établissement a une politique de recherche lui permettant
                    d'accéder à l'information actualisée;
                  </li>
                  <li>
                    L'institution développe une stratégie de valorisation et
                    entretient des relations structurées avec les acteurs
                    économiques.
                  </li>
                </ol>
              </div>
            </div>
          </article>

          {/* Article 7 & 8 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article>
              <h3 className="font-bold underline mb-2">Article 7</h3>
              <p className="text-justify">
                Pour l'application du présent arrêté, des dispositions
                réglementaires peuvent être prises, en tant que de besoin, par
                le Ministre chargé de l'enseignement supérieur.
              </p>
            </article>
            <article>
              <h3 className="font-bold underline mb-2">Article 8</h3>
              <p className="text-justify">
                Le présent arrêté sera enregistré et communiqué partout où
                besoin sera.
              </p>
            </article>
          </div>
        </main>

        {/* PIED DE PAGE : Signature */}
        <footer className="mt-20 flex flex-col items-end pr-8">
          <div className="text-center w-64">
            <p className="mb-4 text-sm font-medium">
              Fait à Antananarivo, le 11 juillet 2013
            </p>
            <p className="font-bold text-xs uppercase mb-16 text-gray-800">
              Le Ministre de l'Enseignement Supérieur <br /> et de la Recherche
              Scientifique
            </p>

            {/* Espace Signature */}
            <div className="relative">
              {/* On pourrait ajouter une fausse signature ici */}
              <p className="font-bold text-sm uppercase border-t pt-2 border-gray-400">
                RAZAFINDEHIBE Amette Etienne Hilaire
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ArreteAccreditation;
