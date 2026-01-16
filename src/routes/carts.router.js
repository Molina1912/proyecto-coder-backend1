import { Router } from 'express';
import { CartModel } from '../models/cart.model.js';
import { ProductModel } from '../models/product.model.js';

const router = Router();


router.post('/', async (req, res) => {
  try {
    const newCart = new CartModel({ products: [] });
    await newCart.save();
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    console.error('Error al crear carrito:', error);
    res.status(500).json({ status: 'error', error: 'Error al crear carrito' });
  }
});


router.get('/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products.product');
    if (!cart) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ status: 'error', error: 'Error al obtener carrito' });
  }
});


router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const product = await ProductModel.findById(pid);
    if (!product) {
      return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }

    const existingProduct = cart.products.find(p => p.product.toString() === pid);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json({ status: 'success', message: 'Producto agregado al carrito', cart });
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ status: 'error', error: 'Error al agregar producto al carrito' });
  }
});


router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ status: 'error', error: 'El campo "products" debe ser un arreglo' });
    }

    
    for (const item of products) {
      if (!item.product || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return res.status(400).json({ status: 'error', error: 'Cada producto debe tener "product" (ID) y "quantity" (> 0)' });
      }
    }

    const updatedCart = await CartModel.findByIdAndUpdate(
      cid,
      { products },
      { new: true, runValidators: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }

    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    console.error('Error al reemplazar carrito:', error);
    res.status(500).json({ status: 'error', error: 'Error al reemplazar carrito' });
  }
});


router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ status: 'error', error: 'La cantidad debe ser un número mayor a 0' });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', error: 'Producto no encontrado en el carrito' });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.json({ status: 'success', message: 'Cantidad actualizada', cart });
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    res.status(500).json({ status: 'error', error: 'Error al actualizar cantidad' });
  }
});


router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }

    const initialLength = cart.products.length;
    cart.products = cart.products.filter(p => p.product.toString() !== pid);

    if (cart.products.length === initialLength) {
      return res.status(404).json({ status: 'error', error: 'Producto no encontrado en el carrito' });
    }

    await cart.save();
    res.json({ status: 'success', message: 'Producto eliminado del carrito', cart });
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ status: 'error', error: 'Error al eliminar producto del carrito' });
  }
});


router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }

    cart.products = [];
    await cart.save();

    res.json({ status: 'success', message: 'Carrito vaciado', cart });
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    res.status(500).json({ status: 'error', error: 'Error al vaciar carrito' });
  }
});

export default router;