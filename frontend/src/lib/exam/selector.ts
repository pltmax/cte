import { getEffectivePriority } from "@/lib/exam/priority";
import type { PriorityStore, ExamSelectionMeta, PoolItemBase } from "@/types/exam-pools";
import type { ExamData, ExamP1Question, ExamP2Question, ExamP3Conv } from "@/types/exam-data";
import type { TalkData } from "@/components/exam/Part4Talk";
import type { P5Question } from "@/components/exam/Part5Batch";
import type { PassageData } from "@/components/exam/Part6Passage";
import type { P7Passage } from "@/components/exam/Part7Passage";

// ─── Pool item types (pool JSON adds id + source_exam to each exam item) ──────

type P1PoolItem = PoolItemBase & ExamP1Question;
type P2PoolItem = PoolItemBase & ExamP2Question;
type P3PoolItem = PoolItemBase & ExamP3Conv;
type P4PoolItem = PoolItemBase & TalkData;
type P5PoolItem = PoolItemBase & P5Question;
type P6PoolItem = PoolItemBase & PassageData;
type P7PoolItem = PoolItemBase & P7Passage;

export type AllPools = {
  p1: P1PoolItem[];
  p2: P2PoolItem[];
  p3: P3PoolItem[];
  p4: P4PoolItem[];
  p5: P5PoolItem[];
  p6: P6PoolItem[];
  p7: P7PoolItem[];
};

// ─── Weighted sampling ────────────────────────────────────────────────────────

/**
 * Samples n items from the pool without replacement using weighted random selection.
 * Weight is the numeric priority (higher = more likely to appear).
 */
export function weightedSample<T extends { id: string }>(
  items: T[],
  weights: number[],
  n: number
): T[] {
  const available = items.map((item, i) => ({ item, weight: weights[i] }));
  const selected: T[] = [];

  const pick = n > available.length ? available.length : n;

  for (let s = 0; s < pick; s++) {
    const totalWeight = available.reduce((sum, x) => sum + x.weight, 0);
    let rand = Math.random() * totalWeight;
    let chosenIdx = available.length - 1;
    for (let i = 0; i < available.length; i++) {
      rand -= available[i].weight;
      if (rand <= 0) {
        chosenIdx = i;
        break;
      }
    }
    selected.push(available[chosenIdx].item);
    available.splice(chosenIdx, 1);
  }

  return selected;
}

// ─── Main builder ─────────────────────────────────────────────────────────────

/**
 * Builds an ExamData object by sampling from the pools using weighted priority.
 * Returns both the exam data (stripped of pool metadata) and the selection metadata
 * (pool item ids + P7 question counts) needed for scoring later.
 */
export function buildExamSelection(
  pools: AllPools,
  store: PriorityStore
): { examData: ExamData; meta: ExamSelectionMeta } {
  const ec = store.examCount;

  function getWeights<T extends PoolItemBase>(items: T[]): number[] {
    return items.map((it) => getEffectivePriority(store, it.id, ec));
  }

  // ── Sample each part ───────────────────────────────────────────────────────
  const p1Sel = weightedSample(pools.p1, getWeights(pools.p1), 6);
  const p2Sel = weightedSample(pools.p2, getWeights(pools.p2), 25);
  const p3Sel = weightedSample(pools.p3, getWeights(pools.p3), 13);
  const p4Sel = weightedSample(pools.p4, getWeights(pools.p4), 10);
  const p5Sel = weightedSample(pools.p5, getWeights(pools.p5), 30);
  const p6Sel = weightedSample(pools.p6, getWeights(pools.p6), 4);
  const p7Sel = weightedSample(pools.p7, getWeights(pools.p7), 13);

  // ── Strip pool metadata helpers ────────────────────────────────────────────
  function strip<T extends PoolItemBase>(item: T): Omit<T, "id" | "source_exam"> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, source_exam: _se, ...rest } = item;
    return rest;
  }

  // ── Build ExamData ─────────────────────────────────────────────────────────
  const examData: ExamData = {
    exam_number: 0, // dynamic exam — no fixed number
    part1: p1Sel.map((it) => strip(it) as ExamP1Question),
    part2: p2Sel.map((it) => strip(it) as ExamP2Question),
    part3: p3Sel.map((it) => strip(it) as ExamP3Conv),
    part4: p4Sel.map((it) => strip(it) as TalkData),
    part5: p5Sel.map((it) => strip(it) as P5Question),
    part6: p6Sel.map((it) => strip(it) as PassageData),
    part7: p7Sel.map((it) => strip(it) as P7Passage),
  };

  // ── Build meta ─────────────────────────────────────────────────────────────
  const meta: ExamSelectionMeta = {
    p1Ids: p1Sel.map((it) => it.id),
    p2Ids: p2Sel.map((it) => it.id),
    p3Ids: p3Sel.map((it) => it.id),
    p4Ids: p4Sel.map((it) => it.id),
    p5Ids: p5Sel.map((it) => it.id),
    p6Ids: p6Sel.map((it) => it.id),
    p7Ids: p7Sel.map((it) => it.id),
    p7QuestionCounts: p7Sel.map((it) => it.questions.length),
  };

  return { examData, meta };
}
