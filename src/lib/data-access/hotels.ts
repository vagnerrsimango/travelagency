import { prisma } from "@/lib/prisma";
import type { ContentStatus, Currency } from "@/generated/prisma/client";

export type CreateHotelInput = {
  slug: string;
  nameEn: string;
  namePt: string;
  destinationId: string;
  category?: string | null;
  stars?: number | null;
  address: string;
  descriptionEn: string;
  descriptionPt: string;
  amenities?: string[];
  images?: string[];
  pricePerNight: number;
  currency?: Currency;
  conditionsEn?: string | null;
  conditionsPt?: string | null;
  sortOrder?: number;
};

export type UpdateHotelInput = Partial<CreateHotelInput>;

export class HotelService {
  static async findAll(options: { status?: ContentStatus } = {}) {
    return prisma.hotel.findMany({
      where: options.status ? { status: options.status } : undefined,
      include: { destination: true },
      orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
    });
  }

  static async findById(id: string) {
    return prisma.hotel.findUnique({ where: { id }, include: { destination: true } });
  }

  static async findBySlug(slug: string) {
    return prisma.hotel.findUnique({ where: { slug } });
  }

  static async create(data: CreateHotelInput, actorId: string) {
    const hotel = await prisma.hotel.create({ data: { ...data, status: "DRAFT" } });
    await logHotelAudit(actorId, "create", hotel.id, null, hotel);
    return hotel;
  }

  static async update(id: string, data: UpdateHotelInput, actorId: string) {
    const before = await prisma.hotel.findUnique({ where: { id } });
    if (!before) return null;
    const after = await prisma.hotel.update({ where: { id }, data });
    await logHotelAudit(actorId, "update", id, before, after);
    return after;
  }

  static async updateStatus(id: string, status: ContentStatus, actorId: string) {
    const before = await prisma.hotel.findUnique({ where: { id } });
    if (!before) return null;
    const after = await prisma.hotel.update({ where: { id }, data: { status } });
    await logHotelAudit(actorId, `status:${status}`, id, before, after);
    return after;
  }

  static async deleteDraft(id: string, actorId: string) {
    const hotel = await prisma.hotel.findUnique({ where: { id } });
    if (!hotel) return { ok: false as const, reason: "not_found" as const };
    if (hotel.status !== "DRAFT") return { ok: false as const, reason: "not_draft" as const };
    await prisma.hotel.delete({ where: { id } });
    await logHotelAudit(actorId, "delete", id, hotel, null);
    return { ok: true as const };
  }
}

async function logHotelAudit(actorId: string, action: string, entityId: string, before: unknown, after: unknown) {
  const { logAudit } = await import("@/lib/audit");
  await logAudit({
    actorId,
    action: `hotel.${action}`,
    entityType: "Hotel",
    entityId,
    before: before ?? undefined,
    after: after ?? undefined,
  });
}
