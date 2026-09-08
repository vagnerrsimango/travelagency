import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManagePayments } from "@/lib/permissions";
import { PaymentService } from "@/lib/data-access/payments";
import { updatePaymentStatusSchema } from "@/lib/validation/payment";

type RouteParams = { params: Promise<{ id: string }> };

// PATCH /api/admin/payments/[id]/status — manual override, used while
// Payen isn't wired and afterwards for anything a webhook doesn't cover.
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { session, response } = await requirePermission(canManagePayments);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = updatePaymentStatusSchema.parse(body);

    const payment = await PaymentService.updateStatus(id, status, session.user.id);
    if (!payment) return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 });
    return NextResponse.json(payment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Estado inválido", details: error.issues }, { status: 400 });
    }
    console.error("Error updating payment status:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
