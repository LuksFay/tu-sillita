// src/services/api.js
import axios from 'axios'

// Instancia de Axios
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ENDPOINTS base
export const endpoints = {
  coordinador: '/coordinadores', // Cambiado a plural
  hotel: '/hotel',
  pax: '/pax',
  empresa: '/empresa',
  tiempo: '/tiempo',
  escaneo: '/escaneo',

  // dinámicos
  getPaxByQR: (qr) => `/pax/qr/${qr}`,
  getCoordinadorByQR: (qr) => `/coordinadores/qr/${qr}`, // Cambiado a plural
  getPaxById: (id) => `/pax/${id}`,
  getCoordinadorById: (id) => `/coordinadores/${id}`, // Cambiado a plural
}

// -------- COORDINADORES --------
export const getCoordinadores = async () => {
  const res = await api.get(endpoints.coordinador)
  return res.data
}

export const getCoordinadorById = async (id) => {
  const res = await api.get(endpoints.getCoordinadorById(id))
  return res.data
}

export const getCoordinadorByQR = async (qr) => {
  const res = await api.get(endpoints.getCoordinadorByQR(qr))
  return res.data
}

export const createCoordinador = async (data) => {
  const res = await api.post(endpoints.coordinador, data)
  return res.data
}

export const updateCoordinador = async (id, data) => {
  const res = await api.put(endpoints.getCoordinadorById(id), data)
  return res.data
}

export const deleteCoordinador = async (id) => {
  const res = await api.delete(endpoints.getCoordinadorById(id))
  return res.data
}

// -------- PAX (reservas) --------
export const getPax = async () => {
  const res = await api.get(endpoints.pax)
  return res.data
}

export const getPaxById = async (id) => {
  const res = await api.get(endpoints.getPaxById(id))
  return res.data
}

export const getPaxByQR = async (qr) => {
  const res = await api.get(endpoints.getPaxByQR(qr))
  return res.data
}

export const createPax = async (data) => {
  const res = await api.post(endpoints.pax, data)
  return res.data
}

export const updatePax = async (id, data) => {
  const res = await api.put(endpoints.getPaxById(id), data)
  return res.data
}

export const deletePax = async (id) => {
  const res = await api.delete(endpoints.getPaxById(id))
  return res.data
}

// -------- HOTELES --------
export const getHoteles = async () => {
  const res = await api.get(endpoints.hotel)
  return res.data
}

export const createHotel = async (data) => {
  const res = await api.post(endpoints.hotel, data)
  return res.data
}

// -------- ESCANEOS, EMPRESAS, TIEMPO --------
// Podés replicar esta lógica para escaneos, empresas y tiempos
//TIEMPO  
export const createTiempo = async (data) => {
  const res = await api.post(endpoints.tiempo, data)
  return res.data
}
//EMPRESA
export const getEmpresas = async () => {
  const res = await api.get(endpoints.empresa)
  return res.data
}

export default api