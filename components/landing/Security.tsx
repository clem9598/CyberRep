const safeguards = [
  "Minimisation des donnees par defaut",
  "Chiffrement au repos et en transit",
  "Preuves de consentement horodatees",
  "Journalisation des acces (offre B2B)",
];

export function Security() {
  return (
    <section id="security" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="glass-panel appear-up rounded-3xl p-8 sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs tracking-[0.17em] text-cyan-200 uppercase">Securite & RGPD</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Concu pour la conformite, pas pour la surveillance
            </h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              Interdiction explicite de scanner des tiers non consentants. L&apos;analyse est
              limitee aux identifiants verifies par l&apos;utilisateur.
            </p>
            <p className="mt-6 rounded-xl border border-rose-200/30 bg-rose-300/10 p-4 text-sm text-rose-100">
              Regle produit: aucune recherche sur un tiers sans preuve de legitimite et consentement.
            </p>
          </div>
          <ul className="space-y-3">
            {safeguards.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
