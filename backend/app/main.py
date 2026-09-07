from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
import app.models
from app.auth_routes import router as auth_router
from app.session_routes import router as session_router
from app.template_routes import router as template_router
from app.attendance_routes import router as attendance_router

# Auto-create tables in PostgreSQL database
Base.metadata.create_all(bind=engine)

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
