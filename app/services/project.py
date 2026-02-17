from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.repositories.project import project_repository


class ProjectService:
    
    def __init__(self):
        self.repository = project_repository
    
    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Project]:
        return self.repository.get_multi(db, skip=skip, limit=limit)
    
    def get_by_id(self, db: Session, project_id: str) -> Project:
        project = self.repository.get(db, id=project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Proyecto con ID {project_id} no encontrado"
            )
        return project
    
    def get_with_tasks(self, db: Session, project_id: str) -> Project:
        project = self.repository.get_with_tasks(db, project_id=project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Proyecto con ID {project_id} no encontrado"
            )
        return project
    
    def create(self, db: Session, project_in: ProjectCreate) -> Project:
        existing = self.repository.get_by_name(db, name=project_in.name)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un proyecto con el nombre '{project_in.name}'"
            )
        
        return self.repository.create(db, obj_in=project_in)
    
    def update(
        self,
        db: Session,
        project_id: str,
        project_in: ProjectUpdate
    ) -> Project:
        project = self.get_by_id(db, project_id)
        
        if project_in.name and project_in.name != project.name:
            existing = self.repository.get_by_name(db, name=project_in.name)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe un proyecto con el nombre '{project_in.name}'"
                )
        
        return self.repository.update(db, db_obj=project, obj_in=project_in)
    
    def delete(self, db: Session, project_id: str) -> None:
        project = self.get_by_id(db, project_id)
        self.repository.delete(db, id=project_id)


project_service = ProjectService()
