import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageUsers } from "@/lib/permissions";
import { AdminUserService } from "@/lib/data-access/admin-users";
import { createAdminUserSchema } from "@/lib/validation/admin-user";

// GET /api/admin/users — list every staff account (Administrator-only,
// same as every write below: BRD §9.1 gives account management to
// Administrators exclusively).
export async function GET() {
  const { response } = await requirePermission(canManageUsers);
  if (response) return response;

  const users = await AdminUserService.findAll();
  return NextResponse.json(users);
}

// POST /api/admin/users — create a staff account. Until now the only way
// to add one was `npm run admin:bootstrap`, which only ever creates
// Administrators — this is the first way to add a Booking Agent/Finance/
// Catalog Manager/Read Only account without touching the database directly.
export async function POST(request: NextRequest) {
  const { session, response } = await requirePermission(canManageUsers);
  if (response) return response;

  try {
    const body = await request.json();
    const data = createAdminUserSchema.parse(body);

    const result = await AdminUserService.create(data, session.user.id);
    if (!result.ok) {
      return NextResponse.json({ error: "Já existe uma conta com este email" }, { status: 409 });
    }

    return NextResponse.json(result.user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }
    console.error("Error creating admin user:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
