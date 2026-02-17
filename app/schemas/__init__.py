"""
Esquemas Pydantic para validación
"""
from app.schemas.project import (
    ProjectBase,
    ProjectCreate,
    ProjectUpdate,
    Project,
    ProjectWithTasks
)
from app.schemas.task import (
    TaskBase,
    TaskCreate,
    TaskUpdate,
    Task,
    PriorityEnum,
    StatusEnum
)
from app.schemas.dashboard import DashboardMetrics

__all__ = [
    "ProjectBase",
    "ProjectCreate",
    "ProjectUpdate",
    "Project",
    "ProjectWithTasks",
    "TaskBase",
    "TaskCreate",
    "TaskUpdate",
    "Task",
    "PriorityEnum",
    "StatusEnum",
    "DashboardMetrics",
]
