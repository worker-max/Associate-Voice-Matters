import type { SurveyDefinition } from "./types";

/**
 * Home Health — starter pulse survey.
 *
 * These are a first pass meant to spark a conversation. Edit freely. The
 * `slug` on each question is what ties responses together over time — only
 * rename a slug if you're deliberately resetting that question's history.
 */
export const homeHealthSurvey: SurveyDefinition = {
  vertical: "home-health",
  title: "Home Health pulse",
  intro:
    "Five quick questions from home health associates to home health associates. Watch the bars move as more people answer.",
  questions: [
    {
      slug: "biggest-pain-point",
      prompt: "What's the biggest pain point in your current role?",
      options: [
        { key: "visit-volume", label: "Visit volume / productivity pressure" },
        { key: "oasis-docs", label: "OASIS documentation burden" },
        { key: "on-call", label: "On-call expectations" },
        { key: "mileage", label: "Mileage / drive-time reimbursement" },
        { key: "staffing", label: "Staffing coverage" },
      ],
    },
    {
      slug: "mileage-fairness",
      prompt: "How do you feel about your current mileage/travel reimbursement?",
      options: [
        { key: "generous", label: "Generous" },
        { key: "fair", label: "Fair" },
        { key: "inadequate", label: "Inadequate" },
        { key: "none", label: "Not offered" },
      ],
    },
    {
      slug: "overtime-frequency",
      prompt: "How often do you work past your scheduled hours?",
      options: [
        { key: "never", label: "Never" },
        { key: "occasionally", label: "Occasionally" },
        { key: "frequently", label: "Frequently" },
        { key: "almost-daily", label: "Almost daily" },
      ],
    },
    {
      slug: "top-reason-to-leave",
      prompt: "If you left your current employer tomorrow, the top reason would be…",
      options: [
        { key: "comp", label: "Compensation" },
        { key: "caseload", label: "Caseload / workload" },
        { key: "leadership", label: "Leadership" },
        { key: "benefits", label: "Benefits" },
        { key: "schedule", label: "Schedule flexibility" },
      ],
    },
    {
      slug: "heard-by-leadership",
      prompt: "How heard do you feel by leadership?",
      help: "One is \"not heard at all.\" Five is \"they actively seek my input.\"",
      options: [
        { key: "1", label: "1 — Not heard at all" },
        { key: "2", label: "2" },
        { key: "3", label: "3 — Neutral" },
        { key: "4", label: "4" },
        { key: "5", label: "5 — Actively sought" },
      ],
    },
  ],
};
