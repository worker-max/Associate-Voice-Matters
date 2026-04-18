import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { WingBadge } from "@/components/brand/WingBadge";

type Props = {
  eyebrow: string;
  headline: string;
  subhead: string;
  stats: { label: string; value: string }[];
};

export function VerticalHero({ eyebrow, headline, subhead, stats }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-mist via-ivory to-ivory" />
      <div className="container-warm py-20 md:py-24">
        <span className="tag">
          <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
        </span>
        <div className="mt-6 grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="max-w-2xl">{headline}</h1>
            <p className="mt-6 max-w-xl text-lg text-slate/80">{subhead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/channel/signup" className="btn-primary">
                Start free on Channel <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/envoy" className="btn-envoy">
                Explore Envoy
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 text-sm">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-[0.2em] text-sage">
                    {s.label}
                  </dt>
                  <dd className="mt-1 font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col items-start gap-4">
            <WingBadge wing="channel" />
            <WingBadge wing="envoy" />
            <p className="mt-2 max-w-sm text-sm text-slate/70">
              Both wings, same platform. Stay anonymous as long as you want.
              Unlock Envoy only when you're ready — success-fee only, no
              out-of-pocket cost.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
