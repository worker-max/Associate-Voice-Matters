import { Mark } from "./Mark";
import { cn } from "@/lib/cn";

type WordmarkProps = {
  variant?: "primary" | "reversed";
  className?: string;
};

export function Wordmark({ variant = "primary", className }: WordmarkProps) {
  const isReversed = variant === "reversed";
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Mark variant={isReversed ? "on-sage" : "primary"} size={36} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg italic font-bold",
            isReversed ? "text-ivory" : "text-slate"
          )}
        >
          AssociateVoiceMatters
        </span>
        <span
          className={cn(
            "text-[10px] uppercase tracking-[0.22em] font-semibold",
            isReversed ? "text-ivory/70" : "text-sage"
          )}
        >
          Channel · Envoy
        </span>
      </span>
    </span>
  );
}
