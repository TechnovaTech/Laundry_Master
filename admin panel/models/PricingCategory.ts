import { Schema, model, models } from 'mongoose';

const PricingCategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export default models.PricingCategory || model('PricingCategory', PricingCategorySchema);
