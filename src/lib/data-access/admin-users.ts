import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import type { AdminRole } from "@/generated/prisma/client";

// Never select passwordHash into anything that leaves this file — every
// read below is scoped to exactly these fields (same discipline as the
// SAFE_ADMIN_SELECT pattern in reservations/payments data-access).
const SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
} as const;

export type CreateAdminUserInput = { name: string; email: string; password: string; role: AdminRole };
export type UpdateAdminUserInput = Partial<{ name: string; role: AdminRole; isActive: boolean }>;

export class AdminUserService {
  static async findAll() {
    return prisma.adminUser.findMany({ select: SAFE_SELECT, orderBy: { createdAt: "asc" } });
  }

  static async findById(id: string) {
    return prisma.adminUser.findUnique({ where: { id }, select: SAFE_SELECT });
  }

  static async create(data: CreateAdminUserInput, actorId: string) {
    const existing = await prisma.adminUser.findUnique({ where: { email: data.email } });
    if (existing) return { ok: false as const, reason: "email_taken" as const };

    const passwordHash = await hash(data.password, 12);
    const user = await prisma.adminUser.create({
      data: { name: data.name, email: data.email, passwordHash, role: data.role },
      select: SAFE_SELECT,
    });

    await logAudit({ actorId, action: "adminUser.create", entityType: "AdminUser", entityId: user.id, after: user });
    return { ok: true as const, user };
  }

  // A demotion away from ADMINISTRATOR or a deactivation is blocked when it
  // would leave the system with zero active Administrators — that's a
  // self-inflicted lockout (no self-service sign-up, see bootstrap-admin.ts)
  // rather than a normal role-management action.
  static async update(id: string, data: UpdateAdminUserInput, actorId: string) {
    const before = await prisma.adminUser.findUnique({ where: { id } });
    if (!before) return { ok: false as const, reason: "not_found" as const };

    const losesAdminStatus =
      before.role === "ADMINISTRATOR" &&
      before.isActive &&
      ((data.role !== undefined && data.role !== "ADMINISTRATOR") || data.isActive === false);

    if (losesAdminStatus) {
      const activeAdmins = await prisma.adminUser.count({ where: { role: "ADMINISTRATOR", isActive: true } });
      if (activeAdmins <= 1) return { ok: false as const, reason: "last_admin" as const };
    }

    const after = await prisma.adminUser.update({ where: { id }, data, select: SAFE_SELECT });
    // Log the safe view of "before", never the raw row — it carries passwordHash.
    const safeBefore = {
      id: before.id,
      name: before.name,
      email: before.email,
      role: before.role,
      isActive: before.isActive,
      lastLoginAt: before.lastLoginAt,
      createdAt: before.createdAt,
    };
    await logAudit({ actorId, action: "adminUser.update", entityType: "AdminUser", entityId: id, before: safeBefore, after });
    return { ok: true as const, user: after };
  }

  static async resetPassword(id: string, newPassword: string, actorId: string) {
    const before = await prisma.adminUser.findUnique({ where: { id } });
    if (!before) return { ok: false as const, reason: "not_found" as const };

    const passwordHash = await hash(newPassword, 12);
    await prisma.adminUser.update({ where: { id }, data: { passwordHash } });
    await logAudit({ actorId, action: "adminUser.reset_password", entityType: "AdminUser", entityId: id });
    return { ok: true as const };
  }
}
