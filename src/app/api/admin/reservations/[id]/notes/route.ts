import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManageReservations } from "@/lib/permissions";
import { ReservationService } from "@/lib/data-access/reservations";
import { addNoteSchema } from "@/lib/validation/reservation-admin";

type RouteParams = { params: Promise<{ id: string }> };

// POST /api/admin/reservations/[id]/notes — RF-025 internal agent annotations.
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManageReservations);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const { body: noteBody } = addNoteSchema.parse(body);

    const note = await ReservationService.addNote(id, session.user.id, noteBody);
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.issues }, { status: 400 });
    }
    console.error("Error adding reservation note:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
