type DashboardHeaderProps = {
  profileLabel: string;
};

export function DashboardHeader({ profileLabel }: DashboardHeaderProps) {
  return (
    <header className="glass-panel premium-panel appear-up appear-delay-1 relative overflow-hidden rounded-2xl p-4 sm:p-5">
      <div
        aria-hidden
        className="data-flow pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 12% 18%, rgba(125, 211, 252, 0.2), transparent 35%), radial-gradient(circle at 88% 82%, rgba(99, 102, 241, 0.18), transparent 34%)",
        }}
      />

      <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-cyan-100 uppercase">
            <span className="scan-pulse inline-block h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Self-Audit Numerique
          </p>
          <div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-300">
              Vue d&apos;ensemble du risque, des alertes et des actions prioritaires.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2 text-xs text-slate-200">
            <li className="rounded-full border border-white/20 bg-white/[0.05] px-3 py-1">RGPD by design</li>
            <li className="rounded-full border border-white/20 bg-white/[0.05] px-3 py-1">
              Identifiants verifies
            </li>
            <li className="rounded-full border border-white/20 bg-white/[0.05] px-3 py-1">Pas de scan tiers</li>
          </ul>
        </div>

        <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:gap-3 xl:w-auto xl:justify-end">
          <button
            type="button"
            className="scan-pulse chip-lift rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
          >
            Lancer un scan
          </button>
          <button
            type="button"
            aria-label="Selection du profil"
            className="chip-lift rounded-xl border border-white/20 bg-white/5 px-3.5 py-2.5 text-sm text-slate-200 transition hover:border-white/35 hover:bg-white/10"
          >
            Profil : {profileLabel}
          </button>
        </div>
      </div>
    </header>
  );
}
