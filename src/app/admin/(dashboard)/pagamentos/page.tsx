import { requirePagePermission } from "@/lib/require-permission";
import { canManagePayments } from "@/lib/permissions";
import { PagamentosClient } from "./pagamentos-client";

export default async function PagamentosPage() {
  await requirePagePermission(canManagePayments);
  return <PagamentosClient />;
}
