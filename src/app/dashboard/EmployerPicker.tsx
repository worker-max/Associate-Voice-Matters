"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { trpc } from "@/lib/trpc-client";

type Selection = {
  id: string;
  name: string;
  talkaiqPartnerFlag: boolean;
} | null;

export function EmployerPicker({
  onSelect,
}: {
  onSelect: (value: Selection) => void;
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Selection>(null);

  const search = trpc.employer.search.useQuery(
    { q },
    { enabled: q.length >= 2 && !active, staleTime: 5_000 }
  );

  if (active) {
    return (
      <div className="flex items-center justify-between rounded-full border border-sage/30 bg-mist px-4 py-2 text-sm">
        <span className="font-medium text-slate">{active.name}</span>
        <button
          onClick={() => {
            setActive(null);
            onSelect(null);
          }}
          className="text-xs text-slate/60 hover:text-bloom"
          aria-label="Clear employer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-full border border-ivory-card bg-ivory px-4 py-2">
        <Search className="h-4 w-4 text-sage" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Your employer (optional — you can submit without one)"
          className="w-full bg-transparent text-sm text-slate outline-none placeholder:text-slate/50"
        />
      </div>
      {q.length >= 2 && search.data && search.data.length > 0 ? (
        <ul className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-ivory-card bg-ivory shadow-lift">
          {search.data.map((emp) => (
            <li key={emp.id}>
              <button
                onClick={() => {
                  const sel = {
                    id: emp.id,
                    name: emp.name,
                    talkaiqPartnerFlag: emp.talkaiqPartnerFlag,
                  };
                  setActive(sel);
                  setQ(emp.name);
                  onSelect(sel);
                }}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-mist"
              >
                <span className="font-medium text-slate">{emp.name}</span>
                <span className="text-xs text-slate/60">
                  {emp.talkaiqPartnerFlag ? "Partner" : "Neutral routing"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
