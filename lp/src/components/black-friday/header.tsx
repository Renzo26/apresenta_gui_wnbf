"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { useState } from "react";
import { Logo } from "@/components/sections/header";
import { CTA_BF, DESCONTO_BF } from "@/lib/black-friday";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#planos", label: "Planos" },
  { href: "#metodo", label: "Como funciona" },
  { href: "#resultados", label: "Resultados" },
  { href: "#sobre", label: "Sobre" },
  { href: "#duvidas", label: "Dúvidas" },
];

/** Mesmo header da LP: some ao descer, volta ao subir, menu em tela cheia no celular. */
export function BfHeader() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 80);
    setHidden(y > prev && y > 400 && !open);
  });

  const toggle = (value: boolean) => {
    setOpen(value);
    if (value) lenis?.stop();
    else lenis?.start();
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5"
      >
        <nav
          aria-label="Principal"
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-2.5 text-bone transition-all duration-700 ease-(--ease-soft) sm:px-7",
            scrolled ? "bg-carvao/75 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl" : "bg-transparent",
          )}
        >
          <Logo />

          <ul className="hidden items-center gap-7 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group relative text-sm font-medium tracking-wide text-bone/75 transition-colors hover:text-bone">
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-ouro transition-transform duration-500 ease-(--ease-soft) group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={CTA_BF}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-ouro px-5 py-2 text-sm font-bold text-carvao transition-colors duration-300 hover:bg-bone sm:inline-flex"
            >
              Garantir {DESCONTO_BF}% OFF
            </a>
            <button
              type="button"
              onClick={() => toggle(!open)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              className="relative z-[60] grid size-11 place-items-center rounded-full bg-ouro text-carvao lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span className={cn("absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500", open && "translate-y-1.5 rotate-45")} />
                <span className={cn("absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500", open && "-translate-y-1.5 -rotate-45")} />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
            className="grain fixed inset-0 z-40 flex flex-col justify-between gap-8 overflow-y-auto bg-grafite px-6 pb-8 pt-28 text-bone sm:px-10 lg:hidden"
          >
            <ul className="space-y-1">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a href={l.href} onClick={() => toggle(false)} className="block py-1 font-display text-[clamp(2.5rem,12vw,3.75rem)] uppercase leading-tight">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a href={CTA_BF} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ouro py-4 text-center font-bold uppercase tracking-wide text-carvao">
              Garantir {DESCONTO_BF}% OFF
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
