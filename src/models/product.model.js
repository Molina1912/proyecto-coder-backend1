import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, index: true },
  thumbnail: { type: String, default: '' },
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, index: true },
  status: { type: Boolean, default: true, index: true }
});


productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model('Product', productSchema);