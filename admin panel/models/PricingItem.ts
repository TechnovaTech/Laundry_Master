import mongoose from 'mongoose';

const PricingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    default: 'All'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

if (mongoose.models.PricingItem) {
  delete mongoose.models.PricingItem;
}

export default mongoose.model('PricingItem', PricingItemSchema);