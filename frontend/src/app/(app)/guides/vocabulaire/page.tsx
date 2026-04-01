// ─── Guide Vocabulaire — Mots essentiels du TOEIC ─────────────────────────────

const VOCAB_THEMES: {
  label: string;
  color: string;
  bg: string;
  border: string;
  words: { en: string; fr: string }[];
}[] = [
  {
    label: "Réunions & Management",
    color: "text-[#6600CC]",
    bg: "bg-[#faf6ff]",
    border: "border-[#ddd6fe]",
    words: [
      { en: "agenda", fr: "ordre du jour" },
      { en: "adjourn", fr: "lever la séance" },
      { en: "allocate", fr: "allouer, attribuer" },
      { en: "authorize", fr: "autoriser" },
      { en: "consensus", fr: "consensus" },
      { en: "deadline", fr: "échéance, date limite" },
      { en: "delegate", fr: "déléguer / délégué" },
      { en: "facilitate", fr: "faciliter, animer" },
      { en: "implement", fr: "mettre en œuvre" },
      { en: "negotiate", fr: "négocier" },
      { en: "quarterly", fr: "trimestriel(le)" },
      { en: "stakeholder", fr: "partie prenante" },
      { en: "strategy", fr: "stratégie" },
      { en: "submit", fr: "soumettre, remettre" },
      { en: "brief", fr: "informer / note de briefing" },
      { en: "proposal", fr: "proposition, offre" },
    ],
  },
  {
    label: "RH & Emploi",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    words: [
      { en: "applicant", fr: "candidat(e)" },
      { en: "assessment", fr: "évaluation" },
      { en: "benefits", fr: "avantages sociaux" },
      { en: "compensation", fr: "rémunération, indemnité" },
      { en: "conduct", fr: "mener, conduire / conduite" },
      { en: "eligible", fr: "éligible, admissible" },
      { en: "evaluate", fr: "évaluer" },
      { en: "hire", fr: "embaucher / embauche" },
      { en: "incentive", fr: "prime, motivation" },
      { en: "orientation", fr: "intégration (nouvel employé)" },
      { en: "performance", fr: "performance, résultats" },
      { en: "promotion", fr: "promotion, avancement" },
      { en: "recruit", fr: "recruter / recrue" },
      { en: "resignation", fr: "démission" },
      { en: "retire", fr: "prendre sa retraite" },
      { en: "terminate", fr: "mettre fin (à un contrat)" },
    ],
  },
  {
    label: "Finance & Comptabilité",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    words: [
      { en: "audit", fr: "audit, vérification" },
      { en: "budget", fr: "budget" },
      { en: "capital", fr: "capital, fonds" },
      { en: "discount", fr: "remise, réduction" },
      { en: "expenditure", fr: "dépense, frais" },
      { en: "expense", fr: "dépense (courante)" },
      { en: "invoice", fr: "facture" },
      { en: "outstanding", fr: "en attente, impayé / remarquable" },
      { en: "profit", fr: "bénéfice, profit" },
      { en: "receipt", fr: "reçu, justificatif" },
      { en: "reimburse", fr: "rembourser" },
      { en: "revenue", fr: "chiffre d'affaires, revenus" },
      { en: "surplus", fr: "excédent, surplus" },
      { en: "transaction", fr: "transaction" },
      { en: "transfer", fr: "virement, transfert" },
      { en: "withdraw", fr: "retirer (de l'argent)" },
    ],
  },
  {
    label: "Voyages & Transports",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    words: [
      { en: "accommodate", fr: "loger, accueillir" },
      { en: "boarding", fr: "embarquement" },
      { en: "cancel", fr: "annuler" },
      { en: "confirmation", fr: "confirmation" },
      { en: "delay", fr: "retard, délai" },
      { en: "departure", fr: "départ" },
      { en: "destination", fr: "destination" },
      { en: "itinerary", fr: "itinéraire" },
      { en: "layover", fr: "escale" },
      { en: "luggage", fr: "bagages" },
      { en: "passenger", fr: "passager(ère)" },
      { en: "reservation", fr: "réservation" },
      { en: "transit", fr: "transit" },
      { en: "terminal", fr: "terminal, aérogare" },
      { en: "fare", fr: "tarif (transport)" },
      { en: "customs", fr: "douane" },
    ],
  },
  {
    label: "Immobilier & Bureaux",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    words: [
      { en: "adjoining", fr: "adjacent, attenant" },
      { en: "premises", fr: "locaux, lieux" },
      { en: "lease", fr: "bail, louer à bail" },
      { en: "tenant", fr: "locataire" },
      { en: "landlord", fr: "propriétaire (bailleur)" },
      { en: "renovate", fr: "rénover" },
      { en: "maintenance", fr: "entretien, maintenance" },
      { en: "facility", fr: "installation, équipement" },
      { en: "utilities", fr: "charges, services (eau, élec.)" },
      { en: "furnish", fr: "meubler" },
      { en: "vacancy", fr: "poste vacant / logement libre" },
      { en: "deposit", fr: "caution, dépôt de garantie" },
      { en: "storage", fr: "stockage, rangement" },
      { en: "corridor", fr: "couloir" },
      { en: "contractor", fr: "prestataire, entrepreneur" },
      { en: "inspection", fr: "inspection, visite" },
    ],
  },
  {
    label: "Vente & Marketing",
    color: "text-cyan-700",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    words: [
      { en: "campaign", fr: "campagne" },
      { en: "client", fr: "client(e)" },
      { en: "complaint", fr: "réclamation, plainte" },
      { en: "competitive", fr: "compétitif, concurrentiel" },
      { en: "demand", fr: "demande (marché)" },
      { en: "launch", fr: "lancement / lancer" },
      { en: "merchandise", fr: "marchandise" },
      { en: "negotiate", fr: "négocier" },
      { en: "promotion", fr: "offre promotionnelle" },
      { en: "purchase", fr: "achat / acheter" },
      { en: "refund", fr: "remboursement / rembourser" },
      { en: "retailer", fr: "détaillant, distributeur" },
      { en: "shipment", fr: "expédition, livraison" },
      { en: "supplier", fr: "fournisseur" },
      { en: "warranty", fr: "garantie" },
      { en: "wholesale", fr: "en gros, commerce de gros" },
    ],
  },
];

const TRICKY_WORDS = [
  {
    word: "outstanding",
    meanings: [
      { ctx: "Finance", meaning: "Impayé, en attente — ex. outstanding invoice" },
      { ctx: "Général", meaning: "Remarquable, exceptionnel — ex. outstanding performance" },
    ],
  },
  {
    word: "conduct",
    meanings: [
      { ctx: "Verbe", meaning: "Mener, effectuer — ex. conduct a survey" },
      { ctx: "Nom", meaning: "Conduite, comportement — ex. professional conduct" },
    ],
  },
  {
    word: "charge",
    meanings: [
      { ctx: "Finance", meaning: "Facturer, frais — ex. charge a fee" },
      { ctx: "Général", meaning: "Responsable de — ex. in charge of the project" },
    ],
  },
  {
    word: "order",
    meanings: [
      { ctx: "Commerce", meaning: "Commande — ex. place an order" },
      { ctx: "Général", meaning: "Ordre, instruction — ex. in order to" },
    ],
  },
  {
    word: "party",
    meanings: [
      { ctx: "Juridique", meaning: "Partie (contrat) — ex. third party" },
      { ctx: "Général", meaning: "Fête, groupe — ex. a party of visitors" },
    ],
  },
  {
    word: "notice",
    meanings: [
      { ctx: "RH", meaning: "Préavis — ex. give two weeks' notice" },
      { ctx: "Général", meaning: "Remarquer, affiche — ex. notice a problem / a notice on the board" },
    ],
  },
];

export default function GuideVocabulairePage() {
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
          Vocabulaire TOEIC — Les mots à connaître absolument
        </h1>
        <p className="text-gray-500 mt-3 text-base leading-relaxed">
          Le TOEIC tourne autour d'un vocabulaire professionnel prévisible et
          récurrent. Maîtriser ces 100 à 150 mots couvre la grande majorité des
          contextes rencontrés aux Parties 3, 4, 5, 6 et 7.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <span className="rounded-full bg-[#f3ebff] text-[#6600CC] text-xs font-bold px-3 py-1 uppercase tracking-wide">
            Lecture & Écoute
          </span>
          <span className="text-sm text-gray-400">6 thèmes · ~100 mots essentiels</span>
        </div>
      </header>

      <div className="flex flex-col gap-10">

        {/* ── Pourquoi le vocabulaire est décisif ── */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Pourquoi le vocabulaire est l'investissement n°1 pour le TOEIC
          </h2>
          <div className="flex flex-col gap-3 text-sm text-gray-700 leading-relaxed">
            <p>
              Contrairement à un examen de langue générale, le TOEIC utilise un
              vocabulaire <strong>professionnel très ciblé</strong>. Les mêmes
              contextes reviennent systématiquement : réunions, emails, factures,
              voyages d'affaires, annonces. Cela signifie qu'il existe un{" "}
              <strong>corpus fini de mots à apprendre</strong> — et qu'apprendre
              les bons mots est beaucoup plus efficace que de tout étudier.
            </p>
            <p>
              À <strong>l'Écoute</strong> (Parties 3 et 4), reconnaître un mot
              en une fraction de seconde fait toute la différence — tu ne peux
              pas mettre pause. À la <strong>Lecture</strong> (Parties 5, 6, 7),
              comprendre le sens d'un mot dans son contexte est souvent
              suffisant pour trouver la bonne réponse, même sans comprendre
              chaque phrase.
            </p>
          </div>

          <div className="rounded-xl border border-[#6600CC]/20 bg-[#faf6ff] p-5 mt-4">
            <h3 className="font-bold text-[#6600CC] mb-2">Comment mémoriser efficacement</h3>
            <ol className="flex flex-col gap-2 list-decimal list-inside text-sm text-gray-700 leading-relaxed">
              <li><strong>Par thème</strong>, pas par ordre alphabétique — ton cerveau retient les réseaux de sens.</li>
              <li><strong>En contexte</strong> : mémorise une phrase exemple, pas juste la traduction.</li>
              <li><strong>Active recall</strong> : cache le français et retrouve le sens, pas l'inverse.</li>
              <li>Revois les mots à intervalles espacés (J+1, J+3, J+7) pour ancrer dans la mémoire à long terme.</li>
            </ol>
          </div>
        </section>

        {/* ── Vocabulaire par thème ── */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-6">
            Vocabulaire par thème
          </h2>
          <div className="flex flex-col gap-6">
            {VOCAB_THEMES.map((theme) => (
              <div
                key={theme.label}
                className={`rounded-2xl border ${theme.border} ${theme.bg} overflow-hidden`}
              >
                <div className={`px-5 py-3 border-b ${theme.border}`}>
                  <h3 className={`text-sm font-bold uppercase tracking-wide ${theme.color}`}>
                    {theme.label}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/60">
                  <div className="divide-y divide-white/60">
                    {theme.words.slice(0, Math.ceil(theme.words.length / 2)).map((w) => (
                      <div key={w.en} className="flex items-baseline justify-between px-5 py-2.5 gap-4">
                        <span className="text-sm font-semibold text-foreground shrink-0">{w.en}</span>
                        <span className="text-sm text-gray-500 text-right">{w.fr}</span>
                      </div>
                    ))}
                  </div>
                  <div className="divide-y divide-white/60">
                    {theme.words.slice(Math.ceil(theme.words.length / 2)).map((w) => (
                      <div key={w.en} className="flex items-baseline justify-between px-5 py-2.5 gap-4">
                        <span className="text-sm font-semibold text-foreground shrink-0">{w.en}</span>
                        <span className="text-sm text-gray-500 text-right">{w.fr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Mots à double sens ── */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Mots à double sens — les pièges du TOEIC
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Certains mots très courants ont des sens radicalement différents
            selon le contexte. Le TOEIC les utilise précisément pour ça.
            Mémorise ces cas particuliers.
          </p>
          <div className="flex flex-col gap-3">
            {TRICKY_WORDS.map((item) => (
              <div
                key={item.word}
                className="rounded-xl border border-gray-100 overflow-hidden"
              >
                <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100">
                  <span className="text-sm font-bold text-foreground">{item.word}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {item.meanings.map((m) => (
                    <div key={m.ctx} className="flex items-start gap-4 px-5 py-2.5">
                      <span className="text-xs font-semibold text-[#6600CC] bg-[#f3ebff] px-2 py-0.5 rounded-full shrink-0 mt-0.5">
                        {m.ctx}
                      </span>
                      <span className="text-sm text-gray-600">{m.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Collocations clés ── */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Collocations incontournables
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Une <strong>collocation</strong> est une association de mots qui
            "vont ensemble" en anglais. Le TOEIC en teste un grand nombre —
            notamment à la Partie 5 où tu dois choisir le bon verbe ou la bonne
            préposition. Les apprendre comme des blocs est plus efficace que
            chercher une règle.
          </p>
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Expression</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Sens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { expr: "apply for", meaning: "postuler à, faire une demande de" },
                  { expr: "be responsible for", meaning: "être responsable de" },
                  { expr: "be familiar with", meaning: "être familier avec, connaître" },
                  { expr: "be interested in", meaning: "s'intéresser à" },
                  { expr: "comply with", meaning: "se conformer à, respecter" },
                  { expr: "consist of", meaning: "être composé de" },
                  { expr: "result in", meaning: "entraîner, aboutir à" },
                  { expr: "provide with", meaning: "fournir à (quelqu'un) quelque chose" },
                  { expr: "take advantage of", meaning: "profiter de, tirer parti de" },
                  { expr: "be aware of", meaning: "être conscient de, savoir que" },
                  { expr: "place an order", meaning: "passer une commande" },
                  { expr: "meet a deadline", meaning: "respecter une échéance" },
                  { expr: "submit a report", meaning: "remettre/soumettre un rapport" },
                  { expr: "conduct a survey", meaning: "mener une enquête/sondage" },
                  { expr: "sign a contract", meaning: "signer un contrat" },
                ].map(({ expr, meaning }) => (
                  <tr key={expr} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-2.5 font-semibold text-foreground">{expr}</td>
                    <td className="px-5 py-2.5 text-gray-500">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Rappel final ── */}
        <section className="rounded-2xl bg-gray-50 border border-gray-100 p-6">
          <h2 className="text-base font-bold text-foreground mb-3">
            Ce qu'il faut retenir
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-gray-700">
            {[
              "Le TOEIC utilise un vocabulaire professionnel récurrent — un corpus limité à bien connaître vaut mieux qu'une étude large et superficielle.",
              "Apprends les mots par thème et en contexte, pas par ordre alphabétique.",
              "Méfie-toi des mots à double sens (outstanding, conduct, charge, notice) — le TOEIC les piège souvent.",
              "Les collocations sont aussi importantes que les mots seuls : la Partie 5 teste souvent si tu connais le bon verbe ou la bonne préposition.",
              "Révise régulièrement plutôt qu'une seule fois — la répétition espacée est clé.",
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
