export const ENDPOINTS = {
  getPaxByQR: (qr) => `/pax/qr/${qr}`, // recuerda que ya lo hicimos en el backend
}


const BASE_URL = 'http://localhost:4000/api'

export const endpoints = {
  coordinador: `${BASE_URL}/coordinador`,
  hotel: `${BASE_URL}/hotel`,
  pax: `${BASE_URL}/pax`,
  empresa: `${BASE_URL}/empresa`,
  tiempo: `${BASE_URL}/tiempo`,
  escaneo: `${BASE_URL}/escaneo`
}