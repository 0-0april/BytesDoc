"""Pydantic schemas (request/response shapes for the API)."""
from datetime import date

from pydantic import BaseModel, ConfigDict


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    category_id: int
    category_name: str


class EventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    event_id: int
    event_name: str
    event_date: date | None = None


class AdministrationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    administration_id: int
    admin_name: str
    start_date: date | None = None
    end_date: date | None = None


class HealthOut(BaseModel):
    status: str
    db: str
