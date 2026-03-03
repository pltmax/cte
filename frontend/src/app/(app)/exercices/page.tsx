import Link from "next/link";

// ─── Static part metadata ─────────────────────────────────────────────────────

const PARTS = [
  {
    number: 1,
    slug: "partie-1",
    title: "Photographies",
    tag: "Écoute",
    description: "Choisissez la phrase qui correspond le mieux à la photo.",
    exercises: [
      { id: 1, title: "Exercice 1", subtitle: "Une personne",        available: true,  href: "/exercices/partie-1/1" },
      { id: 2, title: "Exercice 2", subtitle: "Plusieurs personnes", available: true,  href: "/exercices/partie-1/2" },
      { id: 3, title: "Exercice 3", subtitle: "Scène sans personne", available: true,  href: "/exercices/partie-1/3" },
    ],
  },
  {
    number: 2,
    slug: "partie-2",
    title: "Questions-réponses",
    tag: "Écoute",
    description: "Choisissez la meilleure réponse à la question entendue.",
    exercises: [
      { id: 1, title: "Exercice 1", subtitle: "Questions en Wh-",           available: true, href: "/exercices/partie-2/1" },
      { id: 2, title: "Exercice 2", subtitle: "Questions polies indirectes", available: true, href: "/exercices/partie-2/2" },
      { id: 3, title: "Exercice 3", subtitle: "Questions alternatives",      available: true, href: "/exercices/partie-2/3" },
      { id: 4, title: "Exercice 4", subtitle: "Énoncés",                    available: true, href: "/exercices/partie-2/4" },
      { id: 5, title: "Exercice 5", subtitle: "Questions-tags",          available: true, href: "/exercices/partie-2/5" },
    ],
  },
  {
    number: 3,
    slug: "partie-3",
    title: "Conversations",
    tag: "Écoute",
    description: "Répondez aux questions sur des conversations entre plusieurs personnes.",
    exercises: [
      { id: 1, title: "Exercice 1", subtitle: "5 conversations (1ère partie)",  available: true, href: "/exercices/partie-3/1" },
      { id: 2, title: "Exercice 2", subtitle: "5 conversations (2ème partie)", available: true, href: "/exercices/partie-3/2" },
      { id: 3, title: "Exercice 3", subtitle: "5 conversations (3ème partie)", available: true, href: "/exercices/partie-3/3" },
    ],
  },
  {
    number: 4,
    slug: "partie-4",
    title: "Monologues",
    tag: "Écoute",
    description: "Répondez aux questions sur des discours ou annonces enregistrés.",
    exercises: [
      { id: 1, title: "Exercice 1", subtitle: "5 monologues (1ère partie)", available: true, href: "/exercices/partie-4/1" },
      { id: 2, title: "Exercice 2", subtitle: "5 monologues (2ème partie)", available: true, href: "/exercices/partie-4/2" },
      { id: 3, title: "Exercice 3", subtitle: "5 monologues (3ème partie)", available: true, href: "/exercices/partie-4/3" },
    ],
  },
  {
    number: 5,
    slug: "partie-5",
    title: "Phrases incomplètes",
    tag: "Lecture",
    description: "Complétez chaque phrase avec le mot ou groupe de mots le plus approprié.",
    exercises: [
      { id: 1, title: "Exercice 1", subtitle: "Forme du mot",   available: true, href: "/exercices/partie-5/1" },
      { id: 2, title: "Exercice 2", subtitle: "Vocabulaire",    available: true, href: "/exercices/partie-5/2" },
      { id: 3, title: "Exercice 3", subtitle: "Temps verbaux",  available: true, href: "/exercices/partie-5/3" },
      { id: 4, title: "Exercice 4", subtitle: "Prépositions",   available: true, href: "/exercices/partie-5/4" },
      { id: 5, title: "Exercice 5", subtitle: "Conjonctions",   available: true, href: "/exercices/partie-5/5" },
      { id: 6, title: "Exercice 6", subtitle: "Pronoms",        available: true, href: "/exercices/partie-5/6" },
    ],
  },
  {
    number: 6,
    slug: "partie-6",
    title: "Textes à trous",
    tag: "Lecture",
    description: "Choisissez le mot, la phrase ou le groupe de mots qui convient dans un texte.",
    exercises: [
      { id: 1, title: "Exercice 1", available: true },
      { id: 2, title: "Exercice 2", available: false },
      { id: 3, title: "Exercice 3", available: false },
    ],
  },
  {
    number: 7,
    slug: "partie-7",
    title: "Lecture de documents",
    tag: "Lecture",
    description: "Lisez des documents variés et répondez aux questions de compréhension.",
    exercises: [
      { id: 1, title: "Exercice 1", available: true },
      { id: 2, title: "Exercice 2", available: false },
      { id: 3, title: "Exercice 3", available: false },
      { id: 4, title: "Exercice 4", available: false },
    ],
  },
] as const;

// ─── Exercise row ─────────────────────────────────────────────────────────────

function ExerciseRow({
  title,
  subtitle,
  available,
  href,
}: {
  title: string;
  subtitle?: string;
  available: boolean;
  href: string;
}) {
  if (!available) {
    return (
      <div className="flex items-center justify-between py-3.5 px-5">
        <span className="text-sm text-gray-400">{title}</span>
        <span className="text-xs text-gray-300">Bientôt disponible</span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group flex items-center justify-between py-3.5 px-5 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm text-foreground group-hover:text-[#6600CC] transition-colors">
          {title}
        </span>
        {subtitle ? (
          <span className="text-xs text-gray-400">{subtitle}</span>
        ) : (
          <span className="text-xs text-gray-400">Non commencé</span>
        )}
      </div>
      <svg
        className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#6600CC] transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExercicesPage() {
  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-foreground">Exercices</h1>
        <p className="text-sm text-gray-500 mt-1">
          Entraîne-toi par partie pour progresser avant le jour J.
        </p>
      </div>

      {/* Part sections */}
      <div className="flex flex-col gap-10">
        {PARTS.map((part) => (
          <section key={part.number}>
            {/* Section header */}
            <div className="flex items-baseline gap-3 mb-1">
              <h2 className="text-sm font-semibold text-foreground">
                Partie {part.number} —{" "}
                <span className="text-[#6600CC]">{part.title}</span>
              </h2>
              <span
                className={`text-[11px] font-semibold uppercase tracking-wide ${
                  part.tag === "Écoute" ? "text-blue-400" : "text-emerald-500"
                }`}
              >
                {part.tag}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-3">{part.description}</p>

            {/* Exercise list */}
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {part.exercises.map((ex) => (
                <ExerciseRow
                  key={ex.id}
                  title={ex.title}
                  subtitle={"subtitle" in ex ? ex.subtitle : undefined}
                  available={ex.available}
                  href={"href" in ex ? ex.href : `/exercices/${part.slug}`}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
