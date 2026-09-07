from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session as DBSession

from app.database import get_db
from app.models import Teacher, Session as SessionModel, FormTemplate, AttendanceRecord
from app.auth_routes import get_current_user
from app.session_models import (
    StartSessionRequest,
    SessionResponse,
    PublicSessionFormResponse,
    QRTokenResponse
)
from app.session_utils import generate_qr_token
from app.excel_utils import generate_attendance_excel

router = APIRouter(prefix="/session", tags=["Attendance Session"])

@router.post("/start", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def start_session(
    session_data: StartSessionRequest,
    current_username: str = Depends(get_current_user),
    db: DBSession = Depends(get_db)
):
    """
    Starts a new classroom attendance session with dynamic form fields (from template or custom builder).
    Requires authenticated teacher.
    Deactivates any previous active sessions for this teacher.
    """
    teacher = db.query(Teacher).filter(Teacher.username == current_username).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher account not found.")

    form_fields_list = []
    if session_data.template_id:
        template = db.query(FormTemplate).filter(
            FormTemplate.id == session_data.template_id,
            FormTemplate.teacher_id == teacher.id
        ).first()
        if not template:
            raise HTTPException(status_code=404, detail="Selected template not found.")
        form_fields_list = template.fields
    elif session_data.custom_fields and len(session_data.custom_fields) > 0:
        form_fields_list = [field.model_dump() for field in session_data.custom_fields]
    else:
        form_fields_list = [
            {"label": "Roll Number", "type": "text", "required": True, "is_unique_id": True},
            {"label": "Student Name", "type": "text", "required": True, "is_unique_id": False}
        ]

    active_sessions = db.query(SessionModel).filter(
        SessionModel.teacher_id == teacher.id,
        SessionModel.is_active == True
    ).all()
    for s in active_sessions:
        s.is_active = False

    new_session = SessionModel(
        class_id=session_data.class_id,
        teacher_id=teacher.id,
        center_lat=session_data.center_lat,
        center_long=session_data.center_long,
        radius_meters=session_data.radius_meters,
        form_fields=form_fields_list,
        is_active=True
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return SessionResponse(
        session_id=new_session.id,
        class_id=new_session.class_id,
        teacher_id=new_session.teacher_id,
        center_lat=new_session.center_lat,
        center_long=new_session.center_long,
        radius_meters=new_session.radius_meters,
        form_fields=new_session.form_fields,
        is_active=new_session.is_active,
        start_time=new_session.start_time
    )

@router.get("/my-sessions", response_model=List[SessionResponse])
def get_my_sessions(
    current_username: str = Depends(get_current_user),
    db: DBSession = Depends(get_db)
):
    """
    List all active and past attendance sessions for the logged-in teacher.
    """
    teacher = db.query(Teacher).filter(Teacher.username == current_username).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher account not found.")

    sessions = db.query(SessionModel).filter(
        SessionModel.teacher_id == teacher.id
    ).order_by(SessionModel.id.desc()).all()
    return sessions

@router.post("/{session_id}/end", status_code=status.HTTP_200_OK)
def end_session(
    session_id: int,
    current_username: str = Depends(get_current_user),
    db: DBSession = Depends(get_db)
):
    """
    Deactivates an active attendance session and sets its end_time timestamp.
    Requires authenticated teacher.
    """
    teacher = db.query(Teacher).filter(Teacher.username == current_username).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher account not found.")

    session_obj = db.query(SessionModel).filter(
        SessionModel.id == session_id,
        SessionModel.teacher_id == teacher.id
    ).first()

    if not session_obj:
        raise HTTPException(status_code=404, detail="Session not found for this teacher.")

    session_obj.is_active = False
    session_obj.end_time = datetime.now(timezone.utc)
    db.commit()

    return {
        "message": f"Attendance session {session_id} has been ended successfully.",
        "session_id": session_id,
        "is_active": False
    }

@router.get("/{session_id}/export-excel")
def export_session_excel(
    session_id: int,
    current_username: str = Depends(get_current_user),
    db: DBSession = Depends(get_db)
):
    """
    Generates and streams a downloadable formatted Excel (.xlsx) file containing all attendance records for a session.
    Requires authenticated teacher.
    """
    teacher = db.query(Teacher).filter(Teacher.username == current_username).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher account not found.")

    session_obj = db.query(SessionModel).filter(
        SessionModel.id == session_id,
        SessionModel.teacher_id == teacher.id
    ).first()

    if not session_obj:
        raise HTTPException(status_code=404, detail="Session not found for this teacher.")

    records = db.query(AttendanceRecord).filter(
        AttendanceRecord.session_id == session_obj.id
    ).order_by(AttendanceRecord.id.asc()).all()

    excel_stream = generate_attendance_excel(
        session_id=session_obj.id,
        class_id=session_obj.class_id,
        records=records
    )

    filename = f"Attendance_{session_obj.class_id}_Session_{session_obj.id}.xlsx"

    return StreamingResponse(
        excel_stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/{session_id}/current-token", response_model=QRTokenResponse)
def get_current_token(
    session_id: int,
    current_username: str = Depends(get_current_user),
    db: DBSession = Depends(get_db)
):
    """
    Returns the current dynamic HMAC QR token for an active session.
    """
    session_obj = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session_obj:
        raise HTTPException(status_code=404, detail="Session not found.")
        
    if not session_obj.is_active:
        raise HTTPException(status_code=400, detail="This session is no longer active.")

    qr_token, expires_in = generate_qr_token(session_id=session_obj.id)

    return QRTokenResponse(
        session_id=session_obj.id,
        qr_token=qr_token,
        expires_in_seconds=expires_in
    )

@router.get("/{session_id}/public-form", response_model=PublicSessionFormResponse)
def get_public_session_form(
    session_id: int,
    db: DBSession = Depends(get_db)
):
    """
    Public endpoint for student scanner app to fetch session form fields without requiring login.
    """
    session_obj = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session_obj:
        raise HTTPException(status_code=404, detail="Attendance session not found.")
        
    return PublicSessionFormResponse(
        session_id=session_obj.id,
        class_id=session_obj.class_id,
        is_active=session_obj.is_active,
        form_fields=session_obj.form_fields
    )
