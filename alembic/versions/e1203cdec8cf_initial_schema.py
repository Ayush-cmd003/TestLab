"""initial schema

Revision ID: e1203cdec8cf
Revises: 
Create Date: 2026-03-17 15:13:11.862664

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e1203cdec8cf'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    # USERS TABLE
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(length=255)),
        sa.Column('email', sa.String(length=255), unique=True, nullable=False),
        sa.Column('password_hash', sa.Text()),
        sa.Column('api_key', sa.Text()),
        sa.Column('is_verified', sa.Boolean(), server_default=sa.text("false")),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text("true")),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now())
    )

    # PROJECTS TABLE
    op.create_table(
        'projects',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id')),
        sa.Column('name', sa.String(length=255)),
        sa.Column('description', sa.Text()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now())
    )

    # FEATURES TABLE
    op.create_table(
        'features',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('project_id', sa.Integer(), sa.ForeignKey('projects.id')),
        sa.Column('name', sa.String(length=255)),
        sa.Column('description', sa.Text()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now())
    )

    # DOCUMENTS TABLE
    op.create_table(
        'documents',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('feature_id', sa.Integer(), sa.ForeignKey('features.id')),
        sa.Column('file_name', sa.String(length=255)),
        sa.Column('file_path', sa.Text()),
        sa.Column('uploaded_at', sa.DateTime(), server_default=sa.func.now())
    )

    # TEST CASES TABLE
    op.create_table(
        'test_cases',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('feature_id', sa.Integer(), sa.ForeignKey('features.id')),
        sa.Column('title', sa.String(length=255)),
        sa.Column('steps', sa.Text()),
        sa.Column('expected_result', sa.Text()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now())
    )

    # SCRIPTS TABLE
    op.create_table(
        'scripts',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('test_case_id', sa.Integer(), sa.ForeignKey('test_cases.id')),
        sa.Column('framework', sa.String(length=50)),
        sa.Column('script', sa.Text()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now())
    )

def downgrade() -> None:

    op.drop_table('scripts')
    op.drop_table('test_cases')
    op.drop_table('documents')
    op.drop_table('features')
    op.drop_table('projects')
    op.drop_table('users')
