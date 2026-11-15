// Conteúdo da LP. Tudo aqui vem da página atual do Jayme (delamadridteam.com/consultoria e /links-2)
// ou de dados informados pelo cliente. Mudou um texto ou link? Mude só aqui.

export const CONTACT = {
  phoneE164: "555592058149",
  phoneDisplay: "(55) 9205-8149",
};

export function whatsappUrl(message: string) {
  return `https://wa.me/${CONTACT.phoneE164}?text=${encodeURIComponent(message)}`;
}

/** Os três caminhos da página — mesmos destinos do link da bio. */
export const CTA = {
  consultoria: whatsappUrl("Olá gostaria de saber mais sobre a consultoria"),
  planilhas: whatsappUrl("Gostaria de saber mais sobre as planilhas de treino"),
  livro: whatsappUrl("Gostaria de adquirir o Ebook do Jayme de R$49,99"),
};

export const PERFIL = {
  nome: "Jayme De Lamadrid",
  marca: "De Lamadrid Team",
  sigla: "DLM",
  instagram: "https://www.instagram.com/jaymedelamadrid/",
};

/** Resumo de uma frase: o mesmo em títulos, dados estruturados e /llms.txt (buscadores e IAs). */
export const RESUMO = "Consultoria online de treino e dieta para naturais com Jayme De Lamadrid, primeiro brasileiro campeão da WNBF, a federação internacional de fisiculturismo natural.";

/** Seção "Consultoria online para naturais": o que é, para quem é, o que vem e por que natural (texto que o Google e as IAs leem). */
export const CONSULTORIA = {
  intro:
    "A consultoria do Jayme De Lamadrid é um acompanhamento online de treino e dieta para quem quer ganhar massa muscular, emagrecer ou definir sem anabolizantes. Você recebe um protocolo de treino e um planejamento alimentar individualizados e fala direto com o Jayme e a equipe pelo WhatsApp.",
  blocos: [
    {
      titulo: "Para quem é",
      texto:
        "Para quem está começando e quer aprender a treinar e comer do jeito certo, para quem já treina e parou de evoluir e para atletas naturais que pensam em competir. Serve para hipertrofia, emagrecimento e recomposição corporal.",
    },
    {
      titulo: "Por que natural",
      texto:
        "O Jayme é o primeiro brasileiro campeão da WNBF, federação internacional de fisiculturismo natural com controle antidoping. Ele treina e compete natural e já acompanhou mais de 14 mil alunos com o mesmo método.",
    },
    {
      titulo: "Onde e como",
      texto:
        "Tudo é online: avaliação, entrega do plano e acompanhamento pelo celular, de qualquer lugar do Brasil. Os planos são trimestral, semestral e anual.",
    },
  ],
  inclui: [
    "Avaliação completa da rotina, da alimentação e do objetivo",
    "Treino individualizado, entregue em 3 a 5 dias úteis",
    "Planejamento alimentar flexível, sem dieta restritiva",
    "Suporte diário no WhatsApp com o Jayme e a equipe",
    "Reavaliação todo mês e ajustes no treino e na dieta",
  ],
};

export const PROVAS = [
  { valor: "+14 mil", rotulo: "alunos atendidos" },
  { valor: "1º", rotulo: "brasileiro campeão WNBF" },
  { valor: "100%", rotulo: "natural, sem atalhos" },
];

export const METODO = [
  {
    titulo: "Coleta de dados e avaliação",
    texto: "Você conta sua rotina, alimentação, objetivos e dificuldades. Se quiser, envia fotos para a avaliação física.",
  },
  {
    titulo: "Estratégia personalizada",
    texto: "Montamos o protocolo de treino e o planejamento alimentar a partir do seu perfil, do seu gosto e do seu gasto de energia.",
  },
  {
    titulo: "Acompanhamento diário",
    texto: "Acesso direto ao Jayme e à equipe pelo WhatsApp para tirar dúvidas e manter a constância.",
  },
  {
    titulo: "Reavaliação mensal",
    texto: "Questionários todo mês para entender o que está funcionando e o que precisa melhorar.",
  },
  {
    titulo: "Ajustes no plano",
    texto: "Treino e dieta mudam conforme o seu relato e a resposta do seu corpo.",
  },
];

export const DEPOIMENTOS = [
  { nome: "Aluno da consultoria", resultado: "+4 kg", rotulo: "de massa magra", texto: "Mesmo com rotina de trabalho intensa, encontrou consistência na dieta." },
  { nome: "Aluno da consultoria", resultado: "−8 kg", rotulo: "de gordura", texto: "Ajustes de treino e um déficit calórico bem conduzido." },
  { nome: "Aluno da consultoria", resultado: "Abdômen", rotulo: "definido", texto: "“Não precisei fazer dietas malucas ou passar fome.”" },
  { nome: "Felipe Souza", resultado: "+3 kg", rotulo: "de músculo", texto: "Recomposição corporal com alimentação ajustada ao gasto do dia a dia." },
  { nome: "Aluno da consultoria", resultado: "+3 kg", rotulo: "de músculo", texto: "Evolução limpa, com o básico bem orientado." },
];

/** Os 6 resultados da página da consultoria (delamadridteam.com/consultoria), na mesma ordem e com o texto completo. */
export const DEPOIMENTOS_COMPLETOS: { nome?: string; resultado: string; rotulo: string; texto: string }[] = [
  {
    resultado: "+4 kg",
    rotulo: "de massa magra",
    texto: "Sempre tive dificuldade em manter a consistência na dieta. Com o acompanhamento, o planejamento foi perfeitamente adaptado para a minha rotina pesada de trabalho.",
  },
  { resultado: "−8 kg", rotulo: "de gordura", texto: "Ajustamos os treinos e o déficit calórico de forma extremamente precisa." },
  {
    resultado: "Definição",
    rotulo: "abdominal",
    texto: "Não precisei fazer dietas malucas ou passar fome. Consegui definir o abdômen comendo o que gosto, apenas ajustando as quantidades e treinando com a intensidade certa.",
  },
  {
    nome: "Felipe Souza",
    resultado: "+3 kg",
    rotulo: "de músculo",
    texto: "A recomposição corporal parecia impossível para mim. O método me ensinou a treinar de verdade e a me alimentar de acordo com o meu gasto diário. Os resultados falam por si.",
  },
  { resultado: "+4 kg", rotulo: "de músculo", texto: "Lapidando o físico com ganho de massa magra." },
  { resultado: "+3 kg", rotulo: "de músculo", texto: "Evolução limpa, sem grandes manobras: apenas o básico bem orientado." },
];

export const FAQ = [
  {
    p: "O que é uma consultoria online para naturais?",
    r: "É um acompanhamento de treino e dieta feito à distância para quem treina sem anabolizantes. Na De Lamadrid Team você recebe treino e planejamento alimentar individualizados, tira dúvidas no WhatsApp e tem o plano reavaliado e ajustado todo mês.",
  },
  {
    p: "Quem é Jayme De Lamadrid?",
    r: "Atleta de fisiculturismo natural e treinador, primeiro brasileiro campeão da WNBF (federação internacional de fisiculturismo natural), formado na Europa, autor do livro A Musculação para Naturais e fundador da De Lamadrid Team, que já atendeu mais de 14 mil alunos.",
  },
  {
    p: "Dá para ganhar massa muscular sem anabolizantes?",
    r: "Sim. O ganho é mais lento do que com hormônios, mas é consistente quando treino, alimentação e descanso estão bem ajustados. É o que o Jayme faz como atleta natural e o que aplica com os alunos da consultoria.",
  },
  {
    p: "A consultoria serve para emagrecer?",
    r: "Serve. O plano é montado para o seu objetivo: emagrecimento, ganho de massa muscular (hipertrofia) ou recomposição corporal, que é perder gordura e ganhar músculo ao mesmo tempo.",
  },
  {
    p: "Qual a diferença entre consultoria online e personal trainer?",
    r: "O personal acompanha o treino ao seu lado. Na consultoria online você recebe treino e dieta individualizados, treina no seu horário e é acompanhado à distância pelo WhatsApp, com reavaliação e ajustes todo mês.",
  },
  {
    p: "Como funciona o acompanhamento online?",
    r: "Tudo é feito pelo celular: avaliação, entrega do plano e suporte rápido pelo WhatsApp com o Jayme e a equipe.",
  },
  {
    p: "A dieta é restritiva?",
    r: "Não. O plano é adaptado à sua rotina e ao que você gosta de comer. Nutrição sem picaretagem.",
  },
  {
    p: "Em quanto tempo recebo meu plano?",
    r: "Em até 3 a 5 dias úteis depois da anamnese.",
  },
  {
    p: "Vou precisar de suplementos?",
    r: "Não são obrigatórios. Só indicamos quando existe uma necessidade real.",
  },
  {
    p: "Quais planos existem?",
    r: "Trimestral, semestral e anual. A equipe passa os valores e tira suas dúvidas no WhatsApp.",
  },
];

export const MARQUEE = [
  "Treino individualizado",
  "Nutrição sem picaretagem",
  "100% natural",
  "Acompanhamento diário",
  "WNBF PRO",
  "Suplemento só quando precisa",
];
