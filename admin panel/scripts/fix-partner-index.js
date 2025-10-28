const { MongoClient } = require('mongodb');

async function fixPartnerIndex() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('laundry');
    const collection = db.collection('partners');
    
    // Drop the unique index on mobile field
    try {
      await collection.dropIndex('mobile_1');
      console.log('✅ Dropped unique index on partner mobile field');
    } catch (error) {
      console.log('Partner mobile index may not exist:', error.message);
    }
    
    // Create a new non-unique sparse index
    await collection.createIndex({ mobile: 1 }, { sparse: true });
    console.log('✅ Created new sparse index on partner mobile field');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixPartnerIndex();