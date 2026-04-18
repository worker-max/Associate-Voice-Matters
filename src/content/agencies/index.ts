import { HOME_HEALTH_AGENCIES } from "./home-health";
import { HOME_HOSPICE_AGENCIES } from "./home-hospice";
import type { Agency } from "./types";

const BY_VERTICAL: Record<string, Agency[]> = {
  "home-health": HOME_HEALTH_AGENCIES,
  "home-hospice": HOME_HOSPICE_AGENCIES,
};

export function agenciesFor(vertical: string): Agency[] {
  return BY_VERTICAL[vertical] ?? [];
}

export function isKnownAgency(vertical: string, key: string): boolean {
  return BY_VERTICAL[vertical]?.some((a) => a.key === key) ?? false;
}

export function agencyLabel(vertical: string, key: string | null | undefined): string {
  if (!key) return "Unspecified";
  return agenciesFor(vertical).find((a) => a.key === key)?.name ?? "Unspecified";
}

export type { Agency };
