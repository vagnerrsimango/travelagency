import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { PackageService } from "@/lib/data-access/packages";
import { createPackageSchema } from "@/lib/validation/package";
import { ContentStatus } from "@/generated/prisma/client";

const statusQuerySchema = z.enum(ContentStatus).optional();

// GET /api/admin/packages — list, optional ?status= filter
export async function GET(request: NextRequest) {
  const { response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const statusParam = statusQuerySchema.safeParse(
    request.nextUrl.searchParams.get("status") ?? undefined
  );
  if (!statusParam.success) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const packages = await PackageService.findAll(statusParam.data ? { status: statusParam.data } : {});
  return NextResponse.json(packages);
}

// POST /api/admin/packages — create (always starts as DRAFT, RF-015)
export async function POST(request: NextRequest) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const body = await request.json();
    const data = createPackageSchema.parse(body);

    const existing = await PackageService.findBySlug(data.slug);
    if (existing) {
      return NextResponse.json({ error: "Já existe um pacote com este slug" }, { status: 409 });
    }

    const pkg = await PackageService.create(data, session.user.id);
    return NextResponse.json(pkg, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }
    console.error("Error creating package:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
