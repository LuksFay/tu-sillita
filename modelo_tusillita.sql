
-- Base de datos: tusillita

-- Tabla: empresa
CREATE TABLE empresa (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR,
    comision FLOAT
);

-- Tabla: tiempo
CREATE TABLE tiempo (
    id SERIAL PRIMARY KEY,
    dia_entrada DATE,
    dia_salida DATE,
    dia_retirada DATE
);

-- Tabla: precios
CREATE TABLE precios (
    id SERIAL PRIMARY KEY,
    valor7 FLOAT,
    valor10 FLOAT,
    valor5 FLOAT,
    comision FLOAT
);

-- Tabla: hotel
CREATE TABLE hotel (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR,
    gps VARCHAR
);

-- Tabla: coordinador
CREATE TABLE coordinador (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR,
    empresa_id INT REFERENCES empresa(id),
    tiempo_id INT REFERENCES tiempo(id),
    comision FLOAT,
    qr_code VARCHAR
);

-- Tabla: pax (pasajeros)
CREATE TABLE pax (
    id SERIAL PRIMARY KEY,
    coordinador_id INT REFERENCES coordinador(id),
    hotel_id INT REFERENCES hotel(id),
    nombre VARCHAR,
    cantidad_sillas INT,
    qr_code VARCHAR,
    estado VARCHAR,
    fecha_creacion DATE
);

-- Tabla opcional: escaneo (para registrar cambios de estado del QR)
CREATE TABLE escaneo (
    id SERIAL PRIMARY KEY,
    pax_id INT REFERENCES pax(id),
    fecha TIMESTAMP,
    tipo VARCHAR
);
