import { z } from "zod";

/**
 * Contact form payload — shared by the client form (inline validation) and
 * the /api/contact route handler (boundary validation).
 *
 * - `company` is a honeypot: humans never see it, bots fill it, so any
 *   non-empty value fails the literal check.
 * - `startedAt` is the epoch-ms timestamp captured when the form mounted;
 *   the API uses it to reject instant (bot-speed) submissions.
 */
export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  message: z.string().min(10).max(4000),
  company: z.literal(""),
  startedAt: z.number(),
});

export type ContactInput = z.infer<typeof contactSchema>;
