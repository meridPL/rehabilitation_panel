export const startTask = async (id: number) => {
  const response = await fetch("/api/tasks/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ?? "Nie udało się rozpocząć zadania",
    );
  }
  const json = await response.json();
  return json.task;
};

export const completeTask = async (id: number) => {
  const response = await fetch("/api/tasks/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ?? "Nie udało się ukończyć zadania",
    );
  }
  const json = await response.json();
  return json.task;
};
