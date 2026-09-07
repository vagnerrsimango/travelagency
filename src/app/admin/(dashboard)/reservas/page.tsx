import { requirePagePermission } from "@/lib/require-permission";
import { canManageReservations } from "@/lib/permissions";
import { ComingSoon } from "../coming-soon";

export default async function ReservasPage() {
  await requirePagePermission(canManageReservations);

  return (
    <ComingSoon
      title="Reservas"
      phase={3}
      phaseLabel="Reservations"
      description="Fila de pedidos, cotações, mudança de estado (Recebido → Confirmado), notas do agente. O formulário de reserva do site público ainda não submete para nenhum lado — é o que esta fase liga."
    />
  );
}
