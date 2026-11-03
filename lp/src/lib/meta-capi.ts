// API de Conversões da Meta: envia o Lead também pelo servidor.
// O navegador manda o mesmo evento pelo Pixel com o mesmo event_id, e a Meta conta uma vez só.
// Sem META_CAPI_TOKEN não faz nada. O token fica só nas variáveis do Easypanel, nunca no código.
import { createHash } from "node:crypto";

const sha = (v: string) => createHash("sha256").update(v).digest("hex");
const limpo = (v: string) => v.trim().toLowerCase();

export type LeadMeta = {
  eventId: string;
  url?: string | null;
  nome: string;
  email: string;
  telefone: string; // só dígitos, com DDD
  ip?: string;
  userAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  plano?: string | null;
  campanha?: string | null;
};

export async function enviarLeadMeta(l: LeadMeta) {
  const token = process.env.META_CAPI_TOKEN;
  const pixel = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!token || !pixel) return;

  const [primeiro, ...resto] = limpo(l.nome).replace(/[^\p{L}\s]/gu, "").split(/\s+/);
  const user_data: Record<string, unknown> = {
    em: [sha(limpo(l.email))],
    ph: [sha(`55${l.telefone}`)],
    fn: primeiro ? [sha(primeiro)] : undefined,
    ln: resto.length ? [sha(resto[resto.length - 1])] : undefined,
    country: [sha("br")],
    client_ip_address: l.ip && l.ip !== "local" ? l.ip : undefined,
    client_user_agent: l.userAgent ?? undefined,
    fbp: l.fbp ?? undefined,
    fbc: l.fbc ?? undefined,
  };

  const corpo = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: l.eventId,
        action_source: "website",
        event_source_url: l.url ?? undefined,
        user_data,
        custom_data: { content_name: l.plano ?? "Consultoria", campanha: l.campanha ?? undefined },
      },
    ],
    // código da aba "Testar eventos" do Gerenciador de Eventos (só durante o teste)
    test_event_code: process.env.META_TEST_EVENT_CODE || undefined,
    access_token: token,
  };

  const versao = process.env.META_GRAPH_VERSION || "v24.0";
  try {
    const r = await fetch(`https://graph.facebook.com/${versao}/${pixel}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) console.error("[meta-capi] resposta", r.status, (await r.text()).slice(0, 300));
  } catch (e) {
    console.error("[meta-capi] falha:", e instanceof Error ? e.message : e);
  }
}
