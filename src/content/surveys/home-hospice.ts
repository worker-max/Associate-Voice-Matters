import type { SurveyDefinition } from "./types";

/**
 * Home Hospice — starter pulse survey.
 *
 * These are a first pass. Edit freely. Keep slugs stable to preserve history.
 */
export const homeHospiceSurvey: SurveyDefinition = {
  vertical: "home-hospice",
  title: "Home Hospice pulse",
  intro:
    "Five quick questions from hospice clinicians to hospice clinicians. Watch the bars move as more people answer.",
  questions: [
    {
      slug: "biggest-challenge",
      prompt: "What's the biggest challenge in your current hospice role?",
      options: [
        { key: "emotional-weight", label: "Emotional weight / grief support for clinicians" },
        { key: "caseload", label: "Caseload / visit volume" },
        { key: "on-call", label: "On-call expectations" },
        { key: "documentation", label: "Documentation burden" },
        { key: "family-dynamics", label: "Family / caregiver dynamics" },
      ],
    },
    {
      slug: "bereavement-support",
      prompt: "Do you have access to adequate bereavement support as a clinician?",
      options: [
        { key: "strong", label: "Yes — strong program" },
        { key: "somewhat", label: "Somewhat" },
        { key: "minimal", label: "Minimal" },
        { key: "none", label: "None" },
      ],
    },
    {
      slug: "pto-fairness",
      prompt: "How would you rate your current PTO / flex time?",
      options: [
        { key: "generous", label: "Generous" },
        { key: "fair", label: "Fair" },
        { key: "inadequate", label: "Inadequate" },
      ],
    },
    {
      slug: "top-reason-to-leave",
      prompt: "If you left your current employer tomorrow, the top reason would be…",
      options: [
        { key: "comp", label: "Compensation" },
        { key: "caseload", label: "Caseload intensity" },
        { key: "leadership", label: "Leadership" },
        { key: "clinical-support", label: "Lack of clinical support" },
        { key: "schedule", label: "Schedule / on-call" },
      ],
    },
    {
      slug: "supported-on-hard-cases",
      prompt: "How supported do you feel on difficult cases?",
      help: "One is \"on my own.\" Five is \"my team has my back every time.\"",
      options: [
        { key: "1", label: "1 — On my own" },
        { key: "2", label: "2" },
        { key: "3", label: "3 — Neutral" },
        { key: "4", label: "4" },
        { key: "5", label: "5 — Full team support" },
      ],
    },
  ],
};
