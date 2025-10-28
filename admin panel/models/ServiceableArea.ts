import mongoose from 'mongoose'

const ServiceableAreaSchema = new mongoose.Schema({
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  area: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.ServiceableArea || mongoose.model('ServiceableArea', ServiceableAreaSchema)