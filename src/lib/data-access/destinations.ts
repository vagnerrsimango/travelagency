import { prisma } from "@/lib/prisma";
import type { ContentStatus } from "@/generated/prisma/client";

// Data-access layer, matching the pattern in elleza's src/lib/data-access/*
// (a thin static-method class wrapping Prisma) — keeps route handlers as
// pure HTTP glue: parse, authorize, call the service, respond.

export type CreateDestinationInput = {
  slug: string;
  nameEn: string;
  namePt: string;
  country: string;
  region?: string | null;
  taglineEn?: string | null;
  taglinePt?: string | null;
  descriptionEn: string;
  descriptionPt: string;
  images?: string[];
  seoTitleEn?: string | null;
  seoTitlePt?: string | null;
  seoDescriptionEn?: string | null;
  seoDescriptionPt?: string | null;
  sortOrder?: number;
};

export type UpdateDestinationInput = Partial<CreateDestinationInput>;

export class DestinationService {
  static async findAll(options: { status?: ContentStatus } = {}) {
    return prisma.destination.findMany({
      where: options.status ? { status: options.status } : undefined,
      orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
    });
  }

  static async findById(id: string) {
    return prisma.destination.findUnique({ where: { id } });
  }

  static async findBySlug(slug: string) {
    return prisma.destination.findUnique({ where: { slug } });
  }

  static async create(data: CreateDestinationInput, actorId: string) {
    const destination = await prisma.destination.create({
      data: { ...data, status: "DRAFT" },
    });
    await logDestinationAudit(actorId, "create", destination.id, null, destination);
    return destination;
  }

  static async update(id: string, data: UpdateDestinationInput, actorId: string) {
    const before = await prisma.destination.findUnique({ where: { id } });
    if (!before) return null;

    const after = await prisma.destination.update({ where: { id }, data });
    await logDestinationAudit(actorId, "update", id, before, after);
    return after;
  }

  /** RF-015 — draft → review → approved → published, plus archive. */
  static async updateStatus(id: string, status: ContentStatus, actorId: string) {
    const before = await prisma.destination.findUnique({ where: { id } });
    if (!before) return null;

    const after = await prisma.destination.update({ where: { id }, data: { status } });
    await logDestinationAudit(actorId, `status:${status}`, id, before, after);
    return after;
  }

  /** Only ever deletes a DRAFT — never a destination that's been reviewed
   * or published. Anything further along gets archived instead. */
  static async deleteDraft(id: string, actorId: string) {
    const destination = await prisma.destination.findUnique({ where: { id } });
    if (!destination) return { ok: false as const, reason: "not_found" as const };
    if (destination.status !== "DRAFT") {
      return { ok: false as const, reason: "not_draft" as const };
    }

    await prisma.destination.delete({ where: { id } });
    await logDestinationAudit(actorId, "delete", id, destination, null);
    return { ok: true as const };
  }
}

async function logDestinationAudit(
  actorId: string,
  action: string,
  entityId: string,
  before: unknown,
  after: unknown
) {
  const { logAudit } = await import("@/lib/audit");
  await logAudit({
    actorId,
    action: `destination.${action}`,
    entityType: "Destination",
    entityId,
    before: before ?? undefined,
    after: after ?? undefined,
  });
}
