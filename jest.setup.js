import "@testing-library/jest-dom";

if (typeof process.env.JWT_SECRET === "undefined") {
  process.env.JWT_SECRET = "test-secret-for-jest";
}
