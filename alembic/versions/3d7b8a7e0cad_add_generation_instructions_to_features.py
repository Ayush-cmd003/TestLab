"""add generation_instructions to features

Revision ID: 3d7b8a7e0cad
Revises: b9f70dd44c55
Create Date: 2026-03-25 12:02:46.372582

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3d7b8a7e0cad'
down_revision: Union[str, Sequence[str], None] = 'b9f70dd44c55'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('features', sa.Column('generation_instructions', sa.Text(), nullable=True))

def downgrade():
    op.drop_column('features', 'generation_instructions')
