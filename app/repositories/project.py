from typing import Optional
from sqlalchemy.orm import Session

from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.repositories.base import BaseRepository


class ProjectRepository(BaseRepository[Project, ProjectCreate, ProjectUpdate]):
    
    def get_by_name(self, db: Session, name: str) -> Optional[Project]:
        return db.query(Project).filter(Project.name == name).first()
    
    def get_with_tasks(self, db: Session, project_id: int) -> Optional[Project]:
        return db.query(Project).filter(Project.id == project_id).first()


project_repository = ProjectRepository(Project)
