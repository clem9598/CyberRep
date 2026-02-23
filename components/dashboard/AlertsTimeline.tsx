import Link from "next/link";
import { SeverityBadge } from "@/components/dashboard/SeverityBadge";
import type { AlertTimelineItem } from "@/components/dashboard/types";

type AlertsTimelineProps = {
  items: AlertTimelineItem[];
  href: string;
  isLoading?: boolean;
};

export function AlertsTimeline({ items, href, isLoading = false }: AlertsTimelineProps) {
  if (isLoading) {
    return (
      <aside className="glass-panel premium-panel rounded-2xl p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-semibold text-white">Dernieres alertes</h2>
          <div className="h-4 w-16 rounded bg-white/10" />
        </div>
        <div className="mt-4 space-y-3 animate-pulse">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-16 rounded bg-white/10" />
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="glass-panel premium-panel appear-up rounded-2xl p-5" style={{ animationDelay: "220ms" }}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-white">Dernieres alertes</h2>
        <Link
          href={href}
          className="chip-lift rounded-md border border-white/20 px-2.5 py-1 text-xs font-semibold text-slate-200 transition hover:border-white/35 hover:bg-white/10"
        >
          Tout voir
        </Link>
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="chip-lift appear-up rounded-xl border border-white/15 bg-white/[0.03] px-3 py-3"
            style={{ animationDelay: `${260 + index * 80}ms` }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-100">
                {item.title} ({item.timeLabel})
              </p>
              <SeverityBadge severity={item.severity} />
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
