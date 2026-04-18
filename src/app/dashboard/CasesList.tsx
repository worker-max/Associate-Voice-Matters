"use client";

import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc-client";
import { IdentityToggle } from "./IdentityToggle";

const statusLabel: Record<string, string> = {
  OPEN: "Open",
  AWAITING_EMPLOYER: "Awaiting employer",
  AWAITING_ASSOCIATE: "Awaiting your reply",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

type StructuredSummary = {
  summary?: string;
  identity_recommendation?: { suggest_unlock?: boolean; rationale?: string };
};

export function CasesList() {
  const cases = trpc.case.list.useQuery();

  if (cases.isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate/60">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading your cases…
      </div>
    );
  }
  if (!cases.data || cases.data.length === 0) {
    return (
      <p className="text-sm text-slate/70">
        No cases yet. When you share something above, it appears here.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-ivory-card rounded-bubble border border-ivory-card bg-ivory">
      {cases.data.map((c) => {
        const latest = c.feedback[0]?.structuredJson as StructuredSummary | null;
        return (
          <li key={c.id} className="px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-sage">
                  {c.wing} · {statusLabel[c.status] ?? c.status}
                  {c.employer ? ` · ${c.employer.name}` : null}
                </div>
                <div className="mt-1 text-sm font-medium text-slate">
                  {latest?.summary ??
                    "Awaiting AI structuring — your words are saved."}
                </div>
                {c.feedback[0]?.aiTags && c.feedback[0].aiTags.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.feedback[0].aiTags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-ivory-card bg-mist px-2 py-0.5 text-[10px] text-slate/70"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col items-end gap-1 text-right">
                <span className="text-xs text-slate/60">
                  Updated {new Date(c.updatedAt).toLocaleDateString()}
                </span>
                <IdentityToggle
                  caseId={c.id}
                  anonymous={c.anonymousFlag}
                  rationaleFromAI={
                    latest?.identity_recommendation?.suggest_unlock
                      ? latest.identity_recommendation.rationale
                      : undefined
                  }
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
