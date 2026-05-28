"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/providers/sound-provider";
import { useIsTouch } from "@/lib/hooks";

type Variant = "default" | "outline" | "toxic";

const styles: Record<Variant, string> = {
  default:
    "bg-amber text-void font-semibold shadow-glow hover:shadow-glow-lg",
  outline:
    "border border-amber/40 bg-amber/5 text-hive hover:border-amber/70 hover:bg-amber/10",
  toxic:
    "border border-toxic/40 bg-toxic/10 text-toxic hover:bg-toxic/20 hover:shadow-toxic",
};

/**
 * Premium magnetic CTA — follows the cursor slightly, distorts on hover,
 * and emits a soft sweeping shine. Falls back to a plain link on touch.
 */
export function CtaButton({
  children,
  href,
  variant = "default",
  icon,
  className,
}: {
  children: React.ReactNode;
  href: string;
  variant?: Variant;
  icon?: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isTouch = useIsTouch();
  const { play } = useSound();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 16 });
  const y = useSpring(my, { stiffness: 220, damping: 16 });
  const rotateX = useTransform(y, [-20, 20], [8, -8]);
  const rotateY = useTransform(x, [-20, 20], [-8, 8]);

  const onMove = (e: React.MouseEvent) => {
    if (isTouch || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 28);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 28);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const isExternal = href.startsWith("http");

  return (
    <motion.a
      ref={ref}
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      onMouseMove={onMove}
      onMouseEnter={() => play("hover")}
      onMouseLeave={reset}
      onClick={() => play("click")}
      style={{ x, y, rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full px-8 font-display text-sm tracking-wide transition-colors will-change-transform",
        styles[variant],
        className,
      )}
    >
      {/* Sweeping shine */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      {icon && (
        <span className="relative [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      )}
      <span className="relative">{children}</span>
    </motion.a>
  );
}
