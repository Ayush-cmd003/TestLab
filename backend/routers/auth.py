from datetime import timedelta, timezone, datetime
from typing import Annotated, Literal
import os
from jose import JWTError
import jwt
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from backend.core.api_key_service import verify_groq_key
from backend.core.rate_limiter import limiter
from backend.database.models import User
from backend.database.connection import SessionLocal
from backend.core.security import encrypt_api_key
import secrets
from backend.core.email_service import send_otp_email

ENV = os.getenv("env", "qa")

if ENV == "prod":
    load_dotenv(".env.prod")
else:
    load_dotenv(".env.qa")

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")
SECRET_KEY = os.getenv('secret_key')
ALGORITHM = os.getenv('algorithm')
GROQ_VERIFICATION_URL = os.getenv("groq_verification_url")
GROQ_MODEL = os.getenv("groq_model")

class CreateUserRequest(BaseModel):
    username: str = Field(min_length=1, max_length=50)
    password: str = Field(min_length=1, max_length=20)
    name: str = Field(min_length=1, max_length=50)
    email: str = Field(min_length=1, max_length=100)
    api_key: str = Field(min_length=1, max_length=150)
    role: Literal["user", "admin"]

class ValidateKeyRequest(BaseModel):
    api_key: str

class VerifyOtpRequest(BaseModel):
    email: str
    otp: str

class ResendOtpRequest(BaseModel):
    email: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.password_hash):
        return False
    return user

def create_access_token(username: str, user_id: int, role: str, is_active: bool, expires_delta: timedelta):
    encode = {
        'sub': username,
        'id': user_id,
        'role': role,
        'is_active': is_active,
    }
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, ALGORITHM)


async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User is not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        role: str = payload.get('role')
        is_active: bool = payload.get('is_active')

        if username is None or user_id is None or role is None or is_active is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

        if not is_active and role != 'admin':
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user")

        return {'username': username, 'user_id': user_id, 'role': role, 'is_active': is_active}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Could not validate credentials")

@router.post("/", status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
async def create_user(request: Request, db: db_dependency, create_user_request: CreateUserRequest):
    existing_email_user = db.query(User).filter(User.email == create_user_request.email).first()
    existing_username_user = db.query(User).filter(User.username == create_user_request.username).first()

    if existing_username_user:
        if not (existing_email_user and existing_username_user.id == existing_email_user.id):
            raise HTTPException(status_code=400, detail="Username already exists")

    otp = str(secrets.randbelow(900000) + 100000)

    if existing_email_user and existing_email_user.is_active:
        raise HTTPException(status_code=400,detail="User already exists")

    if existing_email_user and not existing_email_user.is_active:
        existing_email_user.username = create_user_request.username
        existing_email_user.name = create_user_request.name
        existing_email_user.password_hash = bcrypt_context.hash(create_user_request.password)
        existing_email_user.api_key = encrypt_api_key(create_user_request.api_key)
        existing_email_user.role = create_user_request.role
        existing_email_user.otp_hash = bcrypt_context.hash(otp)
        existing_email_user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=3)
        existing_email_user.otp_last_sent_at = datetime.now(timezone.utc)

        db.commit()
        send_otp_email(create_user_request.email,otp)
        return {"message": "Verification pending. New OTP sent to email."}

    create_user_model = User(
        username=create_user_request.username,
        email=create_user_request.email,
        name=create_user_request.name,
        password_hash=bcrypt_context.hash(create_user_request.password),
        api_key=encrypt_api_key(create_user_request.api_key),
        role=create_user_request.role,
        is_active=False,
        otp_hash=bcrypt_context.hash(otp),
        otp_expires_at=datetime.now(timezone.utc) + timedelta(minutes=3),
        otp_last_sent_at=datetime.now(timezone.utc)
    )

    db.add(create_user_model)
    db.commit()
    db.refresh(create_user_model)

    send_otp_email(create_user_request.email,otp)

    return {"message": "User created successfully. OTP sent to email."}

@router.post("/validate-key")
async def validate_key(key: ValidateKeyRequest):
    return await verify_groq_key(key.api_key.strip(), GROQ_VERIFICATION_URL, GROQ_MODEL)

@router.post("/verify-otp", status_code=status.HTTP_200_OK)
async def verify_otp(data: VerifyOtpRequest, db: db_dependency):
    user = db.query(User).filter(User.email == data.email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.is_active:
        return {"message": "Account already verified"}
    
    if not user.otp_hash or not user.otp_expires_at:
        raise HTTPException(status_code=400, detail="OTP not found")
    
    expiry = user.otp_expires_at
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)

    if datetime.now(timezone.utc) > expiry:
        user.otp_hash = None
        user.otp_expires_at = None
        db.commit()
        raise HTTPException(status_code=400, detail="OTP expired")
    
    if not bcrypt_context.verify(data.otp, user.otp_hash):
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    user.is_active = True
    user.otp_hash = None
    user.otp_expires_at = None
    db.commit()
    return {"message": "Email verified successfully"}

@router.post("/resend-otp")
async def resend_otp(data: ResendOtpRequest, db: db_dependency):
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(404, "User not found")

    if user.is_active:
        raise HTTPException(400, "Account already verified")

    otp = str(secrets.randbelow(900000) + 100000)
    user.otp_hash = bcrypt_context.hash(otp)
    user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)

    db.commit()
    send_otp_email(user.email, otp)
    return {"message": "OTP resent successfully"}


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
@limiter.limit("3/minute")
async def forgot_password(request: Request,data: ForgotPasswordRequest,db: db_dependency):
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        return {"message": "If the account exists, OTP has been sent."}

    otp = str(secrets.randbelow(900000) + 100000)
    user.otp_hash = bcrypt_context.hash(otp)
    user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=3)

    db.commit()
    send_otp_email(user.email, otp)
    return {"message": "If the account exists, OTP has been sent."}

@router.post("/reset-password", status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
async def reset_password(request: Request, response: Response,data: ResetPasswordRequest,db: db_dependency):
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=400,detail="Invalid request")

    if not user.otp_hash or not user.otp_expires_at:
        raise HTTPException(status_code=400,detail="OTP not found")

    expiry = user.otp_expires_at

    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)

    if datetime.now(timezone.utc) > expiry:
        user.otp_hash = None
        user.otp_expires_at = None
        db.commit()
        raise HTTPException(status_code=400,detail="OTP expired")

    if not bcrypt_context.verify(data.otp,user.otp_hash):
        raise HTTPException(status_code=400,detail="Invalid OTP")

    user.password_hash = bcrypt_context.hash(data.new_password)
    user.otp_hash = None
    user.otp_expires_at = None

    response.delete_cookie(key="access_token", httponly=True, secure=ENV == "prod", samesite="none" if ENV == "prod" else "lax")

    db.commit()
    return {"message": "Password updated successfully"}

@router.get("/me")
async def get_me(response: Response, current_user = Depends(get_current_user)):
    response.headers["Cache-Control"] = "no-store"
    return current_user

@router.post("/token", status_code=status.HTTP_200_OK)
async def login_for_access_token(response: Response, form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    user = authenticate_user(db, form_data.username, form_data.password)

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user")
    
    token = create_access_token(user.username, str(user.id), user.role, user.is_active, timedelta(minutes=60))
    response.set_cookie(key="access_token", value=token, httponly=True, secure=ENV == "prod", samesite="none" if ENV == "prod" else "lax")
    return {"message": "Logged in successfully !"}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", httponly=True,  secure=ENV == "prod", samesite="none" if ENV == "prod" else "lax")
    return {"message": "Logged out successfully"}
