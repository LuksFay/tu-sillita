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
})

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

// 🔥 COORDINADORES
export const coordinadorApi = {
  getAll: () => api.get<Coordinador[]>("/coordinadores"),
  create: (data: CreateCoordinadorRequest) => api.post<Coordinador>("/coordinadores", data),
  update: (id: string, data: Partial<CreateCoordinadorRequest>) => api.put<Coordinador>(`/coordinadores/${id}`, data),
  delete: (id: string) => api.delete(`/coordinadores/${id}`),

  // ⚠️ INCOMPATIBILIDAD: Este endpoint no existe en tu backend
  // getByQR: (qr_code: string) => api.get<Coordinador>(`/coordinadores/qr/${qr_code}`),
}

// 🔥 PAX (PASAJEROS)
export const paxApi = {
  getAll: () => api.get<Pax[]>("/pax"),
  create: (data: CreatePaxRequest) => api.post<Pax>("/pax", data),
  getByQR: (qr_code: string) => api.get<Pax>(`/pax/qr/${qr_code}`), // ⚠️ Asumo que existe
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

// ⚠️ AUTENTICACIÓN - No veo endpoints en tu backend
export const authApi = {
  // login: (credentials) => api.post("/auth/login", credentials),
  // Usando autenticación simple por ahora
  login: (password: string) => {
    return Promise.resolve({
      success: password === "admin123",
      token: password === "admin123" ? "mock-token" : null,
    })
  },
}
