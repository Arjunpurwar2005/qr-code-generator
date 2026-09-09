import os
import secrets
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests

from app.core.database import get_db
from app.models.db_models import Teacher
from app.schemas.auth import TeacherSignup, TeacherLogin, TokenResponse, GoogleAuthRequest
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")

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
    access_token = create_access_token(data={"sub": teacher.username, "picture": teacher.profile_picture})

    # 4. Return token response
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/auth/google", response_model=TokenResponse)
def google_login(auth_data: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Authenticate (or auto-register) a teacher using a Google Sign-In ID token.

    WHY VERIFY SERVER-SIDE?
    ------------------------
    The frontend gets an ID token (a signed JWT) directly from Google after
    the user signs in. We NEVER trust this token as-is — we verify its
    signature and audience (client ID) against Google's servers here, so a
    malicious client can't forge a fake Google identity.

    If no Teacher account exists for this Google email yet, one is created
    automatically (auto-signup on first Google login). The stored password
    hash is a random, unusable value since this account only ever logs in
    via Google.
    """
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google Sign-In is not configured on the server (missing GOOGLE_CLIENT_ID)."
        )

    # 1. Verify the ID token's signature, expiry, and audience against Google
    try:
        idinfo = google_id_token.verify_oauth2_token(
            auth_data.id_token,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google ID token."
        )

    google_email = idinfo.get("email")
    email_verified = idinfo.get("email_verified", False)
    google_picture = idinfo.get("picture")

    if not google_email or not email_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google account email is missing or unverified."
        )

    # 2. Find existing teacher by email, or auto-create one
    teacher = db.query(Teacher).filter(Teacher.email == google_email).first()

    if not teacher:
        # Derive a base username from the email (e.g. "rahul.sharma@gmail.com" -> "rahul.sharma")
        base_username = google_email.split("@")[0]
        candidate_username = base_username
        suffix = 1
        # Ensure username uniqueness (in case of collision with an existing account)
        while db.query(Teacher).filter(Teacher.username == candidate_username).first():
            candidate_username = f"{base_username}{suffix}"
            suffix += 1

        # Random unusable password hash — this account only ever authenticates via Google
        random_unusable_password = secrets.token_urlsafe(32)
        hashed_pwd = hash_password(random_unusable_password)

        teacher = Teacher(
            username=candidate_username,
            email=google_email,
            hashed_password=hashed_pwd,
            profile_picture=google_picture
        )
        db.add(teacher)
        db.commit()
        db.refresh(teacher)
    elif teacher.profile_picture != google_picture:
        # Keep the stored picture fresh in case the teacher updated their Google photo
        teacher.profile_picture = google_picture
        db.commit()

    # 3. Issue our own JWT, same as normal login, so the rest of the app doesn't need to change
    access_token = create_access_token(data={"sub": teacher.username, "picture": teacher.profile_picture})

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

@router.post("/auth/refresh", response_model=TokenResponse)
def refresh_token(current_username: str = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Silent token refresh ("stay logged in" pattern) — same idea sites like
    LeetCode use. The ACCESS_TOKEN itself still expires after a modest window
    (see ACCESS_TOKEN_EXPIRE_MINUTES), but as long as the teacher opens the
    app again before that window runs out, the frontend calls this endpoint
    in the background to swap it for a brand-new token — so in practice they
    never see a login screen unless they've been away longer than the window.

    Requires a STILL-VALID token to call (get_current_user rejects an already
    expired one) — you can't refresh a token that's already dead, only renew
    one that's about to be.
    """
    teacher = db.query(Teacher).filter(Teacher.username == current_username).first()
    new_access_token = create_access_token(
        data={"sub": current_username, "picture": teacher.profile_picture if teacher else None}
    )
    return {"access_token": new_access_token, "token_type": "bearer"}
