type ComingSoonProps = {
  title: string;
  phase: number;
  phaseLabel: string;
  description: string;
};

// Placeholder for every backoffice section whose real screens don't exist
// yet. Exists so the nav never points at a bare 404 — see ROADMAP.md for
// what each phase actually builds here.
export function ComingSoon({ title, phase, phaseLabel, description }: ComingSoonProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-8 max-w-xl">
        <p className="text-sm font-medium text-orange-600">Fase {phase} — {phaseLabel}</p>
        <p className="text-slate-600 mt-2 text-sm leading-relaxed">{description}</p>
        <p className="text-slate-400 mt-4 text-xs">Ver ROADMAP.md para o plano completo.</p>
      </div>
    </div>
  );
}
