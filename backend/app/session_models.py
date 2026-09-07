from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from app.template_models import FormFieldSchema

class StartSessionRequest(BaseModel):
    """
    Request model for starting an attendance session.
    Teacher can provide a saved template_id OR supply custom_fields directly.
    """
    class_id: str = Field(..., example="CS101")
    center_lat: float = Field(..., example=28.6139)
    center_long: float = Field(..., example=77.2090)
    radius_meters: float = Field(default=30.0, example=30.0)
    template_id: Optional[int] = Field(default=None, example=1)
    custom_fields: Optional[List[FormFieldSchema]] = Field(default=None)

class SessionResponse(BaseModel):
    """
    Response model for teacher's created session.
    """
    session_id: int
    class_id: str
    teacher_id: int
    center_lat: float
    center_long: float
    radius_meters: float
    form_fields: List[FormFieldSchema]
    is_active: bool
    start_time: datetime

    class Config:
        from_attributes = True

class PublicSessionFormResponse(BaseModel):
    """
    Public response model for student scanner app to render dynamic form fields.
    """
    session_id: int
    class_id: str
    is_active: bool
    form_fields: List[FormFieldSchema]

class QRTokenResponse(BaseModel):
    """
    Response model for dynamic rotating QR code token.
    """
    session_id: int
    qr_token: str
    expires_in_seconds: int
