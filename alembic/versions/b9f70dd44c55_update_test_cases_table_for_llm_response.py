"""update test_cases table for llm response

Revision ID: b9f70dd44c55
Revises: a9ed03c0b855
Create Date: 2026-03-24 21:16:57.428783

"""
from typing import Sequence, Union
from sqlalchemy.dialects.postgresql import UUID, JSONB
from alembic import op
from sqlalchemy import String, Text, Integer, Column, DateTime, ForeignKey


# revision identifiers, used by Alembic.
revision: str = 'b9f70dd44c55'
down_revision: Union[str, Sequence[str], None] = 'a9ed03c0b855'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.create_table(
        'test_cases',
        Column('id', UUID(as_uuid=True), primary_key=True),
        Column('feature_id', UUID(as_uuid=True), ForeignKey('features.id'), nullable=False),
        Column('user_id', UUID(as_uuid=True), nullable=False),
        Column('testcase_id', String(), unique=True),
        Column('testcase_name', String()),
        Column('testcase_type', String()),
        Column('pre_conditions', JSONB()),
        Column('testcase_steps', JSONB()),
        Column('expected_result', Text()),
        Column('testcase_version', Integer()),
        Column('created_at', DateTime())
    )


def downgrade():
    op.drop_table('test_cases')
    op.create_table(
        'test_cases',
        Column('id', UUID(as_uuid=True), primary_key=True),
        Column('feature_id', UUID(as_uuid=True), ForeignKey('features.id'), nullable=False),
        Column('user_id', UUID(as_uuid=True), nullable=False),
        Column('title', String()),
        Column('steps', Text()),
        Column('expected_result', Text()),
        Column('created_at', DateTime())
    )
