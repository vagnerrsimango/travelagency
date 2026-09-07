import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { PackageService } from "@/lib/data-access/packages";
import { updateStatusSchema } from "@/lib/validation/package";

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/admin/packages/[id]/status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = updateStatusSchema.parse(body);
    const pkg = await PackageService.updateStatus(id, status, session.user.id);
    if (!pkg) return NextResponse.json({ error: "Pacote não encontrado" }, { status: 404 });
    return NextResponse.json(pkg);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Estado inválido", details: error.issues }, { status: 400 });
    }
    console.error("Error updating package status:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
