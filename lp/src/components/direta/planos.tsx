import { ArrowRight, Check, Lock } from "lucide-react";
import { CHECKOUT_BF, PARCELAS_BF, PLANOS_BF, reais } from "@/lib/black-friday";
import { cn } from "@/lib/utils";

/**
 * Os três planos como botões para o checkout. Cada link é segurado pelo formulário (FormCheckout),
 * que pede nome, e-mail e telefone antes de abrir o pagamento.
 * No celular o anual vem primeiro; no computador fica no meio, em destaque.
 */
export function PlanosDireta({ escuro = true }: { escuro?: boolean }) {
  return (
    <ul className="grid gap-3 md:grid-cols-3 md:items-stretch md:gap-4">
      {PLANOS_BF.map((p) => {
        const destaque = p.id === "anual";
        return (
          <li key={p.id} className={cn(destaque ? "order-first md:order-2" : p.id === "semestral" ? "md:order-1" : "md:order-3")}>
            <a
              href={CHECKOUT_BF[p.id]}
              className={cn(
                "group relative flex h-full flex-col rounded-[1.5rem] p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6",
                destaque
                  ? "bg-ouro text-carvao shadow-[0_20px_60px_-20px_rgba(240,197,65,0.55)]"
                  : escuro
                    ? "bg-bone/[0.05] text-bone ring-1 ring-bone/12 hover:ring-bone/30"
                    : "bg-white text-carvao ring-1 ring-carvao/10 hover:ring-carvao/30",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-display text-2xl uppercase tracking-wide">{p.nome}</span>
                {p.destaque && <span className="rounded-full bg-carvao px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-ouro">{p.destaque}</span>}
              </div>

              <p className={cn("mt-4 text-sm line-through", destaque ? "text-carvao/55" : "opacity-50")}>{reais(p.de)}</p>
              <p className="font-display text-[2.6rem] leading-none tracking-tight">
                {PARCELAS_BF}x {reais(p.parcela)}
              </p>
              <p className={cn("mt-2 text-sm", destaque ? "text-carvao/75" : "opacity-70")}>
                sem juros · ou {reais(p.por)} à vista
              </p>
              <p className={cn("mt-1 text-sm font-bold", destaque ? "text-carvao" : "text-ouro", !escuro && !destaque && "text-ouro-deep")}>
                Sai por {reais(p.porMes)} por mês
              </p>

              {p.exclusivo && (
                <p className="mt-4 flex items-center gap-2 text-sm font-semibold">
                  <Check className="size-4 shrink-0" aria-hidden /> + {p.exclusivo}
                </p>
              )}

              <span aria-hidden className="min-h-6 flex-1" />
              <span
                className={cn(
                  "flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-extrabold uppercase tracking-[0.08em] transition-colors",
                  destaque ? "bg-carvao text-ouro group-hover:bg-grafite" : "bg-ouro text-carvao group-hover:bg-bone",
                )}
              >
                Assinar o {p.nome}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </a>
          </li>
        );
      })}
      <li className={cn("order-last flex items-center justify-center gap-1.5 text-center text-xs md:col-span-3", escuro ? "text-bone/45" : "text-carvao/50")}>
        <Lock className="size-3" aria-hidden /> Pagamento seguro · os bônus da Black vêm em todos os planos
      </li>
    </ul>
  );
}
