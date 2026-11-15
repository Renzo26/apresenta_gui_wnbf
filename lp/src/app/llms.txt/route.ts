// /llms.txt: resumo em texto do site para buscadores e assistentes de IA (GEO).
import { CONSULTORIA, CONTACT, FAQ, PERFIL, RESUMO } from "@/lib/content";
import { BONUS_BF, BONUS_LISTA_BF, DESCONTO_BF, FAQ_BF, INCLUSO_BF, PLANOS_BF, RESUMO_BF, parcelamento, reais } from "@/lib/black-friday";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function GET() {
  const texto = `# ${PERFIL.marca} — ${PERFIL.nome}

> ${RESUMO} Atendimento pelo WhatsApp (+${CONTACT.phoneE164}) para todo o Brasil.

## Quem é ${PERFIL.nome}

Atleta de fisiculturismo natural e treinador, primeiro brasileiro campeão da WNBF (World Natural Bodybuilding Federation, federação internacional de fisiculturismo natural com controle antidoping). Formado na Europa, autor do livro A Musculação para Naturais e fundador da ${PERFIL.marca}, que já atendeu mais de 14 mil alunos. Instagram: ${PERFIL.instagram}

## Consultoria online de treino e dieta para naturais

${CONSULTORIA.intro}

${CONSULTORIA.blocos.map((b) => `- ${b.titulo}: ${b.texto}`).join("\n")}

O que vem na consultoria:

${CONSULTORIA.inclui.map((i) => `- ${i}`).join("\n")}

Planos: trimestral (3 meses), semestral (6 meses) e anual (12 meses). Contratação e dúvidas pelo WhatsApp.

### Perguntas frequentes sobre a consultoria

${FAQ.map((f) => `#### ${f.p}\n\n${f.r}`).join("\n\n")}

## Páginas

- [Consultoria online para naturais](${siteUrl}/): o que é a consultoria, para quem é, como funciona o método, resultados de alunos e dúvidas frequentes.
- [Black Friday](${siteUrl}/black): ${DESCONTO_BF}% de desconto em todos os planos da consultoria.
- [Treinos Essenciais 2.0](${siteUrl}/planilhas): planilhas de treino do Jayme, com periodização de 1 ano em cada treino.
- [Links](${siteUrl}/linktree): consultoria individual, planilhas de treino 2.0 e livro digital.

## Black Friday

${RESUMO_BF}

${PLANOS_BF.map((p) => `- Plano ${p.nome} (${p.meses} meses): de ${reais(p.de)} por ${reais(p.por)} à vista, ou ${parcelamento(p)} no cartão. Equivale a ${reais(p.porMes)} por mês. Inclui ${BONUS_BF}.${p.exclusivo ? ` Exclusivo deste plano: ${p.exclusivo.toLowerCase()}.` : ""}`).join("\n")}

## Os três bônus da Black (em todos os planos)

${BONUS_LISTA_BF.map((b) => `- ${b}`).join("\n")}

## O que está incluso (em todos os planos)

${INCLUSO_BF.map((i) => `- ${i.titulo}: ${i.texto}`).join("\n")}

## Perguntas frequentes da Black Friday

${FAQ_BF.map((f) => `### ${f.p}\n\n${f.r}`).join("\n\n")}
`;
  return new Response(texto, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
