import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('🟢 Conectado a MongoDB');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => console.error('🔴 Error al conectar a MongoDB:', err));
