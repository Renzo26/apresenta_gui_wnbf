import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...v: ClassValue[]) => twMerge(clsx(v));

/**
 * Cores das séries: ordem FIXA (a cor segue a entidade, nunca a posição no ranking).
 * Validada com o validador de paleta (daltonismo, contraste e brilho) no tema escuro (#151517)
 * e no claro (#ffffff); os valores ficam em globals.css (--t-s1..s4).
 */
export const COR = {
  s1: "var(--color-s1)",
  s2: "var(--color-s2)",
  s3: "var(--color-s3)",
  s4: "var(--color-s4)",
} as const;
export const SERIES = [COR.s1, COR.s2, COR.s3, COR.s4];
