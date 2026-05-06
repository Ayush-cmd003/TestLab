from typing import Annotated, List, Optional
from uuid import UUID
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, HTTPException, status, Query
from backend.database.connection import SessionLocal
from backend.routers.auth import get_current_user
from backend.database.models import Feature, Project

router = APIRouter(
    prefix="/projects/{id_of_project}/features",
    tags=["project features"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

class FeatureRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100, description="Feature name")
    description: str = Field(min_length=1, max_length=500, description="Feature description")
    generation_instructions: Optional[str] = None

class FeatureUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    generation_instructions: Optional[str] = None

class FeatureResponse(BaseModel):
    id: UUID
    name: str = Field(min_length=1, max_length=100, description="Feature name")
    description: str = Field(min_length=1, max_length=500, description="Feature description")
    generation_instructions: Optional[str] = None

@router.get("/all_features", response_model=List[FeatureResponse], status_code=status.HTTP_200_OK)
async def get_all_features(user: user_dependency, db: db_dependency, id_of_project: UUID):
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    feature_modal = db.query(Feature).filter(Feature.project_id == id_of_project, Feature.user_id == user.get("user_id")).all()
    if feature_modal:
        return feature_modal
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Features not found")

@router.get("/get_feature/{feature_id}", response_model=FeatureResponse, status_code=status.HTTP_200_OK)
async def get_feature(feature_id: UUID, user: user_dependency, db: db_dependency, id_of_project: UUID):
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    feature_modal =db.query(Feature).filter(Feature.id == feature_id ,Feature.project_id == id_of_project, Feature.user_id == user.get("user_id")).first()
    if feature_modal:
        return feature_modal
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Features not found")

@router.get("/search_features", response_model=List[FeatureResponse], status_code=status.HTTP_200_OK)
async def search_features(user: user_dependency, db: db_dependency, id_of_project: UUID, feature_name: str = Query(min_length=1, max_length=20, description="Feature name")):
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    feature_modal = db.query(Feature).filter(Feature.project_id == id_of_project, Feature.user_id == user.get("user_id"), Feature.name.ilike(f"%{feature_name}%")).all()
    if feature_modal:
        return feature_modal
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Features not found")

@router.post("/add_feature", status_code=status.HTTP_201_CREATED)
async def add_feature(user: user_dependency, db: db_dependency, feature_request: FeatureRequest,id_of_project: UUID):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    project_modal = db.query(Project).filter(Project.id == id_of_project, Project.user_id == user.get("user_id")).first()
    if not project_modal:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You cannot add a feature to a project that does not belong to you")
    feature_modal = Feature(**feature_request.model_dump(),project_id=id_of_project,user_id=user.get("user_id"))
    db.add(feature_modal)
    db.commit()
    return {"status": "Feature added successfully"}

@router.patch("/update_feature/{feature_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_feature(user: user_dependency, db: db_dependency, feature_update_request: FeatureUpdateRequest, feature_id: UUID, id_of_project: UUID):
    if user is None:
        raise HTTPException(status_code=404, detail="User does not exist")
    feature_modal = db.query(Feature).filter(Feature.id == feature_id, Feature.project_id == id_of_project, Feature.user_id == user.get("user_id")).first()
    if feature_modal:
        update_data = feature_update_request.model_dump(exclude_unset=True)
        if feature_update_request.generation_instructions is None:
            setattr(feature_modal, "generation_instructions", "")
        else:
            if "generation_instructions" in update_data:
                setattr(feature_modal, "generation_instructions", update_data["generation_instructions"])
        for key, value in update_data.items():
            if key != "generation_instructions":
                setattr(feature_modal, key, value)
        db.commit()
        return {"status": "Feature updated successfully"}
    raise HTTPException(status_code=404, detail="Feature does not exist")

@router.delete("/delete_feature/{feature_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_feature(user: user_dependency, db: db_dependency, id_of_project: UUID, feature_id: UUID):
    if user is None:
        raise HTTPException(status_code=404, detail="User does not exist")
    feature_modal = db.query(Feature).filter(Feature.id == feature_id, Feature.project_id == id_of_project, Feature.user_id == user.get("user_id")).first()
    if feature_modal:
        db.query(Feature).filter(Feature.id == feature_id, Feature.project_id == id_of_project, Feature.user_id == user.get("user_id")).delete()
        db.commit()
        return {"status": "Feature deleted successfully"}
    raise HTTPException(status_code=404, detail="Feature does not exist")
