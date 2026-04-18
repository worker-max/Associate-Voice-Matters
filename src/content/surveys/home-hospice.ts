import type { SurveyDefinition } from "./types";

/**
 * Home Hospice — live pulse survey.
 *
 * Mirrors Home Health structurally so associates on either side see the same
 * shape. Edit freely; keep slugs stable.
 */
export const homeHospiceSurvey: SurveyDefinition = {
  vertical: "home-hospice",
  title: "Home Hospice pulse",
  intro:
    "Real numbers from hospice clinicians to hospice clinicians. Your discipline and agency stay at the top. Bars and totals update as more people answer.",
  questions: [
    {
      kind: "numeric",
      slug: "mileage-reimbursement",
      prompt: "What mileage reimbursement does your agency pay?",
      help: "Current rate per mile. Enter 0 if not offered.",
      unit: "$ / mile",
      placeholder: "0.67",
      min: 0,
      max: 2,
      step: 0.01,
    },
    {
      kind: "numeric",
      slug: "expected-productivity",
      prompt: "What weekly productivity is expected in your role?",
      help: "Total expected visits per week. Pair it with your role type on the right.",
      unit: "visits / week",
      placeholder: "25",
      min: 0,
      max: 100,
      step: 1,
      context: {
        slug: "role-type",
        prompt: "Role type",
        options: [
          { key: "full-time-40", label: "40-hour full-time" },
          { key: "full-time-32", label: "32-hour full-time" },
          { key: "part-time", label: "Part-time" },
          { key: "prn", label: "PRN / per-diem" },
          { key: "other", label: "Other" },
        ],
      },
    },
    {
      kind: "grid_numeric",
      slug: "visit-unit-weights",
      prompt: "What unit weights does your agency assign to each visit type?",
      help: "Enter the point / productivity weight your agency uses. Leave a row blank if your agency doesn't count it or you don't know.",
      unit: "units",
      min: 0,
      max: 10,
      step: 0.05,
      rows: [
        { key: "soc", label: "SOC — Start of Care" },
        { key: "recert", label: "Recertification" },
        { key: "roc", label: "Resumption of Care" },
        { key: "routine-visit", label: "Routine Visit" },
        { key: "prn-visit", label: "PRN Visit" },
        { key: "death-visit", label: "Death Visit" },
        { key: "non-visit-dc", label: "Non-Visit D/C" },
        { key: "eval", label: "Eval" },
        { key: "idg-meeting", label: "IDG / IDT Meeting" },
        { key: "bereavement-visit", label: "Bereavement Visit" },
        { key: "on-call-visit", label: "On-Call Visit" },
      ],
    },
    {
      kind: "single_choice",
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
      kind: "single_choice",
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
    {
      kind: "free_text",
      slug: "general-feedback",
      prompt: "Anything else — feedback on an agency, a branch, or hospice in general.",
      placeholder: "Share what's on your mind. Stays tied to your anonymous username; no employer sees this.",
      feedbackKind: "general",
    },
    {
      kind: "free_text",
      slug: "question-suggestion",
      prompt: "What should we ask next? Recommend questions we should add to this page.",
      placeholder: "e.g. \"Ask how on-call compensation compares to base rate.\"",
      feedbackKind: "question-suggestion",
    },
  ],
};
