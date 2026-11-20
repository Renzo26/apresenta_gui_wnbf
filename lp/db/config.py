"""Conexão com o Postgres do Supabase na VPS (banco `postgres`), lida do ambiente."""

import os
import re
from urllib.parse import quote_plus

# Schema próprio das páginas: o banco é compartilhado com o Supabase e outras aplicações (ex.: `wnbf`).
SCHEMA = os.environ.get("DATABASE_SCHEMA", "paginas")
if not re.fullmatch(r"[a-z_][a-z0-9_]*", SCHEMA):
    raise ValueError(f"DATABASE_SCHEMA inválido: {SCHEMA!r}")

# Schema próprio da área de membros dos cursos (/curso-nutricao): alunos, aulas e admins do painel,
# separado dos leads das páginas. O controle de versão do Alembic continua no schema das páginas.
CURSO_SCHEMA = os.environ.get("CURSO_SCHEMA", "area_membros")
if not re.fullmatch(r"[a-z_][a-z0-9_]*", CURSO_SCHEMA):
    raise ValueError(f"CURSO_SCHEMA inválido: {CURSO_SCHEMA!r}")


def database_url() -> str:
    usuario = quote_plus(os.environ.get("DATABASE_USER", "postgres"))
    senha = quote_plus(os.environ["DATABASE_PASSWORD"])
    host = os.environ.get("DATABASE_HOST", "db")
    porta = os.environ.get("DATABASE_PORT", "5432")
    banco = os.environ.get("DATABASE_NAME", "postgres")
    # O Postgres do Docker na VPS não tem certificado; o Supabase gerenciado exige SSL.
    ssl = "require" if os.environ.get("DATABASE_SSL", "false").lower() == "true" else "disable"
    return f"postgresql+psycopg://{usuario}:{senha}@{host}:{porta}/{banco}?sslmode={ssl}"
