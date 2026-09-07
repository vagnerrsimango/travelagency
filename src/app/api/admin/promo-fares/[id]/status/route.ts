import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { PromoFareService } from "@/lib/data-access/promo-fares";
import { updateStatusSchema } from "@/lib/validation/promo-fare";

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/admin/promo-fares/[id]/status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = updateStatusSchema.parse(body);
    const fare = await PromoFareService.updateStatus(id, status, session.user.id);
    if (!fare) return NextResponse.json({ error: "Oferta não encontrada" }, { status: 404 });
    return NextResponse.json(fare);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Estado inválido", details: error.issues }, { status: 400 });
    }
    console.error("Error updating promo fare status:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
