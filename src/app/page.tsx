import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  Lock,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { WingBadge } from "@/components/brand/WingBadge";
import { Mark } from "@/components/brand/Mark";

type Vertical = {
  name: string;
  status: string;
  href?: string; // present = live; absent = coming soon (greyed)
};

const verticals: Vertical[] = [
  { name: "Home Health", status: "Live · Skilled / Medicare-certified", href: "/home-health" },
  { name: "Home Hospice", status: "Live · Pulse survey open", href: "/home-hospice" },
  { name: "Home Care", status: "Coming soon · Non-skilled / private duty" },
  { name: "Acute Care Nursing", status: "Coming soon" },
  { name: "Allied Health", status: "Coming soon" },
  { name: "Hospitality", status: "Coming soon" },
  { name: "Retail", status: "Coming soon" },
  { name: "Education", status: "Coming soon" },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-mist via-ivory to-ivory" />
        <div className="container-warm grid gap-16 py-20 md:grid-cols-[1.15fr_1fr] md:py-28">
          <div>
            <span className="tag">
              <Sparkles className="h-3.5 w-3.5" /> Independent · Neutral ·
              Resolution-first
            </span>
            <h1 className="mt-6">
              Every voice matters.
              <br />
              <span className="text-sage">Especially yours.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate/80">
              A trusted, neutral place for any associate — in any industry — to
              speak, be heard, and be represented by AI. Channel is always
              free. Envoy is success-fee only. Associates never pay out of
              pocket.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/channel/signup" className="btn-primary">
                Share feedback anonymously <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/envoy" className="btn-envoy">
                Meet Envoy
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-sage">
                  Signup
                </dt>
                <dd className="mt-1 font-medium">Email only</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-sage">
                  Channel cost
                </dt>
                <dd className="mt-1 font-medium">Free forever</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-sage">
                  Envoy cost
                </dt>
                <dd className="mt-1 font-medium">Only if we win</dd>
              </div>
            </dl>
          </div>
          <div className="relative">
            <div className="card-warm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <WingBadge wing="channel" size="sm" />
                <span className="tag">Anonymous</span>
              </div>
              <p className="mt-6 text-slate/80">
                "My charge nurse never follows up on shift concerns, and the
                ratio on night shift is unsafe. I want to say something, but I
                can't risk my job."
              </p>
              <div className="mt-6 rounded-2xl border border-sage/20 bg-mist p-4 text-sm text-slate/80">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sage">
                  <Sparkles className="h-3.5 w-3.5" /> AI structured this
                </div>
                <p className="mt-2">
                  A night-shift RN raised a staffing-ratio safety concern and
                  an escalation-loop gap. Requesting a neutral review with
                  leadership. Identity withheld.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-slate/60">
                  Delivered to employer
                </span>
                <Mark size={28} />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 rotate-3">
              <WingBadge wing="envoy" size="sm" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-warm py-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="tag">Two wings, one platform</span>
            <h2 className="mt-3">Pick the level of voice you want.</h2>
          </div>
          <p className="max-w-md text-slate/70">
            Start anonymous with Channel. Unlock identity and representation
            with Envoy — only when you decide, only if you want to.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Link href="/channel" className="group card-warm hover:shadow-lift">
            <WingBadge wing="channel" />
            <h3 className="mt-6">Be heard — without being known.</h3>
            <p className="mt-3 text-slate/70">
              Create an account with just an email. AI structures your raw
              feedback into a professional, actionable case. Your employer can
              respond without ever seeing who you are.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-slate/80">
              <Item icon={Lock} label="Identity encrypted at the schema level" />
              <Item icon={HeartHandshake} label="Two-way communication, still anonymous" />
              <Item icon={ShieldCheck} label="Minimum valid outcome: you feel heard" />
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sage group-hover:gap-3 transition-all">
              Explore Channel <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
          <Link
            href="/envoy"
            className="group card-warm border-slate/10 bg-slate text-ivory hover:shadow-lift"
          >
            <WingBadge wing="envoy" />
            <h3 className="mt-6 text-ivory">
              Be represented — by AI that works only for you.
            </h3>
            <p className="mt-3 text-ivory/80">
              Unlock your identity when you're ready to negotiate a raise, a
              retention bonus, or a new placement. AI builds the case from real
              market data. You approve every message before it sends.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-ivory/80">
              <Item
                icon={UserRound}
                label="Identity unlock is always associate-controlled"
                tone="dark"
              />
              <Item
                icon={Sparkles}
                label="Success-fee only — no outcome, no fee"
                tone="dark"
              />
              <Item
                icon={ShieldCheck}
                label="NPI verification prevents circumvention"
                tone="dark"
              />
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold group-hover:gap-3 transition-all">
              Explore Envoy <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </section>

      <section className="container-warm py-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="tag">Universal by design</span>
            <h2 className="mt-3">Home Health first. Home Hospice next. Every vertical after.</h2>
          </div>
          <p className="max-w-md text-slate/70">
            We're launching on the two verticals where our founding team's
            experience runs deepest. Every other industry follows via a plug-in
            module registry — no core rewrites.
          </p>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {verticals.map((v) =>
            v.href ? (
              <Link
                key={v.name}
                href={v.href}
                className="group rounded-bubble border border-sage/30 bg-ivory p-5 shadow-warm transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-sage">
                  <span className="relative inline-flex">
                    <span className="h-2 w-2 rounded-full bg-sage" />
                    <span className="absolute inset-0 animate-ping rounded-full bg-sage/60" />
                  </span>
                  {v.status}
                </div>
                <div className="mt-2 font-display italic text-xl font-bold text-slate">
                  {v.name}
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sage group-hover:gap-2 transition-all">
                  Open vertical <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ) : (
              <div
                key={v.name}
                className="rounded-bubble border border-ivory-card bg-ivory/60 p-5 opacity-60"
                aria-label={`${v.name} — coming soon`}
              >
                <div className="text-xs uppercase tracking-[0.2em] text-slate/50">
                  {v.status}
                </div>
                <div className="mt-2 font-display italic text-xl font-bold text-slate/70">
                  {v.name}
                </div>
                <div className="mt-3 text-xs text-slate/50">
                  Plug-in module · TBD
                </div>
              </div>
            )
          )}
        </div>
      </section>

      <section className="container-warm py-16">
        <div className="card-warm grid gap-8 bg-mist md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <span className="tag">The founding principle</span>
            <h2 className="mt-3">
              The kid in the cafeteria who sits at every lunch table.
            </h2>
            <p className="mt-4 text-slate/80">
              Friendly to every employer, every associate, every situation.
              Never adversarial. Always resolution-first. We advocate for the
              associate, and we work with employers to make workplaces better —
              not to tear them down.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/how-it-works" className="btn-primary w-fit">
              How it works <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/for-employers" className="btn-secondary w-fit">
              For employers
            </Link>
            <p className="text-xs text-slate/60">
              Built independently. Future data bridge to TalkAIQ.com —
              API-only, consent-required.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Item({
  icon: Icon,
  label,
  tone = "light",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tone?: "light" | "dark";
}) {
  return (
    <li className="flex items-start gap-2">
      <Icon
        className={`mt-0.5 h-4 w-4 ${tone === "dark" ? "text-gold" : "text-sage"}`}
      />
      <span>{label}</span>
    </li>
  );
}
