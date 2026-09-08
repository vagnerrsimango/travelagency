import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { DestinationService } from "@/lib/data-access/destinations";
import { updateDestinationSchema } from "@/lib/validation/destination";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/admin/destinations/[id]
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const { id } = await params;
  const destination = await DestinationService.findById(id);
  if (!destination) {
    return NextResponse.json({ error: "Destino não encontrado" }, { status: 404 });
  }

  return NextResponse.json(destination);
}

// PUT /api/admin/destinations/[id] — content edits, not status transitions
// (see [id]/status/route.ts for RF-015's draft→review→approved→published)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateDestinationSchema.parse(body);

    if (data.slug) {
      const existing = await DestinationService.findBySlug(data.slug);
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: "Já existe um destino com este slug" }, { status: 409 });
      }
    }

    const destination = await DestinationService.update(id, data, session.user.id);
    if (!destination) {
      return NextResponse.json({ error: "Destino não encontrado" }, { status: 404 });
    }

    return NextResponse.json(destination);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }
    console.error("Error updating destination:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE /api/admin/destinations/[id] — only ever deletes a DRAFT.
// Anything that's been through review/approval/publishing gets archived
// via the status endpoint instead — never hard-deleted.
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const { id } = await params;
  const result = await DestinationService.deleteDraft(id, session.user.id);

  if (!result.ok) {
    if (result.reason === "not_found") {
      return NextResponse.json({ error: "Destino não encontrado" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Só é possível eliminar rascunhos; arquive em vez de eliminar" },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true });
}
