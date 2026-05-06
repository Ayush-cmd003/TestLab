"""convert all ids to uuid

Revision ID: 1010ae74984f
Revises: 73b43986623e
Create Date: 2026-03-19 12:50:45.105661

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
import uuid


# revision identifiers, used by Alembic.
revision: str = '1010ae74984f'
down_revision: Union[str, Sequence[str], None] = '73b43986623e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("DROP TABLE IF EXISTS scripts CASCADE")
    op.execute("DROP TABLE IF EXISTS test_cases CASCADE")
    op.execute("DROP TABLE IF EXISTS documents CASCADE")
    op.execute("DROP TABLE IF EXISTS features CASCADE")
    op.execute("DROP TABLE IF EXISTS projects CASCADE")
    op.execute("DROP TABLE IF EXISTS users CASCADE")

    # ======================
    # USERS
    # ======================
    op.create_table(
        "users",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("username", sa.String(), unique=True),
        sa.Column("name", sa.String()),
        sa.Column("email", sa.String(), unique=True),
        sa.Column("password_hash", sa.String()),
        sa.Column("api_key", sa.String()),
        sa.Column("role", sa.String(), default="user"),
        sa.Column("is_verified", sa.Boolean(), nullable=False, default=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, default=True),
        sa.Column("created_at", sa.DateTime()),
    )

    # ======================
    # PROJECTS
    # ======================
    op.create_table(
        "projects",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("name", sa.String()),
        sa.Column("description", sa.Text()),
        sa.Column("created_at", sa.DateTime()),
    )

    # ======================
    # FEATURES
    # ======================
    op.create_table(
        "features",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("project_id", UUID(as_uuid=True), sa.ForeignKey("projects.id"), nullable=False),
        sa.Column("user_id", UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(255)),
        sa.Column("description", sa.Text()),
        sa.Column("created_at", sa.DateTime()),
    )

    # ======================
    # DOCUMENTS
    # ======================
    op.create_table(
        "documents",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("feature_id", UUID(as_uuid=True), sa.ForeignKey("features.id"), nullable=False),
        sa.Column("user_id", UUID(as_uuid=True), nullable=False),
        sa.Column("file_name", sa.String()),
        sa.Column("file_path", sa.String()),
        sa.Column("uploaded_at", sa.DateTime()),
    )

    # ======================
    # TEST CASES
    # ======================
    op.create_table(
        "test_cases",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("feature_id", UUID(as_uuid=True), sa.ForeignKey("features.id"), nullable=False),
        sa.Column("user_id", UUID(as_uuid=True), nullable=False),
        sa.Column("title", sa.String()),
        sa.Column("steps", sa.Text()),
        sa.Column("expected_result", sa.Text()),
        sa.Column("created_at", sa.DateTime()),
    )

    # ======================
    # SCRIPTS
    # ======================
    op.create_table(
        "scripts",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("test_case_id", UUID(as_uuid=True), sa.ForeignKey("test_cases.id"), nullable=False),
        sa.Column("user_id", UUID(as_uuid=True), nullable=False),
        sa.Column("framework", sa.String(50)),
        sa.Column("script", sa.Text()),
        sa.Column("created_at", sa.DateTime()),
    )


def downgrade():
    op.execute("DROP TABLE IF EXISTS scripts CASCADE")
    op.execute("DROP TABLE IF EXISTS test_cases CASCADE")
    op.execute("DROP TABLE IF EXISTS documents CASCADE")
    op.execute("DROP TABLE IF EXISTS features CASCADE")
    op.execute("DROP TABLE IF EXISTS projects CASCADE")
    op.execute("DROP TABLE IF EXISTS users CASCADE")
