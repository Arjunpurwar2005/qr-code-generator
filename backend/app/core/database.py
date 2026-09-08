import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables from .env file
# WHY: Keeps sensitive settings (like DB passwords and URLs) out of git/codebase.
load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/attendance_db"
)

# Create SQLAlchemy Engine
# WHY: Engine acts as the pool of connections to your PostgreSQL database.
engine = create_engine(DATABASE_URL)

# Create SessionLocal factory
# WHY: Each API request gets its own database session to perform DB operations safely.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base model for SQLAlchemy ORM classes
Base = declarative_base()

# FastAPI Dependency for database sessions
def get_db():
    """
    Yields a database session for an incoming HTTP request,
    and automatically closes the session after the request finishes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
