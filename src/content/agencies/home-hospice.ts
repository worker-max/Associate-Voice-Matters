import { AGENCY_OTHER, agencySlug, type Agency } from "./types";

/**
 * Top Home Hospice agencies (alphabetical).
 *
 * Sourced from Hospice News rankings, public 10-Ks (Amedisys, Enhabit,
 * Addus, Pennant), and industry M&A coverage. Keys must stay stable —
 * renaming resets that agency's response history.
 */
const NAMES: string[] = [
  "AccentCare Hospice",
  "Agrace Hospice & Supportive Care",
  "Alive Hospice",
  "Amedisys Hospice",
  "Ascension at Home Hospice",
  "BAYADA Hospice",
  "Bristol Hospice",
  "By the Bay Health",
  "Care Dimensions",
  "Chapters Health System",
  "Community Hospice & Palliative Care",
  "Compassus Hospice",
  "Continuum Care Hospice",
  "Crossroads Hospice & Palliative Care",
  "Elara Caring Hospice",
  "Empatia Hospice",
  "Enhabit Hospice",
  "Gentiva Hospice",
  "Good Shepherd Hospice",
  "Grane Hospice Care",
  "HarborLight Hospice",
  "HCA Healthcare Hospice",
  "Heart to Heart Hospice",
  "Homestead Hospice",
  "Hope Healthcare",
  "Hosparus Health",
  "Hospice of Michigan",
  "Hospice of North Idaho",
  "Hospice of the Valley",
  "Hospice of the Western Reserve",
  "Kindred Hospice",
  "Nathan Adelson Hospice",
  "New Day Hospice",
  "Ohio's Hospice",
  "Pennant Group Hospice",
  "PruittHealth Hospice",
  "Residential Hospice",
  "Samaritan Healthcare & Hospice",
  "Seasons Hospice & Palliative Care",
  "Silverado Hospice",
  "St. Croix Hospice",
  "Suncoast Hospice",
  "Traditions Health",
  "Transitions LifeCare",
  "Treasure Coast Hospice",
  "Trinity Health At Home Hospice",
  "Trustbridge",
  "VITAS Healthcare",
  "VNA Health Group Hospice",
  "VNS Health Hospice",
  "Vynca",
  "Well Care Health Hospice",
];

export const HOME_HOSPICE_AGENCIES: Agency[] = [
  ...NAMES.map((name) => ({ key: agencySlug(name), name })).sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  ),
  AGENCY_OTHER,
];
