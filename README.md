# 🪑 Tu Sillita — Backend API

Este proyecto es una API REST creada en **Node.js + Express** con base de datos **PostgreSQL** para gestionar reservas de sillas a través de coordinadores. Está diseñada para ser consumida por una app web mobile-friendly desarrollada en React (Vite).

---

## 🚀 Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- Dotenv
- Vite (para el frontend)
- Postman (para pruebas)

---

## 📦 Instalación

1. Cloná el repositorio.
2. Asegurate de tener PostgreSQL instalado y corriendo.
3. Ejecutá el archivo SQL `modelo_tusillita.sql` para crear las tablas.
4. Cargá el archivo `.env` en la raíz con el siguiente contenido:

```env
PORT=4000
DB_USER=tu_usuario_postgres
DB_HOST=localhost
DB_NAME=tusillita
DB_PASSWORD=tu_contraseña
DB_PORT=5432


Instalá las dependencias:

```bash
npm install
```
Iniciá el servidor:

```bash
npm run dev
```


Estructura del proyecto
```txt
tusillita/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── index.js
├── modelo_tusillita.sql
├── .env
└── README.md
```


Todos los endpoints están bajo la ruta base:
http://localhost:4000/api


🏢 Empresa
Método	Ruta	Acción
GET	/empresa	Obtener todas
POST	/empresa	Crear nueva

Body:

json
Copiar
Editar
{
  "nombre": "Turismo Litoral",
  "comision": 12.5
}
🕒 Tiempo
Método	Ruta	Acción
GET	/tiempo	Obtener todos
POST	/tiempo	Crear nuevo

Body:

json
Copiar
Editar
{
  "dia_entrada": "2025-12-10",
  "dia_salida": "2025-12-15",
  "dia_retirada": "2025-12-16"
}
🏨 Hotel
Método	Ruta	Acción
GET	/hotel	Obtener todos
POST	/hotel	Crear nuevo

Body:

json
Copiar
Editar
{
  "nombre": "Hotel del Mar",
  "gps": "-32.9468,-60.6393"
}
🧑‍💼 Coordinador
Método	Ruta	Acción
GET	/coordinadores	Obtener todos
POST	/coordinadores	Crear nuevo

Body:

json
Copiar
Editar
{
  "nombre": "Luciano G.",
  "empresa_id": 1,
  "tiempo_id": 1,
  "comision": 10.0,
  "qr_code": "QR123456COORD"
}
🧍 Pasajero (Pax)
Método	Ruta	Acción
GET	/pax	Obtener todos
POST	/pax	Crear nuevo

Body:

json
Copiar
Editar
{
  "coordinador_id": 1,
  "hotel_id": 1,
  "nombre": "Ramiro López",
  "cantidad_sillas": 3,
  "qr_code": "QR789456PAX",
  "estado": "pendiente",
  "fecha_creacion": "2025-12-10"
}
📷 Escaneo
Método	Ruta	Acción
GET	/escaneo	Obtener registros
POST	/escaneo	Registrar escaneo

Body:

json
Copiar
Editar
{
  "pax_id": 1,
  "fecha": "2025-12-10T10:30:00",
  "tipo": "entregado"
}


GET     /api/coordinadores
POST    /api/coordinadores
PUT     /api/coordinadores/:id
DELETE  /api/coordinadores/:id

GET     /api/pax
POST    /api/pax
PUT     /api/pax/:id
DELETE  /api/pax/:id

GET     /api/hotel
POST    /api/hotel

GET     /api/empresa
POST    /api/empresa

GET     /api/tiempo
POST    /api/tiempo

GET     /api/escaneo
POST    /api/escaneo

