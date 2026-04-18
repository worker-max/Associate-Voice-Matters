import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Mark } from "@/components/brand/Mark";

export const metadata = {
  title: "About",
  description:
    "AssociateVoiceMatters exists to give every employee — in every industry — a neutral place to be heard and represented. Healthcare is the launch vertical. Every other industry follows.",
};

export default function AboutPage() {
  return (
    <>
      <section className="container-warm py-20">
        <span className="tag">About</span>
        <h1 className="mt-4 max-w-3xl">
          Built to make speaking up feel safe again.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate/80">
          AssociateVoiceMatters exists because too many employees have real
          things to say and nowhere safe to say them. We're a neutral platform
          that gives any associate — in any industry — a trusted place to be
          heard and, if they choose, represented by AI.
        </p>
      </section>

      <section className="container-warm py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-warm">
            <span className="tag">Founding principle</span>
            <h3 className="mt-3">
              The kid in the cafeteria who sits at every lunch table.
            </h3>
            <p className="mt-3 text-slate/75">
              We're friendly with everybody. Friendly to employers, friendly
              to associates, friendly to recruiters, friendly to industry
              partners. Never adversarial. Always resolution-first. The
              platform only works if every party trusts it.
            </p>
          </div>
          <div className="card-warm bg-mist">
            <span className="tag">Why healthcare first</span>
            <h3 className="mt-3">Because that's where our expertise lives.</h3>
            <p className="mt-3 text-slate/75">
              The founding team comes out of healthcare — nurses, techs,
              allied health professionals, operators. Launching in the vertical
              we understand deepest is how we earn the right to expand. Every
              other industry follows via a plug-in module registry — no core
              rewrites required.
            </p>
          </div>
        </div>
      </section>

      <section className="container-warm py-16">
        <div className="card-warm flex flex-col items-start gap-6 md:flex-row md:items-center">
          <Mark size={96} />
          <div>
            <h2>The mark is "evm" — on purpose.</h2>
            <p className="mt-3 max-w-2xl text-slate/75">
              The lowercase "evm" set in Lora BoldItalic inside a rounded
              speech bubble with a bottom-left tail. The brand equity from
              EmployeeVoiceMatters carries forward. The mark stays consistent
              even as the surface name evolves — because what it stands for
              hasn't changed.
            </p>
          </div>
        </div>
      </section>

      <section className="container-warm py-16">
        <div className="card-warm bg-slate text-ivory">
          <h2 className="text-ivory">Independent. By design.</h2>
          <p className="mt-3 max-w-2xl text-ivory/80">
            AVM is a standalone platform — own repo, own Vercel project, own
            PostgreSQL database, own auth. A future data bridge to TalkAIQ.com
            is designed in: API-only, consent-gated, NPI-anchored. Until that
            bridge ships, AVM is fully self-sufficient. Build first, bridge
            later.
          </p>
          <div className="mt-6">
            <Link href="/how-it-works" className="btn-envoy">
              See how it works <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
