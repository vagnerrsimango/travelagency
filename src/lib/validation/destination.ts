import { z } from "zod";

export const createDestinationSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug é obrigatório")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug deve ser em minúsculas, separado por hífens"),
  nameEn: z.string().min(1, "Nome (EN) é obrigatório"),
  namePt: z.string().min(1, "Nome (PT) é obrigatório"),
  country: z.string().min(1, "País é obrigatório"),
  region: z.string().optional(),
  taglineEn: z.string().optional(),
  taglinePt: z.string().optional(),
  descriptionEn: z.string().min(1, "Descrição (EN) é obrigatória"),
  descriptionPt: z.string().min(1, "Descrição (PT) é obrigatória"),
  images: z.array(z.string()).optional(),
  seoTitleEn: z.string().optional(),
  seoTitlePt: z.string().optional(),
  seoDescriptionEn: z.string().optional(),
  seoDescriptionPt: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const updateDestinationSchema = createDestinationSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"]),
});
