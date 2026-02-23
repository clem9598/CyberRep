import type { Metadata } from "next";
import { ActionPlanBlock } from "@/components/dashboard/ActionPlanBlock";
import { AlertsTimeline } from "@/components/dashboard/AlertsTimeline";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { CriticalExposureCards } from "@/components/dashboard/CriticalExposureCards";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { dashboardMockData } from "@/components/dashboard/mockData";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { BackgroundFX } from "@/components/landing/BackgroundFX";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Vue d'ensemble des risques et expositions detectees sur Self-Audit Numerique.",
};

const dashboardUiState = {
  scoreLoading: false,
  actionPlanLoading: false,
  criticalLoading: false,
  categoriesLoading: false,
  alertsLoading: false,
  showEmptyCritical: false,
} as const;

export default function DashboardPage() {
  const data = dashboardMockData;
  const criticalItems = dashboardUiState.showEmptyCritical ? [] : data.criticalExposures;

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#040813]">
      <BackgroundFX />
      <div className="relative z-10">
        <DashboardNavbar />
      </div>
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-8 sm:py-10">
        <div className="space-y-6">
          <DashboardHeader profileLabel={data.profileLabel} />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
            <div className="order-1 space-y-6">
              <ScoreCard data={data.score} isLoading={dashboardUiState.scoreLoading} />
              <ActionPlanBlock
                href={data.actionPlan.href}
                items={data.actionPlan.items}
                isLoading={dashboardUiState.actionPlanLoading}
              />
              <CriticalExposureCards exposures={criticalItems} isLoading={dashboardUiState.criticalLoading} />
              <div className="lg:hidden">
                <AlertsTimeline items={data.alerts} href="/alertes" isLoading={dashboardUiState.alertsLoading} />
              </div>
              <CategoryBreakdown items={data.categories} isLoading={dashboardUiState.categoriesLoading} />
            </div>

            <div className="order-3 hidden lg:block">
              <AlertsTimeline items={data.alerts} href="/alertes" isLoading={dashboardUiState.alertsLoading} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
