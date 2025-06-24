// src/index.js
import app from './app.js'
import { PORT } from './models/config.js'


app.listen(PORT, () => {
  console.log(`Servidor de TuSillita corriendo en puerto ${PORT}`)
})