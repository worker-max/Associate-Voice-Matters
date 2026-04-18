import Link from "next/link";
import { ArrowRight, Lock, Mail, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { WingBadge } from "@/components/brand/WingBadge";

export const metadata = {
  title: "Channel — Anonymous feedback, always free",
  description:
    "Channel lets any associate create an account with just an email and share structured, AI-moderated feedback with their employer. Identity stays encrypted unless the associate chooses to unlock it.",
};

const seesTable = [
  ["Email address", "Yes", "Never", "Encrypted anchor only"],
  ["Feedback content", "Yes", "Yes — structured", "Yes"],
  ["NPI / credentials", "Yes", "Only if shared", "Verified, isolated table"],
  ["Real name", "Yes", "Only if unlocked", "Encrypted, separate table"],
  ["Compensation data", "Yes", "Aggregated only", "Full — de-identified"],
];

export default function ChannelPage() {
  return (
    <>
      <section className="container-warm py-20">
        <WingBadge wing="channel" />
        <h1 className="mt-6 max-w-3xl">
          Speak up without signing up for trouble.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate/80">
          Channel is the safe, free entry point. Create an account with just
          an email — no employer code, no credentials, no cost. Your identity
          is encrypted and separated from employer-visible data at the
          architecture level.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/channel/signup" className="btn-primary">
            Start free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/how-it-works" className="btn-secondary">
            See the flow
          </Link>
        </div>
      </section>

      <section className="container-warm py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <Feature
            icon={Mail}
            title="Email-only signup"
            body="No employer permission. No credential check. One field and you're in."
          />
          <Feature
            icon={Sparkles}
            title="AI structures your feedback"
            body="Raw thoughts become a professional, actionable case — ready for the employer to receive."
          />
          <Feature
            icon={MessageCircle}
            title="Two-way, still anonymous"
            body="Employers can respond directly without ever knowing who you are. You stay in control."
          />
          <Feature
            icon={Lock}
            title="Identity toggle on your terms"
            body="Flip from anonymous to known anytime. AI may suggest — never force — an unlock."
          />
          <Feature
            icon={ShieldCheck}
            title="Market benchmarks"
            body="See how your pay and conditions compare to the market you actually work in."
          />
          <Feature
            icon={Sparkles}
            title="Minimum valid outcome"
            body="Even if nothing is resolved: you feel heard, and your employer gets actionable signal."
          />
        </div>
      </section>

      <section className="container-warm py-16">
        <h2>Identity architecture — built in, not bolted on.</h2>
        <p className="mt-3 max-w-2xl text-slate/70">
          Privacy isn't a policy page. It's the data model.
        </p>
        <div className="mt-8 overflow-hidden rounded-bubble border border-ivory-card bg-ivory">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist text-xs uppercase tracking-[0.18em] text-sage">
              <tr>
                <th className="px-5 py-3">Data</th>
                <th className="px-5 py-3">Associate sees</th>
                <th className="px-5 py-3">Employer sees</th>
                <th className="px-5 py-3">Platform stores</th>
              </tr>
            </thead>
            <tbody>
              {seesTable.map((row) => (
                <tr
                  key={row[0]}
                  className="border-t border-ivory-card text-slate/85"
                >
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={`px-5 py-3 ${i === 0 ? "font-medium text-slate" : ""}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="container-warm py-16">
        <div className="card-warm bg-slate text-ivory">
          <h2 className="text-ivory">Ready when you are.</h2>
          <p className="mt-3 max-w-xl text-ivory/80">
            If Channel resolves things for you, great. If you want more —
            direct negotiation, placement, or representation — Envoy is one
            deliberate click away, whenever you choose.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/channel/signup" className="btn-primary">
              Start with Channel
            </Link>
            <Link href="/envoy" className="btn-envoy">
              Learn about Envoy
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="card-warm">
      <Icon className="h-5 w-5 text-sage" />
      <div className="mt-4 font-display italic text-xl font-bold">{title}</div>
      <p className="mt-2 text-sm text-slate/75">{body}</p>
    </div>
  );
}
