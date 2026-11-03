"""adiciona coluna botao em leads

Qual botão levou a pessoa ao WhatsApp: "Plano Anual", "Plano Semestral",
"Plano Trimestral" ou "Entrar em contato". Os leads já gravados são preenchidos
a partir da coluna plano.

Revision ID: c4e1a7d2b9f3
Revises: b69d2fbce65f
Create Date: 2026-11-03 12:00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from config import SCHEMA

# revision identifiers, used by Alembic.
revision: str = "c4e1a7d2b9f3"
down_revision: Union[str, Sequence[str], None] = "b69d2fbce65f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("leads", sa.Column("botao", sa.Text(), nullable=True), schema=SCHEMA)
    op.execute(
        f"""UPDATE "{SCHEMA}".leads
            SET botao = CASE WHEN plano IS NOT NULL THEN 'Plano ' || initcap(plano) ELSE 'Entrar em contato' END
            WHERE botao IS NULL"""
    )
    op.create_index("ix_leads_botao", "leads", ["botao"], schema=SCHEMA)


def downgrade() -> None:
    op.drop_index("ix_leads_botao", table_name="leads", schema=SCHEMA)
    op.drop_column("leads", "botao", schema=SCHEMA)
