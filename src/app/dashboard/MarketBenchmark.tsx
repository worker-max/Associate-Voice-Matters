"use client";

import { useState } from "react";
import { Loader2, Plus, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc-client";

const RATE_TYPES = ["HOURLY", "UNIT", "SALARY", "STIPEND", "MILEAGE"] as const;

export function MarketBenchmark() {
  const [role, setRole] = useState("");
  const [region, setRegion] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [rateType, setRateType] = useState<(typeof RATE_TYPES)[number]>("HOURLY");
  const [myRate, setMyRate] = useState("");
  const [contributionStatus, setContributionStatus] = useState<
    null | "saved" | "error"
  >(null);

  const benchmark = trpc.compensation.benchmark.useQuery(
    { role, region, facilityType: facilityType || undefined, rateType },
    { enabled: role.length >= 2 && region.length >= 2 }
  );

  const submit = trpc.compensation.submit.useMutation();

  async function contribute() {
    if (!role || !region || !myRate) return;
    setContributionStatus(null);
    try {
      await submit.mutateAsync({
        role,
        region,
        facilityType: facilityType || undefined,
        rate: Number(myRate),
        rateType,
      });
      setContributionStatus("saved");
      setMyRate("");
    } catch {
      setContributionStatus("error");
    }
  }

  const data = benchmark.data;

  return (
    <div className="card-warm">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-sage" />
        <h3>Market position</h3>
      </div>
      <p className="mt-2 text-sm text-slate/70">
        See where your pay sits in your market. Contribute your rate to make
        the benchmark stronger for everyone.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <Field
          label="Role"
          value={role}
          onChange={setRole}
          placeholder="ICU RN"
        />
        <Field
          label="Region"
          value={region}
          onChange={setRegion}
          placeholder="San Antonio, TX"
        />
        <Field
          label="Facility type"
          value={facilityType}
          onChange={setFacilityType}
          placeholder="Level II trauma"
        />
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            Rate type
          </label>
          <select
            value={rateType}
            onChange={(e) => setRateType(e.target.value as typeof rateType)}
            className="mt-2 w-full rounded-full border border-ivory-card bg-ivory px-4 py-2.5 text-sm text-slate outline-none focus:border-sage"
          >
            {RATE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-ivory-card bg-mist p-5">
        {benchmark.isFetching ? (
          <div className="flex items-center gap-2 text-sm text-slate/60">
            <Loader2 className="h-4 w-4 animate-spin" /> Pulling benchmark…
          </div>
        ) : data ? (
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-sage">
              {data.role} · {data.region} · {data.rateType}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
              <Stat label="25th" value={fmt(data.p25)} />
              <Stat label="Median" value={fmt(data.p50)} highlight />
              <Stat label="75th" value={fmt(data.p75)} />
            </div>
            <p className="mt-3 text-xs text-slate/60">
              Based on {data.sampleSize} associate reports.
            </p>
          </div>
        ) : role && region ? (
          <p className="text-sm text-slate/70">
            No benchmark yet for this exact slice. Be the first — contribute
            below and we'll build it.
          </p>
        ) : (
          <p className="text-sm text-slate/70">
            Enter a role and region to see the local benchmark.
          </p>
        )}
      </div>

      <div className="mt-5 border-t border-ivory-card pt-5">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
          Contribute your rate
        </div>
        <p className="mt-1 text-xs text-slate/60">
          De-identified the moment it rolls into the benchmark. Your
          individual record stays under your control.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="number"
            step="0.01"
            value={myRate}
            onChange={(e) => setMyRate(e.target.value)}
            placeholder="Your rate"
            className="w-40 rounded-full border border-ivory-card bg-ivory px-4 py-2 text-sm text-slate outline-none focus:border-sage"
          />
          <button
            onClick={contribute}
            disabled={submit.isPending || !role || !region || !myRate}
            className="btn-secondary"
          >
            {submit.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Contribute
              </>
            )}
          </button>
          {contributionStatus === "saved" ? (
            <span className="text-xs text-sage">Thanks — benchmark is stronger because of you.</span>
          ) : null}
          {contributionStatus === "error" ? (
            <span className="text-xs text-bloom">Save failed. Try again.</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-sage">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-full border border-ivory-card bg-ivory px-4 py-2.5 text-sm text-slate outline-none focus:border-sage"
      />
    </div>
  );
}

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
          ? "rounded-2xl bg-sage px-3 py-3 text-ivory"
          : "rounded-2xl bg-ivory px-3 py-3 text-slate"
      }
    >
      <div className="text-[10px] uppercase tracking-[0.18em] opacity-75">
        {label}
      </div>
      <div className="mt-1 font-display italic text-lg font-bold">{value}</div>
    </div>
  );
}

function fmt(d: { toString(): string } | null | undefined): string {
  if (d === null || d === undefined) return "—";
  const n = Number(d.toString());
  if (!Number.isFinite(n)) return "—";
  return `$${n.toFixed(2)}`;
}
