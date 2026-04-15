import { z } from "zod";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const dateSchema = z
  .string()
  .trim()
  .regex(datePattern, "Date must use YYYY-MM-DD format.")
  .optional();

export const catalogQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().max(100).optional().default(""),
});

export const orderSearchQuerySchema = z
  .object({
    customer: z.string().trim().max(100).optional().default(""),
    endDate: dateSchema,
    page: z.coerce.number().int().min(1).max(10000).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
    product: z.string().trim().max(100).optional().default(""),
    startDate: dateSchema,
  })
  .refine(
    (value) =>
      !value.startDate || !value.endDate || value.startDate <= value.endDate,
    {
      message: "startDate must be before or equal to endDate.",
      path: ["startDate"],
    },
  );

export const statsQuerySchema = z
  .object({
    endDate: dateSchema,
    interval: z.enum(["day", "month"]).default("month"),
    limit: z.coerce.number().int().min(1).max(30).default(10),
    startDate: dateSchema,
  })
  .refine(
    (value) =>
      !value.startDate || !value.endDate || value.startDate <= value.endDate,
    {
      message: "startDate must be before or equal to endDate.",
      path: ["startDate"],
    },
  );

export type CatalogQuery = z.infer<typeof catalogQuerySchema>;
export type OrderSearchQuery = z.infer<typeof orderSearchQuerySchema>;
export type StatsQuery = z.infer<typeof statsQuerySchema>;
