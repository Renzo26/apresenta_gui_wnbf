import { cn } from "@/lib/utils";

/** Rótulo de seção no estilo "— 01 · Método". */
export function Eyebrow({ index, children, className }: { index?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.28em] text-steel", className)}>
      <span aria-hidden className="h-px w-8 bg-current opacity-60" />
      {index && <span className="font-serif text-base italic tracking-normal">{index}</span>}
      <span>{children}</span>
    </p>
  );
}
