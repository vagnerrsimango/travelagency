import { requirePagePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { DestinosClient } from "./destinos-client";

// Server-side gate — the sidebar only hides this link from the wrong role,
// it doesn't stop direct navigation. This is the real check (see
// require-permission.ts). The interactive list/form lives in the client
// component since it needs useState/fetch.
export default async function DestinosPage() {
  await requirePagePermission(canManageCatalog);
  return <DestinosClient />;
}
