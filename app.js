// app.js
import express from 'express';
import { connectDB } from './src/config/database.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';
import viewsRouter from './src/routes/views.router.js';

// Inicializar Express
const app = express();

// Conectar a MongoDB
connectDB();

// Configurar __dirname para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Motor de plantillas Handlebars con helper personalizado
import { engine } from 'express-handlebars';

const hbs = engine({
  helpers: {
    eq: (a, b) => a === b
  }
});

app.engine('handlebars', hbs);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter); // Maneja /products, /products/:pid, /carts/:cid

// Iniciar servidor
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});