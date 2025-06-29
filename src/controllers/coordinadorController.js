import db from '../models/db.js'
import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'
export const getAll = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM coordinador')
    res.status(200).json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getById = async (req, res) => {
  const { id } = req.params
  try {
    const result = await db.query('SELECT * FROM coordinador WHERE id = $1', [id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const create = async (req, res) => {
  const { nombre, empresa_id, tiempo_id, comision } = req.body
  const qr_code = uuidv4()
  try {
    const qrDataURL = await QRCode.toDataURL(qr_code) // ← genera el PNG en base64
    const result = await db.query(
      'INSERT INTO coordinador (nombre, empresa_id, tiempo_id, comision, qr_code, qr_image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, empresa_id, tiempo_id, comision, qr_code, qrDataURL] // ← usa qrDataURL acá
    )
    res.status(201).json(result.rows[0]) // ← ya incluye qr_image
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const update = async (req, res) => {
  const { id } = req.params
  const { nombre, empresa_id, tiempo_id, comision, qr_code } = req.body
  try {
    const result = await db.query(
      `UPDATE coordinador SET nombre = $1, empresa_id = $2, tiempo_id = $3,
        comision = $4, qr_code = $5 WHERE id = $6 RETURNING *`,
      [nombre, empresa_id, tiempo_id, comision, qr_code, id]
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
    const result = await db.query('DELETE FROM coordinador WHERE id = $1 RETURNING *', [id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' })
    res.json({ message: 'Coordinador eliminado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

//getByQrCode(req, res) buscar coordinador por su código QR.
// Buscar un coordinador por su QR
export const getByQrCode = async (req, res) => {
  const { qr_code } = req.params
  try {
    const result = await db.query('SELECT * FROM coordinador WHERE qr_code = $1', [qr_code])
    if (result.rows.length === 0) return res.status(404).json({ error: 'QR no encontrado' })
    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
