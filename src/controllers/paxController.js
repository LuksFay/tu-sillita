import db from '../models/db.js'

export const getAll = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM pax')
    res.status(200).json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await db.query('SELECT * FROM pax WHERE id = $1', [id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const create = async (req, res) => {
  const { coordinador_id, hotel_id, nombre, cantidad_sillas, qr_code, estado, fecha_creacion } = req.body
  try {
    const result = await db.query(
      `INSERT INTO pax (coordinador_id, hotel_id, nombre, cantidad_sillas, qr_code, estado, fecha_creacion)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [coordinador_id, hotel_id, nombre, cantidad_sillas, qr_code, estado, fecha_creacion]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const update = async (req, res) => {
  const { id } = req.params
  const { coordinador_id, hotel_id, nombre, cantidad_sillas, qr_code, estado, fecha_creacion } = req.body
  try {
    const result = await db.query(
      `UPDATE pax SET coordinador_id = $1, hotel_id = $2, nombre = $3,
        cantidad_sillas = $4, qr_code = $5, estado = $6, fecha_creacion = $7 WHERE id = $8 RETURNING *`,
      [coordinador_id, hotel_id, nombre, cantidad_sillas, qr_code, estado, fecha_creacion, id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const remove = async (req, res) => {
  const { id } = req.params
  try {
    const result = await db.query('DELETE FROM pax WHERE id = $1 RETURNING *', [id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' })
    res.json({ message: 'Pasajero eliminado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}