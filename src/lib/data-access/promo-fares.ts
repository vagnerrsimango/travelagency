import { prisma } from "@/lib/prisma";
import type { ContentStatus, Currency } from "@/generated/prisma/client";

// Powers the homepage's promo-fares strip. The public card is inherently
// flight-route shaped (from/to, airline, validity), so this combines the
// two models it draws from — FlightOffer (the route) and PromoOffer (the
// promotional price on top of it) — into one admin flow that creates both
// together, rather than making an agent manage two separate screens for
// what is, on the public site, always one card.
//
// PromoOffer itself is soft-linked to any of six catalog types (see its
// schema comment) — this service only covers the flight-linked slice,
// since that's the only one with a public display today. A hotel/vehicle/
// package promo screen is a small follow-up if the site ever shows one.
export type CreatePromoFareInput = {
  origin: string;
  destinationLabel: string;
  airline: string;
  labelEn: string;
  labelPt: string;
  highlightEn?: string | null;
  highlightPt?: string | null;
  promoPrice: number;
  currency?: Currency;
  startsAt: string;
  endsAt: string;
  featured?: boolean;
};

export type UpdatePromoFareInput = Partial<CreatePromoFareInput> & { active?: boolean };

export class PromoFareService {
  static async findAll(options: { status?: ContentStatus } = {}) {
    return prisma.promoOffer.findMany({
      where: {
        flightOfferId: { not: null },
        flightOffer: options.status ? { status: options.status } : undefined,
      },
      include: { flightOffer: true },
      orderBy: [{ startsAt: "asc" }],
    });
  }

  static async findById(id: string) {
    return prisma.promoOffer.findUnique({ where: { id }, include: { flightOffer: true } });
  }

  static async create(data: CreatePromoFareInput, actorId: string) {
    const result = await prisma.$transaction(async (tx) => {
      const flightOffer = await tx.flightOffer.create({
        data: {
          origin: data.origin,
          destinationLabel: data.destinationLabel,
          airline: data.airline,
          price: data.promoPrice,
          currency: data.currency ?? "MZN",
          validFrom: new Date(data.startsAt),
          validUntil: new Date(data.endsAt),
          status: "DRAFT",
        },
      });
      const promoOffer = await tx.promoOffer.create({
        data: {
          labelEn: data.labelEn,
          labelPt: data.labelPt,
          highlightEn: data.highlightEn,
          highlightPt: data.highlightPt,
          promoPrice: data.promoPrice,
          currency: data.currency ?? "MZN",
          startsAt: new Date(data.startsAt),
          endsAt: new Date(data.endsAt),
          featured: data.featured ?? false,
          flightOfferId: flightOffer.id,
        },
      });
      return { ...promoOffer, flightOffer };
    });
    await logPromoFareAudit(actorId, "create", result.id, null, result);
    return result;
  }

  static async update(id: string, data: UpdatePromoFareInput, actorId: string) {
    const before = await prisma.promoOffer.findUnique({ where: { id }, include: { flightOffer: true } });
    if (!before || !before.flightOfferId) return null;

    const after = await prisma.$transaction(async (tx) => {
      if (data.origin || data.destinationLabel || data.airline || data.promoPrice != null || data.currency || data.startsAt || data.endsAt) {
        await tx.flightOffer.update({
          where: { id: before.flightOfferId! },
          data: {
            origin: data.origin,
            destinationLabel: data.destinationLabel,
            airline: data.airline,
            price: data.promoPrice,
            currency: data.currency,
            validFrom: data.startsAt ? new Date(data.startsAt) : undefined,
            validUntil: data.endsAt ? new Date(data.endsAt) : undefined,
          },
        });
      }
      const promoOffer = await tx.promoOffer.update({
        where: { id },
        data: {
          labelEn: data.labelEn,
          labelPt: data.labelPt,
          highlightEn: data.highlightEn,
          highlightPt: data.highlightPt,
          promoPrice: data.promoPrice,
          currency: data.currency,
          startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
          endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
          featured: data.featured,
          active: data.active,
        },
        include: { flightOffer: true },
      });
      return promoOffer;
    });

    await logPromoFareAudit(actorId, "update", id, before, after);
    return after;
  }

  /** Status lives on the underlying FlightOffer (RF-015 workflow) — the
   * PromoOffer itself only has the simple active/inactive toggle. */
  static async updateStatus(id: string, status: ContentStatus, actorId: string) {
    const before = await prisma.promoOffer.findUnique({ where: { id } });
    if (!before || !before.flightOfferId) return null;
    const flightOffer = await prisma.flightOffer.update({
      where: { id: before.flightOfferId },
      data: { status },
    });
    const after = await prisma.promoOffer.findUnique({ where: { id }, include: { flightOffer: true } });
    await logPromoFareAudit(actorId, `status:${status}`, id, before, { ...before, flightOffer });
    return after;
  }

  static async deleteDraft(id: string, actorId: string) {
    const promoOffer = await prisma.promoOffer.findUnique({ where: { id }, include: { flightOffer: true } });
    if (!promoOffer) return { ok: false as const, reason: "not_found" as const };
    if (promoOffer.flightOffer?.status !== "DRAFT") {
      return { ok: false as const, reason: "not_draft" as const };
    }

    await prisma.$transaction(async (tx) => {
      await tx.promoOffer.delete({ where: { id } });
      if (promoOffer.flightOfferId) {
        await tx.flightOffer.delete({ where: { id: promoOffer.flightOfferId } });
      }
    });
    await logPromoFareAudit(actorId, "delete", id, promoOffer, null);
    return { ok: true as const };
  }
}

async function logPromoFareAudit(actorId: string, action: string, entityId: string, before: unknown, after: unknown) {
  const { logAudit } = await import("@/lib/audit");
  await logAudit({
    actorId,
    action: `promoFare.${action}`,
    entityType: "PromoOffer",
    entityId,
    before: before ?? undefined,
    after: after ?? undefined,
  });
}
