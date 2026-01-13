// src/routes/products.router.js
import { Router } from 'express';
import { getProducts } from '../controllers/products.controller.js';

const router = Router();

router.get('/', getProducts);

export default router;