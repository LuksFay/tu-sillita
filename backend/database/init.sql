-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS tu_sillita;

-- Usar la base de datos
\c tu_sillita;

-- Crear extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Las tablas se crearán automáticamente por TypeORM
-- Pero aquí tienes los scripts por si los necesitas manualmente:

-- Tabla coordinadores
CREATE TABLE IF NOT EXISTS coordinadores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    empresa VARCHAR(255) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    token_qr UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla hoteles
CREATE TABLE IF NOT EXISTS hoteles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) UNIQUE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla pasajeros
CREATE TABLE IF NOT EXISTS pasajeros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255),
    hotel_id UUID NOT NULL REFERENCES hoteles(id),
    cantidad_sillas INTEGER NOT NULL CHECK (cantidad_sillas > 0),
    qr_token UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    coordinador_id UUID NOT NULL REFERENCES coordinadores(id),
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'entregado', 'devuelto')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega TIMESTAMP,
    fecha_devolucion TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_coordinadores_token ON coordinadores(token_qr);
CREATE INDEX IF NOT EXISTS idx_coordinadores_activo ON coordinadores(activo);
CREATE INDEX IF NOT EXISTS idx_pasajeros_token ON pasajeros(qr_token);
CREATE INDEX IF NOT EXISTS idx_pasajeros_estado ON pasajeros(estado);
CREATE INDEX IF NOT EXISTS idx_pasajeros_hotel ON pasajeros(hotel_id);
CREATE INDEX IF NOT EXISTS idx_pasajeros_coordinador ON pasajeros(coordinador_id);

-- Datos de ejemplo (opcional)
INSERT INTO hoteles (nombre) VALUES 
    ('Hotel Marriott'),
    ('Hotel Hilton'),
    ('Hotel Sheraton'),
    ('Hotel Radisson'),
    ('Hotel Holiday Inn')
ON CONFLICT (nombre) DO NOTHING;

-- Coordinador de ejemplo
INSERT INTO coordinadores (nombre, empresa, fecha_inicio, fecha_fin) VALUES 
    ('Juan Pérez', 'Eventos SA', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days')
ON CONFLICT DO NOTHING;
