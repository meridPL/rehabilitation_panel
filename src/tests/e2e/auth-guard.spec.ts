import { test, expect } from "@playwright/test";

test.describe("Ochrona tras", () => {
  test("niezalogowany użytkownik na /dashboard jest przekierowany na /", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\//);
    await expect(page.getByRole("heading", { name: /EgzoTech/i })).toBeVisible();
  });
});
