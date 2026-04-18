/**
 * Survey content types.
 *
 * Questions live as editable code (not DB rows) so we can iterate fast
 * without migrations. Responses live in SurveyResponse.
 */

export type SurveyOption = {
  key: string; // stable identifier — used in SurveyResponse.optionKey
  label: string;
};

export type SingleChoiceQuestion = {
  kind: "single_choice";
  slug: string;
  prompt: string;
  help?: string;
  options: SurveyOption[];
};

export type NumericQuestion = {
  kind: "numeric";
  slug: string;
  prompt: string;
  help?: string;
  unit: string; // e.g. "$ / mile", "visits / week"
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  // optional companion single-choice (e.g. "40-hour role / 32-hour role / Other")
  context?: {
    slug: string; // sub-question slug, stored with the same parent questionSlug
    prompt: string;
    options: SurveyOption[];
  };
};

export type GridNumericRow = {
  key: string;
  label: string;
  help?: string;
};

export type GridNumericQuestion = {
  kind: "grid_numeric";
  slug: string;
  prompt: string;
  help?: string;
  unit: string;
  rows: GridNumericRow[];
  min?: number;
  max?: number;
  step?: number;
};

export type FreeTextQuestion = {
  kind: "free_text";
  slug: string; // maps to FreeTextFeedback.kind style "general" or similar
  prompt: string;
  help?: string;
  placeholder?: string;
  feedbackKind: "general" | "question-suggestion";
};

export type SurveyQuestion =
  | SingleChoiceQuestion
  | NumericQuestion
  | GridNumericQuestion
  | FreeTextQuestion;

export type SurveyDefinition = {
  vertical: string; // matches SurveyResponse.vertical
  title: string;
  intro: string;
  questions: SurveyQuestion[];
};
