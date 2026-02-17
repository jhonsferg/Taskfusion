"""
Servicios de lógica de negocio
"""
from app.services.project import project_service
from app.services.task import task_service
from app.services.dashboard import dashboard_service

__all__ = ["project_service", "task_service", "dashboard_service"]
