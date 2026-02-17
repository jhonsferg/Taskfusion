import sys
import os
from datetime import datetime, timedelta

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from database import SessionLocal, engine, Base
from models import Project, Task, PriorityEnum, StatusEnum

def create_seed_data():
    print("Creando tablas...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        existing_projects = db.query(Project).count()
        if existing_projects > 0:
            print("Ya existen datos en la base de datos. No se insertarán datos semilla.")
            return
        
        print("Insertando datos semilla...")
        
        project1 = Project(
            name="Desarrollo Web Corporativo",
            description="Sitio web institucional para empresa de tecnología"
        )
        db.add(project1)
        db.flush()
        
        tasks_project1 = [
            Task(
                title="Diseño de mockups",
                description="Crear mockups en Figma para todas las páginas principales",
                priority=PriorityEnum.HIGH.value,
                status=StatusEnum.DONE.value,
                project_id=project1.id,
                due_date=datetime.utcnow() - timedelta(days=5)
            ),
            Task(
                title="Implementar página de inicio",
                description="Desarrollar landing page con animaciones y diseño responsive",
                priority=PriorityEnum.HIGH.value,
                status=StatusEnum.IN_PROGRESS.value,
                project_id=project1.id,
                due_date=datetime.utcnow() + timedelta(days=3)
            ),
            Task(
                title="Integrar sistema de contacto",
                description="Formulario de contacto con validación y envío de emails",
                priority=PriorityEnum.MEDIUM.value,
                status=StatusEnum.BACKLOG.value,
                project_id=project1.id,
                due_date=datetime.utcnow() + timedelta(days=7)
            ),
            Task(
                title="Optimización SEO",
                description="Implementar meta tags, sitemap y mejoras de rendimiento",
                priority=PriorityEnum.LOW.value,
                status=StatusEnum.BACKLOG.value,
                project_id=project1.id,
                due_date=datetime.utcnow() + timedelta(days=14)
            ),
        ]
        
        project2 = Project(
            name="App Móvil de Fitness",
            description="Aplicación para seguimiento de ejercicios y nutrición"
        )
        db.add(project2)
        db.flush()
        
        tasks_project2 = [
            Task(
                title="Configurar proyecto React Native",
                description="Inicializar proyecto con navegación y estructura base",
                priority=PriorityEnum.HIGH.value,
                status=StatusEnum.DONE.value,
                project_id=project2.id,
                due_date=datetime.utcnow() - timedelta(days=10)
            ),
            Task(
                title="Pantalla de registro de usuario",
                description="UI y lógica para registro con validación de datos",
                priority=PriorityEnum.HIGH.value,
                status=StatusEnum.DONE.value,
                project_id=project2.id,
                due_date=datetime.utcnow() - timedelta(days=7)
            ),
            Task(
                title="Dashboard de métricas",
                description="Gráficos con progreso de ejercicios y calorías",
                priority=PriorityEnum.MEDIUM.value,
                status=StatusEnum.IN_PROGRESS.value,
                project_id=project2.id,
                due_date=datetime.utcnow() + timedelta(days=5)
            ),
            Task(
                title="Integración con wearables",
                description="Conectar con Apple Health y Google Fit",
                priority=PriorityEnum.MEDIUM.value,
                status=StatusEnum.BACKLOG.value,
                project_id=project2.id,
                due_date=datetime.utcnow() + timedelta(days=20)
            ),
            Task(
                title="Sistema de notificaciones push",
                description="Recordatorios de ejercicios y logros",
                priority=PriorityEnum.LOW.value,
                status=StatusEnum.BACKLOG.value,
                project_id=project2.id,
                due_date=datetime.utcnow() + timedelta(days=25)
            ),
        ]
        
        project3 = Project(
            name="API de Gestión de Inventario",
            description="Backend para sistema de control de stock y ventas"
        )
        db.add(project3)
        db.flush()
        
        tasks_project3 = [
            Task(
                title="Modelado de base de datos",
                description="Diseñar esquema de productos, categorías y movimientos",
                priority=PriorityEnum.HIGH.value,
                status=StatusEnum.DONE.value,
                project_id=project3.id,
                due_date=datetime.utcnow() - timedelta(days=8)
            ),
            Task(
                title="CRUD de productos",
                description="Endpoints para crear, leer, actualizar y eliminar productos",
                priority=PriorityEnum.HIGH.value,
                status=StatusEnum.IN_PROGRESS.value,
                project_id=project3.id,
                due_date=datetime.utcnow() + timedelta(days=2)
            ),
            Task(
                title="Sistema de autenticación JWT",
                description="Login, registro y middleware de autenticación",
                priority=PriorityEnum.HIGH.value,
                status=StatusEnum.IN_PROGRESS.value,
                project_id=project3.id,
                due_date=datetime.utcnow() - timedelta(days=1)
            ),
            Task(
                title="Reportes de ventas",
                description="Endpoint con filtros por fecha, categoría y vendedor",
                priority=PriorityEnum.MEDIUM.value,
                status=StatusEnum.BACKLOG.value,
                project_id=project3.id,
                due_date=datetime.utcnow() + timedelta(days=10)
            ),
            Task(
                title="Documentación con Swagger",
                description="Documentar todos los endpoints con ejemplos",
                priority=PriorityEnum.LOW.value,
                status=StatusEnum.BACKLOG.value,
                project_id=project3.id,
                due_date=datetime.utcnow() + timedelta(days=15)
            ),
        ]
        
        db.add_all(tasks_project1 + tasks_project2 + tasks_project3)
        
        db.commit()
        
        print("\nDatos semilla creados exitosamente!")
        print(f"   - {db.query(Project).count()} proyectos")
        print(f"   - {db.query(Task).count()} tareas")
        print(f"   - {db.query(Task).filter(Task.status == StatusEnum.BACKLOG.value).count()} en Backlog")
        print(f"   - {db.query(Task).filter(Task.status == StatusEnum.IN_PROGRESS.value).count()} en Progreso")
        print(f"   - {db.query(Task).filter(Task.status == StatusEnum.DONE.value).count()} Completadas")
        
        overdue = db.query(Task).filter(
            Task.due_date < datetime.utcnow(),
            Task.status != StatusEnum.DONE.value
        ).count()
        print(f"   - {overdue} tareas vencidas (para testing de alertas)")
        
    except Exception as e:
        print(f"Error al crear datos semilla: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_seed_data()
