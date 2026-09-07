import { prisma } from "@/lib/prisma";
import type { ContentStatus, Currency, PackageTheme } from "@/generated/prisma/client";

// RF-014 — powers both the public site's "Tours" carousel and "Packages"
// grid (2026-09-07 decision: one catalog type, two display treatments).
export type CreatePackageInput = {
  slug: string;
  nameEn: string;
  namePt: string;
  destinationId?: string | null;
  theme?: PackageTheme | null;
  itineraryEn: string;
  itineraryPt: string;
  inclusions?: string[];
  exclusions?: string[];
  durationDays: number;
  pricePerPerson: number;
  currency?: Currency;
  capacity?: number | null;
  images?: string[];
  sortOrder?: number;
};

export type UpdatePackageInput = Partial<CreatePackageInput>;

export class PackageService {
  static async findAll(options: { status?: ContentStatus } = {}) {
    return prisma.travelPackage.findMany({
      where: options.status ? { status: options.status } : undefined,
      include: { destination: true },
      orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
    });
  }

  static async findById(id: string) {
    return prisma.travelPackage.findUnique({ where: { id }, include: { destination: true } });
  }

  static async findBySlug(slug: string) {
    return prisma.travelPackage.findUnique({ where: { slug } });
  }

  static async create(data: CreatePackageInput, actorId: string) {
    const pkg = await prisma.travelPackage.create({ data: { ...data, status: "DRAFT" } });
    await logPackageAudit(actorId, "create", pkg.id, null, pkg);
    return pkg;
  }

  static async update(id: string, data: UpdatePackageInput, actorId: string) {
    const before = await prisma.travelPackage.findUnique({ where: { id } });
    if (!before) return null;
    const after = await prisma.travelPackage.update({ where: { id }, data });
    await logPackageAudit(actorId, "update", id, before, after);
    return after;
  }

  static async updateStatus(id: string, status: ContentStatus, actorId: string) {
    const before = await prisma.travelPackage.findUnique({ where: { id } });
    if (!before) return null;
    const after = await prisma.travelPackage.update({ where: { id }, data: { status } });
    await logPackageAudit(actorId, `status:${status}`, id, before, after);
    return after;
  }

  static async deleteDraft(id: string, actorId: string) {
    const pkg = await prisma.travelPackage.findUnique({ where: { id } });
    if (!pkg) return { ok: false as const, reason: "not_found" as const };
    if (pkg.status !== "DRAFT") return { ok: false as const, reason: "not_draft" as const };
    await prisma.travelPackage.delete({ where: { id } });
    await logPackageAudit(actorId, "delete", id, pkg, null);
    return { ok: true as const };
  }
}

async function logPackageAudit(actorId: string, action: string, entityId: string, before: unknown, after: unknown) {
  const { logAudit } = await import("@/lib/audit");
  await logAudit({
    actorId,
    action: `package.${action}`,
    entityType: "TravelPackage",
    entityId,
    before: before ?? undefined,
    after: after ?? undefined,
  });
}
