import Link from "next/link";
import { HeartPulse, MapPin, ShieldCheck } from "lucide-react";
import { VerticalHero } from "@/components/verticals/VerticalHero";
import { SurveyBlock } from "@/components/survey/SurveyBlock";
import { ProfileBar } from "@/components/survey/ProfileBar";
import { homeHealthSurvey } from "@/content/surveys/home-health";
import { HOME_HEALTH_AGENCIES } from "@/content/agencies/home-health";

export const metadata = {
  title: "Home Health — AssociateVoiceMatters",
  description:
    "A neutral platform for home health clinicians and staff. Anonymous feedback on Channel. AI advocacy on Envoy. Plus a live pulse survey built by home health associates.",
};

export default function HomeHealthPage() {
  return (
    <>
      <VerticalHero
        eyebrow="Home Health · Live"
        headline="Home health runs on miles and moments. Your voice should carry."
        subhead="Share an anonymous case through Channel. When you're ready to negotiate pay, mileage, caseload, or placement, unlock Envoy — success-fee only, never out-of-pocket."
        stats={[
          { label: "Entry cost", value: "Email only" },
          { label: "Channel", value: "Free forever" },
          { label: "Envoy", value: "Only if we win" },
        ]}
      />

      <ProfileBar vertical="home-health" agencies={HOME_HEALTH_AGENCIES} />

      <section className="container-warm py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <Feature
            icon={MapPin}
            title="Built for the field"
            body="Visit volume, OASIS, mileage, on-call — structured by AI into clear, actionable feedback for your employer."
          />
          <Feature
            icon={HeartPulse}
            title="Market benchmarks by region"
            body="See where your pay and stipends sit against your actual market. Contribute your own rate to strengthen the signal for everyone."
          />
          <Feature
            icon={ShieldCheck}
            title="NPI-anchored identity"
            body="When you unlock Envoy, NPI verification confirms your credentials — and prevents recruiter circumvention for 12 months."
          />
        </div>
      </section>

      <SurveyBlock survey={homeHealthSurvey} />

      <section className="container-warm py-16">
        <div className="card-warm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3>Ready to be heard?</h3>
            <p className="mt-2 max-w-md text-slate/70">
              Channel is free forever and anonymous by default. Start there —
              Envoy is one deliberate click away when you're ready.
            </p>
          </div>
          <Link href="/channel/signup" className="btn-primary">
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
