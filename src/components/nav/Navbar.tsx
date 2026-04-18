import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";

const links = [
  { href: "/channel", label: "Channel" },
  { href: "/envoy", label: "Envoy" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-employers", label: "For employers" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ivory-card/70 bg-ivory/85 backdrop-blur">
      <nav className="container-warm flex items-center justify-between py-4">
        <Link href="/" aria-label="AssociateVoiceMatters home">
          <Wordmark />
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate/80 transition hover:text-sage"
            >
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
