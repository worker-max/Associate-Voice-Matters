import { cn } from "@/lib/cn";

type MarkVariant = "primary" | "reversed" | "on-sage" | "envoy";

type MarkProps = {
  variant?: MarkVariant;
  size?: number;
  className?: string;
  title?: string;
};

/**
 * The AVM mark: lowercase "evm" in Lora BoldItalic inside a rounded speech
 * bubble with a bottom-left tail. Brand equity from EmployeeVoiceMatters
 * carries forward — the text stays "evm" by design.
 */
export function Mark({
  variant = "primary",
  size = 56,
  className,
  title = "AssociateVoiceMatters",
}: MarkProps) {
  const palette = paletteFor(variant);

  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 80 80"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    >
      <title>{title}</title>
      <path
        d="M14 14 H66 A10 10 0 0 1 76 24 V52 A10 10 0 0 1 66 62 H30 L14 76 V24 A10 10 0 0 1 14 14 Z"
        fill={palette.bubble}
        stroke={palette.stroke}
        strokeWidth={palette.strokeWidth}
      />
      <text
        x="40"
        y="48"
        textAnchor="middle"
        fontFamily="Lora, Georgia, serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="28"
        fill={palette.text}
        letterSpacing="-0.5"
      >
        evm
      </text>
    </svg>
  );
}

function paletteFor(variant: MarkVariant) {
  switch (variant) {
    case "reversed":
      return {
        bubble: "#6B9E91",
        text: "#2C3A3F",
        stroke: "transparent",
        strokeWidth: 0,
      };
    case "on-sage":
      return {
        bubble: "#FAF8F3",
        text: "#4A7C6F",
        stroke: "transparent",
        strokeWidth: 0,
      };
    case "envoy":
      return {
        bubble: "#2C3A3F",
        text: "#D4A843",
        stroke: "#D4A843",
        strokeWidth: 2,
      };
    case "primary":
    default:
      return {
        bubble: "#4A7C6F",
        text: "#FAF8F3",
        stroke: "transparent",
        strokeWidth: 0,
      };
  }
}
