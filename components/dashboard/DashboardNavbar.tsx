"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const AUTH_STORAGE_KEY = "san_authenticated";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/expositions", label: "Expositions" },
  { href: "/plan-actions", label: "Plan d'actions" },
  { href: "/alertes", label: "Alertes" },
];

export function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event("san-auth-changed"));
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/65 backdrop-blur-xl appear-up">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-lg px-2 py-1 text-sm font-semibold tracking-wide text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            <span className="scan-pulse relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/55 bg-cyan-300/10 text-cyan-200">
              SAN
              <span className="soft-glow absolute inset-0 rounded-full bg-cyan-300/20 blur-md" />
            </span>
            <span className="hidden transition-colors group-hover:text-cyan-200 sm:block">
              Self-Audit Numerique
            </span>
          </Link>

          <nav aria-label="Navigation dashboard" className="hidden items-center gap-2 md:flex">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname.startsWith(`${link.href}/`));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`chip-lift rounded-lg px-3 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 ${
                    isActive
                      ? "bg-cyan-300/15 text-cyan-100"
                      : "text-slate-300 hover:bg-white/10 hover:text-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/auth"
            className="rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-white/40 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            Compte
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            Se deconnecter
          </button>
        </div>
      </div>
    </header>
  );
}
