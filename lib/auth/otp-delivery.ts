import type { OtpChannel } from "@prisma/client";

type DeliveryResult =
  | { ok: true; provider: "resend" | "twilio" | "debug"; debugCode?: string }
  | { ok: false; error: "DELIVERY_NOT_CONFIGURED" | "DELIVERY_FAILED"; debugCode?: string };

type DeliveryInput = {
  channel: OtpChannel;
  target: string;
  code: string;
};

async function sendEmailWithResend(target: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.OTP_EMAIL_FROM;
  if (!apiKey || !from) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [target],
      subject: "Votre code de verification Self-Audit Numerique",
      text: `Votre code OTP est: ${code}. Il expire dans 5 minutes.`,
      html: `<p>Votre code OTP est <strong>${code}</strong>.</p><p>Il expire dans 5 minutes.</p>`,
    }),
  });

  return response.ok;
}

async function sendSmsWithTwilio(target: string, code: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!accountSid || !authToken || !from) {
    return false;
  }

  const body = new URLSearchParams({
    To: target,
    From: from,
    Body: `Self-Audit Numerique: votre code OTP est ${code}. Expire dans 5 minutes.`,
  });

  const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    },
  );

  return response.ok;
}

export async function deliverOtp({ channel, target, code }: DeliveryInput): Promise<DeliveryResult> {
  try {
    if (channel === "EMAIL") {
      const sent = await sendEmailWithResend(target, code);
      if (sent) {
        return { ok: true, provider: "resend" };
      }
    }

    if (channel === "SMS") {
      const sent = await sendSmsWithTwilio(target, code);
      if (sent) {
        return { ok: true, provider: "twilio" };
      }
    }
  } catch {
    return process.env.NODE_ENV === "development"
      ? { ok: true, provider: "debug", debugCode: code }
      : { ok: false, error: "DELIVERY_FAILED" };
  }

  if (process.env.NODE_ENV === "development") {
    return { ok: true, provider: "debug", debugCode: code };
  }

  return { ok: false, error: "DELIVERY_NOT_CONFIGURED" };
}
