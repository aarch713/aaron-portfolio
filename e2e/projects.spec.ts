import { test, expect, type Page } from "@playwright/test";
import { projects } from "../src/content/projects";

/**
 * Case-study sections reveal on scroll (GSAP, once:true). Jumping to the
 * bottom fires every trigger whose start is above the new position, so a
 * single instant scroll reveals the whole page.
 */
async function revealFullPage(page: Page): Promise<void> {
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
}

test.describe("case studies", () => {
  test("content module exports all six projects", () => {
    expect(projects).toHaveLength(6);
  });

  for (const project of projects) {
    test(`renders ${project.slug} with title, Problem and Results`, async ({
      page,
    }) => {
      await page.goto(`/projects/${project.slug}`);

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        project.title,
      );

      await revealFullPage(page);
      await expect(
        page.getByRole("heading", { name: "Problem", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Results", exact: true }),
      ).toBeVisible();
    });
  }

  test("prev/next links navigate between case studies", async ({ page }) => {
    const first = projects[0];
    const next = projects[1];
    const prev = projects[projects.length - 1];

    await page.goto(`/projects/${first.slug}`);
    await revealFullPage(page);

    // Next → second project.
    await page.locator(`a[href="/projects/${next.slug}"]`).click();
    await expect(page).toHaveURL(`/projects/${next.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      next.title,
    );

    // Back on the first project, Previous → last project (wraps around).
    await page.goto(`/projects/${first.slug}`);
    await revealFullPage(page);
    await page.locator(`a[href="/projects/${prev.slug}"]`).click();
    await expect(page).toHaveURL(`/projects/${prev.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      prev.title,
    );
  });

  test("unknown slug returns the 404 page", async ({ page }) => {
    const response = await page.goto("/projects/nope");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("404", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Lost pixel.",
    );
  });
});
