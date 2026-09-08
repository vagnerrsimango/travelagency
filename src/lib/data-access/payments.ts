import { prisma } from "@/lib/prisma";
import { initiatePayment, maskWallet } from "@/lib/payments/payen-adapter";
import type { PaymentMethod, PaymentStatus, Prisma } from "@/generated/prisma/client";

const SAFE_ADMIN_SELECT = { id: true, name: true, email: true, role: true } as const;

export type InitiateReservationPaymentInput = {
  reservationId: string;
  method: PaymentMethod;
  walletNumber: string;
};

export class PaymentService {
  /** Agent-triggered: reservation has a quote, customer is ready to pay.
   * Creates the Payment row, calls the (currently stubbed) gateway
   * adapter, and moves the reservation into the payment part of RF-026's
   * flow. The full wallet number lives only in this function's stack —
   * it's masked before anything touches the database. */
  static async initiateForReservation(input: InitiateReservationPaymentInput, actorId: string) {
    const reservation = await prisma.reservation.findUnique({ where: { id: input.reservationId } });
    if (!reservation) return { ok: false as const, reason: "not_found" as const };
    if (!reservation.quotedPrice || !reservation.quotedCurrency) {
      return { ok: false as const, reason: "not_quoted" as const };
    }

    const gatewayResult = await initiatePayment({
      method: input.method,
      amount: Number(reservation.quotedPrice),
      currency: reservation.quotedCurrency,
      walletNumber: input.walletNumber,
      reference: reservation.reference,
    });

    const payment = await prisma.payment.create({
      data: {
        reservationId: reservation.id,
        method: input.method,
        status: gatewayResult.status,
        providerIntentId: gatewayResult.providerIntentId,
        walletMasked: maskWallet(input.walletNumber),
        amount: reservation.quotedPrice,
        currency: reservation.quotedCurrency,
        rawResponse: gatewayResult.rawResponse as Prisma.InputJsonValue,
        respondedAt: new Date(),
      },
    });

    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: "AWAITING_PAYMENT", agentId: actorId },
    });

    const { logAudit } = await import("@/lib/audit");
    await logAudit({
      actorId,
      action: "payment.initiate",
      entityType: "Payment",
      entityId: payment.id,
      before: undefined,
      after: payment,
    });

    return { ok: true as const, payment };
  }

  static async findAll(options: { status?: PaymentStatus; method?: PaymentMethod } = {}) {
    return prisma.payment.findMany({
      where: { status: options.status, method: options.method },
      include: {
        reservation: { include: { customer: true, agent: { select: SAFE_ADMIN_SELECT } } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        reservation: { include: { customer: true, agent: { select: SAFE_ADMIN_SELECT } } },
        webhookEvents: true,
        reconciliation: true,
      },
    });
  }

  /** Manual status override — used while Payen isn't wired (an agent
   * confirming a payment they verified by phone/bank statement), and
   * afterwards for handling any state a webhook doesn't cleanly cover. */
  static async updateStatus(id: string, status: PaymentStatus, actorId: string) {
    const before = await prisma.payment.findUnique({ where: { id } });
    if (!before) return null;

    const after = await prisma.payment.update({
      where: { id },
      data: { status, respondedAt: new Date() },
    });

    if (status === "CONFIRMED") {
      await prisma.reservation.update({ where: { id: before.reservationId }, data: { status: "CONFIRMED", confirmedAt: new Date() } });
    }

    const { logAudit } = await import("@/lib/audit");
    await logAudit({
      actorId,
      action: `payment.status:${status}`,
      entityType: "Payment",
      entityId: id,
      before,
      after,
    });

    return after;
  }

  static async summary() {
    const [pending, confirmed, failed, totalConfirmedAmount] = await Promise.all([
      prisma.payment.count({ where: { status: { in: ["PENDING", "AUTHORIZED", "RECEIVED"] } } }),
      prisma.payment.count({ where: { status: "CONFIRMED" } }),
      prisma.payment.count({ where: { status: { in: ["FAILED", "TIMEOUT", "DIVERGENT", "CANCELLED"] } } }),
      prisma.payment.aggregate({ where: { status: "CONFIRMED" }, _sum: { amount: true } }),
    ]);
    return {
      pending,
      confirmed,
      failed,
      totalConfirmedAmount: Number(totalConfirmedAmount._sum.amount ?? 0),
    };
  }
}
