from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.schemas import task as schemas
from app.services import task_service

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("/", response_model=List[schemas.Task])
def get_tasks(
    project_id: Optional[str] = Query(None, description="Filtrar por proyecto (UUID)"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return task_service.get_all(db, project_id=project_id, skip=skip, limit=limit)


@router.get("/{task_id}", response_model=schemas.Task)
def get_task(
    task_id: str,
    db: Session = Depends(get_db)
):
    return task_service.get_by_id(db, task_id=task_id)


@router.post("/", response_model=schemas.Task, status_code=status.HTTP_201_CREATED)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db)
):
    return task_service.create(db, task_in=task)


@router.put("/{task_id}", response_model=schemas.Task)
def update_task(
    task_id: str,
    task: schemas.TaskUpdate,
    db: Session = Depends(get_db)
):
    return task_service.update(db, task_id=task_id, task_in=task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: str,
    db: Session = Depends(get_db)
):
    task_service.delete(db, task_id=task_id)
    return None
