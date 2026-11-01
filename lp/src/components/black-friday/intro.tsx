"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";

gsap.registerPlugin(useGSAP);

/** Duração total da intro da Black — o hero sincroniza a entrada com este valor. */
export const BF_INTRO_DURATION = 1.5;

/** Mesma intro da LP, em amarelo: "BLACK" sobe letra por letra e a cortina sobe. */
export function BfIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const running = useRef(true);
  const lenisRef = useRef(lenis);

  // o Lenis pode inicializar depois da intro começar
  useEffect(() => {
    lenisRef.current = lenis;
    if (!lenis) return;
    if (running.current) lenis.stop();
    else lenis.start();
  }, [lenis]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        running.current = false;
        gsap.set(ref.current, { display: "none" });
        return;
      }
      window.scrollTo(0, 0);
      gsap
        .timeline({
          onComplete: () => {
            running.current = false;
            lenisRef.current?.start();
            gsap.set(ref.current, { display: "none" });
          },
        })
        .from(".intro-letter", { yPercent: 115, duration: 0.7, ease: "expo.out", stagger: 0.06 })
        .from(".intro-tag", { autoAlpha: 0, y: 10, duration: 0.4, ease: "power2.out" }, "-=0.35")
        .to(".intro-inner", { autoAlpha: 0, y: -30, duration: 0.35, ease: "power2.in" }, "+=0.1")
        .to(ref.current, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "expo.inOut" }, "-=0.2");
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="grain fixed inset-0 z-[100] grid place-items-center bg-ouro text-carvao"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div className="intro-inner flex flex-col items-center">
        <span className="flex overflow-hidden font-display text-[clamp(5rem,20vw,13rem)] leading-[0.95]">
          {"BLACK".split("").map((l, i) => (
            <span key={i} className="intro-letter inline-block">
              {l}
            </span>
          ))}
        </span>
        <span className="intro-tag mt-1 text-xs font-bold uppercase tracking-[0.5em]">Friday · DLM Team</span>
      </div>
    </div>
  );
}
