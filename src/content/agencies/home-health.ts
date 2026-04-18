import { AGENCY_OTHER, agencySlug, type Agency } from "./types";

/**
 * Top Home Health agencies (alphabetical).
 *
 * Sourced from industry rankings (Modern Healthcare, Home Health Care News,
 * CMS Care Compare, public 10-Ks). Edit freely as we refine. Keep keys
 * stable — renaming a key resets that agency's response history.
 */
const NAMES: string[] = [
  "AccentCare",
  "Addus HomeCare",
  "Adventist Health Home Care Services",
  "Aegis Therapies",
  "Alternate Solutions Health Network",
  "Amedisys Home Health",
  "Angels of Care Pediatric Home Health",
  "Ascension at Home",
  "Aveanna Healthcare",
  "BAYADA Home Health Care",
  "BrightSpring Health Services",
  "BrightStar Care",
  "Care Advantage",
  "CenterWell Home Health",
  "Comfort Keepers",
  "Compassus Home Health",
  "Elara Caring",
  "Enhabit Home Health",
  "Faith In Home Care",
  "Five Points Healthcare",
  "Frontpoint Health",
  "Great Lakes Caring Home Health",
  "HarmonyCares",
  "HCR Home Care",
  "HealthPRO Heritage",
  "Help at Home",
  "Home Instead",
  "HomeCare Advantage",
  "Interim HealthCare",
  "Intrepid USA Healthcare Services",
  "Jet Health",
  "Kindred at Home",
  "LHC Group",
  "Loyal Source Home Health",
  "Maxim Healthcare Services",
  "Mission Healthcare",
  "New Day Healthcare",
  "Option Care Health",
  "Pennant Group",
  "Phoebe Putney Home Health",
  "PruittHealth Home Health",
  "PSA Healthcare",
  "Recover Health",
  "Residential Home Health and Hospice",
  "Right at Home",
  "Signature Healthcare at Home",
  "St. Croix Hospice Home Health",
  "Sutter Care at Home",
  "Trinity Health At Home",
  "VitalCaring Group",
  "Visiting Nurse Service of New York",
  "VNA Health Group",
  "VNS Health",
  "WellSky Home Health",
];

export const HOME_HEALTH_AGENCIES: Agency[] = [
  ...NAMES.map((name) => ({ key: agencySlug(name), name })).sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  ),
  AGENCY_OTHER,
];
