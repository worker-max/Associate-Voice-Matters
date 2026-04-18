import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";

const links = [
  { href: "/home-health", label: "Home Health", live: true },
  { href: "/home-hospice", label: "Home Hospice", live: true },
  { href: "/channel", label: "Channel" },
  { href: "/envoy", label: "Envoy" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-employers", label: "For employers" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ivory-card/70 bg-ivory/85 backdrop-blur">
      <nav className="container-warm flex items-center justify-between py-4">
        <Link href="/" aria-label="AssociateVoiceMatters home">
          <Wordmark />
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-1.5 text-sm font-medium text-slate/80 transition hover:text-sage"
            >
              {l.live ? (
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-sage/60" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-sage" />
                </span>
              ) : null}
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/channel/signup" className="btn-primary text-sm">
            Start free
          </Link>
        </div>
      </nav>
    </header>
  );
}
