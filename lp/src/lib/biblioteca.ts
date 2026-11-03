// Vídeos de execução da biblioteca do Jayme (mesmos da página anterior em delamadridteam.com/biblioteca).
// Os vídeos ficam na Bunny (mediadelivery.net); aqui só os links, na mesma ordem.

export type Exercicio = { nome: string; video: string };
export type GrupoBiblioteca = { grupo: string; exercicios: Exercicio[] };

export const BIBLIOTECA: GrupoBiblioteca[] = [
  {
    grupo: "Peito",
    exercicios: [
      { nome: "Crucifixo na Máquina", video: "https://iframe.mediadelivery.net/play/790813/07b28450-135a-4c2a-8c37-fab9e4fa1ea1" },
      { nome: "Supino Reto com Barra", video: "https://iframe.mediadelivery.net/play/790813/ba72334d-08e0-4772-afe1-65719507c178" },
      { nome: "Crucifixo com Halter", video: "https://iframe.mediadelivery.net/play/790813/cf33f2f8-7fe8-472e-8115-23a3858a38a5" },
      { nome: "Cross Over na Polia", video: "https://iframe.mediadelivery.net/play/790813/ab0c9531-11b0-4b64-ac7e-0319c60f21e0" },
      { nome: "Supino com Dead Stop", video: "https://iframe.mediadelivery.net/play/790813/21a281f3-c72e-4d22-90cb-b50784b2d3bb" },
      { nome: "Cross Over na Polia 2", video: "https://iframe.mediadelivery.net/play/790813/dd1bc69f-4fbb-4bd0-9dd8-3bcf1781adb9" },
      { nome: "Supino Inclinado com Halter", video: "https://iframe.mediadelivery.net/play/790813/0be2d9ba-682d-4c62-904c-5e836c8a92c3" },
      { nome: "Supino Reto (variação)", video: "https://iframe.mediadelivery.net/play/790813/83ec2288-1a38-44d9-9fef-b5f8b7807569" },
    ],
  },
  {
    grupo: "Costas",
    exercicios: [
      { nome: "Puxadas", video: "https://iframe.mediadelivery.net/play/790813/1d0c6fe6-0e12-4a86-92f2-a9c4458596e2" },
      { nome: "Remada Baixa Tradicional", video: "https://iframe.mediadelivery.net/play/790813/95d8a523-5c8c-4cf8-b962-fe624a41c377" },
      { nome: "Remada na Máquina", video: "https://iframe.mediadelivery.net/play/790813/bb045851-0087-48f7-9448-0b715a67b36f" },
      { nome: "Remada Curvada com Barra", video: "https://iframe.mediadelivery.net/play/790813/3b10e20f-e2bd-4089-a20e-7cd8b4e87fbc" },
      { nome: "Rack Pull", video: "https://iframe.mediadelivery.net/play/790813/ad034be1-c06a-4fd1-b097-0c85abab0e84" },
      { nome: "Pulldown", video: "https://iframe.mediadelivery.net/play/790813/25adfa10-e965-4973-81da-bd56ffe6fb7d" },
      { nome: "Puxada Unilateral", video: "https://iframe.mediadelivery.net/play/790813/73a5bbf9-1cd6-4069-b905-97754a0f6428" },
      { nome: "Puxada Supinada", video: "https://iframe.mediadelivery.net/play/790813/146dd7ba-3811-4a83-bea1-c2fdab7b2a10" },
      { nome: "Puxada Triângulo", video: "https://iframe.mediadelivery.net/play/790813/0f2c2718-4789-4a52-8880-4efc941cfa9e" },
      { nome: "Remada Delamadrid", video: "https://iframe.mediadelivery.net/play/790813/5bfe6371-eba0-4f07-817a-e0185facc8c9" },
      { nome: "Remada Baixa Unilateral", video: "https://iframe.mediadelivery.net/play/790813/99b45575-e7bb-4a42-860d-e9185c1388e8" },
    ],
  },
  {
    grupo: "Ombros",
    exercicios: [
      { nome: "Elevação Lateral na Polia", video: "https://iframe.mediadelivery.net/play/790813/bce3b678-c02d-4fac-be16-b3c05228991b" },
      { nome: "Crucifixo Inverso na Máquina", video: "https://iframe.mediadelivery.net/play/790813/2a7fb397-441b-4ae5-91d7-1926ea435e0b" },
      { nome: "Elevação Lateral com Halter", video: "https://iframe.mediadelivery.net/play/790813/80ba41ea-2229-4b30-b416-014c98e83151" },
      { nome: "Press Militar", video: "https://iframe.mediadelivery.net/play/790813/852be2dc-df12-4226-a7bf-602ea1ab8160" },
      { nome: "Face Pull", video: "https://iframe.mediadelivery.net/play/790813/71ebf6de-0bd1-4456-8e77-0d8f72b2ec3a" },
      { nome: "Posterior de Ombro", video: "https://iframe.mediadelivery.net/play/790813/bf356d06-efa7-4157-b329-46852935fd10" },
      { nome: "Desenvolvimento Halter", video: "https://iframe.mediadelivery.net/play/790813/fd71eb94-1701-4c75-8f80-2593f92c7e76" },
      { nome: "Elevação Lateral Pt1", video: "https://iframe.mediadelivery.net/play/790813/f9d5efc5-d63b-4480-879c-e0f34e93c589" },
      { nome: "Elevação Lateral Pt2", video: "https://iframe.mediadelivery.net/play/790813/4a392ccf-b4b7-4390-bd00-8d224021e6f0" },
    ],
  },
  {
    grupo: "Braços",
    exercicios: [
      { nome: "Tríceps Testa", video: "https://iframe.mediadelivery.net/play/790813/75d4daa5-164f-4a7f-b61d-c59b5dbd07e5" },
      { nome: "Rosca Direta com Barra", video: "https://iframe.mediadelivery.net/play/790813/d8a83f59-a7f1-4fe8-8fac-671731ef8d82" },
      { nome: "Rosca Direta com Barra com Parada Morta", video: "https://iframe.mediadelivery.net/play/790813/7b3e2001-2b66-4f94-85a2-8b5cacd58cb8" },
      { nome: "Rosca Unilateral com Polia na Máquina", video: "https://iframe.mediadelivery.net/play/790813/4976176b-9214-49df-8bf2-382b05ebf540" },
      { nome: "Paralela Livre", video: "https://iframe.mediadelivery.net/play/790813/97c1e0b5-5627-4c73-aae9-2a202f13c265" },
      { nome: "Rosca Direto no Banco Inclinado", video: "https://iframe.mediadelivery.net/play/790813/96a65043-1459-4de9-868b-780fbd9cd65b" },
      { nome: "Paralela na Máquina", video: "https://iframe.mediadelivery.net/play/790813/d361f2b1-9d53-4d8e-9253-69d353adbf12" },
      { nome: "Rosca Aranha", video: "https://iframe.mediadelivery.net/play/790813/e8bdd896-4bd2-4168-9f9a-5bbb4a785401" },
      { nome: "Tríceps Testa na Polia", video: "https://iframe.mediadelivery.net/play/790813/35417ccc-189a-456f-acd2-1bc1640ab098" },
      { nome: "Rosca Alternada", video: "https://iframe.mediadelivery.net/play/790813/c027dc42-fc7a-47be-ba87-a33075702241" },
      { nome: "Rosca Martelo", video: "https://iframe.mediadelivery.net/play/790813/9e52e446-f409-4752-8a07-e9322a406240" },
      { nome: "Tríceps na Barra", video: "https://iframe.mediadelivery.net/play/790813/98738028-c5e3-4186-b6fa-a309a0a03632" },
    ],
  },
  {
    grupo: "Inferior",
    exercicios: [
      { nome: "Búlgaro no Smith", video: "https://iframe.mediadelivery.net/play/790813/b8070122-e676-44d1-a317-85240acb0f34" },
      { nome: "Elevação Pélvica", video: "https://iframe.mediadelivery.net/play/790813/f6828664-78da-4598-a05f-0ae30375e3e7" },
      { nome: "Leg Press Horizontal", video: "https://iframe.mediadelivery.net/play/790813/7a7cb997-130d-439c-becf-5e4cae395569" },
      { nome: "Agachamento Livre Pt1", video: "https://iframe.mediadelivery.net/play/790813/51177aad-bec8-4566-9c0f-0aee83ad569c" },
      { nome: "Agachamento Livre Pt2", video: "https://iframe.mediadelivery.net/play/790813/385b064a-e44d-4076-922f-71e462e949b4" },
      { nome: "Stiff", video: "https://iframe.mediadelivery.net/play/790813/a11660bb-e0b6-46d7-8b96-ea49fcea6307" },
      { nome: "Panturrilha em Pé", video: "https://iframe.mediadelivery.net/play/790813/c70c04f5-f139-444a-9a65-ff358c16ec0a" },
      { nome: "Levantamento Terra", video: "https://iframe.mediadelivery.net/play/790813/c83230c3-b53d-4a9e-9271-3378ba95d9ab" },
    ],
  },
  {
    grupo: "Abdômen",
    exercicios: [
      { nome: "Abdominal Infra na Paralela", video: "https://iframe.mediadelivery.net/play/790813/432894f8-698f-4855-9188-7f6088e2099c" },
      { nome: "Abdominal Crunch", video: "https://iframe.mediadelivery.net/play/790813/c7b4e82e-a8a0-4fa5-90f4-d8cb0b6b9f44" },
    ],
  },
  {
    grupo: "Mobilidade & Alongamento",
    exercicios: [
      { nome: "Superior", video: "https://iframe.mediadelivery.net/play/790813/61ad15ec-590a-4d52-bc06-1d4b6f7accca" },
      { nome: "Inferior", video: "https://iframe.mediadelivery.net/play/790813/5c0ce13b-8ed4-4e32-87f3-9066f59d4c5b" },
    ],
  },
];
