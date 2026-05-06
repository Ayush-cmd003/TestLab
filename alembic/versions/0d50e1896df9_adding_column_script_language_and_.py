"""adding column script language and updating column name framework to scripting_tools

Revision ID: 0d50e1896df9
Revises: 49df6b0e135a
Create Date: 2026-03-26 02:51:56.776450

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0d50e1896df9'
down_revision: Union[str, Sequence[str], None] = '49df6b0e135a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('scripts', sa.Column('script_language', sa.String(50)))
    op.alter_column(
        'scripts',
        'framework',
        new_column_name='script_tool',
        existing_type=sa.String(50)
    )


def downgrade():
    op.drop_column('scripts', 'script_language')
