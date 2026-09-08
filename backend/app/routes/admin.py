import os
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.db_models import Institution
from app.schemas.admin import InstitutionCreate, InstitutionResponse

ADMIN_SECRET = os.getenv("ADMIN_SECRET", "")

router = APIRouter(prefix="/admin", tags=["Admin"])


def verify_admin(x_admin_secret: Optional[str] = Header(None)):
    """
    Simple shared-secret guard for the admin panel — NOT tied to the
    Teacher accounts system. Only you (the app owner) should know
    ADMIN_SECRET. Sent as the 'X-Admin-Secret' request header.
    """
    if not ADMIN_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Admin panel is not configured on the server (missing ADMIN_SECRET)."
        )
    if not x_admin_secret or x_admin_secret != ADMIN_SECRET:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin secret."
        )


@router.get("/institutions", response_model=List[InstitutionResponse], dependencies=[Depends(verify_admin)])
def list_institutions(db: Session = Depends(get_db)):
    """
    List all registered institutions and their campus geofence settings.
    """
    return db.query(Institution).order_by(Institution.id.desc()).all()


@router.post("/institutions", response_model=InstitutionResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(verify_admin)])
def add_or_update_institution(data: InstitutionCreate, db: Session = Depends(get_db)):
    """
    Add a new institution, or update the campus location/radius of an
    existing one (matched by domain).
    """
    domain = data.domain.strip().lower()

    institution = db.query(Institution).filter(Institution.domain == domain).first()

    if institution:
        institution.campus_lat = data.campus_lat
        institution.campus_long = data.campus_long
        institution.campus_radius_meters = data.campus_radius_meters or 200.0
        if data.name:
            institution.name = data.name
    else:
        institution = Institution(
            domain=domain,
            name=data.name or domain,
            campus_lat=data.campus_lat,
            campus_long=data.campus_long,
            campus_radius_meters=data.campus_radius_meters or 200.0
        )
        db.add(institution)

    db.commit()
    db.refresh(institution)
    return institution


@router.delete("/institutions/{institution_id}", dependencies=[Depends(verify_admin)])
def delete_institution(institution_id: int, db: Session = Depends(get_db)):
    """
    Remove an institution's geofence restriction entirely (its teachers can
    start sessions from anywhere again, same as an unregistered domain).
    """
    institution = db.query(Institution).filter(Institution.id == institution_id).first()
    if not institution:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Institution not found.")
    db.delete(institution)
    db.commit()
    return {"message": "Institution deleted."}
