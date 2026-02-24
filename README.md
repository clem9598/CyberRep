## Self-Audit Numerique

Landing + auth prototype for a consumer SaaS focused on self digital exposure auditing (OSINT controle), with strict RGPD and consent boundaries.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start PostgreSQL (Docker):

```bash
docker compose up -d
```

3. Copy env values:

```bash
cp .env.example .env
```

4. Generate Prisma client and push schema:

```bash
npm run db:generate
npm run db:push
```

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Database stack (scalable baseline)

- PostgreSQL 16 (`docker-compose.yml`)
- Prisma 7 + `@prisma/adapter-pg` for typed data access
- Models included for:
  - Auth and identity verification (`User`, `VerifiedIdentifier`, `TotpCredential`, `OtpChallenge`)
  - Consent trail (`ConsentProof`)
  - Audit pipeline (`AuditScope`, `ScanJob`, `ExposureFinding`, `RemediationAction`)
  - Privacy operations and access logging (`PrivacyRequest`, `AccessLog`)

TOTP API endpoints (Google/Microsoft Authenticator compatible):
- `POST /api/auth/totp/setup` (provisioning secret + otpauth URI)
- `POST /api/auth/totp/verify` (activation + consent proof)
- `POST /api/auth/password/login` (step 1: email + password)
- `POST /api/auth/totp/login` (step 2: OTP after password session)

TOTP secret encryption:
- set `TOTP_ENCRYPTION_KEY` in `.env` (required in production)

## Useful scripts

```bash
npm run lint
npm run build
npm run db:generate
npm run db:push
npm run db:migrate
npm run db:studio
```

## Security notes (current scope)

- TOTP secrets are encrypted at rest (AES-256-GCM).
- Passwords are salted + hashed (`scrypt`).
- Identifiers are stored as hash + masked display value.
- Verification includes anti-replay (`lastUsedStep`) + temporary lock on repeated failures.
- No third-party scanning flow is implemented.

For production, set strong secrets (`OTP_PEPPER`, `TOTP_ENCRYPTION_KEY`), hardened Postgres settings, and connect OAuth providers.

## Deploy on Vercel

This project is a standard Next.js app and can be deployed directly on Vercel with default settings:

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `.next`
