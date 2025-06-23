// src/index.js
import app from './app.js'
import { PORT } from './models/config.js'

app.listen(PORT, () => {
  console.log(`Server tu sillita corriendo en puerto ${PORT}`)
})
