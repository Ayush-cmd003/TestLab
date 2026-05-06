from datetime import datetime
from typing import Annotated, List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, status, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from .auth import get_current_user
from ..database.connection import SessionLocal
from ..database.models import Project

router = APIRouter(
    prefix="/projects",
    tags=["projects"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

class ProjectRequest(BaseModel):
    name: str = Field(min_length=1, max_length=20, description="Project name")
    description: str = Field(min_length=1, max_length=500, description="Project description")

class UpdateProjectRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class ProjectResponse(BaseModel):
    id: UUID
    name: str
    description: str
    created_at: datetime

@router.get("/", response_model=List[ProjectResponse], status_code=status.HTTP_200_OK)
async def all_projects(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=404, detail="User does not exist")
    project_modal = db.query(Project).filter(Project.user_id == user.get("user_id")).order_by(Project.created_at.asc()).all()
    if project_modal:
        return project_modal
    raise HTTPException(status_code=404, detail="Projects does not exist")

@router.get("/get_project/{project_id}", response_model=ProjectResponse, status_code=status.HTTP_200_OK)
async def get_project(db: db_dependency, user: user_dependency, project_id: UUID):
    if user is None:
        raise HTTPException(status_code=404, detail="User does not exist")
    project_modal = db.query(Project).filter(Project.user_id == user.get("user_id")).filter(Project.id == project_id).first()
    if project_modal:
        return project_modal
    raise HTTPException(status_code=404, detail=f"Project with id {project_id} does not exist")

@router.get("/search_project", response_model=List[ProjectResponse], status_code=status.HTTP_200_OK)
async def search_project(user: user_dependency, db: db_dependency, project_name: str = Query(min_length=1, max_length=20, description="Project name")):
    if user is None:
        raise HTTPException(status_code=404, detail="User does not exist")
    project_modal = (db.query(Project).filter(Project.user_id == user.get("user_id")).filter(Project.name.ilike(f"%{project_name}%")).all())
    if project_modal:
        return project_modal
    raise HTTPException(status_code=404, detail=f"Project {project_name} does not exist")

@router.post("/create_project", status_code=status.HTTP_201_CREATED)
async def create_project(user: user_dependency, db: db_dependency ,project_request: ProjectRequest):
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User does not exist")
    project_modal = Project(**project_request.model_dump(), user_id = user.get("user_id"))
    db.add(project_modal)
    db.commit()
    return {"status": "Project created successfully"}

@router.patch("/update_project/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_project(user: user_dependency, db: db_dependency, project_update_request: UpdateProjectRequest, project_id: UUID):
    if user is None:
        raise HTTPException(status_code=404, detail="User does not exist")
    project_modal = db.query(Project).filter(Project.user_id == user.get("user_id")).filter(Project.id == project_id).first()
    if project_modal:
        if project_update_request.name:
            existing_project_name = db.query(Project).filter(Project.user_id == user.get("user_id"),Project.name == project_update_request.name,Project.id != project_id).first()
            if existing_project_name:
                raise HTTPException(status_code=400, detail="Project name already exists")
        for key, value in project_update_request.model_dump(exclude_unset=True).items():
            setattr(project_modal, key, value)
        db.commit()
        return {"status": "Project updated successfully"}
    raise HTTPException(status_code=404, detail="Project does not exist")

@router.delete("/delete_project/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(user: user_dependency, db: db_dependency, project_id: UUID):
    if user is None:
        raise HTTPException(status_code=404, detail="User does not exist")
    project_modal = db.query(Project).filter(Project.user_id == user.get("user_id")).filter(Project.id == project_id).first()
    if project_modal:
        db.query(Project).filter(Project.user_id == user.get("user_id")).filter(Project.id == project_id).delete()
        db.commit()
        return {"status": "Project deleted successfully"}
    raise HTTPException(status_code=404, detail="Project does not exist")
