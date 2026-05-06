"""add cascade delete to all foreign keys

Revision ID: ee066e12db38
Revises: 704c9ee941fc
Create Date: 2026-04-30 17:29:54.923658

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ee066e12db38'
down_revision: Union[str, Sequence[str], None] = '704c9ee941fc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade():
    op.drop_constraint(
        "features_project_id_fkey",
        "features",
        type_="foreignkey"
    )

    op.create_foreign_key(
        "features_project_id_fkey",
        "features",
        "projects",
        ["project_id"],
        ["id"],
        ondelete="CASCADE"
    )


def downgrade() -> None:
    """Downgrade schema."""
    pass
