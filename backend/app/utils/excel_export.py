import io
import pandas as pd
from typing import List
from app.models.db_models import AttendanceRecord

def generate_attendance_excel(session_id: int, class_id: str, records: List[AttendanceRecord]) -> io.BytesIO:
    """
    Generates an in-memory formatted Excel (.xlsx) file for session attendance records using Pandas & OpenPyXL.

    DYNAMIC RESPONSE FLATTENING:
    ---------------------------
    Student dynamic responses JSON (e.g. {"Roll Number": "21CS045", "Student Name": "Rahul", "Branch": "CSE"})
    are dynamically unpacked into separate dedicated columns in the Excel sheet!
    """
    data = []
    for idx, record in enumerate(records, start=1):
        # Base row structure
        row = {
            "S.No": idx,
            "Record ID": record.id,
            "Submitted At": record.timestamp.strftime("%Y-%m-%d %H:%M:%S") if record.timestamp else "",
            "Status": record.status,
            "Roll Number / ID": record.unique_identifier or "",
            "Device Fingerprint": record.device_id or "",
            "Student Lat": record.lat,
            "Student Long": record.long
        }

        # Dynamically flatten custom form responses JSON into Excel columns
        if isinstance(record.responses, dict):
            for field_name, value in record.responses.items():
                row[field_name] = str(value) if value is not None else ""

        data.append(row)

    if not data:
        # Fallback empty dataframe if no attendance submitted yet
        df = pd.DataFrame(columns=[
            "S.No", "Record ID", "Submitted At", "Status",
            "Roll Number / ID", "Device Fingerprint", "Student Lat", "Student Long"
        ])
    else:
        df = pd.DataFrame(data)

    # Stream to in-memory bytes buffer
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name=f"Class-{class_id}")

    output.seek(0)
    return output
