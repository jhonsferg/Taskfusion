from pydantic import BaseModel, Field
from typing import Dict


class DashboardMetrics(BaseModel):
    total_tasks: int = Field(..., ge=0, description="Total de tareas")
    tasks_by_status: Dict[str, int] = Field(..., description="Tareas por estado")
    tasks_by_project: Dict[str, int] = Field(..., description="Tareas por proyecto")
    overdue_tasks: int = Field(..., ge=0, description="Tareas vencidas")
    
    class Config:
        json_schema_extra = {
            "example": {
                "total_tasks": 15,
                "tasks_by_status": {
                    "backlog": 5,
                    "in_progress": 7,
                    "done": 3
                },
                "tasks_by_project": {
                    "Proyecto A": 8,
                    "Proyecto B": 7
                },
                "overdue_tasks": 2
            }
        }
