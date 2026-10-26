// Conteúdo da LP. Tudo aqui vem da página atual do Jayme (delamadridteam.com/consultoria e /links-2)
// ou de dados informados pelo cliente. Mudou um texto ou link? Mude só aqui.

export const CONTACT = {
  phoneE164: "5555984585501",
  phoneDisplay: "(55) 98458-5501",
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

export const FAQ = [
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
