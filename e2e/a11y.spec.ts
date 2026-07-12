import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Runs axe against the current page. Serious/critical violations fail the
 * test; anything milder is logged for visibility but does not block.
 */
async function expectNoSeriousViolations(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).analyze();

  const blocking = results.violations.filter(
    (violation) =>
      violation.impact === "serious" || violation.impact === "critical",
  );
  const informational = results.violations.filter(
    (violation) =>
      violation.impact !== "serious" && violation.impact !== "critical",
  );

  for (const violation of informational) {
    console.log(
      `[a11y:${label}] ${violation.impact ?? "unknown"}: ${violation.id} — ` +
        `${violation.help} (${violation.nodes.length} node(s))`,
    );
  }

  expect(
    blocking.map(({ id, impact, help, nodes }) => ({
      id,
      impact,
      help,
      targets: nodes.map((node) => node.target.join(" ")),
    })),
  ).toEqual([]);
}

test.describe("accessibility", () => {
  test("home page has no serious/critical axe violations", async ({ page }) => {
    // Reduced motion keeps every section visible so axe scans the full page
    // instead of skipping content still hidden by scroll reveals.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() =>
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "instant",
      }),
    );
    await expectNoSeriousViolations(page, "home");
  });

  test("case study page has no serious/critical axe violations", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/projects/pro-points-loyalty");
    await page.evaluate(() =>
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "instant",
      }),
    );
    await expectNoSeriousViolations(page, "pro-points-loyalty");
  });

  test("keyboard: Tab reaches skip link, nav links, then hero CTAs in order", async ({
    page,
  }) => {
    await page.goto("/");
    // Wait for the hero intro to land so the CTAs are focusable.
    await expect(page.getByRole("link", { name: "See the work" })).toBeVisible();

    const focusedText = () =>
      page.evaluate(() => {
        const el = document.activeElement;
        return (el?.textContent ?? "")
          .replace(/[\s ]+/g, " ")
          .trim();
      });

    const expectedOrder = [
      "Skip to content",
      "AC — Aaron Chai",
      "Work",
      "Experience",
      "Contact",
      "Resume",
      "Download resume",
      "See the work",
    ];

    const actualOrder: string[] = [];
    for (let i = 0; i < expectedOrder.length; i += 1) {
      await page.keyboard.press("Tab");
      actualOrder.push(await focusedText());
    }

    expect(actualOrder).toEqual(expectedOrder);
  });
});
