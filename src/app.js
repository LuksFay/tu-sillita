// src/app.js
import express from 'express'
import coordinadorRoutes from './routes/coordinadorRoutes.js'

const app = express()
app.use(express.json())

app.use('/api/coordinadores', coordinadorRoutes)

export default app
