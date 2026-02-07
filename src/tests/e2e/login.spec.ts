import { test, expect } from "@playwright/test";

const TEST_USER = {
  email: "anna.kowalska@example.com",
  password: "anna123",
};

test.describe("Logowanie", () => {
  test("poprawne dane logują i przekierowują na dashboard", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel(/Email \(login\)/i).fill(TEST_USER.email);
    await page.getByLabel(/Hasło/i).fill(TEST_USER.password);
    await page.getByRole("button", { name: /Zaloguj się/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/Plan na dziś/i)).toBeVisible();
  });
});
