"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Volume2, VolumeX } from "lucide-react";
import { NAV_LINKS, CHIBBA } from "@/lib/constants";
import { CHIBBA_IMG } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { useSound } from "@/components/providers/sound-provider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { enabled, toggle, play } = useSound();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.4, duration: 0.8, ease: "easeOut" }}
      className={cn(
        "fixed inset-x-0 top-0 z-[100] transition-all duration-500",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div
        className={cn(
          "container flex items-center justify-between rounded-full px-4 py-2 transition-all duration-500",
          scrolled ? "glass-amber shadow-glow" : "bg-transparent",
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2"
          onMouseEnter={() => play("hover")}
        >
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full ring-1 ring-amber/40 shadow-glow">
            <img
              src={CHIBBA_IMG.navbarLogo}
              alt="Chibba"
              className="h-full w-full scale-110 object-cover"
              draggable={false}
            />
          </span>
          <span className="font-display text-lg font-bold tracking-[0.25em] text-hive">
            CHIBBA
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onMouseEnter={() => play("hover")}
              className="group relative font-display text-sm tracking-wide text-foreground/70 transition-colors hover:text-hive"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-amber to-neon transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <a
            href={CHIBBA.links.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chibba on X"
            onMouseEnter={() => play("hover")}
            className="grid h-9 w-9 place-items-center rounded-full text-amber/70 transition-colors hover:bg-white/5 hover:text-hive"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[15px] w-[15px]"
              fill="currentColor"
              aria-hidden
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          <a
            href={CHIBBA.links.dexscreener}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chibba on DexScreener"
            onMouseEnter={() => play("hover")}
            className="grid h-9 w-9 place-items-center rounded-full text-amber/70 transition-colors hover:bg-white/5 hover:text-hive"
          >
            <svg
              viewBox="0 0 48 48"
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12.951 10.765c-4.384 7.074.244 15.697-5.366 25.358l4.657-3.436l3.196 5.208l3.23-3.12L24 43.492l5.332-8.715l3.23 3.12l3.196-5.21l4.657 3.437c-5.61-9.66-.982-18.284-5.366-25.358" />
              <path d="m19.89 23.502l-3.424 2.037c4.622.794 6.467 7.03 7.534 12.389c1.067-5.36 2.912-11.595 7.534-12.389l-3.423-2.037c.436-3.3-1.91-6.552-4.111-6.552s-4.547 3.253-4.11 6.552" />
              <path d="M26.522 17.69c4.604-2.337 9.597-6.354 11.318-12.439c-1.07 1.375-2.66 2.767-4.518 3.283a15 15 0 0 0-.685-.66C29.536 5.057 27.25 4.508 24 4.508s-5.536.55-8.637 3.364q-.36.329-.685.661c-1.858-.516-3.449-1.908-4.518-3.283c1.72 6.085 6.714 10.102 11.318 12.44" />
              <path d="M16.049 14.43c-1.098.875-1.352 2.643-.558 3.899c.928 1.47 3.689 2.26 5.117.995m11.343-4.894c1.098.875 1.352 2.643.558 3.899c-.928 1.47-3.689 2.26-5.117.995" />
            </svg>
          </a>

          <a
            href={CHIBBA.links.tensor}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chibba on Tensor"
            onMouseEnter={() => play("hover")}
            className="grid h-9 w-9 place-items-center rounded-full opacity-70 transition-all hover:bg-white/5 hover:opacity-100"
          >
            <img
              src={CHIBBA_IMG.tensorLogo}
              alt="Tensor"
              className="h-[17px] w-[17px] object-contain"
              draggable={false}
            />
          </a>

          <button
            onClick={toggle}
            aria-label={enabled ? "Mute hive audio" : "Enable hive audio"}
            className="grid h-9 w-9 place-items-center rounded-full text-amber/70 transition-colors hover:bg-white/5 hover:text-hive"
          >
            {enabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>

          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex"
            onMouseEnter={() => play("hover")}
          >
            <Link href="/#join">Enter Hive</Link>
          </Button>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="grid h-9 w-9 place-items-center rounded-full text-hive md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="container mt-2 flex flex-col gap-1 rounded-2xl glass-amber p-4 md:hidden"
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 font-display tracking-wide text-foreground/80 transition-colors hover:bg-white/5 hover:text-hive"
              >
                {l.label}
              </Link>
            ))}
            <Button asChild className="mt-2">
              <Link href="/#join" onClick={() => setOpen(false)}>
                Enter Hive
              </Link>
            </Button>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
