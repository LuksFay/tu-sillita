// src/pages/FormularioPax.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api' // Si querés estilos personalizados

const FormularioPax = () => {
  const { qr_code } = useParams()
  const navigate = useNavigate()
  const [coordinador, setCoordinador] = useState(null)
  const [formData, setFormData] = useState({ nombre: '', cantidad_sillas: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCoordinador = async () => {
      try {
        const res = await api.get(`/coordinador/qr/${qr_code}`)
        setCoordinador(res.data)
        setLoading(false)
      } catch (err) {
        setError('No se pudo encontrar el coordinador')
        setLoading(false)
      }
    }
    fetchCoordinador()
  }, [qr_code])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        coordinador_id: coordinador.id,
        hotel_id: 1, // ⚠️ Temporal, podrías pedir que elija uno si hay varios
        estado: 'pendiente',
        fecha_creacion: new Date().toISOString().slice(0, 10)
      }
      const res = await api.post('/pax', payload)
      alert('Formulario enviado con éxito')
      navigate('/gracias') // o algún mensaje de éxito
    } catch (err) {
      alert('Error al enviar los datos')
    }
  }

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>

  return (
    <section className="formulario-pax">
      <h2>Formulario para pasajeros</h2>
      <p>Coordinador: <strong>{coordinador.nombre}</strong></p>
      <form onSubmit={handleSubmit}>
        <label>Nombre del pasajero:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </label>

        <label>Cantidad de sillas:
          <input
            type="number"
            name="cantidad_sillas"
            value={formData.cantidad_sillas}
            min="1"
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Enviar</button>
      </form>
    </section>
  )
}

export default FormularioPax
