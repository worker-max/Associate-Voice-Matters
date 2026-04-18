import { router } from "../trpc";
import { associateRouter } from "./associate";
import { caseRouter } from "./case";
import { feedbackRouter } from "./feedback";
import { compensationRouter } from "./compensation";
import { employerRouter } from "./employer";
import { surveyRouter } from "./survey";

export const appRouter = router({
  associate: associateRouter,
  case: caseRouter,
  feedback: feedbackRouter,
  compensation: compensationRouter,
  employer: employerRouter,
  survey: surveyRouter,
});

export type AppRouter = typeof appRouter;
