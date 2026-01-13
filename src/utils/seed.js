// src/utils/seed.js
import { fileURLToPath } from 'url';
import { connectDB } from '../config/database.js';
import { ProductModel } from '../models/product.model.js';
import { CartModel } from '../models/cart.model.js';

const seedProducts = [
  {
    title: "Suculenta Echeveria",
    description: "Planta suculenta decorativa ideal para interiores. Fácil de cuidar.",
    price: 4500,
    thumbnail: "",
    code: "SUC001",
    stock: 25,
    category: "plantas",
    status: true
  },
  {
    title: "Macetero Cerámico Blanco",
    description: "Macetero de cerámica con drenaje, perfecto para suculentas.",
    price: 6500,
    thumbnail: "",
    code: "MAC001",
    stock: 15,
    category: "maceteros",
    status: true
  },
  {
    title: "Kit Semillas de Suculentas",
    description: "Incluye 5 variedades de semillas + guía de cultivo.",
    price: 3200,
    thumbnail: "",
    code: "SEM001",
    stock: 40,
    category: "semillas",
    status: true
  },
  {
    title: "Suculenta Haworthia",
    description: "Variedad resistente con patrón en espiral. Ideal para escritorios.",
    price: 5000,
    thumbnail: "",
    code: "SUC002",
    stock: 18,
    category: "plantas",
    status: true
  },
  {
    title: "Macetero de Madera Reciclada",
    description: "Diseño rústico y ecológico. Incluye bandeja interior.",
    price: 8900,
    thumbnail: "",
    code: "MAC002",
    stock: 8,
    category: "maceteros",
    status: true
  },
  {
    title: "Tierra Especial para Suculentas",
    description: "Mezcla drenante con perlita y turba. Bolsa de 2L.",
    price: 2800,
    thumbnail: "",
    code: "ACC001",
    stock: 50,
    category: "accesorios",
    status: true
  },
  {
    title: "Regadera Mini de Latón",
    description: "Regadera fina para riego preciso. Capacidad 250ml.",
    price: 7500,
    thumbnail: "",
    code: "ACC002",
    stock: 12,
    category: "accesorios",
    status: true
  },
  {
    title: "Semillas de Crassula Ovata",
    description: "Árbol de jade, símbolo de prosperidad. Paquete de 20 semillas.",
    price: 2500,
    thumbnail: "",
    code: "SEM002",
    stock: 0,
    category: "semillas",
    status: false
  },
  {
    title: "Suculenta Sedum Morganianum",
    description: "Conocida como 'cola de burro'. Ideal en colgantes.",
    price: 6200,
    thumbnail: "",
    code: "SUC003",
    stock: 10,
    category: "plantas",
    status: true
  },
  {
    title: "Set de 3 Maceteros Pequeños",
    description: "Juego de maceteros en tonos tierra. Altura 8cm.",
    price: 9500,
    thumbnail: "",
    code: "MAC003",
    stock: 6,
    category: "maceteros",
    status: true
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    await ProductModel.deleteMany({});
    await CartModel.deleteMany({});
    const products = await ProductModel.insertMany(seedProducts);
    const cart = new CartModel({
      products: [
        { product: products[0]._id, quantity: 1 },
        { product: products[1]._id, quantity: 1 }
      ]
    });
    await cart.save();
    console.log(`✅ Base de datos poblada con ${products.length} productos de suculentas`);
    console.log(`🛒 Carrito de prueba ID: ${cart._id}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase();
}