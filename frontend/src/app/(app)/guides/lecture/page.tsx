// ─── Guide Lecture — Parties 5 à 7 ───────────────────────────────────────────

export default function GuideLecturePage() {
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
          Section Lecture — Stratégies par partie
        </h1>
        <p className="text-gray-500 mt-3 text-base leading-relaxed">
          75 minutes, 100 questions, 3 parties. La section Lecture est souvent
          la plus chronométrée : gérer son temps est aussi important que comprendre
          les textes. Ce guide détaille chaque partie et les techniques pour progresser.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <span className="rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 uppercase tracking-wide">
            Lecture
          </span>
          <span className="text-sm text-gray-400">75 min · 100 questions</span>
        </div>
      </header>

      <div className="flex flex-col gap-12">

        {/* ══════════════════════════════════════════════════════════════════════
            PARTIE 5 — Phrases incomplètes
        ══════════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 text-sm font-bold flex items-center justify-center shrink-0">
              5
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Partie 5 — Phrases incomplètes</h2>
              <p className="text-xs text-gray-400">30 questions · objectif : 30–45 s / question</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm text-gray-700 leading-relaxed">
            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Format</h3>
              <p>
                Une phrase à trou. Quatre mots ou groupes de mots (A, B, C, D) à placer dans le
                blanc pour compléter la phrase correctement. Pas de contexte extérieur — tout
                est dans la phrase elle-même.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Points de grammaire testés</h3>
              <div className="flex flex-col gap-3 mt-1">
                {[
                  {
                    cat: "Choix de la forme verbale",
                    desc: "Temps verbaux (present perfect vs simple past), voix passive, participes passés vs présents. Ex. : \"The report _____ by Friday.\" → will be submitted.",
                  },
                  {
                    cat: "Nature du mot (catégorie grammaticale)",
                    desc: "Les 4 réponses sont souvent la même racine sous différentes formes : nom / verbe / adjectif / adverbe. Ex. : \"The project was completed _____.\" → successfully (adverbe).",
                  },
                  {
                    cat: "Prépositions et connecteurs logiques",
                    desc: "\"Despite / Although / Because of / However\" — tester la compréhension des relations logiques entre propositions.",
                  },
                  {
                    cat: "Pronoms et déterminants",
                    desc: "Accord sujet-verbe, pronoms relatifs (who / which / whose), articles (a / an / the).",
                  },
                  {
                    cat: "Vocabulaire en contexte",
                    desc: "Quatre synonymes proches mais seul l'un convient au contexte sémantique ou à la collocation usuelle.",
                  },
                ].map(({ cat, desc }) => (
                  <div key={cat} className="flex flex-col gap-0.5 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <span className="font-semibold text-foreground">{cat}</span>
                    <span className="text-gray-600">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Pièges classiques</h3>
              <ul className="flex flex-col gap-2 mt-1">
                {[
                  { trap: "Faux amis grammaticaux", desc: "\"Economic\" vs \"economical\", \"historic\" vs \"historical\" — des adjectifs qui ressemblent mais ne s'utilisent pas dans les mêmes contextes." },
                  { trap: "Collocations fixes", desc: "Certains verbes ou adjectifs se combinent avec des prépositions précises (\"consist of\", \"responsible for\", \"pleased with\") — il faut les avoir mémorisées." },
                  { trap: "Distraction par la forme", desc: "Une réponse grammaticalement correcte en isolation qui ne convient pas à la phrase entière." },
                ].map(({ trap, desc }) => (
                  <div key={trap} className="flex flex-col gap-0.5">
                    <span className="font-semibold text-foreground">{trap}</span>
                    <span className="text-gray-600">{desc}</span>
                  </div>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[#6600CC]/20 bg-[#faf6ff] p-5">
              <h3 className="font-bold text-[#6600CC] mb-2">Stratégie</h3>
              <ol className="flex flex-col gap-2 list-decimal list-inside">
                <li><strong>Identifie d'abord la catégorie grammaticale</strong> attendue (nom ? adverbe ? conjonction ?) — cela élimine souvent 2 à 3 réponses d'emblée.</li>
                <li>Lis la phrase entière avant de répondre — la fin de la phrase peut changer le contexte.</li>
                <li>Méfie-toi des distracteurs qui ressemblent aux bons mots mais appartiennent à une autre catégorie.</li>
                <li>Pour les questions de vocabulaire, teste chaque réponse dans la phrase mentalement — la bonne sonnera naturelle.</li>
                <li>Ne dépasse pas <strong>45 secondes</strong> par question — si tu bloques, coche et passe. Tu dois finir la Partie 7 à temps.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            PARTIE 6 — Textes à trous
        ══════════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 text-sm font-bold flex items-center justify-center shrink-0">
              6
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Partie 6 — Textes à trous</h2>
              <p className="text-xs text-gray-400">16 questions · 4 textes · objectif : 2–3 min / texte</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm text-gray-700 leading-relaxed">
            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Format</h3>
              <p>
                Un texte court (e-mail, mémo, lettre, annonce) avec <strong>4 blancs</strong>.
                Pour chaque blanc, tu choisis parmi 4 options. Contrairement à la Partie 5,
                le contexte global du texte est souvent nécessaire pour répondre correctement.
                Une des 4 questions par texte porte généralement sur l'<em>insertion d'une phrase entière</em>.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Types de documents rencontrés</h3>
              <ul className="flex flex-col gap-1.5 mt-1">
                {[
                  "E-mails professionnels (commande, réclamation, confirmation)",
                  "Mémos internes d'entreprise",
                  "Lettres commerciales ou officielles",
                  "Annonces (offre d'emploi, événement, règlement)",
                  "Articles courts de newsletter ou de magazine d'entreprise",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#6600CC] shrink-0">–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">La question d'insertion de phrase</h3>
              <p className="mb-2">
                Une des 4 questions te demande de choisir quelle phrase entière s'insère
                le mieux dans le texte à l'endroit indiqué. Pour répondre correctement :
              </p>
              <ul className="flex flex-col gap-1.5 mt-1">
                {[
                  "Lis la phrase précédente et la phrase suivante pour comprendre le contexte local.",
                  "La bonne réponse s'enchaîne logiquement — elle continue une idée ou l'illustre.",
                  "Les mauvaises réponses introduisent souvent une idée hors contexte ou répètent inutilement.",
                  "Les connecteurs logiques (\"However\", \"In addition\", \"As a result\") dans les options sont des indices.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#6600CC] shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[#6600CC]/20 bg-[#faf6ff] p-5">
              <h3 className="font-bold text-[#6600CC] mb-2">Stratégie</h3>
              <ol className="flex flex-col gap-2 list-decimal list-inside">
                <li><strong>Lis l'intégralité du texte une première fois</strong> avant de répondre pour saisir le ton, le sujet et la logique générale.</li>
                <li>Traite d'abord les questions de grammaire (plus rapides), puis reviens à la question de phrase entière.</li>
                <li>Pour chaque blanc, relis la phrase complète avec la réponse choisie — cela révèle souvent les erreurs.</li>
                <li>Les cohérences de temps verbaux dans le texte sont des indices : si tout est au passé, le blanc attend probablement un passé.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            PARTIE 7 — Lecture de documents
        ══════════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 text-sm font-bold flex items-center justify-center shrink-0">
              7
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Partie 7 — Lecture de documents</h2>
              <p className="text-xs text-gray-400">54 questions · documents simples et multiples · ~40 min</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm text-gray-700 leading-relaxed">
            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Format</h3>
              <p className="mb-3">
                La partie la plus longue. Elle contient deux types de documents :
              </p>
              <ul className="flex flex-col gap-2">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 font-bold text-emerald-600 shrink-0">Simple :</span>
                  <span>Un seul document (e-mail, article, publicité, formulaire, tableau) suivi de 2 à 4 questions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 font-bold text-emerald-600 shrink-0">Multiple :</span>
                  <span>2 ou 3 documents à lire ensemble (ex. : un e-mail + une réponse, ou un formulaire + un mémo). Les questions croisent les informations des deux sources.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Types de documents</h3>
              <ul className="flex flex-col gap-1.5 mt-1">
                {[
                  "E-mails et chaînes de messages",
                  "Articles de presse ou de blog d'entreprise",
                  "Publicités et offres commerciales",
                  "Formulaires, tableaux, plannings",
                  "Offres d'emploi et CV",
                  "Notices, modes d'emploi, règlements",
                  "Critiques de produits ou services",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#6600CC] shrink-0">–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Types de questions</h3>
              <div className="flex flex-col gap-3 mt-1">
                {[
                  { type: "Idée principale", desc: "\"What is the purpose of the e-mail?\" — La réponse est souvent dans l'introduction ou l'objet du document." },
                  { type: "Détail factuel", desc: "Un fait précis (prix, date, nom, lieu) — la réponse est directement dans le texte, il faut la trouver." },
                  { type: "Inférence", desc: "\"What is implied about...?\" — La réponse n'est pas dite explicitement, il faut déduire depuis le contexte. C'est la plus difficile." },
                  { type: "Vocabulaire en contexte", desc: "\"The word X in paragraph 2 is closest in meaning to...\" — La définition correcte dépend du sens dans le texte, pas du sens général." },
                  { type: "Questions croisées (multi-documents)", desc: "Informations qui nécessitent de lire les deux ou trois documents ensemble pour répondre correctement." },
                ].map(({ type, desc }) => (
                  <div key={type} className="flex flex-col gap-0.5 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <span className="font-semibold text-foreground">{type}</span>
                    <span className="text-gray-600">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Gestion du temps — le défi principal</h3>
              <p className="mb-3">
                Avec 54 questions et environ 40 minutes disponibles, tu disposes en moyenne de
                <strong> 45 secondes par question</strong>. Beaucoup de candidats manquent de temps
                en Partie 7 parce qu'ils lisent trop lentement ou trop en détail.
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-gray-500">Documents simples (1 doc)</span>
                  <span className="font-semibold text-foreground">1–2 minutes par document</span>
                </div>
                <div className="flex justify-between items-center text-xs bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-gray-500">Documents multiples (2–3 docs)</span>
                  <span className="font-semibold text-foreground">3–4 minutes par groupe</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#6600CC]/20 bg-[#faf6ff] p-5">
              <h3 className="font-bold text-[#6600CC] mb-2">Stratégie</h3>
              <ol className="flex flex-col gap-2 list-decimal list-inside">
                <li><strong>Lis les questions en premier</strong> avant le texte — tu sais exactement quoi chercher et où concentrer ton attention.</li>
                <li>Fais du <strong>scanning ciblé</strong> : cherche les mots-clés des questions dans le texte plutôt que de tout lire mot à mot.</li>
                <li>Pour les questions d'inférence, reste dans le cadre du document — n'invente pas de contexte extérieur.</li>
                <li>Pour les documents multiples, identifie d'abord le type de chaque document et son rôle dans le groupe.</li>
                <li>Si tu bloques sur une question d'inférence, saute-la et reviens — les autres questions du même document t'auront donné plus de contexte.</li>
                <li>Réserve les 5–8 dernières minutes pour répondre aux questions que tu avais laissées de côté.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* ── Gestion du temps globale ── */}
        <section className="rounded-2xl border border-gray-100 p-6">
          <h2 className="text-base font-bold text-foreground mb-4">
            Répartition recommandée des 75 minutes
          </h2>
          <div className="flex flex-col gap-2 text-sm">
            {[
              { part: "Partie 5 — Phrases incomplètes", time: "~18 min", note: "30 questions × 36 s" },
              { part: "Partie 6 — Textes à trous", time: "~12 min", note: "4 textes × 3 min" },
              { part: "Partie 7 — Lecture de documents", time: "~40 min", note: "La majorité du temps" },
              { part: "Révision / questions manquées", time: "~5 min", note: "Ne jamais laisser de vide" },
            ].map(({ part, time, note }) => (
              <div key={part} className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
                <span className="text-gray-700 font-medium">{part}</span>
                <div className="text-right shrink-0">
                  <span className="font-bold text-foreground">{time}</span>
                  <span className="text-gray-400 text-xs block">{note}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Rappel final ── */}
        <section className="rounded-2xl bg-gray-50 border border-gray-100 p-6">
          <h2 className="text-base font-bold text-foreground mb-3">
            Ce qui fait vraiment la différence à la Lecture
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-gray-700">
            {[
              "La Partie 5 est la plus mécanique : des révisions régulières de grammaire et de vocabulaire donnent des résultats rapides.",
              "La Partie 7 est celle où les points se perdent le plus souvent à cause du temps — entraîne-toi à lire vite et à cibler les infos pertinentes.",
              "Ne jamais lire un texte complet avant de savoir ce qu'on cherche — lis les questions d'abord.",
              "Tous les indices sont dans le texte : méfie-toi de tes connaissances générales qui pourraient te faire choisir une réponse non étayée par le document.",
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
