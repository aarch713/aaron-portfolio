import { test, expect, type Page } from "@playwright/test";

const RESUME_HREF = "/resume/Aaron_Chai_Resume.pdf";

async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
}

test.describe("home page", () => {
  test("hero name is visible and contains Aaron Chai", async ({ page }) => {
    await page.goto("/");
    const heading = page.locator("h1#hero-heading");
    await expect(heading).toBeVisible();
    // GSAP splits the name into aria-hidden char spans; Playwright's text
    // normalization folds the NBSP spacers back into plain spaces.
    await expect(heading).toContainText("Aaron Chai");
    // Accessible name survives the split via aria-label.
    await expect(heading).toHaveAccessibleName(/Aaron Chai/);
  });

  test("nav reveals after scrolling past the hero", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav).toBeAttached();
    // At the top of the page the bar is faded out.
    await expect(nav).toHaveCSS("opacity", "0");

    // Scroll well past 80% of the viewport height using wheel input, which
    // Lenis (smooth scroll) handles natively.
    for (let i = 0; i < 4; i += 1) {
      await page.mouse.wheel(0, 800);
      await page.waitForTimeout(100);
    }
    await expect(nav).toHaveCSS("opacity", "1");
  });

  test("anchor link #projects brings the projects section into view", async ({
    page,
  }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: "See the work" });
    await expect(cta).toBeVisible();
    await cta.click();

    await expect
      .poll(
        async () =>
          page.evaluate(() => {
            const section = document.querySelector("#projects");
            if (!section) return false;
            const rect = section.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
          }),
        { timeout: 10_000 },
      )
      .toBe(true);
  });

  test("resume download link is present", async ({ page }) => {
    await page.goto("/");
    const resumeLinks = page.locator(`a[href="${RESUME_HREF}"]`);
    expect(await resumeLinks.count()).toBeGreaterThan(0);
    await expect(resumeLinks.first()).toHaveAttribute("download", "");
  });

  test("footer has a GitHub link", async ({ page }) => {
    await page.goto("/");
    const githubLink = page.locator('footer a[href*="github.com"]').first();
    await expect(githubLink).toBeAttached();
    await expect(githubLink).toHaveAttribute("href", /github\.com/);
  });

  test("reduced motion: hero and all section headings visible after a plain scroll", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // Hero text is visible immediately — no hidden intro states.
    await expect(page.locator("h1#hero-heading")).toBeVisible();
    await expect(page.getByRole("link", { name: "See the work" })).toBeVisible();

    // Plain scroll to the bottom must not get stuck in pinning traps.
    await page.evaluate(() =>
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "instant",
      }),
    );
    await expect(page.locator("footer").last()).toBeInViewport();

    // Every section heading on the page is rendered and visible.
    const headings = page.locator("main h2");
    const count = await headings.count();
    expect(count).toBeGreaterThanOrEqual(6);
    for (let i = 0; i < count; i += 1) {
      await expect(headings.nth(i)).toBeVisible();
    }

    // And no horizontal overflow crept in along the way.
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });
});
