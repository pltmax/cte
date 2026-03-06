import type { PriorityStore } from "@/types/exam-pools";

const PRIORITY_KEY = "cts_priority_store";
const FRESHNESS_THRESHOLD = 2;

const DEFAULT_STORE: PriorityStore = { examCount: 0, items: {} };

export function loadPriorityStore(): PriorityStore {
  if (typeof window === "undefined") return { ...DEFAULT_STORE };
  try {
    const raw = localStorage.getItem(PRIORITY_KEY);
    if (!raw) return { ...DEFAULT_STORE };
    return JSON.parse(raw) as PriorityStore;
  } catch {
    return { ...DEFAULT_STORE };
  }
}

export function savePriorityStore(store: PriorityStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRIORITY_KEY, JSON.stringify(store));
}

/**
 * Returns the effective priority for a pool item, applying freshness bump:
 * if the item hasn't been answered in ≥ FRESHNESS_THRESHOLD exams, bump +1 (capped at 3).
 */
export function getEffectivePriority(
  store: PriorityStore,
  id: string,
  currentExamCount: number
): 1 | 2 | 3 {
  const record = store.items[id];
  if (!record) return 3; // never attempted → high priority

  let p = record.priority;

  // Freshness: if not answered recently, bump up
  if (
    record.lastAnsweredExamCount !== null &&
    currentExamCount - record.lastAnsweredExamCount >= FRESHNESS_THRESHOLD
  ) {
    p = Math.min(3, p + 1) as 1 | 2 | 3;
  }

  return p as 1 | 2 | 3;
}

/**
 * Updates the priority store after an exam is completed.
 * results: poolItemId → "correct" | "partial" | "incorrect"
 * Increments examCount by 1.
 */
export function updateAfterExam(
  store: PriorityStore,
  results: Record<string, "correct" | "partial" | "incorrect">
): PriorityStore {
  const newExamCount = store.examCount + 1;
  const items = { ...store.items };

  for (const [id, outcome] of Object.entries(results)) {
    let priority: 1 | 2 | 3;
    if (outcome === "correct") {
      priority = 1;
    } else if (outcome === "partial") {
      priority = 2;
    } else {
      priority = 3;
    }

    items[id] = {
      priority,
      lastAnsweredExamCount: newExamCount,
    };
  }

  return { examCount: newExamCount, items };
}
