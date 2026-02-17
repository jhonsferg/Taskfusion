from sqlalchemy.orm import Session

from app.schemas.dashboard import DashboardMetrics
from app.repositories.task import task_repository


class DashboardService:
    
    def __init__(self):
        self.task_repository = task_repository
    
    def get_metrics(self, db: Session) -> DashboardMetrics:
        total_tasks = self.task_repository.count(db)
        
        tasks_by_status = self.task_repository.count_by_status(db)
        
        tasks_by_status_complete = {
            "backlog": tasks_by_status.get("backlog", 0),
            "in_progress": tasks_by_status.get("in_progress", 0),
            "done": tasks_by_status.get("done", 0)
        }
        
        tasks_by_project = self.task_repository.count_by_project(db)
        
        overdue_tasks = len(self.task_repository.get_overdue_tasks(db))
        
        return DashboardMetrics(
            total_tasks=total_tasks,
            tasks_by_status=tasks_by_status_complete,
            tasks_by_project=tasks_by_project,
            overdue_tasks=overdue_tasks
        )


dashboard_service = DashboardService()
