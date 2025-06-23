// Tipos actualizados para tu backend real
export interface Coordinador {
  id: string
  nombre: string
  empresa_id: string
  tiempo_id: string
  comision: number
  qr_code: string
  // Relaciones populadas
  empresa?: Empresa
  tiempo?: Tiempo
}

export interface Pax {
  id: string
  nombre: string
  hotel_id: string
  coordinador_id: string
  cantidad_sillas: number
  estado: "pendiente" | "entregado" | "devuelto"
  qr_code: string
  fecha_creacion: string
  // Relaciones populadas
  hotel?: Hotel
  coordinador?: Coordinador
}

export interface Hotel {
  id: string
  nombre: string
  gps?: string
}

export interface Empresa {
  id: string
  nombre: string
}

export interface Tiempo {
  id: string
  nombre: string
  // Asumo que puede tener descripción o fechas
  descripcion?: string
}

export interface Escaneo {
  id: string
  pax_id: string
  fecha: string
  tipo: "entrega" | "devolucion"
  // Relación populada
  pax?: Pax
}

// DTOs para crear
export interface CreateCoordinadorRequest {
  nombre: string
  empresa_id: string
  tiempo_id: string
  comision: number
}

export interface CreatePaxRequest {
  nombre: string
  hotel_id: string
  coordinador_id: string
  cantidad_sillas: number
}

export interface CreateHotelRequest {
  nombre: string
  gps?: string
}

export interface CreateEscaneoRequest {
  pax_id: string
  tipo: "entrega" | "devolucion"
}
