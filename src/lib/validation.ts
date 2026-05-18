import { z } from "zod";
import { normalizePhone } from "@/lib/phone";
import { ALL_EVENT_NAMES } from "@/lib/analytics";
import { LEAD_STATUS_VALUES } from "@/lib/lead-status";

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .max(32)
    .transform((value, ctx) => {
      const normalized = normalizePhone(value);

      if (!normalized) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "invalid_phone",
        });
        return z.NEVER;
      }

      return normalized;
    }),
  city: z.string().trim().min(2).max(80),
  contact_method: z.enum(["telegram", "whatsapp", "max", "call"]),
  comment: z.string().trim().max(2000).optional().or(z.literal("")),
  product_interest: z.string().trim().max(200).optional().or(z.literal("")),
  honeypot: z.string().optional().or(z.literal("")),
  started_at: z.string().optional(),
  first_interaction_at: z.string().optional(),
  max_scroll_percent: z.number().optional(),
  tracking: z
    .object({
      utm_source: z.string().max(256).optional(),
      utm_medium: z.string().max(256).optional(),
      utm_campaign: z.string().max(256).optional(),
      utm_content: z.string().max(256).optional(),
      utm_term: z.string().max(256).optional(),
      yclid: z.string().max(256).optional(),
      src: z.string().max(256).optional(),
      cmp: z.string().max(256).optional(),
      cr: z.string().max(256).optional(),
      click_id: z.string().max(256).optional(),
      decision_in: z.string().max(64).optional(),
      score_in_bucket: z.string().max(64).optional(),
      client_id: z.string().max(256).optional(),
    })
    .optional(),
});

export const eventSchema = z.object({
  session_id: z.string().max(128).optional(),
  lead_id: z.string().max(64).optional(),
  event_name: z.enum(ALL_EVENT_NAMES).optional().default("page_view"),
  event_value: z.string().max(256).optional(),
  page: z.string().max(256).optional(),
  payload: z.record(z.any()).optional(),
  tracking: z
    .object({
      src: z.string().max(256).optional(),
      cmp: z.string().max(256).optional(),
      cr: z.string().max(256).optional(),
      click_id: z.string().max(256).optional(),
      utm_source: z.string().max(256).optional(),
      utm_medium: z.string().max(256).optional(),
      utm_campaign: z.string().max(256).optional(),
      utm_content: z.string().max(256).optional(),
      utm_term: z.string().max(256).optional(),
      yclid: z.string().max(256).optional(),
      decision_in: z.string().max(64).optional(),
      score_in_bucket: z.string().max(64).optional(),
      client_id: z.string().max(256).optional(),
    })
    .optional(),
});

export const adminLeadUpdateSchema = z.object({
  lead_id: z.string().max(64),
  lead_status: z.enum(LEAD_STATUS_VALUES),
  manager_comment: z.string().trim().max(2000).optional().or(z.literal("")),
  sale_amount: z.string().trim().max(32).optional().or(z.literal("")),
});
