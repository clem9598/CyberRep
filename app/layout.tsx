import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://self-audit-numerique.fr"),
  title: {
    default: "Self-Audit Numerique | Reduisez votre exposition en ligne",
    template: "%s | Self-Audit Numerique",
  },
  description:
    "Self-Audit Numerique analyse les informations publiques associees a vos identifiants verifies et vous guide pour reduire votre risque numerique, dans un cadre RGPD strict.",
  openGraph: {
    title: "Self-Audit Numerique",
    description:
      "Audit personnel de votre exposition numerique: identifiants verifies, plan d'actions, suivi du risque.",
    url: "https://self-audit-numerique.fr",
    siteName: "Self-Audit Numerique",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
