from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.task import Task, StatusEnum
from app.schemas.task import TaskCreate, TaskUpdate
from app.repositories.base import BaseRepository


class TaskRepository(BaseRepository[Task, TaskCreate, TaskUpdate]):
    
    def get_by_project(
        self,
        db: Session,
        project_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[Task]:
        return (
            db.query(Task)
            .filter(Task.project_id == project_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_by_status(
        self,
        db: Session,
        status: StatusEnum,
        skip: int = 0,
        limit: int = 100
    ) -> List[Task]:
        return (
            db.query(Task)
            .filter(Task.status == status.value)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_overdue_tasks(self, db: Session) -> List[Task]:
        now = datetime.utcnow()
        return (
            db.query(Task)
            .filter(
                Task.due_date < now,
                Task.status != StatusEnum.DONE.value
            )
            .all()
        )
    
    def count_by_status(self, db: Session) -> dict:
        results = (
            db.query(Task.status, func.count(Task.id))
            .group_by(Task.status)
            .all()
        )
        
        return {status: count for status, count in results}
    
    def count_by_project(self, db: Session) -> dict:
        from app.models.project import Project
        
        results = (
            db.query(Project.name, func.count(Task.id))
            .join(Task)
            .group_by(Project.name)
            .all()
        )
        
        return {name: count for name, count in results}


task_repository = TaskRepository(Task)
