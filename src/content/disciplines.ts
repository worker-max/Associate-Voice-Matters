export type Discipline = {
  key: string;
  label: string;
};

/**
 * Discipline list for the vertical landing-page profile bar.
 * Keep keys stable — they're stored in BallotProfile.discipline.
 */
export const DISCIPLINES: Discipline[] = [
  { key: "rn", label: "RN" },
  { key: "lpn", label: "LPN" },
  { key: "pt", label: "PT" },
  { key: "pta", label: "PTA" },
  { key: "ot", label: "OT" },
  { key: "cota", label: "COTA" },
  { key: "msw", label: "MSW" },
  { key: "slp", label: "SLP" },
  { key: "hha", label: "HHA" },
  { key: "clinical-manager", label: "Clinical Manager" },
  { key: "branch-director", label: "Branch Director" },
  { key: "office-associate", label: "Office Associate" },
  { key: "area-ops-leader", label: "Area Ops Leader" },
  { key: "other", label: "Other" },
];

export const DISCIPLINE_KEYS = new Set(DISCIPLINES.map((d) => d.key));

export function disciplineLabel(key: string | null | undefined): string {
  if (!key) return "Unspecified";
  return DISCIPLINES.find((d) => d.key === key)?.label ?? "Unspecified";
}
