import { startTask, completeTask } from "@/db/task-client";

describe("task-client", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("startTask", () => {
    it("calls POST /api/tasks/start with id and returns task", async () => {
      const task = {
        id: 1,
        title: "T",
        status: "in_progress",
        userId: 1,
      } as never;
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ task }),
      });

      const result = await startTask(1);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/tasks/start",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: 1 }),
        }),
      );
      expect(result).toEqual(task);
    });

    it("throws with message from API when not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({
            error: "Task can only be started when status is to_do",
          }),
      });

      await expect(startTask(1)).rejects.toThrow(
        "Zadanie może być rozpoczęte tylko gdy status jest do zrobienia",
      );
    });

    it("throws generic message when response has no error field", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({}),
      });

      await expect(startTask(1)).rejects.toThrow(
        "Nie udało się rozpocząć zadania",
      );
    });
  });

  describe("completeTask", () => {
    it("calls POST /api/tasks/complete with id and returns task", async () => {
      const task = { id: 1, title: "T", status: "done", userId: 1 } as never;
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ task }),
      });

      const result = await completeTask(1);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/tasks/complete",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ id: 1 }),
        }),
      );
      expect(result).toEqual(task);
    });

    it("throws with message from API when not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "Brak dostępu" }),
      });

      await expect(completeTask(1)).rejects.toThrow("Brak dostępu");
    });
  });
});
