import { z } from "zod";

export const createVehicleSchema = z.object({
  category: z.string().min(1, "Categoria é obrigatória"),
  type: z.string().optional(),
  model: z.string().min(1, "Modelo é obrigatório"),
  seats: z.number().int().positive("Lugares deve ser positivo"),
  luggage: z.number().int().min(0).optional(),
  transmission: z.string().optional(),
  withDriver: z.boolean().optional(),
  pricePerDay: z.number().positive("Preço deve ser positivo"),
  currency: z.enum(["MZN", "USD", "ZAR"]).optional(),
  deposit: z.number().nonnegative().optional(),
  images: z.array(z.string()).optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"]),
});
