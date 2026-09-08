import { z } from "zod";

export const updateReservationStatusSchema = z.object({
  status: z.enum([
    "RECEIVED",
    "IN_REVIEW",
    "QUOTE_SENT",
    "AWAITING_PAYMENT",
    "PAYMENT_PENDING",
    "CONFIRMED",
    "REJECTED",
    "CANCELLED",
    "COMPLETED",
  ]),
});

export const addNoteSchema = z.object({
  body: z.string().min(1, "Nota não pode estar vazia").max(2000),
});
