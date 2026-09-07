import { requirePagePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { ViaturasClient } from "./viaturas-client";

export default async function ViaturasPage() {
  await requirePagePermission(canManageCatalog);
  return <ViaturasClient />;
}
