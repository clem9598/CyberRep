import Link from "next/link";
import type { ActionPlanItem } from "@/components/dashboard/types";

type ActionPlanBlockProps = {
  href: string;
  items: ActionPlanItem[];
  isLoading?: boolean;
};

const priorityStyles: Record<ActionPlanItem["priority"], string> = {
  Haute: "border-rose-300/40 bg-rose-300/10 text-rose-100",
  Moyenne: "border-amber-300/40 bg-amber-300/10 text-amber-100",
  Faible: "border-emerald-300/40 bg-emerald-300/10 text-emerald-100",
};

export function ActionPlanBlock({ href, items, isLoading = false }: ActionPlanBlockProps) {
  if (isLoading) {
    return (
      <section className="glass-panel premium-panel rounded-2xl p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-44 rounded bg-white/10" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-16 rounded bg-white/10" />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="glass-panel premium-panel appear-up appear-delay-3 rounded-2xl p-5">
        <h2 className="text-xl font-semibold text-white">Plan d&apos;actions</h2>
        <p className="mt-3 text-sm text-slate-300">Aucune action prioritaire pour le moment.</p>
        <Link
          href={href}
          className="chip-lift mt-4 inline-flex rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/40 hover:bg-white/10"
        >
          Voir le plan complet
        </Link>
      </section>
    );
  }

  return (
    <section className="glass-panel premium-panel appear-up appear-delay-3 rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-white">Plan d&apos;actions</h2>
        <Link
          href={href}
          className="chip-lift rounded-lg border border-cyan-300/35 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
        >
          Voir le plan complet
        </Link>
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="chip-lift appear-up rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3"
            style={{ animationDelay: `${120 + index * 80}ms` }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[item.priority]}`}
              >
                {item.priority}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            <p className="mt-2 text-xs text-slate-400">Temps estime: {item.eta}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
