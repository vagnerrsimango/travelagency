import { requirePagePermission } from "@/lib/require-permission";
import { canManageUsers } from "@/lib/permissions";
import { UtilizadoresClient } from "./utilizadores-client";

export default async function UtilizadoresPage() {
  const session = await requirePagePermission(canManageUsers);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">Utilizadores</h1>
      <p className="text-slate-500 text-sm mb-6">Contas de equipa do backoffice: criação, papéis e acesso.</p>
      <UtilizadoresClient currentUserId={session.user.id} />
    </div>
  );
}
