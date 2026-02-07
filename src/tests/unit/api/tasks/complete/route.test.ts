/**
 * @jest-environment node
 */
import { POST } from "@/app/api/tasks/complete/route";

const mockTasks = [
  {
    id: 1,
    title: "Test",
    description: "Desc",
    nameDevice: "Device",
    time: 60,
    weight: 3,
    status: "in_progress",
    userId: 1,
    startedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    title: "Test",
    description: "Desc",
    nameDevice: "Device",
    time: 60,
    weight: 3,
    status: "to_do",
    userId: 1,
    startedAt: "2025-01-01T00:00:00.000Z",
  },
];

const mockDb = {
  users: [],
  tasks: JSON.parse(JSON.stringify(mockTasks)),
};

const mockCookies = jest.fn();
jest.mock("next/headers", () => ({
  cookies: () => mockCookies(),
}));

jest.mock("@/provider/jwt-helper", () => ({
  decodeJwt: jest.fn(() => ({ id: 1, email: "a@b.com", password: "x" })),
}));

const mockReadDb = jest.fn();
const mockWriteDb = jest.fn();
jest.mock("@/db/fileDb", () => ({
  readDb: (...args: unknown[]) => mockReadDb(...args),
  writeDb: (...args: unknown[]) => mockWriteDb(...args),
}));

describe("POST /api/tasks/complete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCookies.mockResolvedValue({
      get: () => ({ value: "valid-token" }),
    });
    mockReadDb.mockResolvedValue(mockDb);
    mockWriteDb.mockResolvedValue(undefined);
  });

  it("returns 401 when no token", async () => {
    mockCookies.mockResolvedValueOnce({
      get: () => undefined,
    });

    const res = await POST(
      new Request("http://localhost/api/tasks/complete", {
        method: "POST",
        body: JSON.stringify({ id: 1 }),
      }),
    );

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Brak autoryzacji");
  });

  it("returns 400 when body is invalid", async () => {
    const res = await POST(
      new Request("http://localhost/api/tasks/complete", {
        method: "POST",
        body: JSON.stringify({}),
      }),
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Nieprawidłowe dane");
  });

  it("returns 404 when task not found", async () => {
    const res = await POST(
      new Request("http://localhost/api/tasks/complete", {
        method: "POST",
        body: JSON.stringify({ id: 999 }),
      }),
    );

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe("Zadanie nie znalezione");
  });

  it("returns 403 when task belongs to another user", async () => {
    const { decodeJwt } = await import("@/provider/jwt-helper");
    (decodeJwt as unknown as jest.Mock).mockReturnValueOnce({
      id: 99,
      email: "x",
      password: "y",
    });

    const res = await POST(
      new Request("http://localhost/api/tasks/complete", {
        method: "POST",
        body: JSON.stringify({ id: 1 }),
      }),
    );

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe("Brak dostępu");
  });

  it("returns 400 when task status is not in_progress", async () => {
    const dbToDo = {
      ...mockDb,
      tasks: [{ ...mockTasks[0], status: "to_do" }],
    };
    mockReadDb.mockResolvedValueOnce(dbToDo);

    const res = await POST(
      new Request("http://localhost/api/tasks/complete", {
        method: "POST",
        body: JSON.stringify({ id: 1 }),
      }),
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain(
      "Zadanie może być ukończone tylko gdy status jest rozpoczęte",
    );
  });

  it("returns 200 and updates task to done", async () => {
    const res = await POST(
      new Request("http://localhost/api/tasks/complete", {
        method: "POST",
        body: JSON.stringify({ id: 1 }),
      }),
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.task).toBeDefined();
    expect(json.task.status).toBe("done");
    expect(json.task.completedAt).toBeDefined();
  });
});
