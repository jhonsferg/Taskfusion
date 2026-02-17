from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.dialects.mysql import CHAR
from sqlalchemy.orm import relationship
from datetime import datetime, UTC
import uuid

from app.core.database import Base


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC), nullable=False)
    
    tasks = relationship(
        "Task",
        back_populates="project",
        cascade="all, delete-orphan",
        lazy="selectin"
    )
    
    def __repr__(self) -> str:
        return f"<Project(id={self.id}, name='{self.name}')>"
