import type { ComponentType } from "react";
import { Capa, ComoLer, Diagnostico, Hoje } from "./abertura";
import { QuantoPagar, Teto, ValorAluno } from "./valor";
import { Cenarios, Evolucao, ListaEspera, PorVerba } from "./cenarios";
import { Decidir, Fases, Rastreamento, SabemosNaoSabemos } from "./campo";
import { Checklist, Riscos } from "./fechamento";
import { BLACK, CENARIOS, CLIENTE, ENTRADAS_PARA_MANTER, ESPERA, EVOLUCAO, I, META_CAC, P, VAGAS_ATE_TETO, VERBAS, mil, numero, reais } from "@/lib/modelo";
import type { PropsSlide } from "./tipos";

type DefSlide = { id: string; curto: string; notas: string[]; Conteudo: ComponentType<PropsSlide> };

const [cons, real, otim] = CENARIOS;

export const SLIDES: DefSlide[] = [
  {
    id: "capa",
    curto: "Capa",
    Conteudo: Capa,
    notas: [
      "Abrir dizendo o objetivo: hoje não vou prometer um número. Vou mostrar como chegamos às projeções e como vamos confirmar cada uma com a campanha no ar.",
      "Reforçar que é a primeira vez que a consultoria investe em tráfego pago, então boa parte do que vem a seguir ainda é hipótese, e tudo bem.",
    ],
  },
  {
    id: "como-ler",
    curto: "Como ler",
    Conteudo: ComoLer,
    notas: [
      "Explicar os três selos. Azul (DADO) é o que você me passou. Cinza (CÁLCULO) é conta feita em cima dos seus dados. Roxo (HIPÓTESE) é o que eu estou supondo e só a campanha vai confirmar.",
      "Pedir para ele prestar atenção nos selos: quanto mais roxo num slide, mais cuidado ao tirar conclusão.",
    ],
  },
  {
    id: "hoje",
    curto: "Onde estamos",
    Conteudo: Hoje,
    notas: [
      `Esses são os seus números: ${P.alunosAtivos} alunos, ${mil(P.custoOperacao, 0)} de custo por mês, ${P.permanencia} meses de permanência e 1 venda a cada 6 conversas.`,
      `O gráfico mostra o que chamo de oscilação: julho teve ${CLIENTE.entradasMeses[1].v} entradas e setembro ${CLIENTE.entradasMeses[3].v}. Os contatos também variaram de ${Math.min(...CLIENTE.contatosMeses)} a ${Math.max(...CLIENTE.contatosMeses)} por mês.`,
      "Perguntar: você lembra o que aconteceu em julho? Isso ajuda a entender o orgânico.",
    ],
  },
  {
    id: "diagnostico",
    curto: "Diagnóstico",
    Conteudo: Diagnostico,
    notas: [
      `Conta simples: se cada aluno fica ${P.permanencia} meses, para manter ${P.alunosAtivos} alunos você precisa repor cerca de ${numero(ENTRADAS_PARA_MANTER)} por mês, entre alunos novos e renovações.`,
      `Hoje entram ${P.entradasOrganicas} novos e renovam ${CLIENTE.renovacoesMes}: ${P.entradasOrganicas + CLIENTE.renovacoesMes}. Ou seja, empata. O orgânico segura a base, mas não faz crescer. É aqui que o tráfego entra.`,
    ],
  },
  {
    id: "valor-aluno",
    curto: "Valor do aluno",
    Conteudo: ValorAluno,
    notas: [
      `Apresentar o LTV: é quanto um aluno rende enquanto fica. Pelo mix de planos, dá uns ${reais(I.valorMensalMedio)} por mês, ou ${reais(I.ltv)} em ${P.permanencia} meses.`,
      `Atender esse aluno custa cerca de ${reais(I.custoAtendimentoPeriodo)} no período (é o custo da operação dividido pelos alunos). Sobra ${reais(I.cacEquilibrio)}.`,
      `Esse é o máximo que dá para pagar por um aluno sem perder dinheiro. Clicar em “Black Friday” para mostrar que, com 10% de desconto, a sobra cai para ${reais(BLACK.cacEquilibrio)}.`,
    ],
  },
  {
    id: "quanto-pagar",
    curto: "Quanto pagar",
    Conteudo: QuantoPagar,
    notas: [
      `Proponho mirar em ${reais(META_CAC)} por aluno, metade do limite. A outra metade é a margem para impostos, taxas e erro nas minhas estimativas.`,
      `Explicar CPL e CAC com o exemplo: se cada conversa no WhatsApp custar ${reais(real.cpl)} e ${numero(real.fechamento * 100)} em cada 100 fecharem, cada aluno custa ${reais(real.cac)}.`,
      `Até sabermos quanto o tráfego fecha, vou usar ${reais(CLIENTE.alertaCpl)} por conversa como sinal de alerta.`,
    ],
  },
  {
    id: "teto",
    curto: "Teto de 230",
    Conteudo: Teto,
    notas: [
      `Você me disse que o ideal é ${P.teto} alunos e que a equipe dá conta de ${P.capacidadeEntradas} entradas por mês. Então há ${VAGAS_ATE_TETO} vagas e uma folga de ${I.folgaEntradas} entradas por mês além do orgânico.`,
      `A estratégia tem duas fases: subir até lotar e depois só repor quem sai, cerca de ${numero(I.entradasManutencao)} alunos extras por mês. Isso muda quanto vamos gastar ao longo do tempo.`,
    ],
  },
  {
    id: "cenarios",
    curto: "Cenários",
    Conteudo: Cenarios,
    notas: [
      "Os três cenários são pontos de partida meus, não médias de mercado. Variam duas coisas: quanto custa cada conversa e quantas fecham.",
      `No conservador o aluno sai a ${reais(cons.cac)}, acima da meta mas ainda sem prejuízo. No realista, ${reais(real.cac)}. No otimista, ${reais(otim.cac)}, que só acontece se o tráfego fechar igual ao orgânico.`,
      "Lembrar: quem vem do anúncio normalmente chega mais frio e fecha menos que a indicação ou o orgânico.",
    ],
  },
  {
    id: "por-verba",
    curto: "Por verba",
    Conteudo: PorVerba,
    notas: [
      "Cada célula mostra quantos alunos a verba traria por mês e quanto esses alunos deixam ao longo dos 6 meses, já pagando o atendimento e o anúncio.",
      `Ponto principal: nas células hachuradas a equipe já está no limite de ${I.folgaEntradas} entradas extras. Colocar mais verba ali não traz mais aluno, só aumenta o custo. No realista com ${mil(VERBAS[2], 0)}, por exemplo, o ganho é menor do que com ${mil(VERBAS[1], 0)}.`,
    ],
  },
  {
    id: "evolucao",
    curto: "12 meses",
    Conteudo: Evolucao,
    notas: [
      `Simulei 12 meses com até ${mil(ESPERA.verbaNormalMax, 0)} por mês, pausando o anúncio quando a base lota. O conservador lota no ${EVOLUCAO[0].lotaNoMes}º mês; realista e otimista no ${EVOLUCAO[1].lotaNoMes}º.`,
      `Em todos entram cerca de ${numero(EVOLUCAO[1].alunosTotal)} alunos no ano. O teto deixa o volume igual. O que muda é o gasto: de cerca de ${mil(EVOLUCAO[2].verbaTotal, 0)} a ${mil(EVOLUCAO[0].verbaTotal, 0)} no ano.`,
      "Insight para ele: com a base cheia, o caminho para faturar mais é vender mais plano semestral e anual e renovar mais, não trazer mais gente.",
      "Ressalva honesta: a simulação faz todo mundo sair junto depois de 6 meses. Na vida real as saídas se espalham.",
    ],
  },
  {
    id: "lista-espera",
    curto: "Lista de espera",
    Conteudo: ListaEspera,
    notas: [
      `Testei uma ideia: rodar ${mil(ESPERA.verba, 0)} por mês enquanto as vagas estão fechadas, para juntar contatos para a reabertura.`,
      `Com as minhas premissas, um aluno da espera sai a ${reais(ESPERA.cacEspera)}, o dobro do anúncio (${reais(ESPERA.cacAnuncio)}). Como as vagas são limitadas, ele ocupa o lugar de um aluno mais barato.`,
      "Conclusão: vale testar, mas não é decisão. Só compensa se converter tão bem quanto o anúncio ou se o contato for bem mais barato. Pode ajudar a lotar mais rápido, o que a conta não mede.",
    ],
  },
  {
    id: "sabemos",
    curto: "Sabemos / não sabemos",
    Conteudo: SabemosNaoSabemos,
    notas: [
      "Resumo antes da parte mais importante. A coluna azul e a cinza são firmes. A roxa é o que a campanha vai responder.",
      "Frisar que tudo depende de uma pergunta: quantas conversas do anúncio viram aluno.",
    ],
  },
  {
    id: "rastreamento",
    curto: "Rastreamento",
    Conteudo: Rastreamento,
    notas: [
      "Sem rastreamento, não dá para saber se a venda veio do anúncio ou do orgânico, e aí nenhum número da campanha é confiável.",
      "Passar pelo fluxo: o anúncio leva um código de origem, a página registra o clique, o código vai junto na mensagem do WhatsApp e o atendente anota origem, plano e motivo quando não fecha.",
      "Mencionar a decisão pendente: ferramenta pronta (como o Tintim, ainda a confirmar com o WhatsApp Business comum) ou solução própria com a API oficial.",
    ],
  },
  {
    id: "fases",
    curto: "Fases",
    Conteudo: Fases,
    notas: [
      "Esta é a mensagem central: os cenários são o mapa, as primeiras semanas mostram em qual deles estamos.",
      `Fase 1: começamos pequeno, na faixa de ${mil(VERBAS[0], 0)}, só para medir o custo por conversa. Fase 2: medimos quantas fecham e o custo real por aluno, e atualizamos a planilha.`,
      "Só depois disso escalamos até lotar, e então reduzimos para a verba de manutenção. A lista de espera é testada à parte, quando as vagas fecharem.",
    ],
  },
  {
    id: "decidir",
    curto: "Decidir",
    Conteudo: Decidir,
    notas: [
      "Toda semana vou trazer esses cinco números. O tempo de resposta está aí porque o atendimento é humano e a velocidade muda o fechamento.",
      `A regra é um semáforo pelo custo por aluno. Verde, até ${reais(META_CAC)}: mantém e escala. Amarelo, até ${reais(I.cacEquilibrio)}: não escala e ajusta. Vermelho, acima disso: pausa e revisa.`,
      "Pedir para combinarmos agora quantas conversas precisamos antes de julgar. Com poucos dados, um número pode enganar.",
    ],
  },
  {
    id: "riscos",
    curto: "Riscos",
    Conteudo: Riscos,
    notas: [
      "Ser franco: isto não é previsão. O que mais pode mudar a conta é o fechamento do tráfego.",
      "Deixei de fora impostos, taxas de pagamento e o tempo dos bônus. E supus que o custo de atender cresce junto com a base, o que deixa a conta mais conservadora.",
      "Se os contatos crescerem, o atendimento precisa responder rápido. Isso é risco operacional, não de anúncio.",
    ],
  },
  {
    id: "proximos-passos",
    curto: "Próximos passos",
    Conteudo: Checklist,
    notas: [
      "Fechar com o que preciso dele. Dá para marcar os itens na tela enquanto conversam.",
      `O último item é importante: saber em que meses vieram os ${CLIENTE.contatosMeses.join(", ")} contatos e quantas vendas cada um gerou ajuda a calibrar o fechamento do orgânico.`,
      "Combinar a data da primeira leitura, ao fim da semana 4.",
    ],
  },
];
