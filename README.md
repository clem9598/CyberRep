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
  - Auth and identity verification (`User`, `VerifiedIdentifier`, `OtpChallenge`)
  - Consent trail (`ConsentProof`)
  - Audit pipeline (`AuditScope`, `ScanJob`, `ExposureFinding`, `RemediationAction`)
  - Privacy operations and access logging (`PrivacyRequest`, `AccessLog`)

The OTP API endpoints are persisted in DB:
- `POST /api/auth/otp/request`
- `POST /api/auth/otp/verify`

Real OTP delivery providers:
- Email: Resend (`RESEND_API_KEY`, `OTP_EMAIL_FROM`)
- SMS: Twilio (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`)

If providers are not configured:
- Development: debug fallback (code shown in UI)
- Production: API returns delivery configuration error

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

- OTP codes are hashed in DB.
- Identifiers are stored as hash + masked display value.
- Per-identifier rate limiting is enforced in DB.
- No third-party scanning flow is implemented.

For production, set strong secrets (`OTP_PEPPER`), hardened Postgres settings, and add a real message provider (email/SMS).
