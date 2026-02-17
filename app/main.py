from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pathlib import Path

from app.core.config import get_settings
from app.core.database import init_db
from app.routers import projects, tasks, dashboard

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Sistema de gestión de proyectos con tablero Kanban y dashboard de analytics",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

# Mount static assets (JS/CSS from React build)
# Note: Vite builds assets to /assets by default
static_path = Path("app/static/assets")
static_path.mkdir(parents=True, exist_ok=True)
app.mount("/assets", StaticFiles(directory=str(static_path)), name="assets")

# API Routers
app.include_router(projects.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version
    }

# SPA Fallback route
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # If path starts with api, let it 404 naturally if not matched above
    if full_path.startswith("api"):
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Not Found")
    
    # Check if file exists in static (e.g. favicon.ico, images)
    file_path = Path("app/static") / full_path
    if file_path.name and file_path.is_file():
        return FileResponse(file_path)
    
    # Otherwise return index.html for React Router
    return FileResponse("app/static/index.html")
