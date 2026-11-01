"""Conexão com o Postgres do projeto WNBF (o mesmo banco do sistema de check-in), lida do ambiente."""

import os
import re
from urllib.parse import quote_plus

# Schema próprio das páginas: o banco é compartilhado com outras aplicações.
SCHEMA = os.environ.get("DATABASE_SCHEMA", "paginas")
if not re.fullmatch(r"[a-z_][a-z0-9_]*", SCHEMA):
    raise ValueError(f"DATABASE_SCHEMA inválido: {SCHEMA!r}")


def database_url() -> str:
    usuario = quote_plus(os.environ["DATABASE_USER"])
    senha = quote_plus(os.environ["DATABASE_PASSWORD"])
    host = os.environ.get("DATABASE_HOST", "db")
    porta = os.environ.get("DATABASE_PORT", "5432")
    banco = os.environ.get("DATABASE_NAME", "wnbf")
    # O Postgres do Docker na VPS não tem certificado; o Supabase gerenciado exige SSL.
    ssl = "require" if os.environ.get("DATABASE_SSL", "false").lower() == "true" else "disable"
    return f"postgresql+psycopg://{usuario}:{senha}@{host}:{porta}/{banco}?sslmode={ssl}"
