import { ImageResponse } from "next/og";
import { BONUS_BF, DESCONTO_BF, PARCELAS_BF, PLANOS_BF, reais } from "@/lib/black-friday";

export const alt = `Black Friday: ${DESCONTO_BF}% OFF na consultoria do Jayme De Lamadrid`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// imagem de compartilhamento (WhatsApp, Instagram, Google): preto e amarelo, com o menor valor mensal
export default function Image() {
  const anual = PLANOS_BF[2];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0b0b0a", color: "#f2efe8", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1 }}>DLM</div>
          <div style={{ display: "flex", background: "#f0c541", color: "#0b0b0a", padding: "10px 22px", borderRadius: 12, fontSize: 30, fontWeight: 900 }}>BLACK FRIDAY</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 900, lineHeight: 1, letterSpacing: -3 }}>CONSULTORIA COM</div>
          <div style={{ fontSize: 150, fontWeight: 900, lineHeight: 1, color: "#f0c541", letterSpacing: -5 }}>{`${DESCONTO_BF}% OFF`}</div>
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "rgba(242,239,232,0.8)" }}>
          {`Jayme De Lamadrid · a partir de ${reais(anual.porMes)}/mês · ${PARCELAS_BF}x sem juros · + ${BONUS_BF}`}
        </div>
      </div>
    ),
    size,
  );
}
