import { requirePagePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { ServicosClient } from "./servicos-client";

export default async function ServicosPage() {
  await requirePagePermission(canManageCatalog);
  return <ServicosClient />;
}
