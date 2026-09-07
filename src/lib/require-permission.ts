import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { AdminRoleValue } from "@/lib/permissions";

/**
 * Server-side session + permission check for use inside a Server Action or
 * Route Handler. Returns the session on success, or a 401/403 NextResponse
 * to return directly. Always call this even on routes proxy.ts already
 * gates — proxy matchers don't cover Server Actions (see proxy.ts comment).
 *
 * Deliberately separate from lib/permissions.ts: this file pulls in
 * next-auth's server session (and, through authOptions, Prisma + bcryptjs).
 * proxy.ts must never import this file — see permissions.ts's header.
 */
export async function requirePermission(
  check: (role: AdminRoleValue | undefined | null) => boolean
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      session: null,
      response: NextResponse.json({ error: "Authentication required" }, { status: 401 }),
    } as const;
  }

  if (!check(session.user.role)) {
    return {
      session: null,
      response: NextResponse.json({ error: "Insufficient permissions" }, { status: 403 }),
    } as const;
  }

  return { session, response: null } as const;
}

/**
 * Same idea as requirePermission, for a Server Component page instead of a
 * route handler. The (dashboard) layout only checks "is anyone logged in"
 * and filters the *nav display* by role — it does not stop a logged-in
 * user with the wrong role from directly navigating to a URL the nav
 * hides from them. Every page under a specific role's section must call
 * this itself. Redirects rather than 401/403-ing, since this is a page.
 */
export async function requirePagePermission(
  check: (role: AdminRoleValue | undefined | null) => boolean
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (!check(session.user.role)) {
    redirect("/admin");
  }

  return session;
}
