// Tipos actualizados para tu API real
export interface Coordinador {
  id: number
  nombre: string
  empresa_id: number
  tiempo_id: number
  comision: number
  qr_code: string
  qr_image?: string
  // Relaciones populadas (si tu API las incluye)
  empresa?: Empresa
  tiempo?: Tiempo
}

export interface Pax {
  id: number
  coordinador_id: number
  hotel_id: number
  nombre: string
  cantidad_sillas: number
  qr_code: string
  estado: "pendiente" | "entregado" | "devuelto"
  fecha_creacion: string
  // Relaciones populadas
  hotel?: Hotel
  coordinador?: Coordinador
}

export interface Hotel {
  id: number
  nombre: string
  gps?: string
}

export interface Empresa {
  id: number
  nombre: string
  comision: number
}

export interface Tiempo {
  id: number
  dia_entrada: string
  dia_salida: string
  dia_retirada: string
}

export interface Escaneo {
  id: number
  pax_id: number
  fecha: string
  tipo: "entregado" | "devuelto"
  // Relación populada
  pax?: Pax
}

export interface Precios {
  id: number
  valor5: number
  valor7: number
  valor10: number
  comision: number
}

// DTOs para crear (sin ID)
export interface CreateCoordinadorRequest {
  nombre: string
  empresa_id: number
  tiempo_id: number
  comision: number
  qr_code: string
}

export interface CreatePaxRequest {
  coordinador_id: number
  hotel_id: number
  nombre: string
  cantidad_sillas: number
  qr_code: string
  estado: "pendiente" | "entregado" | "devuelto"
  fecha_creacion: string
}

export interface CreateHotelRequest {
  nombre: string
  gps?: string
}

export interface CreateEmpresaRequest {
  nombre: string
  comision: number
}

export interface CreateTiempoRequest {
  dia_entrada: string
  dia_salida: string
  dia_retirada: string
}

export interface CreateEscaneoRequest {
  pax_id: number
  fecha: string
  tipo: "entregado" | "devuelto"
}
