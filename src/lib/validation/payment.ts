import { z } from "zod";

export const initiatePaymentSchema = z.object({
  method: z.enum(["MPESA", "EMOLA"]),
  walletNumber: z.string().min(6, "Número de carteira inválido").max(30),
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum(["PENDING", "AUTHORIZED", "RECEIVED", "RECONCILED", "CONFIRMED", "FAILED", "TIMEOUT", "DIVERGENT", "CANCELLED"]),
});
