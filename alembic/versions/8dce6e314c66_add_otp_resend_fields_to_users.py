"""add otp resend fields to users

Revision ID: 8dce6e314c66
Revises: 4afcc271175a
Create Date: 2026-04-24 12:08:32.467038

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8dce6e314c66'
down_revision: Union[str, Sequence[str], None] = '4afcc271175a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column("users", sa.Column("otp_resend_count", sa.Integer(), nullable=False, server_default="0"))
    op.add_column("users", sa.Column("otp_last_sent_at", sa.DateTime(), nullable=True))

def downgrade():
    op.drop_column("users", "otp_last_sent_at")
    op.drop_column("users", "otp_resend_count")
