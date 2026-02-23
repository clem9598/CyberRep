"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "#pricing", label: "Tarifs" },
  { href: "#how-it-works", label: "Comment ca marche" },
  { href: "#security", label: "Securite & RGPD" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/65 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 rounded-lg px-2 py-1 text-sm font-semibold tracking-wide text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        >
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/55 bg-cyan-300/10 text-cyan-200">
            SAN
            <span className="soft-glow absolute inset-0 rounded-full bg-cyan-300/20 blur-md" />
          </span>
          <span className="transition-colors group-hover:text-cyan-200">Self-Audit Numerique</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-1 text-sm text-slate-300 transition hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/auth"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/40 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            Connexion
          </Link>
          <Link
            href="/auth"
            className="rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            Commencer mon auto-audit
          </Link>
        </div>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg border border-white/20 p-2 text-slate-200 transition hover:border-cyan-300/60 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 md:hidden"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            {open ? (
              <path strokeLinecap="round" d="M6 6L18 18M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" d="M4 7H20M4 12H20M4 17H20" />
            )}
          </svg>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-white/10 bg-slate-950/95 transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav aria-label="Navigation mobile" className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm text-slate-200 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/auth"
            className="mt-2 rounded-lg border border-white/20 px-4 py-2 text-center text-sm font-medium text-slate-200 transition hover:border-white/40 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            Connexion
          </Link>
          <Link
            href="/auth"
            className="rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-400 px-4 py-2 text-center text-sm font-semibold text-slate-950 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            Commencer mon auto-audit
          </Link>
        </nav>
      </div>
    </header>
  );
}
