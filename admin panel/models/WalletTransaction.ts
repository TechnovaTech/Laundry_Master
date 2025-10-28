import mongoose from 'mongoose'

const WalletTransactionSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  type: { type: String, enum: ['balance', 'points'], required: true },
  action: { type: String, enum: ['increase', 'decrease'], required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  previousValue: { type: Number, required: true },
  newValue: { type: Number, required: true },
  adjustedBy: { type: String, default: 'Admin' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.WalletTransaction || mongoose.model('WalletTransaction', WalletTransactionSchema)
