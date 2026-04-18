"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Users } from "lucide-react";
import { trpc } from "@/lib/trpc-client";
import type { SurveyDefinition } from "@/content/surveys/types";

const POLL_MS = 5_000;

export function SurveyBlock({ survey }: { survey: SurveyDefinition }) {
  const aggregate = trpc.survey.aggregate.useQuery(
    { vertical: survey.vertical },
    { refetchInterval: POLL_MS, staleTime: POLL_MS / 2 }
  );
  const mine = trpc.survey.myAnswers.useQuery(
    { vertical: survey.vertical },
    { staleTime: 60_000 }
  );

  const utils = trpc.useUtils();
  const submit = trpc.survey.submit.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.survey.aggregate.invalidate({ vertical: survey.vertical }),
        utils.survey.myAnswers.invalidate({ vertical: survey.vertical }),
      ]);
    },
  });

  const totals = useMemo(() => {
    const map = new Map<string, { total: number; counts: Map<string, number> }>();
    for (const q of aggregate.data?.questions ?? []) {
      const counts = new Map<string, number>();
      for (const o of q.options) counts.set(o.key, o.count);
      map.set(q.slug, { total: q.total, counts });
    }
    return map;
  }, [aggregate.data]);

  const overallVoters = useMemo(() => {
    // Approximate "voices heard" — max answer count across questions is a
    // reasonable proxy (someone who answers one question already counts).
    let max = 0;
    for (const q of aggregate.data?.questions ?? []) max = Math.max(max, q.total);
    return max;
  }, [aggregate.data]);

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
              key={overallVoters}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {overallVoters.toLocaleString()} voices so far
            </motion.span>
          </div>
        </div>

        <div className="mt-8 space-y-10">
          {survey.questions.map((q, i) => {
            const snapshot = totals.get(q.slug) ?? {
              total: 0,
              counts: new Map<string, number>(),
            };
            const mySelection = mine.data?.[q.slug];
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

                <ul className="mt-4 space-y-2">
                  {q.options.map((o) => {
                    const count = snapshot.counts.get(o.key) ?? 0;
                    const pct =
                      snapshot.total === 0 ? 0 : (count / snapshot.total) * 100;
                    const selected = mySelection === o.key;
                    return (
                      <li key={o.key}>
                        <button
                          onClick={() =>
                            submit.mutate({
                              vertical: survey.vertical,
                              questionSlug: q.slug,
                              optionKey: o.key,
                            })
                          }
                          className="group relative block w-full overflow-hidden rounded-2xl border border-ivory-card bg-ivory px-4 py-3 text-left transition hover:border-sage/40"
                          aria-pressed={selected}
                        >
                          <motion.span
                            className={
                              selected
                                ? "absolute inset-y-0 left-0 bg-sage/25"
                                : "absolute inset-y-0 left-0 bg-mist"
                            }
                            initial={false}
                            animate={{ width: `${pct}%` }}
                            transition={{
                              type: "spring",
                              stiffness: 120,
                              damping: 20,
                            }}
                          />
                          <span className="relative flex items-center justify-between gap-4 text-sm">
                            <span className="flex items-center gap-2 font-medium text-slate">
                              {selected ? (
                                <CheckCircle2 className="h-4 w-4 text-sage" />
                              ) : null}
                              {o.label}
                            </span>
                            <span className="flex items-baseline gap-3 text-xs text-slate/70">
                              <span className="font-mono tabular-nums">
                                {pct.toFixed(0)}%
                              </span>
                              <span className="tabular-nums text-slate/50">
                                {count.toLocaleString()}
                              </span>
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-2 pl-10 text-[11px] text-slate/50">
                  {snapshot.total.toLocaleString()} answers · bars update live
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 border-t border-ivory-card pt-5 text-xs text-slate/60">
          One answer per question per ballot. Clear your cookies to reset. No
          PII is stored with these responses.
        </p>
      </div>
    </section>
  );
}
