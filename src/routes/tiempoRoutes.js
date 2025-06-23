import express from 'express'
import * as TiempoController from '../controllers/tiempoController.js'

const router = express.Router()

router.get('/', TiempoController.getAll)
router.post('/', TiempoController.create)

export default router
