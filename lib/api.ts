import axios from "axios"
import type {
  Coordinador,
  Pax,
  Hotel,
  Empresa,
  Tiempo,
  Escaneo,
  Precios,
  CreateCoordinadorRequest,
  CreatePaxRequest,
  CreateHotelRequest,
  CreateEmpresaRequest,
  CreateTiempoRequest,
  CreateEscaneoRequest,
} from "@/types"

const api = axios.create({
  baseURL: "https://tusillitaapi.arcadeestudio.com.br/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 segundos timeout para conexión remota
})

// Interceptor para agregar "/" al final de las URLs si no lo tienen
api.interceptors.request.use((config) => {
  if (config.url && !config.url.endsWith("/") && !config.url.includes("?")) {
    config.url += "/"
  }
  return config
})

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message)

    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      throw new Error("No se puede conectar al servidor. Verifica tu conexión a internet.")
    }

    if (error.response?.status === 404) {
      throw new Error("Endpoint no encontrado")
    }

    if (error.response?.status >= 500) {
      throw new Error("Error del servidor")
    }

    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Datos inválidos")
    }

    return Promise.reject(error)
  },
)

// 🔥 COORDINADORES
export const coordinadorApi = {
  getAll: () => api.get<Coordinador[]>("/coordinadores"),
  create: (data: CreateCoordinadorRequest) => api.post<Coordinador>("/coordinadores", data),
  update: (id: number, data: Partial<CreateCoordinadorRequest>) => api.put<Coordinador>(`/coordinadores/${id}`, data),
  delete: (id: number) => api.delete(`/coordinadores/${id}`),
}

// 🔥 PAX (PASAJEROS)
export const paxApi = {
  getAll: () => api.get<Pax[]>("/pax"),
  create: (data: CreatePaxRequest) => api.post<Pax>("/pax", data),
  update: (id: number, data: Partial<CreatePaxRequest>) => api.put<Pax>(`/pax/${id}`, data),
  delete: (id: number) => api.delete(`/pax/${id}`),
  // Método para buscar por QR (si tu API lo soporta)
  getByQR: (qr_code: string) => api.get<Pax>(`/pax/qr/${qr_code}`),
}

// 🔥 HOTELES
export const hotelApi = {
  getAll: () => api.get<Hotel[]>("/hotel"),
  create: (data: CreateHotelRequest) => api.post<Hotel>("/hotel", data),
}

// 🔥 EMPRESAS
export const empresaApi = {
  getAll: () => api.get<Empresa[]>("/empresa"),
  create: (data: CreateEmpresaRequest) => api.post<Empresa>("/empresa", data),
}

// 🔥 TIEMPOS
export const tiempoApi = {
  getAll: () => api.get<Tiempo[]>("/tiempo"),
  create: (data: CreateTiempoRequest) => api.post<Tiempo>("/tiempo", data),
}

// 🔥 ESCANEOS
export const escaneoApi = {
  getAll: () => api.get<Escaneo[]>("/escaneo"),
  create: (data: CreateEscaneoRequest) => api.post<Escaneo>("/escaneo", data),
}

// 🔥 PRECIOS (nueva tabla que detecté)
export const preciosApi = {
  getAll: () => api.get<Precios[]>("/precios"),
  create: (data: Omit<Precios, "id">) => api.post<Precios>("/precios", data),
}

// Test de conexión
export const testConnection = async () => {
  try {
    const response = await api.get("/empresa")
    return {
      success: true,
      message: "Conexión exitosa",
      data: response.data,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error de conexión",
    }
  }
}

// Utilidad para generar QR codes únicos
export const generateQRCode = (type: "coordinador" | "pax", id?: number) => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${type.toUpperCase()}${id || ""}${timestamp}${random}`.toUpperCase()
}
