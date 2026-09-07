import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Painel</h1>
      <p className="text-slate-500 mt-1">
        Bem-vindo(a), {session?.user.name}. O catálogo, reservas e pagamentos ficam disponíveis
        aqui à medida que cada fase avança — ver <code>ROADMAP.md</code>.
      </p>
    </div>
  );
}
