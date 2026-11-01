// Conexão com o Postgres do Supabase na VPS (banco `postgres`). Só no servidor.
// As tabelas são criadas pelo Alembic em db/ (schema `paginas`).
import postgres from "postgres";

export const SCHEMA = process.env.DATABASE_SCHEMA ?? "paginas";

let cliente: postgres.Sql | undefined;

/** Cliente único e preguiçoso: só conecta no primeiro uso (o build não precisa de banco). */
export function db() {
  cliente ??= postgres({
    host: process.env.DATABASE_HOST ?? "db",
    port: Number(process.env.DATABASE_PORT ?? 5432),
    database: process.env.DATABASE_NAME ?? "postgres",
    username: process.env.DATABASE_USER ?? "postgres",
    password: process.env.DATABASE_PASSWORD,
    // o Postgres do Docker na VPS não tem certificado; o Supabase gerenciado exige SSL
    ssl: process.env.DATABASE_SSL === "true" ? "require" : false,
    max: 5,
    idle_timeout: 30,
    connect_timeout: 10,
  });
  return cliente;
}
