import { Task } from "@/types/Task";
import Link from "next/link";

const statusStyles: Record<Task["status"], string> = {
  to_do: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
};

const getStatusLabel = (status: Task["status"]) => {
  switch (status) {
    case "to_do":
      return "Do zrobienia";
    case "in_progress":
      return "Rozpoczęte";
    case "done":
      return "Zakończone";
    default:
      return "Nieznany status";
  }
};

export const ActionButton = ({ task }: { task: Task }) => {
  if (task.status === "done") return null;
  const actionLabel =
    task.status === "in_progress" ? "Kontynuuj" : "Rozpocznij";
  return (
    <Link
      href={`/dashboard/task/${task.id}`}
      className="rounded-lg bg-slate-800 text-white px-3 py-1.5 text-sm font-medium hover:bg-slate-700 transition"
    >
      {actionLabel}
    </Link>
  );
};

export const TaskCard = ({
  children,
  task,
}: {
  children: React.ReactNode;
  task: Task;
}) => {
  const statusLabel = getStatusLabel(task.status);
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap items-start justify-between gap-2">
      <div>
        <h3 className="font-medium text-slate-800">{task.nameDevice}</h3>
        <ul className="mt-1 text-sm text-slate-600">
          <li>Czas: {task.time} min</li>
          <li>Obciążenie: {task.weight} kg</li>
          {task.status === "done" && task.startedAt && task.completedAt && (
            <>
              <li>
                Rozpoczęto:{" "}
                {new Date(task.startedAt).toLocaleString("pl-PL")}
              </li>
              <li>
                Zakończono:{" "}
                {new Date(task.completedAt).toLocaleString("pl-PL")}
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="flex items-center gap-2 shrink-0 flex-col">
        <div
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[task.status]}`}
        >
          {statusLabel}
        </div>
        {children}
      </div>
    </article>
  );
};
