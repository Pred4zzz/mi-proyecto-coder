import { Router } from 'express';
import CartManager from '../dao/managers/CartManager.js';
import mongoose from 'mongoose';

const router = Router();
const manager = new CartManager();

router.post('/', async (req, res) => {
  try {
    const newCart = await manager.createCart();
    res.status(201).json(newCart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status:'error', error:'Server error' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    if(!mongoose.Types.ObjectId.isValid(cid)) return res.status(400).json({ status:'error', error:'Invalid id' });
    const cart = await manager.getCart(cid);
    if(!cart) return res.status(404).json({ status:'error', error:'Cart not found' });
    res.json({ status:'success', payload: cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status:'error', error:'Server error' });
  }
});

// POST 
router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await manager.addProduct(cid, pid);
    if (!updatedCart) {
      return res.status(404).json({ status: 'error', error: 'Cart or product not found' });
    }
    res.json({ status: 'success', payload: updatedCart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: 'Server error' });
  }
});


// DELETE 
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const populated = await manager.deleteProduct(cid, pid);
    if(!populated) return res.status(404).json({ status:'error', error:'Cart or product not found' });
    res.json({ status:'success', payload: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status:'error', error:'Server error' });
  }
});

// PUT 
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body.products;
    if (!Array.isArray(products)) return res.status(400).json({ status:'error', error:'products must be an array' });
    const cart = await manager.updateProducts(cid, products);
    res.json({ status:'success', payload: cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status:'error', error:'Server error' });
  }
});

// PUT 
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const updated = await manager.updateQuantity(cid, pid, quantity);
    if(!updated) return res.status(404).json({ status:'error', error:'Not found' });
    res.json({ status:'success', payload: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status:'error', error:'Server error' });
  }
});

// DELETE ALL
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await manager.emptyCart(cid);
    if(!cart) return res.status(404).json({ status:'error', error:'Cart not found' });
    res.json({ status:'success', payload: cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status:'error', error:'Server error' });
  }
});

export default router;
