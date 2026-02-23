import type { Metadata } from "next";
import { AuthGateway } from "@/components/auth/AuthGateway";
import { BackgroundFX } from "@/components/landing/BackgroundFX";

export const metadata: Metadata = {
  title: "Connexion / Inscription",
  description:
    "Connexion securisee avec OAuth, email OTP ou SMS OTP pour lancer votre auto-audit numerique.",
};

export default function AuthPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#040813]">
      <BackgroundFX />
      <main className="relative z-10">
        <AuthGateway />
      </main>
    </div>
  );
}
