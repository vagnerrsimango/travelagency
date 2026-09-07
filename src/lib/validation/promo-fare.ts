import { z } from "zod";

export const createPromoFareSchema = z.object({
  origin: z.string().min(1, "Origem é obrigatória"),
  destinationLabel: z.string().min(1, "Destino é obrigatório"),
  airline: z.string().min(1, "Companhia aérea é obrigatória"),
  labelEn: z.string().min(1, "Etiqueta (EN) é obrigatória"),
  labelPt: z.string().min(1, "Etiqueta (PT) é obrigatória"),
  highlightEn: z.string().optional(),
  highlightPt: z.string().optional(),
  promoPrice: z.number().positive("Preço deve ser positivo"),
  currency: z.enum(["MZN", "USD", "ZAR"]).optional(),
  startsAt: z.string().min(1, "Data de início é obrigatória"),
  endsAt: z.string().min(1, "Data de fim é obrigatória"),
  featured: z.boolean().optional(),
});

export const updatePromoFareSchema = createPromoFareSchema.partial().extend({
  active: z.boolean().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"]),
});
