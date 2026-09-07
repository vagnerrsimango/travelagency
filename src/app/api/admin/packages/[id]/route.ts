import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { PackageService } from "@/lib/data-access/packages";
import { updatePackageSchema } from "@/lib/validation/package";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/admin/packages/[id]
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const { id } = await params;
  const pkg = await PackageService.findById(id);
  if (!pkg) return NextResponse.json({ error: "Pacote não encontrado" }, { status: 404 });
  return NextResponse.json(pkg);
}

// PUT /api/admin/packages/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const data = updatePackageSchema.parse(body);

    if (data.slug) {
      const existing = await PackageService.findBySlug(data.slug);
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: "Já existe um pacote com este slug" }, { status: 409 });
      }
    }

    const pkg = await PackageService.update(id, data, session.user.id);
    if (!pkg) return NextResponse.json({ error: "Pacote não encontrado" }, { status: 404 });
    return NextResponse.json(pkg);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }
    console.error("Error updating package:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE /api/admin/packages/[id] — only ever deletes a DRAFT.
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const { id } = await params;
  const result = await PackageService.deleteDraft(id, session.user.id);

  if (!result.ok) {
    if (result.reason === "not_found") {
      return NextResponse.json({ error: "Pacote não encontrado" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Só é possível eliminar rascunhos — arquive em vez de eliminar" },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true });
}
