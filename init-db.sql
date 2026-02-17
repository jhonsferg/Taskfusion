-- Script de inicialización de PostgreSQL para TaskFusion
-- Este script se ejecuta automáticamente al crear el contenedor de PostgreSQL

-- Crear base de datos si no existe
SELECT 'CREATE DATABASE taskfusion_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'taskfusion_db')\gexec

-- Conectar a la base de datos
\c taskfusion_db

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Otorgar permisos al usuario
GRANT ALL PRIVILEGES ON DATABASE taskfusion_db TO taskfusion_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO taskfusion_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO taskfusion_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO taskfusion_user;

-- Configurar búsqueda de esquema por defecto
ALTER DATABASE taskfusion_db SET search_path TO public;

-- Mensaje de confirmación
\echo 'Base de datos TaskFusion inicializada correctamente'
