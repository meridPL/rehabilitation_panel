import Link from "next/link";
import { notFound } from "next/navigation";
import { getTask } from "@/db/task-server";
import { TaskSimulationCard } from "@/app/dashboard/task/[id]/components/task-simulation-card";

export default async function TaskSimulationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const taskId = parseInt(id, 10);
  if (Number.isNaN(taskId)) notFound();
  let task;
  try {
    task = await getTask(taskId);
  } catch {
    notFound();
  }

  return (
    <div className="flex flex-col items-center py-8">
      <h1 className="text-xl font-semibold text-slate-800 text-center mb-1">
        {task.nameDevice}
      </h1>
      <p className="text-slate-600 text-sm mb-6">Symulacja treningu</p>
      <TaskSimulationCard task={task} />
      <Link
        href="/dashboard"
        className="mt-8 text-sm text-slate-600 underline hover:no-underline"
      >
        Przerwij i wróć do planu
      </Link>
    </div>
  );
}
