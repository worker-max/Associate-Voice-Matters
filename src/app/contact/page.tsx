import { Building2, Mail, ShieldCheck, Scale } from "lucide-react";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with the AssociateVoiceMatters team. Each inquiry type has a dedicated inbox so you reach the right person quickly.",
};

const contacts = [
  {
    icon: Mail,
    heading: "General",
    email: "hello@associatevoicematters.com",
    body: "Questions, feedback, anything else. We read every message.",
  },
  {
    icon: Building2,
    heading: "Employer partnerships",
    email: "employers@associatevoicematters.com",
    body: "Interested in how partnership works, now or when the TalkAIQ bridge ships.",
  },
  {
    icon: ShieldCheck,
    heading: "Privacy & data",
    email: "privacy@associatevoicematters.com",
    body: "Identity, data handling, NPI, or anything about how information moves through the platform.",
  },
  {
    icon: Scale,
    heading: "Legal",
    email: "legal@associatevoicematters.com",
    body: "Success-fee agreements, employment law, state-by-state questions.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="container-warm py-20">
        <span className="tag">Contact</span>
        <h1 className="mt-4 max-w-3xl">
          Reach the right person on the first try.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate/80">
          Each inquiry type routes to a dedicated inbox. Pick the one that
          fits — or default to <strong>hello@</strong> if you're not sure.
        </p>
      </section>

      <section className="container-warm py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {contacts.map((c) => (
            <a
              key={c.heading}
              href={`mailto:${c.email}`}
              className="card-warm transition hover:shadow-lift"
            >
              <c.icon className="h-5 w-5 text-sage" />
              <div className="mt-4 font-display italic text-xl font-bold">
                {c.heading}
              </div>
              <div className="mt-1 text-sm font-medium text-sage">
                {c.email}
              </div>
              <p className="mt-3 text-sm text-slate/75">{c.body}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="container-warm py-16">
        <div className="card-warm bg-slate text-ivory">
          <h3 className="text-ivory">Emergencies and safety concerns</h3>
          <p className="mt-3 max-w-2xl text-ivory/80">
            AVM is not an emergency service. If you or a coworker are in
            immediate danger, please contact local emergency services or your
            facility's safety line. For urgent but non-emergency concerns, use
            Channel — structured cases are prioritized by severity signal.
          </p>
        </div>
      </section>
    </>
  );
}
