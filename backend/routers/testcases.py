from datetime import datetime
from uuid import UUID
from fastapi import HTTPException, Depends, status, APIRouter, Query
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import Annotated, List, Optional
from backend.core.ai_service import create_testcase
from backend.core.security import decrypt_api_key
from backend.database.connection import SessionLocal
from backend.database.models import Feature, Project, Document, TestCase, User
from backend.routers.auth import get_current_user
from backend.routers.documents import supabase_client, BUCKET
import io, json, PyPDF2

router = APIRouter(
    prefix="/features/{feature_id}/test-cases",
    tags=["testcases"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

class TestCaseResponse(BaseModel):
    id: UUID
    testcase_id: str
    testcase_name: str
    testcase_type: str
    pre_conditions: list
    testcase_steps: list
    expected_result: str
    testcase_version: int
    prompt_used: Optional[str] = None
    created_at: datetime

@router.get("/", response_model=List[TestCaseResponse], status_code=status.HTTP_200_OK)
async def view_all_testcases(user: user_dependency, db: db_dependency, feature_id: UUID):
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    testcase_modal = db.query(TestCase).filter(TestCase.feature_id == feature_id, TestCase.user_id == user.get("user_id")).all()
    if testcase_modal:
        return testcase_modal
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No testcases are generated for this feature")

@router.get("/get_testcase/{testcase_id}", response_model=TestCaseResponse, status_code=status.HTTP_200_OK)
async def get_testcase(user: user_dependency, db: db_dependency, feature_id: UUID, testcase_id: UUID):
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    testcase_modal = db.query(TestCase).filter(TestCase.id == testcase_id, TestCase.feature_id == feature_id, TestCase.user_id == user.get("user_id")).first()
    if testcase_modal:
        return testcase_modal
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No testcases are generated for this feature")

@router.get("/search_testcases", response_model=List[TestCaseResponse], status_code=status.HTTP_200_OK)
async def search_testcases(user: user_dependency, db: db_dependency, feature_id: UUID, testcase_id: str = Query(min_length=1, max_length=50,description="Testcase Id")):
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    testcase_modal = db.query(TestCase).filter(TestCase.feature_id == feature_id, TestCase.user_id == user.get("user_id"), TestCase.testcase_id.ilike(f"%{testcase_id}%")).all()
    if testcase_modal:
        return testcase_modal
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testcases not found")

@router.post("/generate_testcase", status_code=status.HTTP_201_CREATED)
async def generate_testcases(user: user_dependency, db: db_dependency, feature_id: UUID):
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    feature_modal = db.query(Feature).filter(Feature.id == feature_id, Feature.user_id == user.get("user_id")).first()
    if not feature_modal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feature not found")
    user_modal = db.query(User).filter(User.id == user.get("user_id")).first()
    if not user_modal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid User")
    project_modal = db.query(Project).filter(Project.id == feature_modal.project_id).first()
    if not project_modal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    document_modal = db.query(Document).filter(Document.feature_id == feature_id).first()
    pdf_text = ""
    if document_modal:
        try:
            file_bytes = supabase_client.storage.from_(BUCKET).download(document_modal.file_path)
            reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    pdf_text += extracted
        except Exception:
            raise HTTPException(status_code=500, detail="Failed to process PDF")
    api_key = decrypt_api_key(user_modal.api_key)
    response = create_testcase(api_key, project_modal.name, project_modal.description, feature_modal.name, feature_modal.description, pdf_text, feature_modal.generation_instructions)
    used_prompt = (feature_modal.generation_instructions or "").strip()
    try:
        test_cases = json.loads(response)
    except Exception as e:
            print("RAW RESPONSE:", response)
            raise HTTPException(status_code=500, detail=str(e))
    latest_version = db.query(func.max(TestCase.testcase_version)).filter(TestCase.feature_id == feature_id).scalar()
    if latest_version:
        new_version = latest_version + 1
    else:
        new_version = 1
    for i,tc in enumerate(test_cases):
        tc_id = f"{project_modal.name}-{feature_modal.name}-V{new_version}-TC-{i+1:03d}"
        cleaned_tc_id = tc_id.replace(" ", "")
        db.add(
            TestCase(
                feature_id=feature_id,
                user_id=user.get("user_id"),
                testcase_id=cleaned_tc_id,
                testcase_name=tc["name"],
                testcase_type=tc["testCaseType"],
                pre_conditions=tc["preConditions"],
                testcase_steps=tc["steps"],
                expected_result=tc["expectedResult"],
                testcase_version=new_version,
                prompt_used=used_prompt
            )
        )
    db.commit()
    return {"status": "Testcases generated successfully"}

@router.delete("/delete_testcase/{testcase_version}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_testcases(user: user_dependency, db: db_dependency, feature_id: UUID, testcase_version: int):
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    testcase_modal = db.query(TestCase).filter(TestCase.feature_id == feature_id, TestCase.testcase_version == testcase_version, TestCase.user_id == user.get("user_id")).first()
    if testcase_modal:
        db.query(TestCase).filter(TestCase.feature_id == feature_id, TestCase.testcase_version == testcase_version, TestCase.user_id == user.get("user_id")).delete()
        db.commit()
        return {"status": "Testcases deleted successfully"}
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testcases not found")