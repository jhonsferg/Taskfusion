from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.core.config import get_settings
from app.core.database import init_db
from app.routers import projects, tasks, dashboard, views

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Sistema de gestión de proyectos con tablero Kanban y dashboard de analytics",
    docs_url="/docs",
    redoc_url="/redoc"
)

@app.on_event("startup")
def on_startup():
    init_db()

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(dashboard.router)

app.include_router(views.router)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version
    }
