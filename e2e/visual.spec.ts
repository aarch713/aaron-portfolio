import { test, expect, type Page } from "@playwright/test";

const HOME_WIDTHS = [320, 768, 1024, 1440];
const CASE_STUDY_WIDTHS = [320, 1440];
const CASE_STUDY_PATH = "/projects/pro-points-loyalty";
const VIEWPORT_HEIGHT = 800;
/** Sub-pixel rounding allowance. */
const OVERFLOW_TOLERANCE_PX = 1;
/** Let smooth-scroll/pin state settle after an instant jump. */
const SETTLE_MS = 500;

async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
}

async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await page.waitForTimeout(SETTLE_MS);
}

test.describe("visual QA", () => {
  for (const width of HOME_WIDTHS) {
    test(`home has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
      await page.goto("/");

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(
        OVERFLOW_TOLERANCE_PX,
      );

      await scrollToBottom(page);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(
        OVERFLOW_TOLERANCE_PX,
      );

      // First-run capture only — no snapshot diffing yet.
      await page.screenshot({
        path: `test-results/home-${width}.png`,
        fullPage: true,
      });
    });
  }

  for (const width of CASE_STUDY_WIDTHS) {
    test(`case study has no horizontal overflow at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
      await page.goto(CASE_STUDY_PATH);

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(
        OVERFLOW_TOLERANCE_PX,
      );

      await scrollToBottom(page);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(
        OVERFLOW_TOLERANCE_PX,
      );
    });
  }
});
