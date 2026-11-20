/** Topo "redondo" do eixo (1, 2, 2,5, 5 × 10ⁿ) e as marcas. */
export function escalaY(max: number, marcas = 4, inteiros = false) {
  if (!isFinite(max) || max <= 0) return { topo: 1, ticks: [0, 1] };
  const bruto = max / marcas;
  const mag = 10 ** Math.floor(Math.log10(bruto));
  // contagens (vendas, conversas): só marcas inteiras, nada de "2,5 vendas"
  const passos = [1, 2, 2.5, 5, 10].map((m) => m * mag).filter((p) => !inteiros || Number.isInteger(p));
  const passo = Math.max(inteiros ? 1 : 0, passos.find((p) => p >= bruto) ?? 10 * mag);
  const topo = Math.ceil(max / passo) * passo;
  const ticks: number[] = [];
  for (let v = 0; v <= topo + passo / 2; v += passo) ticks.push(v);
  return { topo, ticks };
}

/** Índices das marcas do eixo X (no máximo `max`, sempre com a primeira e a última). */
export function marcasX(n: number, max: number) {
  if (n <= max) return Array.from({ length: n }, (_, i) => i);
  const passo = Math.ceil((n - 1) / (max - 1));
  const out: number[] = [];
  for (let i = 0; i < n; i += passo) out.push(i);
  if (out[out.length - 1] !== n - 1) {
    if (n - 1 - out[out.length - 1] < passo / 2) out.pop();
    out.push(n - 1);
  }
  return out;
}

/** Retângulo com só as pontas de cima arredondadas (a base fica reta, presa no eixo). */
export function barraTopo(x: number, y: number, w: number, h: number, r = 4) {
  if (h <= 0 || w <= 0) return "";
  const rr = Math.min(r, w / 2, h);
  return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`;
}

/** Afasta rótulos verticais que se sobrepõem (rótulos diretos no fim das linhas). */
export function separar(ys: number[], minimo = 15, topo = 0, base = Infinity) {
  const ordem = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
  for (let k = 1; k < ordem.length; k++) if (ordem[k].y - ordem[k - 1].y < minimo) ordem[k].y = ordem[k - 1].y + minimo;
  const excesso = ordem.length ? ordem[ordem.length - 1].y - base : 0;
  if (excesso > 0) for (const o of ordem) o.y -= excesso;
  for (const o of ordem) o.y = Math.max(topo, o.y);
  const out = [...ys];
  for (const o of ordem) out[o.i] = o.y;
  return out;
}
