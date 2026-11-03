"""cria tabela respostas_whatsapp

Controle da resposta automática do WhatsApp (fluxo do n8n): uma linha por conversa,
com a hora da última resposta automática. O fluxo só responde de novo depois de 24h,
então a pessoa recebe a mensagem automática uma vez e o resto da conversa é com a equipe.

Revision ID: d7f2c8a1e5b6
Revises: c4e1a7d2b9f3
Create Date: 2026-11-03 14:00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from config import SCHEMA

# revision identifiers, used by Alembic.
revision: str = "d7f2c8a1e5b6"
down_revision: Union[str, Sequence[str], None] = "c4e1a7d2b9f3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "respostas_whatsapp",
        sa.Column("chat_id", sa.Text(), primary_key=True, comment="conversa no WhatsApp, ex.: 5555999998888@c.us"),
        sa.Column("primeira_em", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("respondido_em", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("respostas", sa.Integer(), server_default=sa.text("1"), nullable=False),
        schema=SCHEMA,
    )


def downgrade() -> None:
    op.drop_table("respostas_whatsapp", schema=SCHEMA)
