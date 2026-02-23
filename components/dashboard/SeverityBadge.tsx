import type { Severity } from "@/components/dashboard/types";

const severityClasses: Record<Severity, string> = {
  INFO: "border-slate-300/30 bg-slate-300/10 text-slate-100",
  MOYEN: "border-amber-300/40 bg-amber-300/15 text-amber-100",
  ELEVE: "border-orange-300/45 bg-orange-300/15 text-orange-100",
  CRITIQUE: "border-rose-300/45 bg-rose-300/15 text-rose-100",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${severityClasses[severity]}`}
      aria-label={`Severite ${severity.toLowerCase()}`}
    >
      {severity}
    </span>
  );
}
