import axios from "axios"
import type { Coordinador, Hotel, Pasajero, CreatePasajeroRequest, CreateCoordinadorRequest } from "@/types"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Coordinadores
export const coordinadorApi = {
  getAll: () => api.get<Coordinador[]>("/coordinadores"),
  getByToken: (token: string) => api.get<Coordinador>(`/coordinadores/token/${token}`),
  create: (data: CreateCoordinadorRequest) => api.post<Coordinador>("/coordinadores", data),
  delete: (id: string) => api.delete(`/coordinadores/${id}`),
}

// Hoteles
export const hotelApi = {
  getAll: () => api.get<Hotel[]>("/hoteles"),
  create: (nombre: string) => api.post<Hotel>("/hoteles", { nombre }),
  delete: (id: string) => api.delete(`/hoteles/${id}`),
}

// Pasajeros
export const pasajeroApi = {
  getAll: (filters?: {
    hotel_id?: string
    coordinador_id?: string
    estado?: string
    fecha?: string
  }) => api.get<Pasajero[]>("/pasajeros", { params: filters }),
  getByToken: (token: string) => api.get<Pasajero>(`/pasajeros/token/${token}`),
  create: (data: CreatePasajeroRequest) => api.post<Pasajero>("/pasajeros", data),
  updateEstado: (token: string, estado: "entregado" | "devuelto") => api.patch(`/pasajeros/token/${token}`, { estado }),
}

// Auth
export const authApi = {
  login: (password: string) => api.post<{ token: string }>("/auth/login", { password }),
}
