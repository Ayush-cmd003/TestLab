from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from typing import Optional, Annotated, List
from pydantic import BaseModel, Field
from uuid import UUID
from sqlalchemy.orm import Session
import json
from backend.core.ai_service import create_script
from backend.core.security import decrypt_api_key
from backend.database.connection import SessionLocal
from backend.database.models import TestCase, User, Script
from backend.routers.auth import get_current_user

router = APIRouter(
    prefix="/test-cases/{testcase_id}/scripts",
    tags=["scripts"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

class ScriptRequest(BaseModel):
    script_language: str = Field(min_length=1, max_length=50)
    script_tool: str = Field(min_length=1, max_length=50)

class ScriptResponse(BaseModel):
    id: UUID
    testcase_name: str
    testcase_type: str
    script_language: str
    script_tool: str
    script: str
    expected_result: str
    created_at: datetime

@router.get("/", response_model=List[ScriptResponse], status_code=status.HTTP_200_OK)
async def view_scripts(user: user_dependency, db: db_dependency, testcase_id: UUID):
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    script_modal = db.query(Script).filter(Script.test_case_id == testcase_id, Script.user_id == user.get("user_id")).all()
    if script_modal:
        return script_modal
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Script not found")

@router.get("/get_script/{script_id}", response_model=ScriptResponse, status_code=status.HTTP_200_OK)
async def get_testcase(user: user_dependency, db: db_dependency, testcase_id: UUID, script_id: UUID):
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    script_modal = db.query(Script).filter(Script.id == script_id, Script.test_case_id == testcase_id, Script.user_id == user.get("user_id")).first()
    if script_modal:
        return script_modal
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No scripts are generated for this testcase")

@router.post("/generate_script", status_code=status.HTTP_201_CREATED)
async def generate_script(user: user_dependency, db: db_dependency, script_request: ScriptRequest,testcase_id: UUID):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    testcase_modal = db.query(TestCase).filter(TestCase.id == testcase_id, TestCase.user_id == user.get("user_id")).first()
    if not testcase_modal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testcase not found")
    user_modal = db.query(User).filter(User.id == user.get("user_id")).first()
    if not user_modal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid User")
    existing_script = db.query(Script).filter(Script.test_case_id == testcase_id, Script.user_id == user.get("user_id"), Script.script_language == script_request.script_language, Script.script_tool == script_request.script_tool).first()
    if existing_script:
        return {"status": "Test script already exists"}
    api_key = decrypt_api_key(user_modal.api_key)
    response = create_script(api_key, testcase_modal.testcase_name, testcase_modal.testcase_type, testcase_modal.pre_conditions, testcase_modal.testcase_steps, testcase_modal.expected_result, script_request.script_language, script_request.script_tool)
    try:
        test_cases = json.loads(response)
    except Exception:
        raise HTTPException(status_code=500, detail="Invalid LLM response format")
    for script in test_cases:
        db.add(
            Script(
                test_case_id=testcase_id,
                user_id=user.get("user_id"),
                testcase_name=script["testcase_name"],
                testcase_type=script["testcase_type"],
                script_language=script["language"],
                script_tool=script["tool"],
                script=script["script_template"],
                expected_result=script["expectedTestOutcome"]
            )
        )
    db.commit()
    return {"status": "Test script generated successfully"}

@router.delete("/delete_script", status_code=status.HTTP_204_NO_CONTENT)
async def delete_testcases(user: user_dependency, db: db_dependency, script_id: UUID, testcase_id: UUID):
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    script_modal = db.query(Script).filter(Script.id == script_id, Script.test_case_id == testcase_id, Script.user_id == user.get("user_id")).first()
    if script_modal:
        db.query(Script).filter(Script.id == script_id, Script.test_case_id == testcase_id, Script.user_id == user.get("user_id")).delete()
        db.commit()
        return {"status": "Script deleted successfully"}
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Script not found")