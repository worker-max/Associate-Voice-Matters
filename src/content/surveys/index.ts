import { homeHealthSurvey } from "./home-health";
import { homeHospiceSurvey } from "./home-hospice";
import type { SurveyDefinition, SurveyQuestion } from "./types";

const registry: Record<string, SurveyDefinition> = {
  [homeHealthSurvey.vertical]: homeHealthSurvey,
  [homeHospiceSurvey.vertical]: homeHospiceSurvey,
};

export function getSurvey(vertical: string): SurveyDefinition | null {
  return registry[vertical] ?? null;
}

export function listVerticals(): string[] {
  return Object.keys(registry);
}

export function findQuestion(
  vertical: string,
  slug: string
): SurveyQuestion | null {
  const survey = registry[vertical];
  if (!survey) return null;
  return survey.questions.find((q) => q.slug === slug) ?? null;
}

export function isKnownOption(
  vertical: string,
  slug: string,
  optionKey: string
): boolean {
  const q = findQuestion(vertical, slug);
  if (!q) return false;
  if (q.kind === "single_choice") {
    return q.options.some((o) => o.key === optionKey);
  }
  if (q.kind === "numeric" && q.context && q.context.slug === optionKey) {
    // context sub-question — optionKey lives as the context choice key
    return true;
  }
  return false;
}

export function isKnownContextOption(
  vertical: string,
  slug: string,
  contextOptionKey: string
): boolean {
  const q = findQuestion(vertical, slug);
  if (!q || q.kind !== "numeric" || !q.context) return false;
  return q.context.options.some((o) => o.key === contextOptionKey);
}

export function isKnownGridRow(
  vertical: string,
  slug: string,
  rowKey: string
): boolean {
  const q = findQuestion(vertical, slug);
  if (!q || q.kind !== "grid_numeric") return false;
  return q.rows.some((r) => r.key === rowKey);
}
