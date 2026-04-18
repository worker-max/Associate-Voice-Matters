import Link from "next/link";
import { Mark } from "@/components/brand/Mark";

const groups = [
  {
    heading: "Platform",
    links: [
      { href: "/channel", label: "Channel" },
      { href: "/envoy", label: "Envoy" },
      { href: "/how-it-works", label: "How it works" },
    ],
  },
  {
    heading: "Employers",
    links: [
      { href: "/for-employers", label: "For employers" },
      { href: "/contact", label: "Partnership inquiries" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ivory-card bg-slate text-ivory">
      <div className="container-warm grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Mark variant="reversed" size={44} />
            <div>
              <div className="font-display italic text-lg font-bold">
                AssociateVoiceMatters
              </div>
              <div className="text-xs uppercase tracking-[0.22em] text-ivory/60">
                Channel · Envoy
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm text-ivory/70">
            A neutral platform where any associate — in any industry — can be
            heard and represented. Independent. Resolution-first.
          </p>
          <p className="mt-5 text-xs uppercase tracking-[0.22em] text-gold">
            Every voice matters. Especially yours.
          </p>
        </div>
        {groups.map((g) => (
          <div key={g.heading}>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ivory/60">
              {g.heading}
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {g.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-ivory/80 transition hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-warm flex flex-col items-start justify-between gap-3 py-6 text-xs text-ivory/60 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} AssociateVoiceMatters</span>
          <span>associatevoicematters.com</span>
        </div>
      </div>
    </footer>
  );
}
