import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { engine } from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.engine('handlebars', engine({ extname: '.handlebars' }));
app.set('view engine', 'handlebars');
app.set('views', './src/views');


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

io.on('connection', socket => {
  console.log('Cliente conectado', socket.id);
});
app.set('io', io);

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/ecommerce';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(' Conectado a MongoDB');
    httpServer.listen(PORT, () => console.log(` Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => console.error(' Error al conectar a MongoDB:', err));

export { io };
