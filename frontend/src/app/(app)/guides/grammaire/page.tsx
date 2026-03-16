// ─── Guide Grammaire — Notions essentielles TOEIC ─────────────────────────────

export default function GuideGrammairePage() {
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
          Grammaire TOEIC — Les notions clés et les pièges à déjouer
        </h1>
        <p className="text-gray-500 mt-3 text-base leading-relaxed">
          Pas besoin de tout savoir. Le TOEIC teste un ensemble précis et
          récurrent de structures grammaticales — surtout aux Parties 5 et 6.
          Ce guide couvre les 8 points les plus testés, avec les pièges
          classiques et les stratégies pour ne plus se tromper.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <span className="rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 uppercase tracking-wide">
            Lecture
          </span>
          <span className="text-sm text-gray-400">Parties 5, 6 & 7 · 8 notions essentielles</span>
        </div>
      </header>

      <div className="flex flex-col gap-12">

        {/* ── Intro : pourquoi la grammaire ── */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Pourquoi la grammaire est décisive à la Lecture
          </h2>
          <div className="flex flex-col gap-3 text-sm text-gray-700 leading-relaxed">
            <p>
              La <strong>Partie 5</strong> (30 questions) et la{" "}
              <strong>Partie 6</strong> (16 questions) testent directement ta
              grammaire : on te donne une phrase avec un blanc et tu dois choisir
              le bon mot parmi quatre options. Ces deux parties représentent{" "}
              <strong>23 % de ton score total</strong>. En les maîtrisant, tu
              gagnes des points rapides — certaines questions se répondent en
              moins de 15 secondes avec les bons automatismes.
            </p>
            <p>
              Ce n'est pas de la grammaire académique. Le TOEIC teste si tu peux
              utiliser l'anglais de manière <em>naturelle et correcte</em> dans
              un contexte professionnel. Les mêmes structures reviennent examen
              après examen.
            </p>
          </div>
        </section>

        {/* ══ 1. CATÉGORIES GRAMMATICALES ══ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-[#f3ebff] text-[#6600CC] text-sm font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Catégories grammaticales (nature des mots)
              </h2>
              <p className="text-xs text-gray-400">
                La notion la plus testée à la Partie 5
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm text-gray-700 leading-relaxed">
            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Ce que c'est</h3>
              <p>
                Le TOEIC te donne 4 formes du même mot — nom, verbe, adjectif,
                adverbe — et tu dois choisir la bonne selon sa position dans
                la phrase. C'est la question la plus fréquente de toute la
                section Lecture.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-3">Exemple type</h3>
              <p className="italic text-gray-600 mb-3">
                "The manager made a _____ decision."
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { opt: "(A) decide", note: "verbe ✗" },
                  { opt: "(B) decisive", note: "adj ✓", correct: true },
                  { opt: "(C) decisively", note: "adv ✗" },
                  { opt: "(D) decision", note: "nom ✗" },
                ].map(({ opt, note, correct }) => (
                  <div
                    key={opt}
                    className={`rounded-lg border px-3 py-2 text-xs ${
                      correct
                        ? "border-green-300 bg-green-50 text-green-700 font-semibold"
                        : "border-gray-100 text-gray-500"
                    }`}
                  >
                    <div>{opt}</div>
                    <div className="mt-0.5 font-medium">{note}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Le blanc est après un article (a) et avant un nom (decision) → il faut un adjectif.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-3">Les positions à reconnaître</h3>
              <div className="flex flex-col gap-2">
                {[
                  { pos: "Sujet / après article (a, the)", nature: "Nom", ex: "the _____ of the project → decision" },
                  { pos: "Avant un nom", nature: "Adjectif", ex: "a _____ meeting → productive" },
                  { pos: "Après to be / become", nature: "Adjectif ou Nom", ex: "is _____ → available" },
                  { pos: "Avant un verbe / adjectif / autre adverbe", nature: "Adverbe", ex: "_____ completed → fully" },
                  { pos: "Après un auxiliaire (will, can, has...)", nature: "Verbe (base/participe)", ex: "will _____ → attend" },
                ].map(({ pos, nature, ex }) => (
                  <div key={pos} className="flex flex-col gap-0.5 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full shrink-0">{nature}</span>
                      <span className="text-gray-700">{pos}</span>
                    </div>
                    <span className="text-xs text-gray-400 pl-0.5">Ex. : {ex}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#6600CC]/20 bg-[#faf6ff] p-5">
              <h3 className="font-bold text-[#6600CC] mb-2">Stratégie</h3>
              <p className="text-sm text-gray-700">
                Avant de lire les options, identifie la <strong>position du blanc</strong> dans la
                phrase. Ça suffit souvent pour éliminer 2 ou 3 options immédiatement.
                Ne perds pas de temps à analyser le sens si la structure grammaticale donne
                directement la réponse.
              </p>
            </div>
          </div>
        </section>

        {/* ══ 2. TEMPS VERBAUX ══ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-[#f3ebff] text-[#6600CC] text-sm font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Temps verbaux</h2>
              <p className="text-xs text-gray-400">Present perfect, simple past, futur — les plus piégeurs</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm text-gray-700 leading-relaxed">
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Temps</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Marqueurs clés</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Usage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { tense: "Present perfect", markers: "since, for, already, just, yet, recently, so far", use: "Action passée avec lien au présent" },
                    { tense: "Simple past", markers: "yesterday, last week, in 2023, ago", use: "Action passée à un moment précis et fini" },
                    { tense: "Present simple", markers: "always, usually, every day", use: "Vérité générale, habitude" },
                    { tense: "Future (will)", markers: "tomorrow, next week, soon", use: "Décision immédiate, promesse, prédiction" },
                    { tense: "Future (be going to)", markers: "already planned, intend to", use: "Plan prévu à l'avance" },
                    { tense: "Present continuous", markers: "now, at the moment, currently", use: "Action en cours au moment où on parle" },
                  ].map(({ tense, markers, use }) => (
                    <tr key={tense} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 font-semibold text-foreground">{tense}</td>
                      <td className="px-4 py-2.5 text-[#6600CC] text-xs font-medium">{markers}</td>
                      <td className="px-4 py-2.5 text-gray-500">{use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-[#6600CC]/20 bg-[#faf6ff] p-5">
              <h3 className="font-bold text-[#6600CC] mb-2">Stratégie</h3>
              <p>
                Cherche d'abord un <strong>marqueur temporel</strong> dans la phrase. Il révèle presque
                toujours le bon temps. Si tu vois <em>since</em> ou <em>for</em> → present perfect.
                Si tu vois <em>yesterday</em> ou <em>in [année passée]</em> → simple past.
              </p>
            </div>
          </div>
        </section>

        {/* ══ 3. PRÉPOSITIONS ══ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-[#f3ebff] text-[#6600CC] text-sm font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Prépositions</h2>
              <p className="text-xs text-gray-400">at / in / on — et les collocations prépositionnelles</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm text-gray-700 leading-relaxed">
            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-3">at / in / on pour le temps</h3>
              <div className="flex flex-col gap-2">
                {[
                  { prep: "at", rule: "Heure précise, moment précis", ex: "at 9 AM, at noon, at the end of" },
                  { prep: "in", rule: "Période longue (mois, année, saison)", ex: "in March, in 2024, in the morning" },
                  { prep: "on", rule: "Jour précis, date", ex: "on Monday, on March 5th, on my birthday" },
                ].map(({ prep, rule, ex }) => (
                  <div key={prep} className="flex items-start gap-3 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <span className="w-7 h-7 rounded-full bg-[#f3ebff] text-[#6600CC] text-xs font-bold flex items-center justify-center shrink-0">
                      {prep}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{rule}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{ex}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-3">
                Prépositions figées avec adjectifs courants
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
                {[
                  "responsible for",
                  "interested in",
                  "familiar with",
                  "aware of",
                  "capable of",
                  "satisfied with",
                  "eligible for",
                  "committed to",
                  "dependent on",
                  "experienced in",
                ].map((col) => (
                  <div key={col} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6600CC] shrink-0" />
                    <span className="font-medium text-foreground">{col}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Ces combinaisons sont figées — apprends-les comme des unités entières.
              </p>
            </div>

            <div className="rounded-xl border border-[#6600CC]/20 bg-[#faf6ff] p-5">
              <h3 className="font-bold text-[#6600CC] mb-2">Stratégie</h3>
              <p>
                Les prépositions ne s'expliquent pas toujours par une règle logique.{" "}
                <strong>Mémorise les collocations entières</strong> plutôt que d'essayer de
                déduire. Si tu hésites, élimine les options clairement incorrectes et fais
                confiance à ton "oreille" si tu as beaucoup écouté de l'anglais.
              </p>
            </div>
          </div>
        </section>

        {/* ══ 4. ARTICLES ══ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-[#f3ebff] text-[#6600CC] text-sm font-bold flex items-center justify-center shrink-0">
              4
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Articles — a / an / the / ∅</h2>
              <p className="text-xs text-gray-400">Moins fréquent mais régulièrement piégeur</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 overflow-hidden text-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Article</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Quand l'utiliser</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Exemple</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                {[
                  { art: "a / an", when: "Première mention, non-spécifique, dénombrable singulier", ex: "She sent a report." },
                  { art: "the", when: "Chose identifiée, mentionnée avant, unique en son genre", ex: "The report was approved." },
                  { art: "∅ (rien)", when: "Pluriel ou indénombrable en général", ex: "Employees need support." },
                ].map(({ art, when, ex }) => (
                  <tr key={art} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-bold text-[#6600CC]">{art}</td>
                    <td className="px-4 py-2.5">{when}</td>
                    <td className="px-4 py-2.5 italic text-gray-500">{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ══ 5. CONNECTEURS LOGIQUES ══ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-[#f3ebff] text-[#6600CC] text-sm font-bold flex items-center justify-center shrink-0">
              5
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Connecteurs logiques</h2>
              <p className="text-xs text-gray-400">Cause, opposition, conséquence — omniprésents aux Parties 6 et 7</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm text-gray-700 leading-relaxed">
            <p>
              Les connecteurs sont testés à la Partie 6 (choix entre plusieurs
              connecteurs avec un contexte) et à la Partie 7 (compréhension du
              raisonnement d'un texte). Connaître leur sens précis évite les
              confusions.
            </p>
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Connecteurs</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Usage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { type: "Opposition", connectors: "although, even though, despite, in spite of, however, nevertheless", usage: "Contraste entre deux idées" },
                    { type: "Cause", connectors: "because, since, as, due to, owing to, because of", usage: "Introduire la cause d'un fait" },
                    { type: "Conséquence", connectors: "therefore, thus, as a result, consequently, hence", usage: "Introduire la conséquence logique" },
                    { type: "Addition", connectors: "in addition, furthermore, moreover, besides, also", usage: "Ajouter une information" },
                    { type: "Condition", connectors: "if, unless, provided that, as long as", usage: "Exprimer une condition" },
                    { type: "Temps", connectors: "before, after, when, while, once, until, as soon as", usage: "Situer dans le temps" },
                  ].map(({ type, connectors, usage }) => (
                    <tr key={type} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 font-semibold text-foreground shrink-0">{type}</td>
                      <td className="px-4 py-2.5 text-[#6600CC] text-xs font-medium">{connectors}</td>
                      <td className="px-4 py-2.5 text-gray-500">{usage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Le piège although vs despite</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded shrink-0">✓</span>
                  <span><strong>Although</strong> + sujet + verbe — <em>Although it was late, he finished.</em></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded shrink-0">✓</span>
                  <span><strong>Despite</strong> + nom/gérondif — <em>Despite the delay, he finished. / Despite being late.</em></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded shrink-0">✗</span>
                  <span className="text-gray-500"><em>Despite it was late</em> → incorrect (despite ne précède pas sujet + verbe)</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#6600CC]/20 bg-[#faf6ff] p-5">
              <h3 className="font-bold text-[#6600CC] mb-2">Stratégie</h3>
              <p>
                À la Partie 6, quand le blanc correspond à un connecteur, lis les deux
                propositions et identifie le <strong>lien logique</strong> entre elles.
                Est-ce une opposition ? Une cause ? Une conséquence ? Ce lien donne
                directement la famille du bon connecteur.
              </p>
            </div>
          </div>
        </section>

        {/* ══ 6. PROPOSITIONS RELATIVES ══ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-[#f3ebff] text-[#6600CC] text-sm font-bold flex items-center justify-center shrink-0">
              6
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Pronoms relatifs</h2>
              <p className="text-xs text-gray-400">who / which / that / whose / where / when</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 overflow-hidden text-sm mb-4">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Pronom</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Pour quoi</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Exemple</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                {[
                  { pron: "who", what: "Personnes (sujet ou objet)", ex: "The employee who called…" },
                  { pron: "which", what: "Choses, animaux", ex: "The report which was sent…" },
                  { pron: "that", what: "Personnes ou choses (restrictif)", ex: "The plan that we approved…" },
                  { pron: "whose", what: "Possession (pers. ou choses)", ex: "The manager whose team…" },
                  { pron: "where", what: "Lieu", ex: "The office where she works…" },
                  { pron: "when", what: "Moment, période", ex: "The day when he resigned…" },
                ].map(({ pron, what, ex }) => (
                  <tr key={pron} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-bold text-[#6600CC]">{pron}</td>
                    <td className="px-4 py-2.5">{what}</td>
                    <td className="px-4 py-2.5 italic text-gray-500">{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-[#6600CC]/20 bg-[#faf6ff] p-5 text-sm">
            <h3 className="font-bold text-[#6600CC] mb-2">Piège who vs whose</h3>
            <p className="text-gray-700">
              <em>"The director <strong>who</strong> approved the budget"</em> — <em>who</em> = sujet de <em>approved</em>.{" "}
              <em>"The director <strong>whose</strong> budget was approved"</em> — <em>whose</em> = possession
              (le budget du directeur). Si après le blanc suit un nom (budget, team, project), c'est <strong>whose</strong>.
            </p>
          </div>
        </section>

        {/* ══ 7. ACCORD SUJET-VERBE ══ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-[#f3ebff] text-[#6600CC] text-sm font-bold flex items-center justify-center shrink-0">
              7
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Accord sujet-verbe</h2>
              <p className="text-xs text-gray-400">Les cas qui piègent même les anglophones</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm text-gray-700 leading-relaxed">
            {[
              {
                rule: "each, every, either, neither → singulier",
                ex: "Each employee is required to sign. / Neither option is available.",
              },
              {
                rule: "Collectifs (company, team, staff) → singulier en anglais américain",
                ex: "The team has completed the project. (pas have)",
              },
              {
                rule: "Sujets composés avec or / nor → accord avec le sujet le plus proche",
                ex: "Neither the manager nor the employees were informed.",
              },
              {
                rule: "Expressions interruptives (along with, as well as, together with) → accord avec le vrai sujet",
                ex: "The CEO, along with his assistants, is attending. (is, pas are)",
              },
              {
                rule: "Noms indénombrables (information, advice, equipment) → toujours singulier",
                ex: "The information is available. (pas are)",
              },
            ].map(({ rule, ex }) => (
              <div
                key={rule}
                className="rounded-xl border border-gray-100 p-4"
              >
                <p className="font-semibold text-foreground mb-1">{rule}</p>
                <p className="text-xs text-[#6600CC] italic">{ex}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 8. CONDITIONNELS ══ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-[#f3ebff] text-[#6600CC] text-sm font-bold flex items-center justify-center shrink-0">
              8
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Conditionnels</h2>
              <p className="text-xs text-gray-400">Types 1 et 2 — les plus testés</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 overflow-hidden text-sm mb-4">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Structure</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Sens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-foreground">Type 0</td>
                  <td className="px-4 py-2.5 text-[#6600CC] text-xs">If + présent simple, présent simple</td>
                  <td className="px-4 py-2.5">Vérité générale, fait toujours vrai</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-foreground">Type 1</td>
                  <td className="px-4 py-2.5 text-[#6600CC] text-xs">If + présent simple, will + base</td>
                  <td className="px-4 py-2.5">Situation réelle / probable dans le futur</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-semibold text-foreground">Type 2</td>
                  <td className="px-4 py-2.5 text-[#6600CC] text-xs">If + past simple, would + base</td>
                  <td className="px-4 py-2.5">Hypothèse irréelle dans le présent</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-gray-100 p-5 text-sm">
            <h3 className="font-bold text-foreground mb-2">Le piège classique : unless</h3>
            <p className="text-gray-700 leading-relaxed">
              <strong>Unless</strong> = <em>if... not</em>. Il ne se combine jamais avec une
              négation supplémentaire.{" "}
              <span className="text-green-700 font-medium">Unless he calls</span> = if he doesn't
              call. Jamais <em>unless he doesn't call</em> (double négation, sens inversé).
            </p>
          </div>
        </section>

        {/* ── Rappel final ── */}
        <section className="rounded-2xl bg-gray-50 border border-gray-100 p-6">
          <h2 className="text-base font-bold text-foreground mb-3">
            Ce qu'il faut retenir pour la Partie 5
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-gray-700">
            {[
              "50 % des questions testent la nature du mot (nom/verbe/adj/adv) — identifie la position du blanc en premier.",
              "Cherche les marqueurs temporels avant de choisir un temps verbal.",
              "Les prépositions figées (responsible for, aware of…) sont à mémoriser comme des blocs.",
              "Les connecteurs logiques demandent de comprendre le sens des deux parties de la phrase.",
              "Accord sujet-verbe : méfie-toi de each/every/neither (singulier) et des expressions comme along with.",
              "La Partie 5 est chronométrée — vise 30 à 45 secondes par question. Si tu bloques, passe.",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 text-[#6600CC] shrink-0">→</span>
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
