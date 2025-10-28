import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
  hub: { type: String },
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'reached_location', 'picked_up', 'delivered_to_hub', 'processing', 'ironing', 'process_completed', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  pickupAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  pickupSlot: {
    date: Date,
    timeSlot: String
  },
  deliverySlot: {
    date: Date,
    timeSlot: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: String,
  specialInstructions: String,
  pickupPhotos: [String],
  pickupNotes: String,
  issue: String,
  issueReportedAt: Date,
  reachedLocationAt: Date,
  pickedUpAt: Date,
  deliveredToHubAt: Date,
  hubApprovedAt: Date,
  ironingAt: Date,
  processCompletedAt: Date,
  outForDeliveryAt: Date,
  deliveredAt: Date,
  statusHistory: [{
    status: String,
    timestamp: Date,
    updatedBy: String
  }],
  reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)