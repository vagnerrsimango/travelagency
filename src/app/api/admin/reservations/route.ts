import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageReservations } from "@/lib/permissions";
import { ReservationService } from "@/lib/data-access/reservations";
import { ReservationStatus, ReservationServiceType } from "@/generated/prisma/client";

const statusQuerySchema = z.enum(ReservationStatus).optional();
const serviceTypeQuerySchema = z.enum(ReservationServiceType).optional();

// GET /api/admin/reservations — list, filterable by status and/or service type.
export async function GET(request: NextRequest) {
  const { response } = await requirePermission(canManageReservations);
  if (response) return response;

  const statusParam = statusQuerySchema.safeParse(request.nextUrl.searchParams.get("status") ?? undefined);
  const serviceTypeParam = serviceTypeQuerySchema.safeParse(request.nextUrl.searchParams.get("serviceType") ?? undefined);
  if (!statusParam.success || !serviceTypeParam.success) {
    return NextResponse.json({ error: "Filtro inválido" }, { status: 400 });
  }

  const reservations = await ReservationService.findAll({
    status: statusParam.data,
    serviceType: serviceTypeParam.data,
  });

  return NextResponse.json(reservations);
}
