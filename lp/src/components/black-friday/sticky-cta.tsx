"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { CTA_BF, DESCONTO_BF } from "@/lib/black-friday";

/** No celular, mantém o CTA da Black à mão depois que o hero sai da tela (mesmo da LP). */
export function BfStickyCta() {
  const { scrollY } = useScroll();
  const [visivel, setVisivel] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const fim = document.documentElement.scrollHeight - window.innerHeight - 600;
    setVisivel(y > window.innerHeight * 0.85 && y < fim);
  });

  return (
    <AnimatePresence>
      {visivel && (
        <motion.div
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed inset-x-3 bottom-3 z-40 pb-[env(safe-area-inset-bottom)] lg:hidden"
        >
          <div className="flex items-center gap-2 rounded-full bg-carvao/85 p-1.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] ring-1 ring-ouro/20 backdrop-blur-xl">
            <a
              href={CTA_BF}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-full bg-ouro py-3.5 text-center text-sm font-extrabold uppercase tracking-[0.08em] text-carvao active:scale-[0.98]"
            >
              Garantir {DESCONTO_BF}% OFF
            </a>
            <a href="#planos" className="rounded-full px-4 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-bone/80">
              Planos
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
