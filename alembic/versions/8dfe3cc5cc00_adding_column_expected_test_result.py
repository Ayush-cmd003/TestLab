"""adding column expected test result

Revision ID: 8dfe3cc5cc00
Revises: 5469fc5288ba
Create Date: 2026-03-26 11:20:40.243130

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8dfe3cc5cc00'
down_revision: Union[str, Sequence[str], None] = '5469fc5288ba'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('scripts', sa.Column('expected_result', sa.Text()))

def downgrade():
    op.drop_column('scripts', 'expected_result')