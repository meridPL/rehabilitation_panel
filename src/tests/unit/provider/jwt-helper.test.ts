/**
 * @jest-environment node
 */
import { decodeJwt, encodeJwt } from "@/provider/jwt-helper";

const originalEnv = process.env;

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-for-jest";
});

afterAll(() => {
  process.env = originalEnv;
});

describe("jwt-helper", () => {
  const payload = { id: 1, email: "user@example.com", password: "hashed" };

  describe("encodeJwt", () => {
    it("returns a non-empty string", () => {
      const token = encodeJwt(payload);
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe("decodeJwt", () => {
    it("decodes token encoded with encodeJwt", () => {
      const token = encodeJwt(payload);
      const decoded = decodeJwt(token);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.password).toBe(payload.password);
    });

    it("throws on invalid token", () => {
      expect(() => decodeJwt("invalid.token.here")).toThrow();
    });

    it("throws on tampered token", () => {
      const token = encodeJwt(payload);
      const tampered = token.slice(0, -2) + "xx";
      expect(() => decodeJwt(tampered)).toThrow();
    });
  });
});
