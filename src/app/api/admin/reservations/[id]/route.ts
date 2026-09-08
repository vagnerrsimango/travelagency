import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/require-permission";
import { canManageReservations } from "@/lib/permissions";
import { ReservationService } from "@/lib/data-access/reservations";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/admin/reservations/[id]
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { response } = await requirePermission(canManageReservations);
  if (response) return response;

  const { id } = await params;
  const reservation = await ReservationService.findById(id);
  if (!reservation) return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 });
  return NextResponse.json(reservation);
}
