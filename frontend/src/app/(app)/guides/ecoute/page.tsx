// ─── Guide Écoute — Parties 1 à 4 ────────────────────────────────────────────

export default function GuideEcoutePage() {
  return (
    <article className="px-6 py-10 max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <p className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest mb-2">
          Guide
        </p>
        <h1 className="text-3xl font-bold text-foreground leading-tight">
          Section Écoute — Stratégies par partie
        </h1>
        <p className="text-gray-500 mt-3 text-base leading-relaxed">
          45 minutes, 100 questions, 4 parties. L'audio ne passe qu'une fois —
          chaque seconde compte. Ce guide détaille les types de questions, les
          pièges récurrents et les stratégies pour maximiser ton score.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <span className="rounded-full bg-blue-50 text-blue-500 text-xs font-bold px-3 py-1 uppercase tracking-wide">
            Écoute
          </span>
          <span className="text-sm text-gray-400">45 min · 100 questions</span>
        </div>
      </header>

      <div className="flex flex-col gap-12">

        {/* ══════════════════════════════════════════════════════════════════════
            PARTIE 1 — Photographies
        ══════════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-[#f3ebff] text-[#6600CC] text-sm font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Partie 1 — Photographies</h2>
              <p className="text-xs text-gray-400">6 questions · environ 5 minutes</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm text-gray-700 leading-relaxed">
            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Format</h3>
              <p>
                On te montre une photo. Quatre énoncés (A, B, C, D) sont lus à voix haute — tu ne
                les vois pas écrits. Tu dois choisir celui qui décrit le mieux la photo.
                Tu as quelques secondes pour choisir avant la photo suivante.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Types de photos rencontrées</h3>
              <ul className="flex flex-col gap-1.5 mt-1">
                {[
                  "Scènes de bureau : réunion, ordinateur, prise de notes",
                  "Espaces publics : gares, aéroports, rues, halls d'entrée",
                  "Environnements industriels : entrepôts, ateliers, chantiers",
                  "Commerces : magasins, restaurants, marchés",
                  "Activités en plein air : jardins, parkings, transports",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#6600CC] shrink-0">–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Pièges classiques</h3>
              <ul className="flex flex-col gap-2 mt-1">
                {[
                  { trap: "Homophones visuels", desc: "L'énoncé contient un mot qui ressemble phonétiquement à ce qu'on voit mais qui ne correspond pas — ex. \"He is writing\" vs \"He is riding\"." },
                  { trap: "Action vs état", desc: "Un énoncé décrit une action en cours alors que la photo montre un résultat figé — ex. \"She is sitting down\" (action) vs \"She is seated\" (état)." },
                  { trap: "Détail exact", desc: "L'énoncé mentionne un objet ou une personne qui est bien présent·e dans la photo, mais la description globale est fausse." },
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
                <li>Observe la photo pendant les 3 secondes avant que l'audio démarre — identifie le sujet principal, son action, et le contexte.</li>
                <li>Élimine d'abord les énoncés clairement faux avant de te concentrer sur les plus proches.</li>
                <li>Méfie-toi des énoncés qui reprennent des mots présents dans la photo (ex. un ordinateur sur un bureau) mais avec une description inexacte.</li>
                <li>En cas de doute, préfère les énoncés qui décrivent l'état général de la scène plutôt que les détails.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            PARTIE 2 — Questions-réponses
        ══════════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-[#f3ebff] text-[#6600CC] text-sm font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Partie 2 — Questions-réponses</h2>
              <p className="text-xs text-gray-400">25 questions · environ 12 minutes</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm text-gray-700 leading-relaxed">
            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Format</h3>
              <p>
                Tu entends une question ou une affirmation, suivie de trois réponses possibles (A, B, C).
                Il n'y a pas de photo. Tu dois choisir la réponse la plus logique ou appropriée.
                Rien n'est écrit — tout se passe à l'oreille. C'est la partie la plus rapide du test.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Types de questions rencontrées</h3>
              <div className="flex flex-col gap-3 mt-1">
                {[
                  { type: "Questions en WH- (Who, What, Where, When, Why, How)", desc: "Les plus fréquentes. La réponse correcte contient généralement l'information demandée par le mot interrogatif." },
                  { type: "Questions en Yes/No", desc: "Attention : la bonne réponse n'est pas toujours \"Yes\" ou \"No\" — elle peut être une alternative ou une information complémentaire." },
                  { type: "Affirmations / demandes indirectes", desc: "Ex. \"I think the meeting is at 3 PM.\" → la réponse corrige ou confirme, comme dans une vraie conversation." },
                  { type: "Questions négatives ou avec tags", desc: "\"Isn't the report ready yet?\" — Ce type est souvent piégeux car il exige une attention fine au sens de la négation." },
                ].map(({ type, desc }) => (
                  <div key={type} className="flex flex-col gap-0.5 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <span className="font-semibold text-foreground">{type}</span>
                    <span className="text-gray-600">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Pièges classiques</h3>
              <ul className="flex flex-col gap-2 mt-1">
                {[
                  { trap: "Réponses hors sujet", desc: "Une réponse contient des mots de la question mais ne répond pas à ce qui est demandé." },
                  { trap: "Associations sonores", desc: "Une réponse contient des sons proches des mots de la question pour créer une confusion auditive." },
                  { trap: "Réponse correcte grammaticalement, incorrecte contextuellement", desc: "\"When does the store close?\" → \"It closes.\" est grammaticalement valide mais inutile comme réponse." },
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
                <li>Identifie le <strong>mot interrogatif</strong> dès les premières secondes — il définit le type de réponse attendue.</li>
                <li>Élimination active : 2 des 3 réponses sont presque toujours clairement fausses. Élimine-les pour te concentrer sur la bonne.</li>
                <li>Méfie-toi des réponses qui répètent les mots de la question — c'est souvent un piège sonore.</li>
                <li>Si tu n'as pas compris, choisis la réponse la plus générale ou logique. Ne laisse pas la case vide.</li>
                <li>La Partie 2 est rapide — si tu bloques, passe immédiatement à la suivante. Tu ne peux pas revenir en arrière.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            PARTIE 3 — Conversations
        ══════════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-[#f3ebff] text-[#6600CC] text-sm font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Partie 3 — Conversations</h2>
              <p className="text-xs text-gray-400">39 questions · 13 conversations · environ 18 minutes</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm text-gray-700 leading-relaxed">
            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Format</h3>
              <p>
                Tu écoutes une courte conversation entre deux ou trois personnes (environ 30 à 60 secondes),
                puis tu réponds à <strong>3 questions</strong> à leur sujet. Les questions et les 4 réponses
                possibles sont imprimées dans le livret — tu peux les lire pendant que la conversation joue.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Thèmes récurrents</h3>
              <ul className="flex flex-col gap-1.5 mt-1">
                {[
                  "Prise de rendez-vous ou modification d'un planning",
                  "Discussion sur un projet ou une réunion",
                  "Commande, livraison, service client",
                  "Problème technique ou demande d'aide",
                  "Conversation téléphonique professionnelle",
                  "Discussion sur les ressources humaines (recrutement, congés)",
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
                  { type: "Qui / Où / Quand / Quoi", desc: "Identification des interlocuteurs, du lieu, du moment ou du sujet. Réponse souvent directement dans la conversation." },
                  { type: "Intention ou but", desc: "\"Why does the man call?\" — Comprendre la raison de la conversation, souvent dans les premières répliques." },
                  { type: "Ce qui va se passer ensuite", desc: "\"What will the woman do next?\" — Inférence logique à partir de la fin de la conversation." },
                  { type: "Tableau / graphique associé", desc: "Certaines conversations (versions récentes) incluent un visuel (email, planning, carte) — lis-le avant d'écouter." },
                ].map(({ type, desc }) => (
                  <div key={type} className="flex flex-col gap-0.5 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <span className="font-semibold text-foreground">{type}</span>
                    <span className="text-gray-600">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#6600CC]/20 bg-[#faf6ff] p-5">
              <h3 className="font-bold text-[#6600CC] mb-2">Stratégie</h3>
              <ol className="flex flex-col gap-2 list-decimal list-inside">
                <li><strong>Lis les 3 questions avant d'écouter</strong> la conversation — tu sais exactement quoi chercher.</li>
                <li>Concentre-toi sur le <em>début</em> de la conversation (qui parle, pourquoi) et la <em>fin</em> (quelle décision est prise).</li>
                <li>Ne reste pas bloqué si tu rates une information — la réponse à la question suivante arrive.</li>
                <li>Méfie-toi des réponses qui reprennent des mots entendus mais avec un sens différent.</li>
                <li>Pour les questions d'inférence, élimine les réponses absurdes — souvent il en reste une seule logique.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            PARTIE 4 — Monologues
        ══════════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-full bg-[#f3ebff] text-[#6600CC] text-sm font-bold flex items-center justify-center shrink-0">
              4
            </span>
            <div>
              <h2 className="text-lg font-bold text-foreground">Partie 4 — Monologues</h2>
              <p className="text-xs text-gray-400">30 questions · 10 monologues · environ 15 minutes</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-sm text-gray-700 leading-relaxed">
            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Format</h3>
              <p>
                Un seul locuteur parle pendant 30 à 60 secondes (annonce, message vocal,
                publicité, bulletin météo, etc.). Comme en Partie 3, tu réponds à
                <strong> 3 questions</strong> pour chaque extrait, et tu peux lire les
                questions imprimées pendant l'écoute.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Types de monologues</h3>
              <ul className="flex flex-col gap-1.5 mt-1">
                {[
                  "Message vocal ou répondeur téléphonique",
                  "Annonce dans un lieu public (aéroport, magasin, gare)",
                  "Bulletin d'information ou météo",
                  "Publicité radio pour un produit ou un service",
                  "Présentation lors d'une réunion ou d'une conférence",
                  "Visite guidée ou instructions données à un groupe",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#6600CC] shrink-0">–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-foreground mb-2">Pièges classiques</h3>
              <ul className="flex flex-col gap-2 mt-1">
                {[
                  { trap: "Informations numériques", desc: "Dates, heures, prix, numéros de téléphone — ces éléments sont souvent au cœur des questions et nécessitent une écoute très précise." },
                  { trap: "Reformulation", desc: "La bonne réponse paraphrase souvent ce qui a été dit, avec un vocabulaire différent. Méfie-toi des réponses qui reprennent les mots exacts." },
                  { trap: "Pronoms et références", desc: "\"He said they should...\" — être clair sur qui est \"he\" et qui est \"they\" est essentiel pour ne pas se tromper." },
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
                <li><strong>Identifie le contexte en 3 mots</strong> dès les premières secondes : qui parle, à qui, et pourquoi.</li>
                <li>Lis les 3 questions à l'avance — si une question porte sur un détail précis (numéro, date), tu seras prêt à le noter mentalement.</li>
                <li>La première question porte souvent sur le <em>but général</em> du message — la réponse est dans l'introduction.</li>
                <li>La troisième question porte souvent sur ce qui doit être fait après — écoute bien la conclusion.</li>
                <li>Ne te laisse pas déstabiliser par l'accent ou le débit — concentre-toi sur les mots-clés porteurs de sens.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* ── Rappel final ── */}
        <section className="rounded-2xl bg-gray-50 border border-gray-100 p-6">
          <h2 className="text-base font-bold text-foreground mb-3">
            Ce qui fait vraiment la différence à l'Écoute
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-gray-700">
            {[
              "L'audio ne passe qu'une seule fois — ta concentration doit être totale pendant toute la section.",
              "Pour les Parties 3 et 4, lire les questions à l'avance est la règle d'or, pas une option.",
              "Habitue ton oreille à l'anglais américain et britannique : les deux accents apparaissent au TOEIC.",
              "La Partie 2 (Questions-réponses) est celle où tu peux progresser le plus rapidement avec de l'entraînement.",
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
  );
}
