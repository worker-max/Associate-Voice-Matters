import Link from "next/link";
import { ArrowRight, Building2, Network, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "For employers",
  description:
    "AssociateVoiceMatters is neutral ground. We advocate for associates and we work with employers to deliver structured, actionable feedback. Partnership is optional — the platform works either way.",
};

const tiers = [
  {
    tag: "Non-partner (default at launch)",
    title: "You receive structured feedback — through neutral moderation.",
    body: "Associate identity is fully protected. AVM's AI layer moderates and structures the case so you get actionable signal, not raw venting. After a case closes, we invite you into partnership — it's always optional.",
    features: [
      "Structured, AI-moderated feedback delivery",
      "Two-way response channel — you reply without needing identity",
      "Post-case partnership invitation",
      "No upfront contracts, no subscription",
    ],
    cta: { label: "Learn how cases arrive", href: "/how-it-works" },
    tone: "light" as const,
  },
  {
    tag: "Future — TalkAIQ partner",
    title: "Full workforce intelligence via the TalkAIQ data bridge.",
    body: "When AVM connects with TalkAIQ.com, partnered employers receive richer moderation, cross-platform associate recognition, and shared compensation intelligence — all API-driven, all consent-gated. Until the bridge ships, every employer operates as non-partner.",
    features: [
      "API-only data bridge — never direct DB access",
      "Consent-required from each associate",
      "NPI-anchored identity across platforms",
      "Shared advocacy intelligence microservice",
    ],
    cta: { label: "Bridge design intent", href: "#bridge" },
    tone: "dark" as const,
  },
];

export default function ForEmployersPage() {
  return (
    <>
      <section className="container-warm py-20">
        <span className="tag">For employers</span>
        <h1 className="mt-4 max-w-3xl">
          We're not adversarial. We're the kid at every lunch table.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate/80">
          AVM is resolution-first and neutral by design. We give associates a
          trusted place to be heard. We give employers structured, actionable
          feedback they can actually use. That's it. No ambushes, no gotchas.
        </p>
      </section>

      <section className="container-warm py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Benefit
            icon={Sparkles}
            title="AI-structured feedback"
            body="You don't get raw text dumps. You get a clean, actionable case with context, tags, and a confidence-gated signal."
          />
          <Benefit
            icon={ShieldCheck}
            title="Neutral moderation"
            body="Every case passes through a moderator tuned to be friendly to both sides. Escalation is a last resort."
          />
          <Benefit
            icon={Building2}
            title="Two-way without identity"
            body="Respond directly to associates without ever needing to know who they are. Resolution without exposure."
          />
        </div>
      </section>

      <section className="container-warm py-16">
        <h2>Two modes. One platform.</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {tiers.map((t) => (
            <div
              key={t.tag}
              className={
                t.tone === "dark"
                  ? "card-warm bg-slate text-ivory"
                  : "card-warm"
              }
            >
              <span className={t.tone === "dark" ? "tag-gold" : "tag"}>
                {t.tag}
              </span>
              <h3
                className={`mt-3 ${t.tone === "dark" ? "text-ivory" : ""}`}
              >
                {t.title}
              </h3>
              <p
                className={`mt-3 ${t.tone === "dark" ? "text-ivory/80" : "text-slate/75"}`}
              >
                {t.body}
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-2 ${t.tone === "dark" ? "text-ivory/85" : "text-slate/85"}`}
                  >
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${t.tone === "dark" ? "bg-gold" : "bg-sage"}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={t.cta.href}
                className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${t.tone === "dark" ? "text-gold" : "text-sage"}`}
              >
                {t.cta.label} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="bridge" className="container-warm py-16">
        <div className="card-warm bg-mist">
          <div className="flex items-start gap-4">
            <Network className="mt-1 h-6 w-6 text-sage" />
            <div>
              <span className="tag">Bridge preview</span>
              <h2 className="mt-3">The future TalkAIQ bridge — by design.</h2>
              <p className="mt-3 max-w-2xl text-slate/80">
                AssociateVoiceMatters launches independently. When the data
                bridge to TalkAIQ.com is built, it runs on three non-negotiable
                principles: (1) API-only traffic, never direct cross-database
                access; (2) associate consent required for every data crossing;
                (3) NPI as the universal, anchored identifier. The
                partner-flag is already wired in the employer model — inactive
                until the bridge ships.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-warm py-16">
        <div className="card-warm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3>Want to partner early?</h3>
            <p className="mt-2 max-w-md text-slate/70">
              Reach the team and we'll walk you through what partnership looks
              like once the TalkAIQ bridge activates.
            </p>
          </div>
          <Link href="/contact" className="btn-primary">
            Talk to us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function Benefit({
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
