"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AuthMode = "login" | "signup";
type AuthState =
  | "idle"
  | "authenticated"
  | "signup_done"
  | "totp_setup_ready"
  | "totp_verified"
  | "invalid"
  | "expired"
  | "rate_limited";

type SetupResponse = {
  status: "SETUP_CREATED";
  credentialId: string;
  issuer: string;
  label: string;
  otpauthUri: string;
  qrCodeDataUrl: string;
  secret: string;
  maskedIdentifier: string;
};

function formatTimer(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safeSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function GoogleLogo() {
  return (
    <svg aria-hidden className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 2.9 14.7 2 12 2 6.9 2 2.8 6.2 2.8 11.4 2.8 16.7 6.9 21 12 21c6.9 0 9.1-4.9 9.1-7.5 0-.5-.1-.9-.1-1.3H12Z"
      />
      <path
        fill="#4285F4"
        d="M21.1 12.2c0-.6-.1-1-.2-1.5H12v3.6h5.1c-.2 1.2-1 2.9-2.8 4.1l3.2 2.5c1.9-1.8 3.6-4.7 3.6-8.7Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 14.1a5.9 5.9 0 0 1 0-4.3L3 7.2a9.5 9.5 0 0 0 0 9.5l3.4-2.6Z"
      />
      <path
        fill="#34A853"
        d="M12 21c2.7 0 5-1 6.6-2.7l-3.2-2.5c-.9.6-2 1.1-3.4 1.1-2.5 0-4.7-1.8-5.5-4.2L3 15.3C4.6 18.7 8 21 12 21Z"
      />
    </svg>
  );
}

function MicrosoftLogo() {
  return (
    <svg aria-hidden className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
      <rect x="3" y="3" width="8" height="8" fill="#F25022" />
      <rect x="13" y="3" width="8" height="8" fill="#7FBA00" />
      <rect x="3" y="13" width="8" height="8" fill="#00A4EF" />
      <rect x="13" y="13" width="8" height="8" fill="#FFB900" />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg aria-hidden className="h-5 w-5 shrink-0 fill-current" viewBox="0 0 24 24">
      <path d="M16.6 12.8c0-2.3 1.9-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.5-.2-2.8.9-3.5.9-.7 0-1.8-.9-3-.9-1.5 0-2.9.9-3.7 2.2-1.6 2.8-.4 6.9 1.2 9.2.8 1.1 1.7 2.3 2.9 2.3 1.1 0 1.5-.7 2.9-.7 1.3 0 1.7.7 2.9.7 1.2 0 2-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.4-1-2.4-3.3Zm-2.3-6.8c.6-.8 1-1.9.9-3-1 .1-2.1.7-2.8 1.5-.6.7-1.1 1.9-1 2.9 1.1.1 2.2-.6 2.9-1.4Z" />
    </svg>
  );
}

export function AuthGateway() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [state, setState] = useState<AuthState>("idle");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [credentialId, setCredentialId] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [otpauthUri, setOtpauthUri] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [maskedIdentifier, setMaskedIdentifier] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimitedUntil, setRateLimitedUntil] = useState<number | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const rateLimitRemaining = useMemo(() => {
    if (!rateLimitedUntil) return 0;
    return Math.max(0, Math.ceil((rateLimitedUntil - now) / 1000));
  }, [rateLimitedUntil, now]);

  const totpCycleRemaining = useMemo(() => {
    const seconds = Math.floor(now / 1000);
    return 30 - (seconds % 30);
  }, [now]);

  const showRecommendedTotp = useMemo(() => {
    if (mode === "signup") {
      return state === "signup_done" || state === "totp_setup_ready" || state === "totp_verified";
    }
    return state === "authenticated" || state === "totp_setup_ready" || state === "totp_verified";
  }, [mode, state]);

  async function signupWithPassword() {
    setFieldError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/password/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const payload = (await response.json()) as {
        error?: string;
        maskedIdentifier?: string;
      };

      if (!response.ok) {
        if (payload.error === "INVALID_PAYLOAD") {
          setFieldError("Email invalide ou mot de passe trop court (minimum 10 caracteres).");
          return;
        }
        setFieldError("Inscription impossible.");
        return;
      }

      setMaskedIdentifier(payload.maskedIdentifier ?? null);
      setTotpEnabled(false);
      setState("signup_done");
    } catch {
      setFieldError("Erreur reseau. Reessayez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function loginWithPassword() {
    setFieldError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/password/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const payload = (await response.json()) as {
        error?: string;
        totpEnabled?: boolean;
        maskedIdentifier?: string;
      };

      if (!response.ok) {
        if (payload.error === "INVALID_CREDENTIALS") {
          setFieldError("Identifiant ou mot de passe invalide.");
          return;
        }
        setFieldError("Connexion impossible.");
        return;
      }

      setMaskedIdentifier(payload.maskedIdentifier ?? null);
      setTotpEnabled(Boolean(payload.totpEnabled));
      setState("authenticated");
    } catch {
      setFieldError("Erreur reseau. Reessayez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function setupTotp() {
    setFieldError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/totp/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const payload = (await response.json()) as unknown;
      if (!response.ok) {
        const apiError = payload as { error?: string };
        setFieldError(apiError.error === "INVALID_IDENTIFIER" ? "Email invalide." : "Setup TOTP indisponible.");
        return;
      }

      const data = payload as SetupResponse;
      setCredentialId(data.credentialId);
      setSecret(data.secret);
      setOtpauthUri(data.otpauthUri);
      setQrCodeDataUrl(data.qrCodeDataUrl);
      setMaskedIdentifier(data.maskedIdentifier);
      setTotpCode("");
      setState("totp_setup_ready");
    } catch {
      setFieldError("Erreur reseau. Reessayez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyTotpSetup() {
    setFieldError(null);
    if (!credentialId) {
      setFieldError("Configurez d'abord l'application OTP.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/totp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentialId, code: totpCode, password }),
      });
      const payload = (await response.json()) as { error?: string; retryAfterSeconds?: number };

      if (!response.ok) {
        if (response.status === 429 || payload.error === "RATE_LIMITED") {
          const retry = payload.retryAfterSeconds ?? 30;
          setRateLimitedUntil(Date.now() + retry * 1000);
          setState("rate_limited");
          return;
        }
        if (payload.error === "TOTP_INVALID") {
          setState("invalid");
          setFieldError("Code invalide.");
          return;
        }
        if (payload.error === "TOTP_REPLAYED") {
          setState("expired");
          setFieldError("Code deja utilise. Attendez le prochain code.");
          return;
        }
        if (payload.error === "PASSWORD_REQUIRED") {
          setFieldError("Mot de passe invalide (minimum 10 caracteres).");
          return;
        }
        setFieldError("Activation OTP impossible.");
        return;
      }

      setTotpEnabled(true);
      setState("totp_verified");
    } catch {
      setFieldError("Erreur reseau. Reessayez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const statusClass =
    state === "authenticated" || state === "signup_done" || state === "totp_verified"
      ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-100"
      : state === "invalid" || state === "expired" || state === "rate_limited"
        ? "border-rose-300/35 bg-rose-300/10 text-rose-100"
        : "border-cyan-300/35 bg-cyan-300/10 text-cyan-100";

  const statusText =
    state === "authenticated"
      ? "Connexion reussie."
      : state === "signup_done"
        ? "Compte cree avec succes. L'OTP est recommande pour renforcer la securite."
        : state === "totp_setup_ready"
          ? "Scannez le QR code puis confirmez avec un code OTP."
          : state === "totp_verified"
            ? "OTP active avec succes."
            : state === "invalid"
              ? "Code OTP invalide."
              : state === "expired"
                ? "Code OTP expire ou deja utilise."
                : state === "rate_limited"
                  ? `Trop de tentatives. Reessayez dans ${formatTimer(rateLimitRemaining)}.`
                  : "Entrez vos identifiants pour continuer.";

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-14">
      <div className="grid w-full items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="appear-up">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-lg border border-cyan-300/35 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-cyan-300/40">
              SAN
            </span>
            Self-Audit Numerique
          </Link>
          <h1 className="mt-8 max-w-lg text-4xl leading-tight font-semibold text-white sm:text-5xl">
            Connexion rapide et securisee
          </h1>
          <p className="mt-5 max-w-xl text-slate-300">
            L&apos;OTP application n&apos;est pas obligatoire pour vous connecter, mais fortement recommande
            apres connexion.
          </p>
          <p className="mt-8 rounded-2xl border border-amber-200/35 bg-amber-300/10 p-4 text-sm text-amber-100">
            Cet outil ne permet pas de rechercher des tiers. Seuls les identifiants que vous
            verifiez peuvent etre scannes.
          </p>
        </section>

        <section className="glass-panel appear-up appear-delay-1 rounded-3xl p-6 sm:p-8">
          <div
            role="tablist"
            aria-label="Mode d'authentification"
            className="mb-6 grid grid-cols-2 rounded-xl border border-white/15 bg-white/5 p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              onClick={() => {
                setMode("login");
                setFieldError(null);
                setState("idle");
              }}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-cyan-300/20 text-cyan-100"
                  : "text-slate-300 hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              onClick={() => {
                setMode("signup");
                setFieldError(null);
                setState("idle");
              }}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                mode === "signup"
                  ? "bg-cyan-300/20 text-cyan-100"
                  : "text-slate-300 hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              Inscription
            </button>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-left text-sm font-medium text-slate-100 transition hover:border-cyan-300/45 hover:bg-cyan-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              <span className="flex items-center gap-3">
                <GoogleLogo />
                <span>Continuer avec Google</span>
              </span>
              <span aria-hidden className="text-slate-400">
                OAuth
              </span>
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-left text-sm font-medium text-slate-100 transition hover:border-cyan-300/45 hover:bg-cyan-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              <span className="flex items-center gap-3">
                <MicrosoftLogo />
                <span>Continuer avec Microsoft</span>
              </span>
              <span aria-hidden className="text-slate-400">
                OAuth
              </span>
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-left text-sm font-medium text-slate-100 transition hover:border-cyan-300/45 hover:bg-cyan-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              <span className="flex items-center gap-3">
                <AppleLogo />
                <span>Continuer avec Apple</span>
              </span>
              <span aria-hidden className="text-slate-400">
                OAuth
              </span>
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-white/15" />
            <span>ou avec mot de passe</span>
            <span className="h-px flex-1 bg-white/15" />
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="identifier" className="mb-2 block text-sm font-medium text-slate-200">
                Email
              </label>
              <input
                id="identifier"
                type="email"
                autoComplete="email"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                className="w-full rounded-lg border border-white/20 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                placeholder="exemple@domaine.fr"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-white/20 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                placeholder="Minimum 10 caracteres"
              />
            </div>

            {mode === "signup" ? (
              <button
                type="button"
                onClick={signupWithPassword}
                disabled={isSubmitting || !identifier || password.length < 10}
                className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                {isSubmitting ? "Creation..." : "Creer mon compte"}
              </button>
            ) : (
              <button
                type="button"
                onClick={loginWithPassword}
                disabled={isSubmitting || !identifier || !password}
                className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                {isSubmitting ? "Connexion..." : "Se connecter"}
              </button>
            )}
          </div>

          <div className={`mt-6 rounded-xl border px-4 py-3 text-sm ${statusClass}`} aria-live="polite">
            {statusText}
          </div>

          {showRecommendedTotp && (
            <div className="mt-5 rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-4">
              <p className="text-sm font-semibold text-cyan-100">
                OTP recommande apres connexion
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Activez Google/Microsoft Authenticator pour renforcer la securite de votre compte.
              </p>

              {!totpEnabled && state !== "totp_setup_ready" && state !== "totp_verified" && (
                <button
                  type="button"
                  onClick={setupTotp}
                  disabled={isSubmitting || !identifier}
                  className="mt-3 rounded-lg border border-cyan-300/45 bg-cyan-300/15 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                  Configurer Authenticator (recommande)
                </button>
              )}

              {(state === "totp_setup_ready" || state === "totp_verified") && (
                <div className="mt-4 space-y-3 rounded-xl border border-white/15 bg-white/5 p-3 text-sm text-slate-200">
                  {qrCodeDataUrl && (
                    <div className="flex justify-center">
                      <Image
                        src={qrCodeDataUrl}
                        alt="QR code pour ajouter Self-Audit Numerique dans Google ou Microsoft Authenticator"
                        width={210}
                        height={210}
                        className="rounded-md border border-white/20 bg-white p-2"
                      />
                    </div>
                  )}
                  <p>
                    Identifiant: <span className="font-medium">{maskedIdentifier}</span>
                  </p>
                  <p>
                    Cle secrete: <span className="font-mono tracking-wider">{secret}</span>
                  </p>
                  <a
                    href={otpauthUri ?? "#"}
                    className="inline-flex rounded-md border border-cyan-300/35 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                  >
                    Ouvrir dans l&apos;application OTP
                  </a>

                  {state !== "totp_verified" && (
                    <>
                      <div>
                        <label htmlFor="totp" className="mb-2 block text-xs font-medium text-slate-200">
                          Code OTP (6 chiffres)
                        </label>
                        <input
                          id="totp"
                          inputMode="numeric"
                          maxLength={6}
                          autoComplete="one-time-code"
                          value={totpCode}
                          onChange={(event) => setTotpCode(event.target.value.replace(/\D/g, ""))}
                          className="w-full rounded-lg border border-white/20 bg-slate-950/70 px-3 py-2 text-sm tracking-[0.3em] text-white placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                          placeholder="000000"
                        />
                        <p className="mt-2 text-xs text-slate-400">
                          Nouveau code dans {totpCycleRemaining}s
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={verifyTotpSetup}
                        disabled={isSubmitting || !credentialId || !totpCode || password.length < 10}
                        className="w-full rounded-lg bg-cyan-300/20 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                      >
                        {isSubmitting ? "Activation..." : "Activer OTP"}
                      </button>
                    </>
                  )}

                  {state === "totp_verified" && (
                    <p className="text-xs text-emerald-100">OTP active. Recommandation appliquee.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {fieldError && <p className="mt-4 text-sm text-rose-200">{fieldError}</p>}
        </section>
      </div>
    </div>
  );
}
