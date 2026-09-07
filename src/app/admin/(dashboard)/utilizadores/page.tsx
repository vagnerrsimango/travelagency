import { requirePagePermission } from "@/lib/require-permission";
import { canManageUsers } from "@/lib/permissions";
import { ComingSoon } from "../coming-soon";

export default async function UtilizadoresPage() {
  await requirePagePermission(canManageUsers);

  return (
    <ComingSoon
      title="Utilizadores"
      phase={1}
      phaseLabel="Admin & Auth — follow-up, not yet built"
      description="Criar e editar contas de equipa (nome, email, papel, activo/inactivo). Por agora, a única forma de criar uma conta é `npm run admin:bootstrap` (só cria Administradores) — não há forma de adicionar um Agente de Reservas ou Financeiro sem isto."
    />
  );
}
