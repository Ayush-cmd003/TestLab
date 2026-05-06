"""add cascade delete to features.project_id

Revision ID: 704c9ee941fc
Revises: 802c4848a79c
Create Date: 2026-04-30 16:34:43.905031

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '704c9ee941fc'
down_revision: Union[str, Sequence[str], None] = '802c4848a79c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
