export type Agency = {
  key: string; // stable slug — stored in BallotProfile.agencyKey
  name: string; // display name, alphabetized
};

/**
 * Slugify a display name into an agency key.
 * Not called at runtime — used once when building the registry.
 */
export function agencySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const AGENCY_OTHER: Agency = { key: "other", name: "Other / Not listed" };
