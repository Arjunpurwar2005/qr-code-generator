import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session as DBSession

from app.core.database import get_db
from app.models.db_models import Session as SessionModel, AttendanceRecord
from app.schemas.attendance import StudentAttendanceSubmitRequest, AttendanceSubmitResponse
from app.utils.qr_token import generate_qr_token, verify_qr_token
from app.utils.geofence import is_within_geofence

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/attendance", tags=["Student Attendance Submissions"])

@router.post("/submit", response_model=AttendanceSubmitResponse, status_code=status.HTTP_201_CREATED)
def submit_attendance(
    submit_data: StudentAttendanceSubmitRequest,
    db: DBSession = Depends(get_db)
):
    """
    Public Endpoint: No-Login Student Attendance Submission with 3-Layer Fraud Protection.

    3-LAYER FRAUD PROTECTION CHECKS:
    --------------------------------
    1. Geofence Check: Student GPS coordinates must be within classroom radius (Haversine formula).
    2. Device ID Check: Rejects duplicate submissions from the same browser device_id.
    3. Unique Identifier Check: Rejects duplicate submissions for the same Roll Number/Student ID.
    """
    # 1. Fetch Session from PostgreSQL
    session_obj = db.query(SessionModel).filter(SessionModel.id == submit_data.session_id).first()
    if not session_obj:
        raise HTTPException(status_code=404, detail="Attendance session not found.")

    if not session_obj.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attendance session is no longer active. Submissions closed."
        )

    # 2. Check Dynamic HMAC QR Token Validity (accepts current or previous window token for grace period)
    if not verify_qr_token(session_id=session_obj.id, token_to_verify=submit_data.qr_token):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired QR code token. Please scan the current live QR code on screen."
        )

    # ----------------------------------------------------
    # FRAUD CHECK LAYER 1: Geofencing Radius Verification
    # ----------------------------------------------------
    is_inside, distance_meters = is_within_geofence(
        student_lat=submit_data.lat,
        student_long=submit_data.long,
        center_lat=session_obj.center_lat,
        center_long=session_obj.center_long,
        radius_meters=session_obj.radius_meters
    )

    if not is_inside:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Geofence check failed. You are {distance_meters}m away from classroom (allowed radius: {session_obj.radius_meters}m)."
        )

    # ----------------------------------------------------
    # FRAUD CHECK LAYER 2: Browser Device ID Duplicate Check
    # ----------------------------------------------------
    existing_device_record = db.query(AttendanceRecord).filter(
        AttendanceRecord.session_id == session_obj.id,
        AttendanceRecord.device_id == submit_data.device_id
    ).first()

    if existing_device_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attendance has already been submitted from this device for this class session."
        )

    # ----------------------------------------------------
    # FRAUD CHECK LAYER 3: Roll Number / Unique Field Duplicate Check
    # ----------------------------------------------------
    extracted_unique_id: Optional[str] = None
    for field in session_obj.form_fields:
        label = field.get("label", "")
        is_unique = field.get("is_unique_id", False)
        if is_unique or "roll" in label.lower() or "student id" in label.lower():
            val = submit_data.responses.get(label)
            if val:
                extracted_unique_id = str(val).strip().upper()
                break

    if not extracted_unique_id:
        logger.warning(
            f"Session {session_obj.id} form template has no explicit unique identifier field configured. "
            "Skipping Layer 3 roll number duplicate check."
        )

    if extracted_unique_id:
        existing_id_record = db.query(AttendanceRecord).filter(
            AttendanceRecord.session_id == session_obj.id,
            AttendanceRecord.unique_identifier == extracted_unique_id
        ).first()

        if existing_id_record:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Attendance already submitted for Roll Number/ID '{extracted_unique_id}'."
            )

    # ----------------------------------------------------
    # ALL CHECKS PASSED: Save Attendance Record to DB
    # ----------------------------------------------------
    new_record = AttendanceRecord(
        session_id=session_obj.id,
        unique_identifier=extracted_unique_id,
        responses=submit_data.responses,
        device_id=submit_data.device_id,
        lat=submit_data.lat,
        long=submit_data.long,
        status="PRESENT"
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return AttendanceSubmitResponse(
        success=True,
        message="Attendance recorded successfully!",
        record_id=new_record.id,
        status=new_record.status
    )
