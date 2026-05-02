"""SQLAlchemy ORM models. One class per table in the bytesdoc schema."""
from datetime import datetime

from sqlalchemy import (
    BigInteger,
    Boolean,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Role(Base):
    __tablename__ = "role"

    role_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    role_name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    users: Mapped[list["User"]] = relationship(back_populates="role")


class Category(Base):
    __tablename__ = "category"

    category_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    category_name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    documents: Mapped[list["Document"]] = relationship(back_populates="category")


class Event(Base):
    __tablename__ = "event"

    event_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    event_name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    event_date: Mapped[datetime | None] = mapped_column(Date, nullable=True)

    documents: Mapped[list["Document"]] = relationship(back_populates="event")


class Administration(Base):
    __tablename__ = "administration"

    administration_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    admin_name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    start_date: Mapped[datetime | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[datetime | None] = mapped_column(Date, nullable=True)

    documents: Mapped[list["Document"]] = relationship(back_populates="administration")


class User(Base):
    __tablename__ = "user"

    username_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    role_id: Mapped[int] = mapped_column(ForeignKey("role.role_id"), nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    role: Mapped[Role] = relationship(back_populates="users")
    documents: Mapped[list["Document"]] = relationship(back_populates="uploader")
    activity_logs: Mapped[list["ActivityLog"]] = relationship(back_populates="user")


class Document(Base):
    __tablename__ = "document"

    document_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    administration_id: Mapped[int] = mapped_column(
        ForeignKey("administration.administration_id"), nullable=False
    )
    category_id: Mapped[int] = mapped_column(
        ForeignKey("category.category_id"), nullable=False
    )
    event_id: Mapped[int] = mapped_column(ForeignKey("event.event_id"), nullable=False)
    uploaded_by: Mapped[int] = mapped_column(
        ForeignKey("user.username_id"), nullable=False
    )
    upload_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_locked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    administration: Mapped[Administration] = relationship(back_populates="documents")
    category: Mapped[Category] = relationship(back_populates="documents")
    event: Mapped[Event] = relationship(back_populates="documents")
    uploader: Mapped[User] = relationship(back_populates="documents")
    activity_logs: Mapped[list["ActivityLog"]] = relationship(back_populates="document")


class ActivityLog(Base):
    __tablename__ = "activity_log"

    log_id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.username_id"), nullable=False
    )
    document_id: Mapped[int | None] = mapped_column(
        ForeignKey("document.document_id"), nullable=True
    )
    action: Mapped[str] = mapped_column(
        Enum(
            "upload",
            "download",
            "view",
            "archive",
            "login",
            "edit",
            "delete",
            name="activity_action",
        ),
        nullable=False,
    )
    timestamp: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    user: Mapped[User] = relationship(back_populates="activity_logs")
    document: Mapped[Document | None] = relationship(back_populates="activity_logs")
