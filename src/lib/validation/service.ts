import { z } from "zod";

export const createServiceSchema = z.object({
  key: z
    .string()
    .min(1, "Chave é obrigatória")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Chave deve ser em minúsculas, separada por hífens"),
  nameEn: z.string().min(1, "Nome (EN) é obrigatório"),
  namePt: z.string().min(1, "Nome (PT) é obrigatório"),
  descriptionEn: z.string().min(1, "Descrição (EN) é obrigatória"),
  descriptionPt: z.string().min(1, "Descrição (PT) é obrigatória"),
  icon: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"]),
});
