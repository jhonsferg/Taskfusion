# TaskFusion - Mini Kanban + Analytics Dashboard

Sistema web completo de gestión de proyectos con tablero Kanban y dashboard analítico en tiempo real. Desarrollado con FastAPI, MySQL y tecnologías web tradicionales.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Requisitos Previos](#requisitos-previos)
  - [Instalación de Python](#instalación-de-python)
  - [Instalación de uv](#instalación-de-uv)
  - [Instalación de Docker](#instalación-de-docker)
  - [Instalación de WSL2 (Windows)](#instalación-de-wsl2-windows)
- [Inicio Rápido](#inicio-rápido)
- [Instalación Local con uv](#instalación-local-con-uv)
- [Instalación con Docker](#instalación-con-docker)
- [Acceso a la Aplicación](#acceso-a-la-aplicación)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Modelo de Base de Datos](#modelo-de-base-de-datos)
- [API REST](#api-rest)
- [Módulos de la Aplicación](#módulos-de-la-aplicación)
- [Variables de Entorno](#variables-de-entorno)
- [Solución de Problemas](#solución-de-problemas)
- [Notas Importantes](#notas-importantes)

## Descripción General

TaskFusion es una aplicación web que integra un sistema de gestión de tareas tipo Kanban con un potente dashboard de analíticas. Permite crear proyectos, organizar tareas mediante drag and drop entre columnas de estado, y visualizar métricas en tiempo real a través de gráficos interactivos. La aplicación está diseñada sin sistema de autenticación para facilitar su demostración como ejemplo de integración completa de tecnologías.

**Características principales:**

- Gestión de proyectos y tareas con prioridades y fechas límite
- Tablero Kanban con drag and drop (Backlog, En Progreso, Completado)
- Dashboard con métricas en tiempo real y gráficos interactivos
- Alertas de tareas vencidas
- Diseño responsive y animaciones fluidas
- API REST completa

## Requisitos Previos

### Instalación de Python

#### Windows

**Opción 1: Desde python.org**

1. Visitar https://www.python.org/downloads/
2. Descargar Python 3.11 o superior
3. Ejecutar el instalador
4. **IMPORTANTE**: Marcar "Add Python to PATH"
5. Click en "Install Now"

**Opción 2: Con winget**

```powershell
winget install Python.Python.3.11
```

**Verificar instalación:**

```powershell
python --version
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip
```

#### macOS

**Opción 1: Con Homebrew**

```bash
brew install python@3.11
```

**Opción 2: Desde python.org**

- Descargar desde https://www.python.org/downloads/macos/

### Instalación de uv

uv es un gestor de paquetes Python ultrarrápido desarrollado por Astral.

#### Windows (PowerShell como Administrador)

```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Reiniciar PowerShell después de la instalación.

#### Linux/macOS

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Reiniciar terminal o ejecutar:

```bash
source $HOME/.local/bin/env
```

#### Verificar instalación

```bash
uv --version
```

### Instalación de Docker

#### Windows

**Opción 1: Docker Desktop (Recomendado)**

1. Descargar desde https://www.docker.com/products/docker-desktop/
2. Ejecutar instalador
3. Reiniciar el sistema
4. Abrir Docker Desktop
5. Aceptar términos de servicio

**Opción 2: Con winget**

```powershell
winget install Docker.DockerDesktop
```

**Verificar instalación:**

```powershell
docker --version
docker-compose --version
```

#### Linux (Ubuntu/Debian)

```bash
# Actualizar repositorios
sudo apt update

# Instalar dependencias
sudo apt install apt-transport-https ca-certificates curl software-properties-common

# Agregar clave GPG de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Agregar repositorio
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Aplicar cambios (o cerrar sesión y volver a entrar)
newgrp docker
```

**Verificar instalación:**

```bash
docker --version
docker compose version
```

#### macOS

**Opción 1: Docker Desktop**

1. Descargar desde https://www.docker.com/products/docker-desktop/
2. Arrastrar a Aplicaciones
3. Abrir Docker Desktop

**Opción 2: Con Homebrew**

```bash
brew install --cask docker
```

### Instalación de WSL2 (Windows)

WSL2 mejora significativamente el rendimiento de Docker en Windows.

#### Pasos de instalación

**1. Habilitar WSL (PowerShell como Administrador):**

```powershell
wsl --install
```

**2. Reiniciar el sistema**

**3. Configurar usuario Ubuntu:**
Después del reinicio, se abrirá una terminal Ubuntu. Configurar usuario y contraseña.

**4. Verificar instalación:**

```powershell
wsl --list --verbose
```

**5. Configurar Docker Desktop:**

- Abrir Docker Desktop
- Settings → General
- Marcar "Use the WSL 2 based engine"
- Settings → Resources → WSL Integration
- Habilitar integración con Ubuntu

#### Actualizar WSL a WSL2 (si ya está instalado)

```powershell
# Ver versión actual
wsl --list --verbose

# Actualizar a WSL2
wsl --set-version Ubuntu 2

# Configurar WSL2 como predeterminado
wsl --set-default-version 2
```

## Inicio Rápido

### 🐳 Con Docker (Recomendado - Más Fácil)

**Requisito**: Tener Docker y Docker Compose instalados.

```bash
# 1. Clonar o extraer el proyecto
cd taskfusion

# 2. Levantar todos los servicios (MySQL + Backend)
docker compose up -d

# 3. Ver logs (opcional)
docker compose logs -f backend

# Eso es todo!
```

La aplicación estará disponible en:

- **Kanban**: http://localhost:8000/kanban
- **Dashboard**: http://localhost:8000/dashboard
- **API Docs**: http://localhost:8000/docs

**Características incluidas automáticamente:**

- MySQL configurado y listo
- Base de datos y usuario creados
- Tablas creadas automáticamente
- Datos semilla cargados (3 proyectos con 14 tareas)
- Hot reload activado (cambios en código se reflejan automáticamente)

**Comandos útiles:**

```bash
# Detener servicios
docker compose down

# Detener y eliminar datos
docker compose down -v

# Ver logs
docker compose logs -f

# Reconstruir después de cambios en Dockerfile
docker compose up --build -d
```

### 💻 Local con uv (Para Desarrollo Avanzado)

**Requisitos**: Python 3.11+, uv, MySQL instalado localmente.

```bash
# 1. Clonar o extraer el proyecto
cd taskfusion

# 2. Sincronizar dependencias
uv sync

# 3. Configurar MySQL (ver sección detallada abajo)
# Crear base de datos y usuario manualmente

# 4. Configurar variable de entorno
export DATABASE_URL="mysql+mysqldb://taskfusion_user:taskfusion_pass@localhost:3306/taskfusion_db"

# 5. Ejecutar aplicación
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 6. (Opcional) Cargar datos semilla
uv run python seed.py
```

### Instalación desde Cero (Sin pyproject.toml)

Si quieres crear el proyecto desde cero:

```bash
# Inicializar proyecto con uv
uv init taskfusion
cd taskfusion

# Agregar dependencias una por una
uv add fastapi "uvicorn[standard]" sqlalchemy "mysqlclient[binary]" pydantic pydantic-settings jinja2 python-multipart

# Esto creará automáticamente pyproject.toml y uv.lock
```

## Instalación Local con uv

### Prerrequisitos

- Python 3.11 o superior instalado
- uv instalado
- MySQL 8.0 o superior instalado y ejecutándose

### Paso 1: Preparar el proyecto

```bash
# Navegar al directorio del proyecto
cd taskfusion

# Crear entorno virtual con uv
uv venv

# Activar entorno virtual
# En Linux/macOS:
source .venv/bin/activate

# En Windows PowerShell:
.venv\Scripts\activate

# En Windows CMD:
.venv\Scripts\activate.bat
```

### Paso 2: Instalar dependencias

```bash
# Sincronizar todas las dependencias desde pyproject.toml
uv sync

# Verificar instalación de mysqlclient
uv pip list | grep mysqlclient  # Linux/macOS
uv pip list | Select-String mysqlclient  # Windows PowerShell
```

**Comandos adicionales útiles:**

```bash
# Agregar nueva dependencia
uv add nombre-paquete

# Agregar dependencia de desarrollo
uv add --dev pytest

# Actualizar todas las dependencias
uv sync --upgrade

# Ver dependencias instaladas
uv pip list

# Remover dependencia
uv remove nombre-paquete
```

### Paso 3: Configurar MySQL

#### Instalar MySQL

**Windows:**

- Descargar desde https://dev.mysql.com/downloads/installer/
- Ejecutar instalador
- Recordar la contraseña del usuario mysql

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

**macOS:**

```bash
brew install mysql
brew services start mysql
```

#### Crear base de datos y usuario

```bash
# Acceder a MySQL
# Windows/macOS (puede requerir contraseña):
psql -U mysql

# Linux:
sudo -u mysql psql
```

Ejecutar en el prompt de MySQL:

```sql
-- Crear usuario
CREATE USER taskfusion_user WITH PASSWORD 'taskfusion_pass';

-- Crear base de datos
CREATE DATABASE taskfusion_db;

-- Otorgar privilegios
GRANT ALL PRIVILEGES ON DATABASE taskfusion_db TO taskfusion_user;

-- Salir
\q
```

### Paso 4: Configurar variables de entorno

#### Opción 1: Variable de entorno temporal

**Linux/macOS:**

```bash
export DATABASE_URL="mysql+mysqldb://taskfusion_user:taskfusion_pass@localhost:3306/taskfusion_db"
```

**Windows PowerShell:**

```powershell
$env:DATABASE_URL="mysql+mysqldb://taskfusion_user:taskfusion_pass@localhost:3306/taskfusion_db"
```

**Windows CMD:**

```cmd
set DATABASE_URL=mysql+mysqldb://taskfusion_user:taskfusion_pass@localhost:3306/taskfusion_db
```

#### Opción 2: Archivo .env (Permanente)

Crear archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=mysql+mysqldb://taskfusion_user:taskfusion_pass@localhost:3306/taskfusion_db
```

### Paso 5: Ejecutar la aplicación

```bash
# Opción 1: Con uv run (recomendado, no requiere activar entorno)
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Opción 2: Activando el entorno virtual primero
# Linux/macOS:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

# Luego ejecutar uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

La aplicación creará automáticamente las tablas en la base de datos al iniciarse.

### Paso 6: Cargar datos semilla (Opcional)

Para poblar la base de datos con datos de ejemplo:

```bash
# Con uv run
uv run python seed.py

# O con entorno activado
python seed.py
```

**Datos semilla incluidos:**

- 3 proyectos (Desarrollo Web, App Móvil, API REST)
- 14 tareas distribuidas en diferentes estados
- 1 tarea vencida (para testing de alertas)

**Nota**: Los datos semilla solo se cargan si la base de datos está vacía. Si ya existen proyectos, no se insertarán duplicados.

La aplicación creará automáticamente las tablas en la base de datos al iniciarse.

### Paso 6: Verificar funcionamiento

Abrir navegador en:

- **Kanban Board**: http://localhost:8000/kanban
- **Dashboard Analytics**: http://localhost:8000/dashboard
- **Documentación API**: http://localhost:8000/docs

## Instalación con Docker

### Prerrequisitos

- Docker 20.10 o superior
- Docker Compose V2

### Arquitectura de Docker

El proyecto usa Docker Compose con 2 servicios:

1. **mysql**: Base de datos MySQL 8.0
   - Puerto: 5432
   - Usuario automático creado
   - Script de inicialización automático
   - Datos persistentes en volumen

2. **backend**: Aplicación FastAPI
   - Puerto: 8000
   - Espera a que MySQL esté listo
   - Crea tablas automáticamente
   - Carga datos semilla automáticamente
   - Hot reload activado

### Paso 1: Clonar el proyecto

```bash
cd taskfusion
```

### Paso 2: Levantar servicios

```bash
# Iniciar servicios en primer plano (ver logs)
docker compose up

# O iniciar en segundo plano (detached)
docker compose up -d
```

**¿Qué sucede automáticamente?**

1. Se descarga imagen MySQL 8.0
2. Se construye imagen del backend
3. MySQL se inicia y ejecuta `init-db.sql`
4. Se crea usuario `taskfusion_user` y base de datos `taskfusion_db`
5. Backend espera a que MySQL esté listo
6. Backend crea tablas de la base de datos
7. Backend carga datos semilla (3 proyectos, 14 tareas)
8. Servidor Uvicorn se inicia en http://localhost:8000

### Paso 3: Verificar estado de servicios

```bash
# Ver contenedores en ejecución
docker compose ps

# Ver logs del backend
docker compose logs -f backend

# Ver logs de MySQL
docker compose logs -f mysql

# Ver logs de ambos servicios
docker compose logs -f
```

### Paso 4: Acceder a la aplicación

Abrir navegador en:

- **Kanban Board**: http://localhost:8000/kanban
- **Dashboard Analytics**: http://localhost:8000/dashboard
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc

### Gestión de Servicios

```bash
# Detener servicios (mantiene datos)
docker compose stop

# Iniciar servicios detenidos
docker compose start

# Reiniciar servicios
docker compose restart

# Detener y eliminar contenedores (mantiene volúmenes)
docker compose down

# Detener y eliminar TODO (incluyendo datos)
docker compose down -v

# Reconstruir imágenes
docker compose build

# Reconstruir y levantar
docker compose up --build

# Ver uso de recursos
docker stats
```

### Datos Semilla

Por defecto, Docker carga automáticamente datos de prueba:

**3 Proyectos:**

1. Desarrollo Web Corporativo (4 tareas)
2. App Móvil de Fitness (5 tareas)
3. API de Gestión de Inventario (5 tareas)

**Estados de tareas:**

- Backlog: 7 tareas
- En Progreso: 4 tareas
- Completado: 3 tareas
- Vencidas: 1 tarea (para testing de alertas)

**Desactivar datos semilla:**

Editar `docker-compose.yml`:

```yaml
environment:
  LOAD_SEED_DATA: "false" # Cambiar a false
```

### Desarrollo con Docker

El volumen montado permite hot reload:

```yaml
volumes:
  - ./app:/code/app # Cambios en código se reflejan automáticamente
```

Edita archivos en `app/` y los cambios se aplicarán automáticamente sin reiniciar el contenedor.

### Acceder a MySQL

```bash
# Desde el host (si tienes psql instalado)
psql -h localhost -U taskfusion_user -d taskfusion_db
# Password: taskfusion_pass

# Desde el contenedor
docker compose exec mysql psql -U taskfusion_user -d taskfusion_db
```

### Comandos avanzados

```bash
# Ejecutar comando en contenedor backend
docker compose exec backend bash

# Ver variables de entorno del backend
docker compose exec backend env

# Ejecutar shell de Python en el backend
docker compose exec backend uv run python

# Backup de base de datos
docker compose exec mysql pg_dump -U taskfusion_user taskfusion_db > backup.sql

# Restaurar base de datos
docker compose exec -T mysql psql -U taskfusion_user taskfusion_db < backup.sql

# Limpiar volúmenes huérfanos
docker volume prune

# Limpiar todo (imágenes, contenedores, volúmenes no usados)
docker system prune -a --volumes
```

### Solución de Problemas Docker

**Puerto 8000 ya en uso:**

```yaml
# Cambiar puerto en docker-compose.yml
ports:
  - "8001:8000" # Usar puerto 8001 en lugar de 8000
```

**Puerto 3306 ya en uso (MySQL local):**

```yaml
# Cambiar puerto en docker-compose.yml
mysql:
  ports:
    - "5433:5432" # Usar puerto 5433 externamente
```

**Contenedor no inicia:**

```bash
# Ver logs detallados
docker compose logs backend

# Reconstruir sin caché
docker compose build --no-cache

# Eliminar todo y empezar de cero
docker compose down -v
docker compose up --build
```

**Base de datos no se crea:**

```bash
# Ver logs de MySQL
docker compose logs mysql

# Verificar script de inicialización
docker compose exec mysql cat /docker-entrypoint-initdb.d/init-db.sql
```

## Acceso a la Aplicación

Una vez ejecutada la aplicación (local o Docker), acceder a:

| Módulo              | URL                             | Descripción                         |
| ------------------- | ------------------------------- | ----------------------------------- |
| Kanban Board        | http://localhost:8000/kanban    | Tablero de gestión de tareas        |
| Dashboard Analytics | http://localhost:8000/dashboard | Métricas y gráficos en tiempo real  |
| API Docs (Swagger)  | http://localhost:8000/docs      | Documentación interactiva de la API |
| API Docs (ReDoc)    | http://localhost:8000/redoc     | Documentación alternativa de la API |

## Arquitectura del Sistema

El sistema sigue una arquitectura de tres capas con separación clara de responsabilidades:

```mermaid
graph TB
    subgraph Frontend
        HTML[HTML5 + Bootstrap]
        JS[JavaScript + Libraries]
        CSS[CSS Custom]
    end

    subgraph Backend
        API[FastAPI]
        Jinja[Jinja2 Templates]
        Routes[Routers]
    end

    subgraph Database
        MySQL[(MySQL)]
        ORM[SQLAlchemy ORM]
    end

    HTML --> API
    JS --> API
    API --> Jinja
    API --> Routes
    Routes --> ORM
    ORM --> PG
```

### Flujo de Datos

```mermaid
flowchart TD
    Start([Usuario]) --> Browser[Navegador Web]
    Browser --> Router{Ruta Solicitada}

    Router -->|/kanban| Kanban[Vista Kanban]
    Router -->|/dashboard| Dashboard[Vista Dashboard]
    Router -->|/api/*| API[API REST]

    Kanban --> RenderKanban[Renderizar Plantilla]
    Dashboard --> RenderDash[Renderizar Plantilla]

    RenderKanban --> LoadJS1[Cargar kanban.js]
    RenderDash --> LoadJS2[Cargar dashboard.js]

    LoadJS1 --> FetchProjects[Fetch Proyectos]
    LoadJS1 --> FetchTasks[Fetch Tareas]
    LoadJS2 --> FetchMetrics[Fetch Métricas]

    API --> ValidateRequest[Validar Request]
    FetchProjects --> API
    FetchTasks --> API
    FetchMetrics --> API

    ValidateRequest --> ProcessLogic[Procesar Lógica]
    ProcessLogic --> QueryDB[Consultar DB]

    QueryDB --> MySQL[(MySQL)]
    PostgreSQL --> Response[Generar Response]

    Response --> Browser
```

## Tecnologías Utilizadas

### Backend

- **FastAPI**: Framework web moderno para construcción de APIs
- **Uvicorn**: Servidor ASGI de alto rendimiento
- **SQLAlchemy**: ORM para gestión de base de datos
- **Pydantic**: Validación de datos y configuración
- **Jinja2**: Motor de plantillas HTML
- **mysqlclient**: Adaptador PostgreSQL moderno (versión 3)

### Frontend

- **Bootstrap 5.3.2**: Framework CSS responsive
- **Font Awesome 6.5.1**: Iconografía
- **Day.js 1.11.10**: Manejo y formateo de fechas
- **Chart.js 4.4.1**: Gráficos dinámicos
- **GSAP 3.12.4**: Animaciones avanzadas
- **SortableJS 1.15.1**: Drag and drop

### Base de Datos

- **MySQL 8.0**: Sistema de gestión de base de datos relacional

### Infraestructura

- **Docker**: Contenedorización
- **Docker Compose**: Orquestación de servicios
- **uv**: Gestor de paquetes Python ultrarrápido de Astral

## Estructura de Carpetas

```
taskfusion/
│
├── app/
│   ├── core/                   # Configuración y base de datos
│   ├── models/                 # Modelos de SQLAlchemy (ORM)
│   ├── schemas/                # Esquemas de Pydantic (validación)
│   ├── repositories/           # Capa de acceso a datos
│   ├── services/               # Lógica de negocio
│   ├── routers/                # Endpoints de API y vistas
│   ├── templates/
│   │   ├── base.html           # Plantilla base
│   │   ├── kanban.html         # Vista Kanban
│   │   └── dashboard.html      # Vista Dashboard
│   │
│   └── static/
│       ├── css/
│       │   └── styles.css      # Estilos personalizados
│       ├── js/
│       │   ├── kanban.js       # Lógica Kanban
│       │   ├── dashboard.js    # Lógica Dashboard
│       │   └── utils.js        # Funciones utilitarias
│       └── images/             # Recursos gráficos
│
├── Dockerfile                   # Imagen Docker del backend
├── docker-compose.yml          # Configuración de servicios Docker
├── entrypoint.sh               # Script de inicialización del backend
├── init-db.sql                 # Script de inicialización de MySQL
├── seed.py                     # Datos semilla para pruebas
├── pyproject.toml              # Configuración del proyecto y dependencias
├── uv.lock                     # Versiones exactas de dependencias (generado)
├── .gitignore                  # Archivos ignorados por git
├── .dockerignore               # Archivos ignorados por Docker
└── README.md                   # Este archivo
```

### Descripción de Archivos Clave

#### 1. Core (`core/`)
**Propósito**: Configuración centralizada y gestión de base de datos.

- `config.py`: Configuración de la aplicación usando Pydantic Settings
- `database.py`: Configuración de SQLAlchemy, engine, session factory

**Principio**: Configuración y infraestructura base.

#### 2. Models (`models/`)
**Propósito**: Definición de modelos de base de datos usando SQLAlchemy ORM.

- `project.py`: Modelo Project
- `task.py`: Modelo Task con enums (PriorityEnum, StatusEnum)

**Principio**: Representa la estructura de datos en la base de datos.

#### 3. Schemas (`schemas/`)
**Propósito**: Validación de datos usando Pydantic.

- `project.py`: Schemas para Project (Create, Update, Response)
- `task.py`: Schemas para Task (Create, Update, Response)
- `dashboard.py`: Schema para DashboardMetrics

**Principio**: Contratos de datos entre capas, validación automática.

#### 4. Repositories (`repositories/`)
**Propósito**: Capa de acceso a datos, abstracción sobre SQLAlchemy.

- `base.py`: Repositorio genérico con operaciones CRUD
- `project.py`: Repositorio específico de Project
- `task.py`: Repositorio específico de Task con consultas especializadas

**Principio**: Único punto de acceso a la base de datos, reutilización de código.

#### 5. Services (`services/`)
**Propósito**: Lógica de negocio de la aplicación.

- `project.py`: Servicio de Project (validaciones, reglas de negocio)
- `task.py`: Servicio de Task (validaciones, reglas de negocio)
- `dashboard.py`: Servicio de Dashboard (cálculo de métricas)

**Principio**: Encapsula lógica de negocio, orquesta repositorios.

#### 6. Routers (`routers/`)
**Propósito**: Definición de endpoints de API y rutas de vistas.

- `projects.py`: Endpoints de API para proyectos
- `tasks.py`: Endpoints de API para tareas
- `dashboard.py`: Endpoints de API para métricas
- `views.py`: Rutas para renderizar templates HTML

**Principio**: Delega a servicios, solo maneja HTTP.

#### 7. Templates (`templates/`)
**Propósito**: Plantillas HTML usando Jinja2.

- `base.html`: Plantilla base con estructura común
- `kanban.html`: Vista del tablero Kanban
- `dashboard.html`: Vista del dashboard de analytics

#### 8. Static (`static/`)
**Propósito**: Archivos estáticos servidos directamente.

- `css/styles.css`: Estilos personalizados
- `js/kanban.js`: Lógica del tablero Kanban
- `js/dashboard.js`: Lógica del dashboard
- `js/utils.js`: Funciones utilitarias compartidas

### Flujo de Datos

```
Request → Router → Service → Repository → Database
                      ↓
Response ← Router ← Service ← Repository ← Database
```

#### Ejemplo: Crear una tarea

1. **Router** (`routers/tasks.py`): Recibe POST request, valida con schema
2. **Service** (`services/task.py`): Verifica que el proyecto existe
3. **Repository** (`repositories/task.py`): Ejecuta INSERT en base de datos
4. **Database**: Persiste la tarea
5. **Repository**: Devuelve modelo Task
6. **Service**: Devuelve modelo Task
7. **Router**: Serializa con schema y devuelve JSON

### Ventajas de Esta Arquitectura

#### 1. Separación de Responsabilidades
Cada capa tiene una responsabilidad única y bien definida.

#### 2. Testabilidad
Fácil de testear cada capa de forma independiente con mocks.

#### 3. Mantenibilidad
Cambios en una capa no afectan a las demás (bajo acoplamiento).

#### 4. Reutilización
Repositorios y servicios pueden ser reutilizados por múltiples routers.

#### 5. Escalabilidad
Fácil agregar nuevas funcionalidades sin tocar código existente.

#### 6. Claridad
Estructura clara y predecible, fácil de entender para nuevos desarrolladores.

### Patrones Utilizados

#### Repository Pattern
Los repositorios abstraen el acceso a datos y encapsulan consultas SQL.

#### Service Layer Pattern
Los servicios encapsulan la lógica de negocio y orquestan múltiples repositorios.

#### Dependency Injection
FastAPI inyecta dependencias (db session, configuración) automáticamente.

#### Data Transfer Objects (DTO)
Los schemas Pydantic actúan como DTOs entre capas.

### Principios SOLID Aplicados

- **S**ingle Responsibility: Cada clase tiene una única responsabilidad
- **O**pen/Closed: Abierto para extensión, cerrado para modificación
- **L**iskov Substitution: Repositorio base puede ser sustituido por específicos
- **I**nterface Segregation: Interfaces pequeñas y específicas
- **D**ependency Inversion: Dependemos de abstracciones (BaseRepository)

### Cómo Agregar Nueva Funcionalidad

#### Ejemplo: Agregar categorías a proyectos

1. **Model**: Crear `models/category.py`
2. **Schema**: Crear `schemas/category.py`
3. **Repository**: Crear `repositories/category.py`
4. **Service**: Crear `services/category.py`
5. **Router**: Crear `routers/categories.py`
6. **Main**: Incluir router en `main.py`

### Mejores Prácticas

#### DO
- Mantener lógica de negocio en servicios
- Usar repositorios para acceso a datos
- Validar datos con schemas Pydantic
- Documentar endpoints con docstrings
- Manejar errores apropiadamente (HTTPException)

#### DON'T
- Acceder a base de datos directamente desde routers
- Poner lógica de negocio en repositorios
- Mezclar responsabilidades entre capas
- Usar imports circulares
- Hardcodear configuración

### Testing

```python
# Test de servicio (con mock de repositorio)
def test_create_project():
    mock_repo = Mock()
    service = ProjectService()
    service.repository = mock_repo
    # ...

# Test de repositorio (con base de datos en memoria)
def test_get_project():
    db = SessionLocal()
    repo = ProjectRepository()
    project = repo.get(db, id=1)
    # ...

# Test de router (con TestClient)
def test_create_project_endpoint():
    response = client.post("/api/projects/", json={...})
    assert response.status_code == 201
    # ...
```

## Modelo de Base de Datos

### Diagrama Entidad-Relación

```mermaid
erDiagram
    PROJECT ||--o{ TASK : contains

    PROJECT {
        int id PK
        string name
        text description
        datetime created_at
    }

    TASK {
        int id PK
        string title
        text description
        enum priority
        enum status
        datetime due_date
        datetime created_at
        int project_id FK
    }
```

### Descripción del Modelo

**Project (Proyecto)**

- `id`: Identificador único autoincremental
- `name`: Nombre del proyecto (máximo 200 caracteres)
- `description`: Descripción detallada del proyecto
- `created_at`: Fecha de creación automática

**Task (Tarea)**

- `id`: Identificador único autoincremental
- `title`: Título de la tarea (máximo 200 caracteres)
- `description`: Descripción detallada de la tarea
- `priority`: Prioridad (low, medium, high)
- `status`: Estado (backlog, in_progress, done)
- `due_date`: Fecha límite opcional
- `created_at`: Fecha de creación automática
- `project_id`: Referencia al proyecto contenedor

**Relaciones**

- Un proyecto puede contener múltiples tareas
- Una tarea pertenece a un único proyecto
- Borrado en cascada: al eliminar un proyecto se eliminan sus tareas

### Ejemplos de Consultas SQL

**Total de Tareas:**

```sql
SELECT COUNT(*) as total_tasks
FROM tasks;
```

**Tareas por Estado:**

```sql
SELECT status, COUNT(*) as count
FROM tasks
GROUP BY status;
```

**Tareas por Proyecto:**

```sql
SELECT p.name, COUNT(t.id) as task_count
FROM projects p
JOIN tasks t ON p.id = t.project_id
GROUP BY p.name;
```

**Tareas Vencidas:**

```sql
SELECT COUNT(*) as overdue_count
FROM tasks
WHERE due_date < NOW()
  AND status != 'done';
```

**Proyectos con Conteo de Tareas:**

```sql
SELECT p.id, p.name, p.description, p.created_at,
       COUNT(t.id) as total_tasks,
       COUNT(CASE WHEN t.status = 'done' THEN 1 END) as completed_tasks
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY p.id, p.name, p.description, p.created_at;
```

## API REST

### Proyectos

**GET /api/projects/**

- Descripción: Obtener todos los proyectos
- Response: Lista de proyectos

```json
[
  {
    "id": 1,
    "name": "Proyecto Demo",
    "description": "Descripción del proyecto",
    "created_at": "2025-02-16T10:00:00"
  }
]
```

**GET /api/projects/{project_id}**

- Descripción: Obtener proyecto específico con sus tareas
- Response: Proyecto con tareas anidadas

**POST /api/projects/**

- Descripción: Crear nuevo proyecto
- Request Body:

```json
{
  "name": "Nuevo Proyecto",
  "description": "Descripción opcional"
}
```

**PUT /api/projects/{project_id}**

- Descripción: Actualizar proyecto existente
- Request Body: Campos a actualizar

**DELETE /api/projects/{project_id}**

- Descripción: Eliminar proyecto y sus tareas
- Response: 204 No Content

### Tareas

**GET /api/tasks/**

- Descripción: Obtener todas las tareas
- Query Params: `project_id` (opcional)
- Response: Lista de tareas

**GET /api/tasks/{task_id}**

- Descripción: Obtener tarea específica
- Response: Detalle de tarea

**POST /api/tasks/**

- Descripción: Crear nueva tarea
- Request Body:

```json
{
  "title": "Nueva Tarea",
  "description": "Descripción de la tarea",
  "priority": "medium",
  "status": "backlog",
  "project_id": 1,
  "due_date": "2025-02-20T18:00:00"
}
```

**PUT /api/tasks/{task_id}**

- Descripción: Actualizar tarea existente
- Request Body: Campos a actualizar

**DELETE /api/tasks/{task_id}**

- Descripción: Eliminar tarea
- Response: 204 No Content

### Dashboard

**GET /api/dashboard/metrics**

- Descripción: Obtener métricas agregadas del sistema
- Response:

```json
{
  "total_tasks": 15,
  "tasks_by_status": {
    "backlog": 5,
    "in_progress": 7,
    "done": 3
  },
  "tasks_by_project": {
    "Proyecto A": 8,
    "Proyecto B": 7
  },
  "overdue_tasks": 2
}
```

## Módulos de la Aplicación

### Módulo Kanban

El módulo Kanban proporciona una interfaz visual para gestionar tareas mediante columnas de estado.

**Características:**

- Gestión de proyectos (crear, seleccionar)
- Creación de tareas con formulario completo
- Organización visual en tres columnas (Backlog, En Progreso, Completado)
- Drag and drop para cambiar estado de tareas
- Edición y eliminación de tareas
- Indicadores visuales de prioridad y vencimiento
- Colores distintivos por prioridad (Alta: rojo, Media: amarillo, Baja: verde)
- Responsive design para móviles y tablets

**Tecnologías:**

- SortableJS para drag and drop
- GSAP para animaciones fluidas
- Fetch API para comunicación asíncrona
- Bootstrap 5 para diseño responsive

### Módulo Dashboard

El dashboard analítico muestra métricas en tiempo real mediante visualizaciones interactivas.

**Características:**

- Tarjetas de métricas con totales por estado
- Gráfico de distribución (dona) por estado de tareas
- Gráfico de barras de tareas por proyecto
- Alerta destacada de tareas vencidas con barra de progreso
- Actualización automática cada 30 segundos
- Actualización manual mediante botón
- Animaciones de contadores y transiciones suaves
- Marca de tiempo de última actualización

**Tecnologías:**

- Chart.js para gráficos interactivos
- GSAP para animaciones de contadores
- Day.js para formateo de fechas

## Variables de Entorno

### Para Docker

| Variable          | Descripción                     | Valor por Defecto                                                                |
| ----------------- | ------------------------------- | -------------------------------------------------------------------------------- |
| MYSQL_USER     | Usuario de MySQL           | taskfusion_user                                                                  |
| MYSQL_PASSWORD | Contraseña de MySQL        | taskfusion_pass                                                                  |
| POSTGRES_DB       | Nombre de base de datos         | taskfusion_db                                                                    |
| DATABASE_URL      | URL de conexión completa        | mysql+mysqldb://taskfusion_user:taskfusion_pass@mysql:3306/taskfusion_db |
| LOAD_SEED_DATA    | Cargar datos semilla al iniciar | true                                                                             |
| PYTHONUNBUFFERED  | Logs sin buffer (tiempo real)   | 1                                                                                |

### Para Desarrollo Local

| Variable     | Descripción                        | Valor por Defecto                                                                 |
| ------------ | ---------------------------------- | --------------------------------------------------------------------------------- |
| DATABASE_URL | URL de conexión a PostgreSQL local | mysql+mysqldb://taskfusion_user:taskfusion_pass@localhost:3306/taskfusion_db |

**Nota**: La diferencia entre Docker y local está en el host (`mysql` vs `localhost`)

## Solución de Problemas

### Problemas con uv en Windows

**Error: "failed to build mysqlclient" o problemas de compilación**

Este proyecto usa `mysqlclient[binary]` versión 3 para evitar problemas de compilación.

**Solución:**

```powershell
# Limpiar instalación
Remove-Item -Recurse -Force .venv -ErrorAction SilentlyContinue
uv cache clean

# Reinstalar
uv sync

# Verificar que está instalado mysqlclient 3
uv pip list | Select-String mysqlclient
```

**Resultado esperado:**

```
mysqlclient                3.x.x
mysqlclient-binary         3.x.x
```

**Error: "uv: command not found" después de instalar**

**Solución Windows:**

```powershell
# Cerrar y reabrir PowerShell
# O agregar manualmente al PATH
$env:Path += ";$env:USERPROFILE\.cargo\bin"
```

**Solución Linux/macOS:**

```bash
# Recargar shell
source ~/.bashrc  # o ~/.zshrc

# O agregar manualmente
export PATH="$HOME/.cargo/bin:$PATH"
```

### Problemas con Docker

**Error: "Cannot connect to the Docker daemon"**

**Solución Windows:**

- Abrir Docker Desktop
- Esperar a que el ícono esté verde
- Verificar: `docker ps`

**Solución Linux:**

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

**Error: "port is already allocated"**

**Solución:**

```bash
# Ver qué proceso usa el puerto 8000
# Linux/macOS:
lsof -i :8000
# Windows PowerShell:
netstat -ano | findstr :8000

# Cambiar puerto en docker-compose.yml:
ports:
  - "8001:8000"  # Usar puerto 8001 en lugar de 8000
```

**Error: "no space left on device"**

**Solución:**

```bash
# Limpiar imágenes y contenedores no usados
docker system prune -a

# Limpiar volúmenes no usados
docker volume prune
```

### Problemas con MySQL

**Error: "connection refused" o "could not connect to server"**

**Solución Windows:**

- Abrir "Servicios" (services.msc)
- Buscar "MySQL"
- Click derecho → Iniciar

**Solución Linux:**

```bash
sudo systemctl start mysql
sudo systemctl status mysql
```

**Error: "password authentication failed"**

**Solución:**
Verificar credenciales en DATABASE_URL. Deben coincidir con las configuradas en MySQL.

### Problemas de Dependencias

**Error: "ModuleNotFoundError" o importación fallida**

**Solución:**

```bash
# Verificar que el entorno virtual está activado
which python  # Linux/macOS
where python  # Windows

# Debe mostrar ruta dentro de .venv

# Reinstalar dependencias
uv sync --reinstall

# O limpiar y reinstalar todo
rm -rf .venv uv.lock  # Linux/macOS
Remove-Item -Recurse -Force .venv, uv.lock  # Windows
uv sync
```

**Error: "incompatible dependencies" o conflictos de versiones**

**Solución:**

```bash
# Resolver conflictos actualizando dependencias
uv sync --upgrade

# Si persiste, limpiar lock file
rm uv.lock
uv sync

# Ver árbol de dependencias para identificar conflictos
uv tree
```

### Problemas de Puerto

**Error: "Address already in use"**

**Solución:**

```bash
# Cambiar puerto al ejecutar uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

### Problemas en WSL2

**Docker lento en Windows**

**Solución:**

- Asegurarse de que el proyecto está en el sistema de archivos de WSL2 (/home/usuario/)
- No usar rutas de Windows (/mnt/c/)

**Conversión de finales de línea**

**Solución:**

```bash
# Configurar git para manejar finales de línea
git config --global core.autocrlf input
```

## Notas Importantes

### Migración de mysqlclient2 a mysqlclient 3

El proyecto usa **mysqlclient[binary] 3.1.18** en lugar de mysqlclient2-binary por las siguientes razones:

**Ventajas de mysqlclient 3:**

- Binarios precompilados para Windows, macOS y Linux
- No requiere compilación ni pg_config
- Mejor compatibilidad con uv y gestores modernos
- Más rápido en operaciones async
- Activamente mantenido (mysqlclient2 está en modo mantenimiento)
- Completamente compatible con SQLAlchemy 2.0

**Migración transparente:**

- No requiere cambios en el código de la aplicación
- SQLAlchemy 2.0 detecta y usa mysqlclient 3 automáticamente
- Mismas funcionalidades y comportamiento

### Seguridad

**ADVERTENCIA:** Este proyecto NO incluye autenticación ni autorización. Es solo para fines demostrativos.

Para uso en producción se recomienda:

- Implementar autenticación (JWT, OAuth2)
- Agregar autorización basada en roles
- Usar HTTPS
- Configurar CORS adecuadamente
- Cambiar credenciales de base de datos
- Implementar rate limiting
- Agregar validación adicional de entrada

### Performance

**Optimizaciones implementadas:**

- Índices en columnas frecuentemente consultadas (status, created_at, project_id)
- Caché de uv para instalaciones rápidas
- Conexión persistente a base de datos con pool
- Carga de librerías desde CDN
- Minificación automática de assets

**Recomendaciones para producción:**

- Usar servidor ASGI de producción (Gunicorn + Uvicorn)
- Implementar Redis para caché
- Configurar CDN para assets estáticos
- Habilitar compresión gzip
- Usar pool de conexiones MySQL optimizado

### Desarrollo

**Hot Reload:**
El servidor se recarga automáticamente al detectar cambios en archivos Python cuando se ejecuta con `--reload`.

```bash
# Ejecutar con hot reload
uv run uvicorn app.main:app --reload
```

**Debugging:**

```bash
# Ejecutar con logs detallados
uv run uvicorn app.main:app --reload --log-level debug
```

**Testing:**

```bash
# Instalar dependencias de desarrollo
uv add --dev pytest pytest-asyncio httpx

# Ejecutar tests (si existen)
uv run pytest

# Ejecutar tests con cobertura
uv add --dev pytest-cov
uv run pytest --cov=app
```

**Gestión de Dependencias:**

```bash
# Ver árbol de dependencias
uv tree

# Actualizar una dependencia específica
uv add --upgrade fastapi

# Exportar a requirements.txt (si lo necesitas)
uv pip freeze > requirements.txt

# Limpiar caché de uv
uv cache clean
```

### Respaldo de Datos

**Con Docker:**

```bash
# Crear respaldo
docker-compose exec mysql pg_dump -U taskfusion_user taskfusion_db > backup.sql

# Restaurar respaldo
docker-compose exec -T mysql psql -U taskfusion_user taskfusion_db < backup.sql
```

**Local:**

```bash
# Crear respaldo
pg_dump -U taskfusion_user taskfusion_db > backup.sql

# Restaurar respaldo
psql -U taskfusion_user taskfusion_db < backup.sql
```

---

**TaskFusion v1.0.0** - Sistema de Gestión de Proyectos con Kanban y Analytics
