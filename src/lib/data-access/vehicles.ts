import { prisma } from "@/lib/prisma";
import type { ContentStatus, Currency } from "@/generated/prisma/client";

export type CreateVehicleInput = {
  category: string;
  type?: string | null;
  model: string;
  seats: number;
  luggage?: number | null;
  transmission?: string | null;
  withDriver?: boolean;
  pricePerDay: number;
  currency?: Currency;
  deposit?: number | null;
  images?: string[];
};

export type UpdateVehicleInput = Partial<CreateVehicleInput>;

export class VehicleService {
  static async findAll(options: { status?: ContentStatus } = {}) {
    return prisma.vehicle.findMany({
      where: options.status ? { status: options.status } : undefined,
      orderBy: [{ category: "asc" }],
    });
  }

  static async findById(id: string) {
    return prisma.vehicle.findUnique({ where: { id } });
  }

  static async create(data: CreateVehicleInput, actorId: string) {
    const vehicle = await prisma.vehicle.create({ data: { ...data, status: "DRAFT" } });
    await logVehicleAudit(actorId, "create", vehicle.id, null, vehicle);
    return vehicle;
  }

  static async update(id: string, data: UpdateVehicleInput, actorId: string) {
    const before = await prisma.vehicle.findUnique({ where: { id } });
    if (!before) return null;
    const after = await prisma.vehicle.update({ where: { id }, data });
    await logVehicleAudit(actorId, "update", id, before, after);
    return after;
  }

  static async updateStatus(id: string, status: ContentStatus, actorId: string) {
    const before = await prisma.vehicle.findUnique({ where: { id } });
    if (!before) return null;
    const after = await prisma.vehicle.update({ where: { id }, data: { status } });
    await logVehicleAudit(actorId, `status:${status}`, id, before, after);
    return after;
  }

  static async deleteDraft(id: string, actorId: string) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) return { ok: false as const, reason: "not_found" as const };
    if (vehicle.status !== "DRAFT") return { ok: false as const, reason: "not_draft" as const };
    await prisma.vehicle.delete({ where: { id } });
    await logVehicleAudit(actorId, "delete", id, vehicle, null);
    return { ok: true as const };
  }
}

async function logVehicleAudit(actorId: string, action: string, entityId: string, before: unknown, after: unknown) {
  const { logAudit } = await import("@/lib/audit");
  await logAudit({
    actorId,
    action: `vehicle.${action}`,
    entityType: "Vehicle",
    entityId,
    before: before ?? undefined,
    after: after ?? undefined,
  });
}
