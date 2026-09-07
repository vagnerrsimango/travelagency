import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { HotelService } from "@/lib/data-access/hotels";
import { updateStatusSchema } from "@/lib/validation/hotel";

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/admin/hotels/[id]/status — RF-015's
// draft → review → approved → published → archived workflow.
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = updateStatusSchema.parse(body);

    const hotel = await HotelService.updateStatus(id, status, session.user.id);
    if (!hotel) return NextResponse.json({ error: "Hotel não encontrado" }, { status: 404 });
    return NextResponse.json(hotel);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Estado inválido", details: error.issues }, { status: 400 });
    }
    console.error("Error updating hotel status:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
