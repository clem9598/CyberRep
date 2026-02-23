const features = [
  "Dashboard oriente risque",
  "Alertes temps reel + historique d'exposition",
  "Plan d'actions avec templates RGPD",
  "Mode famille (Premium) pour proches",
  "Mode entreprise (B2B) avec reporting centralise",
  "Privacy Center: export, suppression, retention",
];

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="mb-10 max-w-2xl appear-up">
        <p className="text-xs tracking-[0.17em] text-cyan-200 uppercase">Ce que vous obtenez</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          Une plateforme utile des le premier audit
        </h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <article
            key={feature}
            className={`glass-panel appear-up rounded-2xl p-5 ${index % 3 === 1 ? "appear-delay-1" : ""} ${
              index % 3 === 2 ? "appear-delay-2" : ""
            }`}
          >
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-300/15 text-cyan-200">
              <span className="text-sm font-semibold">{index + 1}</span>
            </div>
            <h3 className="text-base font-semibold text-white">{feature}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
