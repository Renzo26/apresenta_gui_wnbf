// Usado pelo n8n (outro servidor) na resposta automática do WhatsApp: o banco da VPS não fica exposto na internet,
// então o n8n pergunta aqui, com uma chave secreta (N8N_WHATSAPP_TOKEN), se deve responder e quem é o lead.
import { timingSafeEqual } from "node:crypto";
import { SCHEMA, db } from "@/lib/db";

const texto = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function chaveConfere(recebida: string | null) {
  const esperada = process.env.N8N_WHATSAPP_TOKEN ?? "";
  if (esperada.length < 24 || !recebida) return false;
  const a = Buffer.from(recebida);
  const b = Buffer.from(esperada);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  if (!chaveConfere(req.headers.get("x-n8n-token"))) return Response.json({ erro: "não autorizado" }, { status: 401 });

  let corpo: Record<string, unknown>;
  try {
    corpo = await req.json();
  } catch {
    return Response.json({ erro: "json inválido" }, { status: 400 });
  }
  const chatId = texto(corpo.chatId, 120);
  const telefone = texto(corpo.telefone, 20).replace(/\D/g, "");
  if (!chatId) return Response.json({ erro: "chatId obrigatório" }, { status: 422 });

  const sql = db();
  try {
    // marca a resposta (no máximo uma a cada 24h por conversa) e busca o lead pelo DDD + 8 últimos dígitos
    const [linha] = await sql`
      with marca as (
        insert into ${sql(SCHEMA)}.respostas_whatsapp (chat_id) values (${chatId})
        on conflict (chat_id) do update
          set respondido_em = now(), respostas = ${sql(SCHEMA)}.respostas_whatsapp.respostas + 1
          where ${sql(SCHEMA)}.respostas_whatsapp.respondido_em < now() - interval '24 hours'
        returning chat_id
      ), lead as (
        select nome, botao, plano, utm_campaign
        from ${sql(SCHEMA)}.leads
        where length(${telefone}) >= 10
          and left(telefone, 2) = left(${telefone}, 2)
          and right(telefone, 8) = right(${telefone}, 8)
        order by criado_em desc
        limit 1
      )
      select exists (select 1 from marca) as responder,
             (lead.nome is not null) as cadastrado,
             lead.nome, lead.botao, lead.plano, lead.utm_campaign
      from (select 1) as um left join lead on true`;
    return Response.json(linha);
  } catch (e) {
    console.error("[whatsapp] falha:", e instanceof Error ? e.message : e);
    return Response.json({ erro: "falha no banco" }, { status: 500 });
  }
}
