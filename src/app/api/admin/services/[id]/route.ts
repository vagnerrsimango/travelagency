import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { ServiceService } from "@/lib/data-access/services";
import { updateServiceSchema } from "@/lib/validation/service";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/admin/services/[id]
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const { id } = await params;
  const service = await ServiceService.findById(id);
  if (!service) return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
  return NextResponse.json(service);
}

// PUT /api/admin/services/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateServiceSchema.parse(body);

    if (data.key) {
      const existing = await ServiceService.findByKey(data.key);
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: "Já existe um serviço com esta chave" }, { status: 409 });
      }
    }

    const service = await ServiceService.update(id, data, session.user.id);
    if (!service) return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
    return NextResponse.json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }
    console.error("Error updating service:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE /api/admin/services/[id] — only ever deletes a DRAFT.
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const { id } = await params;
  const result = await ServiceService.deleteDraft(id, session.user.id);

  if (!result.ok) {
    if (result.reason === "not_found") {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Só é possível eliminar rascunhos — arquive em vez de eliminar" },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true });
}
