import { z } from "zod";

// ─── Auth Schemas ───────────────────────────────────────

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
  displayName: z.string().max(50).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
});

// ─── Catch Report Schemas ───────────────────────────────

export const createCatchReportSchema = z.object({
  waterbodyId: z.string().uuid("Invalid waterbody ID"),
  species: z.string().min(1, "Species is required").max(100),
  method: z.string().min(1, "Method is required").max(100),
  notes: z.string().max(500).optional(),
  visibility: z.enum(["PUBLIC", "ANONYMOUS"]).optional().default("PUBLIC"),
});

export const updateCatchReportSchema = z.object({
  species: z.string().min(1).max(100).optional(),
  method: z.string().min(1).max(100).optional(),
  notes: z.string().max(500).optional(),
  visibility: z.enum(["PUBLIC", "ANONYMOUS"]).optional(),
});

// ─── Event Schemas ──────────────────────────────────────

export const createEventSchema = z.object({
  waterbodyId: z.string().uuid().optional(),
  region: z.string().max(100).optional(),
  category: z.enum([
    "ALGAL_BLOOM",
    "FREE_FISHING_DAY",
    "TOURNAMENT",
    "SEASONAL_CLOSURE",
    "ACCESS_RESTRICTION",
  ]),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  sourceUrl: z.string().url().optional(),
});

// ─── Favorite Schemas ───────────────────────────────────

export const addFavoriteSchema = z.object({
  waterbodyId: z.string().uuid("Invalid waterbody ID"),
});

// ─── Reminder Schemas ───────────────────────────────────

export const createReminderSchema = z.object({
  state: z.string().length(2, "State must be a 2-letter code"),
  licenseExpiration: z.coerce.date(),
  remindDaysBefore: z
    .number()
    .int()
    .min(1, "Must be at least 1 day")
    .max(90, "Must be 90 days or fewer"),
});

export const updateReminderSchema = z.object({
  state: z.string().length(2).optional(),
  licenseExpiration: z.coerce.date().optional(),
  remindDaysBefore: z.number().int().min(1).max(90).optional(),
  enabled: z.boolean().optional(),
});
