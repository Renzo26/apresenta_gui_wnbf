// /llms.txt: resumo em texto do site para buscadores e assistentes de IA (GEO).
import { CONTACT, PERFIL } from "@/lib/content";
import { BONUS_BF, DESCONTO_BF, FAQ_BF, INCLUSO_BF, PARCELAS_BF, PLANOS_BF, RESUMO_BF, reais } from "@/lib/black-friday";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function GET() {
  const texto = `# ${PERFIL.marca} — ${PERFIL.nome}

> Consultoria online de treino e dieta para naturais com ${PERFIL.nome}, primeiro brasileiro campeão da WNBF (federação internacional de fisiculturismo natural). Atendimento pelo WhatsApp (+${CONTACT.phoneE164}).

## Páginas

- [Consultoria](${siteUrl}/): como funciona o método, resultados de alunos e dúvidas frequentes.
- [Black Friday](${siteUrl}/black): ${DESCONTO_BF}% de desconto em todos os planos da consultoria.
- [Treinos Essenciais 2.0](${siteUrl}/planilhas): planilhas de treino do Jayme, com periodização de 1 ano em cada treino.
- [Links](${siteUrl}/linktree): consultoria individual, planilhas de treino 2.0 e livro digital.

## Black Friday

${RESUMO_BF}

${PLANOS_BF.map((p) => `- Plano ${p.nome} (${p.meses} meses): de ${reais(p.de)} por ${reais(p.por)} à vista, ou ${PARCELAS_BF}x de ${reais(p.parcela)} sem juros no cartão. Equivale a ${reais(p.porMes)} por mês. Inclui ${BONUS_BF}.${p.exclusivo ? ` Exclusivo deste plano: ${p.exclusivo.toLowerCase()}.` : ""}`).join("\n")}

## O que está incluso (em todos os planos)

${INCLUSO_BF.map((i) => `- ${i.titulo}: ${i.texto}`).join("\n")}

## Perguntas frequentes

${FAQ_BF.map((f) => `### ${f.p}\n\n${f.r}`).join("\n\n")}
`;
  return new Response(texto, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
