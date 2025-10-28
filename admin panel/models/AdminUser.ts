import { Schema, model, models } from 'mongoose';

const AdminUserSchema = new Schema({
  username: { type: String },
  role: { type: String, required: true, enum: ['Admin', 'Store Manager'] },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  hub: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

export default models.AdminUser || model('AdminUser', AdminUserSchema);
