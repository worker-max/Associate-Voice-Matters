"use client";

import { useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc-client";
import { EmployerPicker } from "./EmployerPicker";

type StructuredPreview = {
  summary: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  tags: string[];
  identity_recommendation: { suggest_unlock: boolean; rationale: string };
};

export function FeedbackComposer() {
  const [employerId, setEmployerId] = useState<string | null>(null);
  const [employerName, setEmployerName] = useState<string | null>(null);
  const [partnerFlag, setPartnerFlag] = useState<boolean>(false);
  const [rawText, setRawText] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [preview, setPreview] = useState<StructuredPreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const openCase = trpc.case.open.useMutation();
  const submit = trpc.feedback.submit.useMutation();

  async function handleSubmit() {
    setError(null);
    setPreview(null);
    if (rawText.trim().length < 10) {
      setError("A few more words will help the moderator capture your intent.");
      return;
    }
    try {
      const caseRecord = await openCase.mutateAsync({
        wing: "CHANNEL",
        employerId: employerId ?? undefined,
        anonymous,
      });
      const result = await submit.mutateAsync({
        caseId: caseRecord.id,
        rawText,
      });
      if (result.structured) {
        setPreview({
          summary: result.structured.summary,
          category: result.structured.category,
          severity: result.structured.severity,
          tags: result.structured.tags,
          identity_recommendation: result.structured.identity_recommendation,
        });
      } else {
        setPreview({
          summary: "Received. We'll structure this as soon as the AI moderator is online.",
          category: "other",
          severity: "low",
          tags: [],
          identity_recommendation: { suggest_unlock: false, rationale: "" },
        });
      }
      setRawText("");
      await utils.case.list.invalidate();
    } catch (err) {
      setError("Something went wrong sending your case. It's saved locally — try again.");
    }
  }

  const pending = openCase.isPending || submit.isPending;

  return (
    <div className="card-warm">
      <div className="flex items-center justify-between">
        <h3>Share something</h3>
        <span className="tag">Channel · Anonymous by default</span>
      </div>

      <div className="mt-5 space-y-4">
        <EmployerPicker
          onSelect={(emp) => {
            setEmployerId(emp?.id ?? null);
            setEmployerName(emp?.name ?? null);
            setPartnerFlag(Boolean(emp?.talkaiqPartnerFlag));
          }}
        />
        {employerName ? (
          <div className="rounded-2xl border border-ivory-card bg-mist px-4 py-3 text-xs text-slate/75">
            Routing to <span className="font-semibold text-slate">{employerName}</span> ·{" "}
            {partnerFlag
              ? "TalkAIQ partner — full moderation routing"
              : "Non-partner — neutral moderation, identity protected"}
          </div>
        ) : null}

        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Type it raw. The AI moderator will structure it into a neutral, actionable case before it reaches your employer."
          rows={6}
          className="w-full rounded-2xl border border-ivory-card bg-ivory px-5 py-4 text-sm text-slate outline-none transition focus:border-sage focus:shadow-warm"
        />

        <label className="flex items-center gap-2 text-xs text-slate/70">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-sage text-sage focus:ring-sage"
          />
          Keep me anonymous to the employer
        </label>

        {error ? <p className="text-xs text-bloom">{error}</p> : null}

        <div className="flex items-center justify-end gap-3">
          <span className="text-xs text-slate/60">
            {rawText.length} / 8000
          </span>
          <button
            onClick={handleSubmit}
            disabled={pending}
            className="btn-primary"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending…
              </>
            ) : (
              <>
                Send <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {preview ? (
        <div className="mt-6 rounded-2xl border border-sage/20 bg-mist p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            <Sparkles className="h-3.5 w-3.5" /> AI structured this
          </div>
          <p className="mt-2 text-sm text-slate/85">{preview.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="tag">{preview.category}</span>
            <span className="tag">severity · {preview.severity}</span>
            {preview.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-ivory-card bg-ivory px-2.5 py-1 text-slate/70"
              >
                #{t}
              </span>
            ))}
          </div>
          {preview.identity_recommendation.suggest_unlock ? (
            <div className="mt-4 rounded-xl border border-gold/30 bg-slate/90 p-3 text-xs text-ivory">
              <span className="font-semibold text-gold">AI suggests:</span>{" "}
              {preview.identity_recommendation.rationale} — unlock is always
              your call.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
