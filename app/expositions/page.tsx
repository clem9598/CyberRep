import Link from "next/link";

type ExpositionsPageProps = {
  searchParams: Promise<{ categorie?: string }>;
};

export default async function ExpositionsPage({ searchParams }: ExpositionsPageProps) {
  const params = await searchParams;
  const categorie = params.categorie ?? "toutes";

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
      <section className="glass-panel w-full rounded-2xl p-8">
        <p className="text-xs tracking-[0.17em] text-cyan-200 uppercase">WIP</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Expositions</h1>
        <p className="mt-3 text-slate-300">
          Filtre actif : <span className="font-medium text-cyan-100">{categorie}</span>
        </p>
        <p className="mt-2 text-slate-300">
          Le listing detaille des expositions sera branche ici.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/dashboard"
            className="inline-flex rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/40 hover:bg-white/10"
          >
            Retour au dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
