import Link from "next/link";

const trustChips = ["RGPD", "Identifiants verifies", "Pas de recherche tiers"];

export function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 md:pb-28 md:pt-24">
      <div className="grid items-center gap-14 lg:grid-cols-[1.04fr_0.96fr]">
        <div className="appear-up">
          <p className="mb-4 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1 text-xs font-medium tracking-[0.17em] text-cyan-100 uppercase">
            Self-audit numerique
          </p>
          <h1 className="max-w-3xl text-4xl leading-tight font-semibold text-white sm:text-5xl">
            Audit et reduction de votre exposition numerique
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Analyse automatisee des informations publiques associees a VOS identifiants verifies.
            Aucun scan de tiers.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              Commencer mon auto-audit
            </Link>
            <a
              href="#insights-preview"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              Voir un exemple de rapport
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-3">
            {trustChips.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-white/20 bg-white/[0.04] px-4 py-1.5 text-xs font-medium tracking-wide text-slate-200"
              >
                {chip}
              </li>
            ))}
          </ul>
        </div>

        <div id="insights-preview" className="appear-up appear-delay-2 relative mx-auto w-full max-w-xl">
          <div className="glass-panel relative overflow-hidden rounded-3xl p-6">
            <div className="absolute right-6 top-6 rounded-full border border-emerald-300/40 bg-emerald-300/15 px-3 py-1 text-xs text-emerald-100">
              Dernier scan: il y a 2 h
            </div>
            <p className="text-sm text-slate-300">Score d&apos;exposition</p>
            <div className="mt-3 flex items-baseline gap-2">
              <strong className="text-4xl font-semibold text-white">72/100</strong>
              <span className="text-sm text-amber-200">Risque eleve</span>
            </div>
            <div className="mt-5 h-2 rounded-full bg-slate-800/80">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-cyan-300 to-indigo-300" />
            </div>
            <div className="mt-6 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
              <div className="rounded-xl border border-rose-300/35 bg-rose-300/10 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-rose-100">Alerte</p>
                <p className="mt-1 font-medium">Mot de passe expose - Critique</p>
              </div>
              <div className="rounded-xl border border-amber-200/35 bg-amber-300/10 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-amber-100">Data broker</p>
                <p className="mt-1 font-medium">Profil detecte - Eleve</p>
              </div>
            </div>
          </div>

          <div className="glass-panel float-card absolute -left-4 -top-8 rounded-2xl px-4 py-3 text-sm text-slate-100">
            <p className="text-xs tracking-wide text-cyan-100 uppercase">Plan d&apos;actions</p>
            <p className="mt-1 font-medium">3 actions rapides</p>
          </div>

          <div className="glass-panel float-card absolute -bottom-7 right-4 rounded-2xl px-4 py-3 text-sm text-slate-100 [animation-delay:1.5s]">
            <p className="text-xs tracking-wide text-cyan-100 uppercase">Niveau de preuve</p>
            <p className="mt-1 font-medium">Identifiant verifie: email OTP</p>
          </div>
        </div>
      </div>
    </section>
  );
}
