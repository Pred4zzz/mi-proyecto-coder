import { Router } from 'express';
import Cart from '../models/cart.model.js';

const router = Router();

router.post('/', async (req, res) => {
  const newCart = await Cart.create({ products: [] });
  res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate('products.product');
  res.json(cart);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cart = await Cart.findById(req.params.cid);
  const productIndex = cart.products.findIndex(p => p.product.toString() === req.params.pid);
  if (productIndex !== -1) cart.products[productIndex].quantity += 1;
  else cart.products.push({ product: req.params.pid });
  await cart.save();
  res.json(cart);
});

export default router;
