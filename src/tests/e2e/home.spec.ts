import { test, expect } from "@playwright/test";

test.describe("Strona główna", () => {
  test("wyświetla tytuł EgzoTech i formularz logowania", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /EgzoTech/i })).toBeVisible();
    await expect(page.getByText(/Plan rehabilitacji/i)).toBeVisible();

    await expect(page.getByLabel(/Email \(login\)/i)).toBeVisible();
    await expect(page.getByLabel(/Hasło/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Zaloguj się/i })).toBeVisible();
  });

  test("link Rejestruj się prowadzi na /register", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /Zarejestruj się/i }).click();

    await expect(page).toHaveURL(/\/register/);
  });
});
