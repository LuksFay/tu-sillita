import axios from "axios"
import type {
  Coordinador,
  Pax,
  Hotel,
  Empresa,
  Tiempo,
  Escaneo,
  CreateCoordinadorRequest,
  CreatePaxRequest,
  CreateHotelRequest,
  CreateEscaneoRequest,
} from "@/types"

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos timeout
})

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message)

    // Mensajes de error más amigables
    if (error.code === "ECONNREFUSED") {
      throw new Error("No se puede conectar al servidor. ¿Está corriendo en localhost:4000?")
    }

    if (error.response?.status === 404) {
      throw new Error("Endpoint no encontrado")
    }

    if (error.response?.status >= 500) {
      throw new Error("Error del servidor")
    }

    return Promise.reject(error)
  },
)

// 🔥 COORDINADORES
export const coordinadorApi = {
  getAll: () => api.get<Coordinador[]>("/coordinadores"),
  create: (data: CreateCoordinadorRequest) => api.post<Coordinador>("/coordinadores", data),
  update: (id: string, data: Partial<CreateCoordinadorRequest>) => api.put<Coordinador>(`/coordinadores/${id}`, data),
  delete: (id: string) => api.delete(`/coordinadores/${id}`),
}

// 🔥 PAX (PASAJEROS)
export const paxApi = {
  getAll: () => api.get<Pax[]>("/pax"),
  create: (data: CreatePaxRequest) => api.post<Pax>("/pax", data),
  getByQR: (qr_code: string) => api.get<Pax>(`/pax/qr/${qr_code}`),
  updateEstado: (id: string, estado: "pendiente" | "entregado" | "devuelto") => api.put(`/pax/${id}`, { estado }),
}

// 🔥 HOTELES
export const hotelApi = {
  getAll: () => api.get<Hotel[]>("/hotel"),
  create: (data: CreateHotelRequest) => api.post<Hotel>("/hotel", data),
}

// 🔥 EMPRESAS
export const empresaApi = {
  getAll: () => api.get<Empresa[]>("/empresa"),
  create: (nombre: string) => api.post<Empresa>("/empresa", { nombre }),
}

// 🔥 TIEMPOS
export const tiempoApi = {
  getAll: () => api.get<Tiempo[]>("/tiempo"),
  create: (data: { nombre: string; descripcion?: string }) => api.post<Tiempo>("/tiempo", data),
}

// 🔥 ESCANEOS
export const escaneoApi = {
  getAll: () => api.get<Escaneo[]>("/escaneo"),
  create: (data: CreateEscaneoRequest) => api.post<Escaneo>("/escaneo", data),
}

// Test de conexión
export const testConnection = async () => {
  try {
    const response = await api.get("/coordinadores")
    return { success: true, message: "Conexión exitosa" }
  } catch (error) {
    return { success: false, message: error.message }
  }
}
