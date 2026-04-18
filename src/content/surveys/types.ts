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

export type SurveyQuestion = {
  slug: string; // stable within a vertical
  prompt: string;
  help?: string;
  options: SurveyOption[];
};

export type SurveyDefinition = {
  vertical: string; // matches SurveyResponse.vertical
  title: string;
  intro: string;
  questions: SurveyQuestion[];
};
