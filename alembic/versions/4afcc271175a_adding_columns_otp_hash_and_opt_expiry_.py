"""adding columns otp hash and opt expiry to users table

Revision ID: 4afcc271175a
Revises: 78c9bd6bfbfc
Create Date: 2026-04-23 14:08:07.794697

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4afcc271175a'
down_revision: Union[str, Sequence[str], None] = '78c9bd6bfbfc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column("users", sa.Column("otp_hash", sa.String(), nullable=True))
    op.add_column("users", sa.Column("otp_expires_at", sa.DateTime(), nullable=True))


def downgrade():
    op.drop_column("users", "otp_expires_at")
    op.drop_column("users", "otp_hash")
