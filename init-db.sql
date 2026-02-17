-- Script de inicialización de MySQL para TaskFusion
-- Este script se ejecuta automáticamente al crear el contenedor de MySQL

-- Usar la base de datos
USE taskfusion_db;

-- Otorgar todos los privilegios al usuario en la base de datos
GRANT ALL PRIVILEGES ON taskfusion_db.* TO 'taskfusion_user'@'%';

-- Aplicar los cambios
FLUSH PRIVILEGES;

-- Mensaje de confirmación (MySQL no tiene \echo, pero se puede registrar)
-- Base de datos TaskFusion inicializada correctamente
