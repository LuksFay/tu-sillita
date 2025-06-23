import db from '../models/db.js'

export const getAll = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM empresa')
    res.status(200).json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const create = async (req, res) => {
  const { nombre, comision } = req.body
  try {
    const result = await db.query(
      'INSERT INTO empresa (nombre, comision) VALUES ($1, $2) RETURNING *',
      [nombre, comision]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}