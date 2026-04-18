import { homeHealthSurvey } from "./home-health";
import { homeHospiceSurvey } from "./home-hospice";
import type { SurveyDefinition } from "./types";

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

export function isKnownOption(
  vertical: string,
  slug: string,
  optionKey: string
): boolean {
  const survey = registry[vertical];
  if (!survey) return false;
  const q = survey.questions.find((q) => q.slug === slug);
  if (!q) return false;
  return q.options.some((o) => o.key === optionKey);
}
