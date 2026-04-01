"use client";

import { useState } from "react";
import Link from "next/link";
import { useExerciseCompletion } from "@/hooks/useExerciseCompletion";
import { PremiumGateModal } from "@/components/app/PremiumGateModal";

// ─── Static part metadata ─────────────────────────────────────────────────────

const PARTS = [
  {
    number: 1,
    slug: "partie-1",
    title: "Photographies",
    tag: "Écoute",
    description: "Choisis la phrase qui correspond le mieux à la photo.",
    exercises: [
      { id: 1, title: "Exercice 1", subtitle: "Une personne",        available: true,  href: "/exercices/partie-1/1", exerciseKey: "partie-1:1" },
      { id: 2, title: "Exercice 2", subtitle: "Plusieurs personnes", available: true,  href: "/exercices/partie-1/2", exerciseKey: "partie-1:2" },
      { id: 3, title: "Exercice 3", subtitle: "Scène sans personne", available: true,  href: "/exercices/partie-1/3", exerciseKey: "partie-1:3" },
    ],
  },
  {
    number: 2,
    slug: "partie-2",
    title: "Questions-réponses",
    tag: "Écoute",
    description: "Choisis la meilleure réponse à la question entendue.",
    exercises: [
      { id: 1, title: "Exercice 1", subtitle: "Questions en Wh-",           available: true, href: "/exercices/partie-2/1", exerciseKey: "partie-2:1" },
      { id: 2, title: "Exercice 2", subtitle: "Questions indirectes", available: true, href: "/exercices/partie-2/2", exerciseKey: "partie-2:2" },
      { id: 3, title: "Exercice 3", subtitle: "Questions alternatives",      available: true, href: "/exercices/partie-2/3", exerciseKey: "partie-2:3" },
      { id: 4, title: "Exercice 4", subtitle: "Énoncés",                    available: true, href: "/exercices/partie-2/4", exerciseKey: "partie-2:4" },
      { id: 5, title: "Exercice 5", subtitle: "Questions-tags",             available: true, href: "/exercices/partie-2/5", exerciseKey: "partie-2:5" },
    ],
  },
  {
    number: 3,
    slug: "partie-3",
    title: "Conversations",
    tag: "Écoute",
    description: "Réponds aux questions sur des conversations entre plusieurs personnes.",
    exercises: [
      { id: 1, title: "Exercice 1", subtitle: "Conversations (1ère partie)",  available: true, href: "/exercices/partie-3/1", exerciseKey: "partie-3:1" },
      { id: 2, title: "Exercice 2", subtitle: "Conversations (2ème partie)", available: true, href: "/exercices/partie-3/2", exerciseKey: "partie-3:2" },
      { id: 3, title: "Exercice 3", subtitle: "Conversations (3ème partie)", available: true, href: "/exercices/partie-3/3", exerciseKey: "partie-3:3" },
    ],
  },
  {
    number: 4,
    slug: "partie-4",
    title: "Monologues",
    tag: "Écoute",
    description: "Réponds aux questions sur des discours ou annonces enregistrés.",
    exercises: [
      { id: 1, title: "Exercice 1", subtitle: "Monologues (1ère partie)", available: true, href: "/exercices/partie-4/1", exerciseKey: "partie-4:1" },
      { id: 2, title: "Exercice 2", subtitle: "Monologues (2ème partie)", available: true, href: "/exercices/partie-4/2", exerciseKey: "partie-4:2" },
      { id: 3, title: "Exercice 3", subtitle: "Monologues (3ème partie)", available: true, href: "/exercices/partie-4/3", exerciseKey: "partie-4:3" },
    ],
  },
  {
    number: 5,
    slug: "partie-5",
    title: "Phrases incomplètes",
    tag: "Lecture",
    description: "Complète chaque phrase avec le mot ou groupe de mots le plus approprié.",
    exercises: [
      { id: 1, title: "Exercice 1", subtitle: "Forme du mot",   available: true, href: "/exercices/partie-5/1", exerciseKey: "partie-5:1" },
      { id: 2, title: "Exercice 2", subtitle: "Vocabulaire",    available: true, href: "/exercices/partie-5/2", exerciseKey: "partie-5:2" },
      { id: 3, title: "Exercice 3", subtitle: "Temps verbaux",  available: true, href: "/exercices/partie-5/3", exerciseKey: "partie-5:3" },
      { id: 4, title: "Exercice 4", subtitle: "Prépositions",   available: true, href: "/exercices/partie-5/4", exerciseKey: "partie-5:4" },
      { id: 5, title: "Exercice 5", subtitle: "Conjonctions",   available: true, href: "/exercices/partie-5/5", exerciseKey: "partie-5:5" },
      { id: 6, title: "Exercice 6", subtitle: "Pronoms",        available: true, href: "/exercices/partie-5/6", exerciseKey: "partie-5:6" },
    ],
  },
  {
    number: 6,
    slug: "partie-6",
    title: "Textes à trous",
    tag: "Lecture",
    description: "Choisis le mot, la phrase ou le groupe de mots qui convient dans un texte.",
    exercises: [
      { id: 1, title: "Exercice 1", subtitle: "Textes à trous (1ère partie)", available: true,  href: "/exercices/partie-6/1", exerciseKey: "partie-6:1" },
      { id: 2, title: "Exercice 2", subtitle: "Textes à trous (2ème partie)", available: true,  href: "/exercices/partie-6/2", exerciseKey: "partie-6:2" },
      { id: 3, title: "Exercice 3", subtitle: "Textes à trous (3ème partie)", available: true,  href: "/exercices/partie-6/3", exerciseKey: "partie-6:3" },
    ],
  },
  {
    number: 7,
    slug: "partie-7",
    title: "Lecture de documents",
    tag: "Lecture",
    description: "Lis des documents variés et réponds aux questions de compréhension.",
    exercises: [
      { id: 1, title: "Exercice 1", subtitle: "Texte unique (1ère partie)",  available: true, href: "/exercices/partie-7/1",       exerciseKey: "partie-7:1" },
      { id: 2, title: "Exercice 2", subtitle: "Texte unique (2ème partie)",  available: true, href: "/exercices/partie-7/2",       exerciseKey: "partie-7:2" },
      { id: 3, title: "Exercice 3", subtitle: "Texte unique (3ème partie)",  available: true, href: "/exercices/partie-7/3",       exerciseKey: "partie-7:3" },
      { id: 4, title: "Exercice 4", subtitle: "Multi-textes (1ère partie)",  available: true, href: "/exercices/partie-7/multi/1", exerciseKey: "partie-7:multi:1" },
      { id: 5, title: "Exercice 5", subtitle: "Multi-textes (2ème partie)",  available: true, href: "/exercices/partie-7/multi/2", exerciseKey: "partie-7:multi:2" },
      { id: 6, title: "Exercice 6", subtitle: "Multi-textes (3ème partie)",  available: true, href: "/exercices/partie-7/multi/3", exerciseKey: "partie-7:multi:3" },
    ],
  },
];

// ─── Exercise row ─────────────────────────────────────────────────────────────

function ExerciseRow({
  title,
  subtitle,
  available,
  href,
  completed,
  locked,
  onLockClick,
}: {
  title: string;
  subtitle?: string;
  available: boolean;
  href: string;
  completed: boolean;
  locked?: boolean;
  onLockClick?: () => void;
}) {
  if (locked) {
    return (
      <button
        onClick={onLockClick}
        className="group flex items-center justify-between py-3.5 px-5 w-full hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300">{title}</span>
          {subtitle && <span className="text-xs text-gray-200">{subtitle}</span>}
        </div>
        <svg
          className="w-4 h-4 text-gray-200 group-hover:text-gray-300 transition-colors shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </button>
    );
  }

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
        <span
          className={`text-sm transition-colors ${
            completed
              ? "text-emerald-600 group-hover:text-emerald-700"
              : "text-foreground group-hover:text-[#6600CC]"
          }`}
        >
          {title}
        </span>
        {subtitle ? (
          <span className="text-xs text-gray-400">{subtitle}</span>
        ) : (
          <span className="text-xs text-gray-400">
            {completed ? "Terminé" : "Non commencé"}
          </span>
        )}
      </div>
      <svg
        className={`w-3.5 h-3.5 transition-colors ${
          completed
            ? "text-emerald-400 group-hover:text-emerald-600"
            : "text-gray-300 group-hover:text-[#6600CC]"
        }`}
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

// Free exercises accessible without a premium plan
const FREE_EXERCISE_KEYS = new Set(["partie-1:1", "partie-5:1"]);

// ─── Client component ──────────────────────────────────────────────────────────

export default function ExercisesListClient({ isPremium }: { isPremium: boolean }) {
  const { isCompleted } = useExerciseCompletion();
  const [gateOpen, setGateOpen] = useState(false);

  return (
    <>
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
                  href={ex.href}
                  completed={isCompleted(ex.exerciseKey)}
                  locked={!isPremium && !FREE_EXERCISE_KEYS.has(ex.exerciseKey)}
                  onLockClick={() => setGateOpen(true)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {gateOpen && <PremiumGateModal onClose={() => setGateOpen(false)} />}
    </>
  );
}
