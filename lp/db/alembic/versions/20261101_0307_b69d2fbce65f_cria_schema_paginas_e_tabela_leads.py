"""cria schema paginas e tabela leads

Leads do formulário que aparece antes do WhatsApp na página da Black Friday
(nome, e-mail, telefone, de onde veio e os parâmetros de campanha).

Revision ID: b69d2fbce65f
Revises:
Create Date: 2026-11-01 03:07:35.081553

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from config import SCHEMA

# revision identifiers, used by Alembic.
revision: str = "b69d2fbce65f"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute(f'CREATE SCHEMA IF NOT EXISTS "{SCHEMA}"')

    op.create_table(
        "leads",
        sa.Column("id", sa.BigInteger(), sa.Identity(always=True), primary_key=True),
        sa.Column("nome", sa.Text(), nullable=False),
        sa.Column("email", sa.Text(), nullable=False),
        # só dígitos, com DDD (10 ou 11)
        sa.Column("telefone", sa.Text(), nullable=False),
        # página e botão de onde o lead veio
        sa.Column("pagina", sa.Text(), nullable=False),
        sa.Column("origem", sa.Text(), nullable=True),
        sa.Column("plano", sa.Text(), nullable=True),
        # campanha (colunas próprias para filtrar fácil) + todos os parâmetros brutos
        sa.Column("utm_source", sa.Text(), nullable=True),
        sa.Column("utm_medium", sa.Text(), nullable=True),
        sa.Column("utm_campaign", sa.Text(), nullable=True),
        sa.Column("utm_content", sa.Text(), nullable=True),
        sa.Column("utm_term", sa.Text(), nullable=True),
        sa.Column("parametros", postgresql.JSONB(), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column("referrer", sa.Text(), nullable=True),
        sa.Column("user_agent", sa.Text(), nullable=True),
        sa.Column("criado_em", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.CheckConstraint("telefone ~ '^[0-9]{10,11}$'", name="leads_telefone_digitos"),
        sa.CheckConstraint("position('@' in email) > 1", name="leads_email_valido"),
        schema=SCHEMA,
    )
    op.create_index("leads_criado_em_idx", "leads", [sa.text("criado_em DESC")], schema=SCHEMA)
    op.create_index("leads_email_idx", "leads", [sa.text("lower(email)")], schema=SCHEMA)
    op.create_index("leads_campanha_idx", "leads", ["utm_source", "utm_campaign"], schema=SCHEMA)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("leads", schema=SCHEMA)
    # o schema só é removido se estiver vazio (a tabela de versões do Alembic também mora nele)
