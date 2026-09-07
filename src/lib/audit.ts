import { prisma } from "@/lib/prisma";

type LogAuditInput = {
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  ipAddress?: string;
};

/**
 * Append-only audit trail (RF-016, NFR Auditoria). Every backoffice action
 * that changes state should call this — login/logout are wired in Phase 1;
 * catalog and reservation mutations get wired to it as those features are
 * built in Phases 2/3.
 *
 * Deliberately swallows its own errors: a failed audit write must never
 * block the action it's auditing.
 */
export async function logAudit(input: LogAuditInput) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        before: input.before === undefined ? undefined : (input.before as object),
        after: input.after === undefined ? undefined : (input.after as object),
        ipAddress: input.ipAddress,
      },
    });
  } catch (error) {
    console.error("[audit] failed to write audit log", { input, error });
  }
}
