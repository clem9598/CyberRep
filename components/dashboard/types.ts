export type Severity = "INFO" | "MOYEN" | "ELEVE" | "CRITIQUE";

export type ScoreOverview = {
  score: number;
  maxScore: number;
  level: "Faible" | "Moyen" | "Eleve" | "Critique";
  trend30d: number;
  factors: string[];
  actionPlanHref: string;
};

export type CriticalExposure = {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  actionLabel: string;
  href: string;
};

export type CategoryBreakdownItem = {
  key: string;
  label: string;
  count: number;
  percent: number;
  href: string;
};

export type AlertTimelineItem = {
  id: string;
  title: string;
  timeLabel: string;
  severity: Severity;
};

export type ActionPlanItem = {
  id: string;
  title: string;
  detail: string;
  priority: "Haute" | "Moyenne" | "Faible";
  eta: string;
};

export type DashboardData = {
  profileLabel: string;
  score: ScoreOverview;
  actionPlan: {
    href: string;
    items: ActionPlanItem[];
  };
  criticalExposures: CriticalExposure[];
  categories: CategoryBreakdownItem[];
  alerts: AlertTimelineItem[];
};
