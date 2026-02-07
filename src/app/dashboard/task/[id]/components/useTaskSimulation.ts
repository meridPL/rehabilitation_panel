"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { completeTask, startTask } from "@/db/task-client";
import { Task } from "@/types/Task";

export type Phase =
  | "loading"
  | "forbidden"
  | "countdown"
  | "completing"
  | "done"
  | "error";

export const TASK_COUNTDOWN_SECONDS = 15;

export function useTaskSimulation(taskIncome: Task) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [task, setTask] = useState<Task | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(TASK_COUNTDOWN_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);
  const completeRequestedRef = useRef(false);

  const loadAndStart = useCallback(async () => {
    setPhase("loading");
    setError(null);
    try {
      if (taskIncome.status === "done") {
        setError("Nie można rozpocząć już wykonanego ćwiczenia.");
        setPhase("forbidden");
        setTask(taskIncome);
        return;
      }
      setTask({ ...taskIncome });
      if (taskIncome.status === "to_do") {
        await startTask(taskIncome.id);
        setTask((prev) =>
          prev
            ? {
                ...prev,
                status: "in_progress",
                startedAt: new Date().toISOString(),
              }
            : null,
        );
      }
      setSecondsLeft(TASK_COUNTDOWN_SECONDS);
      setPhase("countdown");
      startedRef.current = true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Błąd ładowania");
      setPhase("error");
    }
  }, [taskIncome]);

  useEffect(() => {
    const t = setTimeout(loadAndStart, 0);
    return () => clearTimeout(t);
  }, [loadAndStart]);

  useEffect(() => {
    if (phase !== "countdown" || !task) return;
    if (secondsLeft <= 0) {
      if (completeRequestedRef.current) return;
      completeRequestedRef.current = true;
      completeTask(taskIncome.id)
        .then((updated) => {
          setTask(updated);
          setPhase("done");
        })
        .catch((e) => {
          setError(e instanceof Error ? e.message : "Błąd zakończenia");
          setPhase("error");
        });
      return;
    }
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, secondsLeft, task, taskIncome.id]);

  const progress =
    ((TASK_COUNTDOWN_SECONDS - secondsLeft) / TASK_COUNTDOWN_SECONDS) * 100;

  return { phase, task: task, secondsLeft, error, progress };
}
