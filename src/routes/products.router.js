import { Router } from 'express';
import Product from '../models/product.model.js';

const router = Router();

router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  const filter = query ? { category: query } : {};
  const options = { limit: parseInt(limit), skip: (page - 1) * limit, sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {} };
  const products = await Product.find(filter, null, options);
  res.json({ status: 'success', payload: products });
});

router.post('/', async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json(newProduct);
});

router.get('/:pid', async (req, res) => {
  const product = await Product.findById(req.params.pid);
  res.json(product);
});

router.put('/:pid', async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
  res.json(updated);
});

router.delete('/:pid', async (req, res) => {
  await Product.findByIdAndDelete(req.params.pid);
  res.json({ message: 'Producto eliminado' });
});

export default router;
