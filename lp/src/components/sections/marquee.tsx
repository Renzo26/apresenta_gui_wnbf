"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { MARQUEE } from "@/lib/content";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Faixa infinita; acelera e inverte conforme o scroll. Textos e cores mudam por página (ex.: Black Friday). */
export function Marquee({
  itens = MARQUEE,
  className = "bg-indigo text-bone",
  simboloCls = "text-bronze",
}: {
  itens?: string[];
  className?: string;
  simboloCls?: string;
}) {
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

  const row = [...itens, ...itens];

  return (
    <div ref={ref} aria-hidden className={cn("-mx-6 -rotate-[1.5deg] overflow-hidden py-5 sm:py-6", className)}>
      <div className="marquee-track flex w-max">
        {row.map((w, i) => (
          <span key={i} className="flex items-center font-display text-3xl uppercase sm:text-5xl">
            <span className="px-6 sm:px-10">{w}</span>
            <span className={cn("text-2xl sm:text-4xl", simboloCls)}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
