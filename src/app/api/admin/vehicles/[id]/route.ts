import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { VehicleService } from "@/lib/data-access/vehicles";
import { updateVehicleSchema } from "@/lib/validation/vehicle";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/admin/vehicles/[id]
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const { id } = await params;
  const vehicle = await VehicleService.findById(id);
  if (!vehicle) return NextResponse.json({ error: "Viatura não encontrada" }, { status: 404 });
  return NextResponse.json(vehicle);
}

// PUT /api/admin/vehicles/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateVehicleSchema.parse(body);
    const vehicle = await VehicleService.update(id, data, session.user.id);
    if (!vehicle) return NextResponse.json({ error: "Viatura não encontrada" }, { status: 404 });
    return NextResponse.json(vehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }
    console.error("Error updating vehicle:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE /api/admin/vehicles/[id] — only ever deletes a DRAFT.
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const { id } = await params;
  const result = await VehicleService.deleteDraft(id, session.user.id);

  if (!result.ok) {
    if (result.reason === "not_found") {
      return NextResponse.json({ error: "Viatura não encontrada" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Só é possível eliminar rascunhos — arquive em vez de eliminar" },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true });
}
