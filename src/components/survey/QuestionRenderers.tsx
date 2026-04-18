"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, CheckCircle2, Loader2 } from "lucide-react";
import type { inferRouterOutputs } from "@trpc/server";
import { trpc } from "@/lib/trpc-client";
import type { AppRouter } from "@/server/routers/_app";
import type {
  SingleChoiceQuestion,
  NumericQuestion,
  GridNumericQuestion,
  FreeTextQuestion,
} from "@/content/surveys/types";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type AggregateQuestion = RouterOutputs["survey"]["aggregate"]["questions"][number];
type MyAnswers = RouterOutputs["survey"]["myAnswers"];

// ---------- Single-choice (bars animate) ----------

export function SingleChoiceBlock({
  vertical,
  question,
  aggregate,
  mine,
}: {
  vertical: string;
  question: SingleChoiceQuestion;
  aggregate: Extract<AggregateQuestion, { kind: "single_choice" }> | undefined;
  mine?: string;
}) {
  const utils = trpc.useUtils();
  const submit = trpc.survey.submitChoice.useMutation({
    onSuccess: () =>
      Promise.all([
        utils.survey.aggregate.invalidate({ vertical }),
        utils.survey.myAnswers.invalidate({ vertical }),
      ]),
  });
  const total = aggregate?.total ?? 0;

  return (
    <ul className="mt-4 space-y-2">
      {question.options.map((o) => {
        const count =
          aggregate?.options.find((x) => x.key === o.key)?.count ?? 0;
        const pct = total === 0 ? 0 : (count / total) * 100;
        const selected = mine === o.key;
        return (
          <li key={o.key}>
            <button
              onClick={() =>
                submit.mutate({
                  vertical,
                  questionSlug: question.slug,
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
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
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
      <li className="pl-1 text-[11px] text-slate/50">
        {total.toLocaleString()} answers
      </li>
    </ul>
  );
}

// ---------- Numeric (with optional context sub-choice) ----------

export function NumericBlock({
  vertical,
  question,
  aggregate,
  myValue,
  myContext,
}: {
  vertical: string;
  question: NumericQuestion;
  aggregate:
    | Extract<AggregateQuestion, { kind: "numeric" }>
    | undefined;
  myValue?: number;
  myContext?: string;
}) {
  const utils = trpc.useUtils();
  const submit = trpc.survey.submitNumeric.useMutation({
    onSuccess: () =>
      Promise.all([
        utils.survey.aggregate.invalidate({ vertical }),
        utils.survey.myAnswers.invalidate({ vertical }),
      ]),
  });
  const submitContext = trpc.survey.submitNumericContext.useMutation({
    onSuccess: () =>
      Promise.all([
        utils.survey.aggregate.invalidate({ vertical }),
        utils.survey.myAnswers.invalidate({ vertical }),
      ]),
  });

  const [value, setValue] = useState<string>(
    myValue !== undefined ? String(myValue) : ""
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (myValue !== undefined) setValue(String(myValue));
  }, [myValue]);

  function commit() {
    if (value.trim() === "") return;
    const n = Number(value);
    if (!Number.isFinite(n)) return;
    if (myValue !== undefined && Math.abs(myValue - n) < 1e-9) return;
    submit.mutate(
      { vertical, questionSlug: question.slug, value: n },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 1200);
        },
      }
    );
  }

  const avg = aggregate?.avg ?? null;
  const count = aggregate?.total ?? 0;
  const min = aggregate?.min ?? null;
  const max = aggregate?.max ?? null;

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr]">
      <div className="rounded-2xl border border-ivory-card bg-ivory p-4">
        <div className="flex items-center gap-3">
          <input
            type="number"
            inputMode="decimal"
            step={question.step ?? 0.01}
            min={question.min}
            max={question.max}
            value={value}
            placeholder={question.placeholder}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
            }}
            className="w-36 rounded-full border border-ivory-card bg-ivory px-4 py-2 text-sm text-slate outline-none focus:border-sage"
          />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">
            {question.unit}
          </span>
          <button
            onClick={commit}
            disabled={submit.isPending}
            className="inline-flex items-center gap-1 rounded-full border border-sage/40 bg-ivory px-3 py-1.5 text-xs font-semibold text-sage hover:border-sage"
          >
            {submit.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : saved ? (
              <Check className="h-3.5 w-3.5" />
            ) : null}
            Save
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <Stat label="Avg" value={fmtNum(avg)} highlight />
          <Stat label="Min" value={fmtNum(min)} />
          <Stat label="Max" value={fmtNum(max)} />
        </div>
        <div className="mt-2 text-[11px] text-slate/50">
          {count.toLocaleString()} answers
        </div>
      </div>

      {question.context && aggregate?.context ? (
        <div className="rounded-2xl border border-ivory-card bg-mist p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">
            {question.context.prompt}
          </div>
          <ul className="mt-3 space-y-1.5">
            {question.context.options.map((o) => {
              const opt = aggregate.context!.options.find((x) => x.key === o.key);
              const count = opt?.count ?? 0;
              const total = aggregate.context!.total;
              const pct = total === 0 ? 0 : (count / total) * 100;
              const selected = myContext === o.key;
              return (
                <li key={o.key}>
                  <button
                    onClick={() =>
                      submitContext.mutate({
                        vertical,
                        questionSlug: question.slug,
                        contextOptionKey: o.key,
                      })
                    }
                    className="group relative block w-full overflow-hidden rounded-xl border border-ivory-card bg-ivory px-3 py-2 text-left transition hover:border-sage/40"
                    aria-pressed={selected}
                  >
                    <motion.span
                      className={
                        selected
                          ? "absolute inset-y-0 left-0 bg-sage/25"
                          : "absolute inset-y-0 left-0 bg-ivory-card/60"
                      }
                      initial={false}
                      animate={{ width: `${pct}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                    <span className="relative flex items-center justify-between gap-2 text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-slate">
                        {selected ? (
                          <CheckCircle2 className="h-3 w-3 text-sage" />
                        ) : null}
                        {o.label}
                      </span>
                      <span className="flex items-baseline gap-2 text-[10px] text-slate/60">
                        <span className="font-mono tabular-nums">
                          {pct.toFixed(0)}%
                        </span>
                        <span className="tabular-nums text-slate/50">
                          {count}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

// ---------- Grid numeric ----------

export function GridNumericBlock({
  vertical,
  question,
  aggregate,
  mine,
}: {
  vertical: string;
  question: GridNumericQuestion;
  aggregate: Extract<AggregateQuestion, { kind: "grid_numeric" }> | undefined;
  mine?: Record<string, number>;
}) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-ivory-card bg-ivory">
      <table className="w-full text-sm">
        <thead className="bg-mist text-xs uppercase tracking-[0.18em] text-sage">
          <tr>
            <th className="px-4 py-3 text-left">Visit type</th>
            <th className="px-4 py-3 text-left">Your weight ({question.unit})</th>
            <th className="px-4 py-3 text-right">Network avg</th>
            <th className="px-4 py-3 text-right">Answers</th>
          </tr>
        </thead>
        <tbody>
          {question.rows.map((row) => {
            const agg = aggregate?.rows.find((r) => r.key === row.key);
            return (
              <GridRow
                key={row.key}
                vertical={vertical}
                slug={question.slug}
                rowKey={row.key}
                label={row.label}
                step={question.step ?? 0.05}
                min={question.min}
                max={question.max}
                initial={mine?.[row.key]}
                avg={agg?.avg ?? null}
                count={agg?.count ?? 0}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function GridRow({
  vertical,
  slug,
  rowKey,
  label,
  step,
  min,
  max,
  initial,
  avg,
  count,
}: {
  vertical: string;
  slug: string;
  rowKey: string;
  label: string;
  step: number;
  min?: number;
  max?: number;
  initial?: number;
  avg: number | null;
  count: number;
}) {
  const utils = trpc.useUtils();
  const submit = trpc.survey.submitGridCell.useMutation({
    onSuccess: () =>
      Promise.all([
        utils.survey.aggregate.invalidate({ vertical }),
        utils.survey.myAnswers.invalidate({ vertical }),
      ]),
  });

  const [value, setValue] = useState<string>(
    initial !== undefined ? String(initial) : ""
  );
  useEffect(() => {
    if (initial !== undefined) setValue(String(initial));
  }, [initial]);

  function commit() {
    if (value === "") {
      submit.mutate({ vertical, questionSlug: slug, rowKey, value: null });
      return;
    }
    const n = Number(value);
    if (!Number.isFinite(n)) return;
    submit.mutate({ vertical, questionSlug: slug, rowKey, value: n });
  }

  return (
    <tr className="border-t border-ivory-card">
      <td className="px-4 py-3 font-medium text-slate">{label}</td>
      <td className="px-4 py-3">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          max={max}
          value={value}
          placeholder="—"
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
          className="w-24 rounded-full border border-ivory-card bg-ivory px-3 py-1.5 text-sm text-slate outline-none focus:border-sage"
        />
      </td>
      <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-slate/80">
        {avg === null ? "—" : avg.toFixed(2)}
      </td>
      <td className="px-4 py-3 text-right text-xs tabular-nums text-slate/50">
        {count.toLocaleString()}
      </td>
    </tr>
  );
}

// ---------- Free text (general + suggestions) ----------

export function FreeTextBlock({
  vertical,
  question,
  aggregateCount,
}: {
  vertical: string;
  question: FreeTextQuestion;
  aggregateCount: number;
}) {
  const utils = trpc.useUtils();
  const [text, setText] = useState("");
  const [justSent, setJustSent] = useState(false);
  const submit = trpc.survey.submitFreeText.useMutation({
    onSuccess: () => {
      setText("");
      setJustSent(true);
      setTimeout(() => setJustSent(false), 2500);
      utils.survey.aggregate.invalidate({ vertical });
      utils.survey.listFreeText.invalidate({
        vertical,
        kind: question.feedbackKind,
      });
    },
  });
  const list = trpc.survey.listFreeText.useQuery(
    { vertical, kind: question.feedbackKind, limit: 10 },
    { staleTime: 30_000 }
  );

  const bgClass =
    question.feedbackKind === "question-suggestion"
      ? "rounded-2xl border border-gold/30 bg-slate p-5"
      : "rounded-2xl border border-ivory-card bg-ivory p-5";
  const textClass =
    question.feedbackKind === "question-suggestion"
      ? "text-ivory"
      : "text-slate";
  const inputClass =
    question.feedbackKind === "question-suggestion"
      ? "w-full rounded-2xl border border-ivory/20 bg-slate-soft px-4 py-3 text-sm text-ivory placeholder:text-ivory/50 outline-none focus:border-gold"
      : "w-full rounded-2xl border border-ivory-card bg-ivory px-4 py-3 text-sm text-slate outline-none focus:border-sage";

  return (
    <div className={`mt-4 ${bgClass}`}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder={question.placeholder}
        className={inputClass}
      />
      <div className={`mt-3 flex items-center justify-between gap-3 text-xs ${textClass}`}>
        <span className="opacity-70">
          {aggregateCount.toLocaleString()} already shared ·{" "}
          {text.length}/4000
        </span>
        <div className="flex items-center gap-2">
          {justSent ? (
            <span
              className={
                question.feedbackKind === "question-suggestion"
                  ? "text-gold"
                  : "text-sage"
              }
            >
              Thanks — posted under your username.
            </span>
          ) : null}
          <button
            onClick={() =>
              text.trim().length >= 3 &&
              submit.mutate({
                vertical,
                kind: question.feedbackKind,
                text: text.trim(),
              })
            }
            disabled={submit.isPending || text.trim().length < 3}
            className={
              question.feedbackKind === "question-suggestion"
                ? "btn-envoy"
                : "btn-primary"
            }
          >
            {submit.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Post
          </button>
        </div>
      </div>

      {list.data && list.data.length > 0 ? (
        <ul className="mt-5 space-y-3 border-t border-white/10 pt-4">
          {list.data.map((entry) => (
            <li
              key={entry.id}
              className={
                question.feedbackKind === "question-suggestion"
                  ? "rounded-2xl border border-gold/20 bg-slate-soft p-4"
                  : "rounded-2xl border border-ivory-card bg-mist p-4"
              }
            >
              <div
                className={`flex flex-wrap items-baseline justify-between gap-2 text-[11px] ${
                  question.feedbackKind === "question-suggestion"
                    ? "text-ivory/60"
                    : "text-slate/60"
                }`}
              >
                <span className="font-semibold">
                  {entry.username ?? "Anonymous"}
                  {entry.discipline ? ` · ${entry.discipline.toUpperCase()}` : ""}
                </span>
                <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
              </div>
              <p
                className={`mt-2 text-sm ${
                  question.feedbackKind === "question-suggestion"
                    ? "text-ivory/90"
                    : "text-slate/85"
                }`}
              >
                {entry.text}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p
          className={`mt-4 text-xs ${
            question.feedbackKind === "question-suggestion"
              ? "text-ivory/60"
              : "text-slate/60"
          }`}
        >
          Be the first. Your post shows up here with your anonymous username.
        </p>
      )}
    </div>
  );
}

// ---------- Shared helpers ----------

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "rounded-xl bg-sage px-3 py-2 text-ivory"
          : "rounded-xl bg-mist px-3 py-2 text-slate"
      }
    >
      <div className="text-[10px] uppercase tracking-[0.18em] opacity-75">
        {label}
      </div>
      <div className="mt-0.5 font-display italic text-base font-bold tabular-nums">
        {value}
      </div>
    </div>
  );
}

function fmtNum(n: number | null): string {
  if (n === null) return "—";
  if (Math.abs(n) < 1 && n !== 0) return n.toFixed(2);
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export type { MyAnswers, AggregateQuestion };
