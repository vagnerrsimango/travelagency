import { redirect } from "next/navigation";
import { requirePagePermission } from "@/lib/require-permission";
import { canManageCatalog } from "@/lib/permissions";

export default async function CatalogoIndexPage() {
  await requirePagePermission(canManageCatalog);
  redirect("/admin/catalogo/destinos");
}
