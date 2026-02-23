import Link from "next/link";
import type { ScoreOverview } from "@/components/dashboard/types";

type ScoreCardProps = {
  data: ScoreOverview;
  isLoading?: boolean;
};

export function ScoreCard({ data, isLoading = false }: ScoreCardProps) {
  if (isLoading) {
    return (
      <section className="relative">
        <div className="glass-panel animate-pulse rounded-3xl p-6">
          <div className="h-5 w-40 rounded bg-white/10" />
          <div className="mt-4 h-10 w-56 rounded bg-white/10" />
          <div className="mt-4 h-2 rounded bg-white/10" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="h-16 rounded bg-white/10" />
            <div className="h-16 rounded bg-white/10" />
          </div>
        </div>
      </section>
    );
  }

  const ratio = Math.min(Math.max((data.score / data.maxScore) * 100, 0), 100);
  const trendPrefix = data.trend30d >= 0 ? "+" : "";

  return (
    <section className="relative appear-up appear-delay-2">
      <div className="glass-panel premium-panel relative overflow-hidden rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-300">Score d&apos;exposition</p>
          <div className="scan-pulse rounded-full border border-emerald-300/40 bg-emerald-300/15 px-3 py-1 text-xs text-emerald-100">
            Dernier scan: aujourd&apos;hui
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <strong className="text-4xl font-semibold text-white">
            {data.score}/{data.maxScore}
          </strong>
          <span className="text-sm text-amber-200">Risque {data.level.toLowerCase()}</span>
          <span className="text-sm text-slate-300">
            {trendPrefix}
            {data.trend30d} sur 30 jours
          </span>
        </div>

        <div className="mt-5 h-2 rounded-full bg-slate-800/80">
          <div
            className="progress-shimmer h-full rounded-full bg-gradient-to-r from-cyan-300 to-indigo-300 transition-[width] duration-700"
            style={{ width: `${ratio}%` }}
            aria-hidden
          />
        </div>

        <div className="mt-6 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
          <div className="chip-lift rounded-xl border border-rose-300/35 bg-rose-300/10 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-rose-100">Alerte</p>
            <p className="mt-1 font-medium">{data.factors[0] ?? "Aucune alerte critique detectee"}</p>
          </div>
          <div className="chip-lift rounded-xl border border-amber-200/35 bg-amber-300/10 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-amber-100">Signal</p>
            <p className="mt-1 font-medium">{data.factors[1] ?? "Aucun signal eleve detecte"}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {data.factors.map((factor) => (
            <span
              key={factor}
              className="chip-lift rounded-full border border-white/20 bg-white/[0.04] px-3 py-1 text-xs font-medium tracking-wide text-slate-200"
            >
              {factor}
            </span>
          ))}
        </div>

        <Link
          href={data.actionPlanHref}
          className="chip-lift mt-5 inline-flex rounded-lg bg-cyan-300/20 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/30"
        >
          Voir le plan d&apos;actions
        </Link>
      </div>

    </section>
  );
}
