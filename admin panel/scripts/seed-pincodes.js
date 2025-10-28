const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/laundry';

const ServiceableAreaSchema = new mongoose.Schema({
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  area: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const ServiceableArea = mongoose.models.ServiceableArea || mongoose.model('ServiceableArea', ServiceableAreaSchema);

async function seedPincodes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const testPincodes = [
      { state: 'Delhi', city: 'New Delhi', pincode: '110001', area: 'Connaught Place' },
      { state: 'Delhi', city: 'New Delhi', pincode: '110002', area: 'Darya Ganj' },
      { state: 'Mumbai', city: 'Mumbai', pincode: '400001', area: 'Fort' },
      { state: 'Mumbai', city: 'Mumbai', pincode: '400002', area: 'Kalbadevi' },
      { state: 'Bangalore', city: 'Bangalore', pincode: '560001', area: 'Chickpet' },
      { state: 'Bangalore', city: 'Bangalore', pincode: '560002', area: 'Bangalore GPO' },
      { state: 'Test', city: 'Test City', pincode: '123456', area: 'Test Area' }
    ];

    for (const pincode of testPincodes) {
      await ServiceableArea.findOneAndUpdate(
        { pincode: pincode.pincode },
        pincode,
        { upsert: true, new: true }
      );
    }

    console.log('Test pincodes created successfully!');
    console.log('Available pincodes: 110001, 110002, 400001, 400002, 560001, 560002, 123456');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding pincodes:', error);
    process.exit(1);
  }
}

seedPincodes();