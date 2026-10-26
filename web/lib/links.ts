// Destinos copiados da página atual (delamadridteam.com/links-2). Mudou um link? Mude só aqui.
const WHATSAPP = "5555984585501";
const whats = (mensagem: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;

export type LinkBio = {
  id: string;
  titulo: string;
  detalhe: string;
  href: string;
  tipo: "site" | "whatsapp";
  destaque?: boolean;
};

export const PERFIL = {
  nome: "Jayme De Lamadrid",
  selo: "WNBF PRO",
  marca: "De Lamadrid Team",
  linha: "Natural Bodybuilding",
};

export const LINKS: LinkBio[] = [
  {
    id: "consultoria",
    titulo: "Consultoria individual",
    detalhe: "Treino e dieta online",
    href: "https://delamadridteam.com/consultoria/",
    tipo: "site",
    destaque: true,
  },
  {
    id: "planilhas",
    titulo: "Planilhas de treino 2.0",
    detalhe: "Fale comigo no WhatsApp",
    href: whats("Gostaria de saber mais sobre as planilhas de treino"),
    tipo: "whatsapp",
  },
  {
    id: "livro",
    titulo: "Meu livro digital",
    detalhe: "Fale comigo no WhatsApp",
    href: whats("Gostaria de adquirir o Ebook do Jayme de R$49,99"),
    tipo: "whatsapp",
  },
];
