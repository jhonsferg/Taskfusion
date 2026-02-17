from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base


class PriorityEnum(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class StatusEnum(enum.Enum):
    BACKLOG = "backlog"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text)
    priority = Column(String(20), default=PriorityEnum.MEDIUM.value, nullable=False)
    status = Column(String(20), default=StatusEnum.BACKLOG.value, nullable=False, index=True)
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False, index=True)
    
    project = relationship("Project", back_populates="tasks")
    
    def __repr__(self) -> str:
        return f"<Task(id={self.id}, title='{self.title}', status={self.status})>"
    
    @property
    def is_overdue(self) -> bool:
        if not self.due_date or self.status == StatusEnum.DONE.value:
            return False
        return self.due_date < datetime.utcnow()
