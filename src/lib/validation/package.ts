import { z } from "zod";

const PACKAGE_THEMES = ["BEACH", "SAFARI", "ISLAND", "LUXURY", "CULTURAL", "ADVENTURE", "CITY"] as const;

export const createPackageSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug é obrigatório")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug deve ser em minúsculas, separado por hífens"),
  nameEn: z.string().min(1, "Nome (EN) é obrigatório"),
  namePt: z.string().min(1, "Nome (PT) é obrigatório"),
  destinationId: z.string().optional(),
  theme: z.enum(PACKAGE_THEMES).optional(),
  itineraryEn: z.string().min(1, "Itinerário (EN) é obrigatório"),
  itineraryPt: z.string().min(1, "Itinerário (PT) é obrigatório"),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  durationDays: z.number().int().positive("Duração deve ser positiva"),
  pricePerPerson: z.number().positive("Preço deve ser positivo"),
  currency: z.enum(["MZN", "USD", "ZAR"]).optional(),
  capacity: z.number().int().positive().optional(),
  images: z.array(z.string()).optional(),
  sortOrder: z.number().int().optional(),
});

export const updatePackageSchema = createPackageSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"]),
});
