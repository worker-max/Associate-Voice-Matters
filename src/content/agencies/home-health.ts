import { AGENCY_OTHER, agencySlug, type Agency } from "./types";

/**
 * Top Home Health agencies — SKILLED / MEDICARE-CERTIFIED ONLY.
 *
 * Home Health (this list) is distinct from Home Care:
 *   • Home Health = skilled, Medicare Part A, physician-ordered, OASIS,
 *     delivered by RN/LPN/PT/PTA/OT/COTA/SLP/MSW/HHA (HHA under RN supervision)
 *   • Home Care  = non-skilled personal care / private duty / companion,
 *     private-pay or Medicaid waivers — belongs on its own vertical
 *
 * Non-skilled brands like Home Instead, Comfort Keepers, Right at Home,
 * BrightStar Care, Visiting Angels, Griswold, Synergy, Home Helpers, etc.
 * do NOT belong here.
 *
 * Sourced from industry rankings (Modern Healthcare, Home Health Care News,
 * Hospice News, CMS Care Compare) and public 10-Ks of Medicare-certified
 * operators. Keys are stable — renaming a key resets that agency's history.
 */
const NAMES: string[] = [
  "AccentCare",
  "Adventist Health Home Care Services",
  "Aegis Therapies",
  "Alternate Solutions Health Network",
  "Amedisys Home Health",
  "Angels of Care Pediatric Home Health",
  "Ascension at Home",
  "Aveanna Healthcare",
  "BAYADA Home Health Care",
  "BrightSpring Health Services",
  "CenterWell Home Health",
  "Compassus Home Health",
  "Elara Caring",
  "Enhabit Home Health",
  "Five Points Healthcare",
  "Frontpoint Health",
  "Great Lakes Caring Home Health",
  "HarmonyCares",
  "HCR Home Care",
  "HealthPRO Heritage",
  "Interim HealthCare",
  "Intrepid USA Healthcare Services",
  "Jet Health",
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
  "Signature Healthcare at Home",
  "Sutter Care at Home",
  "Trinity Health At Home",
  "VitalCaring Group",
  "VNA Health Group",
  "VNS Health",
];

export const HOME_HEALTH_AGENCIES: Agency[] = [
  ...NAMES.map((name) => ({ key: agencySlug(name), name })).sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  ),
  AGENCY_OTHER,
];
