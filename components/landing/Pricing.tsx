type Plan = {
  name: string;
  price: string;
  description: string;
  bullets: string[];
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "0 EUR/mois",
    description: "Point d'entree pour comprendre votre surface d'exposition.",
    bullets: [
      "1 identifiant verifie",
      "Score d'exposition global",
      "2 scans mensuels",
      "Actions prioritaires de base",
      "Support communautaire",
    ],
  },
  {
    name: "Pro",
    price: "12 EUR/mois",
    description: "Pour suivre votre risque en continu.",
    featured: true,
    bullets: [
      "3 identifiants verifies",
      "Alertes temps reel",
      "Sources publiques + fuites connues",
      "Historique 12 mois",
      "Templates RGPD avances",
      "Support prioritaire",
    ],
  },
  {
    name: "Premium",
    price: "24 EUR/mois",
    description: "Protection et suivi pour toute la famille.",
    bullets: [
      "Jusqu'a 8 profils familles",
      "Mode famille partage securise",
      "Suivi mensuel automatise",
      "Alertes multi-canaux",
      "Propositions de durcissement personnalisees",
      "Accompagnement prioritaire",
    ],
  },
  {
    name: "B2B",
    price: "Sur devis",
    description: "Cadre entreprise avec gouvernance et preuves.",
    bullets: [
      "Tableau de bord equipe",
      "Journalisation des acces",
      "Politiques de retention dediees",
      "SSO + controles admin",
      "Exports conformite et audit",
      "SLA & accompagnement dedie",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-2xl appear-up">
          <p className="text-xs tracking-[0.17em] text-cyan-200 uppercase">Tarifs</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Des offres claires, adaptees a votre niveau de risque
          </h2>
          <p className="mt-4 text-slate-300">Sans engagement - annulation en 2 clics.</p>
        </div>
        <a
          href="#pricing"
          className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-white/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        >
          Comparer les offres
        </a>
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        {plans.map((plan, index) => (
          <article
            key={plan.name}
            className={`appear-up rounded-2xl p-6 ${
              plan.featured
                ? "glass-panel border-cyan-300/50 bg-cyan-200/10"
                : "glass-panel"
            } ${index === 1 ? "appear-delay-1" : ""} ${index >= 2 ? "appear-delay-2" : ""}`}
          >
            <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
            <p className="mt-2 text-2xl font-semibold text-cyan-100">{plan.price}</p>
            <p className="mt-3 text-sm text-slate-300">{plan.description}</p>
            <ul className="mt-5 space-y-2">
              {plan.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-200">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-cyan-200" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`mt-6 w-full rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 ${
                plan.featured
                  ? "bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-950 hover:brightness-110"
                  : "border border-white/20 bg-white/5 text-slate-100 hover:border-white/40 hover:bg-white/10"
              }`}
            >
              Choisir
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
