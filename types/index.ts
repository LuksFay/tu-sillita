export interface Coordinador {
  id: string
  nombre: string
  empresa: string
  fecha_inicio: string
  fecha_fin: string
  token_qr: string
  activo: boolean
}

export interface Hotel {
  id: string
  nombre: string
}

export interface Pasajero {
  id: string
  nombre?: string
  hotel_id: string
  hotel?: Hotel
  cantidad_sillas: number
  qr_token: string
  coordinador_id: string
  coordinador?: Coordinador
  estado: "pendiente" | "entregado" | "devuelto"
  fecha_creacion: string
  fecha_entrega?: string
  fecha_devolucion?: string
}

export interface CreatePasajeroRequest {
  nombre?: string
  hotel_id: string
  cantidad_sillas: number
  coordinador_token: string
}

export interface CreateCoordinadorRequest {
  nombre: string
  empresa: string
  fecha_inicio: string
  fecha_fin: string
}
