import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  code: String,
  stock: Number,
  category: String,
  status: { type: Boolean, default: true }
});

export default mongoose.model('Product', productSchema);
