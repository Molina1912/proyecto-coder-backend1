import { Router } from 'express';
import {
  getCartById,
  removeProductFromCart,
  updateCart,
  updateProductQuantity,
  clearCart
} from '../controllers/carts.controller.js';

const router = Router();

router.get('/:cid', getCartById);
router.delete('/:cid/products/:pid', removeProductFromCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid', clearCart);

export default router;