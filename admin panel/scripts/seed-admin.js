const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/laundry';

const AdminUserSchema = new mongoose.Schema({
  username: { type: String },
  role: { type: String, required: true, enum: ['Admin', 'Store Manager'] },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  hub: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await AdminUser.findOneAndUpdate(
      { email: 'admin@laundry.com' },
      {
        username: 'Admin',
        email: 'admin@laundry.com',
        password: hashedPassword,
        role: 'Admin',
        mobile: '1234567890',
        address: 'Admin Office'
      },
      { upsert: true, new: true }
    );

    console.log('Admin user created successfully!');
    console.log('Email: admin@laundry.com');
    console.log('Password: admin123');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
