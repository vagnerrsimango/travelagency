import { requirePagePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";
import { HoteisClient } from "./hoteis-client";

export default async function HoteisPage() {
  await requirePagePermission(canManageCatalog);
  return <HoteisClient />;
}
