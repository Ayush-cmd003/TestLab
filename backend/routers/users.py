from datetime import datetime
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.core.api_key_service import verify_groq_key
from backend.core.security import decrypt_api_key, encrypt_api_key
from backend.database.connection import SessionLocal
from backend.database.models import User
from backend.routers.auth import get_current_user, bcrypt_context
from backend.core.rate_limiter import limiter
import secrets
from datetime import timedelta, timezone, datetime
from backend.core.email_service import send_otp_email
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

GROQ_VERIFICATION_URL = os.getenv("groq_verification_url")
GROQ_MODEL = os.getenv("groq_model")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

class UpdatePasswordRequest(BaseModel):
    new_password: str
    otp: str

class SendChangePasswordOtpRequest(BaseModel):
    current_password: str

class UpdateApiKeyRequest(BaseModel):
    new_api_key: str

class UpdateUserRequest(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None
    otp: Optional[str] = None

class UserResponse(BaseModel):
    username: str
    name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

@router.get("/current_user", response_model=UserResponse ,status_code=status.HTTP_200_OK)
async def logged_in_user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    return db.query(User).filter(User.id == user.get('user_id')).first()


@router.post("/update_password", status_code=status.HTTP_204_NO_CONTENT)
async def update_password(user: user_dependency,db: db_dependency,update_password_request: UpdatePasswordRequest):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Authentication required")
    
    user_model = db.query(User).filter(User.id == user.get("user_id")).first()
    if not user_model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User not found")
    
    if bcrypt_context.verify(update_password_request.new_password,user_model.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="New password must be different from the current password")
    
    if not user_model.otp_hash or not user_model.otp_expires_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="OTP not found. Please request a new OTP.")

    expiry = user_model.otp_expires_at

    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)

    if datetime.now(timezone.utc) > expiry:
        user_model.otp_hash = None
        user_model.otp_expires_at = None
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="OTP expired")

    if not bcrypt_context.verify(update_password_request.otp,user_model.otp_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Invalid OTP")
    
    user_model.password_hash = bcrypt_context.hash(update_password_request.new_password)

    user_model.otp_hash = None
    user_model.otp_expires_at = None

    db.commit()
    return {"message": "Password updated successfully!"}

@router.post("/send-change-password-otp")
@limiter.limit("3/minute")
async def send_change_password_otp(request: Request,data: SendChangePasswordOtpRequest,db: db_dependency,current_user: dict = Depends(get_current_user)):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    if not user:
        raise HTTPException(status_code=404,detail="User not found")

    if not bcrypt_context.verify(data.current_password,user.password_hash):
        raise HTTPException(status_code=400,detail="Current password is incorrect")

    otp = str(secrets.randbelow(900000) + 100000)
    user.otp_hash = bcrypt_context.hash(otp)
    user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=3)

    db.commit()
    send_otp_email(user.email, otp)
    return {"message": "OTP sent to your email"}

@router.post("/update_api_key", status_code=status.HTTP_200_OK)
async def update_api_key(user: user_dependency,db: db_dependency,update_api_key_request: UpdateApiKeyRequest):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Incorrect username or password")

    user_modal = db.query(User).filter(User.id == user.get("user_id")).first()
    if user_modal is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User does not exist")

    new_api_key = update_api_key_request.new_api_key.strip()
    if not new_api_key:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="API key required")

    stored_api_key = decrypt_api_key(user_modal.api_key)
    if new_api_key == stored_api_key:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="New api key must be different from current api key")

    key_verification = await verify_groq_key(new_api_key, GROQ_VERIFICATION_URL, GROQ_MODEL)
    if not key_verification["success"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=key_verification["message"])
    
    user_modal.api_key = encrypt_api_key(new_api_key)
    db.commit()
    return {"message": "API key updated successfully!"}

@router.patch("/update_profile", status_code=status.HTTP_200_OK)
async def update_profile(user: user_dependency,db: db_dependency,update_user_request: UpdateUserRequest):
    if user is None:
        raise HTTPException(status_code=401,detail="Authentication required")
    
    user_model = db.query(User).filter(User.id == user.get("user_id")).first()

    if not user_model:
        raise HTTPException(status_code=404,detail="User not found")

    data = update_user_request.model_dump(exclude_unset=True)
    if "name" in data:
        name = data["name"].strip()

        if not name:
            raise HTTPException(status_code=400,detail="Name cannot be empty")
        user_model.name = name

    if "username" in data:
        username = data["username"].strip()
        if not username:
            raise HTTPException(status_code=400,detail="Username cannot be empty")
        
        if username != user_model.username:
            username_exists = db.query(User).filter(User.username == username).first()

            if username_exists:
                raise HTTPException(status_code=400,detail="Username already exists")
            user_model.username = username

    if "email" in data:
        new_email = data["email"].strip()
        if not new_email:
            raise HTTPException(status_code=400,detail="Email cannot be empty")
        
        if new_email != user_model.email:
            email_exists = db.query(User).filter(User.email == new_email).first()

            if email_exists:
                raise HTTPException(status_code=400,detail="Email already registered")
            
            if "otp" not in data:
                otp = str(secrets.randbelow(900000) + 100000)
                user_model.otp_hash = bcrypt_context.hash(otp)
                user_model.otp_expires_at = (datetime.now(timezone.utc) + timedelta(minutes=3))
            
                db.commit()
                send_otp_email(new_email, otp)
                return {"message" : "OTP sent to new email. Submit both email and otp to verify."}

            if not user_model.otp_hash:
                raise HTTPException(status_code=400,detail="OTP not found")

            expiry = user_model.otp_expires_at
            if expiry.tzinfo is None:
                expiry = expiry.replace(tzinfo=timezone.utc)

            if datetime.now(timezone.utc) > expiry:
                user_model.otp_hash = None
                user_model.otp_expires_at = None
                db.commit()
                raise HTTPException(status_code=400,detail="OTP expired")

            otp_valid = bcrypt_context.verify(data["otp"],user_model.otp_hash)

            if not otp_valid:
                raise HTTPException(status_code=400,detail="Invalid OTP")

            user_model.email = new_email
            user_model.otp_hash = None
            user_model.otp_expires_at = None

    db.commit()
    return {"message": "User profile updated successfully!"}