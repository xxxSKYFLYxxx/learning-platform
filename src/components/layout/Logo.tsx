import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  variant?: "dark" | "light" | "auto";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

const SIZES = {
  sm: { bars: [{ w: 3, h: 8  }, { w: 3, h: 13 }, { w: 3, h: 19 }], gap: "gap-[2px]", text: "text-sm",  wordGap: "gap-2" },
  md: { bars: [{ w: 5, h: 11 }, { w: 5, h: 18 }, { w: 5, h: 28 }], gap: "gap-[3px]", text: "text-base", wordGap: "gap-3" },
  lg: { bars: [{ w: 7, h: 16 }, { w: 7, h: 26 }, { w: 7, h: 40 }], gap: "gap-[4px]", text: "text-2xl",  wordGap: "gap-4" },
};

export function Logo({ variant = "auto", size = "md", href = "/", className }: Props) {
  const { bars, gap, text, wordGap } = SIZES[size];

  const markColor =
    variant === "light" ? "bg-[#FAFAF7]" :
    variant === "dark"  ? "bg-[#D4402F]" :
    "bg-[#D4402F]";

  const wordColor =
    variant === "light" ? "text-[#FAFAF7]" :
    "text-[#0F0F0F]";

  const inner = (
    <span className={cn("flex items-center", wordGap, className)}>
      {/* Ascending bars mark — pure CSS, no SVG */}
      <span className={cn("flex items-end shrink-0", gap)}>
        {bars.map((b, i) => (
          <span
            key={i}
            className={markColor}
            style={{ width: b.w, height: b.h, display: "block" }}
          />
        ))}
      </span>

      {/* Wordmark */}
      <span
        className={cn("font-black tracking-tight leading-none select-none", text, wordColor)}
        style={{ fontFamily: "var(--font-display)" }}
      >
        КУРС
      </span>
    </span>
  );

  return href ? (
    <Link href={href} className="group inline-flex hover:opacity-80 transition-opacity">
      {inner}
    </Link>
  ) : (
    <>{inner}</>
  );
}
