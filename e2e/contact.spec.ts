import { test, expect, type Page } from "@playwright/test";

const VALID_MESSAGE =
  "Hello Aaron — I would like to talk about a full-time role.";

/** startedAt far enough in the past to clear the 3s bot-speed gate. */
function humanStartedAt(): number {
  return Date.now() - 10_000;
}

async function openContactForm(page: Page): Promise<void> {
  // Reduced motion keeps the Reveal-wrapped form visible without scroll
  // choreography, so form interaction tests stay deterministic.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#contact");
  await expect(page.getByLabel("Name")).toBeVisible();
}

test.describe("contact form UI", () => {
  test("empty submit shows validation errors for all fields", async ({
    page,
  }) => {
    await openContactForm(page);
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByText("Add your name.")).toBeVisible();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(
      page.getByText("Say a bit more — at least 10 characters."),
    ).toBeVisible();
  });

  test("invalid email shows only the email error", async ({ page }) => {
    await openContactForm(page);
    await page.getByLabel("Name").fill("Test Person");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Message").fill(VALID_MESSAGE);
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(page.getByText("Add your name.")).toHaveCount(0);
    await expect(
      page.getByText("Say a bit more — at least 10 characters."),
    ).toHaveCount(0);
  });
});

test.describe("contact API", () => {
  test("honeypot-filled payload is rejected with 400 by schema", async ({
    request,
  }) => {
    // contactSchema requires company to be the literal empty string, so a
    // bot that fills the honeypot fails validation outright.
    const response = await request.post("/api/contact", {
      data: {
        name: "Bot Person",
        email: "bot@example.com",
        message: VALID_MESSAGE,
        company: "spam",
        startedAt: humanStartedAt(),
      },
    });
    expect(response.status()).toBe(400);
    const body = (await response.json()) as {
      error: string;
      issues?: Record<string, unknown>;
    };
    expect(body.error).toBe("Check the form fields");
    expect(body.issues).toHaveProperty("company");
  });

  test("bot-speed submission is silently accepted (200 ok, nothing sent)", async ({
    request,
  }) => {
    const response = await request.post("/api/contact", {
      data: {
        name: "Fast Bot",
        email: "fast@example.com",
        message: VALID_MESSAGE,
        company: "",
        startedAt: Date.now(), // submitted "instantly" — under the 3s gate
      },
    });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  test("valid submission without RESEND_API_KEY returns 503 with friendly error", async ({
    request,
  }) => {
    const response = await request.post("/api/contact", {
      data: {
        name: "Real Person",
        email: "real@example.com",
        message: VALID_MESSAGE,
        company: "",
        startedAt: humanStartedAt(),
      },
    });
    expect(response.status()).toBe(503);
    const body = (await response.json()) as { error: string };
    expect(body.error).toContain("Form is offline");
    expect(body.error).toContain("aarch713@gmail.com");
  });
});
