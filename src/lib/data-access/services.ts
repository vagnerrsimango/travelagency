import { prisma } from "@/lib/prisma";
import type { ContentStatus } from "@/generated/prisma/client";

export type CreateServiceInput = {
  key: string;
  nameEn: string;
  namePt: string;
  descriptionEn: string;
  descriptionPt: string;
  icon?: string | null;
  sortOrder?: number;
};

export type UpdateServiceInput = Partial<CreateServiceInput>;

export class ServiceService {
  static async findAll(options: { status?: ContentStatus } = {}) {
    return prisma.ancillaryService.findMany({
      where: options.status ? { status: options.status } : undefined,
      orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
    });
  }

  static async findById(id: string) {
    return prisma.ancillaryService.findUnique({ where: { id } });
  }

  static async findByKey(key: string) {
    return prisma.ancillaryService.findUnique({ where: { key } });
  }

  static async create(data: CreateServiceInput, actorId: string) {
    const service = await prisma.ancillaryService.create({ data: { ...data, status: "DRAFT" } });
    await logServiceAudit(actorId, "create", service.id, null, service);
    return service;
  }

  static async update(id: string, data: UpdateServiceInput, actorId: string) {
    const before = await prisma.ancillaryService.findUnique({ where: { id } });
    if (!before) return null;
    const after = await prisma.ancillaryService.update({ where: { id }, data });
    await logServiceAudit(actorId, "update", id, before, after);
    return after;
  }

  static async updateStatus(id: string, status: ContentStatus, actorId: string) {
    const before = await prisma.ancillaryService.findUnique({ where: { id } });
    if (!before) return null;
    const after = await prisma.ancillaryService.update({ where: { id }, data: { status } });
    await logServiceAudit(actorId, `status:${status}`, id, before, after);
    return after;
  }

  static async deleteDraft(id: string, actorId: string) {
    const service = await prisma.ancillaryService.findUnique({ where: { id } });
    if (!service) return { ok: false as const, reason: "not_found" as const };
    if (service.status !== "DRAFT") return { ok: false as const, reason: "not_draft" as const };
    await prisma.ancillaryService.delete({ where: { id } });
    await logServiceAudit(actorId, "delete", id, service, null);
    return { ok: true as const };
  }
}

async function logServiceAudit(actorId: string, action: string, entityId: string, before: unknown, after: unknown) {
  const { logAudit } = await import("@/lib/audit");
  await logAudit({
    actorId,
    action: `ancillaryService.${action}`,
    entityType: "AncillaryService",
    entityId,
    before: before ?? undefined,
    after: after ?? undefined,
  });
}
