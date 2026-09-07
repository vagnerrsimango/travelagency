import { z } from "zod";

export const createHotelSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug é obrigatório")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug deve ser em minúsculas, separado por hífens"),
  nameEn: z.string().min(1, "Nome (EN) é obrigatório"),
  namePt: z.string().min(1, "Nome (PT) é obrigatório"),
  destinationId: z.string().min(1, "Destino é obrigatório"),
  category: z.string().optional(),
  stars: z.number().int().min(0).max(5).optional(),
  address: z.string().min(1, "Endereço é obrigatório"),
  descriptionEn: z.string().min(1, "Descrição (EN) é obrigatória"),
  descriptionPt: z.string().min(1, "Descrição (PT) é obrigatória"),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  pricePerNight: z.number().positive("Preço deve ser positivo"),
  currency: z.enum(["MZN", "USD", "ZAR"]).optional(),
  conditionsEn: z.string().optional(),
  conditionsPt: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const updateHotelSchema = createHotelSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"]),
});
