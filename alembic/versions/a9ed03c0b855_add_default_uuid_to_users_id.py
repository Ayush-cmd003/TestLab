"""add default uuid to users id

Revision ID: a9ed03c0b855
Revises: 1010ae74984f
Create Date: 2026-03-19 14:08:46.322014

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'a9ed03c0b855'
down_revision: Union[str, Sequence[str], None] = '1010ae74984f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        'users',
        'id',
        existing_type=postgresql.UUID(as_uuid=True),
        server_default=sa.text('gen_random_uuid()'),
        existing_nullable=False
    )

def downgrade() -> None:
    """Downgrade schema."""
    pass
