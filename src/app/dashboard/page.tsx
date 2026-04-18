import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { WingBadge } from "@/components/brand/WingBadge";
import { FeedbackComposer } from "./FeedbackComposer";
import { CasesList } from "./CasesList";
import { MarketBenchmark } from "./MarketBenchmark";

export const metadata = {
  title: "Dashboard",
  description: "Your cases, comp data, and market rates.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/channel/signup");
  }

  const associate = await db.associate.findUnique({
    where: { userId: session.user.id },
    select: { id: true, industry: true, identityStatus: true },
  });

  if (!associate) {
    return (
      <section className="container-warm py-20">
        <h1>Setting up your profile…</h1>
        <p className="mt-4 text-slate/70">Refresh in a moment.</p>
      </section>
    );
  }

  return (
    <>
      <section className="container-warm py-12">
        <span className="tag">Dashboard</span>
        <h1 className="mt-4">Welcome back.</h1>
        <p className="mt-3 max-w-xl text-slate/75">
          Your voice, your cases, your market position — all in one place.
          Anonymous by default. Identity unlock is always your call.
        </p>
      </section>

      <section className="container-warm grid gap-6 pb-8 lg:grid-cols-[1.3fr_1fr]">
        <FeedbackComposer />
        <div className="card-warm bg-slate text-ivory">
          <WingBadge wing="envoy" size="sm" />
          <h3 className="mt-4 text-ivory">Ready for Envoy?</h3>
          <p className="mt-2 text-sm text-ivory/75">
            When you want to negotiate a raise, retention bonus, or new
            placement, unlock Envoy. Your identity gets verified, AI builds
            the case on real market data, and you approve every message.
            Success-fee only.
          </p>
          <Link href="/envoy" className="btn-envoy mt-5 w-fit">
            Learn about Envoy
          </Link>
        </div>
      </section>

      <section className="container-warm pb-8">
        <MarketBenchmark />
      </section>

      <section className="container-warm pb-20">
        <h2>Your cases</h2>
        <div className="mt-6">
          <CasesList />
        </div>
      </section>
    </>
  );
}
