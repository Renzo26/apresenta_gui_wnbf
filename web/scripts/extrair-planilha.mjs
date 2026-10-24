// Lê a planilha de projeção (pasta acima de /web) e gera data/planilha.json.
// A apresentação só usa números que saem daqui: se a planilha mudar, rode `npm run planilha`.
import ExcelJS from "exceljs";
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const pastaPlanilha = join(raiz, "..");
const arquivo = readdirSync(pastaPlanilha).find((f) => /^projecao_trafego.*\.xlsx$/i.test(f));
if (!arquivo) throw new Error("Planilha projecao_trafego*.xlsx não encontrada em " + pastaPlanilha);

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(join(pastaPlanilha, arquivo));

const valor = (aba, celula) => {
  const v = wb.getWorksheet(aba).getCell(celula).value;
  if (v && typeof v === "object" && "result" in v) return v.result;
  return v;
};
const num = (aba, celula) => {
  const v = Number(valor(aba, celula));
  if (!Number.isFinite(v)) throw new Error(`${aba}!${celula} não é número: ${valor(aba, celula)}`);
  return v;
};

const P = "Premissas";
const dados = {
  fonte: arquivo,
  premissas: {
    custoOperacao: num(P, "B5"),
    alunosAtivos: num(P, "B6"),
    entradasOrganicas: num(P, "B7"),
    fechamentoOrganico: num(P, "B8"),
    leadsOrganicos: num(P, "B9"),
    capacidadeEntradas: num(P, "B10"),
    teto: num(P, "B11"),
    permanencia: num(P, "B12"),
  },
  planos: [17, 18, 19].map((l) => ({
    nome: String(valor(P, `A${l}`)),
    preco: num(P, `B${l}`),
    meses: num(P, `C${l}`),
    vendas: num(P, `D${l}`),
    peso: num(P, `E${l}`),
    valorMensal: num(P, `F${l}`),
  })),
  indicadores: {
    ticketMedio: num(P, "B23"),
    valorMensalMedio: num(P, "B24"),
    ltv: num(P, "B25"),
    custoAtendimentoMes: num(P, "B26"),
    custoAtendimentoPeriodo: num(P, "B27"),
    cacEquilibrio: num(P, "B28"),
    folgaEntradas: num(P, "B29"),
    entradasManutencao: num(P, "B30"),
  },
  cenarios: [33, 34, 35].map((l) => ({
    nome: String(valor(P, `A${l}`)),
    cpl: num(P, `B${l}`),
    fechamento: num(P, `C${l}`),
    cac: num(P, `D${l}`),
  })),
  verbas: [38, 39, 40].map((l) => num(P, `B${l}`)),
  projecao: [5, 6, 7, 8, 9, 10, 11, 12, 13].map((l) => ({
    cenario: String(valor("Projeção", `A${l}`)),
    verba: num("Projeção", `B${l}`),
    leads: num("Projeção", `F${l}`),
    alunosPotencial: num("Projeção", `G${l}`),
    alunos: num("Projeção", `H${l}`),
    resultado: num("Projeção", `L${l}`),
    verbaManutencao: num("Projeção", `Q${l}`),
  })),
  limiteBomCac: num("Sensibilidade", "B5"),
  sensibilidade: {
    cpls: [9, 10, 11, 12, 13, 14, 15, 16].map((l) => num("Sensibilidade", `A${l}`)),
    fechamentos: ["B", "C", "D", "E", "F", "G"].map((c) => num("Sensibilidade", `${c}8`)),
  },
  listaEspera: {
    verba: num("Evolução", "B8"),
    cplRelativo: num("Evolução", "B9"),
    conversaoRelativa: num("Evolução", "B10"),
    cacMedio: num("Evolução", "B32"),
    cacEspera: num("Evolução", "B34"),
    cacAnuncio: num("Evolução", "B35"),
    alunosDaEspera: num("Evolução", "C31"),
    verbaNormalMax: num("Evolução", "B4"),
  },
};

mkdirSync(join(raiz, "data"), { recursive: true });
writeFileSync(join(raiz, "data", "planilha.json"), JSON.stringify(dados, null, 2) + "\n");
console.log(`data/planilha.json gerado a partir de "${arquivo}"`);
