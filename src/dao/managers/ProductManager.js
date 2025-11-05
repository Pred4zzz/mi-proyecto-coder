import Product from '../../models/product.model.js';

export default class ProductManager {
  async getProducts(filter = {}, options = { limit:10, page:1, sort:{} }) {
    const l = parseInt(options.limit) || 10;
    const p = Math.max(parseInt(options.page) || 1,1);
    const sortOpt = options.sort || {};
    const totalDocs = await Product.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(totalDocs / l), 1);
    const skip = (p - 1) * l;
    const products = await Product.find(filter).sort(sortOpt).skip(skip).limit(l).lean();
    return { products, totalDocs, totalPages };
  }

  async createProduct(data) {
    return Product.create(data);
  }

  async getById(id) {
    return Product.findById(id);
  }

  async update(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return Product.findByIdAndDelete(id);
  }
}
