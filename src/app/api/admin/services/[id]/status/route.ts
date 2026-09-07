import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { ServiceService } from "@/lib/data-access/services";
import { updateStatusSchema } from "@/lib/validation/service";

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/admin/services/[id]/status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = updateStatusSchema.parse(body);
    const service = await ServiceService.updateStatus(id, status, session.user.id);
    if (!service) return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
    return NextResponse.json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Estado inválido", details: error.issues }, { status: 400 });
    }
    console.error("Error updating service status:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
