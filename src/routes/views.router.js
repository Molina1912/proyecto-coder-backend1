import { Router } from 'express';
import { ProductModel } from '../models/product.model.js';

import { CartModel } from '../models/cart.model.js';

const router = Router();



router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = {};
    if (query) {
      if (query === 'true' || query === 'false') {
        filter.status = query === 'true';
      } else {
        filter.category = { $regex: query, $options: 'i' };
      }
    }
    const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
    
    const result = await ProductModel.paginate(filter, {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOption,
      lean: true
    });

 
    const buildUrl = (p) => {
      const url = new URL('http://localhost:8080/products');
      url.searchParams.set('limit', limit);
      url.searchParams.set('page', p);
      if (sort) url.searchParams.set('sort', sort);
      if (query) url.searchParams.set('query', query);
      return url.pathname + url.search;
    };

    res.render('products', {
      title: 'Productos',
      products: result.docs,
      pagination: {
        totalPages: result.totalPages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.hasPrevPage ? buildUrl(result.prevPage) : null,
        nextPage: result.hasNextPage ? buildUrl(result.nextPage) : null
      },
      query,
      sort
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Error', error: 'Error al cargar productos' });
  }
});


router.get('/products/:pid', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();
    if (!product) return res.status(404).render('error', { title: 'No encontrado', error: 'Producto no encontrado' });
    res.render('productDetail', { title: product.title, product });
  } catch (error) {
    res.status(500).render('error', { title: 'Error', error: 'Error al cargar el producto' });
  }
});


router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.status(404).render('error', { title: 'No encontrado', error: 'Carrito no encontrado' });
    res.render('cart', { title: 'Mi Carrito', cart });
  } catch (error) {
    res.status(500).render('error', { title: 'Error', error: 'Error al cargar el carrito' });
  }
});

export default router;