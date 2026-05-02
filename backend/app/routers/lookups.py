from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Administration, Category, Event
from app.schemas import AdministrationOut, CategoryOut, EventOut

router = APIRouter(prefix="/api", tags=["lookups"])


@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)) -> list[Category]:
    return list(db.scalars(select(Category).order_by(Category.category_id)))


@router.get("/events", response_model=list[EventOut])
def list_events(db: Session = Depends(get_db)) -> list[Event]:
    return list(db.scalars(select(Event).order_by(Event.event_id)))


@router.get("/administrations", response_model=list[AdministrationOut])
def list_administrations(db: Session = Depends(get_db)) -> list[Administration]:
    return list(db.scalars(select(Administration).order_by(Administration.administration_id)))
