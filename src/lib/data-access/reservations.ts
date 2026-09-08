import { prisma } from "@/lib/prisma";
import { calculateQuote, type PriceQuote } from "@/lib/pricing";
import type { CreateReservationInput } from "@/lib/validation/reservation";
import type { ReservationServiceType, ReservationStatus } from "@/generated/prisma/client";

export type { CreateReservationInput };

const SERVICE_TYPE_FK: Record<ReservationServiceType, string | null> = {
  FLIGHT: "flightOfferId",
  HOTEL: "hotelId",
  CAR: "vehicleId",
  PACKAGE: "packageId",
  SERVICE: "ancillaryServiceId",
  CUSTOM: null,
};

// Never spread a full AdminUser into an API response — it carries
// passwordHash. Every place an agent/note-author gets included below
// selects exactly these fields, nothing more.
const SAFE_ADMIN_SELECT = { id: true, name: true, email: true, role: true } as const;

/** ZT-YYMMDD-XXXX — human-facing, not guessable enough to matter for a
 * booking reference (RF-024), unique-checked with a short retry loop
 * since a collision is astronomically unlikely but not impossible. */
async function generateReference(): Promise<string> {
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  for (let attempt = 0; attempt < 5; attempt++) {
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    const reference = `ZT-${datePart}-${suffix}`;
    const existing = await prisma.reservation.findUnique({ where: { reference } });
    if (!existing) return reference;
  }
  throw new Error("Could not generate a unique reservation reference after 5 attempts");
}

/** Localized display name for whatever was booked — used in the
 * confirmation email and the submission response, not stored anywhere. */
export async function getItemDisplayName(
  serviceType: ReservationServiceType,
  itemId: string,
  locale: "pt" | "en"
): Promise<string> {
  const pick = (pt: string, en: string) => (locale === "pt" ? pt : en);
  switch (serviceType) {
    case "FLIGHT": {
      const f = await prisma.flightOffer.findUnique({ where: { id: itemId } });
      return f ? `${f.origin} → ${f.destinationLabel}` : "";
    }
    case "HOTEL": {
      const h = await prisma.hotel.findUnique({ where: { id: itemId } });
      return h ? pick(h.namePt, h.nameEn) : "";
    }
    case "CAR": {
      const v = await prisma.vehicle.findUnique({ where: { id: itemId } });
      return v ? `${v.category} · ${v.model}` : "";
    }
    case "PACKAGE": {
      const p = await prisma.travelPackage.findUnique({ where: { id: itemId } });
      return p ? pick(p.namePt, p.nameEn) : "";
    }
    case "SERVICE": {
      const s = await prisma.ancillaryService.findUnique({ where: { id: itemId } });
      return s ? pick(s.namePt, s.nameEn) : "";
    }
    default:
      return "";
  }
}

export class ReservationService {
  static async create(input: CreateReservationInput) {
    // Price it first — calculateQuote throws PricingError for anything
    // the customer needs to see as a clean validation message (item not
    // found/published, bad quantity), before any database write happens.
    // Exception: an open flight route with no matching published fare has
    // nothing to price against — that's a normal quote request, not an
    // error, and it's fine to create with quotedPrice left null.
    const hasPriceableItem = input.serviceType !== "FLIGHT" || Boolean(input.itemId);
    const quote: PriceQuote | null = hasPriceableItem
      ? await calculateQuote(
          input.serviceType === "FLIGHT"
            ? { serviceType: "FLIGHT", itemId: input.itemId!, passengers: input.passengers }
            : input
        )
      : null;

    // Customer.phone is indexed, not unique (a household/company phone can
    // legitimately belong to more than one customer record) — so this is a
    // manual find-then-create/update, not a true upsert.
    const existingCustomer = await prisma.customer.findFirst({ where: { phone: input.customer.phone } });
    const customer = existingCustomer
      ? await prisma.customer.update({
          where: { id: existingCustomer.id },
          data: { fullName: input.customer.fullName, email: input.customer.email || undefined },
        })
      : await prisma.customer.create({
          data: {
            fullName: input.customer.fullName,
            phone: input.customer.phone,
            email: input.customer.email || undefined,
          },
        });

    const reference = await generateReference();
    const fkField = SERVICE_TYPE_FK[input.serviceType];

    const reservation = await prisma.reservation.create({
      data: {
        reference,
        customerId: customer.id,
        serviceType: input.serviceType,
        status: "RECEIVED",
        ...(fkField ? { [fkField]: input.itemId } : {}),
        passengers: "passengers" in input ? input.passengers : 1,
        dateFrom: input.dateFrom ? new Date(input.dateFrom) : undefined,
        dateTo: input.dateTo ? new Date(input.dateTo) : undefined,
        origin: input.serviceType === "FLIGHT" ? input.origin : undefined,
        destinationCity: input.serviceType === "FLIGHT" ? input.destinationCity : undefined,
        customerRemarks: input.customerRemarks,
        // RF-027 — the price is frozen at submission time, not left to
        // float with later catalog changes. Stays null for an unpriced
        // flight quote request until an agent sends one (QUOTE_SENT).
        quotedPrice: quote?.total,
        quotedCurrency: quote?.currency,
        quoteSentAt: quote ? new Date() : undefined,
      },
    });

    return { reservation, customer, quote };
  }

  static async findAll(options: { status?: ReservationStatus; serviceType?: ReservationServiceType } = {}) {
    return prisma.reservation.findMany({
      where: {
        status: options.status,
        serviceType: options.serviceType,
      },
      include: {
        customer: true,
        flightOffer: true,
        hotel: true,
        vehicle: true,
        package: true,
        ancillaryService: true,
        agent: { select: SAFE_ADMIN_SELECT },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findById(id: string) {
    return prisma.reservation.findUnique({
      where: { id },
      include: {
        customer: true,
        flightOffer: true,
        hotel: true,
        vehicle: true,
        package: true,
        ancillaryService: true,
        agent: { select: SAFE_ADMIN_SELECT },
        payments: true,
        agentNotes: { include: { author: { select: SAFE_ADMIN_SELECT } }, orderBy: { createdAt: "desc" } },
      },
    });
  }

  static async updateStatus(id: string, status: ReservationStatus, agentId: string, actorId: string) {
    const before = await prisma.reservation.findUnique({ where: { id } });
    if (!before) return null;

    const after = await prisma.reservation.update({
      where: { id },
      data: {
        status,
        agentId,
        confirmedAt: status === "CONFIRMED" ? new Date() : undefined,
      },
    });

    const { logAudit } = await import("@/lib/audit");
    await logAudit({
      actorId,
      action: `reservation.status:${status}`,
      entityType: "Reservation",
      entityId: id,
      before,
      after,
    });

    return after;
  }

  static async summary() {
    const counts = await prisma.reservation.groupBy({ by: ["status"], _count: { _all: true } });
    const statuses: ReservationStatus[] = [
      "RECEIVED", "IN_REVIEW", "QUOTE_SENT", "AWAITING_PAYMENT", "PAYMENT_PENDING",
      "CONFIRMED", "REJECTED", "CANCELLED", "COMPLETED",
    ];
    const result = Object.fromEntries(statuses.map((s) => [s, 0])) as Record<ReservationStatus, number>;
    for (const c of counts) result[c.status] = c._count._all;
    const total = counts.reduce((sum, c) => sum + c._count._all, 0);
    return { total, byStatus: result, needsAttention: result.RECEIVED + result.IN_REVIEW };
  }

  static async findRecent(limit = 8) {
    return prisma.reservation.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        reference: true,
        status: true,
        serviceType: true,
        createdAt: true,
        customer: { select: { fullName: true } },
      },
    });
  }

  static async addNote(reservationId: string, authorId: string, body: string) {
    return prisma.reservationNote.create({
      data: { reservationId, authorId, body },
      include: { author: { select: SAFE_ADMIN_SELECT } },
    });
  }
}
