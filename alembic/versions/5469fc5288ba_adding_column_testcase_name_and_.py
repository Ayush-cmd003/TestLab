"""adding column testcase name and testcase type to scripts table

Revision ID: 5469fc5288ba
Revises: 0d50e1896df9
Create Date: 2026-03-26 11:12:14.725748

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5469fc5288ba'
down_revision: Union[str, Sequence[str], None] = '0d50e1896df9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('scripts', sa.Column('testcase_name', sa.String()))
    op.add_column('scripts', sa.Column('testcase_type', sa.String()))


def downgrade():
    op.drop_column('scripts', 'testcase_name')
    op.drop_column('scripts', 'testcase_type')