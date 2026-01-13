// src/controllers/carts.controller.js
import { CartModel } from '../models/cart.model.js';
import { ProductModel } from '../models/product.model.js';

// GET /:cid → con populate (concepto clave de Unidad 9)
export const getCartById = async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products.product');
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// DELETE /:cid/products/:pid
export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const result = await CartModel.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: pid } } },
      { new: true }
    );
    if (!result) {
      return res.status(404).json({ error: 'Carrito o producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

// PUT /:cid → reemplazar todo el carrito
export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body; // [{ product: "id1", quantity: 2 }, ...]

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'El campo "products" debe ser un arreglo' });
    }

    // Validar que todos los productos existan
    for (const item of products) {
      const exists = await ProductModel.exists({ _id: item.product });
      if (!exists) {
        return res.status(400).json({ error: `Producto ${item.product} no existe` });
      }
    }

    const updatedCart = await CartModel.findByIdAndUpdate(
      cid,
      { products },
      { new: true, runValidators: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(updatedCart);
  } catch (error) {
    console.error('Error al actualizar carrito:', error);
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
};

// PUT /:cid/products/:pid → actualizar cantidad
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser un número mayor a 0' });
    }

    const cart = await CartModel.findOneAndUpdate(
      { _id: cid, 'products.product': pid },
      { $set: { 'products.$.quantity': quantity } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ error: 'Carrito o producto no encontrado' });
    }

    res.json({ message: 'Cantidad actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    res.status(500).json({ error: 'Error al actualizar la cantidad' });
  }
};

// DELETE /:cid → vaciar carrito
export const clearCart = async (req, res) => {
  try {
    const result = await CartModel.findByIdAndUpdate(
      req.params.cid,
      { products: [] },
      { new: true }
    );
    if (!result) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json({ message: 'Carrito vaciado exitosamente' });
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
};