const steps = [
  {
    title: "Verifiez vos identifiants",
    description:
      "Validation OTP email, OTP telephone ou OAuth pour garantir que l'audit concerne uniquement vos comptes.",
  },
  {
    title: "Scan automatise",
    description:
      "Correlation de sources publiques et de bases de fuites connues pour mesurer votre exposition reelle.",
  },
  {
    title: "Plan d'actions guide",
    description:
      "Priorisation des actions: suppression, durcissement des comptes et suivi de vos progres dans le temps.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="mb-10 max-w-2xl appear-up">
        <p className="text-xs tracking-[0.17em] text-cyan-200 uppercase">Comment ca marche</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          Un audit structure en 3 etapes
        </h2>
        <p className="mt-4 text-slate-300">
          Processus transparent, oriente reduction de risque, sans collecte excessive.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className={`glass-panel appear-up rounded-2xl p-6 ${index === 1 ? "appear-delay-1" : ""} ${
              index === 2 ? "appear-delay-2" : ""
            }`}
          >
            <p className="text-sm text-cyan-200">Etape {index + 1}</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
