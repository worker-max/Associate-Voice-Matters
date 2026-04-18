import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { WingBadge } from "@/components/brand/WingBadge";

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
    include: {
      cases: { orderBy: { updatedAt: "desc" }, take: 10 },
    },
  });

  if (!associate) {
    // Rare — adapter created a User but the createUser event hasn't run.
    return (
      <section className="container-warm py-20">
        <h1>Setting up your profile…</h1>
        <p className="mt-4 text-slate/70">Refresh in a moment.</p>
      </section>
    );
  }

  return (
    <>
      <section className="container-warm py-16">
        <span className="tag">Dashboard</span>
        <h1 className="mt-4">Welcome back.</h1>
        <p className="mt-3 max-w-xl text-slate/75">
          Your voice, your cases, your market position — all in one place.
          Anonymous by default. Identity unlock is always your call.
        </p>
      </section>

      <section className="container-warm grid gap-6 pb-16 md:grid-cols-2">
        <div className="card-warm">
          <WingBadge wing="channel" size="sm" />
          <h3 className="mt-4">Open a Channel case</h3>
          <p className="mt-2 text-sm text-slate/70">
            Share anonymous, AI-structured feedback with your employer.
          </p>
          <Link href="/channel/signup" className="btn-primary mt-5 w-fit">
            Start a case
          </Link>
        </div>
        <div className="card-warm bg-slate text-ivory">
          <WingBadge wing="envoy" size="sm" />
          <h3 className="mt-4 text-ivory">Unlock Envoy</h3>
          <p className="mt-2 text-sm text-ivory/75">
            Ready to negotiate a raise or a new placement? AI advocates —
            success-fee only.
          </p>
          <Link href="/envoy" className="btn-envoy mt-5 w-fit">
            Explore Envoy
          </Link>
        </div>
      </section>

      <section className="container-warm pb-20">
        <h2>Your cases</h2>
        {associate.cases.length === 0 ? (
          <p className="mt-4 text-slate/70">
            No cases yet. When you open one, it appears here.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-ivory-card rounded-bubble border border-ivory-card bg-ivory">
            {associate.cases.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-sage">
                    {c.wing} · {c.status}
                  </div>
                  <div className="mt-1 font-medium">
                    {c.anonymousFlag ? "Anonymous" : "Identity unlocked"}
                  </div>
                </div>
                <div className="text-xs text-slate/60">
                  Updated {c.updatedAt.toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
