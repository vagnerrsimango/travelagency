import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { PromoFareService } from "@/lib/data-access/promo-fares";
import { createPromoFareSchema } from "@/lib/validation/promo-fare";
import { ContentStatus } from "@/generated/prisma/client";

const statusQuerySchema = z.enum(ContentStatus).optional();

// GET /api/admin/promo-fares — list, optional ?status= filter (filters on
// the underlying FlightOffer's content-workflow status).
export async function GET(request: NextRequest) {
  const { response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const statusParam = statusQuerySchema.safeParse(
    request.nextUrl.searchParams.get("status") ?? undefined
  );
  if (!statusParam.success) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const fares = await PromoFareService.findAll(statusParam.data ? { status: statusParam.data } : {});
  return NextResponse.json(fares);
}

// POST /api/admin/promo-fares — creates a FlightOffer + PromoOffer pair
// together (always starts as DRAFT, RF-015).
export async function POST(request: NextRequest) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const body = await request.json();
    const data = createPromoFareSchema.parse(body);
    const fare = await PromoFareService.create(data, session.user.id);
    return NextResponse.json(fare, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }
    console.error("Error creating promo fare:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
