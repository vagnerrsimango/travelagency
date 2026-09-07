import { requirePagePermission } from "@/lib/require-permission";
import { canManagePayments } from "@/lib/permissions";
import { ComingSoon } from "../coming-soon";

export default async function PagamentosPage() {
  await requirePagePermission(canManagePayments);

  return (
    <ComingSoon
      title="Pagamentos"
      phase={6}
      phaseLabel="Payments"
      description="Integração Payen (M-Pesa/e-Mola), reconciliação, divergências. Deixada para o fim de propósito — depende de acesso ao sandbox da Payen, a dependência externa mais lenta do plano."
    />
  );
}
