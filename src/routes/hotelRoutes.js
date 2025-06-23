import express from 'express'
import * as HotelController from '../controllers/hotelController.js'

const router = express.Router()

router.get('/', HotelController.getAll)
router.post('/', HotelController.create)

export default router