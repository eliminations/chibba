"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CHIBBA, NAV_LINKS } from "@/lib/constants";
import { CHIBBA_IMG } from "@/lib/images";
import { CopyAddress } from "@/components/effects/copy-address";
import { Reveal } from "@/components/motion/reveal";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer
      id="join"
      className="relative overflow-hidden border-t border-white/5 bg-deep"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,184,65,0.1),transparent_70%)] blur-2xl" />

      <div className="container relative py-20">
        <Reveal className="flex flex-col items-center text-center">
          <motion.span
            className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-full ring-1 ring-amber/40 shadow-glow"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src={CHIBBA_IMG.footerAvatar}
              alt="Chibba"
              className="h-full w-full scale-110 object-cover"
              draggable={false}
            />
          </motion.span>

          <p className="mt-6 font-display text-sm tracking-[0.6em] text-amber/60">
            RETURN TO THE HIVE
          </p>
          <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-gradient-gold md:text-5xl">
            THE HIVE NEVER SLEEPS
          </h3>

          <div className="mt-8 w-full max-w-md">
            <CopyAddress value={CHIBBA.contract} truncate className="w-full justify-center" />
          </div>

          <div className="mt-8 flex items-center gap-4">
            <a
              href={CHIBBA.links.twitter}
              target="_blank"
              rel="noreferrer"
              aria-label="X / Twitter"
              className="grid h-12 w-12 place-items-center rounded-full glass-amber text-hive transition-transform hover:scale-110 hover:shadow-glow"
            >
              <XIcon className="h-5 w-5" />
            </a>
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-display text-xs tracking-[0.3em] text-foreground/50">
              Goon now · Bzz
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-5">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs tracking-widest text-foreground/40 transition-colors hover:text-hive"
              >
                {l.label.toUpperCase()}
              </Link>
            ))}
          </nav>

          <p className="text-xs tracking-widest text-foreground/30">
            © {new Date().getFullYear()} CHIBBA · STILL BUZZING
          </p>
        </div>
      </div>
    </footer>
  );
}
