from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Teacher(Base):
    """
    SQLAlchemy model for the 'teachers' table.
    WHY: Stores registered teacher credentials and profile details.
    """
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    profile_picture = Column(String, nullable=True)  # Google profile photo URL, if signed in via Google
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    sessions = relationship("Session", back_populates="teacher")
    form_templates = relationship("FormTemplate", back_populates="teacher")


class FormTemplate(Base):
    """
    SQLAlchemy model for the 'form_templates' table.
    WHY: Allows teachers to save reusable attendance form configurations (e.g. "CS 3rd Year Attendance").
    Fields column stores a JSON array of field definitions:
    [{"label": "Roll Number", "type": "text", "required": true, "is_unique_id": true}, ...]
    """
    __tablename__ = "form_templates"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=False)
    template_name = Column(String, nullable=False)
    
    # JSON column storing array of field schemas
    fields = Column(JSON, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    teacher = relationship("Teacher", back_populates="form_templates")


class Session(Base):
    """
    SQLAlchemy model for the 'sessions' table.
    WHY: Stores active classroom sessions, teacher's GPS center location, geofence radius,
    and a snapshot copy of the 'form_fields' used for this session.
    """
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(String, nullable=False, index=True)  # e.g. "CS101"
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=False)
    
    start_time = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=True)
    
    # Geofence location configuration
    center_lat = Column(Float, nullable=False)
    center_long = Column(Float, nullable=False)
    radius_meters = Column(Float, default=30.0, nullable=False)

    # JSON Snapshot of Form Fields for this session
    # WHY: Copying fields here ensures old sessions retain their original form layout even if template is modified/deleted later.
    form_fields = Column(JSON, nullable=False)

    # Session Status
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    teacher = relationship("Teacher", back_populates="sessions")
    attendance_records = relationship("AttendanceRecord", back_populates="session")


class AttendanceRecord(Base):
    """
    SQLAlchemy model for the 'attendance_records' table.
    WHY: Stores no-login student attendance responses, GPS coordinates, device fingerprint,
    and verification status for 3-layer fraud prevention checks.
    """
    __tablename__ = "attendance_records"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False, index=True)
    
    # Unique identifier (e.g. Roll Number extracted for fast duplicate checking)
    unique_identifier = Column(String, nullable=True, index=True)
    
    # JSON Object storing student answers matching form_fields (e.g. {"Roll Number": "21CS045", "Branch": "CSE"})
    responses = Column(JSON, nullable=False)
    
    # Browser localStorage Device ID UUID
    device_id = Column(String, nullable=False, index=True)
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    lat = Column(Float, nullable=False)
    long = Column(Float, nullable=False)
    status = Column(String, nullable=False, default="PRESENT") # "PRESENT", "OUT_OF_BOUNDS", "DUPLICATE_DEVICE", "DUPLICATE_ROLL"
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    session = relationship("Session", back_populates="attendance_records")


class Institution(Base):
    """
    SQLAlchemy model for the 'institutions' table.
    WHY: Lets an admin register a college's email domain along with its
    campus GPS location + radius. When a teacher with that email domain
    tries to START A SESSION, their own current location is checked
    against this campus geofence (see app/utils/institution_access.py) —
    this stops a teacher from starting a fake session from home.
    Domains NOT present in this table are unrestricted (no change in behavior).
    """
    __tablename__ = "institutions"

    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String, unique=True, index=True, nullable=False)  # e.g. "globalcollege.ac.in"
    name = Column(String, nullable=True)  # display name, e.g. "Global College of Engineering"

    # Campus geofence: teacher must be physically within this radius to start a session
    campus_lat = Column(Float, nullable=False)
    campus_long = Column(Float, nullable=False)
    campus_radius_meters = Column(Float, default=200.0, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
