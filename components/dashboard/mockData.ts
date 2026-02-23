import type { DashboardData } from "@/components/dashboard/types";

export const dashboardMockData: DashboardData = {
  profileLabel: "perso",
  score: {
    score: 72,
    maxScore: 100,
    level: "Eleve",
    trend30d: 12,
    factors: [
      "Email dans 3 fuites",
      "Data broker : profil trouve",
      "Telephone expose sur 2 pages",
    ],
    actionPlanHref: "/plan-actions",
  },
  actionPlan: {
    href: "/plan-actions",
    items: [
      {
        id: "rotate-password",
        title: "Changer le mot de passe principal",
        detail: "Remplacer le mot de passe expose et activer une version unique.",
        priority: "Haute",
        eta: "5 min",
      },
      {
        id: "remove-broker-profile",
        title: "Supprimer le profil data broker",
        detail: "Envoyer une demande de retrait au broker prioritaire.",
        priority: "Haute",
        eta: "10 min",
      },
      {
        id: "hide-phone",
        title: "Masquer le numero de telephone public",
        detail: "Nettoyer les pages annuaires detectees sur le dernier scan.",
        priority: "Moyenne",
        eta: "15 min",
      },
    ],
  },
  criticalExposures: [
    {
      id: "mot-de-passe-expose",
      title: "Mot de passe expose",
      severity: "CRITIQUE",
      description: "1 fuite contient un hash reutilisable.",
      actionLabel: "Actions immediates",
      href: "/expositions/mot-de-passe-expose",
    },
    {
      id: "adresse-postale-publique",
      title: "Adresse postale publique",
      severity: "ELEVE",
      description: "Presente sur un annuaire X.",
      actionLabel: "Demander retrait",
      href: "/expositions/adresse-postale-publique",
    },
    {
      id: "profil-data-broker",
      title: "Profil data broker",
      severity: "ELEVE",
      description: "Profil indexe chez un broker tiers.",
      actionLabel: "Supprimer profil",
      href: "/expositions/profil-data-broker",
    },
  ],
  categories: [
    {
      key: "breaches",
      label: "Breaches",
      count: 7,
      percent: 82,
      href: "/expositions?categorie=breaches",
    },
    {
      key: "contact-direct",
      label: "Contact direct (email/tel)",
      count: 5,
      percent: 66,
      href: "/expositions?categorie=contact-direct",
    },
    {
      key: "localisation-adresse",
      label: "Localisation/adresse",
      count: 4,
      percent: 58,
      href: "/expositions?categorie=localisation-adresse",
    },
    {
      key: "reseaux-sociaux-profils",
      label: "Reseaux sociaux / profils",
      count: 3,
      percent: 42,
      href: "/expositions?categorie=reseaux-sociaux-profils",
    },
    {
      key: "documents-pdfs",
      label: "Documents / PDFs",
      count: 2,
      percent: 29,
      href: "/expositions?categorie=documents-pdfs",
    },
    {
      key: "data-brokers",
      label: "Data brokers",
      count: 4,
      percent: 63,
      href: "/expositions?categorie=data-brokers",
    },
  ],
  alerts: [
    {
      id: "alert-1",
      title: "Nouvelle mention trouvee",
      timeLabel: "aujourd'hui",
      severity: "MOYEN",
    },
    {
      id: "alert-2",
      title: "Fuite ajoutee a une base connue",
      timeLabel: "hier",
      severity: "ELEVE",
    },
    {
      id: "alert-3",
      title: "Remediation effectuee",
      timeLabel: "il y a 3 jours",
      severity: "INFO",
    },
  ],
};
