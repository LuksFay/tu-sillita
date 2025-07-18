// src/components/DashReservas.jsx
import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const DashReservas = () => {
  const { reservas } = useContext(AppContext)

  return (
    <div>
      <h2>Reservas</h2>
      <ul>
        {reservas.map(r => (
          <li key={r.id}>{r.nombre}</li>
        ))}
      </ul>
    </div>
  )
}

export default DashReservas