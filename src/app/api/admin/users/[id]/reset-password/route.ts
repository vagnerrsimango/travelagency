import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageUsers } from "@/lib/permissions";
import { AdminUserService } from "@/lib/data-access/admin-users";
import { resetAdminPasswordSchema } from "@/lib/validation/admin-user";

type RouteParams = { params: Promise<{ id: string }> };

// POST /api/admin/users/[id]/reset-password — Administrator sets a new
// password for a staff account directly (there's no self-service "forgot
// password" flow, no email sending required here). Separate route from
// PUT so a plaintext password never has to travel alongside a routine
// name/role edit.
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageUsers);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const { password } = resetAdminPasswordSchema.parse(body);

    const result = await AdminUserService.resetPassword(id, password, session.user.id);
    if (!result.ok) {
      return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }
    console.error("Error resetting admin password:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
