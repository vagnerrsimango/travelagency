import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { ServiceService } from "@/lib/data-access/services";
import { createServiceSchema } from "@/lib/validation/service";
import { ContentStatus } from "@/generated/prisma/client";

const statusQuerySchema = z.enum(ContentStatus).optional();

// GET /api/admin/services — list, optional ?status= filter
export async function GET(request: NextRequest) {
  const { response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const statusParam = statusQuerySchema.safeParse(
    request.nextUrl.searchParams.get("status") ?? undefined
  );
  if (!statusParam.success) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const services = await ServiceService.findAll(statusParam.data ? { status: statusParam.data } : {});
  return NextResponse.json(services);
}

// POST /api/admin/services — create (always starts as DRAFT, RF-015)
export async function POST(request: NextRequest) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const body = await request.json();
    const data = createServiceSchema.parse(body);

    const existing = await ServiceService.findByKey(data.key);
    if (existing) {
      return NextResponse.json({ error: "Já existe um serviço com esta chave" }, { status: 409 });
    }

    const service = await ServiceService.create(data, session.user.id);
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }
    console.error("Error creating service:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
