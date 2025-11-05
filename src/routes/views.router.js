import { Router } from 'express';
import Product from '../models/product.model.js';
import Cart from '../models/cart.model.js';
import mongoose from 'mongoose';

const router = Router();

router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = query ? { category: query } : {};
    const sortOpt = sort ? { price: sort === 'asc' ? 1 : -1 } : {};
    const total = await Product.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const p = Math.max(parseInt(page),1);
    const products = await Product.find(filter).sort(sortOpt).skip((p-1)*limit).limit(parseInt(limit)).lean();
    res.render('products', { products, page: p, totalPages, hasPrevPage: p>1, hasNextPage: p<totalPages });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await Product.find({}).lean();
    res.render('realtimeproducts', { products });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(pid)) return res.status(400).send('Invalid id');
    const product = await Product.findById(pid).lean();
    if (!product) return res.status(404).send('Not found');
    res.render('productDetail', { product });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid)) return res.status(400).send('Invalid id');
    const cart = await Cart.findById(cid).populate('products.product').lean();
    if (!cart) return res.status(404).send('Not found');
    res.render('cart', { cart });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

export default router;
