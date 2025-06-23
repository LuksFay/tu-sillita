import db from '../models/db.js'

export const getAll = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tiempo')
    res.status(200).json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const create = async (req, res) => {
  const { dia_entrada, dia_salida, dia_retirada } = req.body
  try {
    const result = await db.query(
      'INSERT INTO tiempo (dia_entrada, dia_salida, dia_retirada) VALUES ($1, $2, $3) RETURNING *',
      [dia_entrada, dia_salida, dia_retirada]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}