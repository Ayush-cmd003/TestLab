"""removing column is verified from users table

Revision ID: 78c9bd6bfbfc
Revises: 8dfe3cc5cc00
Create Date: 2026-03-26 13:42:19.845785

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '78c9bd6bfbfc'
down_revision: Union[str, Sequence[str], None] = '8dfe3cc5cc00'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.drop_column('users', 'is_verified')

def downgrade():
    op.add_column('users', sa.Column('is_verified', sa.Boolean(False), nullable=False))