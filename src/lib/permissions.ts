// Pure role-check functions — deliberately zero dependencies (no Prisma,
// no next-auth server code). proxy.ts imports hasBackofficeAccess from
// here, and proxy.ts runs on every matched request, so this file must
// never transitively pull in the Prisma client or anything DB-connected.
// (An earlier version imported the generated Prisma enum at runtime here,
// which dragged the whole Prisma client + pg driver into the proxy bundle
// — wrong regardless of whether it was also what crashed the build.)
//
// The session-checking helper that DOES need Prisma/next-auth server code
// lives in require-permission.ts instead, imported only by route handlers
// and Server Actions, never by proxy.ts.

export type AdminRoleValue =
  | "ADMINISTRATOR"
  | "CATALOG_MANAGER"
  | "BOOKING_AGENT"
  | "FINANCE"
  | "READ_ONLY";

const ALL_ROLES: readonly AdminRoleValue[] = [
  "ADMINISTRATOR",
  "CATALOG_MANAGER",
  "BOOKING_AGENT",
  "FINANCE",
  "READ_ONLY",
];

// Permission matrix from the BRD §9.1 role table. Kept as small named
// checks (not a generic "has permission X" string map) so each phase that
// adds a real feature can see exactly which roles it needs to check
// against, rather than inventing a permission key ad hoc.

export function hasBackofficeAccess(role: AdminRoleValue | undefined | null): boolean {
  return !!role && ALL_ROLES.includes(role);
}

export function canManageUsers(role: AdminRoleValue | undefined | null): boolean {
  return role === "ADMINISTRATOR";
}

export function canManageCatalog(role: AdminRoleValue | undefined | null): boolean {
  return role === "ADMINISTRATOR" || role === "CATALOG_MANAGER";
}

export function canManageReservations(role: AdminRoleValue | undefined | null): boolean {
  return role === "ADMINISTRATOR" || role === "BOOKING_AGENT";
}

export function canManagePayments(role: AdminRoleValue | undefined | null): boolean {
  return role === "ADMINISTRATOR" || role === "FINANCE";
}

export function canManageFaq(role: AdminRoleValue | undefined | null): boolean {
  // FAQ content management sits with whoever owns published content —
  // same as the catalog (BRD §9 groups "Conteúdo/FAQ" as its own module
  // but doesn't assign it a distinct role in §9.1's table).
  return canManageCatalog(role);
}

// Every role can see the dashboard/reports — that's the entire point of
// the Leitura/Executivo role (BRD: "Painel e relatórios sem alteração").
export function canViewReports(role: AdminRoleValue | undefined | null): boolean {
  return hasBackofficeAccess(role);
}
