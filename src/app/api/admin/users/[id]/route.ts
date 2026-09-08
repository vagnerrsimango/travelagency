import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageUsers } from "@/lib/permissions";
import { AdminUserService } from "@/lib/data-access/admin-users";
import { updateAdminUserSchema } from "@/lib/validation/admin-user";

type RouteParams = { params: Promise<{ id: string }> };

const ERROR_MESSAGE: Record<string, string> = {
  not_found: "Conta não encontrada",
  last_admin: "Esta é a última conta de Administrador ativa; não é possível desativá-la ou mudar o seu papel",
};

// PUT /api/admin/users/[id] — edit name/role/active status. Password
// changes go through the sibling reset-password route instead, so this
// body never carries a plaintext password.
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageUsers);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateAdminUserSchema.parse(body);

    const result = await AdminUserService.update(id, data, session.user.id);
    if (!result.ok) {
      const status = result.reason === "not_found" ? 404 : 409;
      return NextResponse.json({ error: ERROR_MESSAGE[result.reason] }, { status });
    }

    return NextResponse.json(result.user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }
    console.error("Error updating admin user:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
