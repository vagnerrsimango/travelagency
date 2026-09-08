import { requirePagePermission } from "@/lib/require-permission";
import { canManageReservations } from "@/lib/permissions";
import { ReservasClient } from "./reservas-client";

export default async function ReservasPage() {
  await requirePagePermission(canManageReservations);
  return <ReservasClient />;
}
