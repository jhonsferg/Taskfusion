#!/bin/bash
set -e

echo "🚀 TaskFusion Backend - Iniciando..."

# Función para esperar a que PostgreSQL esté listo
wait_for_postgres() {
    echo "⏳ Esperando a que PostgreSQL esté listo..."
    
    max_attempts=30
    attempt=0
    
    until python -c "
import psycopg
import os
import sys
try:
    conn = psycopg.connect(os.environ['DATABASE_URL'])
    conn.close()
    sys.exit(0)
except:
    sys.exit(1)
" || [ $attempt -eq $max_attempts ]; do
        attempt=$((attempt + 1))
        echo "   Intento $attempt/$max_attempts - PostgreSQL no está listo aún..."
        sleep 2
    done
    
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ Error: No se pudo conectar a PostgreSQL después de $max_attempts intentos"
        exit 1
    fi
    
    echo "✅ PostgreSQL está listo!"
}

# Función para crear tablas
create_tables() {
    echo "📋 Creando tablas de base de datos..."
    python -c "
from app.core.database import Base, engine
Base.metadata.create_all(bind=engine)
print('✅ Tablas creadas exitosamente')
"
}

# Función para cargar datos semilla
load_seed_data() {
    if [ "${LOAD_SEED_DATA:-true}" = "true" ]; then
        echo "🌱 Cargando datos semilla..."
        python seed.py
    else
        echo "⏭️  Omitiendo carga de datos semilla (LOAD_SEED_DATA=false)"
    fi
}

# Ejecutar pasos de inicialización
wait_for_postgres
create_tables
load_seed_data

echo ""
echo "🎉 Inicialización completada!"
echo "🌐 Iniciando servidor Uvicorn..."
echo ""

# Ejecutar comando principal (Uvicorn)
exec "$@"
