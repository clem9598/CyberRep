"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AuthMode = "login" | "signup";
type OtpChannel = "EMAIL" | "SMS";
type OtpState = "idle" | "sent" | "invalid" | "expired" | "rate_limited" | "verified";

type OtpRequestSuccess = {
  status: "OTP_SENT";
  challengeId: string;
  maskedIdentifier: string;
  expiresInSeconds: number;
  resendInSeconds: number;
  debugCode?: string;
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
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [activeChannel, setActiveChannel] = useState<OtpChannel | null>(null);
  const [otpState, setOtpState] = useState<OtpState>("idle");
  const [maskedIdentifier, setMaskedIdentifier] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(null);
  const [codeExpiresAt, setCodeExpiresAt] = useState<number | null>(null);
  const [rateLimitedUntil, setRateLimitedUntil] = useState<number | null>(null);
  const [debugCode, setDebugCode] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sendingChannel, setSendingChannel] = useState<OtpChannel | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const resendRemaining = useMemo(() => {
    if (!resendAvailableAt) return 0;
    return Math.max(0, Math.ceil((resendAvailableAt - now) / 1000));
  }, [resendAvailableAt, now]);

  const expiryRemaining = useMemo(() => {
    if (!codeExpiresAt) return 0;
    return Math.max(0, Math.ceil((codeExpiresAt - now) / 1000));
  }, [codeExpiresAt, now]);

  const rateLimitRemaining = useMemo(() => {
    if (!rateLimitedUntil) return 0;
    return Math.max(0, Math.ceil((rateLimitedUntil - now) / 1000));
  }, [rateLimitedUntil, now]);

  const currentState = useMemo<OtpState>(() => {
    if (rateLimitedUntil && now < rateLimitedUntil) {
      return "rate_limited";
    }

    if ((otpState === "sent" || otpState === "invalid") && codeExpiresAt && now >= codeExpiresAt) {
      return "expired";
    }

    if (otpState === "rate_limited" && (!rateLimitedUntil || now >= rateLimitedUntil)) {
      return "idle";
    }

    return otpState;
  }, [codeExpiresAt, now, otpState, rateLimitedUntil]);

  async function sendOtp(channel: OtpChannel) {
    setFieldError(null);
    setSendingChannel(channel);

    try {
      const value = channel === "EMAIL" ? email : phone;
      const response = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ channel, value }),
      });

      const payload = (await response.json()) as unknown;

      if (!response.ok) {
        const apiError = payload as {
          error?: string;
          retryAfterSeconds?: number;
          message?: string;
          debugCode?: string;
        };
        if (response.status === 429) {
          const retryAfterSeconds = apiError.retryAfterSeconds ?? 30;
          setRateLimitedUntil(Date.now() + retryAfterSeconds * 1000);
          setOtpState("rate_limited");
          return;
        }

        if (apiError.debugCode) {
          setDebugCode(apiError.debugCode);
        }

        if (apiError.error === "INVALID_IDENTIFIER") {
          setFieldError(channel === "EMAIL" ? "Email invalide." : "Numero de telephone invalide.");
        } else if (apiError.error === "DELIVERY_NOT_CONFIGURED") {
          setFieldError(
            "Envoi OTP non configure. Configure RESEND (email) ou TWILIO (SMS), ou lance en mode dev.",
          );
        } else {
          setFieldError(apiError.message ?? "Impossible d'envoyer le code pour le moment.");
        }
        return;
      }

      const success = payload as OtpRequestSuccess;
      const timestamp = Date.now();
      setActiveChannel(channel);
      setChallengeId(success.challengeId);
      setMaskedIdentifier(success.maskedIdentifier);
      setOtpCode("");
      setOtpState("sent");
      setResendAvailableAt(timestamp + success.resendInSeconds * 1000);
      setCodeExpiresAt(timestamp + success.expiresInSeconds * 1000);
      setRateLimitedUntil(null);
      setDebugCode(success.debugCode ?? null);
    } catch {
      setFieldError("Erreur reseau. Reessayez dans quelques instants.");
    } finally {
      setSendingChannel(null);
    }
  }

  async function verifyOtp() {
    setFieldError(null);

    if (!challengeId) {
      setFieldError("Demandez d'abord un code OTP.");
      return;
    }

    if (!otpCode.trim()) {
      setFieldError("Entrez le code OTP recu.");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeId,
          code: otpCode.trim(),
        }),
      });

      const payload = (await response.json()) as { status?: string; error?: string };

      if (!response.ok) {
        if (response.status === 429 || payload.error === "RATE_LIMITED") {
          setOtpState("rate_limited");
          setRateLimitedUntil(Date.now() + 30 * 1000);
          return;
        }

        if (payload.error === "OTP_EXPIRED") {
          setOtpState("expired");
          return;
        }

        if (payload.error === "OTP_INVALID") {
          setOtpState("invalid");
          setFieldError("Code OTP invalide.");
          return;
        }

        setFieldError("Verification indisponible pour le moment.");
        return;
      }

      if (payload.status === "VERIFIED") {
        setOtpState("verified");
      }
    } catch {
      setFieldError("Erreur reseau. Reessayez dans quelques instants.");
    } finally {
      setIsVerifying(false);
    }
  }

  const statusClass =
    currentState === "verified"
      ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-100"
      : currentState === "rate_limited" || currentState === "invalid" || currentState === "expired"
        ? "border-rose-300/35 bg-rose-300/10 text-rose-100"
        : "border-cyan-300/35 bg-cyan-300/10 text-cyan-100";

  const statusText =
    currentState === "sent"
      ? `OTP envoye via ${activeChannel === "SMS" ? "SMS" : "email"}${
          maskedIdentifier ? ` (${maskedIdentifier})` : ""
        } - expiration dans ${formatTimer(expiryRemaining)}`
      : currentState === "invalid"
        ? "Code OTP invalide."
        : currentState === "expired"
          ? "Code OTP expire. Renvoyez un nouveau code."
          : currentState === "rate_limited"
            ? `Trop de tentatives. Reessayez dans ${formatTimer(rateLimitRemaining)}.`
            : currentState === "verified"
              ? "Verification reussie. Vous pouvez continuer."
              : "Aucun code envoye pour le moment.";

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
            Connexion et verification rapide
          </h1>
          <p className="mt-5 max-w-xl text-slate-300">
            Acces sans friction avec OAuth, email OTP ou SMS OTP pour confirmer que vous auditez
            uniquement vos propres identifiants.
          </p>
          <p className="mt-8 rounded-2xl border border-amber-200/35 bg-amber-300/10 p-4 text-sm text-amber-100">
            Cet outil ne permet pas de rechercher des tiers. Seuls les identifiants que vous
            verifiez peuvent etre scannes.
          </p>
          <details className="mt-4 w-fit rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
            <summary className="cursor-pointer list-none font-medium text-cyan-100">
              Pourquoi cette verification ?
            </summary>
            <p className="mt-2 max-w-xl text-slate-300">
              Cette etape limite les abus, prouve le consentement et renforce la conformite RGPD.
            </p>
          </details>
        </section>

        <section className="glass-panel appear-up appear-delay-1 rounded-3xl p-6 sm:p-8">
          <div
            role="tablist"
            aria-label="Mode de connexion"
            className="mb-6 grid grid-cols-2 rounded-xl border border-white/15 bg-white/5 p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              onClick={() => setMode("login")}
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
              onClick={() => setMode("signup")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                mode === "signup"
                  ? "bg-cyan-300/20 text-cyan-100"
                  : "text-slate-300 hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              Inscription
            </button>
          </div>

          <p className="mb-4 text-sm text-slate-300">
            {mode === "login"
              ? "Connectez-vous a votre espace securise."
              : "Creez votre compte en moins de 60 secondes."}
          </p>

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
            <span>ou</span>
            <span className="h-px flex-1 bg-white/15" />
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                Email
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                  placeholder="exemple@domaine.fr"
                />
                <button
                  type="button"
                  onClick={() => sendOtp("EMAIL")}
                  disabled={sendingChannel === "EMAIL"}
                  className="min-w-[9.5rem] shrink-0 whitespace-nowrap rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-400 px-3.5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                  {sendingChannel === "EMAIL" ? "Envoi..." : "Envoyer un code"}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-200">
                Telephone
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                  placeholder="+33 6 12 34 56 78"
                />
                <button
                  type="button"
                  onClick={() => sendOtp("SMS")}
                  disabled={sendingChannel === "SMS"}
                  className="min-w-[9.5rem] shrink-0 whitespace-nowrap rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-400 px-3.5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                  {sendingChannel === "SMS" ? "Envoi..." : "Envoyer un SMS"}
                </button>
              </div>
            </div>
          </div>

          <div className={`mt-6 rounded-xl border px-4 py-3 text-sm ${statusClass}`} aria-live="polite">
            {statusText}
            {currentState === "sent" && resendRemaining > 0 && (
              <p className="mt-1 text-xs text-cyan-100/90">
                Nouveau code disponible dans {formatTimer(resendRemaining)}.
              </p>
            )}
          </div>

          {(currentState === "sent" ||
            currentState === "invalid" ||
            currentState === "expired" ||
            currentState === "verified") && (
            <div className="mt-5 space-y-3 rounded-2xl border border-white/15 bg-white/5 p-4">
              <label htmlFor="otp" className="block text-sm font-medium text-slate-200">
                Code OTP
              </label>
              <input
                id="otp"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, ""))}
                className="w-full rounded-lg border border-white/20 bg-slate-950/70 px-3.5 py-2.5 text-sm tracking-[0.3em] text-white placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                placeholder="000000"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={isVerifying}
                  className="rounded-xl bg-cyan-300/20 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/30 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                  {isVerifying ? "Verification..." : "Verifier le code"}
                </button>
                <button
                  type="button"
                  disabled={!activeChannel || resendRemaining > 0 || !!sendingChannel}
                  onClick={() => activeChannel && sendOtp(activeChannel)}
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                  Renvoyer
                </button>
              </div>
            </div>
          )}

          {fieldError && <p className="mt-4 text-sm text-rose-200">{fieldError}</p>}
          {debugCode && (
            <p className="mt-4 text-xs text-slate-400">
              Dev seulement: code OTP de test = <span className="font-mono text-slate-200">{debugCode}</span>
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
