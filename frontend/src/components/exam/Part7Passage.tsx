"use client";

import { Fragment } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const LETTERS = ["A", "B", "C", "D"] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface P7Document {
  doctype: string;
  text: string;
}

export interface P7Question {
  text: string;
  options: string[];
  answer: string;
}

export interface P7Passage {
  documents: P7Document[];
  questions: P7Question[];
}

interface Part7PassageProps {
  passage: P7Passage;
  passageIndex: number;
  totalPassages: number;
  startQuestionNumber: number;
  totalQuestions: number;
  answers: Record<number, string>; // keyed by local index 0-based
  onSelect: (localIndex: number, letter: string) => void;
  onNext: () => void;
  isLast: boolean;
}

// ─── Doctype config ───────────────────────────────────────────────────────────

const DOCTYPE_CONFIG: Record<string, { label: string; description: string }> = {
  advertisement:       { label: "Publicité",       description: "Annonce publicitaire" },
  article:             { label: "Article",          description: "Article professionnel" },
  brochure:            { label: "Brochure",         description: "Document promotionnel" },
  business_card:       { label: "Carte de visite",  description: "Coordonnées professionnelles" },
  catalog:             { label: "Catalogue",        description: "Catalogue de produits" },
  confirmation:        { label: "Confirmation",     description: "Confirmation de réservation" },
  coupon:              { label: "Coupon",           description: "Bon de réduction" },
  email:               { label: "Courriel",         description: "Message électronique" },
  flyer:               { label: "Prospectus",       description: "Feuillet publicitaire" },
  form:                { label: "Formulaire",       description: "Document à remplir" },
  invitation:          { label: "Invitation",       description: "Invitation formelle" },
  invoice:             { label: "Facture",          description: "Facture commerciale" },
  itinerary:           { label: "Itinéraire",       description: "Programme de voyage" },
  job_posting:         { label: "Offre d'emploi",   description: "Annonce de recrutement" },
  letter:              { label: "Lettre",           description: "Correspondance formelle" },
  memo:                { label: "Mémo",             description: "Mémorandum interne" },
  menu:                { label: "Menu",             description: "Carte de restaurant" },
  notice:              { label: "Avis",             description: "Avis officiel" },
  notification:        { label: "Notification",     description: "Avis de notification" },
  order:               { label: "Commande",         description: "Bon de commande" },
  policy:              { label: "Politique",        description: "Document de politique interne" },
  product_description: { label: "Description",      description: "Fiche produit" },
  product_label:       { label: "Étiquette",        description: "Étiquette de produit" },
  receipt:             { label: "Reçu",             description: "Reçu de paiement" },
  reply:               { label: "Réponse",          description: "Message de réponse" },
  review:              { label: "Avis client",      description: "Commentaire d'utilisateur" },
  schedule:            { label: "Planning",         description: "Programme / horaire" },
  text_message:        { label: "SMS",              description: "Message textuel" },
  voucher:             { label: "Bon",              description: "Bon cadeau ou de service" },
};

// ─── Text parser ──────────────────────────────────────────────────────────────

type ParsedText = {
  headers: Array<{ key: string; value: string }>;
  titleLines: string[];
  body: string;
};

/** Strip a leading all-caps label line (e.g. "EMAIL\n", "INVOICE #441\n"). */
function stripTypeLabel(raw: string): string {
  const firstNewline = raw.indexOf("\n");
  if (firstNewline === -1) return raw;
  const firstLine = raw.slice(0, firstNewline);
  // Strip if first line contains no lowercase letters
  if (!/[a-z]/.test(firstLine)) {
    return raw.slice(firstNewline + 1).trimStart();
  }
  return raw;
}

const HEADER_DOCTYPES = new Set(["memo", "email", "reply", "notification"]);

function parseText(doctype: string, raw: string): ParsedText {
  const cleaned = stripTypeLabel(raw);
  const lines = cleaned.split("\n");

  if (HEADER_DOCTYPES.has(doctype)) {
    const headers: Array<{ key: string; value: string }> = [];
    let bodyStart = 0;

    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^([^:\n]+):\s*(.+)/);
      if (m) {
        headers.push({ key: m[1].trim(), value: m[2].trim() });
        bodyStart = i + 1;
      } else if (lines[i].trim() === "" && headers.length > 0) {
        bodyStart = i + 1;
        break;
      } else if (headers.length > 0) {
        bodyStart = i;
        break;
      }
    }

    return { headers, titleLines: [], body: lines.slice(bodyStart).join("\n") };
  }

  // Others: first non-empty lines before first blank line = title, rest = body
  const titleLines: string[] = [];
  let bodyStart = 0;
  let sawTitle = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== "") {
      titleLines.push(lines[i]);
      sawTitle = true;
    } else if (sawTitle) {
      bodyStart = i + 1;
      break;
    }
  }

  if (!sawTitle) return { headers: [], titleLines: [], body: cleaned };

  // If no blank found, body is empty — but guard against very long "title" blocks
  if (bodyStart === 0) {
    if (titleLines.length > 3) {
      return {
        headers: [],
        titleLines: [titleLines[0]],
        body: titleLines.slice(1).join("\n"),
      };
    }
    return { headers: [], titleLines, body: "" };
  }

  return { headers: [], titleLines, body: lines.slice(bodyStart).join("\n") };
}

// ─── Body renderer ────────────────────────────────────────────────────────────

function BodyText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i, arr) => (
        <Fragment key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}

// ─── Doctype container ────────────────────────────────────────────────────────

function DocContainer({ doctype, text }: { doctype: string; text: string }) {
  const cfg = DOCTYPE_CONFIG[doctype] ?? { label: doctype, description: "" };
  const parsed = parseText(doctype, text);

  return (
    <div className="rounded-xl border border-[#e9d9ff] bg-[#faf6ff] overflow-hidden text-sm">
      {/* Doctype header bar */}
      <div className="px-5 py-3 border-b border-[#e9d9ff] flex items-center gap-2">
        <span className="text-xs font-bold text-[#6600CC] uppercase tracking-widest">
          {cfg.label}
        </span>
        <span className="text-xs text-gray-300">—</span>
        <span className="text-xs text-gray-500">{cfg.description}</span>
      </div>

      {/* Structured header (email / memo / reply / notification) */}
      {parsed.headers.length > 0 && (
        <div className="px-5 py-3 border-b border-[#f0e6ff] bg-[#fdf9ff] flex flex-col gap-1">
          {parsed.headers.map(({ key, value }) => (
            <div key={key} className="flex gap-2">
              <span className="font-semibold text-gray-500 min-w-[5.5rem] shrink-0">
                {key} :
              </span>
              <span className="text-gray-700">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Title block */}
      {parsed.titleLines.length > 0 && (
        <div className="px-5 pt-4 pb-1">
          {parsed.titleLines.map((line, i) => (
            <p key={i} className="font-bold text-gray-800">
              {line}
            </p>
          ))}
        </div>
      )}

      {/* Body */}
      <div className="px-5 py-4 text-gray-700 leading-relaxed">
        <BodyText text={parsed.body} />
      </div>
    </div>
  );
}

// ─── Part7Passage ─────────────────────────────────────────────────────────────

export default function Part7Passage({
  passage,
  passageIndex,
  totalPassages,
  startQuestionNumber,
  totalQuestions,
  answers,
  onSelect,
  onNext,
  isLast,
}: Part7PassageProps) {
  const progressPct = ((passageIndex + 1) / totalPassages) * 100;
  const endQ = startQuestionNumber + passage.questions.length - 1;
  const docCount = passage.documents.length;

  const docsGridClass =
    docCount === 2
      ? "grid grid-cols-2 gap-4"
      : docCount === 3
      ? "grid grid-cols-3 gap-4"
      : "";

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest">
          Partie 7 — Compréhension de textes
        </span>
        <span className="text-xs text-gray-400 tabular-nums">
          Texte {passageIndex + 1} / {totalPassages} &nbsp;·&nbsp; Q
          {startQuestionNumber}–{endQ} / {totalQuestions}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#6600CC] rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Documents */}
      <div className={docsGridClass}>
        {passage.documents.map((doc, i) => (
          <DocContainer key={i} doctype={doc.doctype} text={doc.text} />
        ))}
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-4">
        {passage.questions.map((question, localIdx) => {
          const selected = answers[localIdx] ?? null;
          const maxLen = Math.max(
            ...question.options.map((o) => o.replace(/^\([A-D]\)\s*/, "").length)
          );
          const singleCol = maxLen > 45;

          return (
            <div
              key={localIdx}
              className="rounded-xl border border-gray-100 p-5 flex flex-col gap-3"
            >
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="text-xs font-bold text-[#6600CC] mr-2">
                  Q.{startQuestionNumber + localIdx}
                </span>
                {question.text}
              </p>

              <div
                className={
                  singleCol ? "flex flex-col gap-2" : "grid grid-cols-2 gap-2"
                }
              >
                {LETTERS.map((letter, i) => {
                  const isSelected = selected === letter;
                  const optText = question.options[i]?.replace(
                    /^\([A-D]\)\s*/,
                    ""
                  );
                  return (
                    <button
                      key={letter}
                      onClick={() => onSelect(localIdx, letter)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-left text-sm transition-all duration-150 ${
                        isSelected
                          ? "border-[#6600CC] bg-[#f3ebff] text-[#6600CC]"
                          : "border-gray-200 text-gray-600 hover:border-[#c4a0f0] hover:bg-[#faf6ff]"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? "border-[#6600CC] bg-[#6600CC] text-white"
                            : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="leading-snug">{optText}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="px-7 py-3 bg-[#6600CC] text-white text-sm font-bold rounded-full hover:bg-[#5500aa] transition-colors shadow-md"
        >
          {isLast ? "Terminer la partie 7 →" : "Texte suivant →"}
        </button>
      </div>
    </div>
  );
}
