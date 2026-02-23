import Link from "next/link";

type ExposureDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ExposureDetailPage({ params }: ExposureDetailPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
      <section className="glass-panel w-full rounded-2xl p-8">
        <p className="text-xs tracking-[0.17em] text-cyan-200 uppercase">WIP</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Detail exposition</h1>
        <p className="mt-3 text-slate-300">
          Exposition selectionnee : <span className="font-medium text-cyan-100">{id}</span>
        </p>
        <p className="mt-2 text-slate-300">
          Les actions de remediation detaillees seront disponibles sur cette page.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/dashboard"
            className="inline-flex rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/40 hover:bg-white/10"
          >
            Retour au dashboard
          </Link>
          <Link
            href="/expositions"
            className="inline-flex rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/40 hover:bg-white/10"
          >
            Voir toutes les expositions
          </Link>
        </div>
      </section>
    </main>
  );
}
