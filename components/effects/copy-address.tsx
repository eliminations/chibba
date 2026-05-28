"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/providers/sound-provider";

export function CopyAddress({
  value,
  className,
  truncate = false,
}: {
  value: string;
  className?: string;
  truncate?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const { play } = useSound();

  const display = truncate
    ? `${value.slice(0, 6)}…${value.slice(-6)}`
    : value;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      play("click");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      onClick={onCopy}
      onMouseEnter={() => play("hover")}
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-amber/20 bg-black/40 px-4 py-2.5 font-mono text-sm text-amber/90 transition-all hover:border-amber/50 hover:bg-amber/5",
        className,
      )}
    >
      <span className="truncate">{display}</span>
      <span className="relative grid h-5 w-5 place-items-center text-hive">
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <Check className="h-4 w-4 text-toxic" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <Copy className="h-4 w-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}
