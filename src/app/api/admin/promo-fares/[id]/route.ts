import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { PromoFareService } from "@/lib/data-access/promo-fares";
import { updatePromoFareSchema } from "@/lib/validation/promo-fare";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/admin/promo-fares/[id]
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const { id } = await params;
  const fare = await PromoFareService.findById(id);
  if (!fare) return NextResponse.json({ error: "Oferta não encontrada" }, { status: 404 });
  return NextResponse.json(fare);
}

// PUT /api/admin/promo-fares/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const data = updatePromoFareSchema.parse(body);
    const fare = await PromoFareService.update(id, data, session.user.id);
    if (!fare) return NextResponse.json({ error: "Oferta não encontrada" }, { status: 404 });
    return NextResponse.json(fare);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }
    console.error("Error updating promo fare:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE /api/admin/promo-fares/[id] — only ever deletes a DRAFT.
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const { id } = await params;
  const result = await PromoFareService.deleteDraft(id, session.user.id);

  if (!result.ok) {
    if (result.reason === "not_found") {
      return NextResponse.json({ error: "Oferta não encontrada" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Só é possível eliminar rascunhos — arquive em vez de eliminar" },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true });
}
