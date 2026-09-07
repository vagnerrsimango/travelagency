import { requirePagePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { PacotesClient } from "./pacotes-client";

export default async function PacotesPage() {
  await requirePagePermission(canManageCatalog);
  return <PacotesClient />;
}
