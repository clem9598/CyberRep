import Link from "next/link";

export default function AlertesPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-16">
      <section className="glass-panel w-full rounded-2xl p-8">
        <p className="text-xs tracking-[0.17em] text-cyan-200 uppercase">WIP</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Alertes</h1>
        <p className="mt-3 text-slate-300">
          L&apos;historique complet des alertes sera disponible ici.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/40 hover:bg-white/10"
        >
          Retour au dashboard
        </Link>
      </section>
    </main>
  );
}
