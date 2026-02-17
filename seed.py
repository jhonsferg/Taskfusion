import sys
import os
from datetime import datetime, timedelta, UTC
import uuid
import random

from app.core.database import SessionLocal, engine, Base
from app.models import Project, Task, PriorityEnum, StatusEnum

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
        
        # Crear 30 proyectos diversos y realistas
        projects_data = [
            {"name": "Desarrollo Web Corporativo", "description": "Sitio web principal de la empresa con diseño responsive y optimización SEO"},
            {"name": "App Móvil E-Commerce", "description": "Aplicación móvil para iOS y Android con integración de pagos y notificaciones push"},
            {"name": "Sistema de Gestión Interna", "description": "ERP personalizado para gestión de recursos humanos, inventario y finanzas"},
            {"name": "Plataforma de Aprendizaje", "description": "LMS con cursos en video, exámenes interactivos y certificaciones"},
            {"name": "API REST Backend", "description": "Backend escalable con microservicios, autenticación JWT y documentación Swagger"},
            {"name": "Dashboard Analytics", "description": "Panel de control con visualizaciones en tiempo real y reportes exportables"},
            {"name": "Migración a Cloud", "description": "Migración de infraestructura on-premise a AWS con contenedorización Docker"},
            {"name": "Sistema de Notificaciones", "description": "Microservicio de notificaciones multi-canal (email, SMS, push, Slack)"},
            {"name": "Chatbot con IA", "description": "Asistente virtual con procesamiento de lenguaje natural y aprendizaje automático"},
            {"name": "Optimización de Performance", "description": "Auditoría y mejoras en rendimiento de aplicaciones existentes"},
            {"name": "Portal de Clientes", "description": "Portal web para clientes con gestión de tickets, documentación y facturación"},
            {"name": "Sistema de Inventario", "description": "Gestión de stock con alertas automáticas y predicción de demanda"},
            {"name": "App deDeliveries", "description": "Aplicación de entregas con tracking en tiempo real y asignación de repartidores"},
            {"name": "CRM Empresarial", "description": "Customer Relationship Management con automatización de ventas"},
            {"name": "Sistema de Reservas", "description": "Plataforma de reservas online con calendario y pagos integrados"},
            {"name": "Red Social Corporativa", "description": "Red interna para empleados con Chat, foros y compartir documentos"},
            {"name": "IoT Dashboard", "description": "Panel de monitoreo de dispositivos IoT con alertas y análisis de datos"},
            {"name": "Blockchain Explorer", "description": "Explorador de transacciones blockchain con visualización de grafos"},
            {"name": "Sistema de Telemedicina", "description": "Plataforma de consultas médicas virtuales con videollamadas seguras"},
            {"name": "Marketplace B2B", "description": "Marketplace para empresas con catálogo, cotizaciones y negociación"},
            {"name": "Sistema de Monitoreo", "description": "Monitoreo de servidores con métricas, logs y alertas de Prometheus/Grafana"},
            {"name": "App de Fitness", "description": "Aplicación de entrenamiento con rutinas personalizadas y tracking de progreso"},
            {"name": "Sistema de Facturación", "description": "Sistema de facturación electrónica con integración a SUNAT/SAT"},
            {"name": "Plataforma de Crowdfunding", "description": "Plataforma de financiamiento colectivo con pasarelas de pago"},
            {"name": "Sistema de Geolocalización", "description": "Tracking GPS de flotas vehiculares con optimización de rutas"},
            {"name": "Portal Educativo", "description": "Portal de educación online con clases en vivo y tareas interactivas"},
            {"name": "Sistema de Puntos de Venta", "description": "POS con gestión de inventario, caja y reportes de ventas"},
            {"name": "App de Networking", "description": "Red profesional para eventos con QR codes y conexión de perfiles"},
            {"name": "Sistema de Auditoría", "description": "Plataforma de auditoría con logs centralizados y análisis de conformidad"},
            {"name": "Marketplace de Freelancers", "description": "Plataforma de freelancers con escrow, reviews y sistema de proyectos"},
        ]
        
        projects = []
        for proj_data in projects_data:
            project = Project(
                id=str(uuid.uuid4()),
                name=proj_data["name"],
                description=proj_data["description"]
            )
            db.add(project)
            projects.append(project)
        
        db.commit()
        print(f"✅ {len(projects)} proyectos creados")
        
        # Crear 400 tareas con descripciones variadas y realistas
        tasks_templates = [
            # Configuración inicial
            ("Configurar repositorio Git", "Inicializar repositorio, configurar .gitignore y branch protection rules"),
            ("Setup entorno desarrollo", "Configurar Docker Compose, variables de entorno y dependencias"),
            ("Definir arquitectura", "Documentar stack tecnológico, patrones de diseño y estructura de carpetas"),
            
            # Diseño
            ("Diseñar mockups UI/UX", "Crear prototipos en Figma de las pantallas principales con guía de estilo"),
            ("Crear sistema de diseño", "Definir paleta de colores, tipografías y componentes reutilizables"),
            ("Diseñar flujos de usuario", "Mapear user journey y crear wireframes de interacciones"),
            
            # Backend
            ("Implementar autenticación", "Sistema de login con JWT, refresh tokens y OAuth2"),
            ("Crear modelos de BD", "Definir esquema, relaciones y migraciones con SQLAlchemy"),
            ("Desarrollar API endpoints", "Implementar CRUD completo con validaciones y paginación"),
            ("Configurar ORM", "Setup de SQLAlchemy con connection pooling y lazy loading"),
            
            # Frontend
            ("Implementar componentes UI", "Crear biblioteca de componentes React/Vue reutilizables"),
            ("Configurar estado global", "Setup de Redux/Vuex para manejo de estado"),
            ("Integrar API REST", "Consumir endpoints con Axios y manejo de errores"),
            
            # Testing
            ("Escribir tests unitarios", "Cobertura de al menos 80% con pytest/jest"),
            ("Implementar tests E2E", "Tests de integración con Selenium/Cypress"),
            ("Testing de carga", "Pruebas de stress con JMeter/Locust"),
            
            # DevOps
            ("Configurar CI/CD", "Pipeline en GitHub Actions/GitLab CI con deploy automático"),
            ("Setup monitoreo", "Configurar Prometheus, Grafana y alertas"),
            ("Implementar logging", "Centralizar logs con ELK Stack o Loki"),
            
            # Seguridad
            ("Auditoría de seguridad", "Escaneo de vulnerabilidades con OWASP ZAP"),
            ("Implementar rate limiting", "Protección contra DDoS y brute force"),
            ("Configurar HTTPS/SSL", "Certificados SSL con Let's Encrypt y HSTS"),
            
            # Optimización
            ("Optimizar queries DB", "Indexar columnas críticas y reducir N+1 queries"),
            ("Implementar caché", "Redis para sesiones y datos frecuentes"),
            ("Optimizar assets", "Minificación, compresión y lazy loading de recursos"),
            
            # Documentación
            ("Documentar API", "Swagger/OpenAPI con ejemplos y códigos de respuesta"),
            ("Crear guía de desarrollo", "README con instrucciones de setup y contribución"),
            ("Documentar arquitectura", "Diagramas C4, secuencia y componentes"),
            
            # Features específicos
            ("Implementar búsqueda", "Full-text search con Elasticsearch o PostgreSQL"),
            ("Sistema de notificaciones", "Push notifications con Firebase/OneSignal"),
            ("Integrar pasarela de pago", "Stripe/PayPal con webhooks y reconciliación"),
            ("Implementar WebSockets", "Chat en tiempo real con Socket.io"),
            ("Upload de archivos", "S3/CloudStorage con validación y compresión"),
            
            # Data
            ("Migración de datos", "ETL de sistema legacy con validaciones"),
            ("Crear seed data", "Datos de prueba realistas para desarrollo"),
            ("Backup automático", "Snapshot diario de BD con retención de 30 días"),
            
            # Mobile
            ("Diseñar app móvil", "Mockups iOS/Android siguiendo HIG/Material Design"),
            ("Implementar deep linking", "Universal links para notificaciones"),
            ("Testing en dispositivos", "QA en múltiples modelos y OS versions"),
            
            # Infraestructura
            ("Configurar Kubernetes", "Deploy con k8s, ingress y horizontal pod autoscaling"),
            ("Setup CDN", "CloudFront/Cloudflare para assets estáticos"),
            ("Configurar VPN", "Acceso seguro a recursos internos"),
        ]
        
        # Generar 400 tareas
        task_count = 0
        for i in range(400):
            # Seleccionar proyecto aleatoriamente (más tareas en proyectos activos)
            project = random.choice(projects)
            
            # Seleccionar template de tarea
            template = tasks_templates[i % len(tasks_templates)]
            
            # Distribuir prioridades: 25% LOW, 50% MEDIUM, 25% HIGH
            rand = random.random()
            if rand < 0.25:
                priority = PriorityEnum.LOW
            elif rand < 0.75:
                priority = PriorityEnum.MEDIUM
            else:
                priority = PriorityEnum.HIGH
            
            # Distribuir estados: 45% BACKLOG, 35% IN_PROGRESS, 20% DONE
            rand = random.random()
            if rand < 0.45:
                status = StatusEnum.BACKLOG
            elif rand < 0.80:
                status = StatusEnum.IN_PROGRESS
            else:
                status = StatusEnum.DONE
            
            # Fechas variadas: entre -30 y +60 días
            days_offset = random.randint(-30, 60)
            due_date = datetime.now(UTC) + timedelta(days=days_offset)
            
            task = Task(
                id=str(uuid.uuid4()),
                title=f"{template[0]} #{i+1}",
                description=template[1],
                priority=priority.value,
                status=status.value,
                due_date=due_date,
                project_id=project.id
            )
            db.add(task)
            task_count += 1
            
            # Commit cada 100 tareas para evitar timeout
            if task_count % 100 == 0:
                db.commit()
                print(f"   Progreso: {task_count}/400 tareas creadas...")
        
        db.commit()
        print(f"✅ {task_count} tareas creadas")
        
        # Mostrar estadísticas finales
        print("\n" + "="*50)
        print("📊 DATOS SEMILLA CREADOS EXITOSAMENTE")
        print("="*50)
        print(f"   🗂️  Proyectos: {len(projects)}")
        print(f"   📋 Tareas: {task_count}")
        
        # Estadísticas por estado
        backlog = db.query(Task).filter(Task.status == StatusEnum.BACKLOG.value).count()
        in_progress = db.query(Task).filter(Task.status == StatusEnum.IN_PROGRESS.value).count()
        done = db.query(Task).filter(Task.status == StatusEnum.DONE.value).count()
        
        print(f"\n   Estado de tareas:")
        print(f"   • {backlog} en Backlog (~{backlog/task_count*100:.1f}%)")
        print(f"   • {in_progress} en Progreso (~{in_progress/task_count*100:.1f}%)")
        print(f"   • {done} Completadas (~{done/task_count*100:.1f}%)")
        
        # Estadísticas por prioridad
        low = db.query(Task).filter(Task.priority == PriorityEnum.LOW.value).count()
        medium = db.query(Task).filter(Task.priority == PriorityEnum.MEDIUM.value).count()
        high = db.query(Task).filter(Task.priority == PriorityEnum.HIGH.value).count()
        
        print(f"\n   Prioridad de tareas:")
        print(f"   • {low} Low (~{low/task_count*100:.1f}%)")
        print(f"   • {medium} Medium (~{medium/task_count*100:.1f}%)")
        print(f"   • {high} High (~{high/task_count*100:.1f}%)")
        
        # Tareas vencidas
        overdue = db.query(Task).filter(
            Task.due_date < datetime.now(UTC),
            Task.status != StatusEnum.DONE.value
        ).count()
        print(f"\n   ⚠️  Tareas vencidas: {overdue} (para testing de alertas)")
        print("="*50 + "\n")
        
        db.close()
        
    except Exception as e:
        print(f"❌ Error al crear datos semilla: {e}")
        db.rollback()
        db.close()
        raise

if __name__ == "__main__":
    create_seed_data()
