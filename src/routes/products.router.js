import { Router } from 'express';
import ProductManager from '../dao/managers/ProductManager.js';

const router = Router();
const manager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = query ? { category: query } : {};
    const l = parseInt(limit) || 10;
    const p = Math.max(parseInt(page) || 1,1);
    const sortOpt = sort ? { price: sort === 'asc' ? 1 : -1 } : {};
    const result = await manager.getProducts(filter, { limit: l, page: p, sort: sortOpt });
    const products = result.products;
    const totalDocs = result.totalDocs;
    const totalPages = result.totalPages;
    const hasPrevPage = p > 1 && p <= totalPages;
    const hasNextPage = p < totalPages;
    const prevPage = hasPrevPage ? p - 1 : null;
    const nextPage = hasNextPage ? p + 1 : null;
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
    const qsPrev = new URLSearchParams({ ...req.query, page: prevPage ?? '' }).toString().replace('page=&','');
    const qsNext = new URLSearchParams({ ...req.query, page: nextPage ?? '' }).toString().replace('page=&','');
    const prevLink = hasPrevPage ? `${baseUrl}?${qsPrev}` : null;
    const nextLink = hasNextPage ? `${baseUrl}?${qsNext}` : null;
    res.json({ status: 'success', payload: products, totalPages, prevPage, nextPage, page: p, hasPrevPage, hasNextPage, prevLink, nextLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = await manager.createProduct(req.body);
    try { const io = req.app.get('io'); if(io) io.emit('productAdded', newProduct); } catch(e){}
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: 'Server error' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await manager.getById(req.params.pid);
    if(!product) return res.status(404).json({ status:'error', error:'Not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: 'Server error' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const updated = await manager.update(req.params.pid, req.body);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: 'Server error' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    await manager.delete(req.params.pid);
    try { const io = req.app.get('io'); if(io) io.emit('productDeleted', { id: req.params.pid }); } catch(e){}
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: 'Server error' });
  }
});

export default router;
