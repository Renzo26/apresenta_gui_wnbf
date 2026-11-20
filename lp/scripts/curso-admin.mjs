// Gera o SQL para criar (ou trocar a senha de) um admin do painel /curso-nutricao/admin.
// A senha vira hash aqui, no seu computador; só o hash vai para o banco.
//
// Uso:
//   EMAIL=fulano@exemplo.com SENHA='uma senha forte' node scripts/curso-admin.mjs [schema]
// e rode o SQL impresso no banco (Supabase Studio → SQL, ou psql).
//
// Mesmo formato de src/lib/curso.ts (hashSenha): scrypt$<sal>$<hash>, N=16384, r=8, p=1, 64 bytes.
import { randomBytes, scryptSync } from "node:crypto";

const email = String(process.env.EMAIL ?? "").trim().toLowerCase();
const senha = String(process.env.SENHA ?? "");
const schema = process.argv[2] ?? "area_membros";

if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new Error("EMAIL inválido");
if (senha.length < 8) throw new Error("SENHA precisa de pelo menos 8 caracteres");
if (!/^[a-z_][a-z0-9_]*$/.test(schema)) throw new Error("schema inválido");

const sal = randomBytes(16);
const hash = scryptSync(senha.normalize("NFKC"), sal, 64, { N: 16384, r: 8, p: 1 });
const senhaHash = `scrypt$${sal.toString("base64url")}$${hash.toString("base64url")}`;

console.log(
  `insert into ${schema}.curso_admins (email, senha_hash) values ('${email.replace(/'/g, "''")}', '${senhaHash}')\n` +
    `  on conflict (email) do update set senha_hash = excluded.senha_hash;`,
);
