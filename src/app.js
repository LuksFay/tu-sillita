import express from 'express';
import cors from 'cors';
import coordinadorRoutes from './routes/coordinadorRoutes.js';
import paxRoutes from './routes/paxRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import empresaRoutes from './routes/empresaRoutes.js';
import tiempoRoutes from './routes/tiempoRoutes.js';
import escaneoRoutes from './routes/escaneoRoutes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true               
}));


app.use(express.json());


app.use('/api/coordinadores', coordinadorRoutes);
app.use('/api/pax', paxRoutes);
app.use('/api/hotel', hotelRoutes);
app.use('/api/empresa', empresaRoutes);
app.use('/api/tiempo', tiempoRoutes);
app.use('/api/escaneo', escaneoRoutes);

export default app;
