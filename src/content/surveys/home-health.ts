import type { SurveyDefinition } from "./types";

/**
 * Home Health — live pulse survey.
 *
 * Edit freely. Keep slugs stable; renaming a slug resets its response history.
 * Profile fields (username, discipline, agency) live in BallotProfile, not here.
 */
export const homeHealthSurvey: SurveyDefinition = {
  vertical: "home-health",
  title: "Home Health pulse",
  intro:
    "Real numbers from home health clinicians to home health clinicians. Your discipline and agency stay at the top. Bars and totals update as more people answer.",
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
      placeholder: "30",
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
        { key: "oasis-recert", label: "OASIS Recert" },
        { key: "oasis-roc", label: "OASIS ROC" },
        { key: "oasis-dc", label: "OASIS D/C" },
        { key: "routine-visit", label: "Routine Visit" },
        { key: "non-visit-dc", label: "Non-Visit D/C" },
        { key: "eval", label: "Eval" },
        { key: "therapy-reassessment", label: "Therapy Reassessment" },
        { key: "non-oasis-recert", label: "Non-OASIS Recert" },
        { key: "non-oasis-roc", label: "Non-OASIS ROC" },
        { key: "non-oasis-dc", label: "Non-OASIS D/C" },
      ],
    },
    {
      kind: "single_choice",
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
      kind: "single_choice",
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
    {
      kind: "free_text",
      slug: "general-feedback",
      prompt: "Anything else — feedback on an agency, a branch, or home health in general.",
      placeholder: "Share what's on your mind. Stays tied to your anonymous username; no employer sees this.",
      feedbackKind: "general",
    },
    {
      kind: "free_text",
      slug: "question-suggestion",
      prompt: "What should we ask next? Recommend questions we should add to this page.",
      placeholder: "e.g. \"Ask about OASIS productivity expectations on weekends.\"",
      feedbackKind: "question-suggestion",
    },
  ],
};
