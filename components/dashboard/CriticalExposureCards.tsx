import Link from "next/link";
import { SeverityBadge } from "@/components/dashboard/SeverityBadge";
import type { CriticalExposure } from "@/components/dashboard/types";

type CriticalExposureCardsProps = {
  exposures: CriticalExposure[];
  isLoading?: boolean;
};

export function CriticalExposureCards({ exposures, isLoading = false }: CriticalExposureCardsProps) {
  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Expositions critiques</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="glass-panel animate-pulse rounded-2xl p-5">
              <div className="h-5 w-28 rounded bg-white/10" />
              <div className="mt-3 h-4 w-40 rounded bg-white/10" />
              <div className="mt-8 h-9 w-36 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="appear-up appear-delay-4 space-y-4">
      <h2 className="text-xl font-semibold text-white">Expositions critiques</h2>

      {exposures.length === 0 ? (
        <div className="glass-panel premium-panel rounded-2xl p-5">
          <p className="text-sm text-slate-300">Aucune exposition critique detectee pour le moment.</p>
          <button
            type="button"
            className="chip-lift mt-3 rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110"
          >
            Lancer un scan
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {exposures.slice(0, 3).map((exposure, index) => (
            <article
              key={exposure.id}
              className="glass-panel premium-panel appear-up rounded-2xl p-5"
              style={{ animationDelay: `${160 + index * 90}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-white">{exposure.title}</h3>
                <SeverityBadge severity={exposure.severity} />
              </div>
              <p className="mt-3 text-sm text-slate-300">{exposure.description}</p>
              <Link
                href={exposure.href}
                className="chip-lift mt-5 inline-flex rounded-lg border border-cyan-300/35 bg-cyan-300/10 px-3.5 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
              >
                {exposure.actionLabel}
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
