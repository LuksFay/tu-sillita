import express from 'express'
import * as CoordinadorController from '../controllers/coordinadorController.js'

const router = express.Router()

router.get('/', CoordinadorController.getAll)

export default router
