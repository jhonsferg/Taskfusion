"""
Repositorios para acceso a datos
"""
from app.repositories.project import project_repository
from app.repositories.task import task_repository

__all__ = ["project_repository", "task_repository"]
