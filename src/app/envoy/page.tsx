import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Handshake,
  Scale,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { WingBadge } from "@/components/brand/WingBadge";

export const metadata = {
  title: "Envoy — AI Advocacy, success-fee only",
  description:
    "Envoy is the identity-unlocked advocacy wing. When you're ready to negotiate a raise, a retention bonus, or a new placement, AI represents you — and you pay only when you win.",
};

const steps = [
  { n: "01", title: "Choose to unlock", body: "Deliberate, confirmed — never a default." },
  { n: "02", title: "Verify identity", body: "NPI for healthcare. Industry-specific for every other vertical." },
  { n: "03", title: "Intake your situation", body: "Current comp, target, timeline, context — in your own words." },
  { n: "04", title: "AI builds the case", body: "Real market data. Evidence-based argument. Not a template." },
  { n: "05", title: "Advocate engages", body: "AI represents you to the employer or recruiter." },
  { n: "06", title: "You approve everything", body: "Every communication is reviewed by you before it sends." },
  { n: "07", title: "Win, or nothing owed", body: "Success-fee only. No outcome means no fee. Ever." },
];

export default function EnvoyPage() {
  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate/5 via-ivory to-ivory" />
        <div className="container-warm py-20">
          <WingBadge wing="envoy" />
          <h1 className="mt-6 max-w-3xl">
            An advocate that works only for you —
            <span className="text-gold"> and only gets paid if you win.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate/80">
            When you're ready to go beyond anonymous feedback — to negotiate a
            raise, a retention bonus, or a new placement — you unlock Envoy.
            Identity verified. Case built from real market data. You approve
            every step.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/envoy/signup" className="btn-envoy">
              Start an Envoy case <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/channel" className="btn-secondary">
              Not yet — stay anonymous
            </Link>
          </div>
        </div>
      </section>

      <section className="container-warm py-16">
        <h2>Seven steps. You drive every one.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card-warm">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Step {s.n}
              </span>
              <div className="mt-3 font-display italic text-xl font-bold">
                {s.title}
              </div>
              <p className="mt-2 text-sm text-slate/75">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-warm py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-warm bg-slate text-ivory">
            <span className="tag-gold">Revenue model</span>
            <h3 className="mt-3 text-ivory">
              Associates never pay out of pocket.
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-ivory/85">
              <Row
                icon={TrendingUp}
                k="Raise or retention bonus"
                v="Small % of the increase, collected over time — paid by the associate, only after the win."
              />
              <Row
                icon={Briefcase}
                k="Job placement"
                v="15–25% of first-year salary — paid by the hiring employer, never by the associate."
              />
              <Row
                icon={Scale}
                k="No result"
                v="Zero. This is non-negotiable."
              />
              <Row
                icon={Sparkles}
                k="Channel feedback"
                v="Free forever."
              />
            </ul>
          </div>
          <div className="card-warm">
            <span className="tag">Placement — dual channel</span>
            <h3 className="mt-3">Two paths, running simultaneously.</h3>
            <div className="mt-5 rounded-2xl border border-ivory-card bg-mist p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sage">
                <Handshake className="h-4 w-4" /> Channel A — Recruiter
                pass-through
              </div>
              <p className="mt-2 text-sm text-slate/80">
                Referral split of 20–30% of the placement fee. Launch
                strategy. Fee paid by the hiring employer. NPI anchor prevents
                circumvention for 12 months.
              </p>
            </div>
            <div className="mt-4 rounded-2xl border border-ivory-card bg-mist p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sage">
                <Briefcase className="h-4 w-4" /> Channel B — Direct to employer
              </div>
              <p className="mt-2 text-sm text-slate/80">
                For employers with internal recruiting teams. Higher margin,
                longer sales cycle. Placement fee paid directly by the
                employer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-warm py-16">
        <div className="card-warm flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <BadgeCheck className="mt-1 h-6 w-6 text-sage" />
            <div>
              <div className="font-display italic text-xl font-bold">
                NPI verification — healthcare launch
              </div>
              <p className="mt-1 max-w-2xl text-sm text-slate/75">
                Verifies professional status and credentials. Prevents
                post-introduction circumvention for 12 months. NPI-anchored
                records are isolated from anonymized market data at the schema
                level. Non-healthcare verticals use industry-appropriate
                verification defined per plug-in.
              </p>
            </div>
          </div>
          <Link href="/how-it-works" className="btn-primary">
            Full walkthrough
          </Link>
        </div>
      </section>
    </>
  );
}

function Row({
  icon: Icon,
  k,
  v,
}: {
  icon: React.ComponentType<{ className?: string }>;
  k: string;
  v: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-gold" />
      <div>
        <div className="text-sm font-semibold text-gold">{k}</div>
        <div className="text-sm text-ivory/80">{v}</div>
      </div>
    </li>
  );
}
