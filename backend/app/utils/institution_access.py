from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.db_models import Institution
from app.utils.geofence import is_within_geofence


def check_teacher_campus_location(
    email: str,
    teacher_lat: Optional[float],
    teacher_long: Optional[float],
    db: Session
):
    """
    Blocks session creation if the teacher's email domain belongs to a
    registered institution AND the teacher's current GPS location is
    outside that institution's campus geofence.

    WHY: Stops a teacher from starting a session from home (or anywhere
    off-campus) and then sharing/forwarding the QR code — the session
    itself can now only be CREATED while physically on campus.

    Domains that were never registered via the admin panel are NOT
    restricted — this only applies to colleges an admin has explicitly set up.
    """
    domain = email.split("@")[-1].strip().lower()

    institution = db.query(Institution).filter(Institution.domain == domain).first()

    if institution is None:
        # Domain not tracked — no campus restriction applies.
        return

    if teacher_lat is None or teacher_long is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"'{institution.name or domain}' requires your current location to start "
                "a session. Please allow location access in your browser and try again."
            )
        )

    is_inside, distance = is_within_geofence(
        student_lat=teacher_lat,
        student_long=teacher_long,
        center_lat=institution.campus_lat,
        center_long=institution.campus_long,
        radius_meters=institution.campus_radius_meters
    )

    if not is_inside:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                f"You must be on the '{institution.name or domain}' campus to start a session. "
                f"You are approximately {int(distance)}m away from the allowed area "
                f"(limit: {int(institution.campus_radius_meters)}m)."
            )
        )
