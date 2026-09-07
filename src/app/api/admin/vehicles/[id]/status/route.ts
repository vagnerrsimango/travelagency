import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { VehicleService } from "@/lib/data-access/vehicles";
import { updateStatusSchema } from "@/lib/validation/vehicle";

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/admin/vehicles/[id]/status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = updateStatusSchema.parse(body);
    const vehicle = await VehicleService.updateStatus(id, status, session.user.id);
    if (!vehicle) return NextResponse.json({ error: "Viatura não encontrada" }, { status: 404 });
    return NextResponse.json(vehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Estado inválido", details: error.issues }, { status: 400 });
    }
    console.error("Error updating vehicle status:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
