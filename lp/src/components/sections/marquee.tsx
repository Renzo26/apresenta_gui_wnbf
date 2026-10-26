"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { MARQUEE } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Faixa infinita; acelera e inverte conforme o scroll. */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const loop = gsap.to(".marquee-track", { xPercent: -50, ease: "none", duration: 36, repeat: -1 });

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          const v = self.getVelocity() / 300;
          gsap.to(loop, {
            timeScale: self.direction * Math.max(1, Math.min(Math.abs(v), 6)),
            duration: 0.3,
            overwrite: true,
            onComplete: () => {
              gsap.to(loop, { timeScale: self.direction, duration: 1 });
            },
          });
        },
      });
    },
    { scope: ref },
  );

  const row = [...MARQUEE, ...MARQUEE];

  return (
    <div ref={ref} aria-hidden className="-mx-6 -rotate-[1.5deg] overflow-hidden bg-indigo py-5 text-bone sm:py-6">
      <div className="marquee-track flex w-max">
        {row.map((w, i) => (
          <span key={i} className="flex items-center font-display text-3xl uppercase sm:text-5xl">
            <span className="px-6 sm:px-10">{w}</span>
            <span className="text-2xl text-bronze sm:text-4xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
