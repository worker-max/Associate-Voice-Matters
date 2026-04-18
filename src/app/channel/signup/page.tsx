import Link from "next/link";
import { ArrowRight, CheckCircle2, Lock, Mail, Sparkles } from "lucide-react";
import { SignupForm } from "./SignupForm";
import { WingBadge } from "@/components/brand/WingBadge";

export const metadata = {
  title: "Start with Channel — anonymous by default",
  description:
    "One field to begin. Your identity is encrypted at the schema level. Employer never sees you unless you choose to unlock.",
};

export default function ChannelSignupPage({
  searchParams,
}: {
  searchParams: { check?: string };
}) {
  const awaitingEmail = searchParams.check === "email";

  return (
    <section className="container-warm py-20">
      <div className="grid gap-12 md:grid-cols-[1.1fr_1fr]">
        <div>
          <WingBadge wing="channel" size="sm" />
          <h1 className="mt-6 max-w-xl">
            One email. Nothing else. Still anonymous.
          </h1>
          <p className="mt-6 max-w-xl text-slate/80">
            Your email is the encrypted anchor we use to recognize you later —
            not a signal your employer ever sees. No employer code, no
            credential check, no credit card.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate/80">
            <Promise
              icon={Lock}
              text="Email is hashed with a pepper; plaintext never touches aggregate data."
            />
            <Promise
              icon={Sparkles}
              text="Raw feedback is structured by AI before your employer sees it."
            />
            <Promise
              icon={CheckCircle2}
              text="Anonymous by default. Identity toggle is yours, always."
            />
          </ul>
          <p className="mt-8 text-xs text-slate/60">
            By continuing you agree to AVM's associate-first{" "}
            <Link href="/about" className="underline">
              privacy commitments
            </Link>
            .
          </p>
        </div>
        <div>
          <div className="card-warm">
            {awaitingEmail ? (
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-sage" />
                <div>
                  <h3>Check your email.</h3>
                  <p className="mt-2 text-sm text-slate/75">
                    We sent a magic sign-in link. It's good for 10 minutes.
                    Close this tab if you like — the link works on any device.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <h3>Start your Channel account</h3>
                <p className="mt-2 text-sm text-slate/75">
                  We'll email you a secure sign-in link. No password to manage,
                  no passwords to breach.
                </p>
                <SignupForm />
                <div className="mt-6 border-t border-ivory-card pt-5 text-xs text-slate/60">
                  Already started?{" "}
                  <Link href="/channel/signup" className="text-sage underline">
                    Send me a new link
                  </Link>
                </div>
              </>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-sage/20 bg-mist px-4 py-3 text-xs text-slate/70">
            <ArrowRight className="h-3.5 w-3.5 text-sage" />
            When you're ready to negotiate or place, Envoy unlocks from your
            dashboard.
          </div>
        </div>
      </div>
    </section>
  );
}

function Promise({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <li className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 text-sage" />
      <span>{text}</span>
    </li>
  );
}
