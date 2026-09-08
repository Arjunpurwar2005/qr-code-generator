import sys
import os

# Ensure backend folder is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, SessionLocal
from app.models.db_models import AttendanceRecord, Session as SessionModel, FormTemplate, Teacher

def reset_all_data():
    """
    Cleans and wipes all test data from PostgreSQL tables.
    Deletes records in order of foreign key constraints.
    """
    db = SessionLocal()
    try:
        num_records = db.query(AttendanceRecord).delete()
        num_sessions = db.query(SessionModel).delete()
        num_templates = db.query(FormTemplate).delete()
        num_teachers = db.query(Teacher).delete()

        db.commit()
        print("DATABASE RESET SUCCESSFUL! 🎉")
        print(f"- Deleted {num_records} attendance records")
        print(f"- Deleted {num_sessions} sessions")
        print(f"- Deleted {num_templates} templates")
        print(f"- Deleted {num_teachers} teacher accounts")
    except Exception as e:
        db.rollback()
        print(f"Error resetting database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_all_data()
