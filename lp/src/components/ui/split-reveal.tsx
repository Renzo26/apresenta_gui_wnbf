"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** atraso em segundos (útil para sincronizar com a intro) */
  delay?: number;
  /** anima ao entrar na viewport; se false, anima ao montar */
  onScroll?: boolean;
};

/** Revela o texto linha a linha, subindo de dentro de uma máscara. */
export function SplitReveal({ as: Tag = "h2", children, className, delay = 0, onScroll = true }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      document.fonts.ready.then(() => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line-inner",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { autoAlpha: 1 });
            return gsap.from(self.lines, {
              yPercent: 110,
              rotate: 2,
              duration: 1.15,
              ease: "expo.out",
              stagger: 0.09,
              delay,
              scrollTrigger: onScroll ? { trigger: el, start: "top 88%", once: true } : undefined,
            });
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
