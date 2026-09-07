import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { DestinationService } from "@/lib/data-access/destinations";
import { updateStatusSchema } from "@/lib/validation/destination";

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/admin/destinations/[id]/status — RF-015's
// draft → review → approved → published → archived workflow.
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = updateStatusSchema.parse(body);

    const destination = await DestinationService.updateStatus(id, status, session.user.id);
    if (!destination) {
      return NextResponse.json({ error: "Destino não encontrado" }, { status: 404 });
    }

    return NextResponse.json(destination);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Estado inválido", details: error.issues }, { status: 400 });
    }
    console.error("Error updating destination status:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
