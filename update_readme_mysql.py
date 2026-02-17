import re

with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    'PostgreSQL y': 'MySQL y',
    'PostgreSQL + Backend': 'MySQL + Backend',
    'PostgreSQL configurado': 'MySQL configurado',
    'PostgreSQL instalado localmente': 'MySQL instalado localmente',
    'Configurar PostgreSQL': 'Configurar MySQL',
    'PostgreSQL 15': 'MySQL 8.0',
    'Instalar PostgreSQL': 'Instalar MySQL',
    'postgresql+psycopg://taskfusion_user:taskfusion_pass@localhost:5432/taskfusion_db': 'mysql+mysqldb://taskfusion_user:taskfusion_pass@localhost:3306/taskfusion_db',
    'postgresql+psycopg://taskfusion_user:taskfusion_pass@postgres:5432/taskfusion_db': 'mysql+mysqldb://taskfusion_user:taskfusion_pass@mysql:3306/taskfusion_db',
    'https://www.postgresql.org/download/windows/': 'https://dev.mysql.com/downloads/installer/',
    'sudo apt install postgresql postgresql-contrib': 'sudo apt install mysql-server',
    'sudo systemctl start postgresql': 'sudo systemctl start mysql',
    'sudo systemctl enable postgresql': 'sudo systemctl enable mysql',
    'sudo systemctl status postgresql': 'sudo systemctl status mysql',
    'brew install postgresql@15': 'brew install mysql',
    'brew services start postgresql@15': 'brew services start mysql',
    '# Acceder a PostgreSQL': '# Acceder a MySQL',
    'Ejecutar en el prompt de PostgreSQL:': 'Ejecutar en el prompt de MySQL:',
    'postgres': 'mysql',
    'Base de datos PostgreSQL 17': 'Base de datos MySQL 8.0',
    'Espera a que PostgreSQL esté listo': 'Espera a que MySQL esté listo',
    'Se descarga imagen PostgreSQL 17': 'Se descarga imagen MySQL 8.0',
    'PostgreSQL se inicia y ejecuta': 'MySQL se inicia y ejecuta',
    'Backend espera a que PostgreSQL esté listo': 'Backend espera a que MySQL esté listo',
    'Ver logs de PostgreSQL': 'Ver logs de MySQL',
    'Acceder a PostgreSQL': 'Acceder a MySQL',
    'Puerto 5432 ya en uso (PostgreSQL local)': 'Puerto 3306 ya en uso (MySQL local)',
    'PG[(PostgreSQL)]': 'MySQL[(MySQL)]',
    'PostgreSQL[(PostgreSQL)]': 'MySQL[(MySQL)]',
    'psycopg': 'mysqlclient',
    'Script de inicialización de PostgreSQL': 'Script de inicialización de MySQL',
    'POSTGRES_USER': 'MYSQL_USER',
    'POSTGRES_PASSWORD': 'MYSQL_PASSWORD',
    'Usuario de PostgreSQL': 'Usuario de MySQL',
    'Contraseña de PostgreSQL': 'Contraseña de MySQL',
    'DATABASE_URL de conexión a PostgreSQL': 'DATABASE_URL de conexión a MySQL',
    'Problemas con PostgreSQL': 'Problemas con MySQL',
    'Buscar "PostgreSQL"': 'Buscar "MySQL"',
    'configuradas en PostgreSQL': 'configuradas en MySQL',
    'pool de conexiones PostgreSQL': 'pool de conexiones MySQL',
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("README.md actualizado a MySQL exitosamente")
