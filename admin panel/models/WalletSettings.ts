import mongoose from 'mongoose'

const WalletSettingsSchema = new mongoose.Schema({
  pointsPerRupee: { type: Number, required: true, default: 2 },
  minRedeemPoints: { type: Number, default: 100 },
  referralPoints: { type: Number, default: 50 },
  signupBonusPoints: { type: Number, default: 25 },
  orderCompletionPoints: { type: Number, default: 10 },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.models.WalletSettings || mongoose.model('WalletSettings', WalletSettingsSchema)
