"""creating user table which is deleted by mistake

Revision ID: 49df6b0e135a
Revises: 3d7b8a7e0cad
Create Date: 2026-03-25 14:34:29.814599

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '49df6b0e135a'
down_revision: Union[str, Sequence[str], None] = '3d7b8a7e0cad'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
    'users',
    sa.Column('id', sa.UUID(), primary_key=True, nullable=False),
    sa.Column('username', sa.String(), unique=True),
    sa.Column('name', sa.String()),
    sa.Column('email', sa.String(), unique=True),
    sa.Column('password_hash', sa.String()),
    sa.Column('api_key', sa.String()),
    sa.Column('role', sa.String(), server_default='user'),
    sa.Column('is_verified', sa.Boolean(), nullable=False, server_default=sa.text('false')),
    sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
    sa.Column('created_at', sa.DateTime())
)


def downgrade():
    op.execute("DROP TABLE IF EXISTS users CASCADE")
