from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.task import Task, StatusEnum
from app.schemas.task import TaskCreate, TaskUpdate
from app.repositories.task import task_repository
from app.repositories.project import project_repository


class TaskService:
    
    def __init__(self):
        self.repository = task_repository
        self.project_repository = project_repository
    
    def get_all(
        self,
        db: Session,
        project_id: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Task]:
        if project_id:
            return self.repository.get_by_project(
                db,
                project_id=project_id,
                skip=skip,
                limit=limit
            )
        return self.repository.get_multi(db, skip=skip, limit=limit)
    
    def get_by_id(self, db: Session, task_id: str) -> Task:
        task = self.repository.get(db, id=task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tarea con ID {task_id} no encontrada"
            )
        return task
    
    def create(self, db: Session, task_in: TaskCreate) -> Task:
        project = self.project_repository.get(db, id=task_in.project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Proyecto con ID {task_in.project_id} no encontrado"
            )
        
        return self.repository.create(db, obj_in=task_in)
    
    def update(
        self,
        db: Session,
        task_id: str,
        task_in: TaskUpdate
    ) -> Task:
        task = self.get_by_id(db, task_id)
        return self.repository.update(db, db_obj=task, obj_in=task_in)
    
    def delete(self, db: Session, task_id: str) -> None:
        task = self.get_by_id(db, task_id)
        self.repository.delete(db, id=task_id)
    
    def get_by_status(
        self,
        db: Session,
        status: StatusEnum,
        skip: int = 0,
        limit: int = 100
    ) -> List[Task]:
        return self.repository.get_by_status(db, status=status, skip=skip, limit=limit)
    
    def get_overdue_tasks(self, db: Session) -> List[Task]:
        return self.repository.get_overdue_tasks(db)


task_service = TaskService()
