import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { VehicleService } from "@/lib/data-access/vehicles";
import { createVehicleSchema } from "@/lib/validation/vehicle";
import { ContentStatus } from "@/generated/prisma/client";

const statusQuerySchema = z.enum(ContentStatus).optional();

// GET /api/admin/vehicles — list, optional ?status= filter
export async function GET(request: NextRequest) {
  const { response } = await requirePermission(canManageCatalog);
  if (response) return response;

  const statusParam = statusQuerySchema.safeParse(
    request.nextUrl.searchParams.get("status") ?? undefined
  );
  if (!statusParam.success) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const vehicles = await VehicleService.findAll(statusParam.data ? { status: statusParam.data } : {});
  return NextResponse.json(vehicles);
}

// POST /api/admin/vehicles — create (always starts as DRAFT, RF-015)
export async function POST(request: NextRequest) {
  const { session, response } = await requirePermission(canManageCatalog);
  if (response) return response;

  try {
    const body = await request.json();
    const data = createVehicleSchema.parse(body);
    const vehicle = await VehicleService.create(data, session.user.id);
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }
    console.error("Error creating vehicle:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
