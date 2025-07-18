// src/context/AppProvider.jsx
import React, { useState, useEffect } from 'react'
import { AppContext } from './AppContext'
import { getCoordinadores, getHoteles, getPax, getEmpresas } from '../services/api'

export const AppProvider = ({ children }) => {
  const [coordinadores, setCoordinadores] = useState([])
  const [hoteles, setHoteles] = useState([])
  const [reservas, setReservas] = useState([]) // pax
  const [empresas, setEmpresas] = useState([])


  useEffect(() => {
    getCoordinadores().then(data => setCoordinadores(data))
    getHoteles().then(data => setHoteles(data))
    getPax().then(data => setReservas(data))
    getEmpresas().then(data => setEmpresas(data))
  }, [])

  return (
    <AppContext.Provider value={{ coordinadores, hoteles, reservas, empresas }}>
      {children}
    </AppContext.Provider>
  )
}
