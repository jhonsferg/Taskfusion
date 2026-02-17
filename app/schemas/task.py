from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum


class PriorityEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class StatusEnum(str, Enum):
    BACKLOG = "backlog"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Título de la tarea")
    description: Optional[str] = Field(None, description="Descripción de la tarea")
    priority: PriorityEnum = Field(PriorityEnum.MEDIUM, description="Prioridad de la tarea")
    status: StatusEnum = Field(StatusEnum.BACKLOG, description="Estado de la tarea")
    due_date: Optional[datetime] = Field(None, description="Fecha límite")


class TaskCreate(TaskBase):
    project_id: int = Field(..., gt=0, description="ID del proyecto")


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    status: Optional[StatusEnum] = None
    due_date: Optional[datetime] = None


class Task(TaskBase):
    id: int
    project_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
