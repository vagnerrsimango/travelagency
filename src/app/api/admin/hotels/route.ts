import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { HotelService } from "@/lib/data-access/hotels";
import { createHotelSchema } from "@/lib/validation/hotel";
import { ContentStatus } from "@/generated/prisma/client";

const statusQuerySchema = z.enum(ContentStatus).optional();

// GET /api/admin/hotels — list, optional ?status= filter
export async function GET(request: NextRequest) {
  const { response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const statusParam = statusQuerySchema.safeParse(
    request.nextUrl.searchParams.get("status") ?? undefined
  );
  if (!statusParam.success) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const hotels = await HotelService.findAll(statusParam.data ? { status: statusParam.data } : {});
  return NextResponse.json(hotels);
}

// POST /api/admin/hotels — create (always starts as DRAFT, RF-015)
export async function POST(request: NextRequest) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const body = await request.json();
    const data = createHotelSchema.parse(body);

    const existing = await HotelService.findBySlug(data.slug);
    if (existing) {
      return NextResponse.json({ error: "Já existe um hotel com este slug" }, { status: 409 });
    }

    const hotel = await HotelService.create(data, session.user.id);
    return NextResponse.json(hotel, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }
    console.error("Error creating hotel:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
