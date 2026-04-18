import Link from "next/link";
import { Heart, HeartHandshake, ShieldCheck } from "lucide-react";
import { VerticalHero } from "@/components/verticals/VerticalHero";
import { SurveyBlock } from "@/components/survey/SurveyBlock";
import { homeHospiceSurvey } from "@/content/surveys/home-hospice";

export const metadata = {
  title: "Home Hospice — AssociateVoiceMatters",
  description:
    "A neutral platform for hospice clinicians. Anonymous feedback on Channel. AI advocacy on Envoy. Plus a live pulse survey built by hospice associates.",
};

export default function HomeHospicePage() {
  return (
    <>
      <VerticalHero
        eyebrow="Home Hospice · Live"
        headline="The work asks a lot of you. Your voice deserves to be asked, too."
        subhead="Hospice clinicians carry families through their hardest moments. Channel gives you a safe, anonymous place to be heard. Envoy advocates when you're ready for real change — success-fee only, never out-of-pocket."
        stats={[
          { label: "Entry cost", value: "Email only" },
          { label: "Channel", value: "Free forever" },
          { label: "Envoy", value: "Only if we win" },
        ]}
      />

      <section className="container-warm py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <Feature
            icon={Heart}
            title="Hospice-aware moderation"
            body="Emotional weight, bereavement support, caseload intensity — our AI moderator is tuned to the realities of end-of-life care."
          />
          <Feature
            icon={HeartHandshake}
            title="Support data, not platitudes"
            body="See how your PTO, on-call, and caseload actually compare. Contribute yours to strengthen the benchmark for every clinician."
          />
          <Feature
            icon={ShieldCheck}
            title="NPI-anchored identity"
            body="When you unlock Envoy, NPI verification confirms your credentials — and prevents recruiter circumvention for 12 months."
          />
        </div>
      </section>

      <SurveyBlock survey={homeHospiceSurvey} />

      <section className="container-warm py-16">
        <div className="card-warm bg-slate text-ivory flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-ivory">Ready to be heard?</h3>
            <p className="mt-2 max-w-md text-ivory/75">
              Channel is free forever and anonymous by default. Start there —
              Envoy is one deliberate click away when you're ready.
            </p>
          </div>
          <Link href="/channel/signup" className="btn-envoy">
            Start with Channel
          </Link>
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
