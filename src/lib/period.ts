import type { Period } from "@/types/api.type";

const PERIOD_MAP: Record<string, Period> = {
  "last 7 days": "last_7_days",
  "last 30 days": "last_30_days",
  "this year": "this_year",
};

export function mapPeriod(filter: string): Period {
  return PERIOD_MAP[filter] ?? (filter as Period);
}

const PERIOD_LABELS: Record<Period, string> = {
  last_7_days: "last 7 days",
  last_30_days: "last 30 days",
  this_year: "this year",
};

export function periodLabel(period: string): string {
  return PERIOD_LABELS[period as Period] ?? period;
}
