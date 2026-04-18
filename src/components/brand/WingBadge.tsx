import { Mark } from "./Mark";
import { cn } from "@/lib/cn";

type Wing = "channel" | "envoy";

type WingBadgeProps = {
  wing: Wing;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const copy: Record<Wing, { title: string; subtitle: string }> = {
  channel: {
    title: "Channel",
    subtitle: "Anonymous Feedback  ·  Always Free",
  },
  envoy: {
    title: "Envoy",
    subtitle: "AI Advocacy  ·  Success-Fee Only",
  },
};

export function WingBadge({ wing, size = "md", className }: WingBadgeProps) {
  const { title, subtitle } = copy[wing];
  const isEnvoy = wing === "envoy";

  const sizes = {
    sm: { mark: 28, title: "text-base", pad: "px-4 py-2" },
    md: { mark: 36, title: "text-lg", pad: "px-5 py-3" },
    lg: { mark: 44, title: "text-xl", pad: "px-6 py-4" },
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 rounded-full shadow-warm",
        sizes.pad,
        isEnvoy ? "bg-slate" : "bg-sage",
        className
      )}
    >
      <Mark variant={isEnvoy ? "envoy" : "on-sage"} size={sizes.mark} />
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-display italic font-bold",
            sizes.title,
            isEnvoy ? "text-gold" : "text-ivory"
          )}
        >
          {title}
        </span>
        <span
          className={cn(
            "text-[10px] uppercase tracking-[0.18em] font-semibold",
            isEnvoy ? "text-gold/70" : "text-ivory/80"
          )}
        >
          {subtitle}
        </span>
      </span>
    </span>
  );
}
