import { test, expect, type Page } from "@playwright/test";

const RESUME_HREF = "/resume/Aaron_Chai_Resume.pdf";

const SUGGESTED_QUESTIONS = [
  "What did Aaron build at Beauty 21?",
  "What's his backend experience?",
  "How does he use AI tooling?",
];

function trigger(page: Page) {
  return page.getByRole("button", { name: "Ask my resume" });
}

function dialog(page: Page) {
  return page.getByRole("dialog", { name: "Ask my resume" });
}

test.describe("chat widget", () => {
  test("floating trigger is visible and opens the panel", async ({ page }) => {
    await page.goto("/");
    await expect(trigger(page)).toBeVisible();

    await trigger(page).click();
    await expect(dialog(page)).toBeVisible();

    // Suggested question chips render inside the fresh panel.
    for (const question of SUGGESTED_QUESTIONS) {
      await expect(
        dialog(page).getByRole("button", { name: question }),
      ).toBeVisible();
    }
  });

  test("sending a message without ANTHROPIC_API_KEY shows fallback with resume link", async ({
    page,
  }) => {
    await page.goto("/");
    await trigger(page).click();
    await expect(dialog(page)).toBeVisible();

    await page.getByLabel("Your question").fill("What has Aaron built?");
    await dialog(page).getByRole("button", { name: "Send" }).click();

    // /api/chat replies with JSON { fallback } when no key is configured;
    // the client renders it with an explicit resume-PDF link.
    await expect(dialog(page).getByText("Chat is resting")).toBeVisible();
    const pdfLink = dialog(page).getByRole("link", {
      name: "Download the resume PDF",
    });
    await expect(pdfLink).toBeVisible();
    await expect(pdfLink).toHaveAttribute("href", RESUME_HREF);
  });

  test("Escape closes the panel and focus returns to the trigger", async ({
    page,
  }) => {
    await page.goto("/");
    await trigger(page).click();
    await expect(dialog(page)).toBeVisible();
    // The textarea autofocuses, so the keydown lands inside the panel.
    await expect(page.getByLabel("Your question")).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog(page)).toHaveCount(0);
    await expect(trigger(page)).toBeFocused();
  });

  test("open-chat CustomEvent opens the panel", async ({ page }) => {
    await page.goto("/");
    await expect(trigger(page)).toBeVisible();

    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("open-chat"));
    });
    await expect(dialog(page)).toBeVisible();
  });
});
