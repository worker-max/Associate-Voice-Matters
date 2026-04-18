"use client";

import { useState } from "react";
import { Lock, Unlock, X } from "lucide-react";
import { trpc } from "@/lib/trpc-client";

const PROMPT_VERSION = "v1-2026-04";

export function IdentityToggle({
  caseId,
  anonymous,
  rationaleFromAI,
}: {
  caseId: string;
  anonymous: boolean;
  rationaleFromAI?: string;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const requestUnlock = trpc.associate.requestUnlock.useMutation();
  const setAnonymity = trpc.case.setAnonymity.useMutation();

  async function confirmUnlock() {
    setError(null);
    try {
      await requestUnlock.mutateAsync({
        caseId,
        reason: "ASSOCIATE_INITIATED",
        initiatedBy: "associate",
        promptVersion: PROMPT_VERSION,
      });
      await setAnonymity.mutateAsync({ caseId, anonymous: false });
      await utils.case.list.invalidate();
      setConfirmOpen(false);
    } catch (err) {
      setError("Unlock failed. Try again, or keep the case anonymous for now.");
    }
  }

  async function relock() {
    setError(null);
    await setAnonymity.mutateAsync({ caseId, anonymous: true });
    await utils.case.list.invalidate();
  }

  if (!anonymous) {
    return (
      <button
        onClick={relock}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-sage hover:underline"
      >
        <Unlock className="h-3.5 w-3.5" /> Identity unlocked — relock
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setConfirmOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate/70 hover:text-sage"
      >
        <Lock className="h-3.5 w-3.5" /> Anonymous — unlock identity
      </button>

      {confirmOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-bubble bg-ivory p-8 shadow-lift">
            <div className="flex items-start justify-between">
              <h3>Unlock your identity on this case?</h3>
              <button
                onClick={() => setConfirmOpen(false)}
                className="text-slate/60 hover:text-slate"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-sm text-slate/80">
              The employer will see your name alongside this case. You can
              relock at any time — but any messages already sent will have
              carried your identity.
            </p>
            {rationaleFromAI ? (
              <div className="mt-4 rounded-2xl border border-gold/30 bg-slate p-4 text-sm text-ivory">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Why AI suggested this
                </div>
                <p className="mt-1 text-ivory/85">{rationaleFromAI}</p>
              </div>
            ) : null}
            <ul className="mt-4 space-y-2 text-xs text-slate/70">
              <li>• We record consent in an append-only audit log.</li>
              <li>• You can relock future messages with one click.</li>
              <li>• Unlock is case-scoped — your other cases stay anonymous.</li>
            </ul>
            {error ? <p className="mt-3 text-xs text-bloom">{error}</p> : null}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="btn-secondary"
              >
                Keep me anonymous
              </button>
              <button
                onClick={confirmUnlock}
                disabled={requestUnlock.isPending || setAnonymity.isPending}
                className="btn-primary"
              >
                Yes, unlock
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
