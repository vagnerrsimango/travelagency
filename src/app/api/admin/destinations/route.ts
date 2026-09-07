import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { DestinationService } from "@/lib/data-access/destinations";
import { createDestinationSchema } from "@/lib/validation/destination";
import { ContentStatus } from "@/generated/prisma/client";

const statusQuerySchema = z.enum(ContentStatus).optional();

// GET /api/admin/destinations — list, optional ?status= filter
export async function GET(request: NextRequest) {
  const { response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const statusParam = statusQuerySchema.safeParse(
    request.nextUrl.searchParams.get("status") ?? undefined
  );
  if (!statusParam.success) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const destinations = await DestinationService.findAll(
    statusParam.data ? { status: statusParam.data } : {}
  );

  return NextResponse.json(destinations);
}

// POST /api/admin/destinations — create (always starts as DRAFT, RF-015)
export async function POST(request: NextRequest) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const body = await request.json();
    const data = createDestinationSchema.parse(body);

    const existing = await DestinationService.findBySlug(data.slug);
    if (existing) {
      return NextResponse.json({ error: "Já existe um destino com este slug" }, { status: 409 });
    }

    const destination = await DestinationService.create(data, session.user.id);
    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }
    console.error("Error creating destination:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
