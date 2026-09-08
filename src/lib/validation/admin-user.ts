import { z } from "zod";

const ROLES = ["ADMINISTRATOR", "CATALOG_MANAGER", "BOOKING_AGENT", "FINANCE", "READ_ONLY"] as const;

export const createAdminUserSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório").max(120),
  email: z
    .string()
    .email("Email inválido")
    .transform((v) => v.trim().toLowerCase()),
  password: z.string().min(8, "A password deve ter pelo menos 8 caracteres"),
  role: z.enum(ROLES),
});

export const updateAdminUserSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  role: z.enum(ROLES).optional(),
  isActive: z.boolean().optional(),
});

export const resetAdminPasswordSchema = z.object({
  password: z.string().min(8, "A password deve ter pelo menos 8 caracteres"),
});
