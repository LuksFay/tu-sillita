import db from '../models/db.js'

export const getAll = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM coordinador')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
