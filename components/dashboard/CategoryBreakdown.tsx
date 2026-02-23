import Link from "next/link";
import type { CategoryBreakdownItem } from "@/components/dashboard/types";

type CategoryBreakdownProps = {
  items: CategoryBreakdownItem[];
  isLoading?: boolean;
};

export function CategoryBreakdown({ items, isLoading = false }: CategoryBreakdownProps) {
  if (isLoading) {
    return (
      <section className="glass-panel premium-panel rounded-2xl p-5">
        <h2 className="text-xl font-semibold text-white">Repartition par categorie</h2>
        <div className="mt-4 space-y-3 animate-pulse">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
              <div className="h-4 w-40 rounded bg-white/10" />
              <div className="mt-2 h-2 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="glass-panel premium-panel appear-up rounded-2xl p-5" style={{ animationDelay: "280ms" }}>
      <h2 className="text-xl font-semibold text-white">Repartition par categorie</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={item.key}>
            <Link
              href={item.href}
              className="chip-lift appear-up block rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 transition hover:border-cyan-300/35 hover:bg-white/[0.07]"
              style={{ animationDelay: `${320 + index * 60}ms` }}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm text-slate-100">{item.label}</span>
                <span className="text-xs font-semibold text-cyan-100">{item.count}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800/75">
                <div
                  className="progress-shimmer h-full rounded-full bg-gradient-to-r from-cyan-300 to-indigo-300"
                  style={{ width: `${Math.min(item.percent, 100)}%` }}
                  aria-hidden
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
