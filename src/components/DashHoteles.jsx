// src/components/DashHoteles.jsx
import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const DashHoteles = () => {
  const { hoteles } = useContext(AppContext)

  return (
    <div>
      <h2>Hoteles Registrados</h2>
      <button>Agregar Hotel</button>
      <ul>
        {hoteles.map(hotel => (
          <li key={hotel.id}>{hotel.nombre}</li>
        ))}
      </ul>
    </div>
  )
}

export default DashHoteles
