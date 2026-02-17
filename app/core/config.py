from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "TaskFusion"
    app_version: str = "1.0.0"
    debug: bool = False
    
    database_url: str = "mysql+pymysql://taskfusion_user:taskfusion_pass@localhost:3306/taskfusion_db"
    
    host: str = "0.0.0.0"
    port: int = 8000
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
