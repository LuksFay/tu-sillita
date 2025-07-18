import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { createCoordinador, createTiempo } from '../services/api'

const DashCoordinadores = () => {
  const { coordinadores, empresas, refreshCoordinadores } = useContext(AppContext)

  // Estado para el formulario
  const [form, setForm] = useState({
    nombre: '',
    empresa_id: '',
    comision: '',
    qr_code: '',
    dia_entrada: '',
    dia_salida: ''
  })

  // Estado para búsqueda
  const [busqueda, setBusqueda] = useState('')

  // Manejar cambios en el formulario
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Calcular dia_retirada (un día antes de dia_salida)
  const getDiaRetirada = (diaSalida) => {
    const date = new Date(diaSalida)
    date.setDate(date.getDate() - 1)
    return date.toISOString().split('T')[0]
  }

  // Manejar envío del formulario
  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.nombre || !form.empresa_id || !form.comision || !form.dia_entrada || !form.dia_salida) {
      alert('Completa todos los campos')
      return
    }
    try {
      // 1. Crear tiempo
      const tiempo = await createTiempo({
        dia_entrada: form.dia_entrada,
        dia_salida: form.dia_salida,
        dia_retirada: getDiaRetirada(form.dia_salida)
      })
      // 2. Crear coordinador con el tiempo_id
      await createCoordinador({
        nombre: form.nombre,
        empresa_id: Number(form.empresa_id),
        tiempo_id: tiempo.id,
        comision: Number(form.comision),
        qr_code: form.qr_code
      })
      setForm({
        nombre: '',
        empresa_id: '',
        comision: '',
        qr_code: '',
        dia_entrada: '',
        dia_salida: ''
      })
      if (typeof refreshCoordinadores === 'function') refreshCoordinadores()
    } catch (err) {
      alert('Error al crear coordinador')
    }
  }

  // Filtrar coordinadores por nombre
  const coordinadoresFiltrados = coordinadores.filter(coor =>
    coor.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <h2>Coordinadores Activos</h2>
      <input
        type="text"
        placeholder="Buscar Coordinador"
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del Coordinador"
          value={form.nombre}
          onChange={handleChange}
        />
        <select
          name="empresa_id"
          value={form.empresa_id}
          onChange={handleChange}
        >
          <option value="">Seleccionar Empresa</option>
          {empresas && empresas.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.nombre}</option>
          ))}
        </select>
        <input
          type="date"
          name="dia_entrada"
          placeholder="Día de Entrada"
          value={form.dia_entrada}
          onChange={handleChange}
        />
        <input
          type="date"
          name="dia_salida"
          placeholder="Día de Salida"
          value={form.dia_salida}
          onChange={handleChange}
        />
        <input
          type="number"
          name="comision"
          placeholder="Comisión"
          value={form.comision}
          onChange={handleChange}
          step="0.01"
        />
        <button type="submit">Agregar Coordinador</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Empresa ID</th>
            <th>Tiempo ID</th>
            <th>Comisión</th>
            <th>QR Code</th>
            <th>QR Imagen</th>
          </tr>
        </thead>
        <tbody>
          {coordinadoresFiltrados.map(coor => (
            <tr key={coor.id}>
              <td>{coor.nombre}</td>
              <td>{coor.empresa_id}</td>
              <td>{coor.tiempo_id}</td>
              <td>{coor.comision}</td>
              <td>{coor.qr_code}</td>
              <td>
                {coor.qr_image ? (
                  <img
                    src={`${coor.qr_image}`}
                    alt={`QR de ${coor.nombre}`}
                    style={{ width: 64, height: 64 }}
                    onError={e => {
                      e.target.onerror = null
                      e.target.src = 'https://via.placeholder.com/64?text=No+QR'
                    }}
                  />
                ) : (
                  <span>Sin QR</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DashCoordinadores