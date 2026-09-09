from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text
from app.core.database import engine, Base
import app.models.db_models
from app.routes.auth import router as auth_router
from app.routes.session import router as session_router
from app.routes.template import router as template_router
from app.routes.attendance import router as attendance_router
from app.routes.admin import router as admin_router

# Auto-create tables in PostgreSQL database
Base.metadata.create_all(bind=engine)

# Auto-migrate: safely add any new columns to existing tables
# Uses IF NOT EXISTS so it's safe to run on every startup
def run_migrations():
    with engine.connect() as conn:
        migrations = [
            "ALTER TABLE teachers ADD COLUMN IF NOT EXISTS profile_picture VARCHAR;",
        ]
        for stmt in migrations:
            conn.execute(text(stmt))
        conn.commit()

run_migrations()

# Initialize FastAPI application
app = FastAPI(
    title="College Attendance System API",
    description="Backend API for Dynamic QR + Geofencing Attendance System with 3-Layer Fraud Protection",
    version="2.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)
app.include_router(template_router)
app.include_router(session_router)
app.include_router(attendance_router)
app.include_router(admin_router)

@app.get("/")
def read_root():
    """
    Root health check endpoint.
    """
    return {
        "status": "online",
        "message": "Welcome to College Attendance System API"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
