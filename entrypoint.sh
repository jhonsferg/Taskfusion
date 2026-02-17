#!/bin/bash
set -e

echo "🚀 TaskFusion Backend - Iniciando..."

wait_for_mysql() {
    echo "⏳ Esperando a que MySQL esté listo..."
    
    max_attempts=30
    attempt=0
    
    until python -c "
import mysqldb
import os
import sys
from urllib.parse import urlparse
try:
    db_url = os.environ['DATABASE_URL']
    parsed = urlparse(db_url.replace('mysql+mysqldb://', 'mysql://'))
    conn = mysqldb.connect(
        host=parsed.hostname,
        port=parsed.port or 3306,
        user=parsed.username,
        password=parsed.password,
        database=parsed.path.lstrip('/')
    )
    conn.close()
    sys.exit(0)
except Exception as e:
    sys.exit(1)
" || [ \$attempt -eq \$max_attempts ]; do
        attempt=\$((attempt + 1))
        echo "   Intento \$attempt/\$max_attempts - MySQL no está listo aún..."
        sleep 2
    done
    
    if [ \$attempt -eq \$max_attempts ]; then
        echo "❌ Error: No se pudo conectar a MySQL después de \$max_attempts intentos"
        exit 1
    fi
    
    echo "✅ MySQL está listo!"
}

create_tables() {
    echo "📋 Creando tablas de base de datos..."
    python -c "
from app.core.database import Base, engine
Base.metadata.create_all(bind=engine)
print('✅ Tablas creadas exitosamente')
"
}

load_seed_data() {
    if [ "\${LOAD_SEED_DATA:-true}" = "true" ]; then
        echo "🌱 Cargando datos semilla..."
        python seed.py
    else
        echo "⏭️  Omitiendo carga de datos semilla (LOAD_SEED_DATA=false)"
    fi
}

wait_for_mysql
create_tables
load_seed_data

echo ""
echo "🎉 Inicialización completada!"
echo "🌐 Iniciando servidor Uvicorn..."
echo ""

exec "$@"
