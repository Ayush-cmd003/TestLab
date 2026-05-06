"""add role column to users

Revision ID: 7c2223a3f9ed
Revises: 1ca1b2fbf72a
Create Date: 2026-03-18 11:18:19.218505

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7c2223a3f9ed'
down_revision: Union[str, Sequence[str], None] = '1ca1b2fbf72a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("role", sa.String(), nullable=False, server_default="user")
    )


def downgrade() -> None:
    op.drop_column("users", "role")
