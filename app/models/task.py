from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.mysql import CHAR
from sqlalchemy.orm import relationship
from datetime import datetime, UTC
import enum
import uuid

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
    
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text)
    priority = Column(String(20), default=PriorityEnum.MEDIUM.value, nullable=False)
    status = Column(String(20), default=StatusEnum.BACKLOG.value, nullable=False, index=True)
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC), nullable=False, index=True)
    
    project_id = Column(CHAR(36), ForeignKey("projects.id"), nullable=False, index=True)
    
    project = relationship("Project", back_populates="tasks")
    
    def __repr__(self) -> str:
        return f"<Task(id={self.id}, title='{self.title}', status={self.status})>"
    
    @property
    def is_overdue(self) -> bool:
        if not self.due_date or self.status == StatusEnum.DONE.value:
            return False
        return self.due_date < datetime.now(UTC)
