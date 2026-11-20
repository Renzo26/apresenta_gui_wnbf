"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { CHECKOUT_BF, CTA_BF, FAQ_BF, HOST_CHECKOUT_BF, PLANOS_BF, ctaPlano, type PlanoBF } from "@/lib/black-friday";
import { evento, origem } from "@/lib/rastreio";

/**
 * A mesma página da Black em duas versões:
 *  - "whatsapp" (/black): os botões abrem o WhatsApp (passando pelo formulário)
 *  - "direta" (/direta): os botões dos planos vão direto para o checkout; os "Garantir" levam aos planos
 */
export type VarianteBF = "whatsapp" | "direta";
const Ctx = createContext<VarianteBF>("whatsapp");

export function VarianteBFProvider({ valor, children }: { valor: VarianteBF; children: ReactNode }) {
  return (
    <Ctx.Provider value={valor}>
      {children}
      {valor === "direta" && <RastreioCheckout />}
    </Ctx.Provider>
  );
}

export function useCtaBF() {
  const direta = useContext(Ctx) === "direta";
  return {
    direta,
    /** Botão de um plano: checkout (direta) ou WhatsApp com o plano. */
    plano: (p: PlanoBF) => (direta ? CHECKOUT_BF[p.id] : ctaPlano(p)),
    /** Botões gerais ("Garantir 10% OFF", "Quero a Black"): na direta, rolam até os planos. */
    geral: direta ? "#planos" : CTA_BF,
    geralExterno: !direta,
    faq: direta
      ? FAQ_BF.map((f) =>
          f.p === "Como faço para garantir a condição?"
            ? { ...f, r: "Escolha o plano e toque no botão dele. Você vai direto para o pagamento seguro e, depois da compra, a equipe entra em contato para começar." }
            : f,
        )
      : FAQ_BF,
  };
}

/**
 * Na /direta: ao clicar num link do checkout, avisa o Pixel (InitiateCheckout, com o valor do plano)
 * e leva os UTMs da visita para o checkout, para a venda não perder a campanha.
 */
function RastreioCheckout() {
  useEffect(() => {
    const aoClicar = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>(`a[href*="${HOST_CHECKOUT_BF}"]`);
      if (!a) return;
      const url = new URL(a.href);
      for (const [k, v] of Object.entries(origem())) if (!url.searchParams.has(k)) url.searchParams.set(k, v);
      a.href = url.toString();
      const plano = PLANOS_BF.find((p) => CHECKOUT_BF[p.id] === `${url.origin}${url.pathname}`);
      evento("InitiateCheckout", plano ? { value: plano.por, currency: "BRL", content_name: `Plano ${plano.nome} · Black`, content_ids: [plano.id] } : undefined);
    };
    // captura: roda antes da navegação e funciona em qualquer botão (planos, rodapé...)
    document.addEventListener("click", aoClicar, true);
    return () => document.removeEventListener("click", aoClicar, true);
  }, []);
  return null;
}
