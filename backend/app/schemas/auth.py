from pydantic import BaseModel, EmailStr

class TeacherSignup(BaseModel):
    """
    Pydantic schema for teacher registration request body.
    """
    username: str
    email: EmailStr
    password: str

class TeacherLogin(BaseModel):
    """
    Pydantic schema for teacher login request body.
    """
    username: str
    password: str

class GoogleAuthRequest(BaseModel):
    """
    Pydantic schema for Google Sign-In request body.
    Frontend sends the ID token (JWT credential) obtained from Google Identity Services.
    """
    id_token: str

class TokenResponse(BaseModel):
    """
    Pydantic schema for JWT token response.
    """
    access_token: str
    token_type: str = "bearer"
