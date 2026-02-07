"use client";

import Link from "next/link";
import { Task } from "@/types/Task";
import { useTaskSimulation } from "./useTaskSimulation";

export const TaskSimulationCard = ({ task: taskIncome }: { task: Task }) => {
  const { phase, task, secondsLeft, error, progress } =
    useTaskSimulation(taskIncome);

  if (phase === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="animate-spin h-10 w-10 border-2 border-slate-300 border-t-slate-700 rounded-full" />
        <p className="text-slate-600">Ładowanie ćwiczenia…</p>
      </div>
    );
  }

  if (phase === "error" || phase === "forbidden") {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 text-red-700 p-4">{error}</div>
        <Link
          href="/dashboard"
          className="inline-block rounded-lg bg-slate-800 text-white px-4 py-2 text-sm font-medium hover:bg-slate-700"
        >
          Wróć do planu
        </Link>
      </div>
    );
  }

  if (phase === "completing") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="animate-spin h-12 w-12 border-2 border-slate-300 border-t-slate-700 rounded-full" />
        <p className="text-slate-600">Zapisywanie wyników z urządzenia…</p>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-green-600 font-medium">Ćwiczenie wykonane.</p>
        <p className="text-slate-600 text-sm mt-1">
          {task?.nameDevice} – zakończono{" "}
          {task?.completedAt
            ? new Date(task.completedAt).toLocaleString("pl-PL")
            : ""}
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block rounded-lg bg-slate-800 text-white px-4 py-2 text-sm font-medium hover:bg-slate-700"
        >
          Wróć do planu
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#334155"
            strokeWidth="8"
            strokeDasharray={`${progress * 2.827} 282.7`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <span className="absolute text-3xl font-bold text-slate-800 tabular-nums">
          {secondsLeft}
        </span>
      </div>

      <div className="w-full max-w-xs mt-6 h-2 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full bg-slate-700 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
