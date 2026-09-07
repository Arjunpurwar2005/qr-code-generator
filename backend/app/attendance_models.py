from typing import Dict, Any
from pydantic import BaseModel, Field

class StudentAttendanceSubmitRequest(BaseModel):
    """
    Public request schema for student attendance scan submission.
    """
    session_id: int = Field(..., example=1)
    qr_token: str = Field(..., example="sess_1_1700000_a1b2c3d4")
    lat: float = Field(..., example=28.6139)
    long: float = Field(..., example=77.2090)
    device_id: str = Field(..., example="550e8400-e29b-41d4-a716-446655440000")
    responses: Dict[str, Any] = Field(
        ...,
        example={"Roll Number": "21CS045", "Student Name": "Rahul", "Branch": "CSE"}
    )

class AttendanceSubmitResponse(BaseModel):
    """
    Response model for student submission outcome.
    """
    success: bool
    message: str
    record_id: int
    status: str
