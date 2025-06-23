import express from 'express'
import * as PaxController from '../controllers/paxController.js'

const router = express.Router()

router.get('/', PaxController.getAll)
router.get('/:id', PaxController.getById)
router.post('/', PaxController.create)
router.put('/:id', PaxController.update)
router.delete('/:id', PaxController.remove)

export default router