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
    console.error('Error al cargar productos:', error);
    res.status(500).render('error', { title: 'Error', error: 'Error al cargar productos' });
  }
});


router.get('/products/:pid', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();
    if (!product) {
      return res.status(404).render('error', { title: 'No encontrado', error: 'Producto no encontrado' });
    }
    res.render('productDetail', { title: product.title, product });
  } catch (error) {
    console.error('Error al cargar el producto:', error);
    res.status(500).render('error', { title: 'Error', error: 'Error al cargar el producto' });
  }
});


router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products.product');
    if (!cart) {
      return res.status(404).render('error', { title: 'No encontrado', error: 'Carrito no encontrado' });
    }

    
    let total = 0;
    for (const item of cart.products) {
      if (item.product && item.product.price) {
        total += item.product.price * item.quantity;
      }
    }

    const cartData = cart.toObject({ getters: true });
    cartData.total = total;

    res.render('cart', { title: 'Mi Carrito', cart: cartData });
  } catch (error) {
    console.error('Error al cargar el carrito:', error);
    res.status(500).render('error', { title: 'Error', error: 'Error al cargar el carrito' });
  }
});


router.post('/carts/add', async (req, res) => {
  try {
    const { productId } = req.body;

    const productExists = await ProductModel.findById(productId);
    if (!productExists) {
      return res.status(404).send('Producto no encontrado');
    }

    let cart = await CartModel.findOne();
    if (!cart) {
      const newCart = new CartModel({ products: [] });
      cart = await newCart.save();
    }

    const existingProduct = cart.products.find(p => p.product.toString() === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    cart.markModified('products');
    await cart.save();
    res.redirect(`/carts/${cart._id}`);
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).send('Error al agregar al carrito');
  }
});


router.post('/carts/:cid/remove', async (req, res) => {
  try {
    const { cid } = req.params;
    const { productId } = req.body;

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    const initialLength = cart.products.length;
    cart.products = cart.products.filter(p => p.product.toString() !== productId);

    if (cart.products.length === initialLength) {
      return res.status(404).send('Producto no encontrado en el carrito');
    }

    await cart.save();
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    res.status(500).send('Error al eliminar del carrito');
  }
});


router.get('/carts', async (req, res) => {
  try {
    const cart = await CartModel.findOne().sort({ createdAt: -1 });
    if (cart) {
      return res.redirect(`/carts/${cart._id}`);
    } else {
      const newCart = new CartModel({ products: [] });
      const savedCart = await newCart.save();
      return res.redirect(`/carts/${savedCart._id}`);
    }
  } catch (error) {
    console.error('Error al acceder al carrito:', error);
    res.status(500).render('error', { 
      title: 'Error', 
      error: 'No se pudo cargar el carrito' 
    });
  }
});

export default router;