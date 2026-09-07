import type { ReactNode } from "react";

const tabs = [
  { href: "/admin/catalogo/destinos", label: "Destinos" },
  { href: "/admin/catalogo/hoteis", label: "Hotéis" },
  { href: "/admin/catalogo/viaturas", label: "Viaturas" },
  { href: "/admin/catalogo/pacotes", label: "Pacotes" },
  { href: "/admin/catalogo/servicos", label: "Serviços" },
  { href: "/admin/catalogo/promocoes", label: "Promoções" },
];

// BRD §9 treats each of these as its own backoffice module (RF-010..014),
// not one blob — this tab strip is the admin-side reflection of that.
export default function CatalogoLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-4">Catálogo</h1>
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {tabs.map((tab) => (
          <a
            key={tab.href}
            href={tab.href}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-t-lg transition-colors"
          >
            {tab.label}
          </a>
        ))}
      </div>
      {children}
    </div>
  );
}
