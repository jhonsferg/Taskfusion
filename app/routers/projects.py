from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas import project as schemas
from app.services import project_service

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=List[schemas.Project])
def get_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return project_service.get_all(db, skip=skip, limit=limit)


@router.get("/{project_id}", response_model=schemas.ProjectWithTasks)
def get_project(
    project_id: str,
    db: Session = Depends(get_db)
):
    return project_service.get_with_tasks(db, project_id=project_id)


@router.post("", response_model=schemas.Project, status_code=status.HTTP_201_CREATED)
def create_project(
    project: schemas.ProjectCreate,
    db: Session = Depends(get_db)
):
    return project_service.create(db, project_in=project)


@router.put("/{project_id}", response_model=schemas.Project)
def update_project(
    project_id: str,
    project: schemas.ProjectUpdate,
    db: Session = Depends(get_db)
):
    return project_service.update(db, project_id=project_id, project_in=project)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: str,
    db: Session = Depends(get_db)
):
    project_service.delete(db, project_id=project_id)
    return None
