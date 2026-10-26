"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "indigo" | "light" | "outline" | "outline-light" | "bronze";
  className?: string;
  external?: boolean;
  icon?: boolean;
};

const variants = {
  indigo: "bg-indigo text-bone",
  bronze: "bg-bronze text-night",
  light: "bg-bone text-night",
  outline: "border border-night/30 text-night hover:text-bone",
  "outline-light": "border border-bone/35 text-bone hover:text-night",
};

const fills = {
  indigo: "bg-bone",
  bronze: "bg-bone",
  light: "bg-indigo-soft",
  outline: "bg-night",
  "outline-light": "bg-bone",
};

// o preenchimento claro troca a cor do texto no hover
const hoverText = {
  indigo: "hover:text-night",
  bronze: "",
  light: "",
  outline: "",
  "outline-light": "",
};

/** Botão em pílula que "puxa" levemente em direção ao cursor. */
export function MagneticButton({ href, children, variant = "indigo", className, external, icon = true }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] transition-colors duration-500",
        variants[variant],
        hoverText[variant],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 translate-y-full rounded-full transition-transform duration-500 ease-(--ease-soft) group-hover:translate-y-0",
          fills[variant],
        )}
      />
      <span>{children}</span>
      {icon && (
        <span className="relative grid size-5 place-items-center overflow-hidden">
          <ArrowUpRight className="size-4 transition-transform duration-500 ease-(--ease-soft) group-hover:-translate-y-5 group-hover:translate-x-5" />
          <ArrowUpRight className="absolute size-4 -translate-x-5 translate-y-5 transition-transform duration-500 ease-(--ease-soft) group-hover:translate-x-0 group-hover:translate-y-0" />
        </span>
      )}
    </motion.a>
  );
}
