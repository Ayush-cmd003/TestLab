import uuid
from typing import Annotated, Optional, List
from uuid import UUID
from fastapi import HTTPException, status, Depends, APIRouter, UploadFile, File
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy.orm import Session
from backend.database.connection import SessionLocal
from backend.database.models import Document, Feature
from backend.routers.auth import get_current_user
from supabase import create_client
import os

SUPABASE_URL = os.getenv("supabase_url")
SUPABASE_KEY = os.getenv("supabase_key")
BUCKET = os.getenv("bucket_name")

supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

router = APIRouter(
    prefix="/features/{feature_id}/documents",
    tags=["documents"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

class DocumentResponse(BaseModel):
    id: UUID
    file_name: str
    file_path: str
    uploaded_at: datetime

@router.get("/", response_model=List[DocumentResponse] ,status_code=status.HTTP_200_OK)
async def get_documents(feature_id: UUID, db: db_dependency, user: user_dependency):
    if user is None:
        raise HTTPException(status_code=404, detail="User does not exist")
    feature_modal = db.query(Feature).filter(Feature.id == feature_id,Feature.user_id == user.get("user_id")).first()
    if not feature_modal:
        raise HTTPException(status_code=404, detail="Feature does not exist")
    document_modal = db.query(Document).filter(Document.feature_id == feature_id, Document.user_id == user.get("user_id")).all()
    if document_modal:
        return document_modal
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Documents not found")

@router.post("/upload_documents", status_code=status.HTTP_201_CREATED)
async def upload_documents(user: user_dependency, db: db_dependency, feature_id: UUID, document: UploadFile = File(...)):
    if user is None:
        raise HTTPException(status_code=404, detail="User does not exist")
    feature_modal = db.query(Feature).filter(Feature.id == feature_id, Feature.user_id == user.get("user_id")).first()
    if not feature_modal:
        raise HTTPException(status_code=404, detail="Feature does not exist")
    if not document:
        raise HTTPException(status_code=400, detail="Document is required")
    if not document.filename:
        raise HTTPException(status_code=400, detail="Invalid file name")
    if document.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    if not document.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only .pdf files allowed")
    existing_document = db.query(Document).filter(Document.feature_id == feature_id).first()
    if existing_document:
        raise HTTPException(status_code=400, detail="Only one document allowed. Delete old file first.")
    file_bytes = await document.read()
    if len(file_bytes) > 50 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Max file size is 50MB")
    file_path = f"{user.get('username')}/{feature_id}/{uuid.uuid4()}.pdf"
    try:
        supabase_client.storage.from_(BUCKET).upload(file_path, file_bytes, {"content-type": "application/pdf"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
    document_modal = Document(
        file_name=document.filename,
        file_path=file_path,
        feature_id=feature_id,
        user_id=user.get("user_id")
    )
    db.add(document_modal)
    db.commit()
    db.refresh(document_modal)
    return {"message": "PDF uploaded successfully"}

@router.delete("/delete_document/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(feature_id: UUID,document_id: UUID,db: db_dependency,user: user_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
    document_modal = db.query(Document).filter(Document.id == document_id,Document.feature_id == feature_id,Document.user_id == user.get("user_id")).first()
    if not document_modal:
        raise HTTPException(status_code=404, detail="Document not found")
    try:
        supabase_client.storage.from_(BUCKET).remove([document_modal.file_path])
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to delete file")
    db.delete(document_modal)
    db.commit()
    return {"message": "Document deleted successfully"}