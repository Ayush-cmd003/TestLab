"""add cascade to test_cases.feature_id

Revision ID: 56920eaa57e3
Revises: ee066e12db38
Create Date: 2026-04-30 17:42:22.396576

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '56920eaa57e3'
down_revision: Union[str, Sequence[str], None] = 'ee066e12db38'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.drop_constraint(
        "test_cases_feature_id_fkey",
        "test_cases",
        type_="foreignkey"
    )

    op.create_foreign_key(
        "test_cases_feature_id_fkey",
        "test_cases",
        "features",
        ["feature_id"],
        ["id"],
        ondelete="CASCADE"
    )


def downgrade() -> None:
    """Downgrade schema."""
    pass
