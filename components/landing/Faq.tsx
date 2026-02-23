const questions = [
  {
    q: "Pouvez-vous scanner quelqu'un d'autre ?",
    a: "Non. Le service interdit les scans de tiers non consentants. L'audit est autorise uniquement sur vos identifiants verifies.",
  },
  {
    q: "Quelles sources analysez-vous ?",
    a: "Nous analysons des sources publiques, des fuites connues, et pour l'offre Pro des signaux dark web autorises par nos fournisseurs.",
  },
  {
    q: "Stockez-vous mes mots de passe ?",
    a: "Non. Aucun mot de passe en clair n'est stocke. Les controles se font via empreintes, tokens limites ou metadonnees techniques.",
  },
  {
    q: "Puis-je supprimer mes donnees ?",
    a: "Oui. Le Privacy Center permet l'export, la suppression et la gestion de retention selon vos preferences et obligations legales.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <div className="mb-10 appear-up text-center">
        <p className="text-xs tracking-[0.17em] text-cyan-200 uppercase">FAQ</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Questions frequentes</h2>
      </div>
      <div className="space-y-3">
        {questions.map((item, index) => (
          <details
            key={item.q}
            className={`glass-panel appear-up group rounded-2xl p-5 ${index === 1 ? "appear-delay-1" : ""} ${
              index >= 2 ? "appear-delay-2" : ""
            }`}
          >
            <summary className="cursor-pointer list-none text-base font-semibold text-white marker:content-none">
              <span className="flex items-center justify-between gap-4">
                <span>{item.q}</span>
                <span className="text-cyan-200 transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-4 text-sm leading-7 text-slate-300">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
