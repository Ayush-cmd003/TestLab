"""adding column prompt_used to testcases table

Revision ID: 802c4848a79c
Revises: 360ed8d3e616
Create Date: 2026-04-29 16:00:43.986074

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '802c4848a79c'
down_revision: Union[str, Sequence[str], None] = '360ed8d3e616'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column("test_cases", sa.Column("prompt_used", sa.Text(), nullable=True))

def downgrade():
    op.drop_column("test_cases", "prompt_used")