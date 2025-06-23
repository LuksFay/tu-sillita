import express from 'express'
import * as EmpresaController from '../controllers/empresaController.js'

const router = express.Router()

router.get('/', EmpresaController.getAll)
router.post('/', EmpresaController.create)

export default router