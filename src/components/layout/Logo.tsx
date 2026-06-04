import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  variant?: "dark" | "light" | "auto";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

const SIZES = {
  sm: { kPad: "px-1.5 py-0.5", ursPad: "px-1 py-0.5", text: "text-sm"  },
  md: { kPad: "px-2 py-0.5",   ursPad: "px-1.5 py-0.5", text: "text-base" },
  lg: { kPad: "px-3 py-1",     ursPad: "px-2 py-1",     text: "text-xl"  },
};

export function Logo({ variant = "auto", size = "md", href = "/", className }: Props) {
  const { kPad, ursPad, text } = SIZES[size];

  const kBg    = variant === "light" ? "bg-[#FAFAF7] text-[#0F0F0F]" : "bg-[#D4402F] text-[#FAFAF7]";
  const ursBg  = variant === "light" ? "bg-transparent text-[#FAFAF7] border-[#FAFAF7]"
               : variant === "dark"  ? "bg-transparent text-[#FAFAF7] border-[#FAFAF7]"
               : "bg-transparent text-[#0F0F0F] border-[#0F0F0F]";

  const inner = (
    <span className={cn("inline-flex items-center select-none", className)}>
      <span
        className={cn("inline-block font-black tracking-tight border-2 border-[#0F0F0F]", kPad, text, kBg)}
        style={{ fontFamily: "var(--font-display)" }}
      >
        К
      </span>
      <span
        className={cn("inline-block font-black tracking-tight border-2 border-l-0", ursPad, text, ursBg)}
        style={{ fontFamily: "var(--font-display)" }}
      >
        УРС
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
