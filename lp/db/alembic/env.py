from logging.config import fileConfig

from alembic import context
from sqlalchemy import create_engine, pool, text

from config import SCHEMA, database_url

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Sem models: as migrações são escritas à mão (é uma tabela só).
target_metadata = None


def run_migrations_offline() -> None:
    """Gera o SQL sem conectar (alembic upgrade head --sql), para revisar antes de aplicar."""
    context.configure(
        url="postgresql+psycopg://",
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        version_table_schema=SCHEMA,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    engine = create_engine(database_url(), poolclass=pool.NullPool)
    with engine.connect() as connection:
        # O banco é compartilhado: tudo (inclusive a tabela de versões do Alembic) fica no schema
        # das páginas, nunca no `public` nem no `wnbf` do sistema de inscrições.
        connection.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{SCHEMA}"'))
        connection.execute(text(f'SET search_path TO "{SCHEMA}"'))
        connection.commit()

        context.configure(connection=connection, target_metadata=target_metadata, version_table_schema=SCHEMA)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
