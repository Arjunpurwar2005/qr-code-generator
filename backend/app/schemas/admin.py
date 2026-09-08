from pydantic import BaseModel
from typing import Optional


class InstitutionCreate(BaseModel):
    """
    Pydantic schema for adding a new institution OR updating an existing one
    (identified by domain).
    """
    domain: str
    name: Optional[str] = None
    campus_lat: float
    campus_long: float
    campus_radius_meters: Optional[float] = 200.0


class InstitutionResponse(BaseModel):
    id: int
    domain: str
    name: Optional[str]
    campus_lat: float
    campus_long: float
    campus_radius_meters: float
