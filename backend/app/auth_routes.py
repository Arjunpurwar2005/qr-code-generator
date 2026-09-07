from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Teacher
from app.auth_models import TeacherSignup, TeacherLogin, TokenResponse
from app.auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)

router = APIRouter(tags=["Authentication"])

# HTTPBearer creates a clean Bearer Token input box in Swagger UI (/docs)
# WHY: Avoids form parameter errors in Swagger UI and allows direct pasting of JWT token.
security_scheme = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> str:
    """
    Dependency ("bouncer") that runs before protected routes.
    Decodes the JWT token and returns current teacher's username.
    Raises 401 Unauthorized if invalid or missing token.
    """
    token = credentials.credentials
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception
        
    # Verify teacher exists in PostgreSQL DB
    teacher = db.query(Teacher).filter(Teacher.username == username).first()
    if teacher is None:
        raise credentials_exception
        
    return teacher.username

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(teacher_data: TeacherSignup, db: Session = Depends(get_db)):
    """
    Register a new teacher.
    Checks if username/email exists, hashes password, and saves to PostgreSQL.
    """
    # 1. Check if username already exists
    existing_teacher = db.query(Teacher).filter(Teacher.username == teacher_data.username).first()
    if existing_teacher:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # 2. Check if email already exists
    existing_email = db.query(Teacher).filter(Teacher.email == teacher_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # 3. Hash password before storing
    hashed_pwd = hash_password(teacher_data.password)

    # 4. Save new Teacher to PostgreSQL DB
    new_teacher = Teacher(
        username=teacher_data.username,
        email=teacher_data.email,
        hashed_password=hashed_pwd
    )
    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)

    return {
        "message": "Teacher created successfully!",
        "username": new_teacher.username,
        "email": new_teacher.email
    }

@router.post("/login", response_model=TokenResponse)
def login(login_data: TeacherLogin, db: Session = Depends(get_db)):
    """
    Authenticate teacher by username and password.
    Returns JWT access_token if valid.
    """
    # 1. Find teacher by username in PostgreSQL DB
    teacher = db.query(Teacher).filter(Teacher.username == login_data.username).first()
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    # 2. Verify password against stored hash
    if not verify_password(login_data.password, teacher.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    # 3. Create JWT access token with payload {"sub": teacher.username}
    access_token = create_access_token(data={"sub": teacher.username})

    # 4. Return token response
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/protected-test")
def protected_test_route(current_username: str = Depends(get_current_user)):
    """
    Protected route to confirm JWT authorization works.
    Requires valid Bearer token in Authorization header.
    """
    return {
        "message": f"Hello {current_username}, you have accessed a protected route successfully!",
        "logged_in_as": current_username
    }
