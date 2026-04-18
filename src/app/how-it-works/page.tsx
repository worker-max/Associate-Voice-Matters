import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { WingBadge } from "@/components/brand/WingBadge";

export const metadata = {
  title: "How it works",
  description:
    "A full walkthrough of Channel and Envoy. How your feedback moves from raw thought to structured action. Where identity lives. When fees apply — and when they don't.",
};

const channelFlow = [
  { n: "01", t: "Sign up with your email", d: "No employer code. No credential check. Encrypted from the first keystroke." },
  { n: "02", t: "Share what's happening", d: "Type it raw. AI structures your feedback into a clear, actionable case." },
  { n: "03", t: "Decide on identity", d: "Anonymous by default. Unlock only if you want to. The AI will suggest when it could help — never force." },
  { n: "04", t: "Employer receives it", d: "Through neutral moderation. They can respond without knowing who you are." },
  { n: "05", t: "Resolution — or at least, being heard", d: "Minimum valid outcome: you feel heard, and your employer has actionable signal." },
];

const envoyFlow = [
  { n: "01", t: "Deliberate unlock", d: "You choose to unlock identity. Confirmed, informed, reversible until verified." },
  { n: "02", t: "Identity verification", d: "NPI for healthcare. Industry-specific methods elsewhere. Separated from aggregates at the schema level." },
  { n: "03", t: "Situation intake", d: "Current comp. Target. Timeline. Context. Everything the AI needs to represent you accurately." },
  { n: "04", t: "Case construction", d: "AI pulls real market data from the AVM compensation intelligence database. Evidence, not vibes." },
  { n: "05", t: "Advocate engages", d: "AI represents you to the employer or recruiter. Professional. Neutral. Resolution-first." },
  { n: "06", t: "You approve every message", d: "Nothing leaves the platform without your review. You're the principal. AI is your agent." },
  { n: "07", t: "Outcome or nothing owed", d: "Success fee only. No raise? No placement? No fee. Ever." },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="container-warm py-20">
        <span className="tag">Full walkthrough</span>
        <h1 className="mt-4 max-w-3xl">
          From raw feeling to real outcome.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate/80">
          Every associate's journey starts the same way — a moment of wanting
          to say something. Here's exactly what happens from that moment on,
          on both wings.
        </p>
      </section>

      <section className="container-warm py-10">
        <WingBadge wing="channel" />
        <h2 className="mt-5">Channel flow</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {channelFlow.map((s) => (
            <div key={s.n} className="card-warm">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
                Step {s.n}
              </div>
              <div className="mt-2 font-display italic text-lg font-bold">
                {s.t}
              </div>
              <p className="mt-2 text-sm text-slate/75">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-warm py-10">
        <WingBadge wing="envoy" />
        <h2 className="mt-5">Envoy flow</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {envoyFlow.map((s) => (
            <div
              key={s.n}
              className="rounded-bubble border border-slate/10 bg-slate p-6 text-ivory shadow-warm"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Step {s.n}
              </div>
              <div className="mt-2 font-display italic text-lg font-bold text-ivory">
                {s.t}
              </div>
              <p className="mt-2 text-sm text-ivory/75">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-warm py-16">
        <h2>Revenue — transparent by design.</h2>
        <div className="mt-8 overflow-hidden rounded-bubble border border-ivory-card bg-ivory">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist text-xs uppercase tracking-[0.18em] text-sage">
              <tr>
                <th className="px-5 py-3">Outcome</th>
                <th className="px-5 py-3">Fee</th>
                <th className="px-5 py-3">Paid by</th>
              </tr>
            </thead>
            <tbody className="text-slate/85">
              <tr className="border-t border-ivory-card">
                <td className="px-5 py-3 font-medium text-slate">
                  Raise or retention bonus
                </td>
                <td className="px-5 py-3">Small % of the increase, collected over time</td>
                <td className="px-5 py-3">Associate — post-win only</td>
              </tr>
              <tr className="border-t border-ivory-card">
                <td className="px-5 py-3 font-medium text-slate">
                  Job placement
                </td>
                <td className="px-5 py-3">15–25% of first-year salary</td>
                <td className="px-5 py-3">Hiring employer</td>
              </tr>
              <tr className="border-t border-ivory-card">
                <td className="px-5 py-3 font-medium text-slate">No result</td>
                <td className="px-5 py-3">Zero</td>
                <td className="px-5 py-3">—</td>
              </tr>
              <tr className="border-t border-ivory-card">
                <td className="px-5 py-3 font-medium text-slate">
                  Channel feedback
                </td>
                <td className="px-5 py-3">Free forever</td>
                <td className="px-5 py-3">—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6 inline-flex items-start gap-3 rounded-2xl border border-sage/20 bg-mist p-5">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-sage" />
          <p className="text-sm text-slate/85">
            Associates never pay out of pocket under any circumstance. Success
            fees apply only when Envoy delivers a concrete outcome.
          </p>
        </div>
      </section>

      <section className="container-warm py-16">
        <div className="card-warm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3>Ready to be heard?</h3>
            <p className="mt-2 max-w-md text-slate/70">
              Channel is free forever. Start there. Envoy is there when — and
              if — you want more.
            </p>
          </div>
          <Link href="/channel/signup" className="btn-primary">
            Start with Channel <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
