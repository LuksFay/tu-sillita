# Tu Sillita - Sistema de Alquiler de Sillas

Sistema completo para gestión de alquiler de sillas con frontend en Next.js y backend en NestJS.

## 🚀 Instalación y Configuración

### 1. Frontend (Next.js)

\`\`\`bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
\`\`\`

### 2. Backend (NestJS)

\`\`\`bash
# Ir a la carpeta del backend
cd backend

# Instalar dependencias
npm install

# Configurar base de datos PostgreSQL
# Crear base de datos 'tu_sillita' en PostgreSQL

# Configurar variables de entorno
cp .env.example .env

# Ejecutar en desarrollo
npm run start:dev
\`\`\`

### 3. Base de Datos PostgreSQL

\`\`\`sql
-- Crear la base de datos
CREATE DATABASE tu_sillita;

-- El backend creará las tablas automáticamente
\`\`\`

## 📱 Funcionalidades

### Para Administradores:
- ✅ Crear coordinadores con QR automático
- ✅ Gestionar hoteles
- ✅ Ver todas las reservas con filtros
- ✅ Escanear QR para entrega/devolución
- ✅ Reportes y estadísticas

### Para Pasajeros:
- ✅ Escanear QR del coordinador
- ✅ Crear reserva con datos del hotel
- ✅ Recibir QR personal para retirar sillas

## 🔧 Configuración

### Variables de Entorno Frontend (.env.local)
\`\`\`
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
\`\`\`

### Variables de Entorno Backend (.env)
\`\`\`
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=tu_sillita
PORT=3001
\`\`\`

## 🌐 Rutas de la API

### Coordinadores
- `GET /api/coordinadores` - Listar coordinadores
- `POST /api/coordinadores` - Crear coordinador
- `GET /api/coordinadores/token/:token` - Buscar por token
- `DELETE /api/coordinadores/:id` - Eliminar coordinador

### Hoteles
- `GET /api/hoteles` - Listar hoteles
- `POST /api/hoteles` - Crear hotel
- `DELETE /api/hoteles/:id` - Eliminar hotel

### Pasajeros
- `GET /api/pasajeros` - Listar pasajeros (con filtros)
- `POST /api/pasajeros` - Crear reserva
- `GET /api/pasajeros/token/:token` - Buscar por token
- `PATCH /api/pasajeros/token/:token` - Actualizar estado

### Autenticación
- `POST /api/auth/login` - Login admin (password: admin123)

## 📱 Uso de la Aplicación

1. **Admin crea coordinador** → Se genera QR único
2. **Pasajero escanea QR** → Accede al formulario
3. **Pasajero completa reserva** → Recibe su QR personal
4. **Admin escanea QR del pasajero** → Marca como entregado
5. **Al final, admin escanea nuevamente** → Marca como devuelto

## 🔐 Credenciales

- **Password Admin**: `admin123`

## 📦 Tecnologías

### Frontend:
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- Axios
- QRCode.react

### Backend:
- NestJS
- TypeORM
- PostgreSQL
- Class Validator
- UUID

## 🚀 Despliegue

### Frontend (Vercel):
\`\`\`bash
npm run build
# Subir a Vercel
\`\`\`

### Backend (Railway/Heroku):
\`\`\`bash
cd backend
npm run build
# Configurar variables de entorno en la plataforma
\`\`\`

## 📞 Soporte

Para problemas o consultas, contacta al desarrollador.
