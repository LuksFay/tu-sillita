import express from 'express'
import * as EscaneoController from '../controllers/escaneoController.js'

const router = express.Router()

router.get('/', EscaneoController.getAll)
router.post('/', EscaneoController.create)

export default router