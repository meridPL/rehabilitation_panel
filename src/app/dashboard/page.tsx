import { ActionButton, TaskCard } from "@/components/task-card";
import { UserCard } from "@/components/user-card";
import { getTasks } from "@/db/task-server";
import { getCurrentUser } from "@/db/user";

export default async function Dashboard() {
  const user = await getCurrentUser();
  const tasks = await getTasks();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Plan na dziś</h1>
        <p className="text-slate-600 text-sm mt-1">
          Witaj, {user.name} {user.surname}. Oto Twoje przypisane ćwiczenia.
        </p>
      </div>

      <UserCard user={user} />

      <section>
        <h2 className="text-lg font-medium text-slate-800 mb-3">Ćwiczenia</h2>
        <div className="flex gap-3 flex-col">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task}>
              <ActionButton task={task} />
              {task.status === "done" ? (
                <div className="text-sm text-slate-500">Wykonane</div>
              ) : null}
            </TaskCard>
          ))}
        </div>
      </section>
    </div>
  );
}
