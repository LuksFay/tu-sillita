import db from '../models/db.js'

export const getAll = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM escaneo')
    res.status(200).json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const create = async (req, res) => {
  const { pax_id, fecha, tipo } = req.body
  try {
    const result = await db.query(
      'INSERT INTO escaneo (pax_id, fecha, tipo) VALUES ($1, $2, $3) RETURNING *',
      [pax_id, fecha, tipo]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}