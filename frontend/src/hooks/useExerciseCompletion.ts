"use client";

import { useEffect, useState } from "react";

const PREFIX = "exercise_done:";

export function useExerciseCompletion() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    const keys = new Set<string>();
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX)) keys.add(k.slice(PREFIX.length));
    }
    setCompleted(keys);
  }, []);

  function markCompleted(exerciseKey: string) {
    localStorage.setItem(PREFIX + exerciseKey, "true");
    setCompleted((prev) => new Set([...prev, exerciseKey]));
  }

  return {
    isCompleted: (exerciseKey: string) => completed.has(exerciseKey),
    markCompleted,
  };
}
