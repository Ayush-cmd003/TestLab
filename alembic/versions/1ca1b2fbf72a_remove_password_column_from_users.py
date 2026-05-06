"""remove password column from users

Revision ID: 1ca1b2fbf72a
Revises: e1203cdec8cf
Create Date: 2026-03-18 11:09:03.521798

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1ca1b2fbf72a'
down_revision: Union[str, Sequence[str], None] = 'e1203cdec8cf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # op.drop_column('users', 'password')
    pass


def downgrade() -> None:
        op.add_column(
        'users',
        sa.Column('password', sa.String(), nullable=False)
    )
