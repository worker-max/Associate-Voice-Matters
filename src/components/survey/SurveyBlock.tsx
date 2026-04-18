"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { trpc } from "@/lib/trpc-client";
import type { SurveyDefinition } from "@/content/surveys/types";
import {
  SingleChoiceBlock,
  NumericBlock,
  GridNumericBlock,
  FreeTextBlock,
} from "./QuestionRenderers";

const POLL_MS = 5_000;

export function SurveyBlock({ survey }: { survey: SurveyDefinition }) {
  const aggregate = trpc.survey.aggregate.useQuery(
    { vertical: survey.vertical },
    { refetchInterval: POLL_MS, staleTime: POLL_MS / 2 }
  );
  const mine = trpc.survey.myAnswers.useQuery(
    { vertical: survey.vertical },
    { staleTime: 30_000 }
  );

  // Running voices = max answered across structured questions (not free-text,
  // which can have many posts per ballot and would distort the count).
  let voices = 0;
  for (const q of aggregate.data?.questions ?? []) {
    if (q.kind === "single_choice" || q.kind === "numeric") {
      voices = Math.max(voices, q.total ?? 0);
    }
    if (q.kind === "grid_numeric") {
      const rowMax = q.rows.reduce((m, r) => Math.max(m, r.count), 0);
      voices = Math.max(voices, rowMax);
    }
  }

  return (
    <section className="container-warm py-10">
      <div className="card-warm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="tag">Live pulse</span>
            <h2 className="mt-3">{survey.title}</h2>
            <p className="mt-2 max-w-2xl text-slate/75">{survey.intro}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-mist px-4 py-2 text-xs font-semibold text-sage">
            <Users className="h-3.5 w-3.5" />
            <motion.span
              key={voices}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {voices.toLocaleString()} voices so far
            </motion.span>
          </div>
        </div>

        <div className="mt-8 space-y-10">
          {survey.questions.map((q, i) => {
            const agg = aggregate.data?.questions.find(
              (a) => a.slug === q.slug
            );

            return (
              <div key={q.slug}>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-sage">
                    Q{i + 1}
                  </span>
                  <h3 className="text-slate">{q.prompt}</h3>
                </div>
                {q.help ? (
                  <p className="mt-1 pl-10 text-xs italic text-slate/60">
                    {q.help}
                  </p>
                ) : null}

                {q.kind === "single_choice" && (
                  <SingleChoiceBlock
                    vertical={survey.vertical}
                    question={q}
                    aggregate={
                      agg && agg.kind === "single_choice" ? agg : undefined
                    }
                    mine={mine.data?.choice[q.slug]}
                  />
                )}

                {q.kind === "numeric" && (
                  <NumericBlock
                    vertical={survey.vertical}
                    question={q}
                    aggregate={agg && agg.kind === "numeric" ? agg : undefined}
                    myValue={mine.data?.numeric[q.slug]}
                    myContext={
                      q.context
                        ? mine.data?.context[`${q.slug}__${q.context.slug}`]
                        : undefined
                    }
                  />
                )}

                {q.kind === "grid_numeric" && (
                  <GridNumericBlock
                    vertical={survey.vertical}
                    question={q}
                    aggregate={
                      agg && agg.kind === "grid_numeric" ? agg : undefined
                    }
                    mine={mine.data?.grid[q.slug]}
                  />
                )}

                {q.kind === "free_text" && (
                  <FreeTextBlock
                    vertical={survey.vertical}
                    question={q}
                    aggregateCount={
                      agg && agg.kind === "free_text" ? agg.total : 0
                    }
                  />
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-8 border-t border-ivory-card pt-5 text-xs text-slate/60">
          One response per question per ballot (grid cells can each carry a
          value). Clear your cookies to reset. No PII lives on any of these
          rows.
        </p>
      </div>
    </section>
  );
}
