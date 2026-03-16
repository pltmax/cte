// ─── Guide TOEIC — Présentation générale, notation, stratégie globale ─────────

export default function GuideToeicPage() {
  return (
    <div className="px-3 md:px-6 py-8 md:py-10 max-w-4xl mx-auto">
    <article
      className="bg-white rounded-2xl border border-gray-100 px-4 md:px-8 py-8 md:py-10"
      style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
    >
      {/* Header */}
      <header className="mb-10">
        <p className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest mb-2">
          Guide
        </p>
        <h1 className="text-3xl font-bold text-foreground leading-tight">
          Le TOEIC — Tout comprendre pour tout réussir
        </h1>
        <p className="text-gray-500 mt-3 text-base leading-relaxed">
          Avant de t'entraîner, comprendre ce que tu passes est la première étape.
          Ce guide te donne une vue d'ensemble complète de l'examen : structure,
          notation, et posture gagnante.
        </p>
      </header>

      <div className="flex flex-col gap-10">

        {/* ── Section 1 : C'est quoi le TOEIC ? ── */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            C'est quoi le TOEIC ?
          </h2>
          <div className="flex flex-col gap-3 text-sm text-gray-700 leading-relaxed">
            <p>
              Le <strong>TOEIC</strong> (Test of English for International Communication)
              est un test de certification d'anglais conçu pour mesurer le niveau de
              compréhension de l'anglais dans un contexte professionnel et quotidien.
              Il est édité par <strong>ETS</strong> (Educational Testing Service) et
              reconnu dans plus de 160 pays.
            </p>
            <p>
              Contrairement au TOEFL ou à l'IELTS qui évaluent aussi l'expression,
              le TOEIC Listening &amp; Reading ne teste <em>que</em> la compréhension.
              Tu n'écris rien, tu ne parles pas — tu écoutes et tu lis pour choisir
              la bonne réponse parmi quatre options.
            </p>
            <p>
              C'est un test de <strong>QCM pur</strong> : 200 questions, toutes au
              format A / B / C / D.
            </p>
          </div>
        </section>

        {/* ── Section 2 : Structure de l'examen ── */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Structure de l'examen
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-5">
            L'examen est divisé en deux grandes sections indépendantes, chacune
            avec sa propre durée et ses propres parties.
          </p>

          {/* Listening */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-full bg-blue-100 text-blue-600 text-xs font-bold px-2.5 py-0.5 uppercase tracking-wide">
                Écoute
              </span>
              <span className="text-sm text-blue-500 font-medium">45 minutes — 100 questions</span>
            </div>
            <div className="flex flex-col gap-2 text-sm text-gray-700">
              <div className="flex justify-between border-b border-blue-100 pb-2">
                <span className="font-medium">Partie 1 — Photographies</span>
                <span className="text-gray-500">6 questions</span>
              </div>
              <div className="flex justify-between border-b border-blue-100 pb-2">
                <span className="font-medium">Partie 2 — Questions-réponses</span>
                <span className="text-gray-500">25 questions</span>
              </div>
              <div className="flex justify-between border-b border-blue-100 pb-2">
                <span className="font-medium">Partie 3 — Conversations</span>
                <span className="text-gray-500">39 questions</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Partie 4 — Monologues</span>
                <span className="text-gray-500">30 questions</span>
              </div>
            </div>
          </div>

          {/* Reading */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold px-2.5 py-0.5 uppercase tracking-wide">
                Lecture
              </span>
              <span className="text-sm text-emerald-600 font-medium">75 minutes — 100 questions</span>
            </div>
            <div className="flex flex-col gap-2 text-sm text-gray-700">
              <div className="flex justify-between border-b border-emerald-100 pb-2">
                <span className="font-medium">Partie 5 — Phrases incomplètes</span>
                <span className="text-gray-500">30 questions</span>
              </div>
              <div className="flex justify-between border-b border-emerald-100 pb-2">
                <span className="font-medium">Partie 6 — Textes à trous</span>
                <span className="text-gray-500">16 questions</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Partie 7 — Lecture de documents</span>
                <span className="text-gray-500">54 questions</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3 : Notation ── */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Comment est calculé ton score ?
          </h2>
          <div className="flex flex-col gap-3 text-sm text-gray-700 leading-relaxed">
            <p>
              Le TOEIC est noté sur une échelle de <strong>10 à 990 points</strong>.
              Chacune des deux sections (Écoute et Lecture) est notée de 5 à 495 points.
              Les deux scores sont additionnés pour donner le score final.
            </p>
            <p>
              Il n'y a <strong>pas de pénalité pour les mauvaises réponses</strong>.
              Une question sans réponse ou avec une mauvaise réponse rapporte simplement
              0 point — donc ne laisse jamais de case vide. Si tu ne sais pas, choisis
              une réponse au hasard.
            </p>
            <p>
              Le score brut (nombre de bonnes réponses) est converti en score TOEIC via
              une table de conversion qui varie légèrement selon la version du test.
              Ce système de <em>scaling</em> permet de comparer les candidats passant
              des versions différentes de l'examen.
            </p>
          </div>

          {/* Score thresholds */}
          <div className="mt-5 rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Score</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Niveau</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Contexte professionnel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { range: "900 – 990", level: "C1 / C2", label: "Maîtrise professionnelle avancée", color: "text-[#6600CC]" },
                  { range: "785 – 895", level: "B2", label: "Autonomie complète en milieu anglophone", color: "text-emerald-600" },
                  { range: "650 – 780", level: "B1 / B2", label: "Travail opérationnel en anglais", color: "text-blue-500" },
                  { range: "550 – 645", level: "B1", label: "Besoins courants couverts", color: "text-amber-500" },
                  { range: "< 550", level: "A2 / B1", label: "Compréhension limitée en contexte pro", color: "text-gray-400" },
                ].map(({ range, level, label, color }) => (
                  <tr key={range} className="hover:bg-gray-50 transition-colors">
                    <td className={`px-4 py-3 font-bold tabular-nums ${color}`}>{range}</td>
                    <td className="px-4 py-3 text-gray-500 font-medium">{level}</td>
                    <td className="px-4 py-3 text-gray-600">{label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Seuils indicatifs — les exigences varient selon les employeurs et les écoles.
          </p>
        </section>

        {/* ── Section 4 : Stratégie globale ── */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Stratégie globale pour maximiser ton score
          </h2>

          <div className="flex flex-col gap-4">

            {/* Card 1 */}
            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#f3ebff] text-[#6600CC] text-xs font-bold flex items-center justify-center shrink-0">1</span>
                Réponds à toutes les questions sans exception
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Il n'y a aucune pénalité pour une mauvaise réponse. Une réponse
                incorrecte vaut 0 — exactement comme une question laissée vide.
                Ne laisse <em>jamais</em> une case vierge. Si tu es à court de temps
                ou si tu sèches, coche une lettre (toujours la même : C ou B, par exemple)
                pour avoir une chance statistique de tomber juste.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#f3ebff] text-[#6600CC] text-xs font-bold flex items-center justify-center shrink-0">2</span>
                Gère ton temps comme une ressource précieuse
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                La section Lecture (75 minutes, 100 questions) est la plus chronométrée.
                En Partie 5 et 6, vise 30 à 45 secondes par question. En Partie 7,
                commence par lire les questions <em>avant</em> le texte pour savoir quoi
                chercher. Ne bloque pas sur une question difficile — passe à la suivante
                et reviens si le temps le permet.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#f3ebff] text-[#6600CC] text-xs font-bold flex items-center justify-center shrink-0">3</span>
                Maîtrise le vocabulaire professionnel en priorité
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Le TOEIC tourne autour d'un vocabulaire prévisible : affaires, ressources
                humaines, voyages, réunions, e-mails, contrats, finance. Apprendre les
                500 à 700 mots les plus fréquents du TOEIC est l'investissement le plus
                rentable que tu puisses faire. Les structures grammaticales testées sont
                aussi récurrentes (voir le guide Lecture).
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#f3ebff] text-[#6600CC] text-xs font-bold flex items-center justify-center shrink-0">4</span>
                Entraîne-toi dans les conditions réelles
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Le TOEIC est autant un test d'endurance qu'un test de niveau. Deux heures
                de concentration intense, ça se travaille. Fais des examens blancs
                chronométrés régulièrement pour habituer ton cerveau au rythme imposé.
                La fatigue cognitive au bout d'une heure est un ennemi réel — l'entraînement
                la réduit.
              </p>
            </div>

            {/* Card 5 */}
            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#f3ebff] text-[#6600CC] text-xs font-bold flex items-center justify-center shrink-0">5</span>
                Adopte la bonne posture mentale le jour J
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Le TOEIC ne teste pas ta culture générale ni ton intelligence — il teste
                un ensemble précis de compétences. Reste calme, maintiens un rythme régulier,
                et fais confiance à ton entraînement. Ne reviens pas sur tes réponses sans
                raison valable : ton intuition bien entraînée est souvent la bonne.
              </p>
            </div>

          </div>
        </section>

        {/* ── Section 5 : Jour de l'examen ── */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Le jour de l'examen
          </h2>
          <ul className="flex flex-col gap-2.5 text-sm text-gray-700">
            {[
              "Arrive au moins 30 minutes avant le début — les retardataires ne sont pas admis.",
              "Porte une pièce d'identité officielle avec photo (passeport ou CNI).",
              "L'examen commence par la section Écoute. Les consignes audio expliquent tout — écoute-les.",
              "Tu peux annoter ton livret de questions, mais seule ta feuille de réponses est corrigée.",
              "Tu ne peux pas revenir à la section Écoute une fois passé à la Lecture.",
              "Les résultats sont disponibles 3 à 5 jours après le test.",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                  ✓
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

      </div>
    </article>
    </div>
  );
}
