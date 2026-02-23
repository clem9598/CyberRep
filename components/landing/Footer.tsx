const links = [
  "Mentions legales",
  "Politique de confidentialite",
  "CGU",
  "Contact",
  "Statut",
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((label) => (
            <li key={label}>
              <a
                href="#"
                className="rounded-sm transition hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-slate-400">Conforme RGPD - audits limites aux identifiants verifies.</p>
      </div>
    </footer>
  );
}
