import express from 'express'
import * as CoordinadorController from '../controllers/coordinadorController.js'

const router = express.Router()

router.get('/', CoordinadorController.getAll)
router.get('/:id', CoordinadorController.getById)
router.post('/', CoordinadorController.create)
router.put('/:id', CoordinadorController.update)
router.delete('/:id', CoordinadorController.remove)

export default router