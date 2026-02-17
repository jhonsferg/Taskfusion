from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200, description="Nombre del proyecto")
    description: Optional[str] = Field(None, description="Descripción del proyecto")


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None


class Project(ProjectBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ProjectWithTasks(Project):
    tasks: List['Task'] = []
    
    class Config:
        from_attributes = True


from app.schemas.task import Task
ProjectWithTasks.model_rebuild()
