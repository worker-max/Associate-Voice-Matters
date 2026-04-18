"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc-client";
import { DISCIPLINES } from "@/content/disciplines";
import type { Agency } from "@/content/agencies";

type Props = {
  vertical: string;
  agencies: Agency[];
};

export function ProfileBar({ vertical, agencies }: Props) {
  const profile = trpc.survey.profile.useQuery({ vertical });
  const utils = trpc.useUtils();
  const update = trpc.survey.updateProfile.useMutation({
    onSuccess: () => utils.survey.profile.invalidate({ vertical }),
  });

  const [discipline, setDiscipline] = useState<string>("");
  const [agencyKey, setAgencyKey] = useState<string>("");
  const [agencyWritein, setAgencyWritein] = useState<string>("");

  useEffect(() => {
    if (profile.data) {
      setDiscipline(profile.data.discipline ?? "");
      setAgencyKey(profile.data.agencyKey ?? "");
      setAgencyWritein(profile.data.agencyWritein ?? "");
    }
  }, [profile.data]);

  const agencyOptions = useMemo(() => agencies, [agencies]);

  function save(partial: {
    discipline?: string | null;
    agencyKey?: string | null;
    agencyWritein?: string | null;
  }) {
    update.mutate({
      vertical,
      discipline:
        partial.discipline === undefined
          ? discipline || null
          : partial.discipline || null,
      agencyKey:
        partial.agencyKey === undefined
          ? agencyKey || null
          : partial.agencyKey || null,
      agencyWritein:
        partial.agencyWritein === undefined
          ? agencyWritein || null
          : partial.agencyWritein || null,
    });
  }

  return (
    <section className="container-warm pt-6">
      <div className="rounded-bubble border border-sage/20 bg-mist p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <div className="min-w-[200px]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sage">
              <ShieldCheck className="h-3.5 w-3.5" /> Your anonymous username
            </div>
            <div className="mt-1 font-display italic text-2xl font-bold text-slate">
              {profile.data ? (
                profile.data.username
              ) : (
                <span className="inline-flex items-center gap-2 text-slate/50">
                  <Loader2 className="h-4 w-4 animate-spin" /> generating…
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-slate/60">
              Auto-assigned from your ballot. No one can reverse it to you.
            </div>
          </div>

          <div className="min-w-[180px] flex-1">
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-sage">
              Discipline
            </label>
            <select
              value={discipline}
              onChange={(e) => {
                setDiscipline(e.target.value);
                save({ discipline: e.target.value });
              }}
              className="mt-2 w-full rounded-full border border-ivory-card bg-ivory px-4 py-2.5 text-sm text-slate outline-none focus:border-sage"
            >
              <option value="">Choose your discipline</option>
              {DISCIPLINES.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[260px] flex-[2]">
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-sage">
              Agency
            </label>
            <select
              value={agencyKey}
              onChange={(e) => {
                setAgencyKey(e.target.value);
                save({ agencyKey: e.target.value });
              }}
              className="mt-2 w-full rounded-full border border-ivory-card bg-ivory px-4 py-2.5 text-sm text-slate outline-none focus:border-sage"
            >
              <option value="">Choose your agency</option>
              {agencyOptions.map((a) => (
                <option key={a.key} value={a.key}>
                  {a.name}
                </option>
              ))}
            </select>
            {agencyKey === "other" ? (
              <div className="mt-2 flex items-center gap-2">
                <input
                  value={agencyWritein}
                  onChange={(e) => setAgencyWritein(e.target.value)}
                  onBlur={() => save({ agencyWritein })}
                  placeholder="Type your agency name"
                  className="w-full rounded-full border border-ivory-card bg-ivory px-4 py-2 text-sm text-slate outline-none focus:border-sage"
                />
                <button
                  onClick={() => save({ agencyWritein })}
                  className="inline-flex items-center gap-1 rounded-full border border-sage/40 bg-ivory px-3 py-1.5 text-xs font-semibold text-sage hover:border-sage"
                >
                  <Check className="h-3.5 w-3.5" /> Save
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <p className="mt-4 text-[11px] text-slate/60">
          Your username, discipline, and agency stay on this device. They're
          attached to your anonymous ballot — not to your email, name, or
          employer login.
        </p>
      </div>
    </section>
  );
}
