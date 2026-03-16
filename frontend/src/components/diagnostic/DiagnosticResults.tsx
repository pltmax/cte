"use client";

import { useState } from "react";
import Link from "next/link";
import type { DiagnosticResult, DiagnosticConfig } from "@/types/diagnostic";

// ─── Level scale ─────────────────────────────────────────────────────────────

interface CefrLevel {
  cefr: string;
  label: string;
  color: string;
  bg: string;
  border: string;
}

function getLevel(score: number): CefrLevel {
  if (score < 30) return { cefr: "A1", label: "Débutant", color: "text-gray-600", bg: "bg-gray-100", border: "border-gray-300" };
  if (score < 50) return { cefr: "A2", label: "Élémentaire", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-300" };
  if (score < 70) return { cefr: "B1", label: "Intermédiaire", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-300" };
  if (score < 95) return { cefr: "B2", label: "Avancé", color: "text-green-700", bg: "bg-green-50", border: "border-green-300" };
  return { cefr: "C1+", label: "Expert", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-300" };
}

// ─── Per-part correct counts ──────────────────────────────────────────────────

interface PartResult {
  label: string;
  correct: number;
  total: number;
  rows: Array<{ qNum: number; given: string; correct: string }>;
}

function buildPartResults(
  result: DiagnosticResult,
  config: DiagnosticConfig
): PartResult[] {
  const { answers } = result;
  const parts: PartResult[] = [];

  // P1
  const p1rows = config.p1.map((q, i) => ({
    qNum: i + 1,
    given: answers.p1[i] ?? "–",
    correct: q.answer,
  }));
  parts.push({
    label: "Partie 1 — Photos",
    correct: p1rows.filter((r) => r.given === r.correct).length,
    total: 2,
    rows: p1rows,
  });

  // P2
  const p2rows = config.p2.map((q, i) => ({
    qNum: i + 1,
    given: answers.p2[i] ?? "–",
    correct: q.answer,
  }));
  parts.push({
    label: "Partie 2 — Questions-réponses",
    correct: p2rows.filter((r) => r.given === r.correct).length,
    total: 2,
    rows: p2rows,
  });

  // P3
  const p3qs = config.p3.questions.slice(-2);
  const p3rows = p3qs.map((q, i) => ({
    qNum: i + 1,
    given: answers.p3[i] ?? "–",
    correct: q.answer,
  }));
  parts.push({
    label: "Partie 3 — Conversations",
    correct: p3rows.filter((r) => r.given === r.correct).length,
    total: 2,
    rows: p3rows,
  });

  // P4
  const p4qs = config.p4.questions.slice(-2);
  const p4rows = p4qs.map((q, i) => ({
    qNum: i + 1,
    given: answers.p4[i] ?? "–",
    correct: q.answer,
  }));
  parts.push({
    label: "Partie 4 — Monologues",
    correct: p4rows.filter((r) => r.given === r.correct).length,
    total: 2,
    rows: p4rows,
  });

  // P5
  const p5rows = config.p5.map((q, i) => ({
    qNum: i + 1,
    given: answers.p5[i] ?? "–",
    correct: q.answer,
  }));
  parts.push({
    label: "Partie 5 — Phrases incomplètes",
    correct: p5rows.filter((r) => r.given === r.correct).length,
    total: 2,
    rows: p5rows,
  });

  // P6 — texte 1
  const p6_0qs = config.p6[0]?.questions ?? [];
  const p6_0rows = p6_0qs.map((q, i) => ({
    qNum: i + 1,
    given: answers.p6_0[i] ?? "–",
    correct: q.answer,
  }));
  parts.push({
    label: "Partie 6 — Texte 1",
    correct: p6_0rows.filter((r) => r.given === r.correct).length,
    total: p6_0qs.length,
    rows: p6_0rows,
  });

  // P6 — texte 2
  const p6_1qs = config.p6[1]?.questions ?? [];
  const p6_1rows = p6_1qs.map((q, i) => ({
    qNum: i + 1,
    given: answers.p6_1[i] ?? "–",
    correct: q.answer,
  }));
  parts.push({
    label: "Partie 6 — Texte 2",
    correct: p6_1rows.filter((r) => r.given === r.correct).length,
    total: p6_1qs.length,
    rows: p6_1rows,
  });

  // P7
  const p7_0qs = config.p7[0]?.questions.slice(-2) ?? [];
  const p7_1qs = config.p7[1]?.questions.slice(-2) ?? [];
  const p7rows = [
    ...p7_0qs.map((q, i) => ({
      qNum: i + 1,
      given: answers.p7_0[i] ?? "–",
      correct: q.answer,
    })),
    ...p7_1qs.map((q, i) => ({
      qNum: p7_0qs.length + i + 1,
      given: answers.p7_1[i] ?? "–",
      correct: q.answer,
    })),
  ];
  parts.push({
    label: "Partie 7 — Compréhension de textes",
    correct: p7rows.filter((r) => r.given === r.correct).length,
    total: 4,
    rows: p7rows,
  });

  return parts;
}

// ─── Review table ─────────────────────────────────────────────────────────────

function ReviewTable({ rows }: { rows: PartResult["rows"] }) {
  return (
    <table className="w-full text-sm mt-3">
      <thead>
        <tr className="text-xs text-gray-400 border-b border-gray-100">
          <th className="text-left py-1.5 pr-4 font-medium">Q</th>
          <th className="text-left py-1.5 pr-4 font-medium">Ta réponse</th>
          <th className="text-left py-1.5 pr-4 font-medium">Correcte</th>
          <th className="text-left py-1.5 font-medium">Résultat</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const isCorrect = row.given === row.correct;
          return (
            <tr key={row.qNum} className="border-b border-gray-50">
              <td className="py-1.5 pr-4 text-gray-500 tabular-nums">{row.qNum}</td>
              <td
                className={`py-1.5 pr-4 font-bold tabular-nums ${
                  isCorrect ? "text-green-600" : "text-red-500"
                }`}
              >
                {row.given}
              </td>
              <td className="py-1.5 pr-4 font-bold text-green-600 tabular-nums">
                {row.correct}
              </td>
              <td className="py-1.5">
                {isCorrect ? (
                  <span className="text-green-500">✓</span>
                ) : (
                  <span className="text-red-400">✗</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ─── DiagnosticResults ────────────────────────────────────────────────────────

export default function DiagnosticResults({
  result,
  config,
}: {
  result: DiagnosticResult;
  config: DiagnosticConfig;
}) {
  const [openPart, setOpenPart] = useState<number | null>(null);
  const level = getLevel(result.score);
  const partResults = buildPartResults(result, config);
  const totalCorrect = partResults.reduce((s, p) => s + p.correct, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">
      {/* Score circle */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative w-36 h-36">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle
              cx="18" cy="18" r="15.9"
              fill="none" stroke="#f3f4f6" strokeWidth="3"
            />
            <circle
              cx="18" cy="18" r="15.9"
              fill="none" stroke="#7c3aed" strokeWidth="3"
              strokeDasharray={`${result.score} ${100 - result.score}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-gray-900">{result.score}%</span>
            <span className="text-xs text-gray-400 tabular-nums">{totalCorrect}/22</span>
          </div>
        </div>

        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${level.bg} ${level.border} ${level.color}`}>
          {level.cefr}
          <span className="font-medium">—</span>
          {level.label}
        </div>

        <p className="text-gray-600 text-sm">
          Ton niveau estimé :{" "}
          <span className="font-bold text-gray-800">
            {level.cefr} – {level.label}
          </span>
        </p>
      </div>

      {/* Per-part breakdown */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          Résultats par partie
        </h2>

        {partResults.map((part, idx) => (
          <div key={idx} className="rounded-xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => setOpenPart(openPart === idx ? null : idx)}
              className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-700">{part.label}</span>
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-sm font-bold ${
                    part.correct === part.total
                      ? "text-green-600"
                      : part.correct === 0
                      ? "text-red-500"
                      : "text-amber-600"
                  }`}
                >
                  {part.correct}/{part.total}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    openPart === idx ? "rotate-180" : ""
                  }`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {openPart === idx && (
              <div className="px-5 pb-4 border-t border-gray-50">
                <ReviewTable rows={part.rows} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-[#e9d9ff] bg-[#faf6ff] p-6 flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-gray-900">Prêt à progresser ?</h3>
          <p className="text-sm text-gray-500 mt-1">
            Accède aux exercices guidés et aux examens blancs complets avec un pack premium.
          </p>
        </div>
        <Link
          href="/parametres"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#7c3aed] text-white text-sm font-bold rounded-full hover:bg-[#6d28d9] transition-colors shadow-md w-full text-center"
        >
          Passe à l&apos;offre qui te convient →
        </Link>
      </div>
    </div>
  );
}
