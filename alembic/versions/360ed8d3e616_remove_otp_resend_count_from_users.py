"""remove otp resend count from users

Revision ID: 360ed8d3e616
Revises: 8dce6e314c66
Create Date: 2026-04-24 13:32:29.139937

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '360ed8d3e616'
down_revision: Union[str, Sequence[str], None] = '8dce6e314c66'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.drop_column("users", "otp_resend_count")


def downgrade():
    op.add_column("users",sa.Column("otp_resend_count", sa.Integer(), nullable=False, server_default="0"))