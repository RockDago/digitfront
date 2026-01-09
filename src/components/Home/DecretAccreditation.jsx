import React from "react";
// Importation du logo
import repLogo from "../../assets/images/rep-logo.png";

const DecretAccreditation = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-serif">
      {/* Conteneur Papier A4 */}
      <div className="max-w-[21cm] mx-auto bg-white shadow-2xl p-8 md:p-16 text-gray-900 leading-relaxed border border-gray-200 print:shadow-none print:border-none print:max-w-none">
        {/* EN-TÊTE OFFICIEL */}
        <header className="text-center mb-10 space-y-4">
          <div className="flex flex-col items-center justify-center">
            {/* Logo réglé à 32px comme demandé */}
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
              Décret N° 2013/255
            </h1>
            <p className="mt-4 text-base md:text-lg font-medium italic text-gray-700 px-8">
              " portant régime d'accréditation et de labellisation des
              institutions d'enseignement supérieur "
            </p>
          </div>
        </header>

        {/* SECTION DES VISAS */}
        <section className="mb-10 text-justify text-sm md:text-base space-y-4">
          <h2 className="font-bold text-center uppercase mb-6 text-lg">
            Le Premier Ministre, Chef du Gouvernement,
          </h2>

          <ul className="list-none space-y-3 pl-4 md:pl-8 border-l-4 border-gray-100 text-sm">
            {[
              "Vu la Constitution;",
              "Vu la loi n°2011-014 du 28 décembre 2011 portant insertion dans l'ordonnancement juridique interne de la Feuille de Route signée par les partis politiques malgaches le 17 décembre 2011;",
              "Vu la Loi n°2004-004 du 26 juillet 2004, modifiée par la loi n°2008-011 du 17 juillet 2008 portant orientation générale du système d'Education, d'Enseignement et de Formation à Madagascar ;",
              "Vu le décret n° 2011-653 du 28 Octobre 2011 portant nomination du Premier Ministre, Chef du Gouvernement de Transition d'Union Nationale;",
              "Vu le décret n°2011-687 du 21 Novembre 2011, modifié par les décrets n°2012-495 du 13 avril 2012 et n°2012-496 du 13 avril 2012 portant nomination des membres du Gouvernement de Transition d'Union Nationale;",
              "Vu le décret n°2009-574 du 08 mai 2009 modifié et complété par le décret n°2010-0194 du 08 avril 2010 fixant les attributions du Ministre de l'Enseignement Supérieur et de la Recherche Scientifique ainsi que l'organisation générale de son Ministère ;",
              "Vu le décret 2008-179 du 15 février 2008, modifié par le décret n°2012-831 du 18 septembre 2012 portant réforme du Système de l'Enseignement Supérieur et de la Recherche Scientifique en vue de la mise en place du système « Licence, Master, Doctorat (LMD) » ;",
            ].map((text, index) => (
              <li key={index} className="flex">
                <span className="italic mr-2 font-medium">Vu</span>
                <span>{text.replace(/^Vu /, "")}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 pl-4 md:pl-8 space-y-2 text-sm italic text-gray-700">
            <p>
              Sur proposition du Ministre de l'Enseignement Supérieur et de la
              Recherche Scientifique,
            </p>
            <p>En Conseil de Gouvernement</p>
          </div>

          <div className="text-center mt-8 mb-8">
            <span className="inline-block px-6 py-2 border-t-2 border-b-2 border-black font-black text-xl tracking-widest uppercase">
              Décrète :
            </span>
          </div>
        </section>

        {/* CONTENU PRINCIPAL */}
        <main className="space-y-12">
          {/* CHAPITRE 1 */}
          <section>
            <h2 className="text-center font-bold text-lg border-b-2 border-gray-300 pb-2 mb-8 uppercase bg-gray-50 py-2">
              Chapitre Premier : Du régime d'accréditation et de labellisation
            </h2>

            {/* Titre I */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-800 uppercase mb-4 pl-2 border-l-4 border-black">
                TITRE I : Objectifs et types d'accréditation
              </h3>

              <div className="space-y-6 text-justify">
                <article>
                  <p>
                    <span className="font-bold underline">
                      Article premier :
                    </span>{" "}
                    Le présent décret a pour objet de fixer le régime
                    d'accréditation et de labellisation des institutions
                    d'enseignement supérieur publiques et privées afin notamment
                    :
                  </p>
                  <ul className="list-disc pl-8 mt-2 space-y-1 text-sm">
                    <li>
                      de garantir par l'Etat que l'offre d'enseignement
                      supérieur respecte des exigences de qualité minimales
                      définies par les textes réglementaires;
                    </li>
                    <li>
                      d'informer le public de l'aptitude des institutions
                      d'enseignement supérieur à remplir leurs missions
                      respectives;
                    </li>
                    <li>
                      de protéger les intérêts des étudiants et de garantir que
                      l'offre d'enseignement supérieur corresponde aux objectifs
                      nationaux de développement et aux standards
                      internationaux;
                    </li>
                    <li>
                      de soutenir l'amélioration des pratiques existantes au
                      sein des institutions d'enseignement supérieur et de les
                      accompagner dans leur démarche visant à atteindre
                      l'excellence;
                    </li>
                    <li>
                      d'homogénéiser la qualité des formations proposées et
                      ainsi de favoriser la mobilité des étudiants.
                    </li>
                  </ul>
                </article>

                <article>
                  <p>
                    <span className="font-bold underline">Article 2 :</span> Le
                    présent décret s'applique aux institutions d'enseignement
                    supérieur ayant des formations déjà habilitées selon la
                    réglementation en vigueur et dispensant au moins une
                    formation diplômante après le baccalauréat, d'une durée
                    égale ou supérieure à deux ans.
                  </p>
                  <p className="mt-2 text-sm">
                    Les établissements d'enseignement secondaire disposant en
                    leur sein d'un cycle supérieur sont également régis par les
                    dispositions du présent décret et par les textes subséquents
                    en ce qui concerne la formation supérieure.
                  </p>
                </article>

                <article>
                  <p>
                    <span className="font-bold underline">Article 3 :</span>{" "}
                    L'accréditation est une procédure d'évaluation de la qualité
                    d'une institution d'enseignement supérieur dans son ensemble
                    par laquelle l'Agence nationale d'accréditation reconnaît
                    formellement qu'elle remplit les critères ou les normes
                    fixés par arrêté du Ministre chargé de l'enseignement
                    supérieur.
                  </p>
                  <p className="mt-2 text-sm">
                    Nonobstant la disposition de l'alinéa ci-dessus du présent
                    article, une accréditation complémentaire à celle de
                    l'institution doit être menée, notamment au niveau d'un
                    parcours de formation qui prépare à des professions
                    réglementées.
                  </p>
                </article>

                <article>
                  <p>
                    <span className="font-bold underline">Article 4 :</span>{" "}
                    Toute institution accréditée peut prétendre à un label
                    d'excellence, un statut que le Ministère chargé de
                    l'enseignement supérieur accorde à une institution dont
                    l'agence d'accréditation reconnaît l'aptitude à remplir les
                    normes d'excellence fixées par l'arrêté visé dans le premier
                    alinéa de l'article 3.
                  </p>
                </article>

                <article>
                  <p>
                    <span className="font-bold underline">Article 5 :</span> Le
                    Ministère chargé de l'enseignement supérieur accorde à une
                    institution d'enseignement supérieur un des deux types
                    d'accréditation ou de labellisation suivants :
                  </p>
                  <ul className="list-disc pl-8 mt-2 space-y-1 text-sm">
                    <li>
                      l'accréditation ou la labellisation spécifique aux
                      institutions proposant uniquement des formations courtes à
                      vocation professionnelle de niveau égal ou inférieur à la
                      licence (bac+3);
                    </li>
                    <li>
                      l'accréditation ou la labellisation spécifique aux
                      institutions proposant des formations à vocation
                      académique et/ou professionnelle, s'appuyant sur la
                      recherche et pouvant aller de la licence au doctorat.
                    </li>
                  </ul>
                </article>

                <article>
                  <p>
                    <span className="font-bold underline">Article 6 :</span> Les
                    critères et normes régissant l'accréditation et la
                    labellisation doivent être transparents et publics.
                  </p>
                </article>
              </div>
            </div>

            {/* Titre II */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-800 uppercase mb-4 pl-2 border-l-4 border-black">
                TITRE II : Fondements et principes
              </h3>
              <div className="space-y-6 text-justify">
                <article>
                  <p>
                    <span className="font-bold underline">Article 7 :</span>{" "}
                    L'accréditation ou la labellisation est un processus qui
                    vise l'amélioration continue de la qualité, elle repose sur
                    :
                  </p>
                  <ul className="list-disc pl-8 mt-2 space-y-1 text-sm">
                    <li>
                      l'existence au sein de l'institution d'une structure
                      interne de gestion de l'assurance qualité;
                    </li>
                    <li>
                      la mise en place d'un processus interactif
                      d'accompagnement;
                    </li>
                    <li>l'implication de tous les acteurs de l'institution;</li>
                    <li>l'absence de conflits d'intérêts.</li>
                  </ul>
                </article>

                <article>
                  <p>
                    <span className="font-bold underline">Article 8 :</span> La
                    procédure d'accréditation ou de labellisation requiert le
                    respect des principes d'objectivité, de transparence, de
                    collégialité et de confidentialité.
                  </p>
                </article>
              </div>
            </div>

            {/* Titre III */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-800 uppercase mb-4 pl-2 border-l-4 border-black">
                TITRE III : Procédure d'accréditation ou de labellisation
              </h3>
              <div className="space-y-6 text-justify">
                <article>
                  <p>
                    <span className="font-bold underline">Article 9 :</span>{" "}
                    Pour la mise en œuvre du processus, une Agence nationale
                    d'accréditation dotée de la personnalité morale et jouissant
                    d'une autonomie administrative et financière sera créée.
                  </p>
                </article>

                <article>
                  <p>
                    <span className="font-bold underline">Article 10 :</span>{" "}
                    Les processus d'accréditation et de labellisation
                    comprennent chacun trois étapes : l'auto-évaluation,
                    l'évaluation externe par des experts, et la prise de
                    décision.
                  </p>
                </article>

                {/* Articles résumés pour la lisibilité, vous pouvez ajouter le texte complet si nécessaire */}
                <article>
                  <p>
                    <span className="font-bold underline">
                      Article 11 à 14 :
                    </span>{" "}
                    (Dispositions relatives à l'auto-évaluation et à
                    l'évaluation externe par le groupe d'experts).
                  </p>
                </article>

                <article className="bg-gray-50 p-4 rounded border border-gray-200">
                  <p>
                    <span className="font-bold underline">Article 15 :</span> La
                    conclusion de l'Agence nationale d'accréditation aboutit à :
                  </p>
                  <ul className="list-disc pl-8 mt-2 space-y-1 text-sm">
                    <li>
                      une proposition d'accréditation ou de labellisation;
                    </li>
                    <li>
                      un ajournement (avec possibilité de réévaluation après 18
                      mois pour l'accréditation ou 1 an pour la labellisation).
                    </li>
                  </ul>
                  <p className="mt-2 text-xs italic text-gray-600">
                    Note : Des dispositions strictes encadrent les resoumissions
                    après ajournement ou refus.
                  </p>
                </article>

                <article>
                  <p>
                    <span className="font-bold underline">Article 17 :</span>{" "}
                    L'accréditation ou la labellisation est valable pour une
                    durée de <span className="font-bold">cinq ans</span>.
                  </p>
                </article>

                <article>
                  <p>
                    <span className="font-bold underline">
                      Article 19 à 21 :
                    </span>{" "}
                    (Dispositions relatives aux demandes, aux délais de
                    soumission et au renouvellement).
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* CHAPITRE 2 */}
          <section>
            <h2 className="text-center font-bold text-lg border-b-2 border-gray-300 pb-2 mb-8 uppercase bg-gray-50 py-2">
              Chapitre II : Des dispositions diverses et transitoires
            </h2>
            <div className="space-y-6 text-justify">
              <article>
                <p>
                  <span className="font-bold underline">Article 22 :</span> Le
                  processus d'accréditation est d'ordre volontaire jusqu'à la
                  rentrée universitaire 2013-2014. Passé cette date, il est
                  obligatoire.
                </p>
              </article>
              <article>
                <p>
                  <span className="font-bold underline">Article 24 :</span> En
                  attendant la mise en place de l'Agence nationale de
                  l'accréditation, il est prévu de créer une commission qui en
                  tiendra lieu à titre transitoire.
                </p>
              </article>
              <article>
                <p>
                  <span className="font-bold underline">Article 26 :</span> Le
                  Ministre de l'Enseignement Supérieur et de la Recherche
                  Scientifique, le Ministre des Finances et du Budget, le
                  Ministre de la Fonction Publique, du Travail et des Lois
                  Sociales sont chargés, chacun en ce qui le concerne, de
                  l'exécution du présent décret qui sera publié dans le Journal
                  Officiel de la République.
                </p>
              </article>
            </div>
          </section>
        </main>

        {/* PIED DE PAGE : Signature */}
        <footer className="mt-20 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center md:items-end pr-8 mb-8">
            <p className="mb-8 text-sm font-medium">
              Fait à Antananarivo, le 09 avril 2013
            </p>
            <p className="font-bold uppercase text-sm mb-20">
              Par le Premier Ministre, Chef du Gouvernement,
            </p>
            <p className="font-bold uppercase border-t border-black pt-2">
              Jean Omer BERZIKY
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center text-sm mt-12">
            <div className="space-y-16">
              <div>
                <p className="font-bold text-xs uppercase mb-8 h-10">
                  Le Vice Premier Ministre chargé de l'Economie et de
                  l'Industrie
                </p>
                <p className="uppercase font-medium">BOTOZAZA Pierrot</p>
              </div>
              <div>
                <p className="font-bold text-xs uppercase mb-8 h-10">
                  Le Ministre de l'Enseignement Supérieur et de la Recherche
                  Scientifique
                </p>
                <p className="uppercase font-medium">
                  RAZAFINDEHIBE Amette Etienne Hilaire
                </p>
              </div>
              <div>
                <p className="font-bold text-xs uppercase mb-8 h-10">
                  Le Ministre de la Fonction Publique, du Travail et des Lois
                  Sociales
                </p>
                <p className="uppercase font-medium">RANDRIAMANANTSOA Tabera</p>
              </div>
            </div>

            <div className="space-y-16">
              <div>
                <p className="font-bold text-xs uppercase mb-8 h-10">
                  Le Ministre de la Santé et du Planning Familial
                </p>
                <p className="uppercase font-medium">DAHIMANANJARA Johanita</p>
              </div>
              <div>
                <p className="font-bold text-xs uppercase mb-8 h-10">
                  Le Ministre des Finances et du Budget
                </p>
                <p className="uppercase font-medium">
                  RAJAONARIMAMPIANINA Hery
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DecretAccreditation;
