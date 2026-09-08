import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/require-permission";
import { canManagePayments } from "@/lib/permissions";
import { PaymentService } from "@/lib/data-access/payments";

// GET /api/admin/payments/summary — the dashboard's headline numbers.
export async function GET() {
  const { response } = await requirePermission(canManagePayments);
  if (response) return response;

  return NextResponse.json(await PaymentService.summary());
}
