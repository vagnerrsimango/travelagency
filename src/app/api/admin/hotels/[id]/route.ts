import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { HotelService } from "@/lib/data-access/hotels";
import { updateHotelSchema } from "@/lib/validation/hotel";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/admin/hotels/[id]
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const { id } = await params;
  const hotel = await HotelService.findById(id);
  if (!hotel) return NextResponse.json({ error: "Hotel não encontrado" }, { status: 404 });
  return NextResponse.json(hotel);
}

// PUT /api/admin/hotels/[id] — content edits, not status transitions
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateHotelSchema.parse(body);

    if (data.slug) {
      const existing = await HotelService.findBySlug(data.slug);
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: "Já existe um hotel com este slug" }, { status: 409 });
      }
    }

    const hotel = await HotelService.update(id, data, session.user.id);
    if (!hotel) return NextResponse.json({ error: "Hotel não encontrado" }, { status: 404 });
    return NextResponse.json(hotel);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }
    console.error("Error updating hotel:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE /api/admin/hotels/[id] — only ever deletes a DRAFT.
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const { id } = await params;
  const result = await HotelService.deleteDraft(id, session.user.id);

  if (!result.ok) {
    if (result.reason === "not_found") {
      return NextResponse.json({ error: "Hotel não encontrado" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Só é possível eliminar rascunhos; arquive em vez de eliminar" },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true });
}
