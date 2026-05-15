from sqlalchemy import Column, String, Text, ForeignKey, Boolean, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime, timezone
import uuid
from .connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True)
    name = Column(String)
    email = Column(String, unique=True)
    password_hash = Column(String)
    api_key = Column(String)
    role = Column(String, default="user")
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    otp_hash = Column(String, nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
    otp_last_sent_at = Column(DateTime, nullable=True)

    projects = relationship(
        "Project",
        back_populates="user",
        cascade="all, delete",
        lazy="selectin"
    )

class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String)
    description = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship(
        "User",
        back_populates="projects"
    )

    features = relationship(
        "Feature",
        back_populates="project",
        cascade="all, delete",
        lazy="selectin"
    )

class Feature(Base):
    __tablename__ = "features"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    name = Column(String(255))
    description = Column(Text)
    generation_instructions = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    project = relationship(
        "Project",
        back_populates="features"
    )

    documents = relationship(
        "Document",
        back_populates="feature",
        cascade="all, delete",
        lazy="selectin"
    )

    test_cases = relationship(
        "TestCase",
        back_populates="feature",
        cascade="all, delete",
        lazy="selectin"
    )

class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    feature_id = Column(UUID(as_uuid=True), ForeignKey("features.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    file_name = Column(String)
    file_path = Column(String)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    feature = relationship(
        "Feature",
        back_populates="documents"
    )

class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    feature_id = Column(UUID(as_uuid=True), ForeignKey("features.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    testcase_id = Column(String)
    testcase_name = Column(String)
    testcase_type = Column(String)
    pre_conditions = Column(JSONB)
    testcase_steps = Column(JSONB)
    expected_result = Column(Text)
    testcase_version = Column(Integer, nullable=False)
    prompt_used = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    feature = relationship(
        "Feature",
        back_populates="test_cases"
    )

    scripts = relationship(
        "Script",
        back_populates="test_case",
        cascade="all, delete",
        lazy="selectin"
    )

class Script(Base):
    __tablename__ = "scripts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    test_case_id = Column(UUID(as_uuid=True), ForeignKey("test_cases.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    testcase_name = Column(String)
    testcase_type = Column(String)
    script_language = Column(String(50))
    script_tool = Column(String(50))
    script = Column(Text)
    expected_result = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    test_case = relationship(
        "TestCase",
        back_populates="scripts"
    )
