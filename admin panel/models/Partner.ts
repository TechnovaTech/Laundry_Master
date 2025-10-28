import mongoose from 'mongoose'

// Clear any existing model
if (mongoose.models.Partner) {
  delete mongoose.models.Partner;
}

const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, sparse: true },
  email: { type: String, unique: true, sparse: true },
  profileImage: { type: String },
  profilePicture: { type: String },
  isGoogleUser: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },
  vehicleNumber: String,
  vehicleType: String,
  aadharNumber: String,
  panNumber: String,
  drivingLicenseNumber: String,
  aadharImage: String,
  drivingLicenseImage: String,
  kycStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  kycRejectionReason: String,
  kycSubmittedAt: Date,
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    branch: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  totalDeliveries: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  currentOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.models.Partner || mongoose.model('Partner', PartnerSchema)