import { requirePagePermission } from "@/lib/require-permission";
import { canManageFaq } from "@/lib/permissions";
import { ComingSoon } from "../coming-soon";

export default async function FaqPage() {
  await requirePagePermission(canManageFaq);

  return (
    <ComingSoon
      title="FAQ"
      phase={5}
      phaseLabel="FAQ bot"
      description="Perguntas e respostas PT/EN para o bot do site, categorias, e o registo de perguntas sem resposta para revisão."
    />
  );
}
