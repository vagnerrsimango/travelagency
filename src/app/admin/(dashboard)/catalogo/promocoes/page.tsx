import { requirePagePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { PromocoesClient } from "./promocoes-client";

export default async function PromocoesPage() {
  await requirePagePermission(canManageCatalog);
  return <PromocoesClient />;
}
