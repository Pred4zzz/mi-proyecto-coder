import Cart from '../../models/cart.model.js';
import mongoose from 'mongoose';

export default class CartManager {
  async createCart() {
    return Cart.create({ products: [] });
  }
  async getCart(cid) {
    if(!mongoose.Types.ObjectId.isValid(cid)) return null;
    return Cart.findById(cid).populate('products.product');
  }
  async addProduct(cid, pid) {
    const cart = await Cart.findById(cid);
    if(!cart) return null;
    const item = cart.products.find(p => p.product.toString() === pid);
    if(item) item.quantity += 1;
    else cart.products.push({ product: pid, quantity: 1 });
    await cart.save();
    return Cart.findById(cid).populate('products.product');
  }
  async updateProducts(cid, products) {
    return Cart.findByIdAndUpdate(cid, { products }, { new: true, upsert: true }).populate('products.product');
  }
  async updateQuantity(cid, pid, quantity) {
    const cart = await Cart.findById(cid);
    if(!cart) return null;
    const item = cart.products.find(p => p.product.toString() === pid);
    if(!item) return null;
    item.quantity = quantity;
    await cart.save();
    return Cart.findById(cid).populate('products.product');
  }
  async deleteProduct(cid, pid) {
    const cart = await Cart.findById(cid);
    if(!cart) return null;
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    return Cart.findById(cid).populate('products.product');
  }
  async emptyCart(cid) {
    const cart = await Cart.findById(cid);
    if(!cart) return null;
    cart.products = [];
    await cart.save();
    return cart;
  }
}
