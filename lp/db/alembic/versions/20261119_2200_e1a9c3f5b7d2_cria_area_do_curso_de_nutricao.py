"""cria a área do curso de nutrição (/curso-nutricao)

Área de membros do curso: o aluno entra com o e-mail da compra (sem senha) e assiste às aulas.
Tudo num schema próprio (`area_membros`, ou CURSO_SCHEMA), separado dos leads das páginas:
- cursos: dados do curso (título, textos, biblioteca do Bunny, links de suporte e compra)
- curso_aulas: aulas em ordem, com o vídeo do Bunny (biblioteca + id do vídeo)
- curso_alunos: e-mails com acesso (liberado/bloqueado), último acesso e quantidade de acessos
- curso_admins: quem entra no painel (/curso-nutricao/admin), com a senha guardada só como hash (scrypt)
Já entra com o curso "nutricao" e as 19 aulas do pacote original (dlm-area-membros).

Revision ID: e1a9c3f5b7d2
Revises: d7f2c8a1e5b6
Create Date: 2026-11-19 22:00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from config import CURSO_SCHEMA

revision: str = "e1a9c3f5b7d2"
down_revision: Union[str, Sequence[str], None] = "d7f2c8a1e5b6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

AULAS = [
    {'id': 'a4c072ac14', 'modulo': 'Introdução', 'titulo': 'Introdução ao curso', 'duracao': '8 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/a4c072ac-1467-4ae8-8fec-0c77ff13292b/thumbnail.jpg', 'biblioteca': '813424', 'video': 'a4c072ac-1467-4ae8-8fec-0c77ff13292b'},
    {'id': 'bc5ac5a83b', 'modulo': 'Módulo 1', 'titulo': 'O que um natural deve esperar da sua evolução?', 'duracao': '10 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/bc5ac5a8-3b0e-4a91-ba25-be71c3ce51a7/thumbnail.jpg', 'biblioteca': '813424', 'video': 'bc5ac5a8-3b0e-4a91-ba25-be71c3ce51a7'},
    {'id': 'd9a13ac1bd', 'modulo': 'Módulo 1', 'titulo': 'O metabolismo de naturais é diferente de hormonizados?', 'duracao': '7 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/d9a13ac1-bd06-4683-bb4f-437e288998f2/thumbnail.jpg', 'biblioteca': '813424', 'video': 'd9a13ac1-bd06-4683-bb4f-437e288998f2'},
    {'id': '3fed74fd71', 'modulo': 'Módulo 2 · O ponto de partida ideal', 'titulo': 'O seu BF (%GC) determina boa parte da estratégia', 'duracao': '17 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/3fed74fd-7110-4c1d-b01b-72b97ee27a30/thumbnail.jpg', 'biblioteca': '813424', 'video': '3fed74fd-7110-4c1d-b01b-72b97ee27a30'},
    {'id': '500a3bcb2f', 'modulo': 'Módulo 2 · O ponto de partida ideal', 'titulo': 'Bulking ou cutting? Uma visão além do BF', 'duracao': '16 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/500a3bcb-2f20-4f08-bbd4-a164ef6983f4/thumbnail.jpg', 'biblioteca': '813424', 'video': '500a3bcb-2f20-4f08-bbd4-a164ef6983f4'},
    {'id': '21b083dc0c', 'modulo': 'Módulo 2 · O ponto de partida ideal', 'titulo': 'Iniciando a montagem da dieta: calorias de manutenção', 'duracao': '18 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/21b083dc-0ce6-4329-b991-60e27f5cf2dd/thumbnail.jpg', 'biblioteca': '813424', 'video': '21b083dc-0ce6-4329-b991-60e27f5cf2dd'},
    {'id': '6aa22fe500', 'modulo': 'Módulo 2 · O ponto de partida ideal', 'titulo': 'Quais são as métricas para a evolução do físico?', 'duracao': '18 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/6aa22fe5-0093-419d-8131-66a0d83de43c/thumbnail.jpg', 'biblioteca': '813424', 'video': '6aa22fe5-0093-419d-8131-66a0d83de43c'},
    {'id': '9189f2f5d4', 'modulo': 'Módulo 3 · Reset calórico: a lógica por trás', 'titulo': 'Como ter recomposição corporal?', 'duracao': '15 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/9189f2f5-d4a0-4152-9f6c-803a619a3d34/thumbnail.jpg', 'biblioteca': '813424', 'video': '9189f2f5-d4a0-4152-9f6c-803a619a3d34'},
    {'id': '972db85afe', 'modulo': 'Módulo 3 · Reset calórico: a lógica por trás', 'titulo': 'Você aprendeu o superávit e déficit calórico errado', 'duracao': '15 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/972db85a-fe6d-4456-9d1d-e762e0547bf7/thumbnail.jpg', 'biblioteca': '813424', 'video': '972db85a-fe6d-4456-9d1d-e762e0547bf7'},
    {'id': 'fdee8cd972', 'modulo': 'Módulo 3 · Reset calórico: a lógica por trás', 'titulo': 'Erros comuns no cutting', 'duracao': '13 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/fdee8cd9-7256-41d1-82a8-3ae9e0615c19/thumbnail.jpg', 'biblioteca': '813424', 'video': 'fdee8cd9-7256-41d1-82a8-3ae9e0615c19'},
    {'id': '853ccdccfa', 'modulo': 'Módulo 3 · Reset calórico: a lógica por trás', 'titulo': 'Erros comuns no bulking', 'duracao': '11 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/853ccdcc-faf4-4629-9e0a-46ca6702b7e4/thumbnail.jpg', 'biblioteca': '813424', 'video': '853ccdcc-faf4-4629-9e0a-46ca6702b7e4'},
    {'id': '450bc70dce', 'modulo': 'Módulo 3 · Reset calórico: a lógica por trás', 'titulo': 'Quem deveria fazer uma recomposição corporal?', 'duracao': '9 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/450bc70d-cecf-4a3d-9d01-73693e6820b8/thumbnail.jpg', 'biblioteca': '813424', 'video': '450bc70d-cecf-4a3d-9d01-73693e6820b8'},
    {'id': 'e5839b0f7c', 'modulo': 'Módulo 4 · Fase 1: equalização calórica', 'titulo': 'O que são alimentos equivalentes?', 'duracao': '12 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/e5839b0f-7c1c-4a1e-bc73-a3fc6d40d66e/thumbnail.jpg', 'biblioteca': '813424', 'video': 'e5839b0f-7c1c-4a1e-bc73-a3fc6d40d66e'},
    {'id': '74726b4e47', 'modulo': 'Módulo 4 · Fase 1: equalização calórica', 'titulo': 'A dieta flexível de forma inteligente', 'duracao': '13 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/74726b4e-47ee-45e3-8a13-904ffc7747b6/thumbnail.jpg', 'biblioteca': '813424', 'video': '74726b4e-47ee-45e3-8a13-904ffc7747b6'},
    {'id': 'a350b7e7ca', 'modulo': 'Módulo 4 · Fase 1: equalização calórica', 'titulo': 'Como saber suas calorias de equilíbrio?', 'duracao': '11 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/a350b7e7-ca66-4bf1-a798-0d9ceee69818/thumbnail.jpg', 'biblioteca': '813424', 'video': 'a350b7e7-ca66-4bf1-a798-0d9ceee69818'},
    {'id': '41819b4d6c', 'modulo': 'Módulo 4 · Fase 1: equalização calórica', 'titulo': 'O superávit e déficit calórico: como calcular?', 'duracao': '14 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/41819b4d-6c30-4908-9f83-9009b8326954/thumbnail.jpg', 'biblioteca': '813424', 'video': '41819b4d-6c30-4908-9f83-9009b8326954'},
    {'id': '686986ebef', 'modulo': 'Módulo 4 · Fase 1: equalização calórica', 'titulo': 'A recomendação e função da proteína', 'duracao': '20 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/686986eb-efef-4633-bc25-878970444e44/thumbnail.jpg', 'biblioteca': '813424', 'video': '686986eb-efef-4633-bc25-878970444e44'},
    {'id': 'fdfcf6c2de', 'modulo': 'Módulo 4 · Fase 1: equalização calórica', 'titulo': 'A recomendação e função do carboidrato', 'duracao': '18 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/fdfcf6c2-de02-42cc-a9e3-4dfda1eff5d0/thumbnail.jpg', 'biblioteca': '813424', 'video': 'fdfcf6c2-de02-42cc-a9e3-4dfda1eff5d0'},
    {'id': 'be08cc7003', 'modulo': 'Módulo 4 · Fase 1: equalização calórica', 'titulo': 'A recomendação e função da gordura', 'duracao': '17 min', 'capa': 'https://vz-4dc93ed2-28d.b-cdn.net/be08cc70-0343-4063-bf37-78c2d19e2f47/thumbnail.jpg', 'biblioteca': '813424', 'video': 'be08cc70-0343-4063-bf37-78c2d19e2f47'},
]


def upgrade() -> None:
    op.execute(f'CREATE SCHEMA IF NOT EXISTS "{CURSO_SCHEMA}"')
    agora = sa.text("now()")
    cursos = op.create_table(
        "cursos",
        sa.Column("slug", sa.Text(), primary_key=True, comment="ex.: nutricao (vira /curso-nutricao)"),
        sa.Column("titulo", sa.Text(), nullable=False),
        sa.Column("subtitulo", sa.Text(), server_default="", nullable=False),
        sa.Column("boas_vindas", sa.Text(), server_default="", nullable=False),
        sa.Column("biblioteca", sa.Text(), server_default="", nullable=False, comment="ID da biblioteca no Bunny Stream"),
        sa.Column("suporte", sa.Text(), server_default="", nullable=False, comment="link de suporte (WhatsApp)"),
        sa.Column("compra", sa.Text(), server_default="", nullable=False, comment="link para quem ainda não comprou"),
        sa.Column("atualizado_em", sa.DateTime(timezone=True), server_default=agora, nullable=False),
        schema=CURSO_SCHEMA,
    )
    aulas = op.create_table(
        "curso_aulas",
        sa.Column("id", sa.Text(), primary_key=True),
        sa.Column("curso", sa.Text(), sa.ForeignKey(f"{CURSO_SCHEMA}.cursos.slug", ondelete="CASCADE"), nullable=False),
        sa.Column("ordem", sa.Integer(), nullable=False),
        sa.Column("modulo", sa.Text(), server_default="", nullable=False),
        sa.Column("titulo", sa.Text(), nullable=False),
        sa.Column("descricao", sa.Text(), server_default="", nullable=False),
        sa.Column("duracao", sa.Text(), server_default="", nullable=False),
        sa.Column("capa", sa.Text(), server_default="", nullable=False),
        sa.Column("material", sa.Text(), server_default="", nullable=False),
        sa.Column("biblioteca", sa.Text(), server_default="", nullable=False),
        sa.Column("video", sa.Text(), server_default="", nullable=False),
        schema=CURSO_SCHEMA,
    )
    op.create_index("ix_curso_aulas_curso_ordem", "curso_aulas", ["curso", "ordem"], schema=CURSO_SCHEMA)
    op.create_table(
        "curso_alunos",
        sa.Column("curso", sa.Text(), sa.ForeignKey(f"{CURSO_SCHEMA}.cursos.slug", ondelete="CASCADE"), primary_key=True),
        sa.Column("email", sa.Text(), primary_key=True),
        sa.Column("ativo", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("liberado_em", sa.DateTime(timezone=True), server_default=agora, nullable=False),
        sa.Column("ultimo_acesso", sa.DateTime(timezone=True), nullable=True),
        sa.Column("acessos", sa.Integer(), server_default=sa.text("0"), nullable=False),
        schema=CURSO_SCHEMA,
    )

    op.create_table(
        "curso_admins",
        sa.Column("email", sa.Text(), primary_key=True),
        sa.Column("senha_hash", sa.Text(), nullable=False, comment="scrypt$salt$hash (nunca a senha)"),
        sa.Column("criado_em", sa.DateTime(timezone=True), server_default=agora, nullable=False),
        sa.Column("ultimo_acesso", sa.DateTime(timezone=True), nullable=True),
        schema=CURSO_SCHEMA,
    )

    op.bulk_insert(cursos, [{
        "slug": "nutricao",
        "titulo": "Nutrição Básica para Naturais",
        "subtitulo": "O único time especializado em naturais",
        "boas_vindas": "Assista às aulas na ordem: cada uma prepara a próxima. Marque como assistida para acompanhar seu progresso.",
        "biblioteca": "813424",
        "suporte": "https://wa.me/555592058149?text=" + "Ol%C3%A1!%20Preciso%20de%20ajuda%20com%20o%20acesso%20ao%20curso%20de%20nutri%C3%A7%C3%A3o.",
        "compra": "",
    }])
    op.bulk_insert(aulas, [{**a, "curso": "nutricao", "ordem": i} for i, a in enumerate(AULAS)])


def downgrade() -> None:
    op.drop_table("curso_admins", schema=CURSO_SCHEMA)
    op.drop_table("curso_alunos", schema=CURSO_SCHEMA)
    op.drop_index("ix_curso_aulas_curso_ordem", table_name="curso_aulas", schema=CURSO_SCHEMA)
    op.drop_table("curso_aulas", schema=CURSO_SCHEMA)
    op.drop_table("cursos", schema=CURSO_SCHEMA)
    # sem CASCADE: só apaga o schema se ele ficou vazio
    op.execute(f'DROP SCHEMA IF EXISTS "{CURSO_SCHEMA}"')
