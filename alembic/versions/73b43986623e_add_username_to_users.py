"""add username to users

Revision ID: 73b43986623e
Revises: 7c2223a3f9ed
Create Date: 2026-03-18 14:11:22.980126

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '73b43986623e'
down_revision: Union[str, Sequence[str], None] = '7c2223a3f9ed'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("username", sa.String(length=255), nullable=True)
    )
    op.create_unique_constraint("uq_users_username", "users", ["username"])


def downgrade() -> None:
    op.drop_constraint("uq_users_username", "users", type_="unique")
    op.drop_column("users", "username")
