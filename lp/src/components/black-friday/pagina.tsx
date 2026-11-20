import { BfBonusCurso } from "@/components/black-friday/bonus-curso";
import { BfDuvidas } from "@/components/black-friday/duvidas";
import { BfFooter } from "@/components/black-friday/footer";
import { BfHeader } from "@/components/black-friday/header";
import { BfHero } from "@/components/black-friday/hero";
import { BfIntro } from "@/components/black-friday/intro";
import { BfLeadForm } from "@/components/black-friday/lead-form";
import { BfMotivos } from "@/components/black-friday/motivos";
import { BfMetodo } from "@/components/black-friday/metodo";
import { BfPlanos } from "@/components/black-friday/planos";
import { BfResultados } from "@/components/black-friday/resultados";
import { BfSobre } from "@/components/black-friday/sobre";
import { BfStatement } from "@/components/black-friday/statement";
import { BfStickyCta } from "@/components/black-friday/sticky-cta";
import { VarianteBFProvider, type VarianteBF } from "@/components/black-friday/variante";
import { Marquee } from "@/components/sections/marquee";
import { BONUS_BF, DESCONTO_BF, PARCELAS_BF } from "@/lib/black-friday";

const FAIXA = [`Black Friday DLM`, `${DESCONTO_BF}% OFF na consultoria`, `${PARCELAS_BF}x sem juros`, `+ ${BONUS_BF}`, "100% natural", "Acompanhamento diário"];

/**
 * A página da Black (mesma composição da LP: hero, painel claro, seção escura, resultados, painel claro, rodapé).
 * `variante`: "whatsapp" em /black (botões abrem o WhatsApp) e "direta" em /direta (botões dos planos vão ao checkout).
 */
export function PaginaBlack({ variante, jsonLd }: { variante: VarianteBF; jsonLd?: object }) {
  return (
    <VarianteBFProvider valor={variante}>
    <div className="bg-carvao">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <BfIntro />
      <BfHeader />
      <main>
        <BfHero />

        {/* faixa logo abaixo do hero, de ponta a ponta */}
        <div className="overflow-hidden py-4 sm:py-6">
          <Marquee itens={FAIXA} className="bg-ouro text-carvao" simboloCls="text-carvao/60" />
        </div>

        <div className="px-2.5 sm:px-4">
          <div className="grain relative overflow-hidden rounded-[2rem] bg-bone sm:rounded-[2.75rem]">
            <BfPlanos />
            <BfStatement />
            <BfBonusCurso />
          </div>
        </div>

        <BfMetodo />
        <BfResultados />
        <BfMotivos />

        <div className="px-2.5 pb-2.5 sm:px-4 sm:pb-4">
          <div className="grain relative rounded-[2rem] bg-bone sm:rounded-[2.75rem]">
            <BfSobre />
            <BfDuvidas />
          </div>
        </div>
      </main>
      <BfFooter />
      <BfStickyCta />
      {/* todo link do WhatsApp da página passa antes pelo formulário (nome, e-mail, telefone) */}
      <BfLeadForm />
    </div>
    </VarianteBFProvider>
  );
}
