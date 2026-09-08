import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/require-permission";
import { canManagePayments } from "@/lib/permissions";
import { PaymentService } from "@/lib/data-access/payments";
import { PaymentStatus, PaymentMethod } from "@/generated/prisma/client";

const statusQuerySchema = z.enum(PaymentStatus).optional();
const methodQuerySchema = z.enum(PaymentMethod).optional();

// GET /api/admin/payments — every payment, filterable by status and/or method.
export async function GET(request: NextRequest) {
  const { response } = await requirePermission(canManagePayments);
  if (response) return response;

  const statusParam = statusQuerySchema.safeParse(request.nextUrl.searchParams.get("status") ?? undefined);
  const methodParam = methodQuerySchema.safeParse(request.nextUrl.searchParams.get("method") ?? undefined);
  if (!statusParam.success || !methodParam.success) {
    return NextResponse.json({ error: "Filtro inválido" }, { status: 400 });
  }

  const payments = await PaymentService.findAll({ status: statusParam.data, method: methodParam.data });
  return NextResponse.json(payments);
}
